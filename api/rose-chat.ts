/**
 * Point d'entrée de fonction serverless Vercel (déploiement depuis la racine du dépôt).
 * Redirige vers le gestionnaire Rose IA de PagLaafi.
 *
 * Variables d'environnement requises (côté serveur Vercel uniquement) :
 * - GEMINI_API_KEY
 * - SUPABASE_SECRET_KEY
 */
export { POST } from "../artifacts/mockup-sandbox/api/rose-chat";
