import { hapticFeedback } from "../lib/haptique";
import type { EtatUi } from "./useEtatUi";
import type { EtatAudio } from "./useEtatAudio";
import type { EtatRose } from "./useEtatRose";

/**
 * Changement de la langue de l'application (synchronise audio, conseils et voix de Rose IA).
 */
export function useEtatLangue({ ui, audio, rose }: { ui: EtatUi; audio: EtatAudio; rose: EtatRose }) {
  const { notify, setAppLanguage, setShowLanguageMenu } = ui;
  const { setSpeechLanguage } = audio;
  const { setDailyTipLang, setOralVoiceLang } = rose;

  const handleSelectAppLanguage = (lang: "fr" | "moore" | "dioula" | "en") => {
    hapticFeedback(15);
    setAppLanguage(lang);
    setSpeechLanguage(lang);
    setDailyTipLang(lang);
    setOralVoiceLang(lang);
    setShowLanguageMenu(false);
    try {
      localStorage.setItem("paglaafi_app_lang", lang);
    } catch {
      // Ignorer
    }
    const langNames = {
      fr: "Français 🇫🇷",
      moore: "Mooré 🇧🇫",
      dioula: "Dioula 🇧🇫",
      en: "English 🇬🇧",
    };
    notify(`Langue changée : ${langNames[lang]}`);
  };

  return {
    handleSelectAppLanguage,
  };
}

export type EtatLangue = ReturnType<typeof useEtatLangue>;
