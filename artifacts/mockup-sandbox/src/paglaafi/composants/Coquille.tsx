import { EcranDemarrage } from "./EcranDemarrage";
import { MenuLateral } from "./MenuLateral";
import { EnTete } from "./EnTete";
import { BandeauHorsLigne } from "./BandeauHorsLigne";
import { BarreNavigation } from "./BarreNavigation";
import { Toast } from "./Toast";
import { EcranConnexion } from "../ecrans/EcranConnexion";
import { Accueil } from "../ecrans/Accueil";
import { Centres } from "../ecrans/Centres";
import { Cycle } from "../ecrans/Cycle";
import { Comprendre } from "../ecrans/Comprendre";
import { RoseIA } from "../ecrans/RoseIA";
import { Dons } from "../ecrans/Dons";
import { Annonces } from "../ecrans/Annonces";
import { Accompagnant } from "../ecrans/Accompagnant";
import { FicheCentre } from "../ecrans/FicheCentre";
import { ModaleNouvelleAnnonce } from "../modales/ModaleNouvelleAnnonce";
import { EspaceSuperadmin } from "../modales/EspaceSuperadmin";
import { TableauDeBordAdmin } from "../modales/TableauDeBordAdmin";
import { ModaleDon } from "../modales/ModaleDon";
import { ModaleMiseAJourCentre } from "../modales/ModaleMiseAJourCentre";
import { ModaleOrientation } from "../modales/ModaleOrientation";
import { ModaleInstallationPwa } from "../modales/ModaleInstallationPwa";
import { ModaleConfidentialite } from "../modales/ModaleConfidentialite";
import { EspaceEntrainementDocteur } from "../modales/EspaceEntrainementDocteur";
import { ModaleVideoAutopalpation } from "../modales/ModaleVideoAutopalpation";
import { ModaleAffiche } from "../modales/ModaleAffiche";
import { useUi, useAuth, useCentres } from "../etat/contextes";

/**
 * Coquille de l'application : cadre smartphone, en-tête, contenu des onglets,
 * barre de navigation, modales et notifications.
 */
export function Coquille() {
  const { mainScrollRef, section } = useUi();
  const { currentUser } = useAuth();
  const { selectedCenter } = useCentres();

  return (
    <main
      className="min-h-screen w-full bg-[#f6ecef] text-[#331c28] antialiased"
      style={{ fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif" }}
    >
      <style>{`
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
      `}</style>

      {/* Cadre Smartphone Mobile-First */}
      <div className="relative mx-auto flex h-[100dvh] w-full max-w-[440px] flex-col overflow-hidden bg-[#fffbfa] shadow-[0_28px_80px_rgba(93,39,61,.18)] sm:h-[min(900px,96dvh)] sm:rounded-[36px] sm:border sm:border-white/90">

        {/* ==================================================================== */}
        {/* ÉCRAN DE DÉMARRAGE (SPLASH SCREEN) : LOGO & POWERED BY ROSE IA       */}
        {/* ==================================================================== */}
        {/* ==================================================================== */}
        {/* ÉCRAN DE DÉMARRAGE (SPLASH SCREEN) : 5 SECONDES                     */}
        {/* ==================================================================== */}
        <EcranDemarrage />

        {/* ==================================================================== */}
        {/* BARRE LATÉRALE (SIDEBAR)                                             */}
        {/* ==================================================================== */}
        <MenuLateral />

        {/* ==================================================================== */}
        {/* EN-TÊTE FIXE DU SMARTPHONE AVEC DÉCONNEXION DIRECTE SUR L'ICÔNE      */}
        {/* ==================================================================== */}
        <EnTete />

        {/* ==================================================================== */}
        {/* BANDEAU MODE HORS-LIGNE (PWA & OFFLINE)                              */}
        {/* ==================================================================== */}
        <BandeauHorsLigne />

        {/* ==================================================================== */}
        {/* CONTENU PRINCIPAL DES ONGLETS                                        */}
        {/* ==================================================================== */}
        <div ref={mainScrollRef} className="ph-scroll flex-1 overflow-y-auto pb-10">

          {/* ================================================================== */}
          {/* PAGE GÉNÉRALE DE CONNEXION & INSCRIPTION (SI NON CONNECTÉ)        */}
          {/* ================================================================== */}
          {!currentUser ? (
            <EcranConnexion />
          ) : (
            <>
              {/* ------------------------------------------------------------------ */}
              {/* ONGLET 1 : ACCUEIL                                                 */}
              {/* ------------------------------------------------------------------ */}
              {section === "Accueil" && !selectedCenter && <Accueil />}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 2 : CARTE DES SOINS (OPENSTREETMAP LEAFLET)                 */}
          {/* ------------------------------------------------------------------ */}
          {section === "Centres" && !selectedCenter && <Centres />}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET : CALENDRIER, RÈGLES, AUTOPALPATION & RAPPELS               */}
          {/* ------------------------------------------------------------------ */}
          {section === "Calendrier" && !selectedCenter && <Cycle />}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 3 : COMPRENDRE (FRANÇAIS, ENGLISH, MOORÉ & DIOULA)          */}
          {/* ------------------------------------------------------------------ */}
          {section === "Comprendre" && !selectedCenter && <Comprendre />}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 4 : ROSE IA (ASSISTANTE VOCALE DISPONIBLE)                   */}
          {/* ------------------------------------------------------------------ */}
          {/* ------------------------------------------------------------------ */}
          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 4 : ROSE IA (ASSISTANTE CONVERSATIONNELLE & ÉTHIQUE)        */}
          {/* ------------------------------------------------------------------ */}
          {section === "RoseIA" && !selectedCenter && <RoseIA />}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 5 : FAIRE UN DON (AVEC OPTION ANONYME CHIFFRÉE)             */}
          {/* ------------------------------------------------------------------ */}
          {section === "FaireUnDon" && !selectedCenter && <Dons />}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET ANNONCES (CONSULTATION MOIS EN COURS & PUBLICATION ADMIN)   */}
          {/* ------------------------------------------------------------------ */}
          {section === "Annonces" && !selectedCenter && <Annonces />}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET L'ACCOMPAGNANT (WHATSAPP + SMS SIMPLE EXIGÉ)                */}
          {/* ------------------------------------------------------------------ */}
          {section === "Accompagnant" && !selectedCenter && <Accompagnant />}

          {/* ------------------------------------------------------------------ */}
          {/* FICHE DÉTAILLÉE D'UN CENTRE                                        */}
          {/* ------------------------------------------------------------------ */}
          <FicheCentre />
            </>
          )}
        </div>

        {/* ==================================================================== */}
        {/* BARRE DE NAVIGATION INFÉRIEURE : AFFICHÉE UNIQUEMENT QUAND CONNECTÉ */}
        {/* ==================================================================== */}
        <BarreNavigation />

        {/* ==================================================================== */}
        {/* MODAL : NOUVELLE ANNONCE (AVEC PROCESSUS EN ATTENTE DE VALIDATION)   */}
        {/* ==================================================================== */}
        <ModaleNouvelleAnnonce />

        {/* ==================================================================== */}
        {/* MODAL : TABLEAU DE BORD SUPERADMIN COMPLET (STATISTIQUES & VALIDATION)*/}
        {/* ==================================================================== */}
        <EspaceSuperadmin />

        {/* ==================================================================== */}
        {/* MODAL : TABLEAU DE BORD ADMIN (DONS ORANGE MONEY & STATISTIQUES)     */}
        {/* ==================================================================== */}
        <TableauDeBordAdmin />

        {/* ==================================================================== */}
        {/* MODAL : PROCESSUS OFFICIEL ORANGE MONEY (AVEC DON ANONYME CHIFFRÉ)   */}
        {/* ==================================================================== */}
        <ModaleDon />

        {/* ==================================================================== */}
        {/* MODAL : MISE À JOUR DU CENTRE DE SANTÉ (DISPONIBILITÉS & AFFLUENCE) */}
        {/* ==================================================================== */}
        <ModaleMiseAJourCentre />

        {/* ==================================================================== */}
        {/* MODAL : ORIENTATION & RECOMMANDATION D'URGENCE (DOCTEUR -> CENTRE)   */}
        {/* ==================================================================== */}
        <ModaleOrientation />

        {/* ==================================================================== */}
        {/* MODAL : INSTALLER L'APPLICATION MOBILE (PWA SMARTPHONE ANDROID & IOS) */}
        {/* ==================================================================== */}
        <ModaleInstallationPwa />

        {/* ==================================================================== */}
        {/* MODAL : PARAMÈTRES DE CONFIDENTIALITÉ & ÉTHIQUE DES DONNÉES           */}
        {/* ==================================================================== */}
        <ModaleConfidentialite />

        {/* ==================================================================== */}
        {/* MODAL : SIMULATION DU PARCOURS D'ENTRAÎNEMENT DE ROSE IA PAR LE DOCTEUR */}
        {/* ==================================================================== */}
        <EspaceEntrainementDocteur />

        {/* ==================================================================== */}
        {/* MODAL : VIDÉO DÉMONSTRATIVE D'AUTOPALPATION AVEC SAGE-FEMME AFRICAINE */}
        {/* ==================================================================== */}
        <ModaleVideoAutopalpation />

        {/* ==================================================================== */}
        {/* MODAL : AFFICHE D'ÉVÉNEMENT EN GRAND FORMAT ZOOMÉ                    */}
        {/* ==================================================================== */}
        <ModaleAffiche />

        {/* ==================================================================== */}
        {/* TOAST DE NOTIFICATION                                                */}
        {/* ==================================================================== */}
        <Toast />
      </div>
    </main>
  );
}
