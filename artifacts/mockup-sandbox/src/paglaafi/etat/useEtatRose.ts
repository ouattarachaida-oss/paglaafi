import { useEffect, useRef, useState } from "react";
import type { MedicalKnowledge } from "../types";
import { initialDefaultRoseMessages } from "../donnees/rose";
import { roseDailyTips } from "../donnees/conseilsRose";
import type { EtatUi } from "./useEtatUi";
import type { EtatAudio } from "./useEtatAudio";

/**
 * Rose IA : discussion, reconnaissance vocale, conseils du jour et savoirs cliniques.
 * ⚠️ Les réponses sont simulées par mots-clés (voir phase 3).
 */
export function useEtatRose({ ui, audio }: { ui: EtatUi; audio: EtatAudio }) {
  const { appLanguage, notify, section } = ui;
  const { handlePlayAudio } = audio;

  // 8. Assistant Vocal & Compagne de Santé ROSE IA (Santé globale, Bien-être, Hygiène de vie & Éthique)
  const [dailyTipIndex, setDailyTipIndex] = useState(0);

  const [dailyTipLang, setDailyTipLang] = useState<"fr" | "moore" | "dioula" | "en">("fr");

  const [notificationEnabled, setNotificationEnabled] = useState(false);

  const [roseMessages, setRoseMessages] = useState<
    Array<{ sender: "user" | "rose"; text: string; time: string; englishText?: string; mooreText?: string; dioulaText?: string }>
  >(() => {
    if (typeof window === "undefined") return initialDefaultRoseMessages;
    try {
      const s = localStorage.getItem("paglaafi_rose_messages");
      return s ? JSON.parse(s) : initialDefaultRoseMessages;
    } catch {
      return initialDefaultRoseMessages;
    }
  });

  // Sauvegarde continue de la discussion Rose IA
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("paglaafi_rose_messages", JSON.stringify(roseMessages));
    } catch {
      // Ignorer
    }
  }, [roseMessages]);

  const [roseInput, setRoseInput] = useState("");

  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  // Mode de discussion avec Rose IA : "text" (discussion écrite) ou "voice" (discussion orale/audio directe)
  const [roseChatMode, setRoseChatMode] = useState<"text" | "voice">("text");

  const [oralVoiceLang, setOralVoiceLang] = useState<"fr" | "moore" | "dioula" | "en">("fr");

  const lastVoiceTranscriptRef = useRef<string>("");

  const handleSendRoseMessageRef = useRef<(text?: string, speak?: boolean) => void>(() => {});

  // 9. Espace Docteur : Entraîner Rose IA
  const [clinicalKnowledgeList, setClinicalKnowledgeList] = useState<MedicalKnowledge[]>([
    {
      id: 1,
      doctorName: "Dr. Ibrahim Sanou",
      speciality: "Gynécologue-Obstétricien",
      topic: "Permanence urgences mammaires Bogodogo",
      advice: "Accueil direct sans rendez-vous tous les mardis et jeudis dès 08h pour tout nodule dur fixé ou écoulement unilatéral suspect.",
      date: "14/10/2026",
      verified: true,
    },
    {
      id: 2,
      doctorName: "Dr. Salif Sawadogo",
      speciality: "Oncologue Médical",
      topic: "Bon de mammographie subventionnée",
      advice: "L'ABAC dispose de bons de prise en charge à 5 000 FCFA pour les femmes sans couverture sanitaire adressées avec fiche d'orientation.",
      date: "15/10/2026",
      verified: true,
    },
  ]);

  // Référence pour le défilement automatique du chat Rose IA
  const roseChatBottomRef = useRef<HTMLDivElement | null>(null);

  // Référence pour la reconnaissance vocale Web Speech de Rose IA
  const recognitionRef = useRef<any>(null);

  // Défilement automatique du chat Rose IA vers le dernier message
  useEffect(() => {
    if (section === "RoseIA") {
      roseChatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [roseMessages, section]);

  /**
   * Gestion de la reconnaissance vocale temps réel pour Rose IA (Web Speech API)
   */
  const handleToggleVoiceRecognition = () => {
    // Si l'écoute est déjà en cours, on l'arrête
    if (isRecordingVoice) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error(e);
        }
      }
      setIsRecordingVoice(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      notify("La reconnaissance vocale directe n'est pas supportée sur ce navigateur. Vous pouvez poser une question par écrit ou utiliser les raccourcis.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = oralVoiceLang === "en" ? "en-US" : "fr-FR";
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecordingVoice(true);
        lastVoiceTranscriptRef.current = "";
        notify("Microphone actif : parlez maintenant à Rose IA...");
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          lastVoiceTranscriptRef.current = transcript;
          setRoseInput(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("[Rose IA Speech]", event.error);
        setIsRecordingVoice(false);
        if (event.error === "not-allowed") {
          notify("Accès micro refusé. Veuillez autoriser le microphone dans votre navigateur.");
        } else if (event.error === "no-speech") {
          notify("Aucune voix détectée. Appuyez sur le micro pour réessayer.");
        } else {
          notify(`Microphone : ${event.error || "erreur"}`);
        }
      };

      recognition.onend = () => {
        setIsRecordingVoice(false);
        const spoken = lastVoiceTranscriptRef.current;
        if (spoken && spoken.trim().length > 1) {
          handleSendRoseMessageRef.current(spoken, true);
          lastVoiceTranscriptRef.current = "";
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsRecordingVoice(false);
      notify("Impossible de démarrer l'écoute au microphone.");
    }
  };

  /**
   * Activation et envoi de notification bienveillante en langues locales (Web Notifications ou In-App)
   */
  const handleRequestNotification = async () => {
    const tip = roseDailyTips[dailyTipIndex];
    const text =
      dailyTipLang === "moore"
        ? tip.moore
        : dailyTipLang === "dioula"
          ? tip.dioula
          : dailyTipLang === "en"
            ? tip.en
            : tip.fr;
    const langLabel =
      dailyTipLang === "moore"
        ? "Mooré"
        : dailyTipLang === "dioula"
          ? "Dioula"
          : dailyTipLang === "en"
            ? "English"
            : "Français";

    if ("Notification" in window) {
      let perm = Notification.permission;
      if (perm !== "granted") {
        try {
          perm = await Notification.requestPermission();
        } catch (e) {
          console.warn("Notification request permission error:", e);
        }
      }
      if (perm === "granted") {
        setNotificationEnabled(true);
        try {
          new Notification(`🌸 Rose IA — ${tip.categoryLabel}`, {
            body: `${text.slice(0, 130)}...`,
            icon: "/favicon.ico",
          });
          notify(`Rappels quotidiens activés en ${langLabel} ! Notification bienveillante envoyée.`);
          return;
        } catch (e) {
          console.warn("Notification show error:", e);
        }
      }
    }

    setNotificationEnabled((prev) => !prev);
    notify(`Rappel bienveillant activé (${langLabel}) : "${tip.titleFr}"`);
  };

  /**
   * Envoi de message à Rose IA avec moteur conversationnel IA enrichi,
   * intégration des fiches cliniques docteurs, et support 4 langues (FR, Mooré, Dioula, EN)
   */
  const handleSendRoseMessage = (textOverride?: string, speakAloud = false) => {
    const textToSend = textOverride || roseInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: "user" as const,
      text: textToSend,
      time: "Maintenant",
    };
    setRoseMessages((prev) => [...prev, userMsg]);
    setRoseInput("");

    // Normalisation sans accents pour recherche insensible
    const lower = textToSend.toLowerCase();
    const clean = lower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // 1. VÉRIFICATION DANS LES CONNAISSANCES CLINIQUES DES DOCTEURS
    const doctorMatch = clinicalKnowledgeList.find((k) => {
      const topicClean = k.topic.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const adviceClean = k.advice.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return (
        clean.includes("sanou") ||
        clean.includes("urgence") ||
        clean.includes("permanence") ||
        topicClean.split(" ").some((w) => w.length > 4 && clean.includes(w)) ||
        adviceClean.split(" ").some((w) => w.length > 5 && clean.includes(w))
      );
    });

    let aiFr = "";
    let aiEn = "";
    let aiMoore = "";
    let aiDioula = "";

    if (doctorMatch) {
      aiFr = `Protocole clinique validé par le ${doctorMatch.doctorName} (${doctorMatch.speciality}) : « ${doctorMatch.advice} » (Mis à jour le ${doctorMatch.date}).`;
      aiEn = `Clinical recommendation validated by ${doctorMatch.doctorName} (${doctorMatch.speciality}): "${doctorMatch.advice}" (Updated on ${doctorMatch.date}).`;
      aiMoore = `Dɔgɔtɔr ${doctorMatch.doctorName} saglsgo ne kaseto: « ${doctorMatch.advice} ».`;
      aiDioula = `Dɔgɔtɔrɔ ${doctorMatch.doctorName} ka ladili kɛnɛya siratigɛ la: « ${doctorMatch.advice} ».`;
    }
    // 2. SALUTATIONS, POLITESSE & PRÉSENTATION
    else if (
      clean.includes("bonjour") ||
      clean.includes("salut") ||
      clean.includes("bonsoir") ||
      clean.includes("coucou") ||
      clean.includes("qui es tu") ||
      clean.includes("qui t'a") ||
      clean.includes("comment vas tu") ||
      clean.includes("comment tu t'appelles") ||
      clean.includes("presente") ||
      clean.includes("aide moi")
    ) {
      aiFr = "Bonjour ma sœur bien-aimée ! Je suis Rose IA, ton assistante intelligente et bienveillante sur PagLaafi. Je suis à ton entière écoute sans tabou ni jugement : autopalpation des seins, hygiène intime, remèdes locaux (moringa, baobab), apaisement des règles ou dépistage dans les centres du Burkina. Comment te sens-tu aujourd'hui ?";
      aiEn = "Hello my beloved sister! I am Rose AI, your caring and holistic health companion on PagLaafi. I am here to listen and guide you without judgment: breast self-exam, intimate care, local nutrition, period comfort, and screenings in Burkina Faso. How can I assist you today?";
      aiMoore = "Ne y beogo m maaso ! Mam yaa Rose IA, fo laafi zoa PagLaafi pʋgẽ. M be ka n na n sõng fõ ne yĩn-sõngr, rɩɩb sõma (moringa, baobab), pʋg-tõor bɩ bãas gɩdgre. Bõe n be fo sũurẽ rũndã ?";
      aiDioula = "I ni sɔgɔma n ma muso ! Ne ye Rose IA ye PagLaafi kɔnɔ. Ne bɛ yan k'i dɛmɛ kɛnɛya, i yɛrɛ saniya, dumuni ɲuman ani kalo-sira la. Mun b'i kɔnɔ bi ?";
    }
    // 3. AUTOPALPATION, GESTES PRATIQUES & TECHNIQUE D'EXAMEN
    else if (
      clean.includes("autopalpation") ||
      clean.includes("palpation") ||
      clean.includes("palper") ||
      clean.includes("palpe") ||
      clean.includes("examiner") ||
      clean.includes("toucher") ||
      clean.includes("comment faire") ||
      clean.includes("geste") ||
      clean.includes("technique") ||
      clean.includes("etape") ||
      clean.includes("methode") ||
      clean.includes("quand") ||
      clean.includes("moment")
    ) {
      aiFr = "L'autopalpation se réalise en 3 étapes douces, idéalement 2 à 7 jours après la fin de tes règles : 1° Face au miroir, regarde l'aspect de tes seins bras baissés puis levés (recherche un creux, une rougeur ou une rétractation). 2° Lève un bras et palpe avec la pulpe des 3 doigts du milieu en petits cercles fermes de l'extérieur vers le mamelon, debout puis allongée. 3° Examine sous l'aisselle et presse doucement le mamelon pour vérifier l'absence d'écoulement. Regarde la vidéo démonstrative avec notre sage-femme en cliquant sur le bouton ci-dessous !";
      aiEn = "Breast self-exam is done in 3 gentle steps, best scheduled 2 to 7 days after your period: 1° Look in the mirror with arms relaxed then raised (check for dimples or retraction). 2° Raise one arm and feel firmly with the pads of your 3 middle fingers in small circular motions toward the nipple, standing and lying down. 3° Check under your armpit and gently squeeze the nipple for any discharge. Watch the step-by-step video with our midwife below!";
      aiMoore = "Yĩn-gesgo wã tũuda vɛr a tãabo, pʋg-peelgã poore rasem a 2 n ta a 7: 1° Ges fo meng laloorẽ n gũus fo yĩnsã rɩsg la gõosgo. 2° Yiis fo nus n kɛlees ne nus-bi a tãabã pãng n lilli n kẽng zĩ-kãsengã wɛɛngẽ. 3° Ges fo baglem pʋgẽ la fo bĩidã bɩ zɩɩm pa yit ye. Ges-y video wã bilfu !";
      aiDioula = "Bɔlɔkɔrɔ lajɛ bɛ kɛ taabolo saba de la, kalo-sira ban kɔfɛ tle 2 fo 7: 1° I yɛrɛ lajɛ filɛli-fɛn na k'a filɛ ni yɛlɛmali dɔ bɛ yen. 2° I bɔlɔ kɔrɔta ka bɔlɔden saba kɛ k'a sɛgɛsɛgɛ lali maana la fo ka ta masiɲɛ na. 3° I kaman kɔrɔ lajɛ ani i sin-toli dɔɔnin digi. Vidéow lajɛ duguma sabali !";
    }
    // 4. BOULE, NODULE, KYSTE, MASSE, GROSSEUR & SYMPTÔMES
    else if (
      clean.includes("boule") ||
      clean.includes("nodule") ||
      clean.includes("kyste") ||
      clean.includes("masse") ||
      clean.includes("grosseur") ||
      clean.includes("dur") ||
      clean.includes("ganglion") ||
      clean.includes("gonflement") ||
      clean.includes("ecoulement") ||
      clean.includes("liquide") ||
      clean.includes("peau d'orange") ||
      clean.includes("retractation") ||
      clean.includes("creux")
    ) {
      aiFr = "Respire calmement ma sœur, ne panique pas : dans plus de 8 cas sur 10, une boule ou un nodule n'est PAS un cancer (il s'agit très souvent d'un simple kyste liquide ou d'un adénofibrome bénin très fréquent). Cependant, la seule façon d'avoir le cœur net et d'être en paix est de la faire examiner rapidement par une sage-femme ou un médecin dans un centre de santé. Tu peux consulter l'onglet 'Centres' pour trouver le plus proche.";
      aiEn = "Breathe gently my sister, do not panic: in more than 8 out of 10 cases, a lump is NOT cancer (it is often a benign fluid cyst or fibroadenoma). However, having it examined promptly by a midwife or doctor brings complete peace of mind. Check the 'Centres' tab to visit a facility near you.";
      aiMoore = "Vʋʋsm sõma m maaso, da zoe rabeem ye: bõn-kʋds a nii (8) piig pʋgẽ pa bã-kãsenga ye (yaa kystes bal). La yaa tɩlae tɩ dɔgɔtɔr ges-a tao-tao tɩ fo sũur gãande kɛnɛyaso pʋgẽ. Mam be ne yãmba.";
      aiDioula = "I ni lafiɲɛ dɔrɔn, kana siran: kunkolo tan kɔnɔ segin tɛ bana juguman ye. Nka kɛnɛyaso lajɛ jona de bɛ hakili sigi dɔgɔtɔrɔmuso fɛ. Taga kɛnɛyaso la jona.";
    }
    // 5. CENTRES DE SANTÉ, HÔPITAUX & OÙ ALLER À OUAGA / BURKINA
    else if (
      clean.includes("centre") ||
      clean.includes("hopital") ||
      clean.includes("clinique") ||
      clean.includes("ou aller") ||
      clean.includes("ouaga") ||
      clean.includes("bobo") ||
      clean.includes("schiphra") ||
      clean.includes("yalgado") ||
      clean.includes("bogodogo") ||
      clean.includes("pissy") ||
      clean.includes("tingandogo") ||
      clean.includes("rdv") ||
      clean.includes("rendez vous") ||
      clean.includes("rendez-vous")
    ) {
      aiFr = "Au Burkina Faso, plusieurs centres spécialisés sont à ton service pour le dépistage et la prise en charge : 1° CHU de Bogodogo (Pôle Mère-Enfant avec mammographe numérique ouvert). 2° Centre Médical Schiphra à Tanghin (dépistage et tarifs subventionnés). 3° CHU Yalgado Ouédraogo (Service de cancérologie & sénologie). 4° CMA de Pissy et centres de santé CSPS pour la palpation clinique gratuite. Consulte l'onglet 'Centres' pour lancer l'itinéraire GPS en un clic !";
      aiEn = "In Burkina Faso, excellent health centers welcome you: 1° CHU Bogodogo (Mother-Child specialized pole). 2° Schiphra Medical Center in Tanghin (subsidized screenings). 3° CHU Yalgado Ouédraogo (Oncology & Senology). 4° CMA Pissy and local CSPS clinics. Open the 'Centres' tab to get GPS directions instantly!";
      aiMoore = "Burkina Faso ka, kɛnɛyasow wʋsg bee n gũud yãmba: CHU Bogodogo, Centre Médical Schiphra Tanghin, CHU Yalgado Ouédraogo, la CMA Pissy. Nus n gesã yaa zaalem. Ges-y 'Centres' n bãng zĩiga tao-tao.";
      aiDioula = "Burkina Faso la, kɛnɛyasow caman bɛ yen: CHU Bogodogo, Centre Médical Schiphra Tanghin, CHU Yalgado, ani CMA Pissy. Bɔlɔkɔrɔ lajɛ sɔngɔ ye fu ye. Taga 'Centres' siratigɛ la ka siraw ye.";
    }
    // 6. PRIX, COÛTS, TARIFS & FCFA
    else if (
      clean.includes("prix") ||
      clean.includes("cout") ||
      clean.includes("combien") ||
      clean.includes("tarif") ||
      clean.includes("argent") ||
      clean.includes("fcfa") ||
      clean.includes("gratuit") ||
      clean.includes("payer") ||
      clean.includes("cher")
    ) {
      aiFr = "Au Burkina Faso : 1° La palpation clinique de dépistage est 100% GRATUITE (0 FCFA) dans les centres publics et les campagnes de sensibilisation. 2° L'échographie mammaire coûte entre 6 000 et 7 500 FCFA. 3° La mammographie coûte entre 10 000 et 12 000 FCFA (subventionnée à 5 000 FCFA à Schiphra pour les femmes vulnérables grâce aux dons). L'argent ne doit jamais être un frein à ta santé.";
      aiEn = "In Burkina Faso: 1° Clinical breast exams are 100% FREE (0 FCFA) in public centers and campaigns. 2° Breast ultrasound costs 6,000 to 7,500 FCFA. 3° Mammography is 10,000 to 12,000 FCFA (subsidized to 5,000 FCFA at Schiphra for vulnerable women). Financial concerns must never prevent medical care.";
      aiMoore = "Burkina Faso ka, nus n gesã yaa zaalem (0 FCFA) kɛnɛyaso wʋsg pʋgẽ. Échographie yaa 6 000 n ta 7 500 FCFA, la mammographie yaa 10 000 n ta 12 000 FCFA (subventionné a 5 000 FCFA Schiphra). Ligdi da yɩ gɩdgr fo laafɩ wɛɛngẽ ye.";
      aiDioula = "Burkina Faso la, bɔlɔkɔrɔ lajɛ sɔngɔ ye fu ye (0 FCFA). Échographie ye 6 000 fo 7 500 FCFA ye, mammographie ye 10 000 fo 12 000 FCFA ye. Wari kana kɛ gɛlɛya ye i ka kɛnɛya siratigɛ la.";
    }
    // 7. PEUR, ANGOISSE, DÉTRESSE, MORT & SOUTIEN ÉMOTIONNEL
    else if (
      clean.includes("peur") ||
      clean.includes("angoisse") ||
      clean.includes("panique") ||
      clean.includes("mourir") ||
      clean.includes("mort") ||
      clean.includes("stress") ||
      clean.includes("triste") ||
      clean.includes("pleur") ||
      clean.includes("seule") ||
      clean.includes("moral") ||
      clean.includes("choc")
    ) {
      aiFr = "Respire profondément ma sœur, pose la main sur ton cœur : tu n'es pas seule, je suis là et les soignants sont à tes côtés. La peur est une réaction tout à fait humaine, mais rappelle-toi ceci avec force : le cancer du sein n'est pas une condamnation ! Détecté tôt, il se guérit dans plus de 9 cas sur 10. Tu as une valeur inestimable pour ta famille et pour nous. Nous allons avancer pas à pas avec tendresse et courage.";
      aiEn = "Take a deep breath my sister, place your hand on your heart: you are not alone, I am here with you. Fear is entirely normal, but remember this: breast cancer is not a fatality! Detected early, more than 9 out of 10 women are cured completely. You have courage and we are by your side step by step.";
      aiMoore = "M maaso, vʋʋsm sõma n ning fo nuga fo sũurẽ : fo ka fo yembr ye, mam be ne fo. Zõeemã yaa bũmb sẽn pa wẽnga ninsaal pʋgẽ, la bãagã sã n bãng tao-tao a vʋʋgda sõma. Bãng tɩ fo tara pãng, la d na n zĩnd ne taab wakat fãa.";
      aiDioula = "I dusu suma n ma muso, i bɔlɔ bila i dusu kan: i ma kelen ye, ne bɛ yan i kɔrɔ. Siran bɛ mɔgɔ bɛɛ la, nka ni bana ye jona, mɔgɔ bɛ kɛnɛya kosɛbɛ. An bɛ i kɔrɔ ni barika ye.";
    }
    // 8. GUÉRISON, CHANCES, ESPOIR & TRAITEMENT
    else if (
      clean.includes("guerir") ||
      clean.includes("guerison") ||
      clean.includes("soigner") ||
      clean.includes("espoir") ||
      clean.includes("chances") ||
      clean.includes("survie") ||
      clean.includes("stade")
    ) {
      aiFr = "Oui, le cancer du sein se guérit très bien ! Lorsqu'il est découvert à un stade précoce grâce à l'autopalpation mensuelle et au dépistage, le taux de guérison dépasse 90%. Au Burkina Faso, les équipes médicales disposent de chirurgies réparatrices, de traitements adaptés et d'un accompagnement fraternel. L'espoir et la vie triomphent toujours quand on agit tôt.";
      aiEn = "Yes, breast cancer is highly curable! When diagnosed early through monthly self-exams and screening, the cure rate exceeds 90%. In Burkina Faso, medical teams provide modern treatments and caring support. Hope and life always win when we act early.";
      aiMoore = "N-ye, bãaga wã tõe n komsame hal n sa ! Sã n mik tɩ bãngrã yɩɩ tao-tao, neb piig pʋgẽ a wae (9) vʋʋgda fasafasa. Kẽng dɔgɔtɔr zĩigẽ n bãng fo laafi.";
      aiDioula = "Ɔwɔ, bana nin bɛ se ka kɛnɛya kosɛbɛ ! Ni a yera jona, mɔgɔ tan kɔnɔ kɔnɔntɔn bɛ kɛnɛya tiɲɛ na. Kɛnɛyaso bɛ dɛmɛ di.";
    }
    // 9. RÈGLES, CRAMPES, CYCLE MENSTRUEL & DOULEURS DU VENTRE
    else if (
      clean.includes("regle") ||
      clean.includes("menstru") ||
      clean.includes("crampe") ||
      clean.includes("ventre") ||
      clean.includes("cycle") ||
      clean.includes("douleur") ||
      clean.includes("retard")
    ) {
      aiFr = "Je te comprends profondément ma sœur, les douleurs de règles peuvent être épuisantes. Pour t'apaiser naturellement : applique un linge tiède sur ton bas-ventre, bois une infusion chaude de gingembre ou de kinkeliba, masse doucement ton ventre avec un peu de beurre de karité et repose-toi. Si la douleur est si forte qu'elle t'empêche de vaquer à tes occupations, parles-en à une sage-femme car cela peut être de l'endométriose.";
      aiEn = "I hear you deeply, menstrual pain can be genuinely exhausting. To soothe cramps naturally: apply a warm cloth to your lower belly, drink warm ginger or kinkeliba tea, gently massage with shea butter, and rest. If severe pain prevents your daily activities, consult a midwife to check for endometriosis.";
      aiMoore = "Pʋg-tõor namsda pagb wʋsg. Bõn-sõma n tõe n koms-a: ning-y fu-tʋʋlga y pʋgẽ, nyũ-y gingembre koom bɩ kinkeliba ko-tʋʋlga, rɩk karité kam n so y pʋgã bilfu, la y vʋʋse.";
      aiDioula = "Kalo-sira dimi bɛ muso caman tɔɔrɔ. Walasa k'a dɔgɔya: fɛn kaliman bila i kɔnɔ la, jinɛbɛrɛ-ji sumana min, si-tulu dɔoni kɛ i kɔnɔ la ka lafiɲɛ kɛ.";
    }
    // 10. HYGIÈNE INTIME, TOILETTE, PERTES & FLORE VAGINALE
    else if (
      clean.includes("toilette") ||
      clean.includes("intime") ||
      clean.includes("savon") ||
      clean.includes("perte") ||
      clean.includes("odeur") ||
      clean.includes("vagin") ||
      clean.includes("vulve") ||
      clean.includes("mycose") ||
      clean.includes("demange") ||
      clean.includes("brulure") ||
      clean.includes("coton")
    ) {
      aiFr = "Ma sœur, ton intimité est délicate et précieuse. La règle d'or des soignants est simple : lave uniquement la partie extérieure (la vulve) à l'eau propre ou avec un savon doux sans parfum. Ne fais JAMAIS de douche vaginale interne ni n'introduis de poudres décapantes : le vagin possède son propre système d'auto-nettoyage. Porte des culottes en coton. Si tu as des démangeaisons ou des pertes inhabituelles, consulte une sage-femme sans aucune honte.";
      aiEn = "My sister, your intimate health is delicate and precious. The golden rule is simple: wash only the outside (the vulva) with clean water or mild unscented soap. NEVER practice internal douching or use harsh powders: the vagina cleanses itself naturally. Wear cotton underwear. If you have itching or unusual discharge, visit a midwife with full confidence.";
      aiMoore = "M maaso, fo yĩng sõngr yaa tɩlae wʋsg. Rɩk koom sõma bal n peeg fo meng yĩng zĩ-kẽemã yell bal. Da rɩk tɩɩm dãmb n kẽes fo pʋgẽ ye, bala a sãamda fo yĩnsa laafi. Yeelg fu-kõbdo sẽn yaa koton.";
      aiDioula = "N ma muso, i yɛrɛ saniya ko ka kɔrɔtanin kosɛbɛ. Ji saniya dɔrɔn de kɛ kɔkan, kana fɛn juguw don kɔnɔna na abada. Koton faniw don funteni senfɛ. Ni fɛn dɔ y'i gɛlɛya, taga dɔgɔtɔrɔmuso fɛ sabali.";
    }
    // 11. NUTRITION SAHÉLIENNE, MORINGA, BAOBAB & BIEN-ÊTRE
    else if (
      clean.includes("moringa") ||
      clean.includes("baobab") ||
      clean.includes("soumbala") ||
      clean.includes("singe") ||
      clean.includes("manger") ||
      clean.includes("nutrition") ||
      clean.includes("vitamine") ||
      clean.includes("anemie") ||
      clean.includes("fatigue") ||
      clean.includes("sel") ||
      clean.includes("bouillon") ||
      clean.includes("cube") ||
      clean.includes("eau") ||
      clean.includes("boire")
    ) {
      aiFr = "Pour préserver ta vitalité et prévenir les maladies au Burkina Faso, la nature nous a offert des trésors : les feuilles de Moringa regorgent de fer contre la fatigue et l'anémie, la pulpe de Baobab (pain de singe) est un concentré d'antioxydants et de vitamine C, et le Soumbala traditionnel protège le cœur et la tension. Évite les bouillons cubes industriels trop salés, et bois au moins 2 à 3 litres d'eau propre par jour.";
      aiEn = "To preserve your vitality in the Sahel, nature has provided wonders: Moringa leaves offer rich iron against fatigue and anemia, Baobab fruit (pain de singe) brings powerful antioxidants and vitamin C, and authentic Soumbala protects the heart. Reduce salty bouillon seasoning cubes, and drink 2 to 3 liters of clean water daily.";
      aiMoore = "Burkina Faso ka, Wẽnd kõ-d-la rɩɩb sõma wʋsg: moringa vaadã kẽesda pãng fo zɩlem pʋgẽ n gɩdg zɩ-komlem, tɔɔd bɩ zɩt-yɩla waoogda pãng, la sumbala sõngda sũurã laafi. Gɩdg yaalem wʋsg, la nyũ-y koom sõma dahar fãa.";
      aiDioula = "An ka faso la, kɛnɛya dumunifɛnw caman bɛ yen: moringa buluw bɛ fanga di joliko la, sira-den bɛ kɛnɛya gansan di, ani sumbala bɛ dusu mara. Maggi cube ka caya tɛ kɛnɛya ye, ji saniya min don o don.";
    }
    // 12. DÉPISTAGE DU COL DE L'UTÉRUS
    else if (
      clean.includes("col") ||
      clean.includes("uterus") ||
      clean.includes("frottis") ||
      clean.includes("iva") ||
      clean.includes("hpv") ||
      clean.includes("vaccin")
    ) {
      aiFr = "Le col de l'utérus mérite toute ton attention : un simple dépistage visuel (test IVA) ou frottis réalisé en 5 minutes par une sage-femme permet de repérer des petites anomalies bien avant qu'elles ne se transforment. C'est rapide, indolore et disponible dans tous les CSPS et CMA du Burkina. Fais ce dépistage tous les 3 ans !";
      aiEn = "Cervical health is vital: a simple visual inspection (VIA test) or pap smear done in 5 minutes by a midwife detects early changes years in advance. It is quick, painless, and available at all CSPS and CMA clinics in Burkina Faso. Get screened every 3 years!";
      aiMoore = "Pʋg-kɛenga laafi yaa tɩlae wʋsg. Bãaga wã tõe n gɩdgame sã n mik tɩ dɔgɔtɔr ges-a zĩigẽ (test IVA). A pa namsd ye, a pa rɩkd wakat wʋsg ye. Bãng-y fo laafi yʋʋm a tãab fãa pʋgẽ.";
      aiDioula = "Kɔnɔna juru bana bɛ se ka bali sani a ka juguya. Dɔgɔtɔrɔmuso bɛ se k'a lajɛ sekondi damanin kɔnɔ (test IVA). A tɛ dimi, a bɛ sɔrɔ kɛnɛyasow bɛɛ la. O kɛ kalo 36 o kalo 36 kɔnɔ.";
    }
    // 13. GROSSESSE, ALLAITEMENT & MÉNOPAUSE
    else if (
      clean.includes("enceinte") ||
      clean.includes("grossesse") ||
      clean.includes("bebe") ||
      clean.includes("allait") ||
      clean.includes("menopause") ||
      clean.includes("bouffee")
    ) {
      aiFr = "Chaque étape de la vie d'une femme est un passage précieux. Que tu sois enceinte, jeune maman allaitante ou en ménopause, écoute ton corps : bois beaucoup d'eau, consomme des aliments frais riches en calcium et en fer, et pratique la marche. Si tu constates un saignement inattendu ou un nodule mammaire pendant ou après la grossesse/ménopause, consulte sans tarder.";
      aiEn = "Every stage in a woman's journey is precious. Whether pregnant, nursing, or navigating menopause, listen to your body: stay hydrated, eat fresh nutrient-dense foods, and stay active. Any unexpected bleeding or breast changes warrant a prompt consultation.";
      aiMoore = "Pʋg-yãmb laafi tekda wakat fãa: pʋg-tũub wakat, bi-doglem wakat, bɩ kʋdemd wakat. Nyũ-y ko-sumdo, rɩ-y rɩ-sõma. Sã n mik tɩ zɩɩm yii fo meng pʋgẽ tɩ pa wakat, kẽng dɔgɔtɔr tao-tao.";
      aiDioula = "Musoya ye yɛlɛmali yɔrɔ ye: kɔnɔtigi, denbaya, walima musokɔrɔya. Ji sumana min, dumuni kɛnɛ kɛ. Ni jolidon kɛra kɔfɛ, taga dɔgɔtɔrɔmuso fɛ jona.";
    }
    // 14. REMERCIEMENTS & AU REVOIR
    else if (
      clean.includes("merci") ||
      clean.includes("bark biiga") ||
      clean.includes("anitche") ||
      clean.includes("thank") ||
      clean.includes("au revoir") ||
      clean.includes("bye") ||
      clean.includes("a bientot") ||
      clean.includes("bonne journee") ||
      clean.includes("bonne soiree")
    ) {
      aiFr = "C'est un véritable honneur et un bonheur d'être à tes côtés, ma sœur ! Prends grand soin de toi et de ton corps. N'hésite jamais à revenir me parler dès que tu as une question ou besoin d'écoute. Que la paix et la santé t'accompagnent !";
      aiEn = "It is an absolute honor and joy to accompany you, my sister! Take tender care of your body and well-being. Never hesitate to talk to me whenever you need guidance. May peace and radiant health stay with you!";
      aiMoore = "Yaa sũ-noogo kãsenga mam yĩnga tɩ m sõng fo maaso ! Ges fo meng laafi sõma. Wakat fãa fo sã n tar sokre, wa n sok maam. Wẽnd kõ-f laafi la sũ-noogo !";
      aiDioula = "A ye ninsɔndiya ye ne bolo k'i dɛmɛ n ma muso ! I yɛrɛ ladon kosɛbɛ. Wagati o wagati, n'i b'a fɛ k'an ka kuma, na yan. Ala ka kɛnɛya n'i ye !";
    }
    // 15. DON & SOLIDARITÉ
    else if (
      clean.includes("don") ||
      clean.includes("aider") ||
      clean.includes("financer") ||
      clean.includes("solidarite") ||
      clean.includes("orange money") ||
      clean.includes("association")
    ) {
      aiFr = "Ton cœur est généreux ! L'onglet 'Faire un don' de PagLaafi permet de soutenir directement les femmes vulnérables du Burkina Faso via Orange Money (dès 500 FCFA). Tu peux choisir de faire un don nominatif ou un Don Anonyme Chiffré pour préserver ta discrétion. Chaque contribution finance des dépistages et des mammographies gratuits.";
      aiEn = "Your generosity warms my heart! PagLaafi's 'Faire un don' tab lets you support vulnerable women across Burkina Faso through Orange Money (from 500 FCFA). You can donate publicly or via an Anonymous Encrypted gift. Every contribution funds free screenings and mammograms.";
      aiMoore = "Fo sũur yaa sõma wʋsg ! 'Faire un don' pʋgẽ, fo tõe n dɩka Orange Money (sẽn sɩng ne 500 FCFA) n sõng pagb nins sẽn ka tar ligdi tɩ b bãng b laafi zaalem. Barka wʋsg !";
      aiDioula = "I dusu ka ɲi kosɛbɛ ! 'Faire un don' bolo la, i bɛ se ka muso gɛlɛyaw dɛmɛ Orange Money fɛ (kabini 500 FCFA) walasa u ka kɛnɛya lajɛ sɔrɔ fu. I ni ce kosɛbɛ !";
    }
    // 16. MOTEUR CONTEXTUEL UNIVERSEL POUR TOUTE QUESTION ÉCRITE LIBRE
    else {
      aiFr = `J'ai bien reçu ta question avec toute mon attention, ma sœur : « ${textToSend} ». En matière de santé féminine, chaque ressenti et chaque interrogation méritent respect et clarté. Écoute ton corps : pratique l'autopalpation mensuelle (quelques jours après tes règles), veille à une bonne hydratation avec les super-aliments burkinabè (moringa, baobab), et n'hésite pas à consulter une sage-femme dans un centre partenaire si tu ressens un doute ou une gêne. Tu peux aussi me poser d'autres questions précises ou toucher le micro !`;
      aiEn = `I received your message with care, my sister: "${textToSend}". In women's health, every concern deserves clear understanding and compassion. Listen to your body: practice monthly breast exams, enjoy wholesome local nutrition, and visit a midwife at a partner clinic whenever in doubt. Feel free to ask more details or speak to me via the microphone!`;
      aiMoore = `M wʋma fo sokrã sõma m maaso : « ${textToSend} ». Fo laafi yaa tɩlae wʋsg : ges fo meng yĩnsã dahar fãa pʋg-peelgã poore, rɩ rɩ-sõma (moringa, baobab), la fo sã n mik bũmb sẽn pa zems fo yĩngẽ, kẽng n ges dɔgɔtɔr-pʋgbo kɛnɛyaso la. Sok-y maam bũmb a taaba !`;
      aiDioula = `N ye i ka ɲiningali mɛn kosɛbɛ n ma muso : « ${textToSend} ». I ka kɛnɛya kɔrɔtanin lo : i sinw sɛgɛsɛgɛ kalo-sira ban kɔfɛ, dumuni kɛnɛ kɛ (moringa, sira-den), wa ni fɛn dɔ y'i gɛlɛya, taga dɔgɔtɔrɔmuso fɛ jona. I bɛ se ka fɛn wɛrɛ ɲini ne fɛ !`;
    }

    // Réponse différée pour simulation naturelle d'analyse IA
    window.setTimeout(() => {
      setRoseMessages((prev) => [
        ...prev,
        {
          sender: "rose",
          text: aiFr,
          englishText: aiEn,
          mooreText: aiMoore,
          dioulaText: aiDioula,
          time: "Maintenant",
        },
      ]);

      // Défilement automatique vers le nouveau message
      window.setTimeout(() => {
        roseChatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 80);

      // Si le micro a été utilisé, synthèse vocale immédiate dans la langue choisie
      if (speakAloud || isRecordingVoice) {
        const textToSpeak =
          appLanguage === "moore" && aiMoore
            ? aiMoore
            : appLanguage === "dioula" && aiDioula
            ? aiDioula
            : appLanguage === "en" && aiEn
            ? aiEn
            : aiFr;
        handlePlayAudio(textToSpeak, appLanguage);
      }
    }, 450);
  };

  useEffect(() => {
    handleSendRoseMessageRef.current = handleSendRoseMessage;
  });

  return {
    dailyTipIndex,
    setDailyTipIndex,
    dailyTipLang,
    setDailyTipLang,
    notificationEnabled,
    setNotificationEnabled,
    roseMessages,
    setRoseMessages,
    roseInput,
    setRoseInput,
    isRecordingVoice,
    setIsRecordingVoice,
    roseChatMode,
    setRoseChatMode,
    oralVoiceLang,
    setOralVoiceLang,
    lastVoiceTranscriptRef,
    handleSendRoseMessageRef,
    clinicalKnowledgeList,
    setClinicalKnowledgeList,
    roseChatBottomRef,
    recognitionRef,
    handleToggleVoiceRecognition,
    handleRequestNotification,
    handleSendRoseMessage,
  };
}

export type EtatRose = ReturnType<typeof useEtatRose>;
