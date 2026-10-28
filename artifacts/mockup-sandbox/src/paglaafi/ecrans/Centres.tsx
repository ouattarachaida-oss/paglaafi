import { Check, Clock, Edit3, FileText } from "lucide-react";
import { useAuth, useCentres, useOrientations } from "../etat/contextes";
import { BadgeSimulation } from "../composants/BadgeSimulation";
import { PresDeMoi } from "./PresDeMoi";
import { sansEmoji } from "../lib/texte";
import { Badge, Bouton, Carte } from "../composants/ui";

/** Espace des centres et docteurs : orientations d'urgence (simulées) et mise à jour du centre. */
export function EspaceProCentres() {
  const { currentUser } = useAuth();
  const { ouvrirMiseAJourCentre } = useCentres();
  const { handleValidateOrientationByCenter, setShowOrientationModal, urgentOrientations } = useOrientations();
  const pro = currentUser?.role === "admin" && (currentUser.adminType === "center" || currentUser.adminType === "doctor");
  if (!pro) return null;
  return (
    <Carte className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-sous-titre text-prune-900">
          {currentUser?.adminType === "center" ? "Orientations d'urgence reçues" : "Vos orientations en cours"}
        </h2>
        <BadgeSimulation detail="Orientations fictives : aucune donnée de patiente réelle." />
        <Badge ton="alerte">{urgentOrientations.length} active(s)</Badge>
      </div>
      <ul className="space-y-3">
        {urgentOrientations.map((o) => (
          <li key={o.id} className="space-y-2 rounded-bouton border border-bordure p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-corps font-semibold text-prune-900">
                {o.patientName} ({o.patientAge} ans)
              </span>
              <Badge ton={o.urgencyLevel === "immediate" ? "alerte" : "attention"}>{sansEmoji(o.urgencyLabel)}</Badge>
            </div>
            <p className="text-petit text-texte-2">
              Réf. {o.id} · Prescrit par {o.doctorName} · {o.createdAt}
            </p>
            <p className="rounded-bouton bg-surface-2 px-3 py-2 text-petit text-texte">
              <strong>Examens prescrits :</strong> {o.recommendedExam}
              <br />
              <em>« {o.clinicalObservations} »</em>
            </p>
            {o.status === "accepted_urgent" ? (
              <p className="flex items-center gap-2 text-petit font-semibold text-succes">
                <Check size={18} aria-hidden /> Validé : patiente attendue d'urgence ({o.centerEstimatedDelay})
              </p>
            ) : o.status === "scheduled_wait" ? (
              <p className="flex items-center gap-2 text-petit font-semibold text-attention">
                <Clock size={18} aria-hidden /> {o.centerValidationMessage}
              </p>
            ) : currentUser?.adminType === "center" ? (
              <div className="flex flex-col gap-2 min-[420px]:flex-row">
                <Bouton taille="petit" className="flex-1" onClick={() => handleValidateOrientationByCenter(o.id, "immediate")}>
                  Envoyez-la vite (attente &lt; 15 min)
                </Bouton>
                <Bouton variante="secondaire" taille="petit" className="flex-1" onClick={() => handleValidateOrientationByCenter(o.id, "scheduled", "~45 min")}>
                  Affluence (créneau 45 min)
                </Bouton>
              </div>
            ) : (
              <p className="text-petit text-info">En attente de confirmation par {o.targetCenterName}</p>
            )}
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-2">
        {currentUser?.adminType === "doctor" && (
          <Bouton variante="secondaire" icone={<FileText size={18} aria-hidden />} onClick={() => setShowOrientationModal(true)}>
            Orienter une nouvelle patiente
          </Bouton>
        )}
        <Bouton icone={<Edit3 size={18} aria-hidden />} onClick={() => void ouvrirMiseAJourCentre()}>
          Mettre à jour mon centre
        </Bouton>
      </div>
    </Carte>
  );
}

/** Onglet Centres : carte toujours visible et liste des centres proches. */
export function Centres() {
  return <PresDeMoi />;
}
