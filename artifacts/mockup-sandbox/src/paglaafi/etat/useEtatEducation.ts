import { useState } from "react";

/**
 * Module « Comprendre » : leçon active et ouverture du guide des 4 gestes
 * (l'ancien faux lecteur vidéo, avec minuteur sur image fixe, a été retiré).
 */
export function useEtatEducation() {
  const [activeLesson, setActiveLesson] = useState<number>(0);

  // Guide des 4 gestes d'autopalpation (ou vraie vidéo validée si donnees/guideGestes.ts en fournit une)
  const [showAutopalpationVideoModal, setShowAutopalpationVideoModal] = useState(false);

  return {
    activeLesson,
    setActiveLesson,
    showAutopalpationVideoModal,
    setShowAutopalpationVideoModal,
  };
}

export type EtatEducation = ReturnType<typeof useEtatEducation>;
