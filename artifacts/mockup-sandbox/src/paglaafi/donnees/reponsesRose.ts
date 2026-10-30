/**
 * Réponses de Rose IA par mots-clés (mode démo, sans intelligence artificielle).
 *
 * La première règle dont un mot-clé apparaît dans la question (normalisée en
 * minuscules sans accents) est utilisée ; à défaut, réponse générique.
 * L'ordre des règles compte. Remplacé en phase 3 par une recherche dans des
 * fiches validées (RAG).
 *
 * ⚠️ Contenu médical, tarifs et traductions Mooré/Dioula NON VALIDÉS : à faire
 * relire par des soignants et des locuteurs avant toute publication.
 */

import type { ContenuMultilingue, MedicalKnowledge } from "../types";

export interface RegleReponseRose {
  theme: string;
  motsCles: string[];
  reponse: ContenuMultilingue;
}

export const reglesReponsesRose: RegleReponseRose[] = [
  {
    theme: "salutations, politesse & présentation",
    motsCles: [
      "bonjour",
      "salut",
      "bonsoir",
      "coucou",
      "qui es tu",
      "qui t'a",
      "comment vas tu",
      "comment tu t'appelles",
      "presente",
      "aide moi",
    ],
    reponse: {
      fr: "Bonjour ma soeur bien-aimée ! Je suis Rose IA, ton assistante intelligente et bienveillante sur PagLaafi. Je suis à ton entière écoute sans tabou ni jugement : autopalpation des seins, hygiène intime, remèdes locaux (moringa, baobab), apaisement des règles ou dépistage dans les centres du Burkina. Comment te sens-tu aujourd'hui ?",
      en: "Hello my beloved sister! I am Rose AI, your caring and holistic health companion on PagLaafi. I am here to listen and guide you without judgment: breast self-exam, intimate care, local nutrition, period comfort, and screenings in Burkina Faso. How can I assist you today?",
      moore:
        "Ne y beogo m maaso ! Mam yaa Rose IA, fo laafi zoa PagLaafi pʋgẽ. M be ka n na n sõng fõ ne yĩn-sõngr, rɩɩb sõma (moringa, baobab), pʋg-tõor bɩ bãas gɩdgre. Bõe n be fo sũurẽ rũndã ?",
      dioula:
        "I ni sɔgɔma n ma muso ! Ne ye Rose IA ye PagLaafi kɔnɔ. Ne bɛ yan k'i dɛmɛ kɛnɛya, i yɛrɛ saniya, dumuni ɲuman ani kalo-sira la. Mun b'i kɔnɔ bi ?",
    },
  },
  {
    theme: "quiz interactif de prévention",
    motsCles: [
      "quiz",
      "qcm",
      "tester mes connaissances",
      "jouer",
      "evaluation",
      "test",
    ],
    reponse: {
      fr: "C'est une merveilleuse idée ma soeur ! Tester ses connaissances est le meilleur moyen d'ancrer les réflexes qui sauvent. Touche le bouton « Démarrer le Quiz Rose IA » sous ce message pour commencer notre série de 5 questions bienveillantes !",
      en: "That is a wonderful idea my sister! Testing your knowledge is the best way to master life-saving habits. Tap the 'Start Rose AI Quiz' button below to begin our 5 caring questions!",
      moore:
        "Yaa bũmb sõma wʋsgo ! Tõnd sã n bãng bãag gɩdgre bũmb ninsã, d tõe n kogl d yĩng la d zak rãmba. Sok-y maam !",
      dioula:
        "O ye kuma ɲumanba ye ! K'i hakili lajɛ banna gɛlɛnba kɔnɔ, o bɛ ka dɛmɛ kɛ kosɛbɛ.",
    },
  },
  {
    theme: "autopalpation, gestes pratiques & technique d'examen",
    motsCles: [
      "autopalpation",
      "palpation",
      "palper",
      "palpe",
      "examiner",
      "toucher",
      "comment faire",
      "geste",
      "technique",
      "etape",
      "methode",
      "quand",
      "moment",
    ],
    reponse: {
      fr: "L'autopalpation se réalise en 3 étapes douces, idéalement 2 à 7 jours après la fin de tes règles : 1° Face au miroir, regarde l'aspect de tes seins bras baissés puis levés (recherche un creux, une rougeur ou une rétractation). 2° Lève un bras et palpe avec la pulpe des 3 doigts du milieu en petits cercles fermes de l'extérieur vers le mamelon, debout puis allongée. 3° Examine sous l'aisselle et presse doucement le mamelon pour vérifier l'absence d'écoulement. Regarde la vidéo démonstrative avec notre sage-femme en cliquant sur le bouton ci-dessous !",
      en: "Breast self-exam is done in 3 gentle steps, best scheduled 2 to 7 days after your period: 1° Look in the mirror with arms relaxed then raised (check for dimples or retraction). 2° Raise one arm and feel firmly with the pads of your 3 middle fingers in small circular motions toward the nipple, standing and lying down. 3° Check under your armpit and gently squeeze the nipple for any discharge. Watch the step-by-step video with our midwife below!",
      moore:
        "Yĩn-gesgo wã tũuda vɛr a tãabo, pʋg-peelgã poore rasem a 2 n ta a 7: 1° Ges fo meng laloorẽ n gũus fo yĩnsã rɩsg la gõosgo. 2° Yiis fo nus n kɛlees ne nus-bi a tãabã pãng n lilli n kẽng zĩ-kãsengã wɛɛngẽ. 3° Ges fo baglem pʋgẽ la fo bĩidã bɩ zɩɩm pa yit ye. Ges-y video wã bilfu !",
      dioula:
        "Bɔlɔkɔrɔ lajɛ bɛ kɛ taabolo saba de la, kalo-sira ban kɔfɛ tle 2 fo 7: 1° I yɛrɛ lajɛ filɛli-fɛn na k'a filɛ ni yɛlɛmali dɔ bɛ yen. 2° I bɔlɔ kɔrɔta ka bɔlɔden saba kɛ k'a sɛgɛsɛgɛ lali maana la fo ka ta masiɲɛ na. 3° I kaman kɔrɔ lajɛ ani i sin-toli dɔɔnin digi. Vidéow lajɛ duguma sabali !",
    },
  },
  {
    theme: "boule, nodule, kyste, masse, grosseur & symptômes",
    motsCles: [
      "boule",
      "nodule",
      "kyste",
      "masse",
      "grosseur",
      "dur",
      "ganglion",
      "gonflement",
      "ecoulement",
      "liquide",
      "peau d'orange",
      "retractation",
      "creux",
    ],
    reponse: {
      fr: "Respire calmement ma soeur, ne panique pas : dans plus de 8 cas sur 10, une boule ou un nodule n'est PAS un cancer (il s'agit très souvent d'un simple kyste liquide ou d'un adénofibrome bénin très fréquent). Cependant, la seule façon d'avoir le coeur net et d'être en paix est de la faire examiner rapidement par une sage-femme ou un médecin dans un centre de santé. Tu peux consulter l'onglet 'Centres' pour trouver le plus proche.",
      en: "Breathe gently my sister, do not panic: in more than 8 out of 10 cases, a lump is NOT cancer (it is often a benign fluid cyst or fibroadenoma). However, having it examined promptly by a midwife or doctor brings complete peace of mind. Check the 'Centres' tab to visit a facility near you.",
      moore:
        "Vʋʋsm sõma m maaso, da zoe rabeem ye: bõn-kʋds a nii (8) piig pʋgẽ pa bã-kãsenga ye (yaa kystes bal). La yaa tɩlae tɩ dɔgɔtɔr ges-a tao-tao tɩ fo sũur gãande kɛnɛyaso pʋgẽ. Mam be ne yãmba.",
      dioula:
        "I ni lafiɲɛ dɔrɔn, kana siran: kunkolo tan kɔnɔ segin tɛ bana juguman ye. Nka kɛnɛyaso lajɛ jona de bɛ hakili sigi dɔgɔtɔrɔmuso fɛ. Taga kɛnɛyaso la jona.",
    },
  },
  {
    theme: "centres de santé, hôpitaux & où aller à ouaga / burkina",
    motsCles: [
      "centre",
      "hopital",
      "clinique",
      "ou aller",
      "ouaga",
      "bobo",
      "schiphra",
      "yalgado",
      "bogodogo",
      "pissy",
      "tingandogo",
      "rdv",
      "rendez vous",
      "rendez-vous",
    ],
    reponse: {
      fr: "Au Burkina Faso, plusieurs centres spécialisés sont à ton service pour le dépistage et la prise en charge : 1° CHU de Bogodogo (Pôle Mère-Enfant avec mammographe numérique ouvert). 2° Centre Médical Schiphra à Tanghin (dépistage et tarifs subventionnés). 3° CHU Yalgado Ouédraogo (Service de cancérologie & sénologie). 4° CMA de Pissy et centres de santé CSPS pour la palpation clinique gratuite. Consulte l'onglet 'Centres' pour lancer l'itinéraire GPS en un clic !",
      en: "In Burkina Faso, excellent health centers welcome you: 1° CHU Bogodogo (Mother-Child specialized pole). 2° Schiphra Medical Center in Tanghin (subsidized screenings). 3° CHU Yalgado Ouédraogo (Oncology & Senology). 4° CMA Pissy and local CSPS clinics. Open the 'Centres' tab to get GPS directions instantly!",
      moore:
        "Burkina Faso ka, kɛnɛyasow wʋsg bee n gũud yãmba: CHU Bogodogo, Centre Médical Schiphra Tanghin, CHU Yalgado Ouédraogo, la CMA Pissy. Nus n gesã yaa zaalem. Ges-y 'Centres' n bãng zĩiga tao-tao.",
      dioula:
        "Burkina Faso la, kɛnɛyasow caman bɛ yen: CHU Bogodogo, Centre Médical Schiphra Tanghin, CHU Yalgado, ani CMA Pissy. Bɔlɔkɔrɔ lajɛ sɔngɔ ye fu ye. Taga 'Centres' siratigɛ la ka siraw ye.",
    },
  },
  {
    theme: "prix, coûts, tarifs & fcfa",
    motsCles: ["prix", "cout", "combien", "tarif", "argent", "fcfa", "gratuit", "payer", "cher"],
    reponse: {
      fr: "Au Burkina Faso : 1° La palpation clinique de dépistage est 100% GRATUITE (0 FCFA) dans les centres publics et les campagnes de sensibilisation. 2° L'échographie mammaire coûte entre 6 000 et 7 500 FCFA. 3° La mammographie coûte entre 10 000 et 12 000 FCFA (subventionnée à 5 000 FCFA à Schiphra pour les femmes vulnérables grâce aux dons). L'argent ne doit jamais être un frein à ta santé.",
      en: "In Burkina Faso: 1° Clinical breast exams are 100% FREE (0 FCFA) in public centers and campaigns. 2° Breast ultrasound costs 6,000 to 7,500 FCFA. 3° Mammography is 10,000 to 12,000 FCFA (subsidized to 5,000 FCFA at Schiphra for vulnerable women). Financial concerns must never prevent medical care.",
      moore:
        "Burkina Faso ka, nus n gesã yaa zaalem (0 FCFA) kɛnɛyaso wʋsg pʋgẽ. Échographie yaa 6 000 n ta 7 500 FCFA, la mammographie yaa 10 000 n ta 12 000 FCFA (subventionné a 5 000 FCFA Schiphra). Ligdi da yɩ gɩdgr fo laafɩ wɛɛngẽ ye.",
      dioula:
        "Burkina Faso la, bɔlɔkɔrɔ lajɛ sɔngɔ ye fu ye (0 FCFA). Échographie ye 6 000 fo 7 500 FCFA ye, mammographie ye 10 000 fo 12 000 FCFA ye. Wari kana kɛ gɛlɛya ye i ka kɛnɛya siratigɛ la.",
    },
  },
  {
    theme: "peur, angoisse, détresse, mort & soutien émotionnel",
    motsCles: ["peur", "angoisse", "panique", "mourir", "mort", "stress", "triste", "pleur", "seule", "moral", "choc"],
    reponse: {
      fr: "Respire profondément ma soeur, pose la main sur ton coeur : tu n'es pas seule, je suis là et les soignants sont à tes côtés. La peur est une réaction tout à fait humaine, mais rappelle-toi ceci avec force : le cancer du sein n'est pas une condamnation ! Détecté tôt, il se guérit dans plus de 9 cas sur 10. Tu as une valeur inestimable pour ta famille et pour nous. Nous allons avancer pas à pas avec tendresse et courage.",
      en: "Take a deep breath my sister, place your hand on your heart: you are not alone, I am here with you. Fear is entirely normal, but remember this: breast cancer is not a fatality! Detected early, more than 9 out of 10 women are cured completely. You have courage and we are by your side step by step.",
      moore:
        "M maaso, vʋʋsm sõma n ning fo nuga fo sũurẽ : fo ka fo yembr ye, mam be ne fo. Zõeemã yaa bũmb sẽn pa wẽnga ninsaal pʋgẽ, la bãagã sã n bãng tao-tao a vʋʋgda sõma. Bãng tɩ fo tara pãng, la d na n zĩnd ne taab wakat fãa.",
      dioula:
        "I dusu suma n ma muso, i bɔlɔ bila i dusu kan: i ma kelen ye, ne bɛ yan i kɔrɔ. Siran bɛ mɔgɔ bɛɛ la, nka ni bana ye jona, mɔgɔ bɛ kɛnɛya kosɛbɛ. An bɛ i kɔrɔ ni barika ye.",
    },
  },
  {
    theme: "guérison, chances, espoir & traitement",
    motsCles: ["guerir", "guerison", "soigner", "espoir", "chances", "survie", "stade"],
    reponse: {
      fr: "Oui, le cancer du sein se guérit très bien ! Lorsqu'il est découvert à un stade précoce grâce à l'autopalpation mensuelle et au dépistage, le taux de guérison dépasse 90%. Au Burkina Faso, les équipes médicales disposent de chirurgies réparatrices, de traitements adaptés et d'un accompagnement fraternel. L'espoir et la vie triomphent toujours quand on agit tôt.",
      en: "Yes, breast cancer is highly curable! When diagnosed early through monthly self-exams and screening, the cure rate exceeds 90%. In Burkina Faso, medical teams provide modern treatments and caring support. Hope and life always win when we act early.",
      moore:
        "N-ye, bãaga wã tõe n komsame hal n sa ! Sã n mik tɩ bãngrã yɩɩ tao-tao, neb piig pʋgẽ a wae (9) vʋʋgda fasafasa. Kẽng dɔgɔtɔr zĩigẽ n bãng fo laafi.",
      dioula:
        "Ɔwɔ, bana nin bɛ se ka kɛnɛya kosɛbɛ ! Ni a yera jona, mɔgɔ tan kɔnɔ kɔnɔntɔn bɛ kɛnɛya tiɲɛ na. Kɛnɛyaso bɛ dɛmɛ di.",
    },
  },
  {
    theme: "règles, crampes, cycle menstruel & douleurs du ventre",
    motsCles: ["regle", "menstru", "crampe", "ventre", "cycle", "douleur", "retard"],
    reponse: {
      fr: "Je te comprends profondément ma soeur, les douleurs de règles peuvent être épuisantes. Pour t'apaiser naturellement : applique un linge tiède sur ton bas-ventre, bois une infusion chaude de gingembre ou de kinkeliba, masse doucement ton ventre avec un peu de beurre de karité et repose-toi. Si la douleur est si forte qu'elle t'empêche de vaquer à tes occupations, parles-en à une sage-femme car cela peut être de l'endométriose.",
      en: "I hear you deeply, menstrual pain can be genuinely exhausting. To soothe cramps naturally: apply a warm cloth to your lower belly, drink warm ginger or kinkeliba tea, gently massage with shea butter, and rest. If severe pain prevents your daily activities, consult a midwife to check for endometriosis.",
      moore:
        "Pʋg-tõor namsda pagb wʋsg. Bõn-sõma n tõe n koms-a: ning-y fu-tʋʋlga y pʋgẽ, nyũ-y gingembre koom bɩ kinkeliba ko-tʋʋlga, rɩk karité kam n so y pʋgã bilfu, la y vʋʋse.",
      dioula:
        "Kalo-sira dimi bɛ muso caman tɔɔrɔ. Walasa k'a dɔgɔya: fɛn kaliman bila i kɔnɔ la, jinɛbɛrɛ-ji sumana min, si-tulu dɔoni kɛ i kɔnɔ la ka lafiɲɛ kɛ.",
    },
  },
  {
    theme: "hygiène intime, toilette, pertes & flore vaginale",
    motsCles: [
      "toilette",
      "intime",
      "savon",
      "perte",
      "odeur",
      "vagin",
      "vulve",
      "mycose",
      "demange",
      "brulure",
      "coton",
    ],
    reponse: {
      fr: "Ma soeur, ton intimité est délicate et précieuse. La règle d'or des soignants est simple : lave uniquement la partie extérieure (la vulve) à l'eau propre ou avec un savon doux sans parfum. Ne fais JAMAIS de douche vaginale interne ni n'introduis de poudres décapantes : le vagin possède son propre système d'auto-nettoyage. Porte des culottes en coton. Si tu as des démangeaisons ou des pertes inhabituelles, consulte une sage-femme sans aucune honte.",
      en: "My sister, your intimate health is delicate and precious. The golden rule is simple: wash only the outside (the vulva) with clean water or mild unscented soap. NEVER practice internal douching or use harsh powders: the vagina cleanses itself naturally. Wear cotton underwear. If you have itching or unusual discharge, visit a midwife with full confidence.",
      moore:
        "M maaso, fo yĩng sõngr yaa tɩlae wʋsg. Rɩk koom sõma bal n peeg fo meng yĩng zĩ-kẽemã yell bal. Da rɩk tɩɩm dãmb n kẽes fo pʋgẽ ye, bala a sãamda fo yĩnsa laafi. Yeelg fu-kõbdo sẽn yaa koton.",
      dioula:
        "N ma muso, i yɛrɛ saniya ko ka kɔrɔtanin kosɛbɛ. Ji saniya dɔrɔn de kɛ kɔkan, kana fɛn juguw don kɔnɔna na abada. Koton faniw don funteni senfɛ. Ni fɛn dɔ y'i gɛlɛya, taga dɔgɔtɔrɔmuso fɛ sabali.",
    },
  },
  {
    theme: "nutrition sahélienne, moringa, baobab & bien-être",
    motsCles: [
      "moringa",
      "baobab",
      "soumbala",
      "singe",
      "manger",
      "nutrition",
      "vitamine",
      "anemie",
      "fatigue",
      "sel",
      "bouillon",
      "cube",
      "eau",
      "boire",
    ],
    reponse: {
      fr: "Pour préserver ta vitalité et prévenir les maladies au Burkina Faso, la nature nous a offert des trésors : les feuilles de Moringa regorgent de fer contre la fatigue et l'anémie, la pulpe de Baobab (pain de singe) est un concentré d'antioxydants et de vitamine C, et le Soumbala traditionnel protège le coeur et la tension. Évite les bouillons cubes industriels trop salés, et bois au moins 2 à 3 litres d'eau propre par jour.",
      en: "To preserve your vitality in the Sahel, nature has provided wonders: Moringa leaves offer rich iron against fatigue and anemia, Baobab fruit (pain de singe) brings powerful antioxidants and vitamin C, and authentic Soumbala protects the heart. Reduce salty bouillon seasoning cubes, and drink 2 to 3 liters of clean water daily.",
      moore:
        "Burkina Faso ka, Wẽnd kõ-d-la rɩɩb sõma wʋsg: moringa vaadã kẽesda pãng fo zɩlem pʋgẽ n gɩdg zɩ-komlem, tɔɔd bɩ zɩt-yɩla waoogda pãng, la sumbala sõngda sũurã laafi. Gɩdg yaalem wʋsg, la nyũ-y koom sõma dahar fãa.",
      dioula:
        "An ka faso la, kɛnɛya dumunifɛnw caman bɛ yen: moringa buluw bɛ fanga di joliko la, sira-den bɛ kɛnɛya gansan di, ani sumbala bɛ dusu mara. Maggi cube ka caya tɛ kɛnɛya ye, ji saniya min don o don.",
    },
  },
  {
    theme: "dépistage du col de l'utérus",
    motsCles: ["col", "uterus", "frottis", "iva", "hpv", "vaccin"],
    reponse: {
      fr: "Le col de l'utérus mérite toute ton attention : un simple dépistage visuel (test IVA) ou frottis réalisé en 5 minutes par une sage-femme permet de repérer des petites anomalies bien avant qu'elles ne se transforment. C'est rapide, indolore et disponible dans tous les CSPS et CMA du Burkina. Fais ce dépistage tous les 3 ans !",
      en: "Cervical health is vital: a simple visual inspection (VIA test) or pap smear done in 5 minutes by a midwife detects early changes years in advance. It is quick, painless, and available at all CSPS and CMA clinics in Burkina Faso. Get screened every 3 years!",
      moore:
        "Pʋg-kɛenga laafi yaa tɩlae wʋsg. Bãaga wã tõe n gɩdgame sã n mik tɩ dɔgɔtɔr ges-a zĩigẽ (test IVA). A pa namsd ye, a pa rɩkd wakat wʋsg ye. Bãng-y fo laafi yʋʋm a tãab fãa pʋgẽ.",
      dioula:
        "Kɔnɔna juru bana bɛ se ka bali sani a ka juguya. Dɔgɔtɔrɔmuso bɛ se k'a lajɛ sekondi damanin kɔnɔ (test IVA). A tɛ dimi, a bɛ sɔrɔ kɛnɛyasow bɛɛ la. O kɛ kalo 36 o kalo 36 kɔnɔ.",
    },
  },
  {
    theme: "grossesse, allaitement & ménopause",
    motsCles: ["enceinte", "grossesse", "bebe", "allait", "menopause", "bouffee"],
    reponse: {
      fr: "Chaque étape de la vie d'une femme est un passage précieux. Que tu sois enceinte, jeune maman allaitante ou en ménopause, écoute ton corps : bois beaucoup d'eau, consomme des aliments frais riches en calcium et en fer, et pratique la marche. Si tu constates un saignement inattendu ou un nodule mammaire pendant ou après la grossesse/ménopause, consulte sans tarder.",
      en: "Every stage in a woman's journey is precious. Whether pregnant, nursing, or navigating menopause, listen to your body: stay hydrated, eat fresh nutrient-dense foods, and stay active. Any unexpected bleeding or breast changes warrant a prompt consultation.",
      moore:
        "Pʋg-yãmb laafi tekda wakat fãa: pʋg-tũub wakat, bi-doglem wakat, bɩ kʋdemd wakat. Nyũ-y ko-sumdo, rɩ-y rɩ-sõma. Sã n mik tɩ zɩɩm yii fo meng pʋgẽ tɩ pa wakat, kẽng dɔgɔtɔr tao-tao.",
      dioula:
        "Musoya ye yɛlɛmali yɔrɔ ye: kɔnɔtigi, denbaya, walima musokɔrɔya. Ji sumana min, dumuni kɛnɛ kɛ. Ni jolidon kɛra kɔfɛ, taga dɔgɔtɔrɔmuso fɛ jona.",
    },
  },
  {
    theme: "remerciements & au revoir",
    motsCles: [
      "merci",
      "bark biiga",
      "anitche",
      "thank",
      "au revoir",
      "bye",
      "a bientot",
      "bonne journee",
      "bonne soiree",
    ],
    reponse: {
      fr: "C'est un véritable honneur et un bonheur d'être à tes côtés, ma soeur ! Prends grand soin de toi et de ton corps. N'hésite jamais à revenir me parler dès que tu as une question ou besoin d'écoute. Que la paix et la santé t'accompagnent !",
      en: "It is an absolute honor and joy to accompany you, my sister! Take tender care of your body and well-being. Never hesitate to talk to me whenever you need guidance. May peace and radiant health stay with you!",
      moore:
        "Yaa sũ-noogo kãsenga mam yĩnga tɩ m sõng fo maaso ! Ges fo meng laafi sõma. Wakat fãa fo sã n tar sokre, wa n sok maam. Wẽnd kõ-f laafi la sũ-noogo !",
      dioula:
        "A ye ninsɔndiya ye ne bolo k'i dɛmɛ n ma muso ! I yɛrɛ ladon kosɛbɛ. Wagati o wagati, n'i b'a fɛ k'an ka kuma, na yan. Ala ka kɛnɛya n'i ye !",
    },
  },
  {
    theme: "don & solidarité",
    motsCles: ["don", "aider", "financer", "solidarite", "orange money", "association"],
    reponse: {
      fr: "Ton coeur est généreux ! L'onglet 'Faire un don' de PagLaafi permet de soutenir directement les femmes vulnérables du Burkina Faso via Orange Money (dès 500 FCFA). Tu peux choisir de faire un don à ton nom ou un don anonyme (ton nom et ton numéro sont alors masqués à l'affichage). Chaque contribution finance des dépistages et des mammographies gratuits.",
      en: "Your generosity warms my heart! PagLaafi's 'Faire un don' tab lets you support vulnerable women across Burkina Faso through Orange Money (from 500 FCFA). You can donate under your name or anonymously (your name and number are then hidden on display). Every contribution funds free screenings and mammograms.",
      moore:
        "Fo sũur yaa sõma wʋsg ! 'Faire un don' pʋgẽ, fo tõe n dɩka Orange Money (sẽn sɩng ne 500 FCFA) n sõng pagb nins sẽn ka tar ligdi tɩ b bãng b laafi zaalem. Barka wʋsg !",
      dioula:
        "I dusu ka ɲi kosɛbɛ ! 'Faire un don' bolo la, i bɛ se ka muso gɛlɛyaw dɛmɛ Orange Money fɛ (kabini 500 FCFA) walasa u ka kɛnɛya lajɛ sɔrɔ fu. I ni ce kosɛbɛ !",
    },
  },
];

/** Réponse générique lorsqu'aucune règle ne correspond (reprend la question). */
export const reponseParDefaut = (textToSend: string): ContenuMultilingue => ({
  fr: `J'ai bien reçu ta question avec toute mon attention, ma soeur : « ${textToSend} ». En matière de santé féminine, chaque ressenti et chaque interrogation méritent respect et clarté. Écoute ton corps : pratique l'autopalpation mensuelle (quelques jours après tes règles), veille à une bonne hydratation avec les super-aliments burkinabè (moringa, baobab), et n'hésite pas à consulter une sage-femme dans un centre partenaire si tu ressens un doute ou une gêne. Tu peux aussi me poser d'autres questions précises ou toucher le micro !`,
  en: `I received your message with care, my sister: "${textToSend}". In women's health, every concern deserves clear understanding and compassion. Listen to your body: practice monthly breast exams, enjoy wholesome local nutrition, and visit a midwife at a partner clinic whenever in doubt. Feel free to ask more details or speak to me via the microphone!`,
  moore: `M wʋma fo sokrã sõma m maaso : « ${textToSend} ». Fo laafi yaa tɩlae wʋsg : ges fo meng yĩnsã dahar fãa pʋg-peelgã poore, rɩ rɩ-sõma (moringa, baobab), la fo sã n mik bũmb sẽn pa zems fo yĩngẽ, kẽng n ges dɔgɔtɔr-pʋgbo kɛnɛyaso la. Sok-y maam bũmb a taaba !`,
  dioula: `N ye i ka ɲiningali mɛn kosɛbɛ n ma muso : « ${textToSend} ». I ka kɛnɛya kɔrɔtanin lo : i sinw sɛgɛsɛgɛ kalo-sira ban kɔfɛ, dumuni kɛnɛ kɛ (moringa, sira-den), wa ni fɛn dɔ y'i gɛlɛya, taga dɔgɔtɔrɔmuso fɛ jona. I bɛ se ka fɛn wɛrɛ ɲini ne fɛ !`,
});

/** Réponse citant une fiche clinique validée par un docteur. */
export const reponseFicheClinique = (doctorMatch: MedicalKnowledge): ContenuMultilingue => ({
  fr: `Protocole clinique validé par le ${doctorMatch.doctorName} (${doctorMatch.speciality}) : « ${doctorMatch.advice} » (Mis à jour le ${doctorMatch.date}).`,
  en: `Clinical recommendation validated by ${doctorMatch.doctorName} (${doctorMatch.speciality}): "${doctorMatch.advice}" (Updated on ${doctorMatch.date}).`,
  moore: `Dɔgɔtɔr ${doctorMatch.doctorName} saglsgo ne kaseto: « ${doctorMatch.advice} ».`,
  dioula: `Dɔgɔtɔrɔ ${doctorMatch.doctorName} ka ladili kɛnɛya siratigɛ la: « ${doctorMatch.advice} ».`,
});
