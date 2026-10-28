import { useEffect } from "react";
import { LogOut, Phone, X } from "lucide-react";
import { MODE_DEMO } from "../config";
import { useUi, useAuth, useLangue } from "../etat/contextes";
import { BadgeRole, PucesLangue } from "./ui";
import { estInvitee, useEntreesMenu, type EntreeMenu } from "./entreesMenu";

function Lien({ e }: { e: EntreeMenu }) {
  return (
    <li>
      <button
        type="button"
        onClick={e.onClick}
        aria-current={e.actif ? "page" : undefined}
        className={`flex min-h-12 w-full items-center gap-3 rounded-bouton px-3 text-left text-corps transition-colors duration-200 ${
          e.actif ? "bg-rose-200 font-semibold text-prune-900" : "text-texte active:bg-rose-100"
        }`}
      >
        <span className={e.actif ? "text-action" : "text-texte-2"}>{e.icone}</span>
        <span className="flex-1">{e.libelle}</span>
        {!!e.compteur && (
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-action px-1.5 text-badge text-sur-action" aria-label={`${e.compteur} à traiter`}>
            {e.compteur}
          </span>
        )}
      </button>
    </li>
  );
}

/** Contenu du menu : profil, navigation, espaces professionnels, langue, numéro (démo), déconnexion. */
function ContenuMenu({ fermer }: { fermer?: () => void }) {
  const { appLanguage } = useUi();
  const { currentUser, handleLogout } = useAuth();
  const { handleSelectAppLanguage } = useLangue();
  const { menu, pros } = useEntreesMenu();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-bordure px-4">
        <img src="/images/pinkhub-mvp-paglaafi.webp" alt="" className="h-9 w-9 object-contain" width={36} height={36} />
        <div className="min-w-0 flex-1">
          <p className="text-sous-titre font-bold text-prune-900">PagLaafi</p>
        </div>
        {fermer && (
          <button type="button" onClick={fermer} aria-label="Fermer le menu" className="grid h-11 w-11 place-items-center rounded-full text-texte-2 active:bg-rose-200">
            <X size={22} aria-hidden />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {currentUser && (
          <div className="mb-4 rounded-carte bg-surface-2 p-3">
            <p className="truncate text-corps font-semibold text-prune-900">
              {currentUser.prenom} {currentUser.nom}
            </p>
            <div className="mt-1">
              <BadgeRole libelle={estInvitee(currentUser) ? "Mode découverte" : currentUser.roleLabel} superadmin={currentUser.role === "superadmin"} />
            </div>
          </div>
        )}

        <nav aria-label="Menu">
          <ul className="space-y-1">
            {menu.map((e) => (
              <Lien key={e.id} e={e} />
            ))}
          </ul>
          {pros.length > 0 && (
            <>
              <p className="mb-1 mt-5 px-3 text-badge uppercase tracking-wide text-texte-2">Espaces professionnels</p>
              <ul className="space-y-1">
                {pros.map((e) => (
                  <Lien key={e.id} e={e} />
                ))}
              </ul>
            </>
          )}
        </nav>

        <div className="mt-5 px-1">
          <p className="mb-2 px-2 text-badge uppercase tracking-wide text-texte-2">Langue des contenus</p>
          <PucesLangue valeur={appLanguage} onChange={handleSelectAppLanguage} libelle="Langue des contenus" aLaLigne />
        </div>

        {/* Ligne d'urgence : numéro NON CONFIRMÉ, affiché « à vérifier » en démo et masqué en mode réel */}
        {MODE_DEMO && (
          <div className="mt-5 rounded-carte bg-carte-prune p-4 text-white">
            <p className="text-petit font-semibold">Numéro vert national gratuit</p>
            <p className="mt-1 flex items-center gap-2 text-sous-titre font-bold">
              <Phone size={18} aria-hidden /> 80 00 11 22
              <span className="rounded-full bg-[#fcefd6] px-2 py-0.5 text-badge text-[#8f5b00]">à vérifier</span>
            </p>
          </div>
        )}
      </div>

      {currentUser && (
        <div className="pb-securite border-t border-bordure px-3 py-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-12 w-full items-center gap-3 rounded-bouton px-3 text-corps font-semibold text-alerte active:bg-alerte-fond"
          >
            <LogOut size={22} aria-hidden /> Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Menu latéral : tiroir sur mobile et tablette (ouvert par le bouton menu),
 * menu fixe de 264 px à partir de 1024 px.
 */
export function MenuLateral() {
  const { sidebarOpen, setSidebarOpen } = useUi();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!sidebarOpen) return;
    const touche = (e: KeyboardEvent) => e.key === "Escape" && setSidebarOpen(false);
    document.addEventListener("keydown", touche);
    return () => document.removeEventListener("keydown", touche);
  }, [sidebarOpen, setSidebarOpen]);

  if (!currentUser) return null;
  return (
    <>
      {/* Ordinateur : menu fixe */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] border-r border-bordure bg-surface lg:block">
        <ContenuMenu />
      </aside>

      {/* Mobile et tablette : tiroir */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-[#2b1420]/55" onClick={() => setSidebarOpen(false)} aria-hidden />
          <div className="anim-apparition absolute inset-y-0 left-0 w-[min(320px,86vw)] bg-surface shadow-flottant">
            <ContenuMenu fermer={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
