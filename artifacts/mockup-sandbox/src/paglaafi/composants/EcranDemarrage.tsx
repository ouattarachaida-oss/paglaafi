import { ChevronRight } from "lucide-react";
import { hapticFeedback } from "../lib/haptique";
import { MODE_DEMO } from "../config";
import { useAuth, useDemarrage } from "../etat/contextes";

/**
 * Écran de démarrage (Splash Screen de 5 secondes) :
 * Affiche l'illustration des héroïnes intégrant harmonieusement dans sa partie
 * blanche inférieure : le logo PagLaafi, le slogan officiel, la description
 * de la plateforme et l'indicateur de progression fluide.
 */
export function EcranDemarrage() {
  const { setCurrentUser } = useAuth();
  const { setShowSplash, showSplash, splashProgress } = useDemarrage();
  if (!showSplash) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-between overflow-y-auto bg-nuit px-3 py-3 text-white sm:px-4 sm:py-4">
      {/* Barre supérieure : Pays et bouton Passer */}
      <div className="mx-auto flex w-full max-w-md items-center justify-between shrink-0">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-petit font-medium text-white/90">
          <span aria-hidden>🇧🇫</span> Burkina Faso
        </span>
        <button
          type="button"
          onClick={() => {
            hapticFeedback(15);
            setShowSplash(false);
            if (MODE_DEMO) setCurrentUser(null);
          }}
          className="inline-flex min-h-10 items-center gap-1 rounded-full bg-white/10 px-3.5 text-petit font-semibold text-white transition-colors hover:bg-white/20 active:bg-white/30"
          aria-label="Passer l'écran de chargement"
        >
          Passer <ChevronRight size={16} aria-hidden />
        </button>
      </div>

      {/* Carte unifiée des héroïnes avec logo et texte intégrés dans la zone blanche */}
      <div className="relative mx-auto my-auto flex aspect-[9/16] max-h-[calc(100dvh-95px)] w-full max-w-[380px] flex-col justify-end overflow-hidden rounded-[28px] bg-white shadow-2xl sm:max-w-[420px]">
        {/* Image des héroïnes en fond */}
        <img
          src="/images/splash-paglaafi-heroines.webp"
          alt="Des femmes et une soignante réunies autour du ruban rose de la lutte contre le cancer du sein"
          className="absolute inset-0 h-full w-full object-cover object-top"
          width={576}
          height={1024}
        />

        {/* Contenu textuel et logo positionnés dans la zone blanche inférieure de l'image */}
        <div className="relative z-10 flex flex-col items-center px-4 pb-4 pt-2 text-center sm:px-6 sm:pb-6">
          {/* Logo officiel PagLaafi */}
          <img
            src="/images/pinkhub-mvp-paglaafi.webp"
            alt="Logo PagLaafi"
            className="h-14 w-auto object-contain drop-shadow-sm sm:h-18"
            width={72}
            height={72}
          />

          {/* Slogan officiel */}
          <h1 className="mt-2 text-sous-titre font-bold leading-tight text-prune-900 sm:text-titre">
            Mieux informée · Mieux orientée · Jamais seule
          </h1>

          {/* Description officielle de la plateforme */}
          <p className="mt-1.5 max-w-[320px] text-petit font-medium leading-relaxed text-texte-2 sm:text-corps">
            Plateforme d'information, d'orientation et de sensibilisation sur le cancer du sein et la santé de la femme au Burkina Faso
          </p>

          {/* Barre de progression fluide sur 5 secondes */}
          <div
            className="mt-3.5 flex w-full max-w-[180px] flex-col items-center gap-1"
            role="progressbar"
            aria-label="Chargement de l'application"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(splashProgress)}
          >
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-rose-200">
              <div
                className="h-full rounded-full bg-action transition-all duration-100 ease-linear"
                style={{ width: `${splashProgress}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold tracking-wider text-indicatif uppercase">
              Chargement…
            </span>
          </div>
        </div>
      </div>

      {/* Signature discrète en bas d'écran */}
      <div className="mx-auto w-full max-w-md shrink-0 text-center">
        <span className="text-[11px] text-white/50">
          PagLaafi © {new Date().getFullYear()} — Ensemble contre le cancer du sein
        </span>
      </div>
    </div>
  );
}
