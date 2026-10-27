import { useEffect, useState } from "react";
import { MODE_REEL } from "../config";
import { messageErreur } from "../lib/supabase";
import { useDerniereRequete } from "../lib/derniereRequete";
import {
  chargerFichesAValider,
  chargerMesFiches,
  designerValidateur,
  listerDocteurs,
  proposerFiche,
  refuserFiche,
  validerFiche,
  type Docteur,
  type Fiche,
  type LangueFiche,
} from "../depot/fiches";
import type { EtatUi } from "./useEtatUi";
import type { EtatAuth } from "./useEtatAuth";
import type { EtatDocteur } from "./useEtatDocteur";

export type OngletFiches = "proposer" | "mes" | "valider" | "validateurs";

const formulaireVide = () => ({
  titre: "",
  contenu: "",
  langue: "fr" as LangueFiche,
  theme: "",
  sourceTitre: "",
  sourceUrl: "",
});

/**
 * Mode Docteur réel (mode réel uniquement) : un docteur propose des fiches de
 * connaissance ; un validateur (superadmin ou docteur désigné, jamais l'auteur)
 * les valide avec une source officielle ; le superadmin désigne les validateurs.
 * Une fiche validée n'est utilisée par Rose IA qu'après indexation (pnpm run rag:indexer).
 */
export function useEtatFiches({ ui, auth, docteur }: { ui: EtatUi; auth: EtatAuth; docteur: EtatDocteur }) {
  const { notify } = ui;
  const { sessionReelle } = auth;
  const { showDoctorTrainModal } = docteur;

  const [ongletFiches, setOngletFiches] = useState<OngletFiches>("proposer");
  const [formulaireFiche, setFormulaireFiche] = useState(formulaireVide);
  const [mesFiches, setMesFiches] = useState<Fiche[]>([]);
  const [fichesAValider, setFichesAValider] = useState<Fiche[]>([]);
  const [docteurs, setDocteurs] = useState<Docteur[]>([]);

  const estDocteur = sessionReelle?.role === "docteur" || sessionReelle?.role === "superadmin";
  const estValidateur = Boolean(sessionReelle?.peutValider);
  const estSuperadmin = sessionReelle?.role === "superadmin";

  const nouvelleRequete = useDerniereRequete();
  const rechargerFiches = async () => {
    if (!MODE_REEL || !sessionReelle) return;
    const estActuelle = nouvelleRequete();
    try {
      const [mes, aValider, docs] = await Promise.all([
        estDocteur ? chargerMesFiches(sessionReelle.userId) : Promise.resolve([]),
        estValidateur ? chargerFichesAValider() : Promise.resolve([]),
        estSuperadmin ? listerDocteurs() : Promise.resolve([]),
      ]);
      if (!estActuelle()) return;
      setMesFiches(mes);
      setFichesAValider(aValider);
      setDocteurs(docs);
    } catch (erreur) {
      notify(messageErreur(erreur as Error));
    }
  };

  // Chargement à l'ouverture de l'espace ; onglet par défaut selon le rôle
  useEffect(() => {
    if (!MODE_REEL || !showDoctorTrainModal) return;
    setOngletFiches(sessionReelle?.role === "docteur" ? "proposer" : estValidateur ? "valider" : "proposer");
    void rechargerFiches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDoctorTrainModal, sessionReelle?.userId]);

  const soumettreFiche = async (e: React.FormEvent) => {
    e.preventDefault();
    const f = formulaireFiche;
    if (f.titre.trim().length < 3 || f.contenu.trim().length < 20) {
      notify("Indiquez un titre (3 caractères minimum) et un contenu (20 caractères minimum).");
      return;
    }
    if (f.sourceUrl.trim() && !/^https:\/\//.test(f.sourceUrl.trim())) {
      notify("Le lien de la source doit commencer par https://");
      return;
    }
    try {
      await proposerFiche(f);
      setFormulaireFiche(formulaireVide());
      await rechargerFiches();
      setOngletFiches("mes");
      notify("Fiche envoyée : elle sera utilisée par Rose IA après validation par un autre soignant.");
    } catch (erreur) {
      notify(messageErreur(erreur as Error));
    }
  };

  const validerUneFiche = async (fiche: Fiche, sourceTitre: string, sourceUrl: string) => {
    if (fiche.auteurId && fiche.auteurId === sessionReelle?.userId) {
      notify("Validation à quatre yeux : un autre validateur doit relire votre fiche.");
      return;
    }
    if (!sourceTitre.trim()) {
      notify("Indiquez la source officielle avant de valider.");
      return;
    }
    if (sourceUrl.trim() && !/^https:\/\//.test(sourceUrl.trim())) {
      notify("Le lien de la source doit commencer par https://");
      return;
    }
    try {
      const accepte = await validerFiche(fiche.id, sourceTitre, sourceUrl);
      notify(
        accepte
          ? "Fiche validée. Elle sera utilisée par Rose IA après la prochaine indexation."
          : "Validation refusée par le serveur.",
      );
      await rechargerFiches();
    } catch (erreur) {
      notify(messageErreur(erreur as Error));
    }
  };

  const refuserUneFiche = async (fiche: Fiche, motif: string) => {
    try {
      const accepte = await refuserFiche(fiche.id, motif);
      notify(accepte ? "Fiche refusée : l'auteur verra le motif." : "Refus impossible.");
      await rechargerFiches();
    } catch (erreur) {
      notify(messageErreur(erreur as Error));
    }
  };

  const basculerValidateur = async (d: Docteur) => {
    try {
      await designerValidateur(d.id, !d.peutValider);
      notify(
        d.peutValider
          ? "Désignation de validateur retirée."
          : `${d.prenom} ${d.nom} peut désormais valider des fiches.`,
      );
      await rechargerFiches();
    } catch (erreur) {
      notify(messageErreur(erreur as Error));
    }
  };

  return {
    ongletFiches,
    setOngletFiches,
    formulaireFiche,
    setFormulaireFiche,
    mesFiches,
    fichesAValider,
    docteurs,
    estDocteur,
    estValidateur,
    estSuperadmin,
    rechargerFiches,
    soumettreFiche,
    validerUneFiche,
    refuserUneFiche,
    basculerValidateur,
  };
}

export type EtatFiches = ReturnType<typeof useEtatFiches>;
