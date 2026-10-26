import { useEffect, useState } from "react";

/**
 * Module « Comprendre » : leçon active et démonstration d'autopalpation (image animée).
 */
export function useEtatEducation() {
  // 7. Audio & 4 Langues (Français, English, Mooré, Dioula)
  const [activeLesson, setActiveLesson] = useState<number>(0);

  // 13.bis Modal Vidéo Démonstrative Autopalpation (Personnage africain & sage-femme)
  const [showAutopalpationVideoModal, setShowAutopalpationVideoModal] = useState(false);

  const [videoIsPlaying, setVideoIsPlaying] = useState(true);

  const [selectedVideoStep, setSelectedVideoStep] = useState<1 | 2 | 3 | 4>(1);

  const [videoLang, setVideoLang] = useState<"fr" | "moore" | "dioula">("fr");

  const [videoProgressSeconds, setVideoProgressSeconds] = useState(0);

  const [videoSpeed, setVideoSpeed] = useState<1 | 1.5 | 2>(1);

  /**
   * Moteur de lecture vidéo ultra-réactif avec progression dynamique et vitesse ajustable
   * Permet à la vidéo de se lancer immédiatement, d'avancer de manière fluide
   * et de s'accélérer (1x, 1.5x, 2x) selon le souhait de l'utilisatrice.
   */
  useEffect(() => {
    if (!showAutopalpationVideoModal || !videoIsPlaying) return;

    const interval = window.setInterval(() => {
      setVideoProgressSeconds((prev) => {
        const next = prev + 0.5 * videoSpeed;
        if (next >= 165) {
          return 0; // Boucle de lecture continue
        }
        // Synchronisation automatique de l'étape affichée selon le temps
        if (next < 35) setSelectedVideoStep(1);
        else if (next < 75) setSelectedVideoStep(2);
        else if (next < 115) setSelectedVideoStep(3);
        else setSelectedVideoStep(4);

        return next;
      });
    }, 500);

    return () => window.clearInterval(interval);
  }, [showAutopalpationVideoModal, videoIsPlaying, videoSpeed]);

  // Formateur du temps vidéo (ex: "01:24")
  const formatVideoTime = (seconds: number) => {
    const s = Math.floor(seconds);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return {
    activeLesson,
    setActiveLesson,
    showAutopalpationVideoModal,
    setShowAutopalpationVideoModal,
    videoIsPlaying,
    setVideoIsPlaying,
    selectedVideoStep,
    setSelectedVideoStep,
    videoLang,
    setVideoLang,
    videoProgressSeconds,
    setVideoProgressSeconds,
    videoSpeed,
    setVideoSpeed,
    formatVideoTime,
  };
}

export type EtatEducation = ReturnType<typeof useEtatEducation>;
