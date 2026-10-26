import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  CalendarDays,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Gift,
  GraduationCap,
  Headphones,
  Heart,
  HeartHandshake,
  Languages,
  Lock,
  LogOut,
  MapPin,
  Megaphone,
  Menu,
  MessageCircle,
  Mic,
  Navigation,
  Pause,
  Phone,
  Play,
  RotateCcw,
  Search,
  Send,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Stethoscope,
  User,
  UserPlus,
  UsersRound,
  Volume2,
  X,
} from "lucide-react";
import type { AdminType, Section } from "../types";
import { hapticFeedback } from "../lib/haptique";
import { getProfileIdentity } from "../lib/identiteProfil";
import { roseDailyTips } from "../donnees/conseilsRose";
import { lessons } from "../donnees/lecons";
import { partnerAssociations } from "../donnees/associations";
import { useUi, useAuth, useDemarrage, useAudio, useCentres, useOrientations, useSante, useRose, useDocteur, useEducation, useAnnonces, useDons, useAdministration, useLangue } from "../etat/contextes";

/**
 * Coquille de l'application : cadre smartphone, en-tête, contenu des onglets,
 * barre de navigation, modales et notifications.
 */
export function Coquille() {
  const { appLanguage, appShareUrl, deferredPrompt, handleTriggerInstall, isOffline, isStandaloneApp, mainScrollRef, notify, section, setSection, setShowLanguageMenu, setShowProfileMenu, setShowPwaInstallModal, setSidebarOpen, setSmsLanguage, showProfileMenu, showPwaInstallModal, sidebarOpen, smsLanguage, toast } = useUi();
  const { authMode, currentUser, handleLoginSubmit, handleLogout, handleRegisterSubmit, loginForm, pendingRegistrations, quickLoginAs, registerForm, setAuthMode, setCurrentUser, setLoginForm, setRegisterForm, setShowConfirmPassword, setShowPassword, showConfirmPassword, showPassword } = useAuth();
  const { setShowSplash, showSplash, splashProgress } = useDemarrage();
  const { audioProgress, handlePlayAudio, isPlaying, setAudioProgress, setIsPlaying, setSpeechLanguage, speechLanguage } = useAudio();
  const { centerUpdateData, centers, cityFilter, filteredCenters, handleSaveCenterUpdate, mapContainerRef, mapInstanceRef, openNavigation, searchQuery, selectedCenter, setCenterUpdateData, setCityFilter, setSearchQuery, setSelectedCenter, setShowCenterUpdateModal, setStatusFilter, setViewMode, showCenterUpdateModal, statusFilter, viewMode } = useCentres();
  const { generatedOrientationCode, handleCreatePatientOrientation, handleValidateOrientationByCenter, orientationForm, setGeneratedOrientationCode, setOrientationForm, setShowOrientationModal, showOrientationModal, urgentOrientations } = useOrientations();
  const { cycleHistory, cycleInfo, cycleLengthDays, handleClearAllLocalData, handleRecalibratePeriod, handleSavePrivacySettings, lastAutopalpationDate, lastPeriodDate, newReminderDate, newReminderTitle, newReminderType, privacySettings, realPeriodDateInput, recalibrationFeedback, reminders, setAutopalpationDoneThisMonth, setLastAutopalpationDate, setNewReminderDate, setNewReminderTitle, setNewReminderType, setPrivacySettings, setRealPeriodDateInput, setReminders, setShowCycleHistory, setShowNewReminderForm, setShowPrivacyModal, setShowRecalibrateBox, showCycleHistory, showNewReminderForm, showPrivacyModal, showRecalibrateBox } = useSante();
  const { dailyTipIndex, dailyTipLang, handleRequestNotification, handleSendRoseMessage, handleToggleVoiceRecognition, isRecordingVoice, notificationEnabled, roseChatBottomRef, roseInput, roseMessages, setDailyTipIndex, setDailyTipLang, setRoseInput } = useRose();
  const { doctorEmpathicReformulation, doctorSignName, doctorSignRole, doctorTeachContent, doctorTeachTopic, doctorTestAnswer, doctorTestQuestion, doctorTrainStep, handleFinalizeDoctorTraining, handleRunDoctorTestSimulation, handleSelectDoctorPresetTopic, setDoctorSignName, setDoctorSignRole, setDoctorTeachContent, setDoctorTeachTopic, setDoctorTestAnswer, setDoctorTestQuestion, setDoctorTrainStep, setShowDoctorTrainModal, showDoctorTrainModal } = useDocteur();
  const { activeLesson, formatVideoTime, selectedVideoStep, setActiveLesson, setSelectedVideoStep, setShowAutopalpationVideoModal, setVideoIsPlaying, setVideoLang, setVideoProgressSeconds, setVideoSpeed, showAutopalpationVideoModal, videoIsPlaying, videoLang, videoProgressSeconds, videoSpeed } = useEducation();
  const { announcements, announcementsFilter, displayedAnnouncements, handleApproveAndPushAnnouncement, handleApproveAnnouncement, handlePublishAnnouncementSubmit, handleRejectAnnouncement, newAnnouncement, selectedPosterModal, setAnnouncementsFilter, setNewAnnouncement, setSelectedPosterModal, setShowNewAnnouncementModal, showNewAnnouncementModal } = useAnnonces();
  const { customDonationAmount, donationAmount, donationStep, handleConfirmOrangeMoney, handleStartDonationProcess, handleValidateOrangeMoneyOTP, isAnonymousDonation, lastDonationId, orangeMoneyPhone, otpCode, selectedAssociation, setCustomDonationAmount, setDonationAmount, setDonationStep, setIsAnonymousDonation, setOrangeMoneyPhone, setOtpCode, setSelectedAssociation, setShowDonationModal, showDonationModal } = useDons();
  const { handleApproveRegistration, handleRejectRegistration, setShowAdminDashboardModal, setShowSuperadminModal, setSuperadminActiveTab, setSuperadminAnnouncementTab, setSuperadminRegionFilter, showAdminDashboardModal, showSuperadminModal, superadminActiveTab, superadminAnnouncementTab, superadminRegionFilter, superadminSortedCenters } = useAdministration();
  const { handleSelectAppLanguage } = useLangue();

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
        {showSplash && (
          <div className="absolute inset-0 z-50 flex flex-col justify-between overflow-hidden bg-[#fff0f5] text-[#580e36] ph-enter sm:rounded-[36px]">
            {/* Image de fond plein écran : Femmes & Médecin en blouse avec rubans roses */}
            <div className="absolute inset-0">
              <img
                src="/images/splash-paglaafi-heroines.jpg"
                alt="Solidarité PagLaafi - Lutte contre le cancer du sein au Burkina Faso"
                className="h-full w-full object-cover object-top transform scale-100 transition-transform duration-5000 ease-out"
              />
              {/* Voile supérieur subtil pour contraster l'en-tête sans masquer les visages */}
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/70 via-white/20 to-transparent pointer-events-none" />
              {/* Voile inférieur dégradé doux pour assurer la lisibilité sur la partie texte */}
              <div className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-[#fff5f8] via-[#fff5f8]/95 via-45% to-transparent pointer-events-none" />
            </div>

            {/* En-tête du Splash : Drapeau et bouton passer */}
            <div className="relative z-10 flex items-center justify-between p-4 pt-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-pink-300/60 bg-white/85 px-3 py-1.5 text-[11px] font-bold text-[#580e36] backdrop-blur-md shadow-xs">
                <span>🇧🇫</span>
                <span>Burkina Faso</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  hapticFeedback(15);
                  setShowSplash(false);
                  setCurrentUser(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-pink-300/60 bg-white/85 px-3.5 py-1.5 text-[11px] font-bold text-[#580e36] backdrop-blur-md hover:bg-white transition shadow-xs active:scale-95"
              >
                <span>Passer</span>
                <ChevronRight size={13} className="text-[#ea2d6d]" />
              </button>
            </div>

            {/* Pied de page du Splash : Logo agrandi, Titre, Slogan, Icônes réorganisées et barre de chargement de 5 secondes */}
            <div className="relative z-10 p-5 pb-7 text-center">
              {/* Logo PagLaafi agrandi avec mise en valeur */}
              <div className="mx-auto mb-2.5 flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-2.5 shadow-[0_10px_25px_rgba(234,45,109,0.22)] ring-4 ring-[#ea2d6d]/20 transition-transform duration-300 hover:scale-105">
                <img
                  src="/images/pinkhub-mvp-paglaafi.png"
                  alt="Logo PagLaafi"
                  className="h-full w-full object-contain"
                />
              </div>

              <h1 className="ph-display text-3xl font-extrabold tracking-tight text-[#580e36] drop-shadow-xs">
                PagLaafi
              </h1>
              <p className="mt-1 text-[13px] font-bold text-[#ea2d6d] tracking-wide">
                Mieux s'informer · Mieux s'orienter · Jamais seule
              </p>
              <p className="mx-auto mt-1 max-w-[320px] text-[11px] font-medium leading-tight text-[#783e58]">
                Sensibilisation, dépistage précoce du cancer du sein & accompagnement solidaire au Burkina Faso
              </p>

              {/* Icônes de réassurance et services clés réorganisées */}
              <div className="mx-auto mt-3 flex items-center justify-center gap-2 max-w-[360px]">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-200/90 bg-white/90 px-2.5 py-1 text-[10.5px] font-semibold text-[#580e36] shadow-xs backdrop-blur-sm">
                  <Stethoscope size={12} className="text-[#ea2d6d]" />
                  <span>Dépistage</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-200/90 bg-white/90 px-2.5 py-1 text-[10.5px] font-semibold text-[#580e36] shadow-xs backdrop-blur-sm">
                  <MapPin size={12} className="text-[#ea2d6d]" />
                  <span>Centres de santé</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-200/90 bg-white/90 px-2.5 py-1 text-[10.5px] font-semibold text-[#580e36] shadow-xs backdrop-blur-sm">
                  <HeartHandshake size={12} className="text-[#ea2d6d]" />
                  <span>Écoute solidaire</span>
                </div>
              </div>

              {/* Barre de progression animée de 5 secondes */}
              <div className="mx-auto mt-4 max-w-[270px]">
                <div className="h-2 w-full overflow-hidden rounded-full bg-pink-200/60 shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#580e36] via-[#ea2d6d] to-pink-400 transition-all duration-75 ease-linear shadow-[0_0_10px_rgba(234,45,109,0.7)]"
                    style={{ width: `${splashProgress}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[10.5px] font-semibold text-[#6a2948]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[#ea2d6d] animate-spin" />
                    <span>Chargement de votre espace santé...</span>
                  </span>
                  <span className="font-mono text-[11px] font-bold text-[#580e36]">
                    {Math.max(0, Math.ceil((5000 - splashProgress * 50) / 1000))}s
                  </span>
                </div>
              </div>

              {/* Badge d'autorité et précision en bas */}
              <div className="mt-3.5 inline-flex items-center gap-2 rounded-full border border-pink-300/80 bg-white/90 px-3.5 py-1.5 text-[10.5px] font-bold text-[#580e36] shadow-xs backdrop-blur-md">
                <ShieldCheck size={13} className="text-[#ea2d6d]" />
                <span>Plateforme Nationale de Santé · Propulsé par Rose IA</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* BARRE LATÉRALE (SIDEBAR)                                             */}
        {/* ==================================================================== */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm sm:absolute sm:rounded-[36px]"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="relative flex h-full w-[84%] max-w-[325px] flex-col bg-[#fffaf9] p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/images/pinkhub-mvp-paglaafi.png"
                    alt="Logo PagLaafi"
                    className="h-10 w-10 object-contain mix-blend-multiply"
                  />
                  <div>
                    <h2 className="ph-display text-lg font-bold text-[#580e36]">PagLaafi</h2>
                    <p className="text-[10px] font-medium text-[#92546e]">Burkina Faso</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full text-[#815568] hover:bg-[#f8e7ec]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Statut de profil dans le menu avec icône adaptée */}
              {(() => {
                const drawerIdentity = getProfileIdentity(currentUser);
                return (
                  <div className="mt-3 rounded-2xl bg-[#f9edf1] p-3 text-xs border border-[#f0d8e1]">
                    {currentUser ? (
                      <div className="flex items-center gap-3">
                        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${drawerIdentity.bg} ${drawerIdentity.text} border ${drawerIdentity.border} shadow-xs`}>
                          {drawerIdentity.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${drawerIdentity.badgeBg}`}>
                            {currentUser.roleLabel}
                          </span>
                          <p className="mt-0.5 font-bold text-[#580e36] truncate">{currentUser.prenom} {currentUser.nom}</p>
                          <p className="text-[10px] text-[#7d5d6c] truncate">{currentUser.telephone}</p>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setSidebarOpen(false); setAuthMode("login"); }}
                        className="flex w-full items-center justify-between font-bold text-[#913b5b]"
                      >
                        <span className="flex items-center gap-2">
                          <User size={16} /> Se connecter / Créer un compte
                        </span>
                        <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Raccourci Superadmin National */}
              {currentUser?.role === "superadmin" && (
                <div className="mt-2.5">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setShowSuperadminModal(true);
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-purple-900 px-3 py-2 text-xs font-bold text-white shadow"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldAlert size={15} className="text-amber-300" /> Panneau Superadmin
                    </span>
                    <span className="rounded-full bg-amber-400 px-1.5 py-0.2 text-[9px] font-extrabold text-purple-950">
                      {announcements.filter((a) => a.status === "pending_validation").length + pendingRegistrations.filter((r) => r.status === "pending").length}
                    </span>
                  </button>
                </div>
              )}

              {/* Tableau de bord statistique pour TOUS les administrateurs */}
              {(currentUser?.role === "admin" || currentUser?.role === "superadmin") && (
                <div className="mt-2">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setShowAdminDashboardModal(true);
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-[#522538] px-3 py-2 text-xs font-bold text-white shadow"
                  >
                    <span className="flex items-center gap-2">
                      <BarChart3 size={15} className="text-rose-300" /> Tableau de Bord Admin
                    </span>
                    <span className="text-[9px] font-semibold text-rose-200">Stats</span>
                  </button>
                </div>
              )}

              {/* Entraînement de Rose IA pour docteurs */}
              {currentUser?.role === "admin" && currentUser?.adminType === "doctor" && (
                <div className="mt-2">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setShowDoctorTrainModal(true);
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-blue-900 px-3 py-2 text-xs font-bold text-white shadow"
                  >
                    <span className="flex items-center gap-2">
                      <GraduationCap size={15} className="text-amber-300" /> Entraîner Rose IA (Docteur)
                    </span>
                    <span className="rounded-full bg-blue-700 px-1.5 py-0.5 text-[9px]">IA</span>
                  </button>
                </div>
              )}

              {/* Orientation patiente */}
              {currentUser?.role === "admin" && (currentUser?.adminType === "doctor" || currentUser?.adminType === "center") && (
                <div className="mt-2">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setShowOrientationModal(true);
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-emerald-800 px-3 py-2 text-xs font-bold text-white shadow"
                  >
                    <span className="flex items-center gap-2">
                      <FileText size={15} className="text-amber-300" /> Orienter une Patiente
                    </span>
                    <span className="text-[9px] font-semibold text-emerald-200">Urgence</span>
                  </button>
                </div>
              )}

              {/* Navigation de la barre latérale */}
              <nav className="mt-3 space-y-1 flex-1 overflow-y-auto text-xs">
                <button
                  onClick={() => { setSection("Accueil"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 font-semibold ${section === "Accueil" ? "bg-[#f5e3e8] text-[#ea2d6d]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <Heart size={17} /> <span>Accueil</span>
                </button>

                <button
                  onClick={() => { setSection("Centres"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 font-semibold ${section === "Centres" ? "bg-[#f5e3e8] text-[#ea2d6d]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <span className="flex items-center gap-3"><MapPin size={17} /> Carte des Soins (OpenStreetMap)</span>
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">En direct</span>
                </button>

                <button
                  onClick={() => { setSection("Calendrier"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 font-semibold ${section === "Calendrier" ? "bg-[#f5e3e8] text-[#ea2d6d]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <span className="flex items-center gap-3"><CalendarDays size={17} /> Règles & Autopalpation</span>
                  <span className="rounded-full bg-pink-100 px-1.5 py-0.5 text-[9px] font-bold text-[#ea2d6d]">Cycle</span>
                </button>

                <button
                  onClick={() => { setSection("Comprendre"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 font-semibold ${section === "Comprendre" ? "bg-[#f5e3e8] text-[#ea2d6d]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <span className="flex items-center gap-3"><BookOpen size={17} /> Comprendre (Français · Anglais · Mooré · Dioula)</span>
                  <span className="rounded-full bg-pink-100 px-1.5 py-0.5 text-[9px] font-bold text-[#ea2d6d]">Audio</span>
                </button>

                <button
                  onClick={() => { setSection("RoseIA"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 font-semibold ${section === "RoseIA" ? "bg-[#f5e3e8] text-[#ea2d6d]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <span className="flex items-center gap-3"><Sparkles size={17} /> Rose IA (Assistance Vocale)</span>
                  <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-900">IA</span>
                </button>

                <button
                  onClick={() => { setSection("Annonces"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 font-semibold ${section === "Annonces" ? "bg-[#f5e3e8] text-[#ea2d6d]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <Megaphone size={17} /> <span>Annonces & Événements</span>
                </button>

                <button
                  onClick={() => { setSection("Accompagnant"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 font-semibold ${section === "Accompagnant" ? "bg-[#f5e3e8] text-[#ea2d6d]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <UserPlus size={17} /> <span>L'Accompagnant (À deux)</span>
                </button>

                {/* Mise à jour centre : réservé aux Admins Centre & Médecins */}
                {currentUser?.role === "admin" && (currentUser?.adminType === "center" || currentUser?.adminType === "doctor") && (
                  <div className="pt-2 border-t border-[#f2e1e6]">
                    <button
                      onClick={() => {
                        setSidebarOpen(false);
                        setCenterUpdateData(centers[0]);
                        setShowCenterUpdateModal(true);
                      }}
                      className="flex w-full items-center gap-2 rounded-2xl border border-dashed border-[#dfb3c1] bg-[#fcf5f7] px-3 py-2 text-left text-xs font-bold text-[#863853]"
                    >
                      <Edit3 size={15} /> Mettre à jour mon centre sur la carte
                    </button>
                  </div>
                )}

                {/* Faire un don solidaire : en bas avec Cœur */}
                <div className="pt-2 border-t border-[#f2e1e6]">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setShowDonationModal(true);
                    }}
                    className="flex w-full items-center justify-between rounded-2xl bg-rose-50 px-3.5 py-2.5 font-bold text-[#ea2d6d] hover:bg-rose-100"
                  >
                    <span className="flex items-center gap-3">
                      <Heart size={17} className="text-[#ea2d6d] fill-[#ea2d6d]" /> Faire un don
                    </span>
                    <span className="text-[10px] text-rose-800">Solidarité</span>
                  </button>
                </div>

                {/* Paramètres de Confidentialité & Entraînement Docteur */}
                <div className="pt-2 border-t border-[#f2e1e6] space-y-1.5">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setShowPrivacyModal(true);
                    }}
                    className="flex w-full items-center justify-between rounded-2xl bg-emerald-50/70 border border-emerald-200 px-3.5 py-2 font-semibold text-emerald-900 hover:bg-emerald-100"
                  >
                    <span className="flex items-center gap-2.5 text-xs">
                      <ShieldCheck size={16} className="text-emerald-700" /> Confidentialité & Données
                    </span>
                    <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Local</span>
                  </button>

                  {/* Simulation d'entraînement réservée exclusivement aux soignants et superadmin */}
                  {currentUser && (currentUser.role === "superadmin" || (currentUser.role === "admin" && currentUser.adminType === "doctor")) && (
                    <button
                      onClick={() => {
                        setSidebarOpen(false);
                        setShowDoctorTrainModal(true);
                      }}
                      className="flex w-full items-center justify-between rounded-2xl bg-amber-50 border border-amber-200 px-3.5 py-2 font-semibold text-amber-950 hover:bg-amber-100"
                    >
                      <span className="flex items-center gap-2.5 text-xs">
                        <GraduationCap size={16} className="text-amber-700" /> Simuler Entraînement Docteur
                      </span>
                      <span className="text-[9.5px] font-bold text-amber-800 bg-amber-200 px-1.5 py-0.5 rounded">4 étapes</span>
                    </button>
                  )}
                </div>

                {/* BOUTON SE DÉCONNECTER DU MENU DÉROULANT GAUCHE EXIGÉ */}
                {currentUser && (
                  <div className="pt-2 border-t border-[#f2e1e6]">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 font-bold text-rose-700 hover:bg-rose-100 transition shadow-xs"
                    >
                      <LogOut size={16} className="text-rose-600" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                )}
              </nav>

              {/* Bouton Installation Application Mobile PWA */}
              <div className="mt-2">
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    handleTriggerInstall();
                  }}
                  className="flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-[#ea2d6d] to-[#580e36] px-3 py-2 text-xs font-bold text-white shadow-md hover:opacity-95 transition"
                >
                  <span className="flex items-center gap-2">
                    <Smartphone size={15} className="text-amber-300" />
                    <span>{isStandaloneApp ? "Application installée ✓" : "Installer l'App Mobile"}</span>
                  </span>
                  <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[9px] font-black text-white">
                    PWA
                  </span>
                </button>
              </div>

              {/* SÉLECTEUR DE LANGUE DISCRET & TACTILE DANS LA SIDEBAR DÉROULANTE */}
              <div className="mt-2 rounded-2xl bg-[#fff2f6] p-2.5 border border-[#fce4ec]">
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#ea2d6d]">
                    <Languages size={13} /> Langue de l'App
                  </span>
                  <span className="text-[9.5px] font-extrabold text-[#580e36]">
                    {appLanguage === "moore" ? "Mooré" : appLanguage === "dioula" ? "Dioula" : appLanguage.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { code: "fr" as const, label: "Français", flag: "🇫🇷" },
                    { code: "moore" as const, label: "Mooré", flag: "🇧🇫" },
                    { code: "dioula" as const, label: "Dioula", flag: "🇧🇫" },
                    { code: "en" as const, label: "English", flag: "🇬🇧" },
                  ].map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => handleSelectAppLanguage(l.code)}
                      className={`flex items-center justify-center gap-1 rounded-xl py-1.5 px-2 text-[11px] font-bold transition cursor-pointer ${
                        appLanguage === l.code
                          ? "bg-[#ea2d6d] text-white shadow-xs"
                          : "bg-white text-[#580e36] border border-[#fce4ec] hover:bg-pink-100/60"
                      }`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ligne d'urgence */}
              <div className="mt-2 rounded-2xl bg-[#734059] p-3 text-white">
                <p className="text-[11px] font-bold">Numéro vert national gratuit</p>
                <p className="text-base font-extrabold tracking-wide">80 00 11 22</p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* EN-TÊTE FIXE DU SMARTPHONE AVEC DÉCONNEXION DIRECTE SUR L'ICÔNE      */}
        {/* ==================================================================== */}
        <header className="z-30 flex items-center justify-between border-b border-[#f4e2e7] bg-white/95 px-4 py-2.5 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSidebarOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-full text-[#75475a] hover:bg-[#fbf0f4]"
              aria-label="Ouvrir le menu"
            >
              <Menu size={20} />
            </button>
            <div
              onClick={() => setSection("Accueil")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src="/images/pinkhub-mvp-paglaafi.png"
                alt="Logo PagLaafi"
                className="h-8 w-8 object-contain mix-blend-multiply"
              />
              <span className="ph-display text-lg font-bold text-[#580e36]">PagLaafi</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bouton d'installation PWA Mobile rapide */}
            <button
              onClick={handleTriggerInstall}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold transition shadow-2xs ${
                isStandaloneApp
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-[#fce4ec] bg-gradient-to-r from-pink-50 to-rose-50 text-[#ea2d6d] hover:bg-pink-100"
              }`}
              title={isStandaloneApp ? "Application PagLaafi active en mode autonome" : "Installer l'application sur smartphone"}
            >
              <Smartphone size={11} className={isStandaloneApp ? "text-emerald-600" : "text-[#ea2d6d]"} />
              <span>{isStandaloneApp ? "Installé" : "Installer"}</span>
            </button>

            {/* Bouton direct Rose IA (affiché uniquement quand l'utilisateur est connecté) */}
            {currentUser && (
              <button
                type="button"
                onClick={() => {
                  setSection("RoseIA");
                  setShowLanguageMenu(false);
                }}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10.5px] font-bold transition shadow-sm ${section === "RoseIA" ? "bg-[#ea2d6d] text-white" : "border border-[#e7bcc9] bg-[#fbf0f4] text-[#d81f5c]"}`}
              >
                <Sparkles size={12} className="text-amber-500" />
                <span>Rose IA</span>
              </button>
            )}

            {/* ICÔNE DE PROFIL PERSONNALISÉE AVEC DÉCONNEXION (affiché quand connecté) */}
            {currentUser && (() => {
              const headerProfileIdentity = getProfileIdentity(currentUser);
              return (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className={`relative grid h-10 w-10 place-items-center rounded-full border-2 ${headerProfileIdentity.border} ${headerProfileIdentity.bg} ${headerProfileIdentity.text} shadow-md transition hover:scale-105`}
                    title={`${currentUser.prenom} (${currentUser.roleLabel}) - Cliquez pour gérer`}
                  >
                    {headerProfileIdentity.icon}
                    <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${headerProfileIdentity.dotColor}`} />
                  </button>

                  {/* Menu Popover Déconnexion Directe */}
                  {showProfileMenu && (
                    <div
                      className="ph-enter absolute right-0 top-12 z-50 w-64 rounded-2xl border border-[#ebd4dd] bg-white p-3.5 shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-3 border-b border-[#f5e4ea] pb-3">
                        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${headerProfileIdentity.bg} ${headerProfileIdentity.text} border ${headerProfileIdentity.border} shadow-xs`}>
                          {headerProfileIdentity.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[#580e36] text-xs truncate">
                            {currentUser.prenom} {currentUser.nom}
                          </p>
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${headerProfileIdentity.badgeBg}`}>
                            {currentUser.roleLabel}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-[10.5px] text-[#7a5969] space-y-0.5">
                        <p className="flex items-center gap-1.5"><Phone size={12} className="text-[#ea2d6d]" /> {currentUser.telephone}</p>
                        {currentUser.structureName && (
                          <p className="flex items-center gap-1.5"><MapPin size={12} className="text-[#ea2d6d]" /> {currentUser.structureName}</p>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#f7e6ec] space-y-2">
                        <div>
                          <p className="text-[10px] font-bold text-[#8c4d66] mb-1.5">Changer de profil (1-clic) :</p>
                          <div className="grid grid-cols-2 gap-1 text-[10px]">
                            <button
                              onClick={() => { quickLoginAs("user"); setShowProfileMenu(false); }}
                              className={`rounded-lg px-2 py-1 font-semibold text-left transition ${currentUser.role === 'user' ? 'bg-[#ea2d6d] text-white' : 'bg-pink-50 text-[#6f334a] hover:bg-pink-100'}`}
                            >
                              👩 Utilisatrice
                            </button>
                            <button
                              onClick={() => { quickLoginAs("center"); setShowProfileMenu(false); }}
                              className={`rounded-lg px-2 py-1 font-semibold text-left transition ${currentUser.adminType === 'center' ? 'bg-[#ea2d6d] text-white' : 'bg-pink-50 text-[#6f334a] hover:bg-pink-100'}`}
                            >
                              🏥 Centre Santé
                            </button>
                            <button
                              onClick={() => { quickLoginAs("doctor"); setShowProfileMenu(false); }}
                              className={`rounded-lg px-2 py-1 font-semibold text-left transition ${currentUser.adminType === 'doctor' ? 'bg-[#ea2d6d] text-white' : 'bg-pink-50 text-[#6f334a] hover:bg-pink-100'}`}
                            >
                              🩺 Docteur
                            </button>
                            <button
                              onClick={() => { quickLoginAs("association"); setShowProfileMenu(false); }}
                              className={`rounded-lg px-2 py-1 font-semibold text-left transition ${currentUser.adminType === 'association' ? 'bg-[#ea2d6d] text-white' : 'bg-pink-50 text-[#6f334a] hover:bg-pink-100'}`}
                            >
                              🎗️ Association
                            </button>
                          </div>
                          <button
                            onClick={() => { quickLoginAs("superadmin"); setShowProfileMenu(false); }}
                            className={`w-full mt-1 rounded-lg px-2 py-1 font-semibold text-left text-[10px] transition ${currentUser.role === 'superadmin' ? 'bg-purple-900 text-white' : 'bg-purple-50 text-purple-900 hover:bg-purple-100'}`}
                          >
                            🛡️ Superadmin National
                          </button>
                        </div>

                        {/* Raccourcis Confidentialité & Simulation Docteur */}
                        <div className="pt-2 border-t border-[#f7e6ec] space-y-1.5">
                          <button
                            onClick={() => {
                              setShowPrivacyModal(true);
                              setShowProfileMenu(false);
                            }}
                            className="flex w-full items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-2.5 py-1.5 text-[10.5px] font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs"
                          >
                            <span className="flex items-center gap-1.5">
                              <ShieldCheck size={13} className="text-emerald-600" />
                              <span>Confidentialité & Données</span>
                            </span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">100% Local</span>
                          </button>

                          {/* Simulation réservée aux soignants et superadmin */}
                          {currentUser && (currentUser.role === "superadmin" || (currentUser.role === "admin" && currentUser.adminType === "doctor")) && (
                            <button
                              onClick={() => {
                                setShowDoctorTrainModal(true);
                                setShowProfileMenu(false);
                              }}
                              className="flex w-full items-center justify-between rounded-xl bg-amber-50 border border-amber-200 px-2.5 py-1.5 text-[10.5px] font-bold text-amber-900 hover:bg-amber-100 transition shadow-xs"
                            >
                              <span className="flex items-center gap-1.5">
                                <GraduationCap size={13} className="text-amber-600" />
                                <span>Simuler Entraînement Docteur</span>
                              </span>
                              <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">4 étapes</span>
                            </button>
                          )}
                        </div>

                        {/* BOUTON DÉCONNEXION DIRECTE */}
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-xs"
                        >
                          <LogOut size={13} className="text-rose-600" />
                          <span>Se déconnecter</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </header>

        {/* ==================================================================== */}
        {/* BANDEAU MODE HORS-LIGNE (PWA & OFFLINE)                              */}
        {/* ==================================================================== */}
        {isOffline && (
          <div className="z-20 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 px-3 py-1.5 text-center text-[10.5px] font-bold text-white shadow-xs">
            <AlertCircle size={13} className="shrink-0 animate-pulse text-amber-200" />
            <span>Mode Hors-Ligne actif · Vos données médicales et centres restent accessibles</span>
          </div>
        )}

        {/* ==================================================================== */}
        {/* CONTENU PRINCIPAL DES ONGLETS                                        */}
        {/* ==================================================================== */}
        <div ref={mainScrollRef} className="ph-scroll flex-1 overflow-y-auto pb-10">

          {/* ================================================================== */}
          {/* PAGE GÉNÉRALE DE CONNEXION & INSCRIPTION (SI NON CONNECTÉ)        */}
          {/* ================================================================== */}
          {!currentUser ? (
            <section className="ph-enter px-4 py-5 space-y-4">
              {/* Branding En-tête */}
              <div className="text-center rounded-3xl bg-gradient-to-b from-[#fdf2f5] to-white p-5 border border-[#f3d7e0] shadow-2xs">
                <div className="relative mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-3xl bg-white p-3 shadow-md border border-[#edd1dc]">
                  <img
                    src="/images/pinkhub-mvp-paglaafi.png"
                    alt="Logo PagLaafi"
                    className="h-full w-full object-contain mix-blend-multiply"
                  />
                </div>
                <h2 className="ph-display text-2xl font-bold text-[#580e36]">PagLaafi</h2>
                <p className="text-xs text-[#82445e] font-semibold mt-0.5">
                  Plateforme Nationale de Dépistage & Solidarité Cancer du Sein
                </p>
                <div className="mt-2.5 inline-flex items-center gap-2 rounded-full border border-[#e8c0ce] bg-white px-3 py-1 text-[11px] font-bold text-[#79344f] shadow-2xs">
                  <Sparkles size={13} className="text-amber-500" />
                  <span>Burkina Faso · Powered by Rose IA</span>
                </div>
              </div>

              {/* Sélecteur Onglet : Connexion vs Inscription avec icônes */}
              <div className="grid grid-cols-2 rounded-2xl bg-[#f5e3e8] p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 transition ${authMode === "login" ? "bg-white text-[#ea2d6d] shadow-sm font-extrabold" : "text-[#7b5364]"}`}
                >
                  <Lock size={13} />
                  <span>Se connecter</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("register")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 transition ${authMode === "register" ? "bg-white text-[#ea2d6d] shadow-sm font-extrabold" : "text-[#7b5364]"}`}
                >
                  <UserPlus size={13} />
                  <span>Créer un compte</span>
                </button>
              </div>

              {/* SI ONGLET CONNEXION */}
              {authMode === "login" && (
                <div className="space-y-4">
                  <form onSubmit={handleLoginSubmit} className="space-y-3.5 rounded-3xl bg-white p-4.5 border border-[#edd6df] shadow-xs">
                    <div>
                      <label className="text-[11px] font-bold text-[#580e36] block mb-1.5">
                        Numéro de téléphone (+226)
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 flex items-center gap-1.5 text-xs font-bold text-[#713f53] pointer-events-none">
                          <Phone size={13} className="text-[#ea2d6d]" />
                          <span>🇧🇫 +226</span>
                        </span>
                        <input
                          type="tel"
                          required
                          value={loginForm.telephone}
                          onChange={(e) => setLoginForm({ ...loginForm, telephone: e.target.value })}
                          placeholder="70 12 34 56"
                          className="w-full rounded-2xl border border-[#d6a9b9] py-3 pl-24 pr-3.5 text-xs font-semibold text-[#580e36] focus:border-[#ea2d6d] focus:ring-2 focus:ring-[#ea2d6d]/15 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#580e36] block mb-1.5">
                        Mot de passe
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-[#ea2d6d] pointer-events-none">
                          <Lock size={14} />
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={loginForm.motDePasse}
                          onChange={(e) => setLoginForm({ ...loginForm, motDePasse: e.target.value })}
                          placeholder="Votre mot de passe"
                          className="w-full rounded-2xl border border-[#d6a9b9] py-3 pl-10 pr-10 text-xs font-semibold text-[#580e36] focus:border-[#ea2d6d] focus:ring-2 focus:ring-[#ea2d6d]/15 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 text-gray-400 hover:text-[#ea2d6d] p-1 transition"
                          title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-gradient-to-r from-[#6c1543] to-[#ba486e] py-3.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={15} />
                      <span>Se connecter à mon compte</span>
                    </button>
                  </form>

                  {/* Accès Démo Rapide (1-Clic) : Disposition optimisée et équilibrée des icônes de profils */}
                  <div className="rounded-3xl bg-[#fdf5f7] border border-[#f0d4de] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#9a4564] mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <UsersRound size={13} className="text-[#ea2d6d]" />
                        <span>Accès Rapide Démo (1-Clic)</span>
                      </span>
                      <span className="text-[9px] font-normal lowercase bg-pink-100 text-[#ea2d6d] px-2 py-0.5 rounded-full font-bold">
                        5 profils au choix
                      </span>
                    </p>

                    {/* Grille 2x2 des 4 rôles opérationnels */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {[
                        {
                          type: "user" as const,
                          title: "Aminata O.",
                          roleName: "Utilisatrice",
                          desc: "Autopalpation & Cycle",
                          profile: { role: "user" as const, roleLabel: "Utilisatrice" },
                        },
                        {
                          type: "center" as const,
                          title: "Mme Sawadogo",
                          roleName: "Centre de Santé",
                          desc: "CMA Schiphra",
                          profile: { role: "admin" as const, adminType: "center" as const, roleLabel: "Centre Médical" },
                        },
                        {
                          type: "doctor" as const,
                          title: "Dr. Sanou",
                          roleName: "Docteur / Praticien",
                          desc: "CHU Bogodogo",
                          profile: { role: "admin" as const, adminType: "doctor" as const, roleLabel: "Praticien" },
                        },
                        {
                          type: "association" as const,
                          title: "Dr. Sawadogo",
                          roleName: "Association ONG",
                          desc: "ABAC Solidarité",
                          profile: { role: "admin" as const, adminType: "association" as const, roleLabel: "ONG / Asso" },
                        },
                      ].map((p) => {
                        const ident = getProfileIdentity(p.profile as any);
                        return (
                          <button
                            key={p.type}
                            type="button"
                            onClick={() => quickLoginAs(p.type)}
                            className="flex flex-col items-start gap-1.5 rounded-2xl bg-white p-3 text-left border border-[#ecd5de] hover:border-[#ea2d6d] hover:shadow-xs transition group"
                          >
                            <div className="flex w-full items-center justify-between">
                              <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${ident.bg} ${ident.text} border ${ident.border} shadow-2xs group-hover:scale-105 transition`}>
                                {ident.icon}
                              </div>
                              <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-full ${ident.badgeBg}`}>
                                {ident.badgeText}
                              </span>
                            </div>
                            <div className="min-w-0 w-full mt-0.5">
                              <p className="text-[11.5px] font-bold text-[#580e36] truncate">{p.title}</p>
                              <p className="text-[10px] text-[#7d5668] truncate">{p.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* 5e rôle : Superadmin National en carte pleine largeur */}
                    {(() => {
                      const superadminIdentity = getProfileIdentity({ role: "superadmin", roleLabel: "Superadmin" } as any);
                      return (
                        <button
                          type="button"
                          onClick={() => quickLoginAs("superadmin")}
                          className="w-full flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-950/5 via-purple-900/10 to-indigo-950/5 p-3 text-left border border-purple-200/80 hover:border-purple-400 hover:shadow-xs transition group"
                        >
                          <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${superadminIdentity.bg} ${superadminIdentity.text} border ${superadminIdentity.border} shadow-xs group-hover:scale-105 transition`}>
                            {superadminIdentity.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-[#351a42]">Alimata Kaboré</p>
                              <span className={`text-[8.5px] font-black px-2 py-0.5 rounded-full ${superadminIdentity.badgeBg}`}>
                                Superadmin National
                              </span>
                            </div>
                            <p className="text-[10px] text-purple-900/80">Supervision nationale, modération des annonces & statistiques</p>
                          </div>
                        </button>
                      );
                    })()}
                  </div>

                  {/* Bouton pour tester sans compte */}
                  <div className="text-center pt-1 pb-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentUser({
                          nom: "Visiteur",
                          prenom: "Invité",
                          telephone: "Mode Découverte",
                          role: "user",
                          roleLabel: "Visiteur libre",
                        });
                        notify("Bienvenue en mode découverte libre !");
                      }}
                      className="inline-flex items-center gap-2 rounded-2xl border border-[#ecd5de] bg-white px-4 py-2.5 text-xs font-bold text-[#ea2d6d] shadow-2xs hover:bg-pink-50 transition"
                    >
                      <Sparkles size={14} className="text-amber-500" />
                      <span>Explorer l'application sans compte (Mode Découverte)</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* SI ONGLET INSCRIPTION */}
              {authMode === "register" && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3 rounded-3xl bg-white p-4 border border-[#edd6df] shadow-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-[#580e36] block mb-1">Prénom</label>
                      <input
                        type="text"
                        required
                        value={registerForm.prenom}
                        onChange={(e) => setRegisterForm({ ...registerForm, prenom: e.target.value })}
                        className="w-full rounded-xl border border-[#d6a9b9] p-2 text-xs text-[#580e36] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#580e36] block mb-1">Nom</label>
                      <input
                        type="text"
                        required
                        value={registerForm.nom}
                        onChange={(e) => setRegisterForm({ ...registerForm, nom: e.target.value })}
                        className="w-full rounded-xl border border-[#d6a9b9] p-2 text-xs text-[#580e36] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#580e36] block mb-1">Numéro de téléphone (+226)</label>
                    <input
                      type="tel"
                      required
                      value={registerForm.telephone}
                      onChange={(e) => setRegisterForm({ ...registerForm, telephone: e.target.value })}
                      placeholder="70 12 34 56"
                      className="w-full rounded-xl border border-[#d6a9b9] p-2 text-xs text-[#580e36] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#580e36] block mb-1">Type de profil</label>
                    <select
                      value={registerForm.role === "user" ? "user" : registerForm.adminType}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "user") {
                          setRegisterForm({ ...registerForm, role: "user" });
                        } else {
                          setRegisterForm({
                            ...registerForm,
                            role: "admin",
                            adminType: val as AdminType,
                          });
                        }
                      }}
                      className="w-full rounded-xl border border-[#d6a9b9] p-2 text-xs text-[#580e36] bg-white focus:outline-none"
                    >
                      <option value="user">👩 Utilisatrice / Patiente</option>
                      <option value="association">🎗️ Association / ONG Partenaire</option>
                      <option value="center">🏥 Centre de Santé</option>
                      <option value="doctor">🩺 Médecin / Docteur</option>
                    </select>
                  </div>

                  {registerForm.role === "admin" && (
                    <div>
                      <label className="text-[11px] font-bold text-[#580e36] block mb-1">
                        Nom de la structure / Établissement
                      </label>
                      <input
                        type="text"
                        required
                        value={registerForm.structureName}
                        onChange={(e) => setRegisterForm({ ...registerForm, structureName: e.target.value })}
                        placeholder="Ex: ABAC Burkina, CMA Schiphra..."
                        className="w-full rounded-xl border border-[#d6a9b9] p-2 text-xs text-[#580e36] focus:outline-none"
                      />
                      <p className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded-xl mt-1.5 border border-amber-200">
                        ℹ️ Ce profil requiert une validation du Superadmin avant activation complète.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-bold text-[#580e36] block mb-1">Mot de passe</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={registerForm.motDePasse}
                        onChange={(e) => setRegisterForm({ ...registerForm, motDePasse: e.target.value })}
                        className="w-full rounded-xl border border-[#d6a9b9] p-2 pr-10 text-xs text-[#580e36] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2 text-gray-400 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#580e36] block mb-1">Confirmer le mot de passe</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={registerForm.confirmerMotDePasse}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmerMotDePasse: e.target.value })}
                        className="w-full rounded-xl border border-[#d6a9b9] p-2 pr-10 text-xs text-[#580e36] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2 text-gray-400 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-[#ea2d6d] py-3 text-xs font-bold text-white shadow-md hover:bg-[#d81f5c] transition"
                  >
                    Créer mon compte
                  </button>
                </form>
              )}
            </section>
          ) : (
            <>
              {/* ------------------------------------------------------------------ */}
              {/* ONGLET 1 : ACCUEIL                                                 */}
              {/* ------------------------------------------------------------------ */}
              {section === "Accueil" && !selectedCenter && (
            <section className="ph-enter">
              <div className="relative overflow-hidden bg-[#f9e9ed] px-5 pb-6 pt-5">
                <div className="pointer-events-none absolute -right-6 -top-8 h-44 w-44 rounded-full border-[20px] border-[#f0d0db] opacity-60" />

                <div className="relative flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#a44666] shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d65f84]" /> Santé des femmes · Burkina Faso
                  </span>
                  {currentUser && (
                    <span className="text-[11px] font-bold text-[#8e4462]">
                      {currentUser.prenom} ({currentUser.roleLabel})
                    </span>
                  )}
                </div>

                <h1 className="ph-display relative mt-3 text-[33px] leading-[1.02] tracking-[-.025em] text-[#580e36]">
                  Une question ?<br />
                  <span className="text-[#b94e70]">Vous n'êtes pas seule.</span>
                </h1>

                <p className="relative mt-2 text-[13px] leading-[1.6] text-[#745866]">
                  Voyez quel centre peut vous accueillir aujourd’hui, repérez le bon moment pour votre autopalpation et trouvez de l’aide près de chez vous.
                </p>

                <div className="relative mt-4 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => { setSection("Centres"); setViewMode("map"); }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#ea2d6d] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[#d81f5c]"
                  >
                    <MapPin size={15} /> Voir la carte en direct
                  </button>
                  <button
                    onClick={() => setSection("Calendrier")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#dfb3c1] bg-white px-3.5 py-2 text-xs font-bold text-[#8c3e59] shadow-sm hover:bg-[#fbf4f6]"
                  >
                    <CalendarDays size={14} /> Règles & Autopalpation
                  </button>
                </div>
              </div>

              {/* CARTE MOT DOUX & SANTÉ GLOBALE : ROSE IA (PENSÉE BIENVEILLANTE DU JOUR) */}
              <div className="px-5 pt-3.5">
                <div className="rounded-[26px] border-2 border-[#eed5df] bg-gradient-to-br from-[#ffffff] via-[#fff8fa] to-[#faedf2] p-4 shadow-sm hover:border-[#dfb2c2] transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-tr from-[#8a3350] to-[#cf5d83] text-white shadow-xs">
                        <Sparkles size={16} className="text-amber-300 animate-pulse" />
                      </span>
                      <div>
                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#ea2d6d]">
                          Rose IA · Conseil Bienveillant du Jour
                        </span>
                        <h3 className="ph-display text-xs font-bold text-[#580e36]">
                          {roseDailyTips[dailyTipIndex].titleFr}
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={handleRequestNotification}
                      className={`grid h-8 w-8 place-items-center rounded-xl transition ${
                        notificationEnabled
                          ? "bg-emerald-500 text-white shadow-xs"
                          : "bg-[#f5e6ec] text-[#8e3f5a] hover:bg-[#ebd3de]"
                      }`}
                      title={notificationEnabled ? "Notifications quotidiennes actives" : "Activer les notifications locales"}
                    >
                      <Bell size={15} className={notificationEnabled ? "fill-white" : ""} />
                    </button>
                  </div>

                  {/* Catégorie & Sélecteur de langue */}
                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1.5 border-b border-[#f3e1e7] pb-2 text-[10px]">
                    <span className={`font-bold px-2 py-0.5 rounded-full border ${roseDailyTips[dailyTipIndex].categoryColor}`}>
                      {roseDailyTips[dailyTipIndex].categoryLabel}
                    </span>

                    <div className="flex items-center gap-1 font-bold">
                      {(
                        [
                          { code: "fr", label: "🇫🇷 FR" },
                          { code: "moore", label: "🇧🇫 Mooré" },
                          { code: "dioula", label: "🇧🇫 Dioula" },
                          { code: "en", label: "🇬🇧 EN" },
                        ] as const
                      ).map(({ code, label }) => (
                        <button
                          key={code}
                          onClick={() => setDailyTipLang(code)}
                          className={`rounded-lg px-2 py-0.5 transition ${
                            dailyTipLang === code
                              ? "bg-[#ea2d6d] text-white shadow-xs"
                              : "bg-white text-[#7d5668] hover:bg-[#f6e7ee]"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contenu du message bienveillant dans la langue choisie */}
                  <div className="mt-2 text-xs leading-relaxed text-[#512c3e] italic">
                    «{" "}
                    {dailyTipLang === "moore"
                      ? roseDailyTips[dailyTipIndex].moore
                      : dailyTipLang === "dioula"
                        ? roseDailyTips[dailyTipIndex].dioula
                        : dailyTipLang === "en"
                          ? roseDailyTips[dailyTipIndex].en
                          : roseDailyTips[dailyTipIndex].fr}
                    {" "}»
                  </div>

                  {/* Actions rapides : Écouter l'audio, changer de conseil, discuter avec Rose IA */}
                  <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-[#f4e4e9]">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          const tip = roseDailyTips[dailyTipIndex];
                          const txt =
                            dailyTipLang === "moore"
                              ? tip.moore
                              : dailyTipLang === "dioula"
                                ? tip.dioula
                                : dailyTipLang === "en"
                                  ? tip.en
                                  : tip.fr;
                          handlePlayAudio(txt, dailyTipLang);
                        }}
                        className="inline-flex items-center gap-1 rounded-xl bg-[#faedf2] px-2.5 py-1 text-[11px] font-bold text-[#8f3654] hover:bg-[#f5dfe7] transition"
                      >
                        <Volume2 size={13} />
                        <span>Écouter</span>
                      </button>

                      <button
                        onClick={() =>
                          setDailyTipIndex((prev) => (prev + 1) % roseDailyTips.length)
                        }
                        className="inline-flex items-center gap-1 rounded-xl bg-white border border-[#edd1dc] px-2 py-1 text-[11px] font-bold text-[#7a485c] hover:bg-[#fdf4f7] transition"
                        title="Voir une autre pensée bienveillante"
                      >
                        <span>Autre conseil ✨</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setSection("RoseIA")}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ea2d6d] hover:underline"
                    >
                      <span>Confier à Rose IA</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 1. CARTE CALENDRIER DU CYCLE & AUTOPALPATION */}
              <div className="px-5 pt-4">
                <div
                  onClick={() => setSection("Calendrier")}
                  className="cursor-pointer rounded-[24px] border border-[#f0d4de] bg-gradient-to-br from-[#fff7f9] to-[#faedf2] p-4 shadow-sm hover:border-[#dfb2c2]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#ea2d6d] text-white shadow-sm">
                        <CalendarDays size={20} />
                      </span>
                      <div>
                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#ea2d6d]">
                          Suivi du cycle & Seins
                        </span>
                        <h3 className="ph-display text-sm font-bold text-[#580e36]">
                          Mon Calendrier & Autopalpation
                        </h3>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-[#ea2d6d]" />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-white/90 p-2 border border-[#f3e1e7]">
                      <p className="text-[9px] font-bold text-[#955c71] uppercase">Prochaines règles</p>
                      <p className="font-extrabold text-[#580e36]">{cycleInfo.nextPeriodStr}</p>
                    </div>
                    <div className="rounded-xl bg-white/90 p-2 border border-[#f3e1e7]">
                      <p className="text-[9px] font-bold text-[#955c71] uppercase">Fenêtre autopalpation</p>
                      <p className="font-extrabold text-[#10b981]">{cycleInfo.autopalpWindowStr}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. RACCOURCI CARTE VIVANTE DES SOINS */}
              <div className="px-5 pt-3">
                <div
                  onClick={() => { setSection("Centres"); setViewMode("map"); }}
                  className="cursor-pointer rounded-2xl border border-[#eedde2] bg-white p-3.5 shadow-sm hover:border-[#dfb4c2]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500 text-white">
                        <MapPin size={20} />
                      </span>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800">
                          Disponibilités en direct
                        </span>
                        <h4 className="ph-display text-sm font-bold text-[#580e36]">
                          Carte Vivante des Centres
                        </h4>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                      OpenStreetMap →
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. RACCOURCI ANNONCES DES PARTENAIRES */}
              <div className="px-5 pt-3">
                <div
                  onClick={() => setSection("Annonces")}
                  className="cursor-pointer rounded-2xl border border-purple-200 bg-purple-50/70 p-3 shadow-sm hover:border-purple-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-purple-900">
                      <Megaphone size={13} /> {announcements[0]?.badge}
                    </span>
                    <span className="text-[10px] font-semibold text-purple-700">Annonces ({announcements.filter((a) => a.month === "Octobre 2026").length}) →</span>
                  </div>
                  <h4 className="mt-1 text-xs font-bold text-purple-950">{announcements[0]?.title}</h4>
                </div>
              </div>

              {/* 4. RACCOURCI L'ACCOMPAGNANT */}
              <div className="px-5 pt-3">
                <div
                  onClick={() => setSection("Accompagnant")}
                  className="cursor-pointer rounded-[22px] border-2 border-[#e8bcc9] bg-gradient-to-br from-[#fff6f8] to-[#fbf0f4] p-3.5 shadow-sm transition hover:border-[#cf7794]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#ea2d6d] text-white">
                        <UserPlus size={19} />
                      </span>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#ea2d6d]">Aller à deux</span>
                        <h3 className="ph-display text-base font-bold text-[#580e36]">Inviter mon accompagnant(e)</h3>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-[#ea2d6d]" />
                  </div>
                </div>
              </div>

              {/* 5. FAIRE UN DON SOLIDAIRE : PLACÉ EN BAS DE LA LISTE DE L'ACCUEIL AVEC ICÔNE CŒUR */}
              <div className="px-5 pt-4 pb-2">
                <div
                  onClick={() => setShowDonationModal(true)}
                  className="cursor-pointer rounded-[24px] border-2 border-rose-300 bg-gradient-to-r from-rose-50 via-[#fff8fa] to-[#ffeef3] p-4 shadow-sm hover:border-rose-400 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#ea2d6d] text-white shadow-md">
                        <Heart size={22} className="fill-white" />
                      </span>
                      <div>
                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#ea2d6d]">
                          Solidarité 100% Burkina Faso
                        </span>
                        <h4 className="ph-display text-base font-bold text-[#580e36]">
                          Faire un don
                        </h4>
                        <p className="text-[10.5px] text-[#7a5867]">
                          Offrir une mammographie avec option anonyme chiffrée
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDonationModal(true);
                      }}
                      className="rounded-full bg-[#ea2d6d] px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-[#8e3856] transition"
                    >
                      Aider →
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 2 : CARTE DES SOINS (OPENSTREETMAP LEAFLET)                 */}
          {/* ------------------------------------------------------------------ */}
          {section === "Centres" && !selectedCenter && (
            <section className="ph-enter px-5 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
                    Temps réel · Burkina Faso
                  </span>
                  <h1 className="ph-display text-[26px] leading-tight text-[#580e36]">
                    Carte des soins
                  </h1>
                </div>
                <div className="flex rounded-2xl border border-[#ebd8de] bg-[#f8e9ed] p-1">
                  <button
                    onClick={() => setViewMode("map")}
                    className={`rounded-xl px-2.5 py-1 text-xs font-bold transition ${viewMode === "map" ? "bg-white text-[#963c5d] shadow-sm" : "text-[#835e6e]"}`}
                  >
                    Carte
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`rounded-xl px-2.5 py-1 text-xs font-bold transition ${viewMode === "list" ? "bg-white text-[#963c5d] shadow-sm" : "text-[#835e6e]"}`}
                  >
                    Liste ({filteredCenters.length})
                  </button>
                </div>
              </div>

              {/* Recherche & Filtres */}
              <div className="mt-3 relative">
                <Search size={16} className="absolute left-3.5 top-3 text-[#9f7183]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher centre, ville, examen..."
                  className="w-full rounded-2xl border border-[#ebd8de] bg-white py-2 pl-9 pr-8 text-xs text-[#4b2f3e] focus:border-[#ea2d6d] focus:outline-none"
                />
              </div>

              {/* Badges de filtrage et recentrage par ville */}
              <div className="ph-scroll mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setCityFilter("all");
                    if (mapInstanceRef.current) mapInstanceRef.current.setView([12.3714, -1.5197], 12);
                  }}
                  className={`shrink-0 rounded-full px-3 py-1 font-bold ${statusFilter === "all" && cityFilter === "all" ? "bg-[#ea2d6d] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  Tous ({centers.length})
                </button>
                <button
                  onClick={() => setStatusFilter(statusFilter === "available" ? "all" : "available")}
                  className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-bold ${statusFilter === "available" ? "bg-emerald-600 text-white" : "border border-emerald-300 bg-emerald-50 text-emerald-800"}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Dispo de suite
                </button>
                <button
                  onClick={() => setStatusFilter(statusFilter === "free" ? "all" : "free")}
                  className={`shrink-0 rounded-full px-2.5 py-1 font-bold ${statusFilter === "free" ? "bg-[#ea2d6d] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  0 FCFA (Gratuit)
                </button>
                <button
                  onClick={() => {
                    setCityFilter(cityFilter === "Ouagadougou" ? "all" : "Ouagadougou");
                    if (mapInstanceRef.current) mapInstanceRef.current.flyTo([12.3714, -1.5197], 12);
                  }}
                  className={`shrink-0 rounded-full px-2.5 py-1 font-bold ${cityFilter === "Ouagadougou" ? "bg-[#ea2d6d] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  Ouaga
                </button>
                <button
                  onClick={() => {
                    setCityFilter(cityFilter === "Bobo-Dioulasso" ? "all" : "Bobo-Dioulasso");
                    if (mapInstanceRef.current) mapInstanceRef.current.flyTo([11.178, -4.295], 13);
                  }}
                  className={`shrink-0 rounded-full px-2.5 py-1 font-bold ${cityFilter === "Bobo-Dioulasso" ? "bg-[#ea2d6d] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  Bobo
                </button>
                <button
                  onClick={() => {
                    setCityFilter(cityFilter === "Koudougou" ? "all" : "Koudougou");
                    if (mapInstanceRef.current) mapInstanceRef.current.flyTo([12.251, -2.366], 13);
                  }}
                  className={`shrink-0 rounded-full px-2.5 py-1 font-bold ${cityFilter === "Koudougou" ? "bg-[#ea2d6d] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  Koudougou
                </button>
              </div>

              {/* VRAIE CARTE OPENSTREETMAP LEAFLET GRATUITE ET OPEN-SOURCE */}
              {viewMode === "map" && (
                <div className="mt-2.5">
                  <div className="relative h-[280px] w-full overflow-hidden rounded-[24px] border-2 border-[#e5d0d8] bg-[#f8edf1] shadow-inner">
                    <div ref={mapContainerRef} className="h-full w-full z-10" />

                    <div className="absolute bottom-2 left-2 z-20 flex items-center gap-2 rounded-xl bg-white/90 px-2.5 py-1 text-[9px] font-bold text-[#580e36] shadow backdrop-blur-xs">
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Dispo</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Affluence</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Panne</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ENCART D'URGENCE INTERACTIF : ORIENTATIONS REÇUES PAR LE CENTRE OU SUIVIES PAR LE DOCTEUR */}
              {currentUser?.role === "admin" && (currentUser?.adminType === "center" || currentUser?.adminType === "doctor") && (
                <div className="mt-3 space-y-2">
                  <div className="rounded-2xl border-2 border-rose-300 bg-gradient-to-br from-rose-50 via-white to-pink-50 p-3.5 shadow-sm">
                    <div className="flex items-center justify-between border-b border-rose-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-rose-600 text-white shadow-xs animate-pulse">
                          <AlertTriangle size={16} />
                        </span>
                        <div>
                          <h4 className="font-bold text-xs text-[#580e36]">
                            {currentUser.adminType === "center"
                              ? "🚨 Orientations d'Urgence Reçues"
                              : "🩺 Vos Orientations Patientes en Cours"}
                          </h4>
                          <p className="text-[10px] text-rose-700 font-semibold">
                            {currentUser.adminType === "center"
                              ? "Coordination directe avec les médecins prescripteurs"
                              : "Suivi en direct de la prise en charge au centre"}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                        {urgentOrientations.length} active(s)
                      </span>
                    </div>

                    {/* Liste des fiches d'orientation urgentes */}
                    <div className="mt-2.5 space-y-2 text-xs">
                      {urgentOrientations.map((orient) => (
                        <div
                          key={orient.id}
                          className="rounded-xl border border-rose-200 bg-white p-3 shadow-2xs space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-xs text-[#580e36]">
                                  {orient.patientName} ({orient.patientAge} ans)
                                </span>
                                <span className={`rounded-full px-2 py-0.5 text-[9px] font-black ${
                                  orient.urgencyLevel === "immediate"
                                    ? "bg-rose-600 text-white animate-pulse"
                                    : "bg-amber-500 text-white"
                                }`}>
                                  {orient.urgencyLabel}
                                </span>
                              </div>
                              <p className="text-[10.5px] text-gray-500 mt-0.5">
                                Réf : <span className="font-mono font-bold text-[#580e36]">{orient.id}</span> · Prescrit par <strong>{orient.doctorName}</strong>
                              </p>
                            </div>
                            <span className="text-[9.5px] font-semibold text-gray-400">
                              {orient.createdAt}
                            </span>
                          </div>

                          <div className="rounded-lg bg-pink-50/60 p-2 text-[11px] text-[#580e36]">
                            <p className="font-bold text-[10px] uppercase text-[#ea2d6d]">Examens prescrits :</p>
                            <p className="font-semibold">{orient.recommendedExam}</p>
                            <p className="mt-1 text-[10.5px] italic text-[#785566]">« {orient.clinicalObservations} »</p>
                          </div>

                          {/* Statut & Réponse du Centre */}
                          {orient.status === "accepted_urgent" ? (
                            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2 text-emerald-900 text-[11px] flex items-center justify-between">
                              <span className="flex items-center gap-1.5 font-bold">
                                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                                <span>Validé : Patiente attendue d'urgence ({orient.centerEstimatedDelay})</span>
                              </span>
                              <span className="text-[9px] bg-emerald-200 px-1.5 py-0.5 rounded font-bold text-emerald-900">Confirmé</span>
                            </div>
                          ) : orient.status === "scheduled_wait" ? (
                            <div className="rounded-lg bg-amber-50 border border-amber-200 p-2 text-amber-900 text-[11px] flex items-center justify-between">
                              <span className="flex items-center gap-1.5 font-bold">
                                <Clock size={14} className="text-amber-600 shrink-0" />
                                <span>{orient.centerValidationMessage}</span>
                              </span>
                              <span className="text-[9px] bg-amber-200 px-1.5 py-0.5 rounded font-bold text-amber-900">Programmé</span>
                            </div>
                          ) : (
                            /* En attente de validation par le Centre de Santé */
                            currentUser.adminType === "center" ? (
                              <div className="pt-1 border-t border-rose-100 flex flex-col sm:flex-row gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleValidateOrientationByCenter(orient.id, "immediate")}
                                  className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-emerald-600 py-2 px-2.5 text-[11px] font-bold text-white shadow hover:bg-emerald-700 transition cursor-pointer"
                                >
                                  <Check size={13} />
                                  <span>Envoyez-la vite ! (Attente &lt; 15 min)</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleValidateOrientationByCenter(orient.id, "scheduled", "~45 min")}
                                  className="flex items-center justify-center gap-1 rounded-xl bg-amber-600 py-2 px-2.5 text-[11px] font-bold text-white shadow hover:bg-amber-700 transition cursor-pointer"
                                >
                                  <Clock size={13} />
                                  <span>Affluence (créneau 45 min)</span>
                                </button>
                              </div>
                            ) : (
                              <div className="rounded-lg bg-blue-50 border border-blue-200 p-2 text-blue-900 text-[10.5px] flex items-center justify-between">
                                <span className="flex items-center gap-1 font-semibold">
                                  <Clock size={13} className="text-blue-600" />
                                  <span>En attente de confirmation par le {orient.targetCenterName}</span>
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Bouton pour créer une nouvelle orientation si docteur */}
                    {currentUser.adminType === "doctor" && (
                      <button
                        type="button"
                        onClick={() => setShowOrientationModal(true)}
                        className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-[#ea2d6d] py-2 text-xs font-bold text-white shadow hover:opacity-95 transition cursor-pointer"
                      >
                        <FileText size={14} />
                        <span>Orienter une nouvelle patiente en urgence</span>
                      </button>
                    )}
                  </div>

                  {/* Bouton de mise à jour des disponibilités du centre */}
                  <button
                    onClick={() => {
                      setCenterUpdateData(centers[0]);
                      setShowCenterUpdateModal(true);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#580e36] to-[#ea2d6d] py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95 cursor-pointer"
                  >
                    <Edit3 size={15} /> Mettre à jour les disponibilités de mon centre
                  </button>
                </div>
              )}

              {/* Liste des centres */}
              <div className="mt-3 space-y-2">
                {filteredCenters.map((center) => (
                  <div key={center.id} className="rounded-2xl border border-[#efdfe4] bg-white p-3.5 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${center.statusColor}`} />
                          <span className="text-[10px] font-bold text-[#8f4a64]">{center.statusLabel}</span>
                        </div>
                        <h3 className="ph-display mt-0.5 text-sm font-bold text-[#580e36]">{center.name}</h3>
                        <p className="text-[11px] text-[#846b77]">{center.place}</p>
                      </div>
                      <button onClick={() => setSelectedCenter(center)} className="rounded-xl bg-[#faedf1] p-1.5 text-[#ea2d6d]">
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between gap-1 border-t border-[#f4e4e9] pt-2 text-[10px]">
                      <button onClick={() => handlePlayAudio(center.audioMessageFr, "fr")} className="inline-flex items-center gap-1 rounded-full border border-[#e4bfcd] bg-white px-2 py-0.5 font-bold text-[#92405d]">
                        <Volume2 size={11} /> FR
                      </button>
                      <button onClick={() => handlePlayAudio(center.audioMessageEn, "en")} className="inline-flex items-center gap-1 rounded-full border border-[#e4bfcd] bg-white px-2 py-0.5 font-bold text-[#92405d]">
                        <Volume2 size={11} /> EN
                      </button>
                      <button onClick={() => handlePlayAudio(center.audioMessageMoore, "moore")} className="inline-flex items-center gap-1 rounded-full border border-[#e4bfcd] bg-white px-2 py-0.5 font-bold text-[#92405d]">
                        <Volume2 size={11} /> Mooré
                      </button>
                      <button onClick={() => handlePlayAudio(center.audioMessageDioula, "dioula")} className="inline-flex items-center gap-1 rounded-full border border-[#e4bfcd] bg-white px-2 py-0.5 font-bold text-[#92405d]">
                        <Volume2 size={11} /> Dioula
                      </button>
                      <button
                        onClick={() => openNavigation(center.lat, center.lng, center.name)}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                        title="Démarrer l'itinéraire dans Google Maps / Apple Maps"
                      >
                        <Navigation size={10} /> GPS
                      </button>
                      <button onClick={() => setSelectedCenter(center)} className="rounded-full bg-[#ea2d6d] px-2.5 py-1 font-bold text-white">
                        Détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET : CALENDRIER, RÈGLES, AUTOPALPATION & RAPPELS               */}
          {/* ------------------------------------------------------------------ */}
          {section === "Calendrier" && !selectedCenter && (
            <section className="ph-enter px-5 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
                Santé intime & Prévention
              </span>
              <h1 className="ph-display text-[26px] leading-tight text-[#580e36]">
                Cycle & Autopalpation
              </h1>
              <p className="mt-1 text-xs text-[#795f6d]">
                Suivez vos règles, sachez le moment idéal pour observer vos seins et programmez vos rappels médicaux.
              </p>

              {/* Suivi des règles, Prédictions & Recalibration adaptative */}
              <div className="mt-3.5 rounded-[24px] border border-[#f0d4df] bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#f6e6ec] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#faedf1] text-[#ea2d6d]">
                      <Calendar size={17} />
                    </span>
                    <div>
                      <h3 className="ph-display text-sm font-bold text-[#580e36]">Cycle & Prédictions</h3>
                      <p className="text-[10px] text-[#8c566d]">Prévision locale adaptative</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-[10px] font-bold text-[#ea2d6d]">
                    Cycle moyen : {cycleLengthDays} jours
                  </span>
                </div>

                {/* Estimation actuelle calculée */}
                <div className="mt-3 rounded-2xl bg-gradient-to-br from-[#fdf5f7] to-[#faedf2] border border-[#f5dfe6] p-3 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#91586e] uppercase tracking-wider">
                        Prochaines règles estimées :
                      </span>
                      <p className="text-base font-extrabold text-[#580e36] mt-0.5">
                        {cycleInfo.nextPeriodStr}
                      </p>
                      <p className="text-[10px] text-[#785566]">
                        Dernier début noté : {new Date(lastPeriodDate).toLocaleDateString("fr-FR")}
                      </p>
                    </div>

                    <div className="text-right">
                      {cycleInfo.daysUntilNextPeriod > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#ea2d6d] shadow-xs border border-pink-100">
                          <Clock size={12} /> Dans {cycleInfo.daysUntilNextPeriod} j
                        </span>
                      ) : cycleInfo.daysUntilNextPeriod === 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800 shadow-xs">
                          <AlertCircle size={12} /> Prévues aujourd'hui
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-bold text-orange-800 shadow-xs">
                          <RotateCcw size={12} /> Décalage ({Math.abs(cycleInfo.daysUntilNextPeriod)} j)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Feedback vivant lors d'un recalibrage récent */}
                {recalibrationFeedback && (
                  <div className={`mt-2.5 rounded-xl p-2.5 text-xs flex items-start gap-2 border ${
                    recalibrationFeedback.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : recalibrationFeedback.type === "warning"
                      ? "bg-amber-50 border-amber-200 text-amber-900"
                      : "bg-blue-50 border-blue-200 text-blue-900"
                  }`}>
                    <Sparkles size={15} className="shrink-0 mt-0.5 text-[#ea2d6d]" />
                    <div className="flex-1 text-[11px] leading-relaxed">
                      <p className="font-bold">Ajustement automatique du cycle :</p>
                      <p>{recalibrationFeedback.text}</p>
                    </div>
                  </div>
                )}

                {/* MODULE D'ENREGISTREMENT ET DE RECALIBRATION */}
                <div className="mt-3 rounded-2xl bg-[#fff8fa] border border-[#f0d4de] p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#4c2a3b]">Vos règles sont là ?</p>
                      <p className="text-[10px] text-[#865d70]">
                        Enregistrez la date réelle pour recalibrer la prédiction si elle n'est pas exacte.
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Bouton 1-clic direct pour aujourd'hui */}
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                        handleRecalibratePeriod(todayStr);
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#ea2d6d] py-2 px-3 text-xs font-bold text-white shadow-xs hover:bg-[#8e3855] transition active:scale-[0.98]"
                    >
                      <CheckCircle2 size={15} /> Mes règles ont débuté aujourd'hui
                    </button>

                    {/* Bouton d'ouverture du sélecteur fin */}
                    <button
                      type="button"
                      onClick={() => setShowRecalibrateBox(!showRecalibrateBox)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-[#d6a5b6] bg-white py-2 px-3 text-xs font-bold text-[#8c3855] shadow-xs hover:bg-[#faedf1] transition"
                    >
                      <RotateCcw size={14} />
                      {showRecalibrateBox ? "Masquer le réglage" : "Autre date / Recalibrer"}
                    </button>
                  </div>

                  {/* Volet rétractable pour choisir une date spécifique et recalibrer */}
                  {showRecalibrateBox && (
                    <div className="mt-3 rounded-xl bg-white p-3 border border-[#ebd0db] shadow-xs space-y-2.5">
                      <p className="font-bold text-[#553043] text-xs">
                        Indiquez le jour réel où vos règles ont commencé :
                      </p>

                      {/* Raccourcis tactiles rapides */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
                            const d = new Date();
                            const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                            setRealPeriodDateInput(str);
                          }}
                          className={`rounded-lg px-2.5 py-1 font-semibold border ${
                            realPeriodDateInput === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`
                              ? "bg-[#ea2d6d] text-white border-[#ea2d6d]"
                              : "bg-[#faeff2] text-[#6b3c50] border-[#ebd1dc]"
                          }`}
                        >
                          Aujourd'hui
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const d = new Date();
                            d.setDate(d.getDate() - 1);
                            const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                            setRealPeriodDateInput(str);
                          }}
                          className="rounded-lg px-2.5 py-1 font-semibold bg-[#faeff2] text-[#6b3c50] border border-[#ebd1dc] hover:bg-[#f6e1e8]"
                        >
                          Hier
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const d = new Date();
                            d.setDate(d.getDate() - 2);
                            const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                            setRealPeriodDateInput(str);
                          }}
                          className="rounded-lg px-2.5 py-1 font-semibold bg-[#faeff2] text-[#6b3c50] border border-[#ebd1dc] hover:bg-[#f6e1e8]"
                        >
                          Avant-hier
                        </button>
                      </div>

                      {/* Sélecteur de date natif */}
                      <div>
                        <label className="block text-[10px] font-bold text-[#865d70] mb-1">
                          Date précise du premier jour :
                        </label>
                        <input
                          type="date"
                          value={realPeriodDateInput}
                          onChange={(e) => setRealPeriodDateInput(e.target.value)}
                          className="w-full rounded-xl border border-[#ebd2dd] p-2 text-xs font-bold text-[#580e36] bg-[#fffcfd]"
                        />
                      </div>

                      {/* Aperçu du calcul de l'écart */}
                      {(() => {
                        const prevParts = lastPeriodDate.split("-");
                        const prevDate = new Date(parseInt(prevParts[0], 10), parseInt(prevParts[1], 10) - 1, parseInt(prevParts[2], 10));
                        const realParts = realPeriodDateInput.split("-");
                        const realDate = new Date(parseInt(realParts[0], 10), parseInt(realParts[1], 10) - 1, parseInt(realParts[2], 10));
                        const diff = Math.round((realDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
                        return (
                          <div className="rounded-lg bg-[#faeff2] p-2 text-[11px] text-[#6a3c50] flex items-center justify-between">
                            <span>Écart constaté depuis le cycle précédent :</span>
                            <span className="font-extrabold text-[#ea2d6d]">
                              {diff > 0 ? `${diff} jours` : "Date invalide"}
                            </span>
                          </div>
                        );
                      })()}

                      <button
                        type="button"
                        onClick={() => handleRecalibratePeriod(realPeriodDateInput)}
                        className="w-full rounded-xl bg-gradient-to-r from-[#ea2d6d] to-[#b34d70] py-2 text-xs font-bold text-white shadow hover:opacity-95 transition"
                      >
                        Enregistrer & Recalibrer la prédiction
                      </button>
                    </div>
                  )}
                </div>

                {/* Historique des cycles recalibrés (accordéon repliable) */}
                <div className="mt-2.5 pt-2 border-t border-[#f7e4eb] flex items-center justify-between text-[11px]">
                  <button
                    type="button"
                    onClick={() => setShowCycleHistory(!showCycleHistory)}
                    className="inline-flex items-center gap-1 font-bold text-[#914c66] hover:underline"
                  >
                    <span>{showCycleHistory ? "Masquer l'historique" : "Voir l'historique de recalibration"}</span>
                    <span>({cycleHistory.length})</span>
                  </button>
                  <span className="text-[10px] text-[#9a7082]">Stockage 100% privé local</span>
                </div>

                {showCycleHistory && (
                  <div className="mt-2 space-y-1.5 text-xs">
                    {cycleHistory.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-[#f0dae2] bg-[#fffafb] p-2 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-[#580e36] text-[11px]">Cycle du {item.date}</p>
                          <p className="text-[10px] text-[#7a5868]">{item.note}</p>
                        </div>
                        <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-[#ea2d6d]">
                          {item.duration} jours
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fenêtre d'autopalpation recommandée par l'OMS */}
              <div className="mt-3.5 rounded-[24px] border-2 border-emerald-300 bg-gradient-to-br from-[#f2fbf6] to-[#e7f7ee] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[9.5px] font-bold text-white shadow-xs">
                    <CheckCheck size={13} /> Recommandation médicale
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800">
                    {cycleInfo.isOptimalWindow ? "🟢 Période Idéale Aujourd'hui" : "Prochaine période"}
                  </span>
                </div>

                <h3 className="ph-display mt-2 text-base font-bold text-[#204030]">
                  Fenêtre d'autopalpation : {cycleInfo.autopalpWindowStr}
                </h3>
                <p className="mt-1 text-xs text-[#39614c] leading-relaxed">
                  Le meilleur moment pour observer vos seins est <strong>2 à 5 jours après la fin des règles</strong>, quand les tissus mammaires sont souples et non douloureux.
                </p>

                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="rounded-xl bg-white/90 p-2 border border-emerald-200">
                    <b>1. Devant le miroir :</b> Observez bras le long du corps, puis levés (recherchez une fossette ou un pli).
                  </div>
                  <div className="rounded-xl bg-white/90 p-2 border border-emerald-200">
                    <b>2. Palpation circulaire :</b> Avec la pulpe des 3 doigts, faites des petits cercles fermes de l'extérieur vers le centre.
                  </div>
                  <div className="rounded-xl bg-white/90 p-2 border border-emerald-200">
                    <b>3. Sous l'aisselle :</b> Vérifiez le creux du bras pour vous assurer de l'absence de nodule ou ganglion dur.
                  </div>
                  <div className="rounded-xl bg-white/90 p-2 border border-emerald-200">
                    <b>4. Pression douce :</b> Pincez légèrement le mamelon pour vérifier l'absence d'écoulement anormal.
                  </div>
                </div>

                <button
                  onClick={() => {
                    setAutopalpationDoneThisMonth(true);
                    setLastAutopalpationDate(new Date().toLocaleDateString("fr-FR"));
                    notify("Bravo ! Autopalpation enregistrée pour ce mois-ci.");
                  }}
                  className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-800"
                >
                  <Check size={16} /> J'ai réalisé mon autopalpation ce mois-ci ({lastAutopalpationDate})
                </button>
              </div>

              {/* Rappels personnalisés */}
              <div className="mt-3.5 rounded-[24px] border border-[#f0d4df] bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#f6e6ec] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#faedf1] text-[#ea2d6d]">
                      <Bell size={17} />
                    </span>
                    <h3 className="ph-display text-sm font-bold text-[#580e36]">Mes rappels de santé</h3>
                  </div>
                  <button
                    onClick={() => setShowNewReminderForm(!showNewReminderForm)}
                    className="text-xs font-bold text-[#ea2d6d] hover:underline"
                  >
                    + Ajouter
                  </button>
                </div>

                {showNewReminderForm && (
                  <div className="mt-3 rounded-2xl bg-[#fdf5f7] p-3 text-xs space-y-2 border border-[#f2dbe3]">
                    <p className="font-bold text-[#623c4d]">Nouveau rappel médical :</p>
                    <input
                      type="text"
                      placeholder="Titre du rappel (ex: Échographie Schiphra)"
                      value={newReminderTitle}
                      onChange={(e) => setNewReminderTitle(e.target.value)}
                      className="w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Date et heure (ex: 28 Octobre à 10h)"
                      value={newReminderDate}
                      onChange={(e) => setNewReminderDate(e.target.value)}
                      className="w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                    />
                    <div className="flex gap-2">
                      <select
                        value={newReminderType}
                        onChange={(e) => setNewReminderType(e.target.value as any)}
                        className="rounded-xl border border-[#e4cfd6] p-1.5 text-xs font-semibold"
                      >
                        <option value="screening">Dépistage</option>
                        <option value="appointment">Rendez-vous</option>
                        <option value="treatment">Traitement</option>
                      </select>
                      <button
                        onClick={() => {
                          if (!newReminderTitle) return;
                          setReminders((prev: any[]) => [
                            ...prev,
                            { id: Date.now(), title: newReminderTitle, date: newReminderDate || "Bientôt", type: newReminderType, active: true },
                          ]);
                          setNewReminderTitle("");
                          setNewReminderDate("");
                          setShowNewReminderForm(false);
                          notify("Rappel ajouté avec succès.");
                        }}
                        className="flex-1 rounded-xl bg-[#ea2d6d] py-1.5 font-bold text-white text-xs"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-3 space-y-2 text-xs">
                  {reminders.map((r: any) => (
                    <div key={r.id} className="flex items-center justify-between rounded-xl border border-[#f2e2e7] p-2.5 bg-[#fffafc]">
                      <div className="flex items-center gap-2.5">
                        <span className={`grid h-7 w-7 place-items-center rounded-lg ${r.type === "screening" ? "bg-purple-100 text-purple-800" : r.type === "appointment" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"}`}>
                          <Clock size={14} />
                        </span>
                        <div>
                          <p className="font-bold text-[#580e36]">{r.title}</p>
                          <p className="text-[10px] text-[#865d70]">{r.date}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                        Actif ✓
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 3 : COMPRENDRE (FRANÇAIS, ENGLISH, MOORÉ & DIOULA)          */}
          {/* ------------------------------------------------------------------ */}
          {section === "Comprendre" && !selectedCenter && (
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
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 4 : ROSE IA (ASSISTANTE VOCALE DISPONIBLE)                   */}
          {/* ------------------------------------------------------------------ */}
          {/* ------------------------------------------------------------------ */}
          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 4 : ROSE IA (ASSISTANTE CONVERSATIONNELLE & ÉTHIQUE)        */}
          {/* ------------------------------------------------------------------ */}
          {section === "RoseIA" && !selectedCenter && (
            <section className="ph-enter flex flex-col h-full px-4 pt-2.5 pb-2">
              {/* ============================================================ */}
              {/* CONTENEURS DU HAUT SELON LE PROFIL                           */}
              {/* Profil Utilisatrice : uniquement "Voir la vidéo"             */}
              {/* Profil Docteur/Superadmin : "Entraîner le modèle" + "Vidéo"  */}
              {/* ============================================================ */}
              {currentUser?.adminType === "doctor" || currentUser?.role === "superadmin" ? (
                /* HAUT DE PAGE POUR DOCTEURS & SUPERADMIN */
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      hapticFeedback(15);
                      setShowDoctorTrainModal(true);
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-800 p-2.5 text-white font-bold text-xs shadow-xs hover:opacity-95 transition cursor-pointer"
                  >
                    <Stethoscope size={15} className="text-cyan-300" />
                    <span>Entraîner Rose IA 🩺</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAutopalpationVideoModal(true)}
                    className="flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#9e466b] to-rose-600 p-2.5 text-white font-bold text-xs shadow-xs hover:opacity-95 transition cursor-pointer"
                  >
                    <Play size={14} className="fill-white" />
                    <span>Voir la vidéo 🎬</span>
                  </button>
                </div>
              ) : (
                /* HAUT DE PAGE POUR LES UTILISATRICES : UNIQUEMENT VOIR LA VIDÉO */
                <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-rose-600 via-[#ea2d6d] to-[#734059] px-3.5 py-2.5 text-white shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="relative grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/20 text-white backdrop-blur-xs">
                      <Play size={14} className="fill-white translate-x-0.5" />
                      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 border border-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs">Vidéo d'Autopalpation Mammaire</h4>
                      <p className="text-[9.5px] text-white/85">
                        Démonstration guidée pas-à-pas par notre sage-femme
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAutopalpationVideoModal(true)}
                    className="rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-[#ea2d6d] shadow-xs hover:bg-pink-50 transition shrink-0 cursor-pointer"
                  >
                    Voir la vidéo 🎬
                  </button>
                </div>
              )}

              {/* MINI-BANDEAU D'ÉTAT DISCRET DE ROSE IA */}
              <div className="mt-2 flex items-center justify-between rounded-xl bg-white border border-[#f0dee3] px-3 py-1.5 text-xs shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-tr from-[#8a3857] to-[#cf5d83] text-white shadow-2xs">
                      <Sparkles size={14} className="text-amber-300" />
                    </span>
                    <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white ph-pulse" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#580e36] text-xs">Rose IA</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                      En ligne
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#863b55] hover:underline cursor-pointer"
                    title="Confidentialité et éthique médicale"
                  >
                    <ShieldCheck size={12} className="text-emerald-600" />
                    <span>100% Confidentiel</span>
                  </button>
                </div>
              </div>

              {/* CAPSULES DE QUESTIONS RAPIDES (INSPIRATION & CONSEILS) */}
              <div className="ph-scroll mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                {[
                  { label: "🌸 Toilette intime", q: "Comment bien faire ma toilette intime ?" },
                  { label: "🖐️ Comment se palper ?", q: "Comment bien faire l'autopalpation des seins étape par étape ?" },
                  { label: "🔍 Petite boule au sein", q: "J'ai senti une petite boule dans mon sein, que faire ?" },
                  { label: "🩸 Douleurs de règles", q: "Comment soulager mes crampes et douleurs de règles naturellement ?" },
                  { label: "🌿 Moringa & Baobab", q: "Quels sont les bienfaits du moringa et du baobab pour ma santé ?" },
                  { label: "📍 Centres de dépistage", q: "Où se faire dépister à Ouagadougou ?" },
                  { label: "💰 Coût du dépistage", q: "Combien coûte le dépistage au Burkina Faso ?" },
                  { label: "🧘‍♀️ Sérénité & moral", q: "Je me sens fatiguée et stressée, aide-moi" },
                ].map(({ label, q }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleSendRoseMessage(q)}
                    className="shrink-0 rounded-full border border-[#e4cad3] bg-white px-2.5 py-1 text-[#863b55] font-semibold hover:bg-[#faedf2] transition shadow-2xs cursor-pointer"
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* ZONE DES MESSAGES DU CHATBOT ROSE IA (HAUTEUR DYNAMIQUE PLEINE) */}
              <div className="mt-2 space-y-2.5 flex-1 min-h-[300px] overflow-y-auto pr-1">
                {roseMessages.map((msg, i) => {
                  const isUser = msg.sender === "user";
                  // Texte à afficher selon la langue choisie
                  const displayedText = isUser
                    ? msg.text
                    : appLanguage === "moore" && msg.mooreText
                    ? msg.mooreText
                    : appLanguage === "dioula" && msg.dioulaText
                    ? msg.dioulaText
                    : appLanguage === "en" && msg.englishText
                    ? msg.englishText
                    : msg.text;

                  const hasVideoRecommendation =
                    !isUser &&
                    (msg.text.toLowerCase().includes("palpation") ||
                      msg.text.toLowerCase().includes("geste") ||
                      msg.text.toLowerCase().includes("boule") ||
                      msg.text.toLowerCase().includes("sein") ||
                      msg.text.toLowerCase().includes("nodule"));

                  return (
                    <div
                      key={i}
                      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[88%] rounded-[20px] p-3 text-xs leading-relaxed shadow-xs ${
                          isUser
                            ? "bg-[#ea2d6d] text-white rounded-tr-xs"
                            : "bg-white text-[#580e36] border border-[#f0dfe4] rounded-tl-xs"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{displayedText}</p>

                        {/* Bouton cliquable pour voir la vidéo si suggéré par Rose IA */}
                        {hasVideoRecommendation && (
                          <button
                            type="button"
                            onClick={() => setShowAutopalpationVideoModal(true)}
                            className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#ea2d6d] to-rose-700 py-1.5 px-2.5 text-[11px] font-bold text-white shadow-xs hover:opacity-95 transition cursor-pointer"
                          >
                            <Play size={12} className="fill-white" />
                            <span>Voir la démonstration vidéo (Sage-femme) 🎬</span>
                          </button>
                        )}
                      </div>

                      {/* ÉCOUTE VOCALE DISCRÈTE (DANS LA LANGUE CHOISIE) */}
                      {!isUser && (
                        <div className="mt-1 flex items-center gap-2 pl-1">
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(displayedText, appLanguage)}
                            className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#ea2d6d] hover:underline cursor-pointer"
                            title={`Écouter à voix haute en ${appLanguage.toUpperCase()}`}
                          >
                            <Volume2 size={12} />
                            <span>Écouter ({appLanguage === "moore" ? "Mooré" : appLanguage === "dioula" ? "Dioula" : appLanguage.toUpperCase()})</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Point d'ancrage pour le défilement automatique */}
                <div ref={roseChatBottomRef} />
              </div>

              {/* RAPPEL ÉTHIQUE MÉDICAL */}
              <div className="mt-1.5 text-center text-[9px] text-[#936b7c] px-2 italic">
                🛡️ Rose IA est une conseillère préventive bienveillante. Elle ne remplace pas l'avis d'une sage-femme ou d'un médecin.
              </div>

              {/* BARRE DE SAISIE MODERNE & RÉACTIVE (<FORM> TOUCHE ENTRÉE + MICRO) */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendRoseMessage();
                }}
                className="mt-1.5 rounded-2xl border border-[#e5ccd5] bg-white p-2 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleVoiceRecognition}
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition cursor-pointer ${
                      isRecordingVoice
                        ? "bg-rose-600 text-white ph-pulse ring-2 ring-rose-300"
                        : "bg-[#f8e7ec] text-[#ea2d6d] hover:bg-[#f2dbe2]"
                    }`}
                    title={isRecordingVoice ? "Arrêter le micro" : "Parler à Rose IA au micro"}
                  >
                    <Mic size={17} className={isRecordingVoice ? "animate-pulse" : ""} />
                  </button>
                  <input
                    type="text"
                    value={roseInput}
                    onChange={(e) => setRoseInput(e.target.value)}
                    placeholder={
                      isRecordingVoice
                        ? "Rose IA vous écoute avec tendresse... Parlez"
                        : "Posez votre question à Rose IA (écrit ou micro)..."
                    }
                    className="flex-1 bg-transparent text-xs text-[#580e36] outline-none placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={!roseInput.trim()}
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition cursor-pointer ${
                      roseInput.trim()
                        ? "bg-[#ea2d6d] text-white hover:bg-[#8e3856] shadow-xs"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                    title="Envoyer le message"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 5 : FAIRE UN DON (AVEC OPTION ANONYME CHIFFRÉE)             */}
          {/* ------------------------------------------------------------------ */}
          {section === "FaireUnDon" && !selectedCenter && (
            <section className="ph-enter px-5 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
                Solidarité · Burkina Faso
              </span>
              <h1 className="ph-display text-[26px] leading-tight text-[#580e36]">
                Faire un don
              </h1>
              <p className="mt-1 text-xs text-[#795f6d]">
                Votre contribution finance directement le dépistage et les soins de femmes sans revenus au Burkina Faso.
              </p>

              <div className="mt-3.5 rounded-[26px] border-2 border-rose-300 bg-gradient-to-br from-[#fff7f9] to-[#ffedf3] p-5 shadow-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ea2d6d] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                  <Heart size={13} className="fill-white" /> 100% Solidaire & Sécurisé
                </span>

                <h3 className="ph-display mt-2 text-lg font-bold text-[#3d2430]">
                  Offrir un examen de dépistage
                </h3>
                <p className="mt-1 text-xs text-[#684a58] leading-relaxed">
                  Grâce à votre don de <strong>2 500 à 5 000 FCFA</strong>, une mère de famille vulnérable bénéficie immédiatement d'une consultation et d'une mammographie complète.
                </p>

                <div className="mt-4">
                  <button
                    onClick={() => setShowDonationModal(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ea2d6d] py-3 text-xs font-bold text-white shadow hover:bg-[#d81f5c] transition"
                  >
                    <Heart size={15} className="fill-white" /> Commencer mon don maintenant
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="ph-display text-sm font-bold text-[#580e36]">Associations partenaires éligibles</h3>
                <div className="mt-2 space-y-2">
                  {partnerAssociations.map((assoc) => (
                    <div key={assoc.id} className="rounded-2xl border border-[#eedde2] bg-white p-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#580e36]">{assoc.name} ({assoc.acronym})</span>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">Vérifié</span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#785b6a]">{assoc.mission}</p>
                      <button
                        onClick={() => {
                          setSelectedAssociation(assoc);
                          setShowDonationModal(true);
                        }}
                        className="mt-2 font-bold text-[#ea2d6d] hover:underline block text-[10.5px]"
                      >
                        Faire un don à {assoc.acronym} →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET ANNONCES (CONSULTATION MOIS EN COURS & PUBLICATION ADMIN)   */}
          {/* ------------------------------------------------------------------ */}
          {section === "Annonces" && !selectedCenter && (
            <section className="ph-enter px-5 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
                    Actualités & Partenaires
                  </span>
                  <h1 className="ph-display text-[26px] leading-tight text-[#580e36]">
                    Annonces
                  </h1>
                </div>
                {/* Bouton de publication pour les partenaires et soignants */}
                {(currentUser?.role === "admin" || currentUser?.role === "superadmin") && (
                  <button
                    onClick={() => setShowNewAnnouncementModal(true)}
                    className="rounded-full bg-[#ea2d6d] px-3.5 py-1 text-xs font-bold text-white shadow hover:bg-[#8e3856]"
                  >
                    + Publier
                  </button>
                )}
              </div>

              {/* FILTRES D'ANNONCES : MOIS EN COURS / TOUTES / VEILLE ROSE IA / MES ANNONCES */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
                <button
                  onClick={() => setAnnouncementsFilter("month")}
                  className={`rounded-full px-3 py-1 font-bold transition ${announcementsFilter === "month" ? "bg-[#ea2d6d] text-white shadow-xs" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  📅 Mois en cours (Octobre 2026)
                </button>
                <button
                  onClick={() => setAnnouncementsFilter("rose_ai")}
                  className={`rounded-full px-3 py-1 font-bold transition inline-flex items-center gap-1 ${announcementsFilter === "rose_ai" ? "bg-purple-900 text-white shadow-xs" : "border border-purple-200 bg-purple-50 text-purple-900"}`}
                >
                  <Sparkles size={12} className="text-amber-400" />
                  <span>Veille Rose IA ({announcements.filter((a) => a.isRoseAIDetected && a.status === "approved").length})</span>
                </button>
                <button
                  onClick={() => setAnnouncementsFilter("all")}
                  className={`rounded-full px-3 py-1 font-bold transition ${announcementsFilter === "all" ? "bg-[#ea2d6d] text-white shadow-xs" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  Toutes ({announcements.filter((a) => a.status === "approved").length})
                </button>
                {(currentUser?.role === "admin" || currentUser?.role === "superadmin") && (
                  <button
                    onClick={() => setAnnouncementsFilter("my")}
                    className={`rounded-full px-3 py-1 font-bold transition ${announcementsFilter === "my" ? "bg-[#ea2d6d] text-white shadow-xs" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                  >
                    Mes soumissions ({announcements.filter((a) => a.submittedBy === currentUser?.structureName || a.submittedBy === `${currentUser?.prenom} ${currentUser?.nom}`).length})
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2.5">
                {displayedAnnouncements.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#dfb3c1] bg-[#fffafb] p-6 text-center text-xs text-[#815569]">
                    Aucune annonce dans cette catégorie pour le moment.
                  </div>
                ) : (
                  displayedAnnouncements.map((a) => (
                    <div
                      key={a.id}
                      className={`rounded-2xl border p-3.5 text-xs shadow-sm ${
                        a.isRoseAIDetected
                          ? "border-purple-200 bg-gradient-to-br from-white to-purple-50/40"
                          : "border-[#efdfe4] bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${a.badgeColor}`}>
                          {a.badge}
                        </span>
                        <span className="text-[10px] text-[#8e6878] font-semibold">{a.month}</span>
                      </div>

                      {/* Mention spéciale si repérée par Rose IA */}
                      {a.isRoseAIDetected && (
                        <div className="mt-1 flex items-center gap-1 text-[9.5px] font-bold text-purple-900 bg-purple-100/70 px-2 py-0.5 rounded-lg w-fit">
                          <Sparkles size={11} className="text-amber-500" />
                          <span>Veille intelligente Rose IA · {a.sourceWebUrl}</span>
                        </div>
                      )}

                      <h3 className="ph-display mt-1 text-sm font-bold text-[#580e36]">{a.title}</h3>
                      <p className="text-[11px] text-[#8c405c] mt-0.5 font-semibold">
                        {a.author} · {a.city}
                      </p>

                      {/* Affiche officielle ou photo de l'événement */}
                      {a.imageUrl && (
                        <div className="relative mt-2 overflow-hidden rounded-xl border border-pink-100 shadow-xs group">
                          <img
                            src={a.imageUrl}
                            alt={a.title}
                            className="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-102"
                            loading="lazy"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedPosterModal({
                                url: a.imageUrl!,
                                title: a.title,
                                author: a.author,
                                caption: a.imageCaption,
                              })
                            }
                            className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-black/75 px-2 py-1 text-[9.5px] font-bold text-white backdrop-blur-xs hover:bg-black/90 transition shadow-sm"
                          >
                            <Eye size={12} /> Agrandir l'affiche
                          </button>
                        </div>
                      )}

                      <p className="mt-2 text-[#6d4f5e] leading-relaxed">{a.content}</p>

                      <div className="mt-2 flex items-center justify-between border-t border-[#f7e8ee] pt-2 text-[10px] text-[#8b6375]">
                        <span>📞 {a.contact}</span>
                        <span>{a.date}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET L'ACCOMPAGNANT (WHATSAPP + SMS SIMPLE EXIGÉ)                */}
          {/* ------------------------------------------------------------------ */}
          {section === "Accompagnant" && !selectedCenter && (
            <section className="ph-enter px-5 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
                Aller à deux
              </span>
              <h1 className="ph-display text-[26px] leading-tight text-[#580e36]">
                L'Accompagnant
              </h1>
              <p className="mt-1 text-xs text-[#795f6d]">
                Aller faire son dépistage, c'est plus facile à deux. Invitez une proche par WhatsApp ou directement par SMS simple (sans connexion internet requise).
              </p>

              {/* Choix de la langue de message d'accompagnement */}
              <div className="mt-3.5 rounded-2xl bg-white border border-[#ebd6dc] p-3 text-xs">
                <label className="block font-bold text-[#543644] mb-1.5">Langue de l'invitation :</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSmsLanguage("fr")}
                    className={`flex-1 rounded-xl py-1.5 font-bold transition text-xs ${smsLanguage === "fr" ? "bg-[#ea2d6d] text-white" : "border border-[#e5ccd5] text-[#714f5e]"}`}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => setSmsLanguage("moore")}
                    className={`flex-1 rounded-xl py-1.5 font-bold transition text-xs ${smsLanguage === "moore" ? "bg-[#ea2d6d] text-white" : "border border-[#e5ccd5] text-[#714f5e]"}`}
                  >
                    Mooré
                  </button>
                </div>

                <div className="mt-3 rounded-xl bg-[#fdf5f8] border border-[#f5dfeb] p-2.5 text-[11px] italic text-[#6f4b5d]">
                  « {smsLanguage === "fr"
                    ? `Bonjour ma sœur, je t'invite à faire notre dépistage du sein ensemble sur PagLaafi : ${appShareUrl}`
                    : `Ne y beogo m maaso, m boola fo tɩ d kẽng a yiibu n ges d yĩnsa laafi ne PagLaafi : ${appShareUrl}`} »
                </div>

                {/* 1. BOUTON ENVOI PAR WHATSAPP */}
                <button
                  onClick={() => {
                    const text = encodeURIComponent(
                      smsLanguage === "fr"
                        ? `Bonjour ma sœur, je t'invite à faire notre dépistage du sein ensemble sur PagLaafi : ${appShareUrl}`
                        : `Ne y beogo m maaso, m boola fo tɩ d kẽng a yiibu n ges d yĩnsa laafi ne PagLaafi : ${appShareUrl}`,
                    );
                    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
                    notify("Invitation WhatsApp prête à l'envoi.");
                  }}
                  className="mt-3 w-full rounded-2xl bg-emerald-600 py-2.5 font-bold text-white text-center flex items-center justify-center gap-2 shadow hover:bg-emerald-700 transition"
                >
                  <MessageCircle size={16} /> Inviter mon accompagnant(e) par WhatsApp
                </button>

                {/* 2. BOUTON ENVOI PAR SMS SIMPLE (EXIGÉ) */}
                <button
                  onClick={() => {
                    const text = encodeURIComponent(
                      smsLanguage === "fr"
                        ? `Bonjour ma sœur, je t'invite à faire notre dépistage du sein ensemble sur PagLaafi : ${appShareUrl}`
                        : `Ne y beogo m maaso, m boola fo tɩ d kẽng a yiibu n ges d yĩnsa laafi ne PagLaafi : ${appShareUrl}`,
                    );
                    window.open(`sms:?body=${text}`, "_blank");
                    notify("Application SMS ouverte pour envoi direct.");
                  }}
                  className="mt-2 w-full rounded-2xl border-2 border-emerald-600 bg-white py-2.5 font-bold text-emerald-800 text-center flex items-center justify-center gap-2 hover:bg-emerald-50 transition"
                >
                  <Phone size={16} /> Envoyer par SMS simple (Sans connexion Internet)
                </button>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* FICHE DÉTAILLÉE D'UN CENTRE                                        */}
          {/* ------------------------------------------------------------------ */}
          {selectedCenter && (
            <section className="ph-enter px-5 pt-4">
              <button
                onClick={() => {
                  setSelectedCenter(null);
                  setTimeout(() => {
                    if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
                  }, 150);
                }}
                className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#ea2d6d] hover:underline cursor-pointer"
              >
                <ArrowLeft size={16} /> Retour à la carte des centres
              </button>

              <div className="rounded-[26px] bg-[#f8e7ec] p-4 shadow-sm border border-[#eed6de]">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-[#8f4a64] shadow-2xs">
                      <span className={`h-2 w-2 rounded-full ${selectedCenter.statusColor}`} />
                      {selectedCenter.statusLabel}
                    </span>
                    <h1 className="ph-display text-xl font-bold text-[#580e36] mt-1.5">{selectedCenter.name}</h1>
                    <p className="text-xs text-[#805e6f] mt-0.5 flex items-center gap-1">
                      <MapPin size={13} className="text-[#ea2d6d] shrink-0" /> {selectedCenter.address} ({selectedCenter.place})
                    </p>
                    <p className="text-xs text-[#805e6f] mt-0.5 flex items-center gap-1">
                      <Phone size={13} className="text-[#ea2d6d] shrink-0" /> {selectedCenter.phone}
                    </p>
                  </div>
                </div>

                {/* Boutons d'Action Principaux : Itinéraire GPS & Téléphone */}
                <div className="mt-3.5 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openNavigation(selectedCenter.lat, selectedCenter.lng, selectedCenter.name)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition cursor-pointer"
                    title="Ouvrir dans Google Maps ou Apple Maps selon votre appareil"
                  >
                    <Navigation size={15} /> Itinéraire GPS
                  </button>
                  <a
                    href={`tel:${selectedCenter.phone}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#ea2d6d] px-3 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#8e3856] transition text-center"
                    title="Appeler le secrétariat du centre"
                  >
                    <Phone size={15} /> Appeler
                  </a>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-white/90 p-2.5 border border-[#eed6de]">
                    <p className="text-[9px] font-bold uppercase text-[#9f697d]">Équipement</p>
                    <p className="font-bold text-[#580e36] mt-0.5">{selectedCenter.apparatus}</p>
                  </div>
                  <div className="rounded-xl bg-white/90 p-2.5 border border-[#eed6de]">
                    <p className="text-[9px] font-bold uppercase text-[#9f697d]">File d'attente</p>
                    <p className="font-bold text-[#580e36] mt-0.5">{selectedCenter.queueCount} personnes ({selectedCenter.estimatedWait})</p>
                  </div>
                </div>
              </div>

              {/* Messages audio en 4 langues du centre */}
              <div className="mt-3 rounded-2xl border border-[#ebd6dc] bg-white p-3 text-xs">
                <span className="flex items-center gap-1.5 font-bold text-[#4a2b3b]">
                  <Volume2 size={15} className="text-[#ea2d6d]" /> Message audio du centre
                </span>
                <p className="mt-1 italic text-[#725462]">« {selectedCenter.audioMessageFr} »</p>
                <div className="mt-2.5 grid grid-cols-4 gap-1">
                  <button onClick={() => handlePlayAudio(selectedCenter.audioMessageFr, "fr")} className="rounded-xl bg-[#ea2d6d] py-1.5 text-[10px] font-bold text-white">FR</button>
                  <button onClick={() => handlePlayAudio(selectedCenter.audioMessageEn, "en")} className="rounded-xl bg-[#ea2d6d] py-1.5 text-[10px] font-bold text-white">EN</button>
                  <button onClick={() => handlePlayAudio(selectedCenter.audioMessageMoore, "moore")} className="rounded-xl border border-[#e2bac8] bg-[#fdf5f7] py-1.5 text-[10px] font-bold text-[#8a3350]">Mooré</button>
                  <button onClick={() => handlePlayAudio(selectedCenter.audioMessageDioula, "dioula")} className="rounded-xl border border-[#e2bac8] bg-[#fdf5f7] py-1.5 text-[10px] font-bold text-[#8a3350]">Dioula</button>
                </div>
              </div>

              {/* Tarifs */}
              <div className="mt-3 rounded-2xl border border-[#ebd6dc] bg-white p-3.5">
                <h3 className="ph-display text-sm font-bold text-[#580e36]">Examens & Tarifs officiels</h3>
                <div className="mt-2 divide-y divide-[#f5e6eb] text-xs">
                  {selectedCenter.exams.map((exam, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5">
                      <span>{exam.name}</span>
                      <span className={exam.free ? "font-bold text-emerald-700" : "font-bold text-[#ea2d6d]"}>
                        {exam.free ? "0 FCFA (Gratuit)" : `${exam.price.toLocaleString("fr-FR")} FCFA`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
            </>
          )}
        </div>

        {/* ==================================================================== */}
        {/* BARRE DE NAVIGATION INFÉRIEURE : AFFICHÉE UNIQUEMENT QUAND CONNECTÉ */}
        {/* ==================================================================== */}
        {currentUser && (
          <nav
            aria-label="Navigation principale"
            className="z-30 shrink-0 border-t border-[#f0dee3] bg-white/95 backdrop-blur-md px-1 pb-[max(10px,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-8px_25px_rgba(75,30,50,.07)]"
          >
            <div className="grid grid-cols-5 items-end">
              {[
                { label: "Accueil" as Section, icon: Heart, name: "Accueil" },
                { label: "Comprendre" as Section, icon: BookOpen, name: "Comprendre" },
                { label: "RoseIA" as Section, icon: Sparkles, name: "Rose IA", isCentral: true },
                { label: "Centres" as Section, icon: MapPin, name: "Centres" },
                { label: "FaireUnDon" as Section, icon: Gift, name: "Faire un don" },
              ].map(({ label, icon: Icon, name, isCentral }) => {
                const active = section === label;

                if (isCentral) {
                  return (
                    <button
                      key={label}
                      onClick={() => {
                        hapticFeedback(18);
                        setSection(label);
                        setSelectedCenter(null);
                      }}
                      aria-current={active ? "page" : undefined}
                      className="group relative -mt-4 flex flex-col items-center justify-center focus:outline-none"
                    >
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-white shadow-[0_6px_18px_rgba(161,67,100,.35)] transition-all duration-300 group-hover:scale-105 ${active ? "bg-gradient-to-tr from-[#8a3350] via-[#ea2d6d] to-[#cf5d83] text-white ring-2 ring-[#ea2d6d]/30" : "bg-gradient-to-tr from-[#9c3e5d] to-[#be5377] text-white"}`}
                      >
                        <Sparkles size={21} className="text-amber-300 animate-pulse" />
                      </span>
                      <span
                        className={`mt-0.5 text-[9.5px] tracking-tight font-extrabold transition ${active ? "text-[#ea2d6d]" : "text-[#7b5465]"}`}
                      >
                        Rose IA
                      </span>
                    </button>
                  );
                }

                return (
                  <button
                    key={label}
                    onClick={() => {
                      hapticFeedback(12);
                      setSection(label);
                      setSelectedCenter(null);
                      if (label === "FaireUnDon") {
                        setShowDonationModal(true);
                      }
                    }}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-2xl transition ${active ? "text-[#ea2d6d]" : "text-[#9d838e] hover:text-[#785062]"}`}
                  >
                    <span
                      className={`grid h-7 w-9 place-items-center rounded-full transition-all duration-200 ${active ? "bg-[#fbe7ed] text-[#ea2d6d] shadow-xs" : ""}`}
                    >
                      <Icon size={18} strokeWidth={active ? 2.5 : 1.8} className={label === "FaireUnDon" && active ? "fill-[#ea2d6d]" : ""} />
                    </span>
                    <span
                      className={`text-[9.5px] tracking-tight transition ${active ? "font-bold text-[#ea2d6d]" : "font-medium text-[#9d838e]"}`}
                    >
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}

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
        {toast && (
          <div
            role="status"
            className="ph-enter absolute bottom-[80px] left-4 right-4 z-40 flex items-start gap-2.5 rounded-2xl bg-[#4d2d3e] px-4 py-3 text-xs leading-5 text-white shadow-[0_10px_30px_rgba(40,18,30,.25)]"
          >
            <Check size={16} className="mt-0.5 shrink-0 text-[#f5bed0]" />
            <span className="flex-1">{toast}</span>
          </div>
        )}
      </div>
    </main>
  );
}
