/**
 * Indexation des fiches VALIDÉES de Rose IA + export de la FAQ hors-ligne.
 *
 * Usage :
 *   pnpm run rag:indexer            indexe les fiches validées pas encore indexées, puis exporte la FAQ
 *   pnpm run rag:indexer -- --tout  ré-indexe toutes les fiches validées
 *   pnpm run rag:faq                exporte seulement la FAQ (sans appel à Gemini)
 *
 * Les embeddings sont calculés avec Gemini (GEMINI_API_KEY, supabase/.env) et
 * enregistrés dans fiches_morceaux. La FAQ (artifacts/mockup-sandbox/public/faq-rose.json)
 * ne contient QUE des fiches validées : elle sert de repli hors-ligne à l'application.
 * Aucune valeur secrète n'est affichée.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { RACINE_DEPOT, clientPostgres, exiger, lireEnv } from "./env.mjs";
import { calculerEmbeddings } from "../../artifacts/mockup-sandbox/serveur/rose/gemini.ts";

const FAQ_SEULEMENT = process.argv.includes("--faq");
const TOUT = process.argv.includes("--tout");
const TAILLE_MORCEAU = 1000; // caractères
const LOT_EMBEDDINGS = 50;

const env = lireEnv();
const modele = env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001";
if (!FAQ_SEULEMENT) exiger(env, "GEMINI_API_KEY");

/** Découpe un texte en morceaux d'au plus TAILLE_MORCEAU caractères, aux limites de phrases. */
export function decouper(texte) {
  const phrases = texte.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+/);
  const morceaux = [];
  let courant = "";
  for (const p of phrases) {
    if (courant && (courant + " " + p).length > TAILLE_MORCEAU) {
      morceaux.push(courant);
      courant = p;
    } else {
      courant = courant ? `${courant} ${p}` : p;
    }
  }
  if (courant) morceaux.push(courant);
  return morceaux;
}

const db = await clientPostgres();
try {
  if (!FAQ_SEULEMENT) {
    const { rows: fiches } = await db.query(
      `select id, titre, contenu from public.fiches_connaissance
        where statut = 'validee' ${TOUT ? "" : "and indexe_le is null"} order by id`,
    );
    console.log(`${fiches.length} fiche(s) validée(s) à indexer (modèle ${modele}).`);
    let nbMorceaux = 0;
    for (const fiche of fiches) {
      const morceaux = decouper(fiche.contenu);
      const vecteurs = [];
      for (let i = 0; i < morceaux.length; i += LOT_EMBEDDINGS) {
        const lot = morceaux.slice(i, i + LOT_EMBEDDINGS).map((m) => `${fiche.titre}\n${m}`);
        vecteurs.push(...(await calculerEmbeddings(fetch, env.GEMINI_API_KEY, modele, lot, "RETRIEVAL_DOCUMENT")));
      }
      await db.query("begin");
      try {
        await db.query("delete from public.fiches_morceaux where fiche_id = $1", [fiche.id]);
        for (const [ordre, contenu] of morceaux.entries()) {
          await db.query(
            "insert into public.fiches_morceaux (fiche_id, ordre, contenu, embedding, modele) values ($1, $2, $3, $4::extensions.vector, $5)",
            [fiche.id, ordre, contenu, `[${vecteurs[ordre].join(",")}]`, modele],
          );
        }
        // Ne marque indexée que si la fiche est toujours validée (pas modifiée entre-temps)
        const { rowCount } = await db.query(
          "update public.fiches_connaissance set indexe_le = now() where id = $1 and statut = 'validee'",
          [fiche.id],
        );
        await db.query(rowCount ? "commit" : "rollback");
        if (rowCount) nbMorceaux += morceaux.length;
      } catch (e) {
        await db.query("rollback");
        throw e;
      }
    }
    console.log(`Indexation terminée : ${nbMorceaux} morceau(x) enregistré(s).`);
  }

  // Export de la FAQ hors-ligne (fiches validées uniquement)
  const { rows: validees } = await db.query(
    `select id, titre, contenu, langue, groupe, source_titre, source_url
       from public.fiches_connaissance where statut = 'validee' order by groupe nulls last, langue, id`,
  );
  const faq = {
    avertissement:
      "Fiches validées par des soignants. Repli hors-ligne de Rose IA : ne remplace pas une consultation.",
    genere_le: new Date().toISOString(),
    fiches: validees.map((f) => ({
      id: Number(f.id),
      titre: f.titre,
      contenu: f.contenu,
      langue: f.langue,
      groupe: f.groupe,
      source: f.source_titre,
      url: f.source_url,
    })),
  };
  const fichier = path.join(RACINE_DEPOT, "artifacts/mockup-sandbox/public/faq-rose.json");
  writeFileSync(fichier, JSON.stringify(faq, null, 2) + "\n");
  console.log(`FAQ hors-ligne exportée : ${faq.fiches.length} fiche(s) validée(s) → ${path.relative(RACINE_DEPOT, fichier)}`);
  console.log("Pensez à committer faq-rose.json pour la publier avec l'application.");
} finally {
  await db.end();
}
