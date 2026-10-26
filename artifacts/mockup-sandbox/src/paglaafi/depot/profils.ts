import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "../types";
import { client } from "../lib/supabase";

/** Rôles tels qu'enregistrés en base (attribués uniquement côté serveur). */
export type RoleServeur = "utilisatrice" | "admin_centre" | "docteur" | "admin_association" | "superadmin";

/** Session réelle : identité Supabase et rattachement, utilisés par les autres domaines. */
export interface SessionReelle {
  userId: string;
  email: string;
  role: RoleServeur;
  centreId: number | null;
  associationId: number | null;
}

interface LigneProfil {
  id: string;
  nom: string;
  prenom: string;
  telephone: string | null;
  role: RoleServeur;
  centre_id: number | null;
  association_id: number | null;
  specialite: string | null;
}

/** Convertit un profil serveur vers le format utilisé par l'interface. */
function versProfilInterface(p: LigneProfil, structure: string | undefined): UserProfile {
  const base = { nom: p.nom, prenom: p.prenom, telephone: p.telephone ?? "", structureName: structure };
  switch (p.role) {
    case "superadmin":
      return { ...base, role: "superadmin", roleLabel: "Super-Administrateur National" };
    case "admin_centre":
      return { ...base, role: "admin", adminType: "center", roleLabel: `Admin Centre (${structure ?? "Centre"})` };
    case "docteur":
      return {
        ...base,
        role: "admin",
        adminType: "doctor",
        speciality: p.specialite ?? undefined,
        roleLabel: structure ? `Docteur / Praticien (${structure})` : "Docteur / Praticien",
      };
    case "admin_association":
      return {
        ...base,
        role: "admin",
        adminType: "association",
        roleLabel: `Admin Association (${structure ?? "Association"})`,
      };
    default:
      return { ...base, role: "user", roleLabel: "Utilisatrice" };
  }
}

/** Charge le profil de l'utilisateur connecté (et le nom de sa structure). */
export async function chargerProfilConnecte(
  user: User,
): Promise<{ session: SessionReelle; utilisateur: UserProfile } | { erreur: string }> {
  const sb = client();
  const { data: p, error } = await sb
    .from("profils")
    .select("id, nom, prenom, telephone, role, centre_id, association_id, specialite")
    .eq("id", user.id)
    .single<LigneProfil>();
  if (error || !p) return { erreur: error?.message ?? "Profil introuvable" };

  let structure: string | undefined;
  if (p.centre_id) {
    const { data } = await sb.from("centres").select("nom_court").eq("id", p.centre_id).maybeSingle();
    structure = data?.nom_court ?? undefined;
  } else if (p.association_id) {
    const { data } = await sb.from("associations").select("nom").eq("id", p.association_id).maybeSingle();
    structure = data?.nom ?? undefined;
  }

  return {
    session: {
      userId: p.id,
      email: user.email ?? "",
      role: p.role,
      centreId: p.centre_id,
      associationId: p.association_id,
    },
    utilisateur: versProfilInterface(p, structure),
  };
}
