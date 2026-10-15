# Documentation du Projet : PagLaafi (Maquette-mobile-PinkHub)

## 1. Contexte du Projet
**PagLaafi** est une application d'information, d'orientation et de solidarité médicale autour du cancer du sein au **Burkina Faso** et en Afrique de l'Ouest.
Elle permet aux femmes, aux soignants, aux associations et aux partenaires de santé d'accéder à un écosystème numérique transparent, humain et accessible :
- **Écran de démarrage (Splash Screen)** : Affichage du logo officiel PagLaafi et du badge **"Powered by Rose IA"** à l'ouverture de l'application.
- **Carte Open-Source Interactive (OpenStreetMap & Leaflet)** :
  - Intégration d'une vraie carte Leaflet 100% open-source et gratuite avec les coordonnées GPS réelles des centres de santé de Ouagadougou, Bobo-Dioulasso et Koudougou.
  - Marqueurs colorés selon le statut temps réel (🟢 Vert = fluide, 🟠 Orange = affluence, 🔴 Rouge = maintenance/panne, ⚪ Gris = non actualisé) avec popups descriptives et filtres de recentrage par ville.
- **Profil Utilisatrice : Calendrier, Cycle, Autopalpation & Rappels** :
  - **Suivi du cycle menstruel** : calcul automatique de la date des prochaines règles.
  - **Fenêtre idéale d'autopalpation** : calcul du créneau optimal (2 à 5 jours après la fin des règles, quand les tissus sont souples et indolores), guide des 4 gestes d'auto-examen et bouton de validation mensuelle.
  - **Rappels personnalisés** : dépistage annuel, rendez-vous médical et prise de traitement avec ajout dynamique.
  - **Faire un don solidaire** : icône Cœur (`Heart`), placé tout en bas de la liste à l'accueil et dans la barre de navigation basse.
  - Le bouton "Mettre à jour mon centre" est invisible pour les utilisatrices simples.
- **Profil Admin & Professionnels de Santé** :
  - **Mise à jour du centre de santé sur la carte** : réservée strictement aux administrateurs de centres et médecins (indisponible pour les associations).
  - **Mode Docteur : Entraîner Rose IA** : espace de supervision clinique où le praticien dialogue avec Rose IA pour lui enseigner de nouvelles règles, permanences d'urgence ou protocoles locaux.
  - **Tableau de Bord Admin** : statistiques de collecte Orange Money (#144#), donateurs et historique des transactions pour les associations ; statistiques de fréquentation et patientes reçues pour les centres.
  - **Recommander & Orienter un patient selon l'urgence** : génération de fiches de transfert prioritaires (🔴 Urgence Haute 24h, 🟠 Urgence Moyenne 48h, 🟢 Routine) avec code unique `ORIENT-BF-XXXX` et transmission directe par WhatsApp/SMS.
- **Associations Partenaires Burkinabè** :
  - Intégration officielle de **Beneere For A Cause**, **GenitCare**, **Association WomenTech Makers**, aux côtés de l'ABAC, la COBUCAN, Schiphra et Espoir & Vie Bobo.
- **API Audio Multi-Langues (4 Langues)** :
  - Prise en charge intégrale en **Français (FR)**, **English (EN)**, **Mooré** et **Dioula** dans le module Comprendre, sur les fiches des centres de santé et dans Rose IA.
- **Superadmin National** : Espace sécurisé pour valider ou refuser les demandes d'adhésion des structures médicales et associations.

---

## 2. Architecture des Dossiers & Fichiers Clés

Le projet est structuré sous forme de monorepo géré avec `pnpm workspaces` :

- `artifacts/mockup-sandbox/` :
  - `src/components/mockups/pinkhub-mvp/PinkHubMobile.tsx` : Composant React complet contenant l'ensemble de la maquette mobile interactive avec :
    - Le **Splash Screen animé** ("Powered by Rose IA").
    - La **Carte OpenStreetMap Leaflet** interactive avec coordonnées réelles de Ouaga, Bobo et Koudougou.
    - Le **Module Calendrier & Autopalpation** (calcul des règles, fenêtre d'auto-examen, rappels médicaux).
    - L'espace **Docteur / Praticien** (Entraînement de Rose IA & Fiches d'orientation d'urgence).
    - Le **Tableau de Bord Admin** (Dons Orange Money, donateurs, statistiques de fréquentation).
    - Le **Module Comprendre 4 langues** (Français, English, Mooré, Dioula) avec lecteur audio Web Speech API.
    - Le formulaire **Connexion / Inscription** avec mot de passe masquable/démasquable (œillet).
    - Le **Panneau Superadmin** de modération nationale.
    - Le module **L'Accompagnant** (invitation WhatsApp/SMS).
    - Le processus **Dons Orange Money** (simulation API #144*4*6# avec reçu officiel).
  - `src/App.tsx` : Point d'entrée avec chargement automatique de la maquette mobile par défaut sur `/`.
  - `vite.config.ts` : Configuration Vite compatible Windows avec valeurs de repli automatiques.
- `artifacts/paglaafi/` :
  - Application mobile multiplateforme en **React Native / Expo**.
  - `data/content.ts` : Données de référence OMS et structures de santé.
- `package.json` (racine) :
  - Scripts raccourcis pour le développement local : `dev:mockup` et `dev:mobile`.

---

## 3. Guide de Démarrage en Local sous Windows & Audit Technique

### A. Démarrage Rapide en 1 Clic (Recommandé)
- **Fichier Windows 1-Clic** : Double-cliquez directement sur **`demarrer-en-local.bat`** à la racine du projet.
- **Ou via Terminal PowerShell / Invite de commande** :
  ```powershell
  pnpm run dev
  ```
  *(Fonctionne aussi avec `pnpm start` ou `pnpm run dev:mockup`)*

- **URL locale sur cet ordinateur** : [http://localhost:5173/](http://localhost:5173/)
- **Lien Mobile Wi-Fi (Pour les collègues sur leur smartphone, sans rien installer)** :
  - **URL réseau local** : **`http://192.168.1.88:5173/`**
  - **Procédure pour les collègues** :
    1. Connecter le téléphone au même Wi-Fi.
    2. Ouvrir le navigateur mobile (Safari sur iPhone, Chrome sur Android).
    3. Taper `http://192.168.1.88:5173/` pour accéder à toute l'application.

---

### B. Audit Technique : D'où venaient les erreurs en local ?

1. **Absence du script `dev` à la racine (`package.json`)** :
   - Initialement, taper `pnpm run dev` ou `npm run dev` renvoyait l'erreur `ERR_PNPM_NO_SCRIPT: Missing script: dev`.
   - **Résolution** : Le script `"dev": "pnpm --filter @workspace/mockup-sandbox run dev"` et `"start"` ont été ajoutés directement dans le `package.json` racine.

2. **Le squelette Expo / React Native (`artifacts/paglaafi`) issu de Replit** :
   - Le dossier `artifacts/paglaafi` contient un gabarit généré sur Replit avec des versions expérimentales très instables (`expo ~57.0.7`, `react-native 0.86.3`, `react 19.2.3`).
   - Sous Windows, ce sous-module déclenche des erreurs système car `@react-native/debugger-shell` réclame des librairies Linux (`libglib-2.0.so.0`) et le cache Metro bloque sur les 150 000 fichiers du monorepo.
   - **Pourquoi ce n'est pas un problème pour le projet** : 100% de l'application PagLaafi (carte Leaflet, audios Mooré/Dioula, Rose IA, suivi du cycle, rappels, dons anonymes, annonces Superadmin, formulaires) se trouve et s'exécute dans **`artifacts/mockup-sandbox`** via **Vite**.
   - **Faut-il télécharger une version stable de React Native ?** :
     - **Non pour l'instant (Phase 1)** : Pour concevoir, tester et faire tester à vos collègues, la maquette Vite est infiniment plus rapide (démarrage en 1.5 seconde, rechargement instantané, zéro bug Windows, accessible sur tous les téléphones par Wi-Fi).
     - **Oui uniquement en Phase 2** : Si nous souhaitons plus tard générer un installateur binaire `.apk` pour le Google Play Store burkinabè, nous pourrons configurer une version propre et stable d'Expo (SDK 52 avec React Native 0.76).

---

## 4. Rôles Applicatifs & Règles Métier

### Les Profils Utilisateurs & Permissions
1. **👩 Utilisatrice / Patiente (Standard)** :
   - Icône de profil : Cœur rose fuschia avec badge rose pastel.
   - Inscription avec Nom, Prénom, Téléphone, Mot de passe et confirmation.
   - Connexion avec Téléphone et Mot de passe (avec œillet d'affichage).
   - Accès au Calendrier du cycle menstruel, à la fenêtre idéale d'autopalpation et aux rappels.
   - Accès au don solidaire Orange Money avec option anonyme chiffrée AES.
   - *Le bouton "Mettre à jour mon centre" est complètement masqué.*
2. **🏥 Admin Centre de Santé** :
   - Icône de profil : Électrocardiogramme / Activité médicale vert émeraude.
   - Gestionnaire d'un établissement médical (ex : CMA Schiphra).
   - Accès exclusif au bouton **"Mettre à jour mon centre sur la carte"** (état du mammographe, file d'attente, agents présents, vocal du jour).
   - Accès au Tableau de bord statistique (fréquentation, uptime).
3. **🩺 Docteur / Agent de santé** :
   - Icône de profil : Stéthoscope bleu clinique avec caducée.
   - Accès au mode **"Entraîner Rose IA"** pour transmettre des protocoles et consignes cliniques à l'IA.
   - Accès à l'outil **"Orienter une patiente"** pour générer une fiche de transfert prioritaire selon l'urgence (Haute 24h, Moyenne 48h, Routine) et l'envoyer par WhatsApp.
4. **🎗️ Admin Association** :
   - Icône de profil : Mains de solidarité pourpres.
   - Responsable d'une ONG partenaire (ABAC, COBUCAN, Beneere For A Cause, GenitCare, WomenTech Makers, etc.).
   - Accès au Tableau de bord des collectes Orange Money (#144#) et à la gestion de ses annonces.
   - **Consultation des annonces du mois en cours** ("Octobre 2026") avec filtre dédié.
   - **Publication sécurisée** : toute annonce soumise est placée en statut `En attente de validation` jusqu'à l'approbation formelle du Superadmin.
   - *Pas d'accès à la modification des centres de santé.*
5. **🛡️ Superadmin National** :
   - Icône de profil : Bouclier doré avec dégradé violet / or d'autorité.
   - **Tableau de bord statistique complet** : suivi des visites du site et de l'application (visiteurs uniques, sessions, répartition régionale Ouaga/Bobo/Koudougou/Provinces, utilisation vocale de Rose IA, total des collectes de dons FCFA).
   - **Modération exclusive des annonces** : seul habilité à valider (`Valider & Publier ✓`) ou refuser (`Refuser ✕`) les annonces soumises par les partenaires.
   - **Validation des inscriptions** des structures de santé et des ONG.
6. **👥 Fonctionnalités Transverses (Tous Profils)** :
   - **Page Générale de Connexion & Inscription** : s'affiche dès qu'un utilisateur clique sur "Se déconnecter" ou n'est pas authentifié. Propose les formulaires complets (avec œillets), 5 boutons d'accès démo rapide (1-clic) et un mode consultation libre.
   - **Déconnexion directe 1-clic** : accessible instantanément en touchant l'icône de profil dans l'en-tête (menu contextuel avec détails du profil et bouton de déconnexion).
   - **Menu déroulant gauche épuré** : affiche un bouton direct et bien visible **"Se déconnecter"** dès qu'un compte est connecté.
   - **Don Solidaire Anonyme & Chiffré** : option permettant de faire un don Orange Money avec chiffrement des informations personnelles (nom masqué en `Donatrice Anonyme`, numéro masqué sous la forme `+226 70 ** ** XX`, reçu `OM-ANON-XXXXXX`).
   - **L'Accompagnant - SMS Simple GSM** : lien direct `sms:?body=...` permettant d'envoyer une invitation d'accompagnement par SMS standard sans connexion internet, disponible en Français et en Mooré.
   - **Partage Wi-Fi Local (Sans Expo)** : modal et bouton direct d'information avec l'adresse IP `http://192.168.1.88:5173/` et bouton Copier pour les collègues.

---

## 5. Maintenance & Standards Techniques
- **Point de contrôle Git** : Tags `backup-checkpoint-avant-maj`, `backup-connexion-wifi-local` et commits pas-à-pas.
- **Encodage** : Fichiers encodés en **UTF-8 sans BOM**.
- **Langue des commentaires** : Rédigés en français pédagogique.
- **Stack** : 100% TypeScript, React, Leaflet/OpenStreetMap, HTML5, CSS et Web Speech API (zéro Python).
- **Responsive Mobile-First** : Optimisé pour tous les smartphones avec navigation tactile ergonomique.
