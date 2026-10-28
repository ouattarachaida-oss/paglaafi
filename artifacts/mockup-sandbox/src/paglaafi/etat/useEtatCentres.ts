import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import type { HealthCenter } from "../types";
import { initialCenters } from "../donnees/centres";
import { MODE_DEMO, MODE_REEL } from "../config";
import { messageErreur } from "../lib/supabase";
import { useDerniereRequete } from "../lib/derniereRequete";
import { aCoordonnees, trierParProximite, urlItineraire, type Position } from "../lib/proximite";
import { chargerCentreGere, chargerCentresVerifies, enregistrerDisponibilites } from "../depot/centres";
import type { EtatUi } from "./useEtatUi";
import type { EtatAuth } from "./useEtatAuth";

// Marqueurs : couleur de statut + icône blanche (l'information ne repose pas sur la couleur seule)
const svg = (d: string) =>
  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICONES_STATUT: Record<string, { couleur: string; glyphe: string }> = {
  available: { couleur: "#1d7a4a", glyphe: svg('<path d="M20 6 9 17l-5-5"/>') },
  busy: { couleur: "#8f5b00", glyphe: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>') },
  maintenance: { couleur: "#b42318", glyphe: svg('<path d="M18 6 6 18M6 6l12 12"/>') },
  outdated: { couleur: "#475467", glyphe: svg('<path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>') },
  closed: { couleur: "#6b5a63", glyphe: svg('<path d="M5 12h14"/>') },
};
const LIBELLES_STATUT: Record<string, string> = {
  available: "Disponible",
  busy: "Saturé",
  maintenance: "En panne",
  outdated: "À mettre à jour",
  closed: "Fermé",
};

const CLE_CACHE_CENTRES = "paglaafi_centres_verifies";
// Ville choisie quand la position n'est pas disponible, et indicateur « explication déjà montrée »
const CLE_VILLE = "paglaafi_ville";
const CLE_POSITION_DEMANDEE = "paglaafi_position_demandee";
function lireCentresEnCache(): HealthCenter[] {
  try {
    const v = JSON.parse(localStorage.getItem(CLE_CACHE_CENTRES) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/**
 * Centres de santé : liste, filtres, carte OpenStreetMap (Leaflet), fiche et mise à jour par un admin.
 *
 * Mode réel : seuls les centres vérifiés par le superadmin sont affichés ; l'admin
 * du centre et ses docteurs mettent à jour les disponibilités de LEUR centre
 * (contrôlé côté serveur par les règles RLS).
 */
export function useEtatCentres({ ui, auth }: { ui: EtatUi; auth: EtatAuth }) {
  const { notify, section } = ui;
  const { currentUser, sessionReelle } = auth;

  // 6. Centres de santé & Carte OpenStreetMap Leaflet (démo : données locales ; réel : base Supabase)
  // Mode réel : dernière liste des centres vérifiés gardée sur l'appareil (données publiques)
  // pour un affichage immédiat et hors connexion
  const [centers, setCenters] = useState<HealthCenter[]>(() => (MODE_DEMO ? initialCenters : lireCentresEnCache()));

  // Mode réel : centre rattaché au compte connecté (admin centre ou docteur), même non vérifié
  const [centreGere, setCentreGere] = useState<HealthCenter | null>(null);

  // Mode réel : chargement des centres vérifiés et du centre géré
  const nouvelleRequete = useDerniereRequete();
  const rechargerCentres = async () => {
    if (!MODE_REEL) return;
    const estActuelle = nouvelleRequete();
    try {
      const verifies = await chargerCentresVerifies();
      const gere = sessionReelle?.centreId ? await chargerCentreGere(sessionReelle.centreId) : null;
      if (!estActuelle()) return; // une requête plus récente a déjà répondu
      setCenters(verifies);
      try {
        localStorage.setItem(CLE_CACHE_CENTRES, JSON.stringify(verifies));
      } catch {
        // stockage plein ou indisponible : pas de copie hors connexion
      }
      setCentreGere(gere);
    } catch (erreur) {
      // Hors connexion : la copie locale reste affichée, sans message d'erreur
      if (typeof navigator !== "undefined" && !navigator.onLine) return;
      notify(messageErreur(erreur as Error));
    }
  };

  useEffect(() => {
    void rechargerCentres();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionReelle?.userId, sessionReelle?.centreId]);

  const [selectedCenter, setSelectedCenter] = useState<HealthCenter | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [cityFilter, setCityFilter] = useState<string>("all");

  // « Près de moi » (vue par défaut) ou carte complète
  const [viewMode, setViewMode] = useState<"proches" | "carte">("proches");

  // Modal mise à jour centre (strictement réservé aux admins centres & médecins)
  const [showCenterUpdateModal, setShowCenterUpdateModal] = useState(false);

  const [centerUpdateData, setCenterUpdateData] = useState<HealthCenter | null>(null);

  // Référence conteneur carte OpenStreetMap et instances
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const mapInstanceRef = useRef<any>(null);

  /**
   * Ouvre l'itinéraire GPS vers le centre de soins dans Google Maps (Android/Web) ou Apple Maps (iOS)
   */
  const openNavigation = (lat: number | null, lng: number | null, name: string) => {
    if (lat === null || lng === null) {
      notify("Ce centre n'a pas encore de position sur la carte.");
      return;
    }
    window.open(urlItineraire(lat, lng, name), "_blank", "noopener,noreferrer");
  };

  /**
   * Filtrage des centres de santé
   */
  const filteredCenters = useMemo(() => {
    return centers.filter((center) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        `${center.name} ${center.place} ${center.city}`.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && center.status === "available") ||
        (statusFilter === "free" && center.exams.some((e) => e.free));
      const matchesCity = cityFilter === "all" || center.city === cityFilter;
      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [centers, searchQuery, statusFilter, cityFilter]);

  // Ordinateur (1024 px et plus) : la carte et la liste sont affichées ensemble
  const [grandEcran, setGrandEcran] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches,
  );
  useEffect(() => {
    const requete = window.matchMedia("(min-width: 1024px)");
    const changer = () => setGrandEcran(requete.matches);
    requete.addEventListener("change", changer);
    return () => requete.removeEventListener("change", changer);
  }, []);

  // Centre sélectionné sur la carte (carte de prévisualisation sous la carte)
  const [centreApercu, setCentreApercu] = useState<HealthCenter | null>(null);

  /*
   * « Près de moi » : la position reste en mémoire le temps de la session, sur
   * l'appareil uniquement (jamais envoyée ni enregistrée). À défaut, la ville
   * choisie est gardée sur l'appareil.
   */
  const [position, setPosition] = useState<Position | null>(null);
  const [etatPosition, setEtatPosition] = useState<"inconnue" | "explication" | "recherche" | "ok" | "ville">("inconnue");
  const [ville, setVilleEtat] = useState<string>(() => {
    try {
      return localStorage.getItem(CLE_VILLE) ?? "";
    } catch {
      return "";
    }
  });
  const [choixVilleOuvert, setChoixVilleOuvert] = useState(false);
  const [filtresProches, setFiltresProches] = useState({ disponible: false, mammographe: false });
  const rechercheRef = useRef(0);

  const replierSurVille = () => {
    setEtatPosition("ville");
    if (!ville) setChoixVilleOuvert(true);
  };
  const choisirVille = (v: string) => {
    setVilleEtat(v);
    try {
      localStorage.setItem(CLE_VILLE, v);
    } catch {
      // stockage indisponible : ville valable pour la session
    }
    setChoixVilleOuvert(false);
    if (!position) setEtatPosition("ville");
  };
  const marquerDemande = () => {
    try {
      localStorage.setItem(CLE_POSITION_DEMANDEE, "1");
    } catch {
      // sans stockage, l'explication pourra être reproposée
    }
  };

  /** Lit la position (8 s maximum), sinon repli sur la ville. */
  const localiser = () => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      replierSurVille();
      return;
    }
    const n = ++rechercheRef.current;
    setEtatPosition("recherche");
    const delai = window.setTimeout(() => n === rechercheRef.current && replierSurVille(), 8000);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        window.clearTimeout(delai);
        if (n !== rechercheRef.current) return;
        setPosition({ lat: p.coords.latitude, lng: p.coords.longitude });
        setEtatPosition("ok");
      },
      () => {
        window.clearTimeout(delai);
        if (n === rechercheRef.current) replierSurVille();
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  };

  /**
   * Point d'entrée (onglet Centres, carte de l'accueil, bouton de Rose) : position
   * déjà autorisée → lecture directe ; jamais demandée → explication une seule fois ;
   * refusée → ville.
   */
  const trouverCentreProche = async () => {
    if (position || etatPosition === "recherche" || etatPosition === "explication") return;
    let etat: string | undefined;
    try {
      etat = (await navigator.permissions?.query({ name: "geolocation" as PermissionName }))?.state;
    } catch {
      etat = undefined;
    }
    let demandee = false;
    try {
      demandee = localStorage.getItem(CLE_POSITION_DEMANDEE) === "1";
    } catch {
      demandee = false;
    }
    if (etat === "granted") localiser();
    else if (etat === "denied") replierSurVille();
    else if (!demandee) setEtatPosition("explication");
    else replierSurVille();
  };
  const accepterPosition = () => {
    marquerDemande();
    localiser();
  };
  const refuserPosition = () => {
    marquerDemande();
    replierSurVille();
  };

  // À l'ouverture de l'onglet Centres : position (ou ville) pour « Près de moi »
  useEffect(() => {
    if (section === "Centres" && etatPosition === "inconnue") void trouverCentreProche();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  const centresProches = useMemo(
    () =>
      trierParProximite(
        centers.filter(
          (c) => (!filtresProches.disponible || c.status === "available") && (!filtresProches.mammographe || c.isApparatusWorking),
        ),
        position,
        ville,
      ),
    [centers, filtresProches, position, ville],
  );
  const plusProche = useMemo(() => trierParProximite(centers, position, ville)[0] ?? null, [centers, position, ville]);

  // Carte : centres de la vue active (« Près de moi » ou carte filtrée), avec coordonnées
  const centresCarte = useMemo(
    () => (viewMode === "proches" ? centresProches.map((p) => p.centre) : filteredCenters).filter(aCoordonnees),
    [viewMode, centresProches, filteredCenters],
  );

  /**
   * Carte OpenStreetMap (Leaflet, chargé à la demande) : marqueurs ronds colorés
   * selon le statut avec une icône (✓, horloge, ✕, ?, porte), regroupés par
   * leaflet.markercluster ; un appui ouvre l'aperçu du centre. Les marqueurs
   * suivent la vue active ; la position (si connue) est affichée et centre la carte.
   */
  useEffect(() => {
    if (section !== "Centres" || (viewMode !== "carte" && !grandEcran) || selectedCenter !== null) return;
    let actif = true;

    const initialiser = async () => {
      const module: any = await import("leaflet");
      const L = module.default ?? module;
      // leaflet.markercluster s'appuie sur la variable globale L
      (window as any).L = L;
      await import("leaflet.markercluster");
      if (!actif || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      const map = L.map(mapContainerRef.current, { zoomControl: true, attributionControl: true }).setView([12.3714, -1.5197], 12);
      map.attributionControl.setPrefix(false);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "© contributeurs OpenStreetMap",
      }).addTo(map);

      const groupe = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 50,
        iconCreateFunction: (cluster: any) =>
          L.divIcon({
            className: "pl-groupe",
            html: `<span aria-hidden="true" style="display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:#d41e5c;color:#fff;font:700 14px 'DM Sans',sans-serif;border:3px solid #fff;box-shadow:0 2px 8px rgba(88,14,54,.3)">${cluster.getChildCount()}</span>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          }),
      });

      centresCarte.forEach((center) => {
        const { couleur, glyphe } = ICONES_STATUT[center.status] ?? ICONES_STATUT.outdated;
        const icone = L.divIcon({
          className: "pl-marqueur",
          html: `<span style="display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:${couleur};border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)">${glyphe}</span>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        const marqueur = L.marker([center.lat, center.lng], {
          icon: icone,
          title: center.shortName,
          alt: `${center.shortName} : ${LIBELLES_STATUT[center.status] ?? ""}`,
          keyboard: true,
        });
        marqueur.on("click", () => setCentreApercu(center));
        groupe.addLayer(marqueur);
      });
      map.addLayer(groupe);

      if (position) {
        L.circleMarker([position.lat, position.lng], { radius: 9, color: "#fff", weight: 3, fillColor: "#1e4f91", fillOpacity: 1 })
          .bindTooltip("Vous êtes ici")
          .addTo(map);
        map.setView([position.lat, position.lng], 12, { animate: false });
      } else if (centresCarte.length > 1) map.fitBounds(groupe.getBounds(), { padding: [32, 32], maxZoom: 13, animate: false });
      else if (centresCarte.length === 1) map.setView([centresCarte[0].lat, centresCarte[0].lng], 14, { animate: false });

      // Rendu complet même après une transition d'affichage
      [120, 350, 700].forEach((ms) => setTimeout(() => actif && mapInstanceRef.current?.invalidateSize(), ms));
      mapInstanceRef.current = map;
    };

    const redimensionner = () => mapInstanceRef.current?.invalidateSize();
    window.addEventListener("resize", redimensionner);
    void initialiser();

    return () => {
      actif = false;
      window.removeEventListener("resize", redimensionner);
      if (mapInstanceRef.current) {
        // Arrête toute animation en cours avant de retirer la carte (évite l'erreur _leaflet_pos)
        mapInstanceRef.current.stop?.();
        mapInstanceRef.current.off();
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [section, viewMode, grandEcran, centresCarte, position, selectedCenter, currentUser]);

  /** Centre la carte sur un centre et ouvre son aperçu (synchronisation liste ↔ carte). */
  const focaliser = (c: HealthCenter) => {
    setCentreApercu(c);
    if (aCoordonnees(c)) mapInstanceRef.current?.setView([c.lat, c.lng], 15, { animate: false });
  };

  /**
   * Sauvegarde des modifications du centre de santé
   */
  const handleSaveCenterUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!centerUpdateData) return;

    if (MODE_REEL) {
      void enregistrerCentreReel(centerUpdateData);
      return;
    }

    setCenters((prev) =>
      prev.map((c) =>
        c.id === centerUpdateData.id ? { ...centerUpdateData, lastUpdate: "À l'instant par l'administrateur" } : c,
      ),
    );
    notify(`Les données de ${centerUpdateData.shortName} sont actualisées en direct sur la carte.`);
    setShowCenterUpdateModal(false);
  };

  // Mode réel : enregistrement en base (refusé par le serveur si le centre n'est pas le sien)
  const enregistrerCentreReel = async (centre: HealthCenter) => {
    try {
      const accepte = await enregistrerDisponibilites(centre);
      if (!accepte) {
        notify("Modification refusée : vous ne pouvez mettre à jour que votre propre centre.");
        return;
      }
      await rechargerCentres();
      notify(`Les données de ${centre.shortName} sont enregistrées.`);
      setShowCenterUpdateModal(false);
    } catch (erreur) {
      // Statut « Fermé » refusé tant que la migration 20261028000005 n'est pas appliquée
      if (centre.status === "closed" && /statut_centre|closed/.test((erreur as Error).message)) {
        notify("Le statut « Fermé » n'est pas encore activé sur le serveur : choisissez un autre statut pour l'instant.");
        return;
      }
      notify(messageErreur(erreur as Error));
    }
  };

  /**
   * Ouvre la mise à jour du centre : en démo le premier centre, en mode réel le
   * centre rattaché au compte connecté.
   */
  const ouvrirMiseAJourCentre = async () => {
    let centre = MODE_DEMO ? centers[0] : centreGere;
    // Mode réel : centre pas encore chargé (clic juste après la connexion) → chargement à la demande
    if (!centre && MODE_REEL && sessionReelle?.centreId) {
      try {
        centre = await chargerCentreGere(sessionReelle.centreId);
        setCentreGere(centre);
      } catch (erreur) {
        notify(messageErreur(erreur as Error));
        return;
      }
    }
    if (!centre) {
      notify("Aucun centre n'est rattaché à votre compte pour le moment.");
      return;
    }
    setCenterUpdateData(centre);
    setShowCenterUpdateModal(true);
  };

  return {
    centers,
    setCenters,
    selectedCenter,
    setSelectedCenter,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    cityFilter,
    setCityFilter,
    viewMode,
    setViewMode,
    showCenterUpdateModal,
    setShowCenterUpdateModal,
    centerUpdateData,
    setCenterUpdateData,
    mapContainerRef,
    mapInstanceRef,
    openNavigation,
    handleSaveCenterUpdate,
    centreGere,
    ouvrirMiseAJourCentre,
    rechargerCentres,
    filteredCenters,
    centreApercu,
    setCentreApercu,
    grandEcran,
    position,
    etatPosition,
    ville,
    choisirVille,
    choixVilleOuvert,
    setChoixVilleOuvert,
    filtresProches,
    setFiltresProches,
    centresProches,
    plusProche,
    trouverCentreProche,
    accepterPosition,
    refuserPosition,
    localiser,
    focaliser,
  };
}

export type EtatCentres = ReturnType<typeof useEtatCentres>;
