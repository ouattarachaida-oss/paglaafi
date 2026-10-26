import { ChevronRight, HeartHandshake, MapPin, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import { hapticFeedback } from "../lib/haptique";
import { useAuth, useDemarrage } from "../etat/contextes";

/**
 * Écran de démarrage (5 secondes) avec bouton « Passer ».
 */
export function EcranDemarrage() {
  const { setCurrentUser } = useAuth();
  const { setShowSplash, showSplash, splashProgress } = useDemarrage();

  if (!showSplash) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-between overflow-hidden bg-[#fff0f5] text-[#580e36] ph-enter sm:rounded-[36px]">
      {/* Image de fond plein écran : Femmes & Médecin en blouse avec rubans roses */}
      <div className="absolute inset-0">
        <img
          src="/images/splash-paglaafi-heroines.jpg"
          alt="Solidarité PagLaafi - Lutte contre le cancer du sein au Burkina Faso"
          className="h-full w-full object-cover object-top transform scale-100 transition-transform duration-5000 ease-out"
        />
        {/* Voile supérieur subtil pour contraster l'en-tête sans masquer les visages */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/70 via-white/20 to-transparent pointer-events-none" />
        {/* Voile inférieur dégradé doux pour assurer la lisibilité sur la partie texte */}
        <div className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-[#fff5f8] via-[#fff5f8]/95 via-45% to-transparent pointer-events-none" />
      </div>

      {/* En-tête du Splash : Drapeau et bouton passer */}
      <div className="relative z-10 flex items-center justify-between p-4 pt-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-pink-300/60 bg-white/85 px-3 py-1.5 text-[11px] font-bold text-[#580e36] backdrop-blur-md shadow-xs">
          <span>🇧🇫</span>
          <span>Burkina Faso</span>
        </div>

        <button
          type="button"
          onClick={() => {
            hapticFeedback(15);
            setShowSplash(false);
            setCurrentUser(null);
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-pink-300/60 bg-white/85 px-3.5 py-1.5 text-[11px] font-bold text-[#580e36] backdrop-blur-md hover:bg-white transition shadow-xs active:scale-95"
        >
          <span>Passer</span>
          <ChevronRight size={13} className="text-[#ea2d6d]" />
        </button>
      </div>

      {/* Pied de page du Splash : Logo agrandi, Titre, Slogan, Icônes réorganisées et barre de chargement de 5 secondes */}
      <div className="relative z-10 p-5 pb-7 text-center">
        {/* Logo PagLaafi agrandi avec mise en valeur */}
        <div className="mx-auto mb-2.5 flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-2.5 shadow-[0_10px_25px_rgba(234,45,109,0.22)] ring-4 ring-[#ea2d6d]/20 transition-transform duration-300 hover:scale-105">
          <img src="/images/pinkhub-mvp-paglaafi.png" alt="Logo PagLaafi" className="h-full w-full object-contain" />
        </div>

        <h1 className="ph-display text-3xl font-extrabold tracking-tight text-[#580e36] drop-shadow-xs">PagLaafi</h1>
        <p className="mt-1 text-[13px] font-bold text-[#ea2d6d] tracking-wide">
          Mieux s'informer · Mieux s'orienter · Jamais seule
        </p>
        <p className="mx-auto mt-1 max-w-[320px] text-[11px] font-medium leading-tight text-[#783e58]">
          Sensibilisation, dépistage précoce du cancer du sein & accompagnement solidaire au Burkina Faso
        </p>

        {/* Icônes de réassurance et services clés réorganisées */}
        <div className="mx-auto mt-3 flex items-center justify-center gap-2 max-w-[360px]">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-200/90 bg-white/90 px-2.5 py-1 text-[10.5px] font-semibold text-[#580e36] shadow-xs backdrop-blur-sm">
            <Stethoscope size={12} className="text-[#ea2d6d]" />
            <span>Dépistage</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-200/90 bg-white/90 px-2.5 py-1 text-[10.5px] font-semibold text-[#580e36] shadow-xs backdrop-blur-sm">
            <MapPin size={12} className="text-[#ea2d6d]" />
            <span>Centres de santé</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-200/90 bg-white/90 px-2.5 py-1 text-[10.5px] font-semibold text-[#580e36] shadow-xs backdrop-blur-sm">
            <HeartHandshake size={12} className="text-[#ea2d6d]" />
            <span>Écoute solidaire</span>
          </div>
        </div>

        {/* Barre de progression animée de 5 secondes */}
        <div className="mx-auto mt-4 max-w-[270px]">
          <div className="h-2 w-full overflow-hidden rounded-full bg-pink-200/60 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#580e36] via-[#ea2d6d] to-pink-400 transition-all duration-75 ease-linear shadow-[0_0_10px_rgba(234,45,109,0.7)]"
              style={{ width: `${splashProgress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10.5px] font-semibold text-[#6a2948]">
            <span className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-[#ea2d6d] animate-spin" />
              <span>Chargement de votre espace santé...</span>
            </span>
            <span className="font-mono text-[11px] font-bold text-[#580e36]">
              {Math.max(0, Math.ceil((5000 - splashProgress * 50) / 1000))}s
            </span>
          </div>
        </div>

        {/* Badge d'autorité et précision en bas */}
        <div className="mt-3.5 inline-flex items-center gap-2 rounded-full border border-pink-300/80 bg-white/90 px-3.5 py-1.5 text-[10.5px] font-bold text-[#580e36] shadow-xs backdrop-blur-md">
          <ShieldCheck size={13} className="text-[#ea2d6d]" />
          <span>Plateforme Nationale de Santé · Propulsé par Rose IA</span>
        </div>
      </div>
    </div>
  );
}
