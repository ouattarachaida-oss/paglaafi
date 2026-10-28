import type { ReactNode } from "react";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Edit3,
  FileText,
  Gift,
  Home,
  MapPin,
  Megaphone,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserPlus,
} from "lucide-react";
import type { Section, UserProfile } from "../types";
import { MODE_REEL } from "../config";
import {
  useAdministration,
  useAnnonces,
  useAuth,
  useCentres,
  useDocteur,
  useDons,
  useOrientations,
  useSante,
  useUi,
} from "../etat/contextes";

/**
 * Entrées de navigation partagées par la barre du bas (mobile), le rail (tablette)
 * et le menu latéral (tiroir ou menu fixe sur ordinateur).
 */

export interface EntreeMenu {
  id: string;
  libelle: string;
  /** Libellé court (barre du bas, rail) */
  court?: string;
  icone: ReactNode;
  actif?: boolean;
  compteur?: number;
  onClick: () => void;
}

/** Visiteuse en mode découverte (sans compte). */
export const estInvitee = (u: UserProfile | null) => u?.role === "user" && u.telephone === "Mode Découverte";

const ICONE = 22;

export function useEntreesMenu() {
  const { section, setSection, setSidebarOpen, handleTriggerInstall, isStandaloneApp } = useUi();
  const { currentUser, pendingRegistrations } = useAuth();
  const { setSelectedCenter, ouvrirMiseAJourCentre } = useCentres();
  const { setShowOrientationModal } = useOrientations();
  const { setShowPrivacyModal } = useSante();
  const { setShowDoctorTrainModal } = useDocteur();
  const { announcements } = useAnnonces();
  const { setShowDonationModal } = useDons();
  const { setShowAdminDashboardModal, setShowSuperadminModal } = useAdministration();

  const aller = (s: Section) => () => {
    setSection(s);
    setSelectedCenter(null);
    setSidebarOpen(false);
  };
  const ouvrir = (f: () => void) => () => {
    setSidebarOpen(false);
    f();
  };
  const entree = (id: Section, libelle: string, icone: ReactNode, court?: string): EntreeMenu => ({
    id,
    libelle,
    court,
    icone,
    actif: section === id,
    onClick: aller(id),
  });

  // Barre du bas et rail : 5 entrées, Rose IA au centre
  const principales: EntreeMenu[] = [
    entree("Accueil", "Accueil", <Home size={ICONE} aria-hidden />),
    entree("Comprendre", "Comprendre", <BookOpen size={ICONE} aria-hidden />),
    entree("RoseIA", "Rose IA", <Sparkles size={ICONE} aria-hidden />),
    entree("Centres", "Centres", <MapPin size={ICONE} aria-hidden />),
    {
      ...entree("FaireUnDon", "Faire un don", <Gift size={ICONE} aria-hidden />, "Don"),
      onClick: () => {
        aller("FaireUnDon")();
        setShowDonationModal(true);
      },
    },
  ];

  // Menu latéral complet
  const menu: EntreeMenu[] = [
    entree("Accueil", "Accueil", <Home size={ICONE} aria-hidden />),
    entree("Centres", "Carte des soins", <MapPin size={ICONE} aria-hidden />),
    entree("Calendrier", "Règles & Autopalpation", <CalendarDays size={ICONE} aria-hidden />),
    entree("Comprendre", "Comprendre", <BookOpen size={ICONE} aria-hidden />),
    entree("RoseIA", "Rose IA", <Sparkles size={ICONE} aria-hidden />),
    entree("Annonces", "Annonces & Événements", <Megaphone size={ICONE} aria-hidden />),
    entree("Accompagnant", "L'Accompagnant", <UserPlus size={ICONE} aria-hidden />),
    {
      id: "don",
      libelle: "Faire un don",
      icone: <Gift size={ICONE} aria-hidden />,
      actif: section === "FaireUnDon",
      onClick: () => {
        aller("FaireUnDon")();
        setShowDonationModal(true);
      },
    },
    {
      id: "confidentialite",
      libelle: "Confidentialité & Données",
      icone: <ShieldCheck size={ICONE} aria-hidden />,
      onClick: ouvrir(() => setShowPrivacyModal(true)),
    },
    {
      id: "installer",
      libelle: isStandaloneApp ? "Application installée" : "Installer l'application",
      icone: <Smartphone size={ICONE} aria-hidden />,
      onClick: ouvrir(handleTriggerInstall),
    },
  ];

  // Espaces professionnels selon le rôle (rien pour l'invitée et l'utilisatrice)
  const pros: EntreeMenu[] = [];
  const u = currentUser;
  if (u?.role === "superadmin") {
    pros.push({
      id: "superadmin",
      libelle: "Panneau Superadmin",
      icone: <ShieldAlert size={ICONE} aria-hidden />,
      compteur:
        announcements.filter((a) => a.status === "pending_validation").length +
        pendingRegistrations.filter((r) => r.status === "pending").length,
      onClick: ouvrir(() => setShowSuperadminModal(true)),
    });
  }
  if (u?.role === "admin" || u?.role === "superadmin") {
    pros.push({
      id: "tableau",
      libelle: "Tableau de bord",
      icone: <BarChart3 size={ICONE} aria-hidden />,
      onClick: ouvrir(() => setShowAdminDashboardModal(true)),
    });
  }
  if (u?.role === "superadmin" || (u?.role === "admin" && u.adminType === "doctor")) {
    pros.push({
      id: "fiches",
      libelle: MODE_REEL ? "Fiches Rose IA" : "Entraîner Rose IA",
      icone: <ClipboardList size={ICONE} aria-hidden />,
      onClick: ouvrir(() => setShowDoctorTrainModal(true)),
    });
  }
  if (u?.role === "admin" && (u.adminType === "doctor" || u.adminType === "center")) {
    pros.push(
      {
        id: "orienter",
        libelle: "Orienter une patiente",
        icone: <FileText size={ICONE} aria-hidden />,
        onClick: ouvrir(() => setShowOrientationModal(true)),
      },
      {
        id: "majcentre",
        libelle: "Mettre à jour mon centre",
        icone: <Edit3 size={ICONE} aria-hidden />,
        onClick: ouvrir(ouvrirMiseAJourCentre),
      },
    );
  }

  return { principales, menu, pros };
}
