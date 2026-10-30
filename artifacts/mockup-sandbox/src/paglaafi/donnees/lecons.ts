/**
 * Leçons du module « Comprendre » en 4 langues.
 *
 * ⚠️ Traductions Mooré et Dioula à faire relire par des locuteurs avant publication.
 */

import type { Lecon } from "../types";

/**
 * Leçons pédagogiques avec audio en 4 langues : Français, English, Mooré et Dioula
 */
export const lessons: Lecon[] = [
  {
    id: 0,
    title: "Comprendre le cancer du sein sans jargon",
    category: "Les bases",
    duration: "4 min",
    summary:
      "Des repères clairs pour comprendre ce qui se passe dans le corps, sans dramatiser et avec des mots simples.",
    englishSummary: "Clear, non-technical explanations to understand what happens in the breast tissue without fear.",
    fullText:
      "Le cancer du sein commence lorsque des cellules du tissu mammaire se modifient et se multiplient anormalement. Dans la très grande majorité des cas, une petite boule ou un nodule n'est PAS un cancer : il s'agit souvent d'un kyste bénin ou d'un nodule fibreux sans danger. Cependant, seul un professionnel de santé peut faire la différence grâce à un examen indolore. Détecté très tôt, le cancer du sein se guérit dans plus de 9 cas sur 10. C'est pourquoi apprendre à observer sa poitrine chaque mois et réaliser un dépistage régulier peut vous sauver la vie.",
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
    summary:
      "Les signes qui doivent vous amener à consulter sans paniquer : une boule, un écoulement ou un pli inhabituel.",
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
    summary: "Comment soutenir une soeur, une amie ou une épouse sans jugement et faciliter sa démarche de santé.",
    englishSummary:
      "How to support a sister, friend or wife without judgment and encourage regular healthcare checkups.",
    fullText:
      "Faire un dépistage peut susciter de l'inquiétude. Pour une femme, être accompagnée par une soeur, une amie, sa mère ou son conjoint transforme complètement cette expérience. Proposer un covoiturage, patienter ensemble dans la salle d'attente ou simplement lui rappeler avec douceur l'importance de ce geste sont des actes d'amour déterminants. L'application PagLaafi propose la fonction 'Aller à deux' pour envoyer une invitation chaleureuse par SMS direct ou sur WhatsApp.",
    englishFullText:
      "Undergoing a screening exam can trigger anxiety. For a woman, having a trusted sister, friend or spouse alongside makes all the difference. Offering transportation, waiting together, or gently reminding her of the appointment are true acts of care. The PagLaafi Go-Together module allows sending an invitation in one click via SMS or WhatsApp.",
    mooreSummary:
      "Sã n yaa tɩ ned na n tɩ ges a yĩnsa laafi, rabeem tõe n kẽ-a lame. Woto yĩnga, sã n yaa ne a kẽed-n-taag bɩ a ma bɩ a biiga n kẽnd ne-a, zĩigã lebnda noogo. Tʋm-y SMS bɩ WhatsApp kaset n bool-a tɩ y kẽng a yiibu.",
    dioulaSummary:
      "Ka taga kɛnɛyaso la k'i sin lajɛ, siran bɛ se ka kɛ o la. Ni balimamusow walima furuɲɔgɔn tagara ɲɔgɔn fɛ, hakili bɛ sigi. PagLaafi bɛ dɛmɛ kɛ ka weeleli ci SMS walima WhatsApp fɛ.",
  },
];
