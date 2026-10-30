import { useEffect, useRef, useState } from "react";
import type { EtatUi } from "./useEtatUi";
import { normaliserTextePourVoix } from "../lib/voix";

/**
 * Lecture audio par synthèse vocale du navigateur (Web Speech API).
 * Les contenus en Mooré et Dioula prévoient un champ audioUrlMoore / audioUrlDioula
 * pour des fichiers MP3 pré-générés et validés qui remplaceront cette synthèse.
 */
export function useEtatAudio({ ui }: { ui: EtatUi }) {
  const { notify } = ui;

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [audioProgress, setAudioProgress] = useState<number>(0);

  const [speechLanguage, setSpeechLanguage] = useState<"fr" | "en" | "moore" | "dioula">("fr");

  const audioIntervalRef = useRef<number | null>(null);

  const [roseSpeaking, setRoseSpeaking] = useState(false);

  /**
   * Préchauffage instantané du moteur de synthèse vocale (Web Speech API)
   * Élimine complètement le temps d'attente / latence de 2 à 3 secondes
   * au premier déclenchement audio sur smartphone et navigateur de bureau.
   */
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.getVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
          };
        }
      } catch {
        // Fallback silencieux si non disponible
      }
    }
  }, []);

  /**
   * Moteur Audio Multi-langues (Français, English, Mooré, Dioula)
   */
  const handlePlayAudio = (textToSpeak: string, language: "fr" | "en" | "moore" | "dioula" = "fr") => {
    if (!("speechSynthesis" in window)) {
      notify("La synthèse vocale n'est pas supportée sur ce navigateur.");
      return;
    }

    // Arrêt immédiat si déjà en lecture
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setRoseSpeaking(false);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setAudioProgress(0);
      return;
    }

    // Réveil et déblocage immédiat de la pile audio pour mobile/desktop
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();
    } catch {
      // Ignorer si non applicable
    }

    // Déclenchement réactif immédiat pour l'ergonomie tactile (0 ms d'attente)
    setIsPlaying(true);
    setRoseSpeaking(true);
    setAudioProgress(8);

    // Normalisation phonétique : transforme notamment « œ » en « oe » pour éviter que « sœur » ne soit lu « sue »
    const texteNormalise = normaliserTextePourVoix(textToSpeak, language);
    const utterance = new SpeechSynthesisUtterance(texteNormalise);

    // Attribution directe d'une voix préchargée pour éviter le délai de recherche de voix
    try {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices && allVoices.length > 0) {
        const matchedVoice =
          allVoices.find((v) => (language === "en" ? v.lang.startsWith("en") : v.lang.startsWith("fr"))) ||
          allVoices[0];
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }
      }
    } catch {
      // Silencieux
    }

    if (language === "en") {
      utterance.lang = "en-US";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
    } else if (language === "fr") {
      utterance.lang = "fr-FR";
      utterance.rate = 1.02; // Rythme alerte et naturel
      utterance.pitch = 1.05;
    } else {
      // Mooré et Dioula : diction claire avec prosodie soignée
      utterance.lang = "fr-FR";
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
    }

    // Progression visuelle fluide
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    audioIntervalRef.current = window.setInterval(() => {
      setAudioProgress((prev) => (prev >= 95 ? 95 : prev + 6));
    }, 600);

    utterance.onstart = () => {
      setIsPlaying(true);
      setRoseSpeaking(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setRoseSpeaking(false);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setAudioProgress(100);
      window.setTimeout(() => setAudioProgress(0), 600);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setRoseSpeaking(false);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setAudioProgress(0);
    };

    // Lancement instantané
    window.speechSynthesis.speak(utterance);

    // Déverrouillage de sécurité supplémentaire pour Chrome Android
    window.setTimeout(() => {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 40);
  };

  return {
    isPlaying,
    setIsPlaying,
    audioProgress,
    setAudioProgress,
    speechLanguage,
    setSpeechLanguage,
    audioIntervalRef,
    roseSpeaking,
    setRoseSpeaking,
    handlePlayAudio,
  };
}

export type EtatAudio = ReturnType<typeof useEtatAudio>;
