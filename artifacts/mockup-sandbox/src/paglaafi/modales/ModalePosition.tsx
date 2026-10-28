import { useMemo, useState } from "react";
import { LocateFixed, MapPin } from "lucide-react";
import { useCentres } from "../etat/contextes";
import { Bouton, Feuille, ListeDeroulante } from "../composants/ui";

/**
 * Position pour « Près de moi » :
 * - explication (une seule fois) avant la demande d'autorisation du navigateur ;
 * - choix de la ville si la position est refusée, indisponible ou trop lente (mémorisée sur l'appareil).
 */
export function ModalePosition() {
  const { etatPosition, accepterPosition, refuserPosition, choixVilleOuvert, setChoixVilleOuvert, choisirVille, centers, ville } = useCentres();
  const villes = useMemo(() => [...new Set(centers.map((c) => c.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr")), [centers]);
  const [choix, setChoix] = useState("");

  return (
    <>
      <Feuille
        ouverte={etatPosition === "explication"}
        onFermer={refuserPosition}
        titre="Trouver le centre le plus proche"
        pied={
          <div className="flex flex-col gap-2">
            <Bouton taille="grand" pleineLargeur icone={<LocateFixed size={20} aria-hidden />} onClick={accepterPosition}>
              Utiliser ma position
            </Bouton>
            <Bouton variante="secondaire" pleineLargeur icone={<MapPin size={20} aria-hidden />} onClick={refuserPosition}>
              Choisir ma ville
            </Bouton>
          </div>
        }
      >
        <p className="text-corps text-texte">
          Pour vous montrer le centre le plus proche, PagLaafi a besoin de votre position. Elle sert seulement sur ce téléphone à calculer les
          distances : elle n'est ni envoyée ni enregistrée.
        </p>
      </Feuille>

      <Feuille
        ouverte={choixVilleOuvert}
        onFermer={() => setChoixVilleOuvert(false)}
        titre="Dans quelle ville êtes-vous ?"
        sousTitre="Elle est gardée sur ce téléphone pour trier les centres."
        pied={
          <Bouton taille="grand" pleineLargeur disabled={!(choix || ville)} onClick={() => choisirVille(choix || ville)}>
            Valider
          </Bouton>
        }
      >
        <ListeDeroulante libelle="Ville" value={choix || ville} onChange={(e) => setChoix(e.target.value)}>
          <option value="">Choisir une ville…</option>
          {villes.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </ListeDeroulante>
      </Feuille>
    </>
  );
}
