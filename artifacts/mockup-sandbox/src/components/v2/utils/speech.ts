/**
 * Helpers Web Speech API pour la synthèse et la reconnaissance vocale
 */

export function speakText(
  text: string,
  lang: "fr" | "en" | "moore" | "dioula" = "fr",
  onEnd?: () => void
): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configuration linguistique
    if (lang === "en") {
      utterance.lang = "en-US";
      utterance.rate = 0.95;
    } else {
      // Les langues nationales Mooré & Dioula s'appuient sur le moteur phonétique français avec débit ralenti
      utterance.lang = "fr-FR";
      utterance.rate = lang === "fr" ? 1.0 : 0.88;
    }
    
    utterance.pitch = 1.05; // Timbre bienveillant et chaleureux

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("Échec de la synthèse vocale :", err);
    if (onEnd) onEnd();
  }
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignorer
    }
  }
}
