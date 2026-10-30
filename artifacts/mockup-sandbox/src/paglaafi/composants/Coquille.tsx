import { Route, Switch } from "wouter";
import { useAuth, useCentres } from "../etat/contextes";
import { CHEMINS } from "../routes";
import { BandeauHorsLigne } from "./BandeauHorsLigne";
import { BarreNavigation } from "./BarreNavigation";
import { EcranConsentement } from "./EcranConsentement";
import { EcranDemarrage } from "./EcranDemarrage";
import { PolitiqueConfidentialite } from "./PolitiqueConfidentialite";
import { EnTete } from "./EnTete";
import { MenuLateral } from "./MenuLateral";
import { Toast } from "./Toast";
import { Accompagnant } from "../ecrans/Accompagnant";
import { Accueil } from "../ecrans/Accueil";
import { Annonces } from "../ecrans/Annonces";
import { Centres } from "../ecrans/Centres";
import { Comprendre } from "../ecrans/Comprendre";
import { Cycle } from "../ecrans/Cycle";
import { Dons } from "../ecrans/Dons";
import { EcranConnexion } from "../ecrans/EcranConnexion";
import { FicheCentre } from "../ecrans/FicheCentre";
import { RoseIA } from "../ecrans/RoseIA";
import { EspaceEntrainementDocteur } from "../modales/EspaceEntrainementDocteur";
import { EspaceFichesDocteur } from "../modales/EspaceFichesDocteur";
import { EspaceSuperadmin } from "../modales/EspaceSuperadmin";
import { ModaleAffiche } from "../modales/ModaleAffiche";
import { ModaleConfidentialite } from "../modales/ModaleConfidentialite";
import { ModaleDon } from "../modales/ModaleDon";
import { ModaleInstallationPwa } from "../modales/ModaleInstallationPwa";
import { ModaleMiseAJourCentre } from "../modales/ModaleMiseAJourCentre";
import { ModaleNouvelleAnnonce } from "../modales/ModaleNouvelleAnnonce";
import { ModaleOrientation } from "../modales/ModaleOrientation";
import { ModalePosition } from "../modales/ModalePosition";
import { ModaleGuideGestes } from "../modales/ModaleGuideGestes";
import { ModaleQuizRose } from "../modales/ModaleQuizRose";
import { TableauDeBordAdmin } from "../modales/TableauDeBordAdmin";
import { MODE_REEL } from "../config";

/**
 * Coquille responsive de l'application (mobile d'abord) :
 * - moins de 768 px : en-tête, contenu pleine largeur (marges 16 px), barre du bas ;
 * - 768 à 1023 px : rail vertical à gauche, contenu centré de 720 px maximum (marges 24 px) ;
 * - 1024 px et plus : menu latéral fixe de 264 px, contenu de 1120 px maximum (marges 32 px).
 * La page entière défile ; les modales et espaces professionnels gèrent leur propre visibilité.
 */
export function Coquille() {
  const { currentUser } = useAuth();
  const { selectedCenter } = useCentres();

  return (
    <div className="min-h-dvh bg-fond text-texte">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-bouton focus:bg-surface focus:px-4 focus:py-3 focus:text-action focus:shadow-flottant"
      >
        Aller au contenu
      </a>
      <EcranDemarrage />
      <EcranConsentement />
      <PolitiqueConfidentialite />
      <MenuLateral />

      <div className={currentUser ? "lg:pl-[264px]" : ""}>
        <EnTete />
        <div className={currentUser ? "md:pl-[88px] lg:pl-0" : ""}>
          <BandeauHorsLigne />
          <main
            id="contenu"
            className={`mx-auto w-full px-4 pt-4 md:px-6 md:pt-6 lg:px-8 ${
              currentUser ? "max-w-[720px] pb-[calc(112px+env(safe-area-inset-bottom))] md:pb-10 lg:max-w-[1120px]" : "max-w-[480px] pb-10"
            }`}
          >
            {!currentUser ? (
              <EcranConnexion />
            ) : selectedCenter ? (
              // La fiche d'un centre s'affiche à la place de l'onglet courant
              <FicheCentre />
            ) : (
              <Switch>
                <Route path={CHEMINS.Centres} component={Centres} />
                <Route path={CHEMINS.Calendrier} component={Cycle} />
                <Route path={CHEMINS.Comprendre} component={Comprendre} />
                <Route path={CHEMINS.RoseIA} component={RoseIA} />
                <Route path={CHEMINS.FaireUnDon} component={Dons} />
                <Route path={CHEMINS.Annonces} component={Annonces} />
                <Route path={CHEMINS.Accompagnant} component={Accompagnant} />
                {/* Accueil : "/" et toute adresse inconnue */}
                <Route component={Accueil} />
              </Switch>
            )}
          </main>
        </div>
      </div>

      <BarreNavigation />

      {/* Modales et espaces professionnels (chacun gère sa propre visibilité) */}
      <ModaleNouvelleAnnonce />
      <EspaceSuperadmin />
      <TableauDeBordAdmin />
      <ModaleDon />
      <ModaleMiseAJourCentre />
      <ModaleOrientation />
      <ModaleInstallationPwa />
      <ModaleConfidentialite />
      {/* Mode réel : fiches de connaissance réelles ; démo : parcours d'entraînement simulé */}
      {MODE_REEL ? <EspaceFichesDocteur /> : <EspaceEntrainementDocteur />}
      <ModaleGuideGestes />
      <ModaleQuizRose />
      <ModaleAffiche />
      <ModalePosition />

      <Toast />
    </div>
  );
}
