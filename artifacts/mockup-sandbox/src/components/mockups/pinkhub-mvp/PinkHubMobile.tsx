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
  coordinates: { x: number; y: number }; // coordonnées pourcentage pour fallback SVG
  lat: number; // latitude GPS réelle pour OpenStreetMap
  lng: number; // longitude GPS réelle pour OpenStreetMap
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

// Règle de connaissance médicale validée par les médecins pour Rose IA
interface MedicalKnowledge {
  id: number;
  doctorName: string;
  speciality: string;
  topic: string;
  advice: string;
  date: string;
  verified: boolean;
}

// Fiche d'orientation médicale d'un patient
interface PatientOrientation {
  id: string;
  patientName: string;
  patientPhone: string;
  urgencyLevel: "high" | "medium" | "routine";
  targetCenterId: number;
  targetCenterName: string;
  clinicalObservations: string;
  doctorName: string;
  date: string;
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
 * Annonces des associations et soignants au Burkina Faso
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
    likes: 148,
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
    content: "Venez échanger avec nos sages-femmes et des patientes guéries. Explications en français, anglais, mooré et dioula. Rafraîchissements offerts et apprentissage des gestes d'auto-palpation.",
    contact: "+226 76 50 33 44",
    likes: 104,
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
    content: "Grâce aux donateurs de PagLaafi, 200 mammographies sont subventionnées à 5 000 FCFA (au lieu de 12 000 FCFA) pour les femmes sans revenus.",
    contact: "+226 25 36 30 70",
    likes: 235,
  },
];

/**
 * Associations partenaires éligibles aux dons (incluant Beneere, GenitCare, WomenTech Makers)
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
      "Faire un dépistage peut susciter de l'inquiétude. Pour une femme, être accompagnée par une sœur, une amie, sa mère ou son conjoint transforme complètement cette expérience. Proposer un covoiturage, patienter ensemble dans la salle d'attente ou simplement lui rappeler avec douceur l'importance de ce geste sont des actes d'amour déterminants. L'application PagLaafi propose la fonction 'Aller à deux' pour envoyer une invitation chaleureuse en un clic sur WhatsApp.",
    englishFullText:
      "Undergoing a screening exam can trigger anxiety. For a woman, having a trusted sister, friend or spouse alongside makes all the difference. Offering transportation, waiting together, or gently reminding her of the appointment are true acts of care. The PagLaafi Go-Together module allows sending an invitation in one click.",
    mooreSummary:
      "Sã n yaa tɩ ned na n tɩ ges a yĩnsa laafi, rabeem tõe n kẽ-a lame. Woto yĩnga, sã n yaa ne a kẽed-n-taag bɩ a ma bɩ a biiga n kẽnd ne-a, zĩigã lebnda noogo. Tʋm-y WhatsApp kaset n bool-a tɩ y kẽng a yiibu.",
    dioulaSummary:
      "Ka taga kɛnɛyaso la k'i sin lajɛ, siran bɛ se ka kɛ o la. Ni balimamusow walima furuɲɔgɔn tagara ɲɔgɔn fɛ, hakili bɛ sigi. PagLaafi bɛ dɛmɛ kɛ ka weeleli ci WhatsApp fɛ.",
  },
];

/**
 * Réponses types de Rose IA avec support 4 langues
 */
const roseKnowledge = {
  mal: {
    fr: "Rassurez-vous : la mammographie ne fait généralement pas mal. C'est une pression qui dure seulement 5 à 10 secondes par cliché. Pour plus de confort, faites l'examen dans les 10 jours qui suivent vos règles.",
    en: "Rest assured: mammography is generally not painful. It is a firm compression lasting only 5 to 10 seconds per view. For best comfort, schedule it within 10 days after your menstrual period.",
    moore: "Da zoe rabeem ye: mammographie masĩnã pa namsd ninsaal wʋsg ye. A rɩkda sekõnd a wãn bal n kaset. Sã n yaa ne yãmba, kẽng-y sã n yaa tɩ y kaset kẽndã saame.",
    dioula: "I kana siran: masin nin tɛ mɔgɔ dimi kosɛbɛ. A bɛ kɛ sekondi damanin dɔrɔn lo kɔnɔ. Ni ye a kɛ i ka kɛnɛya kalo tɛmɛnen kɔ, a ka nɔgɔn.",
  },
  prix: {
    fr: "Au Burkina Faso, la palpation clinique est GRATUITE (0 FCFA) dans la plupart des centres. L'échographie mammaire coûte entre 6 000 et 7 500 FCFA, et la mammographie entre 10 000 et 12 000 FCFA (subventionnée à 5 000 FCFA à Schiphra).",
    en: "In Burkina Faso, clinical breast examination is FREE (0 FCFA) in most health centers. Breast ultrasound costs 6,000 to 7,500 FCFA, and mammography 10,000 to 12,000 FCFA (subsidized down to 5,000 FCFA at Schiphra).",
    moore: "Burkina Faso ka, nus n gesã yaa zaalem (0 FCFA). Échographie yaa 6 000 n ta 7 500 FCFA. Mammographie me yaa 10 000 n ta 12 000 FCFA.",
    dioula: "Burkina Faso la, bɔlɔkɔrɔ lajɛ sɔngɔ ye fu ye (0 FCFA). Échographie ye 6 000 fo 7 500 FCFA ye. Mammographie ye 10 000 fo 12 000 FCFA ye.",
  },
  boule: {
    fr: "Ne paniquez pas : 8 boules sur 10 ne sont PAS cancéreuses (kystes d'eau bénins, adénofibromes). Mais il faut impérativement la faire examiner par un médecin ou une sage-femme sans attendre.",
    en: "Do not panic: 8 out of 10 lumps are NOT cancerous (often benign fluid cysts or fibroadenomas). However, it is essential to have it checked promptly by a doctor or midwife.",
    moore: "Da zoe rabeem ye: bõn-kʋds a nii (8) piig pʋgẽ pa bãag ye. La yaa tɩlae tɩ dɔgɔtɔr bɩ sage-femme ges-a n bãng a yelle.",
    dioula: "I kana jaasi: bõn-kʋdga tan kɔnɔ segin tɛ bana juguman ye. Nka a kɔrɔtanin lo dɔgɔtɔrɔ ka a lajɛ jona.",
  },
  default: {
    fr: "Je suis Rose IA, votre compagne de santé. Posez-moi vos questions sur le dépistage, les tarifs, la douleur ou les centres disponibles.",
    en: "I am Rose AI, your health assistant. Feel free to ask about screenings, costs, breast pain, or nearest available health centers.",
    moore: "Mam yaa Rose IA. M be n na n sõng yãmba ne laafi kaset. Sok-y maam bũmb ning fãa y sẽn rat n bãngã.",
    dioula: "Ne ye Rose IA ye. Ne bɛ yan k'aw dɛmɛ kɛnɛya ko la. Aw bɛ se ka nɲininka kuma fɛ walima sɛbɛli fɛ.",
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

  // 3. Authentification & Profils
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Formulaire d'inscription
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

  // Formulaire de connexion (STRICTEMENT TÉLÉPHONE ET MOT DE PASSE)
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

  // Superadmin : liste des inscriptions en attente
  const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>(
    initialPendingRegistrations,
  );
  const [showSuperadminModal, setShowSuperadminModal] = useState(false);

  // 4. Centres de santé & Carte
  const [centers, setCenters] = useState<HealthCenter[]>(initialCenters);
  const [selectedCenter, setSelectedCenter] = useState<HealthCenter | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  // Modal de mise à jour du centre (réservé aux admins de centres de santé & médecins)
  const [showCenterUpdateModal, setShowCenterUpdateModal] = useState(false);
  const [centerUpdateData, setCenterUpdateData] = useState<HealthCenter | null>(null);

  // 5. Audio & 4 Langues (Français, English, Mooré, Dioula)
  const [activeLesson, setActiveLesson] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [speechLanguage, setSpeechLanguage] = useState<"fr" | "en" | "moore" | "dioula">("fr");
  const audioIntervalRef = useRef<number | null>(null);

  // 6. Assistant Vocal ROSE IA
  const [roseMessages, setRoseMessages] = useState<
    Array<{ sender: "user" | "rose"; text: string; time: string; englishText?: string; mooreText?: string; dioulaText?: string }>
  >([
    {
      sender: "rose",
      text: "Bonjour ! Je suis Rose IA, votre assistante médicale bienveillante. Une question sur le dépistage, une douleur ou un centre ? Écrivez-moi ou touchez le micro.",
      englishText: "Hello! I am Rose AI, your caring health assistant. Feel free to ask about screenings, pain, or health centers.",
      mooreText: "Ne y beogo ! Mam yaa Rose IA. Sok-y maam bũmb fãa y sẽn rat n bãngã.",
      dioulaText: "I ni sɔgɔma ! Ne ye Rose IA ye. Aw bɛ se ka nɲininka bũmb o bũmb la.",
      time: "Maintenant",
    },
  ]);
  const [roseInput, setRoseInput] = useState("");
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [roseSpeaking, setRoseSpeaking] = useState(false);

  // 7. Espace Docteur : Entraîner Rose IA
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

  // 8. Espace Agent de santé : Recommander & Orienter un patient selon l'urgence
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

  // 9. Tableau de bord Administrateurs (Dons & Statistiques)
  const [showAdminDashboardModal, setShowAdminDashboardModal] = useState(false);

  // 10. Calendrier Féminin : Règles, Autopalpation & Rappels
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

  // 11. Annonces
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

  // 12. Faire un Don (Processus Orange Money)
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
   * Intégration de la carte OpenStreetMap via Leaflet (100% open-source et gratuit)
   */
  useEffect(() => {
    if (section !== "Centres" || viewMode !== "map") return;

    let isMounted = true;

    const initLeafletMap = () => {
      if (!mapContainerRef.current) return;
      const L = (window as any).L;
      if (!L) return;

      // Détruire l'ancienne instance si présente
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Centre par défaut : Ouagadougou
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView([12.3714, -1.5197], 12);

      // Tuiles OpenStreetMap gratuites
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(map);

      // Ajout des marqueurs interactifs pour chaque centre
      centers.forEach((center) => {
        const markerColor =
          center.status === "available"
            ? "#10b981"
            : center.status === "busy"
              ? "#f59e0b"
              : center.status === "maintenance"
                ? "#ef4444"
                : "#94a3b8";

        // Marqueur HTML personnalisé avec pulse
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
            <div style="font-size:10px; color:#6b4d5d;">Agents en poste : <b>${center.agentsPresent}</b></div>
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

    // Charger dynamiquement Leaflet CSS et JS si non encore présents
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
   * Utilise Web Speech API native avec adaptation acoustique pour langues burkinabè
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
      // Mooré et Dioula : articulation phonétique claire et cadence adaptée
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

    // Fenêtre optimale d'autopalpation : J+7 à J+11 (2 à 5 jours après fin des règles de 5 jours)
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

    // Si admin : soumis à la validation préalable du Superadmin
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

    // Détection de comptes de démonstration
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

  // Switch direct pour faciliter le test des rôles
  const quickLoginAs = (type: "user" | "center" | "doctor" | "association" | "superadmin") => {
    if (type === "superadmin") {
      setCurrentUser({
        nom: "Kaboré",
        prenom: "Alimata",
        telephone: "78 00 00 00",
        role: "superadmin",
        roleLabel: "Super-Administrateur National",
      });
      notify("Profil actif : 🛡️ Superadmin (Modération nationale).");
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
      notify("Profil actif : 🏥 Admin Centre de Santé (Mise à jour directe de la carte).");
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
      notify("Profil actif : 🎗️ Admin Association (Tableau de bord dons Orange Money).");
    } else {
      setCurrentUser({
        nom: "Ouedraogo",
        prenom: "Aminata",
        telephone: "70 12 34 56",
        role: "user",
        roleLabel: "Utilisatrice",
      });
      notify("Profil actif : 👩 Utilisatrice standard (Suivi du cycle & dépistage).");
    }
    setShowAuthModal(false);
  };

  // Validation Superadmin
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

  /**
   * Sauvegarde des modifications du centre de santé sur la carte
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

    // Ajouter un message de dialogue avec Rose IA
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
   * Processus Don Orange Money
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
    const ref = `OM-BF-${Math.floor(100000 + Math.random() * 900000)}`;
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

            {/* Mention exigée : POWERED BY ROSE IA */}
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
        {/* BARRE LATÉRALE (SIDEBAR) AVEC GESTION MULTI-PROFILS                 */}
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

              {/* Statut de profil dans le menu */}
              <div className="mt-3 rounded-2xl bg-[#f9edf1] p-3 text-xs">
                {currentUser ? (
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[#a14364] px-2 py-0.5 text-[9px] font-bold text-white">
                        {currentUser.roleLabel}
                      </span>
                      <button
                        onClick={() => {
                          setCurrentUser(null);
                          notify("Déconnectée.");
                        }}
                        className="text-[11px] text-rose-600 font-bold hover:underline"
                      >
                        Déconnexion
                      </button>
                    </div>
                    <p className="mt-1 font-bold text-[#472738]">{currentUser.prenom} {currentUser.nom}</p>
                    <p className="text-[10px] text-[#7d5d6c]">{currentUser.telephone}</p>
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

              {/* Raccourcis pour les Administrateurs & Professionnels */}
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
                      {pendingRegistrations.filter((r) => r.status === "pending").length}
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

              {/* Entraînement de Rose IA pour les docteurs / agents de santé */}
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

              {/* Orientation & Recommandation patiente pour soignants */}
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

                {/* Bouton de mise à jour du centre (UNIQUEMENT pour Admin Centre de santé & Médecin) */}
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

                {/* Faire un don solidaire : tout en bas comme demandé */}
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
              </nav>

              {/* Ligne d'urgence */}
              <div className="mt-auto rounded-2xl bg-[#734059] p-3 text-white">
                <p className="text-[11px] font-bold">Numéro vert national gratuit</p>
                <p className="text-base font-extrabold tracking-wide">80 00 11 22</p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* EN-TÊTE FIXE DU SMARTPHONE                                           */}
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
            {/* Bouton direct Rose IA */}
            <button
              onClick={() => setSection("RoseIA")}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold transition shadow-sm ${section === "RoseIA" ? "bg-[#a14364] text-white" : "border border-[#e7bcc9] bg-[#fbf0f4] text-[#8e3857]"}`}
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>Rose IA</span>
            </button>

            {/* Bouton Compte */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#eedfe4] bg-white text-[#7d5668] hover:bg-[#faedf1]"
              title={currentUser ? `${currentUser.prenom} (${currentUser.roleLabel})` : "Connexion"}
            >
              {currentUser ? (
                <span className="text-xs font-bold text-[#a14364]">
                  {currentUser.prenom[0]}
                </span>
              ) : (
                <User size={17} />
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
                      <Megaphone size={13} /> {announcements[0].badge}
                    </span>
                    <span className="text-[10px] font-semibold text-purple-700">Annonces →</span>
                  </div>
                  <h4 className="mt-1 text-xs font-bold text-purple-950">{announcements[0].title}</h4>
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
                          Offrir une mammographie à une femme sans revenus
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
          {/* ONGLET 2 : CARTE DES SOINS AVEC VRAIE CARTE OPENSTREETMAP LEAFLET  */}
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

                    {/* Légende rapide en surimpression */}
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
          {/* ONGLET NOUVEAU : CALENDRIER, RÈGLES, AUTOPALPATION & RAPPELS       */}
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

              {/* 1. Suivi des règles & cycle */}
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

              {/* 2. Fenêtre d'autopalpation recommandée par l'OMS */}
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
                  Le meilleur moment pour observer et palper vos seins est <strong>2 à 5 jours après la fin des règles</strong>, quand les tissus mammaires sont souples et non douloureux.
                </p>

                {/* 4 gestes d'autopalpation guidée */}
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

              {/* 3. Rappels personnalisés : Dépistage, Traitement & Rendez-vous */}
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
                        Enregistrer le rappel
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
                  {/* Sélecteur 4 Langues exigé */}
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

                {/* Bouton d'entraînement docteur si connecté en praticien */}
                {currentUser?.role === "admin" && currentUser?.adminType === "doctor" && (
                  <button
                    onClick={() => setShowDoctorTrainModal(true)}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-400 py-1.5 text-xs font-bold text-purple-950 shadow-sm"
                  >
                    <GraduationCap size={15} /> 🩺 Mode Médecin : Entraîner Rose IA
                  </button>
                )}
              </div>

              {/* Suggestions rapides */}
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

              {/* Discussion */}
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

              {/* Saisie & Micro vocal */}
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
          {/* ONGLET 5 : FAIRE UN DON (SUIT AUTOMATIQUEMENT ORANGE MONEY)         */}
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

              {/* Carte principale de déclenchement du don avec icône CŒUR */}
              <div className="mt-3.5 rounded-[26px] border-2 border-rose-300 bg-gradient-to-br from-[#fff7f9] to-[#ffedf3] p-5 shadow-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#a14364] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                  <Heart size={13} className="fill-white" /> 100% Solidaire
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

              {/* Liste des 7 associations bénéficiaires */}
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
          {/* ONGLET ANNONCES                                                    */}
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
                <button
                  onClick={() => setShowNewAnnouncementModal(true)}
                  className="rounded-full bg-[#a14364] px-3 py-1 text-xs font-bold text-white"
                >
                  + Publier
                </button>
              </div>

              <div className="mt-3 space-y-2.5">
                {announcements.map((a) => (
                  <div key={a.id} className="rounded-2xl border border-[#efdfe4] bg-white p-3.5 text-xs shadow-sm">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${a.badgeColor}`}>{a.badge}</span>
                    <h3 className="ph-display mt-1 text-sm font-bold text-[#452737]">{a.title}</h3>
                    <p className="text-[11px] text-[#8c405c] mt-0.5">{a.author}</p>
                    <p className="mt-1 text-[#6d4f5e]">{a.content}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* ONGLET L'ACCOMPAGNANT                                              */}
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
                Aller faire son dépistage, c'est plus facile à deux. Invitez une proche par WhatsApp ou SMS.
              </p>
              <div className="mt-3 rounded-2xl bg-white border border-[#ebd6dc] p-4 text-xs">
                <button
                  onClick={() => {
                    const text = encodeURIComponent("Bonjour ma sœur, Aminata t'invite à faire ton dépistage avec elle sur PagLaafi : http://localhost:5173/");
                    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
                    notify("Invitation WhatsApp prête à l'envoi.");
                  }}
                  className="w-full rounded-2xl bg-emerald-600 py-2.5 font-bold text-white text-center flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} /> Inviter mon accompagnant(e) par WhatsApp
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
        </div>

        {/* ==================================================================== */}
        {/* BARRE DE NAVIGATION INFÉRIEURE : 5 ONGLETS AVEC ICÔNE CŒUR POUR DON */}
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

        {/* ==================================================================== */}
        {/* MODAL 1 : AUTHENTIFICATION AVEC 3 PROFILS & ŒILLETS DE MOT DE PASSE  */}
        {/* ==================================================================== */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]">
            <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#f8e7ec] text-[#a14364]">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="ph-display text-base font-bold text-[#472738]">
                      {authMode === "login" ? "Connexion" : "Créer un compte"}
                    </h3>
                    <p className="text-[10px] text-[#8a5b70]">PagLaafi · Burkina Faso</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="grid h-8 w-8 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Bascule Connexion / Inscription */}
              <div className="mt-3 flex rounded-xl bg-[#f9edf1] p-1 text-xs">
                <button
                  onClick={() => setAuthMode("login")}
                  className={`flex-1 rounded-lg py-1.5 font-bold transition ${authMode === "login" ? "bg-white text-[#913b5b] shadow-sm" : "text-[#7b5b6a]"}`}
                >
                  Connexion
                </button>
                <button
                  onClick={() => setAuthMode("register")}
                  className={`flex-1 rounded-lg py-1.5 font-bold transition ${authMode === "register" ? "bg-white text-[#913b5b] shadow-sm" : "text-[#7b5b6a]"}`}
                >
                  Inscription
                </button>
              </div>

              {/* Raccourcis de test des 3 rôles demandés */}
              <div className="mt-3 rounded-xl bg-[#fcf4f7] border border-[#f2dbe2] p-2 text-[10px]">
                <p className="font-bold text-[#863752] mb-1">Comptes de test (1 clic) :</p>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => quickLoginAs("user")}
                    className="rounded-lg bg-white px-2 py-1 font-semibold text-[#543444] border border-[#ebd0d9] hover:bg-[#faedf1]"
                  >
                    👩 Utilisatrice
                  </button>
                  <button
                    onClick={() => quickLoginAs("center")}
                    className="rounded-lg bg-white px-2 py-1 font-semibold text-[#543444] border border-[#ebd0d9] hover:bg-[#faedf1]"
                  >
                    🏥 Admin Centre (Schiphra)
                  </button>
                  <button
                    onClick={() => quickLoginAs("doctor")}
                    className="rounded-lg bg-white px-2 py-1 font-semibold text-[#543444] border border-[#ebd0d9] hover:bg-[#faedf1]"
                  >
                    🩺 Docteur (Sanou)
                  </button>
                  <button
                    onClick={() => quickLoginAs("association")}
                    className="rounded-lg bg-white px-2 py-1 font-semibold text-[#543444] border border-[#ebd0d9] hover:bg-[#faedf1]"
                  >
                    🎗️ Admin Asso (ABAC)
                  </button>
                  <button
                    onClick={() => quickLoginAs("superadmin")}
                    className="rounded-lg bg-purple-900 px-2 py-1 font-bold text-white shadow-xs"
                  >
                    🛡️ Superadmin
                  </button>
                </div>
              </div>

              {/* FORMULAIRE CONNEXION : NUMÉRO DE TÉLÉPHONE ET MOT DE PASSE AVEC OEILLET */}
              {authMode === "login" && (
                <form onSubmit={handleLoginSubmit} className="mt-3 space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#563746]">Numéro de téléphone *</label>
                    <input
                      type="tel"
                      required
                      value={loginForm.telephone}
                      onChange={(e) => setLoginForm({ ...loginForm, telephone: e.target.value })}
                      placeholder="Ex: 70 12 34 56"
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2.5 text-xs font-semibold focus:border-[#a14364] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#563746]">Mot de passe *</label>
                    <div className="relative mt-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={loginForm.motDePasse}
                        onChange={(e) => setLoginForm({ ...loginForm, motDePasse: e.target.value })}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-[#e4cfd6] p-2.5 pr-10 text-xs font-semibold focus:border-[#a14364] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-[#8f6476] hover:text-[#522b3e]"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#a14364] py-2.5 font-bold text-white shadow hover:bg-[#8d3955]"
                  >
                    Se connecter
                  </button>
                </form>
              )}

              {/* FORMULAIRE INSCRIPTION : AVEC CONFIRMATION DU MOT DE PASSE ET ŒILLETS */}
              {authMode === "register" && (
                <form onSubmit={handleRegisterSubmit} className="mt-3 space-y-2.5 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-[#563746]">Nom *</label>
                      <input
                        type="text"
                        required
                        value={registerForm.nom}
                        onChange={(e) => setRegisterForm({ ...registerForm, nom: e.target.value })}
                        placeholder="Ouedraogo"
                        className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#563746]">Prénom *</label>
                      <input
                        type="text"
                        required
                        value={registerForm.prenom}
                        onChange={(e) => setRegisterForm({ ...registerForm, prenom: e.target.value })}
                        placeholder="Aminata"
                        className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#563746]">Type de compte *</label>
                    <select
                      value={registerForm.role}
                      onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value as UserRole })}
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] bg-white p-2 text-xs font-semibold"
                    >
                      <option value="user">Utilisatrice / Patient</option>
                      <option value="admin">Administrateur / Professionnel (Validation Superadmin requise)</option>
                    </select>
                  </div>

                  {registerForm.role === "admin" && (
                    <>
                      <div>
                        <label className="block font-bold text-[#563746]">Catégorie administrative *</label>
                        <select
                          value={registerForm.adminType}
                          onChange={(e) => setRegisterForm({ ...registerForm, adminType: e.target.value as AdminType })}
                          className="mt-1 w-full rounded-xl border border-[#e4cfd6] bg-white p-2 text-xs font-semibold"
                        >
                          <option value="center">Centre de santé (Mise à jour de la carte)</option>
                          <option value="doctor">Docteur / Praticien (Entraînement de Rose IA & Orientation)</option>
                          <option value="association">Association / ONG (Annonces & Dons Orange Money)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-[#563746]">Nom de la structure / hôpital *</label>
                        <input
                          type="text"
                          required
                          value={registerForm.structureName}
                          onChange={(e) => setRegisterForm({ ...registerForm, structureName: e.target.value })}
                          placeholder="Ex: CMA Schiphra, ABAC, CHU Bogodogo..."
                          className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block font-bold text-[#563746]">Numéro de téléphone *</label>
                    <input
                      type="tel"
                      required
                      value={registerForm.telephone}
                      onChange={(e) => setRegisterForm({ ...registerForm, telephone: e.target.value })}
                      placeholder="Ex: 70 12 34 56"
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                    />
                  </div>

                  {/* Mot de passe avec œillet */}
                  <div>
                    <label className="block font-bold text-[#563746]">Mot de passe *</label>
                    <div className="relative mt-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={registerForm.motDePasse}
                        onChange={(e) => setRegisterForm({ ...registerForm, motDePasse: e.target.value })}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-[#e4cfd6] p-2 pr-9 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2 text-[#8f6476]"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirmer le mot de passe avec œillet */}
                  <div>
                    <label className="block font-bold text-[#563746]">Confirmer le mot de passe *</label>
                    <div className="relative mt-1">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={registerForm.confirmerMotDePasse}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmerMotDePasse: e.target.value })}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-[#e4cfd6] p-2 pr-9 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-2 text-[#8f6476]"
                      >
                        {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#a14364] py-2.5 font-bold text-white shadow"
                  >
                    Valider l'inscription
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL 2 : MISE À JOUR DU CENTRE DE SANTÉ (ADMIN CENTRE & DOCTEUR)   */}
        {/* ==================================================================== */}
        {showCenterUpdateModal && centerUpdateData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]">
            <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
                    <Edit3 size={18} />
                  </div>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#351c2a]">Mettre à jour mon centre</h3>
                    <p className="text-[10px] text-emerald-800 font-bold">{centerUpdateData.shortName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCenterUpdateModal(false)}
                  className="grid h-8 w-8 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveCenterUpdate} className="mt-3 space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#563746]">Statut de disponibilité actuel :</label>
                  <select
                    value={centerUpdateData.status}
                    onChange={(e) => {
                      const st = e.target.value as CenterStatus;
                      setCenterUpdateData({
                        ...centerUpdateData,
                        status: st,
                        statusLabel:
                          st === "available"
                            ? "Disponible · Attente fluide"
                            : st === "busy"
                              ? "Forte affluence · Prévoir attente"
                              : st === "maintenance"
                                ? "Appareil en maintenance technique"
                                : "Non actualisé",
                        statusColor:
                          st === "available"
                            ? "bg-emerald-500"
                            : st === "busy"
                              ? "bg-amber-500"
                              : st === "maintenance"
                                ? "bg-rose-500"
                                : "bg-slate-400",
                      });
                    }}
                    className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs font-bold"
                  >
                    <option value="available">🟢 Disponible / Fluide</option>
                    <option value="busy">🟠 Forte affluence</option>
                    <option value="maintenance">🔴 Appareil en panne / maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#563746]">État de l'équipement (Mammographe) :</label>
                  <input
                    type="text"
                    value={centerUpdateData.apparatus}
                    onChange={(e) => setCenterUpdateData({ ...centerUpdateData, apparatus: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-[#563746]">Nombre d'agents :</label>
                    <input
                      type="number"
                      value={centerUpdateData.agentsPresent}
                      onChange={(e) => setCenterUpdateData({ ...centerUpdateData, agentsPresent: Number(e.target.value) })}
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#563746]">File d'attente (pers.) :</label>
                    <input
                      type="number"
                      value={centerUpdateData.queueCount}
                      onChange={(e) => setCenterUpdateData({ ...centerUpdateData, queueCount: Number(e.target.value) })}
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#563746]">Temps d'attente estimé :</label>
                  <input
                    type="text"
                    value={centerUpdateData.estimatedWait}
                    onChange={(e) => setCenterUpdateData({ ...centerUpdateData, estimatedWait: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#563746]">Message vocal du jour (Français) :</label>
                  <textarea
                    rows={2}
                    value={centerUpdateData.audioMessageFr}
                    onChange={(e) => setCenterUpdateData({ ...centerUpdateData, audioMessageFr: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-600 py-2.5 font-bold text-white shadow"
                >
                  Publier la mise à jour en direct
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL 3 : ENTRAÎNER ROSE IA (RÉSERVÉ AUX MÉDECINS / DOCTEURS)         */}
        {/* ==================================================================== */}
        {showDoctorTrainModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]">
            <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl max-h-[90vh] overflow-y-auto border-2 border-blue-900">
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-950 text-white">
                    <GraduationCap size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#351c2a]">Entraîner Rose IA</h3>
                    <p className="text-[10px] text-blue-900 font-bold">Espace Supervision Praticien</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDoctorTrainModal(false)}
                  className="grid h-8 w-8 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleDoctorTeachAI} className="mt-3 space-y-2.5 text-xs">
                <div>
                  <label className="block font-bold text-[#563746]">Sujet clinique / Protocole :</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Permanence kystes douloureux, subvention..."
                    value={doctorTeachTopic}
                    onChange={(e) => setDoctorTeachTopic(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#563746]">Instructions médicales transmises à Rose IA :</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Expliquez la consigne que Rose IA doit intégrer pour conseiller ou orienter les patientes..."
                    value={doctorTeachContent}
                    onChange={(e) => setDoctorTeachContent(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-900 py-2.5 font-bold text-white shadow"
                >
                  Enseigner à Rose IA
                </button>
              </form>

              {/* Historique des connaissances enseignées */}
              <div className="mt-4 border-t border-[#f2e1e6] pt-3 text-xs">
                <p className="font-bold text-[#452737] mb-2">Connaissances médicales actives ({clinicalKnowledgeList.length}) :</p>
                <div className="space-y-2 max-h-[160px] overflow-y-auto">
                  {clinicalKnowledgeList.map((k) => (
                    <div key={k.id} className="rounded-xl border border-blue-200 bg-blue-50/60 p-2.5 text-[11px]">
                      <div className="flex justify-between font-bold text-blue-950">
                        <span>{k.topic}</span>
                        <span className="text-[9px] text-blue-800">{k.date}</span>
                      </div>
                      <p className="mt-1 text-[#4a3442]">{k.advice}</p>
                      <p className="mt-1 text-[9.5px] text-[#735163] italic">Validé par : {k.doctorName} ({k.speciality})</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL 4 : ORIENTER UNE PATIENTE SELON L'URGENCE (SOIGNANTS)          */}
        {/* ==================================================================== */}
        {showOrientationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]">
            <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl max-h-[90vh] overflow-y-auto border-2 border-emerald-800">
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-800 text-white">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#351c2a]">Orienter une patiente</h3>
                    <p className="text-[10px] text-emerald-800 font-bold">Fiche de transfert prioritaire</p>
                  </div>
                </div>
                <button
                  onClick={() => { setShowOrientationModal(false); setGeneratedOrientationCode(null); }}
                  className="grid h-8 w-8 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
                >
                  <X size={18} />
                </button>
              </div>

              {!generatedOrientationCode ? (
                <form onSubmit={handleCreatePatientOrientation} className="mt-3 space-y-2.5 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-[#563746]">Nom / Initiales *</label>
                      <input
                        type="text"
                        required
                        value={orientationForm.patientName}
                        onChange={(e) => setOrientationForm({ ...orientationForm, patientName: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#563746]">Téléphone *</label>
                      <input
                        type="tel"
                        required
                        value={orientationForm.patientPhone}
                        onChange={(e) => setOrientationForm({ ...orientationForm, patientPhone: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#563746]">Degré d'urgence médicale *</label>
                    <select
                      value={orientationForm.urgencyLevel}
                      onChange={(e) => setOrientationForm({ ...orientationForm, urgencyLevel: e.target.value as any })}
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs font-bold"
                    >
                      <option value="high">🔴 Urgence Haute (Sous 24h - Signe d'alerte / masse fixée)</option>
                      <option value="medium">🟠 Urgence Moyenne (Sous 48h - Nodule suspect)</option>
                      <option value="routine">🟢 Routine / Dépistage préventif</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#563746]">Centre de santé destinataire *</label>
                    <select
                      value={orientationForm.targetCenterId}
                      onChange={(e) => setOrientationForm({ ...orientationForm, targetCenterId: Number(e.target.value) })}
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs font-semibold"
                    >
                      {centers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.shortName} ({c.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#563746]">Observations cliniques :</label>
                    <textarea
                      rows={2}
                      value={orientationForm.clinicalObservations}
                      onChange={(e) => setOrientationForm({ ...orientationForm, clinicalObservations: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-emerald-800 py-2.5 font-bold text-white shadow"
                  >
                    Générer la fiche d'orientation
                  </button>
                </form>
              ) : (
                <div className="mt-3 space-y-3 text-xs text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-800">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                    <h4 className="ph-display text-base font-bold text-[#452737]">Fiche d'orientation prête</h4>
                    <p className="font-mono font-extrabold text-sm text-emerald-800 mt-1">{generatedOrientationCode}</p>
                  </div>

                  <div className="rounded-xl bg-[#fdfafb] border border-[#ebdbe2] p-3 text-left space-y-1 text-[11px]">
                    <div><b>Patiente :</b> {orientationForm.patientName} ({orientationForm.patientPhone})</div>
                    <div><b>Urgence :</b> {orientationForm.urgencyLevel === "high" ? "🔴 Sous 24h" : orientationForm.urgencyLevel === "medium" ? "🟠 Sous 48h" : "🟢 Routine"}</div>
                    <div><b>Centre :</b> {centers.find((c) => c.id === orientationForm.targetCenterId)?.name}</div>
                  </div>

                  <button
                    onClick={() => {
                      const msg = encodeURIComponent(`Fiche d'orientation PagLaafi (${generatedOrientationCode}) : Chère ${orientationForm.patientName}, vous êtes orientée vers ${centers.find((c) => c.id === orientationForm.targetCenterId)?.shortName} pour examen prioritaire.`);
                      window.open(`https://api.whatsapp.com/send?phone=226${orientationForm.patientPhone.replace(/\s/g, "")}&text=${msg}`, "_blank");
                    }}
                    className="w-full rounded-2xl bg-emerald-600 py-2.5 font-bold text-white shadow flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} /> Transmettre par WhatsApp à la patiente
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL 5 : TABLEAU DE BORD STATISTIQUE ADMIN (POUR TOUS LES ADMINS)   */}
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

              {/* Indicateurs clés */}
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

              {/* Transactions récentes Orange Money */}
              <div className="mt-3.5 border-t border-[#f2e1e6] pt-3 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-[#452737]">Dernières collectes Orange Money :</p>
                  <span className="text-[10px] text-[#f16e00] font-extrabold">#144#</span>
                </div>

                <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
                  {[
                    { id: "OM-BF-904123", donor: "Donatrice anonyme", amount: 10000, date: "Aujourd'hui 17h42", assoc: "ABAC" },
                    { id: "OM-BF-893102", donor: "Ouedraogo A.", amount: 5000, date: "Aujourd'hui 15h18", assoc: "ABAC" },
                    { id: "OM-BF-872291", donor: "Kaboré M.", amount: 25000, date: "Hier 19h10", assoc: "Beneere For A Cause" },
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
        {/* MODAL 6 : PANNEAU SUPERADMIN (VALIDATION DES STRUCTURES)             */}
        {/* ==================================================================== */}
        {showSuperadminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]">
            <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl border-2 border-purple-900">
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-950 text-white">
                    <ShieldCheck size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#351c2a]">Panneau Superadmin</h3>
                    <p className="text-[10px] text-purple-900 font-bold">Validation des inscriptions nationales</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSuperadminModal(false)}
                  className="grid h-8 w-8 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-3 space-y-2 text-xs">
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
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL 7 : PROCESSUS OFFICIEL ORANGE MONEY                            */}
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
                    <p className="text-[10px] text-orange-950 font-semibold">Validation Orange Money Burkina Faso</p>
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
                      <span className="text-[#7c5b6b]">Numéro débité :</span>
                      <span className="font-bold text-[#452737]">+226 {orangeMoneyPhone}</span>
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
