import { useState } from "react";
import {
  Sparkles,
  MapPin,
  BookOpen,
  Volume2,
  Calendar,
  Share2,
  Gift,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Megaphone,
} from "lucide-react";
import type { Section, UserProfile, PartnerAnnouncement } from "../types";
import { roseDailyTips } from "../data/education";
import { speakText, stopSpeaking } from "../utils/speech";
import { hapticFeedback } from "../utils/haptics";
import { CardV2 } from "../ui/CardV2";
import { ButtonV2 } from "../ui/ButtonV2";
import { BadgeV2 } from "../ui/BadgeV2";

interface AccueilV2Props {
  currentUser: UserProfile;
  announcements: PartnerAnnouncement[];
  appLanguage: "fr" | "moore" | "dioula" | "en";
  onNavigate: (section: Section) => void;
  onOpenDonationModal: () => void;
}

export function AccueilV2({
  currentUser,
  announcements,
  appLanguage,
  onNavigate,
  onOpenDonationModal,
}: AccueilV2Props) {
  const [tipIndex, setTipIndex] = useState(0);
  const [isSpeakingTip, setIsSpeakingTip] = useState(false);

  const currentTip = roseDailyTips[tipIndex % roseDailyTips.length];
  const tipText =
    appLanguage === "moore"
      ? currentTip.moore
      : appLanguage === "dioula"
      ? currentTip.dioula
      : appLanguage === "en"
      ? currentTip.en
      : currentTip.fr;

  const handleAudioTip = () => {
    hapticFeedback(12);
    if (isSpeakingTip) {
      stopSpeaking();
      setIsSpeakingTip(false);
    } else {
      setIsSpeakingTip(true);
      speakText(tipText, appLanguage, () => setIsSpeakingTip(false));
    }
  };

  const approvedAnnouncements = announcements
    .filter((a) => a.status === "approved")
    .slice(0, 3);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* 1. HERO BANNER BIENVENUE & ORIENTATION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#A14364] via-[#943657] to-[#7A2C46] text-white p-6 sm:p-8 md:p-10 shadow-lg">
        {/* Motif décoratif discret */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-white/5 pointer-events-none blur-2xl" />

        <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur-xs text-white">
            <Sparkles size={14} className="text-amber-300" />
            <span>Santé & Bien-être Féminin · Burkina Faso</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display tracking-tight leading-tight">
            Bonjour {currentUser.prenom},<br />
            votre santé mérite toute notre attention.
          </h2>

          <p className="text-xs sm:text-sm text-pink-100 leading-relaxed max-w-xl">
            PagLaafi vous oriente vers les centres de dépistage du Burkina Faso, vous guide pour l'autopalpation mensuelle et répond à toutes vos questions avec Rose IA.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5 sm:gap-3">
            <ButtonV2
              variant="secondary"
              size="md"
              onClick={() => onNavigate("Prevention")}
              icon={<BookOpen size={16} />}
            >
              Comprendre la prévention
            </ButtonV2>
            <ButtonV2
              variant="outline"
              size="md"
              className="bg-white/10 text-white border-white/25 hover:bg-white/20 hover:border-white"
              onClick={() => onNavigate("RoseIA")}
              icon={<Sparkles size={16} className="text-amber-300" />}
            >
              Parler à Rose IA
            </ButtonV2>
          </div>
        </div>
      </div>

      {/* 2. ACCÈS RAPIDES (GRILLE DE CARTES ERGONOMIQUES) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm sm:text-base font-bold text-[#29252A] font-display">
            Accès rapides essentiels
          </h3>
          <span className="text-[11px] text-[#716971]">Navigation directe</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Carte 1 : Centres & Carte */}
          <CardV2
            onClick={() => onNavigate("Centres")}
            className="hover:border-[#A14364] hover:shadow-md cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#EAF2ED] text-[#557A63] mb-3 group-hover:scale-105 transition">
                <MapPin size={20} />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#29252A]">Centres de santé</h4>
              <p className="text-[11px] text-[#716971] mt-1 leading-snug">
                Disponibilités réelles, temps d'attente et itinéraire GPS.
              </p>
            </div>
            <span className="mt-3 text-[11px] font-bold text-[#557A63] flex items-center gap-1">
              Voir la carte <ArrowRight size={12} />
            </span>
          </CardV2>

          {/* Carte 2 : Rose IA */}
          <CardV2
            onClick={() => onNavigate("RoseIA")}
            className="hover:border-[#A14364] hover:shadow-md cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F5E8ED] text-[#A14364] mb-3 group-hover:scale-105 transition">
                <Sparkles size={20} />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#29252A]">Rose IA</h4>
              <p className="text-[11px] text-[#716971] mt-1 leading-snug">
                Écoute bienveillante, questions intimes et hygiène de vie.
              </p>
            </div>
            <span className="mt-3 text-[11px] font-bold text-[#A14364] flex items-center gap-1">
              Discuter <ArrowRight size={12} />
            </span>
          </CardV2>

          {/* Carte 3 : Autopalpation */}
          <CardV2
            onClick={() => onNavigate("Prevention")}
            className="hover:border-[#A14364] hover:shadow-md cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FAF2F5] text-[#A14364] mb-3 group-hover:scale-105 transition">
                <BookOpen size={20} />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#29252A]">Autopalpation</h4>
              <p className="text-[11px] text-[#716971] mt-1 leading-snug">
                Les 4 gestes simples expliqués en audio et vidéo.
              </p>
            </div>
            <span className="mt-3 text-[11px] font-bold text-[#A14364] flex items-center gap-1">
              Apprendre <ArrowRight size={12} />
            </span>
          </CardV2>

          {/* Carte 4 : Aller à deux */}
          <CardV2
            onClick={() => onNavigate("Accompagnant")}
            className="hover:border-[#557A63] hover:shadow-md cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#EAF2ED] text-[#557A63] mb-3 group-hover:scale-105 transition">
                <Share2 size={20} />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#29252A]">Aller à deux</h4>
              <p className="text-[11px] text-[#716971] mt-1 leading-snug">
                Inviter une amie ou sœur par WhatsApp ou SMS direct.
              </p>
            </div>
            <span className="mt-3 text-[11px] font-bold text-[#557A63] flex items-center gap-1">
              Partager <ArrowRight size={12} />
            </span>
          </CardV2>
        </div>
      </div>

      {/* 3. CONSEIL & PENSÉE BIENVEILLANTE DU JOUR (AUDIO 4 LANGUES) */}
      <CardV2 variant="soft" className="relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E9E0E4] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#A14364] text-white">
              <Sparkles size={16} />
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#29252A]">
                Le conseil bienveillant de Rose IA
              </h4>
              <p className="text-[10px] text-[#716971]">
                {currentTip.categoryLabel}
              </p>
            </div>
          </div>

          {/* Boutons d'interaction audio & suivant */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAudioTip}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                isSpeakingTip
                  ? "bg-[#A14364] text-white animate-pulse"
                  : "bg-white text-[#A14364] border border-[#E9E0E4] hover:bg-[#FAF2F5]"
              }`}
            >
              <Volume2 size={14} />
              <span>{isSpeakingTip ? "Arrêter l'écoute" : "Écouter le conseil"}</span>
            </button>
            <button
              onClick={() => {
                hapticFeedback(10);
                setTipIndex((prev) => prev + 1);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-[#E9E0E4] text-xs font-semibold text-[#716971] hover:text-[#29252A]"
            >
              Suivant →
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#29252A] leading-relaxed italic">
          « {tipText} »
        </p>

        <div className="mt-3 flex items-center justify-between text-[11px] text-[#716971]">
          <span>Rose IA veille sur vous · Non diagnostique</span>
          <span className="font-semibold text-[#A14364]">
            {appLanguage.toUpperCase()}
          </span>
        </div>
      </CardV2>

      {/* 4. CAMPAGNES & DÉPISTAGES VALIDÉS EN COURS */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#29252A] font-display">
              Campagnes & dépistages actifs au Burkina Faso
            </h3>
            <p className="text-[11px] text-[#716971]">
              Informations vérifiées par les associations et soignants partenaires
            </p>
          </div>
          <button
            onClick={() => onNavigate("Annonces")}
            className="text-xs font-bold text-[#A14364] hover:underline"
          >
            Toutes les annonces →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {approvedAnnouncements.map((announcement) => (
            <CardV2
              key={announcement.id}
              className="flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <BadgeV2 variant="rose">
                    {announcement.author}
                  </BadgeV2>
                  <span className="text-[10px] text-[#716971]">
                    {announcement.city.split(",")[0]}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-[#29252A] line-clamp-2">
                  {announcement.title}
                </h4>

                <p className="text-[11px] text-[#716971] mt-1.5 line-clamp-3 leading-relaxed">
                  {announcement.content}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#E9E0E4] flex items-center justify-between text-[10.5px]">
                <span className="font-semibold text-[#557A63]">
                  {announcement.badge}
                </span>
                <span className="text-[#716971]">{announcement.date}</span>
              </div>
            </CardV2>
          ))}
        </div>
      </div>

      {/* 5. BANDEAU DE SOLIDARITÉ & DONS */}
      <div className="rounded-3xl bg-[#FAF2F5] border border-[#E9E0E4] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Gift size={16} className="text-[#A14364]" />
            <h4 className="text-sm sm:text-base font-bold text-[#29252A] font-display">
              Fonds de Solidarité Patientes PagLaafi
            </h4>
          </div>
          <p className="text-xs text-[#716971] max-w-xl">
            100% des dons financent les mammographies et examens des femmes démunies au CMA de Schiphra et dans les centres partenaires.
          </p>
        </div>
        <ButtonV2
          variant="primary"
          size="md"
          onClick={onOpenDonationModal}
          icon={<Gift size={15} />}
        >
          Contribuer (Orange / Moov Money)
        </ButtonV2>
      </div>
    </div>
  );
}
