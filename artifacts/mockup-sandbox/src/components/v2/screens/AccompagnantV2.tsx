import { useState } from "react";
import { MessageCircle, Phone, Heart, Users, Check } from "lucide-react";
import { hapticFeedback } from "../utils/haptics";
import { CardV2 } from "../ui/CardV2";
import { ButtonV2 } from "../ui/ButtonV2";
import { BadgeV2 } from "../ui/BadgeV2";

export function AccompagnantV2() {
  const [smsLang, setSmsLang] = useState<"fr" | "moore" | "dioula">("fr");
  const [toastMsg, setToastMsg] = useState("");

  const invitationTexts = {
    fr: "Bonjour ma sœur, je t'invite à faire notre dépistage du sein ensemble sur PagLaafi. Aller à deux, c'est plus rassurant et c'est un acte d'amour !",
    moore: "Ne y beogo m maaso, m boola fo tɩ d kẽng a yiibu n ges d yĩnsa laafi ne PagLaafi. D kẽnd ne laafi !",
    dioula: "Aw ni sɔgɔma n ma muso, ne b'i weele ka taga kɛnɛyaso la jona sin lajɛ ye ɲɔgɔn fɛ. A ka fisa ni an tagara ɲɔgɔn fɛ !",
  };

  const handleSendWhatsApp = () => {
    hapticFeedback(15);
    const text = encodeURIComponent(invitationTexts[smsLang]);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    setToastMsg("WhatsApp ouvert pour envoi de l'invitation.");
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleSendSMS = () => {
    hapticFeedback(15);
    const text = encodeURIComponent(invitationTexts[smsLang]);
    window.open(`sms:?body=${text}`, "_blank");
    setToastMsg("Application SMS ouverte (fonctionne sans internet).");
    setTimeout(() => setToastMsg(""), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <CardV2 className="space-y-4">
        <div>
          <BadgeV2 variant="rose">Solidarité de Proximité</BadgeV2>
          <h3 className="text-base sm:text-lg font-bold text-[#29252A] font-display mt-1">
            Aller à deux : Inviter une proche au dépistage
          </h3>
          <p className="text-xs text-[#716971] leading-relaxed mt-1">
            Faire un examen clinique ou un dépistage peut être intimidant. Être accompagnée par une amie, une sœur ou sa mère change tout. Envoyez une invitation bienveillante en 1 clic.
          </p>
        </div>

        {/* Choix de la langue de l'invitation */}
        <div>
          <label className="block text-xs font-bold text-[#29252A] mb-1.5">
            Langue du message d'invitation :
          </label>
          <div className="flex gap-2">
            {[
              { key: "fr" as const, label: "Français" },
              { key: "moore" as const, label: "Mooré" },
              { key: "dioula" as const, label: "Dioula" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  hapticFeedback(10);
                  setSmsLang(key);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  smsLang === key
                    ? "bg-[#A14364] text-white"
                    : "bg-white text-[#716971] border border-[#E9E0E4] hover:bg-[#FAF2F5]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Aperçu du message */}
        <div className="p-4 rounded-2xl bg-[#FAF2F5] border border-[#E9E0E4] text-xs text-[#29252A] italic">
          « {invitationTexts[smsLang]} »
        </div>

        {/* Boutons d'envoi WhatsApp et SMS direct */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleSendWhatsApp}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 transition cursor-pointer"
          >
            <MessageCircle size={16} />
            <span>Inviter par WhatsApp</span>
          </button>

          <button
            onClick={handleSendSMS}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white border-2 border-emerald-600 text-emerald-800 font-bold text-xs hover:bg-emerald-50 transition cursor-pointer"
          >
            <Phone size={16} />
            <span>SMS direct (Sans connexion)</span>
          </button>
        </div>

        {toastMsg && (
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs text-center font-semibold">
            {toastMsg}
          </div>
        )}
      </CardV2>
    </div>
  );
}
