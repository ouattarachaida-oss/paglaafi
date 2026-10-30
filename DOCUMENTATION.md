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
│   ├── composants/           Coquille responsive, en-tête, menu, navigation, consentement, politique
│   │   └── ui/               Composants du design system (boutons, champs, badges, feuilles…)
│   ├── ecrans/               Un fichier par onglet
│   ├── modales/              Modales et espaces professionnels (superadmin, admin, docteur…)
│   └── lib/                  Utilitaires (Supabase, Rose IA, FAQ hors-ligne, stockage chiffré, sécurité)
├── serveur/                  Code serveur (Rose IA, suppression de compte, PWA, API locale Vite)
├── api/                      Fonctions serverless Vercel (rose-chat, supprimer-compte)
├── public/                   Images, icônes PWA, FAQ hors-ligne de Rose IA (faq-rose.json)
├── vercel.json               Déploiement Vercel (mode sous-dossier)
api/                          Points d'entrée serverless racine pour Vercel (rose-chat, supprimer-compte)
vercel.json                   Configuration Vercel à la racine du monorepo (déploiement multi-services)
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

- **Mode réel & Démo connectée** : Rose IA appelle prioritairement le modèle d'IA Google Gemini via la fonction serveur `/api/rose-chat`. La question seule (≤ 500 caractères, sans profil ni historique) est envoyée au serveur, qui masque les données personnelles, détecte les signes d'alerte, injecte le contexte des **fiches cliniques validées** et fait générer une réponse bienveillante et empathique par Gemini, strictement contrôlée (aucun diagnostic ni posologie). En mode invité/démo, des fiches cliniques de secours sont injectées pour garantir la réponse de Gemini même si Supabase n'est pas synchronisé.
- **Repli automatique** : FAQ locale (`public/faq-rose.json`, fiches validées seulement) hors connexion ou en cas de coupure réseau complète.
- **Mooré / Dioula** : pas de génération automatique ; fiche validée dans la langue si elle existe.
- **Mode Docteur** (« Fiches Rose IA ») : proposer → relecture par un autre validateur avec source → indexation par `pnpm run rag:indexer` (puis committer `faq-rose.json`).
- **Quiz interactif Rose IA** : module éducatif et bienveillant (`donnees/quizRose.ts`, `modales/ModaleQuizRose.tsx`) permettant de tester ses connaissances sur l'autopalpation, le dépistage précoce et les signes d'alerte, avec explications orales et scores.
- **Accès direct Vidéo & Guide des gestes depuis Rose IA** : Rose IA propose la suggestion rapide `📹 Vidéo dépistage` et propose deux actions directes sur les questions d'autopalpation ou de vidéo : `Voir le guide des 4 gestes` et `Voir la vidéo`.
- **Voix Féminine Prioritaire & Prosodie** : sélection impérative d'une voix féminine (`lib/voix.ts` et `useEtatAudio.ts`, filtrage sur Hortense, Julie, Amélie, Céline, Virginie, Marie, etc., avec exclusion formelle des voix masculines comme Paul/Thomas), hauteur vocale réglée à 1.15 (pitch féminin doux et chaleureux) et débit à 0.98.
- **Accessibilité audio & Synthèse vocale** : normalisation phonétique (`lib/voix.ts` et `useEtatAudio.ts`) : conversion automatique des ligatures françaises (`œ` en `oe`, résolvant définitivement le bug de prononciation « sue » pour « soeur » sur tous les moteurs Web Speech mobiles/desktop), nettoyage des balises Markdown (astérisques, liens, titres) et articulation des acronymes (« Rose I-A », « Pag-Laafi »).

## 7. Confidentialité

- **Consentement** à la première utilisation (résumé clair + politique complète, `/confidentialite`).
- **Sur l'appareil (mode réel)** : cycle, autopalpation, historique et copie du profil (pour l'usage
  hors connexion) rattachés au compte et
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
| `pnpm run db:centres-osm [-- --appliquer [--verifier]]` | Importer les structures de santé de référence depuis OpenStreetMap (aperçu par défaut) |
| `pnpm run db:test-rls` | Tests des règles d'accès (comptes de test créés puis supprimés) |
| `pnpm run rag:indexer [-- --tout]` | Indexer les fiches validées et exporter la FAQ |
| `pnpm run rag:faq` | Exporter seulement la FAQ hors-ligne |
| `pnpm run rag:calibrer` | Mesurer le seuil de similarité de Rose IA (lecture seule, à refaire après validation des fiches) |
| `pnpm run test:rose` | Tests unitaires du serveur (Rose IA, suppression de compte) |
| `pnpm run test:rose-pieges` | Questions pièges contre le vrai Gemini |

Secrets : `supabase/.env` (clé secrète, mot de passe et pooler de la base, `GEMINI_API_KEY`) ;
`artifacts/mockup-sandbox/.env` (variables publiques `VITE_…`). Aucun `.env` n'est versionné.
Déploiement : voir `docs/deploiement-vercel.md`.

## 10. Vidéo médicale et Guide des 4 gestes

- **Vidéo d'autopalpation et de dépistage** : configurée dans `donnees/guideGestes.ts` (`VIDEO_AUTOPALPATION`). Elle intègre la vidéo officielle (`https://www.youtube.com/watch?v=FZvckWXec6w`) via un lecteur responsive `iframe` YouTube sans cookies tiers (`youtube-nocookie.com/embed/FZvckWXec6w`). Ce format offre un streaming adaptatif automatique (de 240p à 1080p selon le réseau mobile au Burkina Faso) sans nécessiter de compression manuelle ni de stockage lourd sur l'appareil.
- **Accès direct après les 4 gestes** : dans `composants/GuideGestes.tsx`, un encart avec le bouton `Voir la vidéo` est automatiquement affiché à la suite des étapes pour permettre à l'utilisatrice de visionner immédiatement la démonstration médicale.
- **Modale unifiée `ModaleGuideGestes.tsx`** : onglets segmentés permettant d'alterner à tout moment entre les illustrations légères des 4 gestes et la vidéo explicative plein écran.

## 11. Ce qui reste simulé

Signalé par un badge « Simulation » en mode réel :
- paiement Orange Money et tableau de bord des dons ;
- orientations d'urgence (docteur → centre) ;
- statistiques du superadmin ;

**Langues des contenus** : le choix (menu, Comprendre, accueil, Accompagnant) est global et mémorisé
sur l'appareil ; les textes sont inclus dans l'application (aucune traduction réseau). Texte absent :
français + « Traduction en … à venir ». Audio (`lib/voix.ts`) : MP3 `audioUrlMoore` / `audioUrlDioula`
quand ils existent (mis en cache), sinon voix de l'appareil en français et en anglais ; sinon bouton
Écouter désactivé (« Audio indisponible pour cette langue »).

## 11. À valider avant toute publication

- **Numéros** : numéro vert « 80 00 11 22 », téléphones des centres, associations et annonces,
  numéros des comptes de démonstration (certains pourraient appartenir à de vraies personnes).
- **Schémas du guide des 4 gestes** : à faire relire par un soignant (`SCHEMAS_VALIDES` dans `donnees/guideGestes.ts`).
- **Centres** : statuts, files d'attente, tarifs, horaires, coordonnées (à confirmer auprès des
  structures, puis « vérifier » dans le panneau superadmin). Les 94 structures importées d'OpenStreetMap
  le 28/10/2026 (statut « Données OpenStreetMap · à vérifier ») ont été marquées vérifiées **pour la
  présentation seulement** : position, nom et ville (ville OSM la plus proche) restent à contrôler.
- **Associations** : missions et chiffres d'impact.
- **Traductions mooré et dioula** : à faire relire par des locuteurs (incohérence repérée dans
  le message de Schiphra).
- **Contenu médical** : les 36 fiches initiales de Rose IA (sources suggérées à vérifier), les
  réponses par mots-clés du mode démo, les leçons, les conseils du jour, la fenêtre
  d'autopalpation, la fréquence du dépistage du col (« tous les 3 ans »).
- **Confidentialité** : contact à renseigner, région d'hébergement Supabase, conditions en vigueur
  de l'offre gratuite de Gemini et nom du modèle.

## 12. Design system (interface)

Jetons dans `artifacts/mockup-sandbox/src/index.css` (Tailwind 4, `@theme`) ; composants partagés dans
`src/paglaafi/composants/ui/`. Les couleurs sont des variables CSS : la même classe s'adapte au mode
clair ou sombre (préférence du système, ou réglage « Auto / Clair / Sombre » du menu du profil).
**Ne pas écrire de couleur en dur** dans les écrans : utiliser les classes ci-dessous.

| Jeton (classe) | Clair | Sombre | Usage |
|---|---|---|---|
| `fond` / `rose-50` | #fffafc | #1f1018 | fond de page |
| `surface` | #ffffff | #2b1420 | cartes, feuilles |
| `surface-2` / `rose-100` | #faeff2 | #3a1d2c | cartes douces |
| `rose-200` | #f2e1e6 | #4a2838 | puces, sélection, fond des onglets |
| `rose-500` | #ea2d6d | #ff6f9f | décor seulement (jamais texte courant ni bouton rempli) |
| `action` / `rose-600` | #d41e5c | #ff6f9f | boutons principaux, liens, onglet actif |
| `action-appui` / `rose-700` | #a8164a | #ff9dbe | état appuyé |
| `sur-action` | #ffffff | #2b1420 | texte sur `action` |
| `prune-900` | #580e36 | #f6e8ee | titres, texte fort |
| `carte-prune` | #580e36 | #5c1a3b | encarts forts, puce active (texte blanc) |
| `texte` / `texte-2` | #563746 / #734059 | #f6e8ee / #d9b9c7 | texte courant / secondaire |
| `indicatif` | #916b7c | #c9a3b5 | indications et éléments désactivés, **sur surface blanche uniquement** |
| `bordure` / `bordure-2` | #ebd6dc / #e4cfd6 | #4a2838 / #5a3346 | bordures |
| `succes`, `attention`, `alerte`, `info` (+ `-fond`) | #1d7a4a, #8f5b00, #b42318, #475467 | #6fd39f, #f2c46b, #ff9b91, #c3cbd8 | états |
| `simulation` (+ `-fond`, `bordure-simulation`) | #5b3ea6 / #f0ebfa | #c9b6ff / #2a2140 | badge Simulation (bordure pointillée) |
| `pro` (+ `-fond`) | #1e4f91 / #e8f0fb | #9cc2f5 / #1b2a40 | badge de rôle professionnel |
| `orange-money` / `sur-orange-money` | #f16e00 / #1a1a1a | idem | réservé à Orange Money |
| `nuit`, `demo-point`, `theme-pwa` | #2b1420, #ff5c93, #9c3d61 | idem | démarrage, pastille Démo, thème PWA |

Tous les couples texte / fond utilisés sont au moins AA (4,5:1). Deux règles d'usage en découlent :
`indicatif` seulement sur fond blanc, et jamais de texte `action` sur `rose-200`.

- **Typographie** : DM Sans seule (400 à 700). `text-display` 28/34 gras, `text-titre` 22/28 gras,
  `text-sous-titre` 18/24 demi-gras, `text-corps` 16/24, `text-petit` 14/20 (minimum de lecture),
  `text-badge` 13/16 gras, `text-nav` 12 (barre du bas).
- **Espacements** (base 4 px) : 4, 8, 12, 16, 24, 32, 48. Marges d'écran 16 / 24 / 32 px ; 12 px entre
  cartes ; 16 px dans une carte.
- **Rayons** : `rounded-champ` 8, `rounded-bouton` 12, `rounded-carte` 16, `rounded-feuille` 24, puces `rounded-full`.
- **Ombres** : `shadow-carte` (cartes), `shadow-flottant` (feuilles, toasts, popups).
- **Icônes** : lucide, toujours avec libellé visible ou `aria-label`. Aucun emoji dans l'interface
  (`lib/texte.ts` les retire à l'affichage des données).

**Composants** (`composants/ui`) : `Bouton` (principal, secondaire, danger, discret, orangeMoney ; 48 px,
52 px en taille « grand ») et `BoutonIcone` ; `Champ`, `ChampMotDePasse`, `ListeDeroulante`,
`ZoneTexte`, `Case`, `Interrupteur` (role="switch") ; `PucesLangue`, `OngletsSegmentes`,
`OngletsSoulignes`, `Accordeon` ; `Carte` (et `douce`), `EnTeteSection` ; badges (`BadgeStatutCentre`,
`BadgeSimulationUi`, `BadgeDemo`, `BadgeOSM`, `BadgeOrigineRose`, `BadgeRole`) ; `Bandeau` (rose,
hors-ligne, alerte, info, succès) ; `Feuille` (feuille du bas sur mobile, modale centrée dès 768 px) ;
`EtatVide`, `Squelette`, `ErreurReseau`. `EcranDemarrage` (écran de chargement de 5 secondes : affiche des héroïnes intégrant en zone blanche le logo PagLaafi, le slogan « Mieux informée · Mieux orientée · Jamais seule », la description officielle et la progression fluide). Notifications : `notify(message, action?)` (toast sombre,
action facultative comme « Annuler »).

**Points de rupture** (`composants/Coquille.tsx`, `BarreNavigation.tsx`, `MenuLateral.tsx`) :
- moins de 768 px : en-tête 64 px, barre du bas 88 px (Rose IA au centre), contenu pleine largeur ;
- 768 à 1023 px : rail vertical de 88 px à gauche, contenu centré de 720 px maximum ;
- 1024 px et plus : menu latéral fixe de 264 px, contenu de 1120 px maximum, écrans sur deux colonnes
  (accueil, carte et liste, fiche centre et mini-carte, Rose IA et suggestions, espaces pros).

Aucun défilement horizontal de page entre 320 et 1920 px ; les tableaux larges défilent dans leur boîte.

## 13. Conventions

UTF-8 sans BOM ; commentaires en français ; dates JJ/MM/AAAA ; montants en FCFA ; fuseau GMT ;
TypeScript uniquement (jamais de Python) ; aucune clé secrète dans le code ni dans une variable `VITE_`.

## 14. Historique

La première version (maquette Replit) tenait dans un seul fichier de 8 300 lignes, avec des
fonctions simulées présentées comme réelles. La refonte d'octobre 2026 a découpé l'application
(phase 1), ajouté Supabase (phase 2), Rose IA réelle par RAG (phase 3), l'honnêteté et la
confidentialité (phase 4), puis la PWA hors-ligne et le nettoyage (phase 5). Le front-end a ensuite été refondu
(design system, interface responsive, mode sombre, accessibilité AA). Les étiquettes Git
`backup-*` conservent les états antérieurs.
