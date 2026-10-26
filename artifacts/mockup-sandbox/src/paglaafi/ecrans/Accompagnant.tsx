import { MessageCircle, Phone } from "lucide-react";
import { useUi } from "../etat/contextes";

/**
 * Onglet L'Accompagnant : invitation par WhatsApp ou SMS.
 */
export function Accompagnant() {
  const { appShareUrl, notify, section, setSmsLanguage, smsLanguage } = useUi();

  return (
    <section className="ph-enter px-5 pt-4">
      <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">Aller à deux</span>
      <h1 className="ph-display text-[26px] leading-tight text-[#580e36]">L'Accompagnant</h1>
      <p className="mt-1 text-xs text-[#795f6d]">
        Aller faire son dépistage, c'est plus facile à deux. Invitez une proche par WhatsApp ou directement par SMS
        simple (sans connexion internet requise).
      </p>

      {/* Choix de la langue de message d'accompagnement */}
      <div className="mt-3.5 rounded-2xl bg-white border border-[#ebd6dc] p-3 text-xs">
        <label className="block font-bold text-[#543644] mb-1.5">Langue de l'invitation :</label>
        <div className="flex gap-2">
          <button
            onClick={() => setSmsLanguage("fr")}
            className={`flex-1 rounded-xl py-1.5 font-bold transition text-xs ${smsLanguage === "fr" ? "bg-[#ea2d6d] text-white" : "border border-[#e5ccd5] text-[#714f5e]"}`}
          >
            Français
          </button>
          <button
            onClick={() => setSmsLanguage("moore")}
            className={`flex-1 rounded-xl py-1.5 font-bold transition text-xs ${smsLanguage === "moore" ? "bg-[#ea2d6d] text-white" : "border border-[#e5ccd5] text-[#714f5e]"}`}
          >
            Mooré
          </button>
        </div>

        <div className="mt-3 rounded-xl bg-[#fdf5f8] border border-[#f5dfeb] p-2.5 text-[11px] italic text-[#6f4b5d]">
          «{" "}
          {smsLanguage === "fr"
            ? `Bonjour ma sœur, je t'invite à faire notre dépistage du sein ensemble sur PagLaafi : ${appShareUrl}`
            : `Ne y beogo m maaso, m boola fo tɩ d kẽng a yiibu n ges d yĩnsa laafi ne PagLaafi : ${appShareUrl}`}{" "}
          »
        </div>

        {/* 1. BOUTON ENVOI PAR WHATSAPP */}
        <button
          onClick={() => {
            const text = encodeURIComponent(
              smsLanguage === "fr"
                ? `Bonjour ma sœur, je t'invite à faire notre dépistage du sein ensemble sur PagLaafi : ${appShareUrl}`
                : `Ne y beogo m maaso, m boola fo tɩ d kẽng a yiibu n ges d yĩnsa laafi ne PagLaafi : ${appShareUrl}`,
            );
            window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
            notify("Invitation WhatsApp prête à l'envoi.");
          }}
          className="mt-3 w-full rounded-2xl bg-emerald-600 py-2.5 font-bold text-white text-center flex items-center justify-center gap-2 shadow hover:bg-emerald-700 transition"
        >
          <MessageCircle size={16} /> Inviter mon accompagnant(e) par WhatsApp
        </button>

        {/* 2. BOUTON ENVOI PAR SMS SIMPLE (EXIGÉ) */}
        <button
          onClick={() => {
            const text = encodeURIComponent(
              smsLanguage === "fr"
                ? `Bonjour ma sœur, je t'invite à faire notre dépistage du sein ensemble sur PagLaafi : ${appShareUrl}`
                : `Ne y beogo m maaso, m boola fo tɩ d kẽng a yiibu n ges d yĩnsa laafi ne PagLaafi : ${appShareUrl}`,
            );
            window.open(`sms:?body=${text}`, "_blank");
            notify("Application SMS ouverte pour envoi direct.");
          }}
          className="mt-2 w-full rounded-2xl border-2 border-emerald-600 bg-white py-2.5 font-bold text-emerald-800 text-center flex items-center justify-center gap-2 hover:bg-emerald-50 transition"
        >
          <Phone size={16} /> Envoyer par SMS simple (Sans connexion Internet)
        </button>
      </div>
    </section>
  );
}
