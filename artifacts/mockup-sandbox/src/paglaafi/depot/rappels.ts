import { client } from "../lib/supabase";

/** Rappel tel qu'affiché par l'écran Cycle. */
export interface Rappel {
  id: number;
  title: string;
  date: string;
  type: "screening" | "appointment" | "treatment";
  active: boolean;
}

interface LigneRappel {
  id: number;
  titre: string;
  date_texte: string;
  type: Rappel["type"];
  actif: boolean;
}

const versRappel = (r: LigneRappel): Rappel => ({
  id: r.id,
  title: r.titre,
  date: r.date_texte,
  type: r.type,
  active: r.actif,
});

/** Rappels de l'utilisatrice connectée (la base ne renvoie jamais ceux des autres). */
export async function chargerRappels(): Promise<Rappel[]> {
  const { data, error } = await client()
    .from("rappels")
    .select("id, titre, date_texte, type, actif")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as LigneRappel[]).map(versRappel);
}

export async function creerRappel(r: Omit<Rappel, "id">): Promise<Rappel> {
  const { data, error } = await client()
    .from("rappels")
    .insert({ titre: r.title, date_texte: r.date, type: r.type, actif: r.active })
    .select("id, titre, date_texte, type, actif")
    .single<LigneRappel>();
  if (error) throw error;
  return versRappel(data);
}
