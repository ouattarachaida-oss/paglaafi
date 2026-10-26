import { GraduationCap, LogOut, MapPin, Menu, Phone, ShieldCheck, Smartphone, Sparkles } from "lucide-react";
import { getProfileIdentity } from "../lib/identiteProfil";
import { MODE_DEMO } from "../config";
import { useUi, useAuth, useSante, useDocteur } from "../etat/contextes";

/**
 * En-tête fixe : menu, logo, installation, Rose IA et menu de profil.
 */
export function EnTete() {
  const {
    handleTriggerInstall,
    isStandaloneApp,
    section,
    setSection,
    setShowLanguageMenu,
    setShowProfileMenu,
    setSidebarOpen,
    showProfileMenu,
  } = useUi();
  const { currentUser, handleLogout, quickLoginAs } = useAuth();
  const { setShowPrivacyModal } = useSante();
  const { setShowDoctorTrainModal } = useDocteur();

  return (
    <header className="z-30 flex items-center justify-between border-b border-[#f4e2e7] bg-white/95 px-4 py-2.5 backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setSidebarOpen(true)}
          className="grid h-9 w-9 place-items-center rounded-full text-[#75475a] hover:bg-[#fbf0f4]"
          aria-label="Ouvrir le menu"
        >
          <Menu size={20} />
        </button>
        <div onClick={() => setSection("Accueil")} className="flex items-center gap-2 cursor-pointer">
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
          title={
            isStandaloneApp ? "Application PagLaafi active en mode autonome" : "Installer l'application sur smartphone"
          }
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
        {currentUser &&
          (() => {
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
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${headerProfileIdentity.dotColor}`}
                  />
                </button>

                {/* Menu Popover Déconnexion Directe */}
                {showProfileMenu && (
                  <div
                    className="ph-enter absolute right-0 top-12 z-50 w-64 rounded-2xl border border-[#ebd4dd] bg-white p-3.5 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-3 border-b border-[#f5e4ea] pb-3">
                      <div
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${headerProfileIdentity.bg} ${headerProfileIdentity.text} border ${headerProfileIdentity.border} shadow-xs`}
                      >
                        {headerProfileIdentity.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-[#580e36] text-xs truncate">
                          {currentUser.prenom} {currentUser.nom}
                        </p>
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${headerProfileIdentity.badgeBg}`}
                        >
                          {currentUser.roleLabel}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-[10.5px] text-[#7a5969] space-y-0.5">
                      <p className="flex items-center gap-1.5">
                        <Phone size={12} className="text-[#ea2d6d]" /> {currentUser.telephone}
                      </p>
                      {currentUser.structureName && (
                        <p className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-[#ea2d6d]" /> {currentUser.structureName}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#f7e6ec] space-y-2">
                      {/* Changement de profil en 1 clic : mode démo uniquement */}
                      {MODE_DEMO && (
                      <div>
                        <p className="text-[10px] font-bold text-[#8c4d66] mb-1.5">Changer de profil (1-clic) :</p>
                        <div className="grid grid-cols-2 gap-1 text-[10px]">
                          <button
                            onClick={() => {
                              quickLoginAs("user");
                              setShowProfileMenu(false);
                            }}
                            className={`rounded-lg px-2 py-1 font-semibold text-left transition ${currentUser.role === "user" ? "bg-[#ea2d6d] text-white" : "bg-pink-50 text-[#6f334a] hover:bg-pink-100"}`}
                          >
                            👩 Utilisatrice
                          </button>
                          <button
                            onClick={() => {
                              quickLoginAs("center");
                              setShowProfileMenu(false);
                            }}
                            className={`rounded-lg px-2 py-1 font-semibold text-left transition ${currentUser.adminType === "center" ? "bg-[#ea2d6d] text-white" : "bg-pink-50 text-[#6f334a] hover:bg-pink-100"}`}
                          >
                            🏥 Centre Santé
                          </button>
                          <button
                            onClick={() => {
                              quickLoginAs("doctor");
                              setShowProfileMenu(false);
                            }}
                            className={`rounded-lg px-2 py-1 font-semibold text-left transition ${currentUser.adminType === "doctor" ? "bg-[#ea2d6d] text-white" : "bg-pink-50 text-[#6f334a] hover:bg-pink-100"}`}
                          >
                            🩺 Docteur
                          </button>
                          <button
                            onClick={() => {
                              quickLoginAs("association");
                              setShowProfileMenu(false);
                            }}
                            className={`rounded-lg px-2 py-1 font-semibold text-left transition ${currentUser.adminType === "association" ? "bg-[#ea2d6d] text-white" : "bg-pink-50 text-[#6f334a] hover:bg-pink-100"}`}
                          >
                            🎗️ Association
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            quickLoginAs("superadmin");
                            setShowProfileMenu(false);
                          }}
                          className={`w-full mt-1 rounded-lg px-2 py-1 font-semibold text-left text-[10px] transition ${currentUser.role === "superadmin" ? "bg-purple-900 text-white" : "bg-purple-50 text-purple-900 hover:bg-purple-100"}`}
                        >
                          🛡️ Superadmin National
                        </button>
                      </div>
                      )}

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
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                            100% Local
                          </span>
                        </button>

                        {/* Simulation réservée aux soignants et superadmin */}
                        {currentUser &&
                          (currentUser.role === "superadmin" ||
                            (currentUser.role === "admin" && currentUser.adminType === "doctor")) && (
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
                              <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                                4 étapes
                              </span>
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
  );
}
