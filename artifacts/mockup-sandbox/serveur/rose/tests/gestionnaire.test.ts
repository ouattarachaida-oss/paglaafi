/**
 * Tests du gestionnaire /api/rose-chat avec Gemini et Supabase SIMULÉS :
 * on intercepte chaque requête sortante pour vérifier ce qui part vers le modèle.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { traiterQuestion } from "../gestionnaire";

const ENV = {
  GEMINI_API_KEY: "cle-gemini-de-test",
  SUPABASE_SECRET_KEY: "cle-secrete-de-test",
  VITE_SUPABASE_URL: "https://projet-test.supabase.co",
  VITE_SUPABASE_PUBLISHABLE_KEY: "cle-publique-de-test",
  ROSE_SEUIL_SIMILARITE: "0.65",
};

const FICHES = [
  {
    fiche_id: 10,
    titre: "Autopalpation",
    morceau: "Chaque mois, après les règles…",
    source_titre: "OMS (test)",
    source_url: "https://exemple.test/a",
    langue: "fr",
    groupe: "boule",
    similarite: 0.82,
  },
  {
    fiche_id: 11,
    titre: "Consulter",
    morceau: "Consulter en cas de boule…",
    source_titre: "Ministère (test)",
    source_url: null,
    langue: "fr",
    groupe: "boule",
    similarite: 0.74,
  },
];

interface Options {
  utilisateur?: string | null;
  quota?: boolean;
  fiches?: typeof FICHES;
  reponseModele?: object | string;
  geminiEnPanne?: boolean;
  /** Statut renvoyé par le modèle principal (ex. 503 : saturé). */
  principalStatut?: number;
  finTronquee?: boolean;
  /** Le modèle principal ne répond pas à temps. */
  principalLent?: boolean;
  fichesLocales?: object[];
}

function simuler(opts: Options = {}) {
  const appels: Array<{ url: string; corps: string; entetes: Record<string, string> }> = [];
  const f = (async (url: string, init: RequestInit = {}) => {
    const corps = typeof init.body === "string" ? init.body : "";
    appels.push({ url, corps, entetes: (init.headers ?? {}) as Record<string, string> });
    const rep = (statut: number, donnees: unknown) => new Response(JSON.stringify(donnees), { status: statut });
    if (url.endsWith("/auth/v1/user"))
      return opts.utilisateur === null ? rep(401, {}) : rep(200, { id: opts.utilisateur ?? "u-1" });
    if (url.includes("consommer_quota_rose")) return rep(200, opts.quota ?? true);
    if (url.includes(":batchEmbedContents")) {
      if (opts.geminiEnPanne) return rep(503, {});
      return rep(200, { embeddings: JSON.parse(corps).requests.map(() => ({ values: Array(768).fill(0.5) })) });
    }
    if (url.includes("rechercher_fiches")) return rep(200, opts.fiches ?? FICHES);
    if (url.includes(":generateContent")) {
      if (opts.principalStatut && url.includes("/models/gemini-3.5-flash:")) return rep(opts.principalStatut, {});
      if (opts.principalLent && url.includes("/models/gemini-3.5-flash:"))
        throw new DOMException("This operation was aborted", "AbortError");
      const r = opts.reponseModele ?? {
        reponse: "Fais l'autopalpation chaque mois après tes règles.",
        sources_utilisees: [1],
        alerte: false,
        hors_sujet: false,
      };
      return rep(200, {
        candidates: [
          {
            finishReason: opts.finTronquee ? "MAX_TOKENS" : "STOP",
            content: {
              parts: [
                { text: "réflexion interne", thought: true },
                { text: typeof r === "string" ? r : JSON.stringify(r) },
              ],
            },
          },
        ],
      });
    }
    if (url.includes("/rest/v1/fiches_connaissance")) return rep(200, opts.fichesLocales ?? []);
    return rep(404, {});
  }) as typeof fetch;
  return { f, appels };
}

const requete = (corps: object, jeton: string | null = "jeton-valide") =>
  new Request("http://localhost/api/rose-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(jeton ? { Authorization: `Bearer ${jeton}` } : {}) },
    body: JSON.stringify(corps),
  });

describe("gestionnaire /api/rose-chat", () => {
  it("sans fiche validée, aucune réponse IA (même avec l'ancien réglage ROSE_REPONSE_LIBRE)", async () => {
    const { f, appels } = simuler({ fiches: [] });
    const corps = await (
      await traiterQuestion(
        requete({ question: "Comment fait-on l'autopalpation ?" }),
        { ...ENV, ROSE_REPONSE_LIBRE: "true" },
        f,
      )
    ).json();
    assert.equal(corps.mode, "sans_source");
    assert.ok(!appels.some((a) => a.url.includes(":generateContent")));
  });

  it("règle la réflexion du modèle au minimum et ignore les parties « réflexion »", async () => {
    const { f, appels } = simuler();
    const corps = await (
      await traiterQuestion(requete({ question: "Comment faire l'autopalpation ?" }), ENV, f)
    ).json();
    const gen = JSON.parse(appels.find((a) => a.url.includes(":generateContent"))!.corps);
    assert.deepEqual(gen.generationConfig.thinkingConfig, { thinkingLevel: "minimal" });
    assert.equal(corps.mode, "ia");
    assert.ok(!corps.reponse.includes("réflexion interne"));
  });

  it("essaie une fois le modèle de secours si le principal est saturé (503)", async () => {
    const { f, appels } = simuler({ principalStatut: 503 });
    const r = await traiterQuestion(requete({ question: "Comment faire l'autopalpation ?" }), ENV, f);
    assert.equal(r.status, 200);
    const modeles = appels
      .filter((a) => a.url.includes(":generateContent"))
      .map((a) => a.url.split("/models/")[1].split(":")[0]);
    assert.deepEqual(modeles, ["gemini-3.5-flash", "gemini-3.5-flash-lite"]);
  });

  it("essaie aussi le secours si le principal ne répond pas à temps", async () => {
    const { f, appels } = simuler({ principalLent: true });
    const r = await traiterQuestion(requete({ question: "Comment faire l'autopalpation ?" }), ENV, f);
    assert.equal(r.status, 200);
    assert.equal(appels.filter((a) => a.url.includes(":generateContent")).length, 2);
  });

  it("n'essaie pas le secours pour une autre erreur, et refuse une réponse tronquée (503)", async () => {
    const a = simuler({ principalStatut: 400 });
    assert.equal(
      (await traiterQuestion(requete({ question: "Comment faire l'autopalpation ?" }), ENV, a.f)).status,
      503,
    );
    assert.equal(a.appels.filter((x) => x.url.includes(":generateContent")).length, 1);
    const b = simuler({ finTronquee: true });
    assert.equal(
      (await traiterQuestion(requete({ question: "Comment faire l'autopalpation ?" }), ENV, b.f)).status,
      503,
    );
  });

  it("refuse sans connexion (401) et n'appelle ni Gemini ni la base", async () => {
    const { f, appels } = simuler();
    const r = await traiterQuestion(requete({ question: "Comment faire ?" }, null), ENV, f);
    assert.equal(r.status, 401);
    assert.equal(appels.length, 0);
  });

  it("refuse un jeton invalide (401)", async () => {
    const { f, appels } = simuler({ utilisateur: null });
    const r = await traiterQuestion(requete({ question: "Comment faire ?" }), ENV, f);
    assert.equal(r.status, 401);
    assert.ok(!appels.some((a) => a.url.includes("googleapis")));
  });

  it("applique le quota quotidien (429)", async () => {
    const { f, appels } = simuler({ quota: false });
    const r = await traiterQuestion(requete({ question: "Comment faire ?" }), ENV, f);
    assert.equal(r.status, 429);
    assert.ok(!appels.some((a) => a.url.includes("googleapis")));
  });

  it("rejette une question trop longue (400)", async () => {
    const { f } = simuler();
    const r = await traiterQuestion(requete({ question: "x".repeat(501) }), ENV, f);
    assert.equal(r.status, 400);
  });

  it("n'envoie AUCUNE donnée personnelle à Gemini", async () => {
    const { f, appels } = simuler();
    const question =
      "Je m'appelle Awa Ouédraogo, 70 12 34 56, awa@test.bf, née le 03/04/1985 : comment faire l'autopalpation ?";
    const r = await traiterQuestion(requete({ question }), ENV, f);
    assert.equal(r.status, 200);
    const versGoogle = appels
      .filter((a) => a.url.includes("googleapis"))
      .map((a) => a.corps)
      .join("\n");
    assert.ok(versGoogle.length > 0);
    for (const fuite of ["Awa", "Ouédraogo", "70 12 34 56", "awa@test.bf", "03/04/1985"]) {
      assert.ok(!versGoogle.includes(fuite), `fuite vers Gemini : ${fuite}`);
    }
    // La clé passe en en-tête, jamais dans l'URL
    assert.ok(appels.every((a) => !a.url.includes("cle-gemini-de-test")));
  });

  it("n'envoie ni historique ni profil : uniquement la question masquée et les sources", async () => {
    const { f, appels } = simuler();
    await traiterQuestion(
      requete({ question: "Comment faire l'autopalpation ?", historique: ["secret"], profil: { nom: "X" } }),
      ENV,
      f,
    );
    const gen = appels.find((a) => a.url.includes(":generateContent"))!;
    assert.ok(!gen.corps.includes("secret"));
    assert.equal(JSON.parse(gen.corps).contents.length, 1);
  });

  it("répond avec des citations construites par le serveur", async () => {
    const { f } = simuler();
    const corps = await (
      await traiterQuestion(requete({ question: "Comment faire l'autopalpation ?" }), ENV, f)
    ).json();
    assert.equal(corps.mode, "ia");
    assert.deepEqual(corps.sources, [
      { numero: 1, titre: "Autopalpation", source: "OMS (test)", url: "https://exemple.test/a" },
    ]);
    assert.match(corps.reponse, /ne remplace pas un soignant/);
  });

  it("n'appelle PAS le modèle si aucune fiche validée n'est assez proche", async () => {
    const { f, appels } = simuler({ fiches: FICHES.map((x) => ({ ...x, similarite: 0.3 })) });
    const corps = await (await traiterQuestion(requete({ question: "Qui va gagner le match ?" }), ENV, f)).json();
    assert.equal(corps.mode, "sans_source");
    assert.ok(!appels.some((a) => a.url.includes(":generateContent")));
  });

  it("ajoute toujours l'orientation d'urgence en cas de signe d'alerte, même si le modèle l'oublie", async () => {
    const { f } = simuler({
      reponseModele: {
        reponse: "Voici des informations générales sur le sujet.",
        sources_utilisees: [1],
        alerte: false,
        hors_sujet: false,
      },
    });
    const corps = await (await traiterQuestion(requete({ question: "Je saigne beaucoup du mamelon" }), ENV, f)).json();
    assert.equal(corps.alerte, true);
    assert.match(corps.reponse, /urgences/);
  });

  it("remplace une réponse de type diagnostic par un message prudent", async () => {
    const { f } = simuler({
      reponseModele: {
        reponse: "D'après ta description, tu as un cancer.",
        sources_utilisees: [1],
        alerte: false,
        hors_sujet: false,
      },
    });
    const corps = await (
      await traiterQuestion(requete({ question: "J'ai une boule, est-ce un cancer ?" }), ENV, f)
    ).json();
    assert.equal(corps.mode, "sans_source");
    assert.doesNotMatch(corps.reponse, /tu as un cancer/);
    assert.deepEqual(corps.sources, []);
  });

  it("rejette une source inventée par le modèle", async () => {
    const { f } = simuler({
      reponseModele: {
        reponse: "Réponse appuyée sur une source fantôme.",
        sources_utilisees: [9],
        alerte: false,
        hors_sujet: false,
      },
    });
    const corps = await (
      await traiterQuestion(requete({ question: "Comment faire l'autopalpation ?" }), ENV, f)
    ).json();
    assert.equal(corps.mode, "sans_source");
  });

  it("Mooré : réponse en français + fiche validée en Mooré, sans génération en Mooré", async () => {
    const { f, appels } = simuler({
      fichesLocales: [
        {
          id: 30,
          titre: "Autopalpation (Mooré)",
          contenu: "Texte validé en Mooré",
          source_titre: "OMS (test)",
          source_url: null,
          groupe: "boule",
        },
      ],
    });
    const corps = await (
      await traiterQuestion(requete({ question: "Comment faire l'autopalpation ?", langue: "moore" }), ENV, f)
    ).json();
    assert.equal(corps.ficheLangueLocale.contenu, "Texte validé en Mooré");
    assert.match(appels.find((a) => a.url.includes(":generateContent"))!.corps, /Réponds en français/);
  });

  it("renvoie 503 si Gemini est indisponible (repli FAQ côté application)", async () => {
    const { f } = simuler({ geminiEnPanne: true });
    const r = await traiterQuestion(requete({ question: "Comment faire l'autopalpation ?" }), ENV, f);
    assert.equal(r.status, 503);
    assert.equal((await r.json()).code, "indisponible");
  });

  it("renvoie 503 sans révéler de valeur si la configuration est incomplète", async () => {
    const { f } = simuler();
    const r = await traiterQuestion(requete({ question: "Comment faire ?" }), { ...ENV, GEMINI_API_KEY: "" }, f);
    assert.equal(r.status, 503);
    assert.doesNotMatch(await r.text(), /cle-/);
  });
});
