import { Heart, BookOpen, Sparkles, MapPin, User } from "lucide-react";
import type { Section } from "../types";
import { hapticFeedback } from "../utils/haptics";

interface NavigationMobileProps {
  currentSection: Section;
  onSelectSection: (section: Section) => void;
}

export function NavigationMobile({
  currentSection,
  onSelectSection,
}: NavigationMobileProps) {
  const navItems = [
    { section: "Accueil" as Section, label: "Accueil", icon: Heart },
    { section: "Prevention" as Section, label: "Prévention", icon: BookOpen },
    { section: "RoseIA" as Section, label: "Rose IA", icon: Sparkles, isCentral: true },
    { section: "Centres" as Section, label: "Centres", icon: MapPin },
    { section: "Profil" as Section, label: "Profil", icon: User },
  ];

  return (
    <nav
      aria-label="Navigation mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#E9E0E4] bg-white/95 backdrop-blur-md px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-4px_20px_rgba(41,37,42,0.06)]"
    >
      <div className="grid grid-cols-5 items-end max-w-md mx-auto">
        {navItems.map(({ section, label, icon: Icon, isCentral }) => {
          const isActive = currentSection === section;

          if (isCentral) {
            return (
              <button
                key={section}
                onClick={() => {
                  hapticFeedback(20);
                  onSelectSection(section);
                }}
                aria-current={isActive ? "page" : undefined}
                className="group relative -mt-4 flex flex-col items-center justify-center focus:outline-none cursor-pointer"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-white shadow-md transition-all duration-300 group-hover:scale-105 ${
                    isActive
                      ? "bg-gradient-to-tr from-[#8E3655] to-[#A14364] text-white ring-2 ring-[#A14364]/30"
                      : "bg-[#A14364] text-white"
                  }`}
                >
                  <Sparkles size={20} className="text-amber-300 animate-pulse" />
                </span>
                <span
                  className={`mt-0.5 text-[10px] tracking-tight font-bold transition ${
                    isActive ? "text-[#A14364]" : "text-[#716971]"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={section}
              onClick={() => {
                hapticFeedback(12);
                onSelectSection(section);
              }}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-2xl transition cursor-pointer ${
                isActive
                  ? "text-[#A14364]"
                  : "text-[#716971] hover:text-[#29252A]"
              }`}
            >
              <span
                className={`grid h-7 w-9 place-items-center rounded-full transition-all duration-200 ${
                  isActive ? "bg-[#F5E8ED] text-[#A14364]" : ""
                }`}
              >
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 1.9}
                  className={isActive && section === "Accueil" ? "fill-[#A14364]" : ""}
                />
              </span>
              <span
                className={`text-[10px] tracking-tight transition ${
                  isActive ? "font-bold text-[#A14364]" : "font-medium text-[#716971]"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
