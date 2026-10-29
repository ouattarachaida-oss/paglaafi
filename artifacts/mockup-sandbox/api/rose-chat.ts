/**
 * Fonction serverless Vercel : POST /api/rose-chat
 *
 * Les secrets (GEMINI_API_KEY, SUPABASE_SECRET_KEY) sont lus dans les variables
 * d'environnement du projet Vercel, côté serveur uniquement. Voir
 * docs/deploiement-vercel.md.
 */
import { traiterQuestion } from "../serveur/rose/gestionnaire.js";

export async function POST(request: Request): Promise<Response> {
  return traiterQuestion(request, process.env);
}
