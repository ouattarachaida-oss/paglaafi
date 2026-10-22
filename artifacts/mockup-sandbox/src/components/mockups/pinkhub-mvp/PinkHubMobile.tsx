import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
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
  Copy,
  CreditCard,
  Database,
  Download,
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
  Smartphone,
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

// Annonce avec gestion du cycle de validation Superadmin, mois en cours et veille Rose IA
interface PartnerAnnouncement {
  id: number;
  title: string;
  author: string;
  authorType: "Association" | "Partenaire Santé" | "Hôpital" | "Veille Web Rose IA";
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
  isRoseAIDetected?: boolean; // Détecté par Rose IA sur internet / réseaux sociaux
  sourceWebUrl?: string; // Source repérée (ex: Page Facebook Ministère de la Santé)
  aiConfidence?: string; // Taux de fiabilité pré-validé par Rose IA
  pushMessageFr?: string; // Message push bienveillant en français
  pushMessageMoore?: string; // Message push en Mooré
  pushMessageDioula?: string; // Message push en Dioula
  pushSent?: boolean; // Statut d'envoi du push après validation Superadmin
  imageUrl?: string; // Photo ou affiche officielle de l'événement
  imageCaption?: string; // Légende ou descriptif de l'affiche
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
    title: "Grande Caravane Santé & Dépistage Féminin 100% Gratuit",
    author: "BE NEERE FOR CAUSE",
    authorType: "Association",
    city: "Ouagadougou, Bobo & Koudougou",
    date: "Du 1er au 31 Octobre 2026",
    month: "Octobre 2026",
    badge: "Campagne Officielle (0 FCFA)",
    badgeColor: "bg-emerald-100 text-emerald-800",
    imageUrl: "/images/affiche-evenement-beneere.jpg",
    imageCaption: "Affiche officielle de la Caravane Santé BE NEERE FOR CAUSE déployée au Burkina Faso",
    content: "L'organisation BE NEERE FOR CAUSE déploie ses unités mobiles de santé : dépistage gratuit du cancer du sein et du col de l'utérus, ateliers d'autopalpation guidée, conseils nutritionnels et orientation médicale immédiate pour toutes les femmes.",
    contact: "+226 70 20 11 22 / info@beneere.org",
    likes: 312,
    status: "approved",
    submittedBy: "BE NEERE FOR CAUSE BF",
    submittedAt: "12/10/2026",
  },
  {
    id: 2,
    title: "Hackathon E-Santé Féminine & Ateliers Numériques de Sensibilisation",
    author: "WOMENTECHMAKERS & ORANGE DIGITAL CENTER",
    authorType: "Association",
    city: "Ouagadougou (Siège Orange Digital Center)",
    date: "Vendredi 23 et Samedi 24 Octobre 2026",
    month: "Octobre 2026",
    badge: "Tech & E-Santé",
    badgeColor: "bg-purple-100 text-purple-900 border border-purple-200",
    imageUrl: "/images/affiche-wtm-odc.jpg",
    imageCaption: "Affiche WomenTechmakers & Orange Digital Center Burkina Faso : Innovating for Women's Health",
    content: "Women Techmakers et Orange Digital Center Burkina Faso mobilisent les développeuses, soignantes et innovatrices pour concevoir des outils numériques d'impact : apprentissage de l'autopalpation sur mobile, diffusion d'alertes en langues locales et inclusion numérique des femmes.",
    contact: "+226 76 50 33 44 / contact@wtmouaga.bf",
    likes: 278,
    status: "approved",
    submittedBy: "WomenTechmakers / ODC",
    submittedAt: "13/10/2026",
  },
  {
    id: 3,
    title: "Journées Cliniques : Bilan Gynécologique & Dépistage Subventionné",
    author: "GENIT CARE BURKINA",
    authorType: "Partenaire Santé",
    city: "Ouagadougou (Clinique GENIT CARE)",
    date: "Du 19 au 31 Octobre 2026",
    month: "Octobre 2026",
    badge: "Santé de la Femme",
    badgeColor: "bg-teal-100 text-teal-900 border border-teal-200",
    imageUrl: "/images/affiche-genit-care.jpg",
    imageCaption: "Affiche Clinique GENIT CARE Burkina : Votre partenaire d'excellence pour la santé gynécologique et le dépistage précoce",
    content: "La clinique GENIT CARE accueille les femmes du lundi au samedi pour un bilan complet : consultation gynécologique bienveillante, palpation mammaire experte, échographie, frottis et accompagnement des troubles du cycle et de l'endométriose à tarif hautement subventionné.",
    contact: "+226 25 30 10 10 / www.genitcarebf.org",
    likes: 245,
    status: "approved",
    submittedBy: "GENIT CARE Burkina",
    submittedAt: "14/10/2026",
  },
  {
    id: 4,
    title: "Opération Mammographies Subventionnées à 5 000 FCFA",
    author: "CMA de Schiphra & Partenaires Internationaux",
    authorType: "Hôpital",
    city: "Ouagadougou (Tanghin)",
    date: "Du 15 au 31 Octobre 2026",
    month: "Octobre 2026",
    badge: "Tarif Spécial 5 000 F",
    badgeColor: "bg-amber-100 text-amber-900",
    content: "Grâce aux donateurs de PagLaafi, 200 mammographies numériques sont subventionnées à 5 000 FCFA (au lieu de 12 000 FCFA) pour les femmes sans couverture sanitaire.",
    contact: "+226 25 36 30 70",
    likes: 195,
    status: "approved",
    submittedBy: "CMA Schiphra",
    submittedAt: "14/10/2026",
  },
  {
    id: 21,
    title: "Caravane Nationale Gratuite : Dépistage Seins & Col à Saaba",
    author: "Ministère de la Santé & Hygiène Publique BF",
    authorType: "Veille Web Rose IA",
    city: "Ouagadougou (Saaba)",
    date: "Samedi 24 Octobre 2026 dès 07h30",
    month: "Octobre 2026",
    badge: "🤖 Détecté par Rose IA",
    badgeColor: "bg-purple-100 text-purple-900 border border-purple-300",
    content: "Rose IA a détecté cette publication officielle sur les réseaux sociaux : Grande caravane de dépistage 100% gratuit du cancer du sein et du col de l'utérus (test IVA) au CSPS de Saaba avec échographies sur place.",
    contact: "+226 25 39 80 00 (Standard Ministère)",
    likes: 0,
    status: "pending_validation",
    isRoseAIDetected: true,
    sourceWebUrl: "Page Facebook Officielle Ministère Santé BF",
    aiConfidence: "98% (Certifié Ministère)",
    submittedBy: "Rose IA Radar Web",
    submittedAt: "Détecté il y a 25 min",
    pushMessageFr: "🌸 Rose IA : Dépistage seins & col 100% gratuit ce samedi au CSPS de Saaba ! Confirmé par le Ministère de la Santé.",
    pushMessageMoore: "🌸 Rose IA : Laafi tʋʋma Saaba CSPS pʋgẽ rũndã zaalem ! Dɔgɔtɔr dãmb na n ges yãmba.",
    pushMessageDioula: "🌸 Rose IA : Dɔgɔtɔrɔba kɛnɛya Saaba la bi fu ! Minisiriso bɛ bisimila kɛ musow ye.",
    pushSent: false,
  },
  {
    id: 22,
    title: "Journée Porte Ouverte & Consultations Gynécologiques Gratuites",
    author: "Collectif Femmes Solidaires Bobo",
    authorType: "Veille Web Rose IA",
    city: "Bobo-Dioulasso",
    date: "Dimanche 25 Octobre 2026",
    month: "Octobre 2026",
    badge: "🤖 Détecté par Rose IA",
    badgeColor: "bg-purple-100 text-purple-900 border border-purple-300",
    content: "Repéré sur WhatsApp & Facebook : Journée de solidarité pour les femmes des Secteurs 24 et 25 de Bobo-Dioulasso avec autopalpation guidée, sensibilisation à la nutrition sahélienne et dépistage précoce.",
    contact: "+226 71 44 55 66",
    likes: 0,
    status: "pending_validation",
    isRoseAIDetected: true,
    sourceWebUrl: "Groupe Facebook 'Bobo Infos & Solidarité Féminine'",
    aiConfidence: "92% (Source associative vérifiée)",
    submittedBy: "Rose IA Radar Web",
    submittedAt: "Détecté il y a 1h",
    pushMessageFr: "🌸 Rose IA : Journée de santé et dépistage gratuit ce dimanche pour les femmes de Bobo-Dioulasso !",
    pushMessageMoore: "🌸 Rose IA : Bobo pagbã laafi dahare rũndã ! Wa-y tɩ b ges yãmba zaalem.",
    pushMessageDioula: "🌸 Rose IA : Bobo musow ka kɛnɛya don ye bi ! Aw ye na kɛnɛyaso la.",
    pushSent: false,
  },
];

/**
 * Associations partenaires officielles éligibles aux dons & actions terrain
 */
const partnerAssociations: PartnerAssociation[] = [
  {
    id: 1,
    name: "BE NEERE FOR CAUSE",
    acronym: "BE NEERE",
    mission: "Organisation burkinabè pionnière : cliniques mobiles de dépistage gratuit, sensibilisation de proximité et prise en charge des femmes en milieu rural et périurbain.",
    city: "Ouagadougou, Bobo & Centre-Nord",
    verified: true,
    beneficiariesCount: "2 800 femmes dépistées et accompagnées",
  },
  {
    id: 2,
    name: "WOMENTECHMAKERS & ORANGE DIGITAL CENTER",
    acronym: "WTM / ODC",
    mission: "Synergie d'innovation numérique et sociale : développement de solutions e-santé locales, vulgarisation technologique contre le cancer et ateliers de sensibilisation pour les femmes.",
    city: "Ouagadougou & Bobo-Dioulasso",
    verified: true,
    beneficiariesCount: "1 950 femmes formées et orientées",
  },
  {
    id: 3,
    name: "GENIT CARE BURKINA",
    acronym: "GENIT CARE",
    mission: "Centre de référence en santé génésique de la femme : consultations gynécologiques bienveillantes, dépistage précoce, bilans sénologiques et prise en charge de l'endométriose.",
    city: "Ouagadougou",
    verified: true,
    beneficiariesCount: "3 200 examens et bilans réalisés",
  },
  {
    id: 4,
    name: "Fonds de Solidarité Patientes — CMA de Schiphra",
    acronym: "Fonds Schiphra",
    mission: "Subvention immédiate des mammographies, échographies et biopsies pour les patientes démunies adressées avec fiche d'orientation.",
    city: "Ouagadougou (Tanghin)",
    verified: true,
    beneficiariesCount: "620 examens pris en charge",
  },
  {
    id: 5,
    name: "Association Burkinabè d'Action contre le Cancer",
    acronym: "ABAC",
    mission: "Sensibilisation communautaire et plaidoyer pour l'accès universel aux traitements oncologiques au Burkina Faso.",
    city: "Ouagadougou",
    verified: true,
    beneficiariesCount: "1 450 femmes touchées",
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
 * Modèle pour les Pensées & Conseils Santé Bienveillants de Rose IA
 * En 4 langues (Français, Mooré, Dioula, English)
 */
interface RoseDailyTip {
  id: number;
  category: "hygiene" | "nutrition" | "mental" | "cycle" | "prevention";
  categoryLabel: string;
  categoryColor: string;
  titleFr: string;
  fr: string;
  en: string;
  moore: string;
  dioula: string;
}

const roseDailyTips: RoseDailyTip[] = [
  {
    id: 1,
    category: "nutrition",
    categoryLabel: "💧 Hydratation & Climat Sahélien",
    categoryColor: "bg-blue-100 text-blue-900 border-blue-200",
    titleFr: "Boire de l'eau en abondance",
    fr: "Prends soin de ton corps ma sœur : avec la chaleur du Burkina, bois au moins 2 à 3 litres d'eau aujourd'hui. L'eau purifie tes reins, prévient les infections urinaires et donne de l'éclat à ta peau.",
    en: "Take care of your body my sister: in this Sahelian heat, drink at least 2 to 3 liters of clean water today. Water cleanses your kidneys, prevents urinary infections and brightens your skin.",
    moore: "Koom yaa vɩɩm m maaso. Ne tʋʋlgã wɛɛngẽ, nyũ koom wʋsg rũndã (litr a yiibu n ta a tãabo). Koomã sõngda fo yĩnsa la a gɩdgd bãase.",
    dioula: "Ji ye ɲɛnamaya ye n ma muso. Funteni na, ji min kosɛbɛ bi (litiri fila fo saba). Ji bɛ kɛnɛya d'i ma k'i yɛrɛ lakatoloban bana juguw ma.",
  },
  {
    id: 2,
    category: "nutrition",
    categoryLabel: "🌿 Trésors Locaux : Moringa & Baobab",
    categoryColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
    titleFr: "Le pouvoir fortifiant du Moringa & Baobab",
    fr: "Nourris ta vitalité avec la richesse de notre terre burkinabè : les feuilles de Moringa sont une mine de fer contre la fatigue et l'anémie, et la pulpe de Baobab regorge de vitamine C. Ajoute-les à tes repas pour fortifier ton immunité.",
    en: "Nourish your vitality with local superfoods: Moringa leaves provide natural iron against anemia, and Baobab fruit powder is packed with vitamin C. Add them to your meals to boost immunity.",
    moore: "Moringa la zɩt-yɩla yaa arzɛka kãsenga d tẽngẽ. A kẽesda pãng fo yĩngẽ n tõog zɩ-komlemã. Rɩ-b sõma fo laafi yĩnga.",
    dioula: "Moringa jiri-buluw ani sira-den mugu ye nafolo ye. U bɛ jolidɛmɛ kɛ ani ka fanga di faso musow ma. U don i ka dumunifɛnw na.",
  },
  {
    id: 3,
    category: "hygiene",
    categoryLabel: "🌸 Hygiène Intime Bienveillante",
    categoryColor: "bg-pink-100 text-pink-900 border-pink-200",
    titleFr: "Douceur et respect de la flore intime",
    fr: "Un conseil d'amour pour ton intimité : lave uniquement la partie extérieure à l'eau propre. Le vagin se nettoie tout seul, évite les douches vaginales internes ou produits parfumés décapants qui détruisent sa flore protectrice.",
    en: "Gentle intimate hygiene: wash only the external area with clean water. The vagina cleanses itself; avoid internal douching or scented products that harm natural defenses.",
    moore: "Yĩn-sõngr wɛɛngẽ: rɩk ko-sõma n peeg fo meng yĩng zĩ-kẽemã yell bal. Da rɩk tɩɩm dãmb n dʋg fo pʋgẽ ye. Sã n mik tɩ yãmb wʋmda yĩn-wẽk, kẽng-y dɔgɔtɔr nengẽ.",
    dioula: "I yɛrɛ saniya ko la: ji saniya dɔrɔn de kɛ kɔkan. Kana fɛn gɛlɛnw don kɔnɔna na. Ni fɛn dɔ y'i gɛlɛya, taga dɔgɔtɔrɔmuso fɛ sabali.",
  },
  {
    id: 4,
    category: "mental",
    categoryLabel: "🧘‍♀️ Sérénité & Amour de Soi",
    categoryColor: "bg-purple-100 text-purple-900 border-purple-200",
    titleFr: "Tu as le droit de te reposer",
    fr: "Ma sœur, tu portes souvent le fardeau de toute la famille. N'oublie jamais que ton bien-être passe en premier : accorde-toi 15 minutes de calme et de repos aujourd'hui. Tu es précieuse, aimée et ton repos est légitime.",
    en: "My sister, you often carry the weight of the family. Never forget your well-being matters: take 15 minutes of calm and rest today. You are precious, loved, and rest is your right.",
    moore: "Yãmb tʋmda tʋʋm wʋsg zakã pʋgẽ. Da yĩm tɩ y meng laafi yaa tɩlae ye. Vʋʋsm-y bilfu rũndã. Yãmb yaa arzɛka kãsenga.",
    dioula: "I bɛ baara caman kɛ somɔgɔw ye. Kana ɲinɛ i yɛrɛ laafi kɔ. Lafiɲɛ dɔrɔn kɛ bi. I kɛnɛya kɔrɔtanin lo an bɛɛ fɛ.",
  },
  {
    id: 5,
    category: "cycle",
    categoryLabel: "🩸 Cycle & Règles Paisibles",
    categoryColor: "bg-rose-100 text-rose-900 border-rose-200",
    titleFr: "Apaiser les crampes et règles douloureuses",
    fr: "Si ton ventre te fait souffrir pendant tes règles : pose un linge tiède sur ton bas-ventre, bois une infusion tiède de gingembre ou de kinkeliba, et marche doucement. Si la douleur est insupportable, n'hésite jamais à consulter un soignant.",
    en: "If you experience menstrual cramps: place a warm cloth on your lower abdomen, sip warm ginger or kinkeliba tea, and take gentle walks. If severe, consult a healthcare worker.",
    moore: "Sã n mik tɩ pʋg-tõor namsda yãmba pʋg-peelgã wakato : ning-y bõn-tʋʋlga y pʋgẽ, nyũ-y gingembre ko-tʋʋlga. Yãmb pa segd n nams ye.",
    dioula: "Ni kɔnɔdimi b'i la i ka kalo-sira la: fɛn kaliman bila i kɔnɔ la, jinɛbɛrɛ-ji sumana min. Ni dimi ka bon kojugu, an k'a fɔ dɔgɔtɔrɔ ye.",
  },
  {
    id: 6,
    category: "prevention",
    categoryLabel: "🩺 Prévention Globale & Dépistage",
    categoryColor: "bg-amber-100 text-amber-900 border-amber-200",
    titleFr: "Le geste d'amour pour ton avenir",
    fr: "Le dépistage précoce (col de l'utérus et seins) n'est pas une sentence, c'est un bouclier d'amour pour toi et tes enfants. Le test IVA et l'autopalpation mensuelle sauvent des vies chaque jour au Burkina Faso.",
    en: "Early screening (cervix and breast) is not a diagnosis, it is a shield of love for yourself and family. VIA test and monthly self-exams save lives daily in Burkina Faso.",
    moore: "Laafi baoob pa bãag ye, yaa gɩdgre ninsaal ne a kamba yĩnga. D ges d seensã la d pʋgã kɛnɛya sõma n gɩdg bã-kãsengã.",
    dioula: "Kɛnɛyaso tagali tɛ bana ye, a ye lakana ye. Sinw bɔlɔkɔrɔ lajɛ ani kalo-kɔnɔ lajɛ bɛ denw baminaw kisi bana juguw ma.",
  },
];

/**
 * Base de connaissances holistique & éthique de Rose IA en 4 langues
 * Couvre : Hygiène intime, Nutrition sahélienne, Cycle menstruel, Bien-être mental,
 * Col de l'utérus, Maternité, Ménopause et Santé mammaire.
 */
const roseKnowledge = {
  hygiene_intime: {
    fr: "Ma sœur, ton intimité est précieuse et délicate. La règle d'or des soignants est simple : lave uniquement la partie extérieure (la vulve) à l'eau propre ou avec un savon doux sans parfum. Ne fais JAMAIS de douche vaginale interne ni n'introduis de poudres ou produits décapants : le vagin possède son propre système d'auto-nettoyage et ces produits détruisent ses défenses naturelles. Porte des sous-vêtements en coton pour laisser respirer ta peau avec la chaleur. Si tu as des démangeaisons, une sensation de brûlure ou des pertes odorantes, viens sans aucune honte consulter une sage-femme.",
    en: "My sister, your intimate health is precious. Wash only the external area (the vulva) with clean water or mild unscented soap. NEVER practice internal vaginal douching or use harsh astringents: the vagina cleanses itself naturally. Wear breathable cotton underwear. If you experience itching, burning, or unusual discharge, visit a midwife with confidence and no shame.",
    moore: "M maaso, fo yĩng sõngr yaa tɩlae wʋsg. Rɩk koom sõma bal n peeg fo meng yĩng zĩ-kẽemã yell bal. Da rɩk tɩɩm dãmb n kẽes fo pʋgẽ ye, bala a sãamda fo yĩnsa laafi. Yeelg fu-kõbdo sẽn yaa koton. Sã n mik tɩ yĩn-wẽk bee fo laafɩ wɛɛngẽ, kẽng n ges dɔgɔtɔr-pʋgbo.",
    dioula: "N ma muso, i yɛrɛ saniya ko ka kɔrɔtanin kosɛbɛ. Ji saniya dɔrɔn de kɛ kɔkan, kana fɛn juguw don kɔnɔna na abada. Saniya fɛnw bɛ kɛnɛya tiɲɛ. Koton faniw don funteni senfɛ. Ni fɛn dɔ y'i gɛlɛya walima ka dimi, taga dɔgɔtɔrɔmuso fɛ sabali.",
  },
  nutrition_locale: {
    fr: "Pour préserver ta vitalité et ta santé au Burkina Faso, la nature nous a offert des trésors extraordinaires : les feuilles de Moringa (véritable 'arbre de vie') regorgent de fer contre la fatigue et l'anémie, la pulpe de Baobab (pain de singe) est un concentré de vitamine C et d'antioxydants, et le Soumbala traditionnel protège le cœur et la tension. Évite les bouillons cubes industriels trop salés qui fatiguent les reins, et bois au moins 2 à 3 litres d'eau propre par jour pour compenser la chaleur sahélienne.",
    en: "To boost your vitality in our Sahelian climate, local foods are true superfoods: Moringa leaves provide abundant iron against anemia, Baobab fruit (pain de singe) is rich in vitamin C and antioxidants, and authentic Soumbala supports heart health. Reduce salty industrial seasoning cubes, and drink 2 to 3 liters of clean water daily to stay well hydrated.",
    moore: "Burkina Faso ka, Wẽnd kõ-d-la rɩɩb sõma wʋsg: moringa vaadã kẽesda pãng fo zɩlem pʋgẽ n gɩdg zɩ-komlem, tɔɔd bɩ zɩt-yɩla waoogda pãng, la sumbala sõngda sũurã laafi. Gɩdg yĩn-kũud tɩɩm dãmb sẽn tar yaalem wʋsg, la nyũ-y ko-sõma litr a yiibu n ta a tãabo dahar fãa.",
    dioula: "An ka faso la, kɛnɛya dumunifɛnw caman bɛ yen: moringa buluw bɛ fanga di joliko la, sira-den bɛ kɛnɛya gansan di, ani sumbala bɛ dusu mara. Maggi cube ka caya tɛ kɛnɛya ye, ji min litiri fila fo saba don o don funteni senfɛ.",
  },
  regles_douleurs: {
    fr: "Je te comprends tellement, les douleurs de règles peuvent être très éprouvantes. Voici des gestes doux et naturels pour t'apaiser : applique un linge ou une bouillotte tiède sur ton bas-ventre, bois une infusion chaude de gingembre ou de kinkeliba, masse doucement ton ventre avec un peu de beurre de karité, et repose-toi. Prends du paracétamol si nécessaire, mais si les douleurs sont si intenses qu'elles t'empêchent de te lever ou de travailler, cela peut être le signe d'une affection comme l'endométriose : parle-en à un gynécologue.",
    en: "I hear you, menstrual pain can be genuinely debilitating. To soothe cramps naturally: apply a warm cloth to your lower belly, drink warm ginger or kinkeliba tea, gently massage with shea butter, and take rest. If cramps are severe and prevent your normal activities, consult a gynecologist to check for conditions like endometriosis.",
    moore: "Pʋg-tõor namsda pagb wʋsg. Bõn-sõma n tõe n koms-a: ning-y fu-tʋʋlga y pʋgẽ, nyũ-y gingembre koom bɩ kinkeliba ko-tʋʋlga, rɩk karité kam n so y pʋgã bilfu, la y vʋʋse. Sã n mik tɩ pʋg-tõorã yɩɩ kãsenga wʋsg hal n pa tõe n yĩk, kẽng n ges dɔgɔtɔrã.",
    dioula: "Kalo-sira dimi bɛ muso caman tɔɔrɔ. Walasa k'a dɔgɔya: fɛn kaliman bila i kɔnɔ la, jinɛbɛrɛ-ji sumana min, si-tulu dɔoni kɛ i kɔnɔ la ka lafiɲɛ kɛ. Ni dimi ka bon kojugu fo i tɛ se ka wuli, taga dɔgɔtɔrɔ fɛ k'a sɛgɛsɛgɛ.",
  },
  bien_etre_mental: {
    fr: "Ma sœur, pose ce fardeau quelques instants et écoute ton cœur : tu passes tes journées à prendre soin des autres, de la famille et du foyer, mais qui prend soin de toi ? Ton esprit et ton corps ont besoin de douceur. Respire profondément trois fois en fermant les yeux. Tu as le droit d'être fatiguée, tu as le droit de dire non, tu as le droit de te reposer. Tu n'es pas seule, je suis là pour veiller sur toi avec toute ma tendresse.",
    en: "My sister, set down your burden for a moment: you spend your days caring for everyone else, but who cares for you? Your mind and body deserve gentle kindness. Take three deep breaths. You have the right to feel tired, to say no, and to rest. You are never alone; I am here with warmth and care.",
    moore: "M maaso, vʋʋsm bilfu n kẽes sũ-noogo fo meng pʋgẽ. Fo tʋmda dahar fãa zakã neb yĩnga, la fo segd n ges fo meng me laafi. Vʋʋsm zĩ-sõngo. Fo tara sor n na n vʋʋse. Fo ka fo yembr ye, mam be ne fo dahar fãa.",
    dioula: "N ma muso, i lafiɲɛ dɔrɔn kɛ. I bɛ mɔgɔw bɛɛ ladon don o don, nka i yɛrɛ do? I ni lafiɲɛ fana kɔrɔtanin lo. Ni hakili-gɛlɛya b'i la, hakili saba minɛ. I ma kelen ye, an bɛ i kɔrɔ kosɛbɛ.",
  },
  col_uterus: {
    fr: "Le col de l'utérus mérite toute ton attention : le cancer du col de l'utérus est l'un des plus fréquents en Afrique, mais c'est aussi le plus facile à éviter ! Un simple dépistage par inspection visuelle (test IVA) ou frottis, réalisé en quelques minutes par une sage-femme, permet de repérer et traiter d'éventuelles lésions bien avant qu'elles ne deviennent graves. C'est rapide, indolore et disponible dans les CSPS et CMA du Burkina. Fais ce dépistage tous les 3 ans !",
    en: "Cervical health is vital: cervical cancer is common, yet completely preventable! A quick visual inspection (VIA test) or pap smear performed in minutes by a midwife detects precancerous lesions years in advance. It is fast, painless, and available at health centers across Burkina Faso. Get screened every 3 years!",
    moore: "Pʋg-kɛenga laafi yaa tɩlae wʋsg. Bãaga wã tõe n gɩdgame sã n mik tɩ dɔgɔtɔr ges-a zĩigẽ (test IVA). A pa namsd ye, a pa rɩkd wakat wʋsg ye, la a bee Burkina Faso kɛnɛyaso fãa pʋgẽ. Bãng-y fo laafi yʋʋm a tãab fãa pʋgẽ.",
    dioula: "Kɔnɔna juru bana bɛ se ka bali sani a ka juguya. Dɔgɔtɔrɔmuso bɛ se k'a lajɛ sekondi damanin kɔnɔ (test IVA). A tɛ dimi, a tɛ mɔgɔ namsi, a bɛ sɔrɔ an ka kɛnɛyasow bɛɛ la. O kɛ kalo 36 o kalo 36 kɔnɔ.",
  },
  grossesse_menopause: {
    fr: "Chaque étape de ta vie de femme est un voyage sacré. Que tu sois en désir d'enfant, enceinte, jeune maman ou en période de ménopause, ton corps s'adapte en permanence. Pendant la ménopause, les bouffées de chaleur et sautes d'humeur sont courantes : bois frais, consomme du soja et du calcium, et pratique la marche. Si tu as des saignements inattendus après la ménopause ou pendant la grossesse, consulte immédiatement un soignant.",
    en: "Every stage of a woman's journey is unique. Whether during pregnancy, postpartum, or menopause, your body evolves. During menopause, hot flashes and mood shifts are normal: stay hydrated, eat calcium-rich local foods, and take brisk walks. Any unexpected bleeding after menopause or during pregnancy requires prompt medical evaluation.",
    moore: "Pʋg-yãmb laafi tekda wakat fãa: pʋg-tũub wakat, bi-doglem wakat, bɩ kʋdemd wakat. Kʋdemdã sasa, tʋʋlg namsda pagb wʋsg. Nyũ-y ko-sumdo, rɩ-y rɩ-sõma. Sã n mik tɩ zɩɩm yii fo meng pʋgẽ tɩ pa wakat, kẽng dɔgɔtɔr tao-tao.",
    dioula: "Musoya ye yɛlɛmali yɔrɔ ye: kɔnɔtigi, denbaya, walima musokɔrɔya. Musokɔrɔya sɔrɔlen, funteni kɔnɔna na bɛ se ka kɛ. Ji sumana min, dumuni kɛnɛ kɛ. Ni jolidon kɛra kɔfɛ, taga dɔgɔtɔrɔmuso fɛ jona.",
  },
  mal: {
    fr: "Rassurez-vous avec tendresse : la mammographie ne fait généralement pas mal. C'est une pression ferme mais très brève (5 à 10 secondes par image) pour bien visualiser les tissus. Pour un confort optimal, prévoyez votre examen dans les 10 jours suivant la fin de vos règles, quand la poitrine est très souple.",
    en: "Rest assured with calm: mammography is generally not painful. It is a brief compression (5 to 10 seconds per view) to clearly display breast tissue. For greatest comfort, schedule it within 10 days after your period ends.",
    moore: "Da zoe rabeem ye: mammographie masĩnã pa namsd ninsaal wʋsg ye. A rɩkda sekõnd a wãn bal n kaset. Sã n mik tɩ y kẽngda pʋg-peelgã poore, yĩnsã tara pãng tɩ pa namsd ye.",
    dioula: "I kana siran: masin nin tɛ mɔgɔ dimi kosɛbɛ. A bɛ kɛ sekondi damanin dɔrɔn lo kɔnɔ. Ni kalo-sira banna, o de ye wagati ɲuman ye ka taga lajɛ kɛ.",
  },
  prix: {
    fr: "Au Burkina Faso, la palpation clinique de dépistage est GRATUITE (0 FCFA) dans les centres publics et les campagnes associatives. L'échographie coûte entre 6 000 et 7 500 FCFA, et la mammographie environ 10 000 à 12 000 FCFA (subventionnée à 5 000 FCFA à Schiphra pour les femmes vulnérables). L'argent ne doit jamais être un frein à ta santé.",
    en: "In Burkina Faso, clinical breast exams are FREE (0 FCFA) at public centers and outreach campaigns. Ultrasound costs 6,000 to 7,500 FCFA, and mammography 10,000 to 12,000 FCFA (subsidized to 5,000 FCFA at Schiphra for vulnerable women). Financial worries should never keep you from care.",
    moore: "Burkina Faso ka, nus n gesã yaa zaalem (0 FCFA) kɛnɛyaso wʋsg pʋgẽ. Échographie yaa 6 000 n ta 7 500 FCFA, la mammographie yaa 10 000 n ta 12 000 FCFA (subventionné a 5 000 FCFA Schiphra). Ligdi da yɩ gɩdgr fo laafɩ wɛɛngẽ ye.",
    dioula: "Burkina Faso la, bɔlɔkɔrɔ lajɛ sɔngɔ ye fu ye (0 FCFA). Échographie ye 6 000 fo 7 500 FCFA ye, mammographie ye 10 000 fo 12 000 FCFA ye. Wari kana kɛ gɛlɛya ye i ka kɛnɛya siratigɛ la.",
  },
  boule: {
    fr: "Respire calmement, ma sœur, ne panique pas : dans plus de 8 cas sur 10, une boule ou un nodule n'est PAS un cancer (il s'agit très souvent de simples kystes bénins d'eau ou d'adénofibromes fréquents). Cependant, la seule façon d'en avoir le cœur net et d'être en paix est de la faire examiner rapidement par une sage-femme ou un médecin. Je t'accompagne.",
    en: "Breathe gently, my sister, do not panic: over 8 out of 10 breast lumps are NOT cancer (they are usually benign fluid cysts or fibroadenomas). However, having it examined promptly by a midwife or doctor brings complete peace of mind. I am with you.",
    moore: "Vʋʋsm sõma m maaso, da zoe rabeem ye: bõn-kʋds a nii (8) piig pʋgẽ pa bã-kãsenga ye (yaa kystes bal). La yaa tɩlae tɩ dɔgɔtɔr ges-a tao-tao tɩ fo sũur gãande. Mam be ne yãmba.",
    dioula: "I ni lafiɲɛ dɔrɔn, kana siran : bõn-kʋdga tan kɔnɔ segin tɛ bana juguman ye. Nka kɛnɛyaso lajɛ jona de bɛ hakili sigi dɔgɔtɔrɔmuso fɛ. Ne b'i kɔrɔ.",
  },
  default: {
    fr: "Bonjour ma sœur, je suis Rose IA, ta compagne de santé et de bien-être. Je suis là pour t'écouter avec amour, respect et sans aucun tabou : ton hygiène intime, ta nutrition (moringa, baobab), tes règles, ton stress, ton sommeil ou le dépistage de ta santé. Que ressens-tu dans ton corps ou dans ton cœur aujourd'hui ?",
    en: "Hello my sister, I am Rose AI, your health and wellness companion. I am here to listen with compassion and respect: intimate hygiene, Sahelian nutrition (moringa, baobab), menstrual health, stress relief, or health screenings. How are you feeling in your body and heart today?",
    moore: "Ne y beogo m maaso, mam yaa Rose IA. M be n na n sõng yãmba ne laafi wɛɛngẽ: yĩn-sõngr, rɩɩb sõma (moringa, baobab), pʋg-tõor, sũ-sãanga bɩ bãas gɩdgre. Bõe n namsda fo rũndã ?",
    dioula: "I ni sɔgɔma n ma muso, ne ye Rose IA ye. Ne bɛ yan k'i dɛmɛ kɛnɛya ni lafiɲɛ ko la: i yɛrɛ saniya, dumuni ɲuman (moringa, sira-den), kalo-sira, hakili-gɛlɛya walima lajɛw. Mun b'i kɔnɔ bi ?",
  },
};

/**
 * ============================================================================
 * COMPOSANT PRINCIPAL : PINKHUB MOBILE
 * ============================================================================
 */
export function PinkHubMobile() {
  // 1. Écran de démarrage (Splash Screen) "Powered by Rose IA" avec décompte de 5 secondes
  const [showSplash, setShowSplash] = useState(true);
  const [splashProgress, setSplashProgress] = useState(0);

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

  // Retour haptique tactile pour ergonomie d'application mobile native
  const hapticFeedback = (duration: number = 15) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(duration);
      } catch {
        // Silencieux si non supporté
      }
    }
  };

  // Utilisateur actuellement connecté (initialisé à null au démarrage pour atterrir sur l'écran de connexion après le splash de 5 secondes)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Sauvegarde persistante de la session utilisateur
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (currentUser) {
        localStorage.setItem("paglaafi_current_user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("paglaafi_current_user");
      }
    } catch {
      // Ignorer
    }
  }, [currentUser]);

  // Gestion de l'installation PWA & Détection Mode Application Standalone
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandaloneApp, setIsStandaloneApp] = useState(false);
  const [showPwaInstallModal, setShowPwaInstallModal] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandaloneApp(isStandalone);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleTriggerInstall = async () => {
    hapticFeedback(25);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        notify("Installation de PagLaafi en cours sur votre appareil !");
        setDeferredPrompt(null);
        setShowPwaInstallModal(false);
      }
    } else {
      setShowPwaInstallModal(true);
    }
  };

  // Lien dynamique de l'application pour inviter une proche ou un accompagnant
  const appShareUrl = useMemo(() => {
    if (typeof window === "undefined") return "https://paglaafi.bf/";
    return window.location.origin + window.location.pathname;
  }, []);

  // Fonction universelle de déconnexion
  const handleLogout = () => {
    hapticFeedback(20);
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
      bg: "bg-gradient-to-tr from-[#6c1543] to-[#ba486e]",
      text: "text-white",
      border: "border-rose-300",
      badgeText: "Utilisatrice",
      badgeBg: "bg-[#6c1543] text-white",
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
  const [superadminRegionFilter, setSuperadminRegionFilter] = useState<string>("all");
  const [superadminAnnouncementTab, setSuperadminAnnouncementTab] = useState<"all" | "rose_ai" | "partners">("all");

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

  // 8. Assistant Vocal & Compagne de Santé ROSE IA (Santé globale, Bien-être, Hygiène de vie & Éthique)
  const [dailyTipIndex, setDailyTipIndex] = useState(0);
  const [dailyTipLang, setDailyTipLang] = useState<"fr" | "moore" | "dioula" | "en">("fr");
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  const initialDefaultRoseMessages = [
    {
      sender: "rose" as const,
      text: "Bonjour ma sœur, je suis Rose IA, ta compagne de santé et de bien-être. Je suis à ton écoute avec bienveillance, sans jugement et dans le respect total de ta pudeur : hygiène intime, nutrition sahélienne (moringa, baobab), apaisement des règles, sérénité mentale ou dépistage. Écris-moi en toute confiance ou touche le micro.",
      englishText: "Hello my sister, I am Rose AI, your caring health and well-being companion. I am here for your holistic health: intimate care, nutrition, menstrual comfort, mental peace, and screenings.",
      mooreText: "Ne y beogo m maaso ! Mam yaa Rose IA, fo laafi zoa. Mam be ka n na n sõng yãmba ne yĩn-sõngr, rɩɩb sõma, pʋg-tõor bɩ bãas gɩdgre. Sok-y maam bũmb fãa y sẽn ratã.",
      dioulaText: "I ni sɔgɔma n ma muso ! Ne ye Rose IA ye. Ne bɛ yan k'i dɛmɛ kɛnɛya, i yɛrɛ saniya, kalo-sira ani hakili-sigi la. Mun b'i kɔnɔ bi ?",
      time: "Maintenant",
    },
  ];

  const [roseMessages, setRoseMessages] = useState<
    Array<{ sender: "user" | "rose"; text: string; time: string; englishText?: string; mooreText?: string; dioulaText?: string }>
  >(() => {
    if (typeof window === "undefined") return initialDefaultRoseMessages;
    try {
      const s = localStorage.getItem("paglaafi_rose_messages");
      return s ? JSON.parse(s) : initialDefaultRoseMessages;
    } catch {
      return initialDefaultRoseMessages;
    }
  });

  // Sauvegarde continue de la discussion Rose IA
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("paglaafi_rose_messages", JSON.stringify(roseMessages));
    } catch {
      // Ignorer
    }
  }, [roseMessages]);

  const [roseInput, setRoseInput] = useState("");
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [roseSpeaking, setRoseSpeaking] = useState(false);
  // Mode de discussion avec Rose IA : "text" (discussion écrite) ou "voice" (discussion orale/audio directe)
  const [roseChatMode, setRoseChatMode] = useState<"text" | "voice">("text");
  const [oralVoiceLang, setOralVoiceLang] = useState<"fr" | "moore" | "dioula" | "en">("fr");
  // Sélecteur de langue globale discret pour tous les écrans et tous les profils (avec persistance)
  const [appLanguage, setAppLanguage] = useState<"fr" | "moore" | "dioula" | "en">(() => {
    if (typeof window === "undefined") return "fr";
    return (localStorage.getItem("paglaafi_app_lang") as any) || "fr";
  });
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const lastVoiceTranscriptRef = useRef<string>("");
  const handleSendRoseMessageRef = useRef<(text?: string, speak?: boolean) => void>(() => {});

  const handleSelectAppLanguage = (lang: "fr" | "moore" | "dioula" | "en") => {
    hapticFeedback(15);
    setAppLanguage(lang);
    setSpeechLanguage(lang);
    setDailyTipLang(lang);
    setOralVoiceLang(lang);
    setShowLanguageMenu(false);
    try {
      localStorage.setItem("paglaafi_app_lang", lang);
    } catch {
      // Ignorer
    }
    const langNames = {
      fr: "Français 🇫🇷",
      moore: "Mooré 🇧🇫",
      dioula: "Dioula 🇧🇫",
      en: "English 🇬🇧",
    };
    notify(`Langue changée : ${langNames[lang]}`);
  };

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
  // 9. Espace Docteur : Simulation du Parcours d'Entraînement de Rose IA (4 étapes)
  const [showDoctorTrainModal, setShowDoctorTrainModal] = useState(false);
  const [doctorTrainStep, setDoctorTrainStep] = useState<1 | 2 | 3 | 4>(1);
  const [doctorTeachTopic, setDoctorTeachTopic] = useState("Permanence urgences mammaires & Nodule suspect");
  const [doctorTeachContent, setDoctorTeachContent] = useState(
    "Pour toute patiente présentant un nodule dur et fixé, l'accueil se fait sans rendez-vous préalable tous les matins au service d'imagerie. Une mammographie et une échographie mammaire sont prescrites en urgence 48h.",
  );
  const [doctorEmpathicReformulation, setDoctorEmpathicReformulation] = useState({
    fr: "Ma sœur, rassure-toi : un nodule n'est pas forcément grave, mais ton corps mérite toute notre attention. Viens directement sans rendez-vous au CMA Schiphra ou CHU Bogodogo dès demain matin à 08h. Une sage-femme et un radiologue vont t'examiner avec douceur.",
    moore: "M maaso, da zoe rabeem ye: bõn-kʋdga pa bãag fãa ye, la yaa tɩlae tɩ d ges-a tao-tao. Wa-y zĩigẽ zaabre n mik dɔgɔtɔrã tɩ b ges yãmba ne laafi.",
    dioula: "N ma muso, kana siran : fɛn o fɛn bɛ sin na, a bɛɛ tɛ bana juguman ye. Nka taga kɛnɛyaso la jona sɔgɔma fɛ walasa dɔgɔtɔrɔmuso ka lajɛ saniya kɛ.",
  });
  const [doctorTestQuestion, setDoctorTestQuestion] = useState(
    "J'ai senti une boule un peu dure dans mon sein droit qui ne me fait pas mal, est-ce que je dois m'inquiéter ?",
  );
  const [doctorTestAnswer, setDoctorTestAnswer] = useState<string | null>(null);
  const [doctorSignName, setDoctorSignName] = useState("Dr. Ibrahim Sanou");
  const [doctorSignRole, setDoctorSignRole] = useState("Gynécologue-Obstétricien · CHU Bogodogo");

  // 9.bis Paramètres de Confidentialité & Éthique des Données (Local-First, Zéro Tracking)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    localOnlyCycle: true, // Données de cycle et règles stockées 100% sur le téléphone
    contributeAiClinical: true, // Partage des protocoles médicaux soignants pour enrichir Rose IA
    anonymizedAssociationData: true, // Données agrégées pour les associations et l'expérience naturelle
    urgentClinicalConsent: false, // Données médicales partagées uniquement sur demande d'un soignant
    offlineModeCache: true, // Mise en cache hors-ligne des centres et audios
  });

  // 10. Espace Soignant : Orientation & Recommandation patiente d'urgence
  const [showOrientationModal, setShowOrientationModal] = useState(false);
  const [orientationForm, setOrientationForm] = useState({
    patientName: "K. Fatoumata",
    patientPhone: "70 88 99 00",
    urgencyLevel: "immediate" as "immediate" | "priority" | "routine",
    targetCenterId: 1,
    clinicalObservations: "Masse rétro-aréolaire droite de 2.5 cm, indolore, évoluant depuis 2 mois. Pas d'adénopathie palpable.",
    recommendedExam: "Mammographie numérique bilatérale + Échographie mammaire",
  });
  const [generatedOrientationCode, setGeneratedOrientationCode] = useState<string | null>(null);

  // Registre partagé des orientations d'urgence (Docteur ➔ Centre de Santé)
  const [urgentOrientations, setUrgentOrientations] = useState([
    {
      id: "PAG-URG-2026-4821",
      patientName: "K. Fatoumata",
      patientPhone: "+226 70 88 99 00",
      patientAge: 42,
      doctorName: "Dr. Ouédraogo Aminata",
      doctorSpecialty: "Gynécologue-Obstétricienne",
      targetCenterId: 1,
      targetCenterName: "CMA Schiphra",
      urgencyLevel: "immediate" as "immediate" | "priority" | "routine",
      urgencyLabel: "🚨 Immédiat (< 24h)",
      clinicalObservations: "Masse rétro-aréolaire droite de 2.5 cm, indolore, évoluant depuis 2 mois. Rétraction cutanée légère constatée.",
      recommendedExam: "Mammographie numérique bilatérale + Échographie mammaire",
      status: "pending_center" as "pending_center" | "accepted_urgent" | "scheduled_wait",
      centerValidationMessage: "",
      centerEstimatedDelay: "",
      createdAt: "Aujourd'hui à 08h45",
    },
    {
      id: "PAG-URG-2026-3190",
      patientName: "T. Salimata",
      patientPhone: "+226 76 11 22 33",
      patientAge: 38,
      doctorName: "Dr. Kaboré Jean-Baptiste",
      doctorSpecialty: "Médecin Généraliste",
      targetCenterId: 1,
      targetCenterName: "CMA Schiphra",
      urgencyLevel: "priority" as "immediate" | "priority" | "routine",
      urgencyLabel: "⚠️ Prioritaire (48h-72h)",
      clinicalObservations: "Écoulement unilatéral suspect mamelon gauche sans nodule franc à la palpation. Antécédents familiaux de cancer du sein.",
      recommendedExam: "Échographie mammaire ciblée",
      status: "accepted_urgent" as "pending_center" | "accepted_urgent" | "scheduled_wait",
      centerValidationMessage: "Patiente attendue ! Équipe Schiphra prévenue. Accueil direct guichet 3.",
      centerEstimatedDelay: "Prise en charge directe (< 15 min)",
      createdAt: "Hier à 16h20",
    },
  ]);

  // 11. Tableau de bord Administrateurs
  const [showAdminDashboardModal, setShowAdminDashboardModal] = useState(false);

  // 12. Calendrier Féminin : Règles, Autopalpation, Prédiction & Recalibration (avec persistance locale)
  const [lastPeriodDate, setLastPeriodDate] = useState(() => {
    if (typeof window === "undefined") return "2026-10-06";
    return localStorage.getItem("paglaafi_last_period") || "2026-10-06";
  });
  const [cycleLengthDays, setCycleLengthDays] = useState(() => {
    if (typeof window === "undefined") return 28;
    const s = localStorage.getItem("paglaafi_cycle_len");
    return s ? Number(s) : 28;
  });
  const [autopalpationDoneThisMonth, setAutopalpationDoneThisMonth] = useState(() => {
    if (typeof window === "undefined") return true;
    const s = localStorage.getItem("paglaafi_autopalpation_done");
    return s !== null ? JSON.parse(s) : true;
  });
  const [lastAutopalpationDate, setLastAutopalpationDate] = useState(() => {
    if (typeof window === "undefined") return "12/10/2026";
    return localStorage.getItem("paglaafi_last_autopalpation") || "12/10/2026";
  });

  // États pour la saisie réelle, apprentissage et recalibration de la prédiction
  const [showRecalibrateBox, setShowRecalibrateBox] = useState(false);
  const [realPeriodDateInput, setRealPeriodDateInput] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [showCycleHistory, setShowCycleHistory] = useState(false);
  const [recalibrationFeedback, setRecalibrationFeedback] = useState<{
    text: string;
    type: "success" | "info" | "warning";
  } | null>(null);
  const [cycleHistory, setCycleHistory] = useState<Array<{
    id: number;
    date: string;
    duration: number;
    diff: number;
    note: string;
  }>>(() => {
    const initialHist = [
      {
        id: 1,
        date: "06/10/2026",
        duration: 28,
        diff: 0,
        note: "Cycle initial de référence (28 jours)",
      },
    ];
    if (typeof window === "undefined") return initialHist;
    try {
      const s = localStorage.getItem("paglaafi_cycle_history");
      return s ? JSON.parse(s) : initialHist;
    } catch {
      return initialHist;
    }
  });

  const [reminders, setReminders] = useState(() => {
    const defaultReminders = [
      { id: 1, title: "Dépistage annuel recommandé", date: "24 Octobre 2026", type: "screening" as const, active: true },
      { id: 2, title: "Rendez-vous mammographie (CMA Schiphra)", date: "26 Octobre à 09h00", type: "appointment" as const, active: true },
      { id: 3, title: "Prise de traitement hormonal / vitamines", date: "Tous les matins à 08h00", type: "treatment" as const, active: false },
    ];
    if (typeof window === "undefined") return defaultReminders;
    try {
      const s = localStorage.getItem("paglaafi_reminders");
      return s ? JSON.parse(s) : defaultReminders;
    } catch {
      return defaultReminders;
    }
  });

  // Synchronisation continue des données du cycle dans la mémoire locale
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("paglaafi_last_period", lastPeriodDate);
      localStorage.setItem("paglaafi_cycle_len", String(cycleLengthDays));
      localStorage.setItem("paglaafi_autopalpation_done", JSON.stringify(autopalpationDoneThisMonth));
      localStorage.setItem("paglaafi_last_autopalpation", lastAutopalpationDate);
      localStorage.setItem("paglaafi_cycle_history", JSON.stringify(cycleHistory));
      localStorage.setItem("paglaafi_reminders", JSON.stringify(reminders));
    } catch {
      // Silencieux si navigation privée
    }
  }, [lastPeriodDate, cycleLengthDays, autopalpationDoneThisMonth, lastAutopalpationDate, cycleHistory, reminders]);
  const [showNewReminderForm, setShowNewReminderForm] = useState(false);
  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [newReminderDate, setNewReminderDate] = useState("");
  const [newReminderType, setNewReminderType] = useState<"screening" | "appointment" | "treatment">("appointment");

  // 13. Annonces & Événements (avec modération Superadmin, filtre mois en cours et veille Rose IA)
  const [announcements, setAnnouncements] = useState<PartnerAnnouncement[]>(initialAnnouncements);
  const [announcementsFilter, setAnnouncementsFilter] = useState<"month" | "all" | "my" | "rose_ai">("month");
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
    imageUrl: "/images/affiche-evenement-beneere.jpg",
    imageCaption: "",
  });

  // 13.bis Modal Vidéo Démonstrative Autopalpation (Personnage africain & sage-femme)
  const [showAutopalpationVideoModal, setShowAutopalpationVideoModal] = useState(false);
  const [videoIsPlaying, setVideoIsPlaying] = useState(true);
  const [selectedVideoStep, setSelectedVideoStep] = useState<1 | 2 | 3 | 4>(1);
  const [videoLang, setVideoLang] = useState<"fr" | "moore" | "dioula">("fr");
  const [videoProgressSeconds, setVideoProgressSeconds] = useState(0);
  const [videoSpeed, setVideoSpeed] = useState<1 | 1.5 | 2>(1);

  // 13.ter Modal Affiche Grand Format
  const [selectedPosterModal, setSelectedPosterModal] = useState<{
    url: string;
    title: string;
    author: string;
    caption?: string;
  } | null>(null);

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

  // Référence conteneur carte OpenStreetMap et instances
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);

  // Référence pour le défilement fluide du conteneur principal lors des changements de page
  const mainScrollRef = useRef<HTMLDivElement | null>(null);

  // Référence pour le défilement automatique du chat Rose IA
  const roseChatBottomRef = useRef<HTMLDivElement | null>(null);

  // Référence pour la reconnaissance vocale Web Speech de Rose IA
  const recognitionRef = useRef<any>(null);

  // Détection de l'état de connexion internet (Mode Hors-Ligne PWA)
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false,
  );

  // Surveillance des transitions réseau en direct
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      notify("Connexion internet rétablie !");
    };
    const handleOffline = () => {
      setIsOffline(true);
      notify("Mode hors-connexion actif : vos données médicales restent disponibles sans réseau.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Réinitialisation automatique du défilement lors de tout changement de page ou sélection de centre
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
  }, [section, selectedCenter]);

  // Défilement automatique du chat Rose IA vers le dernier message
  useEffect(() => {
    if (section === "RoseIA") {
      roseChatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [roseMessages, section]);

  /**
   * Ouvre l'itinéraire GPS vers le centre de soins dans Google Maps (Android/Web) ou Apple Maps (iOS)
   */
  const openNavigation = (lat: number, lng: number, name: string) => {
    const isApple =
      typeof navigator !== "undefined" &&
      /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
    const encodedName = encodeURIComponent(name);
    let url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=&travelmode=driving`;
    if (isApple) {
      url = `https://maps.apple.com/?daddr=${lat},${lng}&q=${encodedName}`;
    }
    window.open(url, "_blank", "noopener,noreferrer");
    notify(`Ouverture de la navigation GPS vers ${name}...`);
  };

  /**
   * Gestion de la reconnaissance vocale temps réel pour Rose IA (Web Speech API)
   */
  const handleToggleVoiceRecognition = () => {
    // Si l'écoute est déjà en cours, on l'arrête
    if (isRecordingVoice) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error(e);
        }
      }
      setIsRecordingVoice(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      notify("La reconnaissance vocale directe n'est pas supportée sur ce navigateur. Vous pouvez poser une question par écrit ou utiliser les raccourcis.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = oralVoiceLang === "en" ? "en-US" : "fr-FR";
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecordingVoice(true);
        lastVoiceTranscriptRef.current = "";
        notify("Microphone actif : parlez maintenant à Rose IA...");
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          lastVoiceTranscriptRef.current = transcript;
          setRoseInput(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("[Rose IA Speech]", event.error);
        setIsRecordingVoice(false);
        if (event.error === "not-allowed") {
          notify("Accès micro refusé. Veuillez autoriser le microphone dans votre navigateur.");
        } else if (event.error === "no-speech") {
          notify("Aucune voix détectée. Appuyez sur le micro pour réessayer.");
        } else {
          notify(`Microphone : ${event.error || "erreur"}`);
        }
      };

      recognition.onend = () => {
        setIsRecordingVoice(false);
        const spoken = lastVoiceTranscriptRef.current;
        if (spoken && spoken.trim().length > 1) {
          handleSendRoseMessageRef.current(spoken, true);
          lastVoiceTranscriptRef.current = "";
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsRecordingVoice(false);
      notify("Impossible de démarrer l'écoute au microphone.");
    }
  };

  // Helper Toast
  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 3500);
  };

  // Splash Screen Timer : 5 secondes avec progression fluide pour apprécier le travail visuel
  useEffect(() => {
    if (!showSplash) return;
    const duration = 5000;
    const startTime = Date.now();

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / duration) * 100));
      setSplashProgress(progress);
      if (progress >= 100) {
        window.clearInterval(interval);
      }
    }, 40);

    const timer = window.setTimeout(() => {
      setShowSplash(false);
      setCurrentUser(null);
    }, duration);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
    };
  }, [showSplash]);

  /**
   * Préchauffage instantané du moteur de synthèse vocale (Web Speech API)
   * Élimine complètement le temps d'attente / latence de 2 à 3 secondes
   * au premier déclenchement audio sur smartphone et navigateur de bureau.
   */
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.getVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
          };
        }
      } catch {
        // Fallback silencieux si non disponible
      }
    }
  }, []);

  /**
   * Moteur de lecture vidéo ultra-réactif avec progression dynamique et vitesse ajustable
   * Permet à la vidéo de se lancer immédiatement, d'avancer de manière fluide
   * et de s'accélérer (1x, 1.5x, 2x) selon le souhait de l'utilisatrice.
   */
  useEffect(() => {
    if (!showAutopalpationVideoModal || !videoIsPlaying) return;

    const interval = window.setInterval(() => {
      setVideoProgressSeconds((prev) => {
        const next = prev + (0.5 * videoSpeed);
        if (next >= 165) {
          return 0; // Boucle de lecture continue
        }
        // Synchronisation automatique de l'étape affichée selon le temps
        if (next < 35) setSelectedVideoStep(1);
        else if (next < 75) setSelectedVideoStep(2);
        else if (next < 115) setSelectedVideoStep(3);
        else setSelectedVideoStep(4);

        return next;
      });
    }, 500);

    return () => window.clearInterval(interval);
  }, [showAutopalpationVideoModal, videoIsPlaying, videoSpeed]);

  // Formateur du temps vidéo (ex: "01:24")
  const formatVideoTime = (seconds: number) => {
    const s = Math.floor(seconds);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  /**
   * Intégration fiabilisée de la carte OpenStreetMap via Leaflet
   * Fonctionne de manière synchrone sur tous les profils et réactualise
   * automatiquement les tuiles à chaque transition d'onglet.
   */
  useEffect(() => {
    if (section !== "Centres" || viewMode !== "map" || selectedCenter !== null) return;

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

      // Invalidation progressive pour garantir le rendu complet même après transition CSS
      setTimeout(() => { if (isMounted && mapInstanceRef.current) mapInstanceRef.current.invalidateSize(); }, 120);
      setTimeout(() => { if (isMounted && mapInstanceRef.current) mapInstanceRef.current.invalidateSize(); }, 350);
      setTimeout(() => { if (isMounted && mapInstanceRef.current) mapInstanceRef.current.invalidateSize(); }, 700);

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
          <div style="font-family:'DM Sans', sans-serif; min-width:200px; padding:3px;">
            <b style="color:#580e36; font-size:12px; display:block;">${center.shortName}</b>
            <span style="display:inline-block; font-size:10px; font-weight:bold; color:${markerColor}; margin-top:2px;">● ${center.statusLabel}</span>
            <div style="font-size:10px; color:#6b4d5d; margin-top:3px;">Attente : <b>${center.estimatedWait}</b></div>
            <div style="font-size:10px; color:#6b4d5d;">Agents : <b>${center.agentsPresent}</b></div>
            <div style="font-size:9.5px; color:#846b77; margin-top:2px;">📍 ${center.place}</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; margin-top:8px;">
              <button id="osm-nav-${center.id}" style="border:none; background:#10b981; color:#ffffff; font-size:10px; font-weight:bold; padding:5px 6px; border-radius:6px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:3px;">
                📍 Itinéraire
              </button>
              <button id="osm-btn-${center.id}" style="border:none; background:#ea2d6d; color:#ffffff; font-size:10px; font-weight:bold; padding:5px 6px; border-radius:6px; cursor:pointer; display:flex; align-items:center; justify-content:center;">
                Fiche →
              </button>
            </div>
          </div>
        `);

        marker.on("popupopen", () => {
          const btn = document.getElementById(`osm-btn-${center.id}`);
          if (btn) {
            btn.onclick = () => {
              setSelectedCenter(center);
            };
          }
          const navBtn = document.getElementById(`osm-nav-${center.id}`);
          if (navBtn) {
            navBtn.onclick = () => {
              openNavigation(center.lat, center.lng, center.name);
            };
          }
        });
      });

      mapInstanceRef.current = map;
    };

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener("resize", handleResize);

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
      window.removeEventListener("resize", handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [section, viewMode, centers, selectedCenter, currentUser]);

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

    // Arrêt immédiat si déjà en lecture
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setRoseSpeaking(false);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setAudioProgress(0);
      return;
    }

    // Réveil et déblocage immédiat de la pile audio pour mobile/desktop
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();
    } catch {
      // Ignorer si non applicable
    }

    // Déclenchement réactif immédiat pour l'ergonomie tactile (0 ms d'attente)
    setIsPlaying(true);
    setRoseSpeaking(true);
    setAudioProgress(8);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Attribution directe d'une voix préchargée pour éviter le délai de recherche de voix
    try {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices && allVoices.length > 0) {
        const matchedVoice = allVoices.find((v) =>
          language === "en" ? v.lang.startsWith("en") : v.lang.startsWith("fr")
        ) || allVoices[0];
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }
      }
    } catch {
      // Silencieux
    }

    if (language === "en") {
      utterance.lang = "en-US";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
    } else if (language === "fr") {
      utterance.lang = "fr-FR";
      utterance.rate = 1.02; // Rythme alerte et naturel
      utterance.pitch = 1.05;
    } else {
      // Mooré et Dioula : diction claire avec prosodie soignée
      utterance.lang = "fr-FR";
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
    }

    // Progression visuelle fluide
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    audioIntervalRef.current = window.setInterval(() => {
      setAudioProgress((prev) => (prev >= 95 ? 95 : prev + 6));
    }, 600);

    utterance.onstart = () => {
      setIsPlaying(true);
      setRoseSpeaking(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setRoseSpeaking(false);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setAudioProgress(100);
      window.setTimeout(() => setAudioProgress(0), 600);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setRoseSpeaking(false);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setAudioProgress(0);
    };

    // Lancement instantané
    window.speechSynthesis.speak(utterance);

    // Déverrouillage de sécurité supplémentaire pour Chrome Android
    window.setTimeout(() => {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 40);
  };

  /**
   * Calculs prédictifs pour le cycle menstruel & fenêtre d'autopalpation (Recommandation OMS)
   * Calcule :
   * - La date estimée des prochaines règles selon la durée de cycle calibrée.
   * - Le nombre de jours restants (ou de décalage si la date est dépassée).
   * - La fenêtre optimale d'autopalpation (J+7 à J+11 après le premier jour des règles).
   */
  const cycleInfo = useMemo(() => {
    // Découpage strict de la date YYYY-MM-DD pour éviter les biais de fuseau GMT
    const parts = lastPeriodDate.split("-");
    const lastDate = parts.length === 3
      ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
      : new Date(lastPeriodDate);

    // Calcul de la date prévisionnelle des prochaines règles
    const nextPeriodDate = new Date(lastDate);
    nextPeriodDate.setDate(lastDate.getDate() + cycleLengthDays);

    // Fenêtre optimale d'autopalpation : 2 à 5 jours après la fin des règles (J+7 à J+11)
    const autopalpStart = new Date(lastDate);
    autopalpStart.setDate(lastDate.getDate() + 7);
    const autopalpEnd = new Date(lastDate);
    autopalpEnd.setDate(lastDate.getDate() + 11);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const isOptimalWindow = today >= autopalpStart && today <= autopalpEnd;

    // Écart en jours entre aujourd'hui et la prédiction
    const diffMs = nextPeriodDate.getTime() - today.getTime();
    const daysUntilNextPeriod = Math.round(diffMs / (1000 * 60 * 60 * 24));

    return {
      nextPeriodStr: nextPeriodDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long" }),
      nextPeriodFormatted: nextPeriodDate.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }),
      daysUntilNextPeriod,
      autopalpWindowStr: `Du ${autopalpStart.getDate()} au ${autopalpEnd.getDate()} ${autopalpEnd.toLocaleDateString("fr-FR", { month: "short" })}`,
      isOptimalWindow,
    };
  }, [lastPeriodDate, cycleLengthDays]);

  /**
   * Recalibration adaptative du cycle menstruel & synchronisation locale
   * Fonctionnalité clé demandée :
   * Si les règles arrivent en avance ou en retard, l'utilisatrice enregistre
   * la date réelle constatée. L'application recalcule l'intervalle réel, recalibre
   * la durée moyenne du cycle, réajuste la prédiction suivante et recadre la fenêtre d'autopalpation.
   */
  const handleRecalibratePeriod = (chosenDate?: string) => {
    const targetDateStr = chosenDate || realPeriodDateInput;
    if (!targetDateStr) {
      notify("Veuillez indiquer une date pour recalibrer.");
      return;
    }

    // Récupération de l'ancienne date et de la nouvelle date déclarée
    const prevParts = lastPeriodDate.split("-");
    const prevDate = new Date(parseInt(prevParts[0], 10), parseInt(prevParts[1], 10) - 1, parseInt(prevParts[2], 10));

    const realParts = targetDateStr.split("-");
    const realDate = new Date(parseInt(realParts[0], 10), parseInt(realParts[1], 10) - 1, parseInt(realParts[2], 10));

    // Calcul de l'écart réel en jours entre les deux débuts de règles
    const diffDays = Math.round((realDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      notify("La date réelle doit être postérieure au cycle précédent.");
      return;
    }

    let calculatedCycleLength = cycleLengthDays;
    let feedbackMsg = "";
    let alertType: "success" | "info" | "warning" = "success";

    // Analyse physiologique de l'intervalle constaté
    if (diffDays >= 21 && diffDays <= 42) {
      // Intervalle physiologique régulier : mise à jour directe du cycle
      calculatedCycleLength = diffDays;
      const variation = diffDays - cycleLengthDays;
      if (variation === 0) {
        feedbackMsg = `Règles confirmées au ${realDate.toLocaleDateString("fr-FR")} : prédiction 100% exacte (cycle régulier de ${diffDays} jours).`;
      } else if (variation > 0) {
        feedbackMsg = `Règles notées avec +${variation} j de décalage. Votre cycle a été automatiquement recalibré à ${diffDays} jours. Prochaine prédiction et autopalpation réajustées.`;
      } else {
        feedbackMsg = `Règles arrivées ${Math.abs(variation)} j plus tôt que prévu. Votre cycle a été recalibré à ${diffDays} jours. Prédictions réalignées.`;
      }
    } else if (diffDays < 21) {
      // Cycle très court
      calculatedCycleLength = 24;
      alertType = "warning";
      feedbackMsg = `Règles déclarées ${diffDays} jours après le dernier cycle (intervalle court). Date enregistrée. Si ce rythme persiste, demandez conseil à une sage-femme.`;
    } else {
      // Décalage supérieur à 42 jours
      calculatedCycleLength = 32;
      alertType = "info";
      feedbackMsg = `Règles constatées après ${diffDays} jours. Date enregistrée et nouveau cycle réinitialisé avec succès.`;
    }

    // Mise à jour des états locaux réactifs
    setCycleLengthDays(calculatedCycleLength);
    setLastPeriodDate(targetDateStr);
    setRecalibrationFeedback({ text: feedbackMsg, type: alertType });
    setShowRecalibrateBox(false);

    // Ajout à l'historique local pour visualiser l'apprentissage
    setCycleHistory((prev) => [
      {
        id: Date.now(),
        date: realDate.toLocaleDateString("fr-FR"),
        duration: diffDays,
        diff: diffDays - cycleLengthDays,
        note: feedbackMsg,
      },
      ...prev.slice(0, 4),
    ]);

    notify("Cycle et fenêtre d'autopalpation recalibrés avec succès !");
  };

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

  // Modération Superadmin : annonces standard
  const handleApproveAnnouncement = (id: number) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "approved", badge: "Validée ✓", badgeColor: "bg-emerald-100 text-emerald-800" } : a)),
    );
    notify("Annonce validée par le Superadmin ! Elle est désormais visible publiquement.");
  };

  /**
   * Modération Superadmin : Valider une opportunité détectée par Rose IA et déclencher le PUSH local
   */
  const handleApproveAndPushAnnouncement = async (id: number) => {
    const target = announcements.find((a) => a.id === id);
    if (!target) return;

    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "approved",
              badge: "🔍 Veille Rose IA · Validé Officiel ✓",
              badgeColor: "bg-purple-100 text-purple-900 border border-purple-300 font-bold",
              pushSent: true,
            }
          : a,
      ),
    );

    const pushText =
      target.pushMessageFr ||
      `🌸 Rose IA vous informe : [Opportunité Validée] ${target.title} à ${target.city} !`;

    // Tentative d'envoi Web Push API
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        try {
          new Notification(`🌸 Rose IA — Alerte Santé Vérifiée (${target.city})`, {
            body: pushText,
            icon: "/favicon.ico",
          });
        } catch (e) {
          console.warn("Notification error:", e);
        }
      }
    }

    notify(`🚀 Annonce vérifiée et validée ! Message push diffusé aux femmes de ${target.city}.`);
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
      imageUrl: newAnnouncement.imageUrl,
      imageCaption: newAnnouncement.imageCaption,
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
      imageUrl: "/images/affiche-evenement-beneere.jpg",
      imageCaption: "",
    });
    notify("Annonce avec affiche soumise ! Elle sera diffusée dès validation par le Superadmin.");
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
   * Présélection d'un cas clinique pour la simulation d'entraînement docteur
   */
  const handleSelectDoctorPresetTopic = (
    topic: string,
    clinicalAdvice: string,
    frReformulation: string,
    mooreReformulation: string,
    dioulaReformulation: string,
    testQ: string,
  ) => {
    setDoctorTeachTopic(topic);
    setDoctorTeachContent(clinicalAdvice);
    setDoctorEmpathicReformulation({
      fr: frReformulation,
      moore: mooreReformulation,
      dioula: dioulaReformulation,
    });
    setDoctorTestQuestion(testQ);
    setDoctorTestAnswer(null);
    setDoctorTrainStep(2);
    notify(`Thème "${topic}" sélectionné pour l'entraînement.`);
  };

  /**
   * Étape 2 -> Étape 3 : Simulation du test en direct avec la patiente
   */
  const handleRunDoctorTestSimulation = () => {
    setDoctorTestAnswer(
      doctorEmpathicReformulation.fr ||
        "Ma sœur, suite aux consignes de nos médecins spécialistes, voici la conduite à tenir pour ta santé...",
    );
    setDoctorTrainStep(3);
    notify("Simulation prête : testez la réponse de Rose IA à la question de la patiente.");
  };

  /**
   * Étape 4 : Validation finale & Ingestion du savoir clinique dans Rose IA
   */
  const handleFinalizeDoctorTraining = () => {
    const newKnowledge: MedicalKnowledge = {
      id: Date.now(),
      doctorName: doctorSignName || (currentUser ? `${currentUser.prenom} ${currentUser.nom}` : "Dr. Ibrahim Sanou"),
      speciality: doctorSignRole || currentUser?.speciality || "Gynécologue-Obstétricien",
      topic: doctorTeachTopic,
      advice: doctorTeachContent,
      date: "Aujourd'hui",
      verified: true,
    };

    setClinicalKnowledgeList((prev) => [newKnowledge, ...prev]);

    // Ingestion directe dans le fil de discussion de Rose IA
    setRoseMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: `[Validation Médicale Signée] ${doctorTeachTopic} — ${newKnowledge.doctorName}`,
        time: "À l'instant",
      },
      {
        sender: "rose",
        text: `Bien reçu ${newKnowledge.doctorName} ! J'ai intégré votre protocole clinique : « ${doctorEmpathicReformulation.fr.slice(0, 140)}... ». Je suis désormais capable d'orienter les femmes en Français, Mooré et Dioula selon vos instructions.`,
        mooreText: `Yozẽ kãsengã ${newKnowledge.doctorName} ! Mam bãngame laafi zãmsgã n na n sõng pagbã ne laafi.`,
        dioulaText: `I ni ce ${newKnowledge.doctorName} ! Dɔgɔtɔrɔba fanga nin don na ne la bi walasa ka musow dɛmɛ.`,
        time: "À l'instant",
      },
    ]);

    setShowDoctorTrainModal(false);
    setDoctorTrainStep(1);
    notify(`Protocole médical validé par ${newKnowledge.doctorName} et assimilé par Rose IA !`);
  };

  /**
   * Sauvegarde des paramètres de confidentialité & Éthique des données
   */
  const handleSavePrivacySettings = () => {
    setShowPrivacyModal(false);
    notify("Vos préférences de confidentialité et de protection des données sont enregistrées.");
  };

  /**
   * Purge complète des données locales (Droit à l'oubli immédiat)
   */
  const handleClearAllLocalData = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.warn(e);
      }
    }
    setReminders([]);
    setAutopalpationDoneThisMonth(false);
    setShowPrivacyModal(false);
    notify("Droit à l'oubli appliqué : toutes vos données locales de cycle et rappels ont été effacées.");
  };

  /**
   * Recommander et orienter un patient selon l'urgence clinique vers un Centre de Santé
   */
  const handleCreatePatientOrientation = (e: React.FormEvent) => {
    e.preventDefault();
    hapticFeedback(25);
    const code = `PAG-URG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const targetCenter = centers.find((c) => c.id === Number(orientationForm.targetCenterId)) || centers[0];

    const newRecord = {
      id: code,
      patientName: orientationForm.patientName,
      patientPhone: orientationForm.patientPhone,
      patientAge: 40,
      doctorName: currentUser?.prenom ? `${currentUser.prenom} ${currentUser.nom}` : "Dr. Partenaire PagLaafi",
      doctorSpecialty: "Médecin / Soignant(e)",
      targetCenterId: targetCenter.id,
      targetCenterName: targetCenter.shortName,
      urgencyLevel: orientationForm.urgencyLevel,
      urgencyLabel:
        orientationForm.urgencyLevel === "immediate"
          ? "🚨 Immédiat (< 24h)"
          : orientationForm.urgencyLevel === "priority"
          ? "⚠️ Prioritaire (48h-72h)"
          : "ℹ️ Routine / Surveillance",
      clinicalObservations: orientationForm.clinicalObservations,
      recommendedExam: orientationForm.recommendedExam,
      status: "pending_center" as const,
      centerValidationMessage: "",
      centerEstimatedDelay: "",
      createdAt: "À l'instant",
    };

    setUrgentOrientations((prev) => [newRecord, ...prev]);
    setGeneratedOrientationCode(code);
    notify(`Orientation ${code} émise d'urgence vers ${targetCenter.shortName} !`);
  };

  /**
   * Validation d'une orientation d'urgence par l'équipe du Centre de Santé
   */
  const handleValidateOrientationByCenter = (
    orientationId: string,
    action: "immediate" | "scheduled",
    customDelay?: string
  ) => {
    hapticFeedback(20);
    setUrgentOrientations((prev) =>
      prev.map((item) => {
        if (item.id === orientationId) {
          if (action === "immediate") {
            return {
              ...item,
              status: "accepted_urgent" as const,
              centerValidationMessage: "Envoyez-la vite ! Équipe alertée et créneau d'urgence réservé.",
              centerEstimatedDelay: "Prise en charge directe (< 15 min)",
            };
          } else {
            return {
              ...item,
              status: "scheduled_wait" as const,
              centerValidationMessage: `Affluence en cours : Patiente prioritaire enregistrée. Accueil garanti sous ${customDelay || "~45 min"}.`,
              centerEstimatedDelay: customDelay || "~45 min",
            };
          }
        }
        return item;
      })
    );
    notify(
      action === "immediate"
        ? "Confirmation envoyée : Patiente attendue d'urgence !"
        : "Créneau prioritaire programmé avec succès."
    );
  };

  /**
   * Activation et envoi de notification bienveillante en langues locales (Web Notifications ou In-App)
   */
  const handleRequestNotification = async () => {
    const tip = roseDailyTips[dailyTipIndex];
    const text =
      dailyTipLang === "moore"
        ? tip.moore
        : dailyTipLang === "dioula"
          ? tip.dioula
          : dailyTipLang === "en"
            ? tip.en
            : tip.fr;
    const langLabel =
      dailyTipLang === "moore"
        ? "Mooré"
        : dailyTipLang === "dioula"
          ? "Dioula"
          : dailyTipLang === "en"
            ? "English"
            : "Français";

    if ("Notification" in window) {
      let perm = Notification.permission;
      if (perm !== "granted") {
        try {
          perm = await Notification.requestPermission();
        } catch (e) {
          console.warn("Notification request permission error:", e);
        }
      }
      if (perm === "granted") {
        setNotificationEnabled(true);
        try {
          new Notification(`🌸 Rose IA — ${tip.categoryLabel}`, {
            body: `${text.slice(0, 130)}...`,
            icon: "/favicon.ico",
          });
          notify(`Rappels quotidiens activés en ${langLabel} ! Notification bienveillante envoyée.`);
          return;
        } catch (e) {
          console.warn("Notification show error:", e);
        }
      }
    }

    setNotificationEnabled((prev) => !prev);
    notify(`Rappel bienveillant activé (${langLabel}) : "${tip.titleFr}"`);
  };

  /**
   * Envoi de message à Rose IA avec moteur conversationnel IA enrichi,
   * intégration des fiches cliniques docteurs, et support 4 langues (FR, Mooré, Dioula, EN)
   */
  const handleSendRoseMessage = (textOverride?: string, speakAloud = false) => {
    const textToSend = textOverride || roseInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: "user" as const,
      text: textToSend,
      time: "Maintenant",
    };
    setRoseMessages((prev) => [...prev, userMsg]);
    setRoseInput("");

    // Normalisation sans accents pour recherche insensible
    const lower = textToSend.toLowerCase();
    const clean = lower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // 1. VÉRIFICATION DANS LES CONNAISSANCES CLINIQUES DES DOCTEURS
    const doctorMatch = clinicalKnowledgeList.find((k) => {
      const topicClean = k.topic.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const adviceClean = k.advice.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return (
        clean.includes("sanou") ||
        clean.includes("urgence") ||
        clean.includes("permanence") ||
        topicClean.split(" ").some((w) => w.length > 4 && clean.includes(w)) ||
        adviceClean.split(" ").some((w) => w.length > 5 && clean.includes(w))
      );
    });

    let aiFr = "";
    let aiEn = "";
    let aiMoore = "";
    let aiDioula = "";

    if (doctorMatch) {
      aiFr = `Protocole clinique validé par le ${doctorMatch.doctorName} (${doctorMatch.speciality}) : « ${doctorMatch.advice} » (Mis à jour le ${doctorMatch.date}).`;
      aiEn = `Clinical recommendation validated by ${doctorMatch.doctorName} (${doctorMatch.speciality}): "${doctorMatch.advice}" (Updated on ${doctorMatch.date}).`;
      aiMoore = `Dɔgɔtɔr ${doctorMatch.doctorName} saglsgo ne kaseto: « ${doctorMatch.advice} ».`;
      aiDioula = `Dɔgɔtɔrɔ ${doctorMatch.doctorName} ka ladili kɛnɛya siratigɛ la: « ${doctorMatch.advice} ».`;
    }
    // 2. SALUTATIONS, POLITESSE & PRÉSENTATION
    else if (
      clean.includes("bonjour") ||
      clean.includes("salut") ||
      clean.includes("bonsoir") ||
      clean.includes("coucou") ||
      clean.includes("qui es tu") ||
      clean.includes("qui t'a") ||
      clean.includes("comment vas tu") ||
      clean.includes("comment tu t'appelles") ||
      clean.includes("presente") ||
      clean.includes("aide moi")
    ) {
      aiFr = "Bonjour ma sœur bien-aimée ! Je suis Rose IA, ton assistante intelligente et bienveillante sur PagLaafi. Je suis à ton entière écoute sans tabou ni jugement : autopalpation des seins, hygiène intime, remèdes locaux (moringa, baobab), apaisement des règles ou dépistage dans les centres du Burkina. Comment te sens-tu aujourd'hui ?";
      aiEn = "Hello my beloved sister! I am Rose AI, your caring and holistic health companion on PagLaafi. I am here to listen and guide you without judgment: breast self-exam, intimate care, local nutrition, period comfort, and screenings in Burkina Faso. How can I assist you today?";
      aiMoore = "Ne y beogo m maaso ! Mam yaa Rose IA, fo laafi zoa PagLaafi pʋgẽ. M be ka n na n sõng fõ ne yĩn-sõngr, rɩɩb sõma (moringa, baobab), pʋg-tõor bɩ bãas gɩdgre. Bõe n be fo sũurẽ rũndã ?";
      aiDioula = "I ni sɔgɔma n ma muso ! Ne ye Rose IA ye PagLaafi kɔnɔ. Ne bɛ yan k'i dɛmɛ kɛnɛya, i yɛrɛ saniya, dumuni ɲuman ani kalo-sira la. Mun b'i kɔnɔ bi ?";
    }
    // 3. AUTOPALPATION, GESTES PRATIQUES & TECHNIQUE D'EXAMEN
    else if (
      clean.includes("autopalpation") ||
      clean.includes("palpation") ||
      clean.includes("palper") ||
      clean.includes("palpe") ||
      clean.includes("examiner") ||
      clean.includes("toucher") ||
      clean.includes("comment faire") ||
      clean.includes("geste") ||
      clean.includes("technique") ||
      clean.includes("etape") ||
      clean.includes("methode") ||
      clean.includes("quand") ||
      clean.includes("moment")
    ) {
      aiFr = "L'autopalpation se réalise en 3 étapes douces, idéalement 2 à 7 jours après la fin de tes règles : 1° Face au miroir, regarde l'aspect de tes seins bras baissés puis levés (recherche un creux, une rougeur ou une rétractation). 2° Lève un bras et palpe avec la pulpe des 3 doigts du milieu en petits cercles fermes de l'extérieur vers le mamelon, debout puis allongée. 3° Examine sous l'aisselle et presse doucement le mamelon pour vérifier l'absence d'écoulement. Regarde la vidéo démonstrative avec notre sage-femme en cliquant sur le bouton ci-dessous !";
      aiEn = "Breast self-exam is done in 3 gentle steps, best scheduled 2 to 7 days after your period: 1° Look in the mirror with arms relaxed then raised (check for dimples or retraction). 2° Raise one arm and feel firmly with the pads of your 3 middle fingers in small circular motions toward the nipple, standing and lying down. 3° Check under your armpit and gently squeeze the nipple for any discharge. Watch the step-by-step video with our midwife below!";
      aiMoore = "Yĩn-gesgo wã tũuda vɛr a tãabo, pʋg-peelgã poore rasem a 2 n ta a 7: 1° Ges fo meng laloorẽ n gũus fo yĩnsã rɩsg la gõosgo. 2° Yiis fo nus n kɛlees ne nus-bi a tãabã pãng n lilli n kẽng zĩ-kãsengã wɛɛngẽ. 3° Ges fo baglem pʋgẽ la fo bĩidã bɩ zɩɩm pa yit ye. Ges-y video wã bilfu !";
      aiDioula = "Bɔlɔkɔrɔ lajɛ bɛ kɛ taabolo saba de la, kalo-sira ban kɔfɛ tle 2 fo 7: 1° I yɛrɛ lajɛ filɛli-fɛn na k'a filɛ ni yɛlɛmali dɔ bɛ yen. 2° I bɔlɔ kɔrɔta ka bɔlɔden saba kɛ k'a sɛgɛsɛgɛ lali maana la fo ka ta masiɲɛ na. 3° I kaman kɔrɔ lajɛ ani i sin-toli dɔɔnin digi. Vidéow lajɛ duguma sabali !";
    }
    // 4. BOULE, NODULE, KYSTE, MASSE, GROSSEUR & SYMPTÔMES
    else if (
      clean.includes("boule") ||
      clean.includes("nodule") ||
      clean.includes("kyste") ||
      clean.includes("masse") ||
      clean.includes("grosseur") ||
      clean.includes("dur") ||
      clean.includes("ganglion") ||
      clean.includes("gonflement") ||
      clean.includes("ecoulement") ||
      clean.includes("liquide") ||
      clean.includes("peau d'orange") ||
      clean.includes("retractation") ||
      clean.includes("creux")
    ) {
      aiFr = "Respire calmement ma sœur, ne panique pas : dans plus de 8 cas sur 10, une boule ou un nodule n'est PAS un cancer (il s'agit très souvent d'un simple kyste liquide ou d'un adénofibrome bénin très fréquent). Cependant, la seule façon d'avoir le cœur net et d'être en paix est de la faire examiner rapidement par une sage-femme ou un médecin dans un centre de santé. Tu peux consulter l'onglet 'Centres' pour trouver le plus proche.";
      aiEn = "Breathe gently my sister, do not panic: in more than 8 out of 10 cases, a lump is NOT cancer (it is often a benign fluid cyst or fibroadenoma). However, having it examined promptly by a midwife or doctor brings complete peace of mind. Check the 'Centres' tab to visit a facility near you.";
      aiMoore = "Vʋʋsm sõma m maaso, da zoe rabeem ye: bõn-kʋds a nii (8) piig pʋgẽ pa bã-kãsenga ye (yaa kystes bal). La yaa tɩlae tɩ dɔgɔtɔr ges-a tao-tao tɩ fo sũur gãande kɛnɛyaso pʋgẽ. Mam be ne yãmba.";
      aiDioula = "I ni lafiɲɛ dɔrɔn, kana siran: kunkolo tan kɔnɔ segin tɛ bana juguman ye. Nka kɛnɛyaso lajɛ jona de bɛ hakili sigi dɔgɔtɔrɔmuso fɛ. Taga kɛnɛyaso la jona.";
    }
    // 5. CENTRES DE SANTÉ, HÔPITAUX & OÙ ALLER À OUAGA / BURKINA
    else if (
      clean.includes("centre") ||
      clean.includes("hopital") ||
      clean.includes("clinique") ||
      clean.includes("ou aller") ||
      clean.includes("ouaga") ||
      clean.includes("bobo") ||
      clean.includes("schiphra") ||
      clean.includes("yalgado") ||
      clean.includes("bogodogo") ||
      clean.includes("pissy") ||
      clean.includes("tingandogo") ||
      clean.includes("rdv") ||
      clean.includes("rendez vous") ||
      clean.includes("rendez-vous")
    ) {
      aiFr = "Au Burkina Faso, plusieurs centres spécialisés sont à ton service pour le dépistage et la prise en charge : 1° CHU de Bogodogo (Pôle Mère-Enfant avec mammographe numérique ouvert). 2° Centre Médical Schiphra à Tanghin (dépistage et tarifs subventionnés). 3° CHU Yalgado Ouédraogo (Service de cancérologie & sénologie). 4° CMA de Pissy et centres de santé CSPS pour la palpation clinique gratuite. Consulte l'onglet 'Centres' pour lancer l'itinéraire GPS en un clic !";
      aiEn = "In Burkina Faso, excellent health centers welcome you: 1° CHU Bogodogo (Mother-Child specialized pole). 2° Schiphra Medical Center in Tanghin (subsidized screenings). 3° CHU Yalgado Ouédraogo (Oncology & Senology). 4° CMA Pissy and local CSPS clinics. Open the 'Centres' tab to get GPS directions instantly!";
      aiMoore = "Burkina Faso ka, kɛnɛyasow wʋsg bee n gũud yãmba: CHU Bogodogo, Centre Médical Schiphra Tanghin, CHU Yalgado Ouédraogo, la CMA Pissy. Nus n gesã yaa zaalem. Ges-y 'Centres' n bãng zĩiga tao-tao.";
      aiDioula = "Burkina Faso la, kɛnɛyasow caman bɛ yen: CHU Bogodogo, Centre Médical Schiphra Tanghin, CHU Yalgado, ani CMA Pissy. Bɔlɔkɔrɔ lajɛ sɔngɔ ye fu ye. Taga 'Centres' siratigɛ la ka siraw ye.";
    }
    // 6. PRIX, COÛTS, TARIFS & FCFA
    else if (
      clean.includes("prix") ||
      clean.includes("cout") ||
      clean.includes("combien") ||
      clean.includes("tarif") ||
      clean.includes("argent") ||
      clean.includes("fcfa") ||
      clean.includes("gratuit") ||
      clean.includes("payer") ||
      clean.includes("cher")
    ) {
      aiFr = "Au Burkina Faso : 1° La palpation clinique de dépistage est 100% GRATUITE (0 FCFA) dans les centres publics et les campagnes de sensibilisation. 2° L'échographie mammaire coûte entre 6 000 et 7 500 FCFA. 3° La mammographie coûte entre 10 000 et 12 000 FCFA (subventionnée à 5 000 FCFA à Schiphra pour les femmes vulnérables grâce aux dons). L'argent ne doit jamais être un frein à ta santé.";
      aiEn = "In Burkina Faso: 1° Clinical breast exams are 100% FREE (0 FCFA) in public centers and campaigns. 2° Breast ultrasound costs 6,000 to 7,500 FCFA. 3° Mammography is 10,000 to 12,000 FCFA (subsidized to 5,000 FCFA at Schiphra for vulnerable women). Financial concerns must never prevent medical care.";
      aiMoore = "Burkina Faso ka, nus n gesã yaa zaalem (0 FCFA) kɛnɛyaso wʋsg pʋgẽ. Échographie yaa 6 000 n ta 7 500 FCFA, la mammographie yaa 10 000 n ta 12 000 FCFA (subventionné a 5 000 FCFA Schiphra). Ligdi da yɩ gɩdgr fo laafɩ wɛɛngẽ ye.";
      aiDioula = "Burkina Faso la, bɔlɔkɔrɔ lajɛ sɔngɔ ye fu ye (0 FCFA). Échographie ye 6 000 fo 7 500 FCFA ye, mammographie ye 10 000 fo 12 000 FCFA ye. Wari kana kɛ gɛlɛya ye i ka kɛnɛya siratigɛ la.";
    }
    // 7. PEUR, ANGOISSE, DÉTRESSE, MORT & SOUTIEN ÉMOTIONNEL
    else if (
      clean.includes("peur") ||
      clean.includes("angoisse") ||
      clean.includes("panique") ||
      clean.includes("mourir") ||
      clean.includes("mort") ||
      clean.includes("stress") ||
      clean.includes("triste") ||
      clean.includes("pleur") ||
      clean.includes("seule") ||
      clean.includes("moral") ||
      clean.includes("choc")
    ) {
      aiFr = "Respire profondément ma sœur, pose la main sur ton cœur : tu n'es pas seule, je suis là et les soignants sont à tes côtés. La peur est une réaction tout à fait humaine, mais rappelle-toi ceci avec force : le cancer du sein n'est pas une condamnation ! Détecté tôt, il se guérit dans plus de 9 cas sur 10. Tu as une valeur inestimable pour ta famille et pour nous. Nous allons avancer pas à pas avec tendresse et courage.";
      aiEn = "Take a deep breath my sister, place your hand on your heart: you are not alone, I am here with you. Fear is entirely normal, but remember this: breast cancer is not a fatality! Detected early, more than 9 out of 10 women are cured completely. You have courage and we are by your side step by step.";
      aiMoore = "M maaso, vʋʋsm sõma n ning fo nuga fo sũurẽ : fo ka fo yembr ye, mam be ne fo. Zõeemã yaa bũmb sẽn pa wẽnga ninsaal pʋgẽ, la bãagã sã n bãng tao-tao a vʋʋgda sõma. Bãng tɩ fo tara pãng, la d na n zĩnd ne taab wakat fãa.";
      aiDioula = "I dusu suma n ma muso, i bɔlɔ bila i dusu kan: i ma kelen ye, ne bɛ yan i kɔrɔ. Siran bɛ mɔgɔ bɛɛ la, nka ni bana ye jona, mɔgɔ bɛ kɛnɛya kosɛbɛ. An bɛ i kɔrɔ ni barika ye.";
    }
    // 8. GUÉRISON, CHANCES, ESPOIR & TRAITEMENT
    else if (
      clean.includes("guerir") ||
      clean.includes("guerison") ||
      clean.includes("soigner") ||
      clean.includes("espoir") ||
      clean.includes("chances") ||
      clean.includes("survie") ||
      clean.includes("stade")
    ) {
      aiFr = "Oui, le cancer du sein se guérit très bien ! Lorsqu'il est découvert à un stade précoce grâce à l'autopalpation mensuelle et au dépistage, le taux de guérison dépasse 90%. Au Burkina Faso, les équipes médicales disposent de chirurgies réparatrices, de traitements adaptés et d'un accompagnement fraternel. L'espoir et la vie triomphent toujours quand on agit tôt.";
      aiEn = "Yes, breast cancer is highly curable! When diagnosed early through monthly self-exams and screening, the cure rate exceeds 90%. In Burkina Faso, medical teams provide modern treatments and caring support. Hope and life always win when we act early.";
      aiMoore = "N-ye, bãaga wã tõe n komsame hal n sa ! Sã n mik tɩ bãngrã yɩɩ tao-tao, neb piig pʋgẽ a wae (9) vʋʋgda fasafasa. Kẽng dɔgɔtɔr zĩigẽ n bãng fo laafi.";
      aiDioula = "Ɔwɔ, bana nin bɛ se ka kɛnɛya kosɛbɛ ! Ni a yera jona, mɔgɔ tan kɔnɔ kɔnɔntɔn bɛ kɛnɛya tiɲɛ na. Kɛnɛyaso bɛ dɛmɛ di.";
    }
    // 9. RÈGLES, CRAMPES, CYCLE MENSTRUEL & DOULEURS DU VENTRE
    else if (
      clean.includes("regle") ||
      clean.includes("menstru") ||
      clean.includes("crampe") ||
      clean.includes("ventre") ||
      clean.includes("cycle") ||
      clean.includes("douleur") ||
      clean.includes("retard")
    ) {
      aiFr = "Je te comprends profondément ma sœur, les douleurs de règles peuvent être épuisantes. Pour t'apaiser naturellement : applique un linge tiède sur ton bas-ventre, bois une infusion chaude de gingembre ou de kinkeliba, masse doucement ton ventre avec un peu de beurre de karité et repose-toi. Si la douleur est si forte qu'elle t'empêche de vaquer à tes occupations, parles-en à une sage-femme car cela peut être de l'endométriose.";
      aiEn = "I hear you deeply, menstrual pain can be genuinely exhausting. To soothe cramps naturally: apply a warm cloth to your lower belly, drink warm ginger or kinkeliba tea, gently massage with shea butter, and rest. If severe pain prevents your daily activities, consult a midwife to check for endometriosis.";
      aiMoore = "Pʋg-tõor namsda pagb wʋsg. Bõn-sõma n tõe n koms-a: ning-y fu-tʋʋlga y pʋgẽ, nyũ-y gingembre koom bɩ kinkeliba ko-tʋʋlga, rɩk karité kam n so y pʋgã bilfu, la y vʋʋse.";
      aiDioula = "Kalo-sira dimi bɛ muso caman tɔɔrɔ. Walasa k'a dɔgɔya: fɛn kaliman bila i kɔnɔ la, jinɛbɛrɛ-ji sumana min, si-tulu dɔoni kɛ i kɔnɔ la ka lafiɲɛ kɛ.";
    }
    // 10. HYGIÈNE INTIME, TOILETTE, PERTES & FLORE VAGINALE
    else if (
      clean.includes("toilette") ||
      clean.includes("intime") ||
      clean.includes("savon") ||
      clean.includes("perte") ||
      clean.includes("odeur") ||
      clean.includes("vagin") ||
      clean.includes("vulve") ||
      clean.includes("mycose") ||
      clean.includes("demange") ||
      clean.includes("brulure") ||
      clean.includes("coton")
    ) {
      aiFr = "Ma sœur, ton intimité est délicate et précieuse. La règle d'or des soignants est simple : lave uniquement la partie extérieure (la vulve) à l'eau propre ou avec un savon doux sans parfum. Ne fais JAMAIS de douche vaginale interne ni n'introduis de poudres décapantes : le vagin possède son propre système d'auto-nettoyage. Porte des culottes en coton. Si tu as des démangeaisons ou des pertes inhabituelles, consulte une sage-femme sans aucune honte.";
      aiEn = "My sister, your intimate health is delicate and precious. The golden rule is simple: wash only the outside (the vulva) with clean water or mild unscented soap. NEVER practice internal douching or use harsh powders: the vagina cleanses itself naturally. Wear cotton underwear. If you have itching or unusual discharge, visit a midwife with full confidence.";
      aiMoore = "M maaso, fo yĩng sõngr yaa tɩlae wʋsg. Rɩk koom sõma bal n peeg fo meng yĩng zĩ-kẽemã yell bal. Da rɩk tɩɩm dãmb n kẽes fo pʋgẽ ye, bala a sãamda fo yĩnsa laafi. Yeelg fu-kõbdo sẽn yaa koton.";
      aiDioula = "N ma muso, i yɛrɛ saniya ko ka kɔrɔtanin kosɛbɛ. Ji saniya dɔrɔn de kɛ kɔkan, kana fɛn juguw don kɔnɔna na abada. Koton faniw don funteni senfɛ. Ni fɛn dɔ y'i gɛlɛya, taga dɔgɔtɔrɔmuso fɛ sabali.";
    }
    // 11. NUTRITION SAHÉLIENNE, MORINGA, BAOBAB & BIEN-ÊTRE
    else if (
      clean.includes("moringa") ||
      clean.includes("baobab") ||
      clean.includes("soumbala") ||
      clean.includes("singe") ||
      clean.includes("manger") ||
      clean.includes("nutrition") ||
      clean.includes("vitamine") ||
      clean.includes("anemie") ||
      clean.includes("fatigue") ||
      clean.includes("sel") ||
      clean.includes("bouillon") ||
      clean.includes("cube") ||
      clean.includes("eau") ||
      clean.includes("boire")
    ) {
      aiFr = "Pour préserver ta vitalité et prévenir les maladies au Burkina Faso, la nature nous a offert des trésors : les feuilles de Moringa regorgent de fer contre la fatigue et l'anémie, la pulpe de Baobab (pain de singe) est un concentré d'antioxydants et de vitamine C, et le Soumbala traditionnel protège le cœur et la tension. Évite les bouillons cubes industriels trop salés, et bois au moins 2 à 3 litres d'eau propre par jour.";
      aiEn = "To preserve your vitality in the Sahel, nature has provided wonders: Moringa leaves offer rich iron against fatigue and anemia, Baobab fruit (pain de singe) brings powerful antioxidants and vitamin C, and authentic Soumbala protects the heart. Reduce salty bouillon seasoning cubes, and drink 2 to 3 liters of clean water daily.";
      aiMoore = "Burkina Faso ka, Wẽnd kõ-d-la rɩɩb sõma wʋsg: moringa vaadã kẽesda pãng fo zɩlem pʋgẽ n gɩdg zɩ-komlem, tɔɔd bɩ zɩt-yɩla waoogda pãng, la sumbala sõngda sũurã laafi. Gɩdg yaalem wʋsg, la nyũ-y koom sõma dahar fãa.";
      aiDioula = "An ka faso la, kɛnɛya dumunifɛnw caman bɛ yen: moringa buluw bɛ fanga di joliko la, sira-den bɛ kɛnɛya gansan di, ani sumbala bɛ dusu mara. Maggi cube ka caya tɛ kɛnɛya ye, ji saniya min don o don.";
    }
    // 12. DÉPISTAGE DU COL DE L'UTÉRUS
    else if (
      clean.includes("col") ||
      clean.includes("uterus") ||
      clean.includes("frottis") ||
      clean.includes("iva") ||
      clean.includes("hpv") ||
      clean.includes("vaccin")
    ) {
      aiFr = "Le col de l'utérus mérite toute ton attention : un simple dépistage visuel (test IVA) ou frottis réalisé en 5 minutes par une sage-femme permet de repérer des petites anomalies bien avant qu'elles ne se transforment. C'est rapide, indolore et disponible dans tous les CSPS et CMA du Burkina. Fais ce dépistage tous les 3 ans !";
      aiEn = "Cervical health is vital: a simple visual inspection (VIA test) or pap smear done in 5 minutes by a midwife detects early changes years in advance. It is quick, painless, and available at all CSPS and CMA clinics in Burkina Faso. Get screened every 3 years!";
      aiMoore = "Pʋg-kɛenga laafi yaa tɩlae wʋsg. Bãaga wã tõe n gɩdgame sã n mik tɩ dɔgɔtɔr ges-a zĩigẽ (test IVA). A pa namsd ye, a pa rɩkd wakat wʋsg ye. Bãng-y fo laafi yʋʋm a tãab fãa pʋgẽ.";
      aiDioula = "Kɔnɔna juru bana bɛ se ka bali sani a ka juguya. Dɔgɔtɔrɔmuso bɛ se k'a lajɛ sekondi damanin kɔnɔ (test IVA). A tɛ dimi, a bɛ sɔrɔ kɛnɛyasow bɛɛ la. O kɛ kalo 36 o kalo 36 kɔnɔ.";
    }
    // 13. GROSSESSE, ALLAITEMENT & MÉNOPAUSE
    else if (
      clean.includes("enceinte") ||
      clean.includes("grossesse") ||
      clean.includes("bebe") ||
      clean.includes("allait") ||
      clean.includes("menopause") ||
      clean.includes("bouffee")
    ) {
      aiFr = "Chaque étape de la vie d'une femme est un passage précieux. Que tu sois enceinte, jeune maman allaitante ou en ménopause, écoute ton corps : bois beaucoup d'eau, consomme des aliments frais riches en calcium et en fer, et pratique la marche. Si tu constates un saignement inattendu ou un nodule mammaire pendant ou après la grossesse/ménopause, consulte sans tarder.";
      aiEn = "Every stage in a woman's journey is precious. Whether pregnant, nursing, or navigating menopause, listen to your body: stay hydrated, eat fresh nutrient-dense foods, and stay active. Any unexpected bleeding or breast changes warrant a prompt consultation.";
      aiMoore = "Pʋg-yãmb laafi tekda wakat fãa: pʋg-tũub wakat, bi-doglem wakat, bɩ kʋdemd wakat. Nyũ-y ko-sumdo, rɩ-y rɩ-sõma. Sã n mik tɩ zɩɩm yii fo meng pʋgẽ tɩ pa wakat, kẽng dɔgɔtɔr tao-tao.";
      aiDioula = "Musoya ye yɛlɛmali yɔrɔ ye: kɔnɔtigi, denbaya, walima musokɔrɔya. Ji sumana min, dumuni kɛnɛ kɛ. Ni jolidon kɛra kɔfɛ, taga dɔgɔtɔrɔmuso fɛ jona.";
    }
    // 14. REMERCIEMENTS & AU REVOIR
    else if (
      clean.includes("merci") ||
      clean.includes("bark biiga") ||
      clean.includes("anitche") ||
      clean.includes("thank") ||
      clean.includes("au revoir") ||
      clean.includes("bye") ||
      clean.includes("a bientot") ||
      clean.includes("bonne journee") ||
      clean.includes("bonne soiree")
    ) {
      aiFr = "C'est un véritable honneur et un bonheur d'être à tes côtés, ma sœur ! Prends grand soin de toi et de ton corps. N'hésite jamais à revenir me parler dès que tu as une question ou besoin d'écoute. Que la paix et la santé t'accompagnent !";
      aiEn = "It is an absolute honor and joy to accompany you, my sister! Take tender care of your body and well-being. Never hesitate to talk to me whenever you need guidance. May peace and radiant health stay with you!";
      aiMoore = "Yaa sũ-noogo kãsenga mam yĩnga tɩ m sõng fo maaso ! Ges fo meng laafi sõma. Wakat fãa fo sã n tar sokre, wa n sok maam. Wẽnd kõ-f laafi la sũ-noogo !";
      aiDioula = "A ye ninsɔndiya ye ne bolo k'i dɛmɛ n ma muso ! I yɛrɛ ladon kosɛbɛ. Wagati o wagati, n'i b'a fɛ k'an ka kuma, na yan. Ala ka kɛnɛya n'i ye !";
    }
    // 15. DON & SOLIDARITÉ
    else if (
      clean.includes("don") ||
      clean.includes("aider") ||
      clean.includes("financer") ||
      clean.includes("solidarite") ||
      clean.includes("orange money") ||
      clean.includes("association")
    ) {
      aiFr = "Ton cœur est généreux ! L'onglet 'Faire un don' de PagLaafi permet de soutenir directement les femmes vulnérables du Burkina Faso via Orange Money (dès 500 FCFA). Tu peux choisir de faire un don nominatif ou un Don Anonyme Chiffré pour préserver ta discrétion. Chaque contribution finance des dépistages et des mammographies gratuits.";
      aiEn = "Your generosity warms my heart! PagLaafi's 'Faire un don' tab lets you support vulnerable women across Burkina Faso through Orange Money (from 500 FCFA). You can donate publicly or via an Anonymous Encrypted gift. Every contribution funds free screenings and mammograms.";
      aiMoore = "Fo sũur yaa sõma wʋsg ! 'Faire un don' pʋgẽ, fo tõe n dɩka Orange Money (sẽn sɩng ne 500 FCFA) n sõng pagb nins sẽn ka tar ligdi tɩ b bãng b laafi zaalem. Barka wʋsg !";
      aiDioula = "I dusu ka ɲi kosɛbɛ ! 'Faire un don' bolo la, i bɛ se ka muso gɛlɛyaw dɛmɛ Orange Money fɛ (kabini 500 FCFA) walasa u ka kɛnɛya lajɛ sɔrɔ fu. I ni ce kosɛbɛ !";
    }
    // 16. MOTEUR CONTEXTUEL UNIVERSEL POUR TOUTE QUESTION ÉCRITE LIBRE
    else {
      aiFr = `J'ai bien reçu ta question avec toute mon attention, ma sœur : « ${textToSend} ». En matière de santé féminine, chaque ressenti et chaque interrogation méritent respect et clarté. Écoute ton corps : pratique l'autopalpation mensuelle (quelques jours après tes règles), veille à une bonne hydratation avec les super-aliments burkinabè (moringa, baobab), et n'hésite pas à consulter une sage-femme dans un centre partenaire si tu ressens un doute ou une gêne. Tu peux aussi me poser d'autres questions précises ou toucher le micro !`;
      aiEn = `I received your message with care, my sister: "${textToSend}". In women's health, every concern deserves clear understanding and compassion. Listen to your body: practice monthly breast exams, enjoy wholesome local nutrition, and visit a midwife at a partner clinic whenever in doubt. Feel free to ask more details or speak to me via the microphone!`;
      aiMoore = `M wʋma fo sokrã sõma m maaso : « ${textToSend} ». Fo laafi yaa tɩlae wʋsg : ges fo meng yĩnsã dahar fãa pʋg-peelgã poore, rɩ rɩ-sõma (moringa, baobab), la fo sã n mik bũmb sẽn pa zems fo yĩngẽ, kẽng n ges dɔgɔtɔr-pʋgbo kɛnɛyaso la. Sok-y maam bũmb a taaba !`;
      aiDioula = `N ye i ka ɲiningali mɛn kosɛbɛ n ma muso : « ${textToSend} ». I ka kɛnɛya kɔrɔtanin lo : i sinw sɛgɛsɛgɛ kalo-sira ban kɔfɛ, dumuni kɛnɛ kɛ (moringa, sira-den), wa ni fɛn dɔ y'i gɛlɛya, taga dɔgɔtɔrɔmuso fɛ jona. I bɛ se ka fɛn wɛrɛ ɲini ne fɛ !`;
    }

    // Réponse différée pour simulation naturelle d'analyse IA
    window.setTimeout(() => {
      setRoseMessages((prev) => [
        ...prev,
        {
          sender: "rose",
          text: aiFr,
          englishText: aiEn,
          mooreText: aiMoore,
          dioulaText: aiDioula,
          time: "Maintenant",
        },
      ]);

      // Défilement automatique vers le nouveau message
      window.setTimeout(() => {
        roseChatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 80);

      // Si le micro a été utilisé, synthèse vocale immédiate dans la langue choisie
      if (speakAloud || isRecordingVoice) {
        const textToSpeak =
          appLanguage === "moore" && aiMoore
            ? aiMoore
            : appLanguage === "dioula" && aiDioula
            ? aiDioula
            : appLanguage === "en" && aiEn
            ? aiEn
            : aiFr;
        handlePlayAudio(textToSpeak, appLanguage);
      }
    }, 450);
  };

  useEffect(() => {
    handleSendRoseMessageRef.current = handleSendRoseMessage;
  });

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
   * Recensement et palmarès des centres de santé les plus fréquentés par région / ville (Superadmin)
   */
  const superadminSortedCenters = useMemo(() => {
    return [...centers]
      .filter((c) => {
        if (superadminRegionFilter === "all") return true;
        if (superadminRegionFilter === "Centre") return c.city === "Ouagadougou";
        if (superadminRegionFilter === "Hauts-Bassins") return c.city === "Bobo-Dioulasso";
        if (superadminRegionFilter === "Centre-Ouest") return c.city === "Koudougou";
        return true;
      })
      .sort((a, b) => b.confirmedVisitsToday - a.confirmedVisitsToday);
  }, [centers, superadminRegionFilter]);

  /**
   * Filtrage des annonces selon le mois en cours, la veille Rose IA et le profil
   */
  const displayedAnnouncements = useMemo(() => {
    if (announcementsFilter === "my") {
      return announcements.filter(
        (a) =>
          a.submittedBy === currentUser?.structureName ||
          a.submittedBy === `${currentUser?.prenom} ${currentUser?.nom}`,
      );
    }
    if (announcementsFilter === "rose_ai") {
      return announcements.filter((a) => a.isRoseAIDetected && a.status === "approved");
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
        {/* ==================================================================== */}
        {/* ÉCRAN DE DÉMARRAGE (SPLASH SCREEN) : 5 SECONDES                     */}
        {/* ==================================================================== */}
        {showSplash && (
          <div className="absolute inset-0 z-50 flex flex-col justify-between overflow-hidden bg-[#fff0f5] text-[#580e36] ph-enter sm:rounded-[36px]">
            {/* Image de fond plein écran : Femmes & Médecin en blouse avec rubans roses */}
            <div className="absolute inset-0">
              <img
                src="/images/splash-paglaafi-heroines.jpg"
                alt="Solidarité PagLaafi - Lutte contre le cancer du sein au Burkina Faso"
                className="h-full w-full object-cover object-top transform scale-100 transition-transform duration-5000 ease-out"
              />
              {/* Voile supérieur subtil pour contraster l'en-tête sans masquer les visages */}
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/70 via-white/20 to-transparent pointer-events-none" />
              {/* Voile inférieur dégradé doux pour assurer la lisibilité sur la partie texte */}
              <div className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-[#fff5f8] via-[#fff5f8]/95 via-45% to-transparent pointer-events-none" />
            </div>

            {/* En-tête du Splash : Drapeau et bouton passer */}
            <div className="relative z-10 flex items-center justify-between p-4 pt-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-pink-300/60 bg-white/85 px-3 py-1.5 text-[11px] font-bold text-[#580e36] backdrop-blur-md shadow-xs">
                <span>🇧🇫</span>
                <span>Burkina Faso</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  hapticFeedback(15);
                  setShowSplash(false);
                  setCurrentUser(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-pink-300/60 bg-white/85 px-3.5 py-1.5 text-[11px] font-bold text-[#580e36] backdrop-blur-md hover:bg-white transition shadow-xs active:scale-95"
              >
                <span>Passer</span>
                <ChevronRight size={13} className="text-[#ea2d6d]" />
              </button>
            </div>

            {/* Pied de page du Splash : Logo agrandi, Titre, Slogan, Icônes réorganisées et barre de chargement de 5 secondes */}
            <div className="relative z-10 p-5 pb-7 text-center">
              {/* Logo PagLaafi agrandi avec mise en valeur */}
              <div className="mx-auto mb-2.5 flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-2.5 shadow-[0_10px_25px_rgba(234,45,109,0.22)] ring-4 ring-[#ea2d6d]/20 transition-transform duration-300 hover:scale-105">
                <img
                  src="/images/pinkhub-mvp-paglaafi.png"
                  alt="Logo PagLaafi"
                  className="h-full w-full object-contain"
                />
              </div>

              <h1 className="ph-display text-3xl font-extrabold tracking-tight text-[#580e36] drop-shadow-xs">
                PagLaafi
              </h1>
              <p className="mt-1 text-[13px] font-bold text-[#ea2d6d] tracking-wide">
                Mieux s'informer · Mieux s'orienter · Jamais seule
              </p>
              <p className="mx-auto mt-1 max-w-[320px] text-[11px] font-medium leading-tight text-[#783e58]">
                Sensibilisation, dépistage précoce du cancer du sein & accompagnement solidaire au Burkina Faso
              </p>

              {/* Icônes de réassurance et services clés réorganisées */}
              <div className="mx-auto mt-3 flex items-center justify-center gap-2 max-w-[360px]">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-200/90 bg-white/90 px-2.5 py-1 text-[10.5px] font-semibold text-[#580e36] shadow-xs backdrop-blur-sm">
                  <Stethoscope size={12} className="text-[#ea2d6d]" />
                  <span>Dépistage</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-200/90 bg-white/90 px-2.5 py-1 text-[10.5px] font-semibold text-[#580e36] shadow-xs backdrop-blur-sm">
                  <MapPin size={12} className="text-[#ea2d6d]" />
                  <span>Centres de santé</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-200/90 bg-white/90 px-2.5 py-1 text-[10.5px] font-semibold text-[#580e36] shadow-xs backdrop-blur-sm">
                  <HeartHandshake size={12} className="text-[#ea2d6d]" />
                  <span>Écoute solidaire</span>
                </div>
              </div>

              {/* Barre de progression animée de 5 secondes */}
              <div className="mx-auto mt-4 max-w-[270px]">
                <div className="h-2 w-full overflow-hidden rounded-full bg-pink-200/60 shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#580e36] via-[#ea2d6d] to-pink-400 transition-all duration-75 ease-linear shadow-[0_0_10px_rgba(234,45,109,0.7)]"
                    style={{ width: `${splashProgress}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[10.5px] font-semibold text-[#6a2948]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[#ea2d6d] animate-spin" />
                    <span>Chargement de votre espace santé...</span>
                  </span>
                  <span className="font-mono text-[11px] font-bold text-[#580e36]">
                    {Math.max(0, Math.ceil((5000 - splashProgress * 50) / 1000))}s
                  </span>
                </div>
              </div>

              {/* Badge d'autorité et précision en bas */}
              <div className="mt-3.5 inline-flex items-center gap-2 rounded-full border border-pink-300/80 bg-white/90 px-3.5 py-1.5 text-[10.5px] font-bold text-[#580e36] shadow-xs backdrop-blur-md">
                <ShieldCheck size={13} className="text-[#ea2d6d]" />
                <span>Plateforme Nationale de Santé · Propulsé par Rose IA</span>
              </div>
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
                    <h2 className="ph-display text-lg font-bold text-[#580e36]">PagLaafi</h2>
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
                          <p className="mt-0.5 font-bold text-[#580e36] truncate">{currentUser.prenom} {currentUser.nom}</p>
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
                  className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 font-semibold ${section === "Accueil" ? "bg-[#f5e3e8] text-[#ea2d6d]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <Heart size={17} /> <span>Accueil</span>
                </button>

                <button
                  onClick={() => { setSection("Centres"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 font-semibold ${section === "Centres" ? "bg-[#f5e3e8] text-[#ea2d6d]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <span className="flex items-center gap-3"><MapPin size={17} /> Carte des Soins (OpenStreetMap)</span>
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">En direct</span>
                </button>

                <button
                  onClick={() => { setSection("Calendrier"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 font-semibold ${section === "Calendrier" ? "bg-[#f5e3e8] text-[#ea2d6d]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <span className="flex items-center gap-3"><CalendarDays size={17} /> Règles & Autopalpation</span>
                  <span className="rounded-full bg-pink-100 px-1.5 py-0.5 text-[9px] font-bold text-[#ea2d6d]">Cycle</span>
                </button>

                <button
                  onClick={() => { setSection("Comprendre"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 font-semibold ${section === "Comprendre" ? "bg-[#f5e3e8] text-[#ea2d6d]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <span className="flex items-center gap-3"><BookOpen size={17} /> Comprendre (Français · Anglais · Mooré · Dioula)</span>
                  <span className="rounded-full bg-pink-100 px-1.5 py-0.5 text-[9px] font-bold text-[#ea2d6d]">Audio</span>
                </button>

                <button
                  onClick={() => { setSection("RoseIA"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 font-semibold ${section === "RoseIA" ? "bg-[#f5e3e8] text-[#ea2d6d]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <span className="flex items-center gap-3"><Sparkles size={17} /> Rose IA (Assistance Vocale)</span>
                  <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-900">IA</span>
                </button>

                <button
                  onClick={() => { setSection("Annonces"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 font-semibold ${section === "Annonces" ? "bg-[#f5e3e8] text-[#ea2d6d]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
                >
                  <Megaphone size={17} /> <span>Annonces & Événements</span>
                </button>

                <button
                  onClick={() => { setSection("Accompagnant"); setSelectedCenter(null); setSidebarOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 font-semibold ${section === "Accompagnant" ? "bg-[#f5e3e8] text-[#ea2d6d]" : "text-[#62404f] hover:bg-[#faeff2]"}`}
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
                    className="flex w-full items-center justify-between rounded-2xl bg-rose-50 px-3.5 py-2.5 font-bold text-[#ea2d6d] hover:bg-rose-100"
                  >
                    <span className="flex items-center gap-3">
                      <Heart size={17} className="text-[#ea2d6d] fill-[#ea2d6d]" /> Faire un don
                    </span>
                    <span className="text-[10px] text-rose-800">Solidarité</span>
                  </button>
                </div>

                {/* Paramètres de Confidentialité & Entraînement Docteur */}
                <div className="pt-2 border-t border-[#f2e1e6] space-y-1.5">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setShowPrivacyModal(true);
                    }}
                    className="flex w-full items-center justify-between rounded-2xl bg-emerald-50/70 border border-emerald-200 px-3.5 py-2 font-semibold text-emerald-900 hover:bg-emerald-100"
                  >
                    <span className="flex items-center gap-2.5 text-xs">
                      <ShieldCheck size={16} className="text-emerald-700" /> Confidentialité & Données
                    </span>
                    <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Local</span>
                  </button>

                  {/* Simulation d'entraînement réservée exclusivement aux soignants et superadmin */}
                  {currentUser && (currentUser.role === "superadmin" || (currentUser.role === "admin" && currentUser.adminType === "doctor")) && (
                    <button
                      onClick={() => {
                        setSidebarOpen(false);
                        setShowDoctorTrainModal(true);
                      }}
                      className="flex w-full items-center justify-between rounded-2xl bg-amber-50 border border-amber-200 px-3.5 py-2 font-semibold text-amber-950 hover:bg-amber-100"
                    >
                      <span className="flex items-center gap-2.5 text-xs">
                        <GraduationCap size={16} className="text-amber-700" /> Simuler Entraînement Docteur
                      </span>
                      <span className="text-[9.5px] font-bold text-amber-800 bg-amber-200 px-1.5 py-0.5 rounded">4 étapes</span>
                    </button>
                  )}
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

              {/* Bouton Installation Application Mobile PWA */}
              <div className="mt-2">
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    handleTriggerInstall();
                  }}
                  className="flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-[#ea2d6d] to-[#580e36] px-3 py-2 text-xs font-bold text-white shadow-md hover:opacity-95 transition"
                >
                  <span className="flex items-center gap-2">
                    <Smartphone size={15} className="text-amber-300" />
                    <span>{isStandaloneApp ? "Application installée ✓" : "Installer l'App Mobile"}</span>
                  </span>
                  <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[9px] font-black text-white">
                    PWA
                  </span>
                </button>
              </div>

              {/* SÉLECTEUR DE LANGUE DISCRET & TACTILE DANS LA SIDEBAR DÉROULANTE */}
              <div className="mt-2 rounded-2xl bg-[#fff2f6] p-2.5 border border-[#fce4ec]">
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#ea2d6d]">
                    <Languages size={13} /> Langue de l'App
                  </span>
                  <span className="text-[9.5px] font-extrabold text-[#580e36]">
                    {appLanguage === "moore" ? "Mooré" : appLanguage === "dioula" ? "Dioula" : appLanguage.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { code: "fr" as const, label: "Français", flag: "🇫🇷" },
                    { code: "moore" as const, label: "Mooré", flag: "🇧🇫" },
                    { code: "dioula" as const, label: "Dioula", flag: "🇧🇫" },
                    { code: "en" as const, label: "English", flag: "🇬🇧" },
                  ].map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => handleSelectAppLanguage(l.code)}
                      className={`flex items-center justify-center gap-1 rounded-xl py-1.5 px-2 text-[11px] font-bold transition cursor-pointer ${
                        appLanguage === l.code
                          ? "bg-[#ea2d6d] text-white shadow-xs"
                          : "bg-white text-[#580e36] border border-[#fce4ec] hover:bg-pink-100/60"
                      }`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
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
              <span className="ph-display text-lg font-bold text-[#580e36]">PagLaafi</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bouton d'installation PWA Mobile rapide */}
            <button
              onClick={handleTriggerInstall}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold transition shadow-2xs ${
                isStandaloneApp
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-[#fce4ec] bg-gradient-to-r from-pink-50 to-rose-50 text-[#ea2d6d] hover:bg-pink-100"
              }`}
              title={isStandaloneApp ? "Application PagLaafi active en mode autonome" : "Installer l'application sur smartphone"}
            >
              <Smartphone size={11} className={isStandaloneApp ? "text-emerald-600" : "text-[#ea2d6d]"} />
              <span>{isStandaloneApp ? "Installé" : "Installer"}</span>
            </button>

            {/* Bouton direct Rose IA (affiché uniquement quand l'utilisateur est connecté) */}
            {currentUser && (
              <button
                type="button"
                onClick={() => {
                  setSection("RoseIA");
                  setShowLanguageMenu(false);
                }}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10.5px] font-bold transition shadow-sm ${section === "RoseIA" ? "bg-[#ea2d6d] text-white" : "border border-[#e7bcc9] bg-[#fbf0f4] text-[#d81f5c]"}`}
              >
                <Sparkles size={12} className="text-amber-500" />
                <span>Rose IA</span>
              </button>
            )}

            {/* ICÔNE DE PROFIL PERSONNALISÉE AVEC DÉCONNEXION (affiché quand connecté) */}
            {currentUser && (() => {
              const headerProfileIdentity = getProfileIdentity(currentUser);
              return (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className={`relative grid h-10 w-10 place-items-center rounded-full border-2 ${headerProfileIdentity.border} ${headerProfileIdentity.bg} ${headerProfileIdentity.text} shadow-md transition hover:scale-105`}
                    title={`${currentUser.prenom} (${currentUser.roleLabel}) - Cliquez pour gérer`}
                  >
                    {headerProfileIdentity.icon}
                    <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${headerProfileIdentity.dotColor}`} />
                  </button>

                  {/* Menu Popover Déconnexion Directe */}
                  {showProfileMenu && (
                    <div
                      className="ph-enter absolute right-0 top-12 z-50 w-64 rounded-2xl border border-[#ebd4dd] bg-white p-3.5 shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-3 border-b border-[#f5e4ea] pb-3">
                        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${headerProfileIdentity.bg} ${headerProfileIdentity.text} border ${headerProfileIdentity.border} shadow-xs`}>
                          {headerProfileIdentity.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[#580e36] text-xs truncate">
                            {currentUser.prenom} {currentUser.nom}
                          </p>
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${headerProfileIdentity.badgeBg}`}>
                            {currentUser.roleLabel}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-[10.5px] text-[#7a5969] space-y-0.5">
                        <p className="flex items-center gap-1.5"><Phone size={12} className="text-[#ea2d6d]" /> {currentUser.telephone}</p>
                        {currentUser.structureName && (
                          <p className="flex items-center gap-1.5"><MapPin size={12} className="text-[#ea2d6d]" /> {currentUser.structureName}</p>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#f7e6ec] space-y-2">
                        <div>
                          <p className="text-[10px] font-bold text-[#8c4d66] mb-1.5">Changer de profil (1-clic) :</p>
                          <div className="grid grid-cols-2 gap-1 text-[10px]">
                            <button
                              onClick={() => { quickLoginAs("user"); setShowProfileMenu(false); }}
                              className={`rounded-lg px-2 py-1 font-semibold text-left transition ${currentUser.role === 'user' ? 'bg-[#ea2d6d] text-white' : 'bg-pink-50 text-[#6f334a] hover:bg-pink-100'}`}
                            >
                              👩 Utilisatrice
                            </button>
                            <button
                              onClick={() => { quickLoginAs("center"); setShowProfileMenu(false); }}
                              className={`rounded-lg px-2 py-1 font-semibold text-left transition ${currentUser.adminType === 'center' ? 'bg-[#ea2d6d] text-white' : 'bg-pink-50 text-[#6f334a] hover:bg-pink-100'}`}
                            >
                              🏥 Centre Santé
                            </button>
                            <button
                              onClick={() => { quickLoginAs("doctor"); setShowProfileMenu(false); }}
                              className={`rounded-lg px-2 py-1 font-semibold text-left transition ${currentUser.adminType === 'doctor' ? 'bg-[#ea2d6d] text-white' : 'bg-pink-50 text-[#6f334a] hover:bg-pink-100'}`}
                            >
                              🩺 Docteur
                            </button>
                            <button
                              onClick={() => { quickLoginAs("association"); setShowProfileMenu(false); }}
                              className={`rounded-lg px-2 py-1 font-semibold text-left transition ${currentUser.adminType === 'association' ? 'bg-[#ea2d6d] text-white' : 'bg-pink-50 text-[#6f334a] hover:bg-pink-100'}`}
                            >
                              🎗️ Association
                            </button>
                          </div>
                          <button
                            onClick={() => { quickLoginAs("superadmin"); setShowProfileMenu(false); }}
                            className={`w-full mt-1 rounded-lg px-2 py-1 font-semibold text-left text-[10px] transition ${currentUser.role === 'superadmin' ? 'bg-purple-900 text-white' : 'bg-purple-50 text-purple-900 hover:bg-purple-100'}`}
                          >
                            🛡️ Superadmin National
                          </button>
                        </div>

                        {/* Raccourcis Confidentialité & Simulation Docteur */}
                        <div className="pt-2 border-t border-[#f7e6ec] space-y-1.5">
                          <button
                            onClick={() => {
                              setShowPrivacyModal(true);
                              setShowProfileMenu(false);
                            }}
                            className="flex w-full items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-2.5 py-1.5 text-[10.5px] font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs"
                          >
                            <span className="flex items-center gap-1.5">
                              <ShieldCheck size={13} className="text-emerald-600" />
                              <span>Confidentialité & Données</span>
                            </span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">100% Local</span>
                          </button>

                          {/* Simulation réservée aux soignants et superadmin */}
                          {currentUser && (currentUser.role === "superadmin" || (currentUser.role === "admin" && currentUser.adminType === "doctor")) && (
                            <button
                              onClick={() => {
                                setShowDoctorTrainModal(true);
                                setShowProfileMenu(false);
                              }}
                              className="flex w-full items-center justify-between rounded-xl bg-amber-50 border border-amber-200 px-2.5 py-1.5 text-[10.5px] font-bold text-amber-900 hover:bg-amber-100 transition shadow-xs"
                            >
                              <span className="flex items-center gap-1.5">
                                <GraduationCap size={13} className="text-amber-600" />
                                <span>Simuler Entraînement Docteur</span>
                              </span>
                              <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">4 étapes</span>
                            </button>
                          )}
                        </div>

                        {/* BOUTON DÉCONNEXION DIRECTE */}
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-xs"
                        >
                          <LogOut size={13} className="text-rose-600" />
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
        {/* BANDEAU MODE HORS-LIGNE (PWA & OFFLINE)                              */}
        {/* ==================================================================== */}
        {isOffline && (
          <div className="z-20 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 px-3 py-1.5 text-center text-[10.5px] font-bold text-white shadow-xs">
            <AlertCircle size={13} className="shrink-0 animate-pulse text-amber-200" />
            <span>Mode Hors-Ligne actif · Vos données médicales et centres restent accessibles</span>
          </div>
        )}

        {/* ==================================================================== */}
        {/* CONTENU PRINCIPAL DES ONGLETS                                        */}
        {/* ==================================================================== */}
        <div ref={mainScrollRef} className="ph-scroll flex-1 overflow-y-auto pb-10">

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
                <h2 className="ph-display text-2xl font-bold text-[#580e36]">PagLaafi</h2>
                <p className="text-xs text-[#82445e] font-semibold mt-0.5">
                  Plateforme Nationale de Dépistage & Solidarité Cancer du Sein
                </p>
                <div className="mt-2.5 inline-flex items-center gap-2 rounded-full border border-[#e8c0ce] bg-white px-3 py-1 text-[11px] font-bold text-[#79344f] shadow-2xs">
                  <Sparkles size={13} className="text-amber-500" />
                  <span>Burkina Faso · Powered by Rose IA</span>
                </div>
              </div>

              {/* Sélecteur Onglet : Connexion vs Inscription avec icônes */}
              <div className="grid grid-cols-2 rounded-2xl bg-[#f5e3e8] p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 transition ${authMode === "login" ? "bg-white text-[#ea2d6d] shadow-sm font-extrabold" : "text-[#7b5364]"}`}
                >
                  <Lock size={13} />
                  <span>Se connecter</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("register")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 transition ${authMode === "register" ? "bg-white text-[#ea2d6d] shadow-sm font-extrabold" : "text-[#7b5364]"}`}
                >
                  <UserPlus size={13} />
                  <span>Créer un compte</span>
                </button>
              </div>

              {/* SI ONGLET CONNEXION */}
              {authMode === "login" && (
                <div className="space-y-4">
                  <form onSubmit={handleLoginSubmit} className="space-y-3.5 rounded-3xl bg-white p-4.5 border border-[#edd6df] shadow-xs">
                    <div>
                      <label className="text-[11px] font-bold text-[#580e36] block mb-1.5">
                        Numéro de téléphone (+226)
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 flex items-center gap-1.5 text-xs font-bold text-[#713f53] pointer-events-none">
                          <Phone size={13} className="text-[#ea2d6d]" />
                          <span>🇧🇫 +226</span>
                        </span>
                        <input
                          type="tel"
                          required
                          value={loginForm.telephone}
                          onChange={(e) => setLoginForm({ ...loginForm, telephone: e.target.value })}
                          placeholder="70 12 34 56"
                          className="w-full rounded-2xl border border-[#d6a9b9] py-3 pl-24 pr-3.5 text-xs font-semibold text-[#580e36] focus:border-[#ea2d6d] focus:ring-2 focus:ring-[#ea2d6d]/15 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#580e36] block mb-1.5">
                        Mot de passe
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-[#ea2d6d] pointer-events-none">
                          <Lock size={14} />
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={loginForm.motDePasse}
                          onChange={(e) => setLoginForm({ ...loginForm, motDePasse: e.target.value })}
                          placeholder="Votre mot de passe"
                          className="w-full rounded-2xl border border-[#d6a9b9] py-3 pl-10 pr-10 text-xs font-semibold text-[#580e36] focus:border-[#ea2d6d] focus:ring-2 focus:ring-[#ea2d6d]/15 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 text-gray-400 hover:text-[#ea2d6d] p-1 transition"
                          title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-gradient-to-r from-[#6c1543] to-[#ba486e] py-3.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={15} />
                      <span>Se connecter à mon compte</span>
                    </button>
                  </form>

                  {/* Accès Démo Rapide (1-Clic) : Disposition optimisée et équilibrée des icônes de profils */}
                  <div className="rounded-3xl bg-[#fdf5f7] border border-[#f0d4de] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#9a4564] mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <UsersRound size={13} className="text-[#ea2d6d]" />
                        <span>Accès Rapide Démo (1-Clic)</span>
                      </span>
                      <span className="text-[9px] font-normal lowercase bg-pink-100 text-[#ea2d6d] px-2 py-0.5 rounded-full font-bold">
                        5 profils au choix
                      </span>
                    </p>

                    {/* Grille 2x2 des 4 rôles opérationnels */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {[
                        {
                          type: "user" as const,
                          title: "Aminata O.",
                          roleName: "Utilisatrice",
                          desc: "Autopalpation & Cycle",
                          profile: { role: "user" as const, roleLabel: "Utilisatrice" },
                        },
                        {
                          type: "center" as const,
                          title: "Mme Sawadogo",
                          roleName: "Centre de Santé",
                          desc: "CMA Schiphra",
                          profile: { role: "admin" as const, adminType: "center" as const, roleLabel: "Centre Médical" },
                        },
                        {
                          type: "doctor" as const,
                          title: "Dr. Sanou",
                          roleName: "Docteur / Praticien",
                          desc: "CHU Bogodogo",
                          profile: { role: "admin" as const, adminType: "doctor" as const, roleLabel: "Praticien" },
                        },
                        {
                          type: "association" as const,
                          title: "Dr. Sawadogo",
                          roleName: "Association ONG",
                          desc: "ABAC Solidarité",
                          profile: { role: "admin" as const, adminType: "association" as const, roleLabel: "ONG / Asso" },
                        },
                      ].map((p) => {
                        const ident = getProfileIdentity(p.profile as any);
                        return (
                          <button
                            key={p.type}
                            type="button"
                            onClick={() => quickLoginAs(p.type)}
                            className="flex flex-col items-start gap-1.5 rounded-2xl bg-white p-3 text-left border border-[#ecd5de] hover:border-[#ea2d6d] hover:shadow-xs transition group"
                          >
                            <div className="flex w-full items-center justify-between">
                              <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${ident.bg} ${ident.text} border ${ident.border} shadow-2xs group-hover:scale-105 transition`}>
                                {ident.icon}
                              </div>
                              <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-full ${ident.badgeBg}`}>
                                {ident.badgeText}
                              </span>
                            </div>
                            <div className="min-w-0 w-full mt-0.5">
                              <p className="text-[11.5px] font-bold text-[#580e36] truncate">{p.title}</p>
                              <p className="text-[10px] text-[#7d5668] truncate">{p.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* 5e rôle : Superadmin National en carte pleine largeur */}
                    {(() => {
                      const superadminIdentity = getProfileIdentity({ role: "superadmin", roleLabel: "Superadmin" } as any);
                      return (
                        <button
                          type="button"
                          onClick={() => quickLoginAs("superadmin")}
                          className="w-full flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-950/5 via-purple-900/10 to-indigo-950/5 p-3 text-left border border-purple-200/80 hover:border-purple-400 hover:shadow-xs transition group"
                        >
                          <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${superadminIdentity.bg} ${superadminIdentity.text} border ${superadminIdentity.border} shadow-xs group-hover:scale-105 transition`}>
                            {superadminIdentity.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-[#351a42]">Alimata Kaboré</p>
                              <span className={`text-[8.5px] font-black px-2 py-0.5 rounded-full ${superadminIdentity.badgeBg}`}>
                                Superadmin National
                              </span>
                            </div>
                            <p className="text-[10px] text-purple-900/80">Supervision nationale, modération des annonces & statistiques</p>
                          </div>
                        </button>
                      );
                    })()}
                  </div>

                  {/* Bouton pour tester sans compte */}
                  <div className="text-center pt-1 pb-2">
                    <button
                      type="button"
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
                      className="inline-flex items-center gap-2 rounded-2xl border border-[#ecd5de] bg-white px-4 py-2.5 text-xs font-bold text-[#ea2d6d] shadow-2xs hover:bg-pink-50 transition"
                    >
                      <Sparkles size={14} className="text-amber-500" />
                      <span>Explorer l'application sans compte (Mode Découverte)</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* SI ONGLET INSCRIPTION */}
              {authMode === "register" && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3 rounded-3xl bg-white p-4 border border-[#edd6df] shadow-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-[#580e36] block mb-1">Prénom</label>
                      <input
                        type="text"
                        required
                        value={registerForm.prenom}
                        onChange={(e) => setRegisterForm({ ...registerForm, prenom: e.target.value })}
                        className="w-full rounded-xl border border-[#d6a9b9] p-2 text-xs text-[#580e36] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#580e36] block mb-1">Nom</label>
                      <input
                        type="text"
                        required
                        value={registerForm.nom}
                        onChange={(e) => setRegisterForm({ ...registerForm, nom: e.target.value })}
                        className="w-full rounded-xl border border-[#d6a9b9] p-2 text-xs text-[#580e36] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#580e36] block mb-1">Numéro de téléphone (+226)</label>
                    <input
                      type="tel"
                      required
                      value={registerForm.telephone}
                      onChange={(e) => setRegisterForm({ ...registerForm, telephone: e.target.value })}
                      placeholder="70 12 34 56"
                      className="w-full rounded-xl border border-[#d6a9b9] p-2 text-xs text-[#580e36] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#580e36] block mb-1">Type de profil</label>
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
                      className="w-full rounded-xl border border-[#d6a9b9] p-2 text-xs text-[#580e36] bg-white focus:outline-none"
                    >
                      <option value="user">👩 Utilisatrice / Patiente</option>
                      <option value="association">🎗️ Association / ONG Partenaire</option>
                      <option value="center">🏥 Centre de Santé</option>
                      <option value="doctor">🩺 Médecin / Docteur</option>
                    </select>
                  </div>

                  {registerForm.role === "admin" && (
                    <div>
                      <label className="text-[11px] font-bold text-[#580e36] block mb-1">
                        Nom de la structure / Établissement
                      </label>
                      <input
                        type="text"
                        required
                        value={registerForm.structureName}
                        onChange={(e) => setRegisterForm({ ...registerForm, structureName: e.target.value })}
                        placeholder="Ex: ABAC Burkina, CMA Schiphra..."
                        className="w-full rounded-xl border border-[#d6a9b9] p-2 text-xs text-[#580e36] focus:outline-none"
                      />
                      <p className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded-xl mt-1.5 border border-amber-200">
                        ℹ️ Ce profil requiert une validation du Superadmin avant activation complète.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-bold text-[#580e36] block mb-1">Mot de passe</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={registerForm.motDePasse}
                        onChange={(e) => setRegisterForm({ ...registerForm, motDePasse: e.target.value })}
                        className="w-full rounded-xl border border-[#d6a9b9] p-2 pr-10 text-xs text-[#580e36] focus:outline-none"
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
                    <label className="text-[11px] font-bold text-[#580e36] block mb-1">Confirmer le mot de passe</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={registerForm.confirmerMotDePasse}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmerMotDePasse: e.target.value })}
                        className="w-full rounded-xl border border-[#d6a9b9] p-2 pr-10 text-xs text-[#580e36] focus:outline-none"
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
                    className="w-full rounded-2xl bg-[#ea2d6d] py-3 text-xs font-bold text-white shadow-md hover:bg-[#d81f5c] transition"
                  >
                    Créer mon compte
                  </button>
                </form>
              )}
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
                  <h1 className="ph-display text-[26px] leading-tight text-[#580e36]">
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
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Dispo</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Affluence</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Panne</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ENCART D'URGENCE INTERACTIF : ORIENTATIONS REÇUES PAR LE CENTRE OU SUIVIES PAR LE DOCTEUR */}
              {currentUser?.role === "admin" && (currentUser?.adminType === "center" || currentUser?.adminType === "doctor") && (
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
                        <div
                          key={orient.id}
                          className="rounded-xl border border-rose-200 bg-white p-3 shadow-2xs space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-xs text-[#580e36]">
                                  {orient.patientName} ({orient.patientAge} ans)
                                </span>
                                <span className={`rounded-full px-2 py-0.5 text-[9px] font-black ${
                                  orient.urgencyLevel === "immediate"
                                    ? "bg-rose-600 text-white animate-pulse"
                                    : "bg-amber-500 text-white"
                                }`}>
                                  {orient.urgencyLabel}
                                </span>
                              </div>
                              <p className="text-[10.5px] text-gray-500 mt-0.5">
                                Réf : <span className="font-mono font-bold text-[#580e36]">{orient.id}</span> · Prescrit par <strong>{orient.doctorName}</strong>
                              </p>
                            </div>
                            <span className="text-[9.5px] font-semibold text-gray-400">
                              {orient.createdAt}
                            </span>
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
                              <span className="text-[9px] bg-emerald-200 px-1.5 py-0.5 rounded font-bold text-emerald-900">Confirmé</span>
                            </div>
                          ) : orient.status === "scheduled_wait" ? (
                            <div className="rounded-lg bg-amber-50 border border-amber-200 p-2 text-amber-900 text-[11px] flex items-center justify-between">
                              <span className="flex items-center gap-1.5 font-bold">
                                <Clock size={14} className="text-amber-600 shrink-0" />
                                <span>{orient.centerValidationMessage}</span>
                              </span>
                              <span className="text-[9px] bg-amber-200 px-1.5 py-0.5 rounded font-bold text-amber-900">Programmé</span>
                            </div>
                          ) : (
                            /* En attente de validation par le Centre de Santé */
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
                            )
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
                      <button onClick={() => setSelectedCenter(center)} className="rounded-xl bg-[#faedf1] p-1.5 text-[#ea2d6d]">
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
                      <button
                        onClick={() => openNavigation(center.lat, center.lng, center.name)}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                        title="Démarrer l'itinéraire dans Google Maps / Apple Maps"
                      >
                        <Navigation size={10} /> GPS
                      </button>
                      <button onClick={() => setSelectedCenter(center)} className="rounded-full bg-[#ea2d6d] px-2.5 py-1 font-bold text-white">
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
              <h1 className="ph-display text-[26px] leading-tight text-[#580e36]">
                Cycle & Autopalpation
              </h1>
              <p className="mt-1 text-xs text-[#795f6d]">
                Suivez vos règles, sachez le moment idéal pour observer vos seins et programmez vos rappels médicaux.
              </p>

              {/* Suivi des règles, Prédictions & Recalibration adaptative */}
              <div className="mt-3.5 rounded-[24px] border border-[#f0d4df] bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#f6e6ec] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#faedf1] text-[#ea2d6d]">
                      <Calendar size={17} />
                    </span>
                    <div>
                      <h3 className="ph-display text-sm font-bold text-[#580e36]">Cycle & Prédictions</h3>
                      <p className="text-[10px] text-[#8c566d]">Prévision locale adaptative</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-[10px] font-bold text-[#ea2d6d]">
                    Cycle moyen : {cycleLengthDays} jours
                  </span>
                </div>

                {/* Estimation actuelle calculée */}
                <div className="mt-3 rounded-2xl bg-gradient-to-br from-[#fdf5f7] to-[#faedf2] border border-[#f5dfe6] p-3 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#91586e] uppercase tracking-wider">
                        Prochaines règles estimées :
                      </span>
                      <p className="text-base font-extrabold text-[#580e36] mt-0.5">
                        {cycleInfo.nextPeriodStr}
                      </p>
                      <p className="text-[10px] text-[#785566]">
                        Dernier début noté : {new Date(lastPeriodDate).toLocaleDateString("fr-FR")}
                      </p>
                    </div>

                    <div className="text-right">
                      {cycleInfo.daysUntilNextPeriod > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#ea2d6d] shadow-xs border border-pink-100">
                          <Clock size={12} /> Dans {cycleInfo.daysUntilNextPeriod} j
                        </span>
                      ) : cycleInfo.daysUntilNextPeriod === 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800 shadow-xs">
                          <AlertCircle size={12} /> Prévues aujourd'hui
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-bold text-orange-800 shadow-xs">
                          <RotateCcw size={12} /> Décalage ({Math.abs(cycleInfo.daysUntilNextPeriod)} j)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Feedback vivant lors d'un recalibrage récent */}
                {recalibrationFeedback && (
                  <div className={`mt-2.5 rounded-xl p-2.5 text-xs flex items-start gap-2 border ${
                    recalibrationFeedback.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : recalibrationFeedback.type === "warning"
                      ? "bg-amber-50 border-amber-200 text-amber-900"
                      : "bg-blue-50 border-blue-200 text-blue-900"
                  }`}>
                    <Sparkles size={15} className="shrink-0 mt-0.5 text-[#ea2d6d]" />
                    <div className="flex-1 text-[11px] leading-relaxed">
                      <p className="font-bold">Ajustement automatique du cycle :</p>
                      <p>{recalibrationFeedback.text}</p>
                    </div>
                  </div>
                )}

                {/* MODULE D'ENREGISTREMENT ET DE RECALIBRATION */}
                <div className="mt-3 rounded-2xl bg-[#fff8fa] border border-[#f0d4de] p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#4c2a3b]">Vos règles sont là ?</p>
                      <p className="text-[10px] text-[#865d70]">
                        Enregistrez la date réelle pour recalibrer la prédiction si elle n'est pas exacte.
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Bouton 1-clic direct pour aujourd'hui */}
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                        handleRecalibratePeriod(todayStr);
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#ea2d6d] py-2 px-3 text-xs font-bold text-white shadow-xs hover:bg-[#8e3855] transition active:scale-[0.98]"
                    >
                      <CheckCircle2 size={15} /> Mes règles ont débuté aujourd'hui
                    </button>

                    {/* Bouton d'ouverture du sélecteur fin */}
                    <button
                      type="button"
                      onClick={() => setShowRecalibrateBox(!showRecalibrateBox)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-[#d6a5b6] bg-white py-2 px-3 text-xs font-bold text-[#8c3855] shadow-xs hover:bg-[#faedf1] transition"
                    >
                      <RotateCcw size={14} />
                      {showRecalibrateBox ? "Masquer le réglage" : "Autre date / Recalibrer"}
                    </button>
                  </div>

                  {/* Volet rétractable pour choisir une date spécifique et recalibrer */}
                  {showRecalibrateBox && (
                    <div className="mt-3 rounded-xl bg-white p-3 border border-[#ebd0db] shadow-xs space-y-2.5">
                      <p className="font-bold text-[#553043] text-xs">
                        Indiquez le jour réel où vos règles ont commencé :
                      </p>

                      {/* Raccourcis tactiles rapides */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
                            const d = new Date();
                            const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                            setRealPeriodDateInput(str);
                          }}
                          className={`rounded-lg px-2.5 py-1 font-semibold border ${
                            realPeriodDateInput === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`
                              ? "bg-[#ea2d6d] text-white border-[#ea2d6d]"
                              : "bg-[#faeff2] text-[#6b3c50] border-[#ebd1dc]"
                          }`}
                        >
                          Aujourd'hui
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const d = new Date();
                            d.setDate(d.getDate() - 1);
                            const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                            setRealPeriodDateInput(str);
                          }}
                          className="rounded-lg px-2.5 py-1 font-semibold bg-[#faeff2] text-[#6b3c50] border border-[#ebd1dc] hover:bg-[#f6e1e8]"
                        >
                          Hier
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const d = new Date();
                            d.setDate(d.getDate() - 2);
                            const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                            setRealPeriodDateInput(str);
                          }}
                          className="rounded-lg px-2.5 py-1 font-semibold bg-[#faeff2] text-[#6b3c50] border border-[#ebd1dc] hover:bg-[#f6e1e8]"
                        >
                          Avant-hier
                        </button>
                      </div>

                      {/* Sélecteur de date natif */}
                      <div>
                        <label className="block text-[10px] font-bold text-[#865d70] mb-1">
                          Date précise du premier jour :
                        </label>
                        <input
                          type="date"
                          value={realPeriodDateInput}
                          onChange={(e) => setRealPeriodDateInput(e.target.value)}
                          className="w-full rounded-xl border border-[#ebd2dd] p-2 text-xs font-bold text-[#580e36] bg-[#fffcfd]"
                        />
                      </div>

                      {/* Aperçu du calcul de l'écart */}
                      {(() => {
                        const prevParts = lastPeriodDate.split("-");
                        const prevDate = new Date(parseInt(prevParts[0], 10), parseInt(prevParts[1], 10) - 1, parseInt(prevParts[2], 10));
                        const realParts = realPeriodDateInput.split("-");
                        const realDate = new Date(parseInt(realParts[0], 10), parseInt(realParts[1], 10) - 1, parseInt(realParts[2], 10));
                        const diff = Math.round((realDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
                        return (
                          <div className="rounded-lg bg-[#faeff2] p-2 text-[11px] text-[#6a3c50] flex items-center justify-between">
                            <span>Écart constaté depuis le cycle précédent :</span>
                            <span className="font-extrabold text-[#ea2d6d]">
                              {diff > 0 ? `${diff} jours` : "Date invalide"}
                            </span>
                          </div>
                        );
                      })()}

                      <button
                        type="button"
                        onClick={() => handleRecalibratePeriod(realPeriodDateInput)}
                        className="w-full rounded-xl bg-gradient-to-r from-[#ea2d6d] to-[#b34d70] py-2 text-xs font-bold text-white shadow hover:opacity-95 transition"
                      >
                        Enregistrer & Recalibrer la prédiction
                      </button>
                    </div>
                  )}
                </div>

                {/* Historique des cycles recalibrés (accordéon repliable) */}
                <div className="mt-2.5 pt-2 border-t border-[#f7e4eb] flex items-center justify-between text-[11px]">
                  <button
                    type="button"
                    onClick={() => setShowCycleHistory(!showCycleHistory)}
                    className="inline-flex items-center gap-1 font-bold text-[#914c66] hover:underline"
                  >
                    <span>{showCycleHistory ? "Masquer l'historique" : "Voir l'historique de recalibration"}</span>
                    <span>({cycleHistory.length})</span>
                  </button>
                  <span className="text-[10px] text-[#9a7082]">Stockage 100% privé local</span>
                </div>

                {showCycleHistory && (
                  <div className="mt-2 space-y-1.5 text-xs">
                    {cycleHistory.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-[#f0dae2] bg-[#fffafb] p-2 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-[#580e36] text-[11px]">Cycle du {item.date}</p>
                          <p className="text-[10px] text-[#7a5868]">{item.note}</p>
                        </div>
                        <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-[#ea2d6d]">
                          {item.duration} jours
                        </span>
                      </div>
                    ))}
                  </div>
                )}
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
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#faedf1] text-[#ea2d6d]">
                      <Bell size={17} />
                    </span>
                    <h3 className="ph-display text-sm font-bold text-[#580e36]">Mes rappels de santé</h3>
                  </div>
                  <button
                    onClick={() => setShowNewReminderForm(!showNewReminderForm)}
                    className="text-xs font-bold text-[#ea2d6d] hover:underline"
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
                          setReminders((prev: any[]) => [
                            ...prev,
                            { id: Date.now(), title: newReminderTitle, date: newReminderDate || "Bientôt", type: newReminderType, active: true },
                          ]);
                          setNewReminderTitle("");
                          setNewReminderDate("");
                          setShowNewReminderForm(false);
                          notify("Rappel ajouté avec succès.");
                        }}
                        className="flex-1 rounded-xl bg-[#ea2d6d] py-1.5 font-bold text-white text-xs"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-3 space-y-2 text-xs">
                  {reminders.map((r: any) => (
                    <div key={r.id} className="flex items-center justify-between rounded-xl border border-[#f2e2e7] p-2.5 bg-[#fffafc]">
                      <div className="flex items-center gap-2.5">
                        <span className={`grid h-7 w-7 place-items-center rounded-lg ${r.type === "screening" ? "bg-purple-100 text-purple-800" : r.type === "appointment" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"}`}>
                          <Clock size={14} />
                        </span>
                        <div>
                          <p className="font-bold text-[#580e36]">{r.title}</p>
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
              <h1 className="ph-display text-[26px] leading-tight text-[#580e36]">
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
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#ea2d6d] mb-1">
                  Explication médicale détaillée ({speechLanguage === "en" ? "English" : "Français"}) :
                </span>
                {speechLanguage === "en" ? lessons[activeLesson].englishFullText : lessons[activeLesson].fullText}
              </div>

              {/* ENCADRÉ VIDÉO GUIDÉE D'AUTOPALPATION (PERSONNAGE AFRICAIN) */}
              <div className="mt-3 overflow-hidden rounded-2xl border border-pink-200 bg-gradient-to-r from-rose-50 via-white to-pink-50 p-3.5 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0 overflow-hidden rounded-xl border border-pink-200 shadow-xs w-20 aspect-[16/9]">
                    <img
                      src="/images/autopalpation-afrique-demo.jpg"
                      alt="Vidéo démonstrative autopalpation"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play size={14} className="fill-white text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#ea2d6d]">
                      Démonstration Guidée (2:45 min)
                    </span>
                    <h3 className="ph-display text-xs font-bold text-[#580e36] leading-tight">
                      Vidéo des 4 gestes d'autopalpation
                    </h3>
                    <p className="text-[10px] text-[#745362] line-clamp-1">
                      Avec une soignante africaine en Français, Mooré et Dioula.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAutopalpationVideoModal(true)}
                  className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ea2d6d] to-rose-700 py-2 text-xs font-bold text-white shadow-xs hover:opacity-95 transition"
                >
                  <Play size={14} className="fill-white" />
                  <span>Regarder la vidéo démonstrative 🎬</span>
                </button>
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
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${activeLesson === idx ? "bg-[#ea2d6d] text-white" : "bg-[#f9e9ed] text-[#ea2d6d]"}`}>
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
          {/* ------------------------------------------------------------------ */}
          {/* ------------------------------------------------------------------ */}
          {/* ONGLET 4 : ROSE IA (ASSISTANTE CONVERSATIONNELLE & ÉTHIQUE)        */}
          {/* ------------------------------------------------------------------ */}
          {section === "RoseIA" && !selectedCenter && (
            <section className="ph-enter flex flex-col h-full px-4 pt-2.5 pb-2">
              {/* ============================================================ */}
              {/* CONTENEURS DU HAUT SELON LE PROFIL                           */}
              {/* Profil Utilisatrice : uniquement "Voir la vidéo"             */}
              {/* Profil Docteur/Superadmin : "Entraîner le modèle" + "Vidéo"  */}
              {/* ============================================================ */}
              {currentUser?.adminType === "doctor" || currentUser?.role === "superadmin" ? (
                /* HAUT DE PAGE POUR DOCTEURS & SUPERADMIN */
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      hapticFeedback(15);
                      setShowDoctorTrainModal(true);
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-800 p-2.5 text-white font-bold text-xs shadow-xs hover:opacity-95 transition cursor-pointer"
                  >
                    <Stethoscope size={15} className="text-cyan-300" />
                    <span>Entraîner Rose IA 🩺</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAutopalpationVideoModal(true)}
                    className="flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#9e466b] to-rose-600 p-2.5 text-white font-bold text-xs shadow-xs hover:opacity-95 transition cursor-pointer"
                  >
                    <Play size={14} className="fill-white" />
                    <span>Voir la vidéo 🎬</span>
                  </button>
                </div>
              ) : (
                /* HAUT DE PAGE POUR LES UTILISATRICES : UNIQUEMENT VOIR LA VIDÉO */
                <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-rose-600 via-[#ea2d6d] to-[#734059] px-3.5 py-2.5 text-white shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="relative grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/20 text-white backdrop-blur-xs">
                      <Play size={14} className="fill-white translate-x-0.5" />
                      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 border border-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs">Vidéo d'Autopalpation Mammaire</h4>
                      <p className="text-[9.5px] text-white/85">
                        Démonstration guidée pas-à-pas par notre sage-femme
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAutopalpationVideoModal(true)}
                    className="rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-[#ea2d6d] shadow-xs hover:bg-pink-50 transition shrink-0 cursor-pointer"
                  >
                    Voir la vidéo 🎬
                  </button>
                </div>
              )}

              {/* MINI-BANDEAU D'ÉTAT DISCRET DE ROSE IA */}
              <div className="mt-2 flex items-center justify-between rounded-xl bg-white border border-[#f0dee3] px-3 py-1.5 text-xs shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-tr from-[#8a3857] to-[#cf5d83] text-white shadow-2xs">
                      <Sparkles size={14} className="text-amber-300" />
                    </span>
                    <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white ph-pulse" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#580e36] text-xs">Rose IA</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                      En ligne
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#863b55] hover:underline cursor-pointer"
                    title="Confidentialité et éthique médicale"
                  >
                    <ShieldCheck size={12} className="text-emerald-600" />
                    <span>100% Confidentiel</span>
                  </button>
                </div>
              </div>

              {/* CAPSULES DE QUESTIONS RAPIDES (INSPIRATION & CONSEILS) */}
              <div className="ph-scroll mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                {[
                  { label: "🌸 Toilette intime", q: "Comment bien faire ma toilette intime ?" },
                  { label: "🖐️ Comment se palper ?", q: "Comment bien faire l'autopalpation des seins étape par étape ?" },
                  { label: "🔍 Petite boule au sein", q: "J'ai senti une petite boule dans mon sein, que faire ?" },
                  { label: "🩸 Douleurs de règles", q: "Comment soulager mes crampes et douleurs de règles naturellement ?" },
                  { label: "🌿 Moringa & Baobab", q: "Quels sont les bienfaits du moringa et du baobab pour ma santé ?" },
                  { label: "📍 Centres de dépistage", q: "Où se faire dépister à Ouagadougou ?" },
                  { label: "💰 Coût du dépistage", q: "Combien coûte le dépistage au Burkina Faso ?" },
                  { label: "🧘‍♀️ Sérénité & moral", q: "Je me sens fatiguée et stressée, aide-moi" },
                ].map(({ label, q }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleSendRoseMessage(q)}
                    className="shrink-0 rounded-full border border-[#e4cad3] bg-white px-2.5 py-1 text-[#863b55] font-semibold hover:bg-[#faedf2] transition shadow-2xs cursor-pointer"
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* ZONE DES MESSAGES DU CHATBOT ROSE IA (HAUTEUR DYNAMIQUE PLEINE) */}
              <div className="mt-2 space-y-2.5 flex-1 min-h-[300px] overflow-y-auto pr-1">
                {roseMessages.map((msg, i) => {
                  const isUser = msg.sender === "user";
                  // Texte à afficher selon la langue choisie
                  const displayedText = isUser
                    ? msg.text
                    : appLanguage === "moore" && msg.mooreText
                    ? msg.mooreText
                    : appLanguage === "dioula" && msg.dioulaText
                    ? msg.dioulaText
                    : appLanguage === "en" && msg.englishText
                    ? msg.englishText
                    : msg.text;

                  const hasVideoRecommendation =
                    !isUser &&
                    (msg.text.toLowerCase().includes("palpation") ||
                      msg.text.toLowerCase().includes("geste") ||
                      msg.text.toLowerCase().includes("boule") ||
                      msg.text.toLowerCase().includes("sein") ||
                      msg.text.toLowerCase().includes("nodule"));

                  return (
                    <div
                      key={i}
                      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[88%] rounded-[20px] p-3 text-xs leading-relaxed shadow-xs ${
                          isUser
                            ? "bg-[#ea2d6d] text-white rounded-tr-xs"
                            : "bg-white text-[#580e36] border border-[#f0dfe4] rounded-tl-xs"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{displayedText}</p>

                        {/* Bouton cliquable pour voir la vidéo si suggéré par Rose IA */}
                        {hasVideoRecommendation && (
                          <button
                            type="button"
                            onClick={() => setShowAutopalpationVideoModal(true)}
                            className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#ea2d6d] to-rose-700 py-1.5 px-2.5 text-[11px] font-bold text-white shadow-xs hover:opacity-95 transition cursor-pointer"
                          >
                            <Play size={12} className="fill-white" />
                            <span>Voir la démonstration vidéo (Sage-femme) 🎬</span>
                          </button>
                        )}
                      </div>

                      {/* ÉCOUTE VOCALE DISCRÈTE (DANS LA LANGUE CHOISIE) */}
                      {!isUser && (
                        <div className="mt-1 flex items-center gap-2 pl-1">
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(displayedText, appLanguage)}
                            className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#ea2d6d] hover:underline cursor-pointer"
                            title={`Écouter à voix haute en ${appLanguage.toUpperCase()}`}
                          >
                            <Volume2 size={12} />
                            <span>Écouter ({appLanguage === "moore" ? "Mooré" : appLanguage === "dioula" ? "Dioula" : appLanguage.toUpperCase()})</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Point d'ancrage pour le défilement automatique */}
                <div ref={roseChatBottomRef} />
              </div>

              {/* RAPPEL ÉTHIQUE MÉDICAL */}
              <div className="mt-1.5 text-center text-[9px] text-[#936b7c] px-2 italic">
                🛡️ Rose IA est une conseillère préventive bienveillante. Elle ne remplace pas l'avis d'une sage-femme ou d'un médecin.
              </div>

              {/* BARRE DE SAISIE MODERNE & RÉACTIVE (<FORM> TOUCHE ENTRÉE + MICRO) */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendRoseMessage();
                }}
                className="mt-1.5 rounded-2xl border border-[#e5ccd5] bg-white p-2 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleVoiceRecognition}
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition cursor-pointer ${
                      isRecordingVoice
                        ? "bg-rose-600 text-white ph-pulse ring-2 ring-rose-300"
                        : "bg-[#f8e7ec] text-[#ea2d6d] hover:bg-[#f2dbe2]"
                    }`}
                    title={isRecordingVoice ? "Arrêter le micro" : "Parler à Rose IA au micro"}
                  >
                    <Mic size={17} className={isRecordingVoice ? "animate-pulse" : ""} />
                  </button>
                  <input
                    type="text"
                    value={roseInput}
                    onChange={(e) => setRoseInput(e.target.value)}
                    placeholder={
                      isRecordingVoice
                        ? "Rose IA vous écoute avec tendresse... Parlez"
                        : "Posez votre question à Rose IA (écrit ou micro)..."
                    }
                    className="flex-1 bg-transparent text-xs text-[#580e36] outline-none placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={!roseInput.trim()}
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition cursor-pointer ${
                      roseInput.trim()
                        ? "bg-[#ea2d6d] text-white hover:bg-[#8e3856] shadow-xs"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                    title="Envoyer le message"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </form>
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
              <h1 className="ph-display text-[26px] leading-tight text-[#580e36]">
                Faire un don
              </h1>
              <p className="mt-1 text-xs text-[#795f6d]">
                Votre contribution finance directement le dépistage et les soins de femmes sans revenus au Burkina Faso.
              </p>

              <div className="mt-3.5 rounded-[26px] border-2 border-rose-300 bg-gradient-to-br from-[#fff7f9] to-[#ffedf3] p-5 shadow-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ea2d6d] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
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
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ea2d6d] py-3 text-xs font-bold text-white shadow hover:bg-[#d81f5c] transition"
                  >
                    <Heart size={15} className="fill-white" /> Commencer mon don maintenant
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="ph-display text-sm font-bold text-[#580e36]">Associations partenaires éligibles</h3>
                <div className="mt-2 space-y-2">
                  {partnerAssociations.map((assoc) => (
                    <div key={assoc.id} className="rounded-2xl border border-[#eedde2] bg-white p-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#580e36]">{assoc.name} ({assoc.acronym})</span>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">Vérifié</span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#785b6a]">{assoc.mission}</p>
                      <button
                        onClick={() => {
                          setSelectedAssociation(assoc);
                          setShowDonationModal(true);
                        }}
                        className="mt-2 font-bold text-[#ea2d6d] hover:underline block text-[10.5px]"
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
                  <h1 className="ph-display text-[26px] leading-tight text-[#580e36]">
                    Annonces
                  </h1>
                </div>
                {/* Bouton de publication pour les partenaires et soignants */}
                {(currentUser?.role === "admin" || currentUser?.role === "superadmin") && (
                  <button
                    onClick={() => setShowNewAnnouncementModal(true)}
                    className="rounded-full bg-[#ea2d6d] px-3.5 py-1 text-xs font-bold text-white shadow hover:bg-[#8e3856]"
                  >
                    + Publier
                  </button>
                )}
              </div>

              {/* FILTRES D'ANNONCES : MOIS EN COURS / TOUTES / VEILLE ROSE IA / MES ANNONCES */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
                <button
                  onClick={() => setAnnouncementsFilter("month")}
                  className={`rounded-full px-3 py-1 font-bold transition ${announcementsFilter === "month" ? "bg-[#ea2d6d] text-white shadow-xs" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  📅 Mois en cours (Octobre 2026)
                </button>
                <button
                  onClick={() => setAnnouncementsFilter("rose_ai")}
                  className={`rounded-full px-3 py-1 font-bold transition inline-flex items-center gap-1 ${announcementsFilter === "rose_ai" ? "bg-purple-900 text-white shadow-xs" : "border border-purple-200 bg-purple-50 text-purple-900"}`}
                >
                  <Sparkles size={12} className="text-amber-400" />
                  <span>Veille Rose IA ({announcements.filter((a) => a.isRoseAIDetected && a.status === "approved").length})</span>
                </button>
                <button
                  onClick={() => setAnnouncementsFilter("all")}
                  className={`rounded-full px-3 py-1 font-bold transition ${announcementsFilter === "all" ? "bg-[#ea2d6d] text-white shadow-xs" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
                >
                  Toutes ({announcements.filter((a) => a.status === "approved").length})
                </button>
                {(currentUser?.role === "admin" || currentUser?.role === "superadmin") && (
                  <button
                    onClick={() => setAnnouncementsFilter("my")}
                    className={`rounded-full px-3 py-1 font-bold transition ${announcementsFilter === "my" ? "bg-[#ea2d6d] text-white shadow-xs" : "border border-[#e7d5dc] bg-white text-[#7d5d6c]"}`}
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
                    <div
                      key={a.id}
                      className={`rounded-2xl border p-3.5 text-xs shadow-sm ${
                        a.isRoseAIDetected
                          ? "border-purple-200 bg-gradient-to-br from-white to-purple-50/40"
                          : "border-[#efdfe4] bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${a.badgeColor}`}>
                          {a.badge}
                        </span>
                        <span className="text-[10px] text-[#8e6878] font-semibold">{a.month}</span>
                      </div>

                      {/* Mention spéciale si repérée par Rose IA */}
                      {a.isRoseAIDetected && (
                        <div className="mt-1 flex items-center gap-1 text-[9.5px] font-bold text-purple-900 bg-purple-100/70 px-2 py-0.5 rounded-lg w-fit">
                          <Sparkles size={11} className="text-amber-500" />
                          <span>Veille intelligente Rose IA · {a.sourceWebUrl}</span>
                        </div>
                      )}

                      <h3 className="ph-display mt-1 text-sm font-bold text-[#580e36]">{a.title}</h3>
                      <p className="text-[11px] text-[#8c405c] mt-0.5 font-semibold">
                        {a.author} · {a.city}
                      </p>

                      {/* Affiche officielle ou photo de l'événement */}
                      {a.imageUrl && (
                        <div className="relative mt-2 overflow-hidden rounded-xl border border-pink-100 shadow-xs group">
                          <img
                            src={a.imageUrl}
                            alt={a.title}
                            className="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-102"
                            loading="lazy"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedPosterModal({
                                url: a.imageUrl!,
                                title: a.title,
                                author: a.author,
                                caption: a.imageCaption,
                              })
                            }
                            className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-black/75 px-2 py-1 text-[9.5px] font-bold text-white backdrop-blur-xs hover:bg-black/90 transition shadow-sm"
                          >
                            <Eye size={12} /> Agrandir l'affiche
                          </button>
                        </div>
                      )}

                      <p className="mt-2 text-[#6d4f5e] leading-relaxed">{a.content}</p>

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
              <h1 className="ph-display text-[26px] leading-tight text-[#580e36]">
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
                    className={`flex-1 rounded-xl py-1.5 font-bold transition text-xs ${smsLanguage === "fr" ? "bg-[#ea2d6d] text-white" : "border border-[#e5ccd5] text-[#714f5e]"}`}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => setSmsLanguage("moore")}
                    className={`flex-1 rounded-xl py-1.5 font-bold transition text-xs ${smsLanguage === "moore" ? "bg-[#ea2d6d] text-white" : "border border-[#e5ccd5] text-[#714f5e]"}`}
                  >
                    Mooré
                  </button>
                </div>

                <div className="mt-3 rounded-xl bg-[#fdf5f8] border border-[#f5dfeb] p-2.5 text-[11px] italic text-[#6f4b5d]">
                  « {smsLanguage === "fr"
                    ? `Bonjour ma sœur, je t'invite à faire notre dépistage du sein ensemble sur PagLaafi : ${appShareUrl}`
                    : `Ne y beogo m maaso, m boola fo tɩ d kẽng a yiibu n ges d yĩnsa laafi ne PagLaafi : ${appShareUrl}`} »
                </div>

                {/* 1. BOUTON ENVOI PAR WHATSAPP */}
                <button
                  onClick={() => {
                    const text = encodeURIComponent(
                      smsLanguage === "fr"
                        ? `Bonjour ma sœur, je t'invite à faire notre dépistage du sein ensemble sur PagLaafi : ${appShareUrl}`
                        : `Ne y beogo m maaso, m boola fo tɩ d kẽng a yiibu n ges d yĩnsa laafi ne PagLaafi : ${appShareUrl}`,
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
                        ? `Bonjour ma sœur, je t'invite à faire notre dépistage du sein ensemble sur PagLaafi : ${appShareUrl}`
                        : `Ne y beogo m maaso, m boola fo tɩ d kẽng a yiibu n ges d yĩnsa laafi ne PagLaafi : ${appShareUrl}`,
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
                    <p className="font-bold text-[#580e36] mt-0.5">{selectedCenter.queueCount} personnes ({selectedCenter.estimatedWait})</p>
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
                  <button onClick={() => handlePlayAudio(selectedCenter.audioMessageFr, "fr")} className="rounded-xl bg-[#ea2d6d] py-1.5 text-[10px] font-bold text-white">FR</button>
                  <button onClick={() => handlePlayAudio(selectedCenter.audioMessageEn, "en")} className="rounded-xl bg-[#ea2d6d] py-1.5 text-[10px] font-bold text-white">EN</button>
                  <button onClick={() => handlePlayAudio(selectedCenter.audioMessageMoore, "moore")} className="rounded-xl border border-[#e2bac8] bg-[#fdf5f7] py-1.5 text-[10px] font-bold text-[#8a3350]">Mooré</button>
                  <button onClick={() => handlePlayAudio(selectedCenter.audioMessageDioula, "dioula")} className="rounded-xl border border-[#e2bac8] bg-[#fdf5f7] py-1.5 text-[10px] font-bold text-[#8a3350]">Dioula</button>
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
                { label: "Comprendre" as Section, icon: BookOpen, name: "Comprendre" },
                { label: "RoseIA" as Section, icon: Sparkles, name: "Rose IA", isCentral: true },
                { label: "Centres" as Section, icon: MapPin, name: "Centres" },
                { label: "FaireUnDon" as Section, icon: Gift, name: "Faire un don" },
              ].map(({ label, icon: Icon, name, isCentral }) => {
                const active = section === label;

                if (isCentral) {
                  return (
                    <button
                      key={label}
                      onClick={() => {
                        hapticFeedback(18);
                        setSection(label);
                        setSelectedCenter(null);
                      }}
                      aria-current={active ? "page" : undefined}
                      className="group relative -mt-4 flex flex-col items-center justify-center focus:outline-none"
                    >
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-white shadow-[0_6px_18px_rgba(161,67,100,.35)] transition-all duration-300 group-hover:scale-105 ${active ? "bg-gradient-to-tr from-[#8a3350] via-[#ea2d6d] to-[#cf5d83] text-white ring-2 ring-[#ea2d6d]/30" : "bg-gradient-to-tr from-[#9c3e5d] to-[#be5377] text-white"}`}
                      >
                        <Sparkles size={21} className="text-amber-300 animate-pulse" />
                      </span>
                      <span
                        className={`mt-0.5 text-[9.5px] tracking-tight font-extrabold transition ${active ? "text-[#ea2d6d]" : "text-[#7b5465]"}`}
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
                      hapticFeedback(12);
                      setSection(label);
                      setSelectedCenter(null);
                      if (label === "FaireUnDon") {
                        setShowDonationModal(true);
                      }
                    }}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-2xl transition ${active ? "text-[#ea2d6d]" : "text-[#9d838e] hover:text-[#785062]"}`}
                  >
                    <span
                      className={`grid h-7 w-9 place-items-center rounded-full transition-all duration-200 ${active ? "bg-[#fbe7ed] text-[#ea2d6d] shadow-xs" : ""}`}
                    >
                      <Icon size={18} strokeWidth={active ? 2.5 : 1.8} className={label === "FaireUnDon" && active ? "fill-[#ea2d6d]" : ""} />
                    </span>
                    <span
                      className={`text-[9.5px] tracking-tight transition ${active ? "font-bold text-[#ea2d6d]" : "font-medium text-[#9d838e]"}`}
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
            <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl max-h-[90vh] overflow-y-auto border-2 border-[#ea2d6d]">
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#faedf1] text-[#ea2d6d]">
                    <Megaphone size={18} />
                  </span>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#580e36]">Publier une annonce</h3>
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

                {/* Photo ou Affiche officielle de l'événement */}
                <div className="space-y-1.5 rounded-xl border border-pink-200 bg-pink-50/40 p-2.5">
                  <label className="block font-bold text-[#563746]">Affiche ou Photo de l'événement :</label>
                  
                  {/* Modèles d'affiches des partenaires en 1 clic */}
                  <div className="grid grid-cols-3 gap-1 text-[9.5px]">
                    <button
                      type="button"
                      onClick={() =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          imageUrl: "/images/affiche-evenement-beneere.jpg",
                          imageCaption: "Affiche Caravane BE NEERE FOR CAUSE",
                        })
                      }
                      className={`rounded-lg p-1 text-center font-bold border transition ${
                        newAnnouncement.imageUrl === "/images/affiche-evenement-beneere.jpg"
                          ? "bg-[#ea2d6d] text-white border-[#ea2d6d]"
                          : "bg-white text-[#7d4b60] border-pink-200 hover:bg-pink-100"
                      }`}
                    >
                      🎪 BE NEERE
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          imageUrl: "/images/affiche-wtm-odc.jpg",
                          imageCaption: "Affiche Hackathon WTM & Orange Digital Center",
                        })
                      }
                      className={`rounded-lg p-1 text-center font-bold border transition ${
                        newAnnouncement.imageUrl === "/images/affiche-wtm-odc.jpg"
                          ? "bg-[#ea2d6d] text-white border-[#ea2d6d]"
                          : "bg-white text-[#7d4b60] border-pink-200 hover:bg-pink-100"
                      }`}
                    >
                      💻 WTM / ODC
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          imageUrl: "/images/affiche-genit-care.jpg",
                          imageCaption: "Affiche Clinique GENIT CARE",
                        })
                      }
                      className={`rounded-lg p-1 text-center font-bold border transition ${
                        newAnnouncement.imageUrl === "/images/affiche-genit-care.jpg"
                          ? "bg-[#ea2d6d] text-white border-[#ea2d6d]"
                          : "bg-white text-[#7d4b60] border-pink-200 hover:bg-pink-100"
                      }`}
                    >
                      🏥 GENIT CARE
                    </button>
                  </div>

                  {/* Saisie d'une URL personnalisée */}
                  <input
                    type="text"
                    placeholder="Ou lien de votre affiche / photo..."
                    value={newAnnouncement.imageUrl || ""}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, imageUrl: e.target.value })}
                    className="w-full rounded-lg border border-[#e4cfd6] bg-white p-1.5 text-[11px]"
                  />

                  {/* Prévisualisation miniature de l'affiche */}
                  {newAnnouncement.imageUrl && (
                    <div className="relative mt-1 overflow-hidden rounded-lg border border-pink-200 shadow-2xs">
                      <img
                        src={newAnnouncement.imageUrl}
                        alt="Aperçu affiche"
                        className="aspect-[16/9] w-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[8.5px] font-bold text-white">
                        ✓ Aperçu de l'affiche
                      </span>
                    </div>
                  )}
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
                  className="w-full rounded-xl bg-[#ea2d6d] py-2.5 font-bold text-white shadow hover:bg-[#8e3856]"
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

              {/* Raccourci Audit & Simulation Entraînement Docteur pour Superadmin */}
              <button
                type="button"
                onClick={() => {
                  setShowSuperadminModal(false);
                  setShowDoctorTrainModal(true);
                }}
                className="mt-2.5 flex w-full items-center justify-between rounded-xl bg-amber-50 border border-amber-300 p-2 text-xs font-bold text-amber-950 hover:bg-amber-100 transition shadow-2xs"
              >
                <span className="flex items-center gap-1.5">
                  <GraduationCap size={15} className="text-amber-700" />
                  <span>Audit : Simuler l'Entraînement Docteur</span>
                </span>
                <span className="bg-amber-200 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold">4 étapes →</span>
              </button>

              {/* ONGLET 1 : STATISTIQUES DE VISITES DU SITE & RECENSEMENT DES CENTRES PAR VILLE/RÉGION */}
              {superadminActiveTab === "stats" && (
                <div className="mt-3.5 space-y-3 text-xs ph-enter">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-purple-50 border border-purple-200 p-3">
                      <span className="text-[9.5px] font-bold text-purple-800 uppercase">Visites totales</span>
                      <p className="text-lg font-extrabold text-purple-950 mt-0.5">48 320</p>
                      <p className="text-[9px] text-emerald-700 font-bold">▲ +31% ce mois</p>
                    </div>
                    <div className="rounded-2xl bg-pink-50 border border-pink-200 p-3">
                      <span className="text-[9.5px] font-bold text-[#ea2d6d] uppercase">Femmes uniques</span>
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

                  {/* ================================================================= */}
                  {/* RECENSEMENT DES CENTRES LES PLUS FRÉQUENTÉS PAR VILLE ET RÉGION   */}
                  {/* ================================================================= */}
                  <div className="rounded-2xl border-2 border-purple-300 bg-white p-3.5 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                      <div className="flex items-center gap-1.5">
                        <Activity size={16} className="text-purple-900" />
                        <h4 className="ph-display text-xs font-bold text-purple-950">
                          Centres les plus fréquentés
                        </h4>
                      </div>
                      <span className="text-[9.5px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                        {superadminSortedCenters.length} centres
                      </span>
                    </div>

                    {/* Filtres par Ville & Région */}
                    <div className="flex flex-wrap items-center gap-1 text-[10px] font-bold">
                      {[
                        { id: "all", label: "🇧🇫 Tout le pays" },
                        { id: "Centre", label: "📍 Ouaga (Centre)" },
                        { id: "Hauts-Bassins", label: "📍 Bobo (Hauts-Bassins)" },
                        { id: "Centre-Ouest", label: "📍 Koudougou" },
                      ].map((reg) => (
                        <button
                          key={reg.id}
                          onClick={() => setSuperadminRegionFilter(reg.id)}
                          className={`rounded-lg px-2 py-1 transition ${
                            superadminRegionFilter === reg.id
                              ? "bg-purple-950 text-white shadow-xs"
                              : "bg-[#f5eaf0] text-purple-900 hover:bg-[#ebdbe5]"
                          }`}
                        >
                          {reg.label}
                        </button>
                      ))}
                    </div>

                    {/* Palmarès classé par fréquentation */}
                    <div className="space-y-2 pt-1">
                      {superadminSortedCenters.map((center, index) => {
                        const monthlyEstimated = center.confirmedVisitsToday * 24;
                        const rankColor =
                          index === 0
                            ? "bg-amber-400 text-amber-950 font-black shadow-xs ring-2 ring-amber-300"
                            : index === 1
                              ? "bg-slate-300 text-slate-900 font-bold"
                              : index === 2
                                ? "bg-amber-700 text-white font-bold"
                                : "bg-purple-100 text-purple-900 font-semibold";

                        return (
                          <div
                            key={center.id}
                            className="rounded-xl border border-purple-100 bg-purple-50/40 p-2.5 transition hover:bg-purple-50"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2">
                                <span
                                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg text-[10px] ${rankColor}`}
                                >
                                  #{index + 1}
                                </span>
                                <div>
                                  <h5 className="font-bold text-[#351c2a] text-[11.5px] leading-tight">
                                    {center.shortName}
                                  </h5>
                                  <p className="text-[10px] text-purple-800">
                                    {center.place} ({center.city})
                                  </p>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-xs font-black text-purple-950 block">
                                  {center.confirmedVisitsToday} femmes/j
                                </span>
                                <span className="text-[9px] text-[#865d70]">
                                  ~{monthlyEstimated.toLocaleString("fr-FR")} /mois
                                </span>
                              </div>
                            </div>

                            {/* Jauge d'affluence et détails */}
                            <div className="mt-2 pt-1.5 border-t border-purple-100/80 flex items-center justify-between text-[9.5px]">
                              <span className="flex items-center gap-1 font-semibold text-[#5a3b4c]">
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    center.isApparatusWorking ? "bg-emerald-500" : "bg-rose-500"
                                  }`}
                                />
                                {center.isApparatusWorking ? "Mammographe actif" : "Mammographe en révision"}
                              </span>
                              <span className="text-purple-900 font-bold">
                                Attente : {center.estimatedWait}
                              </span>
                              <span className="text-purple-800">
                                👥 {center.agentsPresent} soignants
                              </span>
                            </div>

                            {/* Barre de tension relative */}
                            <div className="mt-1.5 h-1.5 w-full rounded-full bg-purple-100 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  center.confirmedVisitsToday >= 60
                                    ? "bg-rose-500"
                                    : center.confirmedVisitsToday >= 30
                                      ? "bg-amber-500"
                                      : "bg-emerald-500"
                                }`}
                                style={{
                                  width: `${Math.min(100, (center.confirmedVisitsToday / 80) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Répartition géographique des visites au Burkina */}
                  <div className="rounded-2xl border border-[#ebd6dc] bg-[#fffafc] p-3 space-y-2">
                    <span className="font-bold text-[#580e36] block">Répartition des visites par région :</span>
                    <div className="space-y-1.5 text-[11px]">
                      <div>
                        <div className="flex justify-between text-[#5f4150]">
                          <span>Centre (Ouagadougou & environs)</span>
                          <span className="font-bold">57%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full bg-[#ea2d6d]" style={{ width: "57%" }} />
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

              {/* ONGLET 2 : MODÉRATION DES ANNONCES & VEILLE RADAR ROSE IA */}
              {superadminActiveTab === "announcements" && (
                <div className="mt-3.5 space-y-3 text-xs ph-enter">
                  {/* Sous-onglets de tri : Tout / Veille Rose IA / Partenaires */}
                  <div className="flex items-center gap-1 bg-[#f5eaf0] p-1 rounded-xl text-[10.5px] font-bold">
                    <button
                      onClick={() => setSuperadminAnnouncementTab("all")}
                      className={`flex-1 py-1 rounded-lg transition ${
                        superadminAnnouncementTab === "all"
                          ? "bg-purple-950 text-white shadow-xs"
                          : "text-purple-900"
                      }`}
                    >
                      Toutes ({announcements.filter((a) => a.status === "pending_validation").length})
                    </button>
                    <button
                      onClick={() => setSuperadminAnnouncementTab("rose_ai")}
                      className={`flex-1 py-1 rounded-lg transition inline-flex items-center justify-center gap-1 ${
                        superadminAnnouncementTab === "rose_ai"
                          ? "bg-purple-950 text-white shadow-xs"
                          : "text-purple-900"
                      }`}
                    >
                      <Sparkles size={11} className="text-amber-400" />
                      <span>
                        Veille Rose IA (
                        {
                          announcements.filter(
                            (a) => a.status === "pending_validation" && a.isRoseAIDetected,
                          ).length
                        }
                        )
                      </span>
                    </button>
                    <button
                      onClick={() => setSuperadminAnnouncementTab("partners")}
                      className={`flex-1 py-1 rounded-lg transition ${
                        superadminAnnouncementTab === "partners"
                          ? "bg-purple-950 text-white shadow-xs"
                          : "text-purple-900"
                      }`}
                    >
                      Partenaires (
                      {
                        announcements.filter(
                          (a) => a.status === "pending_validation" && !a.isRoseAIDetected,
                        ).length
                      }
                      )
                    </button>
                  </div>

                  {/* Liste des annonces à modérer */}
                  <div className="space-y-2.5">
                    {announcements
                      .filter((a) => {
                        if (a.status !== "pending_validation") return false;
                        if (superadminAnnouncementTab === "rose_ai") return a.isRoseAIDetected;
                        if (superadminAnnouncementTab === "partners") return !a.isRoseAIDetected;
                        return true;
                      })
                      .map((ann) => (
                        <div
                          key={ann.id}
                          className={`rounded-2xl p-3 text-xs space-y-2 border-2 ${
                            ann.isRoseAIDetected
                              ? "border-purple-400 bg-gradient-to-br from-purple-50 via-white to-pink-50/50 shadow-sm"
                              : "border-amber-300 bg-amber-50/70"
                          }`}
                        >
                          {/* Badge et Origine */}
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-bold text-[#3a1d2d] text-[12px] leading-tight">
                              {ann.title}
                            </span>
                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                                ann.isRoseAIDetected
                                  ? "bg-purple-900 text-white"
                                  : "bg-amber-200 text-amber-900"
                              }`}
                            >
                              {ann.isRoseAIDetected ? "🤖 Veille Web Rose IA" : "En attente partenaire"}
                            </span>
                          </div>

                          {/* Source internet pour la veille Rose IA */}
                          {ann.isRoseAIDetected && (
                            <div className="rounded-xl bg-purple-100/70 p-2 text-[10px] space-y-0.5 text-purple-950">
                              <p className="font-bold flex items-center gap-1">
                                <span>🌐 Source détectée :</span>
                                <span className="text-purple-800 font-normal">{ann.sourceWebUrl}</span>
                              </p>
                              <p className="font-bold flex items-center gap-1">
                                <span>🎯 Indice de confiance IA :</span>
                                <span className="text-emerald-700">{ann.aiConfidence}</span>
                              </p>
                              <p className="mt-1 italic text-[9.5px] text-purple-900">
                                📲 <strong>Notification push préparée :</strong> « {ann.pushMessageFr} »
                              </p>
                            </div>
                          )}

                          <p className="text-[10.5px] text-[#863e58] font-semibold">
                            {ann.author} · {ann.city} ({ann.date})
                          </p>
                          <p className="text-[11px] text-[#553b49] leading-relaxed">{ann.content}</p>
                          <p className="text-[10px] text-[#7d5d6d]">Contact : {ann.contact}</p>

                          {/* Actions : Validation avec diffusion Push ou Rejet */}
                          <div className="pt-2 flex gap-2">
                            {ann.isRoseAIDetected ? (
                              <button
                                onClick={() => handleApproveAndPushAnnouncement(ann.id)}
                                className="flex-1 rounded-xl bg-gradient-to-r from-purple-900 to-[#ea2d6d] py-2 font-bold text-white shadow-sm text-center hover:opacity-95 flex items-center justify-center gap-1.5"
                                title="Valider officiellement l'annonce et envoyer un push bienveillant aux femmes"
                              >
                                <Sparkles size={14} className="text-amber-300" />
                                <span>Valider & Diffuser en Push 🚀</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleApproveAnnouncement(ann.id)}
                                className="flex-1 rounded-xl bg-emerald-600 py-1.5 font-bold text-white shadow-xs text-center hover:bg-emerald-700"
                              >
                                Valider & Publier ✓
                              </button>
                            )}

                            <button
                              onClick={() => handleRejectAnnouncement(ann.id)}
                              className="rounded-xl border border-rose-300 bg-white px-3 py-1.5 font-bold text-rose-700 hover:bg-rose-50"
                            >
                              Refuser
                            </button>
                          </div>
                        </div>
                      ))}

                    {announcements.filter((a) => {
                      if (a.status !== "pending_validation") return false;
                      if (superadminAnnouncementTab === "rose_ai") return a.isRoseAIDetected;
                      if (superadminAnnouncementTab === "partners") return !a.isRoseAIDetected;
                      return true;
                    }).length === 0 && (
                      <div className="rounded-xl border border-[#ebd6dc] p-4 text-center text-[#825b6d]">
                        Aucune annonce en attente dans cette catégorie.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ONGLET 3 : DEMANDES D'ADHÉSION DES STRUCTURES */}
              {superadminActiveTab === "registrations" && (
                <div className="mt-3.5 space-y-2 text-xs ph-enter">
                  <p className="font-bold text-[#580e36]">
                    Demandes d'adhésion en attente ({pendingRegistrations.filter((r) => r.status === "pending").length}) :
                  </p>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {pendingRegistrations.map((reg) => (
                      <div key={reg.id} className="rounded-xl border border-[#ebd6dc] bg-[#fffafc] p-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#580e36]">{reg.structure}</span>
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
                  <p className="text-base font-extrabold text-[#6c1543] mt-0.5">3 850 000 F</p>
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
                  <p className="font-bold text-[#580e36]">Dernières collectes Orange Money :</p>
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
                        <span className="font-bold text-[#580e36]">{tx.donor}</span>
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
                      className="mt-1 w-full rounded-xl border border-[#e4cfd6] p-2 font-semibold text-[#580e36]"
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
                        className="w-full rounded-xl border border-[#e4cfd6] py-2 pl-14 pr-3 font-bold text-[#580e36] focus:border-[#f16e00] focus:outline-none"
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
                      <span className="font-bold text-[#580e36]">{selectedAssociation.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7c5b6b]">Montant :</span>
                      <span className="font-extrabold text-[#f16e00] text-sm">
                        {customDonationAmount ? Number(customDonationAmount).toLocaleString("fr-FR") : donationAmount.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7c5b6b]">Donateur :</span>
                      <span className="font-bold text-[#580e36]">
                        {isAnonymousDonation ? "Donatrice anonyme (Chiffré AES-256)" : `${currentUser?.prenom || "Donateur"} ${currentUser?.nom || ""}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7c5b6b]">Numéro débité :</span>
                      <span className="font-bold text-[#580e36]">
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
                    <h4 className="font-bold text-[#580e36]">Autorisation Orange Money (#144*4*6#)</h4>
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
                      className="w-full rounded-xl border-2 border-orange-400 p-2 text-center text-sm font-extrabold tracking-widest text-[#580e36]"
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
                    <h4 className="ph-display text-lg font-bold text-[#580e36]">Merci pour votre générosité !</h4>
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
                    className="w-full rounded-2xl bg-[#ea2d6d] py-2.5 font-bold text-white shadow"
                  >
                    Fermer le reçu
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL : MISE À JOUR DU CENTRE DE SANTÉ (DISPONIBILITÉS & AFFLUENCE) */}
        {/* ==================================================================== */}
        {showCenterUpdateModal && centerUpdateData && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:absolute sm:rounded-[36px]"
            onClick={() => setShowCenterUpdateModal(false)}
          >
            <div
              className="ph-enter max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-5 text-[#351c2a] shadow-2xl border-2 border-[#ea2d6d]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* En-tête */}
              <div className="flex items-center justify-between border-b border-[#fce4ec] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-[#580e36] to-[#ea2d6d] text-white shadow-sm">
                    <Edit3 size={18} />
                  </div>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#580e36]">
                      Mise à jour du Centre
                    </h3>
                    <p className="text-[10px] text-[#ea2d6d] font-bold">
                      {centerUpdateData.name}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCenterUpdateModal(false)}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Formulaire de mise à jour */}
              <form onSubmit={handleSaveCenterUpdate} className="mt-3.5 space-y-3.5 text-xs">
                {/* 1. Statut opérationnel & Affluence */}
                <div>
                  <label className="block text-[11px] font-bold text-[#580e36] mb-1">
                    Statut d'accueil et affluence en direct :
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      {
                        value: "available",
                        label: "Disponible",
                        sub: "Attente fluide",
                        color: "border-emerald-500 bg-emerald-50 text-emerald-800",
                        dot: "bg-emerald-500",
                      },
                      {
                        value: "busy",
                        label: "Affluence",
                        sub: "Attente moyenne",
                        color: "border-amber-500 bg-amber-50 text-amber-900",
                        dot: "bg-amber-500",
                      },
                      {
                        value: "maintenance",
                        label: "Maintenance",
                        sub: "Appareil arrêté",
                        color: "border-rose-500 bg-rose-50 text-rose-800",
                        dot: "bg-rose-500",
                      },
                    ].map((st) => (
                      <button
                        key={st.value}
                        type="button"
                        onClick={() => {
                          setCenterUpdateData({
                            ...centerUpdateData,
                            status: st.value as any,
                            statusLabel:
                              st.value === "available"
                                ? "Disponible · Attente fluide"
                                : st.value === "busy"
                                ? "Forte affluence · Prévoir attente"
                                : "Maintenance technique · Arrêt temporaire",
                            statusColor: st.dot,
                          });
                        }}
                        className={`flex flex-col items-center justify-center rounded-xl p-2 border-2 transition cursor-pointer ${
                          centerUpdateData.status === st.value
                            ? `${st.color} font-bold shadow-xs`
                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span className={`h-2.5 w-2.5 rounded-full ${st.dot} mb-1`} />
                        <span className="text-[11px] font-bold">{st.label}</span>
                        <span className="text-[9px] opacity-80">{st.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Temps d'attente estimé & File d'attente */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
                      Temps d'attente estimé :
                    </label>
                    <input
                      type="text"
                      value={centerUpdateData.estimatedWait}
                      onChange={(e) =>
                        setCenterUpdateData({ ...centerUpdateData, estimatedWait: e.target.value })
                      }
                      placeholder="Ex: ~15 à 20 min"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#ea2d6d] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
                      Patientes dans la file :
                    </label>
                    <input
                      type="number"
                      value={centerUpdateData.queueCount}
                      onChange={(e) =>
                        setCenterUpdateData({
                          ...centerUpdateData,
                          queueCount: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#ea2d6d] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* 3. État du mammographe numérique */}
                <div className="rounded-2xl bg-[#fdf2f6] p-3 border border-[#fce4ec]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#580e36] text-[11px]">
                        Mammographe numérique en service :
                      </p>
                      <p className="text-[10px] text-[#785566]">
                        {centerUpdateData.isApparatusWorking
                          ? "✓ L'appareil fonctionne à 100%"
                          : "⚠️ Appareil en panne ou calibration"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setCenterUpdateData({
                          ...centerUpdateData,
                          isApparatusWorking: !centerUpdateData.isApparatusWorking,
                        })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer ${
                        centerUpdateData.isApparatusWorking ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          centerUpdateData.isApparatusWorking ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={centerUpdateData.apparatus}
                    onChange={(e) =>
                      setCenterUpdateData({ ...centerUpdateData, apparatus: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-pink-200 bg-white px-2.5 py-1.5 text-xs text-[#580e36]"
                  />
                </div>

                {/* 4. Personnel et agents présents */}
                <div>
                  <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
                    Équipe présente aujourd'hui :
                  </label>
                  <input
                    type="text"
                    value={centerUpdateData.staffDescription}
                    onChange={(e) =>
                      setCenterUpdateData({ ...centerUpdateData, staffDescription: e.target.value })
                    }
                    placeholder="Ex: 2 sages-femmes, 1 radiologue en poste"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#ea2d6d] focus:outline-hidden"
                  />
                </div>

                {/* 5. Message audio / Consigne du jour */}
                <div>
                  <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
                    Consigne vocale du jour aux patientes (Français) :
                  </label>
                  <textarea
                    rows={2}
                    value={centerUpdateData.audioMessageFr}
                    onChange={(e) =>
                      setCenterUpdateData({ ...centerUpdateData, audioMessageFr: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#ea2d6d] focus:outline-hidden"
                  />
                </div>

                {/* Bouton de soumission */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-gradient-to-r from-[#580e36] to-[#ea2d6d] py-3 text-xs font-bold text-white shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check size={16} />
                    <span>Enregistrer et publier sur la carte en direct</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL : ORIENTATION & RECOMMANDATION D'URGENCE (DOCTEUR -> CENTRE)   */}
        {/* ==================================================================== */}
        {showOrientationModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:absolute sm:rounded-[36px]"
            onClick={() => {
              setShowOrientationModal(false);
              setGeneratedOrientationCode(null);
            }}
          >
            <div
              className="ph-enter max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-5 text-[#351c2a] shadow-2xl border-2 border-rose-500"
              onClick={(e) => e.stopPropagation()}
            >
              {/* En-tête */}
              <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-rose-700 to-[#ea2d6d] text-white shadow-sm">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#580e36]">
                      Orientation Médicale d'Urgence
                    </h3>
                    <p className="text-[10px] text-rose-600 font-bold">
                      Docteur ➔ Centre de Santé Partenaire
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowOrientationModal(false);
                    setGeneratedOrientationCode(null);
                  }}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              {generatedOrientationCode ? (
                /* ÉCRAN DE CONFIRMATION / REÇU D'ORIENTATION OFFICIEL */
                <div className="mt-4 space-y-3.5 text-xs">
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-white shadow-md">
                      <Check size={26} />
                    </div>
                    <h4 className="ph-display mt-2 text-base font-bold text-emerald-950">
                      Orientation émise avec succès !
                    </h4>
                    <p className="mt-1 text-xs text-emerald-800">
                      Le centre cible a été alerté en priorité.
                    </p>
                    <div className="mt-3 rounded-xl bg-white p-2.5 border border-emerald-300">
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">
                        Code d'Orientation Sécurisé :
                      </span>
                      <span className="font-mono text-base font-extrabold text-[#580e36] tracking-wider select-all">
                        {generatedOrientationCode}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#fdf2f6] p-3 border border-[#fce4ec] space-y-1.5 text-[11px] text-[#580e36]">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Patiente :</span>
                      <span className="font-bold">{orientationForm.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Centre désigné :</span>
                      <span className="font-bold">
                        {centers.find((c) => c.id === Number(orientationForm.targetCenterId))?.shortName || "CMA Schiphra"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Niveau d'urgence :</span>
                      <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                        orientationForm.urgencyLevel === "immediate"
                          ? "bg-rose-600 text-white"
                          : orientationForm.urgencyLevel === "priority"
                          ? "bg-amber-500 text-white"
                          : "bg-blue-600 text-white"
                      }`}>
                        {orientationForm.urgencyLevel === "immediate"
                          ? "🚨 Immédiat (< 24h)"
                          : orientationForm.urgencyLevel === "priority"
                          ? "⚠️ Prioritaire (48h-72h)"
                          : "ℹ️ Routine"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Examens prescrits :</span>
                      <span className="font-bold">{orientationForm.recommendedExam}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const targetCenter = centers.find((c) => c.id === Number(orientationForm.targetCenterId))?.shortName || "CMA Schiphra";
                        const msg = `Bonjour Mme ${orientationForm.patientName}, voici votre fiche d'orientation urgente PagLaafi vers le ${targetCenter}. Code d'urgence : ${generatedOrientationCode}. Présentez-vous directement au centre sans attente.`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition cursor-pointer"
                    >
                      <Share2 size={14} /> WhatsApp Patiente
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(generatedOrientationCode);
                        notify(`Code ${generatedOrientationCode} copié !`);
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-700 transition cursor-pointer"
                    >
                      <Copy size={14} /> Copier le code
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowOrientationModal(false);
                      setGeneratedOrientationCode(null);
                    }}
                    className="w-full rounded-2xl bg-[#ea2d6d] py-2.5 text-xs font-bold text-white shadow hover:bg-[#d81f5c] transition cursor-pointer"
                  >
                    Fermer la fiche
                  </button>
                </div>
              ) : (
                /* FORMULAIRE D'ORIENTATION D'URGENCE */
                <form onSubmit={handleCreatePatientOrientation} className="mt-3.5 space-y-3.5 text-xs">
                  {/* ALERTE CRÉDIBILITÉ MÉDICALE */}
                  <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3 text-rose-950">
                    <p className="font-bold text-xs flex items-center gap-1.5 text-rose-900">
                      <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                      Priorité médicale absolue
                    </p>
                    <p className="text-[11px] text-rose-900/90 mt-1 leading-relaxed">
                      L'orientation médicale permet de court-circuiter les files d'attente habituelles pour faire passer une mammographie ou une échographie en urgence dans un centre équipé.
                    </p>
                  </div>

                  {/* 1. DEGRÉ D'URGENCE AU PREMIER PLAN */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#580e36] mb-1.5">
                      1. Degré d'urgence clinique (Priorité) :
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        {
                          level: "immediate" as const,
                          title: "🚨 Immédiat",
                          sub: "Moins de 24h",
                          activeBg: "bg-rose-600 text-white border-rose-700 ring-2 ring-rose-400",
                        },
                        {
                          level: "priority" as const,
                          title: "⚠️ Prioritaire",
                          sub: "48h à 72h",
                          activeBg: "bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300",
                        },
                        {
                          level: "routine" as const,
                          title: "ℹ️ Routine",
                          sub: "< 15 jours",
                          activeBg: "bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300",
                        },
                      ].map((urg) => (
                        <button
                          key={urg.level}
                          type="button"
                          onClick={() => setOrientationForm({ ...orientationForm, urgencyLevel: urg.level as any })}
                          className={`flex flex-col items-center justify-center rounded-xl p-2 border-2 text-center transition cursor-pointer ${
                            orientationForm.urgencyLevel === urg.level
                              ? urg.activeBg
                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-[11px] font-extrabold">{urg.title}</span>
                          <span className="text-[9.5px] font-bold opacity-90">{urg.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. CENTRE DE SANTÉ CIBLE */}
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
                      2. Centre de santé de destination :
                    </label>
                    <select
                      value={orientationForm.targetCenterId}
                      onChange={(e) =>
                        setOrientationForm({ ...orientationForm, targetCenterId: Number(e.target.value) })
                      }
                      className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs font-semibold text-[#580e36] focus:border-[#ea2d6d] focus:outline-hidden"
                    >
                      {centers.map((c) => (
                        <option key={c.id} value={c.id}>
                          🏥 {c.shortName} — {c.place} ({c.statusLabel})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3. COORDONNÉES PATIENTE */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
                        Nom de la patiente :
                      </label>
                      <input
                        type="text"
                        value={orientationForm.patientName}
                        onChange={(e) =>
                          setOrientationForm({ ...orientationForm, patientName: e.target.value })
                        }
                        placeholder="Ex: K. Fatoumata"
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#ea2d6d] focus:outline-hidden"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
                        Téléphone :
                      </label>
                      <input
                        type="tel"
                        value={orientationForm.patientPhone}
                        onChange={(e) =>
                          setOrientationForm({ ...orientationForm, patientPhone: e.target.value })
                        }
                        placeholder="Ex: 70 88 99 00"
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#ea2d6d] focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  {/* 4. EXAMENS DEMANDÉS */}
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
                      4. Examens prescrits en urgence :
                    </label>
                    <select
                      value={orientationForm.recommendedExam}
                      onChange={(e) =>
                        setOrientationForm({ ...orientationForm, recommendedExam: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs font-semibold text-[#580e36] focus:border-[#ea2d6d] focus:outline-hidden"
                    >
                      <option value="Mammographie numérique bilatérale + Échographie mammaire">
                        Mammographie numérique bilatérale + Échographie mammaire (Pack complet)
                      </option>
                      <option value="Échographie mammaire haute résolution">
                        Échographie mammaire haute résolution isolée
                      </option>
                      <option value="Mammographie numérique de dépistage diagnostique">
                        Mammographie numérique de dépistage diagnostique
                      </option>
                      <option value="Biopsie mammaire / Cytoponction d'urgence">
                        Biopsie mammaire / Cytoponction d'urgence
                      </option>
                    </select>
                  </div>

                  {/* 5. MOTIF CLINIQUE / OBSERVATIONS */}
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#580e36] mb-1">
                      5. Motif clinique & Signes d'appel :
                    </label>
                    <textarea
                      rows={2}
                      value={orientationForm.clinicalObservations}
                      onChange={(e) =>
                        setOrientationForm({ ...orientationForm, clinicalObservations: e.target.value })
                      }
                      placeholder="Ex: Masse rétro-aréolaire droite de 2.5 cm, indolore..."
                      className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#ea2d6d] focus:outline-hidden"
                      required
                    />
                  </div>

                  {/* Bouton de confirmation */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-gradient-to-r from-rose-600 to-[#ea2d6d] py-3 text-xs font-bold text-white shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FileText size={16} />
                      <span>Émettre l'orientation d'urgence vers le centre</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL : INSTALLER L'APPLICATION MOBILE (PWA SMARTPHONE ANDROID & IOS) */}
        {/* ==================================================================== */}
        {showPwaInstallModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]"
            onClick={() => setShowPwaInstallModal(false)}
          >
            <div
              className="ph-enter w-full max-w-sm rounded-[28px] bg-white p-5 text-[#351c2a] shadow-2xl border-2 border-[#ea2d6d]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-tr from-[#6c1543] to-[#ba486e] text-white shadow-sm">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#580e36]">Installer PagLaafi</h3>
                    <p className="text-[10px] text-emerald-700 font-bold">Application Mobile Autonome</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPwaInstallModal(false)}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-3.5 space-y-3 text-xs">
                <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-[#fff8fa] p-3.5 border border-pink-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#863550]">
                    <Sparkles size={14} className="text-amber-500" />
                    <span>Pourquoi installer l'application ?</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-[#6b4757]">
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-emerald-600 shrink-0" />
                      <span><strong>Accès 100% Hors-Ligne</strong> sans consommer vos données internet</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-emerald-600 shrink-0" />
                      <span><strong>Plein écran tactile</strong> sans barre d'adresse de navigateur</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-emerald-600 shrink-0" />
                      <span><strong>Sauvegarde continue</strong> de votre cycle et autopalpation</span>
                    </li>
                  </ul>
                </div>

                {/* Guide selon le système */}
                <div className="rounded-2xl bg-slate-50 p-3 border border-slate-200 space-y-2">
                  <p className="font-bold text-[#580e36] text-[11.5px] flex items-center justify-between">
                    <span>📱 Guide d'installation rapide :</span>
                    <span className="text-[9.5px] font-bold text-slate-500">Android & iOS</span>
                  </p>

                  <div className="space-y-2 text-[10.5px] text-slate-700">
                    <div className="rounded-xl bg-white p-2 border border-slate-200">
                      <span className="font-bold text-[#8a3350] block">🤖 Sur Android (Chrome / Samsung) :</span>
                      <span>Si le bouton ci-dessous ne s'affiche pas, ouvrez le menu <strong>(⋮)</strong> en haut à droite du navigateur puis choisissez <strong>« Installer l'application »</strong> ou « Ajouter à l'écran d'accueil ».</span>
                    </div>

                    <div className="rounded-xl bg-white p-2 border border-slate-200">
                      <span className="font-bold text-[#8a3350] block">🍎 Sur iPhone / iPad (Safari) :</span>
                      <span>1. Touchez le bouton <strong>Partager ⎋</strong> (carré avec flèche en bas d'écran).<br />2. Faites défiler et touchez <strong>« Sur l'écran d'accueil » ➕</strong>.<br />3. Validez avec <strong>« Ajouter »</strong>.</span>
                    </div>
                  </div>
                </div>

                {deferredPrompt ? (
                  <button
                    onClick={handleTriggerInstall}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#ea2d6d] to-[#580e36] py-3 text-xs font-bold text-white shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2"
                  >
                    <Download size={15} />
                    <span>Installer maintenant en 1-clic</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowPwaInstallModal(false)}
                    className="w-full rounded-2xl bg-[#ea2d6d] py-2.5 text-xs font-bold text-white shadow hover:bg-[#8d3754] transition"
                  >
                    J'ai compris ✓
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL : PARAMÈTRES DE CONFIDENTIALITÉ & ÉTHIQUE DES DONNÉES           */}
        {/* ==================================================================== */}
        {showPrivacyModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:absolute sm:rounded-[36px]"
            onClick={() => setShowPrivacyModal(false)}
          >
            <div
              className="ph-enter max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl border border-[#ecd5df]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* En-tête du modal */}
              <div className="flex items-center justify-between border-b border-[#f2e1e7] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#580e36]">
                      Confidentialité & Données
                    </h3>
                    <p className="text-[10px] text-emerald-700 font-bold">
                      Zero Tracking · Local-First · Éthique Médicale
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="rounded-full p-1.5 text-[#725261] hover:bg-[#faedf2]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Contenu */}
              <div className="mt-3 space-y-3.5 text-xs">
                {/* Cartouche d'explication pédagogique */}
                <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-3.5 text-[#20432f] space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900">
                    <Shield size={14} className="text-emerald-700" />
                    <span>Nos engagements éthiques stricts</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] leading-relaxed text-[#2c523c]">
                    <li className="flex items-start gap-1.5">
                      <Check size={13} className="shrink-0 text-emerald-600 mt-0.5" />
                      <span><strong>Aucune donnée personnelle n'est collectée</strong> par l'application sans votre demande expresse. Vos règles et notes restent 100% sur votre téléphone.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={13} className="shrink-0 text-emerald-600 mt-0.5" />
                      <span><strong>Entraînement de Rose IA</strong> : Seules les recommandations certifiées par les <strong>docteurs, sages-femmes et associations</strong> alimentent l'IA pour la rendre naturelle, empathique et culturellement adaptée (Français, Mooré, Dioula).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={13} className="shrink-0 text-emerald-600 mt-0.5" />
                      <span><strong>Partage médical sur demande uniquement</strong> : En cas de nodule suspect ou d'urgence, vous choisissez explicitement si vous transmettez votre fiche à un centre.</span>
                    </li>
                  </ul>
                </div>

                {/* Paramètres interactifs / Toggles */}
                <div className="space-y-2.5">
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#7a4c60]">
                    Vos réglages de confidentialité
                  </p>

                  {/* Toggle 1 : Stockage 100% Local */}
                  <label className="flex items-center justify-between rounded-xl border border-[#edd7e1] bg-[#fffcfd] p-3 cursor-pointer hover:bg-pink-50/50 transition">
                    <div className="pr-2">
                      <span className="font-bold text-[#580e36] text-xs block">
                        Stockage 100% Local (Cycle & Calendrier)
                      </span>
                      <span className="text-[10px] text-[#785968] leading-tight block mt-0.5">
                        Vos dates de règles et autopalpations restent enregistrées uniquement dans la mémoire de cet appareil.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.localOnlyCycle}
                      onChange={(e) =>
                        setPrivacySettings({ ...privacySettings, localOnlyCycle: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-[#ea2d6d] focus:ring-[#ea2d6d]"
                    />
                  </label>

                  {/* Toggle 2 : Protocoles cliniques IA */}
                  <label className="flex items-center justify-between rounded-xl border border-[#edd7e1] bg-[#fffcfd] p-3 cursor-pointer hover:bg-pink-50/50 transition">
                    <div className="pr-2">
                      <span className="font-bold text-[#580e36] text-xs block">
                        Entraînement de Rose IA par les soignants
                      </span>
                      <span className="text-[10px] text-[#785968] leading-tight block mt-0.5">
                        Permet de recevoir les protocoles médicaux validés par les médecins du Burkina Faso pour des réponses naturelles.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.contributeAiClinical}
                      onChange={(e) =>
                        setPrivacySettings({ ...privacySettings, contributeAiClinical: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-[#ea2d6d] focus:ring-[#ea2d6d]"
                    />
                  </label>

                  {/* Toggle 3 : Soutien aux associations */}
                  <label className="flex items-center justify-between rounded-xl border border-[#edd7e1] bg-[#fffcfd] p-3 cursor-pointer hover:bg-pink-50/50 transition">
                    <div className="pr-2">
                      <span className="font-bold text-[#580e36] text-xs block">
                        Statistiques anonymisées pour les Associations
                      </span>
                      <span className="text-[10px] text-[#785968] leading-tight block mt-0.5">
                        Aide les ONG (ex: ABAC, Espoir pour Demain) à cibler les campagnes de dépistage selon la fréquentation régionale.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.anonymizedAssociationData}
                      onChange={(e) =>
                        setPrivacySettings({ ...privacySettings, anonymizedAssociationData: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-[#ea2d6d] focus:ring-[#ea2d6d]"
                    />
                  </label>

                  {/* Toggle 4 : Partage clinique uniquement sur demande */}
                  <label className="flex items-center justify-between rounded-xl border border-[#edd7e1] bg-[#fffcfd] p-3 cursor-pointer hover:bg-pink-50/50 transition">
                    <div className="pr-2">
                      <span className="font-bold text-[#580e36] text-xs block">
                        Transmission médicale sur demande expresse
                      </span>
                      <span className="text-[10px] text-[#785968] leading-tight block mt-0.5">
                        Exiger une confirmation par code PIN ou clic avant d'adresser une fiche d'orientation à un médecin référent.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.urgentClinicalConsent}
                      onChange={(e) =>
                        setPrivacySettings({ ...privacySettings, urgentClinicalConsent: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-[#ea2d6d] focus:ring-[#ea2d6d]"
                    />
                  </label>
                </div>

                {/* Section Droit à l'oubli / Purge */}
                <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                      <ShieldAlert size={14} className="text-rose-700" /> Droit à l'oubli immédiat
                    </span>
                    <span className="text-[9.5px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                      RGPD & Éthique
                    </span>
                  </div>
                  <p className="text-[10.5px] text-rose-800 leading-snug">
                    Vous pouvez à tout moment effacer instantanément l'ensemble de votre historique, vos rappels et vos messages stockés sur ce téléphone.
                  </p>
                  <button
                    onClick={handleClearAllLocalData}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white border border-rose-300 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-xs"
                  >
                    <RotateCcw size={13} /> Purger toutes mes données locales
                  </button>
                </div>

                {/* Bouton de sauvegarde */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setShowPrivacyModal(false)}
                    className="flex-1 rounded-2xl border border-[#debcc8] py-2.5 font-bold text-[#6d4d5d]"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={handleSavePrivacySettings}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 py-2.5 font-bold text-white shadow-md hover:from-emerald-500 hover:to-teal-600 transition"
                  >
                    Enregistrer mes choix
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL : SIMULATION DU PARCOURS D'ENTRAÎNEMENT DE ROSE IA PAR LE DOCTEUR */}
        {/* ==================================================================== */}
        {showDoctorTrainModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:absolute sm:rounded-[36px]"
            onClick={() => setShowDoctorTrainModal(false)}
          >
            <div
              className="ph-enter max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl border border-[#ecd5df]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* En-tête */}
              <div className="flex items-center justify-between border-b border-[#f2e1e7] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-800">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#580e36]">
                      Entraînement Clinique Rose IA
                    </h3>
                    <p className="text-[10px] text-amber-800 font-bold">
                      Parcours Soignant · Étape {doctorTrainStep}/4
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDoctorTrainModal(false)}
                  className="rounded-full p-1.5 text-[#725261] hover:bg-[#faedf2]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Indicateur visuel d'étapes (1 -> 2 -> 3 -> 4) */}
              <div className="mt-3 flex items-center justify-between px-1">
                {[
                  { step: 1, label: "Thème" },
                  { step: 2, label: "Protocole" },
                  { step: 3, label: "Simulation" },
                  { step: 4, label: "Signature" },
                ].map((item) => (
                  <div key={item.step} className="flex flex-col items-center flex-1">
                    <div
                      className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold transition ${
                        doctorTrainStep === item.step
                          ? "bg-amber-500 text-white shadow-md ring-2 ring-amber-300"
                          : doctorTrainStep > item.step
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {doctorTrainStep > item.step ? <Check size={13} /> : item.step}
                    </div>
                    <span
                      className={`text-[9px] font-semibold mt-1 ${
                        doctorTrainStep === item.step ? "text-amber-800 font-bold" : "text-gray-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* ÉTAPE 1 : Choix ou Saisie du Thème Clinique */}
              {doctorTrainStep === 1 && (
                <div className="mt-4 space-y-3 text-xs">
                  <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-3 text-amber-950">
                    <p className="font-bold text-xs flex items-center gap-1.5 text-amber-900">
                      <Stethoscope size={14} /> Objectif de la simulation
                    </p>
                    <p className="text-[11px] text-amber-900/90 mt-1 leading-relaxed">
                      En tant que docteur, sage-femme ou agent de santé, vous enrichissez la base de connaissances de Rose IA avec vos protocoles cliniques locaux. Choisissez un cas concret :
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#7a4c60]">
                      Cas cliniques & Recommandations présélectionnées :
                    </p>

                    {/* Presets de thèmes */}
                    <button
                      type="button"
                      onClick={() =>
                        handleSelectDoctorPresetTopic(
                          "Permanence urgences mammaires & Nodule suspect",
                          "Pour toute patiente présentant un nodule dur et indolore, accueil sans rendez-vous tous les matins au service d'imagerie. Mammographie et échographie sous 48h.",
                          "Ma sœur, rassure-toi : un nodule n'est pas forcément grave, mais ton corps mérite toute notre attention. Viens directement sans rendez-vous au CMA Schiphra ou CHU Bogodogo dès demain matin à 08h. Une sage-femme et un radiologue vont t'examiner avec douceur.",
                          "M maaso, da zoe rabeem ye: bõn-kʋdga pa bãag fãa ye, la yaa tɩlae tɩ d ges-a tao-tao. Wa-y zĩigẽ zaabre n mik dɔgɔtɔrã tɩ b ges yãmba ne laafi.",
                          "N ma muso, kana siran : fɛn o fɛn bɛ sin na, a bɛɛ tɛ bana juguman ye. Nka taga kɛnɛyaso la jona sɔgɔma fɛ walasa dɔgɔtɔrɔmuso ka lajɛ saniya kɛ.",
                          "J'ai senti une boule un peu dure dans mon sein droit qui ne me fait pas mal, est-ce que je dois m'inquiéter ?"
                        )
                      }
                      className="w-full text-left p-3 rounded-2xl border border-pink-200 bg-[#fffbfc] hover:bg-pink-50 transition space-y-1 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#8a2d4f] text-xs">🩺 Nodule suspect & Urgences mammaires</span>
                        <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">Priorité 48h</span>
                      </div>
                      <p className="text-[10.5px] text-[#6b4c5b]">
                        Accueil direct sans rendez-vous au CMA Schiphra ou CHU Bogodogo + protocole rassurant.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleSelectDoctorPresetTopic(
                          "Douleurs de règles aiguës & Endométriose",
                          "Des règles très douloureuses incapacitantes ne sont pas normales. Exclure l'endométriose par échographie pelvienne dédiée. Éviter l'automédication prolongée aux anti-inflammatoires.",
                          "Chère sœur, souffrir pendant ses règles n'est pas une fatalité. Si la douleur t'empêche de travailler ou dormir, ce n'est pas une faiblesse. Consulte un gynécologue pour rechercher une endométriose. En attendant, privilégie une bouillotte tiède et l'infusion de gingembre doux.",
                          "M yaanga, rog-n-mik bãag sã n namsd foo wakat fãa, pa yel-bãanega ye. Taga dɔgɔtɔr n bãng a võore.",
                          "N ba den muso, dimi min bɛ kɛ muso kɔnɔ fɛ kalo o kalo, ni a ka bon kosɛbɛ, a tɛ foyi ye fo ka dɔgɔtɔrɔ sɔrɔ.",
                          "Mes règles me font tellement mal que je ne peux pas me lever du lit, ma mère me dit que c'est normal pour une femme ?"
                        )
                      }
                      className="w-full text-left p-3 rounded-2xl border border-pink-200 bg-[#fffbfc] hover:bg-pink-50 transition space-y-1 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#8a2d4f] text-xs">🌸 Règles douloureuses & Endométriose</span>
                        <span className="text-[9px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">Santé globale</span>
                      </div>
                      <p className="text-[10.5px] text-[#6b4c5b]">
                        Démystification de la souffrance des règles + orientation gynécologique pelvienne.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleSelectDoctorPresetTopic(
                          "Nutrition sahélienne fortifiante & Immunité",
                          "Recommander l'apport en antioxydants locaux : feuilles de moringa (en poudre dans la sauce), jus de pain de singe (baobab riche en vitamine C) et graines de sésame pour l'équilibre hormonal.",
                          "Pour prendre soin de ta santé et de ta vitalité au Burkina Faso, nos plantes sont des trésors : une cuillère de moringa dans ton repas et du jus de baobab naturel renforcent tes défenses sans aucun produit chimique nocif.",
                          "D tɩɩsã ne d rɩɩbã yaa arzɛka : arzɛk-tɩɩga (moringa) la toedga n kõt yĩns-laafi wʋsgo.",
                          "An ka siriw ni jiriw bɛ fanga di : arjanayiri (moringa) ni zira ji bɛ muso fanga gɛlɛya kosɛbɛ.",
                          "Quels aliments locaux du pays puis-je consommer pour renforcer mon corps et mes seins ?"
                        )
                      }
                      className="w-full text-left p-3 rounded-2xl border border-pink-200 bg-[#fffbfc] hover:bg-pink-50 transition space-y-1 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#8a2d4f] text-xs">🌿 Nutrition locale (Moringa & Baobab)</span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Prévention</span>
                      </div>
                      <p className="text-[10.5px] text-[#6b4c5b]">
                        Conseils nutritionnels sahéliens bienveillants intégrés naturellement par Rose IA.
                      </p>
                    </button>
                  </div>

                  {/* Saisie personnalisée */}
                  <div className="pt-2 border-t border-gray-100">
                    <label className="block text-[11px] font-bold text-[#580e36] mb-1">
                      Ou définissez un autre thème médical :
                    </label>
                    <input
                      type="text"
                      value={doctorTeachTopic}
                      onChange={(e) => setDoctorTeachTopic(e.target.value)}
                      placeholder="Ex : Palpation axillaire, Allaitement et crevasses..."
                      className="w-full rounded-xl border border-gray-300 p-2 text-xs font-semibold text-[#580e36]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setDoctorTrainStep(2)}
                    className="w-full rounded-2xl bg-amber-500 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-600 transition"
                  >
                    Passer à la formulation médicale (Étape 2) →
                  </button>
                </div>
              )}

              {/* ÉTAPE 2 : Saisie du Protocole Clinique & Reformulation Multilingue */}
              {doctorTrainStep === 2 && (
                <div className="mt-4 space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-[#580e36] mb-1">
                      Thème clinique sélectionné :
                    </label>
                    <input
                      type="text"
                      value={doctorTeachTopic}
                      onChange={(e) => setDoctorTeachTopic(e.target.value)}
                      className="w-full rounded-xl border border-amber-300 bg-amber-50/50 p-2 text-xs font-bold text-amber-950"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#580e36] mb-1">
                      Recommandation clinique stricte du praticien :
                    </label>
                    <textarea
                      rows={3}
                      value={doctorTeachContent}
                      onChange={(e) => setDoctorTeachContent(e.target.value)}
                      placeholder="Consignes médicales précises, bilans recommandés, centres d'orientation..."
                      className="w-full rounded-xl border border-gray-300 p-2 text-xs text-[#580e36]"
                    />
                  </div>

                  {/* Vulgarisation empathique multilingue générée pour Rose IA */}
                  <div className="rounded-2xl border border-pink-200 bg-[#fff9fb] p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#8a2d4f] flex items-center gap-1.5">
                        <Sparkles size={14} className="text-amber-500" /> Adaptation Empathique Rose IA
                      </span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        3 Langues
                      </span>
                    </div>

                    <p className="text-[10px] text-[#785968] leading-tight">
                      Rose IA convertit le jargon médical en parole douce, sans tabou et respectueuse des pudeurs sahéliennes :
                    </p>

                    {/* Français */}
                    <div className="rounded-xl bg-white p-2.5 border border-pink-100 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#ea2d6d]">
                        <span>🇫🇷 En Français facile :</span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(doctorEmpathicReformulation.fr, "fr")}
                          className="flex items-center gap-1 text-[9.5px] text-[#ea2d6d] hover:underline"
                        >
                          <Volume2 size={12} /> Écouter
                        </button>
                      </div>
                      <p className="text-[#580e36] leading-relaxed">{doctorEmpathicReformulation.fr}</p>
                    </div>

                    {/* Mooré */}
                    <div className="rounded-xl bg-white p-2.5 border border-pink-100 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-emerald-700">
                        <span>🇧🇫 En Mooré (Traduction bienveillante) :</span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(doctorEmpathicReformulation.moore, "moore")}
                          className="flex items-center gap-1 text-[9.5px] text-emerald-700 hover:underline"
                        >
                          <Volume2 size={12} /> Écouter
                        </button>
                      </div>
                      <p className="text-[#334e3e] italic leading-relaxed">{doctorEmpathicReformulation.moore}</p>
                    </div>

                    {/* Dioula */}
                    <div className="rounded-xl bg-white p-2.5 border border-pink-100 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-purple-700">
                        <span>🇧🇫 En Dioula (Traduction bienveillante) :</span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(doctorEmpathicReformulation.dioula, "dioula")}
                          className="flex items-center gap-1 text-[9.5px] text-purple-700 hover:underline"
                        >
                          <Volume2 size={12} /> Écouter
                        </button>
                      </div>
                      <p className="text-[#402e48] italic leading-relaxed">{doctorEmpathicReformulation.dioula}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDoctorTrainStep(1)}
                      className="rounded-2xl border border-gray-300 px-4 py-2.5 font-bold text-gray-700"
                    >
                      ← Retour
                    </button>
                    <button
                      type="button"
                      onClick={handleRunDoctorTestSimulation}
                      className="flex-1 rounded-2xl bg-amber-500 py-2.5 font-bold text-white shadow-md hover:bg-amber-600 transition"
                    >
                      Lancer la simulation en direct (Étape 3) →
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 3 : Test en Direct Patiente ↔ Rose IA */}
              {doctorTrainStep === 3 && (
                <div className="mt-4 space-y-3.5 text-xs">
                  <div className="rounded-2xl bg-slate-900 text-white p-3.5 shadow-md space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={13} /> Banc d'essai en direct
                      </span>
                      <span className="text-[9.5px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono">
                        Mode Simulation
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Vérifions comment Rose IA répond à une question posée spontanément par une femme :
                    </p>
                  </div>

                  {/* Bulle Question de la Patiente */}
                  <div className="rounded-2xl bg-purple-50 border border-purple-200 p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-purple-900 flex items-center gap-1">
                        👩 Patiente (Question posée) :
                      </span>
                      <span className="text-[9px] text-purple-600">Voix ou Texte</span>
                    </div>
                    <textarea
                      rows={2}
                      value={doctorTestQuestion}
                      onChange={(e) => setDoctorTestQuestion(e.target.value)}
                      className="w-full rounded-xl border border-purple-200 bg-white p-2 text-xs font-semibold text-purple-950"
                    />
                  </div>

                  {/* Bouton pour déclencher la réponse */}
                  {!doctorTestAnswer && (
                    <button
                      type="button"
                      onClick={() =>
                        setDoctorTestAnswer(
                          doctorEmpathicReformulation.fr ||
                            "Ma sœur, rassure-toi. Suite aux recommandations de nos docteurs référents..."
                        )
                      }
                      className="w-full rounded-2xl bg-gradient-to-r from-[#ea2d6d] to-[#734059] py-2.5 font-bold text-white shadow hover:opacity-95 transition flex items-center justify-center gap-2"
                    >
                      <Sparkles size={15} /> Voir la réponse générée par Rose IA
                    </button>
                  )}

                  {/* Bulle Réponse Rose IA */}
                  {doctorTestAnswer && (
                    <div className="rounded-2xl bg-gradient-to-br from-[#fff7fa] to-[#fff0f4] border-2 border-emerald-300 p-3.5 space-y-2 ph-enter">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#8a2d4f] flex items-center gap-1.5">
                          <Sparkles size={14} className="text-amber-500" /> Rose IA (Réponse avec protocole docteur) :
                        </span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(doctorTestAnswer, "fr")}
                          className="flex items-center gap-1 text-[10px] font-bold text-[#ea2d6d] bg-pink-100 px-2 py-0.5 rounded-full hover:bg-pink-200"
                        >
                          <Volume2 size={13} /> Écouter
                        </button>
                      </div>

                      <p className="text-xs text-[#580e36] leading-relaxed">
                        {doctorTestAnswer}
                      </p>

                      <div className="flex items-center gap-1.5 text-[9.5px] text-emerald-800 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        <span>Protocole respecté à 100% : Empathie locale + Orientation sans délai.</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDoctorTrainStep(2)}
                      className="rounded-2xl border border-gray-300 px-4 py-2.5 font-bold text-gray-700"
                    >
                      ← Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => setDoctorTrainStep(4)}
                      className="flex-1 rounded-2xl bg-amber-500 py-2.5 font-bold text-white shadow-md hover:bg-amber-600 transition"
                    >
                      Valider et passer à la signature (Étape 4) →
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 4 : Signature Officielle & Ingestion dans Rose IA */}
              {doctorTrainStep === 4 && (
                <div className="mt-4 space-y-3.5 text-xs">
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-3.5 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-200 text-emerald-800 font-bold">
                        <CheckCheck size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-950 text-xs">Prêt pour signature médicale</h4>
                        <p className="text-[10px] text-emerald-800 font-semibold">
                          Attestation de conformité déontologique & éthique
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-white p-2.5 border border-emerald-200 text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Sujet validé :</span>
                        <span className="font-bold text-[#580e36] truncate max-w-[200px]">{doctorTeachTopic}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Langues certifiées :</span>
                        <span className="font-bold text-emerald-700">Français · Mooré · Dioula</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date d'effet :</span>
                        <span className="font-bold text-gray-800">Immédiate (16 Octobre 2026)</span>
                      </div>
                    </div>
                  </div>

                  {/* Champs de signature du médecin */}
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#580e36] mb-1">
                        Nom et Prénom du praticien référent :
                      </label>
                      <input
                        type="text"
                        value={doctorSignName}
                        onChange={(e) => setDoctorSignName(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 p-2 text-xs font-bold text-[#580e36]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#580e36] mb-1">
                        Titre clinique & Hôpital d'exercice :
                      </label>
                      <input
                        type="text"
                        value={doctorSignRole}
                        onChange={(e) => setDoctorSignRole(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 p-2 text-xs font-semibold text-[#580e36]"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-[10px] text-slate-600 space-y-1">
                    <p className="font-bold text-slate-800 flex items-center gap-1">
                      <Lock size={12} className="text-slate-500" /> Engagement déontologique :
                    </p>
                    <p className="leading-tight">
                      En signant, vous attestez que ces instructions médicales et leurs vulgarisations ont été vérifiées et ne violent aucun secret médical. Aucune donnée privée de patiente n'est ingérée.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDoctorTrainStep(3)}
                      className="rounded-2xl border border-gray-300 px-4 py-2.5 font-bold text-gray-700"
                    >
                      ← Revoir test
                    </button>
                    <button
                      type="button"
                      onClick={handleFinalizeDoctorTraining}
                      className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 py-3 text-xs font-bold text-white shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={16} /> Signer & Intégrer dans Rose IA
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL : VIDÉO DÉMONSTRATIVE D'AUTOPALPATION AVEC SAGE-FEMME AFRICAINE */}
        {/* ==================================================================== */}
        {showAutopalpationVideoModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-md sm:absolute sm:rounded-[36px]"
            onClick={() => setShowAutopalpationVideoModal(false)}
          >
            <div
              className="ph-enter max-h-[94vh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-4 shadow-2xl border-2 border-pink-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* En-tête du lecteur vidéo */}
              <div className="flex items-center justify-between border-b border-[#f2e1e7] pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-rose-100 text-[#ea2d6d]">
                    <Play size={16} className="fill-[#ea2d6d] translate-x-0.5" />
                  </div>
                  <div>
                    <h3 className="ph-display text-sm font-bold text-[#580e36]">
                      Vidéo Guidée d'Autopalpation
                    </h3>
                    <p className="text-[10px] text-emerald-700 font-bold">
                      Démonstration Pédagogique & Pudique · Sage-femme Africaine
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAutopalpationVideoModal(false)}
                  className="rounded-full p-1 text-[#725261] hover:bg-[#faedf2]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* ÉCRAN VIDÉO INTERACTIF AVEC PERSONNAGE AFRICAIN */}
              <div className="relative mt-3 overflow-hidden rounded-2xl bg-black shadow-md border border-slate-800 group">
                <img
                  src="/images/autopalpation-afrique-demo.jpg"
                  alt="Démonstration autopalpation sage-femme africaine"
                  className="aspect-[16/9] w-full object-cover opacity-95"
                />

                {/* Badge en direct */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[9.5px] font-bold text-white backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>Vidéo Démo Burkina · 4 gestes clés</span>
                </div>

                {/* Sélecteur de langue audio pour la vidéo */}
                <div className="absolute top-2.5 right-2.5 flex rounded-full bg-black/60 p-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
                  {(["fr", "moore", "dioula"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setVideoLang(lang);
                        const txt =
                          lang === "moore"
                            ? "M maaso, ges-y zĩig ninga ninsaal sẽn tõe n kẽes a nug n bãng a yĩnsa laafi ne zãmsgã."
                            : lang === "dioula"
                              ? "N muso, i sin lajɛ saniya kɛ dɔgɔtɔrɔmusow ka cogo la."
                              : "Observez et palpez avec délicatesse chaque mois après vos règles. Suivez les 4 gestes démontrés par notre sage-femme.";
                        handlePlayAudio(txt, lang);
                      }}
                      className={`rounded-full px-2 py-0.5 transition ${
                        videoLang === lang ? "bg-[#ea2d6d] text-white" : "text-white/75 hover:text-white"
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Bouton Play/Pause central sur la vidéo avec feedback instantané */}
                <button
                  type="button"
                  onClick={() => setVideoIsPlaying(!videoIsPlaying)}
                  className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/35 transition"
                  aria-label={videoIsPlaying ? "Mettre la vidéo en pause" : "Lancer la démonstration vidéo"}
                >
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-[#ea2d6d]/95 text-white shadow-xl hover:scale-105 active:scale-95 transition">
                    {videoIsPlaying ? (
                      <Pause size={24} className="fill-white" />
                    ) : (
                      <Play size={24} className="fill-white translate-x-0.5" />
                    )}
                  </div>
                </button>

                {/* Barre de contrôles vidéo en bas : Progression continue et accélérateur */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2.5 text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 min-w-[36px]">
                      {formatVideoTime(videoProgressSeconds)}
                    </span>
                    <div
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickPos = (e.clientX - rect.left) / rect.width;
                        const newTime = Math.max(0, Math.min(165, clickPos * 165));
                        setVideoProgressSeconds(newTime);
                        setVideoIsPlaying(true);
                      }}
                      className="relative h-2 flex-1 rounded-full bg-white/30 overflow-hidden cursor-pointer"
                      title="Cliquer pour naviguer dans la vidéo"
                    >
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-[#ea2d6d] rounded-full transition-all duration-150"
                        style={{ width: `${Math.min(100, (videoProgressSeconds / 165) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-white/70">02:45</span>

                    {/* Sélecteur de vitesse pour jouer plus rapidement */}
                    <div className="flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-bold border border-white/20">
                      {([1, 1.5, 2] as const).map((spd) => (
                        <button
                          key={spd}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setVideoSpeed(spd);
                            setVideoIsPlaying(true);
                          }}
                          className={`rounded px-1.5 py-0.5 transition ${
                            videoSpeed === spd
                              ? "bg-[#ea2d6d] text-white font-extrabold"
                              : "text-white/75 hover:text-white"
                          }`}
                          title={`Vitesse de lecture x${spd}`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SÉLECTEUR INTERACTIF DES 4 GESTES : SAUT TEMPOREL INSTANTANÉ */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#7a4c60]">
                    Les 4 temps expliqués pas à pas :
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const txt =
                        videoLang === "moore"
                          ? "M maaso, ges-y zĩig ninga ninsaal sẽn tõe n kẽes a nug n bãng a yĩnsa laafi."
                          : videoLang === "dioula"
                            ? "N muso, i sin lajɛ saniya kɛ dɔgɔtɔrɔmusow ka cogo la."
                            : "Voici l'explication audio détaillée des gestes d'autopalpation par notre soignante.";
                      handlePlayAudio(txt, videoLang);
                    }}
                    className="flex items-center gap-1 text-[10px] font-bold text-[#ea2d6d] hover:underline"
                  >
                    <Volume2 size={12} /> Écouter la sage-femme ({videoLang.toUpperCase()})
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-1">
                  {[
                    { step: 1, label: "1. Regarder", tag: "Miroir", time: 0 },
                    { step: 2, label: "2. Palper", tag: "3 doigts", time: 35 },
                    { step: 3, label: "3. Aisselle", tag: "Zone large", time: 75 },
                    { step: 4, label: "4. Mamelon", tag: "Pression", time: 115 },
                  ].map((item) => (
                    <button
                      key={item.step}
                      type="button"
                      onClick={() => {
                        setSelectedVideoStep(item.step as any);
                        setVideoProgressSeconds(item.time);
                        setVideoIsPlaying(true);
                      }}
                      className={`rounded-xl p-1.5 text-center transition border ${
                        selectedVideoStep === item.step
                          ? "bg-[#ea2d6d] text-white border-[#ea2d6d] shadow-xs scale-[1.02]"
                          : "bg-slate-50 text-[#543343] border-slate-200 hover:bg-pink-50"
                      }`}
                    >
                      <span className="block font-bold text-[10.5px]">{item.label}</span>
                      <span className="block text-[8.5px] opacity-80">{item.tag}</span>
                    </button>
                  ))}
                </div>

                {/* Explication du geste sélectionné */}
                <div className="rounded-2xl border border-pink-200 bg-[#fffbfc] p-3 text-xs text-[#580e36] space-y-1.5 shadow-2xs">
                  {selectedVideoStep === 1 && (
                    <>
                      <div className="flex items-center justify-between font-bold text-[#ea2d6d]">
                        <span>Étape 1 : Inspection visuelle devant le miroir</span>
                        <span className="text-[9px] bg-pink-100 px-2 py-0.5 rounded-full font-bold">LOOK</span>
                      </div>
                      <p className="text-[11px] text-[#6d4f5e] leading-relaxed">
                        Debout devant votre miroir, bras le long du corps puis levés au-dessus de la tête. Observez l'aspect général des deux seins : peau d'orange, rougeur, fossette ou mamelon qui se rétracte vers l'intérieur.
                      </p>
                    </>
                  )}
                  {selectedVideoStep === 2 && (
                    <>
                      <div className="flex items-center justify-between font-bold text-[#ea2d6d]">
                        <span>Étape 2 : Palpation douce avec la pulpe de 3 doigts</span>
                        <span className="text-[9px] bg-pink-100 px-2 py-0.5 rounded-full font-bold">FEEL</span>
                      </div>
                      <p className="text-[11px] text-[#6d4f5e] leading-relaxed">
                        Allongée confortablement ou sous la douche (avec du savon doux). Utilisez la pulpe des 3 doigts du milieu (index, majeur, annulaire) à plat. Décrivez de petits cercles réguliers du pourtour extérieur vers le mamelon.
                      </p>
                    </>
                  )}
                  {selectedVideoStep === 3 && (
                    <>
                      <div className="flex items-center justify-between font-bold text-[#ea2d6d]">
                        <span>Étape 3 : Couvrir toute la zone jusqu'aux aisselles</span>
                        <span className="text-[9px] bg-pink-100 px-2 py-0.5 rounded-full font-bold">COVER ALL</span>
                      </div>
                      <p className="text-[11px] text-[#6d4f5e] leading-relaxed">
                        Le tissu mammaire s'étend jusqu'au creux de l'aisselle et sous la clavicule. Palpez soigneusement cette zone pour vérifier l'absence de ganglion dur ou de nodule profond.
                      </p>
                    </>
                  )}
                  {selectedVideoStep === 4 && (
                    <>
                      <div className="flex items-center justify-between font-bold text-[#ea2d6d]">
                        <span>Étape 4 : Vérification du mamelon sans douleur</span>
                        <span className="text-[9px] bg-pink-100 px-2 py-0.5 rounded-full font-bold">NIPPLE CHECK</span>
                      </div>
                      <p className="text-[11px] text-[#6d4f5e] leading-relaxed">
                        Pincez très délicatement le mamelon entre le pouce et l'index. Vérifiez qu'aucun liquide (clair, jaunâtre ou sanglant) ne s'écoule spontanément.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Bouton de confirmation & fermeture */}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAutopalpationVideoModal(false)}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-[#ea2d6d] to-[#734059] py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition"
                >
                  J'ai compris les gestes ✓
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL : AFFICHE D'ÉVÉNEMENT EN GRAND FORMAT ZOOMÉ                    */}
        {/* ==================================================================== */}
        {selectedPosterModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:absolute sm:rounded-[36px]"
            onClick={() => setSelectedPosterModal(null)}
          >
            <div
              className="ph-enter max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-[28px] bg-slate-950 p-4 text-white shadow-2xl border border-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="min-w-0 pr-2">
                  <h3 className="ph-display text-sm font-bold text-white truncate">
                    {selectedPosterModal.title}
                  </h3>
                  <p className="text-[10px] text-pink-400 font-bold truncate">
                    {selectedPosterModal.author}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPosterModal(null)}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-3 overflow-hidden rounded-2xl border border-slate-800 bg-black">
                <img
                  src={selectedPosterModal.url}
                  alt={selectedPosterModal.title}
                  className="w-full object-contain max-h-[65vh] mx-auto"
                />
              </div>

              {selectedPosterModal.caption && (
                <p className="mt-2 text-center text-[10.5px] text-slate-300 italic">
                  {selectedPosterModal.caption}
                </p>
              )}

              <button
                type="button"
                onClick={() => setSelectedPosterModal(null)}
                className="mt-3 w-full rounded-2xl bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition"
              >
                Fermer l'affiche
              </button>
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
