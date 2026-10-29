/**
 * Point d'entrée de fonction serverless Vercel (déploiement depuis la racine du dépôt).
 * Redirige vers le gestionnaire de suppression de compte de PagLaafi.
 *
 * Variables d'environnement requises (côté serveur Vercel uniquement) :
 * - SUPABASE_SECRET_KEY
 */
export { POST } from "../artifacts/mockup-sandbox/api/supprimer-compte.js";
