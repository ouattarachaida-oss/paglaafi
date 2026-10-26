import { useEffect, useState } from "react";
import type { EtatAuth } from "./useEtatAuth";

/**
 * Écran de démarrage (splash) de 5 secondes.
 */
export function useEtatDemarrage({ auth }: { auth: EtatAuth }) {
  const { setCurrentUser } = auth;

  // 1. Écran de démarrage (Splash Screen) "Powered by Rose IA" avec décompte de 5 secondes
  const [showSplash, setShowSplash] = useState(true);

  const [splashProgress, setSplashProgress] = useState(0);

  // Splash Screen Timer : 5 secondes avec progression fluide pour apprécier le travail visuel
  useEffect(() => {
    if (!showSplash) return;
    const duration = 5000;
    const startTime = Date.now();

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / duration) * 100));
      setSplashProgress(progress);
      if (progress >= 100) {
        window.clearInterval(interval);
      }
    }, 40);

    const timer = window.setTimeout(() => {
      setShowSplash(false);
      setCurrentUser(null);
    }, duration);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
    };
  }, [showSplash]);

  return {
    showSplash,
    setShowSplash,
    splashProgress,
    setSplashProgress,
  };
}

export type EtatDemarrage = ReturnType<typeof useEtatDemarrage>;
