import { createContext, useContext, type Context, type ReactNode } from "react";
import { useEtatUi, type EtatUi } from "./useEtatUi";
import { useEtatAuth, type EtatAuth } from "./useEtatAuth";
import { useEtatDemarrage, type EtatDemarrage } from "./useEtatDemarrage";
import { useEtatAudio, type EtatAudio } from "./useEtatAudio";
import { useEtatCentres, type EtatCentres } from "./useEtatCentres";
import { useEtatOrientations, type EtatOrientations } from "./useEtatOrientations";
import { useEtatSante, type EtatSante } from "./useEtatSante";
import { useEtatRose, type EtatRose } from "./useEtatRose";
import { useEtatDocteur, type EtatDocteur } from "./useEtatDocteur";
import { useEtatEducation, type EtatEducation } from "./useEtatEducation";
import { useEtatAnnonces, type EtatAnnonces } from "./useEtatAnnonces";
import { useEtatDons, type EtatDons } from "./useEtatDons";
import { useEtatAdministration, type EtatAdministration } from "./useEtatAdministration";
import { useEtatLangue, type EtatLangue } from "./useEtatLangue";
import { useEtatDefilement } from "./useEtatDefilement";

/*
 * État partagé de l'application, découpé par domaine métier.
 * Chaque domaine est un hook (dossier etat/) exposé par son propre contexte :
 * un écran ne lit que les domaines dont il a besoin (useAuth(), useCentres()…).
 */

const ContexteUi = createContext<EtatUi | null>(null);
const ContexteAuth = createContext<EtatAuth | null>(null);
const ContexteDemarrage = createContext<EtatDemarrage | null>(null);
const ContexteAudio = createContext<EtatAudio | null>(null);
const ContexteCentres = createContext<EtatCentres | null>(null);
const ContexteOrientations = createContext<EtatOrientations | null>(null);
const ContexteSante = createContext<EtatSante | null>(null);
const ContexteRose = createContext<EtatRose | null>(null);
const ContexteDocteur = createContext<EtatDocteur | null>(null);
const ContexteEducation = createContext<EtatEducation | null>(null);
const ContexteAnnonces = createContext<EtatAnnonces | null>(null);
const ContexteDons = createContext<EtatDons | null>(null);
const ContexteAdministration = createContext<EtatAdministration | null>(null);
const ContexteLangue = createContext<EtatLangue | null>(null);

function lireContexte<T>(contexte: Context<T | null>, nom: string): T {
  const valeur = useContext(contexte);
  if (valeur === null) throw new Error(`${nom}() doit être appelé sous <FournisseurEtat>`);
  return valeur;
}

export const useUi = () => lireContexte(ContexteUi, "useUi");
export const useAuth = () => lireContexte(ContexteAuth, "useAuth");
export const useDemarrage = () => lireContexte(ContexteDemarrage, "useDemarrage");
export const useAudio = () => lireContexte(ContexteAudio, "useAudio");
export const useCentres = () => lireContexte(ContexteCentres, "useCentres");
export const useOrientations = () => lireContexte(ContexteOrientations, "useOrientations");
export const useSante = () => lireContexte(ContexteSante, "useSante");
export const useRose = () => lireContexte(ContexteRose, "useRose");
export const useDocteur = () => lireContexte(ContexteDocteur, "useDocteur");
export const useEducation = () => lireContexte(ContexteEducation, "useEducation");
export const useAnnonces = () => lireContexte(ContexteAnnonces, "useAnnonces");
export const useDons = () => lireContexte(ContexteDons, "useDons");
export const useAdministration = () => lireContexte(ContexteAdministration, "useAdministration");
export const useLangue = () => lireContexte(ContexteLangue, "useLangue");

/** Instancie tous les domaines (l'ordre suit leurs dépendances) et les fournit à l'application. */
export function FournisseurEtat({ children }: { children: ReactNode }) {
  const ui = useEtatUi();
  const auth = useEtatAuth({ ui });
  const demarrage = useEtatDemarrage({ auth });
  const audio = useEtatAudio({ ui });
  const centres = useEtatCentres({ ui, auth });
  const orientations = useEtatOrientations({ centres, auth, ui });
  const sante = useEtatSante({ ui });
  const rose = useEtatRose({ ui, audio });
  const docteur = useEtatDocteur({ ui, auth, rose });
  const education = useEtatEducation();
  const annonces = useEtatAnnonces({ ui, auth });
  const dons = useEtatDons({ ui });
  const admin = useEtatAdministration({ auth, ui, centres });
  const langue = useEtatLangue({ ui, audio, rose });
  useEtatDefilement({ ui, centres });

  return (
    <ContexteUi.Provider value={ui}>
      <ContexteAuth.Provider value={auth}>
        <ContexteDemarrage.Provider value={demarrage}>
          <ContexteAudio.Provider value={audio}>
            <ContexteCentres.Provider value={centres}>
              <ContexteOrientations.Provider value={orientations}>
                <ContexteSante.Provider value={sante}>
                  <ContexteRose.Provider value={rose}>
                    <ContexteDocteur.Provider value={docteur}>
                      <ContexteEducation.Provider value={education}>
                        <ContexteAnnonces.Provider value={annonces}>
                          <ContexteDons.Provider value={dons}>
                            <ContexteAdministration.Provider value={admin}>
                              <ContexteLangue.Provider value={langue}>
                                {children}
                              </ContexteLangue.Provider>
                            </ContexteAdministration.Provider>
                          </ContexteDons.Provider>
                        </ContexteAnnonces.Provider>
                      </ContexteEducation.Provider>
                    </ContexteDocteur.Provider>
                  </ContexteRose.Provider>
                </ContexteSante.Provider>
              </ContexteOrientations.Provider>
            </ContexteCentres.Provider>
          </ContexteAudio.Provider>
        </ContexteDemarrage.Provider>
      </ContexteAuth.Provider>
    </ContexteUi.Provider>
  );
}
