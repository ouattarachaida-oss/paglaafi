/**
 * Accès serveur à Supabase (REST) pour Rose IA.
 * - La vérification du jeton utilise la clé publique (comme le navigateur).
 * - Quota et recherche utilisent la clé secrète (fonctions réservées au serveur).
 */
import type { ConfigRose } from "./config";
import type { Fetch } from "./gemini";

export interface LigneRecherche {
  fiche_id: number;
  titre: string;
  morceau: string;
  source_titre: string | null;
  source_url: string | null;
  langue: string;
  groupe: string | null;
  similarite: number;
}

export interface FicheLocale {
  id: number;
  titre: string;
  contenu: string;
  source_titre: string | null;
  source_url: string | null;
  groupe: string | null;
}

const entetesServeur = (cfg: ConfigRose) => ({ apikey: cfg.cleSecrete, "Content-Type": "application/json" });

/** Identifiant de l'utilisateur connecté, ou null si le jeton est absent ou invalide. */
export async function verifierUtilisateur(f: Fetch, cfg: ConfigRose, jeton: string): Promise<string | null> {
  const r = await f(`${cfg.supabaseUrl}/auth/v1/user`, {
    headers: { apikey: cfg.clePublique, Authorization: `Bearer ${jeton}` },
  });
  if (!r.ok) return null;
  const u = await r.json();
  return typeof u?.id === "string" ? u.id : null;
}

/** Incrémente le compteur du jour ; faux si le quota est dépassé. */
export async function consommerQuota(f: Fetch, cfg: ConfigRose, utilisateur: string): Promise<boolean> {
  const r = await f(`${cfg.supabaseUrl}/rest/v1/rpc/consommer_quota_rose`, {
    method: "POST",
    headers: entetesServeur(cfg),
    body: JSON.stringify({ p_utilisateur: utilisateur, p_maximum: cfg.quotaJour }),
  });
  if (!r.ok) throw new Error(`Quota indisponible (${r.status})`);
  return (await r.json()) === true;
}

/** Morceaux de fiches validées les plus proches de la question. */
export async function rechercherFiches(f: Fetch, cfg: ConfigRose, embedding: number[]): Promise<LigneRecherche[]> {
  const r = await f(`${cfg.supabaseUrl}/rest/v1/rpc/rechercher_fiches`, {
    method: "POST",
    headers: entetesServeur(cfg),
    body: JSON.stringify({ p_embedding: `[${embedding.join(",")}]`, p_nombre: cfg.nombreSources }),
  });
  if (!r.ok) throw new Error(`Recherche indisponible (${r.status})`);
  return (await r.json()) as LigneRecherche[];
}

/** Fiches validées dans une langue locale (Mooré / Dioula) pour les thèmes trouvés. */
export async function fichesEnLangue(
  f: Fetch,
  cfg: ConfigRose,
  groupes: string[],
  langue: string,
): Promise<FicheLocale[]> {
  if (!groupes.length) return [];
  const filtre = groupes.map((g) => `"${g.replace(/"/g, "")}"`).join(",");
  const url =
    `${cfg.supabaseUrl}/rest/v1/fiches_connaissance?select=id,titre,contenu,source_titre,source_url,groupe` +
    `&statut=eq.validee&langue=eq.${encodeURIComponent(langue)}&groupe=in.(${encodeURIComponent(filtre)})`;
  const r = await f(url, { headers: entetesServeur(cfg) });
  if (!r.ok) return [];
  return (await r.json()) as FicheLocale[];
}
