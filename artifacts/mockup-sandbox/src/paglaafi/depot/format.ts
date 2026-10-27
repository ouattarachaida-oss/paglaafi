/** Formats d'affichage communs (convention du projet : JJ/MM/AAAA, fuseau GMT). */

const FUSEAU = "Africa/Ouagadougou"; // GMT toute l'année

/** « 26/10/2026 » */
export function dateCourte(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: FUSEAU,
  });
}

/** « 26/10/2026 à 09h05 » */
export function dateHeure(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const heure = d
    .toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: FUSEAU })
    .replace(":", "h");
  return `${dateCourte(iso)} à ${heure}`;
}

/** Mois courant au format des annonces : « Octobre 2026 » */
export function moisCourant(date = new Date()): string {
  const m = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric", timeZone: FUSEAU });
  return m.charAt(0).toUpperCase() + m.slice(1);
}
