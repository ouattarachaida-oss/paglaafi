/**
 * Retour haptique tactile pour les interactions smartphone
 */
export function hapticFeedback(pattern: number | number[] = 15): void {
  if (typeof window !== "undefined" && "navigator" in window && typeof navigator.vibrate === "function") {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignorer si non supporté ou bloqué par l'OS
    }
  }
}
