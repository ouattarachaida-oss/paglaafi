import { useState } from "react";
import {
  BookOpen,
  Eye,
  CheckCircle2,
  AlertCircle,
  Volume2,
  ShieldCheck,
  ChevronRight,
  Info,
  Calendar,
} from "lucide-react";
import type { EducationalLesson } from "../types";
import { educationalLessons } from "../data/education";
import { speakText, stopSpeaking } from "../utils/speech";
import { hapticFeedback } from "../utils/haptics";
import { CardV2 } from "../ui/CardV2";
import { ButtonV2 } from "../ui/ButtonV2";
import { BadgeV2 } from "../ui/BadgeV2";

interface PreventionV2Props {
  appLanguage: "fr" | "moore" | "dioula" | "en";
}

export function PreventionV2({ appLanguage }: PreventionV2Props) {
  const [activeTab, setActiveTab] = useState<
    "comprendre" | "signes" | "autopalpation" | "depistage"
  >("comprendre");

  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedSelfExamStep, setSelectedSelfExamStep] = useState(1);

  const lesson = educationalLessons[selectedLessonIndex];

  const getLessonText = (l: EducationalLesson) => {
    if (appLanguage === "moore") return l.mooreSummary;
    if (appLanguage === "dioula") return l.dioulaSummary;
    if (appLanguage === "en") return l.englishFullText;
    return l.fullText;
  };

  const handleAudio = (text: string) => {
    hapticFeedback(12);
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(text, appLanguage, () => setIsSpeaking(false));
    }
  };

  // Les 4 étapes d'autopalpation recommandées
  const selfExamSteps = [
    {
      step: 1,
      title: "Étape 1 : Observer (LOOK)",
      subtitle: "Devant le miroir, bras le long du corps puis levés",
      description:
        "Regardez attentivement l'aspect général de vos deux seins. Vérifiez qu'il n'y a pas de changement soudain de forme, de rougeur inhabituelle, de peau d'orange ou de mamelon qui se rétracte vers l'intérieur.",
    },
    {
      step: 2,
      title: "Étape 2 : Palper doucement (FEEL)",
      subtitle: "Avec la pulpe de 3 doigts à plat, en petits cercles",
      description:
        "Allongée sur le dos ou sous la douche (avec un peu de savon pour faciliter le glissement). Utilisez la pulpe de vos 3 doigts du milieu à plat. Décrivez de petits cercles avec une pression progressive (légère, moyenne, puis un peu plus ferme) du bord extérieur vers le mamelon.",
    },
    {
      step: 3,
      title: "Étape 3 : Couvrir jusqu'aux aisselles (COVER ALL)",
      subtitle: "Le tissu mammaire s'étend sous le bras et la clavicule",
      description:
        "Le sein ne s'arrête pas à la poitrine : il monte jusqu'à la clavicule et s'étend sous le creux de l'aisselle. Palpez soigneusement cette zone pour vérifier l'absence de ganglion dur ou de nodule profond.",
    },
    {
      step: 4,
      title: "Étape 4 : Vérifier le mamelon (NIPPLE CHECK)",
      subtitle: "Pincement très délicat sans forcer",
      description:
        "Pincez très délicatement le mamelon entre le pouce et l'index. Vérifiez qu'aucun liquide (clair, jaunâtre ou avec des traces de sang) ne s'écoule spontanément.",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Avertissement Médical et Éthique */}
      <div className="rounded-2xl bg-[#EFF6FF] border border-blue-200 p-3.5 sm:p-4 text-xs text-blue-900 flex items-start gap-2.5">
        <Info size={17} className="text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Information médicale importante :</strong> L'autopalpation est un geste d'autosurveillance pour mieux connaître son corps, mais elle <strong>ne remplace en aucun cas</strong> une consultation clinique régulière par une sage-femme ou un médecin, ni une mammographie de dépistage.
        </div>
      </div>

      {/* Onglets de navigation de la section Prévention */}
      <div className="flex border-b border-[#E9E0E4] gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: "comprendre" as const, label: "Comprendre le cancer" },
          { key: "signes" as const, label: "Signes qui alertent" },
          { key: "autopalpation" as const, label: "Gestes d'autopalpation" },
          { key: "depistage" as const, label: "Dépistage & Examens" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => {
              hapticFeedback(10);
              setActiveTab(key);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === key
                ? "bg-[#A14364] text-white shadow-xs"
                : "text-[#716971] hover:text-[#29252A] hover:bg-[#FAF2F5]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ONGLET 1 : COMPRENDRE */}
      {activeTab === "comprendre" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Liste des leçons */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-[#716971] uppercase tracking-wider px-1">
              Modules d'apprentissage
            </h3>
            {educationalLessons.map((l, idx) => (
              <div
                key={l.id}
                onClick={() => {
                  hapticFeedback(10);
                  setSelectedLessonIndex(idx);
                }}
                className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                  selectedLessonIndex === idx
                    ? "bg-[#F5E8ED] border-[#A14364] text-[#A14364] font-bold"
                    : "bg-white border-[#E9E0E4] text-[#29252A] hover:border-[#A14364]"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-[#716971]">{l.category}</span>
                  <span className="text-[#A14364] font-bold">{l.duration}</span>
                </div>
                <h4 className="text-xs sm:text-sm leading-snug">{l.title}</h4>
              </div>
            ))}
          </div>

          {/* Détail du contenu sélectionné */}
          <CardV2 className="md:col-span-2 space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-[#E9E0E4] pb-3">
              <div>
                <BadgeV2 variant="rose">{lesson.category}</BadgeV2>
                <h3 className="text-base sm:text-lg font-bold text-[#29252A] font-display mt-1.5">
                  {lesson.title}
                </h3>
              </div>
              <button
                onClick={() => handleAudio(getLessonText(lesson))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isSpeaking
                    ? "bg-[#A14364] text-white animate-pulse"
                    : "bg-[#F5E8ED] text-[#A14364] hover:bg-[#ebd5df]"
                }`}
              >
                <Volume2 size={15} />
                <span>{isSpeaking ? "Pause" : "Écouter"}</span>
              </button>
            </div>

            <div className="text-xs sm:text-sm text-[#29252A] leading-relaxed space-y-3">
              <p className="p-3 bg-[#FAF2F5] rounded-2xl italic text-[#716971] border border-[#E9E0E4]">
                « {lesson.summary} »
              </p>
              <p className="whitespace-pre-line">{getLessonText(lesson)}</p>
            </div>

            <div className="pt-3 border-t border-[#E9E0E4] flex items-center justify-between text-xs text-[#716971]">
              <span>Durée estimée : {lesson.duration}</span>
              <span className="text-[#557A63] font-semibold flex items-center gap-1">
                <CheckCircle2 size={13} /> Contenu relu par nos soignants partenaires
              </span>
            </div>
          </CardV2>
        </div>
      )}

      {/* ONGLET 2 : SIGNES QUI ALERTENT */}
      {activeTab === "signes" && (
        <div className="space-y-4">
          <CardV2 className="space-y-3 bg-white">
            <h3 className="text-sm sm:text-base font-bold text-[#29252A] font-display">
              Quels changements doivent vous amener à consulter ?
            </h3>
            <p className="text-xs text-[#716971] leading-relaxed">
              Dans la majorité des cas, une anomalie n'est pas un cancer (les kystes d'eau et fibromes bénins sont fréquents). Cependant, seul un professionnel de santé peut poser un diagnostic sûr. N'attendez jamais d'avoir mal : au début, une anomalie est généralement indolore.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                {
                  title: "Une boule ou un nodule",
                  detail: "Une masse nouvelle dans le sein ou sous l'aisselle qui persiste après la fin des règles.",
                },
                {
                  title: "Un écoulement au mamelon",
                  detail: "Tout liquide spontané, particulièrement s'il est unilatéral, transparent ou teinté de sang.",
                },
                {
                  title: "Une fossette ou rétraction",
                  detail: "La peau qui semble tirée vers l'intérieur, un pli nouveau ou un mamelon qui rentre.",
                },
                {
                  title: "Un aspect de 'peau d'orange'",
                  detail: "Une rougeur qui s'épaissit, une chaleur anormale ou des pores très visibles sur une zone.",
                },
              ].map(({ title, detail }, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-[#FAF2F5] border border-[#E9E0E4] space-y-1"
                >
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#A14364]">
                    <AlertCircle size={15} />
                    <span>{title}</span>
                  </div>
                  <p className="text-xs text-[#716971] leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>
          </CardV2>
        </div>
      )}

      {/* ONGLET 3 : AUTOPALPATION GUIDÉE EN 4 ÉTAPES */}
      {activeTab === "autopalpation" && (
        <div className="space-y-4">
          <CardV2 className="space-y-4">
            <div>
              <BadgeV2 variant="rose">Méthode Validée</BadgeV2>
              <h3 className="text-base sm:text-lg font-bold text-[#29252A] font-display mt-1">
                L'Autopalpation mensuelle en 4 gestes simples
              </h3>
              <p className="text-xs text-[#716971]">
                À pratiquer une fois par mois, idéalement dans les 7 à 10 jours suivant le début des règles, quand la poitrine est souple.
              </p>
            </div>

            {/* Sélecteur des 4 étapes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {selfExamSteps.map((s) => (
                <button
                  key={s.step}
                  onClick={() => {
                    hapticFeedback(10);
                    setSelectedSelfExamStep(s.step);
                  }}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                    selectedSelfExamStep === s.step
                      ? "bg-[#A14364] text-white border-[#A14364] shadow-xs"
                      : "bg-white text-[#29252A] border-[#E9E0E4] hover:border-[#A14364]"
                  }`}
                >
                  <span className="text-[10px] font-bold block opacity-80">
                    Étape {s.step}
                  </span>
                  <span className="text-xs font-bold truncate block">
                    {s.title.split(":")[1] || s.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Affichage détaillé de l'étape sélectionnée */}
            {(() => {
              const currentStepData =
                selfExamSteps.find((s) => s.step === selectedSelfExamStep) ||
                selfExamSteps[0];
              return (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF2F5] border border-[#E9E0E4] space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm sm:text-base font-bold text-[#A14364]">
                      {currentStepData.title}
                    </h4>
                    <span className="text-xs font-bold text-[#716971]">
                      {selectedSelfExamStep} / 4
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#29252A]">
                    {currentStepData.subtitle}
                  </p>
                  <p className="text-xs text-[#716971] leading-relaxed">
                    {currentStepData.description}
                  </p>
                </div>
              );
            })()}
          </CardV2>
        </div>
      )}

      {/* ONGLET 4 : DÉPISTAGE CLINIQUE & EXAMENS */}
      {activeTab === "depistage" && (
        <div className="space-y-4">
          <CardV2 className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-[#29252A] font-display">
              Les examens de dépistage au Burkina Faso
            </h3>
            <p className="text-xs text-[#716971]">
              Repères sur les tarifs réels et la périodicité recommandée.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-[#E9E0E4] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-[#29252A]">
                      Palpation clinique annuelle
                    </h4>
                    <span className="text-[10px] bg-[#EAF2ED] text-[#557A63] font-bold px-2 py-0.5 rounded-full">
                      GRATUIT (0 FCFA)
                    </span>
                  </div>
                  <p className="text-xs text-[#716971] mt-0.5">
                    Réalisée en quelques minutes par une sage-femme ou un médecin dans les CSPS et CMA publics.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#557A63]">Dès 25 ans</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#E9E0E4] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-[#29252A]">
                      Échographie mammaire bilatérale
                    </h4>
                    <span className="text-[10px] bg-[#F5E8ED] text-[#A14364] font-bold px-2 py-0.5 rounded-full">
                      ~6 000 à 7 500 FCFA
                    </span>
                  </div>
                  <p className="text-xs text-[#716971] mt-0.5">
                    Examen totalement indolore avec du gel, idéal pour analyser les tissus denses des jeunes femmes.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#716971]">Sur prescription</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#E9E0E4] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-[#29252A]">
                      Mammographie numérique
                    </h4>
                    <span className="text-[10px] bg-[#F5E8ED] text-[#A14364] font-bold px-2 py-0.5 rounded-full">
                      ~10 000 à 12 000 FCFA
                    </span>
                  </div>
                  <p className="text-xs text-[#716971] mt-0.5">
                    Radiographie à faible dose. Subventionnée à 5 000 FCFA au CMA Schiphra pour les femmes vulnérables via PagLaafi.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#A14364]">Dès 45-50 ans ou antécédent</span>
              </div>
            </div>
          </CardV2>
        </div>
      )}
    </div>
  );
}
