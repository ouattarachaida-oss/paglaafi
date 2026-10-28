import { useState } from "react";
import { MessageCircleQuestion, ShieldCheck, Smartphone, Stethoscope, Trash2 } from "lucide-react";
import { useDemarrage, useUi } from "../etat/contextes";
import { POINTS_CONSENTEMENT } from "../donnees/confidentialite";
import { Bouton, Case } from "./ui";

// Titres d'interface des 4 points (le texte de chaque point reste celui de donnees/confidentialite.ts)
const TITRES = [
  { titre: "Information, pas de soin", icone: <Stethoscope size={22} aria-hidden /> },
  { titre: "Vos données", icone: <Smartphone size={22} aria-hidden /> },
  { titre: "Questions à Rose IA", icone: <MessageCircleQuestion size={22} aria-hidden /> },
  { titre: "Tout supprimer", icone: <Trash2 size={22} aria-hidden /> },
];

/**
 * Consentement à la première utilisation (après le démarrage) : 4 cartes résumé,
 * lien vers la politique complète, case « J'ai lu et compris » et bouton « Continuer »
 * désactivé tant que la case n'est pas cochée.
 */
export function EcranConsentement() {
  const { consentementAccepte, accepterConsentement, setShowPolitique } = useUi();
  const { showSplash } = useDemarrage();
  const [compris, setCompris] = useState(false);
  if (showSplash || consentementAccepte) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="titre-consentement" className="fixed inset-0 z-[60] overflow-y-auto bg-fond">
      <div className="mx-auto max-w-lg px-4 pb-8 pt-8 md:pt-12">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rose-100 text-rose-500" aria-hidden>
          <ShieldCheck size={28} />
        </span>
        <h2 id="titre-consentement" className="mt-4 text-center text-titre text-prune-900">
          Avant de commencer
        </h2>
        <p className="mt-1 text-center text-corps text-texte-2">Ce qu'il faut savoir sur PagLaafi et vos données</p>

        <ul className="mt-6 space-y-3">
          {POINTS_CONSENTEMENT.map((point, i) => (
            <li key={point} className="flex gap-3 rounded-carte border border-bordure bg-surface p-4 shadow-carte">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-500">{TITRES[i]?.icone}</span>
              <div>
                <p className="text-corps font-semibold text-prune-900">{TITRES[i]?.titre}</p>
                <p className="mt-0.5 text-petit text-texte">{point}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-3 text-center">
          <Bouton variante="discret" onClick={() => setShowPolitique(true)}>
            Lire la politique de confidentialité complète
          </Bouton>
        </div>

        <div className="mt-4 rounded-carte border border-bordure bg-surface px-4 py-2">
          <Case libelle="J'ai lu et compris ces informations." checked={compris} onChange={setCompris} />
        </div>

        <Bouton taille="grand" pleineLargeur className="mt-4" disabled={!compris} onClick={accepterConsentement}>
          Continuer
        </Bouton>
      </div>
    </div>
  );
}
