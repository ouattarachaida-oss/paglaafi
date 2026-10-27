/**
 * Stockage des données de santé sur l'appareil, en mode réel.
 *
 * Ce que cette protection fait :
 * - les données (cycle, autopalpation, historique) sont rangées sous des clés
 *   propres à chaque compte : la personne suivante sur le même téléphone ne les
 *   voit pas dans l'application ;
 * - elles sont chiffrées (AES-GCM 256 bits, Web Crypto) avec une clé propre au
 *   compte, générée sur l'appareil et NON EXPORTABLE (conservée par le navigateur
 *   dans IndexedDB) : elles ne sont pas lisibles en clair dans le stockage du
 *   navigateur ni dans une copie de ses fichiers.
 *
 * Ce qu'elle ne fait PAS (à ne pas promettre) :
 * - elle ne protège pas contre quelqu'un qui utilise le téléphone déverrouillé
 *   avec la session ouverte, ni contre un appareil compromis : la clé reste sur
 *   l'appareil, sans mot de passe supplémentaire ;
 * - la suppression des données du navigateur ou la désinstallation effacent
 *   aussi la clé : les données deviennent alors illisibles (perte définitive).
 *
 * Sans Web Crypto ou IndexedDB, rien n'est enregistré (les données restent en mémoire).
 */

const BASE = "paglaafi-cles";
const MAGASIN = "cles";
const PREFIXE = "paglaafi:sante:";

const cleStockage = (utilisateur: string, nom: string) => `${PREFIXE}${utilisateur}:${nom}`;

export function stockageDisponible(): boolean {
  return typeof window !== "undefined" && Boolean(window.crypto?.subtle) && typeof indexedDB !== "undefined";
}

function ouvrirBase(): Promise<IDBDatabase> {
  return new Promise((ok, ko) => {
    const req = indexedDB.open(BASE, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(MAGASIN);
    req.onsuccess = () => ok(req.result);
    req.onerror = () => ko(req.error);
  });
}

async function operation<T>(mode: IDBTransactionMode, action: (m: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await ouvrirBase();
  try {
    return await new Promise<T>((ok, ko) => {
      const req = action(db.transaction(MAGASIN, mode).objectStore(MAGASIN));
      req.onsuccess = () => ok(req.result);
      req.onerror = () => ko(req.error);
    });
  } finally {
    db.close();
  }
}

/** Clé du compte (créée au premier enregistrement, non exportable). */
async function cleDuCompte(utilisateur: string, creer: boolean): Promise<CryptoKey | null> {
  const existante = await operation<CryptoKey | undefined>("readonly", (m) => m.get(utilisateur));
  if (existante) return existante;
  if (!creer) return null;
  const cle = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  await operation("readwrite", (m) => m.put(cle, utilisateur));
  return cle;
}

const enBase64 = (o: Uint8Array) => btoa(String.fromCharCode(...o));
const depuisBase64 = (t: string) => Uint8Array.from(atob(t), (c) => c.charCodeAt(0));

/** Enregistre une valeur chiffrée pour le compte. */
export async function enregistrer(utilisateur: string, nom: string, valeur: unknown): Promise<void> {
  if (!stockageDisponible()) return;
  const cle = await cleDuCompte(utilisateur, true);
  if (!cle) return;
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const clair = new TextEncoder().encode(JSON.stringify(valeur));
  const chiffre = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, cle, clair));
  const paquet = new Uint8Array(iv.length + chiffre.length);
  paquet.set(iv);
  paquet.set(chiffre, iv.length);
  localStorage.setItem(cleStockage(utilisateur, nom), enBase64(paquet));
}

/** Lit une valeur du compte (undefined si absente ou illisible). */
export async function lire<T>(utilisateur: string, nom: string): Promise<T | undefined> {
  if (!stockageDisponible()) return undefined;
  const brut = localStorage.getItem(cleStockage(utilisateur, nom));
  if (!brut) return undefined;
  try {
    const cle = await cleDuCompte(utilisateur, false);
    if (!cle) return undefined;
    const paquet = depuisBase64(brut);
    const clair = await crypto.subtle.decrypt({ name: "AES-GCM", iv: paquet.slice(0, 12) }, cle, paquet.slice(12));
    return JSON.parse(new TextDecoder().decode(clair)) as T;
  } catch {
    return undefined; // clé perdue ou donnée altérée : illisible
  }
}

/** Efface toutes les données de santé du compte sur cet appareil, et sa clé. */
export async function effacerCompte(utilisateur: string): Promise<void> {
  if (typeof window === "undefined") return;
  const prefixe = `${PREFIXE}${utilisateur}:`;
  for (const k of Object.keys(localStorage)) if (k.startsWith(prefixe)) localStorage.removeItem(k);
  if (typeof indexedDB !== "undefined") {
    await operation("readwrite", (m) => m.delete(utilisateur)).catch(() => {});
  }
}
