import { Pause, Play, Volume2, X } from "lucide-react";
import { useAudio, useEducation } from "../etat/contextes";

/**
 * Démonstration guidée d'autopalpation.
 */
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

  if (!showAutopalpationVideoModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-md sm:absolute sm:rounded-[36px]"
      onClick={() => setShowAutopalpationVideoModal(false)}
    >
      <div
        className="ph-enter max-h-[94vh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-4 shadow-2xl border-2 border-pink-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête du lecteur vidéo */}
        <div className="flex items-center justify-between border-b border-[#f2e1e7] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-rose-100 text-[#ea2d6d]">
              <Play size={16} className="fill-[#ea2d6d] translate-x-0.5" />
            </div>
            <div>
              <h3 className="ph-display text-sm font-bold text-[#580e36]">Vidéo Guidée d'Autopalpation</h3>
              <p className="text-[10px] text-emerald-700 font-bold">
                Démonstration Pédagogique & Pudique · Sage-femme Africaine
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAutopalpationVideoModal(false)}
            className="rounded-full p-1 text-[#725261] hover:bg-[#faedf2]"
          >
            <X size={18} />
          </button>
        </div>

        {/* ÉCRAN VIDÉO INTERACTIF AVEC PERSONNAGE AFRICAIN */}
        <div className="relative mt-3 overflow-hidden rounded-2xl bg-black shadow-md border border-slate-800 group">
          <img
            src="/images/autopalpation-afrique-demo.jpg"
            alt="Démonstration autopalpation sage-femme africaine"
            className="aspect-[16/9] w-full object-cover opacity-95"
          />

          {/* Badge en direct */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[9.5px] font-bold text-white backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Vidéo Démo Burkina · 4 gestes clés</span>
          </div>

          {/* Sélecteur de langue audio pour la vidéo */}
          <div className="absolute top-2.5 right-2.5 flex rounded-full bg-black/60 p-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
            {(["fr", "moore", "dioula"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setVideoLang(lang);
                  const txt =
                    lang === "moore"
                      ? "M maaso, ges-y zĩig ninga ninsaal sẽn tõe n kẽes a nug n bãng a yĩnsa laafi ne zãmsgã."
                      : lang === "dioula"
                        ? "N muso, i sin lajɛ saniya kɛ dɔgɔtɔrɔmusow ka cogo la."
                        : "Observez et palpez avec délicatesse chaque mois après vos règles. Suivez les 4 gestes démontrés par notre sage-femme.";
                  handlePlayAudio(txt, lang);
                }}
                className={`rounded-full px-2 py-0.5 transition ${
                  videoLang === lang ? "bg-[#ea2d6d] text-white" : "text-white/75 hover:text-white"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Bouton Play/Pause central sur la vidéo avec feedback instantané */}
          <button
            type="button"
            onClick={() => setVideoIsPlaying(!videoIsPlaying)}
            className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/35 transition"
            aria-label={videoIsPlaying ? "Mettre la vidéo en pause" : "Lancer la démonstration vidéo"}
          >
            <div className="grid h-14 w-14 place-items-center rounded-full bg-[#ea2d6d]/95 text-white shadow-xl hover:scale-105 active:scale-95 transition">
              {videoIsPlaying ? (
                <Pause size={24} className="fill-white" />
              ) : (
                <Play size={24} className="fill-white translate-x-0.5" />
              )}
            </div>
          </button>

          {/* Barre de contrôles vidéo en bas : Progression continue et accélérateur */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2.5 text-white">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-emerald-400 min-w-[36px]">
                {formatVideoTime(videoProgressSeconds)}
              </span>
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickPos = (e.clientX - rect.left) / rect.width;
                  const newTime = Math.max(0, Math.min(165, clickPos * 165));
                  setVideoProgressSeconds(newTime);
                  setVideoIsPlaying(true);
                }}
                className="relative h-2 flex-1 rounded-full bg-white/30 overflow-hidden cursor-pointer"
                title="Cliquer pour naviguer dans la vidéo"
              >
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-[#ea2d6d] rounded-full transition-all duration-150"
                  style={{ width: `${Math.min(100, (videoProgressSeconds / 165) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-white/70">02:45</span>

              {/* Sélecteur de vitesse pour jouer plus rapidement */}
              <div className="flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-bold border border-white/20">
                {([1, 1.5, 2] as const).map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoSpeed(spd);
                      setVideoIsPlaying(true);
                    }}
                    className={`rounded px-1.5 py-0.5 transition ${
                      videoSpeed === spd ? "bg-[#ea2d6d] text-white font-extrabold" : "text-white/75 hover:text-white"
                    }`}
                    title={`Vitesse de lecture x${spd}`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SÉLECTEUR INTERACTIF DES 4 GESTES : SAUT TEMPOREL INSTANTANÉ */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#7a4c60]">
              Les 4 temps expliqués pas à pas :
            </p>
            <button
              type="button"
              onClick={() => {
                const txt =
                  videoLang === "moore"
                    ? "M maaso, ges-y zĩig ninga ninsaal sẽn tõe n kẽes a nug n bãng a yĩnsa laafi."
                    : videoLang === "dioula"
                      ? "N muso, i sin lajɛ saniya kɛ dɔgɔtɔrɔmusow ka cogo la."
                      : "Voici l'explication audio détaillée des gestes d'autopalpation par notre soignante.";
                handlePlayAudio(txt, videoLang);
              }}
              className="flex items-center gap-1 text-[10px] font-bold text-[#ea2d6d] hover:underline"
            >
              <Volume2 size={12} /> Écouter la sage-femme ({videoLang.toUpperCase()})
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1">
            {[
              { step: 1, label: "1. Regarder", tag: "Miroir", time: 0 },
              { step: 2, label: "2. Palper", tag: "3 doigts", time: 35 },
              { step: 3, label: "3. Aisselle", tag: "Zone large", time: 75 },
              { step: 4, label: "4. Mamelon", tag: "Pression", time: 115 },
            ].map((item) => (
              <button
                key={item.step}
                type="button"
                onClick={() => {
                  setSelectedVideoStep(item.step as any);
                  setVideoProgressSeconds(item.time);
                  setVideoIsPlaying(true);
                }}
                className={`rounded-xl p-1.5 text-center transition border ${
                  selectedVideoStep === item.step
                    ? "bg-[#ea2d6d] text-white border-[#ea2d6d] shadow-xs scale-[1.02]"
                    : "bg-slate-50 text-[#543343] border-slate-200 hover:bg-pink-50"
                }`}
              >
                <span className="block font-bold text-[10.5px]">{item.label}</span>
                <span className="block text-[8.5px] opacity-80">{item.tag}</span>
              </button>
            ))}
          </div>

          {/* Explication du geste sélectionné */}
          <div className="rounded-2xl border border-pink-200 bg-[#fffbfc] p-3 text-xs text-[#580e36] space-y-1.5 shadow-2xs">
            {selectedVideoStep === 1 && (
              <>
                <div className="flex items-center justify-between font-bold text-[#ea2d6d]">
                  <span>Étape 1 : Inspection visuelle devant le miroir</span>
                  <span className="text-[9px] bg-pink-100 px-2 py-0.5 rounded-full font-bold">LOOK</span>
                </div>
                <p className="text-[11px] text-[#6d4f5e] leading-relaxed">
                  Debout devant votre miroir, bras le long du corps puis levés au-dessus de la tête. Observez l'aspect
                  général des deux seins : peau d'orange, rougeur, fossette ou mamelon qui se rétracte vers l'intérieur.
                </p>
              </>
            )}
            {selectedVideoStep === 2 && (
              <>
                <div className="flex items-center justify-between font-bold text-[#ea2d6d]">
                  <span>Étape 2 : Palpation douce avec la pulpe de 3 doigts</span>
                  <span className="text-[9px] bg-pink-100 px-2 py-0.5 rounded-full font-bold">FEEL</span>
                </div>
                <p className="text-[11px] text-[#6d4f5e] leading-relaxed">
                  Allongée confortablement ou sous la douche (avec du savon doux). Utilisez la pulpe des 3 doigts du
                  milieu (index, majeur, annulaire) à plat. Décrivez de petits cercles réguliers du pourtour extérieur
                  vers le mamelon.
                </p>
              </>
            )}
            {selectedVideoStep === 3 && (
              <>
                <div className="flex items-center justify-between font-bold text-[#ea2d6d]">
                  <span>Étape 3 : Couvrir toute la zone jusqu'aux aisselles</span>
                  <span className="text-[9px] bg-pink-100 px-2 py-0.5 rounded-full font-bold">COVER ALL</span>
                </div>
                <p className="text-[11px] text-[#6d4f5e] leading-relaxed">
                  Le tissu mammaire s'étend jusqu'au creux de l'aisselle et sous la clavicule. Palpez soigneusement
                  cette zone pour vérifier l'absence de ganglion dur ou de nodule profond.
                </p>
              </>
            )}
            {selectedVideoStep === 4 && (
              <>
                <div className="flex items-center justify-between font-bold text-[#ea2d6d]">
                  <span>Étape 4 : Vérification du mamelon sans douleur</span>
                  <span className="text-[9px] bg-pink-100 px-2 py-0.5 rounded-full font-bold">NIPPLE CHECK</span>
                </div>
                <p className="text-[11px] text-[#6d4f5e] leading-relaxed">
                  Pincez très délicatement le mamelon entre le pouce et l'index. Vérifiez qu'aucun liquide (clair,
                  jaunâtre ou sanglant) ne s'écoule spontanément.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Bouton de confirmation & fermeture */}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setShowAutopalpationVideoModal(false)}
            className="flex-1 rounded-2xl bg-gradient-to-r from-[#ea2d6d] to-[#734059] py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition"
          >
            J'ai compris les gestes ✓
          </button>
        </div>
      </div>
    </div>
  );
}
