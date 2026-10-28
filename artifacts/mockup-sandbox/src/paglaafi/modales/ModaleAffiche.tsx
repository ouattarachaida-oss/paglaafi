import { useAnnonces } from "../etat/contextes";
import { Bouton, Feuille } from "../composants/ui";

/** Affiche d'un événement en grand format. */
export function ModaleAffiche() {
  const { selectedPosterModal: a, setSelectedPosterModal } = useAnnonces();
  const fermer = () => setSelectedPosterModal(null);
  return (
    <Feuille
      ouverte={!!a}
      onFermer={fermer}
      large
      titre={a?.title ?? ""}
      sousTitre={a?.author}
      pied={
        <Bouton variante="secondaire" pleineLargeur onClick={fermer}>
          Fermer l'affiche
        </Bouton>
      }
    >
      {a && (
        <figure>
          <img src={a.url} alt={a.caption || `Affiche : ${a.title}`} className="mx-auto max-h-[65dvh] w-full rounded-carte object-contain" />
          {a.caption && <figcaption className="mt-2 text-center text-petit text-texte-2">{a.caption}</figcaption>}
        </figure>
      )}
    </Feuille>
  );
}
