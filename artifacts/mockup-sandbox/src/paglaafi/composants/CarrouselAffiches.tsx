import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { AFFICHES } from "../donnees/affiches";
import { useAnnonces } from "../etat/contextes";

const reduit = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const DELAI = 4500;

/**
 * Carrousel défilant des affiches : une affiche toutes les 4,5 s, balayage tactile
 * (défilement natif avec aimantation), boutons Précédent / Suivant / Pause (44 px).
 * Le défilement automatique s'arrête au toucher, au survol, au focus clavier,
 * et ne démarre pas si l'appareil demande moins d'animations.
 * Un appui sur une affiche l'ouvre en grand.
 */
export function CarrouselAffiches() {
  const { setSelectedPosterModal } = useAnnonces();
  const piste = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [lecture, setLecture] = useState(() => !reduit());
  const [suspendu, setSuspendu] = useState(false);

  const allerA = (i: number) => {
    const n = (i + AFFICHES.length) % AFFICHES.length;
    const el = piste.current?.children[n] as HTMLElement | undefined;
    if (el && piste.current) piste.current.scrollTo({ left: el.offsetLeft - piste.current.offsetLeft, behavior: reduit() ? "auto" : "smooth" });
    setIndex(n);
  };

  // Défilement automatique
  useEffect(() => {
    if (!lecture || suspendu) return;
    const t = setInterval(() => allerA(index + 1), DELAI);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lecture, suspendu, index]);

  // Index suivi pendant le balayage manuel
  const auDefilement = () => {
    const p = piste.current;
    if (!p) return;
    const largeur = (p.children[0] as HTMLElement | undefined)?.offsetWidth ?? 1;
    const i = Math.round(p.scrollLeft / (largeur + 12));
    if (i !== index) setIndex(Math.min(AFFICHES.length - 1, Math.max(0, i)));
  };

  const bouton = "grid h-11 w-11 place-items-center rounded-full border border-bordure bg-surface text-prune-900";
  return (
    <section
      aria-roledescription="carrousel"
      aria-label="Affiches Octobre Rose"
      onMouseEnter={() => setSuspendu(true)}
      onMouseLeave={() => setSuspendu(false)}
      onFocus={() => setSuspendu(true)}
      onBlur={() => setSuspendu(false)}
      onTouchStart={() => setSuspendu(true)}
      onTouchEnd={() => setSuspendu(false)}
    >
      <ul ref={piste} onScroll={auDefilement} className="defilement-discret flex snap-x snap-mandatory gap-3 overflow-x-auto">
        {AFFICHES.map((a, i) => (
          <li key={a.id} className="flex w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]" aria-roledescription="diapositive" aria-label={`${i + 1} sur ${AFFICHES.length}`}>
            <button
              type="button"
              onClick={() => setSelectedPosterModal({ url: a.image, title: a.titre, author: a.organisateur, caption: `${a.quand} · ${a.ou}` })}
              className="flex w-full flex-col overflow-hidden rounded-carte border border-bordure bg-surface text-left shadow-carte"
            >
              <img src={a.image} alt={`Affiche : ${a.titre}`} loading={i < 2 ? "eager" : "lazy"} className="aspect-[4/5] w-full object-cover object-top" width={400} height={500} />
              <span className="block p-3">
                <span className="line-clamp-1 block text-petit font-semibold text-action">{a.quand}</span>
                <span className="block min-h-[3rem]">
                  <span className="line-clamp-2 text-corps font-semibold text-prune-900">{a.titre}</span>
                </span>
                <span className="block truncate text-petit text-texte-2">
                  {a.organisateur} · {a.ou}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex gap-1.5" aria-hidden>
          {AFFICHES.map((a, i) => (
            <span key={a.id} className={`h-2 rounded-full transition-all ${i === index ? "w-5 bg-action" : "w-2 bg-bordure-2"}`} />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" className={bouton} aria-label="Affiche précédente" onClick={() => allerA(index - 1)}>
            <ChevronLeft size={20} aria-hidden />
          </button>
          <button type="button" className={bouton} aria-label={lecture ? "Arrêter le défilement" : "Faire défiler"} aria-pressed={lecture} onClick={() => setLecture(!lecture)}>
            {lecture ? <Pause size={18} aria-hidden /> : <Play size={18} aria-hidden />}
          </button>
          <button type="button" className={bouton} aria-label="Affiche suivante" onClick={() => allerA(index + 1)}>
            <ChevronRight size={20} aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
