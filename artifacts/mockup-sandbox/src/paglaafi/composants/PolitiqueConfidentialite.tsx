import { X } from "lucide-react";
import { useLocation } from "wouter";
import { useUi } from "../etat/contextes";
import { CONTACT_CONFIDENTIALITE, DATE_POLITIQUE, POLITIQUE } from "../donnees/confidentialite";
import { CHEMINS } from "../routes";

/**
 * Politique de confidentialité en français clair (ouverte depuis le consentement,
 * le menu « Confidentialité & Données » ou l'adresse /confidentialite).
 */
export function PolitiqueConfidentialite() {
  const { showPolitique, setShowPolitique } = useUi();
  const [location, navigate] = useLocation();
  const parAdresse = location === "/confidentialite";

  if (!showPolitique && !parAdresse) return null;

  const fermer = () => {
    setShowPolitique(false);
    if (parAdresse) navigate(CHEMINS.Accueil);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titre-politique"
      className="absolute inset-0 z-[60] flex flex-col bg-white sm:rounded-[36px]"
    >
      <div className="flex items-center justify-between border-b border-[#f2e1e6] px-5 py-3">
        <div>
          <h2 id="titre-politique" className="ph-display text-lg font-bold text-[#580e36]">
            Politique de confidentialité
          </h2>
          <p className="text-[10.5px] text-[#916b7c]">Version du {DATE_POLITIQUE}</p>
        </div>
        <button
          type="button"
          onClick={fermer}
          aria-label="Fermer la politique de confidentialité"
          className="grid h-9 w-9 place-items-center rounded-full text-[#815568] hover:bg-[#f8e7ec]"
        >
          <X size={19} />
        </button>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 text-[12.5px] leading-relaxed text-[#4d2d3e]">
        {POLITIQUE.map((section) => (
          <section key={section.titre}>
            <h3 className="mb-1.5 font-bold text-[#580e36]">{section.titre}</h3>
            {section.paragraphes.map((p) => (
              <p key={p} className="mb-1.5">
                {p}
              </p>
            ))}
          </section>
        ))}
        <section>
          <h3 className="mb-1.5 font-bold text-[#580e36]">Nous contacter</h3>
          <p>
            Responsable : équipe PagLaafi. Contact :{" "}
            {CONTACT_CONFIDENTIALITE ? (
              <strong>{CONTACT_CONFIDENTIALITE}</strong>
            ) : (
              <em className="text-amber-800">adresse de contact à renseigner par l'équipe</em>
            )}
          </p>
        </section>
      </div>
      <div className="border-t border-[#f2e1e6] p-4">
        <button
          type="button"
          onClick={fermer}
          className="w-full rounded-2xl bg-[#ea2d6d] py-2.5 text-sm font-bold text-white"
        >
          J'ai compris
        </button>
      </div>
    </div>
  );
}
