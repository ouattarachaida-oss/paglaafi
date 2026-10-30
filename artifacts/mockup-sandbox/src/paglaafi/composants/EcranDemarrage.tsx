import { ChevronRight } from "lucide-react";
import { hapticFeedback } from "../lib/haptique";
import { MODE_DEMO } from "../config";
import { useAuth, useDemarrage } from "../etat/contextes";

/**
 * Écran de démarrage PagLaafi (Splash Screen de 5 secondes) :
 * Design haute qualité, harmonieux et contrasté :
 * - Carte centrale élégante avec illustration des héroïnes
 * - Logo officiel PagLaafi, slogan et description officielle avec des couleurs
 *   profondes fixées (#4a0e2e / #5c3e4e) pour garantir une visibilité parfaite
 *   en mode clair comme en mode sombre (contraste AAA sur fond blanc).
 * - Barre de progression fluide 5 secondes.
 */
export function EcranDemarrage() {
  const { setCurrentUser } = useAuth();
  const { setShowSplash, showSplash, splashProgress } = useDemarrage();
  if (!showSplash) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-between overflow-y-auto bg-[#1a0a14] px-3 py-3 text-white sm:px-4 sm:py-5">
      {/* Barre supérieure : Drapeau / Pays et bouton Passer */}
      <div className="mx-auto flex w-full max-w-md items-center justify-between shrink-0">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3.5 py-1 text-petit font-medium text-white/90 backdrop-blur-md">
          <span aria-hidden>🇧🇫</span> Burkina Faso
        </span>
        <button
          type="button"
          onClick={() => {
            hapticFeedback(15);
            setShowSplash(false);
            if (MODE_DEMO) setCurrentUser(null);
          }}
          className="inline-flex min-h-10 items-center gap-1 rounded-full border border-white/10 bg-white/10 px-4 text-petit font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 active:bg-white/30"
          aria-label="Passer l'écran de chargement"
        >
          Passer <ChevronRight size={16} aria-hidden />
        </button>
      </div>

      {/* Carte centrale élégante et unifiée en format mobile vertical complet */}
      <div className="relative mx-auto my-auto flex aspect-[9/16] max-h-[calc(100dvh-95px)] w-full max-w-[380px] flex-col justify-end overflow-hidden rounded-[32px] bg-[#1a0a14] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] ring-1 ring-white/10 sm:max-w-[420px]">
        {/* Image complète et majestueuse des héroïnes en fond pleine hauteur */}
        <img
          src="/images/splash-paglaafi-heroines.webp"
          alt="Des femmes et une soignante réunies autour du ruban rose"
          className="absolute inset-0 h-full w-full object-cover object-top"
          width={576}
          height={1024}
        />

        {/* Dégradé doux et lumineux assurant la transition entre l'illustration et la zone de lecture */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[56%] bg-gradient-to-t from-white via-white/95 to-transparent"
          aria-hidden
        />

        {/* Contenu textuel et indicateurs sur fond lumineux ultra-lisible */}
        <div className="relative z-10 flex flex-col items-center px-5 pb-5 pt-2 text-center text-[#4a0e2e] sm:px-6 sm:pb-6">
          {/* Logo officiel PagLaafi dans un cartouche blanc surélevé et soigné */}
          <div className="grid h-16 w-16 place-items-center rounded-2xl border border-[#fae1ea] bg-white p-2 shadow-[0_6px_20px_rgba(88,14,54,0.12)] sm:h-20 sm:w-20">
            <img
              src="/images/pinkhub-mvp-paglaafi.webp"
              alt="Logo PagLaafi"
              className="h-full w-full object-contain"
              width={80}
              height={80}
            />
          </div>

          {/* Slogan officiel en prune profond (#4a0e2e) ultra contrasté et net */}
          <h1 className="mt-3 text-lg font-extrabold leading-snug tracking-tight text-[#4a0e2e] sm:text-xl">
            Mieux informée · Mieux orientée · Jamais seule
          </h1>

          {/* Séparateur décoratif discret avec perle ruban rose */}
          <div className="my-2 flex items-center justify-center gap-2" aria-hidden>
            <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#e87a9f]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#d41e5c]" />
            <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#e87a9f]" />
          </div>

          {/* Description officielle de la plateforme (#5c3e4e : foncé, net et classe) */}
          <p className="max-w-[310px] text-xs font-medium leading-relaxed text-[#5c3e4e] sm:max-w-[340px] sm:text-sm">
            Plateforme d'information, d'orientation et de sensibilisation sur le cancer du sein et la santé de la femme au Burkina Faso
          </p>

          {/* Barre de progression fluide de 5 secondes */}
          <div
            className="mt-3.5 flex w-full max-w-[200px] flex-col items-center gap-1.5"
            role="progressbar"
            aria-label="Chargement de l'application"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(splashProgress)}
          >
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#fde8ef]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#ea2d6d] to-[#d41e5c] shadow-[0_0_8px_rgba(212,30,92,0.35)] transition-all duration-100 ease-linear"
                style={{ width: `${splashProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8a5b71]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d41e5c]" />
              <span>Ouverture en cours…</span>
            </div>
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
