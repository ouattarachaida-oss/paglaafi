import { MODE_REEL } from "../config";

/**
 * Badge « Simulation » (mode réel uniquement) : signale une fonctionnalité qui
 * n'est pas encore réelle (en mode démo, le bandeau « Démo » couvre déjà tout).
 * `detail` explique ce qui est simulé ; `bloc` l'affiche aussi en toutes lettres.
 */
export function BadgeSimulation({ detail, bloc = false }: { detail: string; bloc?: boolean }) {
  if (!MODE_REEL) return null;
  const badge = (
    <span
      title={detail}
      aria-label={`Simulation : ${detail}`}
      className="ml-1.5 inline-flex items-center rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 align-middle text-[9px] font-extrabold uppercase tracking-wider text-amber-900"
    >
      Simulation
    </span>
  );
  if (!bloc) return badge;
  return (
    <span className="mt-1 block rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-900">
      {badge} <span className="ml-1">{detail}</span>
    </span>
  );
}
