import { MODE_REEL } from "../config";
import { BadgeSimulationUi } from "./ui/Badges";

/**
 * Badge « Simulation » (mode réel uniquement) : signale une fonctionnalité qui
 * n'est pas encore réelle (en mode démo, la pastille « Démo » couvre déjà tout).
 * `detail` explique ce qui est simulé ; `bloc` l'affiche aussi en toutes lettres.
 */
export function BadgeSimulation({ detail, bloc = false }: { detail: string; bloc?: boolean }) {
  if (!MODE_REEL) return null;
  if (!bloc) return <BadgeSimulationUi detail={detail} />;
  return (
    <span className="bordure-simulation mt-2 flex flex-wrap items-center gap-2 rounded-bouton bg-simulation-fond px-3 py-2 text-petit text-simulation">
      <BadgeSimulationUi />
      <span>{detail}</span>
    </span>
  );
}
