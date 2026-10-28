import { Check, Copy, Share2 } from "lucide-react";
import { useUi, useCentres, useOrientations } from "../etat/contextes";
import { BadgeSimulation } from "../composants/BadgeSimulation";
import { Badge, Bandeau, Bouton, Champ, Feuille, ListeDeroulante, ZoneTexte } from "../composants/ui";

const URGENCES = [
  { niveau: "immediate", titre: "Immédiat", sous: "Moins de 24h", ton: "alerte" },
  { niveau: "priority", titre: "Prioritaire", sous: "48h à 72h", ton: "attention" },
  { niveau: "routine", titre: "Routine", sous: "Moins de 15 jours", ton: "info" },
] as const;

/** Orientation d'urgence d'une patiente vers un centre (docteur) : SIMULÉE, rien n'est transmis. */
export function ModaleOrientation() {
  const { notify } = useUi();
  const { centers } = useCentres();
  const { generatedOrientationCode, handleCreatePatientOrientation, orientationForm: f, setGeneratedOrientationCode, setOrientationForm, setShowOrientationModal, showOrientationModal } =
    useOrientations();
  const fermer = () => {
    setShowOrientationModal(false);
    setGeneratedOrientationCode(null);
  };
  const centre = centers.find((c) => c.id === Number(f.targetCenterId))?.shortName || "CMA Schiphra";
  const urgence = URGENCES.find((u) => u.niveau === f.urgencyLevel) ?? URGENCES[0];

  return (
    <Feuille
      ouverte={showOrientationModal}
      onFermer={fermer}
      titre="Orienter une patiente"
      sousTitre="Docteur vers un centre de santé partenaire"
      enTete={<BadgeSimulation detail="Orientation simulée : rien n'est transmis au centre ni à la patiente." />}
      pied={
        generatedOrientationCode ? (
          <Bouton pleineLargeur onClick={fermer}>
            Fermer la fiche
          </Bouton>
        ) : (
          <Bouton type="submit" form="form-orientation" taille="grand" pleineLargeur>
            Émettre l'orientation
          </Bouton>
        )
      }
    >
      {generatedOrientationCode ? (
        <div className="space-y-4">
          <div className="rounded-carte bg-succes-fond p-4 text-center text-succes">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-surface" aria-hidden>
              <Check size={26} />
            </span>
            <p className="mt-2 text-sous-titre">Orientation émise (simulation)</p>
            <p className="mt-3 text-petit">Code d'orientation</p>
            <p className="select-all font-mono text-titre tracking-wider text-prune-900">{generatedOrientationCode}</p>
          </div>
          <dl className="divide-y divide-bordure rounded-carte border border-bordure px-4 py-2 text-corps">
            <div className="flex justify-between gap-3 py-1.5">
              <dt className="text-texte-2">Patiente</dt>
              <dd className="font-semibold text-prune-900">{f.patientName}</dd>
            </div>
            <div className="flex justify-between gap-3 py-1.5">
              <dt className="text-texte-2">Centre désigné</dt>
              <dd className="font-semibold text-prune-900">{centre}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 py-1.5">
              <dt className="text-texte-2">Urgence</dt>
              <dd>
                <Badge ton={urgence.ton}>
                  {urgence.titre} ({urgence.sous})
                </Badge>
              </dd>
            </div>
            <div className="flex justify-between gap-3 py-1.5">
              <dt className="text-texte-2">Examens</dt>
              <dd className="text-right font-semibold text-prune-900">{f.recommendedExam}</dd>
            </div>
          </dl>
          <div className="grid gap-3 min-[400px]:grid-cols-2">
            <Bouton
              variante="secondaire"
              icone={<Share2 size={18} aria-hidden />}
              onClick={() => {
                const msg = `Bonjour Mme ${f.patientName}, voici votre fiche d'orientation urgente PagLaafi vers le ${centre}. Code d'urgence : ${generatedOrientationCode}. Présentez-vous directement au centre sans attente.`;
                window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
              }}
            >
              WhatsApp patiente
            </Bouton>
            <Bouton
              variante="secondaire"
              icone={<Copy size={18} aria-hidden />}
              onClick={() => {
                navigator.clipboard?.writeText(generatedOrientationCode);
                notify(`Code ${generatedOrientationCode} copié !`);
              }}
            >
              Copier le code
            </Bouton>
          </div>
        </div>
      ) : (
        <form id="form-orientation" onSubmit={handleCreatePatientOrientation} className="space-y-4">
          <Bandeau ton="alerte">
            <p className="font-semibold">Priorité médicale absolue</p>
            <p>
              L'orientation médicale permet de court-circuiter les files d'attente habituelles pour faire passer une mammographie ou une échographie en
              urgence dans un centre équipé.
            </p>
          </Bandeau>
          <fieldset>
            <legend className="mb-2 text-petit font-semibold text-prune-900">Degré d'urgence clinique</legend>
            <div role="radiogroup" aria-label="Degré d'urgence clinique" className="grid grid-cols-3 gap-2">
              {URGENCES.map((u) => {
                const actif = f.urgencyLevel === u.niveau;
                return (
                  <button
                    key={u.niveau}
                    type="button"
                    role="radio"
                    aria-checked={actif}
                    onClick={() => setOrientationForm({ ...f, urgencyLevel: u.niveau })}
                    className={`min-h-16 rounded-bouton border-2 px-2 py-2 text-center ${actif ? "border-action bg-rose-100" : "border-bordure bg-surface"}`}
                  >
                    <span className="block text-petit font-semibold text-prune-900">{u.titre}</span>
                    <span className="block text-petit text-texte-2">{u.sous}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
          <ListeDeroulante libelle="Centre de santé de destination" value={f.targetCenterId} onChange={(e) => setOrientationForm({ ...f, targetCenterId: Number(e.target.value) })}>
            {centers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.shortName} — {c.place}
              </option>
            ))}
          </ListeDeroulante>
          <div className="grid gap-4 min-[420px]:grid-cols-2">
            <Champ libelle="Nom de la patiente" required placeholder="Ex : K. Fatoumata" value={f.patientName} onChange={(e) => setOrientationForm({ ...f, patientName: e.target.value })} />
            <Champ libelle="Téléphone" type="tel" required placeholder="Ex : 70 88 99 00" value={f.patientPhone} onChange={(e) => setOrientationForm({ ...f, patientPhone: e.target.value })} />
          </div>
          <ListeDeroulante libelle="Examens prescrits en urgence" value={f.recommendedExam} onChange={(e) => setOrientationForm({ ...f, recommendedExam: e.target.value })}>
            <option value="Mammographie numérique bilatérale + Échographie mammaire">Mammographie numérique bilatérale + Échographie mammaire (Pack complet)</option>
            <option value="Échographie mammaire haute résolution">Échographie mammaire haute résolution isolée</option>
            <option value="Mammographie numérique de dépistage diagnostique">Mammographie numérique de dépistage diagnostique</option>
            <option value="Biopsie mammaire / Cytoponction d'urgence">Biopsie mammaire / Cytoponction d'urgence</option>
          </ListeDeroulante>
          <ZoneTexte
            libelle="Motif clinique et signes d'appel"
            required
            rows={3}
            placeholder="Ex : Masse rétro-aréolaire droite de 2.5 cm, indolore…"
            value={f.clinicalObservations}
            onChange={(e) => setOrientationForm({ ...f, clinicalObservations: e.target.value })}
          />
        </form>
      )}
    </Feuille>
  );
}
