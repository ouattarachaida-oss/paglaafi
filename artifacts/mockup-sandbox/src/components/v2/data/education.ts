import type { EducationalLesson, RoseDailyTip } from "../types";

export const educationalLessons: EducationalLesson[] = [
  {
    id: 0,
    title: "Comprendre le cancer du sein sans jargon",
    category: "Les bases",
    duration: "4 min",
    summary: "Des repères clairs pour comprendre ce qui se passe dans le corps, sans dramatiser et avec des mots simples.",
    englishSummary: "Clear, non-technical explanations to understand what happens in the breast tissue without fear.",
    fullText:
      "Le cancer du sein commence lorsque des cellules du tissu mammaire se modifient et se multiplient anormalement. Dans la très grande majorité des cas, une petite boule ou un nodule n'est PAS un cancer : il s'agit souvent d'un kyste bénin ou d'un nodule fibreux sans danger. Cependant, seul un professionnel de santé peut faire la différence grâce à un examen indolore. Détecté très tôt, le cancer du sein se guérit dans plus de 9 cas sur 10. C'est pourquoi observer sa poitrine chaque mois et réaliser un dépistage régulier peut vous sauver la vie.",
    englishFullText:
      "Breast cancer develops when cells inside breast tissue grow abnormally. In most cases, a small lump or nodule is NOT cancerous: it is often a benign cyst. However, only a trained healthcare provider can make an accurate diagnosis. When detected early, breast cancer can be cured in more than 9 out of 10 cases. Monthly breast self-examination and regular clinical screenings save lives.",
    mooreSummary:
      "Bãagã sɩngda ne yĩns nimbas n baood n paasd b toorẽ. Pa bũmb fãa n yaa bãaga ye. Sã n yaa ne zĩig n bilfu tɩ y bãng bãagã zĩig ninga, y tõe n paama laafi tɩ loog wʋsg. Da zoe rabeem ye, tɩɩm dãmbã be n na n sõng yãmba.",
    dioulaSummary:
      "Bana nin bɛ kɛ tuma min kɛlilicɛlu bɛ yɛlɛma sin na ka caya. Fɛn caman min bɛ kɛ sin na, a tɛ bana juguman ye. Nka kɛnɛyaso dɔgɔtɔrɔmuso dɔrɔn lo bɛ se k'o dɔn. Ni ye a dɔn joona, furakɛli ka nɔgɔn.",
  },
  {
    id: 1,
    title: "Quand et comment demander conseil ?",
    category: "S'orienter",
    duration: "3 min",
    summary: "Les signes qui doivent vous amener à consulter sans paniquer : une boule, un écoulement ou un pli inhabituel.",
    englishSummary: "Signs that should prompt consultation: a palpable lump, discharge, or unusual skin dimpling.",
    fullText:
      "Il est recommandé de consulter dès que vous remarquez un changement inhabituel : une boule dans le sein ou sous l'aisselle qui ne disparaît pas après les règles, un écoulement au niveau du mamelon, ou un changement dans l'aspect de la peau comme une fossette ou une rougeur. N'ayez pas peur d'en parler. Les agents de santé des centres de santé du Burkina Faso sont formés pour vous écouter avec respect et discrétion. N'attendez pas d'avoir mal, car au tout début, le nodule ne fait généralement aucun mal.",
    englishFullText:
      "Consult a healthcare professional whenever you notice an unusual change: a persistent lump in the breast or armpit after your menstrual period, nipple discharge, or skin retraction. Never hesitate to talk to health professionals. Do not wait for pain to occur, as early nodules are typically painless.",
    mooreSummary:
      "Sã n yaa tɩ y yã bũmb n lebse y yĩnsa pʋgẽ, wa bõn-kʋdga bɩ kaset zĩiga, bɩ y wa zĩig ning b sẽn gũusd pagbã laafi. Da zoe rabeem ye, tɩɩm dãmbã be n na n sõng yãmba.",
    dioulaSummary:
      "Ni i ye bõn-kʋdga dɔ ye i sin kɔrɔ walima sin na, walima ji bɛ bɔ a nɔnɔda la, i kana siran. Taga kɛnɛyaso la jona, dɔgɔtɔrɔmusow bɛ yan k'aw lajɛ ne lafiya.",
  },
  {
    id: 2,
    title: "Accompagner une proche à son dépistage",
    category: "Pour les proches",
    duration: "5 min",
    summary: "Comment soutenir une sœur, une amie ou une épouse sans jugement et faciliter sa démarche de santé.",
    englishSummary: "How to support a sister, friend or wife without judgment and encourage regular healthcare checkups.",
    fullText:
      "Faire un dépistage peut susciter de l'inquiétude. Pour une femme, être accompagnée par une sœur, une amie, sa mère ou son conjoint transforme complètement cette expérience. Proposer un covoiturage, patienter ensemble dans la salle d'attente ou simplement lui rappeler avec douceur l'importance de ce geste sont des actes d'amour déterminants. L'application PagLaafi propose la fonction 'Aller à deux' pour envoyer une invitation chaleureuse par SMS direct ou sur WhatsApp.",
    englishFullText:
      "Undergoing a screening exam can trigger anxiety. For a woman, having a trusted sister, friend or spouse alongside makes all the difference. Offering transportation, waiting together, or gently reminding her of the appointment are true acts of care. The PagLaafi Go-Together module allows sending an invitation in one click via SMS or WhatsApp.",
    mooreSummary:
      "Sã n yaa tɩ ned na n tɩ ges a yĩnsa laafi, rabeem tõe n kẽ-a lame. Woto yĩnga, sã n yaa ne a kẽed-n-taag bɩ a ma bɩ a biiga n kẽnd ne-a, zĩigã lebnda noogo. Tʋm-y SMS bɩ WhatsApp kaset n bool-a tɩ y kẽng a yiibu.",
    dioulaSummary:
      "Ka taga kɛnɛyaso la k'i sin lajɛ, siran bɛ se ka kɛ o la. Ni balimamusow walima furuɲɔgɔn tagara ɲɔgɔn fɛ, hakili bɛ sigi. PagLaafi bɛ dɛmɛ kɛ ka weeleli ci SMS walima WhatsApp fɛ.",
  },
];

export const roseDailyTips: RoseDailyTip[] = [
  {
    id: 1,
    category: "nutrition",
    categoryLabel: "💧 Hydratation & Climat Sahélien",
    categoryColor: "bg-blue-100 text-blue-900 border border-blue-200",
    titleFr: "Boire de l'eau en abondance",
    fr: "Prends soin de ton corps ma sœur : avec la chaleur sahélienne, bois au moins 2 à 3 litres d'eau propre aujourd'hui. L'eau purifie tes reins, prévient les infections urinaires et donne de l'éclat à ta peau.",
    en: "Take care of your body my sister: in this Sahelian heat, drink at least 2 to 3 liters of clean water today. Water cleanses your kidneys, prevents urinary infections and brightens your skin.",
    moore: "Koom yaa vɩɩm m maaso. Ne tʋʋlgã wɛɛngẽ, nyũ koom wʋsg rũndã (litr a yiibu n ta a tãabo). Koomã sõngda fo yĩnsa la a gɩdgd bãase.",
    dioula: "Ji ye ɲɛnamaya ye n ma muso. Funteni na, ji min kosɛbɛ bi (litiri fila fo saba). Ji bɛ kɛnɛya d'i ma k'i yɛrɛ lakatoloban bana juguw ma.",
  },
  {
    id: 2,
    category: "nutrition",
    categoryLabel: "🌿 Trésors Locaux : Moringa & Baobab",
    categoryColor: "bg-emerald-100 text-emerald-900 border border-emerald-200",
    titleFr: "Le pouvoir fortifiant du Moringa & Baobab",
    fr: "Nourris ta vitalité avec la richesse de notre terre burkinabè : les feuilles de Moringa sont une mine de fer contre la fatigue et l'anémie, et la pulpe de Baobab regorge de vitamine C. Ajoute-les à tes repas pour fortifier ton immunité.",
    en: "Nourish your vitality with local superfoods: Moringa leaves provide natural iron against anemia, and Baobab fruit powder is packed with vitamin C. Add them to your meals to boost immunity.",
    moore: "Moringa la zɩt-yɩla yaa arzɛka kãsenga d tẽngẽ. A kẽesda pãng fo yĩngẽ n tõog zɩ-komlemã. Rɩ-b sõma fo laafi yĩnga.",
    dioula: "Moringa jiri-buluw ani sira-den mugu ye nafolo ye. U bɛ jolidɛmɛ kɛ ani ka fanga di faso musow ma. U don i ka dumunifɛnw na.",
  },
  {
    id: 3,
    category: "hygiene",
    categoryLabel: "🌸 Hygiène Intime Bienveillante",
    categoryColor: "bg-rose-100 text-rose-900 border border-rose-200",
    titleFr: "Douceur et respect de la flore intime",
    fr: "Un conseil d'amour pour ton intimité : lave uniquement la partie extérieure à l'eau propre. Le vagin se nettoie tout seul, évite les douches vaginales internes ou produits parfumés décapants qui détruisent sa flore protectrice.",
    en: "Gentle intimate hygiene: wash only the external area with clean water. The vagina cleanses itself; avoid internal douching or scented products that harm natural defenses.",
    moore: "Yĩn-sõngr wɛɛngẽ: rɩk ko-sõma n peeg fo meng yĩng zĩ-kẽemã yell bal. Da rɩk tɩɩm dãmb n dʋg fo pʋgẽ ye. Sã n mik tɩ yãmb wʋmda yĩn-wẽk, kẽng-y dɔgɔtɔr nengẽ.",
    dioula: "I yɛrɛ saniya ko la: ji saniya dɔrɔn de kɛ kɔkan. Kana fɛn gɛlɛnw don kɔnɔna na. Ni fɛn dɔ y'i gɛlɛya, taga dɔgɔtɔrɔmuso fɛ sabali.",
  },
  {
    id: 4,
    category: "mental",
    categoryLabel: "🧘 Sérénité & Amour de Soi",
    categoryColor: "bg-purple-100 text-purple-900 border border-purple-200",
    titleFr: "Tu as le droit de te reposer",
    fr: "Ma sœur, tu portes souvent le fardeau de toute la famille. N'oublie jamais que ton bien-être passe en premier : accorde-toi 15 minutes de calme et de repos aujourd'hui. Tu es précieuse, aimée et ton repos est légitime.",
    en: "My sister, you often carry the weight of the family. Never forget your well-being matters: take 15 minutes of calm and rest today. You are precious, loved, and rest is your right.",
    moore: "Yãmb tʋmda tʋʋm wʋsg zakã pʋgẽ. Da yĩm tɩ y meng laafi yaa tɩlae ye. Vʋʋsm-y bilfu rũndã. Yãmb yaa arzɛka kãsenga.",
    dioula: "I bɛ baara caman kɛ somɔgɔw ye. Kana ɲinɛ i yɛrɛ laafi kɔ. Lafiɲɛ dɔrɔn kɛ bi. I kɛnɛya kɔrɔtanin lo an bɛɛ fɛ.",
  },
  {
    id: 5,
    category: "cycle",
    categoryLabel: "🩸 Cycle & Règles Paisibles",
    categoryColor: "bg-rose-100 text-rose-900 border border-rose-200",
    titleFr: "Apaiser les crampes et règles douloureuses",
    fr: "Si ton ventre te fait souffrir pendant tes règles : pose un linge tiède sur ton bas-ventre, bois une infusion tiède de gingembre ou de kinkeliba, et marche doucement. Si la douleur est insupportable, n'hésite jamais à consulter un soignant.",
    en: "If you experience menstrual cramps: place a warm cloth on your lower abdomen, sip warm ginger or kinkeliba tea, and take gentle walks. If severe, consult a healthcare worker.",
    moore: "Sã n mik tɩ pʋg-tõor namsda yãmba pʋg-peelgã wakato : ning-y bõn-tʋʋlga y pʋgẽ, nyũ-y gingembre ko-tʋʋlga. Yãmb pa segd n nams ye.",
    dioula: "Ni kɔnɔdimi b'i la i ka kalo-sira la: fɛn kaliman bila i kɔnɔ la, jinɛbɛrɛ-ji sumana min. Ni dimi ka bon kojugu, an k'a fɔ dɔgɔtɔrɔ ye.",
  },
  {
    id: 6,
    category: "prevention",
    categoryLabel: "🩺 Prévention Globale & Dépistage",
    categoryColor: "bg-amber-100 text-amber-900 border border-amber-200",
    titleFr: "Le geste d'amour pour ton avenir",
    fr: "Le dépistage précoce (col de l'utérus et seins) n'est pas une sentence, c'est un bouclier d'amour pour toi et tes enfants. Le test IVA et l'autopalpation mensuelle sauvent des vies chaque jour au Burkina Faso.",
    en: "Early screening (cervix and breast) is not a diagnosis, it is a shield of love for yourself and family. VIA test and monthly self-exams save lives daily in Burkina Faso.",
    moore: "Laafi baoob pa bãag ye, yaa gɩdgre ninsaal ne a kamba yĩnga. D ges d seensã la d pʋgã kɛnɛya sõma n gɩdg bã-kãsengã.",
    dioula: "Kɛnɛyaso tagali tɛ bana ye, a ye lakana ye. Sinw bɔlɔkɔrɔ lajɛ ani kalo-kɔnɔ lajɛ bɛ denw baminaw kisi bana juguw ma.",
  },
];

export const roseKnowledgeBase: Record<string, { fr: string; en: string; moore: string; dioula: string }> = {
  mal: {
    fr: "Rassurez-vous avec tendresse : la mammographie ne fait généralement pas mal. C'est une pression ferme mais très brève (5 à 10 secondes par cliché) pour obtenir une image nette. Pour un confort optimal, prévoyez votre examen dans les 10 jours suivant la fin de vos règles, quand la poitrine est très souple.",
    en: "Rest assured with calm: mammography is generally not painful. It is a brief compression (5 to 10 seconds per view) to clearly display breast tissue. For greatest comfort, schedule it within 10 days after your period ends.",
    moore: "Da zoe rabeem ye: mammographie masĩnã pa namsd ninsaal wʋsg ye. A rɩkda sekõnd a wãn bal n kaset. Sã n mik tɩ y kẽngda pʋg-peelgã poore, yĩnsã tara pãng tɩ pa namsd ye.",
    dioula: "I kana siran: masin nin tɛ mɔgɔ dimi kosɛbɛ. A bɛ kɛ sekondi damanin dɔrɔn lo kɔnɔ. Ni kalo-sira banna, o de ye wagati ɲuman ye ka taga lajɛ kɛ.",
  },
  prix: {
    fr: "Au Burkina Faso, la palpation clinique de dépistage est GRATUITE (0 FCFA) dans les centres publics et les caravanes associatives. L'échographie coûte environ 6 000 à 7 500 FCFA, et la mammographie environ 10 000 à 12 000 FCFA (subventionnée à 5 000 FCFA à Schiphra pour les femmes vulnérables). L'argent ne doit jamais être un frein à votre santé.",
    en: "In Burkina Faso, clinical breast exams are FREE (0 FCFA) at public centers and outreach campaigns. Ultrasound costs 6,000 to 7,500 FCFA, and mammography 10,000 to 12,000 FCFA (subsidized to 5,000 FCFA at Schiphra for vulnerable women). Financial worries should never keep you from care.",
    moore: "Burkina Faso ka, nus n gesã yaa zaalem (0 FCFA) kɛnɛyaso wʋsg pʋgẽ. Échographie yaa 6 000 n ta 7 500 FCFA, la mammographie yaa 10 000 n ta 12 000 FCFA (subventionné a 5 000 FCFA Schiphra). Ligdi da yɩ gɩdgr fo laafɩ wɛɛngẽ ye.",
    dioula: "Burkina Faso la, bɔlɔkɔrɔ lajɛ sɔngɔ ye fu ye (0 FCFA). Échographie ye 6 000 fo 7 500 FCFA ye, mammographie ye 10 000 fo 12 000 FCFA ye. Wari kana kɛ gɛlɛya ye i ka kɛnɛya siratigɛ la.",
  },
  boule: {
    fr: "Respire calmement, ma sœur, ne panique pas : dans plus de 8 cas sur 10, une boule ou un nodule n'est PAS un cancer (il s'agit très souvent de simples kystes bénins d'eau ou d'adénofibromes fréquents). Cependant, la seule façon d'en avoir le cœur net et d'être en paix est de la faire examiner rapidement par une sage-femme ou un médecin. Je t'accompagne.",
    en: "Breathe gently, my sister, do not panic: over 8 out of 10 breast lumps are NOT cancer (they are usually benign fluid cysts or fibroadenomas). However, having it examined promptly by a midwife or doctor brings complete peace of mind. I am with you.",
    moore: "Vʋʋsm sõma m maaso, da zoe rabeem ye: bõn-kʋds a nii (8) piig pʋgẽ pa bã-kãsenga ye (yaa kystes bal). La yaa tɩlae tɩ dɔgɔtɔr ges-a tao-tao tɩ fo sũur gãande. Mam be ne yãmba.",
    dioula: "I ni lafiɲɛ dɔrɔn, kana siran : bõn-kʋdga tan kɔnɔ segin tɛ bana juguman ye. Nka kɛnɛyaso lajɛ jona de bɛ hakili sigi dɔgɔtɔrɔmuso fɛ. Ne b'i kɔrɔ.",
  },
  hygiene: {
    fr: "Ma sœur, ton intimité est précieuse et délicate. La règle d'or des soignants est simple : lave uniquement la partie extérieure (la vulve) à l'eau propre ou avec un savon doux sans parfum. Ne fais JAMAIS de douche vaginale interne ni n'introduis de poudres ou produits décapants : le vagin possède son propre système d'auto-nettoyage et ces produits détruisent ses défenses naturelles. Porte des sous-vêtements en coton pour laisser respirer ta peau avec la chaleur.",
    en: "My sister, wash only the external area (vulva) with clean water or mild unscented soap. NEVER practice internal douching or use harsh astringents. The vagina cleanses itself naturally. Wear breathable cotton underwear.",
    moore: "M maaso, fo yĩng sõngr yaa tɩlae wʋsg. Rɩk koom sõma bal n peeg fo meng yĩng zĩ-kẽemã yell bal. Da rɩk tɩɩm dãmb n kẽes fo pʋgẽ ye.",
    dioula: "N ma muso, ji saniya dɔrɔn de kɛ kɔkan, kana fɛn juguw don kɔnɔna na abada. Saniya fɛnw bɛ kɛnɛya tiɲɛ. Koton faniw don funteni senfɛ.",
  },
  default: {
    fr: "Bonjour ma sœur, je suis Rose IA, ta compagne de santé et de bien-être. Je suis là pour t'écouter avec amour, respect et sans aucun tabou : ton hygiène intime, ta nutrition (moringa, baobab), tes règles, ton stress, ton sommeil ou le dépistage de ta santé. Que ressens-tu dans ton corps ou dans ton cœur aujourd'hui ?",
    en: "Hello my sister, I am Rose AI, your health and wellness companion. I am here to listen with compassion and respect: intimate hygiene, Sahelian nutrition (moringa, baobab), menstrual health, stress relief, or health screenings. How are you feeling in your body and heart today?",
    moore: "Ne y beogo m maaso, mam yaa Rose IA. M be n na n sõng yãmba ne laafi wɛɛngẽ: yĩn-sõngr, rɩɩb sõma (moringa, baobab), pʋg-tõor, sũ-sãanga bɩ bãas gɩdgre. Bõe n namsda fo rũndã ?",
    dioula: "I ni sɔgɔma n ma muso, ne ye Rose IA ye. Ne bɛ yan k'i dɛmɛ kɛnɛya ni lafiɲɛ ko la: i yɛrɛ saniya, dumuni ɲuman (moringa, sira-den), kalo-sira, hakili-gɛlɛya walima lajɛw. Mun b'i kɔnɔ bi ?",
  },
};
