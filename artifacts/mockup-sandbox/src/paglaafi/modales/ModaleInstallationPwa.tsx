import { Check, Download } from "lucide-react";
import { useUi } from "../etat/contextes";
import { Bouton, Carte, Feuille } from "../composants/ui";

/** Installer l'application : avantages et étapes pour Android et iPhone. */
export function ModaleInstallationPwa() {
  const { deferredPrompt, handleTriggerInstall, setShowPwaInstallModal, showPwaInstallModal } = useUi();
  const fermer = () => setShowPwaInstallModal(false);

  return (
    <Feuille
      ouverte={showPwaInstallModal}
      onFermer={fermer}
      titre="Installer PagLaafi"
      sousTitre="Sur l'écran d'accueil de votre téléphone"
      pied={
        deferredPrompt ? (
          <Bouton taille="grand" pleineLargeur icone={<Download size={20} aria-hidden />} onClick={handleTriggerInstall}>
            Installer maintenant
          </Bouton>
        ) : (
          <Bouton taille="grand" pleineLargeur onClick={fermer}>
            J'ai compris
          </Bouton>
        )
      }
    >
      <div className="space-y-4">
        <ul className="space-y-2">
          {[
            ["Accès hors-ligne", "aux pages et aux centres déjà consultés"],
            ["Plein écran", "sans barre d'adresse de navigateur"],
            ["Vos données", "de cycle et d'autopalpation conservées sur l'appareil"],
          ].map(([titre, texte]) => (
            <li key={titre} className="flex items-start gap-2 text-corps text-texte">
              <Check size={20} aria-hidden className="mt-0.5 shrink-0 text-succes" />
              <span>
                <strong>{titre}</strong> {texte}
              </span>
            </li>
          ))}
        </ul>
        <Carte douce>
          <h3 className="text-corps font-semibold text-prune-900">Sur Android (Chrome, Samsung)</h3>
          <p className="mt-1 text-petit text-texte">
            Si le bouton « Installer maintenant » n'apparaît pas, ouvrez le menu (⋮) en haut à droite du navigateur puis choisissez « Installer
            l'application » ou « Ajouter à l'écran d'accueil ».
          </p>
        </Carte>
        <Carte douce>
          <h3 className="text-corps font-semibold text-prune-900">Sur iPhone ou iPad (Safari)</h3>
          <ol className="mt-1 list-decimal space-y-1 pl-5 text-petit text-texte">
            <li>Touchez le bouton Partager (carré avec une flèche, en bas de l'écran).</li>
            <li>Faites défiler et touchez « Sur l'écran d'accueil ».</li>
            <li>Validez avec « Ajouter ».</li>
          </ol>
        </Carte>
      </div>
    </Feuille>
  );
}
