import { ChevronRight } from "lucide-react";
import { hapticFeedback } from "../lib/haptique";
import { MODE_DEMO } from "../config";
import { useAuth, useDemarrage } from "../etat/contextes";

/**
 * Écran de démarrage (5 secondes) : fond nuit, illustration des héroïnes, logo,
 * phrase d'accroche, points de progression et bouton « Passer ».
 */
export function EcranDemarrage() {
  const { setCurrentUser } = useAuth();
  const { setShowSplash, showSplash, splashProgress } = useDemarrage();
  if (!showSplash) return null;

  // 3 points : chacun se remplit sur un tiers des 5 secondes
  const etape = Math.min(2, Math.floor(splashProgress / 34));

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-nuit text-white">
      <div className="mx-auto flex min-h-full max-w-md flex-col px-4 pb-8 pt-4 md:max-w-lg">
        <div className="flex items-center justify-between">
          <span className="text-petit font-medium text-white/80">Burkina Faso</span>
          <button
            type="button"
            onClick={() => {
              hapticFeedback(15);
              setShowSplash(false);
              if (MODE_DEMO) setCurrentUser(null);
            }}
            className="inline-flex min-h-11 items-center gap-1 rounded-full bg-white/10 px-4 text-petit font-semibold text-white active:bg-white/20"
          >
            Passer <ChevronRight size={18} aria-hidden />
          </button>
        </div>

        <img
          src="/images/splash-paglaafi-heroines.webp"
          alt="Des femmes et une soignante réunies autour du ruban rose de la lutte contre le cancer du sein"
          className="mt-4 aspect-[4/5] w-full rounded-[28px] object-cover object-top"
          width={576}
          height={1024}
        />

        <div className="mt-6 flex items-center gap-3">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-carte bg-white p-1.5">
            <img src="/images/pinkhub-mvp-paglaafi.webp" alt="" className="h-full w-full object-contain" width={48} height={48} />
          </span>
          <h1 className="text-display text-white">PagLaafi</h1>
        </div>
        <p className="mt-3 text-sous-titre text-[#ffb3cc]">Mieux s'informer · Mieux s'orienter · Jamais seule</p>
        <p className="mt-2 text-corps text-white/80">
          Sensibilisation, dépistage précoce du cancer du sein et accompagnement solidaire au Burkina Faso.
        </p>

        <div className="mt-auto flex items-center justify-center gap-2 pt-8" role="progressbar" aria-label="Chargement" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(splashProgress)}>
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-2 rounded-full transition-all duration-200 ${i <= etape ? "w-8 bg-[#ff6f9f]" : "w-2 bg-white/30"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
