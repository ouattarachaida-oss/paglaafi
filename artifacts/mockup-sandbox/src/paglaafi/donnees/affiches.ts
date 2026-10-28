/**
 * Affiches Octobre Rose 2026 transmises par l'équipe PagLaafi (images fournies).
 * Les textes reprennent uniquement ce qui est écrit sur chaque affiche : rien n'est ajouté.
 * Affichées dans le carrousel défilant de l'accueil et de l'onglet Annonces,
 * en mode démo comme en mode réel (ce ne sont pas des annonces publiées en base).
 */
export interface Affiche {
  id: string;
  image: string;
  titre: string;
  organisateur: string;
  /** Date et lieu tels qu'écrits sur l'affiche */
  quand: string;
  ou: string;
}

export const AFFICHES: Affiche[] = [
  {
    id: "bit",
    image: "/images/affiche-bit-depistage.webp",
    titre: "Dépistage gratuit : cancer du col de l'utérus et cancer du sein",
    organisateur: "Service médical du Burkina Institute of Technology (BIT)",
    quand: "28, 29 et 30 octobre 2026, 08h-16h",
    ou: "Campus BIT, infirmerie, Koudougou",
  },
  {
    id: "sisters-party",
    image: "/images/affiche-sisters-party-marche.webp",
    titre: "Marchons aujourd'hui pour un demain plus sain",
    organisateur: "Sisters Party",
    quand: "Samedi 31 octobre 2026, départ 6h00",
    ou: "Palais des sports",
  },
  {
    id: "gelpaz",
    image: "/images/affiche-gelpaz-aquapark.webp",
    titre: "Ensemble pour la santé des femmes !",
    organisateur: "GELPAZ IMMO-SA",
    quand: "Samedi 24 octobre 2026",
    ou: "Aqua-Park Ouaga, Ouaga 2000, Extension Sud",
  },
  {
    id: "noli",
    image: "/images/affiche-noli-octobre-rose.webp",
    titre: "La parenthèse des uniques : dépistage, sensibilisation, partages",
    organisateur: "NOLI et Lafya Check",
    quand: "25 octobre 2026, 15h00",
    ou: "Boutique NOLI",
  },
  {
    id: "ecobank",
    image: "/images/affiche-ecobank-ellever-rose.webp",
    titre: "Ellever Rose : journée de prévention et de dépistage des cancers féminins",
    organisateur: "Ecobank",
    quand: "Jeudi 22 octobre 2026, de 8h à 14h30",
    ou: "Siège Ecobank Burkina",
  },
  {
    id: "fondation-tapsoba",
    image: "/images/affiche-fondation-tapsoba.webp",
    titre: "Octobre Rose 2026",
    organisateur: "Fondation Edmond Tapsoba",
    quand: "Du 06 au 25 octobre 2026",
    ou: "Ouagadougou, Kombissiri, Sapouy",
  },
];
