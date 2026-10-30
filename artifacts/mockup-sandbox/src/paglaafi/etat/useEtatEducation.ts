import { useState } from "react";

/**
 * Module « Comprendre » : leçon active et ouverture du guide des 4 gestes
 * (l'ancien faux lecteur vidéo, avec minuteur sur image fixe, a été retiré).
 */
export function useEtatEducation() {
  const [activeLesson, setActiveLesson] = useState<number>(0);

  // Guide des 4 gestes d'autopalpation et vidéo médicale
  const [showAutopalpationVideoModal, setShowAutopalpationVideoModal] = useState(false);
  const [guideGestesVue, setGuideGestesVue] = useState<"video" | "guide">("guide");

  const ouvrirGuideGestes = (format: "video" | "guide" = "guide") => {
    setGuideGestesVue(format);
    setShowAutopalpationVideoModal(true);
  };

  // Modale interactive du Quiz de Prévention avec Rose IA
  const [showQuizModal, setShowQuizModal] = useState(false);

  return {
    activeLesson,
    setActiveLesson,
    showAutopalpationVideoModal,
    setShowAutopalpationVideoModal,
    guideGestesVue,
    setGuideGestesVue,
    ouvrirGuideGestes,
    showQuizModal,
    setShowQuizModal,
  };
}

export type EtatEducation = ReturnType<typeof useEtatEducation>;
