import { Route, Switch } from "wouter";
import { useAuth, useCentres, useUi } from "../etat/contextes";
import { CHEMINS } from "../routes";
import { BandeauDemo } from "./BandeauDemo";
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
import { ModaleVideoAutopalpation } from "../modales/ModaleVideoAutopalpation";
import { TableauDeBordAdmin } from "../modales/TableauDeBordAdmin";
import { MODE_REEL } from "../config";

// Polices et animations communes à toute l'application
const STYLES_GLOBAUX = `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');
        .ph-display { font-family: 'Fraunces', Georgia, serif; }
        .ph-scroll::-webkit-scrollbar { display:none; }
        .ph-scroll { scrollbar-width:none; }
        @keyframes ph-rise { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .ph-enter { animation: ph-rise .26s ease-out both; }
        @keyframes ph-pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.4); opacity: 0.3; }
        }
        .ph-pulse { animation: ph-pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `;

/**
 * Coquille de l'application : cadre smartphone, en-tête, contenu de l'onglet
 * courant (routage wouter), barre de navigation, modales et notifications.
 */
export function Coquille() {
  const { mainScrollRef } = useUi();
  const { currentUser } = useAuth();
  const { selectedCenter } = useCentres();

  return (
    <main
      className="min-h-screen w-full bg-[#f6ecef] text-[#331c28] antialiased"
      style={{ fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif" }}
    >
      <style>{STYLES_GLOBAUX}</style>

      {/* Cadre smartphone (mobile-first) */}
      <div className="relative mx-auto flex h-[100dvh] w-full max-w-[440px] flex-col overflow-hidden bg-[#fffbfa] shadow-[0_28px_80px_rgba(93,39,61,.18)] sm:h-[min(900px,96dvh)] sm:rounded-[36px] sm:border sm:border-white/90">
        <EcranDemarrage />
        <EcranConsentement />
        <PolitiqueConfidentialite />
        <MenuLateral />
        <EnTete />
        <BandeauDemo />
        <BandeauHorsLigne />

        {/* Contenu principal : connexion si aucun profil, sinon l'onglet courant */}
        <div ref={mainScrollRef} className="ph-scroll flex-1 overflow-y-auto pb-10">
          {!currentUser ? (
            <EcranConnexion />
          ) : selectedCenter ? (
            // La fiche d'un centre s'affiche par-dessus l'onglet courant
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
        <ModaleVideoAutopalpation />
        <ModaleAffiche />

        <Toast />
      </div>
    </main>
  );
}
