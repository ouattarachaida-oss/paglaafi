import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { MODE_REEL } from "../config";

/**
 * Client Supabase (clé publishable uniquement : les données sont protégées par
 * les règles RLS côté serveur). N'est créé qu'en mode réel : le mode démo ne
 * fait aucun appel réseau vers Supabase.
 */
export const supabase: SupabaseClient | null = MODE_REEL
  ? createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;

/** Client Supabase garanti (à n'appeler qu'en mode réel). */
export function client(): SupabaseClient {
  if (!supabase) throw new Error("Supabase n'est disponible qu'en mode réel.");
  return supabase;
}

/** Message d'erreur compréhensible pour l'utilisatrice (en français). */
export function messageErreur(erreur: { message?: string; code?: string } | null | undefined): string {
  const m = erreur?.message ?? "";
  if (/invalid login credentials/i.test(m)) return "Email ou mot de passe incorrect.";
  if (/already registered|already been registered/i.test(m)) return "Un compte existe déjà avec cet email.";
  if (/password should be at least/i.test(m)) return "Mot de passe trop court (6 caractères minimum).";
  if (/email not confirmed/i.test(m)) return "Adresse email non confirmée : vérifiez votre boîte de réception.";
  if (/unable to validate email|invalid email/i.test(m)) return "Adresse email invalide.";
  if (/rate limit/i.test(m)) return "Trop de tentatives : réessayez dans quelques minutes.";
  if (erreur?.code === "42501" || /row-level security|permission denied/i.test(m))
    return "Action non autorisée pour votre profil.";
  if (/failed to fetch|network/i.test(m)) return "Connexion au serveur impossible. Vérifiez votre réseau.";
  return m ? `Erreur : ${m}` : "Une erreur est survenue.";
}
