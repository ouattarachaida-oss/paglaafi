import { useState } from "react";
import { hapticFeedback } from "../lib/haptique";
import type { EtatCentres } from "./useEtatCentres";
import type { EtatAuth } from "./useEtatAuth";
import type { EtatUi } from "./useEtatUi";

/**
 * Orientations d'urgence d'une patiente : du docteur vers un centre de santé (démo).
 */
export function useEtatOrientations({ centres, auth, ui }: { centres: EtatCentres; auth: EtatAuth; ui: EtatUi }) {
  const { centers } = centres;
  const { currentUser } = auth;
  const { notify } = ui;

  // 10. Espace Soignant : Orientation & Recommandation patiente d'urgence
  const [showOrientationModal, setShowOrientationModal] = useState(false);

  const [orientationForm, setOrientationForm] = useState({
    patientName: "K. Fatoumata",
    patientPhone: "70 88 99 00",
    urgencyLevel: "immediate" as "immediate" | "priority" | "routine",
    targetCenterId: 1,
    clinicalObservations:
      "Masse rétro-aréolaire droite de 2.5 cm, indolore, évoluant depuis 2 mois. Pas d'adénopathie palpable.",
    recommendedExam: "Mammographie numérique bilatérale + Échographie mammaire",
  });

  const [generatedOrientationCode, setGeneratedOrientationCode] = useState<string | null>(null);

  // Registre partagé des orientations d'urgence (Docteur ➔ Centre de Santé)
  const [urgentOrientations, setUrgentOrientations] = useState([
    {
      id: "PAG-URG-2026-4821",
      patientName: "K. Fatoumata",
      patientPhone: "+226 70 88 99 00",
      patientAge: 42,
      doctorName: "Dr. Ouédraogo Aminata",
      doctorSpecialty: "Gynécologue-Obstétricienne",
      targetCenterId: 1,
      targetCenterName: "CMA Schiphra",
      urgencyLevel: "immediate" as "immediate" | "priority" | "routine",
      urgencyLabel: "🚨 Immédiat (< 24h)",
      clinicalObservations:
        "Masse rétro-aréolaire droite de 2.5 cm, indolore, évoluant depuis 2 mois. Rétraction cutanée légère constatée.",
      recommendedExam: "Mammographie numérique bilatérale + Échographie mammaire",
      status: "pending_center" as "pending_center" | "accepted_urgent" | "scheduled_wait",
      centerValidationMessage: "",
      centerEstimatedDelay: "",
      createdAt: "Aujourd'hui à 08h45",
    },
    {
      id: "PAG-URG-2026-3190",
      patientName: "T. Salimata",
      patientPhone: "+226 76 11 22 33",
      patientAge: 38,
      doctorName: "Dr. Kaboré Jean-Baptiste",
      doctorSpecialty: "Médecin Généraliste",
      targetCenterId: 1,
      targetCenterName: "CMA Schiphra",
      urgencyLevel: "priority" as "immediate" | "priority" | "routine",
      urgencyLabel: "⚠️ Prioritaire (48h-72h)",
      clinicalObservations:
        "Écoulement unilatéral suspect mamelon gauche sans nodule franc à la palpation. Antécédents familiaux de cancer du sein.",
      recommendedExam: "Échographie mammaire ciblée",
      status: "accepted_urgent" as "pending_center" | "accepted_urgent" | "scheduled_wait",
      centerValidationMessage: "Patiente attendue ! Équipe Schiphra prévenue. Accueil direct guichet 3.",
      centerEstimatedDelay: "Prise en charge directe (< 15 min)",
      createdAt: "Hier à 16h20",
    },
  ]);

  /**
   * Recommander et orienter un patient selon l'urgence clinique vers un Centre de Santé
   */
  const handleCreatePatientOrientation = (e: React.FormEvent) => {
    e.preventDefault();
    hapticFeedback(25);
    const code = `PAG-URG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const targetCenter = centers.find((c) => c.id === Number(orientationForm.targetCenterId)) || centers[0];

    const newRecord = {
      id: code,
      patientName: orientationForm.patientName,
      patientPhone: orientationForm.patientPhone,
      patientAge: 40,
      doctorName: currentUser?.prenom ? `${currentUser.prenom} ${currentUser.nom}` : "Dr. Partenaire PagLaafi",
      doctorSpecialty: "Médecin / Soignant(e)",
      targetCenterId: targetCenter.id,
      targetCenterName: targetCenter.shortName,
      urgencyLevel: orientationForm.urgencyLevel,
      urgencyLabel:
        orientationForm.urgencyLevel === "immediate"
          ? "🚨 Immédiat (< 24h)"
          : orientationForm.urgencyLevel === "priority"
            ? "⚠️ Prioritaire (48h-72h)"
            : "ℹ️ Routine / Surveillance",
      clinicalObservations: orientationForm.clinicalObservations,
      recommendedExam: orientationForm.recommendedExam,
      status: "pending_center" as const,
      centerValidationMessage: "",
      centerEstimatedDelay: "",
      createdAt: "À l'instant",
    };

    setUrgentOrientations((prev) => [newRecord, ...prev]);
    setGeneratedOrientationCode(code);
    notify(`Orientation ${code} émise d'urgence vers ${targetCenter.shortName} !`);
  };

  /**
   * Validation d'une orientation d'urgence par l'équipe du Centre de Santé
   */
  const handleValidateOrientationByCenter = (
    orientationId: string,
    action: "immediate" | "scheduled",
    customDelay?: string,
  ) => {
    hapticFeedback(20);
    setUrgentOrientations((prev) =>
      prev.map((item) => {
        if (item.id === orientationId) {
          if (action === "immediate") {
            return {
              ...item,
              status: "accepted_urgent" as const,
              centerValidationMessage: "Envoyez-la vite ! Équipe alertée et créneau d'urgence réservé.",
              centerEstimatedDelay: "Prise en charge directe (< 15 min)",
            };
          } else {
            return {
              ...item,
              status: "scheduled_wait" as const,
              centerValidationMessage: `Affluence en cours : Patiente prioritaire enregistrée. Accueil garanti sous ${customDelay || "~45 min"}.`,
              centerEstimatedDelay: customDelay || "~45 min",
            };
          }
        }
        return item;
      }),
    );
    notify(
      action === "immediate"
        ? "Confirmation envoyée : Patiente attendue d'urgence !"
        : "Créneau prioritaire programmé avec succès.",
    );
  };

  return {
    showOrientationModal,
    setShowOrientationModal,
    orientationForm,
    setOrientationForm,
    generatedOrientationCode,
    setGeneratedOrientationCode,
    urgentOrientations,
    setUrgentOrientations,
    handleCreatePatientOrientation,
    handleValidateOrientationByCenter,
  };
}

export type EtatOrientations = ReturnType<typeof useEtatOrientations>;
