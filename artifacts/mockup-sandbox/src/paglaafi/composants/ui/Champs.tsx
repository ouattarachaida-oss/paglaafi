import { useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Champs de formulaire : hauteur 48 px, bordure 1,5 px ; au focus bordure 2 px rose-600
 * et halo rose-200 ; en erreur bordure rouge et message sous le champ.
 * Le libellé est toujours un vrai <label> relié au champ.
 */
const BASE =
  "w-full rounded-champ border-[1.5px] bg-surface px-3 text-corps text-texte placeholder:text-indicatif transition-shadow duration-200 focus:outline-none focus:border-2 focus:border-action focus:ring-4 focus:ring-rose-200 disabled:opacity-50";
const bordure = (erreur?: string) => (erreur ? "border-alerte" : "border-bordure-2");

interface Enveloppe {
  libelle: string;
  erreur?: string;
  aide?: ReactNode;
  libelleMasque?: boolean;
}

function Cadre({ id, libelle, erreur, aide, libelleMasque, children }: Enveloppe & { id: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={libelleMasque ? "sr-only" : "block text-petit font-semibold text-prune-900"}>
        {libelle}
      </label>
      {children}
      {erreur ? (
        <p id={`${id}-erreur`} className="text-petit font-medium text-alerte">
          {erreur}
        </p>
      ) : aide ? (
        <p id={`${id}-aide`} className="text-petit text-texte-2">
          {aide}
        </p>
      ) : null}
    </div>
  );
}

type PropsChamp = Enveloppe & InputHTMLAttributes<HTMLInputElement>;

export function Champ({ libelle, erreur, aide, libelleMasque, id, className = "", ...reste }: PropsChamp) {
  const auto = useId();
  const ident = id ?? auto;
  return (
    <Cadre id={ident} libelle={libelle} erreur={erreur} aide={aide} libelleMasque={libelleMasque}>
      <input
        id={ident}
        aria-invalid={erreur ? true : undefined}
        aria-describedby={erreur ? `${ident}-erreur` : aide ? `${ident}-aide` : undefined}
        className={`${BASE} h-12 ${bordure(erreur)} ${className}`}
        {...reste}
      />
    </Cadre>
  );
}

/** Mot de passe avec bouton « afficher / masquer ». */
export function ChampMotDePasse({ libelle, erreur, aide, id, className = "", ...reste }: PropsChamp) {
  const auto = useId();
  const ident = id ?? auto;
  const [visible, setVisible] = useState(false);
  return (
    <Cadre id={ident} libelle={libelle} erreur={erreur} aide={aide}>
      <div className="relative">
        <input
          id={ident}
          type={visible ? "text" : "password"}
          aria-invalid={erreur ? true : undefined}
          className={`${BASE} h-12 pr-12 ${bordure(erreur)} ${className}`}
          {...reste}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          aria-pressed={visible}
          className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-champ text-texte-2"
        >
          {visible ? <EyeOff size={20} aria-hidden /> : <Eye size={20} aria-hidden />}
        </button>
      </div>
    </Cadre>
  );
}

export function ListeDeroulante({
  libelle,
  erreur,
  aide,
  libelleMasque,
  id,
  className = "",
  children,
  ...reste
}: Enveloppe & SelectHTMLAttributes<HTMLSelectElement>) {
  const auto = useId();
  const ident = id ?? auto;
  return (
    <Cadre id={ident} libelle={libelle} erreur={erreur} aide={aide} libelleMasque={libelleMasque}>
      <select id={ident} aria-invalid={erreur ? true : undefined} className={`${BASE} h-12 ${bordure(erreur)} ${className}`} {...reste}>
        {children}
      </select>
    </Cadre>
  );
}

export function ZoneTexte({
  libelle,
  erreur,
  aide,
  id,
  className = "",
  rows = 3,
  ...reste
}: Enveloppe & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const auto = useId();
  const ident = id ?? auto;
  return (
    <Cadre id={ident} libelle={libelle} erreur={erreur} aide={aide}>
      <textarea
        id={ident}
        rows={rows}
        aria-invalid={erreur ? true : undefined}
        className={`${BASE} min-h-12 py-3 ${bordure(erreur)} ${className}`}
        {...reste}
      />
    </Cadre>
  );
}

/** Case à cocher (zone tactile de 44 px). */
export function Case({
  libelle,
  checked,
  onChange,
  id,
  description,
}: {
  libelle: ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
  id?: string;
  description?: ReactNode;
}) {
  const auto = useId();
  const ident = id ?? auto;
  return (
    <label htmlFor={ident} className="flex min-h-11 cursor-pointer items-start gap-3 py-1">
      <input
        id={ident}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-6 w-6 shrink-0 cursor-pointer rounded-[6px] accent-[var(--pl-action)]"
      />
      <span className="text-corps text-texte">
        {libelle}
        {description && <span className="mt-0.5 block text-petit text-texte-2">{description}</span>}
      </span>
    </label>
  );
}

/** Interrupteur accessible (role="switch"). */
export function Interrupteur({
  libelle,
  actif,
  onChange,
  description,
  libelleMasque,
}: {
  libelle: string;
  actif: boolean;
  onChange: (v: boolean) => void;
  description?: ReactNode;
  libelleMasque?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={actif}
      aria-label={libelleMasque ? libelle : undefined}
      onClick={() => onChange(!actif)}
      className="flex min-h-11 w-full items-center justify-between gap-3 text-left"
    >
      {!libelleMasque && (
        <span className="text-corps text-texte">
          {libelle}
          {description && <span className="block text-petit text-texte-2">{description}</span>}
        </span>
      )}
      <span
        aria-hidden
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 ${actif ? "bg-action" : "bg-bordure-2"}`}
      >
        <span
          className={`absolute h-5 w-5 rounded-full bg-surface shadow-carte transition-transform duration-200 ${actif ? "translate-x-6" : "translate-x-1"}`}
        />
      </span>
    </button>
  );
}
