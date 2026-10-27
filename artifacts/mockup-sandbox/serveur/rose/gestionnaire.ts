/**
 * Gestionnaire HTTP de Rose IA (POST /api/rose-chat), indépendant de la plateforme :
 * il reçoit une Request standard et renvoie une Response (Vercel, serveur Vite local, tests).
 *
 * Étapes : connexion obligatoire → quota → masquage des données personnelles →
 * détection des signes d'alerte → recherche dans les fiches VALIDÉES → génération
 * contrainte (Gemini) → contrôle de la réponse → citations construites par le serveur.
 *
 * Confidentialité : aucune question n'est journalisée ; seul le texte masqué
 * de la question part vers le modèle, sans historique ni donnée de profil.
 */
import { detecterSignesAlerte, messageAlerte } from "./alertes";
import { consommerQuota, fichesEnLangue, rechercherFiches, verifierUtilisateur, type LigneRecherche } from "./base";
import { lireConfig, LONGUEUR_MAX_QUESTION, type Env } from "./config";
import { masquerDonneesPersonnelles } from "./confidentialite";
import { calculerEmbeddings, genererReponse, type Fetch } from "./gemini";
import { construireMessageUtilisateur, type LangueReponse, type SourceFiche } from "./prompt";
import { messagePrudent, validerReponse } from "./validation";

export type LangueApp = "fr" | "en" | "moore" | "dioula";

export interface SourceCitee {
  numero: number;
  titre: string;
  source: string | null;
  url: string | null;
}

export interface ReponseRose {
  mode: "ia" | "sans_source";
  reponse: string;
  sources: SourceCitee[];
  alerte: boolean;
  horsSujet: boolean;
  /** Fiche validée dans la langue locale demandée (Mooré / Dioula), si elle existe. */
  ficheLangueLocale?: { titre: string; contenu: string; source: string | null };
}

const RAPPEL = {
  fr: "Rose IA ne remplace pas un soignant.",
  en: "Rose AI does not replace a health worker.",
};

const json = (statut: number, corps: unknown) =>
  new Response(JSON.stringify(corps), {
    status: statut,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
const erreur = (statut: number, code: string, message: string) => json(statut, { code, message });

export async function traiterQuestion(requete: Request, env: Env, f: Fetch = fetch): Promise<Response> {
  if (requete.method !== "POST") return erreur(405, "methode", "Méthode non autorisée.");

  const config = lireConfig(env);
  if ("manquantes" in config) {
    // Ne jamais révéler de valeur ; le nom des variables manquantes suffit au diagnostic
    console.error(`[rose-chat] configuration incomplète : ${config.manquantes.join(", ")}`);
    return erreur(503, "indisponible", "Rose IA est momentanément indisponible.");
  }

  // 1. Connexion obligatoire (le quota gratuit est réservé aux comptes)
  const jeton = (requete.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!jeton) return erreur(401, "non_connecte", "Connectez-vous pour discuter avec Rose IA.");

  // 2. Lecture et contrôle de la question
  let corps: { question?: unknown; langue?: unknown };
  try {
    corps = await requete.json();
  } catch {
    return erreur(400, "requete", "Requête invalide.");
  }
  const question = typeof corps.question === "string" ? corps.question.trim() : "";
  if (question.length < 2 || question.length > LONGUEUR_MAX_QUESTION) {
    return erreur(400, "question", `La question doit faire entre 2 et ${LONGUEUR_MAX_QUESTION} caractères.`);
  }
  const langueApp: LangueApp = ["fr", "en", "moore", "dioula"].includes(corps.langue as string)
    ? (corps.langue as LangueApp)
    : "fr";
  // Pas de génération en Mooré ni en Dioula : réponse en français, fiche locale validée en complément
  const langue: LangueReponse = langueApp === "en" ? "en" : "fr";

  try {
    const utilisateur = await verifierUtilisateur(f, config, jeton);
    if (!utilisateur) return erreur(401, "non_connecte", "Session expirée : reconnectez-vous.");
    if (!(await consommerQuota(f, config, utilisateur))) {
      return erreur(429, "quota", "Vous avez atteint le nombre de questions du jour. Réessayez demain.");
    }

    // 3. Données personnelles masquées ; signes d'alerte détectés localement
    const { texte: questionMasquee } = masquerDonneesPersonnelles(question);
    const detection = detecterSignesAlerte(question);

    // 4. Recherche dans les fiches validées
    const [embedding] = await calculerEmbeddings(f, config.geminiCle, config.modeleEmbedding, [questionMasquee], "RETRIEVAL_QUERY");
    const resultats = (await rechercherFiches(f, config, embedding)).filter((r) => r.similarite >= config.seuilSimilarite);

    const terminer = (r: Omit<ReponseRose, "reponse"> & { reponse: string }) => {
      const morceaux = [];
      if (r.alerte) morceaux.push(messageAlerte(langue, detection.motifs));
      morceaux.push(r.reponse);
      if (!r.horsSujet) morceaux.push(RAPPEL[langue]);
      return json(200, { ...r, reponse: morceaux.join("\n\n") });
    };

    // Aucune fiche validée pertinente : pas d'appel au modèle
    if (resultats.length === 0) {
      return terminer({ mode: "sans_source", reponse: messagePrudent(langue), sources: [], alerte: detection.alerte, horsSujet: false });
    }

    // 5. Une source par fiche (le meilleur morceau), numérotée
    const parFiche = new Map<number, LigneRecherche>();
    for (const r of resultats) if (!parFiche.has(r.fiche_id)) parFiche.set(r.fiche_id, r);
    const lignes = [...parFiche.values()];
    const sources: SourceFiche[] = lignes.map((l, i) => ({ numero: i + 1, titre: l.titre, extrait: l.morceau }));

    // 6. Génération contrainte puis contrôle
    const brut = await genererReponse(f, config.geminiCle, config.modele, construireMessageUtilisateur(questionMasquee, sources, langue));
    const v = validerReponse(brut, sources.length, langue);
    const alerte = detection.alerte || v.alerte;
    if (!v.ok) {
      return terminer({ mode: "sans_source", reponse: v.reponse, sources: [], alerte, horsSujet: false });
    }

    // 7. Citations construites par le serveur à partir de la base (jamais du texte du modèle)
    const citees: SourceCitee[] = v.sourcesUtilisees.map((n) => {
      const l = lignes[n - 1];
      return { numero: n, titre: l.titre, source: l.source_titre, url: l.source_url };
    });

    let ficheLangueLocale: ReponseRose["ficheLangueLocale"];
    if (!v.horsSujet && (langueApp === "moore" || langueApp === "dioula")) {
      const groupes = v.sourcesUtilisees.map((n) => lignes[n - 1].groupe).filter((g): g is string => Boolean(g));
      const [locale] = await fichesEnLangue(f, config, groupes, langueApp);
      if (locale) ficheLangueLocale = { titre: locale.titre, contenu: locale.contenu, source: locale.source_titre };
    }

    return terminer({ mode: "ia", reponse: v.reponse, sources: citees, alerte, horsSujet: v.horsSujet, ficheLangueLocale });
  } catch (e) {
    // Message générique : aucune donnée de la question dans les journaux
    console.error(`[rose-chat] ${(e as Error).name} : ${(e as Error).message}`);
    return erreur(503, "indisponible", "Rose IA est momentanément indisponible.");
  }
}
