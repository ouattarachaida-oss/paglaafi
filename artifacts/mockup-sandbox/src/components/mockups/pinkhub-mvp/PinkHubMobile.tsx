import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Headphones,
  Heart,
  HeartHandshake,
  MapPin,
  Pause,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Volume2,
  X,
} from "lucide-react";

type Section = "Accueil" | "Centres" | "Comprendre" | "Soutien";

const navItems: { label: Section; icon: typeof Heart }[] = [
  { label: "Accueil", icon: Heart },
  { label: "Centres", icon: MapPin },
  { label: "Comprendre", icon: BookOpen },
  { label: "Soutien", icon: HeartHandshake },
];

const demoCenters = [
  { id: 1, name: "Centre de santé — exemple", place: "Ouagadougou", type: "Centre de santé", note: "Fiche de démonstration" },
  { id: 2, name: "Structure de soins — exemple", place: "Bobo-Dioulasso", type: "Structure de soins", note: "Fiche de démonstration" },
  { id: 3, name: "Point d’orientation — exemple", place: "Koudougou", type: "Orientation", note: "Fiche de démonstration" },
];

const lessons = [
  { title: "Comprendre le cancer du sein", duration: "4 min", category: "Les bases", description: "Des repères simples pour comprendre de quoi l’on parle, sans jargon." },
  { title: "Quand demander conseil ?", duration: "3 min", category: "S’orienter", description: "Comment préparer ses questions et trouver une personne de confiance." },
  { title: "Accompagner une proche", duration: "5 min", category: "Pour les proches", description: "Écouter, soutenir et respecter le rythme de la personne concernée." },
];

export function PinkHubMobile() {
  const [section, setSection] = useState<Section>("Accueil");
  const [search, setSearch] = useState("");
  const [selectedCenter, setSelectedCenter] = useState<(typeof demoCenters)[number] | null>(null);
  const [playing, setPlaying] = useState(false);
  const [activeLesson, setActiveLesson] = useState(0);
  const [toast, setToast] = useState("");
  const filteredCenters = useMemo(
    () => demoCenters.filter((center) => `${center.name} ${center.place} ${center.type}`.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const openLesson = (index: number) => {
    setActiveLesson(index);
    setPlaying(true);
    setSection("Comprendre");
  };

  return (
    <main className="min-h-[100dvh] bg-[#f8e8ec] px-0 text-[#39232e] sm:flex sm:items-center sm:justify-center sm:p-8" style={{ fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');
        .ph-display { font-family: 'Fraunces', Georgia, serif; }
        .ph-scroll::-webkit-scrollbar { display:none; }
        .ph-scroll { scrollbar-width:none; }
        @keyframes ph-rise { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        .ph-enter { animation: ph-rise .32s ease-out both; }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; scroll-behavior:auto !important; } }
      `}</style>
      <div className="relative mx-auto flex h-[100dvh] w-full max-w-[440px] flex-col overflow-hidden bg-[#fffaf9] shadow-[0_28px_80px_rgba(93,39,61,.15)] sm:h-[min(860px,92dvh)] sm:rounded-[34px] sm:border sm:border-white/80">
        <header className="z-10 flex shrink-0 items-center justify-between border-b border-[#f2e3e6] bg-[#fffaf9]/95 px-5 py-1 backdrop-blur">
          <button aria-label="Accueil PagLaafi" onClick={() => { setSection("Accueil"); setSelectedCenter(null); }} className="flex items-center">
            <img
              src="/__mockup/images/pinkhub-mvp-paglaafi.png"
              alt="Logo PagLaafi, une femme et un ruban rose"
              className="h-16 w-16 object-contain mix-blend-multiply"
            />
          </button>
          <button onClick={() => notify("Les informations sont en cours de préparation avec des partenaires locaux.")} aria-label="Informations sur PinkHub" className="grid h-10 w-10 place-items-center rounded-full text-[#805467] transition hover:bg-[#f9edf0]">
            <CircleHelp size={21} />
          </button>
        </header>

        <div className="ph-scroll flex-1 overflow-y-auto pb-5">
          {selectedCenter ? (
            <section className="ph-enter px-5 pt-5">
              <button onClick={() => setSelectedCenter(null)} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#a14b68]"><ArrowLeft size={17} /> Retour aux centres</button>
              <div className="rounded-[28px] bg-[#f9e9ed] p-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-[#a14b68]"><MapPin size={12} /> Démonstration</span>
                <h1 className="ph-display mt-5 text-[32px] leading-[1.05] text-[#462536]">{selectedCenter.name}</h1>
                <p className="mt-2 text-sm font-medium text-[#866475]">{selectedCenter.place}</p>
              </div>
              <div className="mt-5 rounded-2xl border border-[#f0dfe4] bg-white p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-[#63394d]"><ShieldCheck size={17} className="text-[#b65476]" /> Données à confirmer</p>
                <p className="mt-2 text-sm leading-6 text-[#745a66]">Cette fiche est un exemple d’interface. Elle ne désigne pas un établissement vérifié et ne contient pas de coordonnées. Les informations seront confirmées avec des partenaires locaux avant publication.</p>
              </div>
              <button onClick={() => notify("Le parcours d’orientation avec des informations vérifiées sera bientôt disponible.")} className="mt-5 flex w-full items-center justify-between rounded-2xl bg-[#a74869] px-5 py-4 text-left text-white transition hover:bg-[#923e5c]">
                <span><span className="block text-sm font-bold">Besoin d’être orientée ?</span><span className="mt-1 block text-xs text-white/80">Voir les prochaines étapes</span></span><ArrowRight size={19} />
              </button>
            </section>
          ) : section === "Accueil" ? (
            <section className="ph-enter">
              <div className="relative overflow-hidden bg-[#f8e9ed] px-5 pb-6 pt-7">
                <div className="pointer-events-none absolute -right-8 -top-10 h-48 w-48 rounded-full border-[22px] border-[#f1d4dd] opacity-70" />
                <div className="pointer-events-none absolute right-8 top-14 h-20 w-20 rounded-full border border-[#eabac9]" />
                <p className="relative inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.13em] text-[#a64e6b]"><span className="h-1.5 w-1.5 rounded-full bg-[#d8708e]" /> Un repère, à votre rythme</p>
                <h1 className="ph-display relative mt-5 max-w-[320px] text-[39px] leading-[.99] tracking-[-.035em] text-[#472738]">Une question ?<br /><span className="text-[#bb5575]">Vous n’êtes pas seule.</span></h1>
                <p className="relative mt-4 max-w-[320px] text-[14px] leading-[1.65] text-[#765b67]">Des informations claires et des pistes pour trouver le bon accompagnement, au Burkina Faso.</p>
                <button onClick={() => setSection("Comprendre")} className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-[#a74869] px-5 py-3 text-[13px] font-bold text-white shadow-[0_8px_18px_rgba(167,72,105,.18)] transition hover:-translate-y-0.5">
                  Commencer par comprendre <ArrowRight size={16} />
                </button>
                <div className="relative mt-5 flex items-center gap-2 text-[11px] font-medium text-[#866475]"><ShieldCheck size={15} className="text-[#a64e6b]" /> Information et orientation, pas un diagnostic.</div>
              </div>

              <div className="px-5 pt-5">
                <div className="mb-3 flex items-end justify-between">
                  <div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#b4617d]">Votre prochain pas</p><h2 className="ph-display mt-1 text-[24px] leading-tight">Par où commencer ?</h2></div>
                  <span className="mb-1 text-[11px] text-[#9c7b88]">À votre rythme</span>
                </div>
                <button onClick={() => setSection("Centres")} className="flex w-full items-center gap-3 rounded-[20px] border border-[#f0dfe4] bg-white p-3.5 text-left transition hover:border-[#dfa3b5] hover:shadow-sm">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[15px] bg-[#f9e9ed] text-[#ad4e6e]"><MapPin size={20} /></span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-bold">Trouver un centre d’orientation</span><span className="mt-1 block text-xs text-[#8d7480]">Consulter les fiches disponibles</span></span><ChevronRight size={18} className="text-[#ae7186]" />
                </button>
                <button onClick={() => setSection("Comprendre")} className="mt-2.5 flex w-full items-center gap-3 rounded-[20px] border border-[#f0dfe4] bg-white p-3.5 text-left transition hover:border-[#dfa3b5] hover:shadow-sm">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[15px] bg-[#f5eff7] text-[#855a8a]"><AudioLines size={20} /></span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-bold">Écouter une explication courte</span><span className="mt-1 block text-xs text-[#8d7480]">Un format audio facile à suivre</span></span><ChevronRight size={18} className="text-[#ae7186]" />
                </button>
              </div>

              <div className="mx-5 mt-6 overflow-hidden rounded-[24px] bg-[#76445d] p-5 text-white">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.14em]"><Sparkles size={12} /> À venir</span>
                  <span className="text-[10px] font-medium text-white/65">Campagnes & rencontres</span>
                </div>
                <h2 className="ph-display mt-4 text-[26px] leading-tight">Ensemble, on en parle.</h2>
                <p className="mt-2 max-w-[280px] text-[12px] leading-5 text-white/80">Retrouvez ici les campagnes de sensibilisation et les événements partagés par les partenaires locaux.</p>
                <button onClick={() => notify("Les campagnes et événements seront affichés après confirmation par les partenaires.")} className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-white transition hover:gap-3">Découvrir les prochaines actions <ArrowRight size={15} /></button>
              </div>

              <div className="mx-5 mt-5 flex items-start gap-3 rounded-2xl border border-[#efdee3] bg-[#fffdfc] p-4">
                <span className="mt-0.5 text-[#ab5671]"><ShieldCheck size={18} /></span>
                <p className="text-[11px] leading-[1.6] text-[#816b75]"><strong className="text-[#5e3b4b]">Un espace de confiance.</strong> Les contenus PinkHub informent et orientent. Ils ne remplacent pas l’avis d’un professionnel de santé.</p>
              </div>
            </section>
          ) : section === "Centres" ? (
            <section className="ph-enter px-5 pt-6">
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#b4617d]">Trouver un repère</p>
              <h1 className="ph-display mt-1 text-[34px] leading-tight">Centres & orientation</h1>
              <p className="mt-2 text-sm leading-6 text-[#806874]">Recherchez une ville ou une structure dans les exemples ci-dessous.</p>
              <label className="mt-5 flex items-center gap-3 rounded-2xl border border-[#ecd9df] bg-white px-4 py-3.5 focus-within:border-[#c46a87] focus-within:ring-2 focus-within:ring-[#e7b9c7]/50">
                <Search size={18} className="shrink-0 text-[#a65d76]" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ville ou nom de structure" className="w-full bg-transparent text-sm text-[#4f3341] outline-none placeholder:text-[#b09aa3]" />
                {search && <button onClick={() => setSearch("")} aria-label="Effacer la recherche"><X size={16} className="text-[#987684]" /></button>}
              </label>
              <div className="mt-4 rounded-xl bg-[#f9e9ed] px-3.5 py-3 text-[11px] leading-[1.6] text-[#7e5b69]"><strong className="text-[#874258]">Démonstration uniquement.</strong> Ces fiches sont fictives et ne constituent pas une liste de centres vérifiés. Aucun contact n’est inventé.</div>
              <div className="mt-5 flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#573648]">{filteredCenters.length} exemple{filteredCenters.length === 1 ? "" : "s"}</h2>
                <span className="text-[10px] uppercase tracking-[.12em] text-[#a18590]">À confirmer localement</span>
              </div>
              <div className="mt-3 space-y-2.5">
                {filteredCenters.map((center, index) => (
                  <button key={center.id} onClick={() => setSelectedCenter(center)} className="flex w-full items-center gap-3 rounded-[20px] border border-[#f0dfe4] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#dfa3b5] hover:shadow-[0_8px_20px_rgba(93,39,61,.07)]">
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-[15px] ${index % 2 ? "bg-[#f3eef7] text-[#865c8b]" : "bg-[#fae9ed] text-[#ad4e6e]"}`}><MapPin size={19} /></span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-[#523445]">{center.name}</span><span className="mt-1 block text-xs text-[#8f7681]">{center.place} · {center.type}</span><span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[#ad5874]"><span className="h-1.5 w-1.5 rounded-full bg-[#cc7992]" /> {center.note}</span></span>
                    <ChevronRight size={17} className="shrink-0 text-[#b38494]" />
                  </button>
                ))}
                {filteredCenters.length === 0 && <div className="rounded-[22px] border border-dashed border-[#dfc2cc] bg-[#fffdfc] px-5 py-8 text-center"><Search size={23} className="mx-auto text-[#bf7a91]" /><p className="mt-3 text-sm font-bold">Aucun résultat pour le moment</p><p className="mt-1 text-xs leading-5 text-[#8c7580]">Essayez une autre ville ou effacez votre recherche.</p><button onClick={() => setSearch("")} className="mt-4 rounded-full bg-[#f6e4e9] px-4 py-2 text-xs font-bold text-[#8c405a]">Effacer la recherche</button></div>}
              </div>
              <button onClick={() => notify("Les fiches vérifiées seront ajoutées après validation avec les partenaires locaux.")} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#dcaaba] px-4 py-3 text-sm font-bold text-[#97445f] transition hover:bg-[#f9edf0]"><UsersRound size={17} /> Comment les fiches sont vérifiées</button>
            </section>
          ) : section === "Comprendre" ? (
            <section className="ph-enter px-5 pt-6">
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#b4617d]">Des mots simples, des repères fiables</p>
              <h1 className="ph-display mt-1 text-[35px] leading-tight">Comprendre, pas à pas.</h1>
              <p className="mt-2 text-sm leading-6 text-[#806874]">Des explications courtes à lire ou à écouter, pensées pour avancer à votre rythme.</p>
              <div className="mt-5 rounded-[25px] bg-[#76445d] p-5 text-white">
                <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.13em] text-white/75"><Headphones size={15} /> Écouter</span><span className="text-[10px] text-white/60">Audio de démonstration</span></div>
                <h2 className="ph-display mt-4 text-[25px] leading-tight">{lessons[activeLesson].title}</h2>
                <p className="mt-2 text-xs leading-5 text-white/75">{lessons[activeLesson].description}</p>
                <div className="mt-5 flex items-center gap-3">
                  <button onClick={() => setPlaying(!playing)} aria-label={playing ? "Mettre l’audio en pause" : "Écouter l’audio"} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-[#81485f] transition hover:scale-105">{playing ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" className="ml-0.5" />}</button>
                  <div className="min-w-0 flex-1"><div className="h-1.5 overflow-hidden rounded-full bg-white/25"><div className={`h-full rounded-full bg-[#f4c7d3] transition-all duration-500 ${playing ? "w-[38%]" : "w-[13%]"}`} /></div><div className="mt-2 flex justify-between text-[10px] text-white/65"><span>{playing ? "Lecture en cours" : "Prêt à écouter"}</span><span>{lessons[activeLesson].duration}</span></div></div>
                  <Volume2 size={17} className="shrink-0 text-white/70" />
                </div>
                <p className="mt-4 border-t border-white/15 pt-3 text-[10px] leading-[1.5] text-white/65">Prototype : la lecture audio réelle n’est pas encore connectée.</p>
              </div>
              <div className="mt-6 flex items-center justify-between"><h2 className="text-sm font-bold">À découvrir</h2><span className="text-[10px] text-[#a18590]">3 contenus</span></div>
              <div className="mt-3 space-y-2.5">
                {lessons.map((lesson, index) => (
                  <button key={lesson.title} onClick={() => openLesson(index)} className={`flex w-full items-center gap-3 rounded-[20px] border p-3.5 text-left transition ${activeLesson === index ? "border-[#dba5b5] bg-[#fdf4f6]" : "border-[#f0dfe4] bg-white hover:border-[#dfa3b5]"}`}>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-[#f8e8ed] text-[#ad4e6e]">{index === activeLesson && playing ? <AudioLines size={19} /> : <BookOpen size={18} />}</span>
                    <span className="min-w-0 flex-1"><span className="block text-[13px] font-bold">{lesson.title}</span><span className="mt-1 block text-[11px] text-[#947d87]">{lesson.category} · {lesson.duration}</span></span><ChevronRight size={16} className="text-[#b38494]" />
                  </button>
                ))}
              </div>
              <div className="mt-5 flex gap-3 rounded-2xl border border-[#efdee3] bg-white p-4">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#ac5571]" />
                <p className="text-[11px] leading-[1.6] text-[#816b75]">Ces contenus sont à visée informative. Une question de santé mérite un échange avec un professionnel de santé.</p>
              </div>
            </section>
          ) : (
            <section className="ph-enter px-5 pt-6">
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#b4617d]">Vous pouvez demander du soutien</p>
              <h1 className="ph-display mt-1 text-[35px] leading-tight">À plusieurs, c’est moins lourd.</h1>
              <p className="mt-2 text-sm leading-6 text-[#806874]">Que vous soyez concernée ou proche, il existe différentes façons de ne pas rester seule.</p>
              <div className="mt-5 overflow-hidden rounded-[25px] bg-[#f8e9ed] p-5">
                <div className="grid h-12 w-12 place-items-center rounded-[17px] bg-white text-[#a94f6b]"><HeartHandshake size={23} /></div>
                <h2 className="ph-display mt-4 text-[25px]">Un petit pas compte.</h2>
                <p className="mt-2 text-[13px] leading-[1.65] text-[#775d68]">Parler à une personne de confiance, écrire ses questions ou demander à être accompagnée peut aider à avancer à son rythme.</p>
                <button onClick={() => notify("Les ressources de soutien seront publiées après validation avec les partenaires locaux.")} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#a74869] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#923e5c]">Voir les ressources de soutien <ArrowRight size={15} /></button>
              </div>
              <h2 className="mt-6 text-sm font-bold">Des idées pour aujourd’hui</h2>
              <div className="mt-3 space-y-2.5">
                {[
                  ["Parler à une proche", "Choisissez une personne avec qui vous vous sentez en confiance.", Heart],
                  ["Préparer ses questions", "Notez ce que vous aimeriez demander lors d’un échange de santé.", BookOpen],
                  ["Chercher une orientation", "Consultez les fiches de démonstration, en attendant des données vérifiées.", MapPin],
                ].map(([title, body, Icon], i) => {
                  const ItemIcon = Icon as typeof Heart;
                  return <div key={title as string} className="flex items-start gap-3 rounded-[20px] border border-[#f0dfe4] bg-white p-4"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[14px] ${i === 1 ? "bg-[#f3eef7] text-[#855a8a]" : "bg-[#fae9ed] text-[#ad4e6e]"}`}><ItemIcon size={18} /></span><span><span className="block text-sm font-bold">{title as string}</span><span className="mt-1 block text-xs leading-[1.55] text-[#8d7480]">{body as string}</span></span></div>;
                })}
              </div>
              <button onClick={() => notify("Les informations de contact seront ajoutées uniquement après vérification.")} className="mt-5 flex w-full items-center justify-between rounded-2xl border border-[#e6c9d2] bg-white p-4 text-left"><span className="flex items-center gap-2 text-sm font-bold text-[#714357]"><CircleHelp size={17} /> Besoin d’une aide immédiate ?</span><ChevronRight size={17} className="text-[#aa6980]" /></button>
              <p className="mt-3 text-center text-[10px] leading-5 text-[#9a818c]">PinkHub ne fournit pas de diagnostic et ne remplace pas une consultation médicale.</p>
            </section>
          )}
        </div>

        {!selectedCenter && <nav aria-label="Navigation principale" className="z-10 grid shrink-0 grid-cols-4 border-t border-[#f0e1e5] bg-[#fffaf9] px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2">
          {navItems.map(({ label, icon: Icon }) => {
            const active = section === label;
            return <button key={label} onClick={() => setSection(label)} aria-current={active ? "page" : undefined} className={`flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-2xl transition ${active ? "text-[#a74869]" : "text-[#a48b95] hover:bg-[#fcf3f5] hover:text-[#7c5364]"}`}>
              <span className={`grid h-7 w-9 place-items-center rounded-full transition ${active ? "bg-[#f6e2e8]" : ""}`}><Icon size={19} strokeWidth={active ? 2.4 : 1.8} /></span>
              <span className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>{label}</span>
            </button>;
          })}
        </nav>}

        {toast && <div role="status" className="absolute bottom-[86px] left-4 right-4 z-20 flex items-start gap-2 rounded-2xl bg-[#523344] px-4 py-3 text-xs leading-5 text-white shadow-[0_8px_28px_rgba(44,23,35,.22)] ph-enter"><Check size={16} className="mt-0.5 shrink-0 text-[#f0bed0]" />{toast}</div>}
      </div>
    </main>
  );
}
