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
- **Fichier Windows 1-Clic** : Double-cliquez directement sur **`demarrer.bat`** (ou **`demarrer-en-local.bat`**) à la racine du projet.
- **Ou via Terminal PowerShell / Invite de commande** :
  ```powershell
  pnpm run dev
  ```
  *(Fonctionne aussi avec `pnpm start` ou `pnpm run dev:mockup`)*

- **URL locale sur cet ordinateur** : [http://localhost:5173/](http://localhost:5173/)
- **Lien Mobile Wi-Fi (Pour les collègues sur leur smartphone, sans rien installer)** :
  - **URL réseau local active** : **`http://192.168.1.22:5173/`** *(détectée automatiquement par `demarrer-en-local.bat` et `PinkHubMobile.tsx` selon votre réseau Wi-Fi)*
  - **Procédure pour les collègues** :
    1. Connecter le téléphone au même Wi-Fi.
    2. Ouvrir le navigateur mobile (Safari sur iPhone, Chrome sur Android).
    3. Taper `http://192.168.1.22:5173/` (ou copier le lien directement depuis l'application) pour accéder à toute l'application.

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
   - **Partage Wi-Fi Local (Sans Expo)** : modal et bouton direct d'information avec détection automatique de l'adresse IP réseau (actuellement `http://192.168.1.22:5173/`) et bouton Copier pour les collègues.

---

## 5. Maintenance & Standards Techniques
- **Point de contrôle Git** : Tags `backup-checkpoint-avant-maj`, `backup-connexion-wifi-local`, `backup-stabilisation-v1`, `backup-gps-offline-micro-v2` et commits pas-à-pas.
- **Encodage** : Fichiers encodés en **UTF-8 sans BOM**.
- **Langue des commentaires** : Rédigés en français pédagogique.
- **Stack** : 100% TypeScript, React, Leaflet/OpenStreetMap, HTML5, CSS et Web Speech API (zéro Python).
- **Responsive Mobile-First** : Optimisé pour tous les smartphones avec navigation tactile ergonomique.

---

## 6. Mises à Jour & Nouvelles Fonctionnalités Majeures (Octobre 2026)

### A. Navigation GPS Intégrée (Google Maps & Apple Maps)
- **Fonction `openNavigation(lat, lng, name)`** :
  - Détecte dynamiquement le terminal de l'utilisatrice (Apple iOS vs Android / Ordinateur).
  - Génère l'URL officielle de navigation en itinéraire de conduite (`travelmode=driving`) vers les coordonnées exactes du centre.
- **Accès multicanal** :
  1. **Directement depuis la carte** : bouton "📍 Itinéraire" dans le popup Leaflet de chaque repère.
  2. **Sur la fiche détaillée** : bouton émeraude mis en avant "Itinéraire GPS".
  3. **Dans la vue liste des centres** : bouton badge "GPS" à côté des pistes audio.
  4. **Appel téléphonique en 1 clic** : bouton direct `tel:${phone}` relié au secrétariat du centre.

### B. Mode Hors-Connexion & PWA (Disponibilité Sans Internet)
- **Manifest Web (`public/manifest.json`)** :
  - Configuration PWA complète (`standalone`, thème `#9c3d61`, icônes 192x192 et 512x512).
  - Permet d'installer PagLaafi directement sur l'écran d'accueil du smartphone comme une application native.
- **Service Worker (`public/sw.js`)** :
  - Préchargement de l'app shell (HTML, CSS Leaflet, JS Leaflet, logo, polices).
  - Stratégie Stale-While-Revalidate avec mise en cache dynamique des tuiles de carte OpenStreetMap consultées.
  - Repli automatique hors-ligne en cas de coupure de réseau.
- **Indicateur visuel d'état réseau** :
  - Détection en temps réel des événements `window.online` et `window.offline`.
  - Bandeau d'information ambré discret : *"Mode Hors-Ligne actif · Vos données médicales et centres restent accessibles"*.

### C. Reconnaissance Vocale Réelle pour Rose IA (Web Speech API)
- **Passage à l'API native `window.SpeechRecognition || window.webkitSpeechRecognition`** :
  - Remplacement du délai statique par une capture micro réelle en langue française (`fr-FR`).
  - Transcription en direct au fil de la parole dans le champ texte.
  - Gestion ergonomique des permissions et retours haptiques / visuels (animation d'impulsion sur le bouton micro).
  - Défilement automatique du chat vers le dernier message généré.

### D. Fiabilisation de l'Affichage de la Carte sur Tous les Profils
- **Correction du cycle de vie Leaflet** :
  - Dépendances étendues : prise en compte de `selectedCenter`, `currentUser` et du filtre de ville.
  - Élimination des bugs de tuiles grises grâce à un triple appel `invalidateSize()` (120ms, 350ms, 700ms) et à l'écoute des redimensionnements de fenêtre (`window.resize`).
  - Nettoyage rigoureux des anciennes instances pour éviter tout conflit DOM.

### E. Confort de Navigation & Réinitialisation du Défilement
- **Hook de défilement automatique** :
  - À chaque bascule d'onglet ou retour de fiche détaillée, le conteneur principal se repositionne automatiquement en haut (`scrollTop = 0`).
  - Popover de profil enrichi permettant de basculer en 1 clic entre les 5 profils (Utilisatrice, Centre, Docteur, Asso, Superadmin).

### F. Audit et Activation de 100% des Boutons
- Correction du bouton "Aider →" sur l'encadré de don de la page d'accueil.
- Branchement complet des actions d'enregistrement des rappels personnalisés du calendrier.
- Nettoyage et vérification de l'ensemble des déclencheurs de modales et de formulaires.

### G. Rose IA : Santé Globale de la Femme, Bien-Être, Éthique & Notifications en Langues Locales
- **Vision Holistique (Au-delà du cancer du sein)** :
  - **Hygiène intime & flore** : conseils médicaux bienveillants prévenant les pratiques décapantes (douches vaginales internes) et valorisant le coton et le lavage externe doux.
  - **Nutrition sahélienne & hygiène de vie** : valorisation des superaliments locaux du Burkina Faso (**Moringa**, **pulpe de Baobab / pain de singe**, **Soumbala traditionnel**, hydratation 2-3L contre la chaleur sahélienne, modération des cubes industriels salés).
  - **Cycle menstruel & apaisement des crampes** : remèdes naturels (linges tièdes, infusions de gingembre/kinkeliba, beurre de karité) et repérage précoce des douleurs invalidantes (endométriose).
  - **Sérénité mentale & charge mentale** : soutien empathique aux femmes surmenées, exercices de respiration, déculpabilisation du repos.
  - **Dépistage global (Col de l'utérus & Seins)** : sensibilisation combinée au test IVA / frottis tous les 3 ans et à l'autopalpation mensuelle.
  - **Grossesse & ménopause** : accompagnement des étapes de la vie de la femme.
- **Posture Éthique & Respect Absolu de la Pudeur** :
  - Rose IA écoute sans jugement et rassure face à l'angoisse d'un diagnostic.
  - Avertissement éthique permanent rappelant que Rose IA est une conseillère préventive et qu'elle ne remplace jamais une sage-femme ou un médecin.
- **Petits Messages Bienveillants & Notifications en 4 Langues** :
  - **Conseils du jour multilingues** : 6 thématiques rédigées et audibles en **Français**, **Mooré**, **Dioula** et **English**.
  - **Système de notification locale (Web Notifications API / In-App)** : cloche 🔔 permettant aux utilisatrices de s'abonner aux rappels quotidiens d'hygiène et de bien-être dans leur langue de prédilection.
  - **Widget interactif sur l'Accueil** : carte "Conseil Bienveillant du Jour" directement visible sous la bannière, avec sélecteur de langue 1-clic, synthèse vocale intégrée et bouton "Autre conseil ✨".

### H. Recensement des Centres les Plus Fréquentés & Radar de Veille Web Rose IA (Superadmin)
- **Recensement & Palmarès des Centres par Ville et Région** :
  - **Filtre géographique interactif** : Consultation nationale (Tout le Burkina), Région du Centre (Ouagadougou), Région des Hauts-Bassins (Bobo-Dioulasso) et Région du Centre-Ouest (Koudougou).
  - **Indicateurs de tension sanitaire** :
    - Classement par rang (#1 CHU Bogodogo, #2 CMA Schiphra, #3 CHU Sourô Sanou, etc.).
    - Visites réelles du jour (`femmes/j`) et estimation mensuelle consolidée.
    - Temps d'attente moyen (`estimatedWait`) et nombre de soignants déployés.
    - État de fonctionnement du mammographe (opérationnel vs révision) avec jauge d'affluence visuelle tricolore (🟢 fluide, 🟠 modéré, 🔴 forte tension).
- **Rôle Étendu de Rose IA : Radar de Veille Web & Réseaux Sociaux** :
  - **Pertinence sur le terrain** : De nombreuses campagnes gratuites et caravanes de dépistage sont diffusées sur Facebook, WhatsApp et sites d'actualité burkinabè (Ministère de la Santé, associations locales), sans être centralisées.
  - **Absence de redondance & sécurité éthique** :
    1. Rose IA scrute et détecte ces opportunités sur la toile avec indication de la source et du niveau de fiabilité IA (ex: 98% Certifié Ministère).
    2. Elle ne publie rien directement pour éviter tout risque de désinformation : elle soumet l'annonce dans le sas de modération du Superadmin National.
    3. Le Superadmin dispose d'un bouton dédié : **« Valider & Diffuser en Push 🚀 »**.
    4. Dès validation, l'annonce reçoit le sceau officiel `🔍 Veille Rose IA · Validé Officiel ✓` et Rose IA déclenche une notification push ciblée aux utilisatrices de la localité concernée (en Français, Mooré et Dioula).
  - **Filtre dédié sur l'écran public** : L'onglet Annonces dispose d'un filtre `Veille Rose IA` permettant aux femmes d'isoler en 1 clic toutes les opportunités détectées sur les réseaux et certifiées par l'État.

### I. Paramètres de Confidentialité & Simulation du Parcours d'Entraînement de Rose IA par les Soignants

#### 1. Paramètres de Confidentialité & Éthique des Données (Local-First & Zéro Tracking)
- **Philosophie "Privacy-by-Design" & Zéro Collecte Involontaire** :
  - **Aucune donnée personnelle n'est siphonnée ou collectée** par l'application : l'historique du cycle menstruel, les autopalpations, les notes privées et les rappels restent stockés **à 100% sur l'appareil local** (Local-First / SQLite / LocalStorage).
  - Aucune revente de données, aucun tracker commercial ni profilage publicitaire.
- **Origine Exclusive des Données d'Entraînement de Rose IA** :
  - Les seules données ingérées par l'intelligence artificielle proviennent des **protocoles cliniques officiels rédigés et validés par les docteurs, sages-femmes et agents de santé**, ainsi que des retours de terrain des **associations partenaires locales** (ABAC, Espoir pour Demain, etc.).
  - **Objectif** : Rendre l'interaction de Rose IA plus naturelle, chaleureuse, empathique et respectueuse des pudeurs sahéliennes en **Français**, **Mooré** et **Dioula**.
- **Partage Médical Ponctuel sur Demande Explicite** :
  - Si une femme a besoin d'une prise en charge d'urgence pour un nodule suspect, ses coordonnées médicales ne sont transmises qu'après confirmation explicite (consentement éclairé).
- **Contrôles Utilisateur & Droit à l'Oubli Immédiat** :
  - **Toggles interactifs** : Stockage 100% local, entraînement collaboratif soignants, statistiques d'affluence anonymisées pour les ONG, consentement de transmission médicale.
  - **Bouton Droit à l'Oubli** : Purge immédiate en 1 clic de l'ensemble du cache, des conversations et des identifiants locaux.
- **Accès Ergonomique Multi-points** :
  - Accessible via l'icône de profil (header), le menu latéral déroulant (sidebar) et sous la bannière de discussion de Rose IA.

---

#### 2. Simulation Interactive du Parcours d'Entraînement de Rose IA par le Docteur / Agent de Santé
Pour concrétiser la collaboration soignant-IA sans barrière technique, un parcours immersif en 4 étapes a été développé :

- **Étape 1 : Sélection ou Définition du Thème Clinique** :
  - Sélection parmi des cas cliniques réalistes du Burkina Faso :
    1. *Permanence urgences mammaires & Nodule suspect* (CHU Bogodogo / CMA Schiphra — accueil sans rendez-vous, mammographie sous 48h).
    2. *Douleurs de règles aiguës & Endométriose* (Démystification de la souffrance banalisée, orientation échographique pelvienne).
    3. *Nutrition sahélienne fortifiante & Immunité* (Valorisation des vertus antioxydantes du Moringa et du Baobab/pain de singe).
  - Possibilité de saisir librement un autre sujet médical (ex: crevasses d'allaitement, palpation axillaire).

- **Étape 2 : Formulation Médicale & Vulgarisation Empathique Multilingue** :
  - Saisie de la recommandation clinique rigoureuse par le médecin.
  - Génération automatique de la **vulgarisation empathique en 3 langues** :
    - 🇫🇷 **Français facile** : Langage clair, rassurant et sans jargon anxiogène.
    - 🇧🇫 **Mooré** : Formulation respectueuse de la culture et de la pudeur locale avec synthèse vocale audio.
    - 🇧🇫 **Dioula** : Conseil bienveillant adapté aux communautés du grand Ouest avec synthèse vocale audio.

- **Étape 3 : Banc d'Essai en Direct (Simulation Patiente ↔ Rose IA)** :
  - Mise en situation concrète : la patiente pose sa question spontanée (ex : *"J'ai senti une boule un peu dure dans mon sein droit qui ne me fait pas mal, est-ce que je dois m'inquiéter ?"*).
  - Déclenchement de la réponse de Rose IA qui applique instantanément la consigne du médecin en orientant la femme vers le service d'imagerie sans délai.
  - Badge de conformité déontologique et bouton de lecture audio de la réponse.

- **Étape 4 : Signature Électronique & Ingestion Officielle** :
  - Attestation du praticien : Nom complet (*Dr. Ibrahim Sanou*), rôle et structure d'exercice (*Gynécologue-Obstétricien · CHU Bogodogo*).
  - Engagement déontologique garantissant l'absence de violation du secret médical.
  - **Bouton « Signer & Intégrer dans Rose IA »** :
    - Ingestion instantanée dans la liste des savoirs cliniques certifiés.
    - Publication automatique d'un message officiel signé dans le chat de Rose IA.
    - Notification toast confirmant la mise à niveau de l'IA.

### J. Partenaires Officiels Vérifiés, Affiches d'Événements & Démonstration Vidéo d'Autopalpation

#### 1. Partenaires Réels Vérifiés au Burkina Faso
Les trois organisations majeures ont été officialisées dans la plateforme avec leurs profils et missions vérifiés :
1. **BE NEERE FOR CAUSE** :
   - **Missions** : Organisation burkinabè pionnière en santé communautaire, déploiement d'unités mobiles de dépistage 100% gratuit du cancer du sein et du col de l'utérus, ateliers d'autopalpation et prise en charge des femmes en milieu rural et périurbain.
   - **Localisation** : Ouagadougou, Bobo-Dioulasso, Koudougou & Centre-Nord (Kaya, Ziniaré).
   - **Impact** : Plus de 2 800 femmes accompagnées et dépistées.
2. **WOMENTECHMAKERS & ORANGE DIGITAL CENTER** :
   - **Missions** : Alliance d'innovation technologique et sociale réunissant la communauté Women Techmakers Ouagadougou et le centre d'innovation Orange Digital Center Burkina Faso pour l'inclusion numérique féminine, les hackathons e-santé et les caravanes de sensibilisation digitale.
   - **Localisation** : Ouagadougou (siège Orange Digital Center) & Bobo-Dioulasso.
   - **Impact** : Plus de 1 950 femmes formées et orientées vers le dépistage.
3. **GENIT CARE BURKINA** :
   - **Missions** : Centre d'excellence et clinique de référence en santé génésique de la femme : consultations gynécologiques bienveillantes, frottis de dépistage, échographies mammaires, bilans sénologiques et prise en charge globale des troubles du cycle et de l'endométriose à tarifs sociaux subventionnés.
   - **Localisation** : Ouagadougou.
   - **Impact** : Plus de 3 200 examens et bilans réalisés.

#### 2. Photos & Affiches d'Événements dans les Annonces
- **Affiches officielles intégrées** :
  - `affiche-evenement-beneere.jpg` : Caravane Santé & Dépistage Féminin déployée au Burkina Faso.
  - `affiche-wtm-odc.jpg` : Hackathon Tech & E-Santé Féminine Women Techmakers & Orange Digital Center.
  - `affiche-genit-care.jpg` : Journées cliniques de santé gynécologique et dépistage précoce.
- **Formulaire de publication enrichi** :
  - Sélecteur 1-clic des affiches officielles partenaires.
  - Saisie d'une URL de photo / affiche personnalisée.
  - Prévisualisation miniature en temps réel de l'affiche avant soumission.
- **Affichage sur smartphone** :
  - Présentation moderne au format 16:9 dans les cartes de l'onglet Annonces.
  - Bouton interactif **« Agrandir l'affiche »** ouvrant un modal plein écran zoomé avec légende et contact.

#### 3. Démonstration Vidéo d'Autopalpation avec Personnage Africain
- **Création visuelle & pédagogique** :
  - Illustration médicale haute fidélité (`/images/autopalpation-afrique-demo.jpg`) mettant en scène une soignante / sage-femme africaine burkinabè dans un cadre bienveillant et pudique.
  - Explication des 4 temps essentiels :
    1. **1. LOOK (Regarder)** : Examen devant le miroir (bras le long du corps puis levés) pour déceler fossette, rougeur ou rétraction.
    2. **2. FEEL (Palper)** : Palpation douce avec la pulpe de 3 doigts en spirale du pourtour vers le mamelon.
    3. **3. COVER ENTIRE AREA (Zone large)** : Palpation axillaire sous l'aisselle et jusqu'à la clavicule.
    4. **4. NIPPLE CHECK (Mamelon)** : Pression délicate pour déceler tout écoulement anormal.
- **Accès multi-points direct** :
  - **Dans le chat Rose IA** : Bouton d'action direct dans les bulles de discussion (*« Voir la vidéo démonstrative avec sage-femme 🎬 »*) et capsule rapide au-dessus de la saisie.
  - **Dans l'onglet Comprendre** : Carte vidéo guidée dédiée sous le lecteur audio.
  - **Dans le lecteur vidéo** : Contrôles de lecture (Play / Pause, barre de progression 2:45 min), sélecteur audio en 3 langues (**Français**, **Mooré**, **Dioula**) et fiches explicatives interactives des 4 étapes.

#### 4. Accessibilité Hors-Connexion Totale & Liens de Test
- **Mode Hors-Ligne Total (Sans Wi-Fi, Sans Données Mobiles, Mode Avion)** :
  - **PWA Service Worker v2 (`paglaafi-offline-v2`)** : Mise en cache complète de l'application, des styles, de la cartographie Leaflet et de l'ensemble des images et affiches.
  - **Procédure d'installation sur smartphone** :
    - Sur Android (Chrome) : Menu > *« Installer l'application »* ou *« Ajouter à l'écran d'accueil »*.
    - Sur iPhone (Safari) : Bouton Partager > *« Sur l'écran d'accueil »*.
    - Une fois installée, l'application fonctionne même en activant le **Mode Avion** (100% autonome).
#### 5. Nouveau Slogan, Accroche d'Accueil & Recalibration Adaptative du Cycle (Octobre 2026)
- **Écran de Chargement (Splash Screen)** :
  - **Slogan officiel mis à jour** : `Mieux  informée-Mieux orientée- Jamais seule.`
  - Affiché directement sous le logo PagLaafi et au-dessus de la mention *« Powered by Rose IA »*.
- **Écran d'Accueil (En-tête Mobile-First)** :
  - **Phrase descriptive principale mise à jour** :
    > *« Voyez quel centre peut vous accueillir aujourd’hui, repérez le bon moment pour votre autopalpation et trouvez de l’aide près de chez vous. »*
  - Oriente immédiatement l'utilisatrice vers l'action concrète : cartographie des centres en direct, autopalpation au bon moment physiologique et orientation bienveillante.
- **Module Cycle Menstruel & Recalibration Adaptative (Calendrier & Autopalpation)** :
  - **Prédiction intelligente** :
    - Calcul automatique de la date estimée des prochaines règles (`lastPeriodDate + cycleLengthDays`).
    - Décompte dynamique en jours réels (ex : *« Dans 18 j »*, *« Prévues aujourd'hui »*, ou décalage constaté si la date estimée est passée).
  - **Enregistrement de la date réelle & Recalibration automatique** :
    - Si la prédiction n'est pas exacte ou si les règles arrivent en avance/en retard :
      - **Action 1-clic** : Bouton *« 🩸 Mes règles ont débuté aujourd'hui »* pour enregistrer instantanément la date du jour.
      - **Sélecteur fin** : Bouton *« Autre date / Recalibrer »* avec raccourcis tactiles (*« Aujourd'hui »*, *« Hier »*, *« Avant-hier »*) et sélecteur de date calendaire.
    - **Algorithme d'apprentissage adaptatif** :
      - Calcule l'intervalle réel en jours entre le précédent cycle et la nouvelle date confirmée.
      - Recalibre automatiquement la durée moyenne du cycle (`cycleLengthDays`).
      - Réajuste immédiatement la date prévisionnelle du prochain cycle.
      - Recalibre automatiquement la fenêtre optimale d'autopalpation (J+7 à J+11 après le nouveau premier jour des règles).
  - **Historique & Traçabilité locale** :
    - Boîte déroulante avec l'historique des cycles constatés et notes d'évolution.
    - Respect absolu de la vie privée : stockage 100% hors-ligne sur l'appareil de l'utilisatrice, sans aucune transmission externe.
#### 6. Parcours de Connexion Immédiat, Ergonomie Footer, Audio Instantané & Vidéo Accélérée (Octobre 2026)
- **Affichage direct de la Page de Connexion** :
  - **Cinématique d'accueil** : À la fin du Splash Screen, l'application n'ouvre plus directement l'accueil mais dirige l'utilisatrice vers l'écran d'authentification (`!currentUser`).
  - **Options complètes** :
    - Connexion immédiate par téléphone (+226) & mot de passe avec masquage/démasquage.
    - Création de compte / inscription.
    - Accès Démo Rapide en 1-clic pour tester chaque profil (Aminata, Dr Traoré, CMA Schiphra, Be Neere, Superadmin).
    - Accès libre « Explorer en Mode Découverte » pour tester sans compte.
- **Nouvel Ordre des Icônes du Footer (Barre de navigation inférieure)** :
  - Réagencement précis selon la priorité d'usage :
    1. **Accueil** (Santé du sein, raccourcis essentiels)
    2. **Comprendre** (Guide multimédia, audios, fiches médicales)
    3. **Rose IA** (Bouton central surélevé avec aura animée)
    4. **Centres** (Cartographie interactive OpenStreetMap en direct)
    5. **Faire un don** (Soutien direct aux associations burkinabè via Orange Money)
- **Suppression du Temps d'Attente Audio (Zéro Latence)** :
  - **Préchauffage synchrone** : Initialisation immédiate des voix `speechSynthesis.getVoices()` au montage du composant pour éliminer les 2-3 secondes de délai au premier clic.
  - **Déblocage Chromium** : Déverrouillage réactif de la pile audio mobile avec `window.speechSynthesis.resume()` et feedback tactile immédiat (0 ms).
- **Lecteur Vidéo Démonstratif Accéléré & Ultra-Fluide** :
  - **Démarrage instantané** : Démarrage direct au clic sans temps de chargement.
  - **Progression en temps réel** : Timer dynamique formaté (`00:01`, `00:02`...) et barre de progression fluide.
  - **Sélecteur de vitesse accélérée** : Boutons **1x**, **1.5x** et **2x (Rapide)** pour accélérer la démonstration à volonté.
  - **Navigation tactile instantanée** : Clic direct sur l'un des 4 temps (1. Regarder, 2. Palper, 3. Aisselle, 4. Mamelon) pour sauter sans attendre à la séquence choisie.

- **Liens de Test Actifs (Smartphone & Ordinateur)** :
  - **Lien Direct Hors Connexion (PC & Réseau Local)** :
    👉 **http://localhost:5173/** *(Fonctionne 100% sans internet)*
    👉 Fichier raccourci direct : `Acceder-PagLaafi-Hors-Connexion.url`
    👉 Page passerelle : `Lien-Hors-Connexion.html`
  - **Lien Public Direct (accessible partout en 4G/5G sans mot de passe - Cloudflare Tunnel)** :
    👉 **https://spanking-nsw-consolidated-jpeg.trycloudflare.com**
    *(Pour installer l'application PWA sur smartphone une première fois, puis l'utiliser en Mode Avion sans internet)*
  - **Accès Réseau Local (même réseau Wi-Fi)** : `http://192.168.1.22:5173/`

#### 7. Séparation Stricte des Rôles, Rose IA Dédiée Patiente & Modes de Discussion Écrite et Orale (Octobre 2026)
- **Séparation Nette des Espaces Utilisatrice vs Corps Médical** :
  - **Écran Rose IA Patiente** : 100% centré sur l'écoute empathique et la santé intime des femmes (hygiène intime, flore, règles douloureuses, petite boule au sein, remèdes traditionnels sahéliens, équilibre mental).
  - **Suppression du simulateur docteur de l'écran Utilisatrice** : Tout bouton de formation ou d'entraînement réservé aux soignants a été supprimé de la vue de la patiente.
  - **Masquage dans les Menus Standards** : Le bouton « Simuler Entraînement Docteur » est désormais strictement réservé aux utilisateurs connectés en tant que Praticien/Docteur ou Superadmin National.
  - **Accès Pro Préservé** : Le simulateur interactif en 4 étapes (Sélection du cas, reformulation empathique, banc d'essai et signature déontologique) reste pleinement fonctionnel dans le profil Docteur et le Tableau de bord du Superadmin.

- **Nouveaux Modes de Discussion dans Rose IA** :
  - **Mode 1 : Discussion Orale & Vocale (Audio Interactif en Direct)** :
    - Interface dédiée avec aura et pulsation sonore animée selon l'état (Écoute / Parole de Rose IA / Prête).
    - Reconnaissance vocale tactile au micro avec détection automatique de fin de parole et soumission immédiate.
    - **Synthèse Vocale Automatique** : Rose IA lit sa réponse immédiatement à haute voix sans nécessiter de clic supplémentaire.
    - **Questions Orales en 1 Tap** : Permet de tester et converser à l'oral même sur des navigateurs limitant les permissions microphone (Français, Mooré, Dioula, Anglais).
    - Sélecteur de langue audio instantané (FR, Mooré, Dioula, EN).
  - **Mode 2 : Discussion Écrite (Chatbot Textuel & Multimédia)** :
    - Dialogue textuel fluide avec scroll automatique.
    - Badges thématiques rapides (hygiène intime, soulagement des règles, nutrition, dépistage).
    - Réponses complètes traduites en Mooré et Dioula avec boutons d'écoute audio individuels.
    - **Bouton Vidéo Démonstratif Intégré** : Accès direct en un clic vers la vidéo d'autopalpation de la sage-femme burkinabè dès qu'une question aborde les seins ou le dépistage.

