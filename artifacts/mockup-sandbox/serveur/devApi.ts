/**
 * Plugin Vite (développement local uniquement) : expose POST /api/rose-chat
 * avec le même gestionnaire que la fonction Vercel, sans compte Vercel.
 *
 * Les secrets sont lus dans supabase/.env côté Node : ils ne passent jamais
 * dans le code envoyé au navigateur (aucun préfixe VITE_).
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { traiterQuestion } from "./rose/gestionnaire";

function lireFichierEnv(fichier: string): Record<string, string> {
  const valeurs: Record<string, string> = {};
  if (!existsSync(fichier)) return valeurs;
  for (const ligne of readFileSync(fichier, "utf8").split(/\r?\n/)) {
    const m = ligne.match(/^\s*([A-Z0-9_]+)\s*=(.*)$/);
    if (m) valeurs[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return valeurs;
}

export function apiRoseLocale(racineApp: string): Plugin {
  return {
    name: "paglaafi-api-rose-locale",
    apply: "serve",
    configureServer(serveur) {
      serveur.middlewares.use("/api/rose-chat", async (req, res) => {
        const env = {
          ...lireFichierEnv(path.join(racineApp, ".env")),
          ...lireFichierEnv(path.join(racineApp, "../../supabase/.env")),
          ...process.env,
        };
        const morceaux: Buffer[] = [];
        for await (const m of req) morceaux.push(m as Buffer);
        const requete = new Request(`http://localhost${req.url ?? ""}`, {
          method: req.method,
          headers: Object.entries(req.headers).flatMap(([k, v]) =>
            v === undefined ? [] : [[k, Array.isArray(v) ? v.join(", ") : v] as [string, string]],
          ),
          body: req.method === "POST" ? Buffer.concat(morceaux) : undefined,
        });
        const reponse = await traiterQuestion(requete, env);
        res.statusCode = reponse.status;
        reponse.headers.forEach((valeur, cle) => res.setHeader(cle, valeur));
        res.end(await reponse.text());
      });
    },
  };
}
