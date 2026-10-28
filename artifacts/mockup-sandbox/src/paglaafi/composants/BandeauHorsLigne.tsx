import { useUi } from "../etat/contextes";
import { Bandeau } from "./ui/Surfaces";

/** Bandeau affiché lorsque l'appareil est hors connexion. */
export function BandeauHorsLigne() {
  const { isOffline } = useUi();
  if (!isOffline) return null;
  return (
    <div className="px-4 pt-3 md:px-6 lg:px-8">
      <Bandeau ton="horsLigne" role="status">
        <strong className="font-semibold">Mode hors-ligne.</strong> Vos données et les centres déjà consultés restent accessibles.
      </Bandeau>
    </div>
  );
}
