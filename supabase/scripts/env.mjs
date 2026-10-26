/**
 * Lecture des fichiers .env pour les scripts Supabase (sans dépendance externe).
 *
 * Règle : aucune valeur secrète n'est jamais affichée. Les messages d'erreur
 * ne citent que le NOM des variables manquantes.
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ICI = path.dirname(fileURLToPath(import.meta.url));
export const RACINE_DEPOT = path.resolve(ICI, "../..");

function lireFichierEnv(fichier) {
  const valeurs = {};
  if (!existsSync(fichier)) return valeurs;
  for (const ligne of readFileSync(fichier, "utf8").split(/\r?\n/)) {
    const m = ligne.match(/^\s*([A-Z0-9_]+)\s*=(.*)$/);
    if (m) valeurs[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return valeurs;
}

/** Variables de supabase/.env et artifacts/mockup-sandbox/.env (les variables du processus priment). */
export function lireEnv() {
  return {
    ...lireFichierEnv(path.join(RACINE_DEPOT, "artifacts/mockup-sandbox/.env")),
    ...lireFichierEnv(path.join(RACINE_DEPOT, "supabase/.env")),
    ...Object.fromEntries(Object.entries(process.env).filter(([k]) => /^(VITE_)?SUPABASE_/.test(k))),
  };
}

export function exiger(env, ...noms) {
  const manquantes = noms.filter((n) => !env[n]);
  if (manquantes.length) {
    console.error(`Variable(s) manquante(s) : ${manquantes.join(", ")} (voir supabase/.env.example)`);
    process.exit(1);
  }
}

/**
 * Chaîne de connexion Postgres via le session pooler : l'adresse (sans mot de passe)
 * vient de SUPABASE_DB_POOLER_URL, le mot de passe de SUPABASE_DB_PASSWORD,
 * encodé pour supporter les caractères spéciaux.
 */
export function urlConnexion(env = lireEnv()) {
  exiger(env, "SUPABASE_DB_POOLER_URL", "SUPABASE_DB_PASSWORD");
  const brute = env.SUPABASE_DB_POOLER_URL;
  const m = brute.match(/^(postgres(?:ql)?:\/\/)([^:@/]+)(?::[^@]*)?@(.+)$/);
  if (!m) {
    console.error("SUPABASE_DB_POOLER_URL n'a pas le format postgresql://utilisateur@hôte:port/base");
    process.exit(1);
  }
  const [, protocole, utilisateur, reste] = m;
  return `${protocole}${utilisateur}:${encodeURIComponent(env.SUPABASE_DB_PASSWORD)}@${reste}`;
}

/** Client Postgres prêt à l'emploi (SSL requis par Supabase). */
export async function clientPostgres() {
  const { default: pg } = await import("pg");
  const client = new pg.Client({ connectionString: urlConnexion(), ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
  } catch (e) {
    // le message de pg ne contient pas le mot de passe, mais on reste sobre
    console.error(`Connexion à la base impossible (${e.code || e.name}). Vérifiez SUPABASE_DB_POOLER_URL et SUPABASE_DB_PASSWORD.`);
    process.exit(1);
  }
  return client;
}
