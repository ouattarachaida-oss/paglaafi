import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

/**
 * Bouton du design system.
 * - principal : action principale (rose-600, texte blanc ; en sombre, rose clair et texte foncé)
 * - secondaire : bordure rose-600 sur fond blanc
 * - danger : actions destructrices (suppression)
 * - discret : lien souligné, sans fond
 * - orangeMoney : réservé au paiement Orange Money
 * Hauteur 48 px (52 px pour l'action principale d'un écran : taille "grand"),
 * 44 px minimum pour la taille "petit" (zone tactile).
 */
export type VarianteBouton = "principal" | "secondaire" | "danger" | "discret" | "orangeMoney";
type Taille = "petit" | "normal" | "grand";

const VARIANTES: Record<VarianteBouton, string> = {
  principal: "bg-action text-sur-action active:bg-action-appui shadow-carte",
  secondaire: "border-[1.5px] border-action bg-surface text-action active:bg-rose-100",
  danger: "bg-[#b42318] text-white active:bg-[#8f1b12] shadow-carte",
  discret: "text-action underline underline-offset-4 active:text-action-appui",
  orangeMoney: "bg-orange-money text-sur-orange-money active:brightness-95 shadow-carte",
};
const TAILLES: Record<Taille, string> = {
  petit: "min-h-11 px-3 text-petit",
  normal: "min-h-12 px-4 text-corps",
  grand: "min-h-[52px] px-5 text-corps",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBouton;
  taille?: Taille;
  icone?: ReactNode;
  pleineLargeur?: boolean;
  chargement?: boolean;
}

export function Bouton({
  variante = "principal",
  taille = "normal",
  icone,
  pleineLargeur,
  chargement,
  className = "",
  children,
  disabled,
  type = "button",
  ...reste
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled || chargement}
      className={`inline-flex items-center justify-center gap-2 rounded-bouton font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
        variante === "discret" ? "min-h-11 px-1 text-petit" : TAILLES[taille]
      } ${VARIANTES[variante]} ${pleineLargeur ? "w-full" : ""} ${className}`}
      {...reste}
    >
      {chargement ? <Loader2 size={18} className="animate-spin" aria-hidden /> : icone}
      {children}
    </button>
  );
}

/** Bouton rond à icône seule : le libellé accessible est obligatoire. */
export function BoutonIcone({
  libelle,
  icone,
  className = "",
  ...reste
}: ButtonHTMLAttributes<HTMLButtonElement> & { libelle: string; icone: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={libelle}
      title={libelle}
      className={`inline-grid h-11 w-11 shrink-0 place-items-center rounded-full text-texte-2 transition-colors duration-200 active:bg-rose-200 ${className}`}
      {...reste}
    >
      {icone}
    </button>
  );
}
