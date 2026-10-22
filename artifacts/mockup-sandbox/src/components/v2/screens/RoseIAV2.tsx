import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Info,
  ShieldCheck,
  User,
} from "lucide-react";
import type { RoseChatMessage } from "../types";
import { roseKnowledgeBase } from "../data/education";
import { speakText, stopSpeaking } from "../utils/speech";
import { hapticFeedback } from "../utils/haptics";
import { CardV2 } from "../ui/CardV2";
import { ButtonV2 } from "../ui/ButtonV2";
import { BadgeV2 } from "../ui/BadgeV2";

interface RoseIAV2Props {
  appLanguage: "fr" | "moore" | "dioula" | "en";
}

export function RoseIAV2({ appLanguage }: RoseIAV2Props) {
  const initialMessages: RoseChatMessage[] = [
    {
      id: "init-1",
      sender: "rose",
      text:
        "Bonjour ma sœur, je suis Rose IA, votre compagne d'information et d'écoute bienveillante. Je réponds à vos questions sur le dépistage du sein, l'hygiène de vie, vos règles et vos examens en toute sérénité. Que ressentez-vous aujourd'hui ?",
      englishText:
        "Hello my sister, I am Rose AI, your caring health and well-being companion. I am here to assist you with breast screening, wellness, cycle questions, and tests. How can I help you today?",
      mooreText:
        "Ne y beogo m maaso ! Mam yaa Rose IA, fo laafi zoa. Mam be ka n na n sõng yãmba ne yĩn-sõngr, rɩɩb sõma, pʋg-tõor bɩ bãas gɩdgre. Sok-y maam bũmb fãa y sẽn ratã.",
      dioulaText:
        "I ni sɔgɔma n ma muso ! Ne ye Rose IA ye. Ne bɛ yan k'i dɛmɛ kɛnɛya, i yɛrɛ saniya, kalo-sira ani hakili-sigi la. Mun b'i kɔnɔ bi ?",
      time: "Maintenant",
    },
  ];

  const [messages, setMessages] = useState<RoseChatMessage[]>(() => {
    if (typeof window === "undefined") return initialMessages;
    try {
      const stored = localStorage.getItem("paglaafi_rose_messages_v2");
      return stored ? JSON.parse(stored) : initialMessages;
    } catch {
      return initialMessages;
    }
  });

  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sauvegarde continue
  useEffect(() => {
    try {
      localStorage.setItem("paglaafi_rose_messages_v2", JSON.stringify(messages));
    } catch {
      // Ignorer
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Suggestions de questions fréquentes
  const quickSuggestions = [
    "Est-ce que la mammographie fait mal ?",
    "Combien coûte un dépistage ?",
    "J'ai senti une boule, que faire ?",
    "Conseils d'hygiène intime",
    "Soulager les règles douloureuses",
  ];

  // Moteur de réponse locale guidée
  const findAnswer = (question: string) => {
    const q = question.toLowerCase();
    let key = "default";

    if (q.includes("mal") || q.includes("douleur") || q.includes("peur") || q.includes("nams")) {
      key = "mal";
    } else if (q.includes("prix") || q.includes("cout") || q.includes("coût") || q.includes("tarif") || q.includes("combien") || q.includes("gratuit") || q.includes("fcfa")) {
      key = "prix";
    } else if (q.includes("boule") || q.includes("nodule") || q.includes("kyste") || q.includes("grosseur") || q.includes("bõn")) {
      key = "boule";
    } else if (q.includes("hygiene") || q.includes("hygiène") || q.includes("toilette") || q.includes("savon")) {
      key = "hygiene";
    }

    const entry = roseKnowledgeBase[key] || roseKnowledgeBase.default;
    return {
      text: entry.fr,
      englishText: entry.en,
      mooreText: entry.moore,
      dioulaText: entry.dioula,
    };
  };

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || inputValue).trim();
    if (!q) return;

    hapticFeedback(15);
    const userMsg: RoseChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: q,
      time: "À l'instant",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsProcessing(true);

    // Simulation de délai de réflexion court
    setTimeout(() => {
      const resp = findAnswer(q);
      const roseMsg: RoseChatMessage = {
        id: `r-${Date.now()}`,
        sender: "rose",
        text: resp.text,
        englishText: resp.englishText,
        mooreText: resp.mooreText,
        dioulaText: resp.dioulaText,
        time: "À l'instant",
      };
      setMessages((prev) => [...prev, roseMsg]);
      setIsProcessing(false);
    }, 450);
  };

  const handleAudioPlayback = (msg: RoseChatMessage) => {
    hapticFeedback(12);
    if (speakingMessageId === msg.id) {
      stopSpeaking();
      setSpeakingMessageId(null);
    } else {
      setSpeakingMessageId(msg.id);
      const text =
        appLanguage === "moore" && msg.mooreText
          ? msg.mooreText
          : appLanguage === "dioula" && msg.dioulaText
          ? msg.dioulaText
          : appLanguage === "en" && msg.englishText
          ? msg.englishText
          : msg.text;

      speakText(text, appLanguage, () => setSpeakingMessageId(null));
    }
  };

  // Reconnaissance vocale par micro (Web Speech API)
  const toggleRecording = () => {
    hapticFeedback(20);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("La reconnaissance vocale n'est pas supportée par ce navigateur.");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = appLanguage === "en" ? "en-US" : "fr-FR";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSend(transcript);
        }
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleResetHistory = () => {
    if (confirm("Voulez-vous effacer l'historique de votre discussion avec Rose IA ?")) {
      hapticFeedback(15);
      setMessages(initialMessages);
      try {
        localStorage.removeItem("paglaafi_rose_messages_v2");
      } catch {
        // Ignorer
      }
    }
  };

  return (
    <div className="space-y-4 animate-fade-in max-w-3xl mx-auto flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-170px)]">
      {/* En-tête d'information et éthique */}
      <div className="rounded-2xl bg-[#FAF2F5] border border-[#E9E0E4] p-3 flex items-center justify-between text-xs text-[#716971]">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-xl bg-[#A14364] text-white">
            <Sparkles size={14} />
          </span>
          <div>
            <span className="font-bold text-[#29252A]">Rose IA Compagne de Santé</span>
            <span className="hidden sm:inline text-[11px] text-[#716971]"> · Écoute & orientation sans tabou</span>
          </div>
        </div>

        <button
          onClick={handleResetHistory}
          className="text-[11px] font-semibold text-[#716971] hover:text-[#A14364] flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw size={12} /> Réinitialiser
        </button>
      </div>

      {/* Zone de discussion avec défilement */}
      <div className="flex-1 overflow-y-auto space-y-3.5 p-3 sm:p-4 rounded-3xl bg-white border border-[#E9E0E4] shadow-xs">
        {messages.map((m) => {
          const isRose = m.sender === "rose";
          const displayText =
            appLanguage === "moore" && m.mooreText
              ? m.mooreText
              : appLanguage === "dioula" && m.dioulaText
              ? m.dioulaText
              : appLanguage === "en" && m.englishText
              ? m.englishText
              : m.text;

          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isRose ? "justify-start" : "justify-end"}`}
            >
              {isRose && (
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#A14364] text-white text-xs shadow-xs mt-1">
                  <Sparkles size={13} />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                  isRose
                    ? "bg-[#FAF2F5] text-[#29252A] border border-[#E9E0E4]"
                    : "bg-[#A14364] text-white font-medium"
                }`}
              >
                <p className="whitespace-pre-line">{displayText}</p>

                <div
                  className={`mt-2 pt-1.5 flex items-center justify-between text-[10px] border-t ${
                    isRose ? "border-[#E9E0E4] text-[#716971]" : "border-white/20 text-pink-100"
                  }`}
                >
                  <span>{m.time}</span>
                  {isRose && (
                    <button
                      onClick={() => handleAudioPlayback(m)}
                      className="flex items-center gap-1 font-bold text-[#A14364] hover:underline cursor-pointer"
                    >
                      {speakingMessageId === m.id ? (
                        <>
                          <VolumeX size={12} /> Arrêter
                        </>
                      ) : (
                        <>
                          <Volume2 size={12} /> Écouter
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-[#716971] italic p-2">
            <Sparkles size={14} className="text-[#A14364] animate-spin" />
            <span>Rose IA réfléchit avec bienveillance...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions rapides en bulles */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {quickSuggestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-full bg-[#FAF2F5] hover:bg-[#F5E8ED] text-[#A14364] border border-[#E9E0E4] text-[11px] font-semibold whitespace-nowrap transition cursor-pointer shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Barre de saisie confortable */}
      <div className="flex items-center gap-2 bg-white rounded-2xl border border-[#E9E0E4] p-1.5 shadow-xs">
        <button
          onClick={toggleRecording}
          aria-label={isRecording ? "Arrêter l'enregistrement" : "Parler au micro"}
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition cursor-pointer ${
            isRecording
              ? "bg-red-600 text-white animate-pulse"
              : "text-[#716971] hover:text-[#A14364] hover:bg-[#FAF2F5]"
          }`}
        >
          {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Posez votre question à Rose IA..."
          className="flex-1 bg-transparent px-2 text-xs sm:text-sm text-[#29252A] placeholder-[#989098] focus:outline-none"
        />

        <ButtonV2
          variant="primary"
          size="sm"
          onClick={() => handleSend()}
          disabled={!inputValue.trim()}
          icon={<Send size={14} />}
        >
          Envoyer
        </ButtonV2>
      </div>

      {/* Mention de prudence médicale légale */}
      <p className="text-[10px] text-center text-[#716971]">
        Rose IA est un guide d'orientation et d'information. Elle ne pose aucun diagnostic médical. En cas d'anomalie ou de douleur persistante, consultez un soignant.
      </p>
    </div>
  );
}
