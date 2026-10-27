/**
 * Repli hors-ligne de Rose IA : FAQ locale construite UNIQUEMENT à partir des
 * fiches validées (fichier public/faq-rose.json, généré par pnpm run rag:indexer
 * et mis en cache par le service worker).
 *
 * Recherche simple par mots-clés : pas d'IA, pas d'appel réseau une fois le
 * fichier en cache. Les signes d'alerte sont détectés comme côté serveur.
 */
import { detecterSignesAlerte, messageAlerte } from "../../../serveur/rose/alertes";

export interface FicheFaq {
  id: number;
  titre: string;
  contenu: string;
  langue: "fr" | "en" | "moore" | "dioula";
  groupe: string | null;
  source: string | null;
  url: string | null;
}

let cache: FicheFaq[] | null = null;

async function chargerFaq(): Promise<FicheFaq[]> {
  if (cache) return cache;
  try {
    const r = await fetch("/faq-rose.json", { cache: "force-cache" });
    cache = r.ok ? ((await r.json()).fiches as FicheFaq[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

const MOTS_VIDES = new Set(
  "le la les un une des de du d l et ou a au aux en est je tu il elle on nous vous ils elles mon ma mes ton ta tes son sa ses ce cet cette que qui quoi comment pourquoi quand est-ce estce pour par sur avec dans pas plus ne se si y the a an of to is i my you what how".split(" "),
);
const mots = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((m) => m.length > 2 && !MOTS_VIDES.has(m));

export interface ReponseFaq {
  texte: string;
  sources: Array<{ titre: string; source: string | null; url: string | null }>;
  alerte: boolean;
  /** Fiche validée en Mooré / Dioula correspondant au thème trouvé. */
  texteLangueLocale?: string;
}

/** Cherche la fiche validée la plus proche de la question (ou un message prudent). */
export async function repondreDepuisFaq(question: string, langue: "fr" | "en" | "moore" | "dioula", note?: string): Promise<ReponseFaq> {
  const fiches = await chargerFaq();
  const detection = detecterSignesAlerte(question);
  const langueTexte = langue === "en" ? "en" : "fr";
  const q = new Set(mots(question));

  let meilleure: FicheFaq | null = null;
  let score = 0;
  for (const f of fiches.filter((x) => x.langue === langueTexte)) {
    const s = mots(f.titre).filter((m) => q.has(m)).length * 2 + mots(f.contenu).filter((m) => q.has(m)).length;
    if (s > score) {
      score = s;
      meilleure = f;
    }
  }

  const entete = note ? `${note}\n\n` : "";
  const alerte = detection.alerte ? `${messageAlerte(langueTexte, detection.motifs)}\n\n` : "";
  const rappel =
    langueTexte === "en" ? "Rose AI does not replace a health worker." : "Rose IA ne remplace pas un soignant.";

  if (!meilleure || score < 2) {
    const prudent =
      langueTexte === "en"
        ? "I can't answer this question offline. If in doubt, go to your nearest health centre."
        : "Je ne peux pas répondre à cette question hors connexion. En cas de doute, rends-toi au centre de santé le plus proche.";
    return { texte: `${entete}${alerte}${prudent}\n\n${rappel}`, sources: [], alerte: detection.alerte };
  }

  const locale =
    (langue === "moore" || langue === "dioula") && meilleure.groupe
      ? fiches.find((f) => f.langue === langue && f.groupe === meilleure!.groupe)
      : undefined;
  const intro = langueTexte === "en" ? "Here is a validated sheet that may help:" : "Voici une fiche validée qui peut t'aider :";
  return {
    texte: `${entete}${alerte}${intro}\n« ${meilleure.titre} »\n${meilleure.contenu}\n\n${rappel}`,
    sources: [{ titre: meilleure.titre, source: meilleure.source, url: meilleure.url }],
    alerte: detection.alerte,
    texteLangueLocale: locale?.contenu,
  };
}
