-- =============================================================================
-- PagLaafi — Fonctions, triggers et actions de modération (phase 2)
--
-- Principe : un rôle n'est JAMAIS attribué par le client. Le profil est créé
-- avec le rôle « utilisatrice » ; seul le superadmin peut ensuite le changer,
-- via approuver_demande(). Le premier superadmin est nommé hors application
-- (script supabase/scripts/promouvoir-superadmin.mjs).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Fonctions utilitaires (utilisées par les règles RLS)
-- SECURITY DEFINER : lisent le profil sans dépendre des règles RLS de profils.
-- -----------------------------------------------------------------------------

-- Vrai si la requête vient d'un client de l'application (clé publishable + JWT),
-- faux pour une connexion d'administration (scripts, tableau de bord, clé secrète).
create or replace function public.requete_client()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(auth.jwt() ->> 'role', '') in ('anon', 'authenticated');
$$;

create or replace function public.role_actuel()
returns public.role_utilisateur
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profils where id = (select auth.uid());
$$;

create or replace function public.est_superadmin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select role = 'superadmin' from public.profils where id = (select auth.uid())), false);
$$;

-- Vrai si l'utilisateur courant est admin ou docteur rattaché à ce centre
create or replace function public.gere_centre(p_centre bigint)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profils
     where id = (select auth.uid())
       and role in ('admin_centre', 'docteur')
       and centre_id = p_centre
  );
$$;

-- Vrai si l'utilisateur courant est l'admin de cette association
create or replace function public.gere_association(p_association bigint)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profils
     where id = (select auth.uid())
       and role = 'admin_association'
       and association_id = p_association
  );
$$;

-- -----------------------------------------------------------------------------
-- Création automatique du profil à l'inscription
-- Les métadonnées d'inscription peuvent contenir nom, prénom, téléphone et une
-- demande d'adhésion. Toute indication de rôle est IGNORÉE.
-- -----------------------------------------------------------------------------
create or replace function public.creer_profil()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  demande jsonb := meta -> 'demande_adhesion';
begin
  insert into public.profils (id, nom, prenom, telephone)
  values (
    new.id,
    left(coalesce(meta ->> 'nom', ''), 100),
    left(coalesce(meta ->> 'prenom', ''), 100),
    left(meta ->> 'telephone', 30)
  );

  if jsonb_typeof(demande) = 'object'
     and demande ->> 'type_structure' in ('centre', 'association', 'professionnel')
     and length(trim(coalesce(demande ->> 'nom_structure', ''))) >= 2 then
    insert into public.demandes_adhesion (demandeur_id, type_structure, nom_structure, ville, telephone, specialite, responsable)
    values (
      new.id,
      (demande ->> 'type_structure')::public.type_structure,
      left(trim(demande ->> 'nom_structure'), 200),
      left(demande ->> 'ville', 100),
      left(coalesce(demande ->> 'telephone', meta ->> 'telephone'), 30),
      left(demande ->> 'specialite', 100),
      left(trim(coalesce(meta ->> 'prenom', '') || ' ' || coalesce(meta ->> 'nom', '')), 200)
    );
  end if;
  return new;
end;
$$;

create trigger creer_profil_apres_inscription
  after insert on auth.users
  for each row execute function public.creer_profil();

-- -----------------------------------------------------------------------------
-- Protection des profils : rôle et rattachement modifiables par le superadmin seul
-- (deuxième barrière après les privilèges de colonnes)
-- -----------------------------------------------------------------------------
create or replace function public.proteger_profil()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if public.requete_client() and not public.est_superadmin()
     and (new.role, new.centre_id, new.association_id) is distinct from (old.role, old.centre_id, old.association_id) then
    raise exception 'Le rôle et le rattachement ne peuvent être modifiés que par le superadmin'
      using errcode = '42501';
  end if;
  new.id := old.id;
  new.updated_at := now();
  return new;
end;
$$;

create trigger proteger_profil_avant_maj
  before update on public.profils
  for each row execute function public.proteger_profil();

-- -----------------------------------------------------------------------------
-- Protection des centres : l'admin du centre et ses docteurs ne modifient que
-- les disponibilités ; identité et vérification réservées au superadmin.
-- -----------------------------------------------------------------------------
create or replace function public.proteger_centre()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if public.requete_client() and not public.est_superadmin()
     and (new.nom, new.nom_court, new.lieu, new.ville, new.adresse, new.telephone, new.lat, new.lng, new.verifie)
         is distinct from
         (old.nom, old.nom_court, old.lieu, old.ville, old.adresse, old.telephone, old.lat, old.lng, old.verifie) then
    raise exception 'Seul le superadmin peut modifier l''identité ou la vérification d''un centre'
      using errcode = '42501';
  end if;
  new.created_at := old.created_at;
  new.maj_le := now();
  new.maj_par := coalesce((select auth.uid()), old.maj_par);
  return new;
end;
$$;

create trigger proteger_centre_avant_maj
  before update on public.centres
  for each row execute function public.proteger_centre();

-- Associations : nom et vérification réservés au superadmin
create or replace function public.proteger_association()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if public.requete_client() and not public.est_superadmin()
     and (new.nom, new.verifiee) is distinct from (old.nom, old.verifiee) then
    raise exception 'Seul le superadmin peut modifier le nom ou la vérification d''une association'
      using errcode = '42501';
  end if;
  new.created_at := old.created_at;
  new.updated_at := now();
  return new;
end;
$$;

create trigger proteger_association_avant_maj
  before update on public.associations
  for each row execute function public.proteger_association();

-- -----------------------------------------------------------------------------
-- Annonces : auteur et nom de la structure renseignés automatiquement,
-- traçabilité de la modération.
-- -----------------------------------------------------------------------------
create or replace function public.preparer_annonce()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  p public.profils;
begin
  if public.requete_client() then
    new.auteur_id := (select auth.uid());
    new.valide_par := null;
    new.valide_le := null;
    new.motif_refus := null;
  end if;
  select * into p from public.profils where id = new.auteur_id;
  new.auteur_nom := coalesce(
    (select a.nom from public.associations a where a.id = p.association_id),
    (select c.nom_court from public.centres c where c.id = p.centre_id),
    nullif(trim(coalesce(p.prenom, '') || ' ' || coalesce(p.nom, '')), ''),
    'Structure partenaire'
  );
  new.type_auteur := case p.role
    when 'admin_association' then 'Association'
    when 'admin_centre' then 'Hôpital'
    else 'Partenaire Santé'
  end;
  new.created_at := now();
  return new;
end;
$$;

create trigger preparer_annonce_avant_insertion
  before insert on public.annonces
  for each row execute function public.preparer_annonce();

create or replace function public.tracer_moderation_annonce()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.statut is distinct from old.statut then
    new.valide_par := (select auth.uid());
    new.valide_le := now();
    if new.statut <> 'refusee' then
      new.motif_refus := null;
    end if;
  end if;
  new.auteur_id := old.auteur_id;
  new.auteur_nom := old.auteur_nom;
  new.created_at := old.created_at;
  return new;
end;
$$;

create trigger tracer_moderation_annonce_avant_maj
  before update on public.annonces
  for each row execute function public.tracer_moderation_annonce();

-- Demandes d'adhésion créées depuis l'application : nom du responsable renseigné
create or replace function public.preparer_demande()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.responsable is null then
    select nullif(trim(coalesce(prenom, '') || ' ' || coalesce(nom, '')), '')
      into new.responsable
      from public.profils where id = new.demandeur_id;
  end if;
  new.created_at := now();
  return new;
end;
$$;

create trigger preparer_demande_avant_insertion
  before insert on public.demandes_adhesion
  for each row execute function public.preparer_demande();

-- -----------------------------------------------------------------------------
-- Actions du superadmin sur les demandes d'adhésion
-- -----------------------------------------------------------------------------

-- Valide une demande : attribue le rôle et le rattachement. Le superadmin peut
-- rattacher le demandeur à un centre ou une association existants (p_centre,
-- p_association) ; sinon la fiche de la structure est créée, non vérifiée.
-- Le demandeur ne peut pas choisir lui-même son rattachement.
create or replace function public.approuver_demande(
  p_demande bigint,
  p_centre bigint default null,
  p_association bigint default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  d public.demandes_adhesion;
  v_centre bigint;
  v_association bigint;
  v_role public.role_utilisateur;
begin
  if not public.est_superadmin() then
    raise exception 'Action réservée au superadmin' using errcode = '42501';
  end if;

  select * into d from public.demandes_adhesion where id = p_demande for update;
  if not found then
    raise exception 'Demande introuvable' using errcode = 'P0002';
  end if;
  if d.statut <> 'en_attente' then
    raise exception 'Demande déjà traitée' using errcode = 'P0001';
  end if;

  v_centre := p_centre;
  v_association := p_association;

  if d.type_structure = 'centre' then
    v_role := 'admin_centre';
    if v_centre is null then
      insert into public.centres (nom, nom_court, ville, telephone)
      values (d.nom_structure, left(d.nom_structure, 60), coalesce(d.ville, 'Non précisée'), d.telephone)
      returning id into v_centre;
    end if;
  elsif d.type_structure = 'association' then
    v_role := 'admin_association';
    if v_association is null then
      insert into public.associations (nom, ville)
      values (d.nom_structure, d.ville)
      returning id into v_association;
    end if;
  else
    v_role := 'docteur';
  end if;

  update public.profils
     set role = v_role,
         centre_id = v_centre,
         association_id = v_association,
         specialite = coalesce(d.specialite, specialite)
   where id = d.demandeur_id;

  update public.demandes_adhesion
     set statut = 'approuvee',
         centre_id = v_centre,
         association_id = v_association,
         traite_par = (select auth.uid()),
         traite_le = now()
   where id = d.id;
end;
$$;

-- Refuse une demande (le compte reste « utilisatrice »)
create or replace function public.refuser_demande(p_demande bigint, p_motif text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.est_superadmin() then
    raise exception 'Action réservée au superadmin' using errcode = '42501';
  end if;
  update public.demandes_adhesion
     set statut = 'refusee',
         motif_refus = left(p_motif, 500),
         traite_par = (select auth.uid()),
         traite_le = now()
   where id = p_demande and statut = 'en_attente';
  if not found then
    raise exception 'Demande introuvable ou déjà traitée' using errcode = 'P0002';
  end if;
end;
$$;

-- -----------------------------------------------------------------------------
-- Droits d'exécution
-- -----------------------------------------------------------------------------
revoke execute on function public.creer_profil() from public, anon, authenticated;
revoke execute on function public.approuver_demande(bigint, bigint, bigint) from public, anon;
revoke execute on function public.refuser_demande(bigint, text) from public, anon;
grant execute on function public.approuver_demande(bigint, bigint, bigint) to authenticated;
grant execute on function public.refuser_demande(bigint, text) to authenticated;
