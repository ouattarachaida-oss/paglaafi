import { useState } from "react";
import { CheckCircle2, ChevronRight, HelpCircle, RotateCcw, Sparkles, Trophy, XCircle } from "lucide-react";
import { useEducation } from "../etat/contextes";
import { QUESTIONS_QUIZ_ROSE } from "../donnees/quizRose";
import { Bouton, BoutonEcouter, Feuille } from "../composants/ui";
import { hapticFeedback } from "../lib/haptique";

/**
 * Modale interactive « Quiz Prévention & Gestes avec Rose IA » :
 * Permet aux femmes et accompagnants de tester leurs connaissances de manière
 * ludique et bienveillante, avec explications médicales instantanées et audio.
 */
export function ModaleQuizRose() {
  const { showQuizModal, setShowQuizModal, setShowAutopalpationVideoModal } = useEducation();

  const [indexActuel, setIndexActuel] = useState(0);
  const [reponseChoisie, setReponseChoisie] = useState<number | null>(null);
  const [reponsesValidees, setReponsesValidees] = useState<{ indexQuestion: number; correct: boolean }[]>([]);
  const [quizTermine, setQuizTermine] = useState(false);

  const total = QUESTIONS_QUIZ_ROSE.length;
  const question = QUESTIONS_QUIZ_ROSE[indexActuel];

  const fermer = () => {
    setShowQuizModal(false);
  };

  const reinitialiser = () => {
    setIndexActuel(0);
    setReponseChoisie(null);
    setReponsesValidees([]);
    setQuizTermine(false);
  };

  const gererChoix = (indexOption: number) => {
    if (reponseChoisie !== null) return; // déjà répondu
    hapticFeedback(10);
    setReponseChoisie(indexOption);
    const estCorrect = indexOption === question.reponseCorrecte;
    setReponsesValidees((prev) => [...prev, { indexQuestion: indexActuel, correct: estCorrect }]);
  };

  const passerSuivant = () => {
    hapticFeedback(15);
    if (indexActuel + 1 < total) {
      setIndexActuel((prev) => prev + 1);
      setReponseChoisie(null);
    } else {
      setQuizTermine(true);
    }
  };

  const score = reponsesValidees.filter((r) => r.correct).length;

  return (
    <Feuille
      ouverte={showQuizModal}
      onFermer={fermer}
      large
      titre="Quiz Prévention avec Rose IA"
      sousTitre="Testez vos connaissances en douceur et sans tabou"
    >
      {!quizTermine ? (
        <div className="space-y-4">
          {/* En-tête de progression */}
          <div className="flex items-center justify-between text-petit font-medium text-texte-2">
            <span>
              Question <strong className="text-prune-900">{indexActuel + 1}</strong> sur {total}
            </span>
            <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
              Score : {score} / {reponsesValidees.length}
            </span>
          </div>

          {/* Jauge visuelle de progression */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-rose-100">
            <div
              className="h-full rounded-full bg-action transition-all duration-300"
              style={{ width: `${((indexActuel + 1) / total) * 100}%` }}
            />
          </div>

          {/* Carte de la question posée par Rose IA */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-action text-sur-action shadow-sm" aria-hidden>
                <Sparkles size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                  Rose IA vous demande :
                </span>
                <p className="mt-1 text-corps font-bold leading-snug text-prune-900">
                  {question.question}
                </p>
                <div className="mt-2.5">
                  <BoutonEcouter texte={question.question} langue="fr" />
                </div>
              </div>
            </div>
          </div>

          {/* Liste des choix */}
          <div className="space-y-2.5" role="radiogroup" aria-label="Choix de réponses">
            {question.options.map((option, idx) => {
              const selectionne = reponseChoisie === idx;
              const estLaBonne = idx === question.reponseCorrecte;
              const aRepondu = reponseChoisie !== null;

              let styleBouton = "border-bordure bg-surface hover:border-rose-300 active:bg-rose-50 text-texte";
              let icone = <span className="grid h-6 w-6 place-items-center rounded-full border border-bordure text-xs font-bold text-texte-2">{idx + 1}</span>;

              if (aRepondu) {
                if (estLaBonne) {
                  styleBouton = "border-green-500 bg-green-50 text-green-950 ring-2 ring-green-300";
                  icone = <CheckCircle2 size={22} className="text-green-600 shrink-0" aria-hidden />;
                } else if (selectionne) {
                  styleBouton = "border-red-400 bg-red-50 text-red-950 ring-2 ring-red-200";
                  icone = <XCircle size={22} className="text-red-500 shrink-0" aria-hidden />;
                } else {
                  styleBouton = "border-bordure/60 bg-surface/60 text-texte-2 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={aRepondu}
                  onClick={() => gererChoix(idx)}
                  className={`flex w-full items-center gap-3 rounded-xl border-[1.5px] p-3.5 text-left text-petit font-semibold transition-all ${styleBouton}`}
                >
                  {icone}
                  <span className="flex-1 leading-snug">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Explication médicale bienveillante dès qu'une réponse est choisie */}
          {reponseChoisie !== null && (
            <div className="anim-apparition space-y-3 rounded-2xl border border-rose-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <HelpCircle size={18} className="text-action" aria-hidden />
                <h3 className="text-petit font-bold text-prune-900">
                  Le conseil de Rose IA :
                </h3>
              </div>
              <p className="text-petit leading-relaxed text-texte">
                {question.explication}
              </p>
              <div className="flex items-center justify-between pt-1">
                <BoutonEcouter texte={question.explication} langue="fr" />
                <Bouton onClick={passerSuivant} icone={<ChevronRight size={18} aria-hidden />}>
                  {indexActuel + 1 < total ? "Question suivante" : "Voir mon score final"}
                </Bouton>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Écran de résultat final */
        <div className="anim-apparition space-y-5 text-center py-2">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-tr from-rose-200 to-rose-100 text-action shadow-md">
            <Trophy size={40} aria-hidden />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800">
              Quiz terminé avec succès
            </span>
            <h3 className="mt-2 text-titre font-bold text-prune-900">
              {score >= 4 ? "Félicitations ma soeur !" : "Bravo pour votre participation !"}
            </h3>
            <p className="mt-1 text-corps font-semibold text-action">
              Votre score : {score} sur {total}
            </p>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4 text-left">
            <p className="text-petit leading-relaxed text-texte">
              {score >= 4
                ? "Vous maîtrisez les réflexes essentiels de prévention ! Continuez à pratiquer votre autopalpation chaque mois et partagez ces précieux conseils autour de vous."
                : "Chaque question découverte est un pas de plus pour votre santé et celle de vos proches. Vous pouvez réécouter les conseils et consulter le guide des 4 gestes à tout moment."}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <Bouton
              pleineLargeur
              onClick={() => {
                fermer();
                setShowAutopalpationVideoModal(true);
              }}
            >
              Revoir le guide des 4 gestes
            </Bouton>
            <Bouton pleineLargeur variante="discret" onClick={reinitialiser} icone={<RotateCcw size={16} aria-hidden />}>
              Recommencer le quiz
            </Bouton>
          </div>
        </div>
      )}
    </Feuille>
  );
}
