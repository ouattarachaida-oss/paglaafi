/**
 * Échappe le HTML d'une valeur insérée dans une chaîne HTML (popups Leaflet).
 * Indispensable en mode réel : ces textes sont saisis par les administrateurs
 * des centres et ne doivent jamais pouvoir injecter de script (XSS).
 */
export function echapperHtml(valeur: unknown): string {
  return String(valeur ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
