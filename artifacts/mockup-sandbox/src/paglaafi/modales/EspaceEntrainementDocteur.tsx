import {
  Check,
  CheckCheck,
  CheckCircle2,
  GraduationCap,
  Lock,
  Sparkles,
  Stethoscope,
  Volume2,
  X,
} from "lucide-react";
import { useAudio, useDocteur } from "../etat/contextes";

/**
 * Parcours docteur d'« entraînement » de Rose IA en 4 étapes (simulation).
 */
export function EspaceEntrainementDocteur() {
  const { handlePlayAudio } = useAudio();
  const { doctorEmpathicReformulation, doctorSignName, doctorSignRole, doctorTeachContent, doctorTeachTopic, doctorTestAnswer, doctorTestQuestion, doctorTrainStep, handleFinalizeDoctorTraining, handleRunDoctorTestSimulation, handleSelectDoctorPresetTopic, setDoctorSignName, setDoctorSignRole, setDoctorTeachContent, setDoctorTeachTopic, setDoctorTestAnswer, setDoctorTestQuestion, setDoctorTrainStep, setShowDoctorTrainModal, showDoctorTrainModal } = useDocteur();

  if (!(showDoctorTrainModal)) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:absolute sm:rounded-[36px]"
      onClick={() => setShowDoctorTrainModal(false)}
    >
      <div
        className="ph-enter max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl border border-[#ecd5df]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-[#f2e1e7] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-800">
              <GraduationCap size={20} />
            </div>
            <div>
              <h3 className="ph-display text-sm font-bold text-[#580e36]">
                Entraînement Clinique Rose IA
              </h3>
              <p className="text-[10px] text-amber-800 font-bold">
                Parcours Soignant · Étape {doctorTrainStep}/4
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDoctorTrainModal(false)}
            className="rounded-full p-1.5 text-[#725261] hover:bg-[#faedf2]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Indicateur visuel d'étapes (1 -> 2 -> 3 -> 4) */}
        <div className="mt-3 flex items-center justify-between px-1">
          {[
            { step: 1, label: "Thème" },
            { step: 2, label: "Protocole" },
            { step: 3, label: "Simulation" },
            { step: 4, label: "Signature" },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center flex-1">
              <div
                className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold transition ${
                  doctorTrainStep === item.step
                    ? "bg-amber-500 text-white shadow-md ring-2 ring-amber-300"
                    : doctorTrainStep > item.step
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {doctorTrainStep > item.step ? <Check size={13} /> : item.step}
              </div>
              <span
                className={`text-[9px] font-semibold mt-1 ${
                  doctorTrainStep === item.step ? "text-amber-800 font-bold" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* ÉTAPE 1 : Choix ou Saisie du Thème Clinique */}
        {doctorTrainStep === 1 && (
          <div className="mt-4 space-y-3 text-xs">
            <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-3 text-amber-950">
              <p className="font-bold text-xs flex items-center gap-1.5 text-amber-900">
                <Stethoscope size={14} /> Objectif de la simulation
              </p>
              <p className="text-[11px] text-amber-900/90 mt-1 leading-relaxed">
                En tant que docteur, sage-femme ou agent de santé, vous enrichissez la base de connaissances de Rose IA avec vos protocoles cliniques locaux. Choisissez un cas concret :
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#7a4c60]">
                Cas cliniques & Recommandations présélectionnées :
              </p>

              {/* Presets de thèmes */}
              <button
                type="button"
                onClick={() =>
                  handleSelectDoctorPresetTopic(
                    "Permanence urgences mammaires & Nodule suspect",
                    "Pour toute patiente présentant un nodule dur et indolore, accueil sans rendez-vous tous les matins au service d'imagerie. Mammographie et échographie sous 48h.",
                    "Ma sœur, rassure-toi : un nodule n'est pas forcément grave, mais ton corps mérite toute notre attention. Viens directement sans rendez-vous au CMA Schiphra ou CHU Bogodogo dès demain matin à 08h. Une sage-femme et un radiologue vont t'examiner avec douceur.",
                    "M maaso, da zoe rabeem ye: bõn-kʋdga pa bãag fãa ye, la yaa tɩlae tɩ d ges-a tao-tao. Wa-y zĩigẽ zaabre n mik dɔgɔtɔrã tɩ b ges yãmba ne laafi.",
                    "N ma muso, kana siran : fɛn o fɛn bɛ sin na, a bɛɛ tɛ bana juguman ye. Nka taga kɛnɛyaso la jona sɔgɔma fɛ walasa dɔgɔtɔrɔmuso ka lajɛ saniya kɛ.",
                    "J'ai senti une boule un peu dure dans mon sein droit qui ne me fait pas mal, est-ce que je dois m'inquiéter ?"
                  )
                }
                className="w-full text-left p-3 rounded-2xl border border-pink-200 bg-[#fffbfc] hover:bg-pink-50 transition space-y-1 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#8a2d4f] text-xs">🩺 Nodule suspect & Urgences mammaires</span>
                  <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">Priorité 48h</span>
                </div>
                <p className="text-[10.5px] text-[#6b4c5b]">
                  Accueil direct sans rendez-vous au CMA Schiphra ou CHU Bogodogo + protocole rassurant.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSelectDoctorPresetTopic(
                    "Douleurs de règles aiguës & Endométriose",
                    "Des règles très douloureuses incapacitantes ne sont pas normales. Exclure l'endométriose par échographie pelvienne dédiée. Éviter l'automédication prolongée aux anti-inflammatoires.",
                    "Chère sœur, souffrir pendant ses règles n'est pas une fatalité. Si la douleur t'empêche de travailler ou dormir, ce n'est pas une faiblesse. Consulte un gynécologue pour rechercher une endométriose. En attendant, privilégie une bouillotte tiède et l'infusion de gingembre doux.",
                    "M yaanga, rog-n-mik bãag sã n namsd foo wakat fãa, pa yel-bãanega ye. Taga dɔgɔtɔr n bãng a võore.",
                    "N ba den muso, dimi min bɛ kɛ muso kɔnɔ fɛ kalo o kalo, ni a ka bon kosɛbɛ, a tɛ foyi ye fo ka dɔgɔtɔrɔ sɔrɔ.",
                    "Mes règles me font tellement mal que je ne peux pas me lever du lit, ma mère me dit que c'est normal pour une femme ?"
                  )
                }
                className="w-full text-left p-3 rounded-2xl border border-pink-200 bg-[#fffbfc] hover:bg-pink-50 transition space-y-1 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#8a2d4f] text-xs">🌸 Règles douloureuses & Endométriose</span>
                  <span className="text-[9px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">Santé globale</span>
                </div>
                <p className="text-[10.5px] text-[#6b4c5b]">
                  Démystification de la souffrance des règles + orientation gynécologique pelvienne.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSelectDoctorPresetTopic(
                    "Nutrition sahélienne fortifiante & Immunité",
                    "Recommander l'apport en antioxydants locaux : feuilles de moringa (en poudre dans la sauce), jus de pain de singe (baobab riche en vitamine C) et graines de sésame pour l'équilibre hormonal.",
                    "Pour prendre soin de ta santé et de ta vitalité au Burkina Faso, nos plantes sont des trésors : une cuillère de moringa dans ton repas et du jus de baobab naturel renforcent tes défenses sans aucun produit chimique nocif.",
                    "D tɩɩsã ne d rɩɩbã yaa arzɛka : arzɛk-tɩɩga (moringa) la toedga n kõt yĩns-laafi wʋsgo.",
                    "An ka siriw ni jiriw bɛ fanga di : arjanayiri (moringa) ni zira ji bɛ muso fanga gɛlɛya kosɛbɛ.",
                    "Quels aliments locaux du pays puis-je consommer pour renforcer mon corps et mes seins ?"
                  )
                }
                className="w-full text-left p-3 rounded-2xl border border-pink-200 bg-[#fffbfc] hover:bg-pink-50 transition space-y-1 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#8a2d4f] text-xs">🌿 Nutrition locale (Moringa & Baobab)</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Prévention</span>
                </div>
                <p className="text-[10.5px] text-[#6b4c5b]">
                  Conseils nutritionnels sahéliens bienveillants intégrés naturellement par Rose IA.
                </p>
              </button>
            </div>

            {/* Saisie personnalisée */}
            <div className="pt-2 border-t border-gray-100">
              <label className="block text-[11px] font-bold text-[#580e36] mb-1">
                Ou définissez un autre thème médical :
              </label>
              <input
                type="text"
                value={doctorTeachTopic}
                onChange={(e) => setDoctorTeachTopic(e.target.value)}
                placeholder="Ex : Palpation axillaire, Allaitement et crevasses..."
                className="w-full rounded-xl border border-gray-300 p-2 text-xs font-semibold text-[#580e36]"
              />
            </div>

            <button
              type="button"
              onClick={() => setDoctorTrainStep(2)}
              className="w-full rounded-2xl bg-amber-500 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-600 transition"
            >
              Passer à la formulation médicale (Étape 2) →
            </button>
          </div>
        )}

        {/* ÉTAPE 2 : Saisie du Protocole Clinique & Reformulation Multilingue */}
        {doctorTrainStep === 2 && (
          <div className="mt-4 space-y-3.5 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#580e36] mb-1">
                Thème clinique sélectionné :
              </label>
              <input
                type="text"
                value={doctorTeachTopic}
                onChange={(e) => setDoctorTeachTopic(e.target.value)}
                className="w-full rounded-xl border border-amber-300 bg-amber-50/50 p-2 text-xs font-bold text-amber-950"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#580e36] mb-1">
                Recommandation clinique stricte du praticien :
              </label>
              <textarea
                rows={3}
                value={doctorTeachContent}
                onChange={(e) => setDoctorTeachContent(e.target.value)}
                placeholder="Consignes médicales précises, bilans recommandés, centres d'orientation..."
                className="w-full rounded-xl border border-gray-300 p-2 text-xs text-[#580e36]"
              />
            </div>

            {/* Vulgarisation empathique multilingue générée pour Rose IA */}
            <div className="rounded-2xl border border-pink-200 bg-[#fff9fb] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#8a2d4f] flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" /> Adaptation Empathique Rose IA
                </span>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  3 Langues
                </span>
              </div>

              <p className="text-[10px] text-[#785968] leading-tight">
                Rose IA convertit le jargon médical en parole douce, sans tabou et respectueuse des pudeurs sahéliennes :
              </p>

              {/* Français */}
              <div className="rounded-xl bg-white p-2.5 border border-pink-100 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-[#ea2d6d]">
                  <span>🇫🇷 En Français facile :</span>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(doctorEmpathicReformulation.fr, "fr")}
                    className="flex items-center gap-1 text-[9.5px] text-[#ea2d6d] hover:underline"
                  >
                    <Volume2 size={12} /> Écouter
                  </button>
                </div>
                <p className="text-[#580e36] leading-relaxed">{doctorEmpathicReformulation.fr}</p>
              </div>

              {/* Mooré */}
              <div className="rounded-xl bg-white p-2.5 border border-pink-100 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-emerald-700">
                  <span>🇧🇫 En Mooré (Traduction bienveillante) :</span>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(doctorEmpathicReformulation.moore, "moore")}
                    className="flex items-center gap-1 text-[9.5px] text-emerald-700 hover:underline"
                  >
                    <Volume2 size={12} /> Écouter
                  </button>
                </div>
                <p className="text-[#334e3e] italic leading-relaxed">{doctorEmpathicReformulation.moore}</p>
              </div>

              {/* Dioula */}
              <div className="rounded-xl bg-white p-2.5 border border-pink-100 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-purple-700">
                  <span>🇧🇫 En Dioula (Traduction bienveillante) :</span>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(doctorEmpathicReformulation.dioula, "dioula")}
                    className="flex items-center gap-1 text-[9.5px] text-purple-700 hover:underline"
                  >
                    <Volume2 size={12} /> Écouter
                  </button>
                </div>
                <p className="text-[#402e48] italic leading-relaxed">{doctorEmpathicReformulation.dioula}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDoctorTrainStep(1)}
                className="rounded-2xl border border-gray-300 px-4 py-2.5 font-bold text-gray-700"
              >
                ← Retour
              </button>
              <button
                type="button"
                onClick={handleRunDoctorTestSimulation}
                className="flex-1 rounded-2xl bg-amber-500 py-2.5 font-bold text-white shadow-md hover:bg-amber-600 transition"
              >
                Lancer la simulation en direct (Étape 3) →
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : Test en Direct Patiente ↔ Rose IA */}
        {doctorTrainStep === 3 && (
          <div className="mt-4 space-y-3.5 text-xs">
            <div className="rounded-2xl bg-slate-900 text-white p-3.5 shadow-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} /> Banc d'essai en direct
                </span>
                <span className="text-[9.5px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono">
                  Mode Simulation
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Vérifions comment Rose IA répond à une question posée spontanément par une femme :
              </p>
            </div>

            {/* Bulle Question de la Patiente */}
            <div className="rounded-2xl bg-purple-50 border border-purple-200 p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-purple-900 flex items-center gap-1">
                  👩 Patiente (Question posée) :
                </span>
                <span className="text-[9px] text-purple-600">Voix ou Texte</span>
              </div>
              <textarea
                rows={2}
                value={doctorTestQuestion}
                onChange={(e) => setDoctorTestQuestion(e.target.value)}
                className="w-full rounded-xl border border-purple-200 bg-white p-2 text-xs font-semibold text-purple-950"
              />
            </div>

            {/* Bouton pour déclencher la réponse */}
            {!doctorTestAnswer && (
              <button
                type="button"
                onClick={() =>
                  setDoctorTestAnswer(
                    doctorEmpathicReformulation.fr ||
                      "Ma sœur, rassure-toi. Suite aux recommandations de nos docteurs référents..."
                  )
                }
                className="w-full rounded-2xl bg-gradient-to-r from-[#ea2d6d] to-[#734059] py-2.5 font-bold text-white shadow hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                <Sparkles size={15} /> Voir la réponse générée par Rose IA
              </button>
            )}

            {/* Bulle Réponse Rose IA */}
            {doctorTestAnswer && (
              <div className="rounded-2xl bg-gradient-to-br from-[#fff7fa] to-[#fff0f4] border-2 border-emerald-300 p-3.5 space-y-2 ph-enter">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#8a2d4f] flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500" /> Rose IA (Réponse avec protocole docteur) :
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(doctorTestAnswer, "fr")}
                    className="flex items-center gap-1 text-[10px] font-bold text-[#ea2d6d] bg-pink-100 px-2 py-0.5 rounded-full hover:bg-pink-200"
                  >
                    <Volume2 size={13} /> Écouter
                  </button>
                </div>

                <p className="text-xs text-[#580e36] leading-relaxed">
                  {doctorTestAnswer}
                </p>

                <div className="flex items-center gap-1.5 text-[9.5px] text-emerald-800 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  <span>Protocole respecté à 100% : Empathie locale + Orientation sans délai.</span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDoctorTrainStep(2)}
                className="rounded-2xl border border-gray-300 px-4 py-2.5 font-bold text-gray-700"
              >
                ← Modifier
              </button>
              <button
                type="button"
                onClick={() => setDoctorTrainStep(4)}
                className="flex-1 rounded-2xl bg-amber-500 py-2.5 font-bold text-white shadow-md hover:bg-amber-600 transition"
              >
                Valider et passer à la signature (Étape 4) →
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : Signature Officielle & Ingestion dans Rose IA */}
        {doctorTrainStep === 4 && (
          <div className="mt-4 space-y-3.5 text-xs">
            <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-3.5 space-y-2">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-200 text-emerald-800 font-bold">
                  <CheckCheck size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 text-xs">Prêt pour signature médicale</h4>
                  <p className="text-[10px] text-emerald-800 font-semibold">
                    Attestation de conformité déontologique & éthique
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-white p-2.5 border border-emerald-200 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Sujet validé :</span>
                  <span className="font-bold text-[#580e36] truncate max-w-[200px]">{doctorTeachTopic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Langues certifiées :</span>
                  <span className="font-bold text-emerald-700">Français · Mooré · Dioula</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date d'effet :</span>
                  <span className="font-bold text-gray-800">Immédiate (16 Octobre 2026)</span>
                </div>
              </div>
            </div>

            {/* Champs de signature du médecin */}
            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-bold text-[#580e36] mb-1">
                  Nom et Prénom du praticien référent :
                </label>
                <input
                  type="text"
                  value={doctorSignName}
                  onChange={(e) => setDoctorSignName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2 text-xs font-bold text-[#580e36]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#580e36] mb-1">
                  Titre clinique & Hôpital d'exercice :
                </label>
                <input
                  type="text"
                  value={doctorSignRole}
                  onChange={(e) => setDoctorSignRole(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2 text-xs font-semibold text-[#580e36]"
                />
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-[10px] text-slate-600 space-y-1">
              <p className="font-bold text-slate-800 flex items-center gap-1">
                <Lock size={12} className="text-slate-500" /> Engagement déontologique :
              </p>
              <p className="leading-tight">
                En signant, vous attestez que ces instructions médicales et leurs vulgarisations ont été vérifiées et ne violent aucun secret médical. Aucune donnée privée de patiente n'est ingérée.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDoctorTrainStep(3)}
                className="rounded-2xl border border-gray-300 px-4 py-2.5 font-bold text-gray-700"
              >
                ← Revoir test
              </button>
              <button
                type="button"
                onClick={handleFinalizeDoctorTraining}
                className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 py-3 text-xs font-bold text-white shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} /> Signer & Intégrer dans Rose IA
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
