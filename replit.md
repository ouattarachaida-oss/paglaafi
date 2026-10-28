# PagLaafi

Application web mobile (PWA) francophone d'information, d'orientation et de solidarité autour du cancer du sein, destinée d'abord au Burkina Faso. Documentation complète : `DOCUMENTATION.md`.

## Run & Operate

- `pnpm run dev` — application (mode démo ou réel selon `artifacts/mockup-sandbox/.env`) ; `pnpm run dev:lan` pour le Wi-Fi local
- `pnpm run build` — build de production ; `pnpm run typecheck` — vérification TypeScript
- `pnpm run db:migrer`, `pnpm run db:superadmin -- <email>`, `pnpm run db:test-rls` — backend Supabase
- `pnpm run rag:indexer`, `pnpm run test:rose`, `pnpm run test:rose-pieges` — Rose IA
- Déploiement : `docs/deploiement-vercel.md`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Application : React 19 + Vite 7, Tailwind 4 (design system : DOCUMENTATION.md §12, police DM Sans, mode sombre), wouter, Leaflet + leaflet.markercluster, vite-plugin-pwa
- Backend : Supabase (Auth, Postgres, RLS, pgvector) ; fonctions serverless Vercel (`api/`)
- Rose IA : RAG sur fiches validées, API Gemini (clé côté serveur uniquement)

## Where things live

- `artifacts/mockup-sandbox` — **l'application réellement utilisée** (code dans `src/paglaafi/`, serveur dans `serveur/` et `api/`)
- `supabase/` — migrations, seed (données non vérifiées), scripts, tests RLS
- Non utilisés (conservés pour l'équipe) : `artifacts/paglaafi` (Expo), `artifacts/api-server`, `artifacts/paglaafi-film`, `lib/*`, `scripts/`

## Architecture decisions

- Deux modes : démo (données fictives, aucun appel réseau) et réel (Supabase), choisis par `VITE_MODE_DEMO`.
- Rôles attribués uniquement côté serveur ; règles d'accès dans la base (RLS).
- Données de cycle sur l'appareil, rattachées au compte et chiffrées ; rappels en base.
- Rose IA ne répond qu'à partir de fiches validées par un soignant (quatre yeux), cite ses sources, ne pose aucun diagnostic ; repli FAQ hors-ligne.
- Ne jamais inventer de centres, contacts, tarifs, horaires ni dates : les données locales doivent être vérifiées avant publication (centres masqués en mode réel tant qu'ils ne sont pas vérifiés).

## Product

Onglets : Accueil, Centres (carte), Cycle, Comprendre, Rose IA, Dons, Annonces, Accompagnant. Espaces professionnels : centre, docteur (fiches Rose IA), association, superadmin. Ce qui reste simulé porte un badge « Simulation » en mode réel (dons Orange Money, orientations, statistiques, vidéo).

## User preferences

Identité rose et blanche, interface en français (contenus aussi en anglais, mooré, dioula), mobile d'abord, priorité au public burkinabè.

## Gotchas

- Ne pas présenter la démonstration comme un service de soins opérationnel.
- Numéros, centres, traductions et contenu médical restent à valider (liste : DOCUMENTATION.md §11).
- Aucune clé secrète dans une variable `VITE_` (exposée au navigateur).

## Pointers

- `DOCUMENTATION.md`, `docs/deploiement-vercel.md`, `AGENTS.md`
