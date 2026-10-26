/// <reference types="vite/client" />

/** Variables d'environnement publiques (fichier .env, préfixe VITE_). */
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly VITE_MODE_DEMO?: string;
}
