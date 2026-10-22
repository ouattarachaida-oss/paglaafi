import React from "react";
import type { Section, UserProfile } from "../types";
import { NavigationMobile } from "../navigation/NavigationMobile";
import { NavigationDesktop } from "../navigation/NavigationDesktop";
import { HeaderV2 } from "../navigation/HeaderV2";

interface AppShellProps {
  currentSection: Section;
  onSelectSection: (section: Section) => void;
  currentUser: UserProfile;
  appLanguage: "fr" | "moore" | "dioula" | "en";
  onChangeLanguage: (lang: "fr" | "moore" | "dioula" | "en") => void;
  onOpenDonationModal: () => void;
  onOpenProfileMenu: () => void;
  children: React.ReactNode;
}

export function AppShell({
  currentSection,
  onSelectSection,
  currentUser,
  appLanguage,
  onChangeLanguage,
  onOpenDonationModal,
  onOpenProfileMenu,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#FFFCF8] text-[#29252A] flex flex-col md:flex-row antialiased font-sans">
      {/* 1. Navigation Desktop (Sidebar latérale sur tablettes et ordinateurs) */}
      <NavigationDesktop
        currentSection={currentSection}
        onSelectSection={onSelectSection}
        currentUser={currentUser}
        appLanguage={appLanguage}
        onChangeLanguage={onChangeLanguage}
        onOpenDonationModal={onOpenDonationModal}
      />

      {/* 2. Zone Principale d'Affichage */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 md:pb-6">
        {/* Header Adaptatif */}
        <HeaderV2
          currentSection={currentSection}
          onSelectSection={onSelectSection}
          currentUser={currentUser}
          appLanguage={appLanguage}
          onChangeLanguage={onChangeLanguage}
          onOpenProfileMenu={onOpenProfileMenu}
        />

        {/* Contenu de l'écran actif */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-fade-in">
          {children}
        </main>
      </div>

      {/* 3. Navigation Mobile (Barre d'onglets fixes en bas sur smartphones) */}
      <NavigationMobile
        currentSection={currentSection}
        onSelectSection={onSelectSection}
      />
    </div>
  );
}
