/**
 * Lecture audio des contenus :
 * - fichier MP3 validé (audioUrlMoore / audioUrlDioula) quand il existe, mis en cache
 *   par le service worker pour le hors-ligne ;
 * - sinon synthèse vocale de l'appareil, en français et en anglais seulement ;
 * - jamais de lecture du mooré ou du dioula avec une voix française : sans MP3,
 *   l'audio est indisponible dans ces langues.
 * Une seule lecture à la fois dans toute l'application.
 */
export type Langue = "fr" | "en" | "moore" | "dioula";

let arretEnCours: (() => void) | null = null;

/** Voix masculines à exclure formellement pour Rose IA */
const REGEX_VOIX_MASCULINE = /(male|homme|paul|claude|pierre|david|nicolas|jean|alain|george|guy|bernard|thomas|daniel|mark|stefan|cosimo|filip|mateo|riccardo)/i;

/** Voix féminines privilégiées sur Windows, iOS, macOS, Android et navigateurs */
const REGEX_VOIX_FEMININE = /(female|femme|fem|hortense|julie|celine|céline|amelie|amélie|virginie|marie|claire|audrey|aurelie|aurélie|charlotte|denise|samantha|siwis|zira|helena|victoria|karen|moira|fiona)/i;

/**
 * Sélectionne impérativement une voix FÉMININE pour Rose IA :
 * 1. Filtre par langue (fr ou en).
 * 2. Élimine formellement les voix masculines connues (Paul, Claude, Pierre, David, Thomas, etc.).
 * 3. Priorise les voix féminines reconnues (Hortense, Julie, Amélie, Céline, Virginie, Marie, Claire, etc.).
 */
export function trouverVoixFeminine(langue: Langue, voixDisponibles: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const codeLangue = langue === "en" ? "en" : "fr";
  const voixLangue = voixDisponibles.filter((v) => v.lang.toLowerCase().startsWith(codeLangue));
  if (voixLangue.length === 0) return undefined;

  // Voix installées localement si hors ligne
  const utilisables = typeof navigator !== "undefined" && !navigator.onLine ? voixLangue.filter((v) => v.localService) : voixLangue;
  const pool = utilisables.length > 0 ? utilisables : voixLangue;

  // 1. Voix avec nom explicitement féminin (ex: Microsoft Hortense, Julie, Amélie, etc.)
  const feminine = pool.find((v) => REGEX_VOIX_FEMININE.test(v.name) && !REGEX_VOIX_MASCULINE.test(v.name));
  if (feminine) return feminine;

  // 2. Première voix qui n'est pas masculine (évite Paul / Thomas)
  const nonMasculine = pool.find((v) => !REGEX_VOIX_MASCULINE.test(v.name));
  if (nonMasculine) return nonMasculine;

  // 3. Repli si aucune autre voix n'existe
  return pool[0];
}

export const voixPour = (langue: Langue): SpeechSynthesisVoice | undefined => {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || (langue !== "fr" && langue !== "en")) return undefined;
  return trouverVoixFeminine(langue, window.speechSynthesis.getVoices());
};

/** Un audio est-il disponible pour ce texte dans cette langue ? */
export function audioDisponible(langue: Langue, url?: string | null): boolean {
  if (url) return true;
  if (langue !== "fr" && langue !== "en") return false;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  // Liste des voix encore vide (chargement) : on suppose une voix disponible en ligne
  if (window.speechSynthesis.getVoices().length === 0) return typeof navigator !== "undefined" && navigator.onLine;
  return Boolean(voixPour(langue));
}

/**
 * Normalisation phonétique et textuelle pour la synthèse vocale :
 * - Résout les erreurs de lecture fréquentes des moteurs TTS (ex. Web Speech API sur Android, Windows, iOS) :
 *   notamment la ligature « œ » dans « sœur » ou « cœur » qui est souvent tronquée ou lue « sue » / « cue »
 *   si elle n'est pas transcrite en digramme « oe » (« soeur », « coeur »).
 * - Nettoie le balisage Markdown (astérisques de gras/italique, liens, titres, listes à puces) pour éviter
 *   que la voix ne prononce « astérisque », « hashtag », etc.
 * - Améliore la diction des acronymes (« IA » -> « I-A », « PagLaafi » -> « Pag-Laafi »).
 */
export function normaliserTextePourVoix(texte: string, langue: Langue = "fr"): string {
  if (!texte) return "";

  let propre = texte;

  // 1. Suppression du balisage Markdown
  // Liens Markdown : [texte affiché](url) -> texte affiché
  propre = propre.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  // Gras / Italique : **texte** ou *texte* -> texte
  propre = propre.replace(/\*\*([^*]+)\*\*/g, "$1");
  propre = propre.replace(/\*([^*]+)\*/g, "$1");
  propre = propre.replace(/__([^_]+)__/g, "$1");
  propre = propre.replace(/_([^_]+)_/g, "$1");
  // Titres Markdown (### Titre)
  propre = propre.replace(/^#{1,6}\s+/gm, "");
  // Puces de listes (- item ou * item)
  propre = propre.replace(/^[-*•]\s+/gm, "");

  // 2. Correction indispensable des ligatures pour le français
  // La ligature œ (U+0153) fait prononcer "sue" au lieu de "soeur" sur la plupart des synthétiseurs vocaux
  propre = propre
    .replace(/œ/g, "oe")
    .replace(/Œ/g, "Oe")
    .replace(/æ/g, "ae")
    .replace(/Æ/g, "Ae")
    .replace(/\bsoeur\b/gi, "soeur")
    .replace(/\bcoeur\b/gi, "coeur")
    .replace(/\bma\s+sue\b/gi, "ma soeur")
    .replace(/\bma\s+sur\b/gi, "ma soeur");

  // 3. Ponctuation orale & pauses naturelles
  // Remplacement des guillemets français « » par des espaces
  propre = propre.replace(/[«»"]/g, " ");
  // Tirets cadratins ou demi-cadratins -> virgule pour marquer une pause orale naturelle
  propre = propre.replace(/\s*[—–]\s*/g, ", ");

  // 4. Phonétique des termes clés PagLaafi & IA pour une diction fluide
  if (langue === "fr") {
    // "Rose IA" ou "IA" isolée -> "I-A" pour que la voix ne prononce pas "ya"
    propre = propre.replace(/\bRose IA\b/gi, "Rose I-A");
    propre = propre.replace(/\bIA\b/g, "I-A");
    // "PagLaafi" -> "Pag-Laafi" pour une articulation nette
    propre = propre.replace(/\bPagLaafi\b/gi, "Pag-Laafi");
  }

  // Nettoyage des espaces multiples
  return propre.replace(/\s+/g, " ").trim();
}

/** Arrête la lecture en cours (s'il y en a une). */
export function arreterLecture() {
  arretEnCours?.();
  arretEnCours = null;
  if (typeof window !== "undefined") window.dispatchEvent(new Event("pl-lecture-arretee"));
}

/**
 * Lit un texte (ou un MP3) ; `onFin` est appelé à la fin naturelle de la lecture.
 * Renvoie false si aucun audio n'est disponible.
 */
export function lire({ texte, langue, url, onFin }: { texte: string; langue: Langue; url?: string | null; onFin?: () => void }): boolean {
  arreterLecture();
  if (url) {
    const audio = new Audio(url);
    let arrete = false;
    audio.onended = () => !arrete && onFin?.();
    void audio.play().catch(() => onFin?.());
    arretEnCours = () => {
      arrete = true;
      audio.pause();
    };
    return true;
  }
  if (!audioDisponible(langue)) return false;
  const synthese = window.speechSynthesis;
  synthese.cancel();
  const texteNormalise = normaliserTextePourVoix(texte, langue);
  const u = new SpeechSynthesisUtterance(texteNormalise);
  u.lang = langue === "en" ? "en-US" : "fr-FR";
  // Synthèse vocale de Rose IA : hauteur et débit féminins, doux et posés
  u.pitch = 1.15;
  u.rate = 0.98;
  const v = voixPour(langue);
  if (v) u.voice = v;
  let arrete = false;
  u.onend = () => !arrete && onFin?.();
  synthese.speak(u);
  arretEnCours = () => {
    arrete = true;
    synthese.cancel();
  };
  return true;
}

