/**
 * Détection de signes d'alerte, INDÉPENDANTE du modèle.
 *
 * Si la question évoque une situation potentiellement urgente, un message
 * d'orientation est toujours ajouté à la réponse, quoi que réponde le modèle.
 * Liste volontairement large (mieux vaut orienter à tort que ne pas orienter).
 * ⚠️ À faire relire par un soignant.
 */

const normaliser = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ");

// Chaque règle : tous les fragments d'un des groupes doivent être présents
const SIGNES: Array<{ motif: string; groupes: string[][] }> = [
  {
    motif: "saignement important",
    groupes: [["saign", "beaucoup"], ["saign", "abondant"], ["hemorrag"], ["perd", "sang"], ["sang", "mamelon"]],
  },
  {
    motif: "douleur intense",
    groupes: [
      ["douleur", "insupportable"],
      ["douleur", "intense"],
      ["douleur", "violente"],
      ["tres mal"],
      ["mal", "insupportable"],
    ],
  },
  {
    motif: "douleur dans la poitrine ou essoufflement",
    groupes: [
      ["douleur", "poitrine"],
      ["poitrine", "serre"],
      ["essouffl"],
      ["respire", "mal"],
      ["difficulte", "respirer"],
    ],
  },
  { motif: "fièvre élevée", groupes: [["fievre"], ["forte temperature"]] },
  {
    motif: "malaise ou perte de connaissance",
    groupes: [["evanoui"], ["perte de connaissance"], ["perdu connaissance"], ["malaise"]],
  },
  {
    motif: "masse qui évolue vite ou peau modifiée",
    groupes: [
      ["boule", "grossit"],
      ["boule", "grandit"],
      ["masse", "grossit"],
      ["peau d orange"],
      ["retract"],
      ["plaie", "sein"],
      ["sein", "rouge", "chaud"],
      ["ecoulement", "sang"],
    ],
  },
  {
    motif: "détresse psychologique",
    groupes: [["suicid"], ["me tuer"], ["en finir"], ["plus envie de vivre"], ["mourir", "envie"]],
  },
];

export interface DetectionAlerte {
  alerte: boolean;
  motifs: string[];
}

export function detecterSignesAlerte(question: string): DetectionAlerte {
  const t = normaliser(question);
  const motifs = SIGNES.filter(({ groupes }) => groupes.some((g) => g.every((f) => t.includes(f)))).map((s) => s.motif);
  return { alerte: motifs.length > 0, motifs };
}

/** Message d'orientation ajouté en tête de réponse (aucun numéro : numéros d'urgence encore à vérifier). */
export function messageAlerte(langue: "fr" | "en", motifs: string[]): string {
  const detresse = motifs.includes("détresse psychologique");
  if (langue === "en") {
    return detresse
      ? "⚠️ You are not alone. Please talk right now to someone you trust, a health worker, or go to the nearest emergency service."
      : "⚠️ What you describe may need urgent care. Please go to the nearest health centre or emergency service without waiting.";
  }
  return detresse
    ? "⚠️ Tu n'es pas seule. Parle dès maintenant à une personne de confiance, à un soignant, ou rends-toi aux urgences les plus proches."
    : "⚠️ Ce que tu décris peut nécessiter des soins rapides. Rends-toi sans attendre au centre de santé ou aux urgences les plus proches.";
}
