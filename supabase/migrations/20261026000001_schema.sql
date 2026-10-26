-- =============================================================================
-- PagLaafi — Schéma de base (phase 2)
-- Profils et rôles, centres, associations, annonces, demandes d'adhésion, rappels.
-- Les règles d'accès (RLS) sont dans 20261026000003_rls.sql.
-- =============================================================================

-- Rôles applicatifs : attribués UNIQUEMENT côté serveur (voir fonctions).
create type public.role_utilisateur as enum (
  'utilisatrice',
  'admin_centre',
  'docteur',
  'admin_association',
  'superadmin'
);

-- Statut d'accueil d'un centre (mêmes valeurs que l'application)
create type public.statut_centre as enum ('available', 'busy', 'maintenance', 'outdated');

create type public.statut_annonce as enum ('en_attente', 'publiee', 'refusee');

create type public.statut_demande as enum ('en_attente', 'approuvee', 'refusee');

-- Type de structure demandé lors d'une adhésion
create type public.type_structure as enum ('centre', 'association', 'professionnel');

-- -----------------------------------------------------------------------------
-- Associations partenaires
-- -----------------------------------------------------------------------------
create table public.associations (
  id bigint generated always as identity primary key,
  nom text not null,
  sigle text,
  mission text,
  ville text,
  beneficiaires text,
  -- false tant que les informations n'ont pas été vérifiées auprès de l'association
  verifiee boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Centres de santé
-- -----------------------------------------------------------------------------
create table public.centres (
  id bigint generated always as identity primary key,
  -- Identité (modifiable par le superadmin uniquement)
  nom text not null,
  nom_court text not null,
  lieu text,
  ville text not null,
  adresse text,
  telephone text,
  lat double precision,
  lng double precision,
  -- Disponibilités du jour (modifiables par l'admin du centre et ses docteurs)
  statut public.statut_centre not null default 'outdated',
  statut_libelle text,
  appareil text,
  appareil_fonctionnel boolean not null default false,
  agents_presents integer not null default 0 check (agents_presents >= 0),
  description_personnel text,
  file_attente integer not null default 0 check (file_attente >= 0),
  attente_estimee text,
  -- Examens et tarifs : [{ "name", "price", "free", "notes" }]
  examens jsonb not null default '[]'::jsonb,
  visites_confirmees_jour integer not null default 0,
  -- Message audio du jour en 4 langues (+ MP3 validés à venir pour Mooré et Dioula)
  message_audio_fr text,
  message_audio_en text,
  message_audio_moore text,
  message_audio_dioula text,
  audio_url_moore text,
  audio_url_dioula text,
  -- false tant que les informations n'ont pas été vérifiées : le centre n'est pas affiché en mode réel
  verifie boolean not null default false,
  maj_par uuid references auth.users (id) on delete set null,
  maj_le timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Profils (un par compte Supabase Auth)
-- -----------------------------------------------------------------------------
create table public.profils (
  id uuid primary key references auth.users (id) on delete cascade,
  nom text not null default '',
  prenom text not null default '',
  telephone text,
  role public.role_utilisateur not null default 'utilisatrice',
  -- Rattachement (attribué par le superadmin lors de la validation d'une adhésion)
  centre_id bigint references public.centres (id) on delete set null,
  association_id bigint references public.associations (id) on delete set null,
  specialite text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profils_centre_idx on public.profils (centre_id);
create index profils_association_idx on public.profils (association_id);

-- -----------------------------------------------------------------------------
-- Annonces des partenaires (publiées après validation du superadmin)
-- -----------------------------------------------------------------------------
create table public.annonces (
  id bigint generated always as identity primary key,
  titre text not null check (length(titre) between 3 and 200),
  contenu text not null check (length(contenu) between 3 and 4000),
  ville text,
  date_evenement text,
  mois text,
  badge text,
  contact text,
  image_url text,
  image_legende text,
  -- Auteur (rempli automatiquement) et structure affichée
  auteur_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  auteur_nom text,
  type_auteur text,
  statut public.statut_annonce not null default 'en_attente',
  motif_refus text,
  valide_par uuid references auth.users (id) on delete set null,
  valide_le timestamptz,
  created_at timestamptz not null default now()
);

create index annonces_statut_idx on public.annonces (statut);
create index annonces_auteur_idx on public.annonces (auteur_id);

-- -----------------------------------------------------------------------------
-- Demandes d'adhésion des structures (traitées par le superadmin)
-- -----------------------------------------------------------------------------
create table public.demandes_adhesion (
  id bigint generated always as identity primary key,
  demandeur_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type_structure public.type_structure not null,
  nom_structure text not null check (length(nom_structure) between 2 and 200),
  ville text,
  telephone text,
  specialite text,
  responsable text,
  -- Structure existante à laquelle rattacher le demandeur (sinon une fiche est créée à la validation)
  centre_id bigint references public.centres (id) on delete set null,
  association_id bigint references public.associations (id) on delete set null,
  statut public.statut_demande not null default 'en_attente',
  motif_refus text,
  traite_par uuid references auth.users (id) on delete set null,
  traite_le timestamptz,
  created_at timestamptz not null default now()
);

create index demandes_statut_idx on public.demandes_adhesion (statut);
create index demandes_demandeur_idx on public.demandes_adhesion (demandeur_id);

-- -----------------------------------------------------------------------------
-- Rappels de santé (propres à chaque utilisatrice)
-- -----------------------------------------------------------------------------
create table public.rappels (
  id bigint generated always as identity primary key,
  utilisatrice_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  titre text not null check (length(titre) between 1 and 200),
  date_texte text not null,
  type text not null check (type in ('screening', 'appointment', 'treatment')),
  actif boolean not null default true,
  created_at timestamptz not null default now()
);

create index rappels_utilisatrice_idx on public.rappels (utilisatrice_id);
