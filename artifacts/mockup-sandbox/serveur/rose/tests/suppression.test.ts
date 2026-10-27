/**
 * Tests de POST /api/supprimer-compte avec Supabase SIMULÉ.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { traiterSuppression } from "../../compte/suppression";

const ENV = {
  SUPABASE_SECRET_KEY: "cle-secrete-de-test",
  VITE_SUPABASE_URL: "https://projet-test.supabase.co",
  VITE_SUPABASE_PUBLISHABLE_KEY: "cle-publique-de-test",
};
const ID = "11111111-2222-3333-4444-555555555555";

function simuler(opts: { utilisateur?: string | null; suppressionOk?: boolean } = {}) {
  const appels: Array<{ url: string; methode: string; entetes: Record<string, string> }> = [];
  const f = (async (url: string, init: RequestInit = {}) => {
    appels.push({ url, methode: init.method ?? "GET", entetes: (init.headers ?? {}) as Record<string, string> });
    if (url.endsWith("/auth/v1/user")) {
      return opts.utilisateur === null
        ? new Response("{}", { status: 401 })
        : new Response(JSON.stringify({ id: opts.utilisateur ?? ID }));
    }
    if (url.includes("/auth/v1/admin/users/"))
      return new Response("{}", { status: opts.suppressionOk === false ? 500 : 200 });
    return new Response("{}", { status: 404 });
  }) as typeof fetch;
  return { f, appels };
}

const requete = (corps: object, jeton: string | null = "jeton-valide") =>
  new Request("http://localhost/api/supprimer-compte", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(jeton ? { Authorization: `Bearer ${jeton}` } : {}) },
    body: JSON.stringify(corps),
  });

describe("suppression du compte", () => {
  it("refuse sans connexion (401) sans rien supprimer", async () => {
    const { f, appels } = simuler();
    const r = await traiterSuppression(requete({ confirmation: "SUPPRIMER" }, null), ENV, f);
    assert.equal(r.status, 401);
    assert.equal(appels.length, 0);
  });

  it("exige la confirmation explicite (400)", async () => {
    const { f, appels } = simuler();
    for (const confirmation of [undefined, "", "oui", "supprimer"]) {
      const r = await traiterSuppression(requete({ confirmation }), ENV, f);
      assert.equal(r.status, 400);
    }
    assert.ok(!appels.some((a) => a.methode === "DELETE"));
  });

  it("refuse un jeton invalide (401)", async () => {
    const { f, appels } = simuler({ utilisateur: null });
    const r = await traiterSuppression(requete({ confirmation: "SUPPRIMER" }), ENV, f);
    assert.equal(r.status, 401);
    assert.ok(!appels.some((a) => a.methode === "DELETE"));
  });

  it("supprime UNIQUEMENT le compte du jeton, même si un autre identifiant est fourni", async () => {
    const { f, appels } = simuler();
    const r = await traiterSuppression(
      requete({ confirmation: "SUPPRIMER", id: "99999999-9999-9999-9999-999999999999", user_id: "autre" }),
      ENV,
      f,
    );
    assert.equal(r.status, 200);
    const suppressions = appels.filter((a) => a.methode === "DELETE");
    assert.equal(suppressions.length, 1);
    assert.ok(suppressions[0].url.endsWith(`/auth/v1/admin/users/${ID}`));
    // Clé secrète utilisée seulement pour l'appel d'administration
    assert.equal(appels.find((a) => a.url.endsWith("/auth/v1/user"))!.entetes.apikey, "cle-publique-de-test");
  });

  it("refuse un identifiant de compte malformé", async () => {
    const { f, appels } = simuler({ utilisateur: "../../autre-route" });
    const r = await traiterSuppression(requete({ confirmation: "SUPPRIMER" }), ENV, f);
    assert.equal(r.status, 401);
    assert.ok(!appels.some((a) => a.methode === "DELETE"));
  });

  it("renvoie 503 si la suppression échoue ou si la configuration manque", async () => {
    const { f } = simuler({ suppressionOk: false });
    assert.equal((await traiterSuppression(requete({ confirmation: "SUPPRIMER" }), ENV, f)).status, 503);
    const r = await traiterSuppression(requete({ confirmation: "SUPPRIMER" }), { ...ENV, SUPABASE_SECRET_KEY: "" }, f);
    assert.equal(r.status, 503);
    assert.doesNotMatch(await r.text(), /cle-/);
  });
});
