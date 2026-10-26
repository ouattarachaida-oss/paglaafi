/**
 * Retour haptique (vibration) sur les appareils compatibles.
 */

// Retour haptique tactile pour ergonomie d'application mobile native
export const hapticFeedback = (duration: number = 15) => {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(duration);
    } catch {
      // Silencieux si non supporté
    }
  }
};
