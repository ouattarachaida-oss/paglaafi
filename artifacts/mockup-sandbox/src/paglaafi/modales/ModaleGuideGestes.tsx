import { useState } from "react";
import { useEducation } from "../etat/contextes";
import { VIDEO_AUTOPALPATION } from "../donnees/guideGestes";
import { GuideGestes } from "../composants/GuideGestes";
import { Bouton, Feuille, OngletsSegmentes } from "../composants/ui";

/**
 * Guide des 4 gestes d'autopalpation. Si une vraie vidéo validée est renseignée
 * (donnees/guideGestes.ts), elle est proposée avec le guide en « Version légère » ;
 * sinon aucun lecteur vidéo n'est affiché.
 */
export function ModaleGuideGestes() {
  const { setShowAutopalpationVideoModal, showAutopalpationVideoModal, guideGestesVue, setGuideGestesVue } = useEducation();
  const video = VIDEO_AUTOPALPATION.videoUrl;
  const vue = guideGestesVue;
  const setVue = setGuideGestesVue;
  const fermer = () => setShowAutopalpationVideoModal(false);

  return (
    <Feuille
      ouverte={showAutopalpationVideoModal}
      onFermer={fermer}
      large
      titre="Guide des gestes & Vidéo"
      sousTitre="Autopalpation et dépistage pas-à-pas"
      pied={
        <Bouton pleineLargeur onClick={fermer}>
          J'ai compris les gestes
        </Bouton>
      }
    >
      {video ? (
        <div className="space-y-4">
          <OngletsSegmentes<"video" | "guide">
            libelle="Format"
            valeur={vue}
            onChange={setVue}
            onglets={[
              { id: "guide", libelle: "Les 4 gestes (Illustrés)" },
              { id: "video", libelle: "Vidéo explicative" },
            ]}
          />
          {vue === "video" ? (
            <div className="space-y-3">
              <div className="relative aspect-video w-full overflow-hidden rounded-carte bg-nuit shadow-md">
                {VIDEO_AUTOPALPATION.youtubeId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${VIDEO_AUTOPALPATION.youtubeId}?rel=0&modestbranding=1`}
                    title={VIDEO_AUTOPALPATION.titre || "Vidéo d'autopalpation et dépistage du sein"}
                    className="absolute inset-0 h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <video controls preload="none" poster={VIDEO_AUTOPALPATION.affiche} className="h-full w-full object-cover">
                    <source src={video} />
                  </video>
                )}
              </div>
              <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-left">
                <h4 className="text-petit font-bold text-prune-900">{VIDEO_AUTOPALPATION.titre}</h4>
                <p className="mt-1 text-tres-petit text-texte">
                  {VIDEO_AUTOPALPATION.description ||
                    "Examen radiologique de dépistage, palpation préventive et démonstration des gestes qui sauvent."}
                </p>
                <div className="mt-2.5 flex items-center justify-between text-tres-petit text-texte-2">
                  <span>Qualité adaptative automatique (économise les données)</span>
                  <button
                    type="button"
                    onClick={() => setVue("guide")}
                    className="font-semibold text-action underline underline-offset-2"
                  >
                    Revoir les gestes illustrés
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <GuideGestes onVoirVideo={() => setVue("video")} />
          )}
        </div>
      ) : (
        <GuideGestes onVoirVideo={() => setVue("video")} />
      )}
    </Feuille>
  );
}
