import { client } from "../lib/supabase";
import { dateCourte } from "./format";

/** Centre ou association affiché dans l'onglet « Vérifications » du superadmin. */
export interface StructureAVerifier {
  id: number;
  nom: string;
  ville: string;
  verifiee: boolean;
  majLe: string;
}

/**
 * Tous les centres et toutes les associations, vérifiés ou non.
 * La base ne renvoie les structures non vérifiées qu'au superadmin (RLS).
 */
export async function chargerStructuresAVerifier(): Promise<{
  centres: StructureAVerifier[];
  associations: StructureAVerifier[];
}> {
  const sb = client();
  const [c, a] = await Promise.all([
    sb.from("centres").select("id, nom_court, ville, verifie, maj_le").order("verifie").order("nom_court"),
    sb.from("associations").select("id, nom, ville, verifiee, updated_at").order("verifiee").order("nom"),
  ]);
  if (c.error) throw c.error;
  if (a.error) throw a.error;
  return {
    centres: c.data.map((x) => ({
      id: x.id,
      nom: x.nom_court,
      ville: x.ville,
      verifiee: x.verifie,
      majLe: dateCourte(x.maj_le),
    })),
    associations: a.data.map((x) => ({
      id: x.id,
      nom: x.nom,
      ville: x.ville ?? "",
      verifiee: x.verifiee,
      majLe: dateCourte(x.updated_at),
    })),
  };
}

/** Marque un centre comme vérifié (ou retire la vérification). Refusé par la base hors superadmin. */
export async function definirVerificationCentre(id: number, verifie: boolean): Promise<boolean> {
  const { data, error } = await client().from("centres").update({ verifie }).eq("id", id).select("id");
  if (error) throw error;
  return (data ?? []).length > 0;
}

/** Marque une association comme vérifiée (ou retire la vérification). Refusé par la base hors superadmin. */
export async function definirVerificationAssociation(id: number, verifiee: boolean): Promise<boolean> {
  const { data, error } = await client().from("associations").update({ verifiee }).eq("id", id).select("id");
  if (error) throw error;
  return (data ?? []).length > 0;
}
