import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAuth, useSante, useUi } from "../etat/contextes";
import { MODE_REEL } from "../config";
import { Bouton, Feuille } from "../composants/ui";

const MOT = "SUPPRIMER";

// Où sont les données (mode réel : textes du résumé inchangés)
const LIGNES_REEL = [
  {
    ou: "Sur ce téléphone",
    quoi: "Cycle, autopalpations et historique, rattachés à votre compte et chiffrés sur l'appareil. Ils ne protègent pas contre quelqu'un qui utilise votre téléphone avec votre session ouverte.",
  },
  { ou: "En ligne (Supabase)", quoi: "Compte, profil (nom, prénom, téléphone), rappels et, pour les professionnels, demandes, annonces et fiches." },
  {
    ou: "Rose IA (Gemini, Google)",
    quoi: "Seule votre question, anonymisée automatiquement, est envoyée. Avec l'offre gratuite, Google peut l'utiliser pour améliorer ses services : n'y écrivez rien de personnel.",
  },
];
const LIGNES_DEMO = [
  { ou: "Sur ce téléphone", quoi: "Cycle, autopalpations, rappels et messages de Rose IA (mode démo : données fictives, rien n'est envoyé en ligne)." },
];

/**
 * Confidentialité & Données : où sont stockées les données, lien vers la politique,
 * zone danger « Supprimer mes données » (saisir SUPPRIMER). Mode réel : compte, données
 * en ligne et données de l'appareil ; démo : données locales de démonstration.
 */
export function ModaleConfidentialite() {
  const { setShowPrivacyModal, showPrivacyModal, supprimerMesDonnees, handleClearAllLocalData } = useSante();
  const { sessionReelle } = useAuth();
  const { setShowPolitique } = useUi();
  const [etape, setEtape] = useState<"resume" | "confirmation">("resume");
  const [saisie, setSaisie] = useState("");
  const [enCours, setEnCours] = useState(false);

  const fermer = () => {
    setShowPrivacyModal(false);
    setEtape("resume");
    setSaisie("");
  };
  const supprimer = async () => {
    if (!MODE_REEL) {
      handleClearAllLocalData();
      setSaisie("");
      setEtape("resume");
      return;
    }
    setEnCours(true);
    const ok = await supprimerMesDonnees(saisie.trim());
    setEnCours(false);
    if (ok) {
      setSaisie("");
      setEtape("resume");
    }
  };
  const lignes = MODE_REEL ? LIGNES_REEL : LIGNES_DEMO;

  return (
    <Feuille ouverte={showPrivacyModal} onFermer={fermer} titre="Confidentialité & Données">
      {etape === "resume" ? (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-carte border border-bordure">
            <table className="w-full min-w-[300px] text-left">
              <caption className="sr-only">Où sont stockées vos données</caption>
              <thead className="bg-surface-2 text-petit text-texte-2">
                <tr>
                  <th scope="col" className="px-3 py-2 font-semibold">
                    Où
                  </th>
                  <th scope="col" className="px-3 py-2 font-semibold">
                    Quelles données
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bordure align-top">
                {lignes.map((l) => (
                  <tr key={l.ou}>
                    <th scope="row" className="w-1/3 px-3 py-3 text-petit font-semibold text-prune-900">
                      {l.ou}
                    </th>
                    <td className="px-3 py-3 text-petit text-texte">{l.quoi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Bouton variante="discret" onClick={() => setShowPolitique(true)}>
            Lire la politique de confidentialité
          </Bouton>

          <section aria-labelledby="titre-zone-danger" className="space-y-3 rounded-carte border-[1.5px] border-alerte bg-alerte-fond p-4">
            <h3 id="titre-zone-danger" className="flex items-center gap-2 text-corps font-semibold text-alerte">
              <Trash2 size={20} aria-hidden /> Supprimer mes données
            </h3>
            <p className="text-petit text-alerte">
              {!MODE_REEL
                ? "Efface les données de démonstration enregistrées sur ce téléphone (cycle, rappels, messages)."
                : sessionReelle
                  ? "Supprime définitivement votre compte, toutes vos données en ligne et vos données de santé sur ce téléphone."
                  : "Aucun compte n'est connecté : rien n'est enregistré pour vous en ligne."}
            </p>
            <Bouton variante="danger" pleineLargeur onClick={() => setEtape("confirmation")}>
              Supprimer mes données
            </Bouton>
          </section>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="rounded-carte border-[1.5px] border-alerte bg-alerte-fond p-4 text-corps font-semibold text-alerte">
            Cette action est définitive.{" "}
            {MODE_REEL && sessionReelle ? "Votre compte, votre profil, vos rappels et vos demandes seront supprimés, ainsi que vos données de santé sur ce téléphone." : ""}
          </p>
          <div className="space-y-1.5">
            <label htmlFor="confirmation-suppression" className="block text-petit font-semibold text-prune-900">
              Pour confirmer, tapez {MOT} :
            </label>
            <input
              id="confirmation-suppression"
              value={saisie}
              onChange={(e) => setSaisie(e.target.value)}
              autoComplete="off"
              className="h-12 w-full rounded-champ border-[1.5px] border-alerte bg-surface px-3 text-corps font-semibold tracking-wider text-texte focus:border-2 focus:outline-none focus:ring-4 focus:ring-alerte-fond"
            />
          </div>
          <div className="flex gap-3">
            <Bouton variante="secondaire" className="flex-1" onClick={() => setEtape("resume")}>
              Annuler
            </Bouton>
            <Bouton variante="danger" className="flex-1" disabled={saisie.trim() !== MOT || enCours} chargement={enCours} onClick={() => void supprimer()}>
              {enCours ? "Suppression…" : "Supprimer définitivement"}
            </Bouton>
          </div>
        </div>
      )}
    </Feuille>
  );
}
