import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Edit3,
  FileText,
  GraduationCap,
  Heart,
  Languages,
  LogOut,
  MapPin,
  Megaphone,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { getProfileIdentity } from "../lib/identiteProfil";
import { useUi, useAuth, useCentres, useOrientations, useSante, useDocteur, useAnnonces, useDons, useAdministration, useLangue } from "../etat/contextes";

/**
 * Menu latéral : profil, raccourcis par rôle, navigation, langue et numéro d'urgence.
 */
export function MenuLateral() {
  const { appLanguage, handleTriggerInstall, isStandaloneApp, section, setSection, setSidebarOpen, sidebarOpen } = useUi();
  const { currentUser, handleLogout, pendingRegistrations, setAuthMode } = useAuth();
  const { centers, setCenterUpdateData, setSelectedCenter, setShowCenterUpdateModal } = useCentres();
  const { setShowOrientationModal } = useOrientations();
  const { setShowPrivacyModal } = useSante();
  const { setShowDoctorTrainModal } = useDocteur();
  const { announcements } = useAnnonces();
  const { setShowDonationModal } = useDons();
  const { setShowAdminDashboardModal, setShowSuperadminModal } = useAdministration();
  const { handleSelectAppLanguage } = useLangue();

  if (!(sidebarOpen)) return null;

  return (
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
  );
}
