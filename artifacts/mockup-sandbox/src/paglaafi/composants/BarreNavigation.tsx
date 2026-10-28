import { hapticFeedback } from "../lib/haptique";
import { useAuth } from "../etat/contextes";
import { useEntreesMenu } from "./entreesMenu";

/**
 * Navigation principale (5 entrées, Rose IA au centre) :
 * - moins de 768 px : barre du bas de 88 px (zone de sécurité respectée) ;
 * - de 768 à 1023 px : rail vertical compact à gauche (icône + libellé) ;
 * - 1024 px et plus : rien ici, le menu latéral fixe prend le relais.
 */
export function BarreNavigation() {
  const { currentUser } = useAuth();
  const { principales } = useEntreesMenu();
  if (!currentUser) return null;

  return (
    <>
      {/* Mobile : barre du bas */}
      <nav
        aria-label="Navigation principale"
        className="pb-securite fixed inset-x-0 bottom-0 z-30 border-t border-bordure bg-surface/95 backdrop-blur md:hidden"
      >
        <ul className="mx-auto grid h-[88px] max-w-lg grid-cols-5 items-end px-1">
          {principales.map((e) => {
            const central = e.id === "RoseIA";
            return (
              <li key={e.id} className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    hapticFeedback(central ? 18 : 12);
                    e.onClick();
                  }}
                  aria-current={e.actif ? "page" : undefined}
                  className={`flex min-h-14 w-full flex-col items-center justify-end gap-1 pb-2 text-nav ${
                    e.actif ? "font-bold text-action" : "font-medium text-texte-2"
                  }`}
                >
                  {central ? (
                    <span
                      className={`-mt-7 grid h-[58px] w-[58px] place-items-center rounded-full border-4 border-surface bg-action text-sur-action shadow-flottant ${
                        e.actif ? "ring-2 ring-rose-200" : ""
                      }`}
                    >
                      {e.icone}
                    </span>
                  ) : (
                    <span className={`grid h-8 w-14 place-items-center rounded-full ${e.actif ? "bg-rose-200" : ""}`}>{e.icone}</span>
                  )}
                  <span className="whitespace-nowrap">{e.court ?? e.libelle}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Tablette : rail vertical */}
      <nav
        aria-label="Navigation principale"
        className="fixed bottom-0 left-0 top-16 z-20 hidden w-[88px] border-r border-bordure bg-surface md:block lg:hidden"
      >
        <ul className="flex flex-col items-stretch gap-1 px-2 py-4">
          {principales.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={e.onClick}
                aria-current={e.actif ? "page" : undefined}
                className={`flex min-h-16 w-full flex-col items-center justify-center gap-1 rounded-bouton text-nav ${
                  e.actif ? "bg-rose-200 font-bold text-prune-900" : "font-medium text-texte-2 active:bg-rose-100"
                }`}
              >
                <span className={e.id === "RoseIA" ? "grid h-10 w-10 place-items-center rounded-full bg-action text-sur-action" : ""}>{e.icone}</span>
                <span className="text-center leading-tight">{e.court ?? e.libelle}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
