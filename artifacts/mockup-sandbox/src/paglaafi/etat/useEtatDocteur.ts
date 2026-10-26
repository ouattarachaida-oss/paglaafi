import { useState } from "react";
import type { MedicalKnowledge } from "../types";
import type { EtatUi } from "./useEtatUi";
import type { EtatAuth } from "./useEtatAuth";
import type { EtatRose } from "./useEtatRose";

/**
 * Espace docteur : parcours d'« entraînement » de Rose IA en 4 étapes (simulation).
 */
export function useEtatDocteur({ ui, auth, rose }: { ui: EtatUi; auth: EtatAuth; rose: EtatRose }) {
  const { notify } = ui;
  const { currentUser } = auth;
  const { setClinicalKnowledgeList, setRoseMessages } = rose;

  // 9. Espace Docteur : Simulation du Parcours d'Entraînement de Rose IA (4 étapes)
  const [showDoctorTrainModal, setShowDoctorTrainModal] = useState(false);

  const [doctorTrainStep, setDoctorTrainStep] = useState<1 | 2 | 3 | 4>(1);

  const [doctorTeachTopic, setDoctorTeachTopic] = useState("Permanence urgences mammaires & Nodule suspect");

  const [doctorTeachContent, setDoctorTeachContent] = useState(
    "Pour toute patiente présentant un nodule dur et fixé, l'accueil se fait sans rendez-vous préalable tous les matins au service d'imagerie. Une mammographie et une échographie mammaire sont prescrites en urgence 48h.",
  );

  const [doctorEmpathicReformulation, setDoctorEmpathicReformulation] = useState({
    fr: "Ma sœur, rassure-toi : un nodule n'est pas forcément grave, mais ton corps mérite toute notre attention. Viens directement sans rendez-vous au CMA Schiphra ou CHU Bogodogo dès demain matin à 08h. Une sage-femme et un radiologue vont t'examiner avec douceur.",
    moore:
      "M maaso, da zoe rabeem ye: bõn-kʋdga pa bãag fãa ye, la yaa tɩlae tɩ d ges-a tao-tao. Wa-y zĩigẽ zaabre n mik dɔgɔtɔrã tɩ b ges yãmba ne laafi.",
    dioula:
      "N ma muso, kana siran : fɛn o fɛn bɛ sin na, a bɛɛ tɛ bana juguman ye. Nka taga kɛnɛyaso la jona sɔgɔma fɛ walasa dɔgɔtɔrɔmuso ka lajɛ saniya kɛ.",
  });

  const [doctorTestQuestion, setDoctorTestQuestion] = useState(
    "J'ai senti une boule un peu dure dans mon sein droit qui ne me fait pas mal, est-ce que je dois m'inquiéter ?",
  );

  const [doctorTestAnswer, setDoctorTestAnswer] = useState<string | null>(null);

  const [doctorSignName, setDoctorSignName] = useState("Dr. Ibrahim Sanou");

  const [doctorSignRole, setDoctorSignRole] = useState("Gynécologue-Obstétricien · CHU Bogodogo");

  /**
   * Présélection d'un cas clinique pour la simulation d'entraînement docteur
   */
  const handleSelectDoctorPresetTopic = (
    topic: string,
    clinicalAdvice: string,
    frReformulation: string,
    mooreReformulation: string,
    dioulaReformulation: string,
    testQ: string,
  ) => {
    setDoctorTeachTopic(topic);
    setDoctorTeachContent(clinicalAdvice);
    setDoctorEmpathicReformulation({
      fr: frReformulation,
      moore: mooreReformulation,
      dioula: dioulaReformulation,
    });
    setDoctorTestQuestion(testQ);
    setDoctorTestAnswer(null);
    setDoctorTrainStep(2);
    notify(`Thème "${topic}" sélectionné pour l'entraînement.`);
  };

  /**
   * Étape 2 -> Étape 3 : Simulation du test en direct avec la patiente
   */
  const handleRunDoctorTestSimulation = () => {
    setDoctorTestAnswer(
      doctorEmpathicReformulation.fr ||
        "Ma sœur, suite aux consignes de nos médecins spécialistes, voici la conduite à tenir pour ta santé...",
    );
    setDoctorTrainStep(3);
    notify("Simulation prête : testez la réponse de Rose IA à la question de la patiente.");
  };

  /**
   * Étape 4 : Validation finale & Ingestion du savoir clinique dans Rose IA
   */
  const handleFinalizeDoctorTraining = () => {
    const newKnowledge: MedicalKnowledge = {
      id: Date.now(),
      doctorName: doctorSignName || (currentUser ? `${currentUser.prenom} ${currentUser.nom}` : "Dr. Ibrahim Sanou"),
      speciality: doctorSignRole || currentUser?.speciality || "Gynécologue-Obstétricien",
      topic: doctorTeachTopic,
      advice: doctorTeachContent,
      date: "Aujourd'hui",
      verified: true,
    };

    setClinicalKnowledgeList((prev) => [newKnowledge, ...prev]);

    // Ingestion directe dans le fil de discussion de Rose IA
    setRoseMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: `[Validation Médicale Signée] ${doctorTeachTopic} — ${newKnowledge.doctorName}`,
        time: "À l'instant",
      },
      {
        sender: "rose",
        text: `Bien reçu ${newKnowledge.doctorName} ! J'ai intégré votre protocole clinique : « ${doctorEmpathicReformulation.fr.slice(0, 140)}... ». Je suis désormais capable d'orienter les femmes en Français, Mooré et Dioula selon vos instructions.`,
        mooreText: `Yozẽ kãsengã ${newKnowledge.doctorName} ! Mam bãngame laafi zãmsgã n na n sõng pagbã ne laafi.`,
        dioulaText: `I ni ce ${newKnowledge.doctorName} ! Dɔgɔtɔrɔba fanga nin don na ne la bi walasa ka musow dɛmɛ.`,
        time: "À l'instant",
      },
    ]);

    setShowDoctorTrainModal(false);
    setDoctorTrainStep(1);
    notify(`Protocole médical validé par ${newKnowledge.doctorName} et assimilé par Rose IA !`);
  };

  return {
    showDoctorTrainModal,
    setShowDoctorTrainModal,
    doctorTrainStep,
    setDoctorTrainStep,
    doctorTeachTopic,
    setDoctorTeachTopic,
    doctorTeachContent,
    setDoctorTeachContent,
    doctorEmpathicReformulation,
    setDoctorEmpathicReformulation,
    doctorTestQuestion,
    setDoctorTestQuestion,
    doctorTestAnswer,
    setDoctorTestAnswer,
    doctorSignName,
    setDoctorSignName,
    doctorSignRole,
    setDoctorSignRole,
    handleSelectDoctorPresetTopic,
    handleRunDoctorTestSimulation,
    handleFinalizeDoctorTraining,
  };
}

export type EtatDocteur = ReturnType<typeof useEtatDocteur>;
