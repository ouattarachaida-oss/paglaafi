/**
 * Schémas des 4 gestes (SVG intégré, disponibles hors ligne) : silhouette habillée,
 * main et flèches de mouvement, dans la palette du design system, sans nudité.
 * ⚠️ À faire valider par un soignant.
 */
const TRAIT = "var(--pl-prune-900)";
const HAUT = "var(--pl-rose-200)";
const PEAU = "var(--pl-surface-2)";
const ACCENT = "var(--pl-action)";

/** Buste habillé vu de face (tête, cou, haut à manches). */
function Buste({ brasLeves = false, brasDroitLeve = false }: { brasLeves?: boolean; brasDroitLeve?: boolean }) {
  return (
    <g stroke={TRAIT} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
      <circle cx="120" cy="52" r="24" fill={PEAU} />
      <path d="M108 74 v12 h24 v-12" fill={PEAU} />
      {/* Haut (vêtement) */}
      <path d="M72 100 q48 -22 96 0 l8 108 h-112 z" fill={HAUT} />
      {/* Bras */}
      {brasLeves ? (
        <>
          <path d="M76 104 l-26 -56" fill="none" strokeWidth="14" stroke={HAUT} />
          <path d="M164 104 l26 -56" fill="none" strokeWidth="14" stroke={HAUT} />
        </>
      ) : (
        <>
          <path d="M74 106 l-14 92" fill="none" strokeWidth="14" stroke={HAUT} />
          {brasDroitLeve ? <path d="M166 104 l34 -48" fill="none" strokeWidth="14" stroke={HAUT} /> : <path d="M166 106 l14 92" fill="none" strokeWidth="14" stroke={HAUT} />}
        </>
      )}
    </g>
  );
}

/** Main stylisée (paume et doigts joints). */
function Main({ x, y, rotation = 0 }: { x: number; y: number; rotation?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation})`} stroke={TRAIT} strokeWidth="2.5" strokeLinejoin="round" fill={PEAU}>
      <rect x="-12" y="-6" width="24" height="26" rx="10" />
      <rect x="-12" y="-22" width="7" height="18" rx="3.5" />
      <rect x="-4" y="-25" width="7" height="21" rx="3.5" />
      <rect x="4" y="-22" width="7" height="18" rx="3.5" />
    </g>
  );
}

function Fleche({ d, id }: { d: string; id: string }) {
  return <path d={d} fill="none" stroke={ACCENT} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" markerEnd={`url(#${id})`} />;
}

const Defs = ({ id }: { id: string }) => (
  <defs>
    <marker id={id} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill={ACCENT} />
    </marker>
  </defs>
);

export function SchemaGeste({ numero, titre }: { numero: 1 | 2 | 3 | 4; titre: string }) {
  const pointe = `pointe-geste-${numero}`;
  return (
    <svg viewBox="0 0 240 220" role="img" aria-label={`Schéma : ${titre}`} className="h-full w-full">
      <Defs id={pointe} />
      {numero === 1 && (
        <>
          {/* Devant le miroir, bras levés : on observe */}
          <rect x="8" y="20" width="40" height="180" rx="8" fill="none" stroke={TRAIT} strokeWidth="3" strokeDasharray="6 5" />
          <Buste brasLeves />
          <Fleche id={pointe} d="M44 150 q-14 -40 0 -80" />
          <Fleche id={pointe} d="M196 150 q14 -40 0 -80" />
        </>
      )}
      {numero === 2 && (
        <>
          {/* Petits cercles avec la pulpe de 3 doigts, par-dessus le vêtement */}
          <Buste />
          <Main x={100} y={142} rotation={-10} />
          <Fleche id={pointe} d="M128 128 a20 20 0 1 1 -2 -26" />
        </>
      )}
      {numero === 3 && (
        <>
          {/* Bras levé : on couvre la zone jusqu'à l'aisselle */}
          <Buste brasDroitLeve />
          <Main x={150} y={120} rotation={30} />
          <Fleche id={pointe} d="M120 160 q24 -18 30 -50" />
        </>
      )}
      {numero === 4 && (
        <>
          {/* Pression douce entre le pouce et l'index (geste symbolisé sur le vêtement) */}
          <Buste />
          <Main x={118} y={140} />
          <Fleche id={pointe} d="M96 150 l14 -6" />
          <Fleche id={pointe} d="M142 150 l-14 -6" />
        </>
      )}
    </svg>
  );
}
