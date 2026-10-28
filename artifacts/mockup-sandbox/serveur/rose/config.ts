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
  /** Modèle essayé une fois si le principal est saturé (503), limité (429) ou trop lent. */
  modeleSecours: string;
  /** Niveau de réflexion du modèle (« minimal » : rapide, ne consomme pas le plafond de sortie). */
  reflexion: string;
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
    // (gemini-2.5-flash n'est plus ouvert aux nouveaux comptes depuis 2026)
    modele: env.GEMINI_MODEL || "gemini-3.5-flash",
    modeleSecours: env.GEMINI_MODEL_SECOURS || "gemini-3.5-flash-lite",
    reflexion: env.GEMINI_REFLEXION || "minimal",
    modeleEmbedding: env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001",
    supabaseUrl: env.VITE_SUPABASE_URL!.replace(/\/$/, ""),
    cleSecrete: env.SUPABASE_SECRET_KEY!,
    clePublique: env.VITE_SUPABASE_PUBLISHABLE_KEY!,
    quotaJour: nombre(env.ROSE_QUOTA_JOUR, 30),
    // Calibré le 27/10/2026 sur les fiches initiales (pnpm run rag:calibrer) : à refaire après validation
    seuilSimilarite: nombre(env.ROSE_SEUIL_SIMILARITE, 0.67),
    nombreSources: nombre(env.ROSE_NOMBRE_SOURCES, 4),
  };
}

/** Dimension des embeddings (doit correspondre à la colonne vector(768) en base). */
export const DIMENSION_EMBEDDING = 768;

/** Longueur maximale d'une question. */
export const LONGUEUR_MAX_QUESTION = 500;
