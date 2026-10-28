import { Bell, BellRing, CalendarDays, ChevronRight, LocateFixed, Navigation, Hand, MapPin, RefreshCw, UserPlus } from "lucide-react";
import { roseDailyTips } from "../donnees/conseilsRose";
import { useUi, useAuth, useCentres, useSante, useRose } from "../etat/contextes";
import { estInvitee } from "../composants/entreesMenu";
import { CarrouselAffiches } from "../composants/CarrouselAffiches";
import { sansEmoji } from "../lib/texte";
import { formaterDistance, urlItineraire } from "../lib/proximite";
import { NIVEAUX, niveauAttente, resumeAttente } from "../lib/attente";
import { Bouton, BoutonEcouter, Carte, choisirTexte, EnTeteSection, MentionTraduction } from "../composants/ui";

/** Date du jour : « mercredi 28/10/2026 » (convention JJ/MM/AAAA). */
function dateDuJour() {
  const d = new Date();
  const jour = d.toLocaleDateString("fr-FR", { weekday: "long", timeZone: "Africa/Ouagadougou" });
  const date = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Africa/Ouagadougou" });
  return `${jour.charAt(0).toUpperCase()}${jour.slice(1)} ${date}`;
}

/**
 * Accueil allégé : salutation, « Mon autopalpation », centre le plus proche,
 * conseil du jour et affiches d'événements défilantes (le don et Rose IA sont dans la barre du bas,
 * la langue se choisit dans Comprendre ou le menu).
 */
export function Accueil() {
  const { setSection } = useUi();
  const { currentUser } = useAuth();
  const { appLanguage } = useUi();
  const { setViewMode, plusProche, position, ville, trouverCentreProche, setCentreApercu } = useCentres();
  const { cycleInfo, reglesNotees } = useSante();
  const { dailyTipIndex, handleRequestNotification, notificationEnabled, setDailyTipIndex } = useRose();

  const conseil = roseDailyTips[dailyTipIndex];
  const corpsConseil = choisirTexte({ fr: conseil.fr, en: conseil.en, moore: conseil.moore, dioula: conseil.dioula }, appLanguage);
  const prenom = currentUser && !estInvitee(currentUser) ? currentUser.prenom : "";

  const annonces = (
    <section aria-labelledby="titre-annonces">
      <EnTeteSection
        id="titre-annonces"
        titre="Événements"
        action={
          <Bouton variante="discret" onClick={() => setSection("Annonces")}>
            Tout voir
          </Bouton>
        }
      />
      <CarrouselAffiches />
    </section>
  );

  return (
    <section className="anim-apparition">
      <p className="text-petit text-texte-2">{dateDuJour()}</p>
      <h1 className="mt-1 text-display text-prune-900">Bonjour{prenom ? ` ${prenom}` : ""}</h1>

      <div className="mt-5 space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
          {/* Mon autopalpation */}
          <div className="rounded-carte bg-carte-prune p-5 text-white shadow-carte">
            <p className="flex items-center gap-2 text-petit font-semibold text-white/85">
              <Hand size={18} aria-hidden /> Mon autopalpation
            </p>
            {reglesNotees ? (
              <>
                <p className="mt-2 text-petit text-white/85">Fenêtre idéale ce mois-ci</p>
                <p className="text-titre text-white">{cycleInfo.autopalpWindowStr}</p>
                <p className="mt-1 text-petit text-white/85">Prochaines règles : {cycleInfo.nextPeriodStr}</p>
              </>
            ) : (
              <p className="mt-2 text-corps text-white">Notez le premier jour de vos règles pour connaître le bon moment.</p>
            )}
            <button
              type="button"
              onClick={() => setSection("Calendrier")}
              className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-bouton bg-white px-4 text-corps font-semibold text-[#580e36] active:bg-[#faeff2]"
            >
              <CalendarDays size={20} aria-hidden /> {reglesNotees ? "Mes règles et mon calendrier" : "Noter mes règles"}
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
            <p className="mt-3 text-corps text-texte" data-langue-contenu={corpsConseil.langue}>
              {corpsConseil.texte}
            </p>
            {appLanguage !== "fr" && <MentionTraduction langue={appLanguage} partie={corpsConseil.manquante ? undefined : "Titre"} />}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <BoutonEcouter texte={corpsConseil.texte} langue={corpsConseil.langue} />
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
                    setCentreApercu(plusProche.centre);
                  }}
                  className="text-left text-sous-titre text-prune-900 underline-offset-4 hover:underline"
                >
                  {plusProche.centre.name}
                </button>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-petit text-texte-2">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: NIVEAUX[niveauAttente(plusProche.centre)].couleur }} aria-hidden />
                  <span className="font-semibold text-prune-900">{NIVEAUX[niveauAttente(plusProche.centre)].libelle}</span>
                  <span>· {resumeAttente(plusProche.centre)}</span>
                  <span>· {plusProche.distance !== null ? formaterDistance(plusProche.distance) : plusProche.centre.city}</span>
                </p>
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

          <button
            type="button"
            onClick={() => setSection("Accompagnant")}
            className="flex min-h-12 w-full items-center gap-3 rounded-carte border border-bordure bg-surface px-4 text-left active:bg-rose-100"
          >
            <UserPlus size={20} aria-hidden className="text-rose-500" />
            <span className="flex-1 text-corps font-semibold text-prune-900">Accompagnant·e : inviter un proche</span>
            <ChevronRight size={20} aria-hidden className="text-texte-2" />
          </button>
        </div>

        {/* Affiches défilantes, sur toute la largeur */}
        <div className="min-w-0">
          {annonces}
        </div>
      </div>

    </section>
  );
}
