import { useState } from "react";
import type { PartnerAssociation } from "../types";
import { partnerAssociations } from "../donnees/associations";
import type { EtatUi } from "./useEtatUi";

/**
 * Dons solidaires. ⚠️ Le paiement Orange Money est entièrement simulé.
 */
export function useEtatDons({ ui }: { ui: EtatUi }) {
  const { notify } = ui;

  // 14. Faire un Don (Orange Money avec Option Don Anonyme Chiffré)
  const [showDonationModal, setShowDonationModal] = useState(false);

  const [isAnonymousDonation, setIsAnonymousDonation] = useState(false);

  const [selectedAssociation, setSelectedAssociation] = useState<PartnerAssociation>(partnerAssociations[0]);

  const [donationAmount, setDonationAmount] = useState<number>(2500);

  const [customDonationAmount, setCustomDonationAmount] = useState<string>("");

  const [orangeMoneyPhone, setOrangeMoneyPhone] = useState<string>("70 12 34 56");

  const [donationStep, setDonationStep] = useState<"form" | "confirm" | "otp" | "success">("form");

  const [otpCode, setOtpCode] = useState<string>("");

  const [lastDonationId, setLastDonationId] = useState<string>("");

  /**
   * Processus Don Orange Money (avec support Don Anonyme Chiffré)
   */
  const handleStartDonationProcess = () => {
    const effectiveAmount = customDonationAmount ? Number(customDonationAmount) : donationAmount;
    if (!effectiveAmount || effectiveAmount < 500) {
      notify("Le montant minimum d'un don solidaire est de 500 FCFA.");
      return;
    }
    if (!orangeMoneyPhone || orangeMoneyPhone.trim().length < 8) {
      notify("Veuillez renseigner un numéro Orange Money Burkina valide.");
      return;
    }
    setDonationStep("confirm");
  };

  const handleConfirmOrangeMoney = () => {
    setDonationStep("otp");
    notify("Demande USSD Orange Money envoyée (#144*4*6#). Entrez votre code.");
  };

  const handleValidateOrangeMoneyOTP = () => {
    const prefix = isAnonymousDonation ? "OM-ANON" : "OM-BF";
    const ref = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
    setLastDonationId(ref);
    setDonationStep("success");
    notify(`Paiement de ${customDonationAmount || donationAmount} FCFA validé. Reçu : ${ref}`);
  };

  return {
    showDonationModal,
    setShowDonationModal,
    isAnonymousDonation,
    setIsAnonymousDonation,
    selectedAssociation,
    setSelectedAssociation,
    donationAmount,
    setDonationAmount,
    customDonationAmount,
    setCustomDonationAmount,
    orangeMoneyPhone,
    setOrangeMoneyPhone,
    donationStep,
    setDonationStep,
    otpCode,
    setOtpCode,
    lastDonationId,
    setLastDonationId,
    handleStartDonationProcess,
    handleConfirmOrangeMoney,
    handleValidateOrangeMoneyOTP,
  };
}

export type EtatDons = ReturnType<typeof useEtatDons>;
