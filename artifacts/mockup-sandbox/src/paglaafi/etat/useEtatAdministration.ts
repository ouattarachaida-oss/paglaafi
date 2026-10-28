import { useEffect, useMemo, useState } from "react";
import { MODE_REEL } from "../config";
import { messageErreur } from "../lib/supabase";
import { approuverDemande, chargerDemandes, refuserDemande } from "../depot/adhesions";
import { useDerniereRequete } from "../lib/derniereRequete";
import {
  chargerStructuresAVerifier,
  definirVerificationAssociation,
  definirVerificationCentre,
  type StructureAVerifier,
} from "../depot/verifications";
import type { EtatAuth } from "./useEtatAuth";
import type { EtatUi } from "./useEtatUi";
import type { EtatCentres } from "./useEtatCentres";
import type { EtatAnnonces } from "./useEtatAnnonces";

/**
 * Espaces d'administration : panneau Superadmin (statistiques, modération, adhésions) et tableau de bord admin.
 *
 * Mode réel : les demandes d'adhésion viennent de Supabase ; leur validation
 * attribue le rôle côté serveur (fonction approuver_demande, réservée au superadmin).
 * Les statistiques et le tableau de bord admin restent des données de démonstration.
 */
/** Rattachement choisi (approbation) ou motif (refus) d'une demande d'adhésion. */
export interface OptionsDecision {
  centre?: number | null;
  association?: number | null;
  motif?: string;
}

export function useEtatAdministration({
  auth,
  ui,
  centres,
  annonces,
}: {
  auth: EtatAuth;
  ui: EtatUi;
  centres: EtatCentres;
  annonces: EtatAnnonces;
}) {
  const { rechargerAnnonces } = annonces;
  const { sessionReelle, setPendingRegistrations } = auth;
  const { notify } = ui;
  const { centers, rechargerCentres } = centres;

  const [showSuperadminModal, setShowSuperadminModal] = useState(false);

  const [superadminActiveTab, setSuperadminActiveTab] = useState<
    "stats" | "announcements" | "registrations" | "verifications" | "fiches"
  >("stats");

  const [superadminRegionFilter, setSuperadminRegionFilter] = useState<string>("all");

  const [superadminAnnouncementTab, setSuperadminAnnouncementTab] = useState<"all" | "rose_ai" | "partners">("all");

  // 11. Tableau de bord Administrateurs
  const [showAdminDashboardModal, setShowAdminDashboardModal] = useState(false);

  // Mode réel : demandes d'adhésion du superadmin (rechargées à l'ouverture du panneau)
  const nouvelleRequete = useDerniereRequete();
  const rechargerDemandes = async () => {
    if (!MODE_REEL || sessionReelle?.role !== "superadmin") return;
    const estActuelle = nouvelleRequete();
    try {
      const demandes = await chargerDemandes();
      if (estActuelle()) setPendingRegistrations(demandes);
    } catch (erreur) {
      notify(messageErreur(erreur as Error));
    }
  };

  useEffect(() => {
    if (MODE_REEL && sessionReelle?.role !== "superadmin") setPendingRegistrations([]);
    void rechargerDemandes();
    // Panneau ouvert : annonces à modérer à jour
    if (showSuperadminModal) void rechargerAnnonces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionReelle?.userId, sessionReelle?.role, showSuperadminModal]);

  // Mode réel : centres et associations (vérifiés ou non) pour l'onglet « Vérifications »
  const [structuresAVerifier, setStructuresAVerifier] = useState<{
    centres: StructureAVerifier[];
    associations: StructureAVerifier[];
  }>({ centres: [], associations: [] });
  const nouvelleRequeteVerifs = useDerniereRequete();
  const rechargerStructures = async () => {
    if (!MODE_REEL || sessionReelle?.role !== "superadmin") return;
    const estActuelle = nouvelleRequeteVerifs();
    try {
      const structures = await chargerStructuresAVerifier();
      if (estActuelle()) setStructuresAVerifier(structures);
    } catch (erreur) {
      notify(messageErreur(erreur as Error));
    }
  };

  useEffect(() => {
    if (showSuperadminModal) void rechargerStructures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionReelle?.userId, sessionReelle?.role, showSuperadminModal]);

  /**
   * Marque un centre ou une association comme vérifié(e), ou retire la vérification.
   * Un centre vérifié apparaît sur la carte en mode réel ; refusé par la base hors superadmin.
   */
  const basculerVerification = async (type: "centre" | "association", id: number, verifiee: boolean) => {
    try {
      const accepte =
        type === "centre"
          ? await definirVerificationCentre(id, verifiee)
          : await definirVerificationAssociation(id, verifiee);
      if (!accepte) {
        notify("Action refusée : réservée à la ou au Superadmin.");
        return;
      }
      await rechargerStructures();
      if (type === "centre") await rechargerCentres();
      notify(
        verifiee
          ? `${type === "centre" ? "Centre" : "Association"} marqué(e) comme vérifié(e).`
          : `Vérification retirée : ${type === "centre" ? "le centre n'apparaît plus sur la carte" : "l'association n'est plus affichée comme vérifiée"}.`,
      );
    } catch (erreur) {
      notify(messageErreur(erreur as Error));
    }
  };

  // Mode réel : décision transmise au serveur, puis liste rechargée
  const traiterDemandeReel = async (id: number, decision: "approuver" | "refuser", options: OptionsDecision = {}) => {
    try {
      if (decision === "approuver") await approuverDemande(id, options.centre ?? null, options.association ?? null);
      else await refuserDemande(id, options.motif);
      await rechargerDemandes();
      notify(
        decision === "approuver"
          ? "Structure validée : le rôle du compte a été mis à jour."
          : "Demande d'inscription refusée.",
      );
    } catch (erreur) {
      notify(messageErreur(erreur as Error));
    }
  };

  // Modération Superadmin : structures
  const handleApproveRegistration = (id: number, rattachement: OptionsDecision = {}) => {
    if (MODE_REEL) {
      void traiterDemandeReel(id, "approuver", rattachement);
      return;
    }
    setPendingRegistrations((prev) => prev.map((reg) => (reg.id === id ? { ...reg, status: "approved" } : reg)));
    notify("Structure validée avec succès par le Superadmin !");
  };

  const handleRejectRegistration = (id: number, motif?: string) => {
    if (MODE_REEL) {
      void traiterDemandeReel(id, "refuser", { motif });
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
    structuresAVerifier,
    basculerVerification,
  };
}

export type EtatAdministration = ReturnType<typeof useEtatAdministration>;
