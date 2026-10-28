import { Clock, Megaphone } from "lucide-react";
import { useAdministration, useAnnonces, useAuth } from "../etat/contextes";
import { MODE_REEL } from "../config";
import { BadgeSimulation } from "../composants/BadgeSimulation";
import { Badge, BadgeRole, Carte, EtatVide, Feuille } from "../composants/ui";

// Collectes de démonstration (fictives, signalées par le badge Simulation en mode réel)
const COLLECTES = [
  { id: "OM-ANON-904123", donor: "Donatrice anonyme", amount: 10000, date: "Aujourd'hui 17h42", assoc: "ABAC" },
  { id: "OM-BF-893102", donor: "Ouedraogo A.", amount: 5000, date: "Aujourd'hui 15h18", assoc: "ABAC" },
  { id: "OM-ANON-872291", donor: "Donatrice anonyme", amount: 25000, date: "Hier 19h10", assoc: "Beneere For A Cause" },
  { id: "OM-BF-861109", donor: "Traoré S.", amount: 2500, date: "14/10/2026", assoc: "GenitCare" },
  { id: "OM-BF-850012", donor: "Association WTM", amount: 50000, date: "13/10/2026", assoc: "WomenTech Makers" },
];

/** Tableau de bord des structures : dons (simulés) et annonces de la structure. */
export function TableauDeBordAdmin() {
  const { setShowAdminDashboardModal, showAdminDashboardModal } = useAdministration();
  const { currentUser, sessionReelle } = useAuth();
  const { announcements } = useAnnonces();

  const miennes = announcements.filter((a) =>
    MODE_REEL
      ? a.auteurId === sessionReelle?.userId
      : a.submittedBy === currentUser?.structureName || a.submittedBy === `${currentUser?.prenom} ${currentUser?.nom}`,
  );

  return (
    <Feuille
      ouverte={showAdminDashboardModal}
      onFermer={() => setShowAdminDashboardModal(false)}
      large
      titre="Tableau de bord"
      enTete={currentUser && <BadgeRole libelle={currentUser.roleLabel} superadmin={currentUser.role === "superadmin"} />}
    >
      <div className="space-y-6">
        <section aria-labelledby="titre-dons-tb" className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 id="titre-dons-tb" className="text-sous-titre text-prune-900">
              Dons Orange Money
            </h3>
            <BadgeSimulation detail="Dons et statistiques fictifs : aucune collecte réelle n'est affichée." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Carte douce>
              <p className="text-petit text-texte-2">Dons collectés</p>
              <p className="text-titre text-prune-900">3 850 000 F</p>
              <p className="text-petit text-texte-2">412 donateurs</p>
            </Carte>
            <Carte douce>
              <p className="text-petit text-texte-2">Examens financés</p>
              <p className="text-titre text-prune-900">385 femmes</p>
            </Carte>
          </div>
          <div className="overflow-x-auto rounded-carte border border-bordure">
            <table className="w-full min-w-[420px] text-left text-petit">
              <caption className="sr-only">Dernières collectes Orange Money</caption>
              <thead className="bg-surface-2 text-texte-2">
                <tr>
                  <th scope="col" className="px-3 py-2 font-semibold">Donateur</th>
                  <th scope="col" className="px-3 py-2 font-semibold">Association</th>
                  <th scope="col" className="px-3 py-2 font-semibold">Date</th>
                  <th scope="col" className="px-3 py-2 text-right font-semibold">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bordure">
                {COLLECTES.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-3 py-2 font-semibold text-prune-900">{tx.donor}</td>
                    <td className="px-3 py-2 text-texte">{tx.assoc}</td>
                    <td className="px-3 py-2 text-texte-2">{tx.date}</td>
                    <td className="px-3 py-2 text-right font-semibold text-texte">+{tx.amount.toLocaleString("fr-FR")} F</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="titre-annonces-tb" className="space-y-3">
          <h3 id="titre-annonces-tb" className="text-sous-titre text-prune-900">
            Mes annonces
          </h3>
          {miennes.length === 0 ? (
            <EtatVide icone={<Megaphone size={24} />} titre="Aucune annonce publiée" texte="Publiez un événement depuis l'onglet Annonces." />
          ) : (
            <ul className="space-y-2">
              {miennes.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 rounded-bouton border border-bordure px-3 py-2">
                  <span className="min-w-0 truncate text-corps text-texte">{a.title}</span>
                  {a.status === "pending_validation" ? (
                    <Badge ton="attention" icone={<Clock size={14} aria-hidden />}>
                      En attente
                    </Badge>
                  ) : a.status === "rejected" ? (
                    <Badge ton="alerte">Refusée</Badge>
                  ) : (
                    <Badge ton="succes">Publiée</Badge>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Feuille>
  );
}
