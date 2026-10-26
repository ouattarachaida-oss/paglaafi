import { useRef } from "react";

/**
 * « La dernière requête gagne » : évite qu'une réponse lente, arrivée après une
 * requête plus récente (par exemple lancée avant la connexion), n'écrase l'état
 * avec des données périmées.
 *
 * Usage :
 *   const nouvelleRequete = useDerniereRequete();
 *   const estActuelle = nouvelleRequete();
 *   const donnees = await charger();
 *   if (estActuelle()) setDonnees(donnees);
 */
export function useDerniereRequete() {
  const compteur = useRef(0);
  return () => {
    const numero = ++compteur.current;
    return () => numero === compteur.current;
  };
}
