import { useMemo, useState } from "react";
import type { EtatAuth } from "./useEtatAuth";
import type { EtatUi } from "./useEtatUi";
import type { EtatCentres } from "./useEtatCentres";

/**
 * Espaces d'administration : panneau Superadmin (statistiques, modération, adhésions) et tableau de bord admin.
 */
export function useEtatAdministration({ auth, ui, centres }: { auth: EtatAuth; ui: EtatUi; centres: EtatCentres }) {
  const { setPendingRegistrations } = auth;
  const { notify } = ui;
  const { centers } = centres;

  const [showSuperadminModal, setShowSuperadminModal] = useState(false);

  const [superadminActiveTab, setSuperadminActiveTab] = useState<"stats" | "announcements" | "registrations">("stats");

  const [superadminRegionFilter, setSuperadminRegionFilter] = useState<string>("all");

  const [superadminAnnouncementTab, setSuperadminAnnouncementTab] = useState<"all" | "rose_ai" | "partners">("all");

  // 11. Tableau de bord Administrateurs
  const [showAdminDashboardModal, setShowAdminDashboardModal] = useState(false);

  // Modération Superadmin : structures
  const handleApproveRegistration = (id: number) => {
    setPendingRegistrations((prev) =>
      prev.map((reg) => (reg.id === id ? { ...reg, status: "approved" } : reg)),
    );
    notify("Structure validée avec succès par le Superadmin !");
  };

  const handleRejectRegistration = (id: number) => {
    setPendingRegistrations((prev) =>
      prev.map((reg) => (reg.id === id ? { ...reg, status: "rejected" } : reg)),
    );
    notify("Demande d'inscription refusée.");
  };

  /**
   * Recensement et palmarès des centres de santé les plus fréquentés par région / ville (Superadmin)
   */
  const superadminSortedCenters = useMemo(() => {
    return [...centers]
      .filter((c) => {
        if (superadminRegionFilter === "all") return true;
        if (superadminRegionFilter === "Centre") return c.city === "Ouagadougou";
        if (superadminRegionFilter === "Hauts-Bassins") return c.city === "Bobo-Dioulasso";
        if (superadminRegionFilter === "Centre-Ouest") return c.city === "Koudougou";
        return true;
      })
      .sort((a, b) => b.confirmedVisitsToday - a.confirmedVisitsToday);
  }, [centers, superadminRegionFilter]);

  return {
    showSuperadminModal,
    setShowSuperadminModal,
    superadminActiveTab,
    setSuperadminActiveTab,
    superadminRegionFilter,
    setSuperadminRegionFilter,
    superadminAnnouncementTab,
    setSuperadminAnnouncementTab,
    showAdminDashboardModal,
    setShowAdminDashboardModal,
    handleApproveRegistration,
    handleRejectRegistration,
    superadminSortedCenters,
  };
}

export type EtatAdministration = ReturnType<typeof useEtatAdministration>;
