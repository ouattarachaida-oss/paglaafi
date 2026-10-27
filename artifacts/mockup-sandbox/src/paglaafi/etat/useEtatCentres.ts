import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import type { HealthCenter } from "../types";
import { initialCenters } from "../donnees/centres";
import { MODE_DEMO, MODE_REEL } from "../config";
import { messageErreur } from "../lib/supabase";
import { echapperHtml } from "../lib/securite";
import { useDerniereRequete } from "../lib/derniereRequete";
import { chargerCentreGere, chargerCentresVerifies, enregistrerDisponibilites } from "../depot/centres";
import type { EtatUi } from "./useEtatUi";
import type { EtatAuth } from "./useEtatAuth";

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
  const [centers, setCenters] = useState<HealthCenter[]>(MODE_DEMO ? initialCenters : []);

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
      setCentreGere(gere);
    } catch (erreur) {
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

  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  // Modal mise à jour centre (strictement réservé aux admins centres & médecins)
  const [showCenterUpdateModal, setShowCenterUpdateModal] = useState(false);

  const [centerUpdateData, setCenterUpdateData] = useState<HealthCenter | null>(null);

  // Référence conteneur carte OpenStreetMap et instances
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const mapInstanceRef = useRef<any>(null);

  /**
   * Ouvre l'itinéraire GPS vers le centre de soins dans Google Maps (Android/Web) ou Apple Maps (iOS)
   */
  const openNavigation = (lat: number, lng: number, name: string) => {
    const isApple = typeof navigator !== "undefined" && /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
    const encodedName = encodeURIComponent(name);
    let url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=&travelmode=driving`;
    if (isApple) {
      url = `https://maps.apple.com/?daddr=${lat},${lng}&q=${encodedName}`;
    }
    window.open(url, "_blank", "noopener,noreferrer");
    notify(`Ouverture de la navigation GPS vers ${name}...`);
  };

  /**
   * Intégration fiabilisée de la carte OpenStreetMap via Leaflet
   * Fonctionne de manière synchrone sur tous les profils et réactualise
   * automatiquement les tuiles à chaque transition d'onglet.
   */
  useEffect(() => {
    if (section !== "Centres" || viewMode !== "map" || selectedCenter !== null) return;

    let isMounted = true;

    // Leaflet installé via npm (plus de chargement depuis unpkg) : module chargé à la demande
    const initLeafletMap = (L: any) => {
      if (!mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView([12.3714, -1.5197], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(map);

      // Invalidation progressive pour garantir le rendu complet même après transition CSS
      setTimeout(() => {
        if (isMounted && mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      }, 120);
      setTimeout(() => {
        if (isMounted && mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      }, 350);
      setTimeout(() => {
        if (isMounted && mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      }, 700);

      centers.forEach((center) => {
        const markerColor =
          center.status === "available"
            ? "#10b981"
            : center.status === "busy"
              ? "#f59e0b"
              : center.status === "maintenance"
                ? "#ef4444"
                : "#94a3b8";

        const customIcon = L.divIcon({
          className: "custom-osm-pin",
          html: `
            <div style="position:relative; width:26px; height:26px; display:flex; align-items:center; justify-content:center;">
              <span style="position:absolute; inset:-4px; border-radius:50%; background:${markerColor}; opacity:0.4; animation:ph-pulse-glow 2s infinite;"></span>
              <span style="position:relative; width:22px; height:22px; border-radius:50%; background:${markerColor}; border:2px solid #ffffff; box-shadow:0 3px 8px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; color:#ffffff; font-size:10px; font-weight:bold;">
                ●
              </span>
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const marker = L.marker([center.lat, center.lng], { icon: customIcon }).addTo(map);

        marker.bindPopup(`
          <div style="font-family:'DM Sans', sans-serif; min-width:200px; padding:3px;">
            <b style="color:#580e36; font-size:12px; display:block;">${echapperHtml(center.shortName)}</b>
            <span style="display:inline-block; font-size:10px; font-weight:bold; color:${markerColor}; margin-top:2px;">● ${echapperHtml(center.statusLabel)}</span>
            <div style="font-size:10px; color:#6b4d5d; margin-top:3px;">Attente : <b>${echapperHtml(center.estimatedWait)}</b></div>
            <div style="font-size:10px; color:#6b4d5d;">Agents : <b>${echapperHtml(center.agentsPresent)}</b></div>
            <div style="font-size:9.5px; color:#846b77; margin-top:2px;">📍 ${echapperHtml(center.place)}</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; margin-top:8px;">
              <button id="osm-nav-${center.id}" style="border:none; background:#10b981; color:#ffffff; font-size:10px; font-weight:bold; padding:5px 6px; border-radius:6px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:3px;">
                📍 Itinéraire
              </button>
              <button id="osm-btn-${center.id}" style="border:none; background:#ea2d6d; color:#ffffff; font-size:10px; font-weight:bold; padding:5px 6px; border-radius:6px; cursor:pointer; display:flex; align-items:center; justify-content:center;">
                Fiche →
              </button>
            </div>
          </div>
        `);

        marker.on("popupopen", () => {
          const btn = document.getElementById(`osm-btn-${center.id}`);
          if (btn) {
            btn.onclick = () => {
              setSelectedCenter(center);
            };
          }
          const navBtn = document.getElementById(`osm-nav-${center.id}`);
          if (navBtn) {
            navBtn.onclick = () => {
              openNavigation(center.lat, center.lng, center.name);
            };
          }
        });
      });

      mapInstanceRef.current = map;
    };

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener("resize", handleResize);

    void import("leaflet").then((module) => {
      if (isMounted) initLeafletMap(module.default ?? module);
    });

    return () => {
      isMounted = false;
      window.removeEventListener("resize", handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [section, viewMode, centers, selectedCenter, currentUser]);

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
  };
}

export type EtatCentres = ReturnType<typeof useEtatCentres>;
