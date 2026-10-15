# Documentation du Projet : PagLaafi (Maquette-mobile-PinkHub)

## 1. Contexte du Projet
**PagLaafi** est une application d'information, d'orientation et de soutien solidaire autour du cancer du sein au **Burkina Faso** et en Afrique de l'Ouest.
Elle permet aux femmes, à leurs familles et aux partenaires de santé d'accéder à une information fiable, transparente et humaine :
- **Écran de démarrage (Splash Screen)** : Affichage du logo PagLaafi et du badge officiel **"Powered by Rose IA"** à l'ouverture de l'application.
- **Carte Vivante des centres de santé** : savoir avant de se déplacer si l'appareil (mammographe/échographe) fonctionne aujourd'hui, le nombre d'agents présents, le temps d'attente estimé, les tarifs réels en FCFA (ou gratuité 0 FCFA) et un message vocal du centre disponible en **Français**, **Mooré** et **Dioula**.
- **Module Comprendre (Guide Médical & Audio Trilingue)** : fiches pédagogiques claires sur la maladie, les signaux d'alerte et l'accompagnement, avec un lecteur audio interactif proposant l'écoute intégrale en **Français**, **Mooré** et **Dioula**.
- **Rose IA (Assistante Vocale Spécialisée)** : compagnon interactif avec reconnaissance vocale au micro et synthèse vocale pour répondre sans tabou aux questions médicales du quotidien.
- **Dons Solidaires Orange Money (Processus direct #144#)** : onglet "Faire un don" directement accessible dans la barre de navigation basse, déclenchant le processus de paiement Orange Money (choix de l'association burkinabè vérifiée, saisie du montant en FCFA, push USSD `#144*4*6#`, validation OTP et reçu officiel téléchargeable).
- **Système de Gestion Multi-Comptes (3 Niveaux)** :
  1. **Utilisatrice / Patient** : accès aux informations, à la carte, à Rose IA et aux dons.
  2. **Admin Association & Partenaire** : publication d'annonces, mise à jour des disponibilités des centres et gestion des caravanes mobiles (soumis à validation préalable).
  3. **Superadmin National** : tableau de bord sécurisé permettant d'examiner, valider ou refuser les demandes d'inscription des structures de santé et associations partenaires.
- **Formulaires Sécurisés avec Visibilité (Œillet)** :
  - **Connexion** : simplifiée au maximum, demande **exclusivement le numéro de téléphone et le mot de passe**, avec icône œillet pour afficher/masquer le mot de passe.
  - **Inscription** : nom, prénom, choix du rôle, téléphone, mot de passe et champ obligatoire de **confirmation du mot de passe**, tous deux équipés d'un œillet de visualisation.

---

## 2. Architecture des Dossiers & Fichiers Clés

Le projet est structuré sous forme de monorepo géré avec `pnpm workspaces` :

- `artifacts/mockup-sandbox/` :
  - `src/components/mockups/pinkhub-mvp/PinkHubMobile.tsx` : Composant React complet contenant l'ensemble de la maquette mobile interactive avec :
    - Le **Splash Screen animé** ("Powered by Rose IA").
    - La **Barre de Navigation Basse 5 onglets** : Accueil, Centres, Rose IA (bouton central flottant surélevé), Comprendre, Faire un don.
    - Le **Module Comprendre trilingue** avec lecteur audio (Français, Mooré, Dioula).
    - Le **Module de Connexion / Inscription** avec mot de passe masquable/démasquable (œillet) et confirmation de mot de passe.
    - Le **Panneau Superadmin** de modération des structures et associations partenaires.
    - La **Carte Vivante** (statuts temps réel : 🟢 Vert = dispo/fluide, 🟠 Orange = affluence, 🔴 Rouge = maintenance, ⚪ Gris = non mis à jour).
    - **Rose IA** : Assistante IA avec micro vocal et réponses parlées.
    - **Annonces & Événements** : Flux des campagnes et formulaire de publication pour les associations.
    - Le module **L'Accompagnant** (génération d'invitation WhatsApp/SMS).
    - Le processus **Dons Orange Money** (simulation API #144*4*6# avec reçu).
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

## 4. Fonctionnalités Clés & Rôles Applicatifs

### Les 3 Niveaux de Comptes Utilisateurs
1. **Compte Utilisatrice (Standard)** :
   - Inscription immédiate avec nom, prénom, numéro de téléphone, mot de passe et confirmation.
   - Connexion rapide avec **téléphone et mot de passe uniquement**.
2. **Compte Admin (Associations & Partenaires)** :
   - Destiné aux structures de santé (ABAC, COBUCAN, CMA Schiphra, cliniques privées).
   - Inscription avec sélection du statut "Association / Partenaire" et nom de la structure.
   - Compte placé automatiquement en statut **"En attente de validation"** par sécurité.
3. **Compte Superadmin (Modérateur National)** :
   - Accès via le profil Superadmin (ex : Kaboré Alimata, testable en 1 clic dans le modal d'authentification).
   - Débloque le bouton **"Panneau Superadmin"** dans le menu latéral.
   - Permet de valider ou refuser les demandes d'adhésion des associations et d'activer leurs droits de publication.

### Audio & Localisation Trilingue (Français, Mooré, Dioula)
- **Synthèse Vocale Web Speech API** intégrée nativement dans le navigateur sans dépendance externe.
- Chaque leçon du module **Comprendre** dispose d'un résumé audio et d'une transcription adaptés aux trois langues majeures du Burkina Faso.
- Les centres de santé disposent également de fiches d'écoute vocale en Français, Mooré et Dioula pour garantir l'accessibilité aux femmes non lectrices.

### Processus Don Orange Money
- Déclenchement automatique au clic sur l'onglet **"Faire un don"** dans la barre basse.
- Parcours complet :
  1. Sélection de l'association burkinabè (ABAC, COBUCAN, Schiphra, Espoir & Vie).
  2. Sélection ou saisie libre du montant en FCFA (1 000 F, 2 500 F, 5 000 F, etc.).
  3. Numéro Orange Money Burkina (+226).
  4. Simulation du push USSD `#144*4*6#` et saisie du code OTP.
  5. Émission du reçu officiel de transaction solidaire avec référence unique `OM-BF-XXXXXX`.

---

## 5. Maintenance & Standards Techniques
- **Encodage** : Tout fichier créé ou édité est encodé en **UTF-8 sans BOM**.
- **Langue des commentaires** : Tous les commentaires dans le code source sont rédigés en **français**.
- **Zéro Python** : Stack 100% TypeScript, React, HTML5, CSS et APIs Web natives.
- **Ergonomie Mobile-First** : breakpoints responsives, navigation basse ergonomique à portée de pouce et icônes d'accessibilité tactiles.
