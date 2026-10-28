import { CheckCircle2 } from "lucide-react";
import { useUi } from "../etat/contextes";
import { sansEmoji } from "../lib/texte";

/**
 * Notification temporaire (toast) : fond sombre, action facultative (ex. « Annuler »).
 * Placée au-dessus de la barre du bas sur mobile, en bas à droite sur grand écran.
 */
export function Toast() {
  const { toast, toastAction, setToast } = useUi();
  if (!toast) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="anim-apparition fixed inset-x-4 bottom-[104px] z-[70] mx-auto flex max-w-md items-center gap-3 rounded-bouton bg-nuit px-4 py-3 text-petit text-white shadow-flottant md:bottom-6 md:left-auto md:right-6 md:mx-0"
    >
      <CheckCircle2 size={18} className="shrink-0 text-[#ff9dbe]" aria-hidden />
      <span className="flex-1">{sansEmoji(toast)}</span>
      {toastAction && (
        <button
          type="button"
          onClick={() => {
            toastAction.faire();
            setToast("");
          }}
          className="min-h-11 shrink-0 rounded-bouton px-3 font-bold text-[#ff9dbe] underline underline-offset-4"
        >
          {toastAction.libelle}
        </button>
      )}
    </div>
  );
}
