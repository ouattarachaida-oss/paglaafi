/**
 * Configuration PWA (vite-plugin-pwa / Workbox) : application utilisable hors-ligne.
 *
 * - Précache dès la première visite : bundles Vite (noms hachés), index.html,
 *   manifeste, icônes, logo, image de démarrage et FAQ de Rose IA (fiches validées).
 * - index.html est mis à jour proprement à chaque déploiement (registerType
 *   « autoUpdate » : le nouveau service worker remplace l'ancien et nettoie
 *   les caches périmés).
 * - Mis en cache à la consultation : tuiles de la carte déjà vues, affiches et
 *   images, polices Google.
 * - Aucun service worker en développement.
 * - Les appels /api/… (Rose IA, suppression de compte) ne sont jamais mis en cache.
 */
import { VitePWA } from "vite-plugin-pwa";

const JOUR = 60 * 60 * 24;

export function pwa() {
  return VitePWA({
    registerType: "autoUpdate",
    // Enregistrement fait dans src/main.tsx (production uniquement)
    injectRegister: false,
    devOptions: { enabled: false },
    manifest: {
      id: "/",
      name: "PagLaafi - Rose IA Burkina Faso",
      short_name: "PagLaafi",
      description: "Information, orientation vers les centres de dépistage et suivi du cycle au Burkina Faso.",
      start_url: "/",
      scope: "/",
      lang: "fr",
      display: "standalone",
      orientation: "portrait-primary",
      background_color: "#2b1420",
      theme_color: "#9c3d61",
      categories: ["health", "medical", "lifestyle"],
      icons: [
        { src: "/icons/icone-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/icons/icone-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/icons/icone-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
    workbox: {
      globPatterns: [
        // (le manifeste et ses icônes sont ajoutés par le plugin)
        "**/*.{js,css,html}",
        "icons/apple-touch-icon-180.png",
        "images/pinkhub-mvp-paglaafi.webp",
        "images/splash-paglaafi-heroines.webp",
        "faq-rose.json",
      ],
      globIgnores: ["__mockup/**"],
      maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      navigateFallback: "/index.html",
      navigateFallbackDenylist: [/^\/api\//],
      cleanupOutdatedCaches: true,
      // Le service worker prend la main dès la première visite et à chaque mise à jour
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          // Tuiles OpenStreetMap déjà consultées (carte disponible hors-ligne)
          urlPattern: ({ url }) => url.hostname.endsWith("tile.openstreetmap.org"),
          handler: "CacheFirst",
          options: {
            cacheName: "paglaafi-tuiles-carte",
            expiration: { maxEntries: 800, maxAgeSeconds: 30 * JOUR },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          // Audios MP3 validés (mooré, dioula) : gardés pour l'écoute hors ligne
          urlPattern: ({ url, sameOrigin }) => sameOrigin && (url.pathname.startsWith("/audio/") || url.pathname.endsWith(".mp3")),
          handler: "CacheFirst",
          options: {
            cacheName: "paglaafi-audio",
            expiration: { maxEntries: 200, maxAgeSeconds: 90 * JOUR },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          // Affiches, illustrations et autres images, au fil de la consultation
          urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith("/images/"),
          handler: "CacheFirst",
          options: {
            cacheName: "paglaafi-images",
            expiration: { maxEntries: 60, maxAgeSeconds: 60 * JOUR },
          },
        },
        {
          urlPattern: ({ url }) => url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com",
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "paglaafi-polices",
            expiration: { maxEntries: 30, maxAgeSeconds: 365 * JOUR },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
    },
  });
}
