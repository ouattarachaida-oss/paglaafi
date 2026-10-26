import { Mic, Play, Send, ShieldCheck, Sparkles, Stethoscope, Volume2 } from "lucide-react";
import { hapticFeedback } from "../lib/haptique";
import { useUi, useAuth, useAudio, useSante, useRose, useDocteur, useEducation } from "../etat/contextes";

/**
 * Onglet Rose IA : discussion écrite ou orale.
 */
export function RoseIA() {
  const { appLanguage, section } = useUi();
  const { currentUser } = useAuth();
  const { handlePlayAudio } = useAudio();
  const { setShowPrivacyModal } = useSante();
  const {
    handleSendRoseMessage,
    handleToggleVoiceRecognition,
    isRecordingVoice,
    roseChatBottomRef,
    roseInput,
    roseMessages,
    setRoseInput,
  } = useRose();
  const { setShowDoctorTrainModal } = useDocteur();
  const { setShowAutopalpationVideoModal } = useEducation();

  return (
    <section className="ph-enter flex flex-col h-full px-4 pt-2.5 pb-2">
      {/* ============================================================ */}
      {/* CONTENEURS DU HAUT SELON LE PROFIL                           */}
      {/* Profil Utilisatrice : uniquement "Voir la vidéo"             */}
      {/* Profil Docteur/Superadmin : "Entraîner le modèle" + "Vidéo"  */}
      {/* ============================================================ */}
      {currentUser?.adminType === "doctor" || currentUser?.role === "superadmin" ? (
        /* HAUT DE PAGE POUR DOCTEURS & SUPERADMIN */
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              hapticFeedback(15);
              setShowDoctorTrainModal(true);
            }}
            className="flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-800 p-2.5 text-white font-bold text-xs shadow-xs hover:opacity-95 transition cursor-pointer"
          >
            <Stethoscope size={15} className="text-cyan-300" />
            <span>Entraîner Rose IA 🩺</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAutopalpationVideoModal(true)}
            className="flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#9e466b] to-rose-600 p-2.5 text-white font-bold text-xs shadow-xs hover:opacity-95 transition cursor-pointer"
          >
            <Play size={14} className="fill-white" />
            <span>Voir la vidéo 🎬</span>
          </button>
        </div>
      ) : (
        /* HAUT DE PAGE POUR LES UTILISATRICES : UNIQUEMENT VOIR LA VIDÉO */
        <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-rose-600 via-[#ea2d6d] to-[#734059] px-3.5 py-2.5 text-white shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="relative grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/20 text-white backdrop-blur-xs">
              <Play size={14} className="fill-white translate-x-0.5" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 border border-white" />
            </div>
            <div>
              <h4 className="font-bold text-xs">Vidéo d'Autopalpation Mammaire</h4>
              <p className="text-[9.5px] text-white/85">Démonstration guidée pas-à-pas par notre sage-femme</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAutopalpationVideoModal(true)}
            className="rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-[#ea2d6d] shadow-xs hover:bg-pink-50 transition shrink-0 cursor-pointer"
          >
            Voir la vidéo 🎬
          </button>
        </div>
      )}

      {/* MINI-BANDEAU D'ÉTAT DISCRET DE ROSE IA */}
      <div className="mt-2 flex items-center justify-between rounded-xl bg-white border border-[#f0dee3] px-3 py-1.5 text-xs shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-tr from-[#8a3857] to-[#cf5d83] text-white shadow-2xs">
              <Sparkles size={14} className="text-amber-300" />
            </span>
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white ph-pulse" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#580e36] text-xs">Rose IA</span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
              En ligne
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPrivacyModal(true)}
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#863b55] hover:underline cursor-pointer"
            title="Confidentialité et éthique médicale"
          >
            <ShieldCheck size={12} className="text-emerald-600" />
            <span>100% Confidentiel</span>
          </button>
        </div>
      </div>

      {/* CAPSULES DE QUESTIONS RAPIDES (INSPIRATION & CONSEILS) */}
      <div className="ph-scroll mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
        {[
          { label: "🌸 Toilette intime", q: "Comment bien faire ma toilette intime ?" },
          { label: "🖐️ Comment se palper ?", q: "Comment bien faire l'autopalpation des seins étape par étape ?" },
          { label: "🔍 Petite boule au sein", q: "J'ai senti une petite boule dans mon sein, que faire ?" },
          { label: "🩸 Douleurs de règles", q: "Comment soulager mes crampes et douleurs de règles naturellement ?" },
          { label: "🌿 Moringa & Baobab", q: "Quels sont les bienfaits du moringa et du baobab pour ma santé ?" },
          { label: "📍 Centres de dépistage", q: "Où se faire dépister à Ouagadougou ?" },
          { label: "💰 Coût du dépistage", q: "Combien coûte le dépistage au Burkina Faso ?" },
          { label: "🧘‍♀️ Sérénité & moral", q: "Je me sens fatiguée et stressée, aide-moi" },
        ].map(({ label, q }) => (
          <button
            key={label}
            type="button"
            onClick={() => handleSendRoseMessage(q)}
            className="shrink-0 rounded-full border border-[#e4cad3] bg-white px-2.5 py-1 text-[#863b55] font-semibold hover:bg-[#faedf2] transition shadow-2xs cursor-pointer"
          >
            {label}
          </button>
        ))}
      </div>

      {/* ZONE DES MESSAGES DU CHATBOT ROSE IA (HAUTEUR DYNAMIQUE PLEINE) */}
      <div className="mt-2 space-y-2.5 flex-1 min-h-[300px] overflow-y-auto pr-1">
        {roseMessages.map((msg, i) => {
          const isUser = msg.sender === "user";
          // Texte à afficher selon la langue choisie
          const displayedText = isUser
            ? msg.text
            : appLanguage === "moore" && msg.mooreText
              ? msg.mooreText
              : appLanguage === "dioula" && msg.dioulaText
                ? msg.dioulaText
                : appLanguage === "en" && msg.englishText
                  ? msg.englishText
                  : msg.text;

          const hasVideoRecommendation =
            !isUser &&
            (msg.text.toLowerCase().includes("palpation") ||
              msg.text.toLowerCase().includes("geste") ||
              msg.text.toLowerCase().includes("boule") ||
              msg.text.toLowerCase().includes("sein") ||
              msg.text.toLowerCase().includes("nodule"));

          return (
            <div key={i} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[88%] rounded-[20px] p-3 text-xs leading-relaxed shadow-xs ${
                  isUser
                    ? "bg-[#ea2d6d] text-white rounded-tr-xs"
                    : "bg-white text-[#580e36] border border-[#f0dfe4] rounded-tl-xs"
                }`}
              >
                <p className="whitespace-pre-wrap">{displayedText}</p>

                {/* Bouton cliquable pour voir la vidéo si suggéré par Rose IA */}
                {hasVideoRecommendation && (
                  <button
                    type="button"
                    onClick={() => setShowAutopalpationVideoModal(true)}
                    className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#ea2d6d] to-rose-700 py-1.5 px-2.5 text-[11px] font-bold text-white shadow-xs hover:opacity-95 transition cursor-pointer"
                  >
                    <Play size={12} className="fill-white" />
                    <span>Voir la démonstration vidéo (Sage-femme) 🎬</span>
                  </button>
                )}
              </div>

              {/* ÉCOUTE VOCALE DISCRÈTE (DANS LA LANGUE CHOISIE) */}
              {!isUser && (
                <div className="mt-1 flex items-center gap-2 pl-1">
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(displayedText, appLanguage)}
                    className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#ea2d6d] hover:underline cursor-pointer"
                    title={`Écouter à voix haute en ${appLanguage.toUpperCase()}`}
                  >
                    <Volume2 size={12} />
                    <span>
                      Écouter (
                      {appLanguage === "moore"
                        ? "Mooré"
                        : appLanguage === "dioula"
                          ? "Dioula"
                          : appLanguage.toUpperCase()}
                      )
                    </span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {/* Point d'ancrage pour le défilement automatique */}
        <div ref={roseChatBottomRef} />
      </div>

      {/* RAPPEL ÉTHIQUE MÉDICAL */}
      <div className="mt-1.5 text-center text-[9px] text-[#936b7c] px-2 italic">
        🛡️ Rose IA est une conseillère préventive bienveillante. Elle ne remplace pas l'avis d'une sage-femme ou d'un
        médecin.
      </div>

      {/* BARRE DE SAISIE MODERNE & RÉACTIVE (<FORM> TOUCHE ENTRÉE + MICRO) */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendRoseMessage();
        }}
        className="mt-1.5 rounded-2xl border border-[#e5ccd5] bg-white p-2 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleVoiceRecognition}
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition cursor-pointer ${
              isRecordingVoice
                ? "bg-rose-600 text-white ph-pulse ring-2 ring-rose-300"
                : "bg-[#f8e7ec] text-[#ea2d6d] hover:bg-[#f2dbe2]"
            }`}
            title={isRecordingVoice ? "Arrêter le micro" : "Parler à Rose IA au micro"}
          >
            <Mic size={17} className={isRecordingVoice ? "animate-pulse" : ""} />
          </button>
          <input
            type="text"
            value={roseInput}
            onChange={(e) => setRoseInput(e.target.value)}
            placeholder={
              isRecordingVoice
                ? "Rose IA vous écoute avec tendresse... Parlez"
                : "Posez votre question à Rose IA (écrit ou micro)..."
            }
            className="flex-1 bg-transparent text-xs text-[#580e36] outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={!roseInput.trim()}
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition cursor-pointer ${
              roseInput.trim()
                ? "bg-[#ea2d6d] text-white hover:bg-[#8e3856] shadow-xs"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            title="Envoyer le message"
          >
            <Send size={15} />
          </button>
        </div>
      </form>
    </section>
  );
}
