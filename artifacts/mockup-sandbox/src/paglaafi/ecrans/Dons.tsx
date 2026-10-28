import { Gift, HeartHandshake } from "lucide-react";
import { partnerAssociations } from "../donnees/associations";
import { useDons } from "../etat/contextes";
import { BadgeSimulationUi, Bouton, Carte, EnTeteSection } from "../composants/ui";

/**
 * Faire un don : rappel « Simulation » (dans les deux modes : le paiement n'est jamais réel),
 * choix « Offrir un examen » ou « Soutenir une association », puis parcours en 4 étapes
 * dans la feuille du don (montants, don anonyme, Orange Money).
 */
export function Dons() {
  const { setSelectedAssociation, setShowDonationModal } = useDons();

  return (
    <section className="anim-apparition">
      <h1 className="text-display text-prune-900">Faire un don</h1>
      <div className="bordure-simulation mt-3 flex flex-wrap items-center gap-2 rounded-bouton bg-simulation-fond px-3 py-2 text-petit text-simulation">
        <BadgeSimulationUi /> <span>Simulation : aucun argent n'est prélevé.</span>
      </div>
      <p className="mt-3 text-corps text-texte-2">
        Votre contribution finance directement le dépistage et les soins de femmes sans revenus au Burkina Faso.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Carte className="flex flex-col gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-rose-100 text-rose-500" aria-hidden>
            <Gift size={22} />
          </span>
          <h2 className="text-sous-titre text-prune-900">Offrir un examen de dépistage</h2>
          <p className="text-corps text-texte">
            Grâce à votre don de <strong>2 500 à 5 000 FCFA</strong>, une mère de famille vulnérable bénéficie immédiatement d'une consultation et
            d'une mammographie complète.
          </p>
          <Bouton
            className="mt-auto"
            onClick={() => setShowDonationModal(true)}
          >
            Offrir un examen
          </Bouton>
        </Carte>
        <Carte className="flex flex-col gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-rose-100 text-rose-500" aria-hidden>
            <HeartHandshake size={22} />
          </span>
          <h2 className="text-sous-titre text-prune-900">Soutenir une association</h2>
          <p className="text-corps text-texte">Choisissez une association partenaire dans la liste ci-dessous.</p>
          <Bouton variante="secondaire" className="mt-auto" onClick={() => document.getElementById("associations")?.scrollIntoView({ behavior: "smooth" })}>
            Voir les associations
          </Bouton>
        </Carte>
      </div>

      <section className="mt-6 scroll-mt-20" id="associations" aria-labelledby="titre-associations">
        <EnTeteSection id="titre-associations" titre="Associations partenaires" />
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {partnerAssociations.map((a) => (
            <li key={a.id} className="flex flex-col gap-2 rounded-carte border border-bordure bg-surface p-4 shadow-carte">
              <h3 className="text-corps font-semibold text-prune-900">
                {a.name} ({a.acronym})
              </h3>
              <p className="text-petit text-texte">{a.mission}</p>
              <Bouton
                variante="secondaire"
                taille="petit"
                className="mt-auto self-start"
                onClick={() => {
                  setSelectedAssociation(a);
                  setShowDonationModal(true);
                }}
              >
                Faire un don à {a.acronym}
              </Bouton>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
