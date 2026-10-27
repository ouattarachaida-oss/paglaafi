import { useEffect, useMemo, useRef, useState } from "react";
import type { Section } from "../types";
import { hapticFeedback } from "../lib/haptique";
import { useLocation } from "wouter";
import { cheminDeSection, sectionDepuisChemin } from "../routes";
import { VERSION_CONSENTEMENT } from "../donnees/confidentialite";

const CLE_CONSENTEMENT = "paglaafi_consentement";

/**
 * Interface générale : onglet actif (porté par l'URL), menus, notifications (toast),
 * langue choisie, installation PWA et détection du mode hors-ligne.
 */
export function useEtatUi() {
  // 2. Navigation & État global
  // L'onglet actif est déduit de l'adresse (routage wouter) : voir routes.ts.
  const [location, navigate] = useLocation();
  const section = sectionDepuisChemin(location);
  const setSection = (cible: Section) => {
    const chemin = cheminDeSection(cible);
    if (chemin !== location) navigate(chemin);
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [toast, setToast] = useState<string>("");

  // 3. Déconnexion directe via l'icône de profil du header
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Gestion de l'installation PWA & Détection Mode Application Standalone
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const [isStandaloneApp, setIsStandaloneApp] = useState(false);

  const [showPwaInstallModal, setShowPwaInstallModal] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
    setIsStandaloneApp(isStandalone);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleTriggerInstall = async () => {
    hapticFeedback(25);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        notify("Installation de PagLaafi en cours sur votre appareil !");
        setDeferredPrompt(null);
        setShowPwaInstallModal(false);
      }
    } else {
      setShowPwaInstallModal(true);
    }
  };

  // Lien dynamique de l'application pour inviter une proche ou un accompagnant
  const appShareUrl = useMemo(() => {
    if (typeof window === "undefined") return "https://paglaafi.bf/";
    return window.location.origin + window.location.pathname;
  }, []);

  // Sélecteur de langue globale discret pour tous les écrans et tous les profils (avec persistance)
  const [appLanguage, setAppLanguage] = useState<"fr" | "moore" | "dioula" | "en">(() => {
    if (typeof window === "undefined") return "fr";
    return (localStorage.getItem("paglaafi_app_lang") as any) || "fr";
  });

  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // Consentement à la première utilisation (redemandé si le texte change de version)
  const [consentementAccepte, setConsentementAccepte] = useState(() => {
    try {
      return localStorage.getItem(CLE_CONSENTEMENT) === VERSION_CONSENTEMENT;
    } catch {
      return false;
    }
  });
  const accepterConsentement = () => {
    try {
      localStorage.setItem(CLE_CONSENTEMENT, VERSION_CONSENTEMENT);
    } catch {
      // Navigation privée : consentement valable pour cette visite seulement
    }
    setConsentementAccepte(true);
  };

  // Politique de confidentialité (aussi accessible par l'adresse /confidentialite)
  const [showPolitique, setShowPolitique] = useState(false);

  // Accompagnant : choix de la langue du SMS
  const [smsLanguage, setSmsLanguage] = useState<"fr" | "moore">("fr");

  // Référence pour le défilement fluide du conteneur principal lors des changements de page
  const mainScrollRef = useRef<HTMLDivElement | null>(null);

  // Détection de l'état de connexion internet (Mode Hors-Ligne PWA)
  const [isOffline, setIsOffline] = useState(typeof navigator !== "undefined" ? !navigator.onLine : false);

  // Surveillance des transitions réseau en direct
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      notify("Connexion internet rétablie !");
    };
    const handleOffline = () => {
      setIsOffline(true);
      notify("Mode hors-connexion actif : vos données médicales restent disponibles sans réseau.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Helper Toast
  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 3500);
  };

  return {
    section,
    setSection,
    sidebarOpen,
    setSidebarOpen,
    toast,
    setToast,
    showProfileMenu,
    setShowProfileMenu,
    deferredPrompt,
    setDeferredPrompt,
    isStandaloneApp,
    setIsStandaloneApp,
    showPwaInstallModal,
    setShowPwaInstallModal,
    handleTriggerInstall,
    appShareUrl,
    appLanguage,
    setAppLanguage,
    showLanguageMenu,
    setShowLanguageMenu,
    smsLanguage,
    setSmsLanguage,
    mainScrollRef,
    isOffline,
    setIsOffline,
    notify,
    consentementAccepte,
    accepterConsentement,
    showPolitique,
    setShowPolitique,
  };
}

export type EtatUi = ReturnType<typeof useEtatUi>;
