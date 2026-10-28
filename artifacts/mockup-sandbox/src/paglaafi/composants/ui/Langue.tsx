import { useEffect, useState } from "react";
import { Square, Volume2, VolumeX } from "lucide-react";
import { arreterLecture, audioDisponible, lire, type Langue } from "../../lib/voix";
import { LIBELLES_LANGUES } from "./Navigation";

/** Versions d'un texte selon la langue (les absentes ne sont jamais générées automatiquement). */
export type Versions = Partial<Record<Langue, string | null | undefined>>;

/** Texte dans la langue demandée, sinon le français (avec l'indication qu'il manque une traduction). */
export function choisirTexte(versions: Versions, langue: Langue): { texte: string; langue: Langue; manquante: boolean } {
  const t = versions[langue];
  if (t && t.trim()) return { texte: t, langue, manquante: false };
  return { texte: versions.fr ?? "", langue: "fr", manquante: langue !== "fr" };
}

/** Mention affichée quand le français remplace une traduction absente. */
export function MentionTraduction({ langue, partie }: { langue: Langue; partie?: string }) {
  return (
    <p className="text-petit italic text-texte-2">
      {partie ? `${partie} : t` : "T"}raduction en {LIBELLES_LANGUES[langue]} à venir
    </p>
  );
}

/**
 * Bouton « Écouter » : MP3 si fourni, sinon voix de l'appareil (français, anglais).
 * Désactivé avec « Audio indisponible pour cette langue » quand aucune voix ne convient.
 */
export function BoutonEcouter({ texte, langue, url, className = "" }: { texte: string; langue: Langue; url?: string | null; className?: string }) {
  const [enLecture, setEnLecture] = useState(false);
  const [, rafraichir] = useState(0);
  // Les voix de l'appareil se chargent parfois après l'affichage
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const maj = () => rafraichir((n) => n + 1);
    window.speechSynthesis.addEventListener?.("voiceschanged", maj);
    window.addEventListener("online", maj);
    window.addEventListener("offline", maj);
    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", maj);
      window.removeEventListener("online", maj);
      window.removeEventListener("offline", maj);
    };
  }, []);
  // Une autre lecture démarre ou s'arrête : ce bouton revient à « Écouter »
  useEffect(() => {
    const remettre = () => setEnLecture(false);
    window.addEventListener("pl-lecture-arretee", remettre);
    return () => window.removeEventListener("pl-lecture-arretee", remettre);
  }, []);

  if (!audioDisponible(langue, url)) {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <button type="button" disabled className="inline-flex min-h-11 items-center gap-2 rounded-bouton border-[1.5px] border-bordure-2 px-3 text-petit font-semibold text-texte-2 opacity-60">
          <VolumeX size={18} aria-hidden /> Écouter
        </button>
        <span className="text-petit text-texte-2">Audio indisponible pour cette langue</span>
      </span>
    );
  }
  return (
    <button
      type="button"
      aria-pressed={enLecture}
      onClick={() => {
        if (enLecture) {
          arreterLecture();
          setEnLecture(false);
          return;
        }
        if (lire({ texte, langue, url, onFin: () => setEnLecture(false) })) window.setTimeout(() => setEnLecture(true), 0);
      }}
      className={`inline-flex min-h-11 items-center gap-2 rounded-bouton border-[1.5px] border-action px-3 text-petit font-semibold text-action ${className}`}
    >
      {enLecture ? <Square size={16} aria-hidden /> : <Volume2 size={18} aria-hidden />} {enLecture ? "Arrêter" : "Écouter"}
    </button>
  );
}
