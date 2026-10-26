/**
 * Conseils bienveillants du jour de Rose IA en 4 langues.
 *
 * ⚠️ Contenu médical et traductions à faire valider avant publication.
 */

import type { RoseDailyTip } from "../types";

export const roseDailyTips: RoseDailyTip[] = [
  {
    id: 1,
    category: "nutrition",
    categoryLabel: "💧 Hydratation & Climat Sahélien",
    categoryColor: "bg-blue-100 text-blue-900 border-blue-200",
    titleFr: "Boire de l'eau en abondance",
    fr: "Prends soin de ton corps ma sœur : avec la chaleur du Burkina, bois au moins 2 à 3 litres d'eau aujourd'hui. L'eau purifie tes reins, prévient les infections urinaires et donne de l'éclat à ta peau.",
    en: "Take care of your body my sister: in this Sahelian heat, drink at least 2 to 3 liters of clean water today. Water cleanses your kidneys, prevents urinary infections and brightens your skin.",
    moore:
      "Koom yaa vɩɩm m maaso. Ne tʋʋlgã wɛɛngẽ, nyũ koom wʋsg rũndã (litr a yiibu n ta a tãabo). Koomã sõngda fo yĩnsa la a gɩdgd bãase.",
    dioula:
      "Ji ye ɲɛnamaya ye n ma muso. Funteni na, ji min kosɛbɛ bi (litiri fila fo saba). Ji bɛ kɛnɛya d'i ma k'i yɛrɛ lakatoloban bana juguw ma.",
  },
  {
    id: 2,
    category: "nutrition",
    categoryLabel: "🌿 Trésors Locaux : Moringa & Baobab",
    categoryColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
    titleFr: "Le pouvoir fortifiant du Moringa & Baobab",
    fr: "Nourris ta vitalité avec la richesse de notre terre burkinabè : les feuilles de Moringa sont une mine de fer contre la fatigue et l'anémie, et la pulpe de Baobab regorge de vitamine C. Ajoute-les à tes repas pour fortifier ton immunité.",
    en: "Nourish your vitality with local superfoods: Moringa leaves provide natural iron against anemia, and Baobab fruit powder is packed with vitamin C. Add them to your meals to boost immunity.",
    moore:
      "Moringa la zɩt-yɩla yaa arzɛka kãsenga d tẽngẽ. A kẽesda pãng fo yĩngẽ n tõog zɩ-komlemã. Rɩ-b sõma fo laafi yĩnga.",
    dioula:
      "Moringa jiri-buluw ani sira-den mugu ye nafolo ye. U bɛ jolidɛmɛ kɛ ani ka fanga di faso musow ma. U don i ka dumunifɛnw na.",
  },
  {
    id: 3,
    category: "hygiene",
    categoryLabel: "🌸 Hygiène Intime Bienveillante",
    categoryColor: "bg-pink-100 text-pink-900 border-pink-200",
    titleFr: "Douceur et respect de la flore intime",
    fr: "Un conseil d'amour pour ton intimité : lave uniquement la partie extérieure à l'eau propre. Le vagin se nettoie tout seul, évite les douches vaginales internes ou produits parfumés décapants qui détruisent sa flore protectrice.",
    en: "Gentle intimate hygiene: wash only the external area with clean water. The vagina cleanses itself; avoid internal douching or scented products that harm natural defenses.",
    moore:
      "Yĩn-sõngr wɛɛngẽ: rɩk ko-sõma n peeg fo meng yĩng zĩ-kẽemã yell bal. Da rɩk tɩɩm dãmb n dʋg fo pʋgẽ ye. Sã n mik tɩ yãmb wʋmda yĩn-wẽk, kẽng-y dɔgɔtɔr nengẽ.",
    dioula:
      "I yɛrɛ saniya ko la: ji saniya dɔrɔn de kɛ kɔkan. Kana fɛn gɛlɛnw don kɔnɔna na. Ni fɛn dɔ y'i gɛlɛya, taga dɔgɔtɔrɔmuso fɛ sabali.",
  },
  {
    id: 4,
    category: "mental",
    categoryLabel: "🧘‍♀️ Sérénité & Amour de Soi",
    categoryColor: "bg-purple-100 text-purple-900 border-purple-200",
    titleFr: "Tu as le droit de te reposer",
    fr: "Ma sœur, tu portes souvent le fardeau de toute la famille. N'oublie jamais que ton bien-être passe en premier : accorde-toi 15 minutes de calme et de repos aujourd'hui. Tu es précieuse, aimée et ton repos est légitime.",
    en: "My sister, you often carry the weight of the family. Never forget your well-being matters: take 15 minutes of calm and rest today. You are precious, loved, and rest is your right.",
    moore:
      "Yãmb tʋmda tʋʋm wʋsg zakã pʋgẽ. Da yĩm tɩ y meng laafi yaa tɩlae ye. Vʋʋsm-y bilfu rũndã. Yãmb yaa arzɛka kãsenga.",
    dioula:
      "I bɛ baara caman kɛ somɔgɔw ye. Kana ɲinɛ i yɛrɛ laafi kɔ. Lafiɲɛ dɔrɔn kɛ bi. I kɛnɛya kɔrɔtanin lo an bɛɛ fɛ.",
  },
  {
    id: 5,
    category: "cycle",
    categoryLabel: "🩸 Cycle & Règles Paisibles",
    categoryColor: "bg-rose-100 text-rose-900 border-rose-200",
    titleFr: "Apaiser les crampes et règles douloureuses",
    fr: "Si ton ventre te fait souffrir pendant tes règles : pose un linge tiède sur ton bas-ventre, bois une infusion tiède de gingembre ou de kinkeliba, et marche doucement. Si la douleur est insupportable, n'hésite jamais à consulter un soignant.",
    en: "If you experience menstrual cramps: place a warm cloth on your lower abdomen, sip warm ginger or kinkeliba tea, and take gentle walks. If severe, consult a healthcare worker.",
    moore:
      "Sã n mik tɩ pʋg-tõor namsda yãmba pʋg-peelgã wakato : ning-y bõn-tʋʋlga y pʋgẽ, nyũ-y gingembre ko-tʋʋlga. Yãmb pa segd n nams ye.",
    dioula:
      "Ni kɔnɔdimi b'i la i ka kalo-sira la: fɛn kaliman bila i kɔnɔ la, jinɛbɛrɛ-ji sumana min. Ni dimi ka bon kojugu, an k'a fɔ dɔgɔtɔrɔ ye.",
  },
  {
    id: 6,
    category: "prevention",
    categoryLabel: "🩺 Prévention Globale & Dépistage",
    categoryColor: "bg-amber-100 text-amber-900 border-amber-200",
    titleFr: "Le geste d'amour pour ton avenir",
    fr: "Le dépistage précoce (col de l'utérus et seins) n'est pas une sentence, c'est un bouclier d'amour pour toi et tes enfants. Le test IVA et l'autopalpation mensuelle sauvent des vies chaque jour au Burkina Faso.",
    en: "Early screening (cervix and breast) is not a diagnosis, it is a shield of love for yourself and family. VIA test and monthly self-exams save lives daily in Burkina Faso.",
    moore:
      "Laafi baoob pa bãag ye, yaa gɩdgre ninsaal ne a kamba yĩnga. D ges d seensã la d pʋgã kɛnɛya sõma n gɩdg bã-kãsengã.",
    dioula:
      "Kɛnɛyaso tagali tɛ bana ye, a ye lakana ye. Sinw bɔlɔkɔrɔ lajɛ ani kalo-kɔnɔ lajɛ bɛ denw baminaw kisi bana juguw ma.",
  },
];
