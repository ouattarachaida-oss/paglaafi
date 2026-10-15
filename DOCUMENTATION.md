# Documentation du Projet : PagLaafi (Maquette-mobile-PinkHub)

## 1. Contexte du Projet
**PagLaafi** est une application d'information, d'orientation et de soutien autour du cancer du sein, conçue initialement pour le Burkina Faso (avec extension possible à d'autres pays d'Afrique de l'Ouest).
Le projet comprend :
- Une **maquette web interactive (Mockup Sandbox)** : visualisable immédiatement dans le navigateur avec rendu mobile fidèle et toile infinie.
- Une **application mobile Expo (React Native)** : destinée au déploiement sur smartphones iOS/Android et testable via Expo Go.
- Un prototype d'animation/film de présentation (**Paglaafi Film**).

---

## 2. Architecture des Dossiers & Fichiers Clés

Le projet est structuré sous forme de monorepo géré avec `pnpm workspaces` :

- `artifacts/mockup-sandbox/` :
  - `src/components/mockups/pinkhub-mvp/PinkHubMobile.tsx` : Composant React principal contenant l'ensemble de la maquette mobile interactive (écrans Accueil, Centres, Comprendre, Soutien, Détection, etc.).
  - `vite.config.ts` : Configuration Vite du serveur web local (port 5173 par défaut).
  - `mockupPreviewPlugin.ts` : Plugin Vite de détection automatique des maquettes.
- `artifacts/paglaafi/` :
  - Application mobile multiplateforme construite avec **Expo** et **React Native**.
  - `app/` : Routes et navigation de l'application (Expo Router).
  - `components/` : Composants UI mobiles réutilisables.
  - `data/content.ts` : Données locales vérifiées (articles éducatifs sourcés OMS, contacts utiles).
  - `package.json` : Dépendances mobiles et scripts de test.
- `artifacts/paglaafi-film/` :
  - Prototype d'animation scénarisée de présentation du projet.
- `package.json` (racine) :
  - Définition des workspaces et raccourcis de commande.

---

## 3. Guide de Démarrage en Local sous Windows

Le serveur de développement de la maquette web est actuellement opérationnel.

### A. Lancer la Maquette Web Interactive (Recommandé pour tester les écrans)
Depuis le dossier racine du projet sous PowerShell ou Terminal :
```powershell
pnpm run dev:mockup
```
- **URL d'accès local** : [http://localhost:5173/](http://localhost:5173/)
- Vous pouvez ouvrir cette URL dans votre navigateur (Chrome, Edge, etc.) pour interagir directement avec la maquette mobile.

### B. Lancer l'Application Mobile Expo
Pour tester l'application mobile native :
```powershell
pnpm run dev:mobile
```
- Une fois le serveur Expo lancé, appuyez sur `w` pour l'ouvrir dans le navigateur ou scannez le QR code avec l'application **Expo Go** sur votre smartphone.

---

## 4. Maintenance & Bonnes Pratiques

1. **Intégrité des Données Médicales** :
   - Ne jamais ajouter de faux centres de santé ou de données médicales non vérifiées. Les informations proviennent de sources officielles (OMS, ministères de la santé).
2. **Encodage & Localisation** :
   - Tous les fichiers doivent être encodés en **UTF-8 sans BOM**.
   - Contexte ciblé : Afrique de l'Ouest (formats JJ/MM/AAAA, FCFA, GMT).
3. **Approche Mobile-First** :
   - Les écrans sont conçus en priorité pour les petits écrans tactiles, avec navigation basse ergonomique et adaptabilité fluide sur tablette/ordinateur.
