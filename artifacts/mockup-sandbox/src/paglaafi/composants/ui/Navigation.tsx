import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Éléments de navigation interne : puces de langue, onglets segmentés,
 * onglets soulignés et accordéon.
 */

export type CodeLangue = "fr" | "en" | "moore" | "dioula";
export const LIBELLES_LANGUES: Record<CodeLangue, string> = {
  fr: "Français",
  en: "English",
  moore: "Mooré",
  dioula: "Dioula",
};

/** Puces de langue : la puce active est prune avec texte blanc. */
export function PucesLangue({
  valeur,
  onChange,
  langues = ["fr", "en", "moore", "dioula"],
  libelle = "Langue",
  aLaLigne = false,
}: {
  valeur: CodeLangue;
  onChange: (l: CodeLangue) => void;
  langues?: CodeLangue[];
  libelle?: string;
  /** Passe à la ligne au lieu de défiler (colonnes étroites) */
  aLaLigne?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={libelle} className={aLaLigne ? "flex flex-wrap gap-2" : "defilement-discret flex gap-2 overflow-x-auto"}>
      {langues.map((l) => {
        const actif = l === valeur;
        return (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={actif}
            onClick={() => onChange(l)}
            className={`min-h-11 shrink-0 rounded-full px-4 text-petit font-semibold transition-colors duration-200 ${
              actif ? "bg-carte-prune text-white" : "border border-bordure bg-surface text-texte"
            }`}
          >
            {LIBELLES_LANGUES[l]}
          </button>
        );
      })}
    </div>
  );
}

interface Onglet<T extends string> {
  id: T;
  libelle: ReactNode;
}

/** Onglets segmentés : fond rose-200, onglet actif blanc. */
export function OngletsSegmentes<T extends string>({
  onglets,
  valeur,
  onChange,
  libelle,
}: {
  onglets: Onglet<T>[];
  valeur: T;
  onChange: (v: T) => void;
  libelle: string;
}) {
  return (
    <div role="tablist" aria-label={libelle} className="flex gap-1 rounded-bouton bg-rose-200 p-1">
      {onglets.map((o) => {
        const actif = o.id === valeur;
        return (
          <button
            key={o.id}
            type="button"
            role="tab"
            aria-selected={actif}
            onClick={() => onChange(o.id)}
            className={`min-h-11 flex-1 rounded-[10px] px-3 text-petit font-semibold transition-colors duration-200 ${
              actif ? "bg-surface text-action shadow-carte" : "text-texte"
            }`}
          >
            {o.libelle}
          </button>
        );
      })}
    </div>
  );
}

/** Onglets soulignés : barre de 3 px sous l'onglet actif. */
export function OngletsSoulignes<T extends string>({
  onglets,
  valeur,
  onChange,
  libelle,
}: {
  onglets: Onglet<T>[];
  valeur: T;
  onChange: (v: T) => void;
  libelle: string;
}) {
  return (
    <div role="tablist" aria-label={libelle} className="defilement-discret flex gap-1 overflow-x-auto border-b border-bordure">
      {onglets.map((o) => {
        const actif = o.id === valeur;
        return (
          <button
            key={o.id}
            type="button"
            role="tab"
            aria-selected={actif}
            onClick={() => onChange(o.id)}
            className={`-mb-px min-h-12 shrink-0 border-b-[3px] px-3 text-petit font-semibold transition-colors duration-200 ${
              actif ? "border-action text-action" : "border-transparent text-texte-2"
            }`}
          >
            {o.libelle}
          </button>
        );
      })}
    </div>
  );
}

/** Accordéon : en-tête bouton (aria-expanded) et panneau associé. */
export function Accordeon({
  titre,
  children,
  ouvertParDefaut = false,
  id,
}: {
  titre: ReactNode;
  children: ReactNode;
  ouvertParDefaut?: boolean;
  id?: string;
}) {
  const [ouvert, setOuvert] = useState(ouvertParDefaut);
  const auto = useId();
  const ident = id ?? auto;
  return (
    <div id={ident} className="rounded-carte border border-bordure bg-surface">
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={ouvert}
          aria-controls={`${ident}-panneau`}
          onClick={() => setOuvert(!ouvert)}
          className="flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left text-corps font-semibold text-prune-900"
        >
          <span>{titre}</span>
          <ChevronDown size={20} aria-hidden className={`shrink-0 transition-transform duration-200 ${ouvert ? "rotate-180" : ""}`} />
        </button>
      </h3>
      {ouvert && (
        <div id={`${ident}-panneau`} className="border-t border-bordure px-4 py-3 text-corps text-texte">
          {children}
        </div>
      )}
    </div>
  );
}
