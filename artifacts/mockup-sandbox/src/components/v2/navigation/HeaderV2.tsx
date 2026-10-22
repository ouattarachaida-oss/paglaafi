import { useState } from "react";
import { Globe, User, ShieldCheck, Heart, Sparkles, ChevronDown } from "lucide-react";
import type { Section, UserProfile } from "../types";
import { hapticFeedback } from "../utils/haptics";

interface HeaderV2Props {
  currentSection: Section;
  onSelectSection: (section: Section) => void;
  currentUser: UserProfile;
  appLanguage: "fr" | "moore" | "dioula" | "en";
  onChangeLanguage: (lang: "fr" | "moore" | "dioula" | "en") => void;
  onOpenProfileMenu: () => void;
}

export function HeaderV2({
  currentSection,
  onSelectSection,
  currentUser,
  appLanguage,
  onChangeLanguage,
  onOpenProfileMenu,
}: HeaderV2Props) {
  const [showLangMenu, setShowLangMenu] = useState(false);

  const sectionTitles: Record<Section, { title: string; subtitle: string }> = {
    Accueil: {
      title: "Accueil",
      subtitle: "Mieux informée, mieux orientée, jamais seule",
    },
    Prevention: {
      title: "Prévention & Éducation",
      subtitle: "Autopalpation, dépistage et repères médicaux",
    },
    RoseIA: {
      title: "Rose IA",
      subtitle: "Votre compagne de santé et de bien-être",
    },
    Centres: {
      title: "Centres de santé",
      subtitle: "Carte interactive et disponibilités en direct",
    },
    Profil: {
      title: "Mon Espace",
      subtitle: "Suivi personnel, rôles et confidentialité",
    },
    Dons: {
      title: "Faire un don",
      subtitle: "Soutien direct aux patientes vulnérables",
    },
    Accompagnant: {
      title: "L'Accompagnant",
      subtitle: "Inviter une proche par SMS ou WhatsApp",
    },
    Annonces: {
      title: "Campagnes & Événements",
      subtitle: "Dépistages gratuits et rendez-vous associatifs",
    },
    Calendrier: {
      title: "Calendrier du Cycle",
      subtitle: "Rappels discrets et autopalpation mensuelle",
    },
  };

  const currentMeta = sectionTitles[currentSection] || {
    title: "PagLaafi",
    subtitle: "Santé mammaire Burkina Faso",
  };

  const langNames = {
    fr: "Français",
    moore: "Mooré",
    dioula: "Dioula",
    en: "English",
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E9E0E4] px-4 sm:px-6 py-3 transition select-none">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Titre & Sous-titre adaptatif */}
        <div className="flex items-center gap-3">
          {/* Logo compact sur mobile */}
          <div
            onClick={() => onSelectSection("Accueil")}
            className="md:hidden flex items-center gap-2 cursor-pointer"
          >
            <img
              src="/images/pinkhub-mvp-paglaafi.png"
              alt="Logo PagLaafi"
              className="h-8 w-8 object-contain mix-blend-multiply"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-[#29252A] font-display">
                {currentMeta.title}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#EAF2ED] px-2 py-0.5 text-[10px] font-bold text-[#557A63]">
                <ShieldCheck size={11} /> Hors-ligne actif
              </span>
            </div>
            <p className="text-[11px] text-[#716971] hidden sm:block">
              {currentMeta.subtitle}
            </p>
          </div>
        </div>

        {/* Actions d'en-tête : Langue + Profil */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Menu déroulant de langue */}
          <div className="relative">
            <button
              onClick={() => {
                hapticFeedback(10);
                setShowLangMenu(!showLangMenu);
              }}
              aria-label="Changer de langue"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#E9E0E4] bg-[#FFFCF8] hover:bg-[#F5E8ED] text-xs font-semibold text-[#29252A] transition cursor-pointer"
            >
              <Globe size={13} className="text-[#A14364]" />
              <span className="text-[11px]">{langNames[appLanguage]}</span>
              <ChevronDown size={12} className="text-[#716971]" />
            </button>

            {showLangMenu && (
              <div
                className="absolute right-0 mt-1.5 w-36 rounded-2xl bg-white border border-[#E9E0E4] shadow-lg p-1.5 z-50 text-xs animate-fade-in"
                onClick={() => setShowLangMenu(false)}
              >
                {(["fr", "moore", "dioula", "en"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      hapticFeedback(12);
                      onChangeLanguage(l);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                      appLanguage === l
                        ? "bg-[#F5E8ED] text-[#A14364] font-bold"
                        : "text-[#716971] hover:bg-[#FAF2F5] hover:text-[#29252A]"
                    }`}
                  >
                    <span>{langNames[l]}</span>
                    {appLanguage === l && <span className="text-[#A14364]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bouton Profil */}
          <button
            onClick={() => {
              hapticFeedback(12);
              onOpenProfileMenu();
            }}
            aria-label="Mon profil"
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#F5E8ED] hover:bg-[#ebd5df] text-[#A14364] transition cursor-pointer"
          >
            <div className="grid h-6 w-6 place-items-center rounded-lg bg-[#A14364] text-white text-[11px] font-bold">
              {currentUser.prenom[0]}
            </div>
            <span className="hidden md:inline text-xs font-bold text-[#29252A]">
              {currentUser.prenom}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
