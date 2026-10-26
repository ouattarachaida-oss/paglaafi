import { Check, Download, Smartphone, Sparkles, X } from "lucide-react";
import { useUi } from "../etat/contextes";

/**
 * Guide d'installation de l'application sur smartphone.
 */
export function ModaleInstallationPwa() {
  const { deferredPrompt, handleTriggerInstall, setShowPwaInstallModal, showPwaInstallModal } = useUi();

  if (!showPwaInstallModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]"
      onClick={() => setShowPwaInstallModal(false)}
    >
      <div
        className="ph-enter w-full max-w-sm rounded-[28px] bg-white p-5 text-[#351c2a] shadow-2xl border-2 border-[#ea2d6d]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-tr from-[#6c1543] to-[#ba486e] text-white shadow-sm">
              <Smartphone size={20} />
            </div>
            <div>
              <h3 className="ph-display text-sm font-bold text-[#580e36]">Installer PagLaafi</h3>
              <p className="text-[10px] text-emerald-700 font-bold">Application Mobile Autonome</p>
            </div>
          </div>
          <button
            onClick={() => setShowPwaInstallModal(false)}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-3.5 space-y-3 text-xs">
          <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-[#fff8fa] p-3.5 border border-pink-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#863550]">
              <Sparkles size={14} className="text-amber-500" />
              <span>Pourquoi installer l'application ?</span>
            </div>
            <ul className="space-y-1 text-[11px] text-[#6b4757]">
              <li className="flex items-center gap-1.5">
                <Check size={12} className="text-emerald-600 shrink-0" />
                <span>
                  <strong>Accès 100% Hors-Ligne</strong> sans consommer vos données internet
                </span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={12} className="text-emerald-600 shrink-0" />
                <span>
                  <strong>Plein écran tactile</strong> sans barre d'adresse de navigateur
                </span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={12} className="text-emerald-600 shrink-0" />
                <span>
                  <strong>Sauvegarde continue</strong> de votre cycle et autopalpation
                </span>
              </li>
            </ul>
          </div>

          {/* Guide selon le système */}
          <div className="rounded-2xl bg-slate-50 p-3 border border-slate-200 space-y-2">
            <p className="font-bold text-[#580e36] text-[11.5px] flex items-center justify-between">
              <span>📱 Guide d'installation rapide :</span>
              <span className="text-[9.5px] font-bold text-slate-500">Android & iOS</span>
            </p>

            <div className="space-y-2 text-[10.5px] text-slate-700">
              <div className="rounded-xl bg-white p-2 border border-slate-200">
                <span className="font-bold text-[#8a3350] block">🤖 Sur Android (Chrome / Samsung) :</span>
                <span>
                  Si le bouton ci-dessous ne s'affiche pas, ouvrez le menu <strong>(⋮)</strong> en haut à droite du
                  navigateur puis choisissez <strong>« Installer l'application »</strong> ou « Ajouter à l'écran
                  d'accueil ».
                </span>
              </div>

              <div className="rounded-xl bg-white p-2 border border-slate-200">
                <span className="font-bold text-[#8a3350] block">🍎 Sur iPhone / iPad (Safari) :</span>
                <span>
                  1. Touchez le bouton <strong>Partager ⎋</strong> (carré avec flèche en bas d'écran).
                  <br />
                  2. Faites défiler et touchez <strong>« Sur l'écran d'accueil » ➕</strong>.<br />
                  3. Validez avec <strong>« Ajouter »</strong>.
                </span>
              </div>
            </div>
          </div>

          {deferredPrompt ? (
            <button
              onClick={handleTriggerInstall}
              className="w-full rounded-2xl bg-gradient-to-r from-[#ea2d6d] to-[#580e36] py-3 text-xs font-bold text-white shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2"
            >
              <Download size={15} />
              <span>Installer maintenant en 1-clic</span>
            </button>
          ) : (
            <button
              onClick={() => setShowPwaInstallModal(false)}
              className="w-full rounded-2xl bg-[#ea2d6d] py-2.5 text-xs font-bold text-white shadow hover:bg-[#8d3754] transition"
            >
              J'ai compris ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
