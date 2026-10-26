import { MODE_DEMO } from "../config";

/**
 * Bandeau « Démo » : rappelle en permanence que l'application tourne avec des
 * données fictives (mode démo de la compétition). Superposé à cheval sur le bas
 * de l'en-tête pour rester visible sans décaler le contenu.
 */
export function BandeauDemo() {
  if (!MODE_DEMO) return null;
  return (
    <div
      role="note"
      aria-label="Mode démonstration : données fictives"
      className="pointer-events-none absolute left-1/2 top-[50px] z-40 -translate-x-1/2 whitespace-nowrap rounded-full border border-amber-300 bg-amber-100 px-2.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-amber-900 shadow-sm"
    >
      Démo · données fictives
    </div>
  );
}
