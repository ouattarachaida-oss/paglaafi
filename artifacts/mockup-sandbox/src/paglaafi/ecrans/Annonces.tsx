import { CalendarDays, Clock, Expand, Megaphone, Phone, Plus, Sparkles } from "lucide-react";
import { useAuth, useAnnonces } from "../etat/contextes";
import { Badge, Bouton, EtatVide, OngletsSoulignes } from "../composants/ui";
import type { PartnerAnnouncement } from "../types";

type Filtre = "all" | "month" | "my";

/** Statut d'une annonce (la mention « en attente » rappelle qui peut la voir). */
function StatutAnnonce({ a }: { a: PartnerAnnouncement }) {
  if (a.status === "pending_validation")
    return (
      <div className="bordure-pointillee rounded-bouton bg-attention-fond px-3 py-2 text-petit text-attention">
        <p className="flex items-center gap-1.5 font-semibold">
          <Clock size={16} aria-hidden /> En attente de validation
        </p>
        <p>Visible seulement par vous jusqu'à la validation.</p>
      </div>
    );
  if (a.status === "rejected") return <Badge ton="alerte">Refusée</Badge>;
  return <Badge ton="succes">Publiée</Badge>;
}

/**
 * Annonces & Événements : onglets (À venir, Ce mois-ci, Mes annonces), cartes avec
 * grande affiche (« Voir l'affiche »), date en rose et statut ; « Publier » pour les structures.
 */
export function Annonces() {
  const { currentUser } = useAuth();
  const { announcementsFilter, displayedAnnouncements, setAnnouncementsFilter, setSelectedPosterModal, setShowNewAnnouncementModal } = useAnnonces();
  const structure = currentUser?.role === "admin" || currentUser?.role === "superadmin";
  const filtre: Filtre = announcementsFilter === "rose_ai" ? "all" : announcementsFilter;

  return (
    <section className="anim-apparition">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-display text-prune-900">Annonces & Événements</h1>
        {structure && (
          <Bouton icone={<Plus size={20} aria-hidden />} onClick={() => setShowNewAnnouncementModal(true)}>
            Publier
          </Bouton>
        )}
      </div>

      <div className="mt-4">
        <OngletsSoulignes<Filtre>
          libelle="Filtrer les annonces"
          valeur={filtre}
          onChange={setAnnouncementsFilter}
          onglets={[
            { id: "all", libelle: "À venir" },
            { id: "month", libelle: "Ce mois-ci" },
            ...(structure ? [{ id: "my" as const, libelle: "Mes annonces" }] : []),
          ]}
        />
      </div>

      {displayedAnnouncements.length === 0 ? (
        <div className="mt-4">
          <EtatVide icone={<Megaphone size={24} />} titre="Aucune annonce dans cette catégorie" texte="Les événements validés apparaîtront ici." />
        </div>
      ) : (
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {displayedAnnouncements.map((a) => (
            <li key={a.id} className="flex flex-col overflow-hidden rounded-carte border border-bordure bg-surface shadow-carte">
              {a.imageUrl && (
                <div className="relative">
                  <img src={a.imageUrl} alt={a.imageCaption || `Affiche : ${a.title}`} loading="lazy" className="aspect-[4/3] w-full object-cover" width={640} height={480} />
                  <button
                    type="button"
                    onClick={() => setSelectedPosterModal({ url: a.imageUrl!, title: a.title, author: a.author, caption: a.imageCaption })}
                    className="absolute bottom-3 right-3 inline-flex min-h-11 items-center gap-1.5 rounded-bouton bg-nuit/85 px-3 text-petit font-semibold text-white"
                  >
                    <Expand size={16} aria-hidden /> Voir l'affiche
                  </button>
                </div>
              )}
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="flex items-center gap-1.5 text-petit font-semibold text-action">
                  <CalendarDays size={16} aria-hidden /> {a.date}
                </p>
                <h2 className="text-sous-titre text-prune-900">{a.title}</h2>
                <p className="text-petit text-texte-2">
                  {a.author} · {a.city}
                </p>
                {a.isRoseAIDetected && (
                  <p className="flex items-center gap-1.5 text-petit text-texte-2">
                    <Sparkles size={16} aria-hidden /> Repérée par la veille Rose IA · {a.sourceWebUrl}
                  </p>
                )}
                <p className="text-corps text-texte">{a.content}</p>
                {a.contact && (
                  <p className="flex items-center gap-1.5 text-petit text-texte-2">
                    <Phone size={16} aria-hidden /> {a.contact}
                  </p>
                )}
                <div className="mt-auto pt-2">
                  <StatutAnnonce a={a} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
