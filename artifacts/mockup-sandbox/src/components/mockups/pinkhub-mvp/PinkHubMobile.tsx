import { PagLaafiApp } from "@/paglaafi/PagLaafiApp";

/**
 * Point d'entrée historique de la maquette (chargé par src/App.tsx).
 * L'application est désormais découpée dans src/paglaafi/ :
 * types et données, état partagé (etat/), composants, écrans et modales.
 */
export function PinkHubMobile() {
  return <PagLaafiApp />;
}
