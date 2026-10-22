import {
  Heart,
  BookOpen,
  Sparkles,
  MapPin,
  User,
  Gift,
  Share2,
  Megaphone,
  PhoneCall,
  Globe,
  ShieldCheck,
} from "lucide-react";
import type { Section, UserProfile } from "../types";
import { hapticFeedback } from "../utils/haptics";

interface NavigationDesktopProps {
  currentSection: Section;
  onSelectSection: (section: Section) => void;
  currentUser: UserProfile;
  appLanguage: "fr" | "moore" | "dioula" | "en";
  onChangeLanguage: (lang: "fr" | "moore" | "dioula" | "en") => void;
  onOpenDonationModal: () => void;
}

export function NavigationDesktop({
  currentSection,
  onSelectSection,
  currentUser,
  appLanguage,
  onChangeLanguage,
  onOpenDonationModal,
}: NavigationDesktopProps) {
  const mainNavItems = [
    { section: "Accueil" as Section, label: "Accueil", icon: Heart },
    { section: "Prevention" as Section, label: "Prévention & Conseils", icon: BookOpen },
    { section: "RoseIA" as Section, label: "Rose IA (Assistante)", icon: Sparkles, badge: "IA Éthique" },
    { section: "Centres" as Section, label: "Centres de santé & Carte", icon: MapPin },
    { section: "Profil" as Section, label: "Mon Profil & Paramètres", icon: User },
  ];

  const secondaryNavItems = [
    { section: "Annonces" as Section, label: "Campagnes & Événements", icon: Megaphone },
    { section: "Accompagnant" as Section, label: "Aller à deux (SMS / WhatsApp)", icon: Share2 },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-[#E9E0E4] bg-white h-screen sticky top-0 shrink-0 p-5 justify-between select-none">
      <div className="space-y-6">
        {/* En-tête / Logo PagLaafi */}
        <div className="flex items-center gap-3 px-2">
          <div className="relative">
            <img
              src="/images/pinkhub-mvp-paglaafi.png"
              alt="Logo PagLaafi"
              className="h-10 w-10 object-contain mix-blend-multiply drop-shadow-xs"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-[#29252A] font-display tracking-tight">
                PagLaafi
              </span>
              <span className="text-[10px] bg-[#F5E8ED] text-[#A14364] px-1.5 py-0.5 rounded-md font-bold">
                V2
              </span>
            </div>
            <p className="text-[11px] text-[#716971]">Santé Mammaire · Burkina Faso</p>
          </div>
        </div>

        {/* Navigation Principale */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-[#716971] uppercase tracking-wider px-3 mb-2">
            Navigation Principale
          </p>
          {mainNavItems.map(({ section, label, icon: Icon, badge }) => {
            const isActive = currentSection === section;
            return (
              <button
                key={section}
                onClick={() => {
                  hapticFeedback(12);
                  onSelectSection(section);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-[#F5E8ED] text-[#A14364] font-bold shadow-xs"
                    : "text-[#716971] hover:bg-[#FAF2F5] hover:text-[#29252A]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={17}
                    strokeWidth={isActive ? 2.3 : 1.9}
                    className={isActive && section === "Accueil" ? "fill-[#A14364]" : ""}
                  />
                  <span>{label}</span>
                </div>
                {badge && (
                  <span className="text-[9.5px] bg-[#A14364] text-white px-2 py-0.5 rounded-full font-bold">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modules Secondaires */}
        <div className="space-y-1 pt-2 border-t border-[#E9E0E4]">
          <p className="text-[10px] font-bold text-[#716971] uppercase tracking-wider px-3 mb-2">
            Services & Solidarité
          </p>
          {secondaryNavItems.map(({ section, label, icon: Icon }) => {
            const isActive = currentSection === section;
            return (
              <button
                key={section}
                onClick={() => {
                  hapticFeedback(12);
                  onSelectSection(section);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-[#F5E8ED] text-[#A14364] font-bold"
                    : "text-[#716971] hover:bg-[#FAF2F5] hover:text-[#29252A]"
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            );
          })}

          <button
            onClick={() => {
              hapticFeedback(15);
              onOpenDonationModal();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-[#A14364] bg-[#FAF2F5] hover:bg-[#F5E8ED] transition cursor-pointer"
          >
            <Gift size={16} />
            <span>Faire un don solidaire</span>
          </button>
        </div>
      </div>

      {/* Profil & Sélecteur de Langue en bas de Sidebar */}
      <div className="space-y-3 pt-4 border-t border-[#E9E0E4]">
        {/* Sélecteur de langue 4 langues */}
        <div className="rounded-2xl bg-[#FAF2F5] p-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#716971] px-1.5 font-medium">
            <Globe size={14} />
            <span className="text-[11px]">Langue</span>
          </div>
          <div className="flex gap-1">
            {(["fr", "moore", "dioula", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => onChangeLanguage(l)}
                className={`px-2 py-1 rounded-xl text-[10.5px] font-bold transition cursor-pointer ${
                  appLanguage === l
                    ? "bg-[#A14364] text-white shadow-xs"
                    : "text-[#716971] hover:text-[#29252A]"
                }`}
              >
                {l === "fr" ? "FR" : l === "moore" ? "Mooré" : l === "dioula" ? "Dioula" : "EN"}
              </button>
            ))}
          </div>
        </div>

        {/* Carte Profil compacte */}
        <div
          onClick={() => onSelectSection("Profil")}
          className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FFFCF8] border border-[#E9E0E4] hover:border-[#A14364] transition cursor-pointer"
        >
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#F5E8ED] text-[#A14364] font-bold text-xs">
            {currentUser.prenom[0]}
            {currentUser.nom[0]}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-xs font-bold text-[#29252A] truncate">
              {currentUser.prenom} {currentUser.nom}
            </p>
            <span className="inline-block text-[10px] text-[#557A63] font-semibold">
              {currentUser.roleLabel}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
