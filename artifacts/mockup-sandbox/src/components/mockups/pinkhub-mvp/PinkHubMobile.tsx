import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  AudioLines,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock,
  Edit3,
  Headphones,
  Heart,
  HeartHandshake,
  MapPin,
  Menu,
  MessageCircle,
  Pause,
  Phone,
  Play,
  RotateCcw,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserCheck,
  UserPlus,
  UsersRound,
  Volume2,
  X,
} from "lucide-react";

/**
 * ============================================================================
 * TYPES ET DONNÉES DE L'APPLICATION PAGLAAFI / PINKHUB
 * ============================================================================
 */

// Sections de navigation principale
type Section = "Accueil" | "Centres" | "Comprendre" | "Accompagnant" | "Soutien";

// Statuts en direct de la Carte Vivante
type CenterStatus = "available" | "busy" | "maintenance" | "outdated";

interface ExamPrice {
  name: string;
  price: number; // en FCFA
  free: boolean;
  notes?: string;
}

interface HealthCenter {
  id: number;
  name: string;
  shortName: string;
  place: string;
  city: "Ouagadougou" | "Bobo-Dioulasso" | "Koudougou";
  status: CenterStatus;
  statusLabel: string;
  statusColor: string; // classe Tailwind
  apparatus: string;
  isApparatusWorking: boolean;
  agentsPresent: number;
  staffDescription: string;
  queueCount: number;
  estimatedWait: string;
  exams: ExamPrice[];
  audioMessageFr: string;
  audioMessageMoore: string;
  confirmedVisitsToday: number;
  phone: string;
  address: string;
  lastUpdate: string;
  coordinates: { x: number; y: number }; // Pourcentage sur la carte SVG (0 à 100)
}

/**
 * Centres de santé du Burkina Faso avec données en direct
 */
const initialCenters: HealthCenter[] = [
  {
    id: 1,
    name: "CMA de Schiphra (Centre Médical avec Antenne Chirurgicale)",
    shortName: "CMA Schiphra",
    place: "Secteur 30, Ouagadougou",
    city: "Ouagadougou",
    status: "available",
    statusLabel: "Disponible · Attente fluide",
    statusColor: "bg-emerald-500",
    apparatus: "Mammographe numérique Hologic opérationnel",
    isApparatusWorking: true,
    agentsPresent: 4,
    staffDescription: "2 sages-femmes, 1 radiologue, 1 technicienne radio",
    queueCount: 8,
    estimatedWait: "~15 à 20 min",
    exams: [
      { name: "Palpation clinique mammaire", price: 0, free: true, notes: "Dépistage gratuit tous les matins" },
      { name: "Échographie mammaire bilatérale", price: 6000, free: false },
      { name: "Mammographie numérique", price: 12000, free: false, notes: "Résultats en 48h" },
    ],
    audioMessageFr: "Bonjour, ici la sage-femme responsable de Schiphra. Notre mammographe fonctionne parfaitement aujourd'hui. L'attente est faible ce matin, vous serez reçue en moins de 20 minutes.",
    audioMessageMoore: "Ne y beogo pagbã fãa, CMA Schiphra tɩɩm zĩiga yaa kaset. Masã masã, mammographie masĩnã tʋmdame tɩ zĩigã pa noom ye. Wa-y laafi.",
    confirmedVisitsToday: 38,
    phone: "+226 25 36 30 70",
    address: "Tanghin, Secteur 17 (ex-Secteur 30), Ouagadougou",
    lastUpdate: "Aujourd'hui à 08h30 par Mme Sawadogo (Sage-femme chef)",
    coordinates: { x: 52, y: 46 }, // Ouagadougou
  },
  {
    id: 2,
    name: "Centre Hospitalier Universitaire de Bogodogo (CHU-B)",
    shortName: "CHU Bogodogo",
    place: "Secteur 24, Ouagadougou",
    city: "Ouagadougou",
    status: "busy",
    statusLabel: "Forte affluence · Prévoir attente",
    statusColor: "bg-amber-500",
    apparatus: "Mammographe opérationnel (2 appareils sur 2)",
    isApparatusWorking: true,
    agentsPresent: 6,
    staffDescription: "3 radiologues en poste, 3 sages-femmes",
    queueCount: 46,
    estimatedWait: "~1h15 à 1h30",
    exams: [
      { name: "Examen clinique & sensibilisation", price: 0, free: true, notes: "Prise en charge Octobre Rose" },
      { name: "Échographie mammaire haute résolution", price: 7500, free: false },
      { name: "Mammographie de dépistage", price: 10000, free: false },
      { name: "Micro-biopsie guidée", price: 25000, free: false },
    ],
    audioMessageFr: "Au CHU de Bogodogo, les deux appareils fonctionnent mais nous avons une forte affluence ce matin. Si vous êtes pressée, privilégiez le début d'après-midi.",
    audioMessageMoore: "CHU Bogodogo tʋmdame, la neb wʋsg n be kãenkãenga rũnda. Bɩ y bãng tɩ zãama nooma, sã n yaa ne yãmb yaa sõma tɩ y wa zaabre.",
    confirmedVisitsToday: 64,
    phone: "+226 25 37 40 40",
    address: "Boulevard des Tansoba, Arrondissement 5, Ouagadougou",
    lastUpdate: "Aujourd'hui à 09h15 par Dr. Ouedraogo",
    coordinates: { x: 55, y: 48 }, // Sud-Est Ouaga
  },
  {
    id: 3,
    name: "CHU Sourô Sanou (CHUSS) — Service Gynécologie",
    shortName: "CHU Sourô Sanou",
    place: "Centre-Ville, Bobo-Dioulasso",
    city: "Bobo-Dioulasso",
    status: "available",
    statusLabel: "Disponible · Équipe complète",
    statusColor: "bg-emerald-500",
    apparatus: "Mammographe et échographe opérationnels",
    isApparatusWorking: true,
    agentsPresent: 5,
    staffDescription: "2 gynécologues, 3 sages-femmes dédiées",
    queueCount: 12,
    estimatedWait: "~25 min",
    exams: [
      { name: "Auto-palpation guidée & Examen clinique", price: 0, free: true },
      { name: "Échographie mammaire", price: 7000, free: false },
      { name: "Mammographie numérique", price: 12000, free: false },
    ],
    audioMessageFr: "Bonjour aux femmes de Bobo. Notre service de dépistage est ouvert en continu jusqu'à 16 heures. L'équipe est au complet et prête à vous orienter avec bienveillance.",
    audioMessageMoore: "Bobo CHU Sourô Sanou pʋgẽ, b sɩngame tɩ b gũusd pagbã ne laafi. Ned baa a yembre pa be n gũud wʋsg ye. Wa-y tɩ b ges yãmba.",
    confirmedVisitsToday: 42,
    phone: "+226 20 97 00 44",
    address: "Avenue de la République, Bobo-Dioulasso",
    lastUpdate: "Aujourd'hui à 07h50 par Major Traoré",
    coordinates: { x: 26, y: 64 }, // Bobo
  },
  {
    id: 4,
    name: "Centre Hospitalier Régional (CHR) de Koudougou",
    shortName: "CHR Koudougou",
    place: "Secteur 1, Koudougou",
    city: "Koudougou",
    status: "maintenance",
    statusLabel: "Appareil en maintenance technique",
    statusColor: "bg-rose-500",
    apparatus: "Mammographe en révision (pièce attendue ce soir)",
    isApparatusWorking: false,
    agentsPresent: 2,
    staffDescription: "2 sages-femmes assurant les examens cliniques",
    queueCount: 3,
    estimatedWait: "~10 min (Clinique uniquement)",
    exams: [
      { name: "Palpation clinique manuelle", price: 0, free: true, notes: "Maintenue normalement" },
      { name: "Mammographie", price: 10000, free: false, notes: "🔴 Suspendue aujourd'hui" },
    ],
    audioMessageFr: "Attention pour le CHR de Koudougou : notre mammographe est en maintenance pour la journée. Les sages-femmes assurent la palpation manuelle, mais pour la mammographie, prévoyez de revenir demain ou orientez-vous vers Schiphra.",
    audioMessageMoore: "CHR Koudougou: Masĩnã komsame bilfu tɩ b ket n manegda. La pagbã tõe n waame tɩ b ning-b nus n ges b yĩnsa zaalem. Mammographie pa tʋmd rũnda ye.",
    confirmedVisitsToday: 15,
    phone: "+226 25 44 01 24",
    address: "Route de Ouagadougou, Secteur 1, Koudougou",
    lastUpdate: "Aujourd'hui à 08h00 par l'ingénieur biomédical",
    coordinates: { x: 42, y: 47 }, // Koudougou
  },
  {
    id: 5,
    name: "Centre Médical Urbain (CMU) Secteur 22",
    shortName: "CMU Secteur 22",
    place: "Tampouy, Ouagadougou",
    city: "Ouagadougou",
    status: "outdated",
    statusLabel: "Non actualisé aujourd'hui",
    statusColor: "bg-slate-400",
    apparatus: "Statut non confirmé ce matin",
    isApparatusWorking: false,
    agentsPresent: 0,
    staffDescription: "Rapport journalier non validé",
    queueCount: 0,
    estimatedWait: "Inconnue",
    exams: [
      { name: "Consultation d'orientation", price: 1000, free: false },
      { name: "Palpation clinique", price: 0, free: true },
    ],
    audioMessageFr: "Ce centre n'a pas encore validé son rapport de présence ce matin. Nous vous conseillons d'appeler avant de vous déplacer.",
    audioMessageMoore: "Kasetã pa paam kʋdemd sebr rũnda ye. Bɩ y tẽeg n bãng bãmb sã n sɩngame tɩ y yaool n ta.",
    confirmedVisitsToday: 4,
    phone: "+226 25 35 12 00",
    address: "Tampouy, Arrondissement 3, Ouagadougou",
    lastUpdate: "Hier à 16h45",
    coordinates: { x: 50, y: 43 }, // Nord Ouaga
  },
];

/**
 * Contenus pédagogiques (Leçons) avec texte intégral pour la synthèse vocale
 */
const lessons = [
  {
    id: 0,
    title: "Comprendre le cancer du sein sans jargon",
    category: "Les bases",
    duration: "4 min",
    summary: "Des repères clairs pour comprendre ce qui se passe dans le corps, sans dramatiser et avec des mots simples.",
    fullText:
      "Le cancer du sein commence lorsque des cellules du tissu mammaire se modifient et se multiplient anormalement. Dans la très grande majorité des cas, une petite boule ou un nodule n'est PAS un cancer : il s'agit souvent d'un kyste bénin ou d'un nodule fibreux sans danger. Cependant, seul un professionnel de santé peut faire la différence grâce à un examen indolore. Détecté très tôt, le cancer du sein se guérit dans plus de 9 cas sur 10. C'est pourquoi apprendre à observer sa poitrine chaque mois et réaliser un dépistage régulier peut vous sauver la vie.",
    mooreSummary:
      "Bãagã sɩngda ne yĩns nimbas n baood n paasd b toorẽ. Pa bũmb fãa n yaa bãaga ye. Sã n yaa ne zĩig n bilfu tɩ y bãng bãagã zĩig ninga, y tõe n paama laafi tɩ loog wʋsg.",
  },
  {
    id: 1,
    title: "Quand et comment demander conseil ?",
    category: "S'orienter",
    duration: "3 min",
    summary: "Les signes qui doivent vous amener à consulter sans paniquer : une boule, un écoulement ou un pli inhabituel.",
    fullText:
      "Il est recommandé de consulter dès que vous remarquez un changement inhabituel : une boule dans le sein ou sous l'aisselle qui ne disparaît pas après les règles, un écoulement au niveau du mamelon, ou un changement dans l'aspect de la peau comme une fossette ou une rougeur. N'ayez pas peur d'en parler. Les agents de santé des centres de santé du Burkina Faso sont formés pour vous écouter avec respect et discrétion. N'attendez pas d'avoir mal, car au tout début, le nodule ne fait généralement aucun mal.",
    mooreSummary:
      "Sã n yaa tɩ y yã bũmb n lebse y yĩnsa pʋgẽ, wa bõn-kʋdga bɩ kaset zĩiga, bɩ y wa zĩig ning b sẽn gũusd pagbã laafi. Da zoe rabeem ye, tɩɩm dãmbã be n na n sõng yãmba.",
  },
  {
    id: 2,
    title: "Accompagner une proche à son dépistage",
    category: "Pour les proches",
    duration: "5 min",
    summary: "Comment soutenir une sœur, une amie ou une épouse sans jugement et faciliter sa démarche de santé.",
    fullText:
      "Accompagner une femme à son dépistage est l'un des plus beaux gestes de solidarité. Souvent, la peur du diagnostic ou le manque d'informations retiennent les femmes à la maison. En proposant de l'accompagner, vous partagez le trajet, vous dédramatisez l'attente et vous lui donnez du courage. Vous n'avez pas besoin d'être médecin : votre simple présence, votre écoute bienveillante et votre soutien logistique font toute la différence. Faire le dépistage à deux, c'est deux fois moins de stress.",
    mooreSummary:
      "Tõnd sã n kẽng pagb laafi zĩiga a yiibu, yaa sõma wʋsg n yɩɩda. Zoe rabeem pa be ye. Y tõe n pʋd n tɩ ges y laafi n paam bas-m-yam.",
  },
];

/**
 * ============================================================================
 * COMPOSANT PRINCIPAL : PINKHUB MOBILE
 * ============================================================================
 */
export function PinkHubMobile() {
  // Navigation & État global
  const [section, setSection] = useState<Section>("Accueil");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<string>("");

  // Centres & Carte Vivante
  const [centers, setCenters] = useState<HealthCenter[]>(initialCenters);
  const [selectedCenter, setSelectedCenter] = useState<HealthCenter | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [showAgentModal, setShowAgentModal] = useState<HealthCenter | null>(null);

  // Audio & Synthèse vocale
  const [activeLesson, setActiveLesson] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [speechLanguage, setSpeechLanguage] = useState<"fr" | "moore">("fr");
  const audioIntervalRef = useRef<number | null>(null);

  // Module "L'Accompagnant"
  const [companionName, setCompanionName] = useState("");
  const [companionRelation, setCompanionRelation] = useState("Ma sœur");
  const [companionPhone, setCompanionPhone] = useState("");
  const [companionCenterId, setCompanionCenterId] = useState<number>(1);
  const [companionDate, setCompanionDate] = useState("Samedi 24 Octobre 2026");
  const [hasInvited, setHasInvited] = useState(false);
  const [hasConfirmedVisit, setHasConfirmedVisit] = useState(false);
  const [companionConfirmedVisit, setCompanionConfirmedVisit] = useState(false);

  // Helper Toast
  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 3200);
  };

  /**
   * Moteur de Synthèse Vocale (Web Speech API)
   * Permet d'écouter les textes en vrai audio directement dans le navigateur
   */
  const handlePlayAudio = (textToSpeak: string, language: "fr" | "moore" = "fr") => {
    if (!("speechSynthesis" in window)) {
      notify("La synthèse vocale n'est pas supportée par votre navigateur.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setAudioProgress(0);
      return;
    }

    // Arrêter toute lecture précédente
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "fr-FR";
    utterance.rate = language === "moore" ? 0.85 : 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
      setAudioProgress(5);
      // Simulation barre de progression
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = window.setInterval(() => {
        setAudioProgress((prev) => (prev >= 95 ? 95 : prev + 4));
      }, 1000);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setAudioProgress(100);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      window.setTimeout(() => setAudioProgress(0), 1000);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Arrêt de l'audio lors du changement de section ou démontage
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [section]);

  /**
   * Filtrage dynamique des centres de santé
   */
  const filteredCenters = useMemo(() => {
    return centers.filter((center) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        `${center.name} ${center.place} ${center.city} ${center.apparatus}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        center.exams.some((e) => e.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && center.status === "available") ||
        (statusFilter === "free" && center.exams.some((e) => e.free)) ||
        (statusFilter === "mammo" && center.isApparatusWorking);

      const matchesCity = cityFilter === "all" || center.city === cityFilter;

      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [centers, searchQuery, statusFilter, cityFilter]);

  /**
   * Confirmation communautaire : "J'y suis allée, ça s'est bien passé"
   */
  const handleConfirmCenterVisit = (centerId: number) => {
    setCenters((prev) =>
      prev.map((c) =>
        c.id === centerId ? { ...c, confirmedVisitsToday: c.confirmedVisitsToday + 1 } : c,
      ),
    );
    notify("Merci ! Votre confirmation a été enregistrée pour rassurer les autres femmes.");
  };

  /**
   * Envoi d'invitation Accompagnant (WhatsApp / SMS)
   */
  const generateInvitationText = () => {
    const selectedCenterObj = centers.find((c) => c.id === companionCenterId) || centers[0];
    return `Bonjour ${companionName || "ma sœur"}, Aminata t'invite à faire ton dépistage du cancer du sein avec elle le ${companionDate} au ${selectedCenterObj.shortName} (${selectedCenterObj.city}). C'est gratuit ou à prix encadré, et l'appareil est disponible aujourd'hui ! Découvre les détails ici : http://localhost:5173/`;
  };

  const handleSendWhatsApp = () => {
    if (!companionName) {
      notify("Veuillez indiquer le prénom de votre accompagnant(e).");
      return;
    }
    const text = encodeURIComponent(generateInvitationText());
    const url = companionPhone
      ? `https://api.whatsapp.com/send?phone=${companionPhone.replace(/\D/g, "")}&text=${text}`
      : `https://api.whatsapp.com/send?text=${text}`;
    window.open(url, "_blank");
    setHasInvited(true);
    notify("Lien WhatsApp ouvert ! Votre binôme est maintenant créé.");
  };

  const handleSendSMS = () => {
    if (!companionName) {
      notify("Veuillez indiquer le prénom de votre accompagnant(e).");
      return;
    }
    const text = encodeURIComponent(generateInvitationText());
    const url = `sms:${companionPhone}?body=${text}`;
    window.open(url, "_blank");
    setHasInvited(true);
    notify("Message SMS prêt à l'envoi.");
  };

  /**
   * Mise à jour du centre par le responsable (Simulation Agent de Santé)
   */
  const handleSaveCenterUpdate = (updatedCenter: HealthCenter) => {
    setCenters((prev) => prev.map((c) => (c.id === updatedCenter.id ? updatedCenter : c)));
    if (selectedCenter && selectedCenter.id === updatedCenter.id) {
      setSelectedCenter(updatedCenter);
    }
    setShowAgentModal(null);
    notify("Le statut du centre a été mis à jour en direct sur la carte vivante !");
  };

  return (
    <main
      className="min-h-[100dvh] bg-[#f7e6eb] px-0 text-[#3a222f] sm:flex sm:items-center sm:justify-center sm:p-6"
      style={{ fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Styles personnalisés pour typographie et animations fluides */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');
        .ph-display { font-family: 'Fraunces', Georgia, serif; }
        .ph-scroll::-webkit-scrollbar { display:none; }
        .ph-scroll { scrollbar-width:none; }
        @keyframes ph-rise { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .ph-enter { animation: ph-rise .28s ease-out both; }
        @keyframes ph-pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.35); opacity: 0.4; }
        }
        .ph-pulse { animation: ph-pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>

      {/* Cadre smartphone / viewport mobile centré */}
      <div className="relative mx-auto flex h-[100dvh] w-full max-w-[440px] flex-col overflow-hidden bg-[#fffbfa] shadow-[0_28px_80px_rgba(93,39,61,.18)] sm:h-[min(880px,94dvh)] sm:rounded-[36px] sm:border sm:border-white/90">

        {/* ==================================================================== */}
        {/* BARRE LATÉRALE (SIDEBAR NAVIGATION)                                  */}
        {/* ==================================================================== */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm sm:absolute sm:rounded-[36px]"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="relative flex h-full w-[82%] max-w-[320px] flex-col bg-[#fffaf9] p-5 shadow-2xl transition-transform"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/pinkhub-mvp-paglaafi.png"
                    alt="Logo PagLaafi"
                    className="h-12 w-12 object-contain mix-blend-multiply"
                  />
                  <div>
                    <h2 className="ph-display text-xl font-bold text-[#472738]">PagLaafi</h2>
                    <p className="text-[11px] font-medium text-[#92546e]">Burkina Faso · Santé des femmes</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-full text-[#815568] hover:bg-[#f8e7ec]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Liens de la barre latérale */}
              <nav className="mt-5 space-y-1.5 flex-1 overflow-y-auto">
                <button
                  onClick={() => { setSection("Accueil"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${section === "Accueil" ? "bg-[#f5e3e8] text-[#a14364]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <Heart size={19} className={section === "Accueil" ? "text-[#a14364]" : "text-[#977382]"} />
                  <span>Accueil</span>
                </button>

                <button
                  onClick={() => { setSection("Centres"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${section === "Centres" ? "bg-[#f5e3e8] text-[#a14364]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={19} className={section === "Centres" ? "text-[#a14364]" : "text-[#977382]"} />
                    <span>Carte Vivante des Centres</span>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">Direct</span>
                </button>

                <button
                  onClick={() => { setSection("Comprendre"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${section === "Comprendre" ? "bg-[#f5e3e8] text-[#a14364]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <AudioLines size={19} className={section === "Comprendre" ? "text-[#a14364]" : "text-[#977382]"} />
                  <span>Comprendre & Audio</span>
                </button>

                <button
                  onClick={() => { setSection("Accompagnant"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${section === "Accompagnant" ? "bg-[#f5e3e8] text-[#a14364]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <div className="flex items-center gap-3">
                    <UserPlus size={19} className={section === "Accompagnant" ? "text-[#a14364]" : "text-[#977382]"} />
                    <span>L'Accompagnant (À deux)</span>
                  </div>
                  <span className="rounded-full bg-[#a14364] px-2 py-0.5 text-[10px] font-bold text-white">Nouveau</span>
                </button>

                <button
                  onClick={() => { setSection("Soutien"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${section === "Soutien" ? "bg-[#f5e3e8] text-[#a14364]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <HeartHandshake size={19} className={section === "Soutien" ? "text-[#a14364]" : "text-[#977382]"} />
                  <span>Soutien & Entraide</span>
                </button>

                <div className="pt-4 border-t border-[#f2e1e6]">
                  <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-[#a07484]">Espace Professionnel</p>
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setShowAgentModal(centers[0]);
                    }}
                    className="mt-2 flex w-full items-center gap-3 rounded-2xl border border-dashed border-[#dfb3c1] bg-[#fcf5f7] px-4 py-3 text-left text-xs font-bold text-[#863853] hover:bg-[#f8e9ee]"
                  >
                    <Edit3 size={16} />
                    <span>Mettre à jour mon centre (Soignant)</span>
                  </button>
                </div>
              </nav>

              {/* Bas de sidebar : Numéro d'écoute & réassurance */}
              <div className="mt-auto rounded-2xl bg-[#76445d] p-4 text-white">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Phone size={15} /> Ligne d'écoute gratuite
                </div>
                <p className="mt-1 text-sm font-extrabold tracking-wide">80 00 11 22</p>
                <p className="mt-1 text-[10px] text-white/70">Anonyme & confidentiel au Burkina Faso</p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* HEADER APPLICATION AVEC BOUTON BURGER & DÉTAILS                     */}
        {/* ==================================================================== */}
        <header className="z-20 flex shrink-0 items-center justify-between border-b border-[#f0dee2] bg-[#fffaf9]/95 px-4 py-2 backdrop-blur">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Ouvrir le menu latéral"
              className="grid h-10 w-10 place-items-center rounded-2xl border border-[#f2e1e6] bg-white text-[#633b4e] transition hover:bg-[#fceef2] hover:text-[#9e3b5e]"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => { setSection("Accueil"); setSelectedCenter(null); }}
              className="flex items-center gap-2 text-left"
            >
              <img
                src="/images/pinkhub-mvp-paglaafi.png"
                alt="Logo PagLaafi"
                className="h-10 w-10 object-contain mix-blend-multiply"
              />
              <span className="ph-display text-lg font-bold tracking-tight text-[#472738]">
                PagLaafi
              </span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setSection("Centres");
                setViewMode("map");
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 shadow-sm"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 ph-pulse" />
              <span>Carte en direct</span>
            </button>
            <button
              onClick={() => notify("PagLaafi vous oriente vers des centres de santé vérifiés au Burkina Faso.")}
              aria-label="Informations"
              className="grid h-9 w-9 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
            >
              <CircleHelp size={19} />
            </button>
          </div>
        </header>

        {/* ==================================================================== */}
        {/* CONTENU PRINCIPAL DES ONGLETS                                        */}
        {/* ==================================================================== */}
        <div className="ph-scroll flex-1 overflow-y-auto pb-6">

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 1 : ACCUEIL                                                 */}
          {/* ------------------------------------------------------------------ */}
          {section === "Accueil" && !selectedCenter && (
            <section className="ph-enter">
              {/* Grand Bandeau Hero Rose */}
              <div className="relative overflow-hidden bg-[#f9e9ed] px-5 pb-6 pt-6">
                <div className="pointer-events-none absolute -right-6 -top-8 h-44 w-44 rounded-full border-[20px] border-[#f0d0db] opacity-60" />
                <div className="pointer-events-none absolute right-6 top-16 h-16 w-16 rounded-full border border-[#e4aebd]" />

                <div className="relative flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-[#a44666] shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d65f84]" /> Dépistage au Burkina Faso
                  </span>
                  <span className="text-[11px] font-semibold text-[#8e6174]">Octobre Rose & toute l'année</span>
                </div>

                <h1 className="ph-display relative mt-4 text-[36px] leading-[1.02] tracking-[-.025em] text-[#452637]">
                  Une question ?<br />
                  <span className="text-[#b94e70]">Vous n'êtes pas seule.</span>
                </h1>

                <p className="relative mt-3 text-[14px] leading-[1.6] text-[#745866]">
                  Avant de vous déplacer, sachez où l'appareil fonctionne aujourd'hui, combien ça coûte et l'attente sur place.
                </p>

                <div className="relative mt-5 flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => {
                      setSection("Centres");
                      setViewMode("map");
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-[#a14364] px-5 py-3 text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(161,67,100,.25)] transition hover:bg-[#8f3956]"
                  >
                    <MapPin size={16} /> Voir la carte en direct
                  </button>
                  <button
                    onClick={() => {
                      setSection("Comprendre");
                      handlePlayAudio(lessons[0].fullText, "fr");
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-[#dfb3c1] bg-white px-4 py-3 text-[13px] font-bold text-[#8c3e59] shadow-sm hover:bg-[#fbf4f6]"
                  >
                    <Play size={15} fill="currentColor" /> Écouter l'explication
                  </button>
                </div>
              </div>

              {/* Raccourci "Aller à deux : L'Accompagnant" */}
              <div className="px-5 pt-5">
                <div
                  onClick={() => setSection("Accompagnant")}
                  className="cursor-pointer rounded-[24px] border-2 border-[#e8bcc9] bg-gradient-to-br from-[#fff6f8] to-[#fbf0f4] p-4 shadow-sm transition hover:border-[#cf7794]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#a14364] text-white shadow-md">
                        <UserPlus size={22} />
                      </span>
                      <div>
                        <span className="rounded-full bg-[#a14364]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#a14364]">
                          Aller à deux
                        </span>
                        <h3 className="ph-display mt-0.5 text-[18px] leading-tight text-[#472738]">
                          Inviter mon accompagnant
                        </h3>
                      </div>
                    </div>
                    <ChevronRight size={20} className="mt-2 text-[#a14364]" />
                  </div>
                  <p className="mt-2.5 text-xs leading-5 text-[#735764]">
                    Faire son dépistage est bien plus rassurant à deux (sœur, amie, voisin, conjoint). Choisissez le centre ensemble et recevez un rappel.
                  </p>
                </div>
              </div>

              {/* Grille des 3 actions prioritaires */}
              <div className="px-5 pt-5">
                <div className="mb-3 flex items-end justify-between">
                  <h2 className="ph-display text-[22px] leading-tight text-[#482839]">Par où commencer ?</h2>
                  <span className="text-[11px] font-medium text-[#9a7686]">Guides rapides</span>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => { setSection("Centres"); setViewMode("map"); }}
                    className="flex w-full items-center gap-3 rounded-[20px] border border-[#f0dfe4] bg-white p-3.5 text-left transition hover:border-[#dfa3b5] hover:shadow-sm"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#f8e8ec] text-[#a44666]">
                      <MapPin size={21} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-[#4c2d3c]">Carte vivante des centres</span>
                      <span className="mt-0.5 block text-xs text-[#8c737f]">Disponibilité des appareils, prix et affluence</span>
                    </span>
                    <ChevronRight size={18} className="text-[#a87487]" />
                  </button>

                  <button
                    onClick={() => setSection("Comprendre")}
                    className="flex w-full items-center gap-3 rounded-[20px] border border-[#f0dfe4] bg-white p-3.5 text-left transition hover:border-[#dfa3b5] hover:shadow-sm"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#f5edf7] text-[#845089]">
                      <Headphones size={21} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-[#4c2d3c]">Guide audio en français & mooré</span>
                      <span className="mt-0.5 block text-xs text-[#8c737f]">Écouter les repères médicaux sans jargon</span>
                    </span>
                    <ChevronRight size={18} className="text-[#a87487]" />
                  </button>

                  <button
                    onClick={() => setSection("Soutien")}
                    className="flex w-full items-center gap-3 rounded-[20px] border border-[#f0dfe4] bg-white p-3.5 text-left transition hover:border-[#dfa3b5] hover:shadow-sm"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#eff6fb] text-[#42799c]">
                      <HeartHandshake size={21} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-[#4c2d3c]">Soutien et numéros d'écoute</span>
                      <span className="mt-0.5 block text-xs text-[#8c737f]">Permanence téléphonique et conseils de confiance</span>
                    </span>
                    <ChevronRight size={18} className="text-[#a87487]" />
                  </button>
                </div>
              </div>

              {/* Bloc Campagnes & Confiance */}
              <div className="mx-5 mt-5 rounded-2xl border border-[#eedde2] bg-[#fffcfb] p-4 text-[#7d6571]">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#a44666]" />
                  <div className="text-[11px] leading-[1.6]">
                    <strong className="text-[#563143]">Espace sécurisé & transparent :</strong> Les informations de disponibilité sont actualisées chaque matin par les équipes soignantes. Vos démarches restent strictement confidentielles.
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 2 : CARTE VIVANTE DES CENTRES DE SANTÉ                       */}
          {/* ------------------------------------------------------------------ */}
          {section === "Centres" && (
            <section className="ph-enter px-5 pt-4">
              {/* Entête avec switch Vue Carte / Vue Liste */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
                    Temps réel · Burkina Faso
                  </span>
                  <h1 className="ph-display text-[28px] leading-tight text-[#452637]">
                    Carte vivante des soins
                  </h1>
                </div>
                <div className="flex rounded-2xl border border-[#ebd8de] bg-[#f8e9ed] p-1">
                  <button
                    onClick={() => setViewMode("map")}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${viewMode === "map" ? "bg-white text-[#963c5d] shadow-sm" : "text-[#835e6e]"}`}
                  >
                    Carte
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${viewMode === "list" ? "bg-white text-[#963c5d] shadow-sm" : "text-[#835e6e]"}`}
                  >
                    Liste ({filteredCenters.length})
                  </button>
                </div>
              </div>

              <p className="mt-1 text-xs leading-5 text-[#7c6370]">
                Vérifiez avant de partir : appareil en marche, examens, prix réels et attente en direct.
              </p>

              {/* Barre de recherche avec filtre texte fonctionnel */}
              <div className="mt-3 relative">
                <Search size={17} className="absolute left-3.5 top-3.5 text-[#9f7183]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par centre, ville, examen..."
                  className="w-full rounded-2xl border border-[#ebd8de] bg-white py-2.5 pl-10 pr-9 text-xs text-[#4b2f3e] placeholder:text-[#ab919c] focus:border-[#a14364] focus:outline-none focus:ring-1 focus:ring-[#a14364]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3 text-[#9f7183] hover:text-[#5f3347]"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Filtres rapides cliquables (Villes & Statuts) */}
              <div className="ph-scroll mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <button
                  onClick={() => { setStatusFilter("all"); setCityFilter("all"); }}
                  className={`shrink-0 rounded-full px-3 py-1 font-bold transition ${statusFilter === "all" && cityFilter === "all" ? "bg-[#a14364] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  Tous ({centers.length})
                </button>
                <button
                  onClick={() => setStatusFilter(statusFilter === "available" ? "all" : "available")}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-bold transition ${statusFilter === "available" ? "bg-emerald-600 text-white" : "border border-emerald-300 bg-emerald-50 text-emerald-800"}`}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Dispo de suite
                </button>
                <button
                  onClick={() => setStatusFilter(statusFilter === "free" ? "all" : "free")}
                  className={`shrink-0 rounded-full px-3 py-1 font-bold transition ${statusFilter === "free" ? "bg-[#a14364] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  0 FCFA (Gratuit)
                </button>
                <button
                  onClick={() => setCityFilter(cityFilter === "Ouagadougou" ? "all" : "Ouagadougou")}
                  className={`shrink-0 rounded-full px-3 py-1 font-bold transition ${cityFilter === "Ouagadougou" ? "bg-[#a14364] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  Ouagadougou
                </button>
                <button
                  onClick={() => setCityFilter(cityFilter === "Bobo-Dioulasso" ? "all" : "Bobo-Dioulasso")}
                  className={`shrink-0 rounded-full px-3 py-1 font-bold transition ${cityFilter === "Bobo-Dioulasso" ? "bg-[#a14364] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  Bobo-Dioulasso
                </button>
                <button
                  onClick={() => setCityFilter(cityFilter === "Koudougou" ? "all" : "Koudougou")}
                  className={`shrink-0 rounded-full px-3 py-1 font-bold transition ${cityFilter === "Koudougou" ? "bg-[#a14364] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  Koudougou
                </button>
              </div>

              {/* Légende des 4 codes couleurs vivants */}
              <div className="mt-2.5 grid grid-cols-2 gap-1.5 rounded-2xl bg-[#faedf1] p-2 text-[10px] text-[#71505f]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span><strong>Vert :</strong> Dispo & attente fluide</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span><strong>Orange :</strong> Forte affluence</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  <span><strong>Rouge :</strong> En maintenance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                  <span><strong>Gris :</strong> Pas de MAJ du matin</span>
                </div>
              </div>

              {/* VUE 1 : LA CARTE INTERACTIVE (Burkina Faso SVG & Points Vivants) */}
              {viewMode === "map" && (
                <div className="mt-3">
                  <div className="relative h-[270px] w-full overflow-hidden rounded-[26px] border border-[#e5d0d8] bg-gradient-to-b from-[#fdf7f9] to-[#f4e4ea] p-3 shadow-inner">
                    {/* Carte SVG stylisée du Burkina Faso */}
                    <svg
                      viewBox="0 0 100 80"
                      className="absolute inset-0 h-full w-full opacity-40"
                      preserveAspectRatio="none"
                    >
                      <polygon
                        points="15,40 25,20 45,15 70,12 85,25 90,45 80,68 60,75 35,72 20,65 10,50"
                        fill="#ecd3dc"
                        stroke="#dfb6c4"
                        strokeWidth="1.2"
                      />
                      {/* Villes repères */}
                      <text x="50" y="44" fontSize="3.5" fill="#a46d81" fontWeight="bold">Ouagadougou</text>
                      <text x="24" y="62" fontSize="3.2" fill="#a46d81">Bobo</text>
                      <text x="36" y="46" fontSize="3" fill="#a46d81">Koudougou</text>
                    </svg>

                    {/* Épingles interactives vivantes sur la carte */}
                    {filteredCenters.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCenter(c)}
                        style={{ left: `${c.coordinates.x}%`, top: `${c.coordinates.y}%` }}
                        className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                      >
                        {/* Halo d'animation pulsant */}
                        <span
                          className={`absolute -inset-2 rounded-full opacity-60 ${c.status === "available" ? "bg-emerald-400 ph-pulse" : c.status === "busy" ? "bg-amber-400 ph-pulse" : c.status === "maintenance" ? "bg-rose-400" : "bg-slate-300"}`}
                        />
                        {/* Point d'épingle central */}
                        <span
                          className={`relative flex h-7 w-7 items-center justify-center rounded-full text-white shadow-md transition-transform group-hover:scale-125 ${c.statusColor}`}
                        >
                          <Activity size={14} />
                        </span>
                        {/* Bulle d'info miniature */}
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#422333]/90 px-1.5 py-0.5 text-[9px] font-bold text-white shadow">
                          {c.shortName} · {c.queueCount} attente
                        </span>
                      </button>
                    ))}

                    <div className="absolute bottom-2 left-3 rounded-lg bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-[#7c5666] backdrop-blur">
                      Touchez un point pour voir la fiche en direct
                    </div>
                  </div>
                </div>
              )}

              {/* VUE 2 / LISTE DES CENTRES FILTRÉS */}
              <div className="mt-3 space-y-2.5">
                {filteredCenters.map((center) => (
                  <div
                    key={center.id}
                    className="rounded-[22px] border border-[#efdfe4] bg-white p-4 shadow-sm transition hover:border-[#dea0b2]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${center.statusColor}`} />
                          <span className="text-[11px] font-bold text-[#8f4a64]">{center.statusLabel}</span>
                        </div>
                        <h3 className="ph-display mt-1 text-[16px] font-bold leading-snug text-[#482839]">
                          {center.name}
                        </h3>
                        <p className="text-xs text-[#846b77]">{center.place}</p>
                      </div>
                      <button
                        onClick={() => setSelectedCenter(center)}
                        className="rounded-xl bg-[#faedf1] p-2 text-[#a14364] hover:bg-[#f6dbe3]"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    {/* Ligne d'état clé : Appareil & Agents */}
                    <div className="mt-3 rounded-xl bg-[#fbf6f7] p-2.5 text-xs text-[#6e515e]">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="flex items-center gap-1.5">
                          <Stethoscope size={14} className="text-[#a14364]" />
                          {center.isApparatusWorking ? "Mammographe dispo" : "Appareil indisponible"}
                        </span>
                        <span className="flex items-center gap-1 text-[#8f4a64]">
                          <Clock size={13} /> {center.estimatedWait}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-[#866a78]">
                        <span>{center.agentsPresent} agents en poste ({center.queueCount} en file)</span>
                        <span className="font-bold text-emerald-700">Palpation : 0 FCFA</span>
                      </div>
                    </div>

                    {/* Actions directes rapides */}
                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#f4e4e9] pt-2.5">
                      <button
                        onClick={() => handlePlayAudio(center.audioMessageMoore, "moore")}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#e4bfcd] bg-white px-2.5 py-1 text-[11px] font-bold text-[#92405d] hover:bg-[#fef7f9]"
                      >
                        <Volume2 size={13} /> Message Mooré
                      </button>

                      <button
                        onClick={() => handleConfirmCenterVisit(center.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#664654] hover:text-[#92405d]"
                      >
                        <UserCheck size={13} className="text-emerald-600" />
                        <span>{center.confirmedVisitsToday} ont confirmé</span>
                      </button>

                      <button
                        onClick={() => setSelectedCenter(center)}
                        className="rounded-full bg-[#a14364] px-3 py-1 text-[11px] font-bold text-white hover:bg-[#893450]"
                      >
                        Détails & Tarifs
                      </button>
                    </div>
                  </div>
                ))}

                {filteredCenters.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-[#dfb3c1] p-6 text-center">
                    <Search size={24} className="mx-auto text-[#b07b8f]" />
                    <p className="mt-2 text-sm font-bold text-[#563143]">Aucun centre ne correspond</p>
                    <p className="text-xs text-[#8c6f7d]">Essayez de modifier vos filtres ou d'élargir la recherche.</p>
                    <button
                      onClick={() => { setSearchQuery(""); setStatusFilter("all"); setCityFilter("all"); }}
                      className="mt-3 rounded-full bg-[#a14364] px-4 py-1.5 text-xs font-bold text-white"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* FICHE DÉTAILLÉE D'UN CENTRE DE SANTÉ (MODAL / OVERLAY)             */}
          {/* ------------------------------------------------------------------ */}
          {selectedCenter && (
            <section className="ph-enter px-5 pt-4">
              <button
                onClick={() => setSelectedCenter(null)}
                className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#a14364] hover:underline"
              >
                <ArrowLeft size={16} /> Retour à la carte des centres
              </button>

              <div className="rounded-[26px] bg-[#f8e7ec] p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold text-white ${selectedCenter.statusColor}`}>
                    <Activity size={12} /> {selectedCenter.statusLabel}
                  </span>
                  <span className="text-[10px] font-semibold text-[#8a5d70]">
                    {selectedCenter.city}
                  </span>
                </div>

                <h1 className="ph-display mt-3 text-[24px] font-bold leading-tight text-[#472738]">
                  {selectedCenter.name}
                </h1>
                <p className="mt-1 text-xs text-[#805e6f]">{selectedCenter.address}</p>

                {/* État des appareils et de l'équipe */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-white/90 p-2.5 shadow-sm">
                    <p className="text-[10px] font-bold uppercase text-[#9f697d]">Disponibilité équipement</p>
                    <p className="mt-1 font-bold text-[#452737]">{selectedCenter.apparatus}</p>
                  </div>
                  <div className="rounded-xl bg-white/90 p-2.5 shadow-sm">
                    <p className="text-[10px] font-bold uppercase text-[#9f697d]">Personnel présent</p>
                    <p className="mt-1 font-bold text-[#452737]">{selectedCenter.agentsPresent} agents en poste</p>
                    <p className="text-[10px] text-[#7d606e]">{selectedCenter.staffDescription}</p>
                  </div>
                </div>

                {/* File d'attente estimée */}
                <div className="mt-2.5 flex items-center justify-between rounded-xl bg-white/90 p-2.5 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#9f697d]">Attente actuelle</span>
                    <p className="font-bold text-[#452737]">{selectedCenter.queueCount} personnes dans la file</p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-[#faedf1] px-2 py-0.5 text-[11px] font-extrabold text-[#963756]">
                      {selectedCenter.estimatedWait}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages Vocaux du centre (Mooré & Français) */}
              <div className="mt-4 rounded-2xl border border-[#ebd6dc] bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#4a2b3b]">
                    <Volume2 size={16} className="text-[#a14364]" /> Message audio du centre
                  </span>
                  <span className="text-[10px] text-[#8e6e7c]">Par le personnel soignant</span>
                </div>
                <p className="mt-2 text-xs italic text-[#725462]">
                  « {selectedCenter.audioMessageFr} »
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => handlePlayAudio(selectedCenter.audioMessageFr, "fr")}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#a14364] py-2 text-xs font-bold text-white hover:bg-[#8a3350]"
                  >
                    <Play size={14} fill="currentColor" /> Écouter en Français
                  </button>
                  <button
                    onClick={() => handlePlayAudio(selectedCenter.audioMessageMoore, "moore")}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#e2bac8] bg-[#fdf5f7] py-2 text-xs font-bold text-[#8a3350] hover:bg-[#f9e7ec]"
                  >
                    <AudioLines size={14} /> Écouter en Mooré
                  </button>
                </div>
              </div>

              {/* Grille des examens et tarifs en FCFA */}
              <div className="mt-4 rounded-2xl border border-[#ebd6dc] bg-white p-4">
                <h3 className="ph-display text-base font-bold text-[#452737]">
                  Examens pratiqués & Tarifs
                </h3>
                <p className="text-[11px] text-[#8b6e7d]">
                  Tarifs officiels appliqués au Burkina Faso. Aucune surprise sur place.
                </p>

                <div className="mt-3 divide-y divide-[#f5e6eb]">
                  {selectedCenter.exams.map((exam, i) => (
                    <div key={i} className="flex items-center justify-between py-2 text-xs">
                      <div>
                        <p className="font-semibold text-[#482838]">{exam.name}</p>
                        {exam.notes && <p className="text-[10px] text-[#907280]">{exam.notes}</p>}
                      </div>
                      <div className="text-right">
                        {exam.free ? (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-800">
                            GRATUIT (0 FCFA)
                          </span>
                        ) : (
                          <span className="font-bold text-[#a14364]">
                            {exam.price.toLocaleString("fr-FR")} FCFA
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bouton de confirmation communautaire */}
              <div className="mt-4 rounded-2xl bg-[#f9e9ee] p-4 text-center">
                <p className="text-xs font-semibold text-[#705260]">
                  Avez-vous visité ce centre aujourd'hui ?
                </p>
                <button
                  onClick={() => handleConfirmCenterVisit(selectedCenter.id)}
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-emerald-800 shadow-sm border border-emerald-300 hover:bg-emerald-50"
                >
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  J'y suis allée, ça s'est bien passé ({selectedCenter.confirmedVisitsToday})
                </button>
              </div>

              {/* Bouton pour inviter son accompagnant vers ce centre */}
              <div className="mt-4">
                <button
                  onClick={() => {
                    setCompanionCenterId(selectedCenter.id);
                    setSection("Accompagnant");
                  }}
                  className="flex w-full items-center justify-between rounded-2xl bg-[#a14364] px-4 py-3.5 text-left text-white shadow-md hover:bg-[#8a3350]"
                >
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-white/80">
                      Aller à deux dans ce centre
                    </span>
                    <span className="block text-sm font-bold">
                      Inviter mon accompagnant(e) à Schiphra
                    </span>
                  </div>
                  <UserPlus size={20} />
                </button>
              </div>

              {/* Date de dernière vérification */}
              <p className="mt-4 text-center text-[10px] text-[#997787]">
                Dernière confirmation : {selectedCenter.lastUpdate}
              </p>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 3 : COMPRENDRE & AUDIO (LECTEUR VOCAL RÉEL)                 */}
          {/* ------------------------------------------------------------------ */}
          {section === "Comprendre" && !selectedCenter && (
            <section className="ph-enter px-5 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
                Guide vocal & écrit
              </span>
              <h1 className="ph-display text-[30px] leading-tight text-[#452637]">
                Comprendre, à votre rythme
              </h1>
              <p className="mt-1 text-xs leading-5 text-[#795f6d]">
                Écoutez ou lisez des repères simples, validés par des soignants, sans mots compliqués.
              </p>

              {/* Lecteur Audio Interactif Principal */}
              <div className="mt-4 overflow-hidden rounded-[26px] bg-[#734059] p-5 text-white shadow-md">
                <div className="flex items-center justify-between text-[11px] text-white/75">
                  <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider">
                    <Headphones size={15} /> Lecteur Audio PagLaafi
                  </span>
                  <div className="flex rounded-full bg-white/15 p-0.5 text-[10px]">
                    <button
                      onClick={() => setSpeechLanguage("fr")}
                      className={`rounded-full px-2 py-0.5 font-bold transition ${speechLanguage === "fr" ? "bg-white text-[#734059]" : "text-white/80"}`}
                    >
                      Français
                    </button>
                    <button
                      onClick={() => setSpeechLanguage("moore")}
                      className={`rounded-full px-2 py-0.5 font-bold transition ${speechLanguage === "moore" ? "bg-white text-[#734059]" : "text-white/80"}`}
                    >
                      Mooré
                    </button>
                  </div>
                </div>

                <h2 className="ph-display mt-3 text-[22px] leading-snug">
                  {lessons[activeLesson].title}
                </h2>
                <p className="mt-1.5 text-xs text-white/80 leading-relaxed">
                  {speechLanguage === "moore"
                    ? lessons[activeLesson].mooreSummary
                    : lessons[activeLesson].summary}
                </p>

                {/* Barre de progression & Contrôles */}
                <div className="mt-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-[#f6c2d1] transition-all duration-300"
                      style={{ width: `${audioProgress}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[10px] text-white/70">
                    <span>{isPlaying ? "Lecture vocale en cours..." : "Prêt à écouter"}</span>
                    <span>{lessons[activeLesson].duration}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3">
                  <button
                    onClick={() => {
                      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                      setIsPlaying(false);
                      setAudioProgress(0);
                    }}
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                    title="Arrêter"
                  >
                    <RotateCcw size={17} />
                  </button>

                  <button
                    onClick={() =>
                      handlePlayAudio(
                        speechLanguage === "moore"
                          ? lessons[activeLesson].mooreSummary
                          : lessons[activeLesson].fullText,
                        speechLanguage,
                      )
                    }
                    className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-[#734059] shadow-lg transition hover:scale-105"
                  >
                    {isPlaying ? (
                      <>
                        <Pause size={17} fill="currentColor" /> Mettre en pause
                      </>
                    ) : (
                      <>
                        <Play size={17} fill="currentColor" /> Écouter le texte
                      </>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      notify(
                        speechLanguage === "fr"
                          ? "Langue : Français de référence."
                          : "Langue : Mooré (Gomde de sensibilisation).",
                      )
                    }
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  >
                    <Volume2 size={17} />
                  </button>
                </div>
              </div>

              {/* Texte intégral à lire */}
              <div className="mt-4 rounded-2xl border border-[#eedde2] bg-white p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#a14364]">
                  Texte complet de la fiche
                </span>
                <p className="mt-2 text-xs leading-[1.7] text-[#5b3c4c]">
                  {lessons[activeLesson].fullText}
                </p>
              </div>

              {/* Liste des autres leçons */}
              <div className="mt-5">
                <h3 className="ph-display text-base font-bold text-[#452737]">
                  Toutes les explications
                </h3>
                <div className="mt-2.5 space-y-2">
                  {lessons.map((lesson, idx) => (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setActiveLesson(idx);
                        if (isPlaying) {
                          handlePlayAudio(
                            speechLanguage === "moore" ? lesson.mooreSummary : lesson.fullText,
                            speechLanguage,
                          );
                        }
                      }}
                      className={`flex w-full items-center gap-3 rounded-[20px] border p-3.5 text-left transition ${activeLesson === idx ? "border-[#cf869f] bg-[#fbf0f4]" : "border-[#f0dfe4] bg-white hover:border-[#dea0b2]"}`}
                    >
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${activeLesson === idx ? "bg-[#a14364] text-white" : "bg-[#f9e9ed] text-[#a14364]"}`}>
                        {activeLesson === idx && isPlaying ? <AudioLines size={18} /> : <BookOpen size={18} />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs font-bold text-[#4c2d3c]">{lesson.title}</span>
                        <span className="text-[10px] text-[#8e6e7c]">{lesson.category} · {lesson.duration}</span>
                      </div>
                      <ChevronRight size={16} className="text-[#a87487]" />
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 4 : L'ACCOMPAGNANT (ALLER À DEUX)                           */}
          {/* ------------------------------------------------------------------ */}
          {section === "Accompagnant" && !selectedCenter && (
            <section className="ph-enter px-5 pt-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f9e8ed] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
                <HeartHandshake size={14} /> Aller faire son dépistage à deux
              </span>
              <h1 className="ph-display mt-1 text-[30px] leading-tight text-[#452637]">
                L'Accompagnant
              </h1>
              <p className="mt-1 text-xs leading-5 text-[#795f6d]">
                Aller faire son dépistage, c'est plus facile à deux. Invitez une sœur, une amie, une voisine ou votre conjoint à y aller avec vous.
              </p>

              {/* Formulaire d'invitation d'accompagnant */}
              <div className="mt-4 rounded-[26px] border border-[#ebd6dc] bg-white p-5 shadow-sm">
                <h2 className="ph-display text-lg font-bold text-[#452737]">
                  Inviter mon accompagnant(e)
                </h2>
                <p className="text-[11px] text-[#8a6c7b]">
                  L'invité(e) n'a rien à installer. Elle reçoit un lien clair par WhatsApp ou SMS.
                </p>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5c3c4b]">Prénom de l'accompagnant(e)</label>
                    <input
                      type="text"
                      value={companionName}
                      onChange={(e) => setCompanionName(e.target.value)}
                      placeholder="Ex: Fatim, Aïcha, Moussa..."
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2.5 text-xs text-[#4c2e3d] focus:border-[#a14364] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#5c3c4b]">Lien de parenté / Proximité</label>
                      <select
                        value={companionRelation}
                        onChange={(e) => setCompanionRelation(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#e4cfd6] bg-white p-2.5 text-xs text-[#4c2e3d] focus:border-[#a14364] focus:outline-none"
                      >
                        <option>Ma sœur</option>
                        <option>Une amie</option>
                        <option>Une voisine</option>
                        <option>Mon mari / conjoint</option>
                        <option>Ma mère</option>
                        <option>Autre proche</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#5c3c4b]">Numéro (WhatsApp/SMS)</label>
                      <input
                        type="tel"
                        value={companionPhone}
                        onChange={(e) => setCompanionPhone(e.target.value)}
                        placeholder="Ex: 70 12 34 56"
                        className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2.5 text-xs text-[#4c2e3d] focus:border-[#a14364] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5c3c4b]">Centre de santé choisi ensemble</label>
                    <select
                      value={companionCenterId}
                      onChange={(e) => setCompanionCenterId(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] bg-white p-2.5 text-xs text-[#4c2e3d] focus:border-[#a14364] focus:outline-none"
                    >
                      {centers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.shortName} ({c.city}) — {c.statusLabel}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Aperçu du message qui sera envoyé */}
                <div className="mt-4 rounded-xl bg-[#fbf3f5] p-3 text-xs text-[#6e505f] border border-[#f0dce3]">
                  <p className="text-[10px] font-bold uppercase text-[#a14364]">Aperçu de l'invitation :</p>
                  <p className="mt-1 italic">« {generateInvitationText()} »</p>
                </div>

                {/* Boutons d'envoi WhatsApp et SMS */}
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={handleSendWhatsApp}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                  >
                    <MessageCircle size={17} /> Envoyer l'invitation par WhatsApp
                  </button>

                  <button
                    onClick={handleSendSMS}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#dfb3c1] bg-white py-2.5 text-xs font-bold text-[#8c3e59] hover:bg-[#faf0f3]"
                  >
                    <Share2 size={15} /> Envoyer par SMS classique
                  </button>
                </div>

                {/* Option vocale en mooré pour les personnes ne sachant pas lire */}
                <div className="mt-3 text-center border-t border-[#f2e1e6] pt-3">
                  <button
                    onClick={() =>
                      handlePlayAudio(
                        `Ne y beogo ${companionName || "baaba"}, Aminata tɩkda fo tɩ y kẽng a yiibu n ges y laafi. Bũmb baa a yembre pa be ye. Wa-y tɩ d kẽng laafi zĩiga.`,
                        "moore",
                      )
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#963756] hover:underline"
                  >
                    <Volume2 size={15} /> Écouter le message vocal en Mooré (pour les proches qui ne lisent pas)
                  </button>
                </div>
              </div>

              {/* Fiche de suivi du binôme actif */}
              <div className="mt-5 rounded-[26px] bg-[#f9e9ee] p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#a14364]">
                    Suivi du rendez-vous à deux
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#865366]">
                    Binôme actif
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#a14364] text-white">
                    <UsersRound size={22} />
                  </span>
                  <div>
                    <h3 className="ph-display text-base font-bold text-[#452737]">
                      Aminata & {companionName || "Fatim"}
                    </h3>
                    <p className="text-xs text-[#7e5e6e]">
                      Rendez-vous prévu le {companionDate}
                    </p>
                  </div>
                </div>

                {/* Rappels configurés */}
                <div className="mt-3 space-y-1.5 text-xs text-[#6e4e5e]">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600" />
                    <span>Rappel automatique la veille (18h) par SMS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600" />
                    <span>Rappel le matin même (7h) avec point météo/attente</span>
                  </div>
                </div>

                {/* Confirmation "J'y suis allée" */}
                <div className="mt-4 rounded-2xl bg-white p-3.5 text-center">
                  <p className="text-xs font-bold text-[#4c2d3c]">
                    Avez-vous effectué votre visite ?
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setHasConfirmedVisit(!hasConfirmedVisit);
                        notify(
                          !hasConfirmedVisit
                            ? "Bravo ! Votre confirmation a été transmise à votre accompagnant(e)."
                            : "Statut réinitialisé.",
                        );
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition ${hasConfirmedVisit ? "bg-emerald-600 text-white" : "border border-emerald-400 bg-emerald-50 text-emerald-800"}`}
                    >
                      <CheckCircle2 size={16} />
                      {hasConfirmedVisit ? "Moi : J'y suis allée ✓" : "Confirmer : J'y suis allée"}
                    </button>

                    <button
                      onClick={() => {
                        setCompanionConfirmedVisit(!companionConfirmedVisit);
                        notify(
                          !companionConfirmedVisit
                            ? "Votre accompagnant a également confirmé sa visite !"
                            : "Statut réinitialisé.",
                        );
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition ${companionConfirmedVisit ? "bg-emerald-600 text-white" : "border border-emerald-400 bg-emerald-50 text-emerald-800"}`}
                    >
                      <CheckCircle2 size={16} />
                      {companionConfirmedVisit ? "Accompagnant : Présent ✓" : "Accompagnant : J'y suis allée"}
                    </button>
                  </div>

                  <p className="mt-2.5 text-[10px] leading-4 text-[#8a6f7c]">
                    🔒 <strong>Règle stricte de confidentialité :</strong> Seule la confirmation de la visite est partagée avec votre accompagnant. Les résultats médicaux restent strictement confidentiels entre vous et votre médecin.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 5 : SOUTIEN ET NUMÉROS D'ÉCOUTE                              */}
          {/* ------------------------------------------------------------------ */}
          {section === "Soutien" && !selectedCenter && (
            <section className="ph-enter px-5 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
                Entraide & écoute
              </span>
              <h1 className="ph-display text-[30px] leading-tight text-[#452637]">
                À plusieurs, c'est moins lourd.
              </h1>
              <p className="mt-1 text-xs leading-5 text-[#795f6d]">
                Que vous soyez concernée ou proche, il existe des personnes formées pour vous écouter avec douceur.
              </p>

              {/* Ligne d'urgence nationale */}
              <div className="mt-4 overflow-hidden rounded-[26px] bg-[#734059] p-5 text-white shadow-md">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/80">
                  <Phone size={14} /> Numéro vert national
                </span>
                <h2 className="ph-display mt-2 text-[26px] font-bold">80 00 11 22</h2>
                <p className="mt-1 text-xs text-white/80">
                  Appel gratuit depuis Moov, Orange et Telecel au Burkina Faso. Des psychologues et sages-femmes vous répondent 7j/7.
                </p>
                <button
                  onClick={() => notify("Numéro d'urgence : 80 00 11 22 (gratuit)")}
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#734059] shadow-sm hover:bg-white/90"
                >
                  <Phone size={14} /> Appeler maintenant
                </button>
              </div>

              {/* Idées d'accompagnement quotidien */}
              <div className="mt-5">
                <h3 className="ph-display text-base font-bold text-[#452737]">
                  Actions simples pour aujourd'hui
                </h3>
                <div className="mt-2.5 space-y-2.5">
                  <div className="flex items-start gap-3 rounded-[20px] border border-[#f0dfe4] bg-white p-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#f9edf1] text-[#a14364]">
                      <Heart size={18} />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#4c2d3c]">Parler à une personne de confiance</p>
                      <p className="text-[11px] text-[#866a78]">
                        Choisissez une proche avec qui vous vous sentez libre d'exprimer vos doutes sans jugement.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-[20px] border border-[#f0dfe4] bg-white p-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#f4edf8] text-[#814e8c]">
                      <Calendar size={18} />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#4c2d3c]">Fixer une date avec son accompagnant</p>
                      <p className="text-[11px] text-[#866a78]">
                        Utilisez l'onglet L'Accompagnant pour choisir un samedi matin et y aller ensemble.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-[20px] border border-[#f0dfe4] bg-white p-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#eaf4fb] text-[#3b7da4]">
                      <BookOpen size={18} />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#4c2d3c]">Préparer ses questions écrites</p>
                      <p className="text-[11px] text-[#866a78]">
                        Notez sur un papier ce que vous voulez demander à la sage-femme pour ne rien oublier.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* ==================================================================== */}
        {/* MODAL RESPONSABLE DE CENTRE (MISE À JOUR SOIGNANT)                    */}
        {/* ==================================================================== */}
        {showAgentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]">
            <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
                <div>
                  <h3 className="ph-display text-base font-bold text-[#472738]">Espace Responsable de Centre</h3>
                  <p className="text-[10px] text-[#916b7c]">{showAgentModal.shortName}</p>
                </div>
                <button
                  onClick={() => setShowAgentModal(null)}
                  className="grid h-8 w-8 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#563746]">Statut en direct de l'appareil</label>
                  <select
                    value={showAgentModal.status}
                    onChange={(e) =>
                      setShowAgentModal({
                        ...showAgentModal,
                        status: e.target.value as CenterStatus,
                        statusColor:
                          e.target.value === "available"
                            ? "bg-emerald-500"
                            : e.target.value === "busy"
                              ? "bg-amber-500"
                              : e.target.value === "maintenance"
                                ? "bg-rose-500"
                                : "bg-slate-400",
                        statusLabel:
                          e.target.value === "available"
                            ? "Disponible · Attente fluide"
                            : e.target.value === "busy"
                              ? "Forte affluence · Prévoir attente"
                              : e.target.value === "maintenance"
                                ? "Appareil en maintenance technique"
                                : "Non actualisé aujourd'hui",
                        isApparatusWorking: e.target.value !== "maintenance",
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 focus:border-[#a14364] focus:outline-none"
                  >
                    <option value="available">🟢 Vert : Disponible & Attente fluide</option>
                    <option value="busy">🟠 Orange : Forte affluence (&gt; 1h)</option>
                    <option value="maintenance">🔴 Rouge : Mammographe en maintenance</option>
                    <option value="outdated">⚪ Gris : Non mis à jour</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-[#563746]">Agents en poste</label>
                    <input
                      type="number"
                      value={showAgentModal.agentsPresent}
                      onChange={(e) =>
                        setShowAgentModal({ ...showAgentModal, agentsPresent: Number(e.target.value) })
                      }
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 focus:border-[#a14364] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#563746]">Personnes en file</label>
                    <input
                      type="number"
                      value={showAgentModal.queueCount}
                      onChange={(e) =>
                        setShowAgentModal({
                          ...showAgentModal,
                          queueCount: Number(e.target.value),
                          estimatedWait: `~${Number(e.target.value) * 3} min`,
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 focus:border-[#a14364] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#563746]">Message vocal / Message du jour</label>
                  <textarea
                    rows={2}
                    value={showAgentModal.audioMessageFr}
                    onChange={(e) =>
                      setShowAgentModal({ ...showAgentModal, audioMessageFr: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs focus:border-[#a14364] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setShowAgentModal(null)}
                  className="flex-1 rounded-xl border border-[#e5ced6] py-2.5 text-xs font-bold text-[#725261]"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleSaveCenterUpdate(showAgentModal)}
                  className="flex-1 rounded-xl bg-[#a14364] py-2.5 text-xs font-bold text-white shadow"
                >
                  Enregistrer en direct
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* BARRE DE NAVIGATION INFÉRIEURE (MOBILE BOTTOM BAR)                  */}
        {/* ==================================================================== */}
        {!selectedCenter && (
          <nav
            aria-label="Navigation principale"
            className="z-20 grid shrink-0 grid-cols-5 border-t border-[#f0dee3] bg-[#fffaf9] px-1 pb-[max(8px,env(safe-area-inset-bottom))] pt-1.5"
          >
            {[
              { label: "Accueil" as Section, icon: Heart },
              { label: "Centres" as Section, icon: MapPin },
              { label: "Comprendre" as Section, icon: BookOpen },
              { label: "Accompagnant" as Section, icon: UserPlus },
              { label: "Soutien" as Section, icon: HeartHandshake },
            ].map(({ label, icon: Icon }) => {
              const active = section === label;
              return (
                <button
                  key={label}
                  onClick={() => setSection(label)}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[50px] flex-col items-center justify-center gap-0.5 rounded-2xl transition ${active ? "text-[#a14364]" : "text-[#9d838e] hover:bg-[#fdf4f7] hover:text-[#785062]"}`}
                >
                  <span className={`grid h-7 w-8 place-items-center rounded-full transition ${active ? "bg-[#f8e3e9]" : ""}`}>
                    <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
                  </span>
                  <span className={`text-[9.5px] truncate max-w-[65px] ${active ? "font-bold text-[#a14364]" : "font-medium"}`}>
                    {label === "Accompagnant" ? "Binôme" : label}
                  </span>
                </button>
              );
            })}
          </nav>
        )}

        {/* ==================================================================== */}
        {/* TOAST BIENVEILLANT DE NOTIFICATION                                   */}
        {/* ==================================================================== */}
        {toast && (
          <div
            role="status"
            className="ph-enter absolute bottom-[82px] left-4 right-4 z-40 flex items-start gap-2.5 rounded-2xl bg-[#4d2d3e] px-4 py-3 text-xs leading-5 text-white shadow-[0_10px_30px_rgba(40,18,30,.25)]"
          >
            <Check size={16} className="mt-0.5 shrink-0 text-[#f5bed0]" />
            <span className="flex-1">{toast}</span>
          </div>
        )}
      </div>
    </main>
  );
}
