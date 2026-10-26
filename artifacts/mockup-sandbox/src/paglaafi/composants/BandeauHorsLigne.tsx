import { AlertCircle } from "lucide-react";
import { useUi } from "../etat/contextes";

/**
 * Bandeau affiché lorsque l'appareil est hors connexion.
 */
export function BandeauHorsLigne() {
  const { isOffline } = useUi();

  if (!isOffline) return null;

  return (
    <div className="z-20 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 px-3 py-1.5 text-center text-[10.5px] font-bold text-white shadow-xs">
      <AlertCircle size={13} className="shrink-0 animate-pulse text-amber-200" />
      <span>Mode Hors-Ligne actif · Vos données médicales et centres restent accessibles</span>
    </div>
  );
}
