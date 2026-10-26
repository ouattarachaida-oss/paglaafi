import { useEffect } from "react";
import type { EtatUi } from "./useEtatUi";
import type { EtatCentres } from "./useEtatCentres";

/**
 * Remet le contenu en haut à chaque changement d'onglet ou de centre sélectionné.
 */
export function useEtatDefilement({ ui, centres }: { ui: EtatUi; centres: EtatCentres }) {
  const { mainScrollRef, section } = ui;
  const { selectedCenter } = centres;

  // Réinitialisation automatique du défilement lors de tout changement de page ou sélection de centre
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
  }, [section, selectedCenter]);
}
