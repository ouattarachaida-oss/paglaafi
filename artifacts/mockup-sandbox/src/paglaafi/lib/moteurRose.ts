import type { ContenuMultilingue, MedicalKnowledge } from "../types";
import { reglesReponsesRose, reponseFicheClinique, reponseParDefaut } from "../donnees/reponsesRose";

/**
 * Moteur de réponses de Rose IA en mode démo (mots-clés, sans IA).
 * Sera remplacé en phase 3 par l'appel à la fonction serveur /rose-chat (RAG).
 */

/** Minuscules sans accents, pour une recherche insensible à la casse et aux accents. */
export const normaliser = (texte: string) => texte.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Fiche clinique de docteur correspondant à la question, s'il y en a une. */
export function trouverFicheClinique(clean: string, fiches: MedicalKnowledge[]) {
  return fiches.find((k) => {
    const topicClean = normaliser(k.topic);
    const adviceClean = normaliser(k.advice);
    return (
      clean.includes("sanou") ||
      clean.includes("urgence") ||
      clean.includes("permanence") ||
      topicClean.split(" ").some((w) => w.length > 4 && clean.includes(w)) ||
      adviceClean.split(" ").some((w) => w.length > 5 && clean.includes(w))
    );
  });
}

/**
 * Réponse de Rose IA à une question, dans les 4 langues :
 * 1. une fiche clinique de docteur si elle correspond,
 * 2. sinon la première règle par mots-clés qui correspond,
 * 3. sinon une réponse générique.
 */
export function genererReponseRose(question: string, fiches: MedicalKnowledge[]): ContenuMultilingue {
  const clean = normaliser(question);
  const fiche = trouverFicheClinique(clean, fiches);
  if (fiche) return reponseFicheClinique(fiche);
  const regle = reglesReponsesRose.find((r) => r.motsCles.some((mot) => clean.includes(mot)));
  return regle ? regle.reponse : reponseParDefaut(question);
}
