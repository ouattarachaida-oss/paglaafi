import type { Section } from "./types";

/**
 * Routage de l'application (wouter).
 *
 * Chaque onglet a sa propre adresse : les liens directs, le bouton « Retour »
 * du téléphone et le rechargement de la page conservent l'onglet affiché.
 * La fiche d'un centre reste un état (centre sélectionné) affiché par-dessus l'onglet.
 */
export const CHEMINS: Record<Section, string> = {
  Accueil: "/",
  Centres: "/centres",
  Calendrier: "/cycle",
  Comprendre: "/comprendre",
  RoseIA: "/rose-ia",
  FaireUnDon: "/dons",
  Annonces: "/annonces",
  Accompagnant: "/accompagnant",
};

export const cheminDeSection = (section: Section): string => CHEMINS[section];

/** Onglet correspondant à une adresse ; toute adresse inconnue mène à l'Accueil. */
export function sectionDepuisChemin(chemin: string): Section {
  const trouvee = (Object.keys(CHEMINS) as Section[]).find((s) => CHEMINS[s] === chemin);
  return trouvee ?? "Accueil";
}

/**
 * Base du routeur : l'ancienne adresse d'aperçu de la maquette
 * (/preview/pinkhub-mvp/PinkHubMobile) reste fonctionnelle.
 */
const BASE_APERCU = "/preview/pinkhub-mvp/PinkHubMobile";

export function baseDuRouteur(): string {
  const baseVite = import.meta.env.BASE_URL.replace(/\/$/, "");
  const apercu = `${baseVite}${BASE_APERCU}`;
  return window.location.pathname.startsWith(apercu) ? apercu : baseVite;
}
