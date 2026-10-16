/**
 * Service Worker PagLaafi - Mode Hors-Connexion (Offline PWA)
 * Assure la disponibilité de l'application même sans réseau internet au Burkina Faso.
 */

const CACHE_NAME = "paglaafi-offline-v2";

// Ressources vitales pré-mises en cache pour l'accès hors-ligne immédiat
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/images/pinkhub-mvp-paglaafi.png",
  "/images/autopalpation-afrique-demo.jpg",
  "/images/affiche-evenement-beneere.jpg",
  "/images/affiche-wtm-odc.jpg",
  "/images/affiche-genit-care.jpg",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
];

// Installation : préchargement des ressources essentielles
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Préchargement résilient (n'échoue pas si un asset distant est lent)
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn("[PagLaafi SW] Impossible de pré-cacher:", url, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Activation : nettoyage des anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Interception des requêtes : Stratégie Stale-While-Revalidate / Cache-First avec repli hors ligne
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Ignorer les requêtes non-GET et les extensions Chrome
  if (request.method !== "GET" || !request.url.startsWith("http")) {
    return;
  }

  // Pour les requêtes de tuiles de carte OpenStreetMap
  if (request.url.includes("tile.openstreetmap.org")) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        }).catch(() => {
          // Tuile indisponible hors-ligne : renvoie une tuile vide transparente
          return new Response("", { status: 200, headers: { "Content-Type": "image/png" } });
        });
      })
    );
    return;
  }

  // Pour les pages et assets de l'application
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      }).catch((fetchErr) => {
        // En cas de panne totale du réseau, si c'est une navigation HTML, retourner l'index en cache
        if (request.mode === "navigate") {
          return caches.match("/") || caches.match("/index.html");
        }
        throw fetchErr;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
