export type HealthArticle = {
  id: string;
  category: string;
  title: string;
  summary: string;
  readingTime: string;
  paragraphs: string[];
  sourceName: string;
  sourceDate: string;
  sourceUrl: string;
};

export type HealthCentre = {
  id: string;
  name: string;
  city: string;
  region: string;
  description: string;
  verified: boolean;
  address?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
};

export const WHO_BREAST_CANCER_URL =
  "https://www.who.int/fr/news-room/fact-sheets/detail/breast-cancer";

export const articles: HealthArticle[] = [
  {
    id: "reperes",
    category: "Les bases",
    title: "Comprendre les premiers repères",
    summary:
      "Des mots simples pour comprendre de quoi l’on parle et savoir où chercher une information fiable.",
    readingTime: "3 min",
    paragraphs: [
      "Le cancer du sein apparaît lorsque certaines cellules du sein se multiplient de manière anormale. Une information générale ne permet pas de savoir ce qu’un changement signifie pour une personne en particulier.",
      "Les informations présentées ici sont des repères généraux. Un professionnel de santé est la bonne personne pour évaluer une situation personnelle et expliquer les options disponibles.",
      "Les recommandations de dépistage et les parcours de soins peuvent dépendre des règles locales et des services disponibles. Demandez conseil à une structure de santé de votre région.",
    ],
    sourceName: "Organisation mondiale de la Santé",
    sourceDate: "Mise à jour : 3 juillet 2026",
    sourceUrl: WHO_BREAST_CANCER_URL,
  },
  {
    id: "changements",
    category: "Quand demander conseil",
    title: "Un changement mérite un avis",
    summary:
      "Certains changements du sein peuvent justifier de demander une évaluation à un professionnel.",
    readingTime: "4 min",
    paragraphs: [
      "L’Organisation mondiale de la Santé cite notamment une masse ou un épaississement, un changement de taille ou de forme, une modification de la peau ou du mamelon, ou un écoulement anormal.",
      "La plupart des masses ne sont pas cancéreuses. Il n’est pas possible de déterminer la cause à partir d’une application : seul un professionnel de santé peut procéder à une évaluation.",
      "Si vous remarquez un changement qui vous inquiète, demandez conseil auprès d’un professionnel ou d’une structure de santé. PagLaafi ne peut pas évaluer vos symptômes ni remplacer une consultation.",
    ],
    sourceName: "Organisation mondiale de la Santé",
    sourceDate: "Mise à jour : 3 juillet 2026",
    sourceUrl: WHO_BREAST_CANCER_URL,
  },
  {
    id: "depistage",
    category: "Préparer une question",
    title: "Parler du dépistage",
    summary:
      "Quelques questions simples peuvent aider à discuter des options avec un professionnel de santé.",
    readingTime: "2 min",
    paragraphs: [
      "Les programmes de dépistage, les examens proposés et les personnes concernées peuvent varier selon les recommandations nationales et la situation de chacune.",
      "Vous pouvez demander à un professionnel de santé : quelles options sont disponibles dans ma région ? Où puis-je obtenir une information fiable ? Que se passe-t-il si un examen nécessite un suivi ?",
      "Cette page ne fixe pas d’âge ni de fréquence de dépistage. Pour le Burkina Faso, les conseils doivent être confirmés auprès des autorités sanitaires et des professionnels locaux.",
    ],
    sourceName: "Organisation mondiale de la Santé",
    sourceDate: "Repères généraux",
    sourceUrl: WHO_BREAST_CANCER_URL,
  },
];

// Do not add facilities here until a local health partner has verified their
// services, address, and contact details. The app renders a safe empty state.
export const healthCentres: HealthCentre[] = [];
