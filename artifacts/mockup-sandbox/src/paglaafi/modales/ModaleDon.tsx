import { useState } from "react";
import { CheckCircle2, Phone } from "lucide-react";
import { partnerAssociations } from "../donnees/associations";
import { useAuth, useDons } from "../etat/contextes";
import { BadgeSimulationUi, Bouton, Champ, Feuille, Interrupteur, ListeDeroulante, OngletsSegmentes } from "../composants/ui";

const ETAPES = ["form", "confirm", "otp", "success"] as const;
const LIBELLES_ETAPES = ["Montant", "Vérification", "Autorisation", "Reçu"];
const MONTANTS = [1000, 2500, 5000, 10000, 25000];

/** Ligne d'un récapitulatif (libellé / valeur). */
function Ligne({ libelle, valeur }: { libelle: string; valeur: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 py-1.5 text-corps">
      <dt className="text-texte-2">{libelle}</dt>
      <dd className="text-right font-semibold text-prune-900">{valeur}</dd>
    </div>
  );
}

/**
 * Parcours de don Orange Money (SIMULÉ, aucun argent n'est prélevé) en 4 étapes :
 * choix et montant, vérification, autorisation, reçu. Don anonyme : nom et numéro
 * masqués à l'affichage (aucun chiffrement n'est revendiqué).
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
  const [objet, setObjet] = useState<"examen" | "association">("examen");

  const fermer = () => {
    setShowDonationModal(false);
    setDonationStep("form");
  };
  const montant = (customDonationAmount ? Number(customDonationAmount) : donationAmount).toLocaleString("fr-FR");
  const donateur = isAnonymousDonation ? "Donatrice anonyme" : `${currentUser?.prenom || "Donateur"} ${currentUser?.nom || ""}`;
  const indice = Math.max(0, ETAPES.indexOf(donationStep as (typeof ETAPES)[number]));

  return (
    <Feuille ouverte={showDonationModal} onFermer={fermer} titre="Faire un don" sousTitre="Orange Money Burkina Faso">
      <div className="space-y-4">
        <div className="bordure-simulation flex flex-wrap items-center gap-2 rounded-bouton bg-simulation-fond px-3 py-2 text-petit text-simulation">
          <BadgeSimulationUi /> <span>Simulation : aucun argent n'est prélevé.</span>
        </div>

        {/* Progression des 4 étapes */}
        <ol className="grid grid-cols-4 gap-2" aria-label={`Étape ${indice + 1} sur 4 : ${LIBELLES_ETAPES[indice]}`}>
          {LIBELLES_ETAPES.map((l, i) => (
            <li key={l} className="space-y-1">
              <span className={`block h-1.5 rounded-full ${i <= indice ? "bg-action" : "bg-rose-200"}`} aria-hidden />
              <span className={`block text-center text-nav ${i === indice ? "font-bold text-prune-900" : "text-texte-2"}`}>{l}</span>
            </li>
          ))}
        </ol>

        {donationStep === "form" && (
          <div className="space-y-4">
            <OngletsSegmentes<"examen" | "association">
              libelle="Objet du don"
              valeur={objet}
              onChange={setObjet}
              onglets={[
                { id: "examen", libelle: "Offrir un examen" },
                { id: "association", libelle: "Soutenir une association" },
              ]}
            />
            <ListeDeroulante
              libelle="Association bénéficiaire"
              value={selectedAssociation.id}
              onChange={(e) => {
                const a = partnerAssociations.find((x) => x.id === Number(e.target.value));
                if (a) setSelectedAssociation(a);
              }}
            >
              {partnerAssociations.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.acronym} — {a.name}
                </option>
              ))}
            </ListeDeroulante>

            <fieldset>
              <legend className="mb-2 text-petit font-semibold text-prune-900">Montant (FCFA)</legend>
              <div className="grid grid-cols-3 gap-2">
                {MONTANTS.map((m) => {
                  const actif = donationAmount === m && !customDonationAmount;
                  return (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={actif}
                      onClick={() => {
                        setDonationAmount(m);
                        setCustomDonationAmount("");
                      }}
                      className={`min-h-12 rounded-bouton text-corps font-semibold ${actif ? "bg-carte-prune text-white" : "border border-bordure bg-surface text-texte"}`}
                    >
                      {m.toLocaleString("fr-FR")} F
                    </button>
                  );
                })}
                <Champ libelle="Autre montant" libelleMasque type="number" min={0} inputMode="numeric" placeholder="Autre…" value={customDonationAmount} onChange={(e) => setCustomDonationAmount(e.target.value)} className="text-center" />
              </div>
            </fieldset>

            <Champ libelle="Numéro Orange Money (+226)" type="tel" value={orangeMoneyPhone} onChange={(e) => setOrangeMoneyPhone(e.target.value)} placeholder="70 12 34 56" />

            <div className="rounded-carte border border-bordure p-3">
              <Interrupteur
                libelle="Don anonyme"
                description="Votre nom et votre numéro sont masqués à l'affichage : le reçu et l'association voient « Donatrice anonyme »."
                actif={isAnonymousDonation}
                onChange={setIsAnonymousDonation}
              />
            </div>

            <Bouton variante="orangeMoney" taille="grand" pleineLargeur onClick={handleStartDonationProcess}>
              Valider le don de {montant} FCFA
            </Bouton>
          </div>
        )}

        {donationStep === "confirm" && (
          <div className="space-y-4">
            <dl className="divide-y divide-bordure rounded-carte border border-bordure px-4 py-2">
              <Ligne libelle="Objet" valeur={objet === "examen" ? "Examen de dépistage" : "Soutien à l'association"} />
              <Ligne libelle="Bénéficiaire" valeur={selectedAssociation.name} />
              <Ligne libelle="Montant" valeur={`${montant} FCFA`} />
              <Ligne libelle="Donateur" valeur={donateur} />
              <Ligne libelle="Numéro débité" valeur={isAnonymousDonation ? `+226 70 ** ** ${orangeMoneyPhone.slice(-2)}` : `+226 ${orangeMoneyPhone}`} />
            </dl>
            <div className="flex gap-3">
              <Bouton variante="secondaire" className="flex-1" onClick={() => setDonationStep("form")}>
                Modifier
              </Bouton>
              <Bouton variante="orangeMoney" className="flex-1" onClick={handleConfirmOrangeMoney}>
                Autoriser le paiement
              </Bouton>
            </div>
          </div>
        )}

        {donationStep === "otp" && (
          <div className="space-y-4 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#fdebdc] text-[#8f3f00]" aria-hidden>
              <Phone size={26} />
            </span>
            <div>
              <h3 className="text-sous-titre text-prune-900">Autorisation Orange Money (#144*4*6#)</h3>
              <p className="mt-1 text-corps text-texte">Composez #144*4*6# sur votre mobile ou saisissez le code reçu par SMS.</p>
            </div>
            <div className="mx-auto max-w-[220px]">
              <Champ libelle="Code reçu par SMS" maxLength={6} inputMode="numeric" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} className="text-center tracking-[0.3em]" />
            </div>
            <Bouton variante="orangeMoney" taille="grand" pleineLargeur onClick={handleValidateOrangeMoneyOTP}>
              Confirmer le don
            </Bouton>
          </div>
        )}

        {donationStep === "success" && (
          <div className="space-y-4 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-succes-fond text-succes" aria-hidden>
              <CheckCircle2 size={30} />
            </span>
            <div>
              <h3 className="text-titre text-prune-900">Merci pour votre générosité</h3>
              <p className="mt-1 text-corps text-texte">
                Votre don est alloué à <strong>{selectedAssociation.acronym}</strong> pour soutenir le dépistage au Burkina Faso.
              </p>
            </div>
            <dl className="divide-y divide-bordure rounded-carte border border-bordure px-4 py-2 text-left">
              <Ligne libelle="Référence (simulation)" valeur={<span className="font-mono">{lastDonationId}</span>} />
              <Ligne libelle="Donateur" valeur={donateur} />
              <Ligne libelle="Montant" valeur={`${montant} FCFA`} />
              <Ligne libelle="Opérateur" valeur="Orange Money Burkina" />
            </dl>
            <Bouton pleineLargeur onClick={fermer}>
              Fermer le reçu
            </Bouton>
          </div>
        )}
      </div>
    </Feuille>
  );
}
