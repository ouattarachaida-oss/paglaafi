import type { PendingRegistration } from "../types";
import { client } from "../lib/supabase";
import { dateCourte } from "./format";

interface LigneDemande {
  id: number;
  type_structure: "centre" | "association" | "professionnel";
  nom_structure: string;
  ville: string | null;
  telephone: string | null;
  responsable: string | null;
  statut: "en_attente" | "approuvee" | "refusee";
  created_at: string;
}

const TYPE: Record<LigneDemande["type_structure"], PendingRegistration["type"]> = {
  centre: "Centre de Santé",
  association: "Association",
  professionnel: "Professionnel",
};

const STATUT: Record<LigneDemande["statut"], PendingRegistration["status"]> = {
  en_attente: "pending",
  approuvee: "approved",
  refusee: "rejected",
};

/** Demandes d'adhésion (toutes pour le superadmin, les siennes sinon). */
export async function chargerDemandes(): Promise<PendingRegistration[]> {
  const { data, error } = await client()
    .from("demandes_adhesion")
    .select("id, type_structure, nom_structure, ville, telephone, responsable, statut, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as LigneDemande[]).map((d) => ({
    id: d.id,
    structure: d.nom_structure,
    responsable: d.responsable ?? "—",
    telephone: d.telephone ?? "—",
    type: TYPE[d.type_structure],
    ville: d.ville ?? "—",
    date: dateCourte(d.created_at),
    status: STATUT[d.statut],
  }));
}

/** Validation (attribution du rôle côté serveur) : réservée au superadmin. */
export async function approuverDemande(id: number): Promise<void> {
  const { error } = await client().rpc("approuver_demande", { p_demande: id });
  if (error) throw error;
}

export async function refuserDemande(id: number, motif?: string): Promise<void> {
  const { error } = await client().rpc("refuser_demande", { p_demande: id, p_motif: motif ?? null });
  if (error) throw error;
}
