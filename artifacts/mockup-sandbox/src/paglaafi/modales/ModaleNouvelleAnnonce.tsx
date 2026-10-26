import {
  Megaphone,
  X,
} from "lucide-react";
import { useAnnonces } from "../etat/contextes";

/**
 * Publication d'une annonce par un partenaire (en attente de validation).
 */
export function ModaleNouvelleAnnonce() {
  const { handlePublishAnnouncementSubmit, newAnnouncement, setNewAnnouncement, setShowNewAnnouncementModal, showNewAnnouncementModal } = useAnnonces();

  if (!(showNewAnnouncementModal)) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]">
      <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl max-h-[90vh] overflow-y-auto border-2 border-[#ea2d6d]">
        <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#faedf1] text-[#ea2d6d]">
              <Megaphone size={18} />
            </span>
            <div>
              <h3 className="ph-display text-sm font-bold text-[#580e36]">Publier une annonce</h3>
              <p className="text-[10px] text-amber-800 font-bold">Soumise à validation Superadmin</p>
            </div>
          </div>
          <button
            onClick={() => setShowNewAnnouncementModal(false)}
            className="grid h-8 w-8 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handlePublishAnnouncementSubmit} className="mt-3 space-y-2.5 text-xs">
          <div>
            <label className="block font-bold text-[#563746]">Titre de l'événement / caravane *</label>
            <input
              type="text"
              required
              placeholder="Ex: Dépistage gratuit au marché..."
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-[#563746]">Ville / Localité :</label>
              <input
                type="text"
                value={newAnnouncement.city}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, city: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-[#563746]">Mois concerné :</label>
              <select
                value={newAnnouncement.month}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, month: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs font-semibold"
              >
                <option value="Octobre 2026">Octobre 2026 (En cours)</option>
                <option value="Novembre 2026">Novembre 2026</option>
                <option value="Décembre 2026">Décembre 2026</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#563746]">Date & Heure :</label>
            <input
              type="text"
              value={newAnnouncement.date}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, date: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
            />
          </div>

          {/* Photo ou Affiche officielle de l'événement */}
          <div className="space-y-1.5 rounded-xl border border-pink-200 bg-pink-50/40 p-2.5">
            <label className="block font-bold text-[#563746]">Affiche ou Photo de l'événement :</label>

            {/* Modèles d'affiches des partenaires en 1 clic */}
            <div className="grid grid-cols-3 gap-1 text-[9.5px]">
              <button
                type="button"
                onClick={() =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    imageUrl: "/images/affiche-evenement-beneere.jpg",
                    imageCaption: "Affiche Caravane BE NEERE FOR CAUSE",
                  })
                }
                className={`rounded-lg p-1 text-center font-bold border transition ${
                  newAnnouncement.imageUrl === "/images/affiche-evenement-beneere.jpg"
                    ? "bg-[#ea2d6d] text-white border-[#ea2d6d]"
                    : "bg-white text-[#7d4b60] border-pink-200 hover:bg-pink-100"
                }`}
              >
                🎪 BE NEERE
              </button>
              <button
                type="button"
                onClick={() =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    imageUrl: "/images/affiche-wtm-odc.jpg",
                    imageCaption: "Affiche Hackathon WTM & Orange Digital Center",
                  })
                }
                className={`rounded-lg p-1 text-center font-bold border transition ${
                  newAnnouncement.imageUrl === "/images/affiche-wtm-odc.jpg"
                    ? "bg-[#ea2d6d] text-white border-[#ea2d6d]"
                    : "bg-white text-[#7d4b60] border-pink-200 hover:bg-pink-100"
                }`}
              >
                💻 WTM / ODC
              </button>
              <button
                type="button"
                onClick={() =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    imageUrl: "/images/affiche-genit-care.jpg",
                    imageCaption: "Affiche Clinique GENIT CARE",
                  })
                }
                className={`rounded-lg p-1 text-center font-bold border transition ${
                  newAnnouncement.imageUrl === "/images/affiche-genit-care.jpg"
                    ? "bg-[#ea2d6d] text-white border-[#ea2d6d]"
                    : "bg-white text-[#7d4b60] border-pink-200 hover:bg-pink-100"
                }`}
              >
                🏥 GENIT CARE
              </button>
            </div>

            {/* Saisie d'une URL personnalisée */}
            <input
              type="text"
              placeholder="Ou lien de votre affiche / photo..."
              value={newAnnouncement.imageUrl || ""}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, imageUrl: e.target.value })}
              className="w-full rounded-lg border border-[#e4cfd6] bg-white p-1.5 text-[11px]"
            />

            {/* Prévisualisation miniature de l'affiche */}
            {newAnnouncement.imageUrl && (
              <div className="relative mt-1 overflow-hidden rounded-lg border border-pink-200 shadow-2xs">
                <img
                  src={newAnnouncement.imageUrl}
                  alt="Aperçu affiche"
                  className="aspect-[16/9] w-full object-cover"
                />
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[8.5px] font-bold text-white">
                  ✓ Aperçu de l'affiche
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold text-[#563746]">Description détaillée de l'événement *</label>
            <textarea
              rows={3}
              required
              placeholder="Précisez le lieu exact, les bénéficiaires, la gratuité ou les subventions..."
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-[#563746]">Contact téléphonique public :</label>
            <input
              type="text"
              placeholder="+226 70 00 00 00"
              value={newAnnouncement.contact}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, contact: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
            />
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-2 text-[10.5px] text-amber-900 leading-tight">
            ℹ️ <strong>Règle de publication :</strong> Pour garantir la véracité des informations médicales, votre annonce sera examinée et validée par le Superadmin National avant diffusion.
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#ea2d6d] py-2.5 font-bold text-white shadow hover:bg-[#8e3856]"
          >
            Soumettre pour validation Superadmin
          </button>
        </form>
      </div>
    </div>
  );
}
