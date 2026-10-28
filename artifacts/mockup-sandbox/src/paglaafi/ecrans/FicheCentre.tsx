import { useEffect, useRef } from "react";
import { ArrowLeft, Clock, MapPin, Navigation, Phone, ScanLine, Users, UsersRound } from "lucide-react";
import { useCentres } from "../etat/contextes";
import { Bouton, Carte, EtatVide, STATUTS_CENTRE } from "../composants/ui";
import { NIVEAUX, niveauAttente, resumeAttente } from "../lib/attente";

const FOND_STATUT: Record<string, string> = {
  succes: "bg-succes-fond text-succes",
  attention: "bg-attention-fond text-attention",
  alerte: "bg-alerte-fond text-alerte",
  info: "bg-info-fond text-info",
  neutre: "bg-surface-2 text-texte",
};

function Info({ icone, titre, valeur, detail }: { icone: React.ReactNode; titre: string; valeur: string; detail?: string }) {
  return (
    <div className="rounded-carte border border-bordure bg-surface p-3">
      <p className="flex items-center gap-1.5 text-petit text-texte-2">
        {icone} {titre}
      </p>
      <p className="mt-1 text-corps font-semibold text-prune-900">{valeur}</p>
      {detail && <p className="text-petit text-texte-2">{detail}</p>}
    </div>
  );
}

/**
 * Fiche d'un centre : statut du jour avec l'heure de mise à jour, Appeler et Itinéraire,
 * équipement, personnel, file et attente, consigne du jour, examens et tarifs,
 * niveau d'attente (même couleur que sur la carte). Aucune traduction sur les centres.
 * Ordinateur : informations et mini-carte côte à côte.
 */
export function FicheCentre() {
  const { mapInstanceRef, openNavigation, selectedCenter: c, setSelectedCenter } = useCentres();
  const carteRef = useRef<HTMLDivElement>(null);

  // Mini-carte du centre (ordinateur)
  useEffect(() => {
    if (!c || !carteRef.current || c.lat === null || c.lng === null) return;
    let carte: any = null;
    let actif = true;
    void import("leaflet").then((module: any) => {
      const L = module.default ?? module;
      if (!actif || !carteRef.current) return;
      carte = L.map(carteRef.current, { zoomControl: false, attributionControl: true, dragging: false, scrollWheelZoom: false }).setView([c.lat, c.lng], 15);
      carte.attributionControl.setPrefix(false);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© contributeurs OpenStreetMap" }).addTo(carte);
      L.circleMarker([c.lat, c.lng], { radius: 10, color: "#fff", weight: 3, fillColor: "#d41e5c", fillOpacity: 1 }).addTo(carte);
      setTimeout(() => actif && carte?.invalidateSize(), 150);
    });
    return () => {
      actif = false;
      carte?.remove();
    };
  }, [c]);

  if (!c) return null;
  const statut = STATUTS_CENTRE[c.status] ?? STATUTS_CENTRE.outdated;
  const telephone = c.phone?.trim();

  return (
    <section className="anim-apparition">
      <Bouton
        variante="discret"
        onClick={() => {
          setSelectedCenter(null);
          setTimeout(() => mapInstanceRef.current?.invalidateSize(), 150);
        }}
      >
        <ArrowLeft size={18} aria-hidden /> Retour aux centres
      </Bouton>

      <div className="mt-2 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
          <div>
            <h1 className="text-titre text-prune-900">{c.name}</h1>
            <p className="mt-1 flex items-start gap-1.5 text-corps text-texte-2">
              <MapPin size={20} aria-hidden className="mt-0.5 shrink-0" /> {c.address ? `${c.address} (${c.place})` : c.place}
            </p>
          </div>

          <div className={`flex items-center gap-3 rounded-carte p-4 ${FOND_STATUT[statut.ton] ?? FOND_STATUT.neutre}`} role="status">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white" style={{ background: statut.couleur }} aria-hidden>
              {statut.icone}
            </span>
            <div>
              <p className="text-sous-titre">{statut.libelle}</p>
              <p className="text-petit">Mis à jour : {c.lastUpdate}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
            {telephone ? (
              <a
                href={`tel:${telephone}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-bouton bg-action px-4 text-corps font-semibold text-sur-action shadow-carte active:bg-action-appui"
              >
                <Phone size={20} aria-hidden /> Appeler
              </a>
            ) : (
              <p className="flex min-h-12 items-center justify-center rounded-bouton bg-surface-2 px-4 text-petit text-texte-2">Téléphone non renseigné</p>
            )}
            <Bouton variante="secondaire" icone={<Navigation size={20} aria-hidden />} onClick={() => openNavigation(c.lat, c.lng, c.name)}>
              Itinéraire
            </Bouton>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Info icone={<ScanLine size={16} aria-hidden />} titre="Mammographe" valeur={c.apparatus} detail={c.isApparatusWorking ? "Fonctionnel" : "Non fonctionnel ou non renseigné"} />
            <Info icone={<UsersRound size={16} aria-hidden />} titre="Personnel" valeur={`${c.agentsPresent} présent(s)`} detail={c.staffDescription || undefined} />
            <Info icone={<Users size={16} aria-hidden />} titre="File d'attente" valeur={NIVEAUX[niveauAttente(c)].libelle} detail={resumeAttente(c)} />
            <Info icone={<Clock size={16} aria-hidden />} titre="Attente estimée" valeur={c.estimatedWait || "Non renseignée"} />
          </div>

          {c.audioMessageFr.trim() && (
            <Carte douce>
              <h2 className="text-corps font-semibold text-prune-900">Consigne du jour</h2>
              <p className="mt-1 text-corps text-texte">{c.audioMessageFr}</p>
            </Carte>
          )}

          <Carte>
            <h2 className="text-sous-titre text-prune-900">Examens et tarifs</h2>
            {c.exams.length === 0 ? (
              <div className="mt-3">
                <EtatVide icone={<ScanLine size={24} />} titre="Tarifs non renseignés" texte="Renseignez-vous directement auprès du centre." />
              </div>
            ) : (
              <ul className="mt-2 divide-y divide-bordure">
                {c.exams.map((e, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 py-2.5 text-corps">
                    <span className="text-texte">{e.name}</span>
                    <span className={`shrink-0 font-semibold ${e.free ? "text-succes" : "text-prune-900"}`}>
                      {e.free ? "0 FCFA (Gratuit)" : `${e.price.toLocaleString("fr-FR")} FCFA`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Carte>

          {telephone && (
            <p className="flex items-center gap-2 text-corps text-texte">
              <Phone size={18} aria-hidden className="text-texte-2" /> {telephone}
            </p>
          )}
        </div>

        <div className="hidden lg:block">
          <div ref={carteRef} className="sticky top-20 h-[360px] overflow-hidden rounded-carte border border-bordure" role="region" aria-label={`Position de ${c.name} sur la carte`} />
        </div>
      </div>
    </section>
  );
}
