import { useEffect, useId, useRef, type HTMLAttributes, type ReactNode } from "react";
import { AlertTriangle, CloudOff, Info, RefreshCw, WifiOff, X } from "lucide-react";
import { Bouton } from "./Bouton";

/**
 * Surfaces : cartes, bandeaux, feuille du bas / modale, états vides, squelettes,
 * erreur réseau et en-tête de section.
 */

/** Carte blanche (bordure + ombre légère) ; « douce » : fond rose-100 sans bordure. */
export function Carte({
  douce,
  className = "",
  children,
  ...reste
}: HTMLAttributes<HTMLDivElement> & { douce?: boolean }) {
  return (
    <div
      className={`rounded-carte p-4 ${douce ? "bg-surface-2" : "border border-bordure bg-surface shadow-carte"} ${className}`}
      {...reste}
    >
      {children}
    </div>
  );
}

/** Titre de section avec action facultative à droite (ex. « Tout voir »). */
export function EnTeteSection({ titre, action, id }: { titre: ReactNode; action?: ReactNode; id?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 id={id} className="text-sous-titre text-prune-900">
        {titre}
      </h2>
      {action}
    </div>
  );
}

type TonBandeau = "rose" | "horsLigne" | "alerte" | "info" | "succes";
const TONS: Record<TonBandeau, string> = {
  rose: "bg-surface-2 text-texte",
  horsLigne: "bg-attention-fond text-attention",
  alerte: "bg-alerte-fond text-alerte border-[1.5px] border-alerte",
  info: "bg-info-fond text-info",
  succes: "bg-succes-fond text-succes",
};
const ICONES: Record<TonBandeau, ReactNode> = {
  rose: <Info size={18} aria-hidden />,
  horsLigne: <WifiOff size={18} aria-hidden />,
  alerte: <AlertTriangle size={18} aria-hidden />,
  info: <Info size={18} aria-hidden />,
  succes: <Info size={18} aria-hidden />,
};

/** Bandeau d'information (Rose, hors-ligne, alerte médicale…). */
export function Bandeau({
  ton = "info",
  children,
  action,
  role,
  className = "",
}: {
  ton?: TonBandeau;
  children: ReactNode;
  action?: ReactNode;
  role?: "status" | "alert";
  className?: string;
}) {
  return (
    <div role={role} className={`flex items-start gap-3 rounded-bouton px-3 py-2.5 text-petit ${TONS[ton]} ${className}`}>
      <span className="mt-0.5 shrink-0">{ICONES[ton]}</span>
      <div className="min-w-0 flex-1">{children}</div>
      {action}
    </div>
  );
}

/**
 * Feuille du bas sur mobile (poignée, rayon 24 px) ; modale centrée à partir de 768 px.
 * Fond assombri, fermeture par Échap ou en touchant le fond, focus placé dans la feuille.
 */
export function Feuille({
  ouverte,
  onFermer,
  titre,
  sousTitre,
  children,
  pied,
  large,
  enTete,
}: {
  ouverte: boolean;
  onFermer: () => void;
  titre: ReactNode;
  sousTitre?: ReactNode;
  children: ReactNode;
  pied?: ReactNode;
  large?: boolean;
  /** Éléments affichés à côté du titre (badge…) */
  enTete?: ReactNode;
}) {
  const idTitre = useId();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ouverte) return;
    const precedent = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const touche = (e: KeyboardEvent) => e.key === "Escape" && onFermer();
    document.addEventListener("keydown", touche);
    return () => {
      document.removeEventListener("keydown", touche);
      precedent?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ouverte]);
  if (!ouverte) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6">
      <div className="absolute inset-0 bg-[#2b1420]/55" onClick={onFermer} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitre}
        tabIndex={-1}
        className={`anim-feuille relative flex max-h-[92dvh] w-full flex-col rounded-t-feuille bg-surface shadow-flottant outline-none md:rounded-feuille ${
          large ? "md:max-w-3xl" : "md:max-w-lg"
        }`}
      >
        <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-bordure-2 md:hidden" aria-hidden />
        <div className="flex items-start gap-3 border-b border-bordure px-4 pb-3 pt-3 md:px-6 md:pt-5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id={idTitre} className="text-sous-titre text-prune-900">
                {titre}
              </h2>
              {enTete}
            </div>
            {sousTitre && <p className="mt-0.5 text-petit text-texte-2">{sousTitre}</p>}
          </div>
          <button
            type="button"
            onClick={onFermer}
            aria-label="Fermer"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-texte-2 active:bg-rose-200"
          >
            <X size={22} aria-hidden />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6">{children}</div>
        {pied && <div className="pb-securite border-t border-bordure px-4 py-3 md:px-6">{pied}</div>}
      </div>
    </div>
  );
}

/** État vide : icône, titre, une phrase, action facultative. */
export function EtatVide({ icone, titre, texte, action }: { icone: ReactNode; titre: string; texte?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-carte bg-surface-2 px-6 py-8 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-surface text-rose-500" aria-hidden>
        {icone}
      </span>
      <p className="text-corps font-semibold text-prune-900">{titre}</p>
      {texte && <p className="max-w-sm text-petit text-texte-2">{texte}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/** Squelette de chargement (barres rose-200 et rose-100). */
export function Squelette({ lignes = 3, className = "" }: { lignes?: number; className?: string }) {
  return (
    <div className={`animate-pulse space-y-2 rounded-carte bg-rose-100 p-4 ${className}`} role="status" aria-label="Chargement en cours">
      <div className="h-4 w-2/3 rounded-full bg-rose-200" />
      {Array.from({ length: lignes - 1 }, (_, i) => (
        <div key={i} className={`h-3 rounded-full bg-rose-200 ${i % 2 ? "w-1/2" : "w-5/6"}`} />
      ))}
    </div>
  );
}

/** Erreur réseau avec bouton « Réessayer ». */
export function ErreurReseau({ message, onReessayer }: { message?: string; onReessayer?: () => void }) {
  return (
    <EtatVide
      icone={<CloudOff size={24} />}
      titre="Connexion impossible"
      texte={message ?? "Vérifiez votre connexion internet, puis réessayez."}
      action={
        onReessayer && (
          <Bouton variante="secondaire" icone={<RefreshCw size={18} aria-hidden />} onClick={onReessayer}>
            Réessayer
          </Bouton>
        )
      }
    />
  );
}
