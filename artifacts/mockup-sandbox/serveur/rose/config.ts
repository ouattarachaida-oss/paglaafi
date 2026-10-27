/**
 * Configuration du serveur de Rose IA, lue dans les variables d'environnement.
 *
 * ⚠️ Ces variables sont SECRÈTES ou côté serveur : elles ne doivent JAMAIS porter
 * le préfixe VITE_ (sinon Vite les injecterait dans le code envoyé au navigateur).
 * Seules VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY sont publiques.
 */
export interface ConfigRose {
  geminiCle: string;
  modele: string;
  modeleEmbedding: string;
  supabaseUrl: string;
  cleSecrete: string;
  clePublique: string;
  quotaJour: number;
  seuilSimilarite: number;
  nombreSources: number;
}

export type Env = Record<string, string | undefined>;

export function lireConfig(env: Env): ConfigRose | { manquantes: string[] } {
  const requises = ["GEMINI_API_KEY", "SUPABASE_SECRET_KEY", "VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"];
  const manquantes = requises.filter((n) => !env[n]);
  if (manquantes.length) return { manquantes };
  const nombre = (v: string | undefined, defaut: number) => (v && !Number.isNaN(Number(v)) ? Number(v) : defaut);
  return {
    geminiCle: env.GEMINI_API_KEY!,
    // Modèles configurables : vérifier les noms en vigueur dans Google AI Studio
    modele: env.GEMINI_MODEL || "gemini-2.5-flash",
    modeleEmbedding: env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001",
    supabaseUrl: env.VITE_SUPABASE_URL!.replace(/\/$/, ""),
    cleSecrete: env.SUPABASE_SECRET_KEY!,
    clePublique: env.VITE_SUPABASE_PUBLISHABLE_KEY!,
    quotaJour: nombre(env.ROSE_QUOTA_JOUR, 30),
    seuilSimilarite: nombre(env.ROSE_SEUIL_SIMILARITE, 0.65),
    nombreSources: nombre(env.ROSE_NOMBRE_SOURCES, 4),
  };
}

/** Dimension des embeddings (doit correspondre à la colonne vector(768) en base). */
export const DIMENSION_EMBEDDING = 768;

/** Longueur maximale d'une question. */
export const LONGUEUR_MAX_QUESTION = 500;
