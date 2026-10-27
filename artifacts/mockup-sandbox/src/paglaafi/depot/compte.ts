import { client } from "../lib/supabase";

/**
 * Demande au serveur la suppression du compte connecté et de ses données en base
 * (profil, rappels, demandes d'adhésion, annonces, compteurs de Rose IA).
 * Le mot « SUPPRIMER » doit avoir été saisi par la personne.
 */
export async function supprimerMonCompte(confirmation: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const { data } = await client().auth.getSession();
  const jeton = data.session?.access_token;
  if (!jeton) return { ok: false, message: "Session expirée : reconnectez-vous puis recommencez." };
  try {
    const r = await fetch("/api/supprimer-compte", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${jeton}` },
      body: JSON.stringify({ confirmation }),
    });
    if (r.ok) return { ok: true };
    const corps = await r.json().catch(() => ({}));
    return { ok: false, message: corps.message ?? "La suppression a échoué. Réessayez plus tard." };
  } catch {
    return { ok: false, message: "Connexion au serveur impossible : la suppression n'a pas été faite." };
  }
}
