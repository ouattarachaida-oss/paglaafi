import { Pause, Play, Volume2 } from "lucide-react";
import { useAudio, useEducation } from "../etat/contextes";
import { BadgeSimulation } from "../composants/BadgeSimulation";
import { Bouton, Feuille, LIBELLES_LANGUES } from "../composants/ui";

// Textes audio de présentation (français, mooré et dioula inchangés)
const PRESENTATION = {
  moore: "M maaso, ges-y zĩig ninga ninsaal sẽn tõe n kẽes a nug n bãng a yĩnsa laafi ne zãmsgã.",
  dioula: "N muso, i sin lajɛ saniya kɛ dɔgɔtɔrɔmusow ka cogo la.",
  fr: "Observez et palpez avec délicatesse chaque mois après vos règles. Suivez les 4 gestes démontrés par notre sage-femme.",
};
const EXPLICATION = {
  moore: "M maaso, ges-y zĩig ninga ninsaal sẽn tõe n kẽes a nug n bãng a yĩnsa laafi.",
  dioula: "N muso, i sin lajɛ saniya kɛ dɔgɔtɔrɔmusow ka cogo la.",
  fr: "Voici l'explication audio détaillée des gestes d'autopalpation par notre soignante.",
};

// Les 4 gestes (textes inchangés)
const GESTES = [
  {
    step: 1,
    label: "Regarder",
    tag: "Miroir",
    time: 0,
    titre: "Étape 1 : Inspection visuelle devant le miroir",
    texte:
      "Debout devant votre miroir, bras le long du corps puis levés au-dessus de la tête. Observez l'aspect général des deux seins : peau d'orange, rougeur, fossette ou mamelon qui se rétracte vers l'intérieur.",
  },
  {
    step: 2,
    label: "Palper",
    tag: "3 doigts",
    time: 35,
    titre: "Étape 2 : Palpation douce avec la pulpe de 3 doigts",
    texte:
      "Allongée confortablement ou sous la douche (avec du savon doux). Utilisez la pulpe des 3 doigts du milieu (index, majeur, annulaire) à plat. Décrivez de petits cercles réguliers du pourtour extérieur vers le mamelon.",
  },
  {
    step: 3,
    label: "Aisselle",
    tag: "Zone large",
    time: 75,
    titre: "Étape 3 : Couvrir toute la zone jusqu'aux aisselles",
    texte:
      "Le tissu mammaire s'étend jusqu'au creux de l'aisselle et sous la clavicule. Palpez soigneusement cette zone pour vérifier l'absence de ganglion dur ou de nodule profond.",
  },
  {
    step: 4,
    label: "Mamelon",
    tag: "Pression",
    time: 115,
    titre: "Étape 4 : Vérification du mamelon sans douleur",
    texte:
      "Pincez très délicatement le mamelon entre le pouce et l'index. Vérifiez qu'aucun liquide (clair, jaunâtre ou sanglant) ne s'écoule spontanément.",
  },
] as const;
const DUREE = 165;

/** Démonstration guidée d'autopalpation (images animées : badge Simulation). */
export function ModaleVideoAutopalpation() {
  const { handlePlayAudio } = useAudio();
  const {
    formatVideoTime,
    selectedVideoStep,
    setSelectedVideoStep,
    setShowAutopalpationVideoModal,
    setVideoIsPlaying,
    setVideoLang,
    setVideoProgressSeconds,
    setVideoSpeed,
    showAutopalpationVideoModal,
    videoIsPlaying,
    videoLang,
    videoProgressSeconds,
    videoSpeed,
  } = useEducation();
  const fermer = () => setShowAutopalpationVideoModal(false);
  const geste = GESTES.find((g) => g.step === selectedVideoStep) ?? GESTES[0];

  return (
    <Feuille
      ouverte={showAutopalpationVideoModal}
      onFermer={fermer}
      large
      titre="Vidéo d'autopalpation"
      enTete={<BadgeSimulation detail="Démonstration par images animées : la vidéo réelle reste à produire et à valider." />}
      pied={
        <Bouton pleineLargeur onClick={fermer}>
          J'ai compris les gestes
        </Bouton>
      }
    >
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-carte bg-nuit">
          <img src="/images/autopalpation-afrique-demo.webp" alt="Illustration de la démonstration d'autopalpation" className="aspect-video w-full object-cover" width={720} height={405} />
          <button
            type="button"
            onClick={() => setVideoIsPlaying(!videoIsPlaying)}
            aria-label={videoIsPlaying ? "Mettre la démonstration en pause" : "Lancer la démonstration"}
            className="absolute inset-0 grid place-items-center bg-[#2b1420]/30"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-action text-sur-action shadow-flottant">
              {videoIsPlaying ? <Pause size={28} fill="currentColor" aria-hidden /> : <Play size={28} fill="currentColor" aria-hidden className="ml-1" />}
            </span>
          </button>
        </div>

        {/* Progression, vitesse et langue */}
        <div className="flex items-center gap-3">
          <span className="w-12 shrink-0 font-mono text-petit text-texte">{formatVideoTime(videoProgressSeconds)}</span>
          <input
            type="range"
            min={0}
            max={DUREE}
            value={Math.round(videoProgressSeconds)}
            onChange={(e) => {
              setVideoProgressSeconds(Number(e.target.value));
              setVideoIsPlaying(true);
            }}
            aria-label="Position dans la démonstration"
            className="h-11 min-w-0 flex-1 accent-[var(--pl-action)]"
          />
          <span className="w-12 shrink-0 text-right font-mono text-petit text-texte-2">02:45</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="group" aria-label="Vitesse de lecture" className="flex gap-1">
            {([1, 1.5, 2] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={videoSpeed === v}
                onClick={() => {
                  setVideoSpeed(v);
                  setVideoIsPlaying(true);
                }}
                className={`min-h-11 min-w-11 rounded-full px-3 text-petit font-semibold ${videoSpeed === v ? "bg-carte-prune text-white" : "border border-bordure text-texte"}`}
              >
                {v}x
              </button>
            ))}
          </div>
          <div role="group" aria-label="Langue de l'audio" className="flex gap-1">
            {(["fr", "moore", "dioula"] as const).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={videoLang === l}
                onClick={() => {
                  setVideoLang(l);
                  handlePlayAudio(PRESENTATION[l], l);
                }}
                className={`min-h-11 rounded-full px-3 text-petit font-semibold ${videoLang === l ? "bg-carte-prune text-white" : "border border-bordure text-texte"}`}
              >
                {LIBELLES_LANGUES[l]}
              </button>
            ))}
          </div>
        </div>

        {/* Les 4 gestes */}
        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-corps font-semibold text-prune-900">Les 4 gestes, pas à pas</h3>
            <Bouton variante="discret" onClick={() => handlePlayAudio(EXPLICATION[videoLang], videoLang)}>
              <Volume2 size={18} aria-hidden /> Écouter l'explication
            </Bouton>
          </div>
          <div className="grid grid-cols-2 gap-2 min-[480px]:grid-cols-4">
            {GESTES.map((g) => (
              <button
                key={g.step}
                type="button"
                aria-pressed={selectedVideoStep === g.step}
                onClick={() => {
                  setSelectedVideoStep(g.step as typeof selectedVideoStep);
                  setVideoProgressSeconds(g.time);
                  setVideoIsPlaying(true);
                }}
                className={`min-h-14 rounded-bouton px-2 py-2 text-center ${selectedVideoStep === g.step ? "bg-carte-prune text-white" : "border border-bordure bg-surface text-texte"}`}
              >
                <span className="block text-petit font-semibold">
                  {g.step}. {g.label}
                </span>
                <span className="block text-petit opacity-80">{g.tag}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-carte bg-surface-2 p-4">
            <p className="text-corps font-semibold text-prune-900">{geste.titre}</p>
            <p className="mt-1 text-corps text-texte">{geste.texte}</p>
          </div>
        </div>
      </div>
    </Feuille>
  );
}
