import {
  Bell,
  CalendarDays,
  ChevronRight,
  Heart,
  MapPin,
  Megaphone,
  Sparkles,
  UserPlus,
  Volume2,
} from "lucide-react";
import { roseDailyTips } from "../donnees/conseilsRose";
import { useUi, useAuth, useAudio, useCentres, useSante, useRose, useAnnonces, useDons } from "../etat/contextes";

/**
 * Onglet Accueil : conseil du jour et raccourcis.
 */
export function Accueil() {
  const { section, setSection } = useUi();
  const { currentUser } = useAuth();
  const { handlePlayAudio } = useAudio();
  const { setViewMode } = useCentres();
  const { cycleInfo } = useSante();
  const { dailyTipIndex, dailyTipLang, handleRequestNotification, notificationEnabled, setDailyTipIndex, setDailyTipLang } = useRose();
  const { announcements } = useAnnonces();
  const { setShowDonationModal } = useDons();

  return (
    <section className="ph-enter">
      <div className="relative overflow-hidden bg-[#f9e9ed] px-5 pb-6 pt-5">
        <div className="pointer-events-none absolute -right-6 -top-8 h-44 w-44 rounded-full border-[20px] border-[#f0d0db] opacity-60" />

        <div className="relative flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#a44666] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d65f84]" /> Santé des femmes · Burkina Faso
          </span>
          {currentUser && (
            <span className="text-[11px] font-bold text-[#8e4462]">
              {currentUser.prenom} ({currentUser.roleLabel})
            </span>
          )}
        </div>

        <h1 className="ph-display relative mt-3 text-[33px] leading-[1.02] tracking-[-.025em] text-[#580e36]">
          Une question ?<br />
          <span className="text-[#b94e70]">Vous n'êtes pas seule.</span>
        </h1>

        <p className="relative mt-2 text-[13px] leading-[1.6] text-[#745866]">
          Voyez quel centre peut vous accueillir aujourd’hui, repérez le bon moment pour votre autopalpation et trouvez de l’aide près de chez vous.
        </p>

        <div className="relative mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setSection("Centres"); setViewMode("map"); }}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#ea2d6d] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[#d81f5c]"
          >
            <MapPin size={15} /> Voir la carte en direct
          </button>
          <button
            onClick={() => setSection("Calendrier")}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#dfb3c1] bg-white px-3.5 py-2 text-xs font-bold text-[#8c3e59] shadow-sm hover:bg-[#fbf4f6]"
          >
            <CalendarDays size={14} /> Règles & Autopalpation
          </button>
        </div>
      </div>

      {/* CARTE MOT DOUX & SANTÉ GLOBALE : ROSE IA (PENSÉE BIENVEILLANTE DU JOUR) */}
      <div className="px-5 pt-3.5">
        <div className="rounded-[26px] border-2 border-[#eed5df] bg-gradient-to-br from-[#ffffff] via-[#fff8fa] to-[#faedf2] p-4 shadow-sm hover:border-[#dfb2c2] transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-tr from-[#8a3350] to-[#cf5d83] text-white shadow-xs">
                <Sparkles size={16} className="text-amber-300 animate-pulse" />
              </span>
              <div>
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#ea2d6d]">
                  Rose IA · Conseil Bienveillant du Jour
                </span>
                <h3 className="ph-display text-xs font-bold text-[#580e36]">
                  {roseDailyTips[dailyTipIndex].titleFr}
                </h3>
              </div>
            </div>

            <button
              onClick={handleRequestNotification}
              className={`grid h-8 w-8 place-items-center rounded-xl transition ${
                notificationEnabled
                  ? "bg-emerald-500 text-white shadow-xs"
                  : "bg-[#f5e6ec] text-[#8e3f5a] hover:bg-[#ebd3de]"
              }`}
              title={notificationEnabled ? "Notifications quotidiennes actives" : "Activer les notifications locales"}
            >
              <Bell size={15} className={notificationEnabled ? "fill-white" : ""} />
            </button>
          </div>

          {/* Catégorie & Sélecteur de langue */}
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1.5 border-b border-[#f3e1e7] pb-2 text-[10px]">
            <span className={`font-bold px-2 py-0.5 rounded-full border ${roseDailyTips[dailyTipIndex].categoryColor}`}>
              {roseDailyTips[dailyTipIndex].categoryLabel}
            </span>

            <div className="flex items-center gap-1 font-bold">
              {(
                [
                  { code: "fr", label: "🇫🇷 FR" },
                  { code: "moore", label: "🇧🇫 Mooré" },
                  { code: "dioula", label: "🇧🇫 Dioula" },
                  { code: "en", label: "🇬🇧 EN" },
                ] as const
              ).map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setDailyTipLang(code)}
                  className={`rounded-lg px-2 py-0.5 transition ${
                    dailyTipLang === code
                      ? "bg-[#ea2d6d] text-white shadow-xs"
                      : "bg-white text-[#7d5668] hover:bg-[#f6e7ee]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Contenu du message bienveillant dans la langue choisie */}
          <div className="mt-2 text-xs leading-relaxed text-[#512c3e] italic">
            «{" "}
            {dailyTipLang === "moore"
              ? roseDailyTips[dailyTipIndex].moore
              : dailyTipLang === "dioula"
                ? roseDailyTips[dailyTipIndex].dioula
                : dailyTipLang === "en"
                  ? roseDailyTips[dailyTipIndex].en
                  : roseDailyTips[dailyTipIndex].fr}
            {" "}»
          </div>

          {/* Actions rapides : Écouter l'audio, changer de conseil, discuter avec Rose IA */}
          <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-[#f4e4e9]">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  const tip = roseDailyTips[dailyTipIndex];
                  const txt =
                    dailyTipLang === "moore"
                      ? tip.moore
                      : dailyTipLang === "dioula"
                        ? tip.dioula
                        : dailyTipLang === "en"
                          ? tip.en
                          : tip.fr;
                  handlePlayAudio(txt, dailyTipLang);
                }}
                className="inline-flex items-center gap-1 rounded-xl bg-[#faedf2] px-2.5 py-1 text-[11px] font-bold text-[#8f3654] hover:bg-[#f5dfe7] transition"
              >
                <Volume2 size={13} />
                <span>Écouter</span>
              </button>

              <button
                onClick={() =>
                  setDailyTipIndex((prev) => (prev + 1) % roseDailyTips.length)
                }
                className="inline-flex items-center gap-1 rounded-xl bg-white border border-[#edd1dc] px-2 py-1 text-[11px] font-bold text-[#7a485c] hover:bg-[#fdf4f7] transition"
                title="Voir une autre pensée bienveillante"
              >
                <span>Autre conseil ✨</span>
              </button>
            </div>

            <button
              onClick={() => setSection("RoseIA")}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ea2d6d] hover:underline"
            >
              <span>Confier à Rose IA</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 1. CARTE CALENDRIER DU CYCLE & AUTOPALPATION */}
      <div className="px-5 pt-4">
        <div
          onClick={() => setSection("Calendrier")}
          className="cursor-pointer rounded-[24px] border border-[#f0d4de] bg-gradient-to-br from-[#fff7f9] to-[#faedf2] p-4 shadow-sm hover:border-[#dfb2c2]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#ea2d6d] text-white shadow-sm">
                <CalendarDays size={20} />
              </span>
              <div>
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#ea2d6d]">
                  Suivi du cycle & Seins
                </span>
                <h3 className="ph-display text-sm font-bold text-[#580e36]">
                  Mon Calendrier & Autopalpation
                </h3>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#ea2d6d]" />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-white/90 p-2 border border-[#f3e1e7]">
              <p className="text-[9px] font-bold text-[#955c71] uppercase">Prochaines règles</p>
              <p className="font-extrabold text-[#580e36]">{cycleInfo.nextPeriodStr}</p>
            </div>
            <div className="rounded-xl bg-white/90 p-2 border border-[#f3e1e7]">
              <p className="text-[9px] font-bold text-[#955c71] uppercase">Fenêtre autopalpation</p>
              <p className="font-extrabold text-[#10b981]">{cycleInfo.autopalpWindowStr}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RACCOURCI CARTE VIVANTE DES SOINS */}
      <div className="px-5 pt-3">
        <div
          onClick={() => { setSection("Centres"); setViewMode("map"); }}
          className="cursor-pointer rounded-2xl border border-[#eedde2] bg-white p-3.5 shadow-sm hover:border-[#dfb4c2]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500 text-white">
                <MapPin size={20} />
              </span>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800">
                  Disponibilités en direct
                </span>
                <h4 className="ph-display text-sm font-bold text-[#580e36]">
                  Carte Vivante des Centres
                </h4>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
              OpenStreetMap →
            </span>
          </div>
        </div>
      </div>

      {/* 3. RACCOURCI ANNONCES DES PARTENAIRES */}
      <div className="px-5 pt-3">
        <div
          onClick={() => setSection("Annonces")}
          className="cursor-pointer rounded-2xl border border-purple-200 bg-purple-50/70 p-3 shadow-sm hover:border-purple-300"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-purple-900">
              <Megaphone size={13} /> {announcements[0]?.badge}
            </span>
            <span className="text-[10px] font-semibold text-purple-700">Annonces ({announcements.filter((a) => a.month === "Octobre 2026").length}) →</span>
          </div>
          <h4 className="mt-1 text-xs font-bold text-purple-950">{announcements[0]?.title}</h4>
        </div>
      </div>

      {/* 4. RACCOURCI L'ACCOMPAGNANT */}
      <div className="px-5 pt-3">
        <div
          onClick={() => setSection("Accompagnant")}
          className="cursor-pointer rounded-[22px] border-2 border-[#e8bcc9] bg-gradient-to-br from-[#fff6f8] to-[#fbf0f4] p-3.5 shadow-sm transition hover:border-[#cf7794]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#ea2d6d] text-white">
                <UserPlus size={19} />
              </span>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#ea2d6d]">Aller à deux</span>
                <h3 className="ph-display text-base font-bold text-[#580e36]">Inviter mon accompagnant(e)</h3>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#ea2d6d]" />
          </div>
        </div>
      </div>

      {/* 5. FAIRE UN DON SOLIDAIRE : PLACÉ EN BAS DE LA LISTE DE L'ACCUEIL AVEC ICÔNE CŒUR */}
      <div className="px-5 pt-4 pb-2">
        <div
          onClick={() => setShowDonationModal(true)}
          className="cursor-pointer rounded-[24px] border-2 border-rose-300 bg-gradient-to-r from-rose-50 via-[#fff8fa] to-[#ffeef3] p-4 shadow-sm hover:border-rose-400 transition"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#ea2d6d] text-white shadow-md">
                <Heart size={22} className="fill-white" />
              </span>
              <div>
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#ea2d6d]">
                  Solidarité 100% Burkina Faso
                </span>
                <h4 className="ph-display text-base font-bold text-[#580e36]">
                  Faire un don
                </h4>
                <p className="text-[10.5px] text-[#7a5867]">
                  Offrir une mammographie avec option anonyme chiffrée
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDonationModal(true);
              }}
              className="rounded-full bg-[#ea2d6d] px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-[#8e3856] transition"
            >
              Aider →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
