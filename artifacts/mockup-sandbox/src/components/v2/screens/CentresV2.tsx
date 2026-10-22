import { useState, useRef, useEffect } from "react";
import {
  MapPin,
  Phone,
  Navigation,
  Clock,
  Users,
  Volume2,
  VolumeX,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  List,
  Map as MapIcon,
  ShieldCheck,
} from "lucide-react";
import type { HealthCenter } from "../types";
import { initialCenters } from "../data/centers";
import { speakText, stopSpeaking } from "../utils/speech";
import { hapticFeedback } from "../utils/haptics";
import { CardV2 } from "../ui/CardV2";
import { ButtonV2 } from "../ui/ButtonV2";
import { BadgeV2 } from "../ui/BadgeV2";
import { SearchBarV2 } from "../ui/SearchBarV2";
import { EmptyStateV2 } from "../ui/EmptyStateV2";
import { ModalV2 } from "../ui/ModalV2";

interface CentresV2Props {
  appLanguage: "fr" | "moore" | "dioula" | "en";
}

export function CentresV2({ appLanguage }: CentresV2Props) {
  const [centers, setCenters] = useState<HealthCenter[]>(initialCenters);
  const [selectedCenter, setSelectedCenter] = useState<HealthCenter | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Filtrage des centres
  const filteredCenters = centers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.place.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.apparatus.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity = selectedCity === "all" || c.city === selectedCity;
    const matchesStatus = selectedStatus === "all" || c.status === selectedStatus;

    return matchesSearch && matchesCity && matchesStatus;
  });

  // Ouverture itinéraire GPS vers Google Maps ou Apple Maps
  const handleOpenNavigation = (lat: number, lng: number, name: string) => {
    hapticFeedback(15);
    const isIOS =
      typeof navigator !== "undefined" &&
      /iPad|iPhone|iPod/.test(navigator.userAgent);
    const url = isIOS
      ? `maps://?q=${encodeURIComponent(name)}&ll=${lat},${lng}`
      : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  // Lecture audio du message du centre dans la langue active
  const handleAudioBulletin = (center: HealthCenter) => {
    hapticFeedback(12);
    if (playingAudioId === center.id) {
      stopSpeaking();
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(center.id);
      const audioText =
        appLanguage === "moore"
          ? center.audioMessageMoore
          : appLanguage === "dioula"
          ? center.audioMessageDioula
          : appLanguage === "en"
          ? center.audioMessageEn
          : center.audioMessageFr;

      speakText(audioText, appLanguage, () => setPlayingAudioId(null));
    }
  };

  // Initialisation fiabilisée de la carte Leaflet
  useEffect(() => {
    if (viewMode !== "map") return;

    let isMounted = true;

    const initMap = () => {
      if (!mapContainerRef.current) return;
      const L = (window as any).L;
      if (!L) return;

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

      // Invalidation responsive
      setTimeout(() => {
        if (isMounted && mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 150);

      filteredCenters.forEach((c) => {
        const markerColor =
          c.status === "available"
            ? "#557A63"
            : c.status === "busy"
            ? "#D97706"
            : c.status === "maintenance"
            ? "#DC2626"
            : "#716971";

        const customIcon = L.divIcon({
          className: "custom-osm-pin",
          html: `
            <div style="position:relative; width:28px; height:28px; display:flex; align-items:center; justify-content:center;">
              <span style="position:absolute; inset:-4px; border-radius:50%; background:${markerColor}; opacity:0.3; animation:pulse 2s infinite;"></span>
              <span style="position:relative; width:24px; height:24px; border-radius:50%; background:${markerColor}; border:2.5px solid #FFFFFF; box-shadow:0 3px 8px rgba(0,0,0,0.25); display:flex; align-items:center; justify-content:center; color:#FFFFFF; font-size:11px; font-weight:bold;">
                📍
              </span>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([c.lat, c.lng], { icon: customIcon }).addTo(map);

        marker.bindPopup(`
          <div style="font-family:'DM Sans', sans-serif; min-width:210px; padding:2px;">
            <b style="color:#29252A; font-size:12.5px; display:block;">${c.shortName}</b>
            <span style="display:inline-block; font-size:10.5px; font-weight:bold; color:${markerColor}; margin-top:2px;">● ${c.statusLabel}</span>
            <div style="font-size:10.5px; color:#716971; margin-top:4px;">Attente : <b>${c.estimatedWait}</b></div>
            <div style="font-size:10px; color:#716971;">📍 ${c.place}</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px; margin-top:8px;">
              <button id="nav-btn-${c.id}" style="background:#557A63; color:#fff; border:none; padding:6px; border-radius:8px; font-size:10px; font-weight:bold; cursor:pointer;">
                📍 Itinéraire
              </button>
              <button id="view-btn-${c.id}" style="background:#A14364; color:#fff; border:none; padding:6px; border-radius:8px; font-size:10px; font-weight:bold; cursor:pointer;">
                Détails →
              </button>
            </div>
          </div>
        `);

        marker.on("popupopen", () => {
          const vBtn = document.getElementById(`view-btn-${c.id}`);
          if (vBtn) vBtn.onclick = () => setSelectedCenter(c);
          const nBtn = document.getElementById(`nav-btn-${c.id}`);
          if (nBtn) nBtn.onclick = () => handleOpenNavigation(c.lat, c.lng, c.name);
        });
      });

      mapInstanceRef.current = map;
    };

    if (!(window as any).L) {
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      if (!document.getElementById("leaflet-js")) {
        const script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => {
          if (isMounted) initMap();
        };
        document.body.appendChild(script);
      }
    } else {
      initMap();
    }

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [viewMode, filteredCenters]);

  return (
    <div className="space-y-5 animate-fade-in max-w-6xl mx-auto">
      {/* 1. BARRE DE RECHERCHE & FILTRES */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <SearchBarV2
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Rechercher par nom de centre, quartier, appareil..."
            className="flex-1"
          />

          {/* Bascule Carte / Liste */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-[#E9E0E4] shrink-0 self-end sm:self-auto">
            <button
              onClick={() => {
                hapticFeedback(10);
                setViewMode("map");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === "map"
                  ? "bg-[#A14364] text-white shadow-xs"
                  : "text-[#716971] hover:text-[#29252A]"
              }`}
            >
              <MapIcon size={14} />
              <span>Carte</span>
            </button>
            <button
              onClick={() => {
                hapticFeedback(10);
                setViewMode("list");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === "list"
                  ? "bg-[#A14364] text-white shadow-xs"
                  : "text-[#716971] hover:text-[#29252A]"
              }`}
            >
              <List size={14} />
              <span>Liste ({filteredCenters.length})</span>
            </button>
          </div>
        </div>

        {/* Filtres de Ville & Statut */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-[#716971]">Villes :</span>
          {["all", "Ouagadougou", "Bobo-Dioulasso", "Koudougou"].map((city) => (
            <button
              key={city}
              onClick={() => {
                hapticFeedback(10);
                setSelectedCity(city);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                selectedCity === city
                  ? "bg-[#A14364] text-white"
                  : "bg-white text-[#716971] border border-[#E9E0E4] hover:bg-[#FAF2F5]"
              }`}
            >
              {city === "all" ? "Toutes les villes" : city}
            </button>
          ))}

          <span className="text-[11px] font-bold text-[#716971] ml-2">Disponibilité :</span>
          {[
            { key: "all", label: "Tous" },
            { key: "available", label: "Fluide" },
            { key: "busy", label: "Affluence" },
            { key: "maintenance", label: "Maintenance" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                hapticFeedback(10);
                setSelectedStatus(key);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                selectedStatus === key
                  ? "bg-[#557A63] text-white"
                  : "bg-white text-[#716971] border border-[#E9E0E4] hover:bg-[#FAF2F5]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. AFFICHAGE CARTE OPENSTREETMAP */}
      {viewMode === "map" && (
        <div className="rounded-3xl border border-[#E9E0E4] overflow-hidden bg-slate-100 shadow-sm relative">
          <div
            ref={mapContainerRef}
            className="w-full h-[380px] sm:h-[450px] z-10"
            style={{ minHeight: "360px" }}
          />
          <div className="p-3 bg-white border-t border-[#E9E0E4] flex flex-wrap items-center justify-between text-xs text-[#716971] gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="h-2.5 w-2.5 rounded-full bg-[#557A63]" /> Disponible
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="h-2.5 w-2.5 rounded-full bg-[#D97706]" /> Forte affluence
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="h-2.5 w-2.5 rounded-full bg-[#DC2626]" /> En maintenance
              </span>
            </div>
            <span className="text-[11px] text-[#716971]">
              Cliquez sur un marqueur pour voir l'itinéraire ou la fiche
            </span>
          </div>
        </div>
      )}

      {/* 3. LISTE DES CARTES DES CENTRES */}
      {filteredCenters.length === 0 ? (
        <EmptyStateV2
          icon={<MapPin size={24} />}
          title="Aucun centre trouvé"
          description="Aucun établissement ne correspond à vos filtres actuels. Modifiez votre recherche ou sélectionnez une autre ville."
          action={
            <ButtonV2
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCity("all");
                setSelectedStatus("all");
              }}
            >
              Réinitialiser les filtres
            </ButtonV2>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCenters.map((center) => (
            <CardV2
              key={center.id}
              className="flex flex-col justify-between hover:border-[#A14364] transition"
            >
              <div className="space-y-3">
                {/* En-tête de carte */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                        center.status === "available"
                          ? "bg-[#EAF2ED] text-[#557A63]"
                          : center.status === "busy"
                          ? "bg-amber-50 text-amber-800"
                          : center.status === "maintenance"
                          ? "bg-red-50 text-red-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          center.status === "available"
                            ? "bg-[#557A63]"
                            : center.status === "busy"
                            ? "bg-[#D97706]"
                            : center.status === "maintenance"
                            ? "bg-[#DC2626]"
                            : "bg-slate-400"
                        }`}
                      />
                      {center.statusLabel}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#29252A] mt-1.5 leading-snug">
                      {center.name}
                    </h4>
                    <p className="text-xs text-[#716971] flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-[#A14364] shrink-0" />
                      {center.place} ({center.city})
                    </p>
                  </div>
                </div>

                {/* Métadonnées : Attente, Appareil, Personnel */}
                <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-2xl bg-[#FAF2F5] border border-[#E9E0E4]">
                  <div>
                    <span className="text-[#716971] block text-[10.5px]">Attente estimée</span>
                    <span className="font-bold text-[#29252A] flex items-center gap-1">
                      <Clock size={12} className="text-[#A14364]" /> {center.estimatedWait}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#716971] block text-[10.5px]">Personnel présent</span>
                    <span className="font-bold text-[#29252A] flex items-center gap-1">
                      <Users size={12} className="text-[#557A63]" /> {center.agentsPresent} soignants
                    </span>
                  </div>
                </div>

                <div className="text-xs text-[#716971]">
                  <strong>Appareil :</strong> {center.apparatus}
                </div>
              </div>

              {/* Actions : Itinéraire GPS, Téléphone, Bulletin audio */}
              <div className="mt-4 pt-3 border-t border-[#E9E0E4] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ButtonV2
                    variant="green"
                    size="sm"
                    onClick={() => handleOpenNavigation(center.lat, center.lng, center.name)}
                    icon={<Navigation size={13} />}
                  >
                    Itinéraire GPS
                  </ButtonV2>
                  <a
                    href={`tel:${center.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold bg-white border border-[#E9E0E4] text-[#29252A] hover:bg-[#FAF2F5] transition"
                  >
                    <Phone size={13} className="text-[#A14364]" />
                    <span>Appeler</span>
                  </a>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAudioBulletin(center)}
                    className={`p-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      playingAudioId === center.id
                        ? "bg-[#A14364] text-white"
                        : "bg-[#FAF2F5] text-[#A14364] hover:bg-[#F5E8ED]"
                    }`}
                    title="Écouter le message vocal de la sage-femme"
                  >
                    {playingAudioId === center.id ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                  <button
                    onClick={() => setSelectedCenter(center)}
                    className="text-xs font-bold text-[#A14364] hover:underline px-2 py-1"
                  >
                    Détails →
                  </button>
                </div>
              </div>
            </CardV2>
          ))}
        </div>
      )}

      {/* 4. MODALE DE FICHE DÉTAILLÉE D'UN CENTRE */}
      {selectedCenter && (
        <ModalV2
          isOpen={true}
          onClose={() => setSelectedCenter(null)}
          title={selectedCenter.name}
          subtitle={`${selectedCenter.place} · ${selectedCenter.city}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            {/* Statut & Contact */}
            <div className="p-3.5 rounded-2xl bg-[#FAF2F5] border border-[#E9E0E4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#557A63] block">
                  ● {selectedCenter.statusLabel}
                </span>
                <p className="text-xs text-[#716971] mt-0.5">
                  Dernière mise à jour : {selectedCenter.lastUpdate}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <ButtonV2
                  variant="green"
                  size="sm"
                  onClick={() =>
                    handleOpenNavigation(
                      selectedCenter.lat,
                      selectedCenter.lng,
                      selectedCenter.name
                    )
                  }
                  icon={<Navigation size={13} />}
                >
                  Itinéraire GPS
                </ButtonV2>
                <a
                  href={`tel:${selectedCenter.phone}`}
                  className="px-3 py-1.5 rounded-2xl text-xs font-bold bg-[#A14364] text-white hover:bg-[#8E3655] transition inline-flex items-center gap-1.5"
                >
                  <Phone size={13} />
                  <span>{selectedCenter.phone}</span>
                </a>
              </div>
            </div>

            {/* Grille des examens et tarifs réels */}
            <div>
              <h4 className="font-bold text-[#29252A] mb-2 font-display">
                Examens & Tarifs disponibles
              </h4>
              <div className="space-y-2">
                {selectedCenter.exams.map((exam, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-white border border-[#E9E0E4] flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-[#29252A] block">{exam.name}</span>
                      {exam.notes && (
                        <span className="text-[11px] text-[#716971] italic block">
                          {exam.notes}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        exam.free
                          ? "bg-[#EAF2ED] text-[#557A63]"
                          : "bg-[#F5E8ED] text-[#A14364]"
                      }`}
                    >
                      {exam.free ? "GRATUIT (0 FCFA)" : `${exam.price.toLocaleString("fr-FR")} FCFA`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Personnel & Matériel */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#E9E0E4] space-y-1 text-xs">
              <p>
                <strong>Équipe médicale en poste :</strong> {selectedCenter.staffDescription}
              </p>
              <p>
                <strong>Équipement radiologique :</strong> {selectedCenter.apparatus}
              </p>
              <p>
                <strong>Adresse complète :</strong> {selectedCenter.address}
              </p>
            </div>
          </div>
        </ModalV2>
      )}
    </div>
  );
}
