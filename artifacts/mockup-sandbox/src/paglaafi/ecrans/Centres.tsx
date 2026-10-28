import { useEffect, useMemo, useState } from "react";
import { Check, ChevronRight, Clock, Edit3, FileText, LocateFixed, MapPin, Navigation, Search, X } from "lucide-react";
import { MODE_REEL } from "../config";
import { useAuth, useCentres, useOrientations } from "../etat/contextes";
import { BadgeSimulation } from "../composants/BadgeSimulation";
import type { HealthCenter } from "../types";
import { sansEmoji } from "../lib/texte";
import {
  Badge,
  BadgeOSM,
  BadgeStatutCentre,
  Bouton,
  Carte,
  EtatVide,
  ListeDeroulante,
  OngletsSegmentes,
  STATUTS_CENTRE,
} from "../composants/ui";

const PAR_PAGE = 20;
/** Centre importé d'OpenStreetMap (informations à vérifier). */
export const estOSM = (c: HealthCenter) => c.statusLabel.startsWith("Données OpenStreetMap");

/** Puce de filtre (bouton à bascule). */
function Puce({ actif, onClick, children }: { actif: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={actif}
      onClick={onClick}
      className={`min-h-11 shrink-0 rounded-full px-4 text-petit font-semibold ${actif ? "bg-carte-prune text-white" : "border border-bordure bg-surface text-texte"}`}
    >
      {children}
    </button>
  );
}

/** Ligne de la liste des centres. */
function LigneCentre({ c, onFiche, onItineraire }: { c: HealthCenter; onFiche: () => void; onItineraire: () => void }) {
  return (
    <li className="rounded-carte border border-bordure bg-surface p-4 shadow-carte">
      <div className="flex flex-wrap items-center gap-2">
        <BadgeStatutCentre statut={c.status} />
        {estOSM(c) && <BadgeOSM />}
      </div>
      <h3 className="mt-2 text-corps font-semibold text-prune-900">{c.name}</h3>
      <p className="flex items-center gap-1 text-petit text-texte-2">
        <MapPin size={16} aria-hidden /> {c.place}
      </p>
      <div className="mt-3 flex gap-2">
        <Bouton variante="secondaire" taille="petit" className="flex-1" icone={<Navigation size={18} aria-hidden />} onClick={onItineraire}>
          Itinéraire
        </Bouton>
        <Bouton taille="petit" className="flex-1" onClick={onFiche}>
          Voir la fiche <ChevronRight size={18} aria-hidden />
        </Bouton>
      </div>
    </li>
  );
}

/**
 * Carte des soins : recherche, filtre ville, filtres de statut, carte OpenStreetMap
 * (marqueurs regroupés, légende, géolocalisation facultative, aperçu du centre)
 * et liste paginée. Mobile : bascule Carte / Liste ; ordinateur : les deux côte à côte.
 */
export function Centres() {
  const { currentUser } = useAuth();
  const {
    centers,
    cityFilter,
    filteredCenters,
    mapContainerRef,
    openNavigation,
    ouvrirMiseAJourCentre,
    searchQuery,
    setCityFilter,
    setSearchQuery,
    setSelectedCenter,
    setStatusFilter,
    setViewMode,
    statusFilter,
    viewMode,
    centreApercu,
    setCentreApercu,
    grandEcran,
    localiserMoi,
  } = useCentres();
  const { handleValidateOrientationByCenter, setShowOrientationModal, urgentOrientations } = useOrientations();
  const [nb, setNb] = useState(PAR_PAGE);
  useEffect(() => setNb(PAR_PAGE), [searchQuery, statusFilter, cityFilter]);

  const villes = useMemo(() => [...new Set(centers.map((c) => c.city))].sort((a, b) => a.localeCompare(b, "fr")), [centers]);
  const pro = currentUser?.role === "admin" && (currentUser.adminType === "center" || currentUser.adminType === "doctor");
  const afficherCarte = viewMode === "map" || grandEcran;
  const afficherListe = viewMode === "list" || grandEcran;

  return (
    <section className="anim-apparition">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-display text-prune-900">Carte des soins</h1>
        <div className="w-full min-[420px]:w-64 lg:hidden">
          <OngletsSegmentes<"map" | "list">
            libelle="Affichage des centres"
            valeur={viewMode}
            onChange={setViewMode}
            onglets={[
              { id: "map", libelle: "Carte" },
              { id: "list", libelle: `Liste (${filteredCenters.length})` },
            ]}
          />
        </div>
      </div>

      {/* Recherche et filtres */}
      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
        <div className="relative">
          <label htmlFor="recherche-centre" className="sr-only">
            Rechercher un centre, une ville
          </label>
          <Search size={20} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-texte-2" />
          <input
            id="recherche-centre"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un centre, une ville…"
            className="h-12 w-full rounded-champ border-[1.5px] border-bordure-2 bg-surface pl-10 pr-3 text-corps text-texte placeholder:text-indicatif focus:border-2 focus:border-action focus:outline-none focus:ring-4 focus:ring-rose-200"
          />
        </div>
        <ListeDeroulante libelle="Ville" libelleMasque value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
          <option value="all">Toutes les villes</option>
          {villes.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </ListeDeroulante>
      </div>
      <div className="defilement-discret mt-3 flex gap-2 overflow-x-auto" role="group" aria-label="Filtres">
        <Puce actif={statusFilter === "available"} onClick={() => setStatusFilter(statusFilter === "available" ? "all" : "available")}>
          Disponible maintenant
        </Puce>
        <Puce actif={statusFilter === "free"} onClick={() => setStatusFilter(statusFilter === "free" ? "all" : "free")}>
          Examen gratuit
        </Puce>
        {(statusFilter !== "all" || cityFilter !== "all" || searchQuery) && (
          <Bouton
            variante="discret"
            onClick={() => {
              setStatusFilter("all");
              setCityFilter("all");
              setSearchQuery("");
            }}
          >
            Effacer les filtres
          </Bouton>
        )}
      </div>

      {/* Mode réel : état vide explicite tant qu'aucun centre n'a été vérifié (replit.md) */}
      {MODE_REEL && centers.length === 0 && (
        <div role="status" className="mt-4">
          <EtatVide
            icone={<MapPin size={24} />}
            titre="Aucun centre vérifié pour le moment"
            texte="Les informations des centres (disponibilités, tarifs, contacts) sont en cours de vérification auprès des structures de santé. En cas d'urgence, rendez-vous au centre de santé le plus proche."
          />
        </div>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        {afficherCarte && (
          <div className="space-y-3 lg:sticky lg:top-20 lg:self-start">
            <div className="relative h-[340px] overflow-hidden rounded-carte border border-bordure md:h-[440px] lg:h-[calc(100dvh-220px)] lg:min-h-[420px]">
              <div ref={mapContainerRef} className="z-10 h-full w-full" role="region" aria-label="Carte OpenStreetMap des centres" />
              <button
                type="button"
                onClick={localiserMoi}
                aria-label="Centrer la carte sur ma position"
                className="absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full bg-surface text-prune-900 shadow-flottant"
              >
                <LocateFixed size={22} aria-hidden />
              </button>
            </div>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-petit text-texte" aria-label="Légende de la carte">
              {(["available", "busy", "maintenance", "outdated"] as const).map((s) => (
                <li key={s} className="flex items-center gap-1.5">
                  <span className="grid h-6 w-6 place-items-center rounded-full text-white" style={{ background: STATUTS_CENTRE[s].couleur }} aria-hidden>
                    {STATUTS_CENTRE[s].icone}
                  </span>
                  {STATUTS_CENTRE[s].libelle}
                </li>
              ))}
            </ul>

            {centreApercu && (
              <Carte className="anim-apparition" aria-live="polite">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <BadgeStatutCentre statut={centreApercu.status} />
                      {estOSM(centreApercu) && <BadgeOSM />}
                    </div>
                    <h2 className="mt-2 text-sous-titre text-prune-900">{centreApercu.name}</h2>
                    <p className="text-petit text-texte-2">
                      {centreApercu.place} · Mis à jour : {centreApercu.lastUpdate}
                    </p>
                  </div>
                  <button type="button" aria-label="Fermer l'aperçu" onClick={() => setCentreApercu(null)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-texte-2 active:bg-rose-200">
                    <X size={20} aria-hidden />
                  </button>
                </div>
                <div className="mt-3 flex gap-2">
                  <Bouton variante="secondaire" className="flex-1" icone={<Navigation size={18} aria-hidden />} onClick={() => openNavigation(centreApercu.lat, centreApercu.lng, centreApercu.name)}>
                    Itinéraire
                  </Bouton>
                  <Bouton className="flex-1" onClick={() => setSelectedCenter(centreApercu)}>
                    Voir la fiche
                  </Bouton>
                </div>
              </Carte>
            )}
          </div>
        )}

        {afficherListe && (
          <div className="space-y-4">
            {/* Espace des centres et docteurs : orientations d'urgence (simulées) et mise à jour du centre */}
            {pro && (
              <Carte className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sous-titre text-prune-900">
                    {currentUser?.adminType === "center" ? "Orientations d'urgence reçues" : "Vos orientations en cours"}
                  </h2>
                  <BadgeSimulation detail="Orientations fictives : aucune donnée de patiente réelle." />
                  <Badge ton="alerte">{urgentOrientations.length} active(s)</Badge>
                </div>
                <ul className="space-y-3">
                  {urgentOrientations.map((o) => (
                    <li key={o.id} className="space-y-2 rounded-bouton border border-bordure p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-corps font-semibold text-prune-900">
                          {o.patientName} ({o.patientAge} ans)
                        </span>
                        <Badge ton={o.urgencyLevel === "immediate" ? "alerte" : "attention"}>{sansEmoji(o.urgencyLabel)}</Badge>
                      </div>
                      <p className="text-petit text-texte-2">
                        Réf. {o.id} · Prescrit par {o.doctorName} · {o.createdAt}
                      </p>
                      <p className="rounded-bouton bg-surface-2 px-3 py-2 text-petit text-texte">
                        <strong>Examens prescrits :</strong> {o.recommendedExam}
                        <br />
                        <em>« {o.clinicalObservations} »</em>
                      </p>
                      {o.status === "accepted_urgent" ? (
                        <p className="flex items-center gap-2 text-petit font-semibold text-succes">
                          <Check size={18} aria-hidden /> Validé : patiente attendue d'urgence ({o.centerEstimatedDelay})
                        </p>
                      ) : o.status === "scheduled_wait" ? (
                        <p className="flex items-center gap-2 text-petit font-semibold text-attention">
                          <Clock size={18} aria-hidden /> {o.centerValidationMessage}
                        </p>
                      ) : currentUser?.adminType === "center" ? (
                        <div className="flex flex-col gap-2 min-[420px]:flex-row">
                          <Bouton taille="petit" className="flex-1" onClick={() => handleValidateOrientationByCenter(o.id, "immediate")}>
                            Envoyez-la vite (attente &lt; 15 min)
                          </Bouton>
                          <Bouton variante="secondaire" taille="petit" className="flex-1" onClick={() => handleValidateOrientationByCenter(o.id, "scheduled", "~45 min")}>
                            Affluence (créneau 45 min)
                          </Bouton>
                        </div>
                      ) : (
                        <p className="text-petit text-info">En attente de confirmation par {o.targetCenterName}</p>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2">
                  {currentUser?.adminType === "doctor" && (
                    <Bouton variante="secondaire" icone={<FileText size={18} aria-hidden />} onClick={() => setShowOrientationModal(true)}>
                      Orienter une nouvelle patiente
                    </Bouton>
                  )}
                  <Bouton icone={<Edit3 size={18} aria-hidden />} onClick={() => void ouvrirMiseAJourCentre()}>
                    Mettre à jour mon centre
                  </Bouton>
                </div>
              </Carte>
            )}

            {filteredCenters.length === 0 && centers.length > 0 ? (
              <EtatVide icone={<Search size={24} />} titre="Aucun centre ne correspond" texte="Modifiez la recherche ou les filtres." />
            ) : (
              <>
                <p className="text-petit text-texte-2" aria-live="polite">
                  {filteredCenters.length} centre(s)
                </p>
                <ul className="space-y-3">
                  {filteredCenters.slice(0, nb).map((c) => (
                    <LigneCentre key={c.id} c={c} onFiche={() => setSelectedCenter(c)} onItineraire={() => openNavigation(c.lat, c.lng, c.name)} />
                  ))}
                </ul>
                {filteredCenters.length > nb && (
                  <Bouton variante="secondaire" pleineLargeur onClick={() => setNb(nb + PAR_PAGE)}>
                    Afficher plus ({filteredCenters.length - nb} restants)
                  </Bouton>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
