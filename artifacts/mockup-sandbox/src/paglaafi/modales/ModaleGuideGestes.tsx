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
  const { setShowAutopalpationVideoModal, showAutopalpationVideoModal } = useEducation();
  const video = VIDEO_AUTOPALPATION.videoUrl;
  const [vue, setVue] = useState<"video" | "guide">(video ? "video" : "guide");
  const fermer = () => setShowAutopalpationVideoModal(false);

  return (
    <Feuille
      ouverte={showAutopalpationVideoModal}
      onFermer={fermer}
      large
      titre="Guide des 4 gestes"
      sousTitre="Autopalpation, étape par étape"
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
              { id: "video", libelle: "Vidéo" },
              { id: "guide", libelle: "Version légère" },
            ]}
          />
          {vue === "video" ? (
            <video controls preload="none" poster={VIDEO_AUTOPALPATION.affiche} className="w-full rounded-carte bg-nuit">
              <source src={video} />
              {VIDEO_AUTOPALPATION.sousTitres?.map((s) => (
                <track key={s.src} kind="subtitles" src={s.src} srcLang={s.langue} label={s.libelle} />
              ))}
            </video>
          ) : (
            <GuideGestes />
          )}
        </div>
      ) : (
        <GuideGestes />
      )}
    </Feuille>
  );
}
