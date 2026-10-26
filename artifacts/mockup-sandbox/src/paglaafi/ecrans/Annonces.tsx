import { Eye, Sparkles } from "lucide-react";
import { useUi, useAuth, useAnnonces } from "../etat/contextes";

/**
 * Onglet Annonces : filtres, affiches et publication par les partenaires.
 */
export function Annonces() {
  const { section } = useUi();
  const { currentUser } = useAuth();
  const {
    announcements,
    announcementsFilter,
    displayedAnnouncements,
    setAnnouncementsFilter,
    setSelectedPosterModal,
    setShowNewAnnouncementModal,
  } = useAnnonces();

  return (
    <section className="ph-enter px-5 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
            Actualités & Partenaires
          </span>
          <h1 className="ph-display text-[26px] leading-tight text-[#580e36]">Annonces</h1>
        </div>
        {/* Bouton de publication pour les partenaires et soignants */}
        {(currentUser?.role === "admin" || currentUser?.role === "superadmin") && (
          <button
            onClick={() => setShowNewAnnouncementModal(true)}
            className="rounded-full bg-[#ea2d6d] px-3.5 py-1 text-xs font-bold text-white shadow hover:bg-[#8e3856]"
          >
            + Publier
          </button>
        )}
      </div>

      {/* FILTRES D'ANNONCES : MOIS EN COURS / TOUTES / VEILLE ROSE IA / MES ANNONCES */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
        <button
          onClick={() => setAnnouncementsFilter("month")}
          className={`rounded-full px-3 py-1 font-bold transition ${announcementsFilter === "month" ? "bg-[#ea2d6d] text-white shadow-xs" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
        >
          📅 Mois en cours (Octobre 2026)
        </button>
        <button
          onClick={() => setAnnouncementsFilter("rose_ai")}
          className={`rounded-full px-3 py-1 font-bold transition inline-flex items-center gap-1 ${announcementsFilter === "rose_ai" ? "bg-purple-900 text-white shadow-xs" : "border border-purple-200 bg-purple-50 text-purple-900"}`}
        >
          <Sparkles size={12} className="text-amber-400" />
          <span>
            Veille Rose IA ({announcements.filter((a) => a.isRoseAIDetected && a.status === "approved").length})
          </span>
        </button>
        <button
          onClick={() => setAnnouncementsFilter("all")}
          className={`rounded-full px-3 py-1 font-bold transition ${announcementsFilter === "all" ? "bg-[#ea2d6d] text-white shadow-xs" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
        >
          Toutes ({announcements.filter((a) => a.status === "approved").length})
        </button>
        {(currentUser?.role === "admin" || currentUser?.role === "superadmin") && (
          <button
            onClick={() => setAnnouncementsFilter("my")}
            className={`rounded-full px-3 py-1 font-bold transition ${announcementsFilter === "my" ? "bg-[#ea2d6d] text-white shadow-xs" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
          >
            Mes soumissions (
            {
              announcements.filter(
                (a) =>
                  a.submittedBy === currentUser?.structureName ||
                  a.submittedBy === `${currentUser?.prenom} ${currentUser?.nom}`,
              ).length
            }
            )
          </button>
        )}
      </div>

      <div className="mt-3 space-y-2.5">
        {displayedAnnouncements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#dfb3c1] bg-[#fffafb] p-6 text-center text-xs text-[#815569]">
            Aucune annonce dans cette catégorie pour le moment.
          </div>
        ) : (
          displayedAnnouncements.map((a) => (
            <div
              key={a.id}
              className={`rounded-2xl border p-3.5 text-xs shadow-sm ${
                a.isRoseAIDetected
                  ? "border-purple-200 bg-gradient-to-br from-white to-purple-50/40"
                  : "border-[#efdfe4] bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${a.badgeColor}`}>{a.badge}</span>
                <span className="text-[10px] text-[#8e6878] font-semibold">{a.month}</span>
              </div>

              {/* Mention spéciale si repérée par Rose IA */}
              {a.isRoseAIDetected && (
                <div className="mt-1 flex items-center gap-1 text-[9.5px] font-bold text-purple-900 bg-purple-100/70 px-2 py-0.5 rounded-lg w-fit">
                  <Sparkles size={11} className="text-amber-500" />
                  <span>Veille intelligente Rose IA · {a.sourceWebUrl}</span>
                </div>
              )}

              <h3 className="ph-display mt-1 text-sm font-bold text-[#580e36]">{a.title}</h3>
              <p className="text-[11px] text-[#8c405c] mt-0.5 font-semibold">
                {a.author} · {a.city}
              </p>

              {/* Affiche officielle ou photo de l'événement */}
              {a.imageUrl && (
                <div className="relative mt-2 overflow-hidden rounded-xl border border-pink-100 shadow-xs group">
                  <img
                    src={a.imageUrl}
                    alt={a.title}
                    className="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-102"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPosterModal({
                        url: a.imageUrl!,
                        title: a.title,
                        author: a.author,
                        caption: a.imageCaption,
                      })
                    }
                    className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-black/75 px-2 py-1 text-[9.5px] font-bold text-white backdrop-blur-xs hover:bg-black/90 transition shadow-sm"
                  >
                    <Eye size={12} /> Agrandir l'affiche
                  </button>
                </div>
              )}

              <p className="mt-2 text-[#6d4f5e] leading-relaxed">{a.content}</p>

              <div className="mt-2 flex items-center justify-between border-t border-[#f7e8ee] pt-2 text-[10px] text-[#8b6375]">
                <span>📞 {a.contact}</span>
                <span>{a.date}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
