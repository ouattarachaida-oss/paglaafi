import { AlertCircle, Bell, Calendar, Check, CheckCheck, CheckCircle2, Clock, RotateCcw, Sparkles } from "lucide-react";
import { useUi, useSante } from "../etat/contextes";

/**
 * Onglet Cycle : règles, fenêtre d'autopalpation, recalibration et rappels.
 */
export function Cycle() {
  const { notify, section } = useUi();
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
    setShowCycleHistory,
    setShowNewReminderForm,
    setShowRecalibrateBox,
    showCycleHistory,
    showNewReminderForm,
    showRecalibrateBox,
  } = useSante();

  return (
    <section className="ph-enter px-5 pt-4">
      <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">Santé intime & Prévention</span>
      <h1 className="ph-display text-[26px] leading-tight text-[#580e36]">Cycle & Autopalpation</h1>
      <p className="mt-1 text-xs text-[#795f6d]">
        Suivez vos règles, sachez le moment idéal pour observer vos seins et programmez vos rappels médicaux.
      </p>

      {/* Suivi des règles, Prédictions & Recalibration adaptative */}
      <div className="mt-3.5 rounded-[24px] border border-[#f0d4df] bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#f6e6ec] pb-2.5">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#faedf1] text-[#ea2d6d]">
              <Calendar size={17} />
            </span>
            <div>
              <h3 className="ph-display text-sm font-bold text-[#580e36]">Cycle & Prédictions</h3>
              <p className="text-[10px] text-[#8c566d]">Prévision locale adaptative</p>
            </div>
          </div>
          <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-[10px] font-bold text-[#ea2d6d]">
            Cycle moyen : {cycleLengthDays} jours
          </span>
        </div>

        {/* Estimation actuelle calculée */}
        <div className="mt-3 rounded-2xl bg-gradient-to-br from-[#fdf5f7] to-[#faedf2] border border-[#f5dfe6] p-3 text-xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#91586e] uppercase tracking-wider">
                Prochaines règles estimées :
              </span>
              <p className="text-base font-extrabold text-[#580e36] mt-0.5">{cycleInfo.nextPeriodStr}</p>
              <p className="text-[10px] text-[#785566]">
                Dernier début noté : {new Date(lastPeriodDate).toLocaleDateString("fr-FR")}
              </p>
            </div>

            <div className="text-right">
              {cycleInfo.daysUntilNextPeriod > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#ea2d6d] shadow-xs border border-pink-100">
                  <Clock size={12} /> Dans {cycleInfo.daysUntilNextPeriod} j
                </span>
              ) : cycleInfo.daysUntilNextPeriod === 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800 shadow-xs">
                  <AlertCircle size={12} /> Prévues aujourd'hui
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-bold text-orange-800 shadow-xs">
                  <RotateCcw size={12} /> Décalage ({Math.abs(cycleInfo.daysUntilNextPeriod)} j)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Feedback vivant lors d'un recalibrage récent */}
        {recalibrationFeedback && (
          <div
            className={`mt-2.5 rounded-xl p-2.5 text-xs flex items-start gap-2 border ${
              recalibrationFeedback.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : recalibrationFeedback.type === "warning"
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : "bg-blue-50 border-blue-200 text-blue-900"
            }`}
          >
            <Sparkles size={15} className="shrink-0 mt-0.5 text-[#ea2d6d]" />
            <div className="flex-1 text-[11px] leading-relaxed">
              <p className="font-bold">Ajustement automatique du cycle :</p>
              <p>{recalibrationFeedback.text}</p>
            </div>
          </div>
        )}

        {/* MODULE D'ENREGISTREMENT ET DE RECALIBRATION */}
        <div className="mt-3 rounded-2xl bg-[#fff8fa] border border-[#f0d4de] p-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-[#4c2a3b]">Vos règles sont là ?</p>
              <p className="text-[10px] text-[#865d70]">
                Enregistrez la date réelle pour recalibrer la prédiction si elle n'est pas exacte.
              </p>
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Bouton 1-clic direct pour aujourd'hui */}
            <button
              type="button"
              onClick={() => {
                const d = new Date();
                const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                handleRecalibratePeriod(todayStr);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#ea2d6d] py-2 px-3 text-xs font-bold text-white shadow-xs hover:bg-[#8e3855] transition active:scale-[0.98]"
            >
              <CheckCircle2 size={15} /> Mes règles ont débuté aujourd'hui
            </button>

            {/* Bouton d'ouverture du sélecteur fin */}
            <button
              type="button"
              onClick={() => setShowRecalibrateBox(!showRecalibrateBox)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#d6a5b6] bg-white py-2 px-3 text-xs font-bold text-[#8c3855] shadow-xs hover:bg-[#faedf1] transition"
            >
              <RotateCcw size={14} />
              {showRecalibrateBox ? "Masquer le réglage" : "Autre date / Recalibrer"}
            </button>
          </div>

          {/* Volet rétractable pour choisir une date spécifique et recalibrer */}
          {showRecalibrateBox && (
            <div className="mt-3 rounded-xl bg-white p-3 border border-[#ebd0db] shadow-xs space-y-2.5">
              <p className="font-bold text-[#553043] text-xs">Indiquez le jour réel où vos règles ont commencé :</p>

              {/* Raccourcis tactiles rapides */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                    setRealPeriodDateInput(str);
                  }}
                  className={`rounded-lg px-2.5 py-1 font-semibold border ${
                    realPeriodDateInput ===
                    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`
                      ? "bg-[#ea2d6d] text-white border-[#ea2d6d]"
                      : "bg-[#faeff2] text-[#6b3c50] border-[#ebd1dc]"
                  }`}
                >
                  Aujourd'hui
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() - 1);
                    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                    setRealPeriodDateInput(str);
                  }}
                  className="rounded-lg px-2.5 py-1 font-semibold bg-[#faeff2] text-[#6b3c50] border border-[#ebd1dc] hover:bg-[#f6e1e8]"
                >
                  Hier
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() - 2);
                    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                    setRealPeriodDateInput(str);
                  }}
                  className="rounded-lg px-2.5 py-1 font-semibold bg-[#faeff2] text-[#6b3c50] border border-[#ebd1dc] hover:bg-[#f6e1e8]"
                >
                  Avant-hier
                </button>
              </div>

              {/* Sélecteur de date natif */}
              <div>
                <label className="block text-[10px] font-bold text-[#865d70] mb-1">
                  Date précise du premier jour :
                </label>
                <input
                  type="date"
                  value={realPeriodDateInput}
                  onChange={(e) => setRealPeriodDateInput(e.target.value)}
                  className="w-full rounded-xl border border-[#ebd2dd] p-2 text-xs font-bold text-[#580e36] bg-[#fffcfd]"
                />
              </div>

              {/* Aperçu du calcul de l'écart */}
              {(() => {
                const prevParts = lastPeriodDate.split("-");
                const prevDate = new Date(
                  parseInt(prevParts[0], 10),
                  parseInt(prevParts[1], 10) - 1,
                  parseInt(prevParts[2], 10),
                );
                const realParts = realPeriodDateInput.split("-");
                const realDate = new Date(
                  parseInt(realParts[0], 10),
                  parseInt(realParts[1], 10) - 1,
                  parseInt(realParts[2], 10),
                );
                const diff = Math.round((realDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div className="rounded-lg bg-[#faeff2] p-2 text-[11px] text-[#6a3c50] flex items-center justify-between">
                    <span>Écart constaté depuis le cycle précédent :</span>
                    <span className="font-extrabold text-[#ea2d6d]">
                      {diff > 0 ? `${diff} jours` : "Date invalide"}
                    </span>
                  </div>
                );
              })()}

              <button
                type="button"
                onClick={() => handleRecalibratePeriod(realPeriodDateInput)}
                className="w-full rounded-xl bg-gradient-to-r from-[#ea2d6d] to-[#b34d70] py-2 text-xs font-bold text-white shadow hover:opacity-95 transition"
              >
                Enregistrer & Recalibrer la prédiction
              </button>
            </div>
          )}
        </div>

        {/* Historique des cycles recalibrés (accordéon repliable) */}
        <div className="mt-2.5 pt-2 border-t border-[#f7e4eb] flex items-center justify-between text-[11px]">
          <button
            type="button"
            onClick={() => setShowCycleHistory(!showCycleHistory)}
            className="inline-flex items-center gap-1 font-bold text-[#914c66] hover:underline"
          >
            <span>{showCycleHistory ? "Masquer l'historique" : "Voir l'historique de recalibration"}</span>
            <span>({cycleHistory.length})</span>
          </button>
          <span className="text-[10px] text-[#9a7082]">Stockage 100% privé local</span>
        </div>

        {showCycleHistory && (
          <div className="mt-2 space-y-1.5 text-xs">
            {cycleHistory.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-[#f0dae2] bg-[#fffafb] p-2 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-[#580e36] text-[11px]">Cycle du {item.date}</p>
                  <p className="text-[10px] text-[#7a5868]">{item.note}</p>
                </div>
                <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-[#ea2d6d]">
                  {item.duration} jours
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fenêtre d'autopalpation recommandée par l'OMS */}
      <div className="mt-3.5 rounded-[24px] border-2 border-emerald-300 bg-gradient-to-br from-[#f2fbf6] to-[#e7f7ee] p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[9.5px] font-bold text-white shadow-xs">
            <CheckCheck size={13} /> Recommandation médicale
          </span>
          <span className="text-[10px] font-bold text-emerald-800">
            {cycleInfo.isOptimalWindow ? "🟢 Période Idéale Aujourd'hui" : "Prochaine période"}
          </span>
        </div>

        <h3 className="ph-display mt-2 text-base font-bold text-[#204030]">
          Fenêtre d'autopalpation : {cycleInfo.autopalpWindowStr}
        </h3>
        <p className="mt-1 text-xs text-[#39614c] leading-relaxed">
          Le meilleur moment pour observer vos seins est <strong>2 à 5 jours après la fin des règles</strong>, quand les
          tissus mammaires sont souples et non douloureux.
        </p>

        <div className="mt-3 space-y-1.5 text-xs">
          <div className="rounded-xl bg-white/90 p-2 border border-emerald-200">
            <b>1. Devant le miroir :</b> Observez bras le long du corps, puis levés (recherchez une fossette ou un pli).
          </div>
          <div className="rounded-xl bg-white/90 p-2 border border-emerald-200">
            <b>2. Palpation circulaire :</b> Avec la pulpe des 3 doigts, faites des petits cercles fermes de l'extérieur
            vers le centre.
          </div>
          <div className="rounded-xl bg-white/90 p-2 border border-emerald-200">
            <b>3. Sous l'aisselle :</b> Vérifiez le creux du bras pour vous assurer de l'absence de nodule ou ganglion
            dur.
          </div>
          <div className="rounded-xl bg-white/90 p-2 border border-emerald-200">
            <b>4. Pression douce :</b> Pincez légèrement le mamelon pour vérifier l'absence d'écoulement anormal.
          </div>
        </div>

        <button
          onClick={() => {
            setAutopalpationDoneThisMonth(true);
            setLastAutopalpationDate(new Date().toLocaleDateString("fr-FR"));
            notify("Bravo ! Autopalpation enregistrée pour ce mois-ci.");
          }}
          className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-800"
        >
          <Check size={16} /> J'ai réalisé mon autopalpation ce mois-ci ({lastAutopalpationDate})
        </button>
      </div>

      {/* Rappels personnalisés */}
      <div className="mt-3.5 rounded-[24px] border border-[#f0d4df] bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#f6e6ec] pb-2.5">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#faedf1] text-[#ea2d6d]">
              <Bell size={17} />
            </span>
            <h3 className="ph-display text-sm font-bold text-[#580e36]">Mes rappels de santé</h3>
          </div>
          <button
            onClick={() => setShowNewReminderForm(!showNewReminderForm)}
            className="text-xs font-bold text-[#ea2d6d] hover:underline"
          >
            + Ajouter
          </button>
        </div>

        {showNewReminderForm && (
          <div className="mt-3 rounded-2xl bg-[#fdf5f7] p-3 text-xs space-y-2 border border-[#f2dbe3]">
            <p className="font-bold text-[#623c4d]">Nouveau rappel médical :</p>
            <input
              type="text"
              placeholder="Titre du rappel (ex: Échographie Schiphra)"
              value={newReminderTitle}
              onChange={(e) => setNewReminderTitle(e.target.value)}
              className="w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
            />
            <input
              type="text"
              placeholder="Date et heure (ex: 28 Octobre à 10h)"
              value={newReminderDate}
              onChange={(e) => setNewReminderDate(e.target.value)}
              className="w-full rounded-xl border border-[#e4cfd6] p-2 text-xs"
            />
            <div className="flex gap-2">
              <select
                value={newReminderType}
                onChange={(e) => setNewReminderType(e.target.value as any)}
                className="rounded-xl border border-[#e4cfd6] p-1.5 text-xs font-semibold"
              >
                <option value="screening">Dépistage</option>
                <option value="appointment">Rendez-vous</option>
                <option value="treatment">Traitement</option>
              </select>
              <button
                onClick={() => {
                  if (!newReminderTitle) return;
                  void ajouterRappel({
                    title: newReminderTitle,
                    date: newReminderDate || "Bientôt",
                    type: newReminderType,
                  }).then((ok) => {
                    if (!ok) return;
                    setNewReminderTitle("");
                    setNewReminderDate("");
                    setShowNewReminderForm(false);
                    notify("Rappel ajouté avec succès.");
                  });
                }}
                className="flex-1 rounded-xl bg-[#ea2d6d] py-1.5 font-bold text-white text-xs"
              >
                Enregistrer
              </button>
            </div>
          </div>
        )}

        <div className="mt-3 space-y-2 text-xs">
          {reminders.map((r: any) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-xl border border-[#f2e2e7] p-2.5 bg-[#fffafc]"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`grid h-7 w-7 place-items-center rounded-lg ${r.type === "screening" ? "bg-purple-100 text-purple-800" : r.type === "appointment" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"}`}
                >
                  <Clock size={14} />
                </span>
                <div>
                  <p className="font-bold text-[#580e36]">{r.title}</p>
                  <p className="text-[10px] text-[#865d70]">{r.date}</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                Actif ✓
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
