-- =============================================================================
-- PagLaafi — Privilèges et Row Level Security (phase 2)
--
-- Règles métier (DOCUMENTATION.md, section 4) :
--   • seul le superadmin valide ou refuse les annonces et les adhésions ;
--   • seuls l'admin du centre et ses docteurs (et le superadmin) modifient un centre ;
--   • une annonce créée par un partenaire est toujours « en attente » ;
--   • chaque utilisatrice ne voit que son profil et ses rappels ;
--   • personne ne peut se donner un rôle depuis l'application.
-- =============================================================================

alter table public.profils enable row level security;
alter table public.centres enable row level security;
alter table public.associations enable row level security;
alter table public.annonces enable row level security;
alter table public.demandes_adhesion enable row level security;
alter table public.rappels enable row level security;

-- -----------------------------------------------------------------------------
-- Privilèges : on retire les droits par défaut puis on accorde le strict nécessaire
-- -----------------------------------------------------------------------------
revoke all on public.profils, public.centres, public.associations, public.annonces,
              public.demandes_adhesion, public.rappels
  from anon, authenticated;

grant select on public.centres, public.associations, public.annonces to anon, authenticated;
grant select on public.profils, public.demandes_adhesion, public.rappels to authenticated;

-- Profils : uniquement ses informations personnelles (jamais role / rattachement)
grant update (nom, prenom, telephone) on public.profils to authenticated;

-- Centres et associations : champs filtrés par les triggers proteger_*
grant insert, update, delete on public.centres to authenticated;
grant insert, update, delete on public.associations to authenticated;

grant insert, update, delete on public.annonces to authenticated;
grant insert on public.demandes_adhesion to authenticated;
grant insert, update, delete on public.rappels to authenticated;

-- -----------------------------------------------------------------------------
-- profils
-- -----------------------------------------------------------------------------
create policy "profils : lecture de son profil, tout pour le superadmin"
  on public.profils for select to authenticated
  using (id = (select auth.uid()) or public.est_superadmin());

create policy "profils : modification de son propre profil"
  on public.profils for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- -----------------------------------------------------------------------------
-- centres
-- -----------------------------------------------------------------------------
create policy "centres : lecture des centres vérifiés (et du sien)"
  on public.centres for select to anon, authenticated
  using (verifie or public.gere_centre(id) or public.est_superadmin());

create policy "centres : modification par son admin, ses docteurs ou le superadmin"
  on public.centres for update to authenticated
  using (public.gere_centre(id) or public.est_superadmin())
  with check (public.gere_centre(id) or public.est_superadmin());

create policy "centres : création par le superadmin"
  on public.centres for insert to authenticated
  with check (public.est_superadmin());

create policy "centres : suppression par le superadmin"
  on public.centres for delete to authenticated
  using (public.est_superadmin());

-- -----------------------------------------------------------------------------
-- associations
-- -----------------------------------------------------------------------------
create policy "associations : lecture des associations vérifiées (et de la sienne)"
  on public.associations for select to anon, authenticated
  using (verifiee or public.gere_association(id) or public.est_superadmin());

create policy "associations : modification par son admin ou le superadmin"
  on public.associations for update to authenticated
  using (public.gere_association(id) or public.est_superadmin())
  with check (public.gere_association(id) or public.est_superadmin());

create policy "associations : création par le superadmin"
  on public.associations for insert to authenticated
  with check (public.est_superadmin());

create policy "associations : suppression par le superadmin"
  on public.associations for delete to authenticated
  using (public.est_superadmin());

-- -----------------------------------------------------------------------------
-- annonces
-- -----------------------------------------------------------------------------
create policy "annonces : lecture des annonces publiées"
  on public.annonces for select to anon
  using (statut = 'publiee');

create policy "annonces : publiées, les siennes, ou toutes pour le superadmin"
  on public.annonces for select to authenticated
  using (statut = 'publiee' or auteur_id = (select auth.uid()) or public.est_superadmin());

create policy "annonces : création en attente par un partenaire"
  on public.annonces for insert to authenticated
  with check (
    auteur_id = (select auth.uid())
    and statut = 'en_attente'
    and public.role_actuel() in ('admin_centre', 'docteur', 'admin_association', 'superadmin')
  );

create policy "annonces : validation ou refus par le superadmin uniquement"
  on public.annonces for update to authenticated
  using (public.est_superadmin())
  with check (public.est_superadmin());

create policy "annonces : suppression par le superadmin ou par l'auteur tant qu'elle est en attente"
  on public.annonces for delete to authenticated
  using (public.est_superadmin() or (auteur_id = (select auth.uid()) and statut = 'en_attente'));

-- -----------------------------------------------------------------------------
-- demandes_adhesion (traitement : fonctions approuver_demande / refuser_demande)
-- -----------------------------------------------------------------------------
create policy "demandes : lecture des siennes, toutes pour le superadmin"
  on public.demandes_adhesion for select to authenticated
  using (demandeur_id = (select auth.uid()) or public.est_superadmin());

create policy "demandes : création pour soi-même, en attente"
  on public.demandes_adhesion for insert to authenticated
  with check (
    demandeur_id = (select auth.uid())
    and statut = 'en_attente'
    and traite_par is null
    and traite_le is null
    -- le rattachement est choisi par le superadmin à la validation, jamais par le demandeur
    and centre_id is null
    and association_id is null
  );

-- -----------------------------------------------------------------------------
-- rappels
-- -----------------------------------------------------------------------------
create policy "rappels : chaque utilisatrice gère uniquement les siens"
  on public.rappels for all to authenticated
  using (utilisatrice_id = (select auth.uid()))
  with check (utilisatrice_id = (select auth.uid()));
