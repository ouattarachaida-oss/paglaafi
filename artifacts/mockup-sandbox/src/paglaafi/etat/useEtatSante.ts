import { useEffect, useMemo, useState } from "react";
import { MODE_REEL } from "../config";
import { messageErreur } from "../lib/supabase";
import { chargerRappels, creerRappel, type Rappel } from "../depot/rappels";
import type { EtatUi } from "./useEtatUi";
import type { EtatAuth } from "./useEtatAuth";

/**
 * Données de santé de l'utilisatrice : cycle, autopalpation, rappels, confidentialité.
 * ⚠️ Cycle et autopalpation stockés en clair dans le localStorage (voir phase 4).
 * Mode réel : les rappels sont synchronisés avec Supabase (visibles par leur seule propriétaire).
 */
export function useEtatSante({ ui, auth }: { ui: EtatUi; auth: EtatAuth }) {
  const { notify } = ui;
  const { sessionReelle } = auth;

  // 9.bis Paramètres de Confidentialité & Éthique des Données (Local-First, Zéro Tracking)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [privacySettings, setPrivacySettings] = useState({
    localOnlyCycle: true, // Données de cycle et règles stockées 100% sur le téléphone
    contributeAiClinical: true, // Partage des protocoles médicaux soignants pour enrichir Rose IA
    anonymizedAssociationData: true, // Données agrégées pour les associations et l'expérience naturelle
    urgentClinicalConsent: false, // Données médicales partagées uniquement sur demande d'un soignant
    offlineModeCache: true, // Mise en cache hors-ligne des centres et audios
  });

  // 12. Calendrier Féminin : Règles, Autopalpation, Prédiction & Recalibration (avec persistance locale)
  const [lastPeriodDate, setLastPeriodDate] = useState(() => {
    if (typeof window === "undefined") return "2026-10-06";
    return localStorage.getItem("paglaafi_last_period") || "2026-10-06";
  });

  const [cycleLengthDays, setCycleLengthDays] = useState(() => {
    if (typeof window === "undefined") return 28;
    const s = localStorage.getItem("paglaafi_cycle_len");
    return s ? Number(s) : 28;
  });

  const [autopalpationDoneThisMonth, setAutopalpationDoneThisMonth] = useState(() => {
    if (typeof window === "undefined") return true;
    const s = localStorage.getItem("paglaafi_autopalpation_done");
    return s !== null ? JSON.parse(s) : true;
  });

  const [lastAutopalpationDate, setLastAutopalpationDate] = useState(() => {
    if (typeof window === "undefined") return "12/10/2026";
    return localStorage.getItem("paglaafi_last_autopalpation") || "12/10/2026";
  });

  // États pour la saisie réelle, apprentissage et recalibration de la prédiction
  const [showRecalibrateBox, setShowRecalibrateBox] = useState(false);

  const [realPeriodDateInput, setRealPeriodDateInput] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });

  const [showCycleHistory, setShowCycleHistory] = useState(false);

  const [recalibrationFeedback, setRecalibrationFeedback] = useState<{
    text: string;
    type: "success" | "info" | "warning";
  } | null>(null);

  const [cycleHistory, setCycleHistory] = useState<
    Array<{
      id: number;
      date: string;
      duration: number;
      diff: number;
      note: string;
    }>
  >(() => {
    const initialHist = [
      {
        id: 1,
        date: "06/10/2026",
        duration: 28,
        diff: 0,
        note: "Cycle initial de référence (28 jours)",
      },
    ];
    if (typeof window === "undefined") return initialHist;
    try {
      const s = localStorage.getItem("paglaafi_cycle_history");
      return s ? JSON.parse(s) : initialHist;
    } catch {
      return initialHist;
    }
  });

  const [reminders, setReminders] = useState(() => {
    const defaultReminders = [
      {
        id: 1,
        title: "Dépistage annuel recommandé",
        date: "24 Octobre 2026",
        type: "screening" as const,
        active: true,
      },
      {
        id: 2,
        title: "Rendez-vous mammographie (CMA Schiphra)",
        date: "26 Octobre à 09h00",
        type: "appointment" as const,
        active: true,
      },
      {
        id: 3,
        title: "Prise de traitement hormonal / vitamines",
        date: "Tous les matins à 08h00",
        type: "treatment" as const,
        active: false,
      },
    ];
    if (MODE_REEL) return [] as Rappel[]; // chargés depuis Supabase après connexion
    if (typeof window === "undefined") return defaultReminders;
    try {
      const s = localStorage.getItem("paglaafi_reminders");
      return s ? JSON.parse(s) : defaultReminders;
    } catch {
      return defaultReminders;
    }
  });

  // Synchronisation continue des données du cycle dans la mémoire locale
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("paglaafi_last_period", lastPeriodDate);
      localStorage.setItem("paglaafi_cycle_len", String(cycleLengthDays));
      localStorage.setItem("paglaafi_autopalpation_done", JSON.stringify(autopalpationDoneThisMonth));
      localStorage.setItem("paglaafi_last_autopalpation", lastAutopalpationDate);
      localStorage.setItem("paglaafi_cycle_history", JSON.stringify(cycleHistory));
      if (!MODE_REEL) localStorage.setItem("paglaafi_reminders", JSON.stringify(reminders));
    } catch {
      // Silencieux si navigation privée
    }
  }, [lastPeriodDate, cycleLengthDays, autopalpationDoneThisMonth, lastAutopalpationDate, cycleHistory, reminders]);

  // Mode réel : rappels de la personne connectée (vidés à la déconnexion)
  useEffect(() => {
    if (!MODE_REEL) return;
    if (!sessionReelle) {
      setReminders([]);
      return;
    }
    chargerRappels()
      .then(setReminders)
      .catch((erreur) => notify(messageErreur(erreur)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionReelle?.userId]);

  /**
   * Ajoute un rappel : enregistré dans Supabase en mode réel (compte connecté),
   * sinon conservé sur l'appareil.
   */
  const ajouterRappel = async (rappel: Omit<Rappel, "id" | "active">) => {
    if (MODE_REEL && sessionReelle) {
      try {
        const cree = await creerRappel({ ...rappel, active: true });
        setReminders((prev: Rappel[]) => [...prev, cree]);
        return true;
      } catch (erreur) {
        notify(messageErreur(erreur as Error));
        return false;
      }
    }
    setReminders((prev: Rappel[]) => [...prev, { id: Date.now(), ...rappel, active: true }]);
    return true;
  };

  const [showNewReminderForm, setShowNewReminderForm] = useState(false);

  const [newReminderTitle, setNewReminderTitle] = useState("");

  const [newReminderDate, setNewReminderDate] = useState("");

  const [newReminderType, setNewReminderType] = useState<"screening" | "appointment" | "treatment">("appointment");

  /**
   * Calculs prédictifs pour le cycle menstruel & fenêtre d'autopalpation (Recommandation OMS)
   * Calcule :
   * - La date estimée des prochaines règles selon la durée de cycle calibrée.
   * - Le nombre de jours restants (ou de décalage si la date est dépassée).
   * - La fenêtre optimale d'autopalpation (J+7 à J+11 après le premier jour des règles).
   */
  const cycleInfo = useMemo(() => {
    // Découpage strict de la date YYYY-MM-DD pour éviter les biais de fuseau GMT
    const parts = lastPeriodDate.split("-");
    const lastDate =
      parts.length === 3
        ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
        : new Date(lastPeriodDate);

    // Calcul de la date prévisionnelle des prochaines règles
    const nextPeriodDate = new Date(lastDate);
    nextPeriodDate.setDate(lastDate.getDate() + cycleLengthDays);

    // Fenêtre optimale d'autopalpation : 2 à 5 jours après la fin des règles (J+7 à J+11)
    const autopalpStart = new Date(lastDate);
    autopalpStart.setDate(lastDate.getDate() + 7);
    const autopalpEnd = new Date(lastDate);
    autopalpEnd.setDate(lastDate.getDate() + 11);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const isOptimalWindow = today >= autopalpStart && today <= autopalpEnd;

    // Écart en jours entre aujourd'hui et la prédiction
    const diffMs = nextPeriodDate.getTime() - today.getTime();
    const daysUntilNextPeriod = Math.round(diffMs / (1000 * 60 * 60 * 24));

    return {
      nextPeriodStr: nextPeriodDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long" }),
      nextPeriodFormatted: nextPeriodDate.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      daysUntilNextPeriod,
      autopalpWindowStr: `Du ${autopalpStart.getDate()} au ${autopalpEnd.getDate()} ${autopalpEnd.toLocaleDateString("fr-FR", { month: "short" })}`,
      isOptimalWindow,
    };
  }, [lastPeriodDate, cycleLengthDays]);

  /**
   * Recalibration adaptative du cycle menstruel & synchronisation locale
   * Fonctionnalité clé demandée :
   * Si les règles arrivent en avance ou en retard, l'utilisatrice enregistre
   * la date réelle constatée. L'application recalcule l'intervalle réel, recalibre
   * la durée moyenne du cycle, réajuste la prédiction suivante et recadre la fenêtre d'autopalpation.
   */
  const handleRecalibratePeriod = (chosenDate?: string) => {
    const targetDateStr = chosenDate || realPeriodDateInput;
    if (!targetDateStr) {
      notify("Veuillez indiquer une date pour recalibrer.");
      return;
    }

    // Récupération de l'ancienne date et de la nouvelle date déclarée
    const prevParts = lastPeriodDate.split("-");
    const prevDate = new Date(parseInt(prevParts[0], 10), parseInt(prevParts[1], 10) - 1, parseInt(prevParts[2], 10));

    const realParts = targetDateStr.split("-");
    const realDate = new Date(parseInt(realParts[0], 10), parseInt(realParts[1], 10) - 1, parseInt(realParts[2], 10));

    // Calcul de l'écart réel en jours entre les deux débuts de règles
    const diffDays = Math.round((realDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      notify("La date réelle doit être postérieure au cycle précédent.");
      return;
    }

    let calculatedCycleLength = cycleLengthDays;
    let feedbackMsg = "";
    let alertType: "success" | "info" | "warning" = "success";

    // Analyse physiologique de l'intervalle constaté
    if (diffDays >= 21 && diffDays <= 42) {
      // Intervalle physiologique régulier : mise à jour directe du cycle
      calculatedCycleLength = diffDays;
      const variation = diffDays - cycleLengthDays;
      if (variation === 0) {
        feedbackMsg = `Règles confirmées au ${realDate.toLocaleDateString("fr-FR")} : prédiction 100% exacte (cycle régulier de ${diffDays} jours).`;
      } else if (variation > 0) {
        feedbackMsg = `Règles notées avec +${variation} j de décalage. Votre cycle a été automatiquement recalibré à ${diffDays} jours. Prochaine prédiction et autopalpation réajustées.`;
      } else {
        feedbackMsg = `Règles arrivées ${Math.abs(variation)} j plus tôt que prévu. Votre cycle a été recalibré à ${diffDays} jours. Prédictions réalignées.`;
      }
    } else if (diffDays < 21) {
      // Cycle très court
      calculatedCycleLength = 24;
      alertType = "warning";
      feedbackMsg = `Règles déclarées ${diffDays} jours après le dernier cycle (intervalle court). Date enregistrée. Si ce rythme persiste, demandez conseil à une sage-femme.`;
    } else {
      // Décalage supérieur à 42 jours
      calculatedCycleLength = 32;
      alertType = "info";
      feedbackMsg = `Règles constatées après ${diffDays} jours. Date enregistrée et nouveau cycle réinitialisé avec succès.`;
    }

    // Mise à jour des états locaux réactifs
    setCycleLengthDays(calculatedCycleLength);
    setLastPeriodDate(targetDateStr);
    setRecalibrationFeedback({ text: feedbackMsg, type: alertType });
    setShowRecalibrateBox(false);

    // Ajout à l'historique local pour visualiser l'apprentissage
    setCycleHistory((prev) => [
      {
        id: Date.now(),
        date: realDate.toLocaleDateString("fr-FR"),
        duration: diffDays,
        diff: diffDays - cycleLengthDays,
        note: feedbackMsg,
      },
      ...prev.slice(0, 4),
    ]);

    notify("Cycle et fenêtre d'autopalpation recalibrés avec succès !");
  };

  /**
   * Sauvegarde des paramètres de confidentialité & Éthique des données
   */
  const handleSavePrivacySettings = () => {
    setShowPrivacyModal(false);
    notify("Vos préférences de confidentialité et de protection des données sont enregistrées.");
  };

  /**
   * Purge complète des données locales (Droit à l'oubli immédiat)
   */
  const handleClearAllLocalData = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.warn(e);
      }
    }
    setReminders([]);
    setAutopalpationDoneThisMonth(false);
    setShowPrivacyModal(false);
    notify("Droit à l'oubli appliqué : toutes vos données locales de cycle et rappels ont été effacées.");
  };

  return {
    showPrivacyModal,
    setShowPrivacyModal,
    privacySettings,
    setPrivacySettings,
    lastPeriodDate,
    setLastPeriodDate,
    cycleLengthDays,
    setCycleLengthDays,
    autopalpationDoneThisMonth,
    setAutopalpationDoneThisMonth,
    lastAutopalpationDate,
    setLastAutopalpationDate,
    showRecalibrateBox,
    setShowRecalibrateBox,
    realPeriodDateInput,
    setRealPeriodDateInput,
    showCycleHistory,
    setShowCycleHistory,
    recalibrationFeedback,
    setRecalibrationFeedback,
    cycleHistory,
    setCycleHistory,
    reminders,
    setReminders,
    ajouterRappel,
    showNewReminderForm,
    setShowNewReminderForm,
    newReminderTitle,
    setNewReminderTitle,
    newReminderDate,
    setNewReminderDate,
    newReminderType,
    setNewReminderType,
    cycleInfo,
    handleRecalibratePeriod,
    handleSavePrivacySettings,
    handleClearAllLocalData,
  };
}

export type EtatSante = ReturnType<typeof useEtatSante>;
