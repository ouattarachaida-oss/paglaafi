import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useUi } from "../etat/contextes";
import { GESTES, SCHEMAS_VALIDES } from "../donnees/guideGestes";
import { arreterLecture, audioDisponible, lire } from "../lib/voix";
import { choisirTexte, MentionTraduction } from "./ui/Langue";
import { SchemaGeste } from "./SchemasGestes";

const reduit = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Guide des 4 gestes : une étape par écran, qui défilent automatiquement pendant la
 * lecture audio (sauf si l'appareil demande moins d'animations), au balayage, au
 * clavier (flèches) et avec les boutons Précédent / Pause-Lecture / Suivant (48 px).
 * Texte et audio dans la langue choisie quand ils existent (sinon français + mention).
 */
export function GuideGestes() {
  const { appLanguage } = useUi();
  const [index, setIndex] = useState(0);
  const [enLecture, setEnLecture] = useState(false);
  const departBalayage = useRef<number | null>(null);
  const geste = GESTES[index];

  const versionAudio = (i: number) => {
    const g = GESTES[i];
    const url = appLanguage === "moore" ? g.audioUrlMoore : appLanguage === "dioula" ? g.audioUrlDioula : undefined;
    const { texte, langue } = choisirTexte(g.texte, appLanguage);
    const titre = choisirTexte(g.titre, appLanguage).texte;
    return { texte: `${titre}. ${texte}`, langue, url };
  };
  const { langue: langueAudio, url: urlAudio } = versionAudio(index);
  const audioOk = audioDisponible(langueAudio, urlAudio);

  // Lecture de l'étape courante ; à la fin, passage automatique à l'étape suivante
  useEffect(() => {
    if (!enLecture) return;
    const v = versionAudio(index);
    const ok = lire({
      ...v,
      onFin: () => {
        if (!reduit() && index < GESTES.length - 1) setIndex((i) => i + 1);
        else setEnLecture(false);
      },
    });
    if (!ok) setEnLecture(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enLecture, index, appLanguage]);

  // Arrêt de l'audio quand le guide est fermé
  useEffect(() => () => arreterLecture(), []);

  const aller = (i: number) => setIndex(Math.max(0, Math.min(GESTES.length - 1, i)));
  const basculer = () => {
    if (enLecture) {
      arreterLecture();
      setEnLecture(false);
    } else setEnLecture(true);
  };

  const titre = choisirTexte(geste.titre, appLanguage);
  const texte = choisirTexte(geste.texte, appLanguage);

  return (
    <div className="space-y-4">
      {/* Progression */}
      <div>
        <p className="text-petit font-semibold text-prune-900" aria-live="polite">
          Étape {index + 1} sur {GESTES.length}
        </p>
        <div
          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-rose-200"
          role="progressbar"
          aria-label="Progression du guide"
          aria-valuemin={1}
          aria-valuemax={GESTES.length}
          aria-valuenow={index + 1}
          aria-valuetext={`Étape ${index + 1} sur ${GESTES.length}`}
        >
          <div className="h-full rounded-full bg-action transition-[width] duration-200" style={{ width: `${((index + 1) / GESTES.length) * 100}%` }} />
        </div>
      </div>

      {/* Étapes (défilement horizontal, balayage, flèches du clavier) */}
      <div
        className="overflow-hidden rounded-carte border border-bordure bg-surface focus-visible:outline-2"
        tabIndex={0}
        role="region"
        aria-roledescription="carrousel"
        aria-label="Guide des 4 gestes d'autopalpation (flèches gauche et droite pour changer d'étape)"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") aller(index + 1);
          if (e.key === "ArrowLeft") aller(index - 1);
        }}
        onPointerDown={(e) => (departBalayage.current = e.clientX)}
        onPointerUp={(e) => {
          if (departBalayage.current === null) return;
          const dx = e.clientX - departBalayage.current;
          departBalayage.current = null;
          if (dx < -40) aller(index + 1);
          if (dx > 40) aller(index - 1);
        }}
        style={{ touchAction: "pan-y" }}
      >
        <div className="flex transition-transform duration-200 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
          {GESTES.map((g, i) => {
            const t = choisirTexte(g.titre, appLanguage).texte;
            return (
              <div key={g.numero} className="w-full shrink-0 p-4" aria-hidden={i !== index} role="group" aria-roledescription="étape" aria-label={`Étape ${i + 1} sur ${GESTES.length}`}>
                <div className="mx-auto aspect-[12/11] w-full max-w-[280px] rounded-carte bg-surface-2 p-2">
                  <SchemaGeste numero={g.numero} titre={t} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="space-y-2 border-t border-bordure px-4 py-3">
          <h3 className="text-sous-titre text-prune-900">{titre.texte}</h3>
          <p className="text-corps text-texte">{texte.texte}</p>
          {(titre.manquante || texte.manquante) && <MentionTraduction langue={appLanguage} />}
        </div>
      </div>

      {/* Commandes */}
      <div className="flex items-center justify-center gap-3">
        <button type="button" onClick={() => aller(index - 1)} disabled={index === 0} aria-label="Étape précédente" className="grid h-12 w-12 place-items-center rounded-full border-[1.5px] border-action text-action disabled:opacity-40">
          <ChevronLeft size={24} aria-hidden />
        </button>
        <button
          type="button"
          onClick={basculer}
          disabled={!audioOk}
          aria-pressed={enLecture}
          aria-label={enLecture ? "Pause" : "Lecture"}
          className="grid h-14 w-14 place-items-center rounded-full bg-action text-sur-action shadow-carte disabled:opacity-40"
        >
          {enLecture ? <Pause size={26} fill="currentColor" aria-hidden /> : <Play size={26} fill="currentColor" aria-hidden className="ml-1" />}
        </button>
        <button type="button" onClick={() => aller(index + 1)} disabled={index === GESTES.length - 1} aria-label="Étape suivante" className="grid h-12 w-12 place-items-center rounded-full border-[1.5px] border-action text-action disabled:opacity-40">
          <ChevronRight size={24} aria-hidden />
        </button>
      </div>
      {!audioOk && <p className="text-center text-petit text-texte-2">Audio indisponible pour cette langue</p>}

      {!SCHEMAS_VALIDES && <p className="text-center text-petit font-semibold text-attention">Schémas à valider par un soignant</p>}
    </div>
  );
}
