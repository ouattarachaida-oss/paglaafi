import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  AudioLines,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  CalendarDays,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock,
  CreditCard,
  Database,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Flame,
  Gift,
  Globe,
  GraduationCap,
  Headphones,
  Heart,
  HeartHandshake,
  Languages,
  Lock,
  LogOut,
  MapPin,
  Megaphone,
  Menu,
  MessageCircle,
  Mic,
  Navigation,
  Pause,
  Phone,
  Play,
  Plus,
  RotateCcw,
  Search,
  Send,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Thermometer,
  TrendingUp,
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
  | "RoseIA"
  | "FaireUnDon"
  | "Accompagnant"
  | "Annonces"
  | "Calendrier";

// Rôles utilisateurs & spécialisation administrative
type UserRole = "user" | "admin" | "superadmin";
type AdminType = "center" | "doctor" | "association";

interface UserProfile {
  nom: string;
  prenom: string;
  telephone: string;
  role: UserRole;
  roleLabel: string;
  structureName?: string;
  adminType?: AdminType; // center = Centre de santé, doctor = Médecin, association = ONG/Asso
  speciality?: string;
}

// Inscription en attente pour le Superadmin
interface PendingRegistration {
  id: number;
  structure: string;
  responsable: string;
  telephone: string;
  type: "Association" | "Centre de Santé" | "Professionnel";
  ville: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

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
  audioMessageEn: string;
  audioMessageMoore: string;
  audioMessageDioula: string;
  confirmedVisitsToday: number;
  phone: string;
  address: string;
  lastUpdate: string;
  coordinates: { x: number; y: number };
  lat: number;
  lng: number;
}

// Annonce avec gestion du cycle de validation Superadmin et mois en cours
interface PartnerAnnouncement {
  id: number;
  title: string;
  author: string;
  authorType: "Association" | "Partenaire Santé" | "Hôpital";
  city: string;
  date: string;
  month: string; // ex: "Octobre 2026"
  badge: string;
  badgeColor: string;
  content: string;
  contact: string;
  likes: number;
  status: "pending_validation" | "approved" | "rejected";
  submittedBy?: string;
  submittedAt?: string;
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

interface MedicalKnowledge {
  id: number;
  doctorName: string;
  speciality: string;
  topic: string;
  advice: string;
  date: string;
  verified: boolean;
}

/**
 * Centres de santé du Burkina Faso avec coordonnées GPS réelles pour OpenStreetMap
 */
const initialCenters: HealthCenter[] = [
  {
    id: 1,
    name: "CMA de Schiphra (Centre Médical avec Antenne Chirurgicale)",
    shortName: "CMA Schiphra",
    place: "Tanghin, Secteur 17, Ouagadougou",
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
    audioMessageFr: "Bonjour, ici la sage-femme de Schiphra. Notre mammographe fonctionne parfaitement aujourd'hui. L'attente est faible, moins de 20 minutes.",
    audioMessageEn: "Hello, this is the midwife from Schiphra. Our digital mammography unit is fully functional today with minimal wait time (under 20 minutes).",
    audioMessageMoore: "Ne y beogo pagbã fãa, CMA Schiphra tɩɩm zĩiga yaa kaset. Masã masã, mammographie masĩnã tʋmdame tɩ zĩigã pa noom ye. Wa-y laafi.",
    audioMessageDioula: "Aw ni sɔgɔma, CMA Schiphra kɛnɛyaso la masin bɛ baara kɛ kosɛbɛ bi. Mɔgɔ caman t'a la, aw bɛ se ka na sisan.",
    confirmedVisitsToday: 48,
    phone: "+226 25 36 30 70",
    address: "Tanghin, Arrondissement 4 (ex-Secteur 30), Ouagadougou",
    lastUpdate: "Aujourd'hui à 08h30 par Mme Sawadogo (Sage-femme chef)",
    coordinates: { x: 52, y: 46 },
    lat: 12.405,
    lng: -1.518,
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
    audioMessageFr: "Au CHU de Bogodogo, les deux appareils fonctionnent mais nous avons une forte affluence ce matin. Privilégiez le début d'après-midi.",
    audioMessageEn: "At Bogodogo University Hospital, both machines are operational but there is heavy attendance this morning. Early afternoon is recommended.",
    audioMessageMoore: "CHU Bogodogo tʋmdame, la neb wʋsg n be kãenkãenga rũnda. Bɩ y bãng tɩ zãama nooma, sã n yaa ne yãmb yaa sõma tɩ y wa zaabre.",
    audioMessageDioula: "CHU Bogodogo masinw bɛ baara kɛ, nka mɔgɔw ka ca bi. Ni aw bɛ fɛ, aw bɛ se ka na wula fɛ.",
    confirmedVisitsToday: 76,
    phone: "+226 25 37 40 40",
    address: "Boulevard des Tansoba, Arrondissement 5, Ouagadougou",
    lastUpdate: "Aujourd'hui à 09h15 par Dr. Ouedraogo",
    coordinates: { x: 55, y: 48 },
    lat: 12.338,
    lng: -1.488,
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
    audioMessageFr: "Bonjour aux femmes de Bobo. Le service de dépistage est ouvert en continu jusqu'à 16 heures. L'équipe est au complet et prête à vous orienter.",
    audioMessageEn: "Hello to all women in Bobo-Dioulasso. Our screening unit is open continuously until 4 PM with complete medical staff.",
    audioMessageMoore: "Bobo CHU Sourô Sanou pʋgẽ, b sɩngame tɩ b gũusd pagbã ne laafi. Ned baa a yembre pa be n gũud wʋsg ye. Wa-y tɩ b ges yãmba.",
    audioMessageDioula: "I ni sɔgɔma Bobo musow. CHU Sourô Sanou dayɛlɛn bɛ fo ka taga se lere naani wula fɛ. Dɔgɔtɔrɔmusow bɛ yan k'aw bisimila.",
    confirmedVisitsToday: 52,
    phone: "+226 20 97 00 44",
    address: "Avenue de la République, Bobo-Dioulasso",
    lastUpdate: "Aujourd'hui à 07h50 par Major Traoré",
    coordinates: { x: 26, y: 64 },
    lat: 11.178,
    lng: -4.295,
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
    staffDescription: "2 sages-femmes assurant les examens cliniques manuels",
    queueCount: 3,
    estimatedWait: "~10 min (Clinique uniquement)",
    exams: [
      { name: "Palpation clinique manuelle", price: 0, free: true, notes: "Maintenue normalement" },
      { name: "Mammographie", price: 10000, free: false, notes: "🔴 Suspendue aujourd'hui" },
    ],
    audioMessageFr: "Attention pour le CHR de Koudougou : le mammographe est en maintenance. Les sages-femmes assurent la palpation manuelle gratuite.",
    audioMessageEn: "Notice for Koudougou Regional Hospital: mammography machine is under maintenance today. Manual clinical breast examinations remain open.",
    audioMessageMoore: "CHR Koudougou: Masĩnã komsame bilfu tɩ b ket n manegda. La pagbã tõe n waame tɩ b ning-b nus n ges b yĩnsa zaalem.",
    audioMessageDioula: "Koudougou CHR masin tiɲɛna dɔɔni bi. Musow bɛ se ka na dɔgɔtɔrɔmusow bɛ bɔlɔkɔrɔ lajɛ kɛ.",
    confirmedVisitsToday: 19,
    phone: "+226 25 44 01 24",
    address: "Route de Ouagadougou, Secteur 1, Koudougou",
    lastUpdate: "Aujourd'hui à 08h00 par l'ingénieur biomédical",
    coordinates: { x: 42, y: 47 },
    lat: 12.251,
    lng: -2.366,
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
    audioMessageFr: "Ce centre n'a pas encore validé son rapport ce matin. Veuillez appeler le centre avant de vous déplacer.",
    audioMessageEn: "This medical center has not confirmed daily status yet. Please call beforehand.",
    audioMessageMoore: "Kasetã pa paam kʋdemd sebr rũnda ye. Bɩ y tẽeg n bãng bãmb sã n sɩngame tɩ y yaool n ta.",
    audioMessageDioula: "Kɛnɛyaso nin ma kuma fɔ bi fɔlɔ. Aw k'u weele telefone fɛ k'a lɔn sani aw ka taga.",
    confirmedVisitsToday: 5,
    phone: "+226 25 35 12 00",
    address: "Tampouy, Arrondissement 3, Ouagadougou",
    lastUpdate: "Hier à 16h45",
    coordinates: { x: 50, y: 43 },
    lat: 12.392,
    lng: -1.554,
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
    month: "Octobre 2026",
    badge: "Gratuit (0 FCFA)",
    badgeColor: "bg-emerald-100 text-emerald-800",
    content: "L'ABAC déploie sa clinique mobile sur la place du Marché de Koudougou. Examen clinique gratuit pour toutes les femmes de 25 à 65 ans. Échographies gratuites sur place en cas de doute.",
    contact: "+226 70 20 11 22",
    likes: 148,
    status: "approved",
    submittedBy: "ABAC Burkina",
    submittedAt: "12/10/2026",
  },
  {
    id: 2,
    title: "Grande Causerie Éducative : Démystifier le Cancer du Sein",
    author: "Coalition Burkinabè contre le Cancer (COBUCAN)",
    authorType: "Association",
    city: "Ouagadougou (Maison de la Femme)",
    date: "Vendredi 23 Octobre à 15h00",
    month: "Octobre 2026",
    badge: "Rencontre & Débat",
    badgeColor: "bg-purple-100 text-purple-800",
    content: "Venez échanger avec nos sages-femmes et des patientes guéries. Explications en français, anglais, mooré et dioula. Rafraîchissements offerts et apprentissage des gestes d'auto-palpation.",
    contact: "+226 76 50 33 44",
    likes: 104,
    status: "approved",
    submittedBy: "COBUCAN",
    submittedAt: "13/10/2026",
  },
  {
    id: 3,
    title: "Opération Mammographies Subventionnées à 5 000 FCFA",
    author: "CMA de Schiphra & Partenaires Internationaux",
    authorType: "Hôpital",
    city: "Ouagadougou",
    date: "Du 15 au 31 Octobre 2026",
    month: "Octobre 2026",
    badge: "Tarif Spécial",
    badgeColor: "bg-amber-100 text-amber-900",
    content: "Grâce aux donateurs de PagLaafi, 200 mammographies sont subventionnées à 5 000 FCFA (au lieu de 12 000 FCFA) pour les femmes sans revenus.",
    contact: "+226 25 36 30 70",
    likes: 235,
    status: "approved",
    submittedBy: "CMA Schiphra",
    submittedAt: "14/10/2026",
  },
  {
    id: 10,
    title: "Séance de dépistage subventionnée à 2 000 FCFA à Bobo",
    author: "Association Espoir & Vie Bobo",
    authorType: "Association",
    city: "Bobo-Dioulasso",
    date: "Mercredi 28 Octobre 2026",
    month: "Octobre 2026",
    badge: "En attente validation",
    badgeColor: "bg-amber-100 text-amber-900",
    content: "Journée spéciale de dépistage pour 100 commerçantes du Grand Marché de Bobo. Subventionnée grâce aux dons collectés sur PagLaafi.",
    contact: "+226 70 88 12 34",
    likes: 0,
    status: "pending_validation",
    submittedBy: "Espoir & Vie Bobo",
    submittedAt: "Aujourd'hui à 11h20",
  },
];

/**
 * Associations partenaires éligibles aux dons
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
  {
    id: 5,
    name: "Beneere For A Cause",
    acronym: "Beneere",
    mission: "Campagnes de dépistage précoce et prise en charge des femmes en milieu rural et périurbain.",
    city: "Ouagadougou & Centre-Nord",
    verified: true,
    beneficiariesCount: "410 femmes accompagnées",
  },
  {
    id: 6,
    name: "GenitCare Burkina",
    acronym: "GenitCare",
    mission: "Plateforme de santé gynécologique intégrée, sensibilisation digitale et diagnostic précoce.",
    city: "Ouagadougou",
    verified: true,
    beneficiariesCount: "290 dépistages subventionnés",
  },
  {
    id: 7,
    name: "Association WomenTech Makers Burkina",
    acronym: "WomenTech Makers",
    mission: "Mobilisation des technologies numériques et solidarité active des femmes contre le cancer.",
    city: "Ouagadougou & Bobo",
    verified: true,
    beneficiariesCount: "350 femmes formées et orientées",
  },
];

/**
 * Inscriptions en attente pour le Superadmin
 */
const initialPendingRegistrations: PendingRegistration[] = [
  {
    id: 101,
    structure: "Association Espoir Féminin Koudougou",
    responsable: "Mme Bado Aminata",
    telephone: "70 45 67 89",
    type: "Association",
    ville: "Koudougou",
    date: "15/10/2026",
    status: "pending",
  },
  {
    id: 102,
    structure: "Clinique Maternelle Yennenga",
    responsable: "Dr. Sanou Ibrahim",
    telephone: "76 12 34 56",
    type: "Centre de Santé",
    ville: "Ouagadougou",
    date: "14/10/2026",
    status: "pending",
  },
];

/**
 * Leçons pédagogiques avec audio en 4 langues : Français, English, Mooré et Dioula
 */
const lessons = [
  {
    id: 0,
    title: "Comprendre le cancer du sein sans jargon",
    category: "Les bases",
    duration: "4 min",
    summary: "Des repères clairs pour comprendre ce qui se passe dans le corps, sans dramatiser et avec des mots simples.",
    englishSummary: "Clear, non-technical explanations to understand what happens in the breast tissue without fear.",
    fullText:
      "Le cancer du sein commence lorsque des cellules du tissu mammaire se modifient et se multiplient anormalement. Dans la très grande majorité des cas, une petite boule ou un nodule n'est PAS un cancer : il s'agit souvent d'un kyste bénin ou d'un nodule fibreux sans danger. Cependant, seul un professionnel de santé peut faire la différence grâce à un examen indolore. Détecté très tôt, le cancer du sein se guérit dans plus de 9 cas sur 10. C'est pourquoi apprendre à observer sa poitrine chaque mois et réaliser un dépistage régulier peut vous sauver la vie.",
    englishFullText:
      "Breast cancer develops when cells inside breast tissue grow abnormally. In most cases, a small lump or nodule is NOT cancerous: it is often a benign cyst. However, only a trained healthcare provider can make an accurate diagnosis. When detected early, breast cancer can be cured in more than 9 out of 10 cases. Monthly breast self-examination and regular clinical screenings save lives.",
    mooreSummary:
      "Bãagã sɩngda ne yĩns nimbas n baood n paasd b toorẽ. Pa bũmb fãa n yaa bãaga ye. Sã n yaa ne zĩig n bilfu tɩ y bãng bãagã zĩig ninga, y tõe n paama laafi tɩ loog wʋsg. Da zoe rabeem ye, tɩɩm dãmbã be n na n sõng yãmba.",
    dioulaSummary:
      "Bana nin bɛ kɛ tuma min kɛlilicɛlu bɛ yɛlɛma sin na ka caya. Fɛn caman min bɛ kɛ sin na, a tɛ bana juguman ye. Nka kɛnɛyaso dɔgɔtɔrɔmuso dɔrɔn lo bɛ se k'o dɔn. Ni ye a dɔn joona, furakɛli ka nɔgɔn.",
  },
  {
    id: 1,
    title: "Quand et comment demander conseil ?",
    category: "S'orienter",
    duration: "3 min",
    summary: "Les signes qui doivent vous amener à consulter sans paniquer : une boule, un écoulement ou un pli inhabituel.",
    englishSummary: "Signs that should prompt consultation: a palpable lump, discharge, or unusual skin dimpling.",
    fullText:
      "Il est recommandé de consulter dès que vous remarquez un changement inhabituel : une boule dans le sein ou sous l'aisselle qui ne disparaît pas après les règles, un écoulement au niveau du mamelon, ou un changement dans l'aspect de la peau comme une fossette ou une rougeur. N'ayez pas peur d'en parler. Les agents de santé des centres de santé du Burkina Faso sont formés pour vous écouter avec respect et discrétion. N'attendez pas d'avoir mal, car au tout début, le nodule ne fait généralement aucun mal.",
    englishFullText:
      "Consult a healthcare professional whenever you notice an unusual change: a persistent lump in the breast or armpit after your menstrual period, nipple discharge, or skin retraction. Never hesitate to talk to health professionals. Do not wait for pain to occur, as early nodules are typically painless.",
    mooreSummary:
      "Sã n yaa tɩ y yã bũmb n lebse y yĩnsa pʋgẽ, wa bõn-kʋdga bɩ kaset zĩiga, bɩ y wa zĩig ning b sẽn gũusd pagbã laafi. Da zoe rabeem ye, tɩɩm dãmbã be n na n sõng yãmba.",
    dioulaSummary:
      "Ni i ye bõn-kʋdga dɔ ye i sin kɔrɔ walima sin na, walima ji bɛ bɔ a nɔnɔda la, i kana siran. Taga kɛnɛyaso la jona, dɔgɔtɔrɔmusow bɛ yan k'aw lajɛ ne lafiya.",
  },
  {
    id: 2,
    title: "Accompagner une proche à son dépistage",
    category: "Pour les proches",
    duration: "5 min",
    summary: "Comment soutenir une sœur, une amie ou une épouse sans jugement et faciliter sa démarche de santé.",
    englishSummary: "How to support a sister, friend or wife without judgment and encourage regular healthcare checkups.",
    fullText:
      "Faire un dépistage peut susciter de l'inquiétude. Pour une femme, être accompagnée par une sœur, une amie, sa mère ou son conjoint transforme complètement cette expérience. Proposer un covoiturage, patienter ensemble dans la salle d'attente ou simplement lui rappeler avec douceur l'importance de ce geste sont des actes d'amour déterminants. L'application PagLaafi propose la fonction 'Aller à deux' pour envoyer une invitation chaleureuse par SMS direct ou sur WhatsApp.",
    englishFullText:
      "Undergoing a screening exam can trigger anxiety. For a woman, having a trusted sister, friend or spouse alongside makes all the difference. Offering transportation, waiting together, or gently reminding her of the appointment are true acts of care. The PagLaafi Go-Together module allows sending an invitation in one click via SMS or WhatsApp.",
    mooreSummary:
      "Sã n yaa tɩ ned na n tɩ ges a yĩnsa laafi, rabeem tõe n kẽ-a lame. Woto yĩnga, sã n yaa ne a kẽed-n-taag bɩ a ma bɩ a biiga n kẽnd ne-a, zĩigã lebnda noogo. Tʋm-y SMS bɩ WhatsApp kaset n bool-a tɩ y kẽng a yiibu.",
    dioulaSummary:
      "Ka taga kɛnɛyaso la k'i sin lajɛ, siran bɛ se ka kɛ o la. Ni balimamusow walima furuɲɔgɔn tagara ɲɔgɔn fɛ, hakili bɛ sigi. PagLaafi bɛ dɛmɛ kɛ ka weeleli ci SMS walima WhatsApp fɛ.",
  },
];

/**
 * Réponses de Rose IA en 4 langues
 */
const roseKnowledge = {
  mal: {
    fr: "Rassurez-vous : la mammographie ne fait généralement pas mal. C'est une pression de 5 à 10 secondes par cliché. Pour plus de confort, réalisez l'examen dans les 10 jours suivant vos règles.",
    en: "Rest assured: mammography is generally not painful. It is a firm compression lasting 5 to 10 seconds per view. For best comfort, schedule it within 10 days after your menstrual period.",
    moore: "Da zoe rabeem ye: mammographie masĩnã pa namsd ninsaal wʋsg ye. A rɩkda sekõnd a wãn bal n kaset.",
    dioula: "I kana siran: masin nin tɛ mɔgɔ dimi kosɛbɛ. A bɛ kɛ sekondi damanin dɔrɔn lo kɔnɔ.",
  },
  prix: {
    fr: "Au Burkina Faso, la palpation clinique est GRATUITE (0 FCFA) dans la plupart des centres. L'échographie coûte 6 000 à 7 500 FCFA, et la mammographie 10 000 à 12 000 FCFA (subventionnée à 5 000 FCFA à Schiphra).",
    en: "In Burkina Faso, clinical breast exam is FREE (0 FCFA). Ultrasound is 6,000 to 7,500 FCFA, and mammography 10,000 to 12,000 FCFA (subsidized down to 5,000 FCFA at Schiphra).",
    moore: "Burkina Faso ka, nus n gesã yaa zaalem (0 FCFA). Échographie yaa 6 000 n ta 7 500 FCFA.",
    dioula: "Burkina Faso la, bɔlɔkɔrɔ lajɛ sɔngɔ ye fu ye (0 FCFA). Échographie ye 6 000 fo 7 500 FCFA ye.",
  },
  boule: {
    fr: "Ne paniquez pas : 8 boules sur 10 ne sont PAS un cancer (kystes bénins, fibromes). Mais faites-la impérativement examiner par un soignant sans attendre.",
    en: "Do not panic: 8 out of 10 lumps are NOT cancerous. However, it is essential to have it examined promptly by a doctor or midwife.",
    moore: "Da zoe rabeem ye: bõn-kʋds a nii (8) piig pʋgẽ pa bãag ye. La yaa tɩlae tɩ dɔgɔtɔr ges-a.",
    dioula: "I kana jaasi: bõn-kʋdga tan kɔnɔ segin tɛ bana juguman ye. Nka dɔgɔtɔrɔ k'a lajɛ jona.",
  },
  default: {
    fr: "Je suis Rose IA, votre compagne de santé. Posez-moi vos questions sur le dépistage, la douleur, les tarifs ou les centres disponibles.",
    en: "I am Rose AI, your health assistant. Ask me questions about breast exams, pain, costs, or available centers.",
    moore: "Mam yaa Rose IA. M be n na n sõng yãmba ne laafi kaset. Sok-y maam bũmb fãa y sẽn rat n bãngã.",
    dioula: "Ne ye Rose IA ye. Ne bɛ yan k'aw dɛmɛ kɛnɛya ko la. Aw bɛ se ka nɲininka bũmb o bũmb la.",
  },
};

/**
 * ============================================================================
 * COMPOSANT PRINCIPAL : PINKHUB MOBILE
 * ============================================================================
 */
export function PinkHubMobile() {
  // 1. Écran de démarrage (Splash Screen) "Powered by Rose IA"
  const [showSplash, setShowSplash] = useState(true);

  // 2. Navigation & État global
  const [section, setSection] = useState<Section>("Accueil");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<string>("");

  // 3. Déconnexion directe via l'icône de profil du header
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // 4. Authentification & Profils (Utilisatrice, Admin Centre, Docteur, Admin Asso, Superadmin)
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    nom: "Ouedraogo",
    prenom: "Aminata",
    telephone: "70 12 34 56",
    motDePasse: "123456",
    confirmerMotDePasse: "123456",
    role: "user" as UserRole,
    adminType: "center" as AdminType,
    structureName: "",
  });

  const [loginForm, setLoginForm] = useState({
    telephone: "70 12 34 56",
    motDePasse: "123456",
  });

  // Utilisateur actuellement connecté (par défaut : Utilisatrice standard)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    nom: "Ouedraogo",
    prenom: "Aminata",
    telephone: "70 12 34 56",
    role: "user",
    roleLabel: "Utilisatrice",
  });

  // Modal Partage Wi-Fi local sans Expo pour les collègues
  const [showWifiModal, setShowWifiModal] = useState(false);

  // Détection dynamique de l'URL d'accès réseau local (Wi-Fi) pour smartphones
  const localShareUrl = useMemo(() => {
    if (typeof window === "undefined") return "http://192.168.1.22:5173/";
    const host = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : "";
    if (host !== "localhost" && host !== "127.0.0.1") {
      return `${window.location.protocol}//${window.location.host}/`;
    }
    return `http://192.168.1.22${port || ":5173"}/`;
  }, []);

  // Fonction universelle de déconnexion
  const handleLogout = () => {
    setCurrentUser(null);
    setShowProfileMenu(false);
    setSidebarOpen(false);
    notify("Vous avez été déconnecté(e) avec succès.");
  };

  // Identité visuelle et icône personnalisée selon chaque profil
  const getProfileIdentity = (user: UserProfile | null) => {
    if (!user) {
      return {
        icon: <User size={18} className="text-slate-600" />,
        bg: "bg-slate-100",
        text: "text-slate-600",
        border: "border-slate-300",
        badgeText: "Non connecté",
        badgeBg: "bg-slate-500 text-white",
        dotColor: "bg-slate-400",
        label: "Invité / Visiteur",
      };
    }

    if (user.role === "superadmin") {
      return {
        icon: <ShieldCheck size={18} className="text-amber-300" />,
        bg: "bg-gradient-to-tr from-purple-950 via-purple-900 to-indigo-950",
        text: "text-amber-300",
        border: "border-amber-400",
        badgeText: "Superadmin",
        badgeBg: "bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 font-black",
        dotColor: "bg-amber-400",
        label: "Super-Administrateur National",
      };
    }

    if (user.role === "admin" && user.adminType === "center") {
      return {
        icon: <Activity size={18} className="text-white" />,
        bg: "bg-emerald-600",
        text: "text-white",
        border: "border-emerald-400",
        badgeText: "Centre de Santé",
        badgeBg: "bg-emerald-700 text-white",
        dotColor: "bg-emerald-400",
        label: "Admin Centre Médical",
      };
    }

    if (user.role === "admin" && user.adminType === "doctor") {
      return {
        icon: <Stethoscope size={18} className="text-white" />,
        bg: "bg-blue-600",
        text: "text-white",
        border: "border-blue-400",
        badgeText: "Docteur / Praticien",
        badgeBg: "bg-blue-700 text-white",
        dotColor: "bg-blue-400",
        label: "Docteur / Praticien de Santé",
      };
    }

    if (user.role === "admin" && user.adminType === "association") {
      return {
        icon: <HeartHandshake size={18} className="text-white" />,
        bg: "bg-purple-700",
        text: "text-white",
        border: "border-purple-300",
        badgeText: "Association ONG",
        badgeBg: "bg-purple-800 text-white",
        dotColor: "bg-purple-400",
        label: "Admin Association Partenaire",
      };
    }

    // Utilisatrice standard
    return {
      icon: <Heart size={17} className="text-white fill-white" />,
      bg: "bg-gradient-to-tr from-[#943657] to-[#ba486e]",
      text: "text-white",
      border: "border-rose-300",
      badgeText: "Utilisatrice",
      badgeBg: "bg-[#943657] text-white",
      dotColor: "bg-pink-400",
      label: "Utilisatrice / Patiente",
    };
  };

  // 5. Superadmin : Modération nationale, Statistiques de trafic & Inscriptions
  const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>(
    initialPendingRegistrations,
  );
  const [showSuperadminModal, setShowSuperadminModal] = useState(false);
  const [superadminActiveTab, setSuperadminActiveTab] = useState<"stats" | "announcements" | "registrations">("stats");

  // 6. Centres de santé & Carte OpenStreetMap Leaflet
  const [centers, setCenters] = useState<HealthCenter[]>(initialCenters);
  const [selectedCenter, setSelectedCenter] = useState<HealthCenter | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  // Modal mise à jour centre (strictement réservé aux admins centres & médecins)
  const [showCenterUpdateModal, setShowCenterUpdateModal] = useState(false);
  const [centerUpdateData, setCenterUpdateData] = useState<HealthCenter | null>(null);

  // 7. Audio & 4 Langues (Français, English, Mooré, Dioula)
  const [activeLesson, setActiveLesson] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [speechLanguage, setSpeechLanguage] = useState<"fr" | "en" | "moore" | "dioula">("fr");
  const audioIntervalRef = useRef<number | null>(null);

  // 8. Assistant Vocal ROSE IA
  const [roseMessages, setRoseMessages] = useState<
    Array<{ sender: "user" | "rose"; text: string; time: string; englishText?: string; mooreText?: string; dioulaText?: string }>
  >([
    {
      sender: "rose",
      text: "Bonjour ! Je suis Rose IA, votre compagne de santé bienveillante. Une question sur le dépistage, une douleur ou un centre ? Écrivez-moi ou touchez le micro.",
      englishText: "Hello! I am Rose AI, your caring health assistant. Ask me questions about screenings, pain, or health centers.",
      mooreText: "Ne y beogo ! Mam yaa Rose IA. Sok-y maam bũmb fãa y sẽn rat n bãngã.",
      dioulaText: "I ni sɔgɔma ! Ne ye Rose IA ye. Aw bɛ se ka nɲininka bũmb o bũmb la.",
      time: "Maintenant",
    },
  ]);
  const [roseInput, setRoseInput] = useState("");
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [roseSpeaking, setRoseSpeaking] = useState(false);

  // 9. Espace Docteur : Entraîner Rose IA
  const [clinicalKnowledgeList, setClinicalKnowledgeList] = useState<MedicalKnowledge[]>([
    {
      id: 1,
      doctorName: "Dr. Ibrahim Sanou",
      speciality: "Gynécologue-Obstétricien",
      topic: "Permanence urgences mammaires Bogodogo",
      advice: "Accueil direct sans rendez-vous tous les mardis et jeudis dès 08h pour tout nodule dur fixé ou écoulement unilatéral suspect.",
      date: "14/10/2026",
      verified: true,
    },
    {
      id: 2,
      doctorName: "Dr. Salif Sawadogo",
      speciality: "Oncologue Médical",
      topic: "Bon de mammographie subventionnée",
      advice: "L'ABAC dispose de bons de prise en charge à 5 000 FCFA pour les femmes sans couverture sanitaire adressées avec fiche d'orientation.",
      date: "15/10/2026",
      verified: true,
    },
  ]);
  const [showDoctorTrainModal, setShowDoctorTrainModal] = useState(false);
  const [doctorTeachTopic, setDoctorTeachTopic] = useState("");
  const [doctorTeachContent, setDoctorTeachContent] = useState("");

  // 10. Espace Soignant : Orientation & Recommandation patiente d'urgence
  const [showOrientationModal, setShowOrientationModal] = useState(false);
  const [orientationForm, setOrientationForm] = useState({
    patientName: "K. Fatoumata",
    patientPhone: "70 88 99 00",
    urgencyLevel: "high" as "high" | "medium" | "routine",
    targetCenterId: 1,
    clinicalObservations: "Masse rétro-aréolaire droite de 2.5 cm, indolore, évoluant depuis 2 mois. Pas d'adénopathie palpable.",
    recommendedExam: "Mammographie numérique bilatérale + Échographie mammaire",
  });
  const [generatedOrientationCode, setGeneratedOrientationCode] = useState<string | null>(null);

  // 11. Tableau de bord Administrateurs
  const [showAdminDashboardModal, setShowAdminDashboardModal] = useState(false);

  // 12. Calendrier Féminin : Règles, Autopalpation & Rappels
  const [lastPeriodDate, setLastPeriodDate] = useState("2026-10-06");
  const [cycleLengthDays, setCycleLengthDays] = useState(28);
  const [autopalpationDoneThisMonth, setAutopalpationDoneThisMonth] = useState(true);
  const [lastAutopalpationDate, setLastAutopalpationDate] = useState("12/10/2026");
  const [reminders, setReminders] = useState([
    { id: 1, title: "Dépistage annuel recommandé", date: "24 Octobre 2026", type: "screening", active: true },
    { id: 2, title: "Rendez-vous mammographie (CMA Schiphra)", date: "26 Octobre à 09h00", type: "appointment", active: true },
    { id: 3, title: "Prise de traitement hormonal / vitamines", date: "Tous les matins à 08h00", type: "treatment", active: false },
  ]);
  const [showNewReminderForm, setShowNewReminderForm] = useState(false);
  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [newReminderDate, setNewReminderDate] = useState("");
  const [newReminderType, setNewReminderType] = useState<"screening" | "appointment" | "treatment">("appointment");

  // 13. Annonces & Événements (avec modération Superadmin et filtre mois en cours)
  const [announcements, setAnnouncements] = useState<PartnerAnnouncement[]>(initialAnnouncements);
  const [announcementsFilter, setAnnouncementsFilter] = useState<"month" | "all" | "my">("month");
  const [showNewAnnouncementModal, setShowNewAnnouncementModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    author: "",
    authorType: "Association" as const,
    city: "Ouagadougou",
    date: "Samedi 24 Octobre 2026",
    month: "Octobre 2026",
    badge: "Sensibilisation",
    badgeColor: "bg-pink-100 text-pink-800",
    content: "",
    contact: "",
  });

  // 14. Faire un Don (Orange Money avec Option Don Anonyme Chiffré)
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [isAnonymousDonation, setIsAnonymousDonation] = useState(false);
  const [selectedAssociation, setSelectedAssociation] = useState<PartnerAssociation>(
    partnerAssociations[0],
  );
  const [donationAmount, setDonationAmount] = useState<number>(2500);
  const [customDonationAmount, setCustomDonationAmount] = useState<string>("");
  const [orangeMoneyPhone, setOrangeMoneyPhone] = useState<string>("70 12 34 56");
  const [donationStep, setDonationStep] = useState<"form" | "confirm" | "otp" | "success">("form");
  const [otpCode, setOtpCode] = useState<string>("");
  const [lastDonationId, setLastDonationId] = useState<string>("");

  // Accompagnant : choix de la langue du SMS
  const [smsLanguage, setSmsLanguage] = useState<"fr" | "moore">("fr");

  // Référence conteneur carte OpenStreetMap
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);

  // Helper Toast
  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 3500);
  };

  // Splash Screen Timer (2.2 secondes)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false);
    }, 2200);
    return () => window.clearTimeout(timer);
  }, []);

  /**
   * Intégration de la carte OpenStreetMap via Leaflet
   */
  useEffect(() => {
    if (section !== "Centres" || viewMode !== "map") return;

    let isMounted = true;

    const initLeafletMap = () => {
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
          <div style="font-family:'DM Sans', sans-serif; min-width:180px; padding:2px;">
            <b style="color:#452737; font-size:12px; display:block;">${center.shortName}</b>
            <span style="display:inline-block; font-size:10px; font-weight:bold; color:${markerColor}; margin-top:2px;">${center.statusLabel}</span>
            <div style="font-size:10px; color:#6b4d5d; margin-top:3px;">Attente : <b>${center.estimatedWait}</b></div>
            <div style="font-size:10px; color:#6b4d5d;">Agents : <b>${center.agentsPresent}</b></div>
            <button id="osm-btn-${center.id}" style="margin-top:6px; width:100%; border:none; background:#a14364; color:#ffffff; font-size:10px; font-weight:bold; padding:4px 8px; border-radius:6px; cursor:pointer;">
              Consulter la fiche →
            </button>
          </div>
        `);

        marker.on("popupopen", () => {
          const btn = document.getElementById(`osm-btn-${center.id}`);
          if (btn) {
            btn.onclick = () => {
              setSelectedCenter(center);
            };
          }
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
          if (isMounted) initLeafletMap();
        };
        document.body.appendChild(script);
      }
    } else {
      initLeafletMap();
    }

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [section, viewMode, centers]);

  /**
   * Moteur Audio Multi-langues (Français, English, Mooré, Dioula)
   */
  const handlePlayAudio = (
    textToSpeak: string,
    language: "fr" | "en" | "moore" | "dioula" = "fr",
  ) => {
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
    if (language === "en") {
      utterance.lang = "en-US";
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
    } else if (language === "fr") {
      utterance.lang = "fr-FR";
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
    } else {
      utterance.lang = "fr-FR";
      utterance.rate = 0.88;
      utterance.pitch = 1.05;
    }

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
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setAudioProgress(100);
      window.setTimeout(() => setAudioProgress(0), 1200);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setRoseSpeaking(false);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setAudioProgress(0);
    };

    window.speechSynthesis.speak(utterance);
  };

  /**
   * Calculs pour le cycle menstruel & fenêtre d'autopalpation
   */
  const cycleInfo = useMemo(() => {
    const lastDate = new Date(lastPeriodDate);
    const nextPeriodDate = new Date(lastDate);
    nextPeriodDate.setDate(lastDate.getDate() + cycleLengthDays);

    const autopalpStart = new Date(lastDate);
    autopalpStart.setDate(lastDate.getDate() + 7);
    const autopalpEnd = new Date(lastDate);
    autopalpEnd.setDate(lastDate.getDate() + 11);

    const now = new Date();
    const isOptimalWindow = now >= autopalpStart && now <= autopalpEnd;

    return {
      nextPeriodStr: nextPeriodDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long" }),
      autopalpWindowStr: `Du ${autopalpStart.getDate()} au ${autopalpEnd.getDate()} ${autopalpEnd.toLocaleDateString("fr-FR", { month: "short" })}`,
      isOptimalWindow,
    };
  }, [lastPeriodDate, cycleLengthDays]);

  /**
   * Gestion de la connexion et inscription
   */
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (registerForm.motDePasse !== registerForm.confirmerMotDePasse) {
      notify("Les deux mots de passe ne correspondent pas.");
      return;
    }

    if (!registerForm.telephone || !registerForm.motDePasse) {
      notify("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const newUser: UserProfile = {
      nom: registerForm.nom,
      prenom: registerForm.prenom,
      telephone: registerForm.telephone,
      role: registerForm.role,
      roleLabel:
        registerForm.role === "admin"
          ? registerForm.adminType === "center"
            ? `Admin Centre (${registerForm.structureName || "Centre"})`
            : registerForm.adminType === "doctor"
              ? `Docteur / Praticien (${registerForm.structureName || "CHU"})`
              : `Admin Association (${registerForm.structureName || "Association"})`
          : "Utilisatrice",
      structureName: registerForm.structureName,
      adminType: registerForm.adminType,
    };

    if (registerForm.role === "admin") {
      setPendingRegistrations((prev) => [
        {
          id: Date.now(),
          structure: registerForm.structureName || "Nouvelle Structure",
          responsable: `${registerForm.prenom} ${registerForm.nom}`,
          telephone: registerForm.telephone,
          type:
            registerForm.adminType === "center"
              ? "Centre de Santé"
              : registerForm.adminType === "doctor"
                ? "Professionnel"
                : "Association",
          ville: "Ouagadougou",
          date: "Aujourd'hui",
          status: "pending",
        },
        ...prev,
      ]);
      notify("Demande transmise ! Compte activé après validation par le Superadmin.");
      setShowAuthModal(false);
      return;
    }

    setCurrentUser(newUser);
    setShowAuthModal(false);
    notify(`Bienvenue ${newUser.prenom} ! Compte utilisatrice créé avec succès.`);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.telephone || !loginForm.motDePasse) {
      notify("Veuillez renseigner votre numéro de téléphone et votre mot de passe.");
      return;
    }

    if (loginForm.telephone === "78 00 00 00") {
      setCurrentUser({
        nom: "Kaboré",
        prenom: "Alimata",
        telephone: "78 00 00 00",
        role: "superadmin",
        roleLabel: "Super-Administrateur National",
      });
      notify("Connectée en tant que Superadmin National.");
    } else if (loginForm.telephone === "76 50 33 44") {
      setCurrentUser({
        nom: "Sawadogo",
        prenom: "Dr. Salif",
        telephone: "76 50 33 44",
        role: "admin",
        roleLabel: "Admin Association (ABAC)",
        structureName: "ABAC Burkina",
        adminType: "association",
      });
      notify("Connecté en tant que Responsable Association (ABAC).");
    } else if (loginForm.telephone === "70 25 36 30") {
      setCurrentUser({
        nom: "Sawadogo",
        prenom: "Mme Mariam",
        telephone: "70 25 36 30",
        role: "admin",
        roleLabel: "Admin Centre (CMA Schiphra)",
        structureName: "CMA de Schiphra",
        adminType: "center",
      });
      notify("Connectée en tant que Responsable Centre de Santé (Schiphra).");
    } else if (loginForm.telephone === "76 12 34 56") {
      setCurrentUser({
        nom: "Sanou",
        prenom: "Dr. Ibrahim",
        telephone: "76 12 34 56",
        role: "admin",
        roleLabel: "Docteur Gynécologue (CHU Bogodogo)",
        structureName: "CHU de Bogodogo",
        adminType: "doctor",
        speciality: "Gynécologue-Obstétricien",
      });
      notify("Connecté en tant que Docteur / Praticien de santé.");
    } else {
      setCurrentUser({
        nom: "Ouedraogo",
        prenom: "Aminata",
        telephone: loginForm.telephone,
        role: "user",
        roleLabel: "Utilisatrice",
      });
      notify("Connexion réussie ! Bienvenue sur PagLaafi.");
    }
    setShowAuthModal(false);
  };

  const quickLoginAs = (type: "user" | "center" | "doctor" | "association" | "superadmin") => {
    if (type === "superadmin") {
      setCurrentUser({
        nom: "Kaboré",
        prenom: "Alimata",
        telephone: "78 00 00 00",
        role: "superadmin",
        roleLabel: "Super-Administrateur National",
      });
      notify("Profil actif : 🛡️ Superadmin (Modération & Tableau de bord national).");
    } else if (type === "center") {
      setCurrentUser({
        nom: "Sawadogo",
        prenom: "Mme Mariam",
        telephone: "70 25 36 30",
        role: "admin",
        roleLabel: "Admin Centre (CMA Schiphra)",
        structureName: "CMA de Schiphra",
        adminType: "center",
      });
      notify("Profil actif : 🏥 Admin Centre de Santé.");
    } else if (type === "doctor") {
      setCurrentUser({
        nom: "Sanou",
        prenom: "Dr. Ibrahim",
        telephone: "76 12 34 56",
        role: "admin",
        roleLabel: "Docteur Gynécologue (CHU Bogodogo)",
        structureName: "CHU de Bogodogo",
        adminType: "doctor",
        speciality: "Gynécologue-Obstétricien",
      });
      notify("Profil actif : 🩺 Docteur (Entraînement de Rose IA & Orientation).");
    } else if (type === "association") {
      setCurrentUser({
        nom: "Sawadogo",
        prenom: "Dr. Salif",
        telephone: "76 50 33 44",
        role: "admin",
        roleLabel: "Admin Association (ABAC)",
        structureName: "ABAC Burkina",
        adminType: "association",
      });
      notify("Profil actif : 🎗️ Admin Association (Annonces & Dons Orange Money).");
    } else {
      setCurrentUser({
        nom: "Ouedraogo",
        prenom: "Aminata",
        telephone: "70 12 34 56",
        role: "user",
        roleLabel: "Utilisatrice",
      });
      notify("Profil actif : 👩 Utilisatrice standard.");
    }
    setShowAuthModal(false);
  };

  // Modération Superadmin : structures
  const handleApproveRegistration = (id: number) => {
    setPendingRegistrations((prev) =>
      prev.map((reg) => (reg.id === id ? { ...reg, status: "approved" } : reg)),
    );
    notify("Structure validée avec succès par le Superadmin !");
  };

  const handleRejectRegistration = (id: number) => {
    setPendingRegistrations((prev) =>
      prev.map((reg) => (reg.id === id ? { ...reg, status: "rejected" } : reg)),
    );
    notify("Demande d'inscription refusée.");
  };

  // Modération Superadmin : annonces
  const handleApproveAnnouncement = (id: number) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "approved", badge: "Validée ✓", badgeColor: "bg-emerald-100 text-emerald-800" } : a)),
    );
    notify("Annonce validée par le Superadmin ! Elle est désormais visible publiquement.");
  };

  const handleRejectAnnouncement = (id: number) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "rejected", badge: "Refusée", badgeColor: "bg-rose-100 text-rose-800" } : a)),
    );
    notify("Annonce refusée.");
  };

  /**
   * Publication d'une annonce par un Admin (en attente de validation Superadmin)
   */
  const handlePublishAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      notify("Veuillez renseigner le titre et le contenu de l'annonce.");
      return;
    }

    const created: PartnerAnnouncement = {
      id: Date.now(),
      title: newAnnouncement.title,
      author: currentUser?.structureName || newAnnouncement.author || "Structure Partenaire",
      authorType: newAnnouncement.authorType,
      city: newAnnouncement.city,
      date: newAnnouncement.date,
      month: newAnnouncement.month || "Octobre 2026",
      badge: "En attente validation",
      badgeColor: "bg-amber-100 text-amber-900",
      content: newAnnouncement.content,
      contact: newAnnouncement.contact || currentUser?.telephone || "+226 70 00 00 00",
      likes: 0,
      status: "pending_validation", // En attente obligatoire de validation du Superadmin
      submittedBy: currentUser ? `${currentUser.prenom} ${currentUser.nom}` : "Admin",
      submittedAt: "Aujourd'hui",
    };

    setAnnouncements((prev) => [created, ...prev]);
    setShowNewAnnouncementModal(false);
    setNewAnnouncement({
      title: "",
      author: "",
      authorType: "Association",
      city: "Ouagadougou",
      date: "Samedi 24 Octobre 2026",
      month: "Octobre 2026",
      badge: "Sensibilisation",
      badgeColor: "bg-pink-100 text-pink-800",
      content: "",
      contact: "",
    });
    notify("Annonce soumise ! Elle sera diffusée publiquement dès validation par le Superadmin.");
  };

  /**
   * Sauvegarde des modifications du centre de santé
   */
  const handleSaveCenterUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!centerUpdateData) return;

    setCenters((prev) =>
      prev.map((c) => (c.id === centerUpdateData.id ? { ...centerUpdateData, lastUpdate: "À l'instant par l'administrateur" } : c)),
    );
    notify(`Les données de ${centerUpdateData.shortName} sont actualisées en direct sur la carte.`);
    setShowCenterUpdateModal(false);
  };

  /**
   * Entraînement de Rose IA par un docteur
   */
  const handleDoctorTeachAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorTeachTopic.trim() || !doctorTeachContent.trim()) {
      notify("Veuillez préciser le sujet clinique et l'explication.");
      return;
    }

    const newKnowledge: MedicalKnowledge = {
      id: Date.now(),
      doctorName: currentUser ? `${currentUser.prenom} ${currentUser.nom}` : "Dr. Partenaire",
      speciality: currentUser?.speciality || "Médecin Spécialiste",
      topic: doctorTeachTopic,
      advice: doctorTeachContent,
      date: "Aujourd'hui",
      verified: true,
    };

    setClinicalKnowledgeList((prev) => [newKnowledge, ...prev]);

    setRoseMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: `[Supervision Clinique] ${doctorTeachTopic} : ${doctorTeachContent}`,
        time: "À l'instant",
      },
      {
        sender: "rose",
        text: `Bien reçu ${newKnowledge.doctorName} ! J'ai intégré cette recommandation médicale à ma base clinique PagLaafi pour orienter les patientes.`,
        englishText: `Acknowledged ${newKnowledge.doctorName}! This clinical guideline is now saved in my PagLaafi knowledge base.`,
        time: "À l'instant",
      },
    ]);

    setDoctorTeachTopic("");
    setDoctorTeachContent("");
    setShowDoctorTrainModal(false);
    notify("Connaissance clinique enregistrée dans Rose IA avec succès !");
  };

  /**
   * Recommander et orienter un patient selon l'urgence
   */
  const handleCreatePatientOrientation = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `ORIENT-BF-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedOrientationCode(code);
    notify(`Fiche d'orientation ${code} générée avec succès.`);
  };

  /**
   * Envoi de message à Rose IA
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

    const lower = textToSend.toLowerCase();
    let responseKey: "mal" | "prix" | "boule" | "default" = "default";
    if (lower.includes("mal") || lower.includes("douleur") || lower.includes("peur") || lower.includes("hurt") || lower.includes("pain")) {
      responseKey = "mal";
    } else if (lower.includes("prix") || lower.includes("coût") || lower.includes("fcfa") || lower.includes("price") || lower.includes("cost")) {
      responseKey = "prix";
    } else if (lower.includes("boule") || lower.includes("kyste") || lower.includes("nodule") || lower.includes("lump")) {
      responseKey = "boule";
    }

    const aiAnswer = roseKnowledge[responseKey];
    window.setTimeout(() => {
      setRoseMessages((prev) => [
        ...prev,
        {
          sender: "rose",
          text: aiAnswer.fr,
          englishText: aiAnswer.en,
          mooreText: aiAnswer.moore,
          dioulaText: aiAnswer.dioula,
          time: "Maintenant",
        },
      ]);
    }, 600);
  };

  /**
   * Processus Don Orange Money (avec support Don Anonyme Chiffré)
   */
  const handleStartDonationProcess = () => {
    const effectiveAmount = customDonationAmount ? Number(customDonationAmount) : donationAmount;
    if (!effectiveAmount || effectiveAmount < 500) {
      notify("Le montant minimum d'un don solidaire est de 500 FCFA.");
      return;
    }
    if (!orangeMoneyPhone || orangeMoneyPhone.trim().length < 8) {
      notify("Veuillez renseigner un numéro Orange Money Burkina valide.");
      return;
    }
    setDonationStep("confirm");
  };

  const handleConfirmOrangeMoney = () => {
    setDonationStep("otp");
    notify("Demande USSD Orange Money envoyée (#144*4*6#). Entrez votre code.");
  };

  const handleValidateOrangeMoneyOTP = () => {
    const prefix = isAnonymousDonation ? "OM-ANON" : "OM-BF";
    const ref = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
    setLastDonationId(ref);
    setDonationStep("success");
    notify(`Paiement de ${customDonationAmount || donationAmount} FCFA validé. Reçu : ${ref}`);
  };

  /**
   * Filtrage des centres de santé
   */
  const filteredCenters = useMemo(() => {
    return centers.filter((center) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        `${center.name} ${center.place} ${center.city}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && center.status === "available") ||
        (statusFilter === "free" && center.exams.some((e) => e.free));
      const matchesCity = cityFilter === "all" || center.city === cityFilter;
      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [centers, searchQuery, statusFilter, cityFilter]);

  /**
   * Filtrage des annonces selon le mois en cours et le profil
   */
  const displayedAnnouncements = useMemo(() => {
    if (announcementsFilter === "my") {
      return announcements.filter(
        (a) => a.submittedBy === currentUser?.structureName || a.submittedBy === `${currentUser?.prenom} ${currentUser?.nom}`,
      );
    }
    if (announcementsFilter === "month") {
      return announcements.filter((a) => a.month === "Octobre 2026" && a.status === "approved");
    }
    return announcements.filter((a) => a.status === "approved");
  }, [announcements, announcementsFilter, currentUser]);

  return (
    <main
      className="min-h-screen w-full bg-[#f6ecef] text-[#331c28] antialiased"
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
          50% { transform: scale(1.4); opacity: 0.3; }
        }
        .ph-pulse { animation: ph-pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>

      {/* Cadre Smartphone Mobile-First */}
      <div className="relative mx-auto flex h-[100dvh] w-full max-w-[440px] flex-col overflow-hidden bg-[#fffbfa] shadow-[0_28px_80px_rgba(93,39,61,.18)] sm:h-[min(900px,96dvh)] sm:rounded-[36px] sm:border sm:border-white/90">

        {/* ==================================================================== */}
        {/* ÉCRAN DE DÉMARRAGE (SPLASH SCREEN) : LOGO & POWERED BY ROSE IA       */}
        {/* ==================================================================== */}
        {showSplash && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#fff8fa] via-[#faedf1] to-[#f7e4eb] p-8 text-center ph-enter sm:rounded-[36px]">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-[#fde9ef] ph-pulse absolute -inset-2" />
                <img
                  src="/images/pinkhub-mvp-paglaafi.png"
                  alt="Logo PagLaafi"
                  className="relative h-28 w-28 object-contain mix-blend-multiply drop-shadow-md"
                />
              </div>

              <h1 className="ph-display mt-5 text-[32px] font-bold tracking-tight text-[#472738]">
                PagLaafi
              </h1>
              <p className="mt-1 text-xs font-semibold text-[#8e4966]">
                Dépistage & Santé du sein au Burkina Faso
              </p>
            </div>

            <div className="pb-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e8c0ce] bg-white/80 px-4 py-1.5 text-xs font-bold text-[#79344f] shadow-sm">
                <Sparkles size={15} className="text-amber-500 animate-spin" />
                <span>Powered by Rose IA</span>
              </div>
              <button
                onClick={() => setShowSplash(false)}
                className="mt-3 block text-[11px] font-semibold text-[#9b657a] hover:underline"
              >
                Accéder directement →
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* BARRE LATÉRALE (SIDEBAR)                                             */}
        {/* ==================================================================== */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm sm:absolute sm:rounded-[36px]"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="relative flex h-full w-[84%] max-w-[325px] flex-col bg-[#fffaf9] p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/images/pinkhub-mvp-paglaafi.png"
                    alt="Logo PagLaafi"
                    className="h-10 w-10 object-contain mix-blend-multiply"
                  />
                  <div>
                    <h2 className="ph-display text-lg font-bold text-[#472738]">PagLaafi</h2>
                    <p className="text-[10px] font-medium text-[#92546e]">Burkina Faso</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full text-[#815568] hover:bg-[#f8e7ec]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Statut de profil dans le menu avec icône adaptée */}
              {(() => {
                const drawerIdentity = getProfileIdentity(currentUser);
                return (
                  <div className="mt-3 rounded-2xl bg-[#f9edf1] p-3 text-xs border border-[#f0d8e1]">
                    {currentUser ? (
                      <div className="flex items-center gap-3">
                        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${drawerIdentity.bg} ${drawerIdentity.text} border ${drawerIdentity.border} shadow-xs`}>
                          {drawerIdentity.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${drawerIdentity.badgeBg}`}>
                            {currentUser.roleLabel}
                          </span>
                          <p className="mt-0.5 font-bold text-[#472738] truncate">{currentUser.prenom} {currentUser.nom}</p>
                          <p className="text-[10px] text-[#7d5d6c] truncate">{currentUser.telephone}</p>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setSidebarOpen(false); setAuthMode("login"); }}
                        className="flex w-full items-center justify-between font-bold text-[#913b5b]"
                      >
                        <span className="flex items-center gap-2">
                          <User size={16} /> Se connecter / Créer un compte
                        </span>
                        <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Raccourci Superadmin National */}
              {currentUser?.role === "superadmin" && (
                <div className="mt-2.5">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setShowSuperadminModal(true);
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-purple-900 px-3 py-2 text-xs font-bold text-white shadow"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldAlert size={15} className="text-amber-300" /> Panneau Superadmin
                    </span>
                    <span className="rounded-full bg-amber-400 px-1.5 py-0.2 text-[9px] font-extrabold text-purple-950">
                      {announcements.filter((a) => a.status === "pending_validation").length + pendingRegistrations.filter((r) => r.status === "pending").length}
                    </span>
                  </button>
                </div>
              )}

              {/* Tableau de bord statistique pour TOUS les administrateurs */}
              {(currentUser?.role === "admin" || currentUser?.role === "superadmin") && (
                <div className="mt-2">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setShowAdminDashboardModal(true);
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-[#522538] px-3 py-2 text-xs font-bold text-white shadow"
                  >
                    <span className="flex items-center gap-2">
                      <BarChart3 size={15} className="text-rose-300" /> Tableau de Bord Admin
                    </span>
                    <span className="text-[9px] font-semibold text-rose-200">Stats</span>
                  </button>
                </div>
              )}

              {/* Entraînement de Rose IA pour docteurs */}
              {currentUser?.role === "admin" && currentUser?.adminType === "doctor" && (
                <div className="mt-2">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setShowDoctorTrainModal(true);
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-blue-900 px-3 py-2 text-xs font-bold text-white shadow"
                  >
                    <span className="flex items-center gap-2">
                      <GraduationCap size={15} className="text-amber-300" /> Entraîner Rose IA (Docteur)
                    </span>
                    <span className="rounded-full bg-blue-700 px-1.5 py-0.5 text-[9px]">IA</span>
                  </button>
                </div>
              )}

              {/* Orientation patiente */}
              {currentUser?.role === "admin" && (currentUser?.adminType === "doctor" || currentUser?.adminType === "center") && (
                <div className="mt-2">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setShowOrientationModal(true);
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-emerald-800 px-3 py-2 text-xs font-bold text-white shadow"
                  >
                    <span className="flex items-center gap-2">
                      <FileText size={15} className="text-amber-300" /> Orienter une Patiente
                    </span>
                    <span className="text-[9px] font-semibold text-emerald-200">Urgence</span>
                  </button>
                </div>
              )}

              {/* Navigation de la barre latérale */}
              <nav className="mt-3 space-y-1 flex-1 overflow-y-auto text-xs">
                <button
                  onClick={() => { setSection("Accueil"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 font-semibold ${section === "Accueil" ? "bg-[#f5e3e8] text-[#a14364]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <Heart size={17} /> <span>Accueil</span>
                </button>

                <button
                  onClick={() => { setSection("Centres"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 font-semibold ${section === "Centres" ? "bg-[#f5e3e8] text-[#a14364]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <span className="flex items-center gap-3"><MapPin size={17} /> Carte des Soins (OpenStreetMap)</span>
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">En direct</span>
                </button>

                <button
                  onClick={() => { setSection("Calendrier"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 font-semibold ${section === "Calendrier" ? "bg-[#f5e3e8] text-[#a14364]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <span className="flex items-center gap-3"><CalendarDays size={17} /> Règles & Autopalpation</span>
                  <span className="rounded-full bg-pink-100 px-1.5 py-0.5 text-[9px] font-bold text-[#a14364]">Cycle</span>
                </button>

                <button
                  onClick={() => { setSection("Comprendre"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 font-semibold ${section === "Comprendre" ? "bg-[#f5e3e8] text-[#a14364]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <span className="flex items-center gap-3"><BookOpen size={17} /> Comprendre (Français · Anglais · Mooré · Dioula)</span>
                  <span className="rounded-full bg-pink-100 px-1.5 py-0.5 text-[9px] font-bold text-[#a14364]">Audio</span>
                </button>

                <button
                  onClick={() => { setSection("RoseIA"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 font-semibold ${section === "RoseIA" ? "bg-[#f5e3e8] text-[#a14364]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <span className="flex items-center gap-3"><Sparkles size={17} /> Rose IA (Assistance Vocale)</span>
                  <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-900">IA</span>
                </button>

                <button
                  onClick={() => { setSection("Annonces"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 font-semibold ${section === "Annonces" ? "bg-[#f5e3e8] text-[#a14364]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <Megaphone size={17} /> <span>Annonces & Événements</span>
                </button>

                <button
                  onClick={() => { setSection("Accompagnant"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 font-semibold ${section === "Accompagnant" ? "bg-[#f5e3e8] text-[#a14364]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <UserPlus size={17} /> <span>L'Accompagnant (À deux)</span>
                </button>

                {/* Mise à jour centre : réservé aux Admins Centre & Médecins */}
                {currentUser?.role === "admin" && (currentUser?.adminType === "center" || currentUser?.adminType === "doctor") && (
                  <div className="pt-2 border-t border-[#f2e1e6]">
                    <button
                      onClick={() => {
                        setSidebarOpen(false);
                        setCenterUpdateData(centers[0]);
                        setShowCenterUpdateModal(true);
                      }}
                      className="flex w-full items-center gap-2 rounded-2xl border border-dashed border-[#dfb3c1] bg-[#fcf5f7] px-3 py-2 text-left text-xs font-bold text-[#863853]"
                    >
                      <Edit3 size={15} /> Mettre à jour mon centre sur la carte
                    </button>
                  </div>
                )}

                {/* Faire un don solidaire : en bas avec Cœur */}
                <div className="pt-2 border-t border-[#f2e1e6]">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setShowDonationModal(true);
                    }}
                    className="flex w-full items-center justify-between rounded-2xl bg-rose-50 px-3.5 py-2.5 font-bold text-[#a14364] hover:bg-rose-100"
                  >
                    <span className="flex items-center gap-3">
                      <Heart size={17} className="text-[#a14364] fill-[#a14364]" /> Faire un don
                    </span>
                    <span className="text-[10px] text-rose-800">Solidarité</span>
                  </button>
                </div>

                {/* BOUTON SE DÉCONNECTER DU MENU DÉROULANT GAUCHE EXIGÉ */}
                {currentUser && (
                  <div className="pt-2 border-t border-[#f2e1e6]">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 font-bold text-rose-700 hover:bg-rose-100 transition shadow-xs"
                    >
                      <LogOut size={16} className="text-rose-600" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                )}
              </nav>

              {/* Bouton Partage Wi-Fi pour les collègues */}
              <div className="mt-2">
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    setShowWifiModal(true);
                  }}
                  className="flex w-full items-center justify-between rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-emerald-400 hover:bg-slate-700 transition"
                >
                  <span className="flex items-center gap-2">
                    <Globe size={14} className="text-emerald-400" /> Partage Wi-Fi Collègues
                  </span>
                  <span className="text-[10px] text-slate-300">Sans Expo</span>
                </button>
              </div>

              {/* Ligne d'urgence */}
              <div className="mt-2 rounded-2xl bg-[#734059] p-3 text-white">
                <p className="text-[11px] font-bold">Numéro vert national gratuit</p>
                <p className="text-base font-extrabold tracking-wide">80 00 11 22</p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* EN-TÊTE FIXE DU SMARTPHONE AVEC DÉCONNEXION DIRECTE SUR L'ICÔNE      */}
        {/* ==================================================================== */}
        <header className="z-30 flex items-center justify-between border-b border-[#f4e2e7] bg-white/95 px-4 py-2.5 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSidebarOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-full text-[#75475a] hover:bg-[#fbf0f4]"
              aria-label="Ouvrir le menu"
            >
              <Menu size={20} />
            </button>
            <div
              onClick={() => setSection("Accueil")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src="/images/pinkhub-mvp-paglaafi.png"
                alt="Logo PagLaafi"
                className="h-8 w-8 object-contain mix-blend-multiply"
              />
              <span className="ph-display text-lg font-bold text-[#452737]">PagLaafi</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bouton direct Partage Wi-Fi local sans Expo */}
            <button
              onClick={() => setShowWifiModal(true)}
              className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-800 transition hover:bg-emerald-100 shadow-2xs"
              title="Lien Mobile Wi-Fi (Sans Expo)"
            >
              <Globe size={12} className="text-emerald-600" />
              <span>Wi-Fi</span>
            </button>

            {/* Bouton direct Rose IA */}
            <button
              onClick={() => setSection("RoseIA")}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold transition shadow-sm ${section === "RoseIA" ? "bg-[#a14364] text-white" : "border border-[#e7bcc9] bg-[#fbf0f4] text-[#8e3857]"}`}
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>Rose IA</span>
            </button>

            {/* ICÔNE DE PROFIL PERSONNALISÉE POUR TOUS AVEC DÉCONNEXION DIRECTE */}
            {(() => {
              const headerProfileIdentity = getProfileIdentity(currentUser);
              return (
                <div className="relative">
                  <button
                    onClick={() => {
                      if (currentUser) {
                        setShowProfileMenu(!showProfileMenu);
                      } else {
                        setAuthMode("login");
                        setShowProfileMenu(false);
                      }
                    }}
                    className={`relative grid h-10 w-10 place-items-center rounded-full border-2 ${headerProfileIdentity.border} ${headerProfileIdentity.bg} ${headerProfileIdentity.text} shadow-md transition hover:scale-105`}
                    title={currentUser ? `${currentUser.prenom} (${currentUser.roleLabel}) - Cliquez pour gérer` : "Connexion"}
                  >
                    {headerProfileIdentity.icon}
                    <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${headerProfileIdentity.dotColor}`} />
                  </button>

                  {/* Menu Popover Déconnexion Directe */}
                  {showProfileMenu && currentUser && (
                    <div
                      className="ph-enter absolute right-0 top-12 z-50 w-64 rounded-2xl border border-[#ebd4dd] bg-white p-3.5 shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-3 border-b border-[#f5e4ea] pb-3">
                        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${headerProfileIdentity.bg} ${headerProfileIdentity.text} border ${headerProfileIdentity.border} shadow-xs`}>
                          {headerProfileIdentity.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[#452737] text-xs truncate">
                            {currentUser.prenom} {currentUser.nom}
                          </p>
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${headerProfileIdentity.badgeBg}`}>
                            {currentUser.roleLabel}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-[10.5px] text-[#7a5969] space-y-0.5">
                        <p className="flex items-center gap-1.5"><Phone size={12} className="text-[#a14364]" /> {currentUser.telephone}</p>
                        {currentUser.structureName && (
                          <p className="flex items-center gap-1.5"><MapPin size={12} className="text-[#a14364]" /> {currentUser.structureName}</p>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#f7e6ec] space-y-1.5">
                        {/* BOUTON DÉCONNEXION DIRECTE EXIGÉ */}
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-xs"
                        >
                          <LogOut size={14} className="text-rose-600" />
                          <span>Se déconnecter</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </header>

        {/* ==================================================================== */}
        {/* CONTENU PRINCIPAL DES ONGLETS                                        */}
        {/* ==================================================================== */}
        <div className="ph-scroll flex-1 overflow-y-auto pb-6">

          {/* ================================================================== */}
          {/* PAGE GÉNÉRALE DE CONNEXION & INSCRIPTION (SI NON CONNECTÉ)        */}
          {/* ================================================================== */}
          {!currentUser ? (
            <section className="ph-enter px-4 py-5 space-y-4">
              {/* Branding En-tête */}
              <div className="text-center rounded-3xl bg-gradient-to-b from-[#fdf2f5] to-white p-5 border border-[#f3d7e0] shadow-2xs">
                <div className="relative mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-3xl bg-white p-3 shadow-md border border-[#edd1dc]">
                  <img
                    src="/images/pinkhub-mvp-paglaafi.png"
                    alt="Logo PagLaafi"
                    className="h-full w-full object-contain mix-blend-multiply"
                  />
                </div>
                <h2 className="ph-display text-2xl font-bold text-[#452737]">PagLaafi</h2>
                <p className="text-xs text-[#82445e] font-semibold mt-0.5">
                  Plateforme Nationale de Dépistage & Solidarité Cancer du Sein
                </p>
                <div className="mt-2.5 inline-flex items-center gap-2 rounded-full border border-[#e8c0ce] bg-white px-3 py-1 text-[11px] font-bold text-[#79344f] shadow-2xs">
                  <Sparkles size={13} className="text-amber-500" />
                  <span>Burkina Faso · Powered by Rose IA</span>
                </div>
              </div>

              {/* Sélecteur Onglet : Connexion vs Inscription */}
              <div className="grid grid-cols-2 rounded-2xl bg-[#f5e3e8] p-1 text-xs font-bold">
                <button
                  onClick={() => setAuthMode("login")}
                  className={`rounded-xl py-2.5 transition ${authMode === "login" ? "bg-white text-[#a14364] shadow-sm" : "text-[#7b5364]"}`}
                >
                  Se connecter
                </button>
                <button
                  onClick={() => setAuthMode("register")}
                  className={`rounded-xl py-2.5 transition ${authMode === "register" ? "bg-white text-[#a14364] shadow-sm" : "text-[#7b5364]"}`}
                >
                  Créer un compte
                </button>
              </div>

              {/* SI ONGLET CONNEXION */}
              {authMode === "login" && (
                <div className="space-y-4">
                  <form onSubmit={handleLoginSubmit} className="space-y-3 rounded-3xl bg-white p-4 border border-[#edd6df] shadow-xs">
                    <div>
                      <label className="text-[11px] font-bold text-[#452737] block mb-1">
                        Numéro de téléphone (+226)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">
                          🇧🇫 +226
                        </span>
                        <input
                          type="tel"
                          required
                          value={loginForm.telephone}
                          onChange={(e) => setLoginForm({ ...loginForm, telephone: e.target.value })}
                          placeholder="70 12 34 56"
                          className="w-full rounded-xl border border-[#d6a9b9] py-2.5 pl-20 pr-3 text-xs font-semibold text-[#452737] focus:border-[#a14364] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#452737] block mb-1">
                        Mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={loginForm.motDePasse}
                          onChange={(e) => setLoginForm({ ...loginForm, motDePasse: e.target.value })}
                          placeholder="Votre mot de passe"
                          className="w-full rounded-xl border border-[#d6a9b9] p-2.5 pr-10 text-xs text-[#452737] focus:border-[#a14364] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-[#a14364] py-3 text-xs font-bold text-white shadow-md hover:bg-[#8f3956] transition"
                    >
                      Se connecter à mon compte
                    </button>
                  </form>

                  {/* Accès Démo Rapide (1-Clic) pour tester chaque profil */}
                  <div className="rounded-3xl bg-[#fdf5f7] border border-[#f0d4de] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#9a4564] mb-2.5 flex items-center justify-between">
                      <span>Accès Rapide Démo (1-Clic)</span>
                      <span className="text-[9px] font-normal lowercase bg-pink-100 text-[#a14364] px-2 py-0.5 rounded-full">sélectionnez un profil</span>
                    </p>

                    <div className="grid grid-cols-1 gap-2">
                      {[
                        {
                          type: "user" as const,
                          title: "Aminata Ouedraogo",
                          role: "Utilisatrice standard",
                          desc: "Cycle menstruel, autopalpation & dons anonymes",
                          profile: { role: "user" as const, roleLabel: "Utilisatrice" },
                        },
                        {
                          type: "center" as const,
                          title: "Mme Mariam Sawadogo",
                          role: "Admin Centre (CMA Schiphra)",
                          desc: "Mettre à jour le centre sur la carte & stats",
                          profile: { role: "admin" as const, adminType: "center" as const, roleLabel: "Admin Centre" },
                        },
                        {
                          type: "doctor" as const,
                          title: "Dr. Ibrahim Sanou",
                          role: "Docteur (CHU Bogodogo)",
                          desc: "Entraîner Rose IA & Orientation urgente",
                          profile: { role: "admin" as const, adminType: "doctor" as const, roleLabel: "Docteur" },
                        },
                        {
                          type: "association" as const,
                          title: "Dr. Salif Sawadogo",
                          role: "Admin Association (ABAC)",
                          desc: "Annonces du mois en cours & suivi des dons",
                          profile: { role: "admin" as const, adminType: "association" as const, roleLabel: "Admin Asso" },
                        },
                        {
                          type: "superadmin" as const,
                          title: "Alimata Kaboré",
                          role: "Superadmin National",
                          desc: "Modération des annonces & Stats de visites",
                          profile: { role: "superadmin" as const, roleLabel: "Superadmin" },
                        },
                      ].map((p) => {
                        const ident = getProfileIdentity(p.profile as any);
                        return (
                          <button
                            key={p.type}
                            onClick={() => quickLoginAs(p.type)}
                            className="flex items-center gap-3 rounded-2xl bg-white p-2.5 text-left border border-[#ecd5de] hover:border-[#a14364] hover:shadow-2xs transition"
                          >
                            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${ident.bg} ${ident.text} border ${ident.border} shadow-2xs`}>
                              {ident.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-[#452737] truncate">{p.title}</p>
                                <span className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded-full ${ident.badgeBg}`}>
                                  {ident.badgeText}
                                </span>
                              </div>
                              <p className="text-[10px] text-[#7d5668] truncate">{p.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bouton pour tester sans compte */}
                  <div className="text-center pt-1">
                    <button
                      onClick={() => {
                        setCurrentUser({
                          nom: "Visiteur",
                          prenom: "Invité",
                          telephone: "Mode Découverte",
                          role: "user",
                          roleLabel: "Visiteur libre",
                        });
                        notify("Bienvenue en mode découverte libre !");
                      }}
                      className="text-xs font-bold text-[#a14364] hover:underline inline-flex items-center gap-1.5"
                    >
                      <span>Explorer l'application sans compte (Mode Découverte)</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* SI ONGLET INSCRIPTION */}
              {authMode === "register" && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3 rounded-3xl bg-white p-4 border border-[#edd6df] shadow-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-[#452737] block mb-1">Prénom</label>
                      <input
                        type="text"
                        required
                        value={registerForm.prenom}
                        onChange={(e) => setRegisterForm({ ...registerForm, prenom: e.target.value })}
                        className="w-full rounded-xl border border-[#d6a9b9] p-2 text-xs text-[#452737] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#452737] block mb-1">Nom</label>
                      <input
                        type="text"
                        required
                        value={registerForm.nom}
                        onChange={(e) => setRegisterForm({ ...registerForm, nom: e.target.value })}
                        className="w-full rounded-xl border border-[#d6a9b9] p-2 text-xs text-[#452737] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#452737] block mb-1">Numéro de téléphone (+226)</label>
                    <input
                      type="tel"
                      required
                      value={registerForm.telephone}
                      onChange={(e) => setRegisterForm({ ...registerForm, telephone: e.target.value })}
                      placeholder="70 12 34 56"
                      className="w-full rounded-xl border border-[#d6a9b9] p-2 text-xs text-[#452737] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#452737] block mb-1">Type de profil</label>
                    <select
                      value={registerForm.role === "user" ? "user" : registerForm.adminType}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "user") {
                          setRegisterForm({ ...registerForm, role: "user" });
                        } else {
                          setRegisterForm({
                            ...registerForm,
                            role: "admin",
                            adminType: val as AdminType,
                          });
                        }
                      }}
                      className="w-full rounded-xl border border-[#d6a9b9] p-2 text-xs text-[#452737] bg-white focus:outline-none"
                    >
                      <option value="user">👩 Utilisatrice / Patiente</option>
                      <option value="association">🎗️ Association / ONG Partenaire</option>
                      <option value="center">🏥 Centre de Santé</option>
                      <option value="doctor">🩺 Médecin / Docteur</option>
                    </select>
                  </div>

                  {registerForm.role === "admin" && (
                    <div>
                      <label className="text-[11px] font-bold text-[#452737] block mb-1">
                        Nom de la structure / Établissement
                      </label>
                      <input
                        type="text"
                        required
                        value={registerForm.structureName}
                        onChange={(e) => setRegisterForm({ ...registerForm, structureName: e.target.value })}
                        placeholder="Ex: ABAC Burkina, CMA Schiphra..."
                        className="w-full rounded-xl border border-[#d6a9b9] p-2 text-xs text-[#452737] focus:outline-none"
                      />
                      <p className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded-xl mt-1.5 border border-amber-200">
                        ℹ️ Ce profil requiert une validation du Superadmin avant activation complète.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-bold text-[#452737] block mb-1">Mot de passe</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={registerForm.motDePasse}
                        onChange={(e) => setRegisterForm({ ...registerForm, motDePasse: e.target.value })}
                        className="w-full rounded-xl border border-[#d6a9b9] p-2 pr-10 text-xs text-[#452737] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2 text-gray-400 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#452737] block mb-1">Confirmer le mot de passe</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={registerForm.confirmerMotDePasse}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmerMotDePasse: e.target.value })}
                        className="w-full rounded-xl border border-[#d6a9b9] p-2 pr-10 text-xs text-[#452737] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2 text-gray-400 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-[#a14364] py-3 text-xs font-bold text-white shadow-md hover:bg-[#8f3956] transition"
                  >
                    Créer mon compte
                  </button>
                </form>
              )}

              {/* CARTE PARTAGE WI-FI LOCAL POUR LES COLLÈGUES */}
              <div className="rounded-3xl bg-slate-900 text-white p-4 shadow-lg border border-slate-700">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                  <Globe size={15} />
                  <span>Lien Mobile Local (Sans Expo)</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-300">
                  Vos collègues sur le même réseau Wi-Fi peuvent tester l'application directement dans Safari ou Chrome sur leur téléphone :
                </p>
                <div className="mt-2.5 flex items-center justify-between rounded-xl bg-slate-800 p-2 border border-slate-700">
                  <span className="font-mono text-xs font-bold text-emerald-400 select-all">{localShareUrl}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(localShareUrl);
                      notify("Lien local copié dans le presse-papier !");
                    }}
                    className="rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-emerald-500"
                  >
                    Copier
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <>
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
                      {currentUser.prenom} ({currentUser.roleLabel})
                    </span>
                  )}
                </div>

                <h1 className="ph-display relative mt-3 text-[33px] leading-[1.02] tracking-[-.025em] text-[#452637]">
                  Une question ?<br />
                  <span className="text-[#b94e70]">Vous n'êtes pas seule.</span>
                </h1>

                <p className="relative mt-2 text-[13px] leading-[1.6] text-[#745866]">
                  Sachez où l'appareil fonctionne aujourd'hui, suivez votre cycle pour l'autopalpation et trouvez de l'aide près de chez vous.
                </p>

                <div className="relative mt-4 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => { setSection("Centres"); setViewMode("map"); }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#a14364] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[#8f3956]"
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

              {/* 1. CARTE CALENDRIER DU CYCLE & AUTOPALPATION */}
              <div className="px-5 pt-4">
                <div
                  onClick={() => setSection("Calendrier")}
                  className="cursor-pointer rounded-[24px] border border-[#f0d4de] bg-gradient-to-br from-[#fff7f9] to-[#faedf2] p-4 shadow-sm hover:border-[#dfb2c2]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#a14364] text-white shadow-sm">
                        <CalendarDays size={20} />
                      </span>
                      <div>
                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#a14364]">
                          Suivi du cycle & Seins
                        </span>
                        <h3 className="ph-display text-sm font-bold text-[#452737]">
                          Mon Calendrier & Autopalpation
                        </h3>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-[#a14364]" />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-white/90 p-2 border border-[#f3e1e7]">
                      <p className="text-[9px] font-bold text-[#955c71] uppercase">Prochaines règles</p>
                      <p className="font-extrabold text-[#452737]">{cycleInfo.nextPeriodStr}</p>
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
                        <h4 className="ph-display text-sm font-bold text-[#452737]">
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

              {/* 5. FAIRE UN DON SOLIDAIRE : PLACÉ EN BAS DE LA LISTE DE L'ACCUEIL AVEC ICÔNE CŒUR */}
              <div className="px-5 pt-4 pb-2">
                <div
                  onClick={() => setShowDonationModal(true)}
                  className="cursor-pointer rounded-[24px] border-2 border-rose-300 bg-gradient-to-r from-rose-50 via-[#fff8fa] to-[#ffeef3] p-4 shadow-sm hover:border-rose-400 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#a14364] text-white shadow-md">
                        <Heart size={22} className="fill-white" />
                      </span>
                      <div>
                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#a14364]">
                          Solidarité 100% Burkina Faso
                        </span>
                        <h4 className="ph-display text-base font-bold text-[#452737]">
                          Faire un don
                        </h4>
                        <p className="text-[10.5px] text-[#7a5867]">
                          Offrir une mammographie avec option anonyme chiffrée
                        </p>
                      </div>
                    </div>
                    <button className="rounded-full bg-[#a14364] px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-[#8e3856]">
                      Aider →
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 2 : CARTE DES SOINS (OPENSTREETMAP LEAFLET)                 */}
          {/* ------------------------------------------------------------------ */}
          {section === "Centres" && !selectedCenter && (
            <section className="ph-enter px-5 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
                    Temps réel · Burkina Faso
                  </span>
                  <h1 className="ph-display text-[26px] leading-tight text-[#452637]">
                    Carte des soins
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

              {/* Recherche & Filtres */}
              <div className="mt-3 relative">
                <Search size={16} className="absolute left-3.5 top-3 text-[#9f7183]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher centre, ville, examen..."
                  className="w-full rounded-2xl border border-[#ebd8de] bg-white py-2 pl-9 pr-8 text-xs text-[#4b2f3e] focus:border-[#a14364] focus:outline-none"
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
                  onClick={() => {
                    setCityFilter(cityFilter === "Ouagadougou" ? "all" : "Ouagadougou");
                    if (mapInstanceRef.current) mapInstanceRef.current.flyTo([12.3714, -1.5197], 12);
                  }}
                  className={`shrink-0 rounded-full px-2.5 py-1 font-bold ${cityFilter === "Ouagadougou" ? "bg-[#a14364] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  Ouaga
                </button>
                <button
                  onClick={() => {
                    setCityFilter(cityFilter === "Bobo-Dioulasso" ? "all" : "Bobo-Dioulasso");
                    if (mapInstanceRef.current) mapInstanceRef.current.flyTo([11.178, -4.295], 13);
                  }}
                  className={`shrink-0 rounded-full px-2.5 py-1 font-bold ${cityFilter === "Bobo-Dioulasso" ? "bg-[#a14364] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  Bobo
                </button>
                <button
                  onClick={() => {
                    setCityFilter(cityFilter === "Koudougou" ? "all" : "Koudougou");
                    if (mapInstanceRef.current) mapInstanceRef.current.flyTo([12.251, -2.366], 13);
                  }}
                  className={`shrink-0 rounded-full px-2.5 py-1 font-bold ${cityFilter === "Koudougou" ? "bg-[#a14364] text-white" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  Koudougou
                </button>
              </div>

              {/* VRAIE CARTE OPENSTREETMAP LEAFLET GRATUITE ET OPEN-SOURCE */}
              {viewMode === "map" && (
                <div className="mt-2.5">
                  <div className="relative h-[280px] w-full overflow-hidden rounded-[24px] border-2 border-[#e5d0d8] bg-[#f8edf1] shadow-inner">
                    <div ref={mapContainerRef} className="h-full w-full z-10" />

                    <div className="absolute bottom-2 left-2 z-20 flex items-center gap-2 rounded-xl bg-white/90 px-2.5 py-1 text-[9px] font-bold text-[#452737] shadow backdrop-blur-xs">
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Dispo</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Affluence</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Panne</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bouton de mise à jour sur la carte : VISIBLE UNIQUEMENT POUR ADMIN CENTRE OU DOCTEUR */}
              {currentUser?.role === "admin" && (currentUser?.adminType === "center" || currentUser?.adminType === "doctor") && (
                <div className="mt-3">
                  <button
                    onClick={() => {
                      setCenterUpdateData(centers[0]);
                      setShowCenterUpdateModal(true);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#a14364] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#8e3856]"
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
                        <h3 className="ph-display mt-0.5 text-sm font-bold text-[#482839]">{center.name}</h3>
                        <p className="text-[11px] text-[#846b77]">{center.place}</p>
                      </div>
                      <button onClick={() => setSelectedCenter(center)} className="rounded-xl bg-[#faedf1] p-1.5 text-[#a14364]">
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between gap-1 border-t border-[#f4e4e9] pt-2 text-[10px]">
                      <button onClick={() => handlePlayAudio(center.audioMessageFr, "fr")} className="inline-flex items-center gap-1 rounded-full border border-[#e4bfcd] bg-white px-2 py-0.5 font-bold text-[#92405d]">
                        <Volume2 size={11} /> FR
                      </button>
                      <button onClick={() => handlePlayAudio(center.audioMessageEn, "en")} className="inline-flex items-center gap-1 rounded-full border border-[#e4bfcd] bg-white px-2 py-0.5 font-bold text-[#92405d]">
                        <Volume2 size={11} /> EN
                      </button>
                      <button onClick={() => handlePlayAudio(center.audioMessageMoore, "moore")} className="inline-flex items-center gap-1 rounded-full border border-[#e4bfcd] bg-white px-2 py-0.5 font-bold text-[#92405d]">
                        <Volume2 size={11} /> Mooré
                      </button>
                      <button onClick={() => handlePlayAudio(center.audioMessageDioula, "dioula")} className="inline-flex items-center gap-1 rounded-full border border-[#e4bfcd] bg-white px-2 py-0.5 font-bold text-[#92405d]">
                        <Volume2 size={11} /> Dioula
                      </button>
                      <button onClick={() => setSelectedCenter(center)} className="rounded-full bg-[#a14364] px-2.5 py-1 font-bold text-white">
                        Détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET : CALENDRIER, RÈGLES, AUTOPALPATION & RAPPELS               */}
          {/* ------------------------------------------------------------------ */}
          {section === "Calendrier" && !selectedCenter && (
            <section className="ph-enter px-5 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
                Santé intime & Prévention
              </span>
              <h1 className="ph-display text-[26px] leading-tight text-[#452637]">
                Cycle & Autopalpation
              </h1>
              <p className="mt-1 text-xs text-[#795f6d]">
                Suivez vos règles, sachez le moment idéal pour observer vos seins et programmez vos rappels médicaux.
              </p>

              {/* Suivi des règles & cycle */}
              <div className="mt-3.5 rounded-[24px] border border-[#f0d4df] bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#f6e6ec] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#faedf1] text-[#a14364]">
                      <Calendar size={17} />
                    </span>
                    <h3 className="ph-display text-sm font-bold text-[#452737]">Cycle menstruel</h3>
                  </div>
                  <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-[#a14364]">
                    Cycle moyen : {cycleLengthDays} jours
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#725363]">Dernières règles :</label>
                    <input
                      type="date"
                      value={lastPeriodDate}
                      onChange={(e) => setLastPeriodDate(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#ebd6de] p-2 font-semibold text-[#452737] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#725363]">Durée du cycle :</label>
                    <select
                      value={cycleLengthDays}
                      onChange={(e) => setCycleLengthDays(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-[#ebd6de] p-2 font-semibold text-[#452737] text-xs"
                    >
                      {[25, 26, 27, 28, 29, 30, 31, 32].map((days) => (
                        <option key={days} value={days}>{days} jours</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-[#fdf5f7] border border-[#f5dfe6] p-3 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#91586e]">Estimation prochaines règles :</span>
                    <p className="text-sm font-bold text-[#452737]">{cycleInfo.nextPeriodStr}</p>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-[#a14364] shadow-xs">
                    Dans {Math.max(1, Math.round((new Date(lastPeriodDate).getTime() + cycleLengthDays * 86400000 - Date.now()) / 86400000))} j
                  </span>
                </div>
              </div>

              {/* Fenêtre d'autopalpation recommandée par l'OMS */}
              <div className="mt-3.5 rounded-[24px] border-2 border-emerald-300 bg-gradient-to-br from-[#f2fbf6] to-[#e7f7ee] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[9.5px] font-bold text-white shadow-xs">
                    <CheckCheck size={13} /> Recommandation médicale
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800">
                    {cycleInfo.isOptimalWindow ? "🟢 Période Idéale Aujourd'hui" : "Prochaine période"}
                  </span>
                </div>

                <h3 className="ph-display mt-2 text-base font-bold text-[#204030]">
                  Fenêtre d'autopalpation : {cycleInfo.autopalpWindowStr}
                </h3>
                <p className="mt-1 text-xs text-[#39614c] leading-relaxed">
                  Le meilleur moment pour observer vos seins est <strong>2 à 5 jours après la fin des règles</strong>, quand les tissus mammaires sont souples et non douloureux.
                </p>

                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="rounded-xl bg-white/90 p-2 border border-emerald-200">
                    <b>1. Devant le miroir :</b> Observez bras le long du corps, puis levés (recherchez une fossette ou un pli).
                  </div>
                  <div className="rounded-xl bg-white/90 p-2 border border-emerald-200">
                    <b>2. Palpation circulaire :</b> Avec la pulpe des 3 doigts, faites des petits cercles fermes de l'extérieur vers le centre.
                  </div>
                  <div className="rounded-xl bg-white/90 p-2 border border-emerald-200">
                    <b>3. Sous l'aisselle :</b> Vérifiez le creux du bras pour vous assurer de l'absence de nodule ou ganglion dur.
                  </div>
                  <div className="rounded-xl bg-white/90 p-2 border border-emerald-200">
                    <b>4. Pression douce :</b> Pincez légèrement le mamelon pour vérifier l'absence d'écoulement anormal.
                  </div>
                </div>

                <button
                  onClick={() => {
                    setAutopalpationDoneThisMonth(true);
                    setLastAutopalpationDate(new Date().toLocaleDateString("fr-FR"));
                    notify("Bravo ! Autopalpation enregistrée pour ce mois-ci.");
                  }}
                  className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-800"
                >
                  <Check size={16} /> J'ai réalisé mon autopalpation ce mois-ci ({lastAutopalpationDate})
                </button>
              </div>

              {/* Rappels personnalisés */}
              <div className="mt-3.5 rounded-[24px] border border-[#f0d4df] bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#f6e6ec] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#faedf1] text-[#a14364]">
                      <Bell size={17} />
                    </span>
                    <h3 className="ph-display text-sm font-bold text-[#452737]">Mes rappels de santé</h3>
                  </div>
                  <button
                    onClick={() => setShowNewReminderForm(!showNewReminderForm)}
                    className="text-xs font-bold text-[#a14364] hover:underline"
                  >
                    + Ajouter
                  </button>
                </div>

                {showNewReminderForm && (
                  <div className="mt-3 rounded-2xl bg-[#fdf5f7] p-3 text-xs space-y-2 border border-[#f2dbe3]">
                    <p className="font-bold text-[#623c4d]">Nouveau rappel médical :</p>
                    <input
                      type="text"
                      placeholder="Titre du rappel (ex: Échographie Schiphra)"
                      value={newReminderTitle}
                      onChange={(e) => setNewReminderTitle(e.target.value)}
                      className="w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Date et heure (ex: 28 Octobre à 10h)"
                      value={newReminderDate}
                      onChange={(e) => setNewReminderDate(e.target.value)}
                      className="w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                    />
                    <div className="flex gap-2">
                      <select
                        value={newReminderType}
                        onChange={(e) => setNewReminderType(e.target.value as any)}
                        className="rounded-xl border border-[#e4cfd6] p-1.5 text-xs font-semibold"
                      >
                        <option value="screening">Dépistage</option>
                        <option value="appointment">Rendez-vous</option>
                        <option value="treatment">Traitement</option>
                      </select>
                      <button
                        onClick={() => {
                          if (!newReminderTitle) return;
                          setReminders((prev) => [
                            ...prev,
                            { id: Date.now(), title: newReminderTitle, date: newReminderDate || "Bientôt", type: newReminderType, active: true },
                          ]);
                          setNewReminderTitle("");
                          setNewReminderDate("");
                          setShowNewReminderForm(false);
                          notify("Rappel ajouté avec succès.");
                        }}
                        className="flex-1 rounded-xl bg-[#a14364] py-1.5 font-bold text-white text-xs"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-3 space-y-2 text-xs">
                  {reminders.map((r) => (
                    <div key={r.id} className="flex items-center justify-between rounded-xl border border-[#f2e2e7] p-2.5 bg-[#fffafc]">
                      <div className="flex items-center gap-2.5">
                        <span className={`grid h-7 w-7 place-items-center rounded-lg ${r.type === "screening" ? "bg-purple-100 text-purple-800" : r.type === "appointment" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"}`}>
                          <Clock size={14} />
                        </span>
                        <div>
                          <p className="font-bold text-[#452737]">{r.title}</p>
                          <p className="text-[10px] text-[#865d70]">{r.date}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                        Actif ✓
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 3 : COMPRENDRE (FRANÇAIS, ENGLISH, MOORÉ & DIOULA)          */}
          {/* ------------------------------------------------------------------ */}
          {section === "Comprendre" && !selectedCenter && (
            <section className="ph-enter px-5 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
                Guide vocal & écrit en 4 langues
              </span>
              <h1 className="ph-display text-[26px] leading-tight text-[#452637]">
                Comprendre, pas à pas
              </h1>
              <p className="mt-1 text-xs text-[#795f6d]">
                Des repères simples pour s'informer sans jargon, avec écoute vocale en Français, English, Mooré ou Dioula.
              </p>

              {/* Lecteur Audio Multi-Langues Interactif */}
              <div className="mt-3.5 overflow-hidden rounded-[26px] bg-[#734059] p-4 text-white shadow-md">
                <div className="flex items-center justify-between text-[10px] text-white/75">
                  <span className="inline-flex items-center gap-1 font-bold uppercase tracking-wider">
                    <Headphones size={13} /> Lecteur Audio PagLaafi
                  </span>
                  <div className="flex rounded-full bg-white/15 p-0.5">
                    <button
                      onClick={() => setSpeechLanguage("fr")}
                      className={`rounded-full px-2 py-0.5 font-bold transition ${speechLanguage === "fr" ? "bg-white text-[#734059]" : "text-white/80"}`}
                    >
                      FR
                    </button>
                    <button
                      onClick={() => setSpeechLanguage("en")}
                      className={`rounded-full px-2 py-0.5 font-bold transition ${speechLanguage === "en" ? "bg-white text-[#734059]" : "text-white/80"}`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setSpeechLanguage("moore")}
                      className={`rounded-full px-2 py-0.5 font-bold transition ${speechLanguage === "moore" ? "bg-white text-[#734059]" : "text-white/80"}`}
                    >
                      Mooré
                    </button>
                    <button
                      onClick={() => setSpeechLanguage("dioula")}
                      className={`rounded-full px-2 py-0.5 font-bold transition ${speechLanguage === "dioula" ? "bg-white text-[#734059]" : "text-white/80"}`}
                    >
                      Dioula
                    </button>
                  </div>
                </div>

                <h2 className="ph-display mt-2.5 text-lg leading-snug">
                  {lessons[activeLesson].title}
                </h2>

                <p className="mt-1.5 text-xs text-white/85 leading-relaxed">
                  {speechLanguage === "en"
                    ? lessons[activeLesson].englishSummary
                    : speechLanguage === "moore"
                      ? lessons[activeLesson].mooreSummary
                      : speechLanguage === "dioula"
                        ? lessons[activeLesson].dioulaSummary
                        : lessons[activeLesson].summary}
                </p>

                {/* Progression Audio */}
                <div className="mt-3">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-[#f6c2d1] transition-all duration-300"
                      style={{ width: `${audioProgress}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[9px] text-white/70">
                    <span>{isPlaying ? `Lecture en cours (${speechLanguage.toUpperCase()})...` : "Prêt à écouter"}</span>
                    <span>{lessons[activeLesson].duration}</span>
                  </div>
                </div>

                {/* Contrôles du Lecteur */}
                <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-2.5">
                  <button
                    onClick={() => {
                      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                      setIsPlaying(false);
                      setAudioProgress(0);
                    }}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                    title="Réinitialiser"
                  >
                    <RotateCcw size={15} />
                  </button>

                  <button
                    onClick={() => {
                      const text =
                        speechLanguage === "en"
                          ? lessons[activeLesson].englishFullText
                          : speechLanguage === "moore"
                            ? lessons[activeLesson].mooreSummary
                            : speechLanguage === "dioula"
                              ? lessons[activeLesson].dioulaSummary
                              : lessons[activeLesson].fullText;
                      handlePlayAudio(text, speechLanguage);
                    }}
                    className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#734059] shadow hover:bg-white/90"
                  >
                    {isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
                    <span>{isPlaying ? "Pause" : `Écouter en ${speechLanguage === "fr" ? "Français" : speechLanguage === "en" ? "English" : speechLanguage === "moore" ? "Mooré" : "Dioula"}`}</span>
                  </button>

                  <span className="text-[10px] font-semibold text-white/80">
                    {speechLanguage.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Texte intégral */}
              <div className="mt-3 rounded-2xl border border-[#eedde2] bg-white p-3.5 text-xs text-[#5b3c4c] leading-relaxed">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#a14364] mb-1">
                  Explication médicale détaillée ({speechLanguage === "en" ? "English" : "Français"}) :
                </span>
                {speechLanguage === "en" ? lessons[activeLesson].englishFullText : lessons[activeLesson].fullText}
              </div>

              {/* Liste des autres leçons */}
              <div className="mt-4 space-y-2">
                {lessons.map((lesson, idx) => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setActiveLesson(idx);
                      if (isPlaying) {
                        const text =
                          speechLanguage === "en"
                            ? lesson.englishFullText
                            : speechLanguage === "moore"
                              ? lesson.mooreSummary
                              : speechLanguage === "dioula"
                                ? lesson.dioulaSummary
                                : lesson.fullText;
                        handlePlayAudio(text, speechLanguage);
                      }
                    }}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${activeLesson === idx ? "border-[#cf869f] bg-[#fbf0f4]" : "border-[#f0dfe4] bg-white"}`}
                  >
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${activeLesson === idx ? "bg-[#a14364] text-white" : "bg-[#f9e9ed] text-[#a14364]"}`}>
                      <BookOpen size={16} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="block text-xs font-bold text-[#4c2d3c]">{lesson.title}</span>
                      <span className="text-[10px] text-[#8e6e7c]">{lesson.category} · {lesson.duration}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 4 : ROSE IA (ASSISTANTE VOCALE DISPONIBLE)                   */}
          {/* ------------------------------------------------------------------ */}
          {section === "RoseIA" && !selectedCenter && (
            <section className="ph-enter flex flex-col h-full px-5 pt-3">
              <div className="rounded-[24px] bg-gradient-to-r from-[#734059] to-[#924b6d] p-4 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/20 text-white">
                        <Sparkles size={20} className="text-amber-300" />
                      </span>
                      {roseSpeaking && (
                        <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-white ph-pulse" />
                      )}
                    </div>
                    <div>
                      <h2 className="ph-display text-base font-bold">Rose IA</h2>
                      <p className="text-[10px] text-white/80">Assistance vocale · Français · English · Mooré · Dioula</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePlayAudio("Bonjour, je suis Rose IA. Posez-moi votre question en touchant le micro.", "fr")}
                    className="rounded-full bg-white/20 p-2 text-white"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>

                {currentUser?.role === "admin" && currentUser?.adminType === "doctor" && (
                  <button
                    onClick={() => setShowDoctorTrainModal(true)}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-400 py-1.5 text-xs font-bold text-purple-950 shadow-sm"
                  >
                    <GraduationCap size={15} /> 🩺 Mode Médecin : Entraîner Rose IA
                  </button>
                )}
              </div>

              <div className="ph-scroll mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                {["Est-ce que ça fait mal ?", "Combien coûte le dépistage ?", "J'ai senti une petite boule"].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSendRoseMessage(q)}
                    className="shrink-0 rounded-full border border-[#e4cad3] bg-white px-2.5 py-1 text-[#863b55] font-semibold"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="mt-3 space-y-2.5 flex-1 overflow-y-auto">
                {roseMessages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-[20px] p-3 text-xs leading-relaxed shadow-sm ${msg.sender === "user" ? "bg-[#a14364] text-white rounded-tr-sm" : "bg-white text-[#452737] border border-[#f0dfe4] rounded-tl-sm"}`}
                    >
                      <p>{msg.text}</p>
                      {msg.englishText && (
                        <div className="mt-1.5 border-t border-[#f4e4e9] pt-1 text-[10px] italic text-[#6f4b5d]">
                          <strong>English :</strong> {msg.englishText}
                        </div>
                      )}
                      {msg.mooreText && (
                        <div className="mt-1 border-t border-[#f4e4e9] pt-1 text-[10px] italic text-[#845068]">
                          <strong>Mooré :</strong> {msg.mooreText}
                        </div>
                      )}
                      {msg.dioulaText && (
                        <div className="mt-1 text-[10px] italic text-[#845068]">
                          <strong>Dioula :</strong> {msg.dioulaText}
                        </div>
                      )}
                    </div>
                    {msg.sender === "rose" && (
                      <div className="mt-0.5 flex gap-2">
                        <button
                          onClick={() => handlePlayAudio(msg.text, "fr")}
                          className="flex items-center gap-1 text-[10px] font-bold text-[#a14364] hover:underline"
                        >
                          <Volume2 size={12} /> Écouter FR
                        </button>
                        {msg.englishText && (
                          <button
                            onClick={() => handlePlayAudio(msg.englishText!, "en")}
                            className="flex items-center gap-1 text-[10px] font-bold text-[#a14364] hover:underline"
                          >
                            <Volume2 size={12} /> EN
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-2.5 rounded-2xl border border-[#e5ccd5] bg-white p-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      notify("Micro activé. Posez votre question à voix haute...");
                      setIsRecordingVoice(true);
                      window.setTimeout(() => {
                        setIsRecordingVoice(false);
                        handleSendRoseMessage("Est-ce que la mammographie fait mal ?");
                      }, 2000);
                    }}
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition ${isRecordingVoice ? "bg-rose-600 text-white ph-pulse" : "bg-[#f8e7ec] text-[#a14364]"}`}
                  >
                    <Mic size={17} />
                  </button>
                  <input
                    type="text"
                    value={roseInput}
                    onChange={(e) => setRoseInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendRoseMessage()}
                    placeholder={isRecordingVoice ? "Rose IA vous écoute..." : "Écrivez ou appuyez sur le micro..."}
                    className="flex-1 bg-transparent text-xs text-[#452737] outline-none"
                  />
                  <button
                    onClick={() => handleSendRoseMessage()}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#a14364] text-white"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 5 : FAIRE UN DON (AVEC OPTION ANONYME CHIFFRÉE)             */}
          {/* ------------------------------------------------------------------ */}
          {section === "FaireUnDon" && !selectedCenter && (
            <section className="ph-enter px-5 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
                Solidarité · Burkina Faso
              </span>
              <h1 className="ph-display text-[26px] leading-tight text-[#452637]">
                Faire un don
              </h1>
              <p className="mt-1 text-xs text-[#795f6d]">
                Votre contribution finance directement le dépistage et les soins de femmes sans revenus au Burkina Faso.
              </p>

              <div className="mt-3.5 rounded-[26px] border-2 border-rose-300 bg-gradient-to-br from-[#fff7f9] to-[#ffedf3] p-5 shadow-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#a14364] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                  <Heart size={13} className="fill-white" /> 100% Solidaire & Sécurisé
                </span>

                <h3 className="ph-display mt-2 text-lg font-bold text-[#3d2430]">
                  Offrir un examen de dépistage
                </h3>
                <p className="mt-1 text-xs text-[#684a58] leading-relaxed">
                  Grâce à votre don de <strong>2 500 à 5 000 FCFA</strong>, une mère de famille vulnérable bénéficie immédiatement d'une consultation et d'une mammographie complète.
                </p>

                <div className="mt-4">
                  <button
                    onClick={() => setShowDonationModal(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#a14364] py-3 text-xs font-bold text-white shadow hover:bg-[#8f3956] transition"
                  >
                    <Heart size={15} className="fill-white" /> Commencer mon don maintenant
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="ph-display text-sm font-bold text-[#452737]">Associations partenaires éligibles</h3>
                <div className="mt-2 space-y-2">
                  {partnerAssociations.map((assoc) => (
                    <div key={assoc.id} className="rounded-2xl border border-[#eedde2] bg-white p-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#452737]">{assoc.name} ({assoc.acronym})</span>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">Vérifié</span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#785b6a]">{assoc.mission}</p>
                      <button
                        onClick={() => {
                          setSelectedAssociation(assoc);
                          setShowDonationModal(true);
                        }}
                        className="mt-2 font-bold text-[#a14364] hover:underline block text-[10.5px]"
                      >
                        Faire un don à {assoc.acronym} →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET ANNONCES (CONSULTATION MOIS EN COURS & PUBLICATION ADMIN)   */}
          {/* ------------------------------------------------------------------ */}
          {section === "Annonces" && !selectedCenter && (
            <section className="ph-enter px-5 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
                    Actualités & Partenaires
                  </span>
                  <h1 className="ph-display text-[26px] leading-tight text-[#452637]">
                    Annonces
                  </h1>
                </div>
                {/* Bouton de publication pour les partenaires et soignants */}
                {(currentUser?.role === "admin" || currentUser?.role === "superadmin") && (
                  <button
                    onClick={() => setShowNewAnnouncementModal(true)}
                    className="rounded-full bg-[#a14364] px-3.5 py-1 text-xs font-bold text-white shadow hover:bg-[#8e3856]"
                  >
                    + Publier
                  </button>
                )}
              </div>

              {/* FILTRES D'ANNONCES : MOIS EN COURS / TOUTES / MES ANNONCES (ADMIN) */}
              <div className="mt-3 flex items-center gap-1.5 text-[11px]">
                <button
                  onClick={() => setAnnouncementsFilter("month")}
                  className={`rounded-full px-3 py-1 font-bold transition ${announcementsFilter === "month" ? "bg-[#a14364] text-white shadow-xs" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  📅 Mois en cours (Octobre 2026)
                </button>
                <button
                  onClick={() => setAnnouncementsFilter("all")}
                  className={`rounded-full px-3 py-1 font-bold transition ${announcementsFilter === "all" ? "bg-[#a14364] text-white shadow-xs" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  Toutes ({announcements.filter((a) => a.status === "approved").length})
                </button>
                {(currentUser?.role === "admin" || currentUser?.role === "superadmin") && (
                  <button
                    onClick={() => setAnnouncementsFilter("my")}
                    className={`rounded-full px-3 py-1 font-bold transition ${announcementsFilter === "my" ? "bg-[#a14364] text-white shadow-xs" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                  >
                    Mes soumissions ({announcements.filter((a) => a.submittedBy === currentUser?.structureName || a.submittedBy === `${currentUser?.prenom} ${currentUser?.nom}`).length})
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2.5">
                {displayedAnnouncements.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#dfb3c1] bg-[#fffafb] p-6 text-center text-xs text-[#815569]">
                    Aucune annonce dans cette catégorie pour le moment.
                  </div>
                ) : (
                  displayedAnnouncements.map((a) => (
                    <div key={a.id} className="rounded-2xl border border-[#efdfe4] bg-white p-3.5 text-xs shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${a.badgeColor}`}>{a.badge}</span>
                        <span className="text-[10px] text-[#8e6878] font-semibold">{a.month}</span>
                      </div>
                      <h3 className="ph-display mt-1 text-sm font-bold text-[#452737]">{a.title}</h3>
                      <p className="text-[11px] text-[#8c405c] mt-0.5 font-semibold">{a.author} · {a.city}</p>
                      <p className="mt-1 text-[#6d4f5e] leading-relaxed">{a.content}</p>
                      <div className="mt-2 flex items-center justify-between border-t border-[#f7e8ee] pt-2 text-[10px] text-[#8b6375]">
                        <span>📞 {a.contact}</span>
                        <span>{a.date}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET L'ACCOMPAGNANT (WHATSAPP + SMS SIMPLE EXIGÉ)                */}
          {/* ------------------------------------------------------------------ */}
          {section === "Accompagnant" && !selectedCenter && (
            <section className="ph-enter px-5 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">
                Aller à deux
              </span>
              <h1 className="ph-display text-[26px] leading-tight text-[#452637]">
                L'Accompagnant
              </h1>
              <p className="mt-1 text-xs text-[#795f6d]">
                Aller faire son dépistage, c'est plus facile à deux. Invitez une proche par WhatsApp ou directement par SMS simple (sans connexion internet requise).
              </p>

              {/* Choix de la langue de message d'accompagnement */}
              <div className="mt-3.5 rounded-2xl bg-white border border-[#ebd6dc] p-3 text-xs">
                <label className="block font-bold text-[#543644] mb-1.5">Langue de l'invitation :</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSmsLanguage("fr")}
                    className={`flex-1 rounded-xl py-1.5 font-bold transition text-xs ${smsLanguage === "fr" ? "bg-[#a14364] text-white" : "border border-[#e5ccd5] text-[#714f5e]"}`}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => setSmsLanguage("moore")}
                    className={`flex-1 rounded-xl py-1.5 font-bold transition text-xs ${smsLanguage === "moore" ? "bg-[#a14364] text-white" : "border border-[#e5ccd5] text-[#714f5e]"}`}
                  >
                    Mooré
                  </button>
                </div>

                <div className="mt-3 rounded-xl bg-[#fdf5f8] border border-[#f5dfeb] p-2.5 text-[11px] italic text-[#6f4b5d]">
                  « {smsLanguage === "fr"
                    ? "Bonjour ma sœur, je t'invite à faire notre dépistage du sein ensemble sur PagLaafi : http://localhost:5173/"
                    : "Ne y beogo m maaso, m boola fo tɩ d kẽng a yiibu n ges d yĩnsa laafi ne PagLaafi : http://localhost:5173/"} »
                </div>

                {/* 1. BOUTON ENVOI PAR WHATSAPP */}
                <button
                  onClick={() => {
                    const text = encodeURIComponent(
                      smsLanguage === "fr"
                        ? "Bonjour ma sœur, je t'invite à faire notre dépistage du sein ensemble sur PagLaafi : http://localhost:5173/"
                        : "Ne y beogo m maaso, m boola fo tɩ d kẽng a yiibu n ges d yĩnsa laafi ne PagLaafi : http://localhost:5173/",
                    );
                    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
                    notify("Invitation WhatsApp prête à l'envoi.");
                  }}
                  className="mt-3 w-full rounded-2xl bg-emerald-600 py-2.5 font-bold text-white text-center flex items-center justify-center gap-2 shadow hover:bg-emerald-700 transition"
                >
                  <MessageCircle size={16} /> Inviter mon accompagnant(e) par WhatsApp
                </button>

                {/* 2. BOUTON ENVOI PAR SMS SIMPLE (EXIGÉ) */}
                <button
                  onClick={() => {
                    const text = encodeURIComponent(
                      smsLanguage === "fr"
                        ? "Bonjour ma sœur, je t'invite à faire notre dépistage du sein ensemble sur PagLaafi : http://localhost:5173/"
                        : "Ne y beogo m maaso, m boola fo tɩ d kẽng a yiibu n ges d yĩnsa laafi ne PagLaafi : http://localhost:5173/",
                    );
                    window.open(`sms:?body=${text}`, "_blank");
                    notify("Application SMS ouverte pour envoi direct.");
                  }}
                  className="mt-2 w-full rounded-2xl border-2 border-emerald-600 bg-white py-2.5 font-bold text-emerald-800 text-center flex items-center justify-center gap-2 hover:bg-emerald-50 transition"
                >
                  <Phone size={16} /> Envoyer par SMS simple (Sans connexion Internet)
                </button>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* FICHE DÉTAILLÉE D'UN CENTRE                                        */}
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
                <h1 className="ph-display text-xl font-bold text-[#472738]">{selectedCenter.name}</h1>
                <p className="text-xs text-[#805e6f]">{selectedCenter.address}</p>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-white/90 p-2">
                    <p className="text-[9px] font-bold uppercase text-[#9f697d]">Équipement</p>
                    <p className="font-bold text-[#452737]">{selectedCenter.apparatus}</p>
                  </div>
                  <div className="rounded-xl bg-white/90 p-2">
                    <p className="text-[9px] font-bold uppercase text-[#9f697d]">File d'attente</p>
                    <p className="font-bold text-[#452737]">{selectedCenter.queueCount} personnes ({selectedCenter.estimatedWait})</p>
                  </div>
                </div>
              </div>

              {/* Messages audio en 4 langues du centre */}
              <div className="mt-3 rounded-2xl border border-[#ebd6dc] bg-white p-3 text-xs">
                <span className="flex items-center gap-1.5 font-bold text-[#4a2b3b]">
                  <Volume2 size={15} className="text-[#a14364]" /> Message audio du centre
                </span>
                <p className="mt-1 italic text-[#725462]">« {selectedCenter.audioMessageFr} »</p>
                <div className="mt-2.5 grid grid-cols-4 gap-1">
                  <button onClick={() => handlePlayAudio(selectedCenter.audioMessageFr, "fr")} className="rounded-xl bg-[#a14364] py-1.5 text-[10px] font-bold text-white">FR</button>
                  <button onClick={() => handlePlayAudio(selectedCenter.audioMessageEn, "en")} className="rounded-xl bg-[#a14364] py-1.5 text-[10px] font-bold text-white">EN</button>
                  <button onClick={() => handlePlayAudio(selectedCenter.audioMessageMoore, "moore")} className="rounded-xl border border-[#e2bac8] bg-[#fdf5f7] py-1.5 text-[10px] font-bold text-[#8a3350]">Mooré</button>
                  <button onClick={() => handlePlayAudio(selectedCenter.audioMessageDioula, "dioula")} className="rounded-xl border border-[#e2bac8] bg-[#fdf5f7] py-1.5 text-[10px] font-bold text-[#8a3350]">Dioula</button>
                </div>
              </div>

              {/* Tarifs */}
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
            </section>
          )}
            </>
          )}
        </div>

        {/* ==================================================================== */}
        {/* BARRE DE NAVIGATION INFÉRIEURE : AFFICHÉE UNIQUEMENT QUAND CONNECTÉ */}
        {/* ==================================================================== */}
        {currentUser && (
          <nav
            aria-label="Navigation principale"
            className="z-30 shrink-0 border-t border-[#f0dee3] bg-white/95 backdrop-blur-md px-1 pb-[max(10px,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-8px_25px_rgba(75,30,50,.07)]"
          >
            <div className="grid grid-cols-5 items-end">
              {[
                { label: "Accueil" as Section, icon: Heart, name: "Accueil" },
                { label: "Centres" as Section, icon: MapPin, name: "Centres" },
                { label: "RoseIA" as Section, icon: Sparkles, name: "Rose IA", isCentral: true },
                { label: "Comprendre" as Section, icon: BookOpen, name: "Comprendre" },
                { label: "FaireUnDon" as Section, icon: Heart, name: "Faire un don" },
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
                      if (label === "FaireUnDon") {
                        setShowDonationModal(true);
                      }
                    }}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-2xl transition ${active ? "text-[#a14364]" : "text-[#9d838e] hover:text-[#785062]"}`}
                  >
                    <span
                      className={`grid h-7 w-9 place-items-center rounded-full transition-all duration-200 ${active ? "bg-[#fbe7ed] text-[#a14364] shadow-xs" : ""}`}
                    >
                      <Icon size={18} strokeWidth={active ? 2.5 : 1.8} className={label === "FaireUnDon" && active ? "fill-[#a14364]" : ""} />
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
        )}

        {/* ==================================================================== */}
        {/* MODAL : NOUVELLE ANNONCE (AVEC PROCESSUS EN ATTENTE DE VALIDATION)   */}
        {/* ==================================================================== */}
        {showNewAnnouncementModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]">
            <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl max-h-[90vh] overflow-y-auto border-2 border-[#a14364]">
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#faedf1] text-[#a14364]">
                    <Megaphone size={18} />
                  </span>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#452737]">Publier une annonce</h3>
                    <p className="text-[10px] text-amber-800 font-bold">Soumise à validation Superadmin</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewAnnouncementModal(false)}
                  className="grid h-8 w-8 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handlePublishAnnouncementSubmit} className="mt-3 space-y-2.5 text-xs">
                <div>
                  <label className="block font-bold text-[#563746]">Titre de l'événement / caravane *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dépistage gratuit au marché..."
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-[#563746]">Ville / Localité :</label>
                    <input
                      type="text"
                      value={newAnnouncement.city}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, city: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#563746]">Mois concerné :</label>
                    <select
                      value={newAnnouncement.month}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, month: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs font-semibold"
                    >
                      <option value="Octobre 2026">Octobre 2026 (En cours)</option>
                      <option value="Novembre 2026">Novembre 2026</option>
                      <option value="Décembre 2026">Décembre 2026</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#563746]">Date & Heure :</label>
                  <input
                    type="text"
                    value={newAnnouncement.date}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, date: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#563746]">Badge de mise en avant :</label>
                  <input
                    type="text"
                    value={newAnnouncement.badge}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, badge: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#563746]">Description détaillée de l'événement *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Précisez le lieu exact, les bénéficiaires, la gratuité ou les subventions..."
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#563746]">Contact téléphonique public :</label>
                  <input
                    type="text"
                    placeholder="+226 70 00 00 00"
                    value={newAnnouncement.contact}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, contact: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                  />
                </div>

                <div className="rounded-xl bg-amber-50 border border-amber-200 p-2 text-[10.5px] text-amber-900 leading-tight">
                  ℹ️ <strong>Règle de publication :</strong> Pour garantir la véracité des informations médicales, votre annonce sera examinée et validée par le Superadmin National avant diffusion.
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#a14364] py-2.5 font-bold text-white shadow hover:bg-[#8e3856]"
                >
                  Soumettre pour validation Superadmin
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL : TABLEAU DE BORD SUPERADMIN COMPLET (STATISTIQUES & VALIDATION)*/}
        {/* ==================================================================== */}
        {showSuperadminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]">
            <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl border-2 border-purple-900 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-950 text-white">
                    <ShieldCheck size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#351c2a]">Superadmin National</h3>
                    <p className="text-[10px] text-purple-900 font-bold">Modération & Statistiques Nationales</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSuperadminModal(false)}
                  className="grid h-8 w-8 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* 3 ONGLETS DU SUPERADMIN */}
              <div className="mt-3 flex rounded-xl bg-[#f5eaf0] p-1 text-[11px] font-bold">
                <button
                  onClick={() => setSuperadminActiveTab("stats")}
                  className={`flex-1 rounded-lg py-1.5 transition ${superadminActiveTab === "stats" ? "bg-purple-950 text-white shadow-xs" : "text-purple-900"}`}
                >
                  📊 Trafic & Stats
                </button>
                <button
                  onClick={() => setSuperadminActiveTab("announcements")}
                  className={`flex-1 rounded-lg py-1.5 transition relative ${superadminActiveTab === "announcements" ? "bg-purple-950 text-white shadow-xs" : "text-purple-900"}`}
                >
                  📢 Annonces ({announcements.filter((a) => a.status === "pending_validation").length})
                </button>
                <button
                  onClick={() => setSuperadminActiveTab("registrations")}
                  className={`flex-1 rounded-lg py-1.5 transition ${superadminActiveTab === "registrations" ? "bg-purple-950 text-white shadow-xs" : "text-purple-900"}`}
                >
                  🏥 Inscriptions ({pendingRegistrations.filter((r) => r.status === "pending").length})
                </button>
              </div>

              {/* ONGLET 1 : STATISTIQUES DE VISITES DU SITE & TABLEAU DE BORD COMPLET */}
              {superadminActiveTab === "stats" && (
                <div className="mt-3.5 space-y-3 text-xs ph-enter">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-purple-50 border border-purple-200 p-3">
                      <span className="text-[9.5px] font-bold text-purple-800 uppercase">Visites totales</span>
                      <p className="text-lg font-extrabold text-purple-950 mt-0.5">48 320</p>
                      <p className="text-[9px] text-emerald-700 font-bold">▲ +31% ce mois</p>
                    </div>
                    <div className="rounded-2xl bg-pink-50 border border-pink-200 p-3">
                      <span className="text-[9.5px] font-bold text-[#a14364] uppercase">Femmes uniques</span>
                      <p className="text-lg font-extrabold text-[#742d45] mt-0.5">14 210</p>
                      <p className="text-[9px] text-[#742d45]">Utilisatrices actives</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3">
                      <span className="text-[9.5px] font-bold text-amber-900 uppercase">Rose IA Vocale</span>
                      <p className="text-lg font-extrabold text-amber-950 mt-0.5">9 430</p>
                      <p className="text-[9px] text-amber-800">Questions traitées</p>
                    </div>
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3">
                      <span className="text-[9.5px] font-bold text-emerald-900 uppercase">Dons collectés</span>
                      <p className="text-lg font-extrabold text-emerald-950 mt-0.5">14,8 M F</p>
                      <p className="text-[9px] text-emerald-700 font-bold">Via Orange Money</p>
                    </div>
                  </div>

                  {/* Répartition géographique des visites au Burkina */}
                  <div className="rounded-2xl border border-[#ebd6dc] bg-[#fffafc] p-3 space-y-2">
                    <span className="font-bold text-[#452737] block">Répartition des visites par région :</span>
                    <div className="space-y-1.5 text-[11px]">
                      <div>
                        <div className="flex justify-between text-[#5f4150]">
                          <span>Centre (Ouagadougou & environs)</span>
                          <span className="font-bold">57%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full bg-[#a14364]" style={{ width: "57%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[#5f4150]">
                          <span>Hauts-Bassins (Bobo-Dioulasso)</span>
                          <span className="font-bold">25%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full bg-emerald-600" style={{ width: "25%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[#5f4150]">
                          <span>Centre-Ouest (Koudougou)</span>
                          <span className="font-bold">12%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: "12%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[#5f4150]">
                          <span>Autres provinces (Nord, Sahel, Est)</span>
                          <span className="font-bold">6%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: "6%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ONGLET 2 : MODÉRATION DES ANNONCES (SEUL LE SUPERADMIN PEUT VALIDER) */}
              {superadminActiveTab === "announcements" && (
                <div className="mt-3.5 space-y-2 text-xs ph-enter">
                  <p className="font-bold text-[#452737]">
                    Annonces en attente de modération ({announcements.filter((a) => a.status === "pending_validation").length}) :
                  </p>

                  {announcements.filter((a) => a.status === "pending_validation").length === 0 ? (
                    <div className="rounded-xl border border-[#ebd6dc] p-4 text-center text-[#825b6d]">
                      Toutes les annonces sont à jour et validées.
                    </div>
                  ) : (
                    announcements
                      .filter((a) => a.status === "pending_validation")
                      .map((ann) => (
                        <div key={ann.id} className="rounded-2xl border-2 border-amber-300 bg-amber-50/70 p-3 text-xs space-y-1.5">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-[#452737] text-[12px]">{ann.title}</span>
                            <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[9px] font-bold text-amber-900">
                              En attente
                            </span>
                          </div>
                          <p className="text-[10.5px] text-[#863e58] font-semibold">{ann.author} · {ann.city} ({ann.date})</p>
                          <p className="text-[11px] text-[#553b49] leading-relaxed">{ann.content}</p>
                          <p className="text-[10px] text-[#7d5d6d]">Contact public : {ann.contact}</p>

                          <div className="pt-2 flex gap-2">
                            <button
                              onClick={() => handleApproveAnnouncement(ann.id)}
                              className="flex-1 rounded-xl bg-emerald-600 py-1.5 font-bold text-white shadow-xs text-center hover:bg-emerald-700"
                            >
                              Valider & Publier ✓
                            </button>
                            <button
                              onClick={() => handleRejectAnnouncement(ann.id)}
                              className="rounded-xl border border-rose-300 bg-white px-3 py-1.5 font-bold text-rose-700 hover:bg-rose-50"
                            >
                              Refuser
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}

              {/* ONGLET 3 : DEMANDES D'ADHÉSION DES STRUCTURES */}
              {superadminActiveTab === "registrations" && (
                <div className="mt-3.5 space-y-2 text-xs ph-enter">
                  <p className="font-bold text-[#452737]">
                    Demandes d'adhésion en attente ({pendingRegistrations.filter((r) => r.status === "pending").length}) :
                  </p>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {pendingRegistrations.map((reg) => (
                      <div key={reg.id} className="rounded-xl border border-[#ebd6dc] bg-[#fffafc] p-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#472738]">{reg.structure}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${reg.status === "pending" ? "bg-amber-100 text-amber-900" : reg.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                            {reg.status === "pending" ? "En attente" : reg.status === "approved" ? "Validé ✓" : "Refusé"}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#735765] mt-0.5">Resp. : {reg.responsable} · {reg.telephone}</p>
                        <p className="text-[10px] text-[#916b7c]">{reg.ville} · {reg.type}</p>

                        {reg.status === "pending" && (
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => handleApproveRegistration(reg.id)}
                              className="flex-1 rounded-lg bg-emerald-600 py-1 text-center font-bold text-white shadow-xs"
                            >
                              Valider l'inscription
                            </button>
                            <button
                              onClick={() => handleRejectRegistration(reg.id)}
                              className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1 font-bold text-rose-700"
                            >
                              Refuser
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL : TABLEAU DE BORD ADMIN (DONS ORANGE MONEY & STATISTIQUES)     */}
        {/* ==================================================================== */}
        {showAdminDashboardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]">
            <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl max-h-[90vh] overflow-y-auto border-2 border-[#522538]">
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#522538] text-white">
                    <BarChart3 size={18} className="text-rose-300" />
                  </div>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#351c2a]">Tableau de Bord Admin</h3>
                    <p className="text-[10px] text-[#834f66] font-bold">Dons Orange Money & Statistiques</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAdminDashboardModal(false)}
                  className="grid h-8 w-8 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3">
                  <p className="text-[9.5px] font-bold text-rose-800 uppercase">Dons collectés (OM)</p>
                  <p className="text-base font-extrabold text-[#943657] mt-0.5">3 850 000 F</p>
                  <p className="text-[9px] text-[#7d5164]">412 donateurs vérifiés</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3">
                  <p className="text-[9.5px] font-bold text-emerald-800 uppercase">Examens financés</p>
                  <p className="text-base font-extrabold text-emerald-700 mt-0.5">385 femmes</p>
                  <p className="text-[9px] text-[#4d6a5c]">100% prises en charge</p>
                </div>
              </div>

              <div className="mt-3.5 border-t border-[#f2e1e6] pt-3 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-[#452737]">Dernières collectes Orange Money :</p>
                  <span className="text-[10px] text-[#f16e00] font-extrabold">#144#</span>
                </div>

                <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
                  {[
                    { id: "OM-ANON-904123", donor: "Donatrice anonyme (Chiffré AES)", amount: 10000, date: "Aujourd'hui 17h42", assoc: "ABAC" },
                    { id: "OM-BF-893102", donor: "Ouedraogo A.", amount: 5000, date: "Aujourd'hui 15h18", assoc: "ABAC" },
                    { id: "OM-ANON-872291", donor: "Donatrice anonyme (Chiffré AES)", amount: 25000, date: "Hier 19h10", assoc: "Beneere For A Cause" },
                    { id: "OM-BF-861109", donor: "Traoré S.", amount: 2500, date: "14/10/2026", assoc: "GenitCare" },
                    { id: "OM-BF-850012", donor: "Association WTM", amount: 50000, date: "13/10/2026", assoc: "WomenTech Makers" },
                  ].map((tx) => (
                    <div key={tx.id} className="rounded-xl border border-[#ebdbe2] bg-[#fffbfd] p-2 flex items-center justify-between text-[10.5px]">
                      <div>
                        <span className="font-bold text-[#452737]">{tx.donor}</span>
                        <p className="text-[9px] text-[#7a5969]">{tx.assoc} · {tx.date}</p>
                      </div>
                      <span className="font-bold text-[#f16e00]">+{tx.amount.toLocaleString("fr-FR")} F</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL : PROCESSUS OFFICIEL ORANGE MONEY (AVEC DON ANONYME CHIFFRÉ)   */}
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
                    <h3 className="ph-display text-sm font-bold text-[#3d2430]">Faire un don solidaire</h3>
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

              {/* ÉTAPE 1 : Choix de l'association, montant et option anonyme */}
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
                          {assoc.acronym} — {assoc.name}
                        </option>
                      ))}
                    </select>
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
                    <label className="block font-bold text-[#563746]">3. Numéro de téléphone débiteur :</label>
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

                  {/* OPTION DON ANONYME & CHIFFRÉ (EXIGÉE) */}
                  <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 p-3">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAnonymousDonation}
                        onChange={(e) => setIsAnonymousDonation(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="font-bold text-[#20432f] text-xs flex items-center gap-1.5">
                          <ShieldCheck size={14} className="text-emerald-700" /> Don 100% Anonyme & Chiffré
                        </span>
                        <p className="text-[10px] text-[#476a56] leading-tight mt-0.5">
                          Vos coordonnées (nom, prénom et numéro) sont chiffrées et masquées pour l'association. Seul un reçu officiel anonymisé est émis.
                        </p>
                      </div>
                    </label>
                  </div>

                  <button
                    onClick={handleStartDonationProcess}
                    className="mt-2 w-full rounded-2xl bg-[#f16e00] py-3 text-xs font-bold text-white shadow-md hover:bg-orange-600 transition"
                  >
                    Valider le don de {customDonationAmount ? Number(customDonationAmount).toLocaleString("fr-FR") : donationAmount.toLocaleString("fr-FR")} FCFA →
                  </button>
                </div>
              )}

              {/* ÉTAPE 2 : Confirmation */}
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
                      <span className="text-[#7c5b6b]">Donateur :</span>
                      <span className="font-bold text-[#452737]">
                        {isAnonymousDonation ? "Donatrice anonyme (Chiffré AES-256)" : `${currentUser?.prenom || "Donateur"} ${currentUser?.nom || ""}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7c5b6b]">Numéro débité :</span>
                      <span className="font-bold text-[#452737]">
                        {isAnonymousDonation ? `+226 70 ** ** ${orangeMoneyPhone.slice(-2)}` : `+226 ${orangeMoneyPhone}`}
                      </span>
                    </div>
                  </div>

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
                      Autoriser le paiement
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 3 : OTP Orange Money */}
              {donationStep === "otp" && (
                <div className="mt-3 space-y-3 text-xs text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-orange-100 text-[#f16e00] ph-pulse">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#452737]">Autorisation Orange Money (#144*4*6#)</h4>
                    <p className="text-[11px] text-[#7c5b6b] mt-1">
                      Composez <strong>#144*4*6#</strong> sur votre mobile ou saisissez votre code OTP reçu par SMS :
                    </p>
                  </div>

                  <div className="mx-auto max-w-[180px]">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Code OTP"
                      className="w-full rounded-xl border-2 border-orange-400 p-2 text-center text-sm font-extrabold tracking-widest text-[#452737]"
                    />
                  </div>

                  <button
                    onClick={handleValidateOrangeMoneyOTP}
                    className="w-full rounded-2xl bg-[#f16e00] py-2.5 font-bold text-white shadow"
                  >
                    Confirmer le don
                  </button>
                </div>
              )}

              {/* ÉTAPE 4 : Reçu officiel de don */}
              {donationStep === "success" && (
                <div className="mt-3 space-y-3 text-xs text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
                    <CheckCircle2 size={32} />
                  </div>

                  <div>
                    <h4 className="ph-display text-lg font-bold text-[#452737]">Merci pour votre générosité !</h4>
                    <p className="text-[11px] text-[#7c5b6b] mt-0.5">
                      Votre don est intégralement alloué à <strong>{selectedAssociation.acronym}</strong> pour soutenir le dépistage au Burkina Faso.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#f8f9fa] border border-[#e9ecef] p-3 text-left space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Réf Transaction :</span>
                      <span className="font-mono font-bold text-gray-800">{lastDonationId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Donateur :</span>
                      <span className="font-semibold text-gray-700">
                        {isAnonymousDonation ? "Donatrice Anonyme (Chiffrement AES)" : `${currentUser?.prenom || "Donateur"} ${currentUser?.nom || ""}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Montant :</span>
                      <span className="font-bold text-[#f16e00]">
                        {customDonationAmount ? Number(customDonationAmount).toLocaleString("fr-FR") : donationAmount.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Opérateur :</span>
                      <span className="font-semibold text-gray-700">Orange Money Burkina</span>
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
        {/* MODAL : LIEN MOBILE LOCAL WI-FI (POUR LES COLLÈGUES SANS EXPO)       */}
        {/* ==================================================================== */}
        {showWifiModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]"
            onClick={() => setShowWifiModal(false)}
          >
            <div
              className="ph-enter w-full max-w-sm rounded-[28px] bg-slate-900 p-5 text-white shadow-2xl border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-slate-800 text-emerald-400">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-white">Lien Mobile Local</h3>
                    <p className="text-[10px] text-emerald-400 font-bold">Sans passer par Expo</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowWifiModal(false)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-3.5 space-y-3 text-xs">
                <p className="text-slate-300 text-[11.5px] leading-relaxed">
                  Vos collègues connectés au même réseau Wi-Fi peuvent ouvrir l'application directement dans le navigateur de leur smartphone (Safari, Chrome) :
                </p>

                <div className="rounded-2xl bg-slate-800/90 p-3 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Adresse URL sur le Wi-Fi local :</span>
                    <span className="text-[10px] text-emerald-400 font-bold">En direct</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-950 p-2.5 border border-slate-800">
                    <span className="font-mono text-xs font-bold text-emerald-400 select-all">
                      {localShareUrl}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(localShareUrl);
                        notify(`Lien ${localShareUrl} copié !`);
                      }}
                      className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-500 shadow-sm"
                    >
                      Copier
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-300 rounded-xl bg-slate-800/40 p-3 border border-slate-800">
                  <p className="font-bold text-amber-300">Procédure simple en 3 étapes :</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[10.5px]">
                    <li>Connecter le téléphone au même réseau Wi-Fi.</li>
                    <li>Ouvrir le navigateur (Safari sur iPhone, Chrome sur Android).</li>
                    <li>Taper ou coller <strong className="text-emerald-400">{localShareUrl}</strong></li>
                  </ol>
                </div>

                <button
                  onClick={() => setShowWifiModal(false)}
                  className="w-full rounded-2xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TOAST DE NOTIFICATION                                                */}
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
