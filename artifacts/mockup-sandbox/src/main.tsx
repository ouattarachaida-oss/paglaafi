import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Service worker PagLaafi (vite-plugin-pwa, voir serveur/pwa.ts)
// - En production : enregistrement du service worker généré (précache, mise à jour automatique).
// - En développement : aucun service worker, et désinscription de ceux installés lors
//   d'anciennes sessions pour éviter de servir du code périmé.
if ("serviceWorker" in navigator) {
  if (import.meta.env.PROD) {
    void import("virtual:pwa-register").then(({ registerSW }) => registerSW({ immediate: true }));
  } else {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  }
}
