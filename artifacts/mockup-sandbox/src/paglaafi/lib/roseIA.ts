/**
 * Client de Rose IA en mode réel : appelle POST /api/rose-chat (fonction serveur).
 *
 * Seuls la question et la langue sont envoyées — jamais le profil, le cycle, les
 * rappels ni l'historique de la discussion. En cas d'absence de réseau, de
 * session, de quota atteint ou d'indisponibilité, repli sur la FAQ locale.
 */
import type { SourceRose } from "../types";
import { repondreDepuisFaq } from "./faqRose";
import { client } from "./supabase";

export type LangueRose = "fr" | "en" | "moore" | "dioula";

export interface ResultatRose {
  texte: string;
  textesLocaux: { moore?: string; dioula?: string };
  sources: SourceRose[];
  origine: "ia" | "sans_source" | "faq";
  alerte: boolean;
}

// Large : avec un modèle saturé, le serveur peut essayer le modèle de secours (repli FAQ au-delà)
const DELAI_MS = 25000;

async function repli(question: string, langue: LangueRose, note?: string): Promise<ResultatRose> {
  const faq = await repondreDepuisFaq(question, langue, note);
  return {
    texte: faq.texte,
    textesLocaux: langue === "moore" || langue === "dioula" ? { [langue]: faq.texteLangueLocale } : {},
    sources: faq.sources,
    origine: "faq",
    alerte: faq.alerte,
  };
}

export async function demanderARose(question: string, langue: LangueRose): Promise<ResultatRose> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return repli(
      question,
      langue,
      "Mode hors connexion : réponse tirée des fiches validées enregistrées sur l'appareil.",
    );
  }
  const { data } = await client().auth.getSession();
  const jeton = data.session?.access_token;
  if (!jeton) {
    return repli(
      question,
      langue,
      "Connectez-vous pour discuter avec Rose IA. En attendant, voici les fiches validées disponibles.",
    );
  }

  const ctrl = new AbortController();
  const minuteur = setTimeout(() => ctrl.abort(), DELAI_MS);
  try {
    const r = await fetch("/api/rose-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${jeton}` },
      body: JSON.stringify({ question, langue }),
      signal: ctrl.signal,
    });
    if (r.status === 429)
      return repli(question, langue, "Vous avez atteint le nombre de questions du jour pour Rose IA.");
    if (!r.ok)
      return repli(question, langue, "Rose IA est momentanément indisponible : réponse tirée des fiches validées.");
    const corps = await r.json();
    const locale = corps.ficheLangueLocale?.contenu as string | undefined;
    return {
      texte: corps.reponse,
      textesLocaux: locale ? { [langue]: locale } : {},
      sources: (corps.sources ?? []).map((s: { titre: string; source: string | null; url: string | null }) => ({
        titre: s.titre,
        source: s.source,
        url: s.url,
      })),
      origine: corps.mode === "ia" ? "ia" : "sans_source",
      alerte: corps.alerte === true,
    };
  } catch {
    return repli(question, langue, "Connexion à Rose IA impossible : réponse tirée des fiches validées.");
  } finally {
    clearTimeout(minuteur);
  }
}
