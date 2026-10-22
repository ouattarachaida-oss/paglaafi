import { useState } from "react";
import { Megaphone, MapPin, Calendar, Phone, Eye, Sparkles } from "lucide-react";
import type { PartnerAnnouncement } from "../types";
import { CardV2 } from "../ui/CardV2";
import { BadgeV2 } from "../ui/BadgeV2";
import { ModalV2 } from "../ui/ModalV2";

interface AnnoncesV2Props {
  announcements: PartnerAnnouncement[];
}

export function AnnoncesV2({ announcements }: AnnoncesV2Props) {
  const [selectedPoster, setSelectedPoster] = useState<{
    url: string;
    title: string;
    author: string;
  } | null>(null);

  const [filterType, setFilterType] = useState<string>("all");

  const filtered = announcements.filter((a) => {
    if (filterType === "rose_ai") return a.isRoseAIDetected;
    if (filterType === "association") return a.authorType === "Association";
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h3 className="text-base sm:text-lg font-bold text-[#29252A] font-display">
          Campagnes, Dépistages & Veille Associative
        </h3>
        <p className="text-xs text-[#716971]">
          Événements officiels et alertes de dépistage gratuit au Burkina Faso
        </p>

        {/* Filtres */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {[
            { key: "all", label: "Tous les événements" },
            { key: "association", label: "Associations (BE NEERE, WTM...)" },
            { key: "rose_ai", label: "Veille Rose IA" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterType(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                filterType === key
                  ? "bg-[#A14364] text-white"
                  : "bg-white text-[#716971] border border-[#E9E0E4] hover:bg-[#FAF2F5]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((a) => (
          <CardV2 key={a.id} className="flex flex-col justify-between space-y-3">
            <div>
              {/* Image d'affiche si disponible */}
              {a.imageUrl && (
                <div className="relative mb-3 rounded-2xl overflow-hidden bg-slate-900 border border-[#E9E0E4] max-h-44 group">
                  <img
                    src={a.imageUrl}
                    alt={a.title}
                    className="w-full h-44 object-cover group-hover:scale-102 transition duration-300"
                  />
                  <button
                    onClick={() =>
                      setSelectedPoster({
                        url: a.imageUrl!,
                        title: a.title,
                        author: a.author,
                      })
                    }
                    className="absolute bottom-2 right-2 bg-black/75 hover:bg-black/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 backdrop-blur-xs transition cursor-pointer"
                  >
                    <Eye size={12} /> Agrandir
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 mb-2">
                <BadgeV2 variant={a.isRoseAIDetected ? "neutral" : "rose"}>
                  {a.isRoseAIDetected ? "Veille Rose IA" : a.author}
                </BadgeV2>
                <span className="text-[11px] text-[#716971] flex items-center gap-1">
                  <MapPin size={11} /> {a.city}
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-[#29252A] leading-snug">
                {a.title}
              </h4>

              <p className="text-xs text-[#716971] mt-2 leading-relaxed">
                {a.content}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E9E0E4] flex items-center justify-between text-xs text-[#716971]">
              <span className="font-semibold text-[#557A63]">{a.badge}</span>
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {a.date}
              </span>
            </div>
          </CardV2>
        ))}
      </div>

      {/* Modale d'affiche agrandie */}
      {selectedPoster && (
        <ModalV2
          isOpen={true}
          onClose={() => setSelectedPoster(null)}
          title={selectedPoster.title}
          subtitle={`Organisé par : ${selectedPoster.author}`}
          maxWidth="lg"
        >
          <div className="space-y-3">
            <div className="rounded-2xl overflow-hidden bg-black flex items-center justify-center max-h-[68vh]">
              <img
                src={selectedPoster.url}
                alt={selectedPoster.title}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>
            <button
              onClick={() => setSelectedPoster(null)}
              className="w-full py-2.5 rounded-2xl bg-[#FAF2F5] text-[#A14364] font-bold text-xs hover:bg-[#F5E8ED] transition"
            >
              Fermer l'affiche
            </button>
          </div>
        </ModalV2>
      )}
    </div>
  );
}
