import { Bell, BellRing, CalendarDays, Gift, LocateFixed, Navigation, Hand, MapPin, Megaphone, RefreshCw, Sparkles, UserPlus, Volume2 } from "lucide-react";
import type { ReactNode } from "react";
import { roseDailyTips } from "../donnees/conseilsRose";
import { useUi, useAuth, useAudio, useCentres, useSante, useRose, useAnnonces, useDons } from "../etat/contextes";
import { BadgeSimulation } from "../composants/BadgeSimulation";
import { estInvitee } from "../composants/entreesMenu";
import { sansEmoji } from "../lib/texte";
import { formaterDistance, urlItineraire } from "../lib/proximite";
import { BadgeStatutCentre, Bouton, Carte, EnTeteSection, EtatVide, PucesLangue } from "../composants/ui";

/** Date du jour : « mercredi 28/10/2026 » (convention JJ/MM/AAAA). */
function dateDuJour() {
  const d = new Date();
  const jour = d.toLocaleDateString("fr-FR", { weekday: "long", timeZone: "Africa/Ouagadougou" });
  const date = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Africa/Ouagadougou" });
  return `${jour.charAt(0).toUpperCase()}${jour.slice(1)} ${date}`;
}

function Raccourci({ icone, titre, texte, onClick }: { icone: ReactNode; titre: string; texte: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[120px] flex-col items-start gap-2 rounded-carte border border-bordure bg-surface p-4 text-left shadow-carte transition-colors duration-200 active:bg-rose-100"
    >
      <span className="grid h-10 w-10 place-items-center rounded-full bg-rose-100 text-rose-500" aria-hidden>
        {icone}
      </span>
      <span className="text-corps font-semibold text-prune-900">{titre}</span>
      <span className="text-petit text-texte-2">{texte}</span>
    </button>
  );
}

/**
 * Accueil : salutation, carte « Mon autopalpation », conseil du jour, raccourcis,
 * carte « Offrir un dépistage » et annonces récentes (deux colonnes sur ordinateur).
 */
export function Accueil() {
  const { setSection } = useUi();
  const { currentUser } = useAuth();
  const { handlePlayAudio } = useAudio();
  const { setViewMode, plusProche, position, ville, trouverCentreProche, setSelectedCenter } = useCentres();
  const { cycleInfo } = useSante();
  const { dailyTipIndex, dailyTipLang, handleRequestNotification, notificationEnabled, setDailyTipIndex, setDailyTipLang } = useRose();
  const { announcements } = useAnnonces();
  const { setShowDonationModal } = useDons();

  const conseil = roseDailyTips[dailyTipIndex];
  const texteConseil =
    dailyTipLang === "moore" ? conseil.moore : dailyTipLang === "dioula" ? conseil.dioula : dailyTipLang === "en" ? conseil.en : conseil.fr;
  const recentes = announcements.filter((a) => a.status === "approved").slice(0, 3);
  const prenom = currentUser && !estInvitee(currentUser) ? currentUser.prenom : "";

  const annonces = (
    <section aria-labelledby="titre-annonces">
      <EnTeteSection
        id="titre-annonces"
        titre="Annonces récentes"
        action={
          <Bouton variante="discret" onClick={() => setSection("Annonces")}>
            Tout voir
          </Bouton>
        }
      />
      {recentes.length === 0 ? (
        <EtatVide icone={<Megaphone size={24} />} titre="Aucune annonce pour le moment" texte="Les événements validés des partenaires apparaîtront ici." />
      ) : (
        <ul className="space-y-3">
          {recentes.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => setSection("Annonces")}
                className="flex w-full gap-3 rounded-carte border border-bordure bg-surface p-3 text-left shadow-carte active:bg-rose-100"
              >
                {a.imageUrl ? (
                  <img src={a.imageUrl} alt="" loading="lazy" className="h-16 w-16 shrink-0 rounded-bouton object-cover" width={64} height={64} />
                ) : (
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-bouton bg-rose-100 text-rose-500" aria-hidden>
                    <Megaphone size={24} />
                  </span>
                )}
                <span className="min-w-0">
                  <span className="line-clamp-2 text-corps font-semibold text-prune-900">{a.title}</span>
                  <span className="block truncate text-petit text-texte-2">
                    {a.author} · {a.city}
                  </span>
                  <span className="block text-petit font-semibold text-action">{a.date}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );

  const don = (
    <Carte className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-500" aria-hidden>
          <Gift size={22} />
        </span>
        <div className="min-w-0">
          <h2 className="text-sous-titre text-prune-900">Offrir un dépistage</h2>
          <p className="text-petit text-texte-2">Offrir une mammographie, en don anonyme si vous le souhaitez.</p>
          <BadgeSimulation detail="paiement Orange Money simulé : aucun argent n'est prélevé" />
        </div>
      </div>
      <Bouton variante="secondaire" onClick={() => setShowDonationModal(true)}>
        Faire un don
      </Bouton>
    </Carte>
  );

  return (
    <section className="anim-apparition">
      <p className="text-petit text-texte-2">{dateDuJour()}</p>
      <h1 className="mt-1 text-display text-prune-900">Bonjour{prenom ? ` ${prenom}` : ""}</h1>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          {/* Mon autopalpation */}
          <div className="rounded-carte bg-carte-prune p-5 text-white shadow-carte">
            <p className="flex items-center gap-2 text-petit font-semibold text-white/85">
              <Hand size={18} aria-hidden /> Mon autopalpation
            </p>
            <p className="mt-2 text-petit text-white/85">Fenêtre idéale ce mois-ci</p>
            <p className="text-titre text-white">{cycleInfo.autopalpWindowStr}</p>
            <p className="mt-1 text-petit text-white/85">Prochaines règles : {cycleInfo.nextPeriodStr}</p>
            <button
              type="button"
              onClick={() => setSection("Calendrier")}
              className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-bouton bg-white px-4 text-corps font-semibold text-[#580e36] active:bg-[#faeff2]"
            >
              <CalendarDays size={20} aria-hidden /> Ouvrir mon calendrier
            </button>
          </div>

          {/* Conseil du jour */}
          <Carte>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-petit font-semibold text-texte-2">Conseil du jour · {sansEmoji(conseil.categoryLabel)}</p>
                <h2 className="mt-1 text-sous-titre text-prune-900">{conseil.titleFr}</h2>
              </div>
              <button
                type="button"
                onClick={handleRequestNotification}
                aria-pressed={notificationEnabled}
                aria-label={notificationEnabled ? "Notifications quotidiennes actives" : "Activer les notifications quotidiennes"}
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${notificationEnabled ? "bg-succes-fond text-succes" : "bg-surface-2 text-texte-2"}`}
              >
                {notificationEnabled ? <BellRing size={20} aria-hidden /> : <Bell size={20} aria-hidden />}
              </button>
            </div>
            <div className="mt-3">
              <PucesLangue valeur={dailyTipLang} onChange={setDailyTipLang} libelle="Langue du conseil" />
            </div>
            <p className="mt-3 text-corps text-texte">{texteConseil}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Bouton variante="secondaire" taille="petit" icone={<Volume2 size={18} aria-hidden />} onClick={() => handlePlayAudio(texteConseil, dailyTipLang)}>
                Écouter
              </Bouton>
              <Bouton
                variante="secondaire"
                taille="petit"
                icone={<RefreshCw size={18} aria-hidden />}
                onClick={() => setDailyTipIndex((p) => (p + 1) % roseDailyTips.length)}
              >
                Autre conseil
              </Bouton>
            </div>
          </Carte>

          {/* Centre le plus proche (position ou ville connue), sinon activation de la position */}
          <Carte className="space-y-3">
            <p className="flex items-center gap-2 text-petit font-semibold text-texte-2">
              <MapPin size={18} aria-hidden /> Centre le plus proche
            </p>
            {plusProche && (position || ville) ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSection("Centres");
                    setSelectedCenter(plusProche.centre);
                  }}
                  className="text-left text-sous-titre text-prune-900 underline-offset-4 hover:underline"
                >
                  {plusProche.centre.name}
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <BadgeStatutCentre statut={plusProche.centre.status} />
                  <span className="text-petit text-texte-2">
                    {plusProche.distance !== null ? formaterDistance(plusProche.distance) : plusProche.centre.city}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {plusProche.centre.lat !== null && plusProche.centre.lng !== null && (
                    <a
                      href={urlItineraire(plusProche.centre.lat, plusProche.centre.lng, plusProche.centre.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-bouton bg-action px-4 font-semibold text-sur-action shadow-carte"
                    >
                      <Navigation size={20} aria-hidden /> Y aller
                    </a>
                  )}
                  <Bouton
                    variante="secondaire"
                    className="flex-1"
                    onClick={() => {
                      setSection("Centres");
                      setViewMode("proches");
                    }}
                  >
                    Autres centres
                  </Bouton>
                </div>
              </>
            ) : (
              <>
                <p className="text-corps text-texte">Activez votre position pour voir le centre de santé le plus proche et y aller en un geste.</p>
                <Bouton icone={<LocateFixed size={20} aria-hidden />} onClick={() => void trouverCentreProche()}>
                  Activer ma position
                </Bouton>
              </>
            )}
          </Carte>

          {/* Raccourcis */}
          <section aria-labelledby="titre-raccourcis">
            <h2 id="titre-raccourcis" className="sr-only">
              Raccourcis
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Raccourci icone={<Sparkles size={22} />} titre="Rose IA" texte="Poser une question" onClick={() => setSection("RoseIA")} />
              <Raccourci icone={<Hand size={22} />} titre="Autopalpation" texte="Mon calendrier" onClick={() => setSection("Calendrier")} />
              <div className="col-span-2">
                <Raccourci icone={<UserPlus size={22} />} titre="Accompagnant·e" texte="Inviter un proche" onClick={() => setSection("Accompagnant")} />
              </div>
            </div>
          </section>

        </div>

        {/* Colonne latérale sur ordinateur ; à la suite sur mobile */}
        <aside className="space-y-6">
          {don}
          {annonces}
        </aside>
      </div>

    </section>
  );
}
