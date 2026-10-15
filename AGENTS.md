# Instructions pour les Agents IA & Développeurs (AGENTS.md)

## 1. Contexte du Projet
- **Nom du projet** : PagLaafi (Maquette-mobile-PinkHub)
- **Objectif** : Application mobile et web d'information, d'orientation et de solidarité pour la lutte contre le cancer du sein au Burkina Faso et en Afrique de l'Ouest.
- **Répertoire GitHub** : `ouattarachaida-oss/Maquette-mobile-PinkHub`

## 2. Stack Technique
- **Frontend** : TypeScript, React, Vite, TailwindCSS / CSS modulaire.
- **Cartographie** : OpenStreetMap & Leaflet (open-source, sans clé payante).
- **Accessibilité & Audio** : Web Speech API (Français, English, Mooré, Dioula).
- **Icônes** : Lucide React.
- **Interdiction formelle** : Ne jamais utiliser Python dans ce projet.

## 3. Conventions & Localisation (Afrique de l'Ouest)
- **Commentaires de code** : Obligatoirement en FRANÇAIS, détaillés et pédagogiques.
- **Encodage** : Strictement UTF-8 sans BOM sur tous les fichiers.
- **Format de date** : JJ/MM/AAAA.
- **Devise** : FCFA (Francs CFA).
- **Fuseau horaire** : GMT.
- **Approche Mobile-First** : Tous les composants d'interface doivent être testés et optimisés en priorité pour écran smartphone tactile.

## 4. Sécurité & Bonnes Pratiques
- **Zéro clé sensible** : Ne jamais versionner ni exposer de clés API privées dans le code source public.
- **Protection des données sensibles** : Dons avec option anonyme chiffrée.
- **Mots de passe** : Formulaires avec masquage et œillet de contrôle.
- **Validation** : Vérifier systématiquement l'absence de failles XSS ou injections de données.

## 5. Fichier de Référence & Documentation
- **DOCUMENTATION.md** : Ce fichier à la racine fait foi pour toute modification structurelle ou ajout de fonctionnalité. Toujours le tenir à jour.
