import type { CenterStatus, ExamPrice, HealthCenter } from "../types";
import { client } from "../lib/supabase";
import { dateHeure } from "./format";

/** Ligne de la table centres (voir supabase/migrations). */
interface LigneCentre {
  id: number;
  nom: string;
  nom_court: string;
  lieu: string | null;
  ville: string;
  adresse: string | null;
  telephone: string | null;
  lat: number | null;
  lng: number | null;
  statut: CenterStatus;
  statut_libelle: string | null;
  appareil: string | null;
  appareil_fonctionnel: boolean;
  agents_presents: number;
  description_personnel: string | null;
  file_attente: number;
  attente_estimee: string | null;
  examens: ExamPrice[];
  visites_confirmees_jour: number;
  message_audio_fr: string | null;
  message_audio_en: string | null;
  message_audio_moore: string | null;
  message_audio_dioula: string | null;
  audio_url_moore: string | null;
  audio_url_dioula: string | null;
  maj_le: string;
}

// Couleur de la pastille selon le statut (mêmes classes que les données de démo)
const COULEUR_STATUT: Record<CenterStatus, string> = {
  available: "bg-emerald-500",
  busy: "bg-amber-500",
  maintenance: "bg-rose-500",
  outdated: "bg-slate-400",
  closed: "bg-stone-500",
};

const LIBELLE_STATUT: Record<CenterStatus, string> = {
  available: "Disponible",
  busy: "Affluence",
  maintenance: "Maintenance",
  outdated: "Non actualisé",
  closed: "Fermé",
};

function versCentre(c: LigneCentre): HealthCenter {
  return {
    id: c.id,
    name: c.nom,
    shortName: c.nom_court,
    place: c.lieu ?? c.ville,
    city: c.ville,
    status: c.statut,
    statusLabel: c.statut_libelle ?? LIBELLE_STATUT[c.statut],
    statusColor: COULEUR_STATUT[c.statut],
    apparatus: c.appareil ?? "Non renseigné",
    isApparatusWorking: c.appareil_fonctionnel,
    agentsPresent: c.agents_presents,
    staffDescription: c.description_personnel ?? "",
    queueCount: c.file_attente,
    estimatedWait: c.attente_estimee ?? "Non renseigné",
    exams: Array.isArray(c.examens) ? c.examens : [],
    audioMessageFr: c.message_audio_fr ?? "",
    audioMessageEn: c.message_audio_en ?? "",
    audioMessageMoore: c.message_audio_moore ?? "",
    audioMessageDioula: c.message_audio_dioula ?? "",
    audioUrlMoore: c.audio_url_moore ?? undefined,
    audioUrlDioula: c.audio_url_dioula ?? undefined,
    confirmedVisitsToday: c.visites_confirmees_jour,
    phone: c.telephone ?? "",
    address: c.adresse ?? "",
    lastUpdate: `Mis à jour le ${dateHeure(c.maj_le)}`,
    coordinates: { x: 50, y: 50 },
    lat: c.lat,
    lng: c.lng,
  };
}

/** Centres vérifiés, affichés à toutes et tous en mode réel. */
export async function chargerCentresVerifies(): Promise<HealthCenter[]> {
  const { data, error } = await client().from("centres").select("*").eq("verifie", true).order("nom_court");
  if (error) throw error;
  return (data as LigneCentre[]).map(versCentre);
}

/** Centre géré par l'admin ou le docteur connecté (même s'il n'est pas encore vérifié). */
export async function chargerCentreGere(centreId: number): Promise<HealthCenter | null> {
  const { data, error } = await client().from("centres").select("*").eq("id", centreId).maybeSingle();
  if (error) throw error;
  return data ? versCentre(data as LigneCentre) : null;
}

/**
 * Enregistre les disponibilités du jour. Seuls les champs opérationnels sont
 * envoyés : l'identité et la vérification du centre restent au superadmin
 * (protégées côté serveur). Renvoie false si la base a refusé (RLS).
 */
export async function enregistrerDisponibilites(c: HealthCenter): Promise<boolean> {
  const { data, error } = await client()
    .from("centres")
    .update({
      statut: c.status,
      statut_libelle: c.statusLabel,
      appareil: c.apparatus,
      appareil_fonctionnel: c.isApparatusWorking,
      agents_presents: c.agentsPresent,
      description_personnel: c.staffDescription,
      file_attente: c.queueCount,
      attente_estimee: c.estimatedWait,
      message_audio_fr: c.audioMessageFr,
      examens: c.exams.map((e) => ({ name: e.name, price: e.price, free: e.free, notes: e.notes ?? "" })),
    })
    .eq("id", c.id)
    .select("id");
  if (error) throw error;
  return (data ?? []).length > 0;
}
