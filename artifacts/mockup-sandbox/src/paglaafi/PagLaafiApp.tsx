import { Router } from "wouter";
import { Coquille } from "./composants/Coquille";
import { FournisseurEtat } from "./etat/contextes";
import { baseDuRouteur } from "./routes";

/**
 * Point d'entrée de l'application PagLaafi :
 * routeur (wouter) → état partagé (contextes par domaine) → coquille de l'interface.
 */
export function PagLaafiApp() {
  return (
    <Router base={baseDuRouteur()}>
      <FournisseurEtat>
        <Coquille />
      </FournisseurEtat>
    </Router>
  );
}
