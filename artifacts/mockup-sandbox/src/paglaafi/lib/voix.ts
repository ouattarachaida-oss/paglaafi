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

const voixPour = (langue: Langue): SpeechSynthesisVoice | undefined => {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || (langue !== "fr" && langue !== "en")) return undefined;
  const voix = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith(langue));
  // Hors ligne, seules les voix installées sur l'appareil fonctionnent
  const utilisables = typeof navigator !== "undefined" && !navigator.onLine ? voix.filter((v) => v.localService) : voix;
  return utilisables[0];
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
  const u = new SpeechSynthesisUtterance(texte);
  u.lang = langue === "en" ? "en-US" : "fr-FR";
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
