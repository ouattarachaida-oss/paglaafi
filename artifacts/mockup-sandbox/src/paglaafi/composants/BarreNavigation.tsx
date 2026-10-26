import { BookOpen, Gift, Heart, MapPin, Sparkles } from "lucide-react";
import type { Section } from "../types";
import { hapticFeedback } from "../lib/haptique";
import { useUi, useAuth, useCentres, useDons } from "../etat/contextes";

/**
 * Barre de navigation inférieure (affichée quand un profil est connecté).
 */
export function BarreNavigation() {
  const { section, setSection } = useUi();
  const { currentUser } = useAuth();
  const { setSelectedCenter } = useCentres();
  const { setShowDonationModal } = useDons();

  if (!currentUser) return null;

  return (
    <nav
      aria-label="Navigation principale"
      className="z-30 shrink-0 border-t border-[#f0dee3] bg-white/95 backdrop-blur-md px-1 pb-[max(10px,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-8px_25px_rgba(75,30,50,.07)]"
    >
      <div className="grid grid-cols-5 items-end">
        {[
          { label: "Accueil" as Section, icon: Heart, name: "Accueil" },
          { label: "Comprendre" as Section, icon: BookOpen, name: "Comprendre" },
          { label: "RoseIA" as Section, icon: Sparkles, name: "Rose IA", isCentral: true },
          { label: "Centres" as Section, icon: MapPin, name: "Centres" },
          { label: "FaireUnDon" as Section, icon: Gift, name: "Faire un don" },
        ].map(({ label, icon: Icon, name, isCentral }) => {
          const active = section === label;

          if (isCentral) {
            return (
              <button
                key={label}
                onClick={() => {
                  hapticFeedback(18);
                  setSection(label);
                  setSelectedCenter(null);
                }}
                aria-current={active ? "page" : undefined}
                className="group relative -mt-4 flex flex-col items-center justify-center focus:outline-none"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-white shadow-[0_6px_18px_rgba(161,67,100,.35)] transition-all duration-300 group-hover:scale-105 ${active ? "bg-gradient-to-tr from-[#8a3350] via-[#ea2d6d] to-[#cf5d83] text-white ring-2 ring-[#ea2d6d]/30" : "bg-gradient-to-tr from-[#9c3e5d] to-[#be5377] text-white"}`}
                >
                  <Sparkles size={21} className="text-amber-300 animate-pulse" />
                </span>
                <span
                  className={`mt-0.5 text-[9.5px] tracking-tight font-extrabold transition ${active ? "text-[#ea2d6d]" : "text-[#7b5465]"}`}
                >
                  Rose IA
                </span>
              </button>
            );
          }

          return (
            <button
              key={label}
              onClick={() => {
                hapticFeedback(12);
                setSection(label);
                setSelectedCenter(null);
                if (label === "FaireUnDon") {
                  setShowDonationModal(true);
                }
              }}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-2xl transition ${active ? "text-[#ea2d6d]" : "text-[#9d838e] hover:text-[#785062]"}`}
            >
              <span
                className={`grid h-7 w-9 place-items-center rounded-full transition-all duration-200 ${active ? "bg-[#fbe7ed] text-[#ea2d6d] shadow-xs" : ""}`}
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.5 : 1.8}
                  className={label === "FaireUnDon" && active ? "fill-[#ea2d6d]" : ""}
                />
              </span>
              <span
                className={`text-[9.5px] tracking-tight transition ${active ? "font-bold text-[#ea2d6d]" : "font-medium text-[#9d838e]"}`}
              >
                {name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
