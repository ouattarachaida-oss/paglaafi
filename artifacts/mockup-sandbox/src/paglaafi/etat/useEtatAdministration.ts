import { useEffect, useMemo, useState } from "react";
import { MODE_REEL } from "../config";
import { messageErreur } from "../lib/supabase";
import { approuverDemande, chargerDemandes, refuserDemande } from "../depot/adhesions";
import type { EtatAuth } from "./useEtatAuth";
import type { EtatUi } from "./useEtatUi";
import type { EtatCentres } from "./useEtatCentres";

/**
 * Espaces d'administration : panneau Superadmin (statistiques, modération, adhésions) et tableau de bord admin.
 *
 * Mode réel : les demandes d'adhésion viennent de Supabase ; leur validation
 * attribue le rôle côté serveur (fonction approuver_demande, réservée au superadmin).
 * Les statistiques et le tableau de bord admin restent des données de démonstration.
 */
export function useEtatAdministration({ auth, ui, centres }: { auth: EtatAuth; ui: EtatUi; centres: EtatCentres }) {
  const { sessionReelle, setPendingRegistrations } = auth;
  const { notify } = ui;
  const { centers } = centres;

  const [showSuperadminModal, setShowSuperadminModal] = useState(false);

  const [superadminActiveTab, setSuperadminActiveTab] = useState<"stats" | "announcements" | "registrations">("stats");

  const [superadminRegionFilter, setSuperadminRegionFilter] = useState<string>("all");

  const [superadminAnnouncementTab, setSuperadminAnnouncementTab] = useState<"all" | "rose_ai" | "partners">("all");

  // 11. Tableau de bord Administrateurs
  const [showAdminDashboardModal, setShowAdminDashboardModal] = useState(false);

  // Mode réel : demandes d'adhésion du superadmin (rechargées à l'ouverture du panneau)
  const rechargerDemandes = async () => {
    if (!MODE_REEL || sessionReelle?.role !== "superadmin") return;
    try {
      setPendingRegistrations(await chargerDemandes());
    } catch (erreur) {
      notify(messageErreur(erreur as Error));
    }
  };

  useEffect(() => {
    if (MODE_REEL && sessionReelle?.role !== "superadmin") setPendingRegistrations([]);
    void rechargerDemandes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionReelle?.userId, sessionReelle?.role, showSuperadminModal]);

  // Mode réel : décision transmise au serveur, puis liste rechargée
  const traiterDemandeReel = async (id: number, decision: "approuver" | "refuser") => {
    try {
      if (decision === "approuver") await approuverDemande(id);
      else await refuserDemande(id);
      await rechargerDemandes();
      notify(decision === "approuver" ? "Structure validée : le rôle du compte a été mis à jour." : "Demande d'inscription refusée.");
    } catch (erreur) {
      notify(messageErreur(erreur as Error));
    }
  };

  // Modération Superadmin : structures
  const handleApproveRegistration = (id: number) => {
    if (MODE_REEL) {
      void traiterDemandeReel(id, "approuver");
      return;
    }
    setPendingRegistrations((prev) => prev.map((reg) => (reg.id === id ? { ...reg, status: "approved" } : reg)));
    notify("Structure validée avec succès par le Superadmin !");
  };

  const handleRejectRegistration = (id: number) => {
    if (MODE_REEL) {
      void traiterDemandeReel(id, "refuser");
      return;
    }
    setPendingRegistrations((prev) => prev.map((reg) => (reg.id === id ? { ...reg, status: "rejected" } : reg)));
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
