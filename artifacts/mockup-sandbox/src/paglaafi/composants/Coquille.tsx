import {
  Activity,
  AlertTriangle,
  BarChart3,
  Check,
  CheckCheck,
  CheckCircle2,
  Copy,
  Download,
  Edit3,
  FileText,
  GraduationCap,
  Lock,
  Megaphone,
  Pause,
  Phone,
  Play,
  RotateCcw,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Stethoscope,
  Volume2,
  X,
} from "lucide-react";
import { partnerAssociations } from "../donnees/associations";
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
import { useUi, useAuth, useAudio, useCentres, useOrientations, useSante, useDocteur, useEducation, useAnnonces, useDons, useAdministration } from "../etat/contextes";

/**
 * Coquille de l'application : cadre smartphone, en-tête, contenu des onglets,
 * barre de navigation, modales et notifications.
 */
export function Coquille() {
  const { deferredPrompt, handleTriggerInstall, mainScrollRef, notify, section, setShowPwaInstallModal, showPwaInstallModal } = useUi();
  const { currentUser, pendingRegistrations } = useAuth();
  const { handlePlayAudio } = useAudio();
  const { centerUpdateData, centers, handleSaveCenterUpdate, selectedCenter, setCenterUpdateData, setShowCenterUpdateModal, showCenterUpdateModal } = useCentres();
  const { generatedOrientationCode, handleCreatePatientOrientation, orientationForm, setGeneratedOrientationCode, setOrientationForm, setShowOrientationModal, showOrientationModal } = useOrientations();
  const { handleClearAllLocalData, handleSavePrivacySettings, privacySettings, setPrivacySettings, setShowPrivacyModal, showPrivacyModal } = useSante();
  const { doctorEmpathicReformulation, doctorSignName, doctorSignRole, doctorTeachContent, doctorTeachTopic, doctorTestAnswer, doctorTestQuestion, doctorTrainStep, handleFinalizeDoctorTraining, handleRunDoctorTestSimulation, handleSelectDoctorPresetTopic, setDoctorSignName, setDoctorSignRole, setDoctorTeachContent, setDoctorTeachTopic, setDoctorTestAnswer, setDoctorTestQuestion, setDoctorTrainStep, setShowDoctorTrainModal, showDoctorTrainModal } = useDocteur();
  const { formatVideoTime, selectedVideoStep, setSelectedVideoStep, setShowAutopalpationVideoModal, setVideoIsPlaying, setVideoLang, setVideoProgressSeconds, setVideoSpeed, showAutopalpationVideoModal, videoIsPlaying, videoLang, videoProgressSeconds, videoSpeed } = useEducation();
  const { announcements, handleApproveAndPushAnnouncement, handleApproveAnnouncement, handlePublishAnnouncementSubmit, handleRejectAnnouncement, newAnnouncement, selectedPosterModal, setNewAnnouncement, setSelectedPosterModal, setShowNewAnnouncementModal, showNewAnnouncementModal } = useAnnonces();
  const { customDonationAmount, donationAmount, donationStep, handleConfirmOrangeMoney, handleStartDonationProcess, handleValidateOrangeMoneyOTP, isAnonymousDonation, lastDonationId, orangeMoneyPhone, otpCode, selectedAssociation, setCustomDonationAmount, setDonationAmount, setDonationStep, setIsAnonymousDonation, setOrangeMoneyPhone, setOtpCode, setSelectedAssociation, setShowDonationModal, showDonationModal } = useDons();
  const { handleApproveRegistration, handleRejectRegistration, setShowAdminDashboardModal, setShowSuperadminModal, setSuperadminActiveTab, setSuperadminAnnouncementTab, setSuperadminRegionFilter, showAdminDashboardModal, showSuperadminModal, superadminActiveTab, superadminAnnouncementTab, superadminRegionFilter, superadminSortedCenters } = useAdministration();

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
        {showNewAnnouncementModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]">
            <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl max-h-[90vh] overflow-y-auto border-2 border-[#ea2d6d]">
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#faedf1] text-[#ea2d6d]">
                    <Megaphone size={18} />
                  </span>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#580e36]">Publier une annonce</h3>
                    <p className="text-[10px] text-amber-800 font-bold">Soumise à validation Superadmin</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewAnnouncementModal(false)}
                  className="grid h-8 w-8 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handlePublishAnnouncementSubmit} className="mt-3 space-y-2.5 text-xs">
                <div>
                  <label className="block font-bold text-[#563746]">Titre de l'événement / caravane *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dépistage gratuit au marché..."
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-[#563746]">Ville / Localité :</label>
                    <input
                      type="text"
                      value={newAnnouncement.city}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, city: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#563746]">Mois concerné :</label>
                    <select
                      value={newAnnouncement.month}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, month: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs font-semibold"
                    >
                      <option value="Octobre 2026">Octobre 2026 (En cours)</option>
                      <option value="Novembre 2026">Novembre 2026</option>
                      <option value="Décembre 2026">Décembre 2026</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#563746]">Date & Heure :</label>
                  <input
                    type="text"
                    value={newAnnouncement.date}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, date: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                  />
                </div>

                {/* Photo ou Affiche officielle de l'événement */}
                <div className="space-y-1.5 rounded-xl border border-pink-200 bg-pink-50/40 p-2.5">
                  <label className="block font-bold text-[#563746]">Affiche ou Photo de l'événement :</label>

                  {/* Modèles d'affiches des partenaires en 1 clic */}
                  <div className="grid grid-cols-3 gap-1 text-[9.5px]">
                    <button
                      type="button"
                      onClick={() =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          imageUrl: "/images/affiche-evenement-beneere.jpg",
                          imageCaption: "Affiche Caravane BE NEERE FOR CAUSE",
                        })
                      }
                      className={`rounded-lg p-1 text-center font-bold border transition ${
                        newAnnouncement.imageUrl === "/images/affiche-evenement-beneere.jpg"
                          ? "bg-[#ea2d6d] text-white border-[#ea2d6d]"
                          : "bg-white text-[#7d4b60] border-pink-200 hover:bg-pink-100"
                      }`}
                    >
                      🎪 BE NEERE
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          imageUrl: "/images/affiche-wtm-odc.jpg",
                          imageCaption: "Affiche Hackathon WTM & Orange Digital Center",
                        })
                      }
                      className={`rounded-lg p-1 text-center font-bold border transition ${
                        newAnnouncement.imageUrl === "/images/affiche-wtm-odc.jpg"
                          ? "bg-[#ea2d6d] text-white border-[#ea2d6d]"
                          : "bg-white text-[#7d4b60] border-pink-200 hover:bg-pink-100"
                      }`}
                    >
                      💻 WTM / ODC
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          imageUrl: "/images/affiche-genit-care.jpg",
                          imageCaption: "Affiche Clinique GENIT CARE",
                        })
                      }
                      className={`rounded-lg p-1 text-center font-bold border transition ${
                        newAnnouncement.imageUrl === "/images/affiche-genit-care.jpg"
                          ? "bg-[#ea2d6d] text-white border-[#ea2d6d]"
                          : "bg-white text-[#7d4b60] border-pink-200 hover:bg-pink-100"
                      }`}
                    >
                      🏥 GENIT CARE
                    </button>
                  </div>

                  {/* Saisie d'une URL personnalisée */}
                  <input
                    type="text"
                    placeholder="Ou lien de votre affiche / photo..."
                    value={newAnnouncement.imageUrl || ""}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, imageUrl: e.target.value })}
                    className="w-full rounded-lg border border-[#e4cfd6] bg-white p-1.5 text-[11px]"
                  />

                  {/* Prévisualisation miniature de l'affiche */}
                  {newAnnouncement.imageUrl && (
                    <div className="relative mt-1 overflow-hidden rounded-lg border border-pink-200 shadow-2xs">
                      <img
                        src={newAnnouncement.imageUrl}
                        alt="Aperçu affiche"
                        className="aspect-[16/9] w-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[8.5px] font-bold text-white">
                        ✓ Aperçu de l'affiche
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-[#563746]">Description détaillée de l'événement *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Précisez le lieu exact, les bénéficiaires, la gratuité ou les subventions..."
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#563746]">Contact téléphonique public :</label>
                  <input
                    type="text"
                    placeholder="+226 70 00 00 00"
                    value={newAnnouncement.contact}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, contact: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                  />
                </div>

                <div className="rounded-xl bg-amber-50 border border-amber-200 p-2 text-[10.5px] text-amber-900 leading-tight">
                  ℹ️ <strong>Règle de publication :</strong> Pour garantir la véracité des informations médicales, votre annonce sera examinée et validée par le Superadmin National avant diffusion.
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#ea2d6d] py-2.5 font-bold text-white shadow hover:bg-[#8e3856]"
                >
                  Soumettre pour validation Superadmin
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL : TABLEAU DE BORD SUPERADMIN COMPLET (STATISTIQUES & VALIDATION)*/}
        {/* ==================================================================== */}
        {showSuperadminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]">
            <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl border-2 border-purple-900 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-950 text-white">
                    <ShieldCheck size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#351c2a]">Superadmin National</h3>
                    <p className="text-[10px] text-purple-900 font-bold">Modération & Statistiques Nationales</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSuperadminModal(false)}
                  className="grid h-8 w-8 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* 3 ONGLETS DU SUPERADMIN */}
              <div className="mt-3 flex rounded-xl bg-[#f5eaf0] p-1 text-[11px] font-bold">
                <button
                  onClick={() => setSuperadminActiveTab("stats")}
                  className={`flex-1 rounded-lg py-1.5 transition ${superadminActiveTab === "stats" ? "bg-purple-950 text-white shadow-xs" : "text-purple-900"}`}
                >
                  📊 Trafic & Stats
                </button>
                <button
                  onClick={() => setSuperadminActiveTab("announcements")}
                  className={`flex-1 rounded-lg py-1.5 transition relative ${superadminActiveTab === "announcements" ? "bg-purple-950 text-white shadow-xs" : "text-purple-900"}`}
                >
                  📢 Annonces ({announcements.filter((a) => a.status === "pending_validation").length})
                </button>
                <button
                  onClick={() => setSuperadminActiveTab("registrations")}
                  className={`flex-1 rounded-lg py-1.5 transition ${superadminActiveTab === "registrations" ? "bg-purple-950 text-white shadow-xs" : "text-purple-900"}`}
                >
                  🏥 Inscriptions ({pendingRegistrations.filter((r) => r.status === "pending").length})
                </button>
              </div>

              {/* Raccourci Audit & Simulation Entraînement Docteur pour Superadmin */}
              <button
                type="button"
                onClick={() => {
                  setShowSuperadminModal(false);
                  setShowDoctorTrainModal(true);
                }}
                className="mt-2.5 flex w-full items-center justify-between rounded-xl bg-amber-50 border border-amber-300 p-2 text-xs font-bold text-amber-950 hover:bg-amber-100 transition shadow-2xs"
              >
                <span className="flex items-center gap-1.5">
                  <GraduationCap size={15} className="text-amber-700" />
                  <span>Audit : Simuler l'Entraînement Docteur</span>
                </span>
                <span className="bg-amber-200 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold">4 étapes →</span>
              </button>

              {/* ONGLET 1 : STATISTIQUES DE VISITES DU SITE & RECENSEMENT DES CENTRES PAR VILLE/RÉGION */}
              {superadminActiveTab === "stats" && (
                <div className="mt-3.5 space-y-3 text-xs ph-enter">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-purple-50 border border-purple-200 p-3">
                      <span className="text-[9.5px] font-bold text-purple-800 uppercase">Visites totales</span>
                      <p className="text-lg font-extrabold text-purple-950 mt-0.5">48 320</p>
                      <p className="text-[9px] text-emerald-700 font-bold">▲ +31% ce mois</p>
                    </div>
                    <div className="rounded-2xl bg-pink-50 border border-pink-200 p-3">
                      <span className="text-[9.5px] font-bold text-[#ea2d6d] uppercase">Femmes uniques</span>
                      <p className="text-lg font-extrabold text-[#742d45] mt-0.5">14 210</p>
                      <p className="text-[9px] text-[#742d45]">Utilisatrices actives</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3">
                      <span className="text-[9.5px] font-bold text-amber-900 uppercase">Rose IA Vocale</span>
                      <p className="text-lg font-extrabold text-amber-950 mt-0.5">9 430</p>
                      <p className="text-[9px] text-amber-800">Questions traitées</p>
                    </div>
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3">
                      <span className="text-[9.5px] font-bold text-emerald-900 uppercase">Dons collectés</span>
                      <p className="text-lg font-extrabold text-emerald-950 mt-0.5">14,8 M F</p>
                      <p className="text-[9px] text-emerald-700 font-bold">Via Orange Money</p>
                    </div>
                  </div>

                  {/* ================================================================= */}
                  {/* RECENSEMENT DES CENTRES LES PLUS FRÉQUENTÉS PAR VILLE ET RÉGION   */}
                  {/* ================================================================= */}
                  <div className="rounded-2xl border-2 border-purple-300 bg-white p-3.5 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                      <div className="flex items-center gap-1.5">
                        <Activity size={16} className="text-purple-900" />
                        <h4 className="ph-display text-xs font-bold text-purple-950">
                          Centres les plus fréquentés
                        </h4>
                      </div>
                      <span className="text-[9.5px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                        {superadminSortedCenters.length} centres
                      </span>
                    </div>

                    {/* Filtres par Ville & Région */}
                    <div className="flex flex-wrap items-center gap-1 text-[10px] font-bold">
                      {[
                        { id: "all", label: "🇧🇫 Tout le pays" },
                        { id: "Centre", label: "📍 Ouaga (Centre)" },
                        { id: "Hauts-Bassins", label: "📍 Bobo (Hauts-Bassins)" },
                        { id: "Centre-Ouest", label: "📍 Koudougou" },
                      ].map((reg) => (
                        <button
                          key={reg.id}
                          onClick={() => setSuperadminRegionFilter(reg.id)}
                          className={`rounded-lg px-2 py-1 transition ${
                            superadminRegionFilter === reg.id
                              ? "bg-purple-950 text-white shadow-xs"
                              : "bg-[#f5eaf0] text-purple-900 hover:bg-[#ebdbe5]"
                          }`}
                        >
                          {reg.label}
                        </button>
                      ))}
                    </div>

                    {/* Palmarès classé par fréquentation */}
                    <div className="space-y-2 pt-1">
                      {superadminSortedCenters.map((center, index) => {
                        const monthlyEstimated = center.confirmedVisitsToday * 24;
                        const rankColor =
                          index === 0
                            ? "bg-amber-400 text-amber-950 font-black shadow-xs ring-2 ring-amber-300"
                            : index === 1
                              ? "bg-slate-300 text-slate-900 font-bold"
                              : index === 2
                                ? "bg-amber-700 text-white font-bold"
                                : "bg-purple-100 text-purple-900 font-semibold";

                        return (
                          <div
                            key={center.id}
                            className="rounded-xl border border-purple-100 bg-purple-50/40 p-2.5 transition hover:bg-purple-50"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2">
                                <span
                                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg text-[10px] ${rankColor}`}
                                >
                                  #{index + 1}
                                </span>
                                <div>
                                  <h5 className="font-bold text-[#351c2a] text-[11.5px] leading-tight">
                                    {center.shortName}
                                  </h5>
                                  <p className="text-[10px] text-purple-800">
                                    {center.place} ({center.city})
                                  </p>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-xs font-black text-purple-950 block">
                                  {center.confirmedVisitsToday} femmes/j
                                </span>
                                <span className="text-[9px] text-[#865d70]">
                                  ~{monthlyEstimated.toLocaleString("fr-FR")} /mois
                                </span>
                              </div>
                            </div>

                            {/* Jauge d'affluence et détails */}
                            <div className="mt-2 pt-1.5 border-t border-purple-100/80 flex items-center justify-between text-[9.5px]">
                              <span className="flex items-center gap-1 font-semibold text-[#5a3b4c]">
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    center.isApparatusWorking ? "bg-emerald-500" : "bg-rose-500"
                                  }`}
                                />
                                {center.isApparatusWorking ? "Mammographe actif" : "Mammographe en révision"}
                              </span>
                              <span className="text-purple-900 font-bold">
                                Attente : {center.estimatedWait}
                              </span>
                              <span className="text-purple-800">
                                👥 {center.agentsPresent} soignants
                              </span>
                            </div>

                            {/* Barre de tension relative */}
                            <div className="mt-1.5 h-1.5 w-full rounded-full bg-purple-100 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  center.confirmedVisitsToday >= 60
                                    ? "bg-rose-500"
                                    : center.confirmedVisitsToday >= 30
                                      ? "bg-amber-500"
                                      : "bg-emerald-500"
                                }`}
                                style={{
                                  width: `${Math.min(100, (center.confirmedVisitsToday / 80) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Répartition géographique des visites au Burkina */}
                  <div className="rounded-2xl border border-[#ebd6dc] bg-[#fffafc] p-3 space-y-2">
                    <span className="font-bold text-[#580e36] block">Répartition des visites par région :</span>
                    <div className="space-y-1.5 text-[11px]">
                      <div>
                        <div className="flex justify-between text-[#5f4150]">
                          <span>Centre (Ouagadougou & environs)</span>
                          <span className="font-bold">57%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full bg-[#ea2d6d]" style={{ width: "57%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[#5f4150]">
                          <span>Hauts-Bassins (Bobo-Dioulasso)</span>
                          <span className="font-bold">25%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full bg-emerald-600" style={{ width: "25%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[#5f4150]">
                          <span>Centre-Ouest (Koudougou)</span>
                          <span className="font-bold">12%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: "12%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[#5f4150]">
                          <span>Autres provinces (Nord, Sahel, Est)</span>
                          <span className="font-bold">6%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: "6%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ONGLET 2 : MODÉRATION DES ANNONCES & VEILLE RADAR ROSE IA */}
              {superadminActiveTab === "announcements" && (
                <div className="mt-3.5 space-y-3 text-xs ph-enter">
                  {/* Sous-onglets de tri : Tout / Veille Rose IA / Partenaires */}
                  <div className="flex items-center gap-1 bg-[#f5eaf0] p-1 rounded-xl text-[10.5px] font-bold">
                    <button
                      onClick={() => setSuperadminAnnouncementTab("all")}
                      className={`flex-1 py-1 rounded-lg transition ${
                        superadminAnnouncementTab === "all"
                          ? "bg-purple-950 text-white shadow-xs"
                          : "text-purple-900"
                      }`}
                    >
                      Toutes ({announcements.filter((a) => a.status === "pending_validation").length})
                    </button>
                    <button
                      onClick={() => setSuperadminAnnouncementTab("rose_ai")}
                      className={`flex-1 py-1 rounded-lg transition inline-flex items-center justify-center gap-1 ${
                        superadminAnnouncementTab === "rose_ai"
                          ? "bg-purple-950 text-white shadow-xs"
                          : "text-purple-900"
                      }`}
                    >
                      <Sparkles size={11} className="text-amber-400" />
                      <span>
                        Veille Rose IA (
                        {
                          announcements.filter(
                            (a) => a.status === "pending_validation" && a.isRoseAIDetected,
                          ).length
                        }
                        )
                      </span>
                    </button>
                    <button
                      onClick={() => setSuperadminAnnouncementTab("partners")}
                      className={`flex-1 py-1 rounded-lg transition ${
                        superadminAnnouncementTab === "partners"
                          ? "bg-purple-950 text-white shadow-xs"
                          : "text-purple-900"
                      }`}
                    >
                      Partenaires (
                      {
                        announcements.filter(
                          (a) => a.status === "pending_validation" && !a.isRoseAIDetected,
                        ).length
                      }
                      )
                    </button>
                  </div>

                  {/* Liste des annonces à modérer */}
                  <div className="space-y-2.5">
                    {announcements
                      .filter((a) => {
                        if (a.status !== "pending_validation") return false;
                        if (superadminAnnouncementTab === "rose_ai") return a.isRoseAIDetected;
                        if (superadminAnnouncementTab === "partners") return !a.isRoseAIDetected;
                        return true;
                      })
                      .map((ann) => (
                        <div
                          key={ann.id}
                          className={`rounded-2xl p-3 text-xs space-y-2 border-2 ${
                            ann.isRoseAIDetected
                              ? "border-purple-400 bg-gradient-to-br from-purple-50 via-white to-pink-50/50 shadow-sm"
                              : "border-amber-300 bg-amber-50/70"
                          }`}
                        >
                          {/* Badge et Origine */}
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-bold text-[#3a1d2d] text-[12px] leading-tight">
                              {ann.title}
                            </span>
                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                                ann.isRoseAIDetected
                                  ? "bg-purple-900 text-white"
                                  : "bg-amber-200 text-amber-900"
                              }`}
                            >
                              {ann.isRoseAIDetected ? "🤖 Veille Web Rose IA" : "En attente partenaire"}
                            </span>
                          </div>

                          {/* Source internet pour la veille Rose IA */}
                          {ann.isRoseAIDetected && (
                            <div className="rounded-xl bg-purple-100/70 p-2 text-[10px] space-y-0.5 text-purple-950">
                              <p className="font-bold flex items-center gap-1">
                                <span>🌐 Source détectée :</span>
                                <span className="text-purple-800 font-normal">{ann.sourceWebUrl}</span>
                              </p>
                              <p className="font-bold flex items-center gap-1">
                                <span>🎯 Indice de confiance IA :</span>
                                <span className="text-emerald-700">{ann.aiConfidence}</span>
                              </p>
                              <p className="mt-1 italic text-[9.5px] text-purple-900">
                                📲 <strong>Notification push préparée :</strong> « {ann.pushMessageFr} »
                              </p>
                            </div>
                          )}

                          <p className="text-[10.5px] text-[#863e58] font-semibold">
                            {ann.author} · {ann.city} ({ann.date})
                          </p>
                          <p className="text-[11px] text-[#553b49] leading-relaxed">{ann.content}</p>
                          <p className="text-[10px] text-[#7d5d6d]">Contact : {ann.contact}</p>

                          {/* Actions : Validation avec diffusion Push ou Rejet */}
                          <div className="pt-2 flex gap-2">
                            {ann.isRoseAIDetected ? (
                              <button
                                onClick={() => handleApproveAndPushAnnouncement(ann.id)}
                                className="flex-1 rounded-xl bg-gradient-to-r from-purple-900 to-[#ea2d6d] py-2 font-bold text-white shadow-sm text-center hover:opacity-95 flex items-center justify-center gap-1.5"
                                title="Valider officiellement l'annonce et envoyer un push bienveillant aux femmes"
                              >
                                <Sparkles size={14} className="text-amber-300" />
                                <span>Valider & Diffuser en Push 🚀</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleApproveAnnouncement(ann.id)}
                                className="flex-1 rounded-xl bg-emerald-600 py-1.5 font-bold text-white shadow-xs text-center hover:bg-emerald-700"
                              >
                                Valider & Publier ✓
                              </button>
                            )}

                            <button
                              onClick={() => handleRejectAnnouncement(ann.id)}
                              className="rounded-xl border border-rose-300 bg-white px-3 py-1.5 font-bold text-rose-700 hover:bg-rose-50"
                            >
                              Refuser
                            </button>
                          </div>
                        </div>
                      ))}

                    {announcements.filter((a) => {
                      if (a.status !== "pending_validation") return false;
                      if (superadminAnnouncementTab === "rose_ai") return a.isRoseAIDetected;
                      if (superadminAnnouncementTab === "partners") return !a.isRoseAIDetected;
                      return true;
                    }).length === 0 && (
                      <div className="rounded-xl border border-[#ebd6dc] p-4 text-center text-[#825b6d]">
                        Aucune annonce en attente dans cette catégorie.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ONGLET 3 : DEMANDES D'ADHÉSION DES STRUCTURES */}
              {superadminActiveTab === "registrations" && (
                <div className="mt-3.5 space-y-2 text-xs ph-enter">
                  <p className="font-bold text-[#580e36]">
                    Demandes d'adhésion en attente ({pendingRegistrations.filter((r) => r.status === "pending").length}) :
                  </p>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {pendingRegistrations.map((reg) => (
                      <div key={reg.id} className="rounded-xl border border-[#ebd6dc] bg-[#fffafc] p-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#580e36]">{reg.structure}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${reg.status === "pending" ? "bg-amber-100 text-amber-900" : reg.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                            {reg.status === "pending" ? "En attente" : reg.status === "approved" ? "Validé ✓" : "Refusé"}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#735765] mt-0.5">Resp. : {reg.responsable} · {reg.telephone}</p>
                        <p className="text-[10px] text-[#916b7c]">{reg.ville} · {reg.type}</p>

                        {reg.status === "pending" && (
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => handleApproveRegistration(reg.id)}
                              className="flex-1 rounded-lg bg-emerald-600 py-1 text-center font-bold text-white shadow-xs"
                            >
                              Valider l'inscription
                            </button>
                            <button
                              onClick={() => handleRejectRegistration(reg.id)}
                              className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1 font-bold text-rose-700"
                            >
                              Refuser
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL : TABLEAU DE BORD ADMIN (DONS ORANGE MONEY & STATISTIQUES)     */}
        {/* ==================================================================== */}
        {showAdminDashboardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]">
            <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl max-h-[90vh] overflow-y-auto border-2 border-[#522538]">
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#522538] text-white">
                    <BarChart3 size={18} className="text-rose-300" />
                  </div>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#351c2a]">Tableau de Bord Admin</h3>
                    <p className="text-[10px] text-[#834f66] font-bold">Dons Orange Money & Statistiques</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAdminDashboardModal(false)}
                  className="grid h-8 w-8 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3">
                  <p className="text-[9.5px] font-bold text-rose-800 uppercase">Dons collectés (OM)</p>
                  <p className="text-base font-extrabold text-[#6c1543] mt-0.5">3 850 000 F</p>
                  <p className="text-[9px] text-[#7d5164]">412 donateurs vérifiés</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3">
                  <p className="text-[9.5px] font-bold text-emerald-800 uppercase">Examens financés</p>
                  <p className="text-base font-extrabold text-emerald-700 mt-0.5">385 femmes</p>
                  <p className="text-[9px] text-[#4d6a5c]">100% prises en charge</p>
                </div>
              </div>

              <div className="mt-3.5 border-t border-[#f2e1e6] pt-3 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-[#580e36]">Dernières collectes Orange Money :</p>
                  <span className="text-[10px] text-[#f16e00] font-extrabold">#144#</span>
                </div>

                <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
                  {[
                    { id: "OM-ANON-904123", donor: "Donatrice anonyme (Chiffré AES)", amount: 10000, date: "Aujourd'hui 17h42", assoc: "ABAC" },
                    { id: "OM-BF-893102", donor: "Ouedraogo A.", amount: 5000, date: "Aujourd'hui 15h18", assoc: "ABAC" },
                    { id: "OM-ANON-872291", donor: "Donatrice anonyme (Chiffré AES)", amount: 25000, date: "Hier 19h10", assoc: "Beneere For A Cause" },
                    { id: "OM-BF-861109", donor: "Traoré S.", amount: 2500, date: "14/10/2026", assoc: "GenitCare" },
                    { id: "OM-BF-850012", donor: "Association WTM", amount: 50000, date: "13/10/2026", assoc: "WomenTech Makers" },
                  ].map((tx) => (
                    <div key={tx.id} className="rounded-xl border border-[#ebdbe2] bg-[#fffbfd] p-2 flex items-center justify-between text-[10.5px]">
                      <div>
                        <span className="font-bold text-[#580e36]">{tx.donor}</span>
                        <p className="text-[9px] text-[#7a5969]">{tx.assoc} · {tx.date}</p>
                      </div>
                      <span className="font-bold text-[#f16e00]">+{tx.amount.toLocaleString("fr-FR")} F</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL : PROCESSUS OFFICIEL ORANGE MONEY (AVEC DON ANONYME CHIFFRÉ)   */}
        {/* ==================================================================== */}
        {showDonationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]">
            <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl border border-orange-200">
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f16e00] text-white font-black text-xs">
                    OM
                  </span>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#3d2430]">Faire un don solidaire</h3>
                    <p className="text-[10px] text-orange-950 font-semibold">Orange Money Burkina Faso (#144#)</p>
                  </div>
                </div>
                <button
                  onClick={() => { setShowDonationModal(false); setDonationStep("form"); }}
                  className="grid h-8 w-8 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* ÉTAPE 1 : Choix de l'association, montant et option anonyme */}
              {donationStep === "form" && (
                <div className="mt-3 space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#563746]">1. Choisir l'association partenaire :</label>
                    <select
                      value={selectedAssociation.id}
                      onChange={(e) => {
                        const found = partnerAssociations.find((a) => a.id === Number(e.target.value));
                        if (found) setSelectedAssociation(found);
                      }}
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 font-semibold text-[#580e36]"
                    >
                      {partnerAssociations.map((assoc) => (
                        <option key={assoc.id} value={assoc.id}>
                          {assoc.acronym} — {assoc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#563746]">2. Montant du don solidaire (FCFA) :</label>
                    <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                      {[1000, 2500, 5000, 10000, 25000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => { setDonationAmount(amt); setCustomDonationAmount(""); }}
                          className={`rounded-xl py-2 font-bold transition text-xs ${donationAmount === amt && !customDonationAmount ? "bg-[#f16e00] text-white shadow-sm" : "border border-[#e7d5dc] bg-[#fffaf8] text-[#563746]"}`}
                        >
                          {amt.toLocaleString("fr-FR")} F
                        </button>
                      ))}
                      <input
                        type="number"
                        placeholder="Autre..."
                        value={customDonationAmount}
                        onChange={(e) => setCustomDonationAmount(e.target.value)}
                        className={`rounded-xl p-1.5 text-center text-xs font-bold border ${customDonationAmount ? "border-[#f16e00] bg-orange-50 text-orange-900" : "border-[#e7d5dc]"}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#563746]">3. Numéro de téléphone débiteur :</label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-2.5 font-bold text-[#8c6778]">+226</span>
                      <input
                        type="tel"
                        value={orangeMoneyPhone}
                        onChange={(e) => setOrangeMoneyPhone(e.target.value)}
                        placeholder="70 12 34 56"
                        className="w-full rounded-xl border border-[#e4cfd6] py-2 pl-14 pr-3 font-bold text-[#580e36] focus:border-[#f16e00] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* OPTION DON ANONYME & CHIFFRÉ (EXIGÉE) */}
                  <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 p-3">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAnonymousDonation}
                        onChange={(e) => setIsAnonymousDonation(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="font-bold text-[#20432f] text-xs flex items-center gap-1.5">
                          <ShieldCheck size={14} className="text-emerald-700" /> Don 100% Anonyme & Chiffré
                        </span>
                        <p className="text-[10px] text-[#476a56] leading-tight mt-0.5">
                          Vos coordonnées (nom, prénom et numéro) sont chiffrées et masquées pour l'association. Seul un reçu officiel anonymisé est émis.
                        </p>
                      </div>
                    </label>
                  </div>

                  <button
                    onClick={handleStartDonationProcess}
                    className="mt-2 w-full rounded-2xl bg-[#f16e00] py-3 text-xs font-bold text-white shadow-md hover:bg-orange-600 transition"
                  >
                    Valider le don de {customDonationAmount ? Number(customDonationAmount).toLocaleString("fr-FR") : donationAmount.toLocaleString("fr-FR")} FCFA →
                  </button>
                </div>
              )}

              {/* ÉTAPE 2 : Confirmation */}
              {donationStep === "confirm" && (
                <div className="mt-3 space-y-3 text-xs">
                  <div className="rounded-2xl bg-[#fff7f2] border border-orange-200 p-3.5 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#7c5b6b]">Bénéficiaire :</span>
                      <span className="font-bold text-[#580e36]">{selectedAssociation.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7c5b6b]">Montant :</span>
                      <span className="font-extrabold text-[#f16e00] text-sm">
                        {customDonationAmount ? Number(customDonationAmount).toLocaleString("fr-FR") : donationAmount.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7c5b6b]">Donateur :</span>
                      <span className="font-bold text-[#580e36]">
                        {isAnonymousDonation ? "Donatrice anonyme (Chiffré AES-256)" : `${currentUser?.prenom || "Donateur"} ${currentUser?.nom || ""}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7c5b6b]">Numéro débité :</span>
                      <span className="font-bold text-[#580e36]">
                        {isAnonymousDonation ? `+226 70 ** ** ${orangeMoneyPhone.slice(-2)}` : `+226 ${orangeMoneyPhone}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setDonationStep("form")}
                      className="flex-1 rounded-xl border border-[#e5ced6] py-2.5 font-bold text-[#725261]"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={handleConfirmOrangeMoney}
                      className="flex-1 rounded-xl bg-[#f16e00] py-2.5 font-bold text-white shadow hover:bg-orange-600"
                    >
                      Autoriser le paiement
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 3 : OTP Orange Money */}
              {donationStep === "otp" && (
                <div className="mt-3 space-y-3 text-xs text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-orange-100 text-[#f16e00] ph-pulse">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#580e36]">Autorisation Orange Money (#144*4*6#)</h4>
                    <p className="text-[11px] text-[#7c5b6b] mt-1">
                      Composez <strong>#144*4*6#</strong> sur votre mobile ou saisissez votre code OTP reçu par SMS :
                    </p>
                  </div>

                  <div className="mx-auto max-w-[180px]">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Code OTP"
                      className="w-full rounded-xl border-2 border-orange-400 p-2 text-center text-sm font-extrabold tracking-widest text-[#580e36]"
                    />
                  </div>

                  <button
                    onClick={handleValidateOrangeMoneyOTP}
                    className="w-full rounded-2xl bg-[#f16e00] py-2.5 font-bold text-white shadow"
                  >
                    Confirmer le don
                  </button>
                </div>
              )}

              {/* ÉTAPE 4 : Reçu officiel de don */}
              {donationStep === "success" && (
                <div className="mt-3 space-y-3 text-xs text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
                    <CheckCircle2 size={32} />
                  </div>

                  <div>
                    <h4 className="ph-display text-lg font-bold text-[#580e36]">Merci pour votre générosité !</h4>
                    <p className="text-[11px] text-[#7c5b6b] mt-0.5">
                      Votre don est intégralement alloué à <strong>{selectedAssociation.acronym}</strong> pour soutenir le dépistage au Burkina Faso.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#f8f9fa] border border-[#e9ecef] p-3 text-left space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Réf Transaction :</span>
                      <span className="font-mono font-bold text-gray-800">{lastDonationId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Donateur :</span>
                      <span className="font-semibold text-gray-700">
                        {isAnonymousDonation ? "Donatrice Anonyme (Chiffrement AES)" : `${currentUser?.prenom || "Donateur"} ${currentUser?.nom || ""}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Montant :</span>
                      <span className="font-bold text-[#f16e00]">
                        {customDonationAmount ? Number(customDonationAmount).toLocaleString("fr-FR") : donationAmount.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Opérateur :</span>
                      <span className="font-semibold text-gray-700">Orange Money Burkina</span>
                    </div>
                  </div>

                  <button
                    onClick={() => { setShowDonationModal(false); setDonationStep("form"); }}
                    className="w-full rounded-2xl bg-[#ea2d6d] py-2.5 font-bold text-white shadow"
                  >
                    Fermer le reçu
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL : MISE À JOUR DU CENTRE DE SANTÉ (DISPONIBILITÉS & AFFLUENCE) */}
        {/* ==================================================================== */}
        {showCenterUpdateModal && centerUpdateData && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:absolute sm:rounded-[36px]"
            onClick={() => setShowCenterUpdateModal(false)}
          >
            <div
              className="ph-enter max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-5 text-[#351c2a] shadow-2xl border-2 border-[#ea2d6d]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* En-tête */}
              <div className="flex items-center justify-between border-b border-[#fce4ec] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-[#580e36] to-[#ea2d6d] text-white shadow-sm">
                    <Edit3 size={18} />
                  </div>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#580e36]">
                      Mise à jour du Centre
                    </h3>
                    <p className="text-[10px] text-[#ea2d6d] font-bold">
                      {centerUpdateData.name}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCenterUpdateModal(false)}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Formulaire de mise à jour */}
              <form onSubmit={handleSaveCenterUpdate} className="mt-3.5 space-y-3.5 text-xs">
                {/* 1. Statut opérationnel & Affluence */}
                <div>
                  <label className="block text-[11px] font-bold text-[#580e36] mb-1">
                    Statut d'accueil et affluence en direct :
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      {
                        value: "available",
                        label: "Disponible",
                        sub: "Attente fluide",
                        color: "border-emerald-500 bg-emerald-50 text-emerald-800",
                        dot: "bg-emerald-500",
                      },
                      {
                        value: "busy",
                        label: "Affluence",
                        sub: "Attente moyenne",
                        color: "border-amber-500 bg-amber-50 text-amber-900",
                        dot: "bg-amber-500",
                      },
                      {
                        value: "maintenance",
                        label: "Maintenance",
                        sub: "Appareil arrêté",
                        color: "border-rose-500 bg-rose-50 text-rose-800",
                        dot: "bg-rose-500",
                      },
                    ].map((st) => (
                      <button
                        key={st.value}
                        type="button"
                        onClick={() => {
                          setCenterUpdateData({
                            ...centerUpdateData,
                            status: st.value as any,
                            statusLabel:
                              st.value === "available"
                                ? "Disponible · Attente fluide"
                                : st.value === "busy"
                                ? "Forte affluence · Prévoir attente"
                                : "Maintenance technique · Arrêt temporaire",
                            statusColor: st.dot,
                          });
                        }}
                        className={`flex flex-col items-center justify-center rounded-xl p-2 border-2 transition cursor-pointer ${
                          centerUpdateData.status === st.value
                            ? `${st.color} font-bold shadow-xs`
                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span className={`h-2.5 w-2.5 rounded-full ${st.dot} mb-1`} />
                        <span className="text-[11px] font-bold">{st.label}</span>
                        <span className="text-[9px] opacity-80">{st.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Temps d'attente estimé & File d'attente */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
                      Temps d'attente estimé :
                    </label>
                    <input
                      type="text"
                      value={centerUpdateData.estimatedWait}
                      onChange={(e) =>
                        setCenterUpdateData({ ...centerUpdateData, estimatedWait: e.target.value })
                      }
                      placeholder="Ex: ~15 à 20 min"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#ea2d6d] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
                      Patientes dans la file :
                    </label>
                    <input
                      type="number"
                      value={centerUpdateData.queueCount}
                      onChange={(e) =>
                        setCenterUpdateData({
                          ...centerUpdateData,
                          queueCount: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#ea2d6d] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* 3. État du mammographe numérique */}
                <div className="rounded-2xl bg-[#fdf2f6] p-3 border border-[#fce4ec]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#580e36] text-[11px]">
                        Mammographe numérique en service :
                      </p>
                      <p className="text-[10px] text-[#785566]">
                        {centerUpdateData.isApparatusWorking
                          ? "✓ L'appareil fonctionne à 100%"
                          : "⚠️ Appareil en panne ou calibration"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setCenterUpdateData({
                          ...centerUpdateData,
                          isApparatusWorking: !centerUpdateData.isApparatusWorking,
                        })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer ${
                        centerUpdateData.isApparatusWorking ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          centerUpdateData.isApparatusWorking ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={centerUpdateData.apparatus}
                    onChange={(e) =>
                      setCenterUpdateData({ ...centerUpdateData, apparatus: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-pink-200 bg-white px-2.5 py-1.5 text-xs text-[#580e36]"
                  />
                </div>

                {/* 4. Personnel et agents présents */}
                <div>
                  <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
                    Équipe présente aujourd'hui :
                  </label>
                  <input
                    type="text"
                    value={centerUpdateData.staffDescription}
                    onChange={(e) =>
                      setCenterUpdateData({ ...centerUpdateData, staffDescription: e.target.value })
                    }
                    placeholder="Ex: 2 sages-femmes, 1 radiologue en poste"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#ea2d6d] focus:outline-hidden"
                  />
                </div>

                {/* 5. Message audio / Consigne du jour */}
                <div>
                  <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
                    Consigne vocale du jour aux patientes (Français) :
                  </label>
                  <textarea
                    rows={2}
                    value={centerUpdateData.audioMessageFr}
                    onChange={(e) =>
                      setCenterUpdateData({ ...centerUpdateData, audioMessageFr: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#ea2d6d] focus:outline-hidden"
                  />
                </div>

                {/* Bouton de soumission */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-gradient-to-r from-[#580e36] to-[#ea2d6d] py-3 text-xs font-bold text-white shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check size={16} />
                    <span>Enregistrer et publier sur la carte en direct</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL : ORIENTATION & RECOMMANDATION D'URGENCE (DOCTEUR -> CENTRE)   */}
        {/* ==================================================================== */}
        {showOrientationModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:absolute sm:rounded-[36px]"
            onClick={() => {
              setShowOrientationModal(false);
              setGeneratedOrientationCode(null);
            }}
          >
            <div
              className="ph-enter max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-5 text-[#351c2a] shadow-2xl border-2 border-rose-500"
              onClick={(e) => e.stopPropagation()}
            >
              {/* En-tête */}
              <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-rose-700 to-[#ea2d6d] text-white shadow-sm">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#580e36]">
                      Orientation Médicale d'Urgence
                    </h3>
                    <p className="text-[10px] text-rose-600 font-bold">
                      Docteur ➔ Centre de Santé Partenaire
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowOrientationModal(false);
                    setGeneratedOrientationCode(null);
                  }}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              {generatedOrientationCode ? (
                /* ÉCRAN DE CONFIRMATION / REÇU D'ORIENTATION OFFICIEL */
                <div className="mt-4 space-y-3.5 text-xs">
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-white shadow-md">
                      <Check size={26} />
                    </div>
                    <h4 className="ph-display mt-2 text-base font-bold text-emerald-950">
                      Orientation émise avec succès !
                    </h4>
                    <p className="mt-1 text-xs text-emerald-800">
                      Le centre cible a été alerté en priorité.
                    </p>
                    <div className="mt-3 rounded-xl bg-white p-2.5 border border-emerald-300">
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">
                        Code d'Orientation Sécurisé :
                      </span>
                      <span className="font-mono text-base font-extrabold text-[#580e36] tracking-wider select-all">
                        {generatedOrientationCode}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#fdf2f6] p-3 border border-[#fce4ec] space-y-1.5 text-[11px] text-[#580e36]">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Patiente :</span>
                      <span className="font-bold">{orientationForm.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Centre désigné :</span>
                      <span className="font-bold">
                        {centers.find((c) => c.id === Number(orientationForm.targetCenterId))?.shortName || "CMA Schiphra"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Niveau d'urgence :</span>
                      <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                        orientationForm.urgencyLevel === "immediate"
                          ? "bg-rose-600 text-white"
                          : orientationForm.urgencyLevel === "priority"
                          ? "bg-amber-500 text-white"
                          : "bg-blue-600 text-white"
                      }`}>
                        {orientationForm.urgencyLevel === "immediate"
                          ? "🚨 Immédiat (< 24h)"
                          : orientationForm.urgencyLevel === "priority"
                          ? "⚠️ Prioritaire (48h-72h)"
                          : "ℹ️ Routine"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Examens prescrits :</span>
                      <span className="font-bold">{orientationForm.recommendedExam}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const targetCenter = centers.find((c) => c.id === Number(orientationForm.targetCenterId))?.shortName || "CMA Schiphra";
                        const msg = `Bonjour Mme ${orientationForm.patientName}, voici votre fiche d'orientation urgente PagLaafi vers le ${targetCenter}. Code d'urgence : ${generatedOrientationCode}. Présentez-vous directement au centre sans attente.`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition cursor-pointer"
                    >
                      <Share2 size={14} /> WhatsApp Patiente
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(generatedOrientationCode);
                        notify(`Code ${generatedOrientationCode} copié !`);
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-700 transition cursor-pointer"
                    >
                      <Copy size={14} /> Copier le code
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowOrientationModal(false);
                      setGeneratedOrientationCode(null);
                    }}
                    className="w-full rounded-2xl bg-[#ea2d6d] py-2.5 text-xs font-bold text-white shadow hover:bg-[#d81f5c] transition cursor-pointer"
                  >
                    Fermer la fiche
                  </button>
                </div>
              ) : (
                /* FORMULAIRE D'ORIENTATION D'URGENCE */
                <form onSubmit={handleCreatePatientOrientation} className="mt-3.5 space-y-3.5 text-xs">
                  {/* ALERTE CRÉDIBILITÉ MÉDICALE */}
                  <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3 text-rose-950">
                    <p className="font-bold text-xs flex items-center gap-1.5 text-rose-900">
                      <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                      Priorité médicale absolue
                    </p>
                    <p className="text-[11px] text-rose-900/90 mt-1 leading-relaxed">
                      L'orientation médicale permet de court-circuiter les files d'attente habituelles pour faire passer une mammographie ou une échographie en urgence dans un centre équipé.
                    </p>
                  </div>

                  {/* 1. DEGRÉ D'URGENCE AU PREMIER PLAN */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#580e36] mb-1.5">
                      1. Degré d'urgence clinique (Priorité) :
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        {
                          level: "immediate" as const,
                          title: "🚨 Immédiat",
                          sub: "Moins de 24h",
                          activeBg: "bg-rose-600 text-white border-rose-700 ring-2 ring-rose-400",
                        },
                        {
                          level: "priority" as const,
                          title: "⚠️ Prioritaire",
                          sub: "48h à 72h",
                          activeBg: "bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300",
                        },
                        {
                          level: "routine" as const,
                          title: "ℹ️ Routine",
                          sub: "< 15 jours",
                          activeBg: "bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300",
                        },
                      ].map((urg) => (
                        <button
                          key={urg.level}
                          type="button"
                          onClick={() => setOrientationForm({ ...orientationForm, urgencyLevel: urg.level as any })}
                          className={`flex flex-col items-center justify-center rounded-xl p-2 border-2 text-center transition cursor-pointer ${
                            orientationForm.urgencyLevel === urg.level
                              ? urg.activeBg
                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-[11px] font-extrabold">{urg.title}</span>
                          <span className="text-[9.5px] font-bold opacity-90">{urg.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. CENTRE DE SANTÉ CIBLE */}
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
                      2. Centre de santé de destination :
                    </label>
                    <select
                      value={orientationForm.targetCenterId}
                      onChange={(e) =>
                        setOrientationForm({ ...orientationForm, targetCenterId: Number(e.target.value) })
                      }
                      className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs font-semibold text-[#580e36] focus:border-[#ea2d6d] focus:outline-hidden"
                    >
                      {centers.map((c) => (
                        <option key={c.id} value={c.id}>
                          🏥 {c.shortName} — {c.place} ({c.statusLabel})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3. COORDONNÉES PATIENTE */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
                        Nom de la patiente :
                      </label>
                      <input
                        type="text"
                        value={orientationForm.patientName}
                        onChange={(e) =>
                          setOrientationForm({ ...orientationForm, patientName: e.target.value })
                        }
                        placeholder="Ex: K. Fatoumata"
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#ea2d6d] focus:outline-hidden"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
                        Téléphone :
                      </label>
                      <input
                        type="tel"
                        value={orientationForm.patientPhone}
                        onChange={(e) =>
                          setOrientationForm({ ...orientationForm, patientPhone: e.target.value })
                        }
                        placeholder="Ex: 70 88 99 00"
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#ea2d6d] focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  {/* 4. EXAMENS DEMANDÉS */}
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
                      4. Examens prescrits en urgence :
                    </label>
                    <select
                      value={orientationForm.recommendedExam}
                      onChange={(e) =>
                        setOrientationForm({ ...orientationForm, recommendedExam: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs font-semibold text-[#580e36] focus:border-[#ea2d6d] focus:outline-hidden"
                    >
                      <option value="Mammographie numérique bilatérale + Échographie mammaire">
                        Mammographie numérique bilatérale + Échographie mammaire (Pack complet)
                      </option>
                      <option value="Échographie mammaire haute résolution">
                        Échographie mammaire haute résolution isolée
                      </option>
                      <option value="Mammographie numérique de dépistage diagnostique">
                        Mammographie numérique de dépistage diagnostique
                      </option>
                      <option value="Biopsie mammaire / Cytoponction d'urgence">
                        Biopsie mammaire / Cytoponction d'urgence
                      </option>
                    </select>
                  </div>

                  {/* 5. MOTIF CLINIQUE / OBSERVATIONS */}
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
                      5. Motif clinique & Signes d'appel :
                    </label>
                    <textarea
                      rows={2}
                      value={orientationForm.clinicalObservations}
                      onChange={(e) =>
                        setOrientationForm({ ...orientationForm, clinicalObservations: e.target.value })
                      }
                      placeholder="Ex: Masse rétro-aréolaire droite de 2.5 cm, indolore..."
                      className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#ea2d6d] focus:outline-hidden"
                      required
                    />
                  </div>

                  {/* Bouton de confirmation */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-gradient-to-r from-rose-600 to-[#ea2d6d] py-3 text-xs font-bold text-white shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FileText size={16} />
                      <span>Émettre l'orientation d'urgence vers le centre</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL : INSTALLER L'APPLICATION MOBILE (PWA SMARTPHONE ANDROID & IOS) */}
        {/* ==================================================================== */}
        {showPwaInstallModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]"
            onClick={() => setShowPwaInstallModal(false)}
          >
            <div
              className="ph-enter w-full max-w-sm rounded-[28px] bg-white p-5 text-[#351c2a] shadow-2xl border-2 border-[#ea2d6d]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-tr from-[#6c1543] to-[#ba486e] text-white shadow-sm">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#580e36]">Installer PagLaafi</h3>
                    <p className="text-[10px] text-emerald-700 font-bold">Application Mobile Autonome</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPwaInstallModal(false)}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-3.5 space-y-3 text-xs">
                <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-[#fff8fa] p-3.5 border border-pink-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#863550]">
                    <Sparkles size={14} className="text-amber-500" />
                    <span>Pourquoi installer l'application ?</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-[#6b4757]">
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-emerald-600 shrink-0" />
                      <span><strong>Accès 100% Hors-Ligne</strong> sans consommer vos données internet</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-emerald-600 shrink-0" />
                      <span><strong>Plein écran tactile</strong> sans barre d'adresse de navigateur</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-emerald-600 shrink-0" />
                      <span><strong>Sauvegarde continue</strong> de votre cycle et autopalpation</span>
                    </li>
                  </ul>
                </div>

                {/* Guide selon le système */}
                <div className="rounded-2xl bg-slate-50 p-3 border border-slate-200 space-y-2">
                  <p className="font-bold text-[#580e36] text-[11.5px] flex items-center justify-between">
                    <span>📱 Guide d'installation rapide :</span>
                    <span className="text-[9.5px] font-bold text-slate-500">Android & iOS</span>
                  </p>

                  <div className="space-y-2 text-[10.5px] text-slate-700">
                    <div className="rounded-xl bg-white p-2 border border-slate-200">
                      <span className="font-bold text-[#8a3350] block">🤖 Sur Android (Chrome / Samsung) :</span>
                      <span>Si le bouton ci-dessous ne s'affiche pas, ouvrez le menu <strong>(⋮)</strong> en haut à droite du navigateur puis choisissez <strong>« Installer l'application »</strong> ou « Ajouter à l'écran d'accueil ».</span>
                    </div>

                    <div className="rounded-xl bg-white p-2 border border-slate-200">
                      <span className="font-bold text-[#8a3350] block">🍎 Sur iPhone / iPad (Safari) :</span>
                      <span>1. Touchez le bouton <strong>Partager ⎋</strong> (carré avec flèche en bas d'écran).<br />2. Faites défiler et touchez <strong>« Sur l'écran d'accueil » ➕</strong>.<br />3. Validez avec <strong>« Ajouter »</strong>.</span>
                    </div>
                  </div>
                </div>

                {deferredPrompt ? (
                  <button
                    onClick={handleTriggerInstall}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#ea2d6d] to-[#580e36] py-3 text-xs font-bold text-white shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2"
                  >
                    <Download size={15} />
                    <span>Installer maintenant en 1-clic</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowPwaInstallModal(false)}
                    className="w-full rounded-2xl bg-[#ea2d6d] py-2.5 text-xs font-bold text-white shadow hover:bg-[#8d3754] transition"
                  >
                    J'ai compris ✓
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL : PARAMÈTRES DE CONFIDENTIALITÉ & ÉTHIQUE DES DONNÉES           */}
        {/* ==================================================================== */}
        {showPrivacyModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:absolute sm:rounded-[36px]"
            onClick={() => setShowPrivacyModal(false)}
          >
            <div
              className="ph-enter max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl border border-[#ecd5df]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* En-tête du modal */}
              <div className="flex items-center justify-between border-b border-[#f2e1e7] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#580e36]">
                      Confidentialité & Données
                    </h3>
                    <p className="text-[10px] text-emerald-700 font-bold">
                      Zero Tracking · Local-First · Éthique Médicale
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="rounded-full p-1.5 text-[#725261] hover:bg-[#faedf2]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Contenu */}
              <div className="mt-3 space-y-3.5 text-xs">
                {/* Cartouche d'explication pédagogique */}
                <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-3.5 text-[#20432f] space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900">
                    <Shield size={14} className="text-emerald-700" />
                    <span>Nos engagements éthiques stricts</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] leading-relaxed text-[#2c523c]">
                    <li className="flex items-start gap-1.5">
                      <Check size={13} className="shrink-0 text-emerald-600 mt-0.5" />
                      <span><strong>Aucune donnée personnelle n'est collectée</strong> par l'application sans votre demande expresse. Vos règles et notes restent 100% sur votre téléphone.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={13} className="shrink-0 text-emerald-600 mt-0.5" />
                      <span><strong>Entraînement de Rose IA</strong> : Seules les recommandations certifiées par les <strong>docteurs, sages-femmes et associations</strong> alimentent l'IA pour la rendre naturelle, empathique et culturellement adaptée (Français, Mooré, Dioula).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={13} className="shrink-0 text-emerald-600 mt-0.5" />
                      <span><strong>Partage médical sur demande uniquement</strong> : En cas de nodule suspect ou d'urgence, vous choisissez explicitement si vous transmettez votre fiche à un centre.</span>
                    </li>
                  </ul>
                </div>

                {/* Paramètres interactifs / Toggles */}
                <div className="space-y-2.5">
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#7a4c60]">
                    Vos réglages de confidentialité
                  </p>

                  {/* Toggle 1 : Stockage 100% Local */}
                  <label className="flex items-center justify-between rounded-xl border border-[#edd7e1] bg-[#fffcfd] p-3 cursor-pointer hover:bg-pink-50/50 transition">
                    <div className="pr-2">
                      <span className="font-bold text-[#580e36] text-xs block">
                        Stockage 100% Local (Cycle & Calendrier)
                      </span>
                      <span className="text-[10px] text-[#785968] leading-tight block mt-0.5">
                        Vos dates de règles et autopalpations restent enregistrées uniquement dans la mémoire de cet appareil.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.localOnlyCycle}
                      onChange={(e) =>
                        setPrivacySettings({ ...privacySettings, localOnlyCycle: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-[#ea2d6d] focus:ring-[#ea2d6d]"
                    />
                  </label>

                  {/* Toggle 2 : Protocoles cliniques IA */}
                  <label className="flex items-center justify-between rounded-xl border border-[#edd7e1] bg-[#fffcfd] p-3 cursor-pointer hover:bg-pink-50/50 transition">
                    <div className="pr-2">
                      <span className="font-bold text-[#580e36] text-xs block">
                        Entraînement de Rose IA par les soignants
                      </span>
                      <span className="text-[10px] text-[#785968] leading-tight block mt-0.5">
                        Permet de recevoir les protocoles médicaux validés par les médecins du Burkina Faso pour des réponses naturelles.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.contributeAiClinical}
                      onChange={(e) =>
                        setPrivacySettings({ ...privacySettings, contributeAiClinical: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-[#ea2d6d] focus:ring-[#ea2d6d]"
                    />
                  </label>

                  {/* Toggle 3 : Soutien aux associations */}
                  <label className="flex items-center justify-between rounded-xl border border-[#edd7e1] bg-[#fffcfd] p-3 cursor-pointer hover:bg-pink-50/50 transition">
                    <div className="pr-2">
                      <span className="font-bold text-[#580e36] text-xs block">
                        Statistiques anonymisées pour les Associations
                      </span>
                      <span className="text-[10px] text-[#785968] leading-tight block mt-0.5">
                        Aide les ONG (ex: ABAC, Espoir pour Demain) à cibler les campagnes de dépistage selon la fréquentation régionale.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.anonymizedAssociationData}
                      onChange={(e) =>
                        setPrivacySettings({ ...privacySettings, anonymizedAssociationData: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-[#ea2d6d] focus:ring-[#ea2d6d]"
                    />
                  </label>

                  {/* Toggle 4 : Partage clinique uniquement sur demande */}
                  <label className="flex items-center justify-between rounded-xl border border-[#edd7e1] bg-[#fffcfd] p-3 cursor-pointer hover:bg-pink-50/50 transition">
                    <div className="pr-2">
                      <span className="font-bold text-[#580e36] text-xs block">
                        Transmission médicale sur demande expresse
                      </span>
                      <span className="text-[10px] text-[#785968] leading-tight block mt-0.5">
                        Exiger une confirmation par code PIN ou clic avant d'adresser une fiche d'orientation à un médecin référent.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.urgentClinicalConsent}
                      onChange={(e) =>
                        setPrivacySettings({ ...privacySettings, urgentClinicalConsent: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-[#ea2d6d] focus:ring-[#ea2d6d]"
                    />
                  </label>
                </div>

                {/* Section Droit à l'oubli / Purge */}
                <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                      <ShieldAlert size={14} className="text-rose-700" /> Droit à l'oubli immédiat
                    </span>
                    <span className="text-[9.5px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                      RGPD & Éthique
                    </span>
                  </div>
                  <p className="text-[10.5px] text-rose-800 leading-snug">
                    Vous pouvez à tout moment effacer instantanément l'ensemble de votre historique, vos rappels et vos messages stockés sur ce téléphone.
                  </p>
                  <button
                    onClick={handleClearAllLocalData}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white border border-rose-300 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-xs"
                  >
                    <RotateCcw size={13} /> Purger toutes mes données locales
                  </button>
                </div>

                {/* Bouton de sauvegarde */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setShowPrivacyModal(false)}
                    className="flex-1 rounded-2xl border border-[#debcc8] py-2.5 font-bold text-[#6d4d5d]"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={handleSavePrivacySettings}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 py-2.5 font-bold text-white shadow-md hover:from-emerald-500 hover:to-teal-600 transition"
                  >
                    Enregistrer mes choix
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL : SIMULATION DU PARCOURS D'ENTRAÎNEMENT DE ROSE IA PAR LE DOCTEUR */}
        {/* ==================================================================== */}
        {showDoctorTrainModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:absolute sm:rounded-[36px]"
            onClick={() => setShowDoctorTrainModal(false)}
          >
            <div
              className="ph-enter max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl border border-[#ecd5df]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* En-tête */}
              <div className="flex items-center justify-between border-b border-[#f2e1e7] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-800">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#580e36]">
                      Entraînement Clinique Rose IA
                    </h3>
                    <p className="text-[10px] text-amber-800 font-bold">
                      Parcours Soignant · Étape {doctorTrainStep}/4
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDoctorTrainModal(false)}
                  className="rounded-full p-1.5 text-[#725261] hover:bg-[#faedf2]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Indicateur visuel d'étapes (1 -> 2 -> 3 -> 4) */}
              <div className="mt-3 flex items-center justify-between px-1">
                {[
                  { step: 1, label: "Thème" },
                  { step: 2, label: "Protocole" },
                  { step: 3, label: "Simulation" },
                  { step: 4, label: "Signature" },
                ].map((item) => (
                  <div key={item.step} className="flex flex-col items-center flex-1">
                    <div
                      className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold transition ${
                        doctorTrainStep === item.step
                          ? "bg-amber-500 text-white shadow-md ring-2 ring-amber-300"
                          : doctorTrainStep > item.step
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {doctorTrainStep > item.step ? <Check size={13} /> : item.step}
                    </div>
                    <span
                      className={`text-[9px] font-semibold mt-1 ${
                        doctorTrainStep === item.step ? "text-amber-800 font-bold" : "text-gray-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* ÉTAPE 1 : Choix ou Saisie du Thème Clinique */}
              {doctorTrainStep === 1 && (
                <div className="mt-4 space-y-3 text-xs">
                  <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-3 text-amber-950">
                    <p className="font-bold text-xs flex items-center gap-1.5 text-amber-900">
                      <Stethoscope size={14} /> Objectif de la simulation
                    </p>
                    <p className="text-[11px] text-amber-900/90 mt-1 leading-relaxed">
                      En tant que docteur, sage-femme ou agent de santé, vous enrichissez la base de connaissances de Rose IA avec vos protocoles cliniques locaux. Choisissez un cas concret :
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#7a4c60]">
                      Cas cliniques & Recommandations présélectionnées :
                    </p>

                    {/* Presets de thèmes */}
                    <button
                      type="button"
                      onClick={() =>
                        handleSelectDoctorPresetTopic(
                          "Permanence urgences mammaires & Nodule suspect",
                          "Pour toute patiente présentant un nodule dur et indolore, accueil sans rendez-vous tous les matins au service d'imagerie. Mammographie et échographie sous 48h.",
                          "Ma sœur, rassure-toi : un nodule n'est pas forcément grave, mais ton corps mérite toute notre attention. Viens directement sans rendez-vous au CMA Schiphra ou CHU Bogodogo dès demain matin à 08h. Une sage-femme et un radiologue vont t'examiner avec douceur.",
                          "M maaso, da zoe rabeem ye: bõn-kʋdga pa bãag fãa ye, la yaa tɩlae tɩ d ges-a tao-tao. Wa-y zĩigẽ zaabre n mik dɔgɔtɔrã tɩ b ges yãmba ne laafi.",
                          "N ma muso, kana siran : fɛn o fɛn bɛ sin na, a bɛɛ tɛ bana juguman ye. Nka taga kɛnɛyaso la jona sɔgɔma fɛ walasa dɔgɔtɔrɔmuso ka lajɛ saniya kɛ.",
                          "J'ai senti une boule un peu dure dans mon sein droit qui ne me fait pas mal, est-ce que je dois m'inquiéter ?"
                        )
                      }
                      className="w-full text-left p-3 rounded-2xl border border-pink-200 bg-[#fffbfc] hover:bg-pink-50 transition space-y-1 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#8a2d4f] text-xs">🩺 Nodule suspect & Urgences mammaires</span>
                        <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">Priorité 48h</span>
                      </div>
                      <p className="text-[10.5px] text-[#6b4c5b]">
                        Accueil direct sans rendez-vous au CMA Schiphra ou CHU Bogodogo + protocole rassurant.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleSelectDoctorPresetTopic(
                          "Douleurs de règles aiguës & Endométriose",
                          "Des règles très douloureuses incapacitantes ne sont pas normales. Exclure l'endométriose par échographie pelvienne dédiée. Éviter l'automédication prolongée aux anti-inflammatoires.",
                          "Chère sœur, souffrir pendant ses règles n'est pas une fatalité. Si la douleur t'empêche de travailler ou dormir, ce n'est pas une faiblesse. Consulte un gynécologue pour rechercher une endométriose. En attendant, privilégie une bouillotte tiède et l'infusion de gingembre doux.",
                          "M yaanga, rog-n-mik bãag sã n namsd foo wakat fãa, pa yel-bãanega ye. Taga dɔgɔtɔr n bãng a võore.",
                          "N ba den muso, dimi min bɛ kɛ muso kɔnɔ fɛ kalo o kalo, ni a ka bon kosɛbɛ, a tɛ foyi ye fo ka dɔgɔtɔrɔ sɔrɔ.",
                          "Mes règles me font tellement mal que je ne peux pas me lever du lit, ma mère me dit que c'est normal pour une femme ?"
                        )
                      }
                      className="w-full text-left p-3 rounded-2xl border border-pink-200 bg-[#fffbfc] hover:bg-pink-50 transition space-y-1 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#8a2d4f] text-xs">🌸 Règles douloureuses & Endométriose</span>
                        <span className="text-[9px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">Santé globale</span>
                      </div>
                      <p className="text-[10.5px] text-[#6b4c5b]">
                        Démystification de la souffrance des règles + orientation gynécologique pelvienne.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleSelectDoctorPresetTopic(
                          "Nutrition sahélienne fortifiante & Immunité",
                          "Recommander l'apport en antioxydants locaux : feuilles de moringa (en poudre dans la sauce), jus de pain de singe (baobab riche en vitamine C) et graines de sésame pour l'équilibre hormonal.",
                          "Pour prendre soin de ta santé et de ta vitalité au Burkina Faso, nos plantes sont des trésors : une cuillère de moringa dans ton repas et du jus de baobab naturel renforcent tes défenses sans aucun produit chimique nocif.",
                          "D tɩɩsã ne d rɩɩbã yaa arzɛka : arzɛk-tɩɩga (moringa) la toedga n kõt yĩns-laafi wʋsgo.",
                          "An ka siriw ni jiriw bɛ fanga di : arjanayiri (moringa) ni zira ji bɛ muso fanga gɛlɛya kosɛbɛ.",
                          "Quels aliments locaux du pays puis-je consommer pour renforcer mon corps et mes seins ?"
                        )
                      }
                      className="w-full text-left p-3 rounded-2xl border border-pink-200 bg-[#fffbfc] hover:bg-pink-50 transition space-y-1 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#8a2d4f] text-xs">🌿 Nutrition locale (Moringa & Baobab)</span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Prévention</span>
                      </div>
                      <p className="text-[10.5px] text-[#6b4c5b]">
                        Conseils nutritionnels sahéliens bienveillants intégrés naturellement par Rose IA.
                      </p>
                    </button>
                  </div>

                  {/* Saisie personnalisée */}
                  <div className="pt-2 border-t border-gray-100">
                    <label className="block text-[11px] font-bold text-[#580e36] mb-1">
                      Ou définissez un autre thème médical :
                    </label>
                    <input
                      type="text"
                      value={doctorTeachTopic}
                      onChange={(e) => setDoctorTeachTopic(e.target.value)}
                      placeholder="Ex : Palpation axillaire, Allaitement et crevasses..."
                      className="w-full rounded-xl border border-gray-300 p-2 text-xs font-semibold text-[#580e36]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setDoctorTrainStep(2)}
                    className="w-full rounded-2xl bg-amber-500 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-600 transition"
                  >
                    Passer à la formulation médicale (Étape 2) →
                  </button>
                </div>
              )}

              {/* ÉTAPE 2 : Saisie du Protocole Clinique & Reformulation Multilingue */}
              {doctorTrainStep === 2 && (
                <div className="mt-4 space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-[#580e36] mb-1">
                      Thème clinique sélectionné :
                    </label>
                    <input
                      type="text"
                      value={doctorTeachTopic}
                      onChange={(e) => setDoctorTeachTopic(e.target.value)}
                      className="w-full rounded-xl border border-amber-300 bg-amber-50/50 p-2 text-xs font-bold text-amber-950"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#580e36] mb-1">
                      Recommandation clinique stricte du praticien :
                    </label>
                    <textarea
                      rows={3}
                      value={doctorTeachContent}
                      onChange={(e) => setDoctorTeachContent(e.target.value)}
                      placeholder="Consignes médicales précises, bilans recommandés, centres d'orientation..."
                      className="w-full rounded-xl border border-gray-300 p-2 text-xs text-[#580e36]"
                    />
                  </div>

                  {/* Vulgarisation empathique multilingue générée pour Rose IA */}
                  <div className="rounded-2xl border border-pink-200 bg-[#fff9fb] p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#8a2d4f] flex items-center gap-1.5">
                        <Sparkles size={14} className="text-amber-500" /> Adaptation Empathique Rose IA
                      </span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        3 Langues
                      </span>
                    </div>

                    <p className="text-[10px] text-[#785968] leading-tight">
                      Rose IA convertit le jargon médical en parole douce, sans tabou et respectueuse des pudeurs sahéliennes :
                    </p>

                    {/* Français */}
                    <div className="rounded-xl bg-white p-2.5 border border-pink-100 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#ea2d6d]">
                        <span>🇫🇷 En Français facile :</span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(doctorEmpathicReformulation.fr, "fr")}
                          className="flex items-center gap-1 text-[9.5px] text-[#ea2d6d] hover:underline"
                        >
                          <Volume2 size={12} /> Écouter
                        </button>
                      </div>
                      <p className="text-[#580e36] leading-relaxed">{doctorEmpathicReformulation.fr}</p>
                    </div>

                    {/* Mooré */}
                    <div className="rounded-xl bg-white p-2.5 border border-pink-100 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-emerald-700">
                        <span>🇧🇫 En Mooré (Traduction bienveillante) :</span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(doctorEmpathicReformulation.moore, "moore")}
                          className="flex items-center gap-1 text-[9.5px] text-emerald-700 hover:underline"
                        >
                          <Volume2 size={12} /> Écouter
                        </button>
                      </div>
                      <p className="text-[#334e3e] italic leading-relaxed">{doctorEmpathicReformulation.moore}</p>
                    </div>

                    {/* Dioula */}
                    <div className="rounded-xl bg-white p-2.5 border border-pink-100 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-purple-700">
                        <span>🇧🇫 En Dioula (Traduction bienveillante) :</span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(doctorEmpathicReformulation.dioula, "dioula")}
                          className="flex items-center gap-1 text-[9.5px] text-purple-700 hover:underline"
                        >
                          <Volume2 size={12} /> Écouter
                        </button>
                      </div>
                      <p className="text-[#402e48] italic leading-relaxed">{doctorEmpathicReformulation.dioula}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDoctorTrainStep(1)}
                      className="rounded-2xl border border-gray-300 px-4 py-2.5 font-bold text-gray-700"
                    >
                      ← Retour
                    </button>
                    <button
                      type="button"
                      onClick={handleRunDoctorTestSimulation}
                      className="flex-1 rounded-2xl bg-amber-500 py-2.5 font-bold text-white shadow-md hover:bg-amber-600 transition"
                    >
                      Lancer la simulation en direct (Étape 3) →
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 3 : Test en Direct Patiente ↔ Rose IA */}
              {doctorTrainStep === 3 && (
                <div className="mt-4 space-y-3.5 text-xs">
                  <div className="rounded-2xl bg-slate-900 text-white p-3.5 shadow-md space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={13} /> Banc d'essai en direct
                      </span>
                      <span className="text-[9.5px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono">
                        Mode Simulation
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Vérifions comment Rose IA répond à une question posée spontanément par une femme :
                    </p>
                  </div>

                  {/* Bulle Question de la Patiente */}
                  <div className="rounded-2xl bg-purple-50 border border-purple-200 p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-purple-900 flex items-center gap-1">
                        👩 Patiente (Question posée) :
                      </span>
                      <span className="text-[9px] text-purple-600">Voix ou Texte</span>
                    </div>
                    <textarea
                      rows={2}
                      value={doctorTestQuestion}
                      onChange={(e) => setDoctorTestQuestion(e.target.value)}
                      className="w-full rounded-xl border border-purple-200 bg-white p-2 text-xs font-semibold text-purple-950"
                    />
                  </div>

                  {/* Bouton pour déclencher la réponse */}
                  {!doctorTestAnswer && (
                    <button
                      type="button"
                      onClick={() =>
                        setDoctorTestAnswer(
                          doctorEmpathicReformulation.fr ||
                            "Ma sœur, rassure-toi. Suite aux recommandations de nos docteurs référents..."
                        )
                      }
                      className="w-full rounded-2xl bg-gradient-to-r from-[#ea2d6d] to-[#734059] py-2.5 font-bold text-white shadow hover:opacity-95 transition flex items-center justify-center gap-2"
                    >
                      <Sparkles size={15} /> Voir la réponse générée par Rose IA
                    </button>
                  )}

                  {/* Bulle Réponse Rose IA */}
                  {doctorTestAnswer && (
                    <div className="rounded-2xl bg-gradient-to-br from-[#fff7fa] to-[#fff0f4] border-2 border-emerald-300 p-3.5 space-y-2 ph-enter">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#8a2d4f] flex items-center gap-1.5">
                          <Sparkles size={14} className="text-amber-500" /> Rose IA (Réponse avec protocole docteur) :
                        </span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(doctorTestAnswer, "fr")}
                          className="flex items-center gap-1 text-[10px] font-bold text-[#ea2d6d] bg-pink-100 px-2 py-0.5 rounded-full hover:bg-pink-200"
                        >
                          <Volume2 size={13} /> Écouter
                        </button>
                      </div>

                      <p className="text-xs text-[#580e36] leading-relaxed">
                        {doctorTestAnswer}
                      </p>

                      <div className="flex items-center gap-1.5 text-[9.5px] text-emerald-800 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        <span>Protocole respecté à 100% : Empathie locale + Orientation sans délai.</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDoctorTrainStep(2)}
                      className="rounded-2xl border border-gray-300 px-4 py-2.5 font-bold text-gray-700"
                    >
                      ← Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => setDoctorTrainStep(4)}
                      className="flex-1 rounded-2xl bg-amber-500 py-2.5 font-bold text-white shadow-md hover:bg-amber-600 transition"
                    >
                      Valider et passer à la signature (Étape 4) →
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 4 : Signature Officielle & Ingestion dans Rose IA */}
              {doctorTrainStep === 4 && (
                <div className="mt-4 space-y-3.5 text-xs">
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-3.5 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-200 text-emerald-800 font-bold">
                        <CheckCheck size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-950 text-xs">Prêt pour signature médicale</h4>
                        <p className="text-[10px] text-emerald-800 font-semibold">
                          Attestation de conformité déontologique & éthique
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-white p-2.5 border border-emerald-200 text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Sujet validé :</span>
                        <span className="font-bold text-[#580e36] truncate max-w-[200px]">{doctorTeachTopic}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Langues certifiées :</span>
                        <span className="font-bold text-emerald-700">Français · Mooré · Dioula</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date d'effet :</span>
                        <span className="font-bold text-gray-800">Immédiate (16 Octobre 2026)</span>
                      </div>
                    </div>
                  </div>

                  {/* Champs de signature du médecin */}
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#580e36] mb-1">
                        Nom et Prénom du praticien référent :
                      </label>
                      <input
                        type="text"
                        value={doctorSignName}
                        onChange={(e) => setDoctorSignName(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 p-2 text-xs font-bold text-[#580e36]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#580e36] mb-1">
                        Titre clinique & Hôpital d'exercice :
                      </label>
                      <input
                        type="text"
                        value={doctorSignRole}
                        onChange={(e) => setDoctorSignRole(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 p-2 text-xs font-semibold text-[#580e36]"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-[10px] text-slate-600 space-y-1">
                    <p className="font-bold text-slate-800 flex items-center gap-1">
                      <Lock size={12} className="text-slate-500" /> Engagement déontologique :
                    </p>
                    <p className="leading-tight">
                      En signant, vous attestez que ces instructions médicales et leurs vulgarisations ont été vérifiées et ne violent aucun secret médical. Aucune donnée privée de patiente n'est ingérée.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDoctorTrainStep(3)}
                      className="rounded-2xl border border-gray-300 px-4 py-2.5 font-bold text-gray-700"
                    >
                      ← Revoir test
                    </button>
                    <button
                      type="button"
                      onClick={handleFinalizeDoctorTraining}
                      className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 py-3 text-xs font-bold text-white shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={16} /> Signer & Intégrer dans Rose IA
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL : VIDÉO DÉMONSTRATIVE D'AUTOPALPATION AVEC SAGE-FEMME AFRICAINE */}
        {/* ==================================================================== */}
        {showAutopalpationVideoModal && (
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
                    <h3 className="ph-display text-sm font-bold text-[#580e36]">
                      Vidéo Guidée d'Autopalpation
                    </h3>
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
                            videoSpeed === spd
                              ? "bg-[#ea2d6d] text-white font-extrabold"
                              : "text-white/75 hover:text-white"
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
                        Debout devant votre miroir, bras le long du corps puis levés au-dessus de la tête. Observez l'aspect général des deux seins : peau d'orange, rougeur, fossette ou mamelon qui se rétracte vers l'intérieur.
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
                        Allongée confortablement ou sous la douche (avec du savon doux). Utilisez la pulpe des 3 doigts du milieu (index, majeur, annulaire) à plat. Décrivez de petits cercles réguliers du pourtour extérieur vers le mamelon.
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
                        Le tissu mammaire s'étend jusqu'au creux de l'aisselle et sous la clavicule. Palpez soigneusement cette zone pour vérifier l'absence de ganglion dur ou de nodule profond.
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
                        Pincez très délicatement le mamelon entre le pouce et l'index. Vérifiez qu'aucun liquide (clair, jaunâtre ou sanglant) ne s'écoule spontanément.
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
        )}

        {/* ==================================================================== */}
        {/* MODAL : AFFICHE D'ÉVÉNEMENT EN GRAND FORMAT ZOOMÉ                    */}
        {/* ==================================================================== */}
        {selectedPosterModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:absolute sm:rounded-[36px]"
            onClick={() => setSelectedPosterModal(null)}
          >
            <div
              className="ph-enter max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-[28px] bg-slate-950 p-4 text-white shadow-2xl border border-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="min-w-0 pr-2">
                  <h3 className="ph-display text-sm font-bold text-white truncate">
                    {selectedPosterModal.title}
                  </h3>
                  <p className="text-[10px] text-pink-400 font-bold truncate">
                    {selectedPosterModal.author}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPosterModal(null)}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-3 overflow-hidden rounded-2xl border border-slate-800 bg-black">
                <img
                  src={selectedPosterModal.url}
                  alt={selectedPosterModal.title}
                  className="w-full object-contain max-h-[65vh] mx-auto"
                />
              </div>

              {selectedPosterModal.caption && (
                <p className="mt-2 text-center text-[10.5px] text-slate-300 italic">
                  {selectedPosterModal.caption}
                </p>
              )}

              <button
                type="button"
                onClick={() => setSelectedPosterModal(null)}
                className="mt-3 w-full rounded-2xl bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition"
              >
                Fermer l'affiche
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TOAST DE NOTIFICATION                                                */}
        {/* ==================================================================== */}
        <Toast />
      </div>
    </main>
  );
}
