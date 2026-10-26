import { X } from "lucide-react";
import { useAnnonces } from "../etat/contextes";

/**
 * Affiche d'événement en grand format.
 */
export function ModaleAffiche() {
  const { selectedPosterModal, setSelectedPosterModal } = useAnnonces();

  if (!selectedPosterModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:absolute sm:rounded-[36px]"
      onClick={() => setSelectedPosterModal(null)}
    >
      <div
        className="ph-enter max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-[28px] bg-slate-950 p-4 text-white shadow-2xl border border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="min-w-0 pr-2">
            <h3 className="ph-display text-sm font-bold text-white truncate">{selectedPosterModal.title}</h3>
            <p className="text-[10px] text-pink-400 font-bold truncate">{selectedPosterModal.author}</p>
          </div>
          <button
            onClick={() => setSelectedPosterModal(null)}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-800 bg-black">
          <img
            src={selectedPosterModal.url}
            alt={selectedPosterModal.title}
            className="w-full object-contain max-h-[65vh] mx-auto"
          />
        </div>

        {selectedPosterModal.caption && (
          <p className="mt-2 text-center text-[10.5px] text-slate-300 italic">{selectedPosterModal.caption}</p>
        )}

        <button
          type="button"
          onClick={() => setSelectedPosterModal(null)}
          className="mt-3 w-full rounded-2xl bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition"
        >
          Fermer l'affiche
        </button>
      </div>
    </div>
  );
}
