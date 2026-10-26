import { ArrowLeft, MapPin, Navigation, Phone, Volume2 } from "lucide-react";
import { useUi, useAudio, useCentres } from "../etat/contextes";

/**
 * Fiche détaillée d'un centre de santé.
 */
export function FicheCentre() {
  const { section } = useUi();
  const { handlePlayAudio } = useAudio();
  const { mapInstanceRef, openNavigation, selectedCenter, setSelectedCenter } = useCentres();

  if (!selectedCenter) return null;

  return (
    <section className="ph-enter px-5 pt-4">
      <button
        onClick={() => {
          setSelectedCenter(null);
          setTimeout(() => {
            if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
          }, 150);
        }}
        className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#ea2d6d] hover:underline cursor-pointer"
      >
        <ArrowLeft size={16} /> Retour à la carte des centres
      </button>

      <div className="rounded-[26px] bg-[#f8e7ec] p-4 shadow-sm border border-[#eed6de]">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-[#8f4a64] shadow-2xs">
              <span className={`h-2 w-2 rounded-full ${selectedCenter.statusColor}`} />
              {selectedCenter.statusLabel}
            </span>
            <h1 className="ph-display text-xl font-bold text-[#580e36] mt-1.5">{selectedCenter.name}</h1>
            <p className="text-xs text-[#805e6f] mt-0.5 flex items-center gap-1">
              <MapPin size={13} className="text-[#ea2d6d] shrink-0" /> {selectedCenter.address} ({selectedCenter.place})
            </p>
            <p className="text-xs text-[#805e6f] mt-0.5 flex items-center gap-1">
              <Phone size={13} className="text-[#ea2d6d] shrink-0" /> {selectedCenter.phone}
            </p>
          </div>
        </div>

        {/* Boutons d'Action Principaux : Itinéraire GPS & Téléphone */}
        <div className="mt-3.5 grid grid-cols-2 gap-2">
          <button
            onClick={() => openNavigation(selectedCenter.lat, selectedCenter.lng, selectedCenter.name)}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition cursor-pointer"
            title="Ouvrir dans Google Maps ou Apple Maps selon votre appareil"
          >
            <Navigation size={15} /> Itinéraire GPS
          </button>
          <a
            href={`tel:${selectedCenter.phone}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#ea2d6d] px-3 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#8e3856] transition text-center"
            title="Appeler le secrétariat du centre"
          >
            <Phone size={15} /> Appeler
          </a>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl bg-white/90 p-2.5 border border-[#eed6de]">
            <p className="text-[9px] font-bold uppercase text-[#9f697d]">Équipement</p>
            <p className="font-bold text-[#580e36] mt-0.5">{selectedCenter.apparatus}</p>
          </div>
          <div className="rounded-xl bg-white/90 p-2.5 border border-[#eed6de]">
            <p className="text-[9px] font-bold uppercase text-[#9f697d]">File d'attente</p>
            <p className="font-bold text-[#580e36] mt-0.5">
              {selectedCenter.queueCount} personnes ({selectedCenter.estimatedWait})
            </p>
          </div>
        </div>
      </div>

      {/* Messages audio en 4 langues du centre */}
      <div className="mt-3 rounded-2xl border border-[#ebd6dc] bg-white p-3 text-xs">
        <span className="flex items-center gap-1.5 font-bold text-[#4a2b3b]">
          <Volume2 size={15} className="text-[#ea2d6d]" /> Message audio du centre
        </span>
        <p className="mt-1 italic text-[#725462]">« {selectedCenter.audioMessageFr} »</p>
        <div className="mt-2.5 grid grid-cols-4 gap-1">
          <button
            onClick={() => handlePlayAudio(selectedCenter.audioMessageFr, "fr")}
            className="rounded-xl bg-[#ea2d6d] py-1.5 text-[10px] font-bold text-white"
          >
            FR
          </button>
          <button
            onClick={() => handlePlayAudio(selectedCenter.audioMessageEn, "en")}
            className="rounded-xl bg-[#ea2d6d] py-1.5 text-[10px] font-bold text-white"
          >
            EN
          </button>
          <button
            onClick={() => handlePlayAudio(selectedCenter.audioMessageMoore, "moore")}
            className="rounded-xl border border-[#e2bac8] bg-[#fdf5f7] py-1.5 text-[10px] font-bold text-[#8a3350]"
          >
            Mooré
          </button>
          <button
            onClick={() => handlePlayAudio(selectedCenter.audioMessageDioula, "dioula")}
            className="rounded-xl border border-[#e2bac8] bg-[#fdf5f7] py-1.5 text-[10px] font-bold text-[#8a3350]"
          >
            Dioula
          </button>
        </div>
      </div>

      {/* Tarifs */}
      <div className="mt-3 rounded-2xl border border-[#ebd6dc] bg-white p-3.5">
        <h3 className="ph-display text-sm font-bold text-[#580e36]">Examens & Tarifs officiels</h3>
        <div className="mt-2 divide-y divide-[#f5e6eb] text-xs">
          {selectedCenter.exams.map((exam, i) => (
            <div key={i} className="flex items-center justify-between py-1.5">
              <span>{exam.name}</span>
              <span className={exam.free ? "font-bold text-emerald-700" : "font-bold text-[#ea2d6d]"}>
                {exam.free ? "0 FCFA (Gratuit)" : `${exam.price.toLocaleString("fr-FR")} FCFA`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
