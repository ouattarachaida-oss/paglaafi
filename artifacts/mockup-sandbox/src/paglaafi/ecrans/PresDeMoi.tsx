import { useEffect } from "react";
import { LocateFixed, Map as IconeCarte, MapPin, Navigation, Phone } from "lucide-react";
import { MODE_REEL } from "../config";
import { useCentres } from "../etat/contextes";
import { formaterDistance, urlItineraire, type CentreProche } from "../lib/proximite";
import { BadgeOSM, BadgeStatutCentre, Bouton, Carte, EtatVide, Squelette } from "../composants/ui";
import { EspaceProCentres, estOSM } from "./Centres";

/** Boutons d'action d'un centre : Appeler (si téléphone) et Y aller (si coordonnées). */
function Actions({ p, grand }: { p: CentreProche; grand?: boolean }) {
  const c = p.centre;
  const tel = c.phone?.trim();
  const hauteur = grand ? "min-h-[52px] text-corps" : "min-h-12 text-petit";
  return (
    <div className="flex gap-2">
      {tel && (
        <a
          href={`tel:${tel.replace(/\s+/g, "")}`}
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-bouton border-[1.5px] border-action bg-surface px-3 font-semibold text-action ${hauteur}`}
          aria-label={`Appeler ${c.name}`}
        >
          <Phone size={20} aria-hidden /> Appeler
        </a>
      )}
      {c.lat !== null && c.lng !== null && (
        <a
          href={urlItineraire(c.lat, c.lng, c.name)}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-bouton bg-action px-3 font-semibold text-sur-action shadow-carte ${hauteur}`}
          aria-label={`Y aller : itinéraire vers ${c.name}`}
        >
          <Navigation size={20} aria-hidden /> Y aller
        </a>
      )}
    </div>
  );
}

/** Distance (« 2,1 km ») ou ville quand la position n'est pas connue. */
function OuEstIl({ p }: { p: CentreProche }) {
  return (
    <span className="flex items-center gap-1 text-petit text-texte-2">
      <MapPin size={16} aria-hidden />
      {p.distance !== null ? <strong className="text-prune-900">{formaterDistance(p.distance)}</strong> : null}
      <span>{p.distance !== null ? `· ${p.centre.city}` : p.centre.place || p.centre.city}</span>
    </span>
  );
}

/**
 * « Près de moi » : le centre le plus proche (Appeler / Y aller en 52 px), puis les
 * autres triés par distance (ou par ville), deux filtres, lien vers la carte complète.
 */
export function PresDeMoi() {
  const {
    centers,
    centresProches,
    etatPosition,
    ville,
    filtresProches,
    setFiltresProches,
    setSelectedCenter,
    setViewMode,
    setChoixVilleOuvert,
    accepterPosition,
    centreApercu,
    grandEcran,
    focaliser,
  } = useCentres();

  // Synchronisation carte → liste (ordinateur) : le centre choisi sur la carte est mis en vue
  useEffect(() => {
    if (grandEcran && centreApercu) document.getElementById(`centre-${centreApercu.id}`)?.scrollIntoView({ block: "nearest" });
  }, [centreApercu, grandEcran]);

  const [premier, ...autres] = centresProches;
  const contexte =
    etatPosition === "recherche"
      ? "Recherche de votre position…"
      : etatPosition === "ok"
        ? "Autour de votre position"
        : ville
          ? `Centres à ${ville} d'abord`
          : "Choisissez votre ville pour trier les centres";

  const filtre = (cle: "disponible" | "mammographe", libelle: string) => (
    <button
      type="button"
      aria-pressed={filtresProches[cle]}
      onClick={() => setFiltresProches({ ...filtresProches, [cle]: !filtresProches[cle] })}
      className={`min-h-11 shrink-0 rounded-full px-4 text-petit font-semibold ${filtresProches[cle] ? "bg-carte-prune text-white" : "border border-bordure bg-surface text-texte"}`}
    >
      {libelle}
    </button>
  );

  return (
    <section className="anim-apparition min-w-0 space-y-4" aria-labelledby="titre-pres-de-moi">
      <div>
        <h1 id="titre-pres-de-moi" className="text-display text-prune-900">
          Près de moi
        </h1>
        <p className="mt-1 text-corps text-texte-2" aria-live="polite">
          {contexte}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-4">
          <Bouton variante="discret" onClick={() => setChoixVilleOuvert(true)}>
            Changer de ville
          </Bouton>
          {etatPosition !== "ok" && etatPosition !== "recherche" && (
            <Bouton variante="discret" onClick={accepterPosition}>
              <LocateFixed size={18} aria-hidden /> Utiliser ma position
            </Bouton>
          )}
        </div>
      </div>

      <div className="defilement-discret flex gap-2 overflow-x-auto" role="group" aria-label="Filtres">
        {filtre("disponible", "Disponible aujourd'hui")}
        {filtre("mammographe", "Avec mammographe")}
      </div>

      {MODE_REEL && centers.length === 0 ? (
        <div role="status">
          <EtatVide
            icone={<MapPin size={24} />}
            titre="Aucun centre vérifié pour le moment"
            texte="Les informations des centres (disponibilités, tarifs, contacts) sont en cours de vérification auprès des structures de santé. En cas d'urgence, rendez-vous au centre de santé le plus proche."
          />
        </div>
      ) : etatPosition === "recherche" ? (
        <Squelette lignes={4} />
      ) : !premier ? (
        <EtatVide icone={<MapPin size={24} />} titre="Aucun centre ne correspond" texte="Retirez un filtre pour voir plus de centres." />
      ) : (
        <>
          {/* Le plus proche */}
          <Carte className={`space-y-3 border-2 ${centreApercu?.id === premier.centre.id ? "border-action" : "border-action/40"}`} id={`centre-${premier.centre.id}`}>
            <p className="text-petit font-semibold text-action">{etatPosition === "ok" ? "Le plus proche" : "Suggestion"}</p>
            <button type="button" onClick={() => setSelectedCenter(premier.centre)} className="text-left text-titre text-prune-900 underline-offset-4 hover:underline">
              {premier.centre.name}
            </button>
            <div className="flex flex-wrap items-center gap-2">
              <BadgeStatutCentre statut={premier.centre.status} />
              <span className="text-petit text-texte-2">Mis à jour : {premier.centre.lastUpdate}</span>
              {estOSM(premier.centre) && <BadgeOSM />}
            </div>
            <OuEstIl p={premier} />
            <Actions p={premier} grand />
          </Carte>

          {/* Les autres, par distance */}
          {autres.length > 0 && (
            <ul className="space-y-3" aria-label="Autres centres, du plus proche au plus loin">
              {autres.map((p) => (
                <li
                  key={p.centre.id}
                  id={`centre-${p.centre.id}`}
                  className={`space-y-2 rounded-carte border bg-surface p-4 shadow-carte ${centreApercu?.id === p.centre.id ? "border-action" : "border-bordure"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <button type="button" onClick={() => setSelectedCenter(p.centre)} className="text-left text-corps font-semibold text-prune-900 underline-offset-4 hover:underline">
                      {p.centre.name}
                    </button>
                    {grandEcran && p.centre.lat !== null && (
                      <button
                        type="button"
                        onClick={() => focaliser(p.centre)}
                        aria-label={`Voir ${p.centre.name} sur la carte`}
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-texte-2 active:bg-rose-200"
                      >
                        <IconeCarte size={20} aria-hidden />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <BadgeStatutCentre statut={p.centre.status} />
                    {estOSM(p.centre) && <BadgeOSM />}
                  </div>
                  <OuEstIl p={p} />
                  <Actions p={p} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <div className="flex justify-center">
        <Bouton variante="discret" onClick={() => setViewMode("carte")}>
          <IconeCarte size={18} aria-hidden /> Voir sur la carte
        </Bouton>
      </div>

      <EspaceProCentres />
    </section>
  );
}
