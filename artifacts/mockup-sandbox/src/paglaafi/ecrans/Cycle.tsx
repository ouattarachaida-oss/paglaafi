import { useMemo, useState } from "react";
import { Bell, CalendarClock, Check, ChevronLeft, ChevronRight, Clock, Hand, Plus, RotateCcw, Sparkles } from "lucide-react";
import { useUi, useSante } from "../etat/contextes";
import { Bandeau, Bouton, Carte, Champ, EnTeteSection, EtatVide, Interrupteur, ListeDeroulante } from "../composants/ui";
import type { Rappel } from "../depot/rappels";

/** « 2026-10-28 » pour une date locale (sans décalage de fuseau). */
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const depuisIso = (s: string) => {
  const [a, m, j] = s.split("-").map((x) => parseInt(x, 10));
  return new Date(a, (m || 1) - 1, j || 1);
};
const decaler = (d: Date, jours: number) => {
  const n = new Date(d);
  n.setDate(n.getDate() + jours);
  return n;
};
const JOURS = ["L", "M", "M", "J", "V", "S", "D"];
const NOMS_JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

/**
 * Calendrier mensuel : premier jour des règles noté (case pleine), fenêtre
 * d'autopalpation J+7 à J+11 (pointillés) et début prévu des prochaines règles
 * (bordure prune). Aucune durée de règles n'est supposée. Légende textuelle.
 */
function CalendrierCycle({ debutRegles, dureeCycle }: { debutRegles: string; dureeCycle: number }) {
  const debut = depuisIso(debutRegles);
  const [mois, setMois] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });
  const fenetre = new Set(Array.from({ length: 5 }, (_, i) => iso(decaler(debut, 7 + i))));
  const prevision = iso(decaler(debut, dureeCycle));
  const aujourdhui = iso(new Date());

  const cases = useMemo(() => {
    const premier = (mois.getDay() + 6) % 7; // lundi = 0
    const nb = new Date(mois.getFullYear(), mois.getMonth() + 1, 0).getDate();
    return [...Array(premier).fill(null), ...Array.from({ length: nb }, (_, i) => new Date(mois.getFullYear(), mois.getMonth(), i + 1))];
  }, [mois]);

  const titreMois = mois.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  return (
    <Carte>
      <div className="flex items-center justify-between">
        <h2 className="text-sous-titre capitalize text-prune-900">{titreMois}</h2>
        <div className="flex">
          <button type="button" aria-label="Mois précédent" onClick={() => setMois(new Date(mois.getFullYear(), mois.getMonth() - 1, 1))} className="grid h-11 w-11 place-items-center rounded-full text-texte-2 active:bg-rose-200">
            <ChevronLeft size={22} aria-hidden />
          </button>
          <button type="button" aria-label="Mois suivant" onClick={() => setMois(new Date(mois.getFullYear(), mois.getMonth() + 1, 1))} className="grid h-11 w-11 place-items-center rounded-full text-texte-2 active:bg-rose-200">
            <ChevronRight size={22} aria-hidden />
          </button>
        </div>
      </div>

      <div role="grid" aria-label={`Calendrier du cycle, ${titreMois}`} className="mt-2 grid grid-cols-7 gap-1 text-center">
        {JOURS.map((j, i) => (
          <span key={i} role="columnheader" aria-label={NOMS_JOURS[i]} className="py-1 text-badge text-texte-2">
            {j}
          </span>
        ))}
        {cases.map((d, i) => {
          if (!d) return <span key={`v${i}`} aria-hidden />;
          const k = iso(d);
          const regles = k === debutRegles;
          const autop = fenetre.has(k);
          const prev = k === prevision;
          const etats = [regles && "début des règles noté", autop && "fenêtre d'autopalpation", prev && "prochaines règles prévues", k === aujourdhui && "aujourd'hui"].filter(Boolean);
          return (
            <span
              key={k}
              role="gridcell"
              aria-label={`${d.getDate()}${etats.length ? ` : ${etats.join(", ")}` : ""}`}
              className={`grid aspect-square min-h-10 place-items-center rounded-full text-petit ${
                regles
                  ? "bg-action font-bold text-sur-action"
                  : autop
                    ? "bordure-pointillee bg-rose-100 font-semibold text-prune-900"
                    : prev
                      ? "border-2 border-prune-900 font-semibold text-prune-900"
                      : "text-texte"
              } ${k === aujourdhui && !regles ? "underline decoration-2 underline-offset-4" : ""}`}
            >
              {d.getDate()}
            </span>
          );
        })}
      </div>

      <ul className="mt-4 grid gap-2 text-petit text-texte min-[420px]:grid-cols-2" aria-label="Légende">
        <li className="flex items-center gap-2">
          <span className="h-5 w-5 shrink-0 rounded-full bg-action" aria-hidden /> Début des règles noté (case pleine)
        </li>
        <li className="flex items-center gap-2">
          <span className="bordure-pointillee h-5 w-5 shrink-0 rounded-full bg-rose-100" aria-hidden /> Fenêtre d'autopalpation (pointillés)
        </li>
        <li className="flex items-center gap-2">
          <span className="h-5 w-5 shrink-0 rounded-full border-2 border-prune-900" aria-hidden /> Prochaines règles prévues (contour)
        </li>
        <li className="flex items-center gap-2">
          <span className="w-5 text-center font-semibold underline decoration-2 underline-offset-4" aria-hidden>
            1
          </span>
          Aujourd'hui (souligné)
        </li>
      </ul>
    </Carte>
  );
}

/** Cycle & Autopalpation : calendrier, prévisions, recalibrage, autopalpation, historique et rappels. */
export function Cycle() {
  const { notify } = useUi();
  const {
    cycleHistory,
    cycleInfo,
    cycleLengthDays,
    handleRecalibratePeriod,
    lastAutopalpationDate,
    lastPeriodDate,
    newReminderDate,
    newReminderTitle,
    newReminderType,
    realPeriodDateInput,
    recalibrationFeedback,
    reminders,
    setAutopalpationDoneThisMonth,
    setLastAutopalpationDate,
    setNewReminderDate,
    setNewReminderTitle,
    setNewReminderType,
    setRealPeriodDateInput,
    ajouterRappel,
    basculerRappel,
    setShowCycleHistory,
    setShowNewReminderForm,
    setShowRecalibrateBox,
    showCycleHistory,
    showNewReminderForm,
    showRecalibrateBox,
  } = useSante();

  const ecart = Math.round((depuisIso(realPeriodDateInput).getTime() - depuisIso(lastPeriodDate).getTime()) / 86400000);
  const jours = cycleInfo.daysUntilNextPeriod;

  return (
    <section className="anim-apparition">
      <h1 className="text-display text-prune-900">Cycle & Autopalpation</h1>
      <p className="mt-1 text-corps text-texte-2">Vos règles, le bon moment pour observer vos seins et vos rappels.</p>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <CalendrierCycle debutRegles={lastPeriodDate} dureeCycle={cycleLengthDays} />

          <div className="grid grid-cols-2 gap-3">
            <Carte>
              <p className="text-petit text-texte-2">Prochaines règles</p>
              <p className="mt-1 text-sous-titre text-prune-900">{cycleInfo.nextPeriodStr}</p>
              <p className="mt-1 flex items-center gap-1 text-petit text-texte-2">
                {jours > 0 ? (
                  <>
                    <Clock size={16} aria-hidden /> Dans {jours} j
                  </>
                ) : jours === 0 ? (
                  "Prévues aujourd'hui"
                ) : (
                  <>
                    <RotateCcw size={16} aria-hidden /> Décalage de {Math.abs(jours)} j
                  </>
                )}
              </p>
            </Carte>
            <Carte>
              <p className="text-petit text-texte-2">Autopalpation</p>
              <p className="mt-1 text-sous-titre text-prune-900">{cycleInfo.autopalpWindowStr}</p>
              <p className="mt-1 text-petit text-texte-2">{cycleInfo.isOptimalWindow ? "C'est le bon moment" : `Cycle de ${cycleLengthDays} jours`}</p>
            </Carte>
          </div>

          {recalibrationFeedback && (
            <Bandeau ton={recalibrationFeedback.type === "success" ? "succes" : recalibrationFeedback.type === "warning" ? "horsLigne" : "info"} role="status">
              <p className="font-semibold">Ajustement automatique du cycle</p>
              <p>{recalibrationFeedback.text}</p>
            </Bandeau>
          )}

          {/* Recalibrage */}
          <Carte>
            <h2 className="text-sous-titre text-prune-900">Vos règles sont là ?</h2>
            <p className="mt-1 text-petit text-texte-2">Enregistrez la date réelle pour recalibrer la prédiction si elle n'est pas exacte.</p>
            <div className="mt-3 grid gap-2 min-[420px]:grid-cols-2">
              <Bouton icone={<Check size={20} aria-hidden />} onClick={() => handleRecalibratePeriod(iso(new Date()))}>
                Règles débutées aujourd'hui
              </Bouton>
              <Bouton variante="secondaire" icone={<RotateCcw size={18} aria-hidden />} aria-expanded={showRecalibrateBox} onClick={() => setShowRecalibrateBox(!showRecalibrateBox)}>
                {showRecalibrateBox ? "Masquer" : "Autre date"}
              </Bouton>
            </div>
            {showRecalibrateBox && (
              <div className="mt-4 space-y-3 border-t border-bordure pt-4">
                <div className="flex flex-wrap gap-2" role="group" aria-label="Raccourcis de date">
                  {[
                    ["Aujourd'hui", 0],
                    ["Hier", 1],
                    ["Avant-hier", 2],
                  ].map(([libelle, n]) => {
                    const v = iso(decaler(new Date(), -(n as number)));
                    return (
                      <button
                        key={libelle}
                        type="button"
                        aria-pressed={realPeriodDateInput === v}
                        onClick={() => setRealPeriodDateInput(v)}
                        className={`min-h-11 rounded-full px-4 text-petit font-semibold ${realPeriodDateInput === v ? "bg-carte-prune text-white" : "border border-bordure text-texte"}`}
                      >
                        {libelle}
                      </button>
                    );
                  })}
                </div>
                <Champ libelle="Date précise du premier jour" type="date" value={realPeriodDateInput} onChange={(e) => setRealPeriodDateInput(e.target.value)} />
                <p className="flex justify-between rounded-bouton bg-surface-2 px-3 py-2 text-petit text-texte">
                  <span>Écart depuis le cycle précédent</span>
                  <strong className="text-prune-900">{ecart > 0 ? `${ecart} jours` : "Date invalide"}</strong>
                </p>
                <Bouton pleineLargeur onClick={() => handleRecalibratePeriod(realPeriodDateInput)}>
                  Enregistrer et recalibrer
                </Bouton>
              </div>
            )}

            <div className="mt-4 border-t border-bordure pt-2">
              <Bouton variante="discret" aria-expanded={showCycleHistory} onClick={() => setShowCycleHistory(!showCycleHistory)}>
                {showCycleHistory ? "Masquer l'historique" : "Voir l'historique"} ({cycleHistory.length})
              </Bouton>
              {showCycleHistory && (
                <ul className="mt-2 space-y-2">
                  {cycleHistory.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3 rounded-bouton bg-surface-2 px-3 py-2">
                      <span className="min-w-0">
                        <span className="block text-petit font-semibold text-prune-900">Cycle du {item.date}</span>
                        <span className="block text-petit text-texte-2">{item.note}</span>
                      </span>
                      <span className="shrink-0 text-petit font-semibold text-texte">{item.duration} jours</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Carte>
        </div>

        <div className="space-y-4">
          {/* Autopalpation du mois */}
          <div className="rounded-carte bg-carte-prune p-5 text-white shadow-carte">
            <p className="flex items-center gap-2 text-petit font-semibold text-white/85">
              <Hand size={18} aria-hidden /> Autopalpation du mois
            </p>
            <p className="mt-2 text-petit text-white/85">Dernière autopalpation notée</p>
            <p className="text-sous-titre text-white">{lastAutopalpationDate}</p>
            <button
              type="button"
              onClick={() => {
                setAutopalpationDoneThisMonth(true);
                setLastAutopalpationDate(new Date().toLocaleDateString("fr-FR"));
                notify("Bravo ! Autopalpation enregistrée pour ce mois-ci.");
              }}
              className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-bouton bg-white px-4 text-center text-corps font-semibold text-[#580e36] active:bg-[#faeff2]"
            >
              <Check size={20} aria-hidden /> J'ai réalisé mon autopalpation ce mois-ci ({lastAutopalpationDate})
            </button>
          </div>

          {/* Recommandation (texte médical inchangé) */}
          <Carte>
            <p className="flex items-center gap-2 text-petit font-semibold text-succes">
              <Sparkles size={18} aria-hidden /> Recommandation médicale
            </p>
            <h2 className="mt-1 text-sous-titre text-prune-900">Fenêtre d'autopalpation : {cycleInfo.autopalpWindowStr}</h2>
            <p className="mt-2 text-corps text-texte">
              Le meilleur moment pour observer vos seins est <strong>2 à 5 jours après la fin des règles</strong>, quand les tissus mammaires sont
              souples et non douloureux.
            </p>
            <ol className="mt-3 space-y-2 text-corps text-texte">
              <li className="rounded-bouton bg-surface-2 px-3 py-2">
                <b>1. Devant le miroir :</b> Observez bras le long du corps, puis levés (recherchez une fossette ou un pli).
              </li>
              <li className="rounded-bouton bg-surface-2 px-3 py-2">
                <b>2. Palpation circulaire :</b> Avec la pulpe des 3 doigts, faites des petits cercles fermes de l'extérieur vers le centre.
              </li>
              <li className="rounded-bouton bg-surface-2 px-3 py-2">
                <b>3. Sous l'aisselle :</b> Vérifiez le creux du bras pour vous assurer de l'absence de nodule ou ganglion dur.
              </li>
              <li className="rounded-bouton bg-surface-2 px-3 py-2">
                <b>4. Pression douce :</b> Pincez légèrement le mamelon pour vérifier l'absence d'écoulement anormal.
              </li>
            </ol>
          </Carte>

          {/* Rappels */}
          <section aria-labelledby="titre-rappels">
            <EnTeteSection
              id="titre-rappels"
              titre="Mes rappels de santé"
              action={
                <Bouton variante="secondaire" taille="petit" icone={<Plus size={18} aria-hidden />} aria-expanded={showNewReminderForm} onClick={() => setShowNewReminderForm(!showNewReminderForm)}>
                  Ajouter
                </Bouton>
              }
            />
            {showNewReminderForm && (
              <Carte className="mb-3 space-y-3">
                <Champ libelle="Titre du rappel" placeholder="Ex : Échographie Schiphra" value={newReminderTitle} onChange={(e) => setNewReminderTitle(e.target.value)} />
                <Champ libelle="Date et heure" placeholder="Ex : 28 octobre à 10h" value={newReminderDate} onChange={(e) => setNewReminderDate(e.target.value)} />
                <ListeDeroulante libelle="Type" value={newReminderType} onChange={(e) => setNewReminderType(e.target.value as typeof newReminderType)}>
                  <option value="screening">Dépistage</option>
                  <option value="appointment">Rendez-vous</option>
                  <option value="treatment">Traitement</option>
                </ListeDeroulante>
                <Bouton
                  pleineLargeur
                  disabled={!newReminderTitle}
                  onClick={() => {
                    void ajouterRappel({ title: newReminderTitle, date: newReminderDate || "Bientôt", type: newReminderType }).then((ok) => {
                      if (!ok) return;
                      setNewReminderTitle("");
                      setNewReminderDate("");
                      setShowNewReminderForm(false);
                      notify("Rappel ajouté avec succès.");
                    });
                  }}
                >
                  Enregistrer le rappel
                </Bouton>
              </Carte>
            )}
            {reminders.length === 0 ? (
              <EtatVide icone={<Bell size={24} />} titre="Aucun rappel" texte="Ajoutez un dépistage ou un rendez-vous pour ne pas l'oublier." />
            ) : (
              <ul className="space-y-2">
                {(reminders as Rappel[]).map((r) => (
                  <li key={r.id} className="flex items-center gap-3 rounded-carte border border-bordure bg-surface px-4 py-2 shadow-carte">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-500" aria-hidden>
                      <CalendarClock size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-corps font-semibold text-prune-900">{r.title}</span>
                      <span className="block text-petit text-texte-2">
                        {r.date} · {r.type === "screening" ? "Dépistage" : r.type === "appointment" ? "Rendez-vous" : "Traitement"}
                      </span>
                    </span>
                    <span className="w-14 shrink-0">
                      <Interrupteur libelle={`Rappel « ${r.title} » ${r.active ? "actif" : "désactivé"}`} libelleMasque actif={r.active} onChange={() => void basculerRappel(r.id)} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
