import { useEffect, useRef, useState } from "react";
import type { MedicalKnowledge, MessageRose } from "../types";
import { initialDefaultRoseMessages } from "../donnees/rose";
import { roseDailyTips } from "../donnees/conseilsRose";
import { genererReponseRose } from "../lib/moteurRose";
import { demanderARose } from "../lib/roseIA";
import { MODE_DEMO, MODE_REEL } from "../config";
import type { EtatUi } from "./useEtatUi";
import type { EtatAudio } from "./useEtatAudio";

/**
 * Rose IA : discussion, reconnaissance vocale, conseils du jour et savoirs cliniques.
 * ⚠️ Les réponses sont simulées par mots-clés (voir phase 3).
 */
export function useEtatRose({ ui, audio }: { ui: EtatUi; audio: EtatAudio }) {
  const { appLanguage, notify, section } = ui;
  const { handlePlayAudio } = audio;

  // 8. Assistant Vocal & Compagne de Santé ROSE IA (Santé globale, Bien-être, Hygiène de vie & Éthique)
  const [dailyTipIndex, setDailyTipIndex] = useState(0);

  const [dailyTipLang, setDailyTipLang] = useState<"fr" | "moore" | "dioula" | "en">("fr");

  const [notificationEnabled, setNotificationEnabled] = useState(false);

  const [roseMessages, setRoseMessages] = useState<MessageRose[]>(() => {
    // Mode réel : la discussion (questions de santé) n'est pas conservée sur l'appareil
    if (typeof window === "undefined" || MODE_REEL) return initialDefaultRoseMessages;
    try {
      const s = localStorage.getItem("paglaafi_rose_messages");
      return s ? JSON.parse(s) : initialDefaultRoseMessages;
    } catch {
      return initialDefaultRoseMessages;
    }
  });

  // Sauvegarde continue de la discussion Rose IA
  useEffect(() => {
    if (typeof window === "undefined" || !MODE_DEMO) return;
    try {
      localStorage.setItem("paglaafi_rose_messages", JSON.stringify(roseMessages));
    } catch {
      // Ignorer
    }
  }, [roseMessages]);

  const [roseInput, setRoseInput] = useState("");

  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  // Mode de discussion avec Rose IA : "text" (discussion écrite) ou "voice" (discussion orale/audio directe)
  const [roseChatMode, setRoseChatMode] = useState<"text" | "voice">("text");

  const [oralVoiceLang, setOralVoiceLang] = useState<"fr" | "moore" | "dioula" | "en">("fr");

  const lastVoiceTranscriptRef = useRef<string>("");

  const handleSendRoseMessageRef = useRef<(text?: string, speak?: boolean) => void>(() => {});

  // 9. Espace Docteur : Entraîner Rose IA
  const [clinicalKnowledgeList, setClinicalKnowledgeList] = useState<MedicalKnowledge[]>([
    {
      id: 1,
      doctorName: "Dr. Ibrahim Sanou",
      speciality: "Gynécologue-Obstétricien",
      topic: "Permanence urgences mammaires Bogodogo",
      advice:
        "Accueil direct sans rendez-vous tous les mardis et jeudis dès 08h pour tout nodule dur fixé ou écoulement unilatéral suspect.",
      date: "14/10/2026",
      verified: true,
    },
    {
      id: 2,
      doctorName: "Dr. Salif Sawadogo",
      speciality: "Oncologue Médical",
      topic: "Bon de mammographie subventionnée",
      advice:
        "L'ABAC dispose de bons de prise en charge à 5 000 FCFA pour les femmes sans couverture sanitaire adressées avec fiche d'orientation.",
      date: "15/10/2026",
      verified: true,
    },
  ]);

  // Référence pour le défilement automatique du chat Rose IA
  const roseChatBottomRef = useRef<HTMLDivElement | null>(null);

  // Référence pour la reconnaissance vocale Web Speech de Rose IA
  const recognitionRef = useRef<any>(null);

  // Défilement automatique du chat Rose IA vers le dernier message
  useEffect(() => {
    if (section === "RoseIA") {
      roseChatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [roseMessages, section]);

  /**
   * Gestion de la reconnaissance vocale temps réel pour Rose IA (Web Speech API)
   */
  const handleToggleVoiceRecognition = () => {
    // Si l'écoute est déjà en cours, on l'arrête
    if (isRecordingVoice) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error(e);
        }
      }
      setIsRecordingVoice(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      notify(
        "La reconnaissance vocale directe n'est pas supportée sur ce navigateur. Vous pouvez poser une question par écrit ou utiliser les raccourcis.",
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = oralVoiceLang === "en" ? "en-US" : "fr-FR";
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecordingVoice(true);
        lastVoiceTranscriptRef.current = "";
        notify("Microphone actif : parlez maintenant à Rose IA...");
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          lastVoiceTranscriptRef.current = transcript;
          setRoseInput(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("[Rose IA Speech]", event.error);
        setIsRecordingVoice(false);
        if (event.error === "not-allowed") {
          notify("Accès micro refusé. Veuillez autoriser le microphone dans votre navigateur.");
        } else if (event.error === "no-speech") {
          notify("Aucune voix détectée. Appuyez sur le micro pour réessayer.");
        } else {
          notify(`Microphone : ${event.error || "erreur"}`);
        }
      };

      recognition.onend = () => {
        setIsRecordingVoice(false);
        const spoken = lastVoiceTranscriptRef.current;
        if (spoken && spoken.trim().length > 1) {
          handleSendRoseMessageRef.current(spoken, true);
          lastVoiceTranscriptRef.current = "";
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsRecordingVoice(false);
      notify("Impossible de démarrer l'écoute au microphone.");
    }
  };

  /**
   * Activation et envoi de notification bienveillante en langues locales (Web Notifications ou In-App)
   */
  const handleRequestNotification = async () => {
    const tip = roseDailyTips[dailyTipIndex];
    const text =
      dailyTipLang === "moore"
        ? tip.moore
        : dailyTipLang === "dioula"
          ? tip.dioula
          : dailyTipLang === "en"
            ? tip.en
            : tip.fr;
    const langLabel =
      dailyTipLang === "moore"
        ? "Mooré"
        : dailyTipLang === "dioula"
          ? "Dioula"
          : dailyTipLang === "en"
            ? "English"
            : "Français";

    if ("Notification" in window) {
      let perm = Notification.permission;
      if (perm !== "granted") {
        try {
          perm = await Notification.requestPermission();
        } catch (e) {
          console.warn("Notification request permission error:", e);
        }
      }
      if (perm === "granted") {
        setNotificationEnabled(true);
        try {
          new Notification(`🌸 Rose IA — ${tip.categoryLabel}`, {
            body: `${text.slice(0, 130)}...`,
            icon: "/favicon.ico",
          });
          notify(`Rappels quotidiens activés en ${langLabel} ! Notification bienveillante envoyée.`);
          return;
        } catch (e) {
          console.warn("Notification show error:", e);
        }
      }
    }

    setNotificationEnabled((prev) => !prev);
    notify(`Rappel bienveillant activé (${langLabel}) : "${tip.titleFr}"`);
  };

  /**
   * Envoi de message à Rose IA avec moteur conversationnel IA enrichi,
   * intégration des fiches cliniques docteurs, et support 4 langues (FR, Mooré, Dioula, EN)
   */
  const handleSendRoseMessage = (textOverride?: string, speakAloud = false) => {
    const textToSend = textOverride || roseInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: "user" as const,
      text: textToSend,
      time: "Maintenant",
    };
    setRoseMessages((prev) => [...prev, userMsg]);
    setRoseInput("");

    // Mode réel : Rose IA fondée sur les fiches validées (serveur), repli FAQ locale
    if (MODE_REEL) {
      const parler = speakAloud || isRecordingVoice;
      void demanderARose(textToSend, appLanguage).then((r) => {
        setRoseMessages((prev) => [
          ...prev,
          {
            sender: "rose",
            text: r.texte,
            mooreText: r.textesLocaux.moore,
            dioulaText: r.textesLocaux.dioula,
            sources: r.sources,
            origine: r.origine,
            alerte: r.alerte,
            time: "Maintenant",
          },
        ]);
        window.setTimeout(() => roseChatBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
        if (parler) {
          const local = appLanguage === "moore" ? r.textesLocaux.moore : appLanguage === "dioula" ? r.textesLocaux.dioula : undefined;
          handlePlayAudio(local ?? r.texte, local ? appLanguage : appLanguage === "en" ? "en" : "fr");
        }
      });
      return;
    }

    // Réponse dans les 4 langues : fiche clinique, règle par mots-clés ou réponse générique (voir lib/moteurRose.ts)
    const {
      fr: aiFr,
      en: aiEn,
      moore: aiMoore,
      dioula: aiDioula,
    } = genererReponseRose(textToSend, clinicalKnowledgeList);

    // Réponse différée pour simulation naturelle d'analyse IA
    window.setTimeout(() => {
      setRoseMessages((prev) => [
        ...prev,
        {
          sender: "rose",
          text: aiFr,
          englishText: aiEn,
          mooreText: aiMoore,
          dioulaText: aiDioula,
          time: "Maintenant",
        },
      ]);

      // Défilement automatique vers le nouveau message
      window.setTimeout(() => {
        roseChatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 80);

      // Si le micro a été utilisé, synthèse vocale immédiate dans la langue choisie
      if (speakAloud || isRecordingVoice) {
        const textToSpeak =
          appLanguage === "moore" && aiMoore
            ? aiMoore
            : appLanguage === "dioula" && aiDioula
              ? aiDioula
              : appLanguage === "en" && aiEn
                ? aiEn
                : aiFr;
        handlePlayAudio(textToSpeak, appLanguage);
      }
    }, 450);
  };

  useEffect(() => {
    handleSendRoseMessageRef.current = handleSendRoseMessage;
  });

  return {
    dailyTipIndex,
    setDailyTipIndex,
    dailyTipLang,
    setDailyTipLang,
    notificationEnabled,
    setNotificationEnabled,
    roseMessages,
    setRoseMessages,
    roseInput,
    setRoseInput,
    isRecordingVoice,
    setIsRecordingVoice,
    roseChatMode,
    setRoseChatMode,
    oralVoiceLang,
    setOralVoiceLang,
    lastVoiceTranscriptRef,
    handleSendRoseMessageRef,
    clinicalKnowledgeList,
    setClinicalKnowledgeList,
    roseChatBottomRef,
    recognitionRef,
    handleToggleVoiceRecognition,
    handleRequestNotification,
    handleSendRoseMessage,
  };
}

export type EtatRose = ReturnType<typeof useEtatRose>;
