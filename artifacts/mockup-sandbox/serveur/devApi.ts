/**
 * Plugin Vite (développement local uniquement) : expose POST /api/rose-chat et
 * POST /api/supprimer-compte avec les mêmes gestionnaires que les fonctions
 * Vercel, sans compte Vercel.
 *
 * Les secrets sont lus dans supabase/.env côté Node : ils ne passent jamais
 * dans le code envoyé au navigateur (aucun préfixe VITE_).
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { traiterQuestion } from "./rose/gestionnaire.js";
import { traiterSuppression } from "./compte/suppression.js";

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
    // Aussi sur « vite preview » : la version installable (PWA) servie depuis cet ordinateur
    configurePreviewServer(serveur) {
      brancherApi(serveur.middlewares, racineApp);
    },
    configureServer(serveur) {
      brancherApi(serveur.middlewares, racineApp);
    },
  };
}

function brancherApi(
  middlewares: { use: (route: string, fn: (req: any, res: any) => void) => void },
  racineApp: string,
) {
  const brancher = (
    route: string,
    gestionnaire: (r: Request, env: Record<string, string | undefined>) => Promise<Response>,
  ) =>
    middlewares.use(route, async (req, res) => {
      const env = {
        ...lireFichierEnv(path.join(racineApp, ".env")),
        ...lireFichierEnv(path.join(racineApp, "../../supabase/.env")),
        ...process.env,
      };
      const morceaux: Buffer[] = [];
      for await (const m of req) morceaux.push(m as Buffer);
      const requete = new Request(`http://localhost${route}`, {
        method: req.method,
        headers: Object.entries(req.headers).flatMap(([k, v]) =>
          v === undefined ? [] : [[k, Array.isArray(v) ? v.join(", ") : v] as [string, string]],
        ),
        body: req.method === "POST" ? Buffer.concat(morceaux) : undefined,
      });
      const reponse = await gestionnaire(requete, env);
      res.statusCode = reponse.status;
      reponse.headers.forEach((valeur, cle) => res.setHeader(cle, valeur));
      res.end(await reponse.text());
    });
  brancher("/api/rose-chat", traiterQuestion);
  brancher("/api/supprimer-compte", traiterSuppression);
}
