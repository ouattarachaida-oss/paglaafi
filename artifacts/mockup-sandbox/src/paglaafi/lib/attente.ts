/**
 * Niveau d'attente d'un centre, pour la couleur des marqueurs et des pastilles :
 * vert (file courte), orange (moyenne), rouge (longue), gris (inconnue),
 * gris foncé (fermé ou en panne). Calculé à partir du statut et de la file d'attente
 * déclarés par le centre.
 */
import type { HealthCenter } from "../types";

export type NiveauAttente = "court" | "moyen" | "long" | "inconnu" | "ferme";

export const NIVEAUX: Record<NiveauAttente, { libelle: string; couleur: string; texte: string }> = {
  court: { libelle: "Attente courte", couleur: "#1d9a5a", texte: "text-succes" },
  moyen: { libelle: "Attente moyenne", couleur: "#e08a00", texte: "text-attention" },
  long: { libelle: "Attente longue", couleur: "#d0302a", texte: "text-alerte" },
  inconnu: { libelle: "Attente inconnue", couleur: "#8a8f98", texte: "text-texte-2" },
  ferme: { libelle: "Fermé ou en panne", couleur: "#4b4f57", texte: "text-texte-2" },
};

export function niveauAttente(c: HealthCenter): NiveauAttente {
  if (c.status === "closed" || c.status === "maintenance") return "ferme";
  if (c.status === "outdated") return "inconnu";
  if (c.queueCount <= 5) return "court";
  if (c.queueCount <= 15) return "moyen";
  return "long";
}

/** « 4 personnes · ~15 min » (ou « Non renseignée »). */
export function resumeAttente(c: HealthCenter): string {
  if (niveauAttente(c) === "inconnu") return "Non renseignée";
  if (niveauAttente(c) === "ferme") return c.status === "closed" ? "Fermé aujourd'hui" : "Appareil en panne";
  const file = `${c.queueCount} personne${c.queueCount > 1 ? "s" : ""}`;
  return c.estimatedWait ? `${file} · ${c.estimatedWait}` : file;
}
