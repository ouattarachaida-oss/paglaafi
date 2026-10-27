import { CheckCircle2, Phone, ShieldCheck, X } from "lucide-react";
import { partnerAssociations } from "../donnees/associations";
import { useAuth, useDons } from "../etat/contextes";
import { BadgeSimulation } from "../composants/BadgeSimulation";

/**
 * Parcours de don Orange Money (simulé) en 4 étapes.
 */
export function ModaleDon() {
  const { currentUser } = useAuth();
  const {
    customDonationAmount,
    donationAmount,
    donationStep,
    handleConfirmOrangeMoney,
    handleStartDonationProcess,
    handleValidateOrangeMoneyOTP,
    isAnonymousDonation,
    lastDonationId,
    orangeMoneyPhone,
    otpCode,
    selectedAssociation,
    setCustomDonationAmount,
    setDonationAmount,
    setDonationStep,
    setIsAnonymousDonation,
    setOrangeMoneyPhone,
    setOtpCode,
    setSelectedAssociation,
    setShowDonationModal,
    showDonationModal,
  } = useDons();

  if (!showDonationModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]">
      <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl border border-orange-200">
        <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f16e00] text-white font-black text-xs">
              OM
            </span>
            <div>
              <h3 className="ph-display text-sm font-bold text-[#3d2430]">Faire un don solidaire</h3>
              <BadgeSimulation
                bloc
                detail="Paiement simulé : aucun paiement Orange Money n'est effectué, aucun argent n'est prélevé."
              />
              <p className="text-[10px] text-orange-950 font-semibold">Orange Money Burkina Faso (#144#)</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowDonationModal(false);
              setDonationStep("form");
            }}
            className="grid h-8 w-8 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
          >
            <X size={18} />
          </button>
        </div>

        {/* ÉTAPE 1 : Choix de l'association, montant et option anonyme */}
        {donationStep === "form" && (
          <div className="mt-3 space-y-3 text-xs">
            <div>
              <label className="block font-bold text-[#563746]">1. Choisir l'association partenaire :</label>
              <select
                value={selectedAssociation.id}
                onChange={(e) => {
                  const found = partnerAssociations.find((a) => a.id === Number(e.target.value));
                  if (found) setSelectedAssociation(found);
                }}
                className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 font-semibold text-[#580e36]"
              >
                {partnerAssociations.map((assoc) => (
                  <option key={assoc.id} value={assoc.id}>
                    {assoc.acronym} — {assoc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#563746]">2. Montant du don solidaire (FCFA) :</label>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                {[1000, 2500, 5000, 10000, 25000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setDonationAmount(amt);
                      setCustomDonationAmount("");
                    }}
                    className={`rounded-xl py-2 font-bold transition text-xs ${donationAmount === amt && !customDonationAmount ? "bg-[#f16e00] text-white shadow-sm" : "border border-[#e7d5dc] bg-[#fffaf8] text-[#563746]"}`}
                  >
                    {amt.toLocaleString("fr-FR")} F
                  </button>
                ))}
                <input
                  type="number"
                  placeholder="Autre..."
                  value={customDonationAmount}
                  onChange={(e) => setCustomDonationAmount(e.target.value)}
                  className={`rounded-xl p-1.5 text-center text-xs font-bold border ${customDonationAmount ? "border-[#f16e00] bg-orange-50 text-orange-900" : "border-[#e7d5dc]"}`}
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#563746]">3. Numéro de téléphone débiteur :</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2.5 font-bold text-[#8c6778]">+226</span>
                <input
                  type="tel"
                  value={orangeMoneyPhone}
                  onChange={(e) => setOrangeMoneyPhone(e.target.value)}
                  placeholder="70 12 34 56"
                  className="w-full rounded-xl border border-[#e4cfd6] py-2 pl-14 pr-3 font-bold text-[#580e36] focus:border-[#f16e00] focus:outline-none"
                />
              </div>
            </div>

            {/* OPTION DON ANONYME : nom et numéro masqués à l'affichage (aucun chiffrement n'est revendiqué) */}
            <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 p-3">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymousDonation}
                  onChange={(e) => setIsAnonymousDonation(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="font-bold text-[#20432f] text-xs flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-700" /> Don anonyme
                  </span>
                  <p className="text-[10px] text-[#476a56] leading-tight mt-0.5">
                    Votre nom et votre numéro sont masqués à l'affichage : le reçu et l'association voient « Donatrice
                    anonyme ».
                  </p>
                </div>
              </label>
            </div>

            <button
              onClick={handleStartDonationProcess}
              className="mt-2 w-full rounded-2xl bg-[#f16e00] py-3 text-xs font-bold text-white shadow-md hover:bg-orange-600 transition"
            >
              Valider le don de{" "}
              {customDonationAmount
                ? Number(customDonationAmount).toLocaleString("fr-FR")
                : donationAmount.toLocaleString("fr-FR")}{" "}
              FCFA →
            </button>
          </div>
        )}

        {/* ÉTAPE 2 : Confirmation */}
        {donationStep === "confirm" && (
          <div className="mt-3 space-y-3 text-xs">
            <div className="rounded-2xl bg-[#fff7f2] border border-orange-200 p-3.5 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#7c5b6b]">Bénéficiaire :</span>
                <span className="font-bold text-[#580e36]">{selectedAssociation.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7c5b6b]">Montant :</span>
                <span className="font-extrabold text-[#f16e00] text-sm">
                  {customDonationAmount
                    ? Number(customDonationAmount).toLocaleString("fr-FR")
                    : donationAmount.toLocaleString("fr-FR")}{" "}
                  FCFA
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7c5b6b]">Donateur :</span>
                <span className="font-bold text-[#580e36]">
                  {isAnonymousDonation
                    ? "Donatrice anonyme"
                    : `${currentUser?.prenom || "Donateur"} ${currentUser?.nom || ""}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7c5b6b]">Numéro débité :</span>
                <span className="font-bold text-[#580e36]">
                  {isAnonymousDonation ? `+226 70 ** ** ${orangeMoneyPhone.slice(-2)}` : `+226 ${orangeMoneyPhone}`}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setDonationStep("form")}
                className="flex-1 rounded-xl border border-[#e5ced6] py-2.5 font-bold text-[#725261]"
              >
                Modifier
              </button>
              <button
                onClick={handleConfirmOrangeMoney}
                className="flex-1 rounded-xl bg-[#f16e00] py-2.5 font-bold text-white shadow hover:bg-orange-600"
              >
                Autoriser le paiement
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : OTP Orange Money */}
        {donationStep === "otp" && (
          <div className="mt-3 space-y-3 text-xs text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-orange-100 text-[#f16e00] ph-pulse">
              <Phone size={24} />
            </div>
            <div>
              <h4 className="font-bold text-[#580e36]">Autorisation Orange Money (#144*4*6#)</h4>
              <p className="text-[11px] text-[#7c5b6b] mt-1">
                Composez <strong>#144*4*6#</strong> sur votre mobile ou saisissez votre code OTP reçu par SMS :
              </p>
            </div>

            <div className="mx-auto max-w-[180px]">
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Code OTP"
                className="w-full rounded-xl border-2 border-orange-400 p-2 text-center text-sm font-extrabold tracking-widest text-[#580e36]"
              />
            </div>

            <button
              onClick={handleValidateOrangeMoneyOTP}
              className="w-full rounded-2xl bg-[#f16e00] py-2.5 font-bold text-white shadow"
            >
              Confirmer le don
            </button>
          </div>
        )}

        {/* ÉTAPE 4 : Reçu officiel de don */}
        {donationStep === "success" && (
          <div className="mt-3 space-y-3 text-xs text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <h4 className="ph-display text-lg font-bold text-[#580e36]">Merci pour votre générosité !</h4>
              <p className="text-[11px] text-[#7c5b6b] mt-0.5">
                Votre don est intégralement alloué à <strong>{selectedAssociation.acronym}</strong> pour soutenir le
                dépistage au Burkina Faso.
              </p>
            </div>

            <div className="rounded-xl bg-[#f8f9fa] border border-[#e9ecef] p-3 text-left space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-500">Réf Transaction :</span>
                <span className="font-mono font-bold text-gray-800">{lastDonationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Donateur :</span>
                <span className="font-semibold text-gray-700">
                  {isAnonymousDonation
                    ? "Donatrice anonyme"
                    : `${currentUser?.prenom || "Donateur"} ${currentUser?.nom || ""}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Montant :</span>
                <span className="font-bold text-[#f16e00]">
                  {customDonationAmount
                    ? Number(customDonationAmount).toLocaleString("fr-FR")
                    : donationAmount.toLocaleString("fr-FR")}{" "}
                  FCFA
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Opérateur :</span>
                <span className="font-semibold text-gray-700">Orange Money Burkina</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowDonationModal(false);
                setDonationStep("form");
              }}
              className="w-full rounded-2xl bg-[#ea2d6d] py-2.5 font-bold text-white shadow"
            >
              Fermer le reçu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
