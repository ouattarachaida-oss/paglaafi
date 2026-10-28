import { Plus, Trash2 } from "lucide-react";
import { useCentres } from "../etat/contextes";
import type { CenterStatus, HealthCenter } from "../types";
import { Bouton, Champ, Feuille, Interrupteur, STATUTS_CENTRE, ZoneTexte } from "../composants/ui";

// Statuts proposés à l'admin du centre (libellé affiché sur la carte)
const CHOIX: { statut: CenterStatus; sous: string; libelle: string }[] = [
  { statut: "available", sous: "Attente fluide", libelle: "Disponible · Attente fluide" },
  { statut: "busy", sous: "Prévoir une attente", libelle: "Forte affluence · Prévoir attente" },
  { statut: "maintenance", sous: "Appareil arrêté", libelle: "Maintenance technique · Arrêt temporaire" },
  { statut: "closed", sous: "Fermé aujourd'hui", libelle: "Fermé aujourd'hui" },
];

/**
 * Mise à jour du centre (admin centre / docteur) : statut du jour en 4 grandes cartes,
 * mammographe, agents, file et attente, examens et tarifs, consigne du jour en français.
 */
export function ModaleMiseAJourCentre() {
  const { centerUpdateData: c, handleSaveCenterUpdate, setCenterUpdateData, setShowCenterUpdateModal, showCenterUpdateModal } = useCentres();
  if (!c) return null;
  const maj = (champs: Partial<HealthCenter>) => setCenterUpdateData({ ...c, ...champs });
  // Les centres importés d'OpenStreetMap gardent leur mention « à vérifier »
  const osm = c.statusLabel.startsWith("Données OpenStreetMap");
  const majExamen = (i: number, champs: Partial<HealthCenter["exams"][number]>) =>
    maj({ exams: c.exams.map((e, k) => (k === i ? { ...e, ...champs } : e)) });

  return (
    <Feuille
      ouverte={showCenterUpdateModal}
      onFermer={() => setShowCenterUpdateModal(false)}
      large
      titre="Mettre à jour mon centre"
      sousTitre={`${c.name} · dernière mise à jour : ${c.lastUpdate}`}
      pied={
        <Bouton type="submit" form="form-maj-centre" taille="grand" pleineLargeur>
          Publier la mise à jour
        </Bouton>
      }
    >
      <form id="form-maj-centre" onSubmit={handleSaveCenterUpdate} className="space-y-5">
        <fieldset>
          <legend className="mb-2 text-petit font-semibold text-prune-900">Statut du jour</legend>
          <div role="radiogroup" aria-label="Statut du jour" className="grid grid-cols-2 gap-3">
            {CHOIX.map((ch) => {
              const s = STATUTS_CENTRE[ch.statut];
              const actif = c.status === ch.statut;
              return (
                <button
                  key={ch.statut}
                  type="button"
                  role="radio"
                  aria-checked={actif}
                  onClick={() => maj({ status: ch.statut, ...(osm ? {} : { statusLabel: ch.libelle }) })}
                  className={`flex min-h-[88px] flex-col items-start gap-1 rounded-carte border-2 p-3 text-left ${actif ? "border-action bg-rose-100" : "border-bordure bg-surface"}`}
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full text-white" style={{ background: s.couleur }} aria-hidden>
                    {s.icone}
                  </span>
                  <span className="text-corps font-semibold text-prune-900">{s.libelle}</span>
                  <span className="text-petit text-texte-2">{ch.sous}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="space-y-3 rounded-carte border border-bordure p-3">
          <Interrupteur
            libelle="Mammographe en service"
            description={c.isApparatusWorking ? "L'appareil fonctionne" : "Appareil en panne ou en calibration"}
            actif={c.isApparatusWorking}
            onChange={(v) => maj({ isApparatusWorking: v })}
          />
          <Champ libelle="Appareil" value={c.apparatus} onChange={(e) => maj({ apparatus: e.target.value })} />
        </div>

        <div className="grid gap-4 min-[420px]:grid-cols-2">
          <Champ libelle="Agents présents" type="number" min={0} inputMode="numeric" value={c.agentsPresent} onChange={(e) => maj({ agentsPresent: Math.max(0, Number(e.target.value) || 0) })} />
          <Champ libelle="Patientes dans la file" type="number" min={0} inputMode="numeric" value={c.queueCount} onChange={(e) => maj({ queueCount: Math.max(0, Number(e.target.value) || 0) })} />
        </div>
        <Champ libelle="Attente estimée" placeholder="Ex : 15 à 20 min" value={c.estimatedWait} onChange={(e) => maj({ estimatedWait: e.target.value })} />
        <Champ libelle="Équipe présente aujourd'hui" placeholder="Ex : 2 sages-femmes, 1 radiologue" value={c.staffDescription} onChange={(e) => maj({ staffDescription: e.target.value })} />

        <fieldset className="space-y-3">
          <legend className="text-petit font-semibold text-prune-900">Examens et tarifs</legend>
          {c.exams.map((e, i) => (
            <div key={i} className="space-y-2 rounded-carte border border-bordure p-3">
              <div className="flex items-end gap-2">
                <div className="min-w-0 flex-1">
                  <Champ libelle={`Examen ${i + 1}`} value={e.name} onChange={(ev) => majExamen(i, { name: ev.target.value })} />
                </div>
                <button
                  type="button"
                  aria-label={`Supprimer l'examen ${e.name || i + 1}`}
                  onClick={() => maj({ exams: c.exams.filter((_, k) => k !== i) })}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-bouton text-alerte active:bg-alerte-fond"
                >
                  <Trash2 size={20} aria-hidden />
                </button>
              </div>
              <div className="grid items-end gap-3 min-[420px]:grid-cols-2">
                <Champ
                  libelle="Tarif (FCFA)"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  disabled={e.free}
                  value={e.free ? 0 : e.price}
                  onChange={(ev) => majExamen(i, { price: Math.max(0, Number(ev.target.value) || 0) })}
                />
                <Interrupteur libelle="Gratuit" actif={e.free} onChange={(v) => majExamen(i, { free: v, price: v ? 0 : e.price })} />
              </div>
            </div>
          ))}
          <Bouton variante="secondaire" taille="petit" icone={<Plus size={18} aria-hidden />} onClick={() => maj({ exams: [...c.exams, { name: "", price: 0, free: false }] })}>
            Ajouter un examen
          </Bouton>
        </fieldset>

        <ZoneTexte libelle="Consigne du jour aux patientes" rows={3} value={c.audioMessageFr} onChange={(e) => maj({ audioMessageFr: e.target.value })} />
      </form>
    </Feuille>
  );
}
