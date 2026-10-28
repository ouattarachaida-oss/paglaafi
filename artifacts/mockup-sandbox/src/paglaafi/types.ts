/**
 * Types partagés de l'application PagLaafi.
 */

/**
 * Audios pré-enregistrés pour les langues locales.
 *
 * URL de fichiers MP3 pré-générés puis validés par des locuteurs, destinés à
 * remplacer la synthèse vocale du navigateur (qui ne sait pas prononcer le
 * Mooré ni le Dioula). Champs facultatifs : tant qu'ils sont absents,
 * l'application continue d'utiliser la synthèse vocale.
 */
export interface AudiosLanguesLocales {
  audioUrlMoore?: string; // ex. "/audio/moore/lecon-0.mp3"
  audioUrlDioula?: string; // ex. "/audio/dioula/lecon-0.mp3"
}

/** Contenu rédigé dans les 4 langues de l'application. */
export interface ContenuMultilingue extends AudiosLanguesLocales {
  fr: string;
  en: string;
  moore: string;
  dioula: string;
}

// Sections de navigation principale
export type Section =
  "Accueil" | "Centres" | "Comprendre" | "RoseIA" | "FaireUnDon" | "Accompagnant" | "Annonces" | "Calendrier";

// Rôles utilisateurs & spécialisation administrative
export type UserRole = "user" | "admin" | "superadmin";

export type AdminType = "center" | "doctor" | "association";

export interface UserProfile {
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
export interface PendingRegistration {
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
export type CenterStatus = "available" | "busy" | "maintenance" | "outdated";

export interface ExamPrice {
  name: string;
  price: number; // en FCFA
  free: boolean;
  notes?: string;
}

// audioUrlMoore / audioUrlDioula : version enregistrée du message audio du jour (audioMessageMoore / audioMessageDioula)
export interface HealthCenter extends AudiosLanguesLocales {
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
export interface PartnerAnnouncement {
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
  auteurId?: string; // Identifiant Supabase de l'auteur (mode réel)
  isRoseAIDetected?: boolean; // Détecté par Rose IA sur internet / réseaux sociaux
  sourceWebUrl?: string; // Source repérée (ex: Page Facebook Ministère de la Santé)
  aiConfidence?: string; // Taux de fiabilité pré-validé par Rose IA
  pushMessageFr?: string; // Message push bienveillant en français
  pushMessageMoore?: string; // Message push en Mooré
  pushMessageDioula?: string; // Message push en Dioula
  pushAudioUrlMoore?: string; // Version audio MP3 validée du message push en Mooré (à venir)
  pushAudioUrlDioula?: string; // Version audio MP3 validée du message push en Dioula (à venir)
  pushSent?: boolean; // Statut d'envoi du push après validation Superadmin
  imageUrl?: string; // Photo ou affiche officielle de l'événement
  imageCaption?: string; // Légende ou descriptif de l'affiche
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

export interface MedicalKnowledge {
  id: number;
  doctorName: string;
  speciality: string;
  topic: string;
  advice: string;
  date: string;
  verified: boolean;
}

/**
 * Modèle pour les Pensées & Conseils Santé Bienveillants de Rose IA
 * En 4 langues (Français, Mooré, Dioula, English)
 */
export interface RoseDailyTip extends AudiosLanguesLocales {
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

/** Leçon du module « Comprendre » (résumés audio en Mooré et Dioula). */
export interface Lecon extends AudiosLanguesLocales {
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

/** Message de la discussion avec Rose IA (avec ses traductions). */
export interface MessageRose extends AudiosLanguesLocales {
  sender: "user" | "rose";
  text: string;
  time: string;
  englishText?: string;
  mooreText?: string;
  dioulaText?: string;
  // Mode réel : sources citées, origine de la réponse et signe d'alerte détecté
  sources?: SourceRose[];
  origine?: "ia" | "sans_source" | "faq";
  alerte?: boolean;
}

/** Source citée sous une réponse de Rose IA (fiche validée). */
export interface SourceRose {
  titre: string;
  source: string | null;
  url: string | null;
}
