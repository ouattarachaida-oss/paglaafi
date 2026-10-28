import { useEffect, useState } from "react";
import { BookOpen, Check, ChevronLeft, ChevronRight, Circle, Hand, Play } from "lucide-react";
import { lessons } from "../donnees/lecons";
import { useEducation, useLangue, useUi } from "../etat/contextes";
import type { Lecon } from "../types";
import { Badge, Bouton, BoutonEcouter, Carte, choisirTexte, EnTeteSection, MentionTraduction, PucesLangue } from "../composants/ui";
import type { Langue } from "../lib/voix";

const CLE_VUES = "paglaafi_lecons_vues";
function lireVues(): number[] {
  try {
    const v = JSON.parse(localStorage.getItem(CLE_VUES) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/** Textes d'une leçon selon la langue (le titre n'existe qu'en français, le texte détaillé en français et en anglais). */
const resume = (l: Lecon, langue: Langue) => choisirTexte({ fr: l.summary, en: l.englishSummary, moore: l.mooreSummary, dioula: l.dioulaSummary }, langue);
const detail = (l: Lecon, langue: Langue) => choisirTexte({ fr: l.fullText, en: l.englishFullText }, langue);
const urlAudio = (l: Lecon, langue: Langue) => (langue === "moore" ? l.audioUrlMoore : langue === "dioula" ? l.audioUrlDioula : undefined);

/**
 * Comprendre : leçon en cours (étape x sur n), texte et audio dans la langue choisie
 * (mémorisée sur l'appareil, partagée par tous les contenus), guide des 4 gestes et
 * liste des leçons (« consultée » = déjà ouverte sur cet appareil).
 */
export function Comprendre() {
  const { appLanguage } = useUi();
  const { handleSelectAppLanguage } = useLangue();
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

  const r = resume(lecon, appLanguage);
  const d = detail(lecon, appLanguage);

  return (
    <section className="anim-apparition">
      <h1 className="text-display text-prune-900">Comprendre, pas à pas</h1>
      <p className="mt-1 text-corps text-texte-2">Des repères simples, à lire ou à écouter.</p>
      <div className="mt-4">
        <PucesLangue valeur={appLanguage} onChange={handleSelectAppLanguage} libelle="Langue des contenus" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
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
            <p className="mt-3 text-corps text-texte" data-langue-contenu={r.langue}>
              {r.texte}
            </p>
            {appLanguage !== "fr" && <MentionTraduction langue={appLanguage} partie={r.manquante ? undefined : "Titre"} />}
            <div className="mt-4">
              <BoutonEcouter texte={r.texte} langue={r.langue} url={urlAudio(lecon, appLanguage)} />
            </div>

            <div className="mt-4 flex gap-3">
              <Bouton variante="secondaire" className="flex-1" icone={<ChevronLeft size={20} aria-hidden />} disabled={activeLesson === 0} onClick={() => setActiveLesson(activeLesson - 1)}>
                Précédent
              </Bouton>
              <Bouton className="flex-1" disabled={activeLesson === lessons.length - 1} onClick={() => setActiveLesson(activeLesson + 1)}>
                Suivant <ChevronRight size={20} aria-hidden />
              </Bouton>
            </div>
          </Carte>

          <Carte>
            <h3 className="text-corps font-semibold text-prune-900">Explication détaillée</h3>
            <p className="mt-2 text-corps text-texte">{d.texte}</p>
            {d.manquante && <MentionTraduction langue={appLanguage} />}
            <div className="mt-3">
              <BoutonEcouter texte={d.texte} langue={d.langue} />
            </div>
          </Carte>
        </div>

        <div className="space-y-4">
          <Carte className="space-y-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-rose-100 text-rose-500" aria-hidden>
              <Hand size={24} />
            </span>
            <h3 className="text-sous-titre text-prune-900">Guide des 4 gestes d'autopalpation</h3>
            <p className="text-petit text-texte-2">4 étapes illustrées, à suivre au doigt ou à écouter.</p>
            <Bouton pleineLargeur icone={<Play size={18} aria-hidden />} onClick={() => setShowAutopalpationVideoModal(true)}>
              Ouvrir le guide des 4 gestes
            </Bouton>
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
                      onClick={() => setActiveLesson(i)}
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
