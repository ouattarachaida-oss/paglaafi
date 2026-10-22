/**
 * ============================================================================
 * TYPES DE L'APPLICATION PAGLAAFI V2
 * ============================================================================
 */

export type Section =
  | "Accueil"
  | "Prevention"
  | "RoseIA"
  | "Centres"
  | "Profil"
  // Sections secondaires navigables
  | "Dons"
  | "Accompagnant"
  | "Annonces"
  | "Calendrier";

export type UserRole = "user" | "doctor" | "center" | "association" | "superadmin";

export interface UserProfile {
  nom: string;
  prenom: string;
  telephone: string;
  role: UserRole;
  roleLabel: string;
  structureName?: string;
  speciality?: string;
}

export type CenterStatus = "available" | "busy" | "maintenance" | "outdated";

export interface ExamPrice {
  name: string;
  price: number; // en FCFA (0 = gratuit)
  free: boolean;
  notes?: string;
}

export interface HealthCenter {
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

export interface PartnerAnnouncement {
  id: number;
  title: string;
  author: string;
  authorType: "Association" | "Partenaire Santé" | "Hôpital" | "Veille Web Rose IA";
  city: string;
  date: string;
  month: string;
  badge: string;
  badgeColor: string;
  content: string;
  contact: string;
  likes: number;
  status: "pending_validation" | "approved" | "rejected";
  submittedBy?: string;
  submittedAt?: string;
  isRoseAIDetected?: boolean;
  sourceWebUrl?: string;
  aiConfidence?: string;
  imageUrl?: string;
  imageCaption?: string;
}

export interface PartnerAssociation {
  id: number;
  name: string;
  acronym: string;
  mission: string;
  city: string;
  verified: boolean;
  beneficiariesCount: string;
}

export interface RoseDailyTip {
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

export interface EducationalLesson {
  id: number;
  title: string;
  category: string;
  duration: string;
  summary: string;
  englishSummary: string;
  fullText: string;
  englishFullText: string;
  mooreSummary: string;
  dioulaSummary: string;
}

export interface RoseChatMessage {
  id: string;
  sender: "user" | "rose";
  text: string;
  time: string;
  englishText?: string;
  mooreText?: string;
  dioulaText?: string;
}

export interface ReminderItem {
  id: number;
  title: string;
  date: string;
  type: "screening" | "appointment" | "self_exam";
  active: boolean;
}

export interface CycleData {
  lastPeriodDate: string;
  cycleLength: number;
  periodDuration: number;
  lastSelfExamDone: boolean;
}
