/**
 * Applique les migrations SQL de supabase/migrations (dans l'ordre des noms de fichiers)
 * qui ne l'ont pas encore été, puis, avec --seed, exécute supabase/seed.sql.
 *
 * Usage : pnpm run db:migrer [-- --seed]
 *
 * Le suivi utilise la table supabase_migrations.schema_migrations, la même que
 * la CLI Supabase : les deux outils restent compatibles.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { RACINE_DEPOT, clientPostgres } from "./env.mjs";

const DOSSIER = path.join(RACINE_DEPOT, "supabase/migrations");
const avecSeed = process.argv.includes("--seed");

const client = await clientPostgres();
try {
  await client.query(`
    create schema if not exists supabase_migrations;
    create table if not exists supabase_migrations.schema_migrations (
      version text primary key,
      statements text[],
      name text
    );`);
  const { rows } = await client.query("select version from supabase_migrations.schema_migrations");
  const appliquees = new Set(rows.map((r) => r.version));

  const fichiers = readdirSync(DOSSIER).filter((f) => /^\d+_.+\.sql$/.test(f)).sort();
  let nb = 0;
  for (const fichier of fichiers) {
    const [version, ...nom] = fichier.replace(/\.sql$/, "").split("_");
    if (appliquees.has(version)) continue;
    const sql = readFileSync(path.join(DOSSIER, fichier), "utf8");
    process.stdout.write(`→ ${fichier} … `);
    await client.query("begin");
    try {
      await client.query(sql);
      await client.query("insert into supabase_migrations.schema_migrations (version, statements, name) values ($1, $2, $3)", [
        version,
        [sql],
        nom.join("_"),
      ]);
      await client.query("commit");
      console.log("appliquée");
      nb++;
    } catch (e) {
      await client.query("rollback");
      console.log("ÉCHEC");
      console.error(`  ${e.message}${e.position ? ` (position ${e.position})` : ""}`);
      process.exitCode = 1;
      break;
    }
  }
  console.log(nb ? `${nb} migration(s) appliquée(s).` : "Base déjà à jour.");

  if (avecSeed && !process.exitCode) {
    await client.query(readFileSync(path.join(RACINE_DEPOT, "supabase/seed.sql"), "utf8"));
    console.log("Données initiales (seed.sql) insérées.");
  }
} finally {
  await client.end();
}
