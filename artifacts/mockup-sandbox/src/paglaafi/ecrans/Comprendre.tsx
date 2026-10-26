import {
  BookOpen,
  Headphones,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { lessons } from "../donnees/lecons";
import { useUi, useAudio, useEducation } from "../etat/contextes";

/**
 * Onglet Comprendre : leçons en 4 langues et démonstration d'autopalpation.
 */
export function Comprendre() {
  const { section } = useUi();
  const { audioProgress, handlePlayAudio, isPlaying, setAudioProgress, setIsPlaying, setSpeechLanguage, speechLanguage } = useAudio();
  const { activeLesson, setActiveLesson, setShowAutopalpationVideoModal } = useEducation();

  return (
    <section className="ph-enter px-5 pt-4">
      <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
        Guide vocal & écrit en 4 langues
      </span>
      <h1 className="ph-display text-[26px] leading-tight text-[#580e36]">
        Comprendre, pas à pas
      </h1>
      <p className="mt-1 text-xs text-[#795f6d]">
        Des repères simples pour s'informer sans jargon, avec écoute vocale en Français, English, Mooré ou Dioula.
      </p>

      {/* Lecteur Audio Multi-Langues Interactif */}
      <div className="mt-3.5 overflow-hidden rounded-[26px] bg-[#734059] p-4 text-white shadow-md">
        <div className="flex items-center justify-between text-[10px] text-white/75">
          <span className="inline-flex items-center gap-1 font-bold uppercase tracking-wider">
            <Headphones size={13} /> Lecteur Audio PagLaafi
          </span>
          <div className="flex rounded-full bg-white/15 p-0.5">
            <button
              onClick={() => setSpeechLanguage("fr")}
              className={`rounded-full px-2 py-0.5 font-bold transition ${speechLanguage === "fr" ? "bg-white text-[#734059]" : "text-white/80"}`}
            >
              FR
            </button>
            <button
              onClick={() => setSpeechLanguage("en")}
              className={`rounded-full px-2 py-0.5 font-bold transition ${speechLanguage === "en" ? "bg-white text-[#734059]" : "text-white/80"}`}
            >
              EN
            </button>
            <button
              onClick={() => setSpeechLanguage("moore")}
              className={`rounded-full px-2 py-0.5 font-bold transition ${speechLanguage === "moore" ? "bg-white text-[#734059]" : "text-white/80"}`}
            >
              Mooré
            </button>
            <button
              onClick={() => setSpeechLanguage("dioula")}
              className={`rounded-full px-2 py-0.5 font-bold transition ${speechLanguage === "dioula" ? "bg-white text-[#734059]" : "text-white/80"}`}
            >
              Dioula
            </button>
          </div>
        </div>

        <h2 className="ph-display mt-2.5 text-lg leading-snug">
          {lessons[activeLesson].title}
        </h2>

        <p className="mt-1.5 text-xs text-white/85 leading-relaxed">
          {speechLanguage === "en"
            ? lessons[activeLesson].englishSummary
            : speechLanguage === "moore"
              ? lessons[activeLesson].mooreSummary
              : speechLanguage === "dioula"
                ? lessons[activeLesson].dioulaSummary
                : lessons[activeLesson].summary}
        </p>

        {/* Progression Audio */}
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-[#f6c2d1] transition-all duration-300"
              style={{ width: `${audioProgress}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[9px] text-white/70">
            <span>{isPlaying ? `Lecture en cours (${speechLanguage.toUpperCase()})...` : "Prêt à écouter"}</span>
            <span>{lessons[activeLesson].duration}</span>
          </div>
        </div>

        {/* Contrôles du Lecteur */}
        <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-2.5">
          <button
            onClick={() => {
              if ("speechSynthesis" in window) window.speechSynthesis.cancel();
              setIsPlaying(false);
              setAudioProgress(0);
            }}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            title="Réinitialiser"
          >
            <RotateCcw size={15} />
          </button>

          <button
            onClick={() => {
              const text =
                speechLanguage === "en"
                  ? lessons[activeLesson].englishFullText
                  : speechLanguage === "moore"
                    ? lessons[activeLesson].mooreSummary
                    : speechLanguage === "dioula"
                      ? lessons[activeLesson].dioulaSummary
                      : lessons[activeLesson].fullText;
              handlePlayAudio(text, speechLanguage);
            }}
            className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#734059] shadow hover:bg-white/90"
          >
            {isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
            <span>{isPlaying ? "Pause" : `Écouter en ${speechLanguage === "fr" ? "Français" : speechLanguage === "en" ? "English" : speechLanguage === "moore" ? "Mooré" : "Dioula"}`}</span>
          </button>

          <span className="text-[10px] font-semibold text-white/80">
            {speechLanguage.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Texte intégral */}
      <div className="mt-3 rounded-2xl border border-[#eedde2] bg-white p-3.5 text-xs text-[#5b3c4c] leading-relaxed">
        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#ea2d6d] mb-1">
          Explication médicale détaillée ({speechLanguage === "en" ? "English" : "Français"}) :
        </span>
        {speechLanguage === "en" ? lessons[activeLesson].englishFullText : lessons[activeLesson].fullText}
      </div>

      {/* ENCADRÉ VIDÉO GUIDÉE D'AUTOPALPATION (PERSONNAGE AFRICAIN) */}
      <div className="mt-3 overflow-hidden rounded-2xl border border-pink-200 bg-gradient-to-r from-rose-50 via-white to-pink-50 p-3.5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0 overflow-hidden rounded-xl border border-pink-200 shadow-xs w-20 aspect-[16/9]">
            <img
              src="/images/autopalpation-afrique-demo.jpg"
              alt="Vidéo démonstrative autopalpation"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Play size={14} className="fill-white text-white" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#ea2d6d]">
              Démonstration Guidée (2:45 min)
            </span>
            <h3 className="ph-display text-xs font-bold text-[#580e36] leading-tight">
              Vidéo des 4 gestes d'autopalpation
            </h3>
            <p className="text-[10px] text-[#745362] line-clamp-1">
              Avec une soignante africaine en Français, Mooré et Dioula.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowAutopalpationVideoModal(true)}
          className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ea2d6d] to-rose-700 py-2 text-xs font-bold text-white shadow-xs hover:opacity-95 transition"
        >
          <Play size={14} className="fill-white" />
          <span>Regarder la vidéo démonstrative 🎬</span>
        </button>
      </div>

      {/* Liste des autres leçons */}
      <div className="mt-4 space-y-2">
        {lessons.map((lesson, idx) => (
          <button
            key={lesson.id}
            onClick={() => {
              setActiveLesson(idx);
              if (isPlaying) {
                const text =
                  speechLanguage === "en"
                    ? lesson.englishFullText
                    : speechLanguage === "moore"
                      ? lesson.mooreSummary
                      : speechLanguage === "dioula"
                        ? lesson.dioulaSummary
                        : lesson.fullText;
                handlePlayAudio(text, speechLanguage);
              }
            }}
            className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${activeLesson === idx ? "border-[#cf869f] bg-[#fbf0f4]" : "border-[#f0dfe4] bg-white"}`}
          >
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${activeLesson === idx ? "bg-[#ea2d6d] text-white" : "bg-[#f9e9ed] text-[#ea2d6d]"}`}>
              <BookOpen size={16} />
            </span>
            <div className="flex-1 min-w-0">
              <span className="block text-xs font-bold text-[#4c2d3c]">{lesson.title}</span>
              <span className="text-[10px] text-[#8e6e7c]">{lesson.category} · {lesson.duration}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
