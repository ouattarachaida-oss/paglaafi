import { useState, useEffect } from "react";
import type { Section, UserProfile, PartnerAnnouncement } from "../../v2/types";
import { initialAnnouncements } from "../../v2/data/announcements";
import { AppShell } from "../../v2/layout/AppShell";
import { AccueilV2 } from "../../v2/screens/AccueilV2";
import { PreventionV2 } from "../../v2/screens/PreventionV2";
import { RoseIAV2 } from "../../v2/screens/RoseIAV2";
import { CentresV2 } from "../../v2/screens/CentresV2";
import { ProfilV2 } from "../../v2/screens/ProfilV2";
import { AccompagnantV2 } from "../../v2/screens/AccompagnantV2";
import { AnnoncesV2 } from "../../v2/screens/AnnoncesV2";
import { DonationModalV2 } from "../../v2/modals/DonationModalV2";
import { hapticFeedback } from "../../v2/utils/haptics";

export function PagLaafiV2() {
  // Profil utilisateur par défaut (Utilisatrice standard)
  const defaultUser: UserProfile = {
    nom: "Ouedraogo",
    prenom: "Aminata",
    telephone: "+226 70 12 34 56",
    role: "user",
    roleLabel: "Utilisatrice / Patiente",
  };

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    if (typeof window === "undefined") return defaultUser;
    try {
      const stored = localStorage.getItem("paglaafi_current_user_v2");
      return stored ? JSON.parse(stored) : defaultUser;
    } catch {
      return defaultUser;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("paglaafi_current_user_v2", JSON.stringify(currentUser));
    } catch {
      // Ignorer
    }
  }, [currentUser]);

  // Section courante
  const [currentSection, setCurrentSection] = useState<Section>("Accueil");

  // Langue globale de l'interface
  const [appLanguage, setAppLanguage] = useState<"fr" | "moore" | "dioula" | "en">(() => {
    if (typeof window === "undefined") return "fr";
    return (localStorage.getItem("paglaafi_app_lang") as any) || "fr";
  });

  const handleChangeLanguage = (lang: "fr" | "moore" | "dioula" | "en") => {
    hapticFeedback(12);
    setAppLanguage(lang);
    try {
      localStorage.setItem("paglaafi_app_lang", lang);
    } catch {
      // Ignorer
    }
  };

  // Annonces & Campagnes
  const [announcements] = useState<PartnerAnnouncement[]>(initialAnnouncements);

  // Modale de don solidaire
  const [showDonationModal, setShowDonationModal] = useState(false);

  return (
    <AppShell
      currentSection={currentSection}
      onSelectSection={setCurrentSection}
      currentUser={currentUser}
      appLanguage={appLanguage}
      onChangeLanguage={handleChangeLanguage}
      onOpenDonationModal={() => setShowDonationModal(true)}
      onOpenProfileMenu={() => setCurrentSection("Profil")}
    >
      {/* 1. Écran Accueil */}
      {currentSection === "Accueil" && (
        <AccueilV2
          currentUser={currentUser}
          announcements={announcements}
          appLanguage={appLanguage}
          onNavigate={setCurrentSection}
          onOpenDonationModal={() => setShowDonationModal(true)}
        />
      )}

      {/* 2. Écran Prévention & Éducation */}
      {currentSection === "Prevention" && (
        <PreventionV2 appLanguage={appLanguage} />
      )}

      {/* 3. Écran Rose IA */}
      {currentSection === "RoseIA" && (
        <RoseIAV2 appLanguage={appLanguage} />
      )}

      {/* 4. Écran Centres de santé & Carte */}
      {currentSection === "Centres" && (
        <CentresV2 appLanguage={appLanguage} />
      )}

      {/* 5. Écran Profil & Espace personnel */}
      {currentSection === "Profil" && (
        <ProfilV2
          currentUser={currentUser}
          onUpdateUser={setCurrentUser}
          appLanguage={appLanguage}
          onChangeLanguage={handleChangeLanguage}
        />
      )}

      {/* Écrans secondaires */}
      {currentSection === "Accompagnant" && <AccompagnantV2 />}

      {currentSection === "Annonces" && (
        <AnnoncesV2 announcements={announcements} />
      )}

      {/* Modale Don Solidaire */}
      <DonationModalV2
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
      />
    </AppShell>
  );
}

export default PagLaafiV2;
