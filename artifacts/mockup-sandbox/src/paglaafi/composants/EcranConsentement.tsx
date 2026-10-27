import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useDemarrage, useUi } from "../etat/contextes";
import { POINTS_CONSENTEMENT } from "../donnees/confidentialite";

/**
 * Écran de consentement affiché à la première utilisation (après le démarrage).
 * Résume en clair ce que l'application fait des données, avec un lien vers la
 * politique de confidentialité complète.
 */
export function EcranConsentement() {
  const { consentementAccepte, accepterConsentement, setShowPolitique } = useUi();
  const { showSplash } = useDemarrage();
  const [compris, setCompris] = useState(false);

  if (showSplash || consentementAccepte) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titre-consentement"
      className="absolute inset-0 z-50 flex flex-col overflow-y-auto bg-[#fff5f8] p-5 sm:rounded-[36px]"
    >
      <div className="mx-auto mt-4 grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-md ring-4 ring-[#ea2d6d]/15">
        <ShieldCheck size={28} className="text-[#ea2d6d]" />
      </div>
      <h2 id="titre-consentement" className="ph-display mt-3 text-center text-xl font-bold text-[#580e36]">
        Avant de commencer
      </h2>
      <p className="mt-1 text-center text-xs text-[#82445e]">Ce qu'il faut savoir sur PagLaafi et vos données</p>

      <ul className="mt-4 space-y-2.5">
        {POINTS_CONSENTEMENT.map((point) => (
          <li
            key={point}
            className="rounded-2xl border border-[#f0d4de] bg-white p-3 text-[12px] leading-relaxed text-[#4d2d3e]"
          >
            {point}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setShowPolitique(true)}
        className="mt-3 text-center text-xs font-bold text-[#ea2d6d] underline"
      >
        Lire la politique de confidentialité complète
      </button>

      <label className="mt-4 flex items-start gap-2.5 rounded-2xl border border-[#e8c0ce] bg-white p-3 text-[12px] text-[#4d2d3e]">
        <input
          type="checkbox"
          checked={compris}
          onChange={(e) => setCompris(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-[#d6a9b9] text-[#ea2d6d]"
        />
        <span>J'ai lu et compris ces informations.</span>
      </label>

      <button
        type="button"
        disabled={!compris}
        onClick={accepterConsentement}
        className="mt-3 w-full rounded-2xl bg-[#ea2d6d] py-3 text-sm font-bold text-white shadow-md transition disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continuer
      </button>
    </div>
  );
}
