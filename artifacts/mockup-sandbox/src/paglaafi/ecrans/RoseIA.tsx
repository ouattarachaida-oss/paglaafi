import { Loader2, MapPin, Mic, Play, Send, ShieldCheck, Sparkles, Volume2 } from "lucide-react";
import { useUi, useAuth, useAudio, useSante, useRose, useEducation, useCentres } from "../etat/contextes";
import { MODE_REEL } from "../config";
import { estInvitee } from "../composants/entreesMenu";
import { Bandeau, BadgeOrigineRose, LIBELLES_LANGUES } from "../composants/ui";

// Suggestions de questions (libellés d'interface ; la question envoyée reste complète)
const SUGGESTIONS = [
  { libelle: "Toilette intime", q: "Comment bien faire ma toilette intime ?" },
  { libelle: "Comment se palper ?", q: "Comment bien faire l'autopalpation des seins étape par étape ?" },
  { libelle: "Petite boule au sein", q: "J'ai senti une petite boule dans mon sein, que faire ?" },
  { libelle: "Douleurs de règles", q: "Comment soulager mes crampes et douleurs de règles naturellement ?" },
  { libelle: "Moringa et baobab", q: "Quels sont les bienfaits du moringa et du baobab pour ma santé ?" },
  { libelle: "Centres de dépistage", q: "Où se faire dépister à Ouagadougou ?" },
  { libelle: "Coût du dépistage", q: "Combien coûte le dépistage au Burkina Faso ?" },
  { libelle: "Sérénité et moral", q: "Je me sens fatiguée et stressée, aide-moi" },
];

const MOTIFS = {
  hors_ligne: "Vous êtes hors ligne : Rose répond depuis la FAQ validée enregistrée sur l'appareil.",
  non_connectee: "Connectez-vous pour discuter avec Rose IA. En attendant, elle répond depuis la FAQ validée.",
  quota: "Limite de questions du jour atteinte : Rose répond depuis la FAQ validée jusqu'à demain.",
  indisponible: "Rose IA est momentanément indisponible : réponse tirée de la FAQ validée.",
} as const;

/**
 * Rose IA : bandeau permanent, bulles de discussion, origine et sources sous chaque
 * réponse, alerte avec accès aux centres, saisie fixe (suggestions, micro, envoi).
 * Discussion centrée (760 px) et suggestions sur le côté à partir de 1024 px.
 */
export function RoseIA() {
  const { appLanguage, isOffline, setSection } = useUi();
  const { currentUser } = useAuth();
  const { handlePlayAudio } = useAudio();
  const { setShowPrivacyModal } = useSante();
  const { handleSendRoseMessage, handleToggleVoiceRecognition, isRecordingVoice, roseChatBottomRef, roseInput, roseMessages, setRoseInput, roseEnAttente } = useRose();
  const { setShowAutopalpationVideoModal } = useEducation();
  const { setViewMode, trouverCentreProche } = useCentres();

  const dernierMotif = [...roseMessages].reverse().find((m) => m.sender === "rose")?.motif;
  const etat = isOffline ? "hors_ligne" : MODE_REEL && estInvitee(currentUser) ? "non_connectee" : dernierMotif;
  const langue = LIBELLES_LANGUES[appLanguage];

  const puces = (vertical?: boolean) => (
    <div className={vertical ? "flex flex-col gap-2" : "defilement-discret flex gap-2 overflow-x-auto"}>
      {SUGGESTIONS.map(({ libelle, q }) => (
        <button
          key={libelle}
          type="button"
          onClick={() => handleSendRoseMessage(q)}
          className={`min-h-11 shrink-0 rounded-full border border-bordure bg-surface px-4 text-petit font-semibold text-texte active:bg-rose-100 ${vertical ? "text-left" : ""}`}
        >
          {libelle}
        </button>
      ))}
    </div>
  );

  return (
    <section className="anim-apparition lg:grid lg:grid-cols-[minmax(0,760px)_240px] lg:justify-center lg:gap-8">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="flex items-center gap-2 text-titre text-prune-900">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-action text-sur-action" aria-hidden>
              <Sparkles size={20} />
            </span>
            Rose IA
          </h1>
          <button type="button" onClick={() => setShowPrivacyModal(true)} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-petit font-semibold text-texte-2">
            <ShieldCheck size={18} aria-hidden /> {MODE_REEL ? "Questions anonymisées" : "Confidentialité"}
          </button>
        </div>

        {/* Rappel permanent, visible à chaque ouverture de Rose IA */}
        <Bandeau ton="rose" className="mt-3">
          <span role="note">Rose IA informe et oriente : elle ne remplace pas un soignant.</span>
        </Bandeau>
        {etat && (
          <Bandeau ton={etat === "hors_ligne" || etat === "quota" ? "horsLigne" : "info"} className="mt-2" role="status">
            {MOTIFS[etat]}
          </Bandeau>
        )}

        <ol className="mt-4 space-y-4 pb-48 md:pb-6" aria-label="Discussion avec Rose IA" aria-live="polite">
          {roseMessages.map((msg, i) => {
            const utilisatrice = msg.sender === "user";
            const texte = utilisatrice
              ? msg.text
              : appLanguage === "moore" && msg.mooreText
                ? msg.mooreText
                : appLanguage === "dioula" && msg.dioulaText
                  ? msg.dioulaText
                  : appLanguage === "en" && msg.englishText
                    ? msg.englishText
                    : msg.text;
            const video = !utilisatrice && /palpation|geste|boule|sein|nodule/i.test(msg.text);

            return (
              <li key={i} className={`flex gap-2 ${utilisatrice ? "justify-end" : "justify-start"}`}>
                {!utilisatrice && (
                  <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-500" aria-hidden>
                    <Sparkles size={16} />
                  </span>
                )}
                <div className={`flex max-w-[85%] flex-col ${utilisatrice ? "items-end" : "items-start"}`}>
                  <span className="sr-only">{utilisatrice ? "Vous :" : "Rose IA :"}</span>
                  <div
                    className={`rounded-carte px-4 py-3 text-corps ${
                      utilisatrice ? "rounded-br-none bg-action text-sur-action" : "rounded-tl-none border border-bordure bg-surface text-texte shadow-carte"
                    }`}
                  >
                    {!utilisatrice && msg.alerte && (
                      <div className="mb-3 rounded-bouton border-[1.5px] border-alerte bg-alerte-fond p-3 text-petit text-alerte">
                        <p className="font-semibold">Consultez rapidement un soignant.</p>
                        <button
                          type="button"
                          onClick={() => {
                            setSection("Centres");
                            setViewMode("proches");
                            void trouverCentreProche();
                          }}
                          className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-bouton bg-[#b42318] px-3 font-semibold text-white"
                        >
                          <MapPin size={18} aria-hidden /> Trouver un centre proche
                        </button>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{texte}</p>

                    {!utilisatrice && msg.origine && (
                      <div className="mt-3 space-y-2 border-t border-bordure pt-3">
                        <BadgeOrigineRose origine={msg.origine} />
                        {msg.sources && msg.sources.length > 0 && (
                          <ol className="list-decimal space-y-1 pl-5 text-petit text-texte-2">
                            {msg.sources.map((src, k) => (
                              <li key={k}>
                                <span className="font-semibold text-prune-900">{src.titre}</span>
                                {src.source && (
                                  <>
                                    {" — "}
                                    {src.url ? (
                                      <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-action underline underline-offset-2">
                                        {src.source}
                                      </a>
                                    ) : (
                                      src.source
                                    )}
                                  </>
                                )}
                              </li>
                            ))}
                          </ol>
                        )}
                      </div>
                    )}

                    {video && (
                      <button
                        type="button"
                        onClick={() => setShowAutopalpationVideoModal(true)}
                        className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-bouton border-[1.5px] border-action px-3 text-petit font-semibold text-action"
                      >
                        <Play size={16} aria-hidden /> Voir la démonstration vidéo
                      </button>
                    )}
                  </div>
                  {!utilisatrice && (
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(texte, appLanguage)}
                      className="mt-1 inline-flex min-h-11 items-center gap-1.5 px-1 text-petit font-semibold text-action"
                    >
                      <Volume2 size={18} aria-hidden /> Écouter ({langue})
                    </button>
                  )}
                </div>
              </li>
            );
          })}
          {roseEnAttente && (
            <li className="flex items-center gap-2 text-petit text-texte-2" role="status">
              <Loader2 size={18} className="animate-spin text-rose-500" aria-hidden /> Rose cherche dans les fiches…
            </li>
          )}
        </ol>
        <div ref={roseChatBottomRef} />

        {/* Zone de saisie fixe (au-dessus de la barre du bas sur mobile) */}
        <div className="pb-securite fixed inset-x-0 bottom-[calc(88px+env(safe-area-inset-bottom))] z-20 border-t border-bordure bg-fond/95 px-4 pb-3 pt-3 backdrop-blur md:sticky md:bottom-4 md:mt-4 md:rounded-carte md:border md:bg-surface md:px-3 md:pb-3 md:shadow-flottant">
          <div className="mb-2 lg:hidden">{puces()}</div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendRoseMessage();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleToggleVoiceRecognition}
              aria-pressed={isRecordingVoice}
              aria-label={isRecordingVoice ? "Arrêter le micro" : "Parler à Rose IA au micro"}
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${isRecordingVoice ? "bg-action text-sur-action" : "bg-rose-200 text-prune-900"}`}
            >
              <Mic size={22} aria-hidden className={isRecordingVoice ? "animate-pulse" : ""} />
            </button>
            <label htmlFor="question-rose" className="sr-only">
              Votre question à Rose IA
            </label>
            <input
              id="question-rose"
              type="text"
              value={roseInput}
              onChange={(e) => setRoseInput(e.target.value)}
              placeholder={isRecordingVoice ? "Rose vous écoute… Parlez" : "Posez votre question…"}
              className="h-12 min-w-0 flex-1 rounded-full border-[1.5px] border-bordure-2 bg-surface px-4 text-corps text-texte placeholder:text-indicatif focus:border-2 focus:border-action focus:outline-none focus:ring-4 focus:ring-rose-200"
            />
            <button
              type="submit"
              disabled={!roseInput.trim()}
              aria-label="Envoyer la question"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-action text-sur-action disabled:opacity-50"
            >
              <Send size={20} aria-hidden />
            </button>
          </form>
        </div>
      </div>

      {/* Suggestions sur le côté (ordinateur) */}
      <aside className="hidden lg:block">
        <h2 className="mb-3 text-corps font-semibold text-prune-900">Suggestions</h2>
        {puces(true)}
      </aside>
    </section>
  );
}
