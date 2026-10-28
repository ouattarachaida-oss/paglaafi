/**
 * Appels à l'API Gemini (Google AI) — côté serveur uniquement.
 * La clé est transmise dans l'en-tête x-goog-api-key, jamais dans l'URL.
 */
import { DIMENSION_EMBEDDING } from "./config";
import { INSTRUCTIONS_SYSTEME, SCHEMA_REPONSE } from "./prompt";

const BASE = "https://generativelanguage.googleapis.com/v1beta";

export type Fetch = typeof fetch;

export class ErreurGemini extends Error {
  statut: number;
  constructor(message: string, statut: number) {
    super(message);
    this.statut = statut;
  }
}

/** Normalisation L2 (recommandée pour les embeddings de dimension réduite). */
export function normaliser(v: number[]): number[] {
  const n = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map((x) => x / n);
}

async function appeler(f: Fetch, url: string, cle: string, corps: unknown, delaiMs = 20000) {
  const ctrl = new AbortController();
  const minuteur = setTimeout(() => ctrl.abort(), delaiMs);
  try {
    const r = await f(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": cle },
      body: JSON.stringify(corps),
      signal: ctrl.signal,
    });
    if (!r.ok) throw new ErreurGemini(`Gemini a répondu ${r.status}`, r.status);
    return await r.json();
  } catch (e) {
    if ((e as Error).name === "AbortError") throw new ErreurGemini("Gemini n'a pas répondu à temps", 504);
    throw e;
  } finally {
    clearTimeout(minuteur);
  }
}

/** Embedding d'une question (recherche) ou de documents (indexation). */
export async function calculerEmbeddings(
  f: Fetch,
  cle: string,
  modele: string,
  textes: string[],
  tache: "RETRIEVAL_QUERY" | "RETRIEVAL_DOCUMENT",
): Promise<number[][]> {
  const json = await appeler(f, `${BASE}/models/${modele}:batchEmbedContents`, cle, {
    requests: textes.map((t) => ({
      model: `models/${modele}`,
      content: { parts: [{ text: t }] },
      taskType: tache,
      outputDimensionality: DIMENSION_EMBEDDING,
    })),
  });
  const vecteurs: number[][] = (json.embeddings ?? []).map((e: { values: number[] }) => normaliser(e.values));
  if (vecteurs.length !== textes.length || vecteurs.some((v) => v.length !== DIMENSION_EMBEDDING)) {
    throw new ErreurGemini("Embeddings de dimension inattendue", 502);
  }
  return vecteurs;
}

/** Génération de la réponse (JSON structuré imposé). */
export async function genererReponse(
  f: Fetch,
  cle: string,
  modele: string,
  messageUtilisateur: string,
  reflexion = "minimal",
  delaiMs = 8000,
  instructions = INSTRUCTIONS_SYSTEME,
): Promise<unknown> {
  const json = await appeler(
    f,
    `${BASE}/models/${modele}:generateContent`,
    cle,
    {
      systemInstruction: { parts: [{ text: instructions }] },
      contents: [{ role: "user", parts: [{ text: messageUtilisateur }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 800,
        responseMimeType: "application/json",
        responseSchema: SCHEMA_REPONSE,
        // Sans réglage, la réflexion des modèles Gemini 3 consomme le plafond de sortie (JSON tronqué)
        thinkingConfig: { thinkingLevel: reflexion },
      },
      safetySettings: [
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
    },
    delaiMs,
  );
  const candidat = json?.candidates?.[0];
  if (candidat?.finishReason === "MAX_TOKENS")
    throw new ErreurGemini("Réponse tronquée (plafond de sortie atteint)", 502);
  const texte =
    candidat?.content?.parts
      ?.filter((p: { thought?: boolean }) => !p.thought)
      .map((p: { text?: string }) => p.text ?? "")
      .join("") ?? "";
  if (!texte) throw new ErreurGemini("Réponse vide ou bloquée par les filtres de sécurité", 502);
  return texte;
}
