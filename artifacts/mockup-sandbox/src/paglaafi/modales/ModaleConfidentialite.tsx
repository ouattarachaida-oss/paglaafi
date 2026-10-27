import { useState } from "react";
import { Check, RotateCcw, Shield, ShieldAlert, ShieldCheck, Trash2, X } from "lucide-react";
import { useAuth, useSante, useUi } from "../etat/contextes";
import { MODE_REEL } from "../config";

const MOT = "SUPPRIMER";

/**
 * Mode réel : résumé honnête de ce que deviennent les données, lien vers la
 * politique, et suppression complète (compte + données en ligne + appareil)
 * avec confirmation explicite.
 */
function ConfidentialiteReelle() {
  const { setShowPrivacyModal, supprimerMesDonnees } = useSante();
  const { sessionReelle } = useAuth();
  const { setShowPolitique } = useUi();
  const [etape, setEtape] = useState<"resume" | "confirmation">("resume");
  const [saisie, setSaisie] = useState("");
  const [enCours, setEnCours] = useState(false);

  const supprimer = async () => {
    setEnCours(true);
    const ok = await supprimerMesDonnees(saisie.trim());
    setEnCours(false);
    if (ok) {
      setSaisie("");
      setEtape("resume");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:absolute sm:rounded-[36px]"
      onClick={() => setShowPrivacyModal(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titre-confidentialite"
        className="ph-enter max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[28px] border border-[#ecd5df] bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#f2e1e7] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck size={20} />
            </div>
            <h3 id="titre-confidentialite" className="ph-display text-sm font-bold text-[#580e36]">
              Confidentialité & Données
            </h3>
          </div>
          <button
            onClick={() => setShowPrivacyModal(false)}
            aria-label="Fermer"
            className="rounded-full p-1.5 text-[#725261] hover:bg-[#faedf2]"
          >
            <X size={18} />
          </button>
        </div>

        {etape === "resume" ? (
          <div className="mt-3 space-y-3 text-[11.5px] leading-relaxed text-[#4d2d3e]">
            <div className="rounded-2xl border border-[#f0d4de] bg-[#fffafc] p-3">
              <p className="font-bold text-[#580e36]">Sur ce téléphone</p>
              <p>Cycle, autopalpations et historique, rattachés à votre compte et chiffrés sur l'appareil. Ils ne protègent pas contre quelqu'un qui utilise votre téléphone avec votre session ouverte.</p>
            </div>
            <div className="rounded-2xl border border-[#f0d4de] bg-[#fffafc] p-3">
              <p className="font-bold text-[#580e36]">En ligne (Supabase)</p>
              <p>Compte, profil (nom, prénom, téléphone), rappels et, pour les professionnels, demandes, annonces et fiches.</p>
            </div>
            <div className="rounded-2xl border border-[#f0d4de] bg-[#fffafc] p-3">
              <p className="font-bold text-[#580e36]">Rose IA (Gemini, Google)</p>
              <p>Seule votre question, anonymisée automatiquement, est envoyée. Avec l'offre gratuite, Google peut l'utiliser pour améliorer ses services : n'y écrivez rien de personnel.</p>
            </div>
            <button type="button" onClick={() => setShowPolitique(true)} className="text-xs font-bold text-[#ea2d6d] underline">
              Lire la politique de confidentialité
            </button>
            <div className="space-y-2 rounded-2xl border border-rose-200 bg-rose-50/60 p-3">
              <p className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                <ShieldAlert size={14} className="text-rose-700" /> Supprimer mes données
              </p>
              <p className="text-[10.5px] text-rose-800">
                {sessionReelle
                  ? "Supprime définitivement votre compte, toutes vos données en ligne et vos données de santé sur ce téléphone."
                  : "Aucun compte n'est connecté : rien n'est enregistré pour vous en ligne."}
              </p>
              <button
                type="button"
                onClick={() => setEtape("confirmation")}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-300 bg-white py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
              >
                <Trash2 size={13} /> Supprimer mes données
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 space-y-3 text-xs text-[#4d2d3e]">
            <p className="rounded-2xl border border-rose-300 bg-rose-50 p-3 font-semibold text-rose-900">
              Cette action est définitive. {sessionReelle ? "Votre compte, votre profil, vos rappels et vos demandes seront supprimés, ainsi que vos données de santé sur ce téléphone." : ""}
            </p>
            <label htmlFor="confirmation-suppression" className="block font-bold text-[#580e36]">
              Pour confirmer, tapez {MOT} :
            </label>
            <input
              id="confirmation-suppression"
              value={saisie}
              onChange={(e) => setSaisie(e.target.value)}
              autoComplete="off"
              className="w-full rounded-xl border border-rose-300 p-2 text-sm font-bold tracking-wider"
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => setEtape("resume")} className="flex-1 rounded-2xl border border-[#debcc8] py-2.5 font-bold text-[#6d4d5d]">
                Annuler
              </button>
              <button
                type="button"
                disabled={saisie.trim() !== MOT || enCours}
                onClick={() => void supprimer()}
                className="flex-1 rounded-2xl bg-rose-700 py-2.5 font-bold text-white disabled:opacity-40"
              >
                {enCours ? "Suppression…" : "Supprimer définitivement"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Paramètres de confidentialité et droit à l'oubli (mode démo : présentation d'origine).
 */
export function ModaleConfidentialite() {
  const {
    handleClearAllLocalData,
    handleSavePrivacySettings,
    privacySettings,
    setPrivacySettings,
    setShowPrivacyModal,
    showPrivacyModal,
  } = useSante();

  if (!showPrivacyModal) return null;
  if (MODE_REEL) return <ConfidentialiteReelle />;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:absolute sm:rounded-[36px]"
      onClick={() => setShowPrivacyModal(false)}
    >
      <div
        className="ph-enter max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl border border-[#ecd5df]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête du modal */}
        <div className="flex items-center justify-between border-b border-[#f2e1e7] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="ph-display text-sm font-bold text-[#580e36]">Confidentialité & Données</h3>
              <p className="text-[10px] text-emerald-700 font-bold">Zero Tracking · Local-First · Éthique Médicale</p>
            </div>
          </div>
          <button
            onClick={() => setShowPrivacyModal(false)}
            className="rounded-full p-1.5 text-[#725261] hover:bg-[#faedf2]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Contenu */}
        <div className="mt-3 space-y-3.5 text-xs">
          {/* Cartouche d'explication pédagogique */}
          <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-3.5 text-[#20432f] space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900">
              <Shield size={14} className="text-emerald-700" />
              <span>Nos engagements éthiques stricts</span>
            </div>
            <ul className="space-y-1.5 text-[11px] leading-relaxed text-[#2c523c]">
              <li className="flex items-start gap-1.5">
                <Check size={13} className="shrink-0 text-emerald-600 mt-0.5" />
                <span>
                  <strong>Aucune donnée personnelle n'est collectée</strong> par l'application sans votre demande
                  expresse. Vos règles et notes restent 100% sur votre téléphone.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check size={13} className="shrink-0 text-emerald-600 mt-0.5" />
                <span>
                  <strong>Entraînement de Rose IA</strong> : Seules les recommandations certifiées par les{" "}
                  <strong>docteurs, sages-femmes et associations</strong> alimentent l'IA pour la rendre naturelle,
                  empathique et culturellement adaptée (Français, Mooré, Dioula).
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check size={13} className="shrink-0 text-emerald-600 mt-0.5" />
                <span>
                  <strong>Partage médical sur demande uniquement</strong> : En cas de nodule suspect ou d'urgence, vous
                  choisissez explicitement si vous transmettez votre fiche à un centre.
                </span>
              </li>
            </ul>
          </div>

          {/* Paramètres interactifs / Toggles */}
          <div className="space-y-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#7a4c60]">
              Vos réglages de confidentialité
            </p>

            {/* Toggle 1 : Stockage 100% Local */}
            <label className="flex items-center justify-between rounded-xl border border-[#edd7e1] bg-[#fffcfd] p-3 cursor-pointer hover:bg-pink-50/50 transition">
              <div className="pr-2">
                <span className="font-bold text-[#580e36] text-xs block">Stockage 100% Local (Cycle & Calendrier)</span>
                <span className="text-[10px] text-[#785968] leading-tight block mt-0.5">
                  Vos dates de règles et autopalpations restent enregistrées uniquement dans la mémoire de cet appareil.
                </span>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.localOnlyCycle}
                onChange={(e) => setPrivacySettings({ ...privacySettings, localOnlyCycle: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#ea2d6d] focus:ring-[#ea2d6d]"
              />
            </label>

            {/* Toggle 2 : Protocoles cliniques IA */}
            <label className="flex items-center justify-between rounded-xl border border-[#edd7e1] bg-[#fffcfd] p-3 cursor-pointer hover:bg-pink-50/50 transition">
              <div className="pr-2">
                <span className="font-bold text-[#580e36] text-xs block">
                  Entraînement de Rose IA par les soignants
                </span>
                <span className="text-[10px] text-[#785968] leading-tight block mt-0.5">
                  Permet de recevoir les protocoles médicaux validés par les médecins du Burkina Faso pour des réponses
                  naturelles.
                </span>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.contributeAiClinical}
                onChange={(e) => setPrivacySettings({ ...privacySettings, contributeAiClinical: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#ea2d6d] focus:ring-[#ea2d6d]"
              />
            </label>

            {/* Toggle 3 : Soutien aux associations */}
            <label className="flex items-center justify-between rounded-xl border border-[#edd7e1] bg-[#fffcfd] p-3 cursor-pointer hover:bg-pink-50/50 transition">
              <div className="pr-2">
                <span className="font-bold text-[#580e36] text-xs block">
                  Statistiques anonymisées pour les Associations
                </span>
                <span className="text-[10px] text-[#785968] leading-tight block mt-0.5">
                  Aide les ONG (ex: ABAC, Espoir pour Demain) à cibler les campagnes de dépistage selon la fréquentation
                  régionale.
                </span>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.anonymizedAssociationData}
                onChange={(e) =>
                  setPrivacySettings({ ...privacySettings, anonymizedAssociationData: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-[#ea2d6d] focus:ring-[#ea2d6d]"
              />
            </label>

            {/* Toggle 4 : Partage clinique uniquement sur demande */}
            <label className="flex items-center justify-between rounded-xl border border-[#edd7e1] bg-[#fffcfd] p-3 cursor-pointer hover:bg-pink-50/50 transition">
              <div className="pr-2">
                <span className="font-bold text-[#580e36] text-xs block">
                  Transmission médicale sur demande expresse
                </span>
                <span className="text-[10px] text-[#785968] leading-tight block mt-0.5">
                  Exiger une confirmation par code PIN ou clic avant d'adresser une fiche d'orientation à un médecin
                  référent.
                </span>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.urgentClinicalConsent}
                onChange={(e) => setPrivacySettings({ ...privacySettings, urgentClinicalConsent: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#ea2d6d] focus:ring-[#ea2d6d]"
              />
            </label>
          </div>

          {/* Section Droit à l'oubli / Purge */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-rose-700" /> Droit à l'oubli immédiat
              </span>
              <span className="text-[9.5px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                RGPD & Éthique
              </span>
            </div>
            <p className="text-[10.5px] text-rose-800 leading-snug">
              Vous pouvez à tout moment effacer instantanément l'ensemble de votre historique, vos rappels et vos
              messages stockés sur ce téléphone.
            </p>
            <button
              onClick={handleClearAllLocalData}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white border border-rose-300 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-xs"
            >
              <RotateCcw size={13} /> Purger toutes mes données locales
            </button>
          </div>

          {/* Bouton de sauvegarde */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="flex-1 rounded-2xl border border-[#debcc8] py-2.5 font-bold text-[#6d4d5d]"
            >
              Fermer
            </button>
            <button
              onClick={handleSavePrivacySettings}
              className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 py-2.5 font-bold text-white shadow-md hover:from-emerald-500 hover:to-teal-600 transition"
            >
              Enregistrer mes choix
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
