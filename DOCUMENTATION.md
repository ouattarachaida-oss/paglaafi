# PagLaafi — Documentation

> Document de référence du projet (voir AGENTS.md) : à tenir à jour à chaque modification
> structurelle. Dernière refonte : octobre 2026 (branche `refonte/socle`, phases 0 à 5).

## 1. Présentation

**PagLaafi** est une application web mobile (PWA) d'**information, d'orientation et de
solidarité** autour du cancer du sein, destinée d'abord au **Burkina Faso**. Elle s'adresse
aux femmes, aux centres de santé, aux soignants, aux associations et au superadmin national.

Ce que l'application **n'est pas** : un service médical. Elle ne pose aucun diagnostic,
ne prescrit rien, et **Rose IA ne remplace pas un soignant** (rappel affiché à chaque
ouverture de Rose IA).

Interface en français (contenus aussi en anglais, mooré et dioula), identité rose et
blanche, conception mobile d'abord.

## 2. Où se trouve le code

Monorepo pnpm. **L'application réellement utilisée est `artifacts/mockup-sandbox`** (React + Vite).

```
artifacts/mockup-sandbox/
├── src/paglaafi/            Application
│   ├── PagLaafiApp.tsx       Point d'entrée : routeur (wouter) → état partagé → coquille
│   ├── routes.ts             Une adresse par onglet (/, /centres, /cycle, /comprendre, /rose-ia, /dons, /annonces, /accompagnant, /confidentialite)
│   ├── config.ts             Mode démo / mode réel
│   ├── types.ts              Types partagés (dont champs audio MP3 Mooré/Dioula à venir)
│   ├── donnees/              Données statiques typées (démo), politique de confidentialité, réponses de Rose (démo)
│   ├── depot/                Accès aux données Supabase (mode réel)
│   ├── etat/                 État partagé par domaine (contextes React : useAuth, useCentres, useSante, useRose…)
│   ├── composants/           Coquille, en-tête, menu, navigation, consentement, politique, badges
│   ├── ecrans/               Un fichier par onglet
│   ├── modales/              Modales et espaces professionnels (superadmin, admin, docteur…)
│   └── lib/                  Utilitaires (Supabase, Rose IA, FAQ hors-ligne, stockage chiffré, sécurité)
├── serveur/                  Code serveur (Rose IA, suppression de compte, PWA, API locale Vite)
├── api/                      Fonctions serverless Vercel (rose-chat, supprimer-compte)
├── public/                   Images, icônes PWA, FAQ hors-ligne de Rose IA (faq-rose.json)
└── vercel.json               Déploiement Vercel
supabase/
├── migrations/               Schéma, fonctions, règles RLS, Rose IA (pgvector)
├── seed.sql                  Données initiales NON VÉRIFIÉES (centres, associations, fiches en attente)
├── scripts/                  Migrations, nomination du superadmin, indexation de Rose IA
└── tests/                    Tests RLS, questions pièges de Rose IA
docs/deploiement-vercel.md    Guide de déploiement (variables d'environnement, secrets)
```

**Non utilisés par l'application** (conservés, ils appartiennent à l'équipe) :
`artifacts/paglaafi` (squelette Expo), `artifacts/api-server`, `artifacts/paglaafi-film`,
`lib/db`, `lib/api-spec`, `lib/api-client-react`, `lib/api-zod`, `scripts/`.

## 3. Démarrer en local

Prérequis : Node.js 24 et pnpm 10 (sans installation globale : `npx pnpm@10 …`).

```bash
pnpm install
cp artifacts/mockup-sandbox/.env.example artifacts/mockup-sandbox/.env   # puis compléter
cp supabase/.env.example supabase/.env                                   # secrets serveur, puis compléter
pnpm run dev            # http://localhost:5173 (cet ordinateur uniquement)
pnpm run dev:lan        # démo sur le Wi-Fi local (smartphones) ; les fichiers .bat font de même
```

L'installation fonctionne normalement sous Windows, macOS et Linux.

## 4. Mode démo et mode réel

| | Mode démo (`VITE_MODE_DEMO=true`) | Mode réel (`VITE_MODE_DEMO=false`) |
|---|---|---|
| Usage | Compétition, présentation | Utilisation réelle |
| Comptes | 5 accès rapides fictifs | Email + mot de passe (Supabase) |
| Données | Fictives, sur l'appareil | Supabase (règles RLS) + appareil |
| Repère visuel | Pastille « Démo · données fictives » | Badges « Simulation » sur ce qui reste simulé |
| Rose IA | Moteur par mots-clés | Fiches validées + Gemini (RAG), repli FAQ |
| Centres | 5 centres de démonstration | Seuls les centres **vérifiés** sont affichés |
| Numéro vert | Affiché « à vérifier » | Masqué tant qu'il n'est pas confirmé |

Sans `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`, l'application repasse en mode démo.

## 5. Rôles et règles métier (appliqués par la base en mode réel)

| Rôle | Peut | Ne peut pas |
|---|---|---|
| Utilisatrice | Profil, rappels, cycle, Rose IA, demande d'adhésion | Voir les données des autres, se donner un rôle |
| Admin centre | Mettre à jour les **disponibilités de son centre**, publier des annonces (en attente) | Modifier l'identité ou la vérification d'un centre, un autre centre |
| Docteur | Idem centre (son centre), **proposer des fiches** de Rose IA | Valider ses propres fiches |
| Docteur validateur (désigné) | Valider ou refuser les fiches des autres, avec source officielle | Valider sa propre fiche (quatre yeux) |
| Admin association | Modifier son association, publier des annonces (en attente) | Modifier les centres, se vérifier |
| Superadmin | Valider annonces et adhésions (attribution des rôles), vérifier centres et associations, désigner les validateurs | — |

- Inscription : profil créé avec le rôle utilisatrice ; tout rôle envoyé par le client est ignoré.
- Le premier superadmin est nommé hors application : `pnpm run db:superadmin -- <email>`.
- Une annonce est toujours créée « en attente » ; seules les annonces publiées sont visibles du public.

## 6. Rose IA

- **Mode réel** : réservé aux comptes connectés (quota quotidien). La question seule
  (≤ 500 caractères, sans profil ni historique) est envoyée au serveur, qui masque les
  données personnelles, détecte les signes d'alerte, cherche dans les **fiches validées**
  (pgvector), fait générer une réponse contrainte par Gemini, la contrôle (sources
  existantes, aucun diagnostic ni posologie) et construit lui-même les citations.
  Sans fiche validée pertinente, Gemini n'est pas appelé.
- **Repli** : FAQ locale (`public/faq-rose.json`, fiches validées seulement) hors connexion,
  sans compte, quota atteint ou service indisponible.
- **Mooré / Dioula** : pas de génération automatique ; fiche validée dans la langue si elle existe.
- **Mode Docteur** (« Fiches Rose IA ») : proposer → relecture par un autre validateur avec
  source → indexation par `pnpm run rag:indexer` (puis committer `faq-rose.json`).
- **Mode démo** : moteur par mots-clés (`donnees/reponsesRose.ts`).

## 7. Confidentialité

- **Consentement** à la première utilisation (résumé clair + politique complète, `/confidentialite`).
- **Sur l'appareil (mode réel)** : cycle, autopalpation et historique rattachés au compte et
  **chiffrés** (AES-GCM, clé par compte non exportable, conservée par le navigateur).
  Limites assumées : aucune protection contre l'usage du téléphone déverrouillé avec la session
  ouverte ; effacer les données du navigateur efface la clé (données perdues).
- **En ligne (Supabase)** : compte, profil, rappels, demandes, annonces, fiches, compteur de questions.
- **Gemini** : question anonymisée uniquement ; l'offre gratuite de Google peut utiliser ces échanges.
- **Supprimer mes données** (menu Confidentialité & Données) : supprime le compte et ses données
  en base (fonction serveur `/api/supprimer-compte`, confirmation « SUPPRIMER ») et les données
  de l'appareil. Se déconnecter ne supprime rien.
- Le don « anonyme » masque le nom et le numéro à l'affichage (aucun chiffrement n'est revendiqué).
- Contact de confidentialité : **à renseigner** dans `donnees/confidentialite.ts`.

## 8. Hors-ligne (PWA)

`vite-plugin-pwa` (configuration : `serveur/pwa.ts`) : précache dès la première visite
(bundles, index.html, icônes, logo, image de démarrage, FAQ de Rose IA), mise à jour
automatique à chaque déploiement, tuiles de carte et images mises en cache à la consultation.
Aucun service worker en développement. Icônes 192, 512 et maskable dans `public/icons/`.
Leaflet est installé via npm (plus d'unpkg).

## 9. Commandes (racine du dépôt)

| Commande | Rôle |
|---|---|
| `pnpm run dev` / `dev:lan` | Développement (local / réseau Wi-Fi) |
| `pnpm run build` | Build de production de l'application |
| `pnpm run typecheck` | Vérification TypeScript (bibliothèques + application) |
| `pnpm run db:migrer [-- --seed]` | Appliquer les migrations Supabase (via le session pooler) |
| `pnpm run db:superadmin -- <email>` | Nommer un superadmin |
| `pnpm run db:test-rls` | Tests des règles d'accès (comptes de test créés puis supprimés) |
| `pnpm run rag:indexer [-- --tout]` | Indexer les fiches validées et exporter la FAQ |
| `pnpm run rag:faq` | Exporter seulement la FAQ hors-ligne |
| `pnpm run test:rose` | Tests unitaires du serveur (Rose IA, suppression de compte) |
| `pnpm run test:rose-pieges` | Questions pièges contre le vrai Gemini |

Secrets : `supabase/.env` (clé secrète, mot de passe et pooler de la base, `GEMINI_API_KEY`) ;
`artifacts/mockup-sandbox/.env` (variables publiques `VITE_…`). Aucun `.env` n'est versionné.
Déploiement : voir `docs/deploiement-vercel.md`.

## 10. Ce qui reste simulé

Signalé par un badge « Simulation » en mode réel :
- paiement Orange Money et tableau de bord des dons ;
- orientations d'urgence (docteur → centre) ;
- statistiques du superadmin ;
- vidéo d'autopalpation (images animées, vidéo à produire et valider).

## 11. À valider avant toute publication

- **Numéros** : numéro vert « 80 00 11 22 », téléphones des centres, associations et annonces,
  numéros des comptes de démonstration (certains pourraient appartenir à de vraies personnes).
- **Centres** : statuts, files d'attente, tarifs, horaires, coordonnées (à confirmer auprès des
  structures, puis « vérifier » dans le panneau superadmin).
- **Associations** : missions et chiffres d'impact.
- **Traductions mooré et dioula** : à faire relire par des locuteurs (incohérence repérée dans
  le message de Schiphra).
- **Contenu médical** : les 36 fiches initiales de Rose IA (sources suggérées à vérifier), les
  réponses par mots-clés du mode démo, les leçons, les conseils du jour, la fenêtre
  d'autopalpation, la fréquence du dépistage du col (« tous les 3 ans »).
- **Confidentialité** : contact à renseigner, région d'hébergement Supabase, conditions en vigueur
  de l'offre gratuite de Gemini et nom du modèle.

## 12. Conventions

UTF-8 sans BOM ; commentaires en français ; dates JJ/MM/AAAA ; montants en FCFA ; fuseau GMT ;
TypeScript uniquement (jamais de Python) ; aucune clé secrète dans le code ni dans une variable `VITE_`.

## 13. Historique

La première version (maquette Replit) tenait dans un seul fichier de 8 300 lignes, avec des
fonctions simulées présentées comme réelles. La refonte d'octobre 2026 a découpé l'application
(phase 1), ajouté Supabase (phase 2), Rose IA réelle par RAG (phase 3), l'honnêteté et la
confidentialité (phase 4), puis la PWA hors-ligne et le nettoyage (phase 5). Les étiquettes Git
`backup-*` conservent les états antérieurs.
