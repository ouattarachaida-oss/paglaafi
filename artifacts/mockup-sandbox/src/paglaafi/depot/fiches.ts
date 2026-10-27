import { client } from "../lib/supabase";
import { dateCourte } from "./format";

export type LangueFiche = "fr" | "en" | "moore" | "dioula";
export type StatutFiche = "en_attente" | "validee" | "refusee";

/** Fiche de connaissance de Rose IA (voir migration 20261027000004). */
export interface Fiche {
  id: number;
  titre: string;
  contenu: string;
  langue: LangueFiche;
  theme: string | null;
  sourceTitre: string | null;
  sourceUrl: string | null;
  /** Suggestion de source pour les fiches initiales : à vérifier, jamais une source. */
  sourceSuggeree: string | null;
  auteurId: string | null;
  auteurNom: string | null;
  statut: StatutFiche;
  motifRefus: string | null;
  indexee: boolean;
  dateMaj: string;
}

export interface Docteur {
  id: string;
  nom: string;
  prenom: string;
  specialite: string | null;
  peutValider: boolean;
  structure: string | null;
}

const COLONNES =
  "id, titre, contenu, langue, theme, source_titre, source_url, source_suggeree, auteur_id, auteur_nom, statut, motif_refus, indexe_le, updated_at";

const versFiche = (f: any): Fiche => ({
  id: f.id,
  titre: f.titre,
  contenu: f.contenu,
  langue: f.langue,
  theme: f.theme,
  sourceTitre: f.source_titre,
  sourceUrl: f.source_url,
  sourceSuggeree: f.source_suggeree,
  auteurId: f.auteur_id,
  auteurNom: f.auteur_nom,
  statut: f.statut,
  motifRefus: f.motif_refus,
  indexee: Boolean(f.indexe_le),
  dateMaj: dateCourte(f.updated_at),
});

/** Fiches proposées par le compte connecté. */
export async function chargerMesFiches(userId: string): Promise<Fiche[]> {
  const { data, error } = await client()
    .from("fiches_connaissance")
    .select(COLONNES)
    .eq("auteur_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data.map(versFiche);
}

/** File de relecture d'un validateur : fiches en attente (la base refuse aux autres). */
export async function chargerFichesAValider(): Promise<Fiche[]> {
  const { data, error } = await client()
    .from("fiches_connaissance")
    .select(COLONNES)
    .eq("statut", "en_attente")
    .order("created_at");
  if (error) throw error;
  return data.map(versFiche);
}

/** Proposition d'une fiche par un docteur : toujours « en attente » de validation. */
export async function proposerFiche(f: {
  titre: string;
  contenu: string;
  langue: LangueFiche;
  theme: string;
  sourceTitre: string;
  sourceUrl: string;
}): Promise<void> {
  const { error } = await client()
    .from("fiches_connaissance")
    .insert({
      titre: f.titre.trim(),
      contenu: f.contenu.trim(),
      langue: f.langue,
      theme: f.theme.trim() || null,
      groupe: f.theme.trim() || null,
      source_titre: f.sourceTitre.trim() || null,
      source_url: f.sourceUrl.trim() || null,
    });
  if (error) throw error;
}

/**
 * Validation par un validateur (jamais l'auteur) avec la source officielle.
 * Renvoie false si la base a refusé (règles RLS).
 */
export async function validerFiche(id: number, sourceTitre: string, sourceUrl: string): Promise<boolean> {
  const { data, error } = await client()
    .from("fiches_connaissance")
    .update({ statut: "validee", source_titre: sourceTitre.trim(), source_url: sourceUrl.trim() || null })
    .eq("id", id)
    .select("id");
  if (error) throw error;
  return (data ?? []).length > 0;
}

export async function refuserFiche(id: number, motif: string): Promise<boolean> {
  const { data, error } = await client()
    .from("fiches_connaissance")
    .update({ statut: "refusee", motif_refus: motif.trim() || null })
    .eq("id", id)
    .select("id");
  if (error) throw error;
  return (data ?? []).length > 0;
}

/** Docteurs inscrits (superadmin) et désignation des validateurs. */
export async function listerDocteurs(): Promise<Docteur[]> {
  const { data, error } = await client().rpc("lister_docteurs");
  if (error) throw error;
  return (data as any[]).map((d) => ({
    id: d.id,
    nom: d.nom,
    prenom: d.prenom,
    specialite: d.specialite,
    peutValider: d.peut_valider,
    structure: d.structure,
  }));
}

export async function designerValidateur(id: string, valeur: boolean): Promise<void> {
  const { error } = await client().rpc("designer_validateur", { p_profil: id, p_valeur: valeur });
  if (error) throw error;
}
