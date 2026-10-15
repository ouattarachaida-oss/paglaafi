import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  AudioLines,
  Bell,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock,
  CreditCard,
  Edit3,
  Flame,
  Gift,
  Headphones,
  Heart,
  HeartHandshake,
  Lock,
  LogOut,
  MapPin,
  Megaphone,
  Menu,
  MessageCircle,
  Mic,
  MicOff,
  Pause,
  Phone,
  Play,
  Plus,
  RotateCcw,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Tag,
  User,
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
type Section =
  | "Accueil"
  | "Centres"
  | "Comprendre"
  | "Accompagnant"
  | "Annonces"
  | "RoseIA"
  | "Soutien";

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
  statusColor: string;
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
  coordinates: { x: number; y: number };
}

interface PartnerAnnouncement {
  id: number;
  title: string;
  author: string;
  authorType: "Association" | "Partenaire Santé" | "Hôpital";
  city: string;
  date: string;
  badge: string;
  badgeColor: string;
  content: string;
  contact: string;
  likes: number;
}

interface PartnerAssociation {
  id: number;
  name: string;
  acronym: string;
  mission: string;
  city: string;
  verified: boolean;
  beneficiariesCount: string;
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
    confirmedVisitsToday: 41,
    phone: "+226 25 36 30 70",
    address: "Tanghin, Secteur 17 (ex-Secteur 30), Ouagadougou",
    lastUpdate: "Aujourd'hui à 08h30 par Mme Sawadogo (Sage-femme chef)",
    coordinates: { x: 52, y: 46 },
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
    confirmedVisitsToday: 68,
    phone: "+226 25 37 40 40",
    address: "Boulevard des Tansoba, Arrondissement 5, Ouagadougou",
    lastUpdate: "Aujourd'hui à 09h15 par Dr. Ouedraogo",
    coordinates: { x: 55, y: 48 },
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
    confirmedVisitsToday: 45,
    phone: "+226 20 97 00 44",
    address: "Avenue de la République, Bobo-Dioulasso",
    lastUpdate: "Aujourd'hui à 07h50 par Major Traoré",
    coordinates: { x: 26, y: 64 },
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
    confirmedVisitsToday: 17,
    phone: "+226 25 44 01 24",
    address: "Route de Ouagadougou, Secteur 1, Koudougou",
    lastUpdate: "Aujourd'hui à 08h00 par l'ingénieur biomédical",
    coordinates: { x: 42, y: 47 },
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
    confirmedVisitsToday: 5,
    phone: "+226 25 35 12 00",
    address: "Tampouy, Arrondissement 3, Ouagadougou",
    lastUpdate: "Hier à 16h45",
    coordinates: { x: 50, y: 43 },
  },
];

/**
 * Annonces des associations et partenaires de santé au Burkina Faso
 */
const initialAnnouncements: PartnerAnnouncement[] = [
  {
    id: 1,
    title: "Caravane Mobile : Dépistages et Échographies 100% Gratuits",
    author: "Association Burkinabè d'Action contre le Cancer (ABAC)",
    authorType: "Association",
    city: "Koudougou & Environs",
    date: "Samedi 24 et Dimanche 25 Octobre 2026",
    badge: "Gratuit (0 FCFA)",
    badgeColor: "bg-emerald-100 text-emerald-800",
    content: "L'ABAC déploie sa clinique mobile sur la place du Marché de Koudougou. Examen clinique gratuit pour toutes les femmes de 25 à 65 ans. Échographies gratuites sur place en cas de doute.",
    contact: "+226 70 20 11 22",
    likes: 134,
  },
  {
    id: 2,
    title: "Grande Causerie Éducative : Démystifier le Cancer du Sein",
    author: "Coalition Burkinabè contre le Cancer (COBUCAN)",
    authorType: "Association",
    city: "Ouagadougou (Maison de la Femme)",
    date: "Vendredi 23 Octobre à 15h00",
    badge: "Rencontre & Débat",
    badgeColor: "bg-purple-100 text-purple-800",
    content: "Venez échanger avec nos sages-femmes et des patientes guéries. Explications en français et en mooré. Rafraîchissements offerts et apprentissage des gestes d'auto-palpation.",
    contact: "+226 76 50 33 44",
    likes: 92,
  },
  {
    id: 3,
    title: "Opération Mammographies Subventionnées à 5 000 FCFA",
    author: "CMA de Schiphra & Partenaires Internationaux",
    authorType: "Hôpital",
    city: "Ouagadougou",
    date: "Du 15 au 31 Octobre 2026",
    badge: "Tarif Spécial",
    badgeColor: "bg-amber-100 text-amber-900",
    content: "Grâce au soutien des donateurs de PagLaafi et d'Orange Money, 200 mammographies sont subventionnées à 5 000 FCFA (au lieu de 12 000 FCFA) pour les femmes sans assurance.",
    contact: "+226 25 36 30 70",
    likes: 215,
  },
  {
    id: 4,
    title: "Permanence d'Écoute Psychologique & Prise en Charge à Bobo",
    author: "Association Espoir et Vie Bobo",
    authorType: "Partenaire Santé",
    city: "Bobo-Dioulasso",
    date: "Tous les mercredis et samedis",
    badge: "Soutien Moral",
    badgeColor: "bg-pink-100 text-pink-800",
    content: "Un espace confidentiel pour poser vos questions, pleurer sans honte et trouver des compagnes de route pour le traitement. Accueil avec thé et bienveillance.",
    contact: "+226 78 90 12 34",
    likes: 88,
  },
];

/**
 * Associations partenaires éligibles aux dons Orange Money
 */
const partnerAssociations: PartnerAssociation[] = [
  {
    id: 1,
    name: "Association Burkinabè d'Action contre le Cancer",
    acronym: "ABAC",
    mission: "Financement de cliniques mobiles et dépistages gratuits dans les villages et provinces.",
    city: "Ouagadougou",
    verified: true,
    beneficiariesCount: "1 450 femmes dépistées en 2026",
  },
  {
    id: 2,
    name: "Coalition Burkinabè contre le Cancer",
    acronym: "COBUCAN",
    mission: "Aide financière directe pour l'achat de médicaments et chimio pour patientes vulnérables.",
    city: "National (Burkina Faso)",
    verified: true,
    beneficiariesCount: "320 traitements pris en charge",
  },
  {
    id: 3,
    name: "Fonds de Solidarité Patientes Vulnérables — Schiphra",
    acronym: "Fonds Schiphra",
    mission: "Subvention immédiate des mammographies et biopsies pour les femmes sans revenus.",
    city: "Ouagadougou",
    verified: true,
    beneficiariesCount: "580 examens financés",
  },
  {
    id: 4,
    name: "Association Espoir & Vie Bobo",
    acronym: "Espoir & Vie",
    mission: "Hébergement solidaire et soutien psychologique des patientes venues de province.",
    city: "Bobo-Dioulasso",
    verified: true,
    beneficiariesCount: "190 femmes hébergées",
  },
];

/**
 * Leçons pédagogiques avec texte intégral pour la voix
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
 * Réponses types de l'Assistant Vocal ROSE IA
 */
const roseIaResponses: Record<string, { fr: string; moore: string }> = {
  mal: {
    fr: "Rassurez-vous, la palpation clinique faite par la sage-femme est totalement indolore et très douce. Pour la mammographie, on ressent une brève pression de quelques secondes sur le sein, qui peut être un peu désagréable mais pas douloureuse. Dites à la manipulatrice d'y aller doucement !",
    moore: "Laafi beame. Ges-m-yĩngã pa namsd ned ye. Masĩnã tõe n mii bilfu la a pa wãbd ned ye. Kasetã sõngdame tɩ b bãng laafi.",
  },
  prix: {
    fr: "Au Burkina Faso, la palpation clinique est GRATUITE (0 FCFA) dans la plupart des centres publics et durant les campagnes Octobre Rose. L'échographie coûte entre 6 000 et 7 500 FCFA, et la mammographie entre 10 000 et 12 000 FCFA (subventionnée à 5 000 FCFA avec nos associations partenaires).",
    moore: "Nus gesgã yaa zaalem (0 FCFA). Échographie yaa 6 000 n tãag 7 500 FCFA, la mammographie yaa 10 000 n tãag 12 000 FCFA.",
  },
  boule: {
    fr: "Ne paniquez surtout pas. 8 boules sur 10 au niveau du sein sont totalement bénignes (un kyste d'eau ou un nodule fibreux). Cependant, il faut impérativement la faire examiner par une sage-femme à Schiphra, Bogodogo ou Sourô Sanou pour avoir l'esprit tranquille.",
    moore: "Da zoe rabeem ye. Bõn-kʋdga wʋsg pa bãag ye. La yaa tɩlae tɩ y tɩ wilg tɩɩm dãmbã tɩ b ges n bilg y yam.",
  },
  centres: {
    fr: "Aujourd'hui, le mammographe de Schiphra à Ouagadougou et celui du CHU Sourô Sanou à Bobo sont parfaitement fonctionnels avec peu d'attente. Attention, le CHR de Koudougou est en maintenance ce jour. Consultez l'onglet 'Centres' pour la carte vivante !",
    moore: "Rũnda Schiphra ne Bobo Sourô Sanou masĩnã tʋmdame tɩ zĩigã yaa sõma. Koudougou n koms bilfu. Ges-y carte wã pʋgẽ.",
  },
  default: {
    fr: "Je suis Rose IA, votre compagne de santé bienveillante. Je suis là pour vous écouter, vous rassurer et vous orienter vers les structures du Burkina Faso. Posez-moi votre question à la voix ou à l'écrit !",
    moore: "Mam yaa Rose IA. M be n na n sõng yãmba ne laafi kaset. Sok-y maam bũmb ning fãa y sẽn rat n bãngã.",
  },
};

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

  // Authentification / Compte utilisateur
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [currentUser, setCurrentUser] = useState<{
    nom: string;
    prenom: string;
    telephone: string;
  } | null>(null);
  const [authForm, setAuthForm] = useState({
    nom: "Ouedraogo",
    prenom: "Aminata",
    telephone: "70 12 34 56",
    motDePasse: "123456",
  });

  // Centres & Carte Vivante
  const [centers, setCenters] = useState<HealthCenter[]>(initialCenters);
  const [selectedCenter, setSelectedCenter] = useState<HealthCenter | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [showAgentModal, setShowAgentModal] = useState<HealthCenter | null>(null);

  // Annonces & Événements Partenaires
  const [announcements, setAnnouncements] = useState<PartnerAnnouncement[]>(initialAnnouncements);
  const [showNewAnnouncementModal, setShowNewAnnouncementModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    author: "",
    authorType: "Association" as const,
    city: "Ouagadougou",
    date: "Samedi prochain",
    badge: "Sensibilisation",
    badgeColor: "bg-pink-100 text-pink-800",
    content: "",
    contact: "",
  });

  // Assistant Vocal ROSE IA
  const [roseMessages, setRoseMessages] = useState<
    Array<{ sender: "user" | "rose"; text: string; time: string; mooreText?: string }>
  >([
    {
      sender: "rose",
      text: "Bonjour ! Je suis Rose IA, votre assistante de santé. Une question sur le dépistage, une douleur ou un centre ? Appuyez sur le micro ou écrivez-moi.",
      mooreText: "Ne y beogo ! Mam yaa Rose IA. Sok-y maam bũmb fãa y sẽn rat n bãngã.",
      time: "Maintenant",
    },
  ]);
  const [roseInput, setRoseInput] = useState("");
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [roseSpeaking, setRoseSpeaking] = useState(false);

  // Module Don Orange Money Burkina Faso
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedAssociation, setSelectedAssociation] = useState<PartnerAssociation>(
    partnerAssociations[0],
  );
  const [donationAmount, setDonationAmount] = useState<number>(2500);
  const [customDonationAmount, setCustomDonationAmount] = useState<string>("");
  const [orangeMoneyPhone, setOrangeMoneyPhone] = useState<string>("70 12 34 56");
  const [donationStep, setDonationStep] = useState<"form" | "confirm" | "otp" | "success">("form");
  const [otpCode, setOtpCode] = useState<string>("");
  const [lastDonationId, setLastDonationId] = useState<string>("");

  // Audio & Synthèse vocale générale
  const [activeLesson, setActiveLesson] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [speechLanguage, setSpeechLanguage] = useState<"fr" | "moore">("fr");
  const audioIntervalRef = useRef<number | null>(null);

  // Module "L'Accompagnant"
  const [companionName, setCompanionName] = useState("Fatim");
  const [companionRelation, setCompanionRelation] = useState("Ma sœur");
  const [companionPhone, setCompanionPhone] = useState("76 89 01 23");
  const [companionCenterId, setCompanionCenterId] = useState<number>(1);
  const [companionDate, setCompanionDate] = useState("Samedi 24 Octobre 2026");
  const [hasInvited, setHasInvited] = useState(false);
  const [hasConfirmedVisit, setHasConfirmedVisit] = useState(false);
  const [companionConfirmedVisit, setCompanionConfirmedVisit] = useState(false);

  // Notification Toast Helper
  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 3400);
  };

  /**
   * Moteur de Synthèse Vocale (Web Speech API)
   */
  const handlePlayAudio = (textToSpeak: string, language: "fr" | "moore" = "fr") => {
    if (!("speechSynthesis" in window)) {
      notify("La synthèse vocale n'est pas supportée sur ce navigateur.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setRoseSpeaking(false);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setAudioProgress(0);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "fr-FR";
    utterance.rate = language === "moore" ? 0.88 : 0.96;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      setIsPlaying(true);
      setRoseSpeaking(true);
      setAudioProgress(5);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = window.setInterval(() => {
        setAudioProgress((prev) => (prev >= 95 ? 95 : prev + 4));
      }, 1000);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setRoseSpeaking(false);
      setAudioProgress(100);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      window.setTimeout(() => setAudioProgress(0), 1000);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setRoseSpeaking(false);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Arrêt de l'audio lors du changement de section
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [section]);

  /**
   * Gestion de la Connexion / Inscription
   */
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authForm.nom || !authForm.prenom || !authForm.telephone || !authForm.motDePasse) {
      notify("Veuillez renseigner tous les champs obligatoires.");
      return;
    }
    setCurrentUser({
      nom: authForm.nom,
      prenom: authForm.prenom,
      telephone: authForm.telephone,
    });
    setShowAuthModal(false);
    notify(`Bienvenue, ${authForm.prenom} ${authForm.nom} ! Vous êtes connectée.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    notify("Vous avez été déconnectée.");
  };

  /**
   * Filtrage des centres de santé
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
   * Interaction ROSE IA
   */
  const handleSendRoseMessage = (textOverride?: string) => {
    const textToSend = textOverride || roseInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: "user" as const,
      text: textToSend,
      time: "Maintenant",
    };
    setRoseMessages((prev) => [...prev, userMsg]);
    setRoseInput("");

    // Détection d'intention médicale bienveillante
    const lower = textToSend.toLowerCase();
    let responseKey = "default";
    if (lower.includes("mal") || lower.includes("douleur") || lower.includes("peur")) {
      responseKey = "mal";
    } else if (lower.includes("prix") || lower.includes("coût") || lower.includes("argent") || lower.includes("fcfa")) {
      responseKey = "prix";
    } else if (lower.includes("boule") || lower.includes("kyste") || lower.includes("nodule") || lower.includes("bosse")) {
      responseKey = "boule";
    } else if (lower.includes("centre") || lower.includes("où") || lower.includes("adresse") || lower.includes("ouaga") || lower.includes("bobo")) {
      responseKey = "centres";
    }

    const answer = roseIaResponses[responseKey] || roseIaResponses.default;

    window.setTimeout(() => {
      const roseMsg = {
        sender: "rose" as const,
        text: answer.fr,
        mooreText: answer.moore,
        time: "À l'instant",
      };
      setRoseMessages((prev) => [...prev, roseMsg]);
      handlePlayAudio(answer.fr, "fr");
    }, 700);
  };

  /**
   * Reconnaissance vocale (Speech-to-Text) pour Rose IA
   */
  const handleToggleVoiceRecording = () => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Simulation guidée si reconnaissance non supportée
      notify("Micro activé en simulation. Rose IA écoute votre voix...");
      setIsRecordingVoice(true);
      window.setTimeout(() => {
        setIsRecordingVoice(false);
        handleSendRoseMessage("Est-ce que la mammographie fait mal ?");
      }, 2200);
      return;
    }

    try {
      // @ts-expect-error constructeur API speech standard
      const recognition = new SpeechRecognition();
      recognition.lang = "fr-FR";
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsRecordingVoice(true);
      // @ts-expect-error événement de résultat speech
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsRecordingVoice(false);
        handleSendRoseMessage(transcript);
      };
      recognition.onerror = () => {
        setIsRecordingVoice(false);
        notify("La saisie vocale n'a pas pu être captée, vous pouvez écrire votre message.");
      };
      recognition.onend = () => {
        setIsRecordingVoice(false);
      };
      recognition.start();
    } catch {
      setIsRecordingVoice(false);
    }
  };

  /**
   * Simulation Orange Money API
   */
  const handleInitiateOrangeMoneyDonation = () => {
    const amount = customDonationAmount ? Number(customDonationAmount) : donationAmount;
    if (!amount || amount < 100) {
      notify("Veuillez sélectionner ou entrer un montant valide (min. 100 FCFA).");
      return;
    }
    if (!orangeMoneyPhone.trim()) {
      notify("Veuillez renseigner votre numéro Orange Money.");
      return;
    }
    setDonationStep("confirm");
  };

  const handleConfirmOrangeMoney = () => {
    // Passage à l'étape OTP / Push USSD
    setDonationStep("otp");
    notify("Demande envoyée à Orange Money Burkina Faso (#144*4*6#)");
  };

  const handleValidateOrangeMoneyOTP = () => {
    // Génération du numéro de reçu Orange Money
    const randomId = "OM-BF-" + Math.floor(100000 + Math.random() * 900000);
    setLastDonationId(randomId);
    setDonationStep("success");
    notify("Paiement Orange Money réussi ! Merci pour votre don solidaire.");
  };

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content || !newAnnouncement.author) {
      notify("Veuillez remplir le titre, la structure et la description.");
      return;
    }
    const created: PartnerAnnouncement = {
      id: Date.now(),
      title: newAnnouncement.title,
      author: newAnnouncement.author,
      authorType: newAnnouncement.authorType,
      city: newAnnouncement.city,
      date: newAnnouncement.date,
      badge: newAnnouncement.badge,
      badgeColor: newAnnouncement.badgeColor,
      content: newAnnouncement.content,
      contact: newAnnouncement.contact || "+226 70 00 00 00",
      likes: 1,
    };
    setAnnouncements([created, ...announcements]);
    setShowNewAnnouncementModal(false);
    notify("Votre annonce a été publiée avec succès pour toute la communauté !");
  };

  return (
    <main
      className="min-h-[100dvh] bg-[#f7e6eb] px-0 text-[#3a222f] sm:flex sm:items-center sm:justify-center sm:p-5"
      style={{ fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');
        .ph-display { font-family: 'Fraunces', Georgia, serif; }
        .ph-scroll::-webkit-scrollbar { display:none; }
        .ph-scroll { scrollbar-width:none; }
        @keyframes ph-rise { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .ph-enter { animation: ph-rise .26s ease-out both; }
        @keyframes ph-pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.35); opacity: 0.4; }
        }
        .ph-pulse { animation: ph-pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>

      {/* Viewport smartphone */}
      <div className="relative mx-auto flex h-[100dvh] w-full max-w-[440px] flex-col overflow-hidden bg-[#fffbfa] shadow-[0_28px_80px_rgba(93,39,61,.18)] sm:h-[min(890px,95dvh)] sm:rounded-[36px] sm:border sm:border-white/90">

        {/* ==================================================================== */}
        {/* BARRE LATÉRALE (SIDEBAR NAVIGATION COMPLÈTE)                         */}
        {/* ==================================================================== */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm sm:absolute sm:rounded-[36px]"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="relative flex h-full w-[84%] max-w-[325px] flex-col bg-[#fffaf9] p-5 shadow-2xl transition-transform"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/images/pinkhub-mvp-paglaafi.png"
                    alt="Logo PagLaafi"
                    className="h-11 w-11 object-contain mix-blend-multiply"
                  />
                  <div>
                    <h2 className="ph-display text-xl font-bold text-[#472738]">PagLaafi</h2>
                    <p className="text-[10px] font-medium text-[#92546e]">Burkina Faso · Santé des femmes</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full text-[#815568] hover:bg-[#f8e7ec]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* État de connexion dans le menu */}
              <div className="mt-3 rounded-2xl bg-[#f9edf1] p-3 text-xs">
                {currentUser ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-[#9b4967]">Connectée</span>
                      <span className="font-bold text-[#472738]">{currentUser.prenom} {currentUser.nom}</span>
                      <span className="block text-[10px] text-[#7d5d6c]">{currentUser.telephone}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="grid h-8 w-8 place-items-center rounded-xl bg-white text-rose-600 shadow-sm"
                      title="Déconnexion"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setSidebarOpen(false); setShowAuthModal(true); }}
                    className="flex w-full items-center justify-between font-bold text-[#913b5b]"
                  >
                    <span className="flex items-center gap-2">
                      <User size={16} /> Se connecter / Créer un compte
                    </span>
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>

              {/* Navigation latérale complète */}
              <nav className="mt-4 space-y-1 flex-1 overflow-y-auto">
                <button
                  onClick={() => { setSection("Accueil"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-sm font-semibold transition ${section === "Accueil" ? "bg-[#f5e3e8] text-[#a14364]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <Heart size={18} className={section === "Accueil" ? "text-[#a14364]" : "text-[#977382]"} />
                  <span>Accueil</span>
                </button>

                <button
                  onClick={() => { setSection("Centres"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-left text-sm font-semibold transition ${section === "Centres" ? "bg-[#f5e3e8] text-[#a14364]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className={section === "Centres" ? "text-[#a14364]" : "text-[#977382]"} />
                    <span>Carte Vivante des Centres</span>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">En direct</span>
                </button>

                <button
                  onClick={() => { setSection("RoseIA"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-left text-sm font-semibold transition ${section === "RoseIA" ? "bg-[#f5e3e8] text-[#a14364]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles size={18} className="text-[#a14364]" />
                    <span>Rose IA (Assistante Vocale)</span>
                  </div>
                  <span className="rounded-full bg-[#a14364] px-2 py-0.5 text-[9px] font-bold text-white">Vocal</span>
                </button>

                <button
                  onClick={() => { setSection("Annonces"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-left text-sm font-semibold transition ${section === "Annonces" ? "bg-[#f5e3e8] text-[#a14364]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <div className="flex items-center gap-3">
                    <Megaphone size={18} className={section === "Annonces" ? "text-[#a14364]" : "text-[#977382]"} />
                    <span>Annonces & Événements</span>
                  </div>
                  <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[9px] font-bold text-purple-900">Actu</span>
                </button>

                <button
                  onClick={() => { setSection("Accompagnant"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-sm font-semibold transition ${section === "Accompagnant" ? "bg-[#f5e3e8] text-[#a14364]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <UserPlus size={18} className={section === "Accompagnant" ? "text-[#a14364]" : "text-[#977382]"} />
                  <span>L'Accompagnant (À deux)</span>
                </button>

                <button
                  onClick={() => { setSection("Comprendre"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-sm font-semibold transition ${section === "Comprendre" ? "bg-[#f5e3e8] text-[#a14364]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <AudioLines size={18} className={section === "Comprendre" ? "text-[#a14364]" : "text-[#977382]"} />
                  <span>Comprendre & Audio</span>
                </button>

                <button
                  onClick={() => { setSection("Soutien"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-left text-sm font-semibold transition ${section === "Soutien" ? "bg-[#f5e3e8] text-[#a14364]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <div className="flex items-center gap-3">
                    <HeartHandshake size={18} className={section === "Soutien" ? "text-[#a14364]" : "text-[#977382]"} />
                    <span>Soutien & Don Orange Money</span>
                  </div>
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[9px] font-bold text-orange-800">OM</span>
                </button>

                {/* Espace Soignant */}
                <div className="pt-3 border-t border-[#f2e1e6]">
                  <p className="px-3.5 text-[9px] font-bold uppercase tracking-wider text-[#a07484]">Accès Professionnels</p>
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setShowAgentModal(centers[0]);
                    }}
                    className="mt-1.5 flex w-full items-center gap-2.5 rounded-2xl border border-dashed border-[#dfb3c1] bg-[#fcf5f7] px-3.5 py-2.5 text-left text-xs font-bold text-[#863853] hover:bg-[#f8e9ee]"
                  >
                    <Edit3 size={15} />
                    <span>Mettre à jour mon centre (Soignant)</span>
                  </button>
                </div>
              </nav>

              {/* Bas de sidebar */}
              <div className="mt-auto rounded-2xl bg-[#734059] p-3 text-white">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Phone size={14} /> Numéro vert national gratuit
                </div>
                <p className="mt-0.5 text-sm font-extrabold tracking-wide">80 00 11 22</p>
                <p className="text-[10px] text-white/70">Anonyme au Burkina Faso</p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* HEADER APPLICATION                                                   */}
        {/* ==================================================================== */}
        <header className="z-20 flex shrink-0 items-center justify-between border-b border-[#f0dee2] bg-[#fffaf9]/95 px-4 py-2 backdrop-blur">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Ouvrir le menu"
              className="grid h-10 w-10 place-items-center rounded-2xl border border-[#f2e1e6] bg-white text-[#633b4e] transition hover:bg-[#fceef2]"
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

          <div className="flex items-center gap-2">
            {/* Bouton Rose IA Vocal direct */}
            <button
              onClick={() => setSection("RoseIA")}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold transition shadow-sm ${section === "RoseIA" ? "bg-[#a14364] text-white" : "border border-[#e7bcc9] bg-[#fbf0f4] text-[#8e3857]"}`}
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>Rose IA</span>
            </button>

            {/* Bouton Compte / Connexion */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#eedfe4] bg-white text-[#7d5668] hover:bg-[#faedf1]"
              title={currentUser ? `Connectée : ${currentUser.prenom}` : "Connexion"}
            >
              {currentUser ? (
                <span className="text-xs font-bold text-[#a14364]">{currentUser.prenom[0]}</span>
              ) : (
                <User size={18} />
              )}
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
              <div className="relative overflow-hidden bg-[#f9e9ed] px-5 pb-6 pt-5">
                <div className="pointer-events-none absolute -right-6 -top-8 h-44 w-44 rounded-full border-[20px] border-[#f0d0db] opacity-60" />

                <div className="relative flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#a44666] shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d65f84]" /> Santé des femmes · Burkina Faso
                  </span>
                  {currentUser && (
                    <span className="text-[11px] font-bold text-[#8e4462]">
                      Bonjour, {currentUser.prenom} !
                    </span>
                  )}
                </div>

                <h1 className="ph-display relative mt-3 text-[34px] leading-[1.02] tracking-[-.025em] text-[#452637]">
                  Une question ?<br />
                  <span className="text-[#b94e70]">Vous n'êtes pas seule.</span>
                </h1>

                <p className="relative mt-2.5 text-[13px] leading-[1.6] text-[#745866]">
                  Avant de vous déplacer, sachez où l'appareil fonctionne aujourd'hui, combien ça coûte et l'attente sur place.
                </p>

                <div className="relative mt-4 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => { setSection("Centres"); setViewMode("map"); }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#a14364] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#8f3956]"
                  >
                    <MapPin size={15} /> Voir la carte en direct
                  </button>
                  <button
                    onClick={() => setSection("RoseIA")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#dfb3c1] bg-white px-4 py-2.5 text-xs font-bold text-[#8c3e59] shadow-sm hover:bg-[#fbf4f6]"
                  >
                    <Sparkles size={14} className="text-amber-500" /> Parler à Rose IA
                  </button>
                </div>
              </div>

              {/* Raccourci Annonces Partenaires Défilant */}
              <div className="px-5 pt-4">
                <div
                  onClick={() => setSection("Annonces")}
                  className="cursor-pointer rounded-2xl border border-purple-200 bg-purple-50/70 p-3 shadow-sm hover:border-purple-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-900">
                      <Megaphone size={13} /> Événement du moment
                    </span>
                    <span className="text-[10px] font-semibold text-purple-700">Voir tout →</span>
                  </div>
                  <h4 className="mt-1 text-xs font-bold text-purple-950">
                    {announcements[0].title}
                  </h4>
                  <p className="text-[11px] text-purple-800 line-clamp-1 mt-0.5">
                    {announcements[0].content}
                  </p>
                </div>
              </div>

              {/* Raccourci L'Accompagnant */}
              <div className="px-5 pt-3">
                <div
                  onClick={() => setSection("Accompagnant")}
                  className="cursor-pointer rounded-[22px] border-2 border-[#e8bcc9] bg-gradient-to-br from-[#fff6f8] to-[#fbf0f4] p-3.5 shadow-sm transition hover:border-[#cf7794]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#a14364] text-white">
                        <UserPlus size={19} />
                      </span>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#a14364]">Aller à deux</span>
                        <h3 className="ph-display text-base font-bold text-[#472738]">Inviter mon accompagnant(e)</h3>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-[#a14364]" />
                  </div>
                </div>
              </div>

              {/* Don solidaire Orange Money sur l'accueil */}
              <div className="px-5 pt-3">
                <div className="rounded-[22px] border border-orange-200 bg-gradient-to-r from-orange-50 to-[#fff8f5] p-3.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f16e00] text-white shadow-sm font-black text-sm">
                        OM
                      </span>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-orange-900">Solidarité Burkina</span>
                        <h4 className="ph-display text-sm font-bold text-[#452737]">Faire un don par Orange Money</h4>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDonationModal(true)}
                      className="rounded-full bg-[#f16e00] px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-orange-600"
                    >
                      Aider
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 Blocs Rapides */}
              <div className="px-5 pt-4 space-y-2">
                <button
                  onClick={() => { setSection("Centres"); setViewMode("map"); }}
                  className="flex w-full items-center gap-3 rounded-2xl border border-[#f0dfe4] bg-white p-3 text-left transition hover:border-[#dfa3b5]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f8e8ec] text-[#a44666]">
                    <MapPin size={19} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs font-bold text-[#4c2d3c]">Carte vivante des centres</span>
                    <span className="block text-[11px] text-[#8c737f]">Appareil dispo, prix et attente en direct</span>
                  </div>
                  <ChevronRight size={16} className="text-[#a87487]" />
                </button>

                <button
                  onClick={() => setSection("Comprendre")}
                  className="flex w-full items-center gap-3 rounded-2xl border border-[#f0dfe4] bg-white p-3 text-left transition hover:border-[#dfa3b5]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f5edf7] text-[#845089]">
                    <Headphones size={19} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs font-bold text-[#4c2d3c]">Guide vocal français & mooré</span>
                    <span className="block text-[11px] text-[#8c737f]">Écouter les leçons sans jargon</span>
                  </div>
                  <ChevronRight size={16} className="text-[#a87487]" />
                </button>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 2 : CARTE VIVANTE DES CENTRES DE SANTÉ                       */}
          {/* ------------------------------------------------------------------ */}
          {section === "Centres" && (
            <section className="ph-enter px-5 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
                    Temps réel · Burkina Faso
                  </span>
                  <h1 className="ph-display text-[26px] leading-tight text-[#452637]">
                    Carte vivante des soins
                  </h1>
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

              {/* Recherche */}
              <div className="mt-3 relative">
                <Search size={16} className="absolute left-3.5 top-3 text-[#9f7183]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher centre, ville, examen..."
                  className="w-full rounded-2xl border border-[#ebd8de] bg-white py-2 pl-9 pr-8 text-xs text-[#4b2f3e] focus:border-[#a14364] focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-2.5 text-[#9f7183]">
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Filtres Badges */}
              <div className="ph-scroll mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <button
                  onClick={() => { setStatusFilter("all"); setCityFilter("all"); }}
                  className={`shrink-0 rounded-full px-3 py-1 font-bold ${statusFilter === "all" && cityFilter === "all" ? "bg-[#a14364] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
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
                  className={`shrink-0 rounded-full px-2.5 py-1 font-bold ${statusFilter === "free" ? "bg-[#a14364] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  0 FCFA (Gratuit)
                </button>
                <button
                  onClick={() => setCityFilter(cityFilter === "Ouagadougou" ? "all" : "Ouagadougou")}
                  className={`shrink-0 rounded-full px-2.5 py-1 font-bold ${cityFilter === "Ouagadougou" ? "bg-[#a14364] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  Ouaga
                </button>
                <button
                  onClick={() => setCityFilter(cityFilter === "Bobo-Dioulasso" ? "all" : "Bobo-Dioulasso")}
                  className={`shrink-0 rounded-full px-2.5 py-1 font-bold ${cityFilter === "Bobo-Dioulasso" ? "bg-[#a14364] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  Bobo
                </button>
                <button
                  onClick={() => setCityFilter(cityFilter === "Koudougou" ? "all" : "Koudougou")}
                  className={`shrink-0 rounded-full px-2.5 py-1 font-bold ${cityFilter === "Koudougou" ? "bg-[#a14364] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  Koudougou
                </button>
              </div>

              {/* Carte SVG stylisée */}
              {viewMode === "map" && (
                <div className="mt-2.5">
                  <div className="relative h-[250px] w-full overflow-hidden rounded-[24px] border border-[#e5d0d8] bg-gradient-to-b from-[#fdf7f9] to-[#f4e4ea] p-2.5 shadow-inner">
                    <svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full opacity-35" preserveAspectRatio="none">
                      <polygon points="15,40 25,20 45,15 70,12 85,25 90,45 80,68 60,75 35,72 20,65 10,50" fill="#ecd3dc" stroke="#dfb6c4" strokeWidth="1.2" />
                      <text x="50" y="44" fontSize="3.5" fill="#a46d81" fontWeight="bold">Ouagadougou</text>
                      <text x="24" y="62" fontSize="3.2" fill="#a46d81">Bobo</text>
                      <text x="36" y="46" fontSize="3" fill="#a46d81">Koudougou</text>
                    </svg>

                    {filteredCenters.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCenter(c)}
                        style={{ left: `${c.coordinates.x}%`, top: `${c.coordinates.y}%` }}
                        className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                      >
                        <span className={`absolute -inset-1.5 rounded-full opacity-60 ${c.status === "available" ? "bg-emerald-400 ph-pulse" : c.status === "busy" ? "bg-amber-400 ph-pulse" : c.status === "maintenance" ? "bg-rose-400" : "bg-slate-300"}`} />
                        <span className={`relative flex h-6 w-6 items-center justify-center rounded-full text-white shadow-md ${c.statusColor}`}>
                          <Activity size={12} />
                        </span>
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#422333]/90 px-1 py-0.5 text-[8.5px] font-bold text-white shadow">
                          {c.shortName} · {c.queueCount} attente
                        </span>
                      </button>
                    ))}
                  </div>
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
                        <h3 className="ph-display mt-0.5 text-sm font-bold text-[#482839]">{center.name}</h3>
                        <p className="text-[11px] text-[#846b77]">{center.place}</p>
                      </div>
                      <button onClick={() => setSelectedCenter(center)} className="rounded-xl bg-[#faedf1] p-1.5 text-[#a14364]">
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    <div className="mt-2 rounded-xl bg-[#fbf6f7] p-2 text-[11px] text-[#6e515e]">
                      <div className="flex items-center justify-between font-semibold">
                        <span>{center.isApparatusWorking ? "Mammographe opérationnel" : "Appareil indisponible"}</span>
                        <span className="text-[#8f4a64]">{center.estimatedWait}</span>
                      </div>
                      <div className="mt-0.5 flex justify-between text-[10px] text-[#866a78]">
                        <span>{center.agentsPresent} agents ({center.queueCount} en file)</span>
                        <span className="font-bold text-emerald-700">Palpation : 0 FCFA</span>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-[#f4e4e9] pt-2 text-[10px]">
                      <button onClick={() => handlePlayAudio(center.audioMessageMoore, "moore")} className="inline-flex items-center gap-1 rounded-full border border-[#e4bfcd] bg-white px-2 py-0.5 font-bold text-[#92405d]">
                        <Volume2 size={12} /> Message Mooré
                      </button>
                      <button onClick={() => setSelectedCenter(center)} className="rounded-full bg-[#a14364] px-2.5 py-1 font-bold text-white">
                        Détails & Tarifs
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 3 : ROSE IA (ASSISTANTE VOCALE SPÉCIALISÉE)                 */}
          {/* ------------------------------------------------------------------ */}
          {section === "RoseIA" && !selectedCenter && (
            <section className="ph-enter flex flex-col h-full px-5 pt-3">
              {/* Entête Rose IA */}
              <div className="rounded-[24px] bg-gradient-to-r from-[#734059] to-[#924b6d] p-4 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 text-white shadow-inner">
                        <Sparkles size={22} className="text-amber-300" />
                      </span>
                      {roseSpeaking && (
                        <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-white ph-pulse" />
                      )}
                    </div>
                    <div>
                      <h2 className="ph-display text-lg font-bold">Rose IA</h2>
                      <p className="text-[11px] text-white/80">Assistance vocale santé au Burkina Faso</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePlayAudio("Bonjour, je suis Rose IA. Posez-moi votre question en touchant le micro.", "fr")}
                    className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
                    title="Écouter la voix de Rose IA"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
              </div>

              {/* Questions suggérées rapides */}
              <div className="ph-scroll mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                {[
                  "Est-ce que ça fait mal ?",
                  "Combien coûte le dépistage ?",
                  "J'ai senti une petite boule",
                  "Quels centres sont ouverts ?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSendRoseMessage(q)}
                    className="shrink-0 rounded-full border border-[#e4cad3] bg-white px-2.5 py-1 text-[#863b55] font-semibold hover:bg-[#faf0f3]"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Fil de discussion */}
              <div className="mt-3 space-y-3 flex-1 overflow-y-auto">
                {roseMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-[20px] p-3 text-xs leading-relaxed shadow-sm ${msg.sender === "user" ? "bg-[#a14364] text-white rounded-tr-sm" : "bg-white text-[#452737] border border-[#f0dfe4] rounded-tl-sm"}`}
                    >
                      <p>{msg.text}</p>
                      {msg.mooreText && (
                        <div className="mt-2 border-t border-[#f4e4e9] pt-1.5 text-[10.5px] italic text-[#845068]">
                          <span className="font-bold">Mooré :</span> {msg.mooreText}
                        </div>
                      )}
                    </div>
                    {msg.sender === "rose" && (
                      <button
                        onClick={() => handlePlayAudio(msg.text, "fr")}
                        className="mt-1 flex items-center gap-1 text-[10px] font-bold text-[#a14364] hover:underline"
                      >
                        <Volume2 size={12} /> Réécouter la réponse
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Barre de saisie & Micro vocal */}
              <div className="mt-3 rounded-2xl border border-[#e5ccd5] bg-white p-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleVoiceRecording}
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition ${isRecordingVoice ? "bg-rose-600 text-white ph-pulse" : "bg-[#f8e7ec] text-[#a14364] hover:bg-[#f3d7df]"}`}
                    title={isRecordingVoice ? "Enregistrement en cours..." : "Parler à la voix"}
                  >
                    <Mic size={19} />
                  </button>
                  <input
                    type="text"
                    value={roseInput}
                    onChange={(e) => setRoseInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendRoseMessage()}
                    placeholder={isRecordingVoice ? "Rose IA écoute votre voix..." : "Posez votre question à Rose IA..."}
                    className="flex-1 bg-transparent text-xs text-[#452737] outline-none placeholder:text-[#a68c98]"
                  />
                  <button
                    onClick={() => handleSendRoseMessage()}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#a14364] text-white hover:bg-[#8e3956]"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <div className="mt-1 px-2 text-center text-[9px] text-[#937583]">
                  Rose IA informe et rassure. En cas d'urgence ou de douleur aiguë, consultez un médecin.
                </div>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 4 : ANNONCES & ÉVÉNEMENTS DES PARTENAIRES                     */}
          {/* ------------------------------------------------------------------ */}
          {section === "Annonces" && !selectedCenter && (
            <section className="ph-enter px-5 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
                    Communauté & Partenaires
                  </span>
                  <h1 className="ph-display text-[26px] leading-tight text-[#452637]">
                    Annonces & Événements
                  </h1>
                </div>
                <button
                  onClick={() => setShowNewAnnouncementModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#a14364] px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#8e3956]"
                >
                  <Plus size={15} /> Publier
                </button>
              </div>

              <p className="mt-1 text-xs text-[#795f6d]">
                Retrouvez les campagnes mobiles, causeries éducatives et dépistages gratuits partagés par les associations burkinabè.
              </p>

              {/* Liste des annonces */}
              <div className="mt-3.5 space-y-3">
                {announcements.map((a) => (
                  <div key={a.id} className="rounded-[22px] border border-[#efdfe4] bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${a.badgeColor}`}>
                        {a.badge}
                      </span>
                      <span className="text-[10px] font-semibold text-[#8b6576]">{a.city}</span>
                    </div>

                    <h3 className="ph-display mt-2 text-base font-bold text-[#452737] leading-snug">
                      {a.title}
                    </h3>

                    <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#8c405c]">
                      <Megaphone size={13} /> {a.author} ({a.authorType})
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-[#6d4f5e]">
                      {a.content}
                    </p>

                    <div className="mt-3 flex items-center justify-between border-t border-[#f4e4e9] pt-2.5 text-xs">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#846b77]">
                        <Calendar size={13} /> {a.date}
                      </div>
                      <a
                        href={`tel:${a.contact}`}
                        className="inline-flex items-center gap-1 rounded-full bg-[#faedf1] px-2.5 py-1 text-[11px] font-bold text-[#a14364] hover:bg-[#f6dbe3]"
                      >
                        <Phone size={12} /> Contacter
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 5 : L'ACCOMPAGNANT (ALLER À DEUX)                           */}
          {/* ------------------------------------------------------------------ */}
          {section === "Accompagnant" && !selectedCenter && (
            <section className="ph-enter px-5 pt-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f9e8ed] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
                <HeartHandshake size={14} /> Aller faire son dépistage à deux
              </span>
              <h1 className="ph-display mt-1 text-[28px] leading-tight text-[#452637]">
                L'Accompagnant
              </h1>
              <p className="mt-1 text-xs leading-5 text-[#795f6d]">
                Aller faire son dépistage, c'est plus facile à deux. Invitez une sœur, une amie, une voisine ou votre conjoint à y aller avec vous.
              </p>

              {/* Formulaire */}
              <div className="mt-3.5 rounded-[24px] border border-[#ebd6dc] bg-white p-4 shadow-sm">
                <h2 className="ph-display text-base font-bold text-[#452737]">
                  Inviter mon accompagnant(e)
                </h2>

                <div className="mt-3 space-y-2.5 text-xs">
                  <div>
                    <label className="block font-bold text-[#5c3c4b]">Prénom de l'accompagnant(e)</label>
                    <input
                      type="text"
                      value={companionName}
                      onChange={(e) => setCompanionName(e.target.value)}
                      placeholder="Ex: Fatim, Aïcha, Moussa..."
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs text-[#4c2e3d] focus:border-[#a14364] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-[#5c3c4b]">Lien de parenté</label>
                      <select
                        value={companionRelation}
                        onChange={(e) => setCompanionRelation(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#e4cfd6] bg-white p-2 text-xs text-[#4c2e3d]"
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
                      <label className="block font-bold text-[#5c3c4b]">Téléphone</label>
                      <input
                        type="tel"
                        value={companionPhone}
                        onChange={(e) => setCompanionPhone(e.target.value)}
                        placeholder="Ex: 70 12 34 56"
                        className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs text-[#4c2e3d]"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      const text = encodeURIComponent(`Bonjour ${companionName || "ma sœur"}, Aminata t'invite à faire ton dépistage avec elle. C'est plus facile à deux ! Rendez-vous sur PagLaafi : http://localhost:5173/`);
                      window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
                      setHasInvited(true);
                      notify("Invitation WhatsApp prête à l'envoi.");
                    }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-700"
                  >
                    <MessageCircle size={16} /> Inviter par WhatsApp
                  </button>

                  <button
                    onClick={() => {
                      const text = encodeURIComponent(`Bonjour ${companionName || "ma sœur"}, Aminata t'invite à faire ton dépistage avec elle.`);
                      window.open(`sms:${companionPhone}?body=${text}`, "_blank");
                      setHasInvited(true);
                      notify("SMS d'invitation préparé.");
                    }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#dfb3c1] bg-white py-2 text-xs font-bold text-[#8c3e59]"
                  >
                    <Share2 size={15} /> Inviter par SMS classique
                  </button>
                </div>
              </div>

              {/* Suivi du binôme */}
              <div className="mt-4 rounded-[24px] bg-[#f9e9ee] p-4 shadow-sm text-xs">
                <div className="flex items-center justify-between font-bold text-[#452737]">
                  <span>Binôme : Aminata & {companionName || "Fatim"}</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[9px] text-[#865366]">Actif</span>
                </div>
                <p className="mt-1 text-[11px] text-[#7e5e6e]">Rendez-vous prévu le {companionDate}</p>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setHasConfirmedVisit(!hasConfirmedVisit);
                      notify(!hasConfirmedVisit ? "Visite confirmée !" : "Réinitialisé.");
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${hasConfirmedVisit ? "bg-emerald-600 text-white" : "border border-emerald-400 bg-emerald-50 text-emerald-800"}`}
                  >
                    <CheckCircle2 size={15} />
                    {hasConfirmedVisit ? "Moi : J'y suis allée ✓" : "Moi : J'y suis allée"}
                  </button>
                  <button
                    onClick={() => {
                      setCompanionConfirmedVisit(!companionConfirmedVisit);
                      notify(!companionConfirmedVisit ? "Accompagnant confirmé !" : "Réinitialisé.");
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${companionConfirmedVisit ? "bg-emerald-600 text-white" : "border border-emerald-400 bg-emerald-50 text-emerald-800"}`}
                  >
                    <CheckCircle2 size={15} />
                    {companionConfirmedVisit ? "Accompagnant : Présent ✓" : "Accompagnant : Présent"}
                  </button>
                </div>

                <p className="mt-2.5 text-center text-[9.5px] text-[#8a6f7c]">
                  🔒 Seule la confirmation de présence est partagée. Les résultats restent sous secret médical strict.
                </p>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 6 : COMPRENDRE & AUDIO                                      */}
          {/* ------------------------------------------------------------------ */}
          {section === "Comprendre" && !selectedCenter && (
            <section className="ph-enter px-5 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
                Guide vocal & écrit
              </span>
              <h1 className="ph-display text-[26px] leading-tight text-[#452637]">
                Comprendre, à votre rythme
              </h1>

              {/* Lecteur */}
              <div className="mt-3.5 overflow-hidden rounded-[24px] bg-[#734059] p-4 text-white shadow-md">
                <div className="flex items-center justify-between text-[10px] text-white/75">
                  <span className="inline-flex items-center gap-1 font-bold uppercase tracking-wider">
                    <Headphones size={13} /> Lecteur Audio PagLaafi
                  </span>
                  <div className="flex rounded-full bg-white/15 p-0.5">
                    <button
                      onClick={() => setSpeechLanguage("fr")}
                      className={`rounded-full px-2 py-0.5 font-bold ${speechLanguage === "fr" ? "bg-white text-[#734059]" : "text-white/80"}`}
                    >
                      Français
                    </button>
                    <button
                      onClick={() => setSpeechLanguage("moore")}
                      className={`rounded-full px-2 py-0.5 font-bold ${speechLanguage === "moore" ? "bg-white text-[#734059]" : "text-white/80"}`}
                    >
                      Mooré
                    </button>
                  </div>
                </div>

                <h2 className="ph-display mt-2 text-lg leading-snug">
                  {lessons[activeLesson].title}
                </h2>
                <p className="mt-1 text-xs text-white/80">
                  {speechLanguage === "moore" ? lessons[activeLesson].mooreSummary : lessons[activeLesson].summary}
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-2.5">
                  <button
                    onClick={() => {
                      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                      setIsPlaying(false);
                      setAudioProgress(0);
                    }}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white"
                  >
                    <RotateCcw size={15} />
                  </button>

                  <button
                    onClick={() =>
                      handlePlayAudio(
                        speechLanguage === "moore" ? lessons[activeLesson].mooreSummary : lessons[activeLesson].fullText,
                        speechLanguage,
                      )
                    }
                    className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#734059] shadow"
                  >
                    {isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
                    <span>{isPlaying ? "Pause" : "Écouter l'explication"}</span>
                  </button>

                  <span className="text-[10px] text-white/70">{lessons[activeLesson].duration}</span>
                </div>
              </div>

              {/* Texte */}
              <div className="mt-3 rounded-2xl border border-[#eedde2] bg-white p-3.5 text-xs text-[#5b3c4c] leading-relaxed">
                {lessons[activeLesson].fullText}
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 7 : SOUTIEN, ENTRAIDE & DON ORANGE MONEY                    */}
          {/* ------------------------------------------------------------------ */}
          {section === "Soutien" && !selectedCenter && (
            <section className="ph-enter px-5 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
                Entraide & Solidarité
              </span>
              <h1 className="ph-display text-[26px] leading-tight text-[#452637]">
                À plusieurs, c'est moins lourd.
              </h1>

              {/* Module spécial : Faire un don Orange Money */}
              <div className="mt-3.5 overflow-hidden rounded-[26px] border border-orange-300 bg-gradient-to-br from-[#fff7f2] to-[#ffeedd] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f16e00] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                    <Gift size={13} /> Orange Money Burkina Faso
                  </span>
                  <span className="text-[10px] font-bold text-orange-950">100% Solidaire</span>
                </div>

                <h3 className="ph-display mt-2 text-lg font-bold text-[#3d2430]">
                  Soutenir une femme pour son dépistage
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#684a58]">
                  Au Burkina Faso, un don de <strong>5 000 FCFA</strong> permet de subventionner une mammographie complète pour une femme démunie.
                </p>

                <div className="mt-3 flex items-center justify-between gap-2 border-t border-orange-200/80 pt-3">
                  <div>
                    <span className="block text-[10px] text-orange-900 font-medium">Associations vérifiées :</span>
                    <span className="text-xs font-bold text-[#452737]">ABAC, COBUCAN, Schiphra</span>
                  </div>
                  <button
                    onClick={() => setShowDonationModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#f16e00] px-4 py-2 text-xs font-bold text-white shadow hover:bg-orange-600 transition"
                  >
                    <CreditCard size={14} /> Donner par Orange Money
                  </button>
                </div>
              </div>

              {/* Ligne d'urgence */}
              <div className="mt-3.5 overflow-hidden rounded-2xl bg-[#734059] p-4 text-white shadow">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                  Numéro vert national gratuit
                </span>
                <h3 className="ph-display mt-1 text-2xl font-bold">80 00 11 22</h3>
                <p className="mt-0.5 text-[11px] text-white/80">
                  Écoute psychologique & conseils médicaux 7j/7 depuis tout téléphone au Burkina Faso.
                </p>
              </div>

              {/* Liste des associations partenaires soutenues */}
              <div className="mt-4">
                <h3 className="ph-display text-base font-bold text-[#452737]">
                  Nos associations partenaires
                </h3>
                <div className="mt-2 space-y-2">
                  {partnerAssociations.map((assoc) => (
                    <div key={assoc.id} className="rounded-2xl border border-[#eedde2] bg-white p-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#452737]">{assoc.name} ({assoc.acronym})</span>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">Vérifié</span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#785b6a]">{assoc.mission}</p>
                      <div className="mt-2 flex items-center justify-between border-t border-[#f4e4e9] pt-1.5 text-[10px]">
                        <span className="text-[#8e6174]">{assoc.beneficiariesCount}</span>
                        <button
                          onClick={() => {
                            setSelectedAssociation(assoc);
                            setShowDonationModal(true);
                          }}
                          className="font-bold text-[#f16e00] hover:underline"
                        >
                          Faire un don à cette association →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* FICHE DÉTAILLÉE D'UN CENTRE SÉLECTIONNÉ                             */}
          {/* ------------------------------------------------------------------ */}
          {selectedCenter && (
            <section className="ph-enter px-5 pt-4">
              <button
                onClick={() => setSelectedCenter(null)}
                className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#a14364] hover:underline"
              >
                <ArrowLeft size={16} /> Retour à la carte des centres
              </button>

              <div className="rounded-[26px] bg-[#f8e7ec] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${selectedCenter.statusColor}`}>
                    <Activity size={12} /> {selectedCenter.statusLabel}
                  </span>
                  <span className="text-[10px] font-semibold text-[#8a5d70]">{selectedCenter.city}</span>
                </div>

                <h1 className="ph-display mt-2 text-xl font-bold text-[#472738]">{selectedCenter.name}</h1>
                <p className="mt-0.5 text-xs text-[#805e6f]">{selectedCenter.address}</p>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-white/90 p-2 shadow-sm">
                    <p className="text-[9px] font-bold uppercase text-[#9f697d]">Équipement</p>
                    <p className="font-bold text-[#452737]">{selectedCenter.apparatus}</p>
                  </div>
                  <div className="rounded-xl bg-white/90 p-2 shadow-sm">
                    <p className="text-[9px] font-bold uppercase text-[#9f697d]">Personnel en poste</p>
                    <p className="font-bold text-[#452737]">{selectedCenter.agentsPresent} agents</p>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between rounded-xl bg-white/90 p-2 text-xs">
                  <span>File d'attente actuelle : <strong>{selectedCenter.queueCount} personnes</strong></span>
                  <span className="rounded-full bg-[#faedf1] px-2 py-0.5 font-bold text-[#963756]">{selectedCenter.estimatedWait}</span>
                </div>
              </div>

              {/* Message audio du centre */}
              <div className="mt-3 rounded-2xl border border-[#ebd6dc] bg-white p-3 text-xs">
                <span className="flex items-center gap-1.5 font-bold text-[#4a2b3b]">
                  <Volume2 size={15} className="text-[#a14364]" /> Message audio du centre
                </span>
                <p className="mt-1 italic text-[#725462]">« {selectedCenter.audioMessageFr} »</p>
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    onClick={() => handlePlayAudio(selectedCenter.audioMessageFr, "fr")}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#a14364] py-1.5 text-xs font-bold text-white"
                  >
                    <Play size={13} fill="currentColor" /> Français
                  </button>
                  <button
                    onClick={() => handlePlayAudio(selectedCenter.audioMessageMoore, "moore")}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#e2bac8] bg-[#fdf5f7] py-1.5 text-xs font-bold text-[#8a3350]"
                  >
                    <AudioLines size={13} /> Mooré
                  </button>
                </div>
              </div>

              {/* Examens & Tarifs */}
              <div className="mt-3 rounded-2xl border border-[#ebd6dc] bg-white p-3.5">
                <h3 className="ph-display text-sm font-bold text-[#452737]">Examens & Tarifs officiels</h3>
                <div className="mt-2 divide-y divide-[#f5e6eb] text-xs">
                  {selectedCenter.exams.map((exam, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5">
                      <span>{exam.name}</span>
                      <span className={exam.free ? "font-bold text-emerald-700" : "font-bold text-[#a14364]"}>
                        {exam.free ? "0 FCFA (Gratuit)" : `${exam.price.toLocaleString("fr-FR")} FCFA`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bouton de confirmation */}
              <div className="mt-3 rounded-2xl bg-[#f9e9ee] p-3 text-center text-xs">
                <button
                  onClick={() => {
                    setCenters((prev) =>
                      prev.map((c) =>
                        c.id === selectedCenter.id ? { ...c, confirmedVisitsToday: c.confirmedVisitsToday + 1 } : c,
                      ),
                    );
                    notify("Merci ! Votre confirmation rassure la communauté.");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 font-bold text-emerald-800 border border-emerald-300 shadow-sm"
                >
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  J'y suis allée, ça s'est bien passé ({selectedCenter.confirmedVisitsToday})
                </button>
              </div>
            </section>
          )}
        </div>

        {/* ==================================================================== */}
        {/* MODAL 1 : CONNEXION SIMPLE / CRÉATION DE COMPTE                      */}
        {/* ==================================================================== */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]">
            <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#f8e7ec] text-[#a14364]">
                    <User size={18} />
                  </div>
                  <h3 className="ph-display text-base font-bold text-[#472738]">
                    {authMode === "register" ? "Créer mon compte PagLaafi" : "Se connecter"}
                  </h3>
                </div>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="grid h-8 w-8 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-3 flex rounded-xl bg-[#f9edf1] p-1 text-xs">
                <button
                  onClick={() => setAuthMode("register")}
                  className={`flex-1 rounded-lg py-1.5 font-bold transition ${authMode === "register" ? "bg-white text-[#913b5b] shadow-sm" : "text-[#7b5b6a]"}`}
                >
                  Inscription
                </button>
                <button
                  onClick={() => setAuthMode("login")}
                  className={`flex-1 rounded-lg py-1.5 font-bold transition ${authMode === "login" ? "bg-white text-[#913b5b] shadow-sm" : "text-[#7b5b6a]"}`}
                >
                  Connexion
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="mt-3 space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-[#563746]">Nom *</label>
                    <input
                      type="text"
                      required
                      value={authForm.nom}
                      onChange={(e) => setAuthForm({ ...authForm, nom: e.target.value })}
                      placeholder="Ex: Ouedraogo"
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs focus:border-[#a14364] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#563746]">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={authForm.prenom}
                      onChange={(e) => setAuthForm({ ...authForm, prenom: e.target.value })}
                      placeholder="Ex: Aminata"
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs focus:border-[#a14364] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#563746]">Numéro de téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={authForm.telephone}
                    onChange={(e) => setAuthForm({ ...authForm, telephone: e.target.value })}
                    placeholder="Ex: 70 12 34 56"
                    className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs focus:border-[#a14364] focus:outline-none"
                  />
                  <p className="text-[9.5px] text-[#937583] mt-0.5">Sert à recevoir vos rappels de rendez-vous et SMS.</p>
                </div>

                <div>
                  <label className="block font-bold text-[#563746]">Mot de passe *</label>
                  <input
                    type="password"
                    required
                    value={authForm.motDePasse}
                    onChange={(e) => setAuthForm({ ...authForm, motDePasse: e.target.value })}
                    placeholder="••••••••"
                    className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs focus:border-[#a14364] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(false)}
                    className="flex-1 rounded-xl border border-[#e5ced6] py-2.5 font-bold text-[#725261]"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-[#a14364] py-2.5 font-bold text-white shadow hover:bg-[#8d3955]"
                  >
                    {authMode === "register" ? "Valider l'inscription" : "Se connecter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL 2 : SIMULATION API ORANGE MONEY (BURKINA FASO)                  */}
        {/* ==================================================================== */}
        {showDonationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]">
            <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl border border-orange-200">
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f16e00] text-white font-black text-xs">
                    OM
                  </span>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#3d2430]">Don Solidaire Orange Money</h3>
                    <p className="text-[10px] text-orange-950 font-semibold">Orange Money Burkina Faso (#144#)</p>
                  </div>
                </div>
                <button
                  onClick={() => { setShowDonationModal(false); setDonationStep("form"); }}
                  className="grid h-8 w-8 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* ÉTAPE 1 : Choix de l'association et du montant */}
              {donationStep === "form" && (
                <div className="mt-3 space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#563746]">1. Choisir l'association partenaire :</label>
                    <select
                      value={selectedAssociation.id}
                      onChange={(e) => {
                        const found = partnerAssociations.find((a) => a.id === Number(e.target.value));
                        if (found) setSelectedAssociation(found);
                      }}
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 font-semibold text-[#452737]"
                    >
                      {partnerAssociations.map((assoc) => (
                        <option key={assoc.id} value={assoc.id}>
                          {assoc.acronym} — {assoc.name} ({assoc.city})
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-[10px] text-[#785b6a] italic">
                      Mission : {selectedAssociation.mission}
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-[#563746]">2. Montant du don solidaire (FCFA) :</label>
                    <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                      {[1000, 2500, 5000, 10000, 25000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => { setDonationAmount(amt); setCustomDonationAmount(""); }}
                          className={`rounded-xl py-2 font-bold transition text-xs ${donationAmount === amt && !customDonationAmount ? "bg-[#f16e00] text-white shadow-sm" : "border border-[#e7d5dc] bg-[#fffaf8] text-[#563746]"}`}
                        >
                          {amt.toLocaleString("fr-FR")} F
                        </button>
                      ))}
                      <input
                        type="number"
                        placeholder="Autre..."
                        value={customDonationAmount}
                        onChange={(e) => setCustomDonationAmount(e.target.value)}
                        className={`rounded-xl p-1.5 text-center text-xs font-bold border ${customDonationAmount ? "border-[#f16e00] bg-orange-50 text-orange-900" : "border-[#e7d5dc]"}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#563746]">3. Numéro Orange Money débiteur :</label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-2.5 font-bold text-[#8c6778]">+226</span>
                      <input
                        type="tel"
                        value={orangeMoneyPhone}
                        onChange={(e) => setOrangeMoneyPhone(e.target.value)}
                        placeholder="70 12 34 56"
                        className="w-full rounded-xl border border-[#e4cfd6] py-2 pl-14 pr-3 font-bold text-[#452737] focus:border-[#f16e00] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleInitiateOrangeMoneyDonation}
                    className="mt-2 w-full rounded-2xl bg-[#f16e00] py-3 text-xs font-bold text-white shadow-md hover:bg-orange-600 transition"
                  >
                    Valider le don de {customDonationAmount ? Number(customDonationAmount).toLocaleString("fr-FR") : donationAmount.toLocaleString("fr-FR")} FCFA →
                  </button>
                </div>
              )}

              {/* ÉTAPE 2 : Confirmation des détails */}
              {donationStep === "confirm" && (
                <div className="mt-3 space-y-3 text-xs">
                  <div className="rounded-2xl bg-[#fff7f2] border border-orange-200 p-3.5 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#7c5b6b]">Bénéficiaire :</span>
                      <span className="font-bold text-[#452737]">{selectedAssociation.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7c5b6b]">Montant :</span>
                      <span className="font-extrabold text-[#f16e00] text-sm">
                        {customDonationAmount ? Number(customDonationAmount).toLocaleString("fr-FR") : donationAmount.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7c5b6b]">Téléphone Orange :</span>
                      <span className="font-bold text-[#452737]">+226 {orangeMoneyPhone}</span>
                    </div>
                    <div className="flex justify-between text-[10.5px]">
                      <span className="text-[#7c5b6b]">Frais de transaction :</span>
                      <span className="font-bold text-emerald-700">0 FCFA (Pris en charge)</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-center text-[#7e5f6e]">
                    En continuant, un message de confirmation USSD Orange Money sera envoyé à votre téléphone.
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setDonationStep("form")}
                      className="flex-1 rounded-xl border border-[#e5ced6] py-2.5 font-bold text-[#725261]"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={handleConfirmOrangeMoney}
                      className="flex-1 rounded-xl bg-[#f16e00] py-2.5 font-bold text-white shadow hover:bg-orange-600"
                    >
                      Confirmer l'envoi
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 3 : Simulation Push USSD / Code OTP */}
              {donationStep === "otp" && (
                <div className="mt-3 space-y-3 text-xs text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-orange-100 text-[#f16e00] ph-pulse">
                    <Phone size={24} />
                  </div>

                  <div>
                    <h4 className="font-bold text-[#452737]">Validation Orange Money en cours</h4>
                    <p className="text-[11px] text-[#7c5b6b] mt-1">
                      Tapez <strong>#144*4*6#</strong> sur votre téléphone ou entrez le code secret/OTP reçu par SMS.
                    </p>
                  </div>

                  <div className="mx-auto max-w-[200px]">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Code OTP (ex: 4589)"
                      className="w-full rounded-xl border-2 border-orange-400 p-2 text-center text-sm font-extrabold tracking-widest text-[#452737]"
                    />
                  </div>

                  <button
                    onClick={handleValidateOrangeMoneyOTP}
                    className="w-full rounded-2xl bg-[#f16e00] py-2.5 font-bold text-white shadow hover:bg-orange-600"
                  >
                    Valider et autoriser le débit
                  </button>
                </div>
              )}

              {/* ÉTAPE 4 : Reçu de paiement et succès */}
              {donationStep === "success" && (
                <div className="mt-3 space-y-3 text-xs text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
                    <CheckCircle2 size={32} />
                  </div>

                  <div>
                    <h4 className="ph-display text-lg font-bold text-[#452737]">Merci pour votre générosité !</h4>
                    <p className="text-[11px] text-[#7c5b6b] mt-0.5">
                      Votre don est intégralement transmis à <strong>{selectedAssociation.acronym}</strong> pour le dépistage des femmes.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#f8f9fa] border border-[#e9ecef] p-3 text-left space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Réf Transaction :</span>
                      <span className="font-mono font-bold text-gray-800">{lastDonationId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Montant débité :</span>
                      <span className="font-bold text-[#f16e00]">
                        {customDonationAmount ? Number(customDonationAmount).toLocaleString("fr-FR") : donationAmount.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Moyen :</span>
                      <span className="font-semibold text-gray-700">Orange Money Burkina Faso</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Statut :</span>
                      <span className="font-bold text-emerald-700">Succès (Validé)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => { setShowDonationModal(false); setDonationStep("form"); }}
                    className="w-full rounded-2xl bg-[#a14364] py-2.5 font-bold text-white shadow"
                  >
                    Fermer le reçu
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL 3 : PUBLIER UNE ANNONCE (ASSOCIATION / PARTENAIRE)              */}
        {/* ==================================================================== */}
        {showNewAnnouncementModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]">
            <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
                <h3 className="ph-display text-base font-bold text-[#472738]">Publier une annonce / événement</h3>
                <button
                  onClick={() => setShowNewAnnouncementModal(false)}
                  className="grid h-8 w-8 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handlePublishAnnouncement} className="mt-3 space-y-2.5 text-xs">
                <div>
                  <label className="block font-bold text-[#563746]">Titre de l'action / événement *</label>
                  <input
                    type="text"
                    required
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    placeholder="Ex: Journée dépistage gratuit"
                    className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 focus:border-[#a14364] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-[#563746]">Structure / Association *</label>
                    <input
                      type="text"
                      required
                      value={newAnnouncement.author}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, author: e.target.value })}
                      placeholder="Ex: ABAC, Clinique..."
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#563746]">Ville *</label>
                    <select
                      value={newAnnouncement.city}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, city: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] bg-white p-2"
                    >
                      <option>Ouagadougou</option>
                      <option>Bobo-Dioulasso</option>
                      <option>Koudougou</option>
                      <option>Ouahigouya</option>
                      <option>Fada N'Gourma</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#563746]">Description détaillée *</label>
                  <textarea
                    rows={3}
                    required
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    placeholder="Précisez le lieu exact, l'horaire et si l'examen est gratuit ou payant..."
                    className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewAnnouncementModal(false)}
                    className="flex-1 rounded-xl border border-[#e5ced6] py-2.5 font-bold text-[#725261]"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-[#a14364] py-2.5 font-bold text-white shadow"
                  >
                    Publier l'annonce
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* BARRE DE NAVIGATION INFÉRIEURE FIXE (MOBILE NATIVE BAR)              */}
        {/* ==================================================================== */}
        <nav
          aria-label="Navigation principale"
          className="z-30 shrink-0 border-t border-[#f0dee3] bg-white/95 backdrop-blur-md px-1 pb-[max(10px,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-8px_25px_rgba(75,30,50,.07)]"
        >
          <div className="grid grid-cols-5 items-end">
            {[
              { label: "Accueil" as Section, icon: Heart, name: "Accueil" },
              { label: "Centres" as Section, icon: MapPin, name: "Centres" },
              { label: "RoseIA" as Section, icon: Sparkles, name: "Rose IA", isCentral: true },
              { label: "Annonces" as Section, icon: Megaphone, name: "Annonces" },
              { label: "Soutien" as Section, icon: HeartHandshake, name: "Soutien" },
            ].map(({ label, icon: Icon, name, isCentral }) => {
              const active = section === label;

              if (isCentral) {
                return (
                  <button
                    key={label}
                    onClick={() => {
                      setSection(label);
                      setSelectedCenter(null);
                    }}
                    aria-current={active ? "page" : undefined}
                    className="group relative -mt-4 flex flex-col items-center justify-center focus:outline-none"
                  >
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-white shadow-[0_6px_18px_rgba(161,67,100,.35)] transition-all duration-300 group-hover:scale-105 ${active ? "bg-gradient-to-tr from-[#8a3350] via-[#a14364] to-[#cf5d83] text-white ring-2 ring-[#a14364]/30" : "bg-gradient-to-tr from-[#9c3e5d] to-[#be5377] text-white"}`}
                    >
                      <Sparkles size={21} className="text-amber-300 animate-pulse" />
                    </span>
                    <span
                      className={`mt-0.5 text-[9.5px] tracking-tight font-extrabold transition ${active ? "text-[#a14364]" : "text-[#7b5465]"}`}
                    >
                      Rose IA
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={label}
                  onClick={() => {
                    setSection(label);
                    setSelectedCenter(null);
                  }}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-2xl transition ${active ? "text-[#a14364]" : "text-[#9d838e] hover:text-[#785062]"}`}
                >
                  <span
                    className={`grid h-7 w-9 place-items-center rounded-full transition-all duration-200 ${active ? "bg-[#fbe7ed] text-[#a14364] shadow-xs" : ""}`}
                  >
                    <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                  </span>
                  <span
                    className={`text-[9.5px] tracking-tight transition ${active ? "font-bold text-[#a14364]" : "font-medium text-[#9d838e]"}`}
                  >
                    {name}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* ==================================================================== */}
        {/* TOAST DE CONFIRMATION                                                */}
        {/* ==================================================================== */}
        {toast && (
          <div
            role="status"
            className="ph-enter absolute bottom-[80px] left-4 right-4 z-40 flex items-start gap-2.5 rounded-2xl bg-[#4d2d3e] px-4 py-3 text-xs leading-5 text-white shadow-[0_10px_30px_rgba(40,18,30,.25)]"
          >
            <Check size={16} className="mt-0.5 shrink-0 text-[#f5bed0]" />
            <span className="flex-1">{toast}</span>
          </div>
        )}
      </div>
    </main>
  );
}
