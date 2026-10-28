import { Check, Edit3, X } from "lucide-react";
import { useCentres } from "../etat/contextes";

/**
 * Mise à jour des disponibilités d'un centre (admin centre / docteur).
 */
export function ModaleMiseAJourCentre() {
  const {
    centerUpdateData,
    handleSaveCenterUpdate,
    setCenterUpdateData,
    setShowCenterUpdateModal,
    showCenterUpdateModal,
  } = useCentres();

  if (!(showCenterUpdateModal && centerUpdateData)) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:absolute sm:rounded-[36px]"
      onClick={() => setShowCenterUpdateModal(false)}
    >
      <div
        className="ph-enter max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-5 text-[#351c2a] shadow-2xl border-2 border-[#ea2d6d]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-[#fce4ec] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-[#580e36] to-[#ea2d6d] text-white shadow-sm">
              <Edit3 size={18} />
            </div>
            <div>
              <h3 className="ph-display text-sm font-bold text-[#580e36]">Mise à jour du Centre</h3>
              <p className="text-[10px] text-[#ea2d6d] font-bold">{centerUpdateData.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCenterUpdateModal(false)}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulaire de mise à jour */}
        <form onSubmit={handleSaveCenterUpdate} className="mt-3.5 space-y-3.5 text-xs">
          {/* 1. Statut opérationnel & Affluence */}
          <div>
            <label className="block text-[11px] font-bold text-[#580e36] mb-1">
              Statut d'accueil et affluence en direct :
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                {
                  value: "available",
                  label: "Disponible",
                  sub: "Attente fluide",
                  color: "border-emerald-500 bg-emerald-50 text-emerald-800",
                  dot: "bg-emerald-500",
                },
                {
                  value: "busy",
                  label: "Affluence",
                  sub: "Attente moyenne",
                  color: "border-amber-500 bg-amber-50 text-amber-900",
                  dot: "bg-amber-500",
                },
                {
                  value: "maintenance",
                  label: "Maintenance",
                  sub: "Appareil arrêté",
                  color: "border-rose-500 bg-rose-50 text-rose-800",
                  dot: "bg-rose-500",
                },
              ].map((st) => (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => {
                    setCenterUpdateData({
                      ...centerUpdateData,
                      status: st.value as any,
                      statusLabel:
                        st.value === "available"
                          ? "Disponible · Attente fluide"
                          : st.value === "busy"
                            ? "Forte affluence · Prévoir attente"
                            : "Maintenance technique · Arrêt temporaire",
                      statusColor: st.dot,
                    });
                  }}
                  className={`flex flex-col items-center justify-center rounded-xl p-2 border-2 transition cursor-pointer ${
                    centerUpdateData.status === st.value
                      ? `${st.color} font-bold shadow-xs`
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${st.dot} mb-1`} />
                  <span className="text-[11px] font-bold">{st.label}</span>
                  <span className="text-[9px] opacity-80">{st.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Temps d'attente estimé & File d'attente */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">Temps d'attente estimé :</label>
              <input
                type="text"
                value={centerUpdateData.estimatedWait}
                onChange={(e) => setCenterUpdateData({ ...centerUpdateData, estimatedWait: e.target.value })}
                placeholder="Ex: ~15 à 20 min"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#ea2d6d] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">Patientes dans la file :</label>
              <input
                type="number"
                value={centerUpdateData.queueCount}
                onChange={(e) =>
                  setCenterUpdateData({
                    ...centerUpdateData,
                    queueCount: Number(e.target.value) || 0,
                  })
                }
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#ea2d6d] focus:outline-hidden"
              />
            </div>
          </div>

          {/* 3. État du mammographe numérique */}
          <div className="rounded-2xl bg-[#fdf2f6] p-3 border border-[#fce4ec]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-[#580e36] text-[11px]">Mammographe numérique en service :</p>
                <p className="text-[10px] text-[#785566]">
                  {centerUpdateData.isApparatusWorking
                    ? "✓ L'appareil fonctionne à 100%"
                    : "⚠️ Appareil en panne ou calibration"}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setCenterUpdateData({
                    ...centerUpdateData,
                    isApparatusWorking: !centerUpdateData.isApparatusWorking,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer ${
                  centerUpdateData.isApparatusWorking ? "bg-emerald-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    centerUpdateData.isApparatusWorking ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <input
              type="text"
              value={centerUpdateData.apparatus}
              onChange={(e) => setCenterUpdateData({ ...centerUpdateData, apparatus: e.target.value })}
              className="mt-2 w-full rounded-xl border border-pink-200 bg-white px-2.5 py-1.5 text-xs text-[#580e36]"
            />
          </div>

          {/* 4. Personnel et agents présents */}
          <div>
            <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">Équipe présente aujourd'hui :</label>
            <input
              type="text"
              value={centerUpdateData.staffDescription}
              onChange={(e) => setCenterUpdateData({ ...centerUpdateData, staffDescription: e.target.value })}
              placeholder="Ex: 2 sages-femmes, 1 radiologue en poste"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#ea2d6d] focus:outline-hidden"
            />
          </div>

          {/* 5. Message audio / Consigne du jour */}
          <div>
            <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
              Consigne du jour aux patientes :
            </label>
            <textarea
              rows={2}
              value={centerUpdateData.audioMessageFr}
              onChange={(e) => setCenterUpdateData({ ...centerUpdateData, audioMessageFr: e.target.value })}
              className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#ea2d6d] focus:outline-hidden"
            />
          </div>

          {/* Bouton de soumission */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-[#580e36] to-[#ea2d6d] py-3 text-xs font-bold text-white shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check size={16} />
              <span>Enregistrer et publier sur la carte en direct</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
