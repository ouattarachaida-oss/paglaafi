-- =============================================================================
-- PagLaafi : statut « Fermé » pour les centres (refonte du front-end)
-- L'admin du centre et ses docteurs peuvent l'indiquer comme les autres statuts
-- du jour ; les règles d'accès (RLS, déclencheurs) restent inchangées.
-- =============================================================================
alter type public.statut_centre add value if not exists 'closed';
