# Déployer PagLaafi sur Vercel

Ce guide s'adresse à la personne qui crée le projet Vercel (propriétaire du dépôt GitHub).
Vercel héberge à la fois l'application (site Vite) et la fonction serveur de Rose IA
(`/api/rose-chat`). Formule gratuite **Hobby** : réservée à un usage non commercial
(adaptée à la compétition ; prévoir une formule payante en cas d'exploitation commerciale).

## 1. Créer le projet

1. Se connecter sur <https://vercel.com> avec le compte GitHub propriétaire du dépôt.
2. **Add New… → Project**, puis importer le dépôt `paglaafi`.
3. Réglages du projet :

| Réglage | Valeur |
|---|---|
| Framework Preset | **Vite** |
| Root Directory | **`artifacts/mockup-sandbox`** (bouton « Edit ») |
| Include files outside the Root Directory | **activé** (nécessaire pour le workspace pnpm) |
| Install Command | laisser la valeur de `vercel.json` |
| Build Command | `pnpm run build` (déjà dans `vercel.json`) |
| Output Directory | `dist` (déjà dans `vercel.json`) |
| Production Branch | `main` ; la branche `refonte/socle` obtient une URL de prévisualisation |

Le fichier `artifacts/mockup-sandbox/vercel.json` fixe aussi :
- la **région** de la fonction (`iad1`, États-Unis) : l'API Gemini n'est pas disponible partout, et l'offre gratuite de Gemini a des restrictions dans certaines régions (UE, Royaume-Uni, Suisse) — à vérifier dans les conditions de Google avant de changer de région ;
- la durée maximale de la fonction Rose IA (30 s) ;
- la redirection de toutes les adresses de l'application vers `index.html` (routage par onglets), sauf `/api/…`.

4. Saisir les variables d'environnement (section 2), puis **Deploy**.

## 2. Variables d'environnement (Settings → Environment Variables)

Ne jamais coller de valeur dans le dépôt, un ticket ou une discussion. Les saisir
uniquement dans Vercel, pour les environnements **Production** et **Preview**.

### Variables publiques (incluses dans le code envoyé au navigateur)

| Nom | Rôle |
|---|---|
| `VITE_SUPABASE_URL` | Adresse du projet Supabase (`https://<projet>.supabase.co`). |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clé **publishable** Supabase (commence par `sb_publishable_`). Publique par nature : les données sont protégées par les règles RLS. |
| `VITE_MODE_DEMO` | `true` : mode démo de la compétition (données fictives, bandeau « Démo », aucun appel à Supabase ni à Rose IA réelle). `false` : mode réel. |

### Variables secrètes (lues uniquement par la fonction serveur `/api/rose-chat`)

| Nom | Rôle |
|---|---|
| `GEMINI_API_KEY` | Clé de l'API Gemini (Google AI Studio). Sert aux embeddings et aux réponses de Rose IA. |
| `SUPABASE_SECRET_KEY` | Clé **secrète** Supabase (commence par `sb_secret_`). Permet à la fonction d'appeler la recherche dans les fiches validées et le quota. Donne un accès total à la base : **strictement secrète**. |

### Variables facultatives (valeurs par défaut raisonnables)

| Nom | Rôle | Défaut |
|---|---|---|
| `GEMINI_MODEL` | Modèle de génération (vérifier le nom en vigueur dans Google AI Studio). | `gemini-2.5-flash` |
| `GEMINI_EMBEDDING_MODEL` | Modèle d'embeddings. **Doit rester celui utilisé pour l'indexation** (sinon ré-indexer avec `pnpm run rag:indexer -- --tout`). | `gemini-embedding-001` |
| `ROSE_QUOTA_JOUR` | Nombre maximal de questions par compte et par jour. | `30` |
| `ROSE_SEUIL_SIMILARITE` | Proximité minimale (0 à 1) entre la question et une fiche pour que Rose IA réponde. | `0.65` |
| `ROSE_NOMBRE_SOURCES` | Nombre de passages de fiches transmis au modèle. | `4` |

## 3. Ce qu'il ne faut JAMAIS mettre en `VITE_`

Toute variable dont le nom commence par `VITE_` est **copiée en clair dans le code
JavaScript téléchargé par chaque visiteur**. Donc jamais :

- `GEMINI_API_KEY` (pas de `VITE_GEMINI_API_KEY`) ;
- `SUPABASE_SECRET_KEY` (pas de `VITE_SUPABASE_SECRET_KEY`) ni toute clé `sb_secret_…` ;
- le mot de passe de la base (`SUPABASE_DB_PASSWORD`) ni l'adresse du pooler : ils ne servent
  qu'aux scripts lancés en local et **n'ont rien à faire sur Vercel** ;
- aucun autre jeton, mot de passe ou clé d'API.

Vérification après déploiement : dans le navigateur, afficher le code source des fichiers
`/assets/*.js` et rechercher `sb_secret_` ou un morceau de la clé Gemini : il ne doit y avoir
**aucun résultat** (seule la chaîne littérale `sb_secret_` utilisée par la bibliothèque
Supabase peut apparaître, sans clé derrière).

## 4. Après le déploiement

- Ouvrir l'URL, se connecter avec un compte (mode réel) et poser une question à Rose IA.
  Sans fiche validée et indexée, Rose IA répond qu'elle n'a pas d'information validée : c'est normal.
- La FAQ hors-ligne (`public/faq-rose.json`) est publiée avec le site : la régénérer avec
  `pnpm run rag:indexer` (ou `pnpm run rag:faq`) après chaque validation de fiches, puis committer.
- Les journaux de la fonction (Vercel → Logs) ne contiennent jamais le texte des questions.
- En cas d'erreur 503 de Rose IA : vérifier que `GEMINI_API_KEY` et `SUPABASE_SECRET_KEY`
  sont bien définies pour l'environnement concerné (Production / Preview), puis redéployer.
