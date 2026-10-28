import { LocateFixed, MapPin, Navigation, Phone, ScanLine, Users } from "lucide-react";
import { MODE_REEL } from "../config";
import { useCentres } from "../etat/contextes";
import { formaterDistance, urlItineraire, type CentreProche } from "../lib/proximite";
import { NIVEAUX, niveauAttente, resumeAttente, type NiveauAttente } from "../lib/attente";
import type { HealthCenter } from "../types";
import { Bouton, EtatVide, Feuille, Squelette } from "../composants/ui";
import { EspaceProCentres } from "./Centres";

/** Pastille de couleur + libellé d'attente (jamais la couleur seule). */
function Attente({ c }: { c: HealthCenter }) {
  const n = NIVEAUX[niveauAttente(c)];
  return (
    <span className="inline-flex items-center gap-1.5 text-petit">
      <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: n.couleur }} aria-hidden />
      <span className="font-semibold text-prune-900">{n.libelle}</span>
      <span className="text-texte-2">· {resumeAttente(c)}</span>
    </span>
  );
}

/** Appeler (si téléphone) et Y aller (si coordonnées). */
function Actions({ c, grand }: { c: HealthCenter; grand?: boolean }) {
  const tel = c.phone?.trim();
  const h = grand ? "min-h-[52px] text-corps" : "min-h-12 text-petit";
  return (
    <div className="flex gap-2">
      {tel && (
        <a
          href={`tel:${tel.replace(/\s+/g, "")}`}
          aria-label={`Appeler ${c.name}`}
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-bouton border-[1.5px] border-action bg-surface px-3 font-semibold text-action ${h}`}
        >
          <Phone size={20} aria-hidden /> Appeler
        </a>
      )}
      {c.lat !== null && c.lng !== null && (
        <a
          href={urlItineraire(c.lat, c.lng, c.name)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Y aller : itinéraire vers ${c.name}`}
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-bouton bg-action px-3 font-semibold text-sur-action shadow-carte ${h}`}
        >
          <Navigation size={20} aria-hidden /> Y aller
        </a>
      )}
    </div>
  );
}

/** Fiche d'un centre au milieu de l'écran (appui sur la carte ou sur la liste). */
function FicheRapide() {
  const { centreApercu: c, setCentreApercu, setSelectedCenter, centresProches } = useCentres();
  const distance = c ? centresProches.find((p) => p.centre.id === c.id)?.distance ?? null : null;
  return (
    <Feuille
      ouverte={!!c}
      onFermer={() => setCentreApercu(null)}
      centree
      titre={c?.name ?? ""}
      sousTitre={c ? (distance !== null ? `${formaterDistance(distance)} · ${c.city}` : c.place || c.city) : undefined}
      pied={
        c && (
          <div className="space-y-2">
            <Actions c={c} grand />
            <Bouton
              variante="discret"
              className="w-full justify-center"
              onClick={() => {
                setCentreApercu(null);
                setSelectedCenter(c);
              }}
            >
              Voir la fiche complète
            </Bouton>
          </div>
        )
      }
    >
      {c && (
        <dl className="space-y-3 text-corps">
          <div>
            <dt className="text-petit text-texte-2">File d'attente</dt>
            <dd>
              <Attente c={c} />
            </dd>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <dt className="flex items-center gap-1 text-petit text-texte-2">
                <ScanLine size={16} aria-hidden /> Mammographe
              </dt>
              <dd className="font-semibold text-prune-900">{c.isApparatusWorking ? "Fonctionnel" : "Non disponible"}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1 text-petit text-texte-2">
                <Users size={16} aria-hidden /> Personnel
              </dt>
              <dd className="font-semibold text-prune-900">{c.agentsPresent} présent(s)</dd>
            </div>
          </div>
          <p className="text-petit text-texte-2">Mis à jour : {c.lastUpdate}</p>
        </dl>
      )}
    </Feuille>
  );
}

/**
 * Centres proches : carte toujours visible (marqueurs colorés selon l'attente, qui
 * clignotent), légende, puis la liste triée par distance (ou par ville). Un appui
 * sur un centre ouvre sa fiche au milieu de l'écran.
 */
export function PresDeMoi() {
  const { centers, centresProches, etatPosition, ville, filtresProches, setFiltresProches, setChoixVilleOuvert, accepterPosition, setCentreApercu, mapContainerRef } = useCentres();

  const contexte =
    etatPosition === "recherche" ? "Recherche de votre position…" : etatPosition === "ok" ? "Autour de votre position" : ville ? `Centres à ${ville} d'abord` : "Choisissez votre ville";

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
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <div>
          <h1 id="titre-pres-de-moi" className="text-display text-prune-900">
            Centres proches
          </h1>
          <p className="text-corps text-texte-2" aria-live="polite">
            {contexte}
          </p>
        </div>
        <div className="flex gap-x-3">
          <Bouton variante="discret" onClick={() => setChoixVilleOuvert(true)}>
            Changer de ville
          </Bouton>
          {etatPosition !== "ok" && etatPosition !== "recherche" && (
            <Bouton variante="discret" onClick={accepterPosition}>
              <LocateFixed size={18} aria-hidden /> Ma position
            </Bouton>
          )}
        </div>
      </div>

      {/* Carte toujours visible */}
      <div className="overflow-hidden rounded-carte border border-bordure">
        <div ref={mapContainerRef} className="z-10 h-[42dvh] min-h-[260px] w-full md:h-[460px]" role="region" aria-label="Carte des centres de santé" />
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-petit text-texte" aria-label="Légende de la carte">
        {(["court", "moyen", "long", "inconnu", "ferme"] as NiveauAttente[]).map((n) => (
          <li key={n} className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ background: NIVEAUX[n].couleur }} aria-hidden />
            {NIVEAUX[n].libelle}
          </li>
        ))}
      </ul>

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
      ) : centresProches.length === 0 ? (
        <EtatVide icone={<MapPin size={24} />} titre="Aucun centre ne correspond" texte="Retirez un filtre pour voir plus de centres." />
      ) : (
        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2" aria-label="Centres, du plus proche au plus loin">
          {centresProches.map((p: CentreProche, i) => (
            <li key={p.centre.id} className={`space-y-2 rounded-carte border bg-surface p-4 shadow-carte ${i === 0 ? "border-2 border-action" : "border-bordure"}`}>
              {i === 0 && <p className="text-petit font-semibold text-action">{etatPosition === "ok" ? "Le plus proche" : "Suggestion"}</p>}
              <button type="button" onClick={() => setCentreApercu(p.centre)} className="block text-left text-corps font-semibold text-prune-900 underline-offset-4 hover:underline">
                {p.centre.name}
              </button>
              <Attente c={p.centre} />
              {p.distance !== null && (
                <p className="flex items-center gap-1 text-petit text-texte-2">
                  <MapPin size={16} aria-hidden /> <strong className="text-prune-900">{formaterDistance(p.distance)}</strong> · {p.centre.city}
                </p>
              )}
              <Actions c={p.centre} grand={i === 0} />
            </li>
          ))}
        </ul>
      )}

      <EspaceProCentres />
      <FicheRapide />
    </section>
  );
}
