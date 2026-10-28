import { ClipboardList, LogOut, MapPin, Menu, Phone, ShieldCheck, Smartphone } from "lucide-react";
import { MODE_DEMO, MODE_REEL } from "../config";
import { useUi, useAuth, useSante, useDocteur } from "../etat/contextes";
import { BadgeDemo, BadgeRole, OngletsSegmentes } from "./ui";
import type { Theme } from "../etat/useEtatUi";

/** Initiales affichées dans l'avatar. */
const initiales = (prenom: string, nom: string) => `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();

/**
 * En-tête (64 px) : menu (mobile et tablette), logo, pastille Démo, installation
 * de la PWA et avatar ouvrant le menu du profil (rôle, thème, confidentialité, déconnexion).
 */
export function EnTete() {
  const { handleTriggerInstall, isStandaloneApp, setSection, setShowProfileMenu, setSidebarOpen, showProfileMenu, theme, setTheme } =
    useUi();
  const { currentUser, handleLogout, quickLoginAs } = useAuth();
  const { setShowPrivacyModal } = useSante();
  const { setShowDoctorTrainModal } = useDocteur();
  const estPro = currentUser?.role === "admin" || currentUser?.role === "superadmin";
  const fermer = () => setShowProfileMenu(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-bordure bg-surface/95 px-2 backdrop-blur md:px-4 lg:px-8">
      {currentUser && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="grid h-11 w-11 place-items-center rounded-full text-texte-2 active:bg-rose-200 lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu size={24} aria-hidden />
        </button>
      )}
      <button
        type="button"
        onClick={() => setSection("Accueil")}
        className={`flex min-h-11 items-center gap-2 rounded-bouton pr-2 ${currentUser ? "lg:hidden" : "pl-2"}`}
        aria-label="PagLaafi, retour à l'accueil"
      >
        <img src="/images/pinkhub-mvp-paglaafi.webp" alt="" className="h-9 w-9 object-contain" width={36} height={36} />
        <span className="text-sous-titre font-bold text-prune-900">PagLaafi</span>
      </button>
      {MODE_DEMO && <BadgeDemo />}

      <div className="ml-auto flex items-center gap-1.5">
        {!isStandaloneApp && (
          <button
            type="button"
            onClick={handleTriggerInstall}
            aria-label="Installer l'application"
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-2 text-petit font-semibold text-action active:bg-rose-200 min-[400px]:px-3"
          >
            <Smartphone size={20} aria-hidden />
            <span className="hidden min-[400px]:inline">Installer</span>
          </button>
        )}

        {currentUser && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-expanded={showProfileMenu}
              aria-haspopup="menu"
              title={`${currentUser.prenom} (${currentUser.roleLabel}) - Cliquez pour gérer`}
              aria-label={`Mon profil : ${currentUser.prenom} ${currentUser.nom}`}
              className="grid h-11 w-11 place-items-center rounded-full bg-carte-prune text-petit font-bold text-white ring-2 ring-surface"
            >
              {initiales(currentUser.prenom, currentUser.nom)}
            </button>

            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={fermer} aria-hidden />
                <div className="anim-apparition absolute right-0 top-14 z-50 w-[min(20rem,calc(100vw-1rem))] rounded-carte border border-bordure bg-surface p-4 shadow-flottant">
                  <div className="flex items-center gap-3 border-b border-bordure pb-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-carte-prune text-corps font-bold text-white" aria-hidden>
                      {initiales(currentUser.prenom, currentUser.nom)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-corps font-semibold text-prune-900">
                        {currentUser.prenom} {currentUser.nom}
                      </p>
                      <BadgeRole libelle={currentUser.roleLabel} superadmin={currentUser.role === "superadmin"} />
                    </div>
                  </div>
                  <div className="space-y-1 py-3 text-petit text-texte-2">
                    <p className="flex items-center gap-2">
                      <Phone size={16} aria-hidden /> {currentUser.telephone}
                    </p>
                    {currentUser.structureName && (
                      <p className="flex items-center gap-2">
                        <MapPin size={16} aria-hidden /> {currentUser.structureName}
                      </p>
                    )}
                  </div>

                  {MODE_DEMO && (
                    <div className="border-t border-bordure py-3">
                      <p className="mb-2 text-petit font-semibold text-prune-900">Changer de profil (démo)</p>
                      <div className="flex flex-wrap gap-2">
                        {(
                          [
                            ["user", "Utilisatrice", currentUser.role === "user"],
                            ["center", "Centre", currentUser.adminType === "center"],
                            ["doctor", "Docteur", currentUser.adminType === "doctor"],
                            ["association", "Association", currentUser.adminType === "association"],
                            ["superadmin", "Superadmin", currentUser.role === "superadmin"],
                          ] as const
                        ).map(([type, libelle, actif]) => (
                          <button
                            key={type}
                            type="button"
                            aria-pressed={actif}
                            onClick={() => {
                              quickLoginAs(type);
                              fermer();
                            }}
                            className={`min-h-11 rounded-full px-3 text-petit font-semibold ${actif ? "bg-carte-prune text-white" : "border border-bordure text-texte"}`}
                          >
                            {libelle}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-bordure py-3">
                    <p className="mb-2 text-petit font-semibold text-prune-900">Affichage</p>
                    <OngletsSegmentes<Theme>
                      libelle="Thème d'affichage"
                      valeur={theme}
                      onChange={setTheme}
                      onglets={[
                        { id: "auto", libelle: "Auto" },
                        { id: "clair", libelle: "Clair" },
                        { id: "sombre", libelle: "Sombre" },
                      ]}
                    />
                  </div>

                  <div className="space-y-1 border-t border-bordure pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPrivacyModal(true);
                        fermer();
                      }}
                      className="flex min-h-11 w-full items-center gap-3 rounded-bouton px-2 text-left text-corps text-texte active:bg-rose-100"
                    >
                      <ShieldCheck size={20} aria-hidden className="text-rose-500" />
                      <span className="flex-1">Confidentialité & Données</span>
                      <span className="text-petit text-texte-2">{MODE_REEL ? "Vos données" : "Sur l'appareil"}</span>
                    </button>
                    {estPro && (currentUser.role === "superadmin" || currentUser.adminType === "doctor") && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowDoctorTrainModal(true);
                          fermer();
                        }}
                        className="flex min-h-11 w-full items-center gap-3 rounded-bouton px-2 text-left text-corps text-texte active:bg-rose-100"
                      >
                        <ClipboardList size={20} aria-hidden className="text-rose-500" />
                        <span>{MODE_REEL ? "Fiches Rose IA" : "Simuler l'entraînement docteur"}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex min-h-11 w-full items-center gap-3 rounded-bouton px-2 text-left text-corps font-semibold text-alerte active:bg-alerte-fond"
                    >
                      <LogOut size={20} aria-hidden />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
