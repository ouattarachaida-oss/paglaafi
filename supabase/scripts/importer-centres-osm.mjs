/**
 * Import des structures de santé de référence du Burkina Faso depuis OpenStreetMap.
 *
 * Usage :
 *   pnpm run db:centres-osm                         # aperçu, rien n'est écrit
 *   pnpm run db:centres-osm -- --appliquer          # ajoute les centres (non vérifiés, masqués en mode réel)
 *   pnpm run db:centres-osm -- --appliquer --verifier   # les affiche tout de suite (présentation)
 *
 * Retenus : CHU, CHR, CMA, hôpitaux, cliniques, centres médicaux et hospitaliers nommés
 * (les CSPS et les noms génériques sont écartés). Ville = ville OSM la plus proche.
 * Données © contributeurs OpenStreetMap (licence ODbL) : nom, position, et téléphone
 * ou adresse seulement s'ils figurent dans OSM. Rien n'est inventé ; tout reste À VÉRIFIER
 * (statut « Données OpenStreetMap · à vérifier », identifiant OSM conservé pour le suivi).
 * Pas de doublon avec les centres vérifiés ou déjà importés (même nom ou à moins de 150 m),
 * ni entre deux fiches OSM proches (moins de 300 m) partageant un mot du nom.
 */
import { createClient } from "@supabase/supabase-js";
import { exiger, lireEnv } from "./env.mjs";

const APPLIQUER = process.argv.includes("--appliquer");
const VERIFIER = process.argv.includes("--verifier");
const SERVEURS = ["https://maps.mail.ru/osm/tools/overpass/api/interpreter", "https://overpass-api.de/api/interpreter"];
export const MARQUE_OSM = "Données OpenStreetMap · à vérifier";

const env = lireEnv();
exiger(env, "VITE_SUPABASE_URL", "SUPABASE_SECRET_KEY");
const admin = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });

async function overpass(requete) {
  for (const url of SERVEURS) {
    for (let essai = 1; essai <= 2; essai++) {
      try {
        const r = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "PagLaafi/1.0 (import centres)" },
          body: new URLSearchParams({ data: requete }),
          signal: AbortSignal.timeout(150000),
        });
        if (r.ok) return (await r.json()).elements;
      } catch {
        // serveur suivant
      }
    }
  }
  throw new Error("OpenStreetMap (Overpass) injoignable : réessayer plus tard ou depuis un autre réseau.");
}

const REFERENCE = /\b(CHU|CHR|CHUP|CMA|h[oô]pital|hospital|clinique|polyclinique|centre m[ée]dical|centre hospitalier)\b/i;
const EXCLUS = /\b(CSPS|dispensaire|pharmacie|v[ée]t[ée]rinaire|p[ée]diatri\w*|dentaire|ophtalm\w*|yeux|essai)\b/i;
const GENERIQUE = /^(clinique|h[oô]pital|centre m[ée]dical( urbain)?|cma|csps)$/i;
const norm = (t) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const distanceM = (a, b) => {
  const r = Math.PI / 180;
  const x = (b.lng - a.lng) * r * Math.cos(((a.lat + b.lat) / 2) * r);
  const y = (b.lat - a.lat) * r;
  return Math.sqrt(x * x + y * y) * 6371000;
};

console.log("Interrogation d'OpenStreetMap…");
const structures = await overpass(
  `[out:json][timeout:120];area["ISO3166-1"="BF"][admin_level=2]->.bf;(nwr["amenity"~"^(hospital|clinic)$"](area.bf);nwr["healthcare"~"^(hospital|clinic|centre)$"](area.bf););out center tags;`,
);
const villes = (await overpass(`[out:json][timeout:60];node["place"~"^(city|town)$"](9.3,-5.6,15.1,2.5);out;`))
  .filter((v) => v.tags?.name)
  .map((v) => ({ nom: v.tags["name:fr"] || v.tags.name, lat: v.lat, lng: v.lon, ville: v.tags.place === "city" }));

/** Grande ville à moins de 15 km (une structure de quartier), sinon la ville la plus proche. */
function villeDe(pos) {
  const proches = villes.map((v) => ({ ...v, d: distanceM(pos, v) })).sort((a, b) => a.d - b.d);
  return (proches.find((v) => v.ville && v.d < 15000) ?? proches[0]).nom;
}
const MOTS_VIDES = new Set(["centre", "medical", "clinique", "hopital", "hospital", "hospitalier", "regional", "universitaire", "university", "polyclinique", "chu", "chr", "cma", "avec", "antenne", "chirurgicale", "chirurgical", "urbain", "secteur", "saint", "sainte"]);
const motsCles = (nom) => norm(nom).split(" ").filter((m) => m.length >= 4 && !MOTS_VIDES.has(m));

const vus = new Set();
const candidats = [];
for (const s of structures) {
  const t = s.tags ?? {};
  const nom = (t["name:fr"] || t.name || "").split(";")[0].trim();
  const lat = s.lat ?? s.center?.lat;
  const lng = s.lon ?? s.center?.lon;
  if (!nom || lat == null || GENERIQUE.test(nom) || !REFERENCE.test(nom) || EXCLUS.test(nom)) continue;
  if (vus.has(norm(nom))) continue;
  vus.add(norm(nom));
  const pos = { lat, lng };
  const ville = villeDe(pos);
  // Même structure saisie deux fois dans OSM : on garde le nom français
  const doublon = candidats.find((c) => distanceM(c, pos) < 300 && motsCles(c.nom).some((m) => motsCles(nom).includes(m)));
  if (doublon) {
    if (/hospital|university/i.test(doublon.nom) && !/hospital|university/i.test(nom)) candidats.splice(candidats.indexOf(doublon), 1);
    else continue;
  }
  const adresse = [t["addr:housenumber"], t["addr:street"], t["addr:suburb"]].filter(Boolean).join(" ") || null;
  candidats.push({
    nom,
    nom_court: nom.length > 40 ? `${nom.slice(0, 39)}…` : nom,
    lieu: ville,
    ville,
    adresse,
    telephone: t.phone || t["contact:phone"] || null,
    lat,
    lng,
    statut: "outdated",
    statut_libelle: MARQUE_OSM,
    description_personnel: `Fiche importée d'OpenStreetMap (${s.type}/${s.id}) : informations à vérifier auprès de la structure.`,
    verifie: VERIFIER,
  });
}

// Les centres non vérifiés du jeu initial (données fictives, masquées) ne bloquent pas l'import
const { data: existants, error } = await admin
  .from("centres")
  .select("nom, lat, lng")
  .or(`verifie.eq.true,statut_libelle.eq."${MARQUE_OSM}"`);
if (error) throw error;
const nouveaux = candidats.filter(
  (c) =>
    !existants.some(
      (e) => norm(e.nom) === norm(c.nom) || (e.lat != null && e.lng != null && distanceM(e, c) < 150),
    ),
);

console.log(`${structures.length} structures dans OSM, ${candidats.length} de référence, ${nouveaux.length} nouvelles :`);
for (const c of nouveaux) console.log(`  - ${c.nom} (${c.ville})${c.telephone ? " · tél. OSM" : ""}`);

if (!APPLIQUER) {
  console.log("\nAperçu seulement : ajouter --appliquer pour enregistrer (et --verifier pour les afficher en mode réel).");
} else {
  for (let i = 0; i < nouveaux.length; i += 50) {
    const { error: e } = await admin.from("centres").insert(nouveaux.slice(i, i + 50));
    if (e) throw e;
  }
  console.log(`\n${nouveaux.length} centre(s) ajouté(s)${VERIFIER ? ", affichés en mode réel (marqués vérifiés pour la présentation)" : " (non vérifiés, masqués en mode réel)"}.`);
  console.log(`Ils restent à vérifier : filtrer sur le statut « ${MARQUE_OSM} » dans le panneau superadmin.`);
}
