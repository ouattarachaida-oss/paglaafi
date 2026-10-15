# PagLaafi

Application mobile francophone d’information, d’orientation et de soutien autour du cancer du sein, destinée d’abord au Burkina Faso, puis à d’autres pays africains si le projet réussit.

## Run & Operate

- `pnpm --filter @workspace/paglaafi run dev` — lancer l’application Expo
- `pnpm --filter @workspace/paglaafi run typecheck` — vérifier l’application mobile

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/paglaafi` — application mobile Expo
- `artifacts/mockup-sandbox` — prototype visuel de référence
- `artifacts/paglaafi/data/content.ts` — articles sourcés et annuaire des structures

## Architecture decisions

- Première version sans compte ni serveur spécifique : les favoris sont conservés sur l’appareil pour limiter la collecte de données.
- Une seule application s’adapte aux téléphones, tablettes et ordinateurs : navigation en bas sur téléphone, en haut sur tablette, latérale sur grand écran.
- Ne jamais inventer de centres, contacts, tarifs, horaires ou dates de campagne. Les informations locales doivent être validées avec des partenaires de santé avant publication.
- L’assistant IA médical est différé : il exige des sources fiables, une validation clinique et une gestion explicite des limites et urgences.

## Product

Quatre espaces dans le MVP : Accueil, Centres, Comprendre et Soutien. Les campagnes sont accessibles depuis l’accueil. Les contenus éducatifs citent l’OMS et ne remplacent pas une consultation. Les recommandations de dépistage locales doivent être validées au Burkina Faso.

## User preferences

Identité rose et blanche, expérience responsive sur téléphone, tablette et ordinateur, priorité au public burkinabè.

## Gotchas

Les sections Centres et Événements affichent un état vide explicite tant qu’aucune donnée locale vérifiée n’est disponible. Ne pas présenter la démonstration comme un service de soins opérationnel.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
