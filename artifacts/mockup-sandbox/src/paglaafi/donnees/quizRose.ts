/**
 * Données du Quiz de Prévention & Santé Féminine avec Rose IA :
 * Questions médicalement validées selon les recommandations OMS et du Ministère de la Santé du Burkina Faso.
 * Adapté pour l'éducation bienveillante, l'autopalpation et le dépistage précoce.
 */

export interface QuestionQuiz {
  id: number;
  question: string;
  options: string[];
  reponseCorrecte: number;
  explication: string;
}

export const QUESTIONS_QUIZ_ROSE: QuestionQuiz[] = [
  {
    id: 1,
    question: "Détecté à un stade précoce, le cancer du sein se guérit-il ?",
    options: [
      "Oui, dans plus de 9 cas sur 10",
      "Non, c'est une maladie incurable",
      "Uniquement avec des tisanes traditionnelles",
    ],
    reponseCorrecte: 0,
    explication:
      "Absolument ma sœur ! Détecté tôt par l'autopalpation ou la mammographie, le cancer du sein se guérit dans plus de 90 % des cas. C'est pourquoi un dépistage régulier sauve des vies.",
  },
  {
    id: 2,
    question: "Quel est le meilleur moment du mois pour pratiquer l'autopalpation des seins ?",
    options: [
      "Pendant le premier jour des règles",
      "2 à 3 jours après la fin des règles",
      "N'importe quand, une fois par an seulement",
    ],
    reponseCorrecte: 1,
    explication:
      "Bravo ! Quelques jours après la fin des règles, les seins sont plus souples et moins sensibles aux hormones, ce qui permet de bien repérer toute anomalie éventuelle.",
  },
  {
    id: 3,
    question: "Si je ressens une petite boule ou nodule dans le sein, est-ce forcément un cancer ?",
    options: [
      "Non, dans plus de 8 cas sur 10, il s'agit d'une anomalie bénigne",
      "Oui, c'est automatiquement un cancer grave",
      "Il ne faut rien faire et attendre que cela disparaisse seul",
    ],
    reponseCorrecte: 0,
    explication:
      "Très juste ! Plus de 8 boules sur 10 sont de simples kystes bénins d'eau ou des adénofibromes sans gravité. Mais il faut toujours consulter une sage-femme ou un médecin pour en avoir le cœur net.",
  },
  {
    id: 4,
    question: "Quels sont les signes d'alerte qui doivent m'amener à consulter rapidement un centre de santé ?",
    options: [
      "Une fossette, une peau d'orange ou un écoulement du mamelon",
      "Une simple fatigue après une longue journée",
      "Avoir soif pendant la saison chaude",
    ],
    reponseCorrecte: 0,
    explication:
      "Exactement ! Une rétraction du mamelon, un aspect peau d'orange, une rougeur persistante ou un écoulement spontané doivent vous conduire sans délai chez un professionnel de santé.",
  },
  {
    id: 5,
    question: "Où peut-on se faire examiner et dépister au Burkina Faso ?",
    options: [
      "Dans les CMA, CHU (Bogodogo, Schiphra, etc.) et centres partenaires",
      "Uniquement dans des cliniques privées à l'étranger",
      "Nulle part, aucun examen n'est disponible",
    ],
    reponseCorrecte: 0,
    explication:
      "Tout à fait ! Au Burkina Faso, le CHU Bogodogo, le CMA Schiphra, l'ABBEF et nos centres partenaires accueillent et accompagnent les femmes avec douceur. Retrouvez-les directement dans l'onglet « Centres » de PagLaafi !",
  },
];
