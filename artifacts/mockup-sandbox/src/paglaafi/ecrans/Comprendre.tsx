import { useEffect, useState } from "react";
import { BookOpen, Check, ChevronLeft, ChevronRight, Circle, Pause, Play, PlayCircle, RotateCcw } from "lucide-react";
import { lessons } from "../donnees/lecons";
import { useAudio, useEducation } from "../etat/contextes";
import { BadgeSimulation } from "../composants/BadgeSimulation";
import { Badge, Bouton, Carte, EnTeteSection, LIBELLES_LANGUES, PucesLangue } from "../composants/ui";

const CLE_VUES = "paglaafi_lecons_vues";
function lireVues(): number[] {
  try {
    const v = JSON.parse(localStorage.getItem(CLE_VUES) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/**
 * Comprendre : leçon en cours (étape x sur n, texte, lecteur audio, précédent / suivant),
 * vidéo de démonstration (badge Simulation) et liste des leçons
 * (« consultée » = déjà ouverte sur cet appareil).
 */
export function Comprendre() {
  const { audioProgress, handlePlayAudio, isPlaying, setAudioProgress, setIsPlaying, setSpeechLanguage, speechLanguage } = useAudio();
  const { activeLesson, setActiveLesson, setShowAutopalpationVideoModal } = useEducation();
  const [vues, setVues] = useState<number[]>(lireVues);
  const lecon = lessons[activeLesson];

  useEffect(() => {
    setVues((v) => {
      if (v.includes(lecon.id)) return v;
      const n = [...v, lecon.id];
      try {
        localStorage.setItem(CLE_VUES, JSON.stringify(n));
      } catch {
        // stockage indisponible : suivi pour la session seulement
      }
      return n;
    });
  }, [lecon.id]);

  const resume =
    speechLanguage === "en" ? lecon.englishSummary : speechLanguage === "moore" ? lecon.mooreSummary : speechLanguage === "dioula" ? lecon.dioulaSummary : lecon.summary;
  const texteAudio = (l = lecon) =>
    speechLanguage === "en" ? l.englishFullText : speechLanguage === "moore" ? l.mooreSummary : speechLanguage === "dioula" ? l.dioulaSummary : l.fullText;
  const changer = (i: number) => {
    setActiveLesson(i);
    if (isPlaying) handlePlayAudio(texteAudio(lessons[i]), speechLanguage);
  };

  return (
    <section className="anim-apparition">
      <h1 className="text-display text-prune-900">Comprendre, pas à pas</h1>
      <p className="mt-1 text-corps text-texte-2">Des repères simples, à lire ou à écouter.</p>
      <div className="mt-4">
        <PucesLangue valeur={speechLanguage} onChange={setSpeechLanguage} libelle="Langue de la leçon" />
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <Carte>
            <p className="text-petit font-semibold text-texte-2">
              Étape {activeLesson + 1} sur {lessons.length} · {lecon.category}
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-rose-200" aria-hidden>
              <div className="h-full rounded-full bg-action" style={{ width: `${((activeLesson + 1) / lessons.length) * 100}%` }} />
            </div>
            <div className="mt-4 flex items-start gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-carte bg-rose-100 text-rose-500" aria-hidden>
                <BookOpen size={24} />
              </span>
              <h2 className="text-titre text-prune-900">{lecon.title}</h2>
            </div>
            <p className="mt-3 text-corps text-texte">{resume}</p>

            {/* Lecteur audio */}
            <div className="mt-4 flex items-center gap-3 rounded-carte bg-surface-2 p-3">
              <button
                type="button"
                onClick={() => handlePlayAudio(texteAudio(), speechLanguage)}
                aria-label={isPlaying ? "Mettre en pause" : `Écouter en ${LIBELLES_LANGUES[speechLanguage]}`}
                className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-action text-sur-action shadow-carte"
              >
                {isPlaying ? <Pause size={26} fill="currentColor" aria-hidden /> : <Play size={26} fill="currentColor" aria-hidden className="ml-1" />}
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-petit font-semibold text-prune-900">{isPlaying ? `Lecture en cours (${LIBELLES_LANGUES[speechLanguage]})` : "Prêt à écouter"}</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-rose-200" role="progressbar" aria-label="Progression de la lecture" aria-valuenow={Math.round(audioProgress)} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full rounded-full bg-action transition-all duration-200" style={{ width: `${audioProgress}%` }} />
                </div>
                <p className="mt-1 text-petit text-texte-2">{lecon.duration}</p>
              </div>
              <button
                type="button"
                aria-label="Recommencer la lecture"
                onClick={() => {
                  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                  setIsPlaying(false);
                  setAudioProgress(0);
                }}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-texte-2 active:bg-rose-200"
              >
                <RotateCcw size={20} aria-hidden />
              </button>
            </div>

            <div className="mt-4 flex gap-3">
              <Bouton variante="secondaire" className="flex-1" icone={<ChevronLeft size={20} aria-hidden />} disabled={activeLesson === 0} onClick={() => changer(activeLesson - 1)}>
                Précédent
              </Bouton>
              <Bouton className="flex-1" disabled={activeLesson === lessons.length - 1} onClick={() => changer(activeLesson + 1)}>
                Suivant <ChevronRight size={20} aria-hidden />
              </Bouton>
            </div>
          </Carte>

          <Carte>
            <h3 className="text-corps font-semibold text-prune-900">Explication détaillée ({speechLanguage === "en" ? "English" : "Français"})</h3>
            <p className="mt-2 text-corps text-texte">{speechLanguage === "en" ? lecon.englishFullText : lecon.fullText}</p>
          </Carte>
        </div>

        <div className="space-y-4">
          <Carte className="overflow-hidden p-0">
            <div className="relative">
              <img src="/images/autopalpation-afrique-demo.webp" alt="" loading="lazy" className="aspect-video w-full object-cover" width={640} height={360} />
              <span className="absolute inset-0 grid place-items-center bg-[#2b1420]/35" aria-hidden>
                <PlayCircle size={52} className="text-white" />
              </span>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-corps font-semibold text-prune-900">Vidéo des 4 gestes d'autopalpation</h3>
                <BadgeSimulation detail="Démonstration par images animées : la vidéo réelle reste à produire et à valider." />
              </div>
              <p className="mt-1 text-petit text-texte-2">Démonstration guidée (2:45 min)</p>
              <Bouton className="mt-3" pleineLargeur icone={<Play size={18} aria-hidden />} onClick={() => setShowAutopalpationVideoModal(true)}>
                Regarder la vidéo démonstrative
              </Bouton>
            </div>
          </Carte>

          <section aria-labelledby="titre-lecons">
            <EnTeteSection id="titre-lecons" titre="Toutes les leçons" />
            <ul className="space-y-2">
              {lessons.map((l, i) => {
                const enCours = i === activeLesson;
                const vue = vues.includes(l.id) && !enCours;
                return (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => changer(i)}
                      aria-current={enCours ? "step" : undefined}
                      className={`flex w-full items-center gap-3 rounded-carte border p-3 text-left ${enCours ? "border-action bg-rose-100" : "border-bordure bg-surface"}`}
                    >
                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${vue ? "bg-succes-fond text-succes" : enCours ? "bg-action text-sur-action" : "bg-surface-2 text-texte-2"}`} aria-hidden>
                        {vue ? <Check size={18} /> : enCours ? <Play size={16} /> : <Circle size={16} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-corps font-semibold text-prune-900">{l.title}</span>
                        <span className="block text-petit text-texte-2">
                          {l.category} · {l.duration}
                        </span>
                      </span>
                      <Badge ton={vue ? "succes" : enCours ? "neutre" : "info"}>{vue ? "Consultée" : enCours ? "En cours" : "À venir"}</Badge>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}
