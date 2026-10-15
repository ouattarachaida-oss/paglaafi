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

## 3. Guide de Démarrage en Local sous Windows

Le serveur de développement de la maquette web est opérationnel en arrière-plan.

### Lancer la Maquette Web Interactive
```powershell
pnpm run dev:mockup
```
- **URL locale** : [http://localhost:5173/](http://localhost:5173/) ou [http://localhost:5173/preview/pinkhub-mvp/PinkHubMobile](http://localhost:5173/preview/pinkhub-mvp/PinkHubMobile)

### Lancer l'Application Mobile Expo
```powershell
pnpm run dev:mobile
```

---

## 4. Rôles Applicatifs & Règles Métier

### Les Profils Utilisateurs & Permissions
1. **👩 Utilisatrice / Patiente (Standard)** :
   - Inscription avec Nom, Prénom, Téléphone, Mot de passe et confirmation.
   - Connexion stricte avec Téléphone et Mot de passe uniquement.
   - Accès au Calendrier du cycle menstruel, à la fenêtre idéale d'autopalpation et aux rappels.
   - Accès au don solidaire (icône Cœur, en bas de la liste à l'accueil).
   - *Le bouton "Mettre à jour mon centre" est complètement masqué.*
2. **🏥 Admin Centre de Santé** :
   - Gestionnaire d'un établissement médical (ex : CMA Schiphra).
   - Accès exclusif au bouton **"Mettre à jour mon centre sur la carte"** (état du mammographe, file d'attente, agents présents, vocal du jour).
   - Accès au Tableau de bord statistique (fréquentation, uptime).
3. **🩺 Docteur / Agent de santé** :
   - Accès au mode **"Entraîner Rose IA"** pour transmettre des protocoles et consignes cliniques à l'IA.
   - Accès à l'outil **"Orienter une patiente"** pour générer une fiche de transfert prioritaire selon l'urgence (Haute 24h, Moyenne 48h, Routine) et l'envoyer par WhatsApp.
4. **🎗️ Admin Association** :
   - Responsable d'une ONG partenaire (ABAC, COBUCAN, Beneere For A Cause, GenitCare, WomenTech Makers, etc.).
   - Accès au Tableau de bord des collectes Orange Money (#144#) et à la publication d'annonces.
   - *Pas d'accès à la modification des centres de santé.*
5. **🛡️ Superadmin National** :
   - Validation ou refus des inscriptions des nouvelles structures de santé et associations partenaires.

---

## 5. Maintenance & Standards Techniques
- **Point de contrôle Git** : Tag `backup-checkpoint-avant-maj` créé avant la refonte.
- **Encodage** : Fichiers encodés en **UTF-8 sans BOM**.
- **Langue des commentaires** : Rédigés en français pédagogique.
- **Stack** : 100% TypeScript, React, Leaflet/OpenStreetMap, HTML5, CSS et Web Speech API (zéro Python).
- **Responsive Mobile-First** : Optimisé pour tous les smartphones avec navigation tactile ergonomique.
