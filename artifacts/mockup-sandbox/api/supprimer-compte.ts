/**
 * Fonction serverless Vercel : POST /api/supprimer-compte
 * Supprime le compte connecté et ses données (clé secrète côté serveur uniquement).
 */
import { traiterSuppression } from "../serveur/compte/suppression";

export async function POST(request: Request): Promise<Response> {
  return traiterSuppression(request, process.env);
}
