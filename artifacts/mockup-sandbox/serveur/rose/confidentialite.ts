/**
 * Masquage des données personnelles AVANT tout envoi au modèle.
 *
 * Le client n'envoie déjà que la question (jamais le profil, le cycle ou les
 * rappels). Ce masquage côté serveur est une seconde barrière, au cas où la
 * personne écrirait elle-même son nom, son téléphone ou son email.
 */

const REGLES: Array<{ type: string; motif: RegExp; remplacement: string }> = [
  // Adresses email
  { type: "email", motif: /[\w.+-]+@[\w-]+(\.[\w-]+)+/g, remplacement: "[email masqué]" },
  // Téléphones : +226 / 00226 suivis de 8 chiffres, ou 8 chiffres groupés (70 12 34 56, 70-12-34-56, 70123456)
  {
    type: "téléphone",
    motif: /(?:(?:\+|00)\s?226[\s.-]?)?(?<!\d)\d{2}(?:[\s.-]?\d{2}){3}(?!\d)/g,
    remplacement: "[téléphone masqué]",
  },
  // Autres longues suites de chiffres (identifiants, numéros de dossier…)
  { type: "numéro", motif: /(?<!\d)\d[\d\s.-]{8,}\d(?!\d)/g, remplacement: "[numéro masqué]" },
  // Dates précises (JJ/MM/AAAA, JJ-MM-AA…)
  { type: "date", motif: /\b\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}\b/g, remplacement: "[date masquée]" },
];

// Formules qui annoncent un nom (insensibles à la casse)
const ANNONCES_NOM = /\b(je m['’]appelle|mon nom est|mon nom c['’]est|mon prénom est|moi c['’]est|je suis madame|je suis mme|my name is|i am called)\s+/giu;
// Mots qui marquent la fin du nom
const MOTS_ARRET = new Set([
  "et", "j", "je", "j'ai", "j’ai", "mais", "donc", "car", "qui", "que", "avec", "depuis", "and", "i", "but", "de", "du", "la", "le", "ma", "mon",
]);

/** Masque jusqu'à 3 mots après une formule « je m'appelle… », en s'arrêtant aux mots usuels ou à la ponctuation. */
function masquerNoms(texte: string): { texte: string; trouve: boolean } {
  let trouve = false;
  const resultat = texte.replace(new RegExp(ANNONCES_NOM.source + "([^.,;:!?\\n]*)", "giu"), (_t, annonce: string, suite: string) => {
    const mots = suite.split(/\s+/);
    let n = 0;
    while (n < mots.length && n < 3 && mots[n] && !MOTS_ARRET.has(mots[n].toLowerCase())) n++;
    if (n === 0) return `${annonce} ${suite}`;
    trouve = true;
    return `${annonce} [nom masqué] ${mots.slice(n).join(" ")}`;
  });
  return { texte: resultat, trouve };
}

export interface ResultatMasquage {
  texte: string;
  /** Types de données masquées (jamais leur valeur). */
  masques: string[];
}

export function masquerDonneesPersonnelles(entree: string): ResultatMasquage {
  const masques = new Set<string>();
  let texte = entree;
  for (const { type, motif, remplacement } of REGLES) {
    texte = texte.replace(motif, () => {
      masques.add(type);
      return remplacement;
    });
  }
  const noms = masquerNoms(texte);
  if (noms.trouve) masques.add("nom");
  return { texte: noms.texte.replace(/\s{2,}/g, " ").trim(), masques: [...masques] };
}
