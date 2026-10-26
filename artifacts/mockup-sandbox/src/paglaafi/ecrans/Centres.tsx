import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Edit3,
  FileText,
  Navigation,
  Search,
  Volume2,
} from "lucide-react";
import { useUi, useAuth, useAudio, useCentres, useOrientations } from "../etat/contextes";

/**
 * Onglet Centres : carte OpenStreetMap, liste, filtres et orientations d'urgence.
 */
export function Centres() {
  const { section } = useUi();
  const { currentUser } = useAuth();
  const { handlePlayAudio } = useAudio();
  const {
    centers,
    cityFilter,
    filteredCenters,
    mapContainerRef,
    mapInstanceRef,
    openNavigation,
    searchQuery,
    setCenterUpdateData,
    setCityFilter,
    setSearchQuery,
    setSelectedCenter,
    setShowCenterUpdateModal,
    setStatusFilter,
    setViewMode,
    statusFilter,
    viewMode,
  } = useCentres();
  const { handleValidateOrientationByCenter, setShowOrientationModal, urgentOrientations } = useOrientations();

  return (
    <section className="ph-enter px-5 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
            Temps réel · Burkina Faso
          </span>
          <h1 className="ph-display text-[26px] leading-tight text-[#580e36]">Carte des soins</h1>
        </div>
        <div className="flex rounded-2xl border border-[#ebd8de] bg-[#f8e9ed] p-1">
          <button
            onClick={() => setViewMode("map")}
            className={`rounded-xl px-2.5 py-1 text-xs font-bold transition ${viewMode === "map" ? "bg-white text-[#963c5d] shadow-sm" : "text-[#835e6e]"}`}
          >
            Carte
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`rounded-xl px-2.5 py-1 text-xs font-bold transition ${viewMode === "list" ? "bg-white text-[#963c5d] shadow-sm" : "text-[#835e6e]"}`}
          >
            Liste ({filteredCenters.length})
          </button>
        </div>
      </div>

      {/* Recherche & Filtres */}
      <div className="mt-3 relative">
        <Search size={16} className="absolute left-3.5 top-3 text-[#9f7183]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher centre, ville, examen..."
          className="w-full rounded-2xl border border-[#ebd8de] bg-white py-2 pl-9 pr-8 text-xs text-[#4b2f3e] focus:border-[#ea2d6d] focus:outline-none"
        />
      </div>

      {/* Badges de filtrage et recentrage par ville */}
      <div className="ph-scroll mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
        <button
          onClick={() => {
            setStatusFilter("all");
            setCityFilter("all");
            if (mapInstanceRef.current) mapInstanceRef.current.setView([12.3714, -1.5197], 12);
          }}
          className={`shrink-0 rounded-full px-3 py-1 font-bold ${statusFilter === "all" && cityFilter === "all" ? "bg-[#ea2d6d] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
        >
          Tous ({centers.length})
        </button>
        <button
          onClick={() => setStatusFilter(statusFilter === "available" ? "all" : "available")}
          className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-bold ${statusFilter === "available" ? "bg-emerald-600 text-white" : "border border-emerald-300 bg-emerald-50 text-emerald-800"}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Dispo de suite
        </button>
        <button
          onClick={() => setStatusFilter(statusFilter === "free" ? "all" : "free")}
          className={`shrink-0 rounded-full px-2.5 py-1 font-bold ${statusFilter === "free" ? "bg-[#ea2d6d] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
        >
          0 FCFA (Gratuit)
        </button>
        <button
          onClick={() => {
            setCityFilter(cityFilter === "Ouagadougou" ? "all" : "Ouagadougou");
            if (mapInstanceRef.current) mapInstanceRef.current.flyTo([12.3714, -1.5197], 12);
          }}
          className={`shrink-0 rounded-full px-2.5 py-1 font-bold ${cityFilter === "Ouagadougou" ? "bg-[#ea2d6d] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
        >
          Ouaga
        </button>
        <button
          onClick={() => {
            setCityFilter(cityFilter === "Bobo-Dioulasso" ? "all" : "Bobo-Dioulasso");
            if (mapInstanceRef.current) mapInstanceRef.current.flyTo([11.178, -4.295], 13);
          }}
          className={`shrink-0 rounded-full px-2.5 py-1 font-bold ${cityFilter === "Bobo-Dioulasso" ? "bg-[#ea2d6d] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
        >
          Bobo
        </button>
        <button
          onClick={() => {
            setCityFilter(cityFilter === "Koudougou" ? "all" : "Koudougou");
            if (mapInstanceRef.current) mapInstanceRef.current.flyTo([12.251, -2.366], 13);
          }}
          className={`shrink-0 rounded-full px-2.5 py-1 font-bold ${cityFilter === "Koudougou" ? "bg-[#ea2d6d] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
        >
          Koudougou
        </button>
      </div>

      {/* VRAIE CARTE OPENSTREETMAP LEAFLET GRATUITE ET OPEN-SOURCE */}
      {viewMode === "map" && (
        <div className="mt-2.5">
          <div className="relative h-[280px] w-full overflow-hidden rounded-[24px] border-2 border-[#e5d0d8] bg-[#f8edf1] shadow-inner">
            <div ref={mapContainerRef} className="h-full w-full z-10" />

            <div className="absolute bottom-2 left-2 z-20 flex items-center gap-2 rounded-xl bg-white/90 px-2.5 py-1 text-[9px] font-bold text-[#580e36] shadow backdrop-blur-xs">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Dispo
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Affluence
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Panne
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ENCART D'URGENCE INTERACTIF : ORIENTATIONS REÇUES PAR LE CENTRE OU SUIVIES PAR LE DOCTEUR */}
      {currentUser?.role === "admin" &&
        (currentUser?.adminType === "center" || currentUser?.adminType === "doctor") && (
          <div className="mt-3 space-y-2">
            <div className="rounded-2xl border-2 border-rose-300 bg-gradient-to-br from-rose-50 via-white to-pink-50 p-3.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-rose-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-rose-600 text-white shadow-xs animate-pulse">
                    <AlertTriangle size={16} />
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-[#580e36]">
                      {currentUser.adminType === "center"
                        ? "🚨 Orientations d'Urgence Reçues"
                        : "🩺 Vos Orientations Patientes en Cours"}
                    </h4>
                    <p className="text-[10px] text-rose-700 font-semibold">
                      {currentUser.adminType === "center"
                        ? "Coordination directe avec les médecins prescripteurs"
                        : "Suivi en direct de la prise en charge au centre"}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                  {urgentOrientations.length} active(s)
                </span>
              </div>

              {/* Liste des fiches d'orientation urgentes */}
              <div className="mt-2.5 space-y-2 text-xs">
                {urgentOrientations.map((orient) => (
                  <div key={orient.id} className="rounded-xl border border-rose-200 bg-white p-3 shadow-2xs space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-[#580e36]">
                            {orient.patientName} ({orient.patientAge} ans)
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-black ${
                              orient.urgencyLevel === "immediate"
                                ? "bg-rose-600 text-white animate-pulse"
                                : "bg-amber-500 text-white"
                            }`}
                          >
                            {orient.urgencyLabel}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-gray-500 mt-0.5">
                          Réf : <span className="font-mono font-bold text-[#580e36]">{orient.id}</span> · Prescrit par{" "}
                          <strong>{orient.doctorName}</strong>
                        </p>
                      </div>
                      <span className="text-[9.5px] font-semibold text-gray-400">{orient.createdAt}</span>
                    </div>

                    <div className="rounded-lg bg-pink-50/60 p-2 text-[11px] text-[#580e36]">
                      <p className="font-bold text-[10px] uppercase text-[#ea2d6d]">Examens prescrits :</p>
                      <p className="font-semibold">{orient.recommendedExam}</p>
                      <p className="mt-1 text-[10.5px] italic text-[#785566]">« {orient.clinicalObservations} »</p>
                    </div>

                    {/* Statut & Réponse du Centre */}
                    {orient.status === "accepted_urgent" ? (
                      <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2 text-emerald-900 text-[11px] flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-bold">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          <span>Validé : Patiente attendue d'urgence ({orient.centerEstimatedDelay})</span>
                        </span>
                        <span className="text-[9px] bg-emerald-200 px-1.5 py-0.5 rounded font-bold text-emerald-900">
                          Confirmé
                        </span>
                      </div>
                    ) : orient.status === "scheduled_wait" ? (
                      <div className="rounded-lg bg-amber-50 border border-amber-200 p-2 text-amber-900 text-[11px] flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-bold">
                          <Clock size={14} className="text-amber-600 shrink-0" />
                          <span>{orient.centerValidationMessage}</span>
                        </span>
                        <span className="text-[9px] bg-amber-200 px-1.5 py-0.5 rounded font-bold text-amber-900">
                          Programmé
                        </span>
                      </div>
                    ) : /* En attente de validation par le Centre de Santé */
                    currentUser.adminType === "center" ? (
                      <div className="pt-1 border-t border-rose-100 flex flex-col sm:flex-row gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleValidateOrientationByCenter(orient.id, "immediate")}
                          className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-emerald-600 py-2 px-2.5 text-[11px] font-bold text-white shadow hover:bg-emerald-700 transition cursor-pointer"
                        >
                          <Check size={13} />
                          <span>Envoyez-la vite ! (Attente &lt; 15 min)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleValidateOrientationByCenter(orient.id, "scheduled", "~45 min")}
                          className="flex items-center justify-center gap-1 rounded-xl bg-amber-600 py-2 px-2.5 text-[11px] font-bold text-white shadow hover:bg-amber-700 transition cursor-pointer"
                        >
                          <Clock size={13} />
                          <span>Affluence (créneau 45 min)</span>
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-lg bg-blue-50 border border-blue-200 p-2 text-blue-900 text-[10.5px] flex items-center justify-between">
                        <span className="flex items-center gap-1 font-semibold">
                          <Clock size={13} className="text-blue-600" />
                          <span>En attente de confirmation par le {orient.targetCenterName}</span>
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bouton pour créer une nouvelle orientation si docteur */}
              {currentUser.adminType === "doctor" && (
                <button
                  type="button"
                  onClick={() => setShowOrientationModal(true)}
                  className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-[#ea2d6d] py-2 text-xs font-bold text-white shadow hover:opacity-95 transition cursor-pointer"
                >
                  <FileText size={14} />
                  <span>Orienter une nouvelle patiente en urgence</span>
                </button>
              )}
            </div>

            {/* Bouton de mise à jour des disponibilités du centre */}
            <button
              onClick={() => {
                setCenterUpdateData(centers[0]);
                setShowCenterUpdateModal(true);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#580e36] to-[#ea2d6d] py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95 cursor-pointer"
            >
              <Edit3 size={15} /> Mettre à jour les disponibilités de mon centre
            </button>
          </div>
        )}

      {/* Liste des centres */}
      <div className="mt-3 space-y-2">
        {filteredCenters.map((center) => (
          <div key={center.id} className="rounded-2xl border border-[#efdfe4] bg-white p-3.5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${center.statusColor}`} />
                  <span className="text-[10px] font-bold text-[#8f4a64]">{center.statusLabel}</span>
                </div>
                <h3 className="ph-display mt-0.5 text-sm font-bold text-[#580e36]">{center.name}</h3>
                <p className="text-[11px] text-[#846b77]">{center.place}</p>
              </div>
              <button
                onClick={() => setSelectedCenter(center)}
                className="rounded-xl bg-[#faedf1] p-1.5 text-[#ea2d6d]"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-1 border-t border-[#f4e4e9] pt-2 text-[10px]">
              <button
                onClick={() => handlePlayAudio(center.audioMessageFr, "fr")}
                className="inline-flex items-center gap-1 rounded-full border border-[#e4bfcd] bg-white px-2 py-0.5 font-bold text-[#92405d]"
              >
                <Volume2 size={11} /> FR
              </button>
              <button
                onClick={() => handlePlayAudio(center.audioMessageEn, "en")}
                className="inline-flex items-center gap-1 rounded-full border border-[#e4bfcd] bg-white px-2 py-0.5 font-bold text-[#92405d]"
              >
                <Volume2 size={11} /> EN
              </button>
              <button
                onClick={() => handlePlayAudio(center.audioMessageMoore, "moore")}
                className="inline-flex items-center gap-1 rounded-full border border-[#e4bfcd] bg-white px-2 py-0.5 font-bold text-[#92405d]"
              >
                <Volume2 size={11} /> Mooré
              </button>
              <button
                onClick={() => handlePlayAudio(center.audioMessageDioula, "dioula")}
                className="inline-flex items-center gap-1 rounded-full border border-[#e4bfcd] bg-white px-2 py-0.5 font-bold text-[#92405d]"
              >
                <Volume2 size={11} /> Dioula
              </button>
              <button
                onClick={() => openNavigation(center.lat, center.lng, center.name)}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                title="Démarrer l'itinéraire dans Google Maps / Apple Maps"
              >
                <Navigation size={10} /> GPS
              </button>
              <button
                onClick={() => setSelectedCenter(center)}
                className="rounded-full bg-[#ea2d6d] px-2.5 py-1 font-bold text-white"
              >
                Détails
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
