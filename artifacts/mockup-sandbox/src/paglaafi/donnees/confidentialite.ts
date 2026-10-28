/**
 * Politique de confidentialité et écran de consentement (texte modifiable par l'équipe).
 *
 * ⚠️ À COMPLÉTER par l'équipe avant publication : CONTACT_CONFIDENTIALITE (aucune
 * adresse n'est inventée ici) et, si besoin, la région d'hébergement Supabase.
 */

/** Adresse de contact pour les questions de confidentialité : À RENSEIGNER par l'équipe. */
export const CONTACT_CONFIDENTIALITE = "";

/** Version du texte : la changer redemande le consentement à chacune. */
export const VERSION_CONSENTEMENT = "2026-10-27";
export const DATE_POLITIQUE = "27/10/2026";

export interface SectionPolitique {
  titre: string;
  paragraphes: string[];
}

export const POLITIQUE: SectionPolitique[] = [
  {
    titre: "En bref",
    paragraphes: [
      "PagLaafi informe et oriente sur la santé des femmes et le cancer du sein. Ce n'est pas un service médical : l'application ne pose aucun diagnostic et ne remplace pas un soignant.",
      "Nous collectons le moins de données possible, nous ne les vendons pas, et il n'y a ni publicité ni traceur publicitaire.",
    ],
  },
  {
    titre: "Données enregistrées en ligne (mode réel, avec un compte)",
    paragraphes: [
      "Votre compte : adresse email et mot de passe (le mot de passe est géré par notre fournisseur Supabase ; personne chez PagLaafi ne peut le lire).",
      "Votre profil : nom, prénom, téléphone, et votre rôle (utilisatrice, centre, docteur, association).",
      "Vos rappels de santé (dépistage, rendez-vous, traitement), visibles par vous seule.",
      "Pour les professionnels : demandes d'adhésion, annonces et fiches de connaissance proposées.",
      "Un compteur du nombre de questions posées à Rose IA par jour (pour limiter les abus), sans le contenu des questions.",
      "Ces données sont stockées chez Supabase (base de données hébergée). Les règles d'accès empêchent chaque compte de lire les données des autres.",
    ],
  },
  {
    titre: "Données gardées uniquement sur votre téléphone",
    paragraphes: [
      "Votre cycle, vos autopalpations et leur historique restent sur votre appareil. En mode réel, ils sont rattachés à votre compte et chiffrés avec une clé créée sur votre appareil : une autre personne qui se connecte sur le même téléphone ne les voit pas.",
      "Une copie de votre profil (nom, prénom, rôle) est gardée de la même façon, chiffrée sur l'appareil, pour que l'application reste utilisable hors connexion.",
      "Limite de cette protection : elle ne protège pas contre quelqu'un qui utilise votre téléphone déverrouillé avec votre session ouverte. Effacer les données du navigateur ou désinstaller l'application efface aussi la clé : ces données sont alors perdues.",
      "La discussion avec Rose IA n'est pas conservée sur l'appareil en mode réel. Votre langue préférée et votre consentement sont aussi enregistrés sur l'appareil.",
      "Si vous l'autorisez, votre position sert uniquement sur votre téléphone à calculer la distance jusqu'aux centres de santé : elle n'est ni envoyée ni enregistrée. Si vous choisissez une ville à la place, elle est gardée sur l'appareil.",
    ],
  },
  {
    titre: "Ce qui est envoyé à Rose IA (Gemini de Google)",
    paragraphes: [
      "Quand vous posez une question à Rose IA, seule la question est envoyée, sans votre nom, votre profil, votre cycle ni vos messages précédents. Avant l'envoi, les noms, numéros de téléphone, emails et dates écrits dans la question sont automatiquement masqués.",
      "La question est traitée par l'API Gemini de Google. Avec l'offre gratuite de Gemini, Google peut utiliser ces échanges pour améliorer ses services, et des personnes peuvent les relire. N'écrivez donc jamais d'information personnelle dans vos questions.",
      "PagLaafi n'enregistre pas le texte de vos questions.",
    ],
  },
  {
    titre: "Durée de conservation",
    paragraphes: [
      "Compte, profil, rappels et demandes : jusqu'à la suppression de votre compte.",
      "Données sur votre téléphone : jusqu'à ce que vous les supprimiez, ou que vous effaciez les données du navigateur.",
      "Questions envoyées à Gemini : selon les conditions de Google.",
    ],
  },
  {
    titre: "Comment tout supprimer",
    paragraphes: [
      "Menu → « Confidentialité & Données » → « Supprimer mes données ». Après confirmation (taper SUPPRIMER), votre compte et toutes vos données en ligne sont supprimés, ainsi que vos données de santé sur cet appareil.",
      "Se déconnecter ne supprime rien : vos données de santé restent sur l'appareil, chiffrées et rattachées à votre compte.",
    ],
  },
  {
    titre: "Mode démo",
    paragraphes: [
      "En mode démo (compétition), les profils et données sont fictifs, rien n'est envoyé à Supabase ni à Gemini, et ce que vous saisissez reste sur l'appareil.",
    ],
  },
];

export const POINTS_CONSENTEMENT = [
  "PagLaafi informe et oriente : ce n'est pas un service médical et Rose IA ne remplace pas un soignant.",
  "Votre cycle et vos autopalpations restent sur votre téléphone. Avec un compte, votre profil et vos rappels sont enregistrés en ligne (Supabase).",
  "Les questions posées à Rose IA sont envoyées anonymisées à Gemini (Google), qui peut les utiliser pour améliorer ses services : n'y écrivez rien de personnel.",
  "Vous pouvez tout supprimer à tout moment depuis « Confidentialité & Données ».",
];
