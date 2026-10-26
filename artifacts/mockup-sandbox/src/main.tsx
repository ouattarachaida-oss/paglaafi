import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Service Worker PagLaafi (fonctionnement hors ligne)
// - En production : enregistrement de /sw.js après le chargement de la page.
// - En développement : aucun Service Worker, et désinscription de ceux déjà
//   installés lors d'anciennes sessions pour éviter de servir du code périmé.
if ("serviceWorker" in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PagLaafi] Service Worker actif (hors-ligne prêt):", reg.scope);
        })
        .catch((err) => {
          console.warn("[PagLaafi] Enregistrement Service Worker reporté:", err);
        });
    });
  } else {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  }
}
