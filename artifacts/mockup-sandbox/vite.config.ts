import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { mockupPreviewPlugin } from "./mockupPreviewPlugin";
import { apiRoseLocale } from "./serveur/devApi";
import { pwa } from "./serveur/pwa";

// Port d'écoute du serveur de développement (par défaut 5173 en local si non spécifié)
const port = process.env.PORT ? Number(process.env.PORT) : 5173;

// Chemin de base pour les assets (par défaut racine '/' en local)
const basePath = process.env.BASE_PATH || "/";

// Écoute réseau : uniquement sur cet ordinateur (localhost) par défaut.
// Pour la démo sur le Wi-Fi local, utiliser `pnpm run dev:lan` (option --host).
// Sur Replit (REPL_ID défini), l'écoute sur toutes les interfaces reste nécessaire.
const isReplit = process.env.REPL_ID !== undefined;
const host = isReplit ? "0.0.0.0" : "localhost";

export default defineConfig({
  base: basePath,
  plugins: [
    mockupPreviewPlugin(),
    // Rose IA : /api/rose-chat en développement local (en production : fonction Vercel api/rose-chat.ts)
    apiRoseLocale(import.meta.dirname),
    // Application hors-ligne (production uniquement) : voir serveur/pwa.ts
    pwa(),
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port,
    host,
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host,
    allowedHosts: true,
  },
});
