/**
 * Base de connaissances thématique de Rose IA en 4 langues (non utilisée par l'interface actuelle ; conservée comme matière première pour la base validée de la phase 3).
 *
 * ⚠️ Contenu médical et traductions à faire valider avant publication.
 */

import type { ContenuMultilingue } from "../types";

/**
 * Base de connaissances holistique & éthique de Rose IA en 4 langues
 * Couvre : Hygiène intime, Nutrition sahélienne, Cycle menstruel, Bien-être mental,
 * Col de l'utérus, Maternité, Ménopause et Santé mammaire.
 */
export const roseKnowledge = {
  hygiene_intime: {
    fr: "Ma sœur, ton intimité est précieuse et délicate. La règle d'or des soignants est simple : lave uniquement la partie extérieure (la vulve) à l'eau propre ou avec un savon doux sans parfum. Ne fais JAMAIS de douche vaginale interne ni n'introduis de poudres ou produits décapants : le vagin possède son propre système d'auto-nettoyage et ces produits détruisent ses défenses naturelles. Porte des sous-vêtements en coton pour laisser respirer ta peau avec la chaleur. Si tu as des démangeaisons, une sensation de brûlure ou des pertes odorantes, viens sans aucune honte consulter une sage-femme.",
    en: "My sister, your intimate health is precious. Wash only the external area (the vulva) with clean water or mild unscented soap. NEVER practice internal vaginal douching or use harsh astringents: the vagina cleanses itself naturally. Wear breathable cotton underwear. If you experience itching, burning, or unusual discharge, visit a midwife with confidence and no shame.",
    moore: "M maaso, fo yĩng sõngr yaa tɩlae wʋsg. Rɩk koom sõma bal n peeg fo meng yĩng zĩ-kẽemã yell bal. Da rɩk tɩɩm dãmb n kẽes fo pʋgẽ ye, bala a sãamda fo yĩnsa laafi. Yeelg fu-kõbdo sẽn yaa koton. Sã n mik tɩ yĩn-wẽk bee fo laafɩ wɛɛngẽ, kẽng n ges dɔgɔtɔr-pʋgbo.",
    dioula: "N ma muso, i yɛrɛ saniya ko ka kɔrɔtanin kosɛbɛ. Ji saniya dɔrɔn de kɛ kɔkan, kana fɛn juguw don kɔnɔna na abada. Saniya fɛnw bɛ kɛnɛya tiɲɛ. Koton faniw don funteni senfɛ. Ni fɛn dɔ y'i gɛlɛya walima ka dimi, taga dɔgɔtɔrɔmuso fɛ sabali.",
  },
  nutrition_locale: {
    fr: "Pour préserver ta vitalité et ta santé au Burkina Faso, la nature nous a offert des trésors extraordinaires : les feuilles de Moringa (véritable 'arbre de vie') regorgent de fer contre la fatigue et l'anémie, la pulpe de Baobab (pain de singe) est un concentré de vitamine C et d'antioxydants, et le Soumbala traditionnel protège le cœur et la tension. Évite les bouillons cubes industriels trop salés qui fatiguent les reins, et bois au moins 2 à 3 litres d'eau propre par jour pour compenser la chaleur sahélienne.",
    en: "To boost your vitality in our Sahelian climate, local foods are true superfoods: Moringa leaves provide abundant iron against anemia, Baobab fruit (pain de singe) is rich in vitamin C and antioxidants, and authentic Soumbala supports heart health. Reduce salty industrial seasoning cubes, and drink 2 to 3 liters of clean water daily to stay well hydrated.",
    moore: "Burkina Faso ka, Wẽnd kõ-d-la rɩɩb sõma wʋsg: moringa vaadã kẽesda pãng fo zɩlem pʋgẽ n gɩdg zɩ-komlem, tɔɔd bɩ zɩt-yɩla waoogda pãng, la sumbala sõngda sũurã laafi. Gɩdg yĩn-kũud tɩɩm dãmb sẽn tar yaalem wʋsg, la nyũ-y ko-sõma litr a yiibu n ta a tãabo dahar fãa.",
    dioula: "An ka faso la, kɛnɛya dumunifɛnw caman bɛ yen: moringa buluw bɛ fanga di joliko la, sira-den bɛ kɛnɛya gansan di, ani sumbala bɛ dusu mara. Maggi cube ka caya tɛ kɛnɛya ye, ji min litiri fila fo saba don o don funteni senfɛ.",
  },
  regles_douleurs: {
    fr: "Je te comprends tellement, les douleurs de règles peuvent être très éprouvantes. Voici des gestes doux et naturels pour t'apaiser : applique un linge ou une bouillotte tiède sur ton bas-ventre, bois une infusion chaude de gingembre ou de kinkeliba, masse doucement ton ventre avec un peu de beurre de karité, et repose-toi. Prends du paracétamol si nécessaire, mais si les douleurs sont si intenses qu'elles t'empêchent de te lever ou de travailler, cela peut être le signe d'une affection comme l'endométriose : parle-en à un gynécologue.",
    en: "I hear you, menstrual pain can be genuinely debilitating. To soothe cramps naturally: apply a warm cloth to your lower belly, drink warm ginger or kinkeliba tea, gently massage with shea butter, and take rest. If cramps are severe and prevent your normal activities, consult a gynecologist to check for conditions like endometriosis.",
    moore: "Pʋg-tõor namsda pagb wʋsg. Bõn-sõma n tõe n koms-a: ning-y fu-tʋʋlga y pʋgẽ, nyũ-y gingembre koom bɩ kinkeliba ko-tʋʋlga, rɩk karité kam n so y pʋgã bilfu, la y vʋʋse. Sã n mik tɩ pʋg-tõorã yɩɩ kãsenga wʋsg hal n pa tõe n yĩk, kẽng n ges dɔgɔtɔrã.",
    dioula: "Kalo-sira dimi bɛ muso caman tɔɔrɔ. Walasa k'a dɔgɔya: fɛn kaliman bila i kɔnɔ la, jinɛbɛrɛ-ji sumana min, si-tulu dɔoni kɛ i kɔnɔ la ka lafiɲɛ kɛ. Ni dimi ka bon kojugu fo i tɛ se ka wuli, taga dɔgɔtɔrɔ fɛ k'a sɛgɛsɛgɛ.",
  },
  bien_etre_mental: {
    fr: "Ma sœur, pose ce fardeau quelques instants et écoute ton cœur : tu passes tes journées à prendre soin des autres, de la famille et du foyer, mais qui prend soin de toi ? Ton esprit et ton corps ont besoin de douceur. Respire profondément trois fois en fermant les yeux. Tu as le droit d'être fatiguée, tu as le droit de dire non, tu as le droit de te reposer. Tu n'es pas seule, je suis là pour veiller sur toi avec toute ma tendresse.",
    en: "My sister, set down your burden for a moment: you spend your days caring for everyone else, but who cares for you? Your mind and body deserve gentle kindness. Take three deep breaths. You have the right to feel tired, to say no, and to rest. You are never alone; I am here with warmth and care.",
    moore: "M maaso, vʋʋsm bilfu n kẽes sũ-noogo fo meng pʋgẽ. Fo tʋmda dahar fãa zakã neb yĩnga, la fo segd n ges fo meng me laafi. Vʋʋsm zĩ-sõngo. Fo tara sor n na n vʋʋse. Fo ka fo yembr ye, mam be ne fo dahar fãa.",
    dioula: "N ma muso, i lafiɲɛ dɔrɔn kɛ. I bɛ mɔgɔw bɛɛ ladon don o don, nka i yɛrɛ do? I ni lafiɲɛ fana kɔrɔtanin lo. Ni hakili-gɛlɛya b'i la, hakili saba minɛ. I ma kelen ye, an bɛ i kɔrɔ kosɛbɛ.",
  },
  col_uterus: {
    fr: "Le col de l'utérus mérite toute ton attention : le cancer du col de l'utérus est l'un des plus fréquents en Afrique, mais c'est aussi le plus facile à éviter ! Un simple dépistage par inspection visuelle (test IVA) ou frottis, réalisé en quelques minutes par une sage-femme, permet de repérer et traiter d'éventuelles lésions bien avant qu'elles ne deviennent graves. C'est rapide, indolore et disponible dans les CSPS et CMA du Burkina. Fais ce dépistage tous les 3 ans !",
    en: "Cervical health is vital: cervical cancer is common, yet completely preventable! A quick visual inspection (VIA test) or pap smear performed in minutes by a midwife detects precancerous lesions years in advance. It is fast, painless, and available at health centers across Burkina Faso. Get screened every 3 years!",
    moore: "Pʋg-kɛenga laafi yaa tɩlae wʋsg. Bãaga wã tõe n gɩdgame sã n mik tɩ dɔgɔtɔr ges-a zĩigẽ (test IVA). A pa namsd ye, a pa rɩkd wakat wʋsg ye, la a bee Burkina Faso kɛnɛyaso fãa pʋgẽ. Bãng-y fo laafi yʋʋm a tãab fãa pʋgẽ.",
    dioula: "Kɔnɔna juru bana bɛ se ka bali sani a ka juguya. Dɔgɔtɔrɔmuso bɛ se k'a lajɛ sekondi damanin kɔnɔ (test IVA). A tɛ dimi, a tɛ mɔgɔ namsi, a bɛ sɔrɔ an ka kɛnɛyasow bɛɛ la. O kɛ kalo 36 o kalo 36 kɔnɔ.",
  },
  grossesse_menopause: {
    fr: "Chaque étape de ta vie de femme est un voyage sacré. Que tu sois en désir d'enfant, enceinte, jeune maman ou en période de ménopause, ton corps s'adapte en permanence. Pendant la ménopause, les bouffées de chaleur et sautes d'humeur sont courantes : bois frais, consomme du soja et du calcium, et pratique la marche. Si tu as des saignements inattendus après la ménopause ou pendant la grossesse, consulte immédiatement un soignant.",
    en: "Every stage of a woman's journey is unique. Whether during pregnancy, postpartum, or menopause, your body evolves. During menopause, hot flashes and mood shifts are normal: stay hydrated, eat calcium-rich local foods, and take brisk walks. Any unexpected bleeding after menopause or during pregnancy requires prompt medical evaluation.",
    moore: "Pʋg-yãmb laafi tekda wakat fãa: pʋg-tũub wakat, bi-doglem wakat, bɩ kʋdemd wakat. Kʋdemdã sasa, tʋʋlg namsda pagb wʋsg. Nyũ-y ko-sumdo, rɩ-y rɩ-sõma. Sã n mik tɩ zɩɩm yii fo meng pʋgẽ tɩ pa wakat, kẽng dɔgɔtɔr tao-tao.",
    dioula: "Musoya ye yɛlɛmali yɔrɔ ye: kɔnɔtigi, denbaya, walima musokɔrɔya. Musokɔrɔya sɔrɔlen, funteni kɔnɔna na bɛ se ka kɛ. Ji sumana min, dumuni kɛnɛ kɛ. Ni jolidon kɛra kɔfɛ, taga dɔgɔtɔrɔmuso fɛ jona.",
  },
  mal: {
    fr: "Rassurez-vous avec tendresse : la mammographie ne fait généralement pas mal. C'est une pression ferme mais très brève (5 à 10 secondes par image) pour bien visualiser les tissus. Pour un confort optimal, prévoyez votre examen dans les 10 jours suivant la fin de vos règles, quand la poitrine est très souple.",
    en: "Rest assured with calm: mammography is generally not painful. It is a brief compression (5 to 10 seconds per view) to clearly display breast tissue. For greatest comfort, schedule it within 10 days after your period ends.",
    moore: "Da zoe rabeem ye: mammographie masĩnã pa namsd ninsaal wʋsg ye. A rɩkda sekõnd a wãn bal n kaset. Sã n mik tɩ y kẽngda pʋg-peelgã poore, yĩnsã tara pãng tɩ pa namsd ye.",
    dioula: "I kana siran: masin nin tɛ mɔgɔ dimi kosɛbɛ. A bɛ kɛ sekondi damanin dɔrɔn lo kɔnɔ. Ni kalo-sira banna, o de ye wagati ɲuman ye ka taga lajɛ kɛ.",
  },
  prix: {
    fr: "Au Burkina Faso, la palpation clinique de dépistage est GRATUITE (0 FCFA) dans les centres publics et les campagnes associatives. L'échographie coûte entre 6 000 et 7 500 FCFA, et la mammographie environ 10 000 à 12 000 FCFA (subventionnée à 5 000 FCFA à Schiphra pour les femmes vulnérables). L'argent ne doit jamais être un frein à ta santé.",
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
  default: {
    fr: "Bonjour ma sœur, je suis Rose IA, ta compagne de santé et de bien-être. Je suis là pour t'écouter avec amour, respect et sans aucun tabou : ton hygiène intime, ta nutrition (moringa, baobab), tes règles, ton stress, ton sommeil ou le dépistage de ta santé. Que ressens-tu dans ton corps ou dans ton cœur aujourd'hui ?",
    en: "Hello my sister, I am Rose AI, your health and wellness companion. I am here to listen with compassion and respect: intimate hygiene, Sahelian nutrition (moringa, baobab), menstrual health, stress relief, or health screenings. How are you feeling in your body and heart today?",
    moore: "Ne y beogo m maaso, mam yaa Rose IA. M be n na n sõng yãmba ne laafi wɛɛngẽ: yĩn-sõngr, rɩɩb sõma (moringa, baobab), pʋg-tõor, sũ-sãanga bɩ bãas gɩdgre. Bõe n namsda fo rũndã ?",
    dioula: "I ni sɔgɔma n ma muso, ne ye Rose IA ye. Ne bɛ yan k'i dɛmɛ kɛnɛya ni lafiɲɛ ko la: i yɛrɛ saniya, dumuni ɲuman (moringa, sira-den), kalo-sira, hakili-gɛlɛya walima lajɛw. Mun b'i kɔnɔ bi ?",
  },
} satisfies Record<string, ContenuMultilingue>;
