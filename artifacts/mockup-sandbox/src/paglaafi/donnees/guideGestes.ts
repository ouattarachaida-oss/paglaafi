/**
 * Guide des 4 gestes d'autopalpation.
 *
 * Les textes sont ceux qui figuraient déjà dans l'application (démonstration
 * d'autopalpation), repris tels quels. Ils n'existent qu'en français : aucune
 * traduction n'est générée ; l'interface affiche « Traduction à venir ».
 * ⚠️ Textes et schémas à faire relire par un soignant.
 */
import type { Versions } from "../composants/ui/Langue";

export interface GesteGuide {
  numero: 1 | 2 | 3 | 4;
  titre: Versions;
  texte: Versions;
  /** MP3 validés (à venir) */
  audioUrlMoore?: string;
  audioUrlDioula?: string;
}

export const GESTES: GesteGuide[] = [
  {
    numero: 1,
    titre: { fr: "Étape 1 : Inspection visuelle devant le miroir" },
    texte: {
      fr: "Debout devant votre miroir, bras le long du corps puis levés au-dessus de la tête. Observez l'aspect général des deux seins : peau d'orange, rougeur, fossette ou mamelon qui se rétracte vers l'intérieur.",
    },
  },
  {
    numero: 2,
    titre: { fr: "Étape 2 : Palpation douce avec la pulpe de 3 doigts" },
    texte: {
      fr: "Allongée confortablement ou sous la douche (avec du savon doux). Utilisez la pulpe des 3 doigts du milieu (index, majeur, annulaire) à plat. Décrivez de petits cercles réguliers du pourtour extérieur vers le mamelon.",
    },
  },
  {
    numero: 3,
    titre: { fr: "Étape 3 : Couvrir toute la zone jusqu'aux aisselles" },
    texte: {
      fr: "Le tissu mammaire s'étend jusqu'au creux de l'aisselle et sous la clavicule. Palpez soigneusement cette zone pour vérifier l'absence de ganglion dur ou de nodule profond.",
    },
  },
  {
    numero: 4,
    titre: { fr: "Étape 4 : Vérification du mamelon sans douleur" },
    texte: {
      fr: "Pincez très délicatement le mamelon entre le pouce et l'index. Vérifiez qu'aucun liquide (clair, jaunâtre ou sanglant) ne s'écoule spontanément.",
    },
  },
];

/**
 * Vraie vidéo validée (à venir). Tant que `videoUrl` est vide, aucun lecteur vidéo
 * n'est affiché : seul le guide est proposé.
 */
export const VIDEO_AUTOPALPATION: {
  videoUrl: string;
  affiche?: string;
  sousTitres?: { src: string; langue: string; libelle: string }[];
} = { videoUrl: "" };

/** Les schémas n'ont pas encore été relus par un soignant. */
export const SCHEMAS_VALIDES = false;
