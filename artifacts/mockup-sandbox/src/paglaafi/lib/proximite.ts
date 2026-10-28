/**
 * Proximité des centres, calculée UNIQUEMENT sur l'appareil : la position n'est
 * jamais envoyée au serveur ni enregistrée (seule la ville choisie à la place est
 * gardée sur l'appareil).
 */
import type { HealthCenter } from "../types";

export interface Position {
  lat: number;
  lng: number;
}

const aCoordonnees = (c: HealthCenter): c is HealthCenter & { lat: number; lng: number } =>
  typeof c.lat === "number" && typeof c.lng === "number";

/** Distance à vol d'oiseau en kilomètres (formule de haversine). */
export function distanceKm(a: Position, b: Position): number {
  const r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r;
  const dLng = (b.lng - a.lng) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/** « 850 m », « 2,1 km », « 34 km ». */
export function formaterDistance(km: number): string {
  if (km < 1) return `${Math.max(10, Math.round((km * 1000) / 10) * 10)} m`;
  return `${km.toLocaleString("fr-FR", { maximumFractionDigits: km < 10 ? 1 : 0 })} km`;
}

/** Itinéraire : Apple Plans sur iPhone, iPad et Mac, Google Maps ailleurs. */
export function urlItineraire(lat: number, lng: number, nom: string): string {
  const apple = typeof navigator !== "undefined" && /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
  return apple
    ? `https://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(nom)}`
    : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

const normaliser = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

export interface CentreProche {
  centre: HealthCenter;
  distance: number | null;
}

/**
 * Tri « Près de moi » : par distance si la position est connue, sinon les centres
 * de la ville choisie d'abord (par nom), puis les autres. Les centres sans
 * coordonnées n'ont pas de distance et passent en fin de liste.
 */
export function trierParProximite(centres: HealthCenter[], position: Position | null, ville: string): CentreProche[] {
  const liste = centres.map((c) => ({ centre: c, distance: position && aCoordonnees(c) ? distanceKm(position, c) : null }));
  const v = normaliser(ville);
  return liste.sort((a, b) => {
    const sansA = !aCoordonnees(a.centre);
    const sansB = !aCoordonnees(b.centre);
    if (sansA !== sansB) return sansA ? 1 : -1;
    if (a.distance !== null && b.distance !== null) return a.distance - b.distance;
    if (v) {
      const dansA = normaliser(a.centre.city) === v;
      const dansB = normaliser(b.centre.city) === v;
      if (dansA !== dansB) return dansA ? -1 : 1;
    }
    return a.centre.name.localeCompare(b.centre.name, "fr");
  });
}

export { aCoordonnees };
