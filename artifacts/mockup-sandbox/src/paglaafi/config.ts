/**
 * Mode de fonctionnement de l'application.
 *
 * - Mode DÉMO (VITE_MODE_DEMO=true) : données fictives locales, 5 accès rapides,
 *   bandeau « Démo » visible. Aucun appel à Supabase. Pour la compétition.
 * - Mode RÉEL : comptes Supabase (email + mot de passe), rôles attribués côté
 *   serveur, données protégées par les règles RLS.
 *
 * Si Supabase n'est pas configuré (.env incomplet), l'application repasse en
 * mode démo plutôt que de planter.
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const cle = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const SUPABASE_CONFIGURE = Boolean(url && cle);
const DEMO_DEMANDE = import.meta.env.VITE_MODE_DEMO === "true";

export const MODE_DEMO = DEMO_DEMANDE || !SUPABASE_CONFIGURE;
export const MODE_REEL = !MODE_DEMO;

if (!DEMO_DEMANDE && !SUPABASE_CONFIGURE) {
  console.warn(
    "[PagLaafi] VITE_SUPABASE_URL ou VITE_SUPABASE_PUBLISHABLE_KEY manquant : repli en mode démo (voir artifacts/mockup-sandbox/.env.example).",
  );
}
