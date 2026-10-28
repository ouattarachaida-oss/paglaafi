import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { useLocation } from "wouter";
import { useUi } from "../etat/contextes";
import { CONTACT_CONFIDENTIALITE, DATE_POLITIQUE, POLITIQUE } from "../donnees/confidentialite";
import { CHEMINS } from "../routes";
import { Bouton } from "./ui";

/**
 * Politique de confidentialité (texte inchangé) : sommaire puis sections en accordéons.
 * Ouverte depuis le consentement, le menu « Confidentialité & Données » ou l'adresse /confidentialite.
 */
export function PolitiqueConfidentialite() {
  const { showPolitique, setShowPolitique } = useUi();
  const [location, navigate] = useLocation();
  const parAdresse = location === "/confidentialite";
  const [ouvertes, setOuvertes] = useState<Set<number>>(() => new Set([0]));

  if (!showPolitique && !parAdresse) return null;

  const fermer = () => {
    setShowPolitique(false);
    if (parAdresse) navigate(CHEMINS.Accueil);
  };
  const basculer = (i: number) =>
    setOuvertes((o) => {
      const n = new Set(o);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  const allerA = (i: number) => {
    setOuvertes((o) => new Set(o).add(i));
    window.setTimeout(() => document.getElementById(`politique-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="titre-politique" className="fixed inset-0 z-[65] flex flex-col bg-fond">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-bordure bg-surface px-4 md:px-6">
        <div className="min-w-0 flex-1">
          <h2 id="titre-politique" className="text-sous-titre text-prune-900">
            Politique de confidentialité
          </h2>
          <p className="text-petit text-texte-2">Version du {DATE_POLITIQUE}</p>
        </div>
        <button
          type="button"
          onClick={fermer}
          aria-label="Fermer la politique de confidentialité"
          className="grid h-11 w-11 place-items-center rounded-full text-texte-2 active:bg-rose-200"
        >
          <X size={22} aria-hidden />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-4 px-4 py-5 md:px-6">
          <nav aria-label="Sommaire" className="rounded-carte bg-surface-2 p-4">
            <p className="mb-2 text-corps font-semibold text-prune-900">Sommaire</p>
            <ol className="space-y-1">
              {POLITIQUE.map((s, i) => (
                <li key={s.titre}>
                  <button type="button" onClick={() => allerA(i)} className="min-h-11 text-left text-corps text-action underline underline-offset-4">
                    {s.titre}
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          {POLITIQUE.map((s, i) => {
            const ouverte = ouvertes.has(i);
            return (
              <section key={s.titre} id={`politique-${i}`} className="scroll-mt-4 rounded-carte border border-bordure bg-surface">
                <h3 className="m-0">
                  <button
                    type="button"
                    aria-expanded={ouverte}
                    aria-controls={`politique-${i}-texte`}
                    onClick={() => basculer(i)}
                    className="flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left text-corps font-semibold text-prune-900"
                  >
                    <span>{s.titre}</span>
                    <ChevronDown size={20} aria-hidden className={`shrink-0 transition-transform duration-200 ${ouverte ? "rotate-180" : ""}`} />
                  </button>
                </h3>
                {ouverte && (
                  <div id={`politique-${i}-texte`} className="space-y-2 border-t border-bordure px-4 py-3 text-corps text-texte">
                    {s.paragraphes.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                )}
              </section>
            );
          })}

          <section className="rounded-carte border border-bordure bg-surface p-4">
            <h3 className="mb-2 text-corps font-semibold text-prune-900">Nous contacter</h3>
            <p className="text-corps text-texte">
              Responsable : équipe PagLaafi. Contact :{" "}
              {CONTACT_CONFIDENTIALITE ? (
                <strong>{CONTACT_CONFIDENTIALITE}</strong>
              ) : (
                <em className="text-attention">adresse de contact à renseigner par l'équipe</em>
              )}
            </p>
          </section>
        </div>
      </div>

      <div className="pb-securite border-t border-bordure bg-surface px-4 py-3">
        <div className="mx-auto max-w-2xl">
          <Bouton taille="grand" pleineLargeur onClick={fermer}>
            J'ai compris
          </Bouton>
        </div>
      </div>
    </div>
  );
}
