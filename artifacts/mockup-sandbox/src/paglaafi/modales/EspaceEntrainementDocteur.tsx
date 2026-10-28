import { CheckCircle2, Lock, Sparkles, Stethoscope, Volume2 } from "lucide-react";
import { useAudio, useDocteur } from "../etat/contextes";
import { Badge, Bandeau, Bouton, Carte, Champ, Feuille, ZoneTexte } from "../composants/ui";

// Cas présélectionnés (démo) : textes médicaux et traductions inchangés
const PRESETS = [
  {
    titre: "Nodule suspect & Urgences mammaires",
    badge: "Priorité 48h",
    resume: "Accueil direct sans rendez-vous au CMA Schiphra ou CHU Bogodogo + protocole rassurant.",
    args: [
      "Permanence urgences mammaires & Nodule suspect",
      "Pour toute patiente présentant un nodule dur et indolore, accueil sans rendez-vous tous les matins au service d'imagerie. Mammographie et échographie sous 48h.",
      "Ma sœur, rassure-toi : un nodule n'est pas forcément grave, mais ton corps mérite toute notre attention. Viens directement sans rendez-vous au CMA Schiphra ou CHU Bogodogo dès demain matin à 08h. Une sage-femme et un radiologue vont t'examiner avec douceur.",
      "M maaso, da zoe rabeem ye: bõn-kʋdga pa bãag fãa ye, la yaa tɩlae tɩ d ges-a tao-tao. Wa-y zĩigẽ zaabre n mik dɔgɔtɔrã tɩ b ges yãmba ne laafi.",
      "N ma muso, kana siran : fɛn o fɛn bɛ sin na, a bɛɛ tɛ bana juguman ye. Nka taga kɛnɛyaso la jona sɔgɔma fɛ walasa dɔgɔtɔrɔmuso ka lajɛ saniya kɛ.",
      "J'ai senti une boule un peu dure dans mon sein droit qui ne me fait pas mal, est-ce que je dois m'inquiéter ?",
    ],
  },
  {
    titre: "Règles douloureuses & Endométriose",
    badge: "Santé globale",
    resume: "Démystification de la souffrance des règles + orientation gynécologique pelvienne.",
    args: [
      "Douleurs de règles aiguës & Endométriose",
      "Des règles très douloureuses incapacitantes ne sont pas normales. Exclure l'endométriose par échographie pelvienne dédiée. Éviter l'automédication prolongée aux anti-inflammatoires.",
      "Chère sœur, souffrir pendant ses règles n'est pas une fatalité. Si la douleur t'empêche de travailler ou dormir, ce n'est pas une faiblesse. Consulte un gynécologue pour rechercher une endométriose. En attendant, privilégie une bouillotte tiède et l'infusion de gingembre doux.",
      "M yaanga, rog-n-mik bãag sã n namsd foo wakat fãa, pa yel-bãanega ye. Taga dɔgɔtɔr n bãng a võore.",
      "N ba den muso, dimi min bɛ kɛ muso kɔnɔ fɛ kalo o kalo, ni a ka bon kosɛbɛ, a tɛ foyi ye fo ka dɔgɔtɔrɔ sɔrɔ.",
      "Mes règles me font tellement mal que je ne peux pas me lever du lit, ma mère me dit que c'est normal pour une femme ?",
    ],
  },
  {
    titre: "Nutrition locale (Moringa & Baobab)",
    badge: "Prévention",
    resume: "Conseils nutritionnels sahéliens bienveillants intégrés naturellement par Rose IA.",
    args: [
      "Nutrition sahélienne fortifiante & Immunité",
      "Recommander l'apport en antioxydants locaux : feuilles de moringa (en poudre dans la sauce), jus de pain de singe (baobab riche en vitamine C) et graines de sésame pour l'équilibre hormonal.",
      "Pour prendre soin de ta santé et de ta vitalité au Burkina Faso, nos plantes sont des trésors : une cuillère de moringa dans ton repas et du jus de baobab naturel renforcent tes défenses sans aucun produit chimique nocif.",
      "D tɩɩsã ne d rɩɩbã yaa arzɛka : arzɛk-tɩɩga (moringa) la toedga n kõt yĩns-laafi wʋsgo.",
      "An ka siriw ni jiriw bɛ fanga di : arjanayiri (moringa) ni zira ji bɛ muso fanga gɛlɛya kosɛbɛ.",
      "Quels aliments locaux du pays puis-je consommer pour renforcer mon corps et mes seins ?",
    ],
  },
] as const;
const ETAPES = ["Thème", "Protocole", "Simulation", "Signature"];

/** Parcours docteur d'« entraînement » de Rose IA en 4 étapes (mode démo, simulation). */
export function EspaceEntrainementDocteur() {
  const { handlePlayAudio } = useAudio();
  const {
    doctorEmpathicReformulation: r,
    doctorSignName,
    doctorSignRole,
    doctorTeachContent,
    doctorTeachTopic,
    doctorTestAnswer,
    doctorTestQuestion,
    doctorTrainStep: etape,
    handleFinalizeDoctorTraining,
    handleRunDoctorTestSimulation,
    handleSelectDoctorPresetTopic,
    setDoctorSignName,
    setDoctorSignRole,
    setDoctorTeachContent,
    setDoctorTeachTopic,
    setDoctorTestAnswer,
    setDoctorTestQuestion,
    setDoctorTrainStep,
    setShowDoctorTrainModal,
    showDoctorTrainModal,
  } = useDocteur();

  const reformulation = (libelle: string, texte: string, langue: "fr" | "moore" | "dioula") => (
    <div className="rounded-bouton border border-bordure bg-surface p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-petit font-semibold text-prune-900">{libelle}</span>
        <Bouton variante="discret" onClick={() => handlePlayAudio(texte, langue)}>
          <Volume2 size={18} aria-hidden /> Écouter
        </Bouton>
      </div>
      <p className="text-corps text-texte">{texte}</p>
    </div>
  );

  return (
    <Feuille
      ouverte={showDoctorTrainModal}
      onFermer={() => setShowDoctorTrainModal(false)}
      large
      titre="Entraîner Rose IA"
      sousTitre={`Parcours soignant · étape ${etape} sur 4`}
    >
      <div className="space-y-4">
        <ol className="grid grid-cols-4 gap-2" aria-label={`Étape ${etape} sur 4 : ${ETAPES[etape - 1]}`}>
          {ETAPES.map((l, i) => (
            <li key={l} className="space-y-1">
              <span className={`block h-1.5 rounded-full ${i + 1 <= etape ? "bg-action" : "bg-rose-200"}`} aria-hidden />
              <span className={`block text-center text-nav ${i + 1 === etape ? "font-bold text-prune-900" : "text-texte-2"}`}>{l}</span>
            </li>
          ))}
        </ol>

        {etape === 1 && (
          <div className="space-y-4">
            <Bandeau ton="info">
              <p className="flex items-center gap-1.5 font-semibold">
                <Stethoscope size={18} aria-hidden /> Objectif de la simulation
              </p>
              <p>
                En tant que docteur, sage-femme ou agent de santé, vous enrichissez la base de connaissances de Rose IA avec vos protocoles cliniques
                locaux. Choisissez un cas concret :
              </p>
            </Bandeau>
            <ul className="space-y-2">
              {PRESETS.map((p) => (
                <li key={p.titre}>
                  <button
                    type="button"
                    onClick={() => handleSelectDoctorPresetTopic(p.args[0], p.args[1], p.args[2], p.args[3], p.args[4], p.args[5])}
                    className={`w-full space-y-1 rounded-carte border p-4 text-left ${doctorTeachTopic === p.args[0] ? "border-action bg-rose-100" : "border-bordure bg-surface"}`}
                  >
                    <span className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-corps font-semibold text-prune-900">{p.titre}</span>
                      <Badge>{p.badge}</Badge>
                    </span>
                    <span className="block text-petit text-texte-2">{p.resume}</span>
                  </button>
                </li>
              ))}
            </ul>
            <Champ libelle="Ou définissez un autre thème médical" value={doctorTeachTopic} onChange={(e) => setDoctorTeachTopic(e.target.value)} placeholder="Ex : Palpation axillaire, Allaitement et crevasses…" />
            <Bouton pleineLargeur onClick={() => setDoctorTrainStep(2)}>
              Passer à la formulation médicale (Étape 2)
            </Bouton>
          </div>
        )}

        {etape === 2 && (
          <div className="space-y-4">
            <Champ libelle="Thème clinique sélectionné" value={doctorTeachTopic} onChange={(e) => setDoctorTeachTopic(e.target.value)} />
            <ZoneTexte
              libelle="Recommandation clinique stricte du praticien"
              rows={4}
              value={doctorTeachContent}
              onChange={(e) => setDoctorTeachContent(e.target.value)}
              placeholder="Consignes médicales précises, bilans recommandés, centres d'orientation…"
            />
            <Carte douce className="space-y-3">
              <p className="flex items-center gap-1.5 text-corps font-semibold text-prune-900">
                <Sparkles size={18} aria-hidden /> Adaptation empathique Rose IA
              </p>
              <p className="text-petit text-texte-2">Rose IA convertit le jargon médical en parole douce, sans tabou et respectueuse des pudeurs sahéliennes :</p>
              {reformulation("En français facile", r.fr, "fr")}
              {reformulation("En mooré", r.moore, "moore")}
              {reformulation("En dioula", r.dioula, "dioula")}
            </Carte>
            <div className="flex gap-3">
              <Bouton variante="secondaire" onClick={() => setDoctorTrainStep(1)}>
                Retour
              </Bouton>
              <Bouton className="flex-1" onClick={handleRunDoctorTestSimulation}>
                Lancer la simulation en direct (Étape 3)
              </Bouton>
            </div>
          </div>
        )}

        {etape === 3 && (
          <div className="space-y-4">
            <Bandeau ton="info">Vérifions comment Rose IA répond à une question posée spontanément par une femme (simulation).</Bandeau>
            <ZoneTexte libelle="Question de la patiente" rows={3} value={doctorTestQuestion} onChange={(e) => setDoctorTestQuestion(e.target.value)} />
            {!doctorTestAnswer ? (
              <Bouton pleineLargeur icone={<Sparkles size={18} aria-hidden />} onClick={() => setDoctorTestAnswer(r.fr || "Ma sœur, rassure-toi. Suite aux recommandations de nos docteurs référents...")}>
                Voir la réponse générée par Rose IA
              </Bouton>
            ) : (
              <Carte className="anim-apparition space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-corps font-semibold text-prune-900">Réponse de Rose IA (protocole docteur)</span>
                  <Bouton variante="discret" onClick={() => handlePlayAudio(doctorTestAnswer, "fr")}>
                    <Volume2 size={18} aria-hidden /> Écouter
                  </Bouton>
                </div>
                <p className="text-corps text-texte">{doctorTestAnswer}</p>
                <p className="flex items-center gap-2 text-petit font-semibold text-succes">
                  <CheckCircle2 size={18} aria-hidden /> Protocole respecté à 100% : Empathie locale + Orientation sans délai.
                </p>
              </Carte>
            )}
            <div className="flex gap-3">
              <Bouton variante="secondaire" onClick={() => setDoctorTrainStep(2)}>
                Modifier
              </Bouton>
              <Bouton className="flex-1" onClick={() => setDoctorTrainStep(4)}>
                Valider et passer à la signature (Étape 4)
              </Bouton>
            </div>
          </div>
        )}

        {etape === 4 && (
          <div className="space-y-4">
            <dl className="divide-y divide-bordure rounded-carte border border-bordure px-4 py-2 text-corps">
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-texte-2">Sujet validé</dt>
                <dd className="text-right font-semibold text-prune-900">{doctorTeachTopic}</dd>
              </div>
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-texte-2">Langues</dt>
                <dd className="font-semibold text-prune-900">Français · Mooré · Dioula</dd>
              </div>
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-texte-2">Date d'effet</dt>
                <dd className="font-semibold text-prune-900">Immédiate (16 Octobre 2026)</dd>
              </div>
            </dl>
            <Champ libelle="Nom et prénom du praticien référent" value={doctorSignName} onChange={(e) => setDoctorSignName(e.target.value)} />
            <Champ libelle="Titre clinique et hôpital d'exercice" value={doctorSignRole} onChange={(e) => setDoctorSignRole(e.target.value)} />
            <Bandeau ton="info">
              <p className="flex items-center gap-1.5 font-semibold">
                <Lock size={16} aria-hidden /> Engagement déontologique
              </p>
              <p>
                En signant, vous attestez que ces instructions médicales et leurs vulgarisations ont été vérifiées et ne violent aucun secret médical. Aucune
                donnée privée de patiente n'est ingérée.
              </p>
            </Bandeau>
            <div className="flex gap-3">
              <Bouton variante="secondaire" onClick={() => setDoctorTrainStep(3)}>
                Revoir le test
              </Bouton>
              <Bouton className="flex-1" icone={<CheckCircle2 size={18} aria-hidden />} onClick={handleFinalizeDoctorTraining}>
                Signer et intégrer dans Rose IA
              </Bouton>
            </div>
          </div>
        )}
      </div>
    </Feuille>
  );
}
