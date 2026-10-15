# Documentation du Projet : PagLaafi (Maquette-mobile-PinkHub)

## 1. Contexte du Projet
**PagLaafi** est une application d'information, d'orientation et de soutien autour du cancer du sein au **Burkina Faso** et en Afrique de l'Ouest.
Elle permet aux femmes et à leurs proches d'accéder à une information fiable, transparente et humaine :
- **Carte Vivante des centres de santé** : savoir avant de partir si l'appareil (mammographe/échographe) fonctionne aujourd'hui, le nombre d'agents présents, le temps d'attente estimé, les tarifs réels en FCFA (ou gratuité 0 FCFA) et un message vocal du centre (Français et Mooré).
- **Module L'Accompagnant (Aller à deux)** : faciliter la démarche de dépistage en invitant une sœur, une amie, une voisine ou son conjoint via WhatsApp/SMS avec rappels conjoints et confirmation post-visite confidentielle.
- **Rose IA (Assistante Vocale Spécialisée)** : compagnon bienveillant doté d'une écoute vocale au micro et d'une synthèse vocale pour répondre sans détour aux questions médicales du quotidien (douleur, prix, boule suspecte, centres ouverts) en français et mooré.
- **Annonces & Événements Partenaires** : carrefour d'actualités où les associations (ABAC, COBUCAN, Espoir & Vie) et les soignants publient leurs caravanes de dépistage gratuit, causeries et subventions.
- **Dons Solidaires par Orange Money (Simulation API #144#)** : possibilité pour les utilisatrices et donateurs de soutenir directement une association partenaire burkinabè vérifiée en payant par Orange Money avec reçu et confirmation immédiate.
- **Authentification Simple** : inscription/connexion rapide avec Nom, Prénom, Téléphone burkinabè et Mot de passe.

---

## 2. Architecture des Dossiers & Fichiers Clés

Le projet est structuré sous forme de monorepo géré avec `pnpm workspaces` :

- `artifacts/mockup-sandbox/` :
  - `src/components/mockups/pinkhub-mvp/PinkHubMobile.tsx` : Composant React complet contenant l'ensemble de la maquette mobile interactive avec :
    - La **Page de Connexion / Inscription** (Nom, Prénom, Numéro, Mot de passe).
    - La **Carte Vivante** (points colorés pulsants : 🟢 Vert = dispo/fluide, 🟠 Orange = affluence, 🔴 Rouge = maintenance, ⚪ Gris = non mis à jour).
    - **Rose IA** : Assistante IA avec micro vocal et réponses parlées.
    - **Annonces & Événements** : Flux des campagnes et formulaire de publication.
    - Le module **L'Accompagnant** (génération de message WhatsApp/SMS, vocal Mooré, binôme et confirmation de visite).
    - Le module **Dons Orange Money** : Simulation d'API Orange Money Burkina Faso avec choix de l'association, saisie du montant en FCFA, push USSD `#144*4*6#` et reçu transactionnel.
    - Le tiroir latéral de navigation (**Sidebar Drawer**) et la barre basse 5 onglets.
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

## 4. Fonctionnalités Clés & Règles Métier

1. **Rose IA & Synthèse Vocale** :
   - Écoute interactive via le micro (Web Speech Recognition) et réponses à haute voix (Web Speech Synthesis).
   - Réponses médicales pédagogiques bienveillantes sans poser de diagnostic à la place du médecin.
2. **Dons Orange Money (#144#)** :
   - Simulation fidèle du parcours Orange Money Burkina Faso : choix de l'association partenaire (ABAC, COBUCAN, Schiphra, Espoir & Vie), montant en FCFA, numéro débiteur, confirmation USSD/OTP et reçu de transaction unique `OM-BF-XXXXXX`.
3. **La Carte Vivante (Code couleur strict)** :
   - 🟢 **Vert** : Appareil fonctionnel et file d'attente fluide (< 30 min).
   - 🟠 **Orange** : Appareil en marche mais forte affluence (> 1h d'attente).
   - 🔴 **Rouge** : Appareil en panne ou en révision technique (ne pas se déplacer pour cet examen).
   - ⚪ **Gris** : Rapport de présence non validé ce matin (téléphoner avant de se déplacer).
4. **Confidentialité de L'Accompagnant** :
   - Seule la confirmation de la visite (« J'y suis allée ») est partagée entre les deux personnes.
   - Les résultats médicaux sont protégés par le secret médical le plus strict.
5. **Encodage & Localisation** :
   - Encodage en **UTF-8 sans BOM**.
   - Tarifs exprimés en **FCFA**, numéros d'urgence burkinabè (80 00 11 22) et Orange Money Burkina (+226).
