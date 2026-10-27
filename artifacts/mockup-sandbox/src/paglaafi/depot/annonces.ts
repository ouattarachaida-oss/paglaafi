import type { PartnerAnnouncement } from "../types";
import { client } from "../lib/supabase";
import { dateCourte, moisCourant } from "./format";

type StatutServeur = "en_attente" | "publiee" | "refusee";

interface LigneAnnonce {
  id: number;
  titre: string;
  contenu: string;
  ville: string | null;
  date_evenement: string | null;
  mois: string | null;
  badge: string | null;
  contact: string | null;
  image_url: string | null;
  image_legende: string | null;
  auteur_id: string;
  auteur_nom: string | null;
  type_auteur: string | null;
  statut: StatutServeur;
  created_at: string;
}

const VERS_STATUT: Record<StatutServeur, PartnerAnnouncement["status"]> = {
  en_attente: "pending_validation",
  publiee: "approved",
  refusee: "rejected",
};

function versAnnonce(a: LigneAnnonce): PartnerAnnouncement {
  const status = VERS_STATUT[a.statut];
  return {
    id: a.id,
    title: a.titre,
    author: a.auteur_nom ?? "Structure partenaire",
    authorType: (a.type_auteur as PartnerAnnouncement["authorType"]) ?? "Partenaire Santé",
    city: a.ville ?? "",
    date: a.date_evenement ?? "",
    month: a.mois ?? "",
    badge:
      status === "pending_validation"
        ? "En attente validation"
        : status === "rejected"
          ? "Refusée"
          : (a.badge ?? "Validée ✓"),
    badgeColor:
      status === "pending_validation"
        ? "bg-amber-100 text-amber-900"
        : status === "rejected"
          ? "bg-rose-100 text-rose-800"
          : "bg-emerald-100 text-emerald-800",
    content: a.contenu,
    contact: a.contact ?? "",
    likes: 0,
    status,
    submittedBy: a.auteur_nom ?? undefined,
    submittedAt: dateCourte(a.created_at),
    auteurId: a.auteur_id,
    imageUrl: a.image_url ?? undefined,
    imageCaption: a.image_legende ?? undefined,
  };
}

/** Annonces visibles par le compte connecté (publiées, les siennes, ou toutes pour le superadmin). */
export async function chargerAnnonces(): Promise<PartnerAnnouncement[]> {
  const { data, error } = await client().from("annonces").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data as LigneAnnonce[]).map(versAnnonce);
}

/** Crée une annonce : elle est toujours enregistrée « en attente » de validation. */
export async function creerAnnonce(a: {
  title: string;
  content: string;
  city: string;
  date: string;
  badge: string;
  contact: string;
  imageUrl: string;
  imageCaption: string;
}): Promise<void> {
  const { error } = await client()
    .from("annonces")
    .insert({
      titre: a.title,
      contenu: a.content,
      ville: a.city,
      date_evenement: a.date,
      mois: moisCourant(),
      badge: a.badge,
      contact: a.contact || null,
      image_url: a.imageUrl || null,
      image_legende: a.imageCaption || null,
    });
  if (error) throw error;
}

/** Validation ou refus par le superadmin (refusé par la base pour tout autre rôle). */
export async function modererAnnonce(id: number, decision: "publiee" | "refusee"): Promise<boolean> {
  const { data, error } = await client().from("annonces").update({ statut: decision }).eq("id", id).select("id");
  if (error) throw error;
  return (data ?? []).length > 0;
}
