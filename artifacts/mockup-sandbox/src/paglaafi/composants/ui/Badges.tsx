import type { ReactNode } from "react";
import { Check, CircleHelp, Clock, DoorClosed, FlaskConical, MapPinned, ShieldCheck, WifiOff, X, CircleSlash } from "lucide-react";
import type { CenterStatus } from "../../types";

/**
 * Badges : statut d'un centre, Simulation, Démo, données OpenStreetMap,
 * origine des réponses de Rose IA et rôle. Chaque badge combine une icône et
 * un libellé : l'information ne repose jamais sur la couleur seule.
 */

type Ton = "succes" | "attention" | "alerte" | "info" | "neutre" | "simulation" | "pro" | "prune";
const TONS: Record<Ton, string> = {
  succes: "bg-succes-fond text-succes",
  attention: "bg-attention-fond text-attention",
  alerte: "bg-alerte-fond text-alerte",
  info: "bg-info-fond text-info",
  neutre: "bg-surface-2 text-texte",
  simulation: "bg-simulation-fond text-simulation bordure-simulation",
  pro: "bg-pro-fond text-pro",
  prune: "bg-carte-prune text-white",
};

export function Badge({ ton = "neutre", icone, children, className = "" }: { ton?: Ton; icone?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex max-w-full items-center gap-1 rounded-full px-2.5 py-1 text-badge ${TONS[ton]} ${className}`}>
      {icone}
      <span className="truncate">{children}</span>
    </span>
  );
}

/** Statuts de centre : base (available, busy, maintenance, outdated, closed) → libellé, ton, icône. */
export const STATUTS_CENTRE: Record<CenterStatus, { libelle: string; ton: Ton; icone: ReactNode; couleur: string }> = {
  available: { libelle: "Disponible", ton: "succes", icone: <Check size={14} aria-hidden />, couleur: "#1d7a4a" },
  busy: { libelle: "Saturé", ton: "attention", icone: <Clock size={14} aria-hidden />, couleur: "#8f5b00" },
  maintenance: { libelle: "En panne", ton: "alerte", icone: <X size={14} aria-hidden />, couleur: "#b42318" },
  outdated: { libelle: "À mettre à jour", ton: "info", icone: <CircleHelp size={14} aria-hidden />, couleur: "#475467" },
  closed: { libelle: "Fermé", ton: "neutre", icone: <DoorClosed size={14} aria-hidden />, couleur: "#6b5a63" },
};

export function BadgeStatutCentre({ statut }: { statut: CenterStatus }) {
  const s = STATUTS_CENTRE[statut] ?? STATUTS_CENTRE.outdated;
  return (
    <Badge ton={s.ton} icone={s.icone}>
      {s.libelle}
    </Badge>
  );
}

/** Ce qui reste simulé (mode réel). */
export function BadgeSimulationUi({ detail }: { detail?: string }) {
  return (
    <span title={detail} className="inline-flex items-center">
      <Badge ton="simulation" icone={<FlaskConical size={14} aria-hidden />}>
        Simulation
      </Badge>
      {detail && <span className="sr-only"> : {detail}</span>}
    </span>
  );
}

/** Pastille du mode démonstration. */
export function BadgeDemo() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-nuit px-2.5 py-1 text-badge text-white">
      <span className="h-2 w-2 rounded-full bg-demo-point" aria-hidden />
      Démo
      <span className="sr-only min-[480px]:not-sr-only"> · données fictives</span>
    </span>
  );
}

export function BadgeOSM() {
  return (
    <Badge ton="info" icone={<MapPinned size={14} aria-hidden />}>
      Données OpenStreetMap · à vérifier
    </Badge>
  );
}

/** Origine d'une réponse de Rose IA (trois cas seulement). */
export function BadgeOrigineRose({ origine }: { origine: "ia" | "faq" | "sans_source" }) {
  if (origine === "ia")
    return (
      <Badge ton="succes" icone={<ShieldCheck size={14} aria-hidden />}>
        Fondée sur des fiches validées
      </Badge>
    );
  if (origine === "faq")
    return (
      <Badge ton="attention" icone={<WifiOff size={14} aria-hidden />}>
        Hors ligne · FAQ validée
      </Badge>
    );
  return (
    <Badge ton="neutre" icone={<CircleSlash size={14} aria-hidden />}>
      Aucune fiche validée sur ce sujet
    </Badge>
  );
}

/** Rôle dans l'en-tête des espaces professionnels (prune pour le superadmin). */
export function BadgeRole({ libelle, superadmin }: { libelle: string; superadmin?: boolean }) {
  return <Badge ton={superadmin ? "prune" : "pro"}>{libelle}</Badge>;
}
