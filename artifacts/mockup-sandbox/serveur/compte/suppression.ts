/**
 * Suppression du compte et de ses données (POST /api/supprimer-compte).
 *
 * - Connexion obligatoire : le compte supprimé est TOUJOURS celui du jeton
 *   vérifié (aucun identifiant n'est accepté dans la requête).
 * - Confirmation explicite exigée : { "confirmation": "SUPPRIMER" }.
 * - La suppression du compte Supabase Auth efface en cascade : profil, rappels,
 *   demandes d'adhésion, annonces, compteurs de Rose IA. Les fiches de
 *   connaissance proposées restent (sans nom d'auteur) : ce sont des contenus
 *   médicaux, pas des données personnelles.
 * - Nécessite la clé secrète : uniquement côté serveur.
 */
import type { Env } from "../rose/config.js";
import type { Fetch } from "../rose/gemini.js";

export const MOT_DE_CONFIRMATION = "SUPPRIMER";

const json = (statut: number, corps: unknown) =>
  new Response(JSON.stringify(corps), {
    status: statut,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

export async function traiterSuppression(requete: Request, env: Env, f: Fetch = fetch): Promise<Response> {
  if (requete.method !== "POST") return json(405, { code: "methode", message: "Méthode non autorisée." });

  const url = env.VITE_SUPABASE_URL?.replace(/\/$/, "");
  const clePublique = env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const cleSecrete = env.SUPABASE_SECRET_KEY;
  if (!url || !clePublique || !cleSecrete) {
    console.error("[supprimer-compte] configuration incomplète");
    return json(503, { code: "indisponible", message: "Suppression momentanément indisponible." });
  }

  const jeton = (requete.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!jeton) return json(401, { code: "non_connecte", message: "Connectez-vous pour supprimer votre compte." });

  let corps: { confirmation?: unknown };
  try {
    corps = await requete.json();
  } catch {
    return json(400, { code: "requete", message: "Requête invalide." });
  }
  if (corps.confirmation !== MOT_DE_CONFIRMATION) {
    return json(400, { code: "confirmation", message: `Confirmation requise : tapez ${MOT_DE_CONFIRMATION}.` });
  }

  try {
    // Identité vérifiée auprès de Supabase (le jeton doit être valide)
    const u = await f(`${url}/auth/v1/user`, { headers: { apikey: clePublique, Authorization: `Bearer ${jeton}` } });
    if (!u.ok) return json(401, { code: "non_connecte", message: "Session expirée : reconnectez-vous." });
    const { id } = (await u.json()) as { id?: string };
    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return json(401, { code: "non_connecte", message: "Session invalide." });

    // Suppression du compte (cascade sur les données en base)
    const r = await f(`${url}/auth/v1/admin/users/${id}`, {
      method: "DELETE",
      headers: { apikey: cleSecrete, Authorization: `Bearer ${cleSecrete}` },
    });
    if (!r.ok) throw new Error(`Suppression refusée (${r.status})`);
    return json(200, { supprime: true });
  } catch (e) {
    console.error(`[supprimer-compte] ${(e as Error).message}`);
    return json(503, { code: "indisponible", message: "La suppression a échoué. Réessayez plus tard." });
  }
}
