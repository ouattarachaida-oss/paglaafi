import { AlertTriangle, Check, Copy, FileText, Share2, Stethoscope, X } from "lucide-react";
import { useUi, useCentres, useOrientations } from "../etat/contextes";

/**
 * Orientation d'urgence d'une patiente vers un centre (docteur).
 */
export function ModaleOrientation() {
  const { notify } = useUi();
  const { centers } = useCentres();
  const {
    generatedOrientationCode,
    handleCreatePatientOrientation,
    orientationForm,
    setGeneratedOrientationCode,
    setOrientationForm,
    setShowOrientationModal,
    showOrientationModal,
  } = useOrientations();

  if (!showOrientationModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:absolute sm:rounded-[36px]"
      onClick={() => {
        setShowOrientationModal(false);
        setGeneratedOrientationCode(null);
      }}
    >
      <div
        className="ph-enter max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-5 text-[#351c2a] shadow-2xl border-2 border-rose-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-rose-700 to-[#ea2d6d] text-white shadow-sm">
              <Stethoscope size={20} />
            </div>
            <div>
              <h3 className="ph-display text-sm font-bold text-[#580e36]">Orientation Médicale d'Urgence</h3>
              <p className="text-[10px] text-rose-600 font-bold">Docteur ➔ Centre de Santé Partenaire</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowOrientationModal(false);
              setGeneratedOrientationCode(null);
            }}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {generatedOrientationCode ? (
          /* ÉCRAN DE CONFIRMATION / REÇU D'ORIENTATION OFFICIEL */
          <div className="mt-4 space-y-3.5 text-xs">
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-white shadow-md">
                <Check size={26} />
              </div>
              <h4 className="ph-display mt-2 text-base font-bold text-emerald-950">Orientation émise avec succès !</h4>
              <p className="mt-1 text-xs text-emerald-800">Le centre cible a été alerté en priorité.</p>
              <div className="mt-3 rounded-xl bg-white p-2.5 border border-emerald-300">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">
                  Code d'Orientation Sécurisé :
                </span>
                <span className="font-mono text-base font-extrabold text-[#580e36] tracking-wider select-all">
                  {generatedOrientationCode}
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#fdf2f6] p-3 border border-[#fce4ec] space-y-1.5 text-[11px] text-[#580e36]">
              <div className="flex justify-between">
                <span className="text-gray-500">Patiente :</span>
                <span className="font-bold">{orientationForm.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Centre désigné :</span>
                <span className="font-bold">
                  {centers.find((c) => c.id === Number(orientationForm.targetCenterId))?.shortName || "CMA Schiphra"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Niveau d'urgence :</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                    orientationForm.urgencyLevel === "immediate"
                      ? "bg-rose-600 text-white"
                      : orientationForm.urgencyLevel === "priority"
                        ? "bg-amber-500 text-white"
                        : "bg-blue-600 text-white"
                  }`}
                >
                  {orientationForm.urgencyLevel === "immediate"
                    ? "🚨 Immédiat (< 24h)"
                    : orientationForm.urgencyLevel === "priority"
                      ? "⚠️ Prioritaire (48h-72h)"
                      : "ℹ️ Routine"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Examens prescrits :</span>
                <span className="font-bold">{orientationForm.recommendedExam}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  const targetCenter =
                    centers.find((c) => c.id === Number(orientationForm.targetCenterId))?.shortName || "CMA Schiphra";
                  const msg = `Bonjour Mme ${orientationForm.patientName}, voici votre fiche d'orientation urgente PagLaafi vers le ${targetCenter}. Code d'urgence : ${generatedOrientationCode}. Présentez-vous directement au centre sans attente.`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition cursor-pointer"
              >
                <Share2 size={14} /> WhatsApp Patiente
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(generatedOrientationCode);
                  notify(`Code ${generatedOrientationCode} copié !`);
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-700 transition cursor-pointer"
              >
                <Copy size={14} /> Copier le code
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowOrientationModal(false);
                setGeneratedOrientationCode(null);
              }}
              className="w-full rounded-2xl bg-[#ea2d6d] py-2.5 text-xs font-bold text-white shadow hover:bg-[#d81f5c] transition cursor-pointer"
            >
              Fermer la fiche
            </button>
          </div>
        ) : (
          /* FORMULAIRE D'ORIENTATION D'URGENCE */
          <form onSubmit={handleCreatePatientOrientation} className="mt-3.5 space-y-3.5 text-xs">
            {/* ALERTE CRÉDIBILITÉ MÉDICALE */}
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3 text-rose-950">
              <p className="font-bold text-xs flex items-center gap-1.5 text-rose-900">
                <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                Priorité médicale absolue
              </p>
              <p className="text-[11px] text-rose-900/90 mt-1 leading-relaxed">
                L'orientation médicale permet de court-circuiter les files d'attente habituelles pour faire passer une
                mammographie ou une échographie en urgence dans un centre équipé.
              </p>
            </div>

            {/* 1. DEGRÉ D'URGENCE AU PREMIER PLAN */}
            <div>
              <label className="block text-[11px] font-bold text-[#580e36] mb-1.5">
                1. Degré d'urgence clinique (Priorité) :
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  {
                    level: "immediate" as const,
                    title: "🚨 Immédiat",
                    sub: "Moins de 24h",
                    activeBg: "bg-rose-600 text-white border-rose-700 ring-2 ring-rose-400",
                  },
                  {
                    level: "priority" as const,
                    title: "⚠️ Prioritaire",
                    sub: "48h à 72h",
                    activeBg: "bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300",
                  },
                  {
                    level: "routine" as const,
                    title: "ℹ️ Routine",
                    sub: "< 15 jours",
                    activeBg: "bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300",
                  },
                ].map((urg) => (
                  <button
                    key={urg.level}
                    type="button"
                    onClick={() => setOrientationForm({ ...orientationForm, urgencyLevel: urg.level as any })}
                    className={`flex flex-col items-center justify-center rounded-xl p-2 border-2 text-center transition cursor-pointer ${
                      orientationForm.urgencyLevel === urg.level
                        ? urg.activeBg
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-[11px] font-extrabold">{urg.title}</span>
                    <span className="text-[9.5px] font-bold opacity-90">{urg.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. CENTRE DE SANTÉ CIBLE */}
            <div>
              <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
                2. Centre de santé de destination :
              </label>
              <select
                value={orientationForm.targetCenterId}
                onChange={(e) => setOrientationForm({ ...orientationForm, targetCenterId: Number(e.target.value) })}
                className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs font-semibold text-[#580e36] focus:border-[#ea2d6d] focus:outline-hidden"
              >
                {centers.map((c) => (
                  <option key={c.id} value={c.id}>
                    🏥 {c.shortName} — {c.place} ({c.statusLabel})
                  </option>
                ))}
              </select>
            </div>

            {/* 3. COORDONNÉES PATIENTE */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">Nom de la patiente :</label>
                <input
                  type="text"
                  value={orientationForm.patientName}
                  onChange={(e) => setOrientationForm({ ...orientationForm, patientName: e.target.value })}
                  placeholder="Ex: K. Fatoumata"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#ea2d6d] focus:outline-hidden"
                  required
                />
              </div>
              <div>
                <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">Téléphone :</label>
                <input
                  type="tel"
                  value={orientationForm.patientPhone}
                  onChange={(e) => setOrientationForm({ ...orientationForm, patientPhone: e.target.value })}
                  placeholder="Ex: 70 88 99 00"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#ea2d6d] focus:outline-hidden"
                  required
                />
              </div>
            </div>

            {/* 4. EXAMENS DEMANDÉS */}
            <div>
              <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
                4. Examens prescrits en urgence :
              </label>
              <select
                value={orientationForm.recommendedExam}
                onChange={(e) => setOrientationForm({ ...orientationForm, recommendedExam: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs font-semibold text-[#580e36] focus:border-[#ea2d6d] focus:outline-hidden"
              >
                <option value="Mammographie numérique bilatérale + Échographie mammaire">
                  Mammographie numérique bilatérale + Échographie mammaire (Pack complet)
                </option>
                <option value="Échographie mammaire haute résolution">
                  Échographie mammaire haute résolution isolée
                </option>
                <option value="Mammographie numérique de dépistage diagnostique">
                  Mammographie numérique de dépistage diagnostique
                </option>
                <option value="Biopsie mammaire / Cytoponction d'urgence">
                  Biopsie mammaire / Cytoponction d'urgence
                </option>
              </select>
            </div>

            {/* 5. MOTIF CLINIQUE / OBSERVATIONS */}
            <div>
              <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
                5. Motif clinique & Signes d'appel :
              </label>
              <textarea
                rows={2}
                value={orientationForm.clinicalObservations}
                onChange={(e) => setOrientationForm({ ...orientationForm, clinicalObservations: e.target.value })}
                placeholder="Ex: Masse rétro-aréolaire droite de 2.5 cm, indolore..."
                className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#ea2d6d] focus:outline-hidden"
                required
              />
            </div>

            {/* Bouton de confirmation */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-rose-600 to-[#ea2d6d] py-3 text-xs font-bold text-white shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText size={16} />
                <span>Émettre l'orientation d'urgence vers le centre</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
