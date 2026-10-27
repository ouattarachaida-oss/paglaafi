/**
 * Contrôle de la réponse du modèle avant de la montrer.
 *
 * Le serveur ne fait pas confiance au modèle : les numéros de sources doivent
 * exister, une réponse sans source est refusée, et les formulations qui
 * ressemblent à un diagnostic ou à une prescription sont bloquées.
 */
import type { LangueReponse } from "./prompt";

export interface ReponseValidee {
  ok: boolean;
  reponse: string;
  sourcesUtilisees: number[];
  alerte: boolean;
  horsSujet: boolean;
  motifRejet?: string;
}

// Formulations interdites (diagnostic, prescription, posologie)
const INTERDITS: RegExp[] = [
  /\b(tu as|vous avez|c['’]est|il s['’]agit d['’]un|il s['’]agit d['’]une)\s+(un |une |le |la )?(cancer|tumeur|kyste|adénofibrome|endométriose|infection|mycose)\b/i,
  /\b(tu n['’]as|vous n['’]avez)\s+(pas|aucun)\s+(de\s+)?(cancer|tumeur|maladie)\b/i,
  /\b(ce n['’]est rien|ce n['’]est pas grave|ce n['’]est pas un cancer|rien de grave|pas de quoi s['’]inquiéter)\b/i,
  /\b\d+\s?(mg|milligrammes?|ml|comprimés?|gélules?)\b/i,
  /\b(prends|prenez|avale|avalez)\s+(du|de la|des|un|une)\s+\w+\s+(matin|soir|par jour|fois)/i,
  /\byou (have|don['’]t have) (a |an )?(cancer|tumou?r|cyst|infection)\b/i,
];

export function messagePrudent(langue: LangueReponse): string {
  return langue === "en"
    ? "I don't have validated information to answer this question. Please ask a health worker at your nearest health centre."
    : "Je n'ai pas d'information validée pour répondre à cette question. Le mieux est d'en parler à un soignant dans le centre de santé le plus proche.";
}

export function messageHorsSujet(langue: LangueReponse): string {
  return langue === "en"
    ? "I can only help with women's health, prevention and finding care. Feel free to ask me about those topics."
    : "Je peux seulement t'aider sur la santé des femmes, la prévention et l'orientation vers les soins. N'hésite pas à me poser une question sur ces sujets.";
}

export function validerReponse(brut: unknown, nombreSources: number, langue: LangueReponse): ReponseValidee {
  const rejet = (motif: string): ReponseValidee => ({
    ok: false,
    reponse: messagePrudent(langue),
    sourcesUtilisees: [],
    alerte: false,
    horsSujet: false,
    motifRejet: motif,
  });

  let objet: any = brut;
  if (typeof brut === "string") {
    try {
      objet = JSON.parse(brut);
    } catch {
      return rejet("réponse non JSON");
    }
  }
  if (!objet || typeof objet.reponse !== "string" || !Array.isArray(objet.sources_utilisees))
    return rejet("format inattendu");

  const alerte = objet.alerte === true;
  if (objet.hors_sujet === true) {
    return { ok: true, reponse: messageHorsSujet(langue), sourcesUtilisees: [], alerte, horsSujet: true };
  }

  const reponse = objet.reponse.trim();
  if (reponse.length < 10 || reponse.length > 1500) return rejet("longueur anormale");

  // Sources : entiers, présents dans la liste fournie, sans doublon
  const sources = [...new Set<number>(objet.sources_utilisees)].filter(
    (n) => Number.isInteger(n) && n >= 1 && n <= nombreSources,
  );
  if (sources.length === 0) return rejet("aucune source valide citée");
  if (sources.length !== objet.sources_utilisees.length) return rejet("source inexistante citée");

  if (INTERDITS.some((r) => r.test(reponse))) return rejet("formulation de diagnostic ou de prescription");

  return { ok: true, reponse, sourcesUtilisees: sources.sort((a, b) => a - b), alerte, horsSujet: false };
}
