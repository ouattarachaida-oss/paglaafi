-- =============================================================================
-- PagLaafi — Rose IA réelle (phase 3) : fiches de connaissance validées + RAG
--
-- • Un docteur propose une fiche ; un validateur (superadmin ou docteur désigné)
--   la valide — jamais l'auteur lui-même (validation à quatre yeux).
-- • Une fiche ne peut être validée sans source ; toute modification de son
--   contenu la renvoie en attente et efface son index.
-- • Les embeddings (pgvector) ne sont lisibles que par le serveur (clé secrète).
-- =============================================================================

create extension if not exists vector with schema extensions;

-- -----------------------------------------------------------------------------
-- Docteurs validateurs (désignés par le superadmin)
-- -----------------------------------------------------------------------------
alter table public.profils add column peut_valider boolean not null default false;

-- La protection du profil couvre désormais aussi peut_valider
create or replace function public.proteger_profil()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if public.requete_client() and not public.est_superadmin()
     and (new.role, new.centre_id, new.association_id, new.peut_valider)
         is distinct from (old.role, old.centre_id, old.association_id, old.peut_valider) then
    raise exception 'Le rôle, le rattachement et la désignation de validateur ne peuvent être modifiés que par le superadmin'
      using errcode = '42501';
  end if;
  new.id := old.id;
  new.updated_at := now();
  return new;
end;
$$;

-- Vrai si l'utilisateur courant peut valider des fiches
create or replace function public.peut_valider_fiches()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.est_superadmin() or exists (
    select 1 from public.profils
     where id = (select auth.uid()) and role = 'docteur' and peut_valider
  );
$$;

-- -----------------------------------------------------------------------------
-- Fiches de connaissance
-- -----------------------------------------------------------------------------
create type public.statut_fiche as enum ('en_attente', 'validee', 'refusee');

create table public.fiches_connaissance (
  id bigint generated always as identity primary key,
  titre text not null check (length(trim(titre)) between 3 and 200),
  contenu text not null check (length(trim(contenu)) between 20 and 6000),
  langue text not null check (langue in ('fr', 'en', 'moore', 'dioula')),
  -- Regroupe les versions d'un même thème dans les différentes langues
  groupe text,
  theme text,
  -- Source officielle, saisie par le validateur (obligatoire pour valider)
  source_titre text,
  source_url text check (source_url is null or source_url ~ '^https://'),
  -- Suggestion de source pour les fiches initiales : À VÉRIFIER, jamais affichée comme source
  source_suggeree text,
  cle_origine text unique,
  auteur_id uuid default auth.uid() references auth.users (id) on delete set null,
  auteur_nom text,
  statut public.statut_fiche not null default 'en_attente',
  motif_refus text,
  valide_par uuid references auth.users (id) on delete set null,
  valide_le timestamptz,
  -- Date de la dernière indexation (null = pas encore utilisable par Rose IA)
  indexe_le timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint fiche_validee_sourcee check (statut <> 'validee' or length(trim(coalesce(source_titre, ''))) > 0)
);

create index fiches_statut_idx on public.fiches_connaissance (statut);
create index fiches_auteur_idx on public.fiches_connaissance (auteur_id);
create index fiches_groupe_idx on public.fiches_connaissance (groupe, langue);

-- Morceaux indexés (embeddings Gemini, 768 dimensions, normalisés)
create table public.fiches_morceaux (
  id bigint generated always as identity primary key,
  fiche_id bigint not null references public.fiches_connaissance (id) on delete cascade,
  ordre integer not null,
  contenu text not null,
  embedding extensions.vector(768) not null,
  modele text not null,
  created_at timestamptz not null default now()
);

create index fiches_morceaux_fiche_idx on public.fiches_morceaux (fiche_id);
create index fiches_morceaux_embedding_idx on public.fiches_morceaux
  using hnsw (embedding extensions.vector_cosine_ops);

-- Quota quotidien d'appels à Rose IA par compte (aucune question n'est enregistrée)
create table public.rose_quota (
  utilisateur_id uuid not null references auth.users (id) on delete cascade,
  jour date not null,
  nombre integer not null default 0,
  primary key (utilisateur_id, jour)
);

-- -----------------------------------------------------------------------------
-- Triggers des fiches
-- -----------------------------------------------------------------------------
create or replace function public.preparer_fiche()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.requete_client() then
    new.auteur_id := (select auth.uid());
    new.valide_par := null;
    new.valide_le := null;
    new.motif_refus := null;
    new.indexe_le := null;
    new.source_suggeree := null;
    new.cle_origine := null;
  end if;
  if new.auteur_id is not null then
    select nullif(trim(coalesce(prenom, '') || ' ' || coalesce(nom, '')), '')
      into new.auteur_nom from public.profils where id = new.auteur_id;
  end if;
  new.created_at := now();
  new.updated_at := now();
  return new;
end;
$$;

create trigger preparer_fiche_avant_insertion
  before insert on public.fiches_connaissance
  for each row execute function public.preparer_fiche();

create or replace function public.proteger_fiche()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  contenu_modifie boolean :=
    (new.titre, new.contenu, new.langue, new.groupe, new.source_titre, new.source_url)
    is distinct from (old.titre, old.contenu, old.langue, old.groupe, old.source_titre, old.source_url);
begin
  -- Champs immuables ou réservés au serveur
  new.id := old.id;
  new.created_at := old.created_at;
  if public.requete_client() then
    new.auteur_id := old.auteur_id;
    new.auteur_nom := old.auteur_nom;
    new.cle_origine := old.cle_origine;
    new.source_suggeree := old.source_suggeree;
    new.indexe_le := old.indexe_le;
  end if;

  if new.statut is distinct from old.statut then
    if public.requete_client() then
      if not public.peut_valider_fiches() then
        raise exception 'Seul un validateur peut changer le statut d''une fiche' using errcode = '42501';
      end if;
      if new.statut = 'validee' and old.auteur_id = (select auth.uid()) then
        raise exception 'Validation à quatre yeux : on ne valide pas sa propre fiche' using errcode = '42501';
      end if;
    end if;
    new.valide_par := (select auth.uid());
    new.valide_le := now();
    if new.statut <> 'refusee' then
      new.motif_refus := null;
    end if;
  elsif contenu_modifie and old.statut <> 'en_attente' then
    -- Fiche modifiée après validation ou refus : retour en relecture
    new.statut := 'en_attente';
    new.valide_par := null;
    new.valide_le := null;
  elsif public.requete_client() then
    new.valide_par := old.valide_par;
    new.valide_le := old.valide_le;
  end if;

  -- Contenu modifié ou fiche plus validée : l'index n'est plus valable
  if contenu_modifie or new.statut <> 'validee' then
    new.indexe_le := null;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger proteger_fiche_avant_maj
  before update on public.fiches_connaissance
  for each row execute function public.proteger_fiche();

-- Efface les morceaux indexés dès que l'index n'est plus valable
create or replace function public.purger_index_fiche()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.indexe_le is null then
    delete from public.fiches_morceaux where fiche_id = new.id;
  end if;
  return new;
end;
$$;

create trigger purger_index_fiche_apres_maj
  after update on public.fiches_connaissance
  for each row execute function public.purger_index_fiche();

-- -----------------------------------------------------------------------------
-- Fonctions du serveur (clé secrète uniquement)
-- -----------------------------------------------------------------------------

-- Recherche sémantique dans les fiches VALIDÉES et indexées
create or replace function public.rechercher_fiches(
  p_embedding extensions.vector(768),
  p_nombre integer default 4
)
returns table (
  fiche_id bigint,
  titre text,
  morceau text,
  source_titre text,
  source_url text,
  langue text,
  groupe text,
  similarite double precision
)
language sql
stable
security definer
set search_path = ''
as $$
  select f.id, f.titre, m.contenu, f.source_titre, f.source_url, f.langue, f.groupe,
         1 - (m.embedding operator(extensions.<=>) p_embedding) as similarite
    from public.fiches_morceaux m
    join public.fiches_connaissance f on f.id = m.fiche_id
   where f.statut = 'validee' and f.indexe_le is not null
   order by m.embedding operator(extensions.<=>) p_embedding
   limit least(greatest(p_nombre, 1), 10);
$$;

-- Incrémente le compteur du jour ; renvoie faux si le quota est dépassé
create or replace function public.consommer_quota_rose(p_utilisateur uuid, p_maximum integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_nombre integer;
begin
  insert into public.rose_quota (utilisateur_id, jour, nombre)
  values (p_utilisateur, (now() at time zone 'UTC')::date, 1)
  on conflict (utilisateur_id, jour) do update set nombre = public.rose_quota.nombre + 1
  returning nombre into v_nombre;
  return v_nombre <= p_maximum;
end;
$$;

-- Désignation d'un docteur validateur : superadmin uniquement
create or replace function public.designer_validateur(p_profil uuid, p_valeur boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.est_superadmin() then
    raise exception 'Action réservée au superadmin' using errcode = '42501';
  end if;
  update public.profils set peut_valider = p_valeur
   where id = p_profil and role = 'docteur';
  if not found then
    raise exception 'Seul un compte docteur peut être désigné validateur' using errcode = 'P0001';
  end if;
end;
$$;

-- Liste des docteurs (pour la désignation) : superadmin uniquement
create or replace function public.lister_docteurs()
returns table (id uuid, nom text, prenom text, specialite text, peut_valider boolean, structure text)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.est_superadmin() then
    raise exception 'Action réservée au superadmin' using errcode = '42501';
  end if;
  return query
    select p.id, p.nom, p.prenom, p.specialite, p.peut_valider, c.nom_court
      from public.profils p
      left join public.centres c on c.id = p.centre_id
     where p.role = 'docteur'
     order by p.nom, p.prenom;
end;
$$;

revoke execute on function public.rechercher_fiches(extensions.vector, integer) from public, anon, authenticated;
revoke execute on function public.consommer_quota_rose(uuid, integer) from public, anon, authenticated;
grant execute on function public.rechercher_fiches(extensions.vector, integer) to service_role;
grant execute on function public.consommer_quota_rose(uuid, integer) to service_role;
revoke execute on function public.designer_validateur(uuid, boolean) from public, anon;
revoke execute on function public.lister_docteurs() from public, anon;
grant execute on function public.designer_validateur(uuid, boolean) to authenticated;
grant execute on function public.lister_docteurs() to authenticated;

-- -----------------------------------------------------------------------------
-- Privilèges et RLS
-- -----------------------------------------------------------------------------
alter table public.fiches_connaissance enable row level security;
alter table public.fiches_morceaux enable row level security;
alter table public.rose_quota enable row level security;

revoke all on public.fiches_connaissance, public.fiches_morceaux, public.rose_quota from anon, authenticated;
grant select on public.fiches_connaissance to anon, authenticated;
grant insert, update, delete on public.fiches_connaissance to authenticated;
-- fiches_morceaux et rose_quota : aucun accès client (serveur uniquement)

create policy "fiches : lecture des fiches validées"
  on public.fiches_connaissance for select to anon
  using (statut = 'validee');

create policy "fiches : validées, les siennes, ou toutes pour un validateur"
  on public.fiches_connaissance for select to authenticated
  using (statut = 'validee' or auteur_id = (select auth.uid()) or public.peut_valider_fiches());

create policy "fiches : proposition en attente par un docteur ou le superadmin"
  on public.fiches_connaissance for insert to authenticated
  with check (
    auteur_id = (select auth.uid())
    and statut = 'en_attente'
    and public.role_actuel() in ('docteur', 'superadmin')
  );

create policy "fiches : modification par l'auteur ou un validateur"
  on public.fiches_connaissance for update to authenticated
  using (auteur_id = (select auth.uid()) or public.peut_valider_fiches())
  with check (auteur_id = (select auth.uid()) or public.peut_valider_fiches());

create policy "fiches : suppression par l'auteur (non validée) ou le superadmin"
  on public.fiches_connaissance for delete to authenticated
  using (public.est_superadmin() or (auteur_id = (select auth.uid()) and statut <> 'validee'));
