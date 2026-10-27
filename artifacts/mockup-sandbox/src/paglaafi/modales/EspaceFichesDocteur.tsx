import { useState } from "react";
import { BookOpen, CheckCircle2, GraduationCap, ShieldCheck, X } from "lucide-react";
import { useAuth, useDocteur, useFiches } from "../etat/contextes";
import type { Fiche, LangueFiche } from "../depot/fiches";

const LANGUES: Record<LangueFiche, string> = { fr: "Français", en: "English", moore: "Mooré", dioula: "Dioula" };

function StatutFiche({ fiche }: { fiche: Fiche }) {
  const [classe, libelle] =
    fiche.statut === "en_attente"
      ? ["bg-amber-100 text-amber-900", "En attente de relecture"]
      : fiche.statut === "refusee"
        ? ["bg-rose-100 text-rose-800", "Refusée"]
        : fiche.indexee
          ? ["bg-emerald-100 text-emerald-800", "Validée · utilisée par Rose IA"]
          : ["bg-sky-100 text-sky-900", "Validée · indexation à lancer"];
  return <span className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold ${classe}`}>{libelle}</span>;
}

/** Carte de relecture d'une fiche par un validateur (source officielle obligatoire). */
function CarteValidation({ fiche, estAuteur }: { fiche: Fiche; estAuteur: boolean }) {
  const { validerUneFiche, refuserUneFiche } = useFiches();
  const [sourceTitre, setSourceTitre] = useState(fiche.sourceTitre ?? "");
  const [sourceUrl, setSourceUrl] = useState(fiche.sourceUrl ?? "");
  const [motif, setMotif] = useState("");
  const [ouverte, setOuverte] = useState(false);

  return (
    <div className="rounded-xl border border-[#ebd6dc] bg-[#fffafc] p-3 text-xs">
      <div className="flex items-start justify-between gap-2">
        <p className="font-bold text-[#580e36]">{fiche.titre}</p>
        <span className="shrink-0 rounded-full bg-purple-100 px-2 py-0.5 text-[9.5px] font-bold text-purple-900">
          {LANGUES[fiche.langue]}
        </span>
      </div>
      <p className="mt-0.5 text-[10px] text-[#916b7c]">
        Proposée par {fiche.auteurNom ?? "contenu initial PagLaafi"} · {fiche.dateMaj}
      </p>
      <p
        className={`mt-2 whitespace-pre-wrap text-[11px] leading-relaxed text-[#4d2d3e] ${ouverte ? "" : "line-clamp-4"}`}
      >
        {fiche.contenu}
      </p>
      <button
        type="button"
        onClick={() => setOuverte(!ouverte)}
        className="mt-1 text-[10.5px] font-bold text-[#ea2d6d]"
      >
        {ouverte ? "Réduire" : "Lire toute la fiche"}
      </button>
      {fiche.sourceSuggeree && (
        <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-2 text-[10px] text-amber-900">
          <strong>Piste de source (à vérifier, ce n'est pas une source) :</strong>{" "}
          {fiche.sourceSuggeree.replace(/^SUGGESTION À VÉRIFIER — /, "")}
        </p>
      )}
      {estAuteur ? (
        <p className="mt-2 rounded-lg bg-slate-50 p-2 text-[10.5px] text-slate-700">
          Validation à quatre yeux : un autre validateur doit relire cette fiche.
        </p>
      ) : (
        <div className="mt-2 space-y-1.5">
          <input
            aria-label={`Source officielle : ${fiche.titre}`}
            value={sourceTitre}
            onChange={(e) => setSourceTitre(e.target.value)}
            placeholder="Source officielle vérifiée (obligatoire)"
            className="w-full rounded-lg border border-[#d6a9b9] p-1.5 text-[11px]"
          />
          <input
            aria-label={`Lien de la source : ${fiche.titre}`}
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="Lien https:// (facultatif)"
            className="w-full rounded-lg border border-[#d6a9b9] p-1.5 text-[11px]"
          />
          <input
            aria-label={`Motif de refus : ${fiche.titre}`}
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            placeholder="Motif en cas de refus"
            className="w-full rounded-lg border border-[#e7d3da] p-1.5 text-[11px]"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void validerUneFiche(fiche, sourceTitre, sourceUrl)}
              className="flex-1 rounded-lg bg-emerald-600 py-1.5 font-bold text-white shadow-xs"
            >
              Valider la fiche
            </button>
            <button
              type="button"
              onClick={() => void refuserUneFiche(fiche, motif)}
              className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 font-bold text-rose-700"
            >
              Refuser
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Espace « Fiches Rose IA » (mode réel) : remplace la simulation d'entraînement.
 * Proposer une fiche, suivre ses fiches, valider la file (validateurs), désigner
 * les validateurs (superadmin).
 */
export function EspaceFichesDocteur() {
  const { setShowDoctorTrainModal, showDoctorTrainModal } = useDocteur();
  const {
    docteurs,
    estDocteur,
    estSuperadmin,
    estValidateur,
    fichesAValider,
    formulaireFiche,
    mesFiches,
    ongletFiches,
    setFormulaireFiche,
    setOngletFiches,
    soumettreFiche,
    basculerValidateur,
  } = useFiches();
  const { sessionReelle } = useAuth();
  const sessionId = sessionReelle?.userId ?? null;

  if (!showDoctorTrainModal) return null;

  const onglets = [
    estDocteur && (["proposer", "Proposer"] as const),
    estDocteur && (["mes", `Mes fiches (${mesFiches.length})`] as const),
    estValidateur && (["valider", `À valider (${fichesAValider.length})`] as const),
    estSuperadmin && (["validateurs", "Validateurs"] as const),
  ].filter(Boolean) as ReadonlyArray<readonly ["proposer" | "mes" | "valider" | "validateurs", string]>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]">
      <div className="w-full max-w-sm max-h-[92vh] overflow-y-auto rounded-[28px] border-2 border-[#580e36] bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#580e36] text-white">
              <GraduationCap size={19} className="text-amber-300" />
            </div>
            <div>
              <h3 className="ph-display text-sm font-bold text-[#351c2a]">Fiches Rose IA</h3>
              <p className="text-[10px] font-bold text-[#a44666]">Connaissances validées par les soignants</p>
            </div>
          </div>
          <button
            onClick={() => setShowDoctorTrainModal(false)}
            aria-label="Fermer"
            className="grid h-8 w-8 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-[10.5px] text-emerald-900">
          <ShieldCheck size={12} className="mr-1 inline" />
          Rose IA ne répond qu'à partir de fiches validées par un autre soignant que leur auteur, avec une source
          officielle. Aucune donnée de patiente ne doit figurer dans une fiche.
        </p>

        {onglets.length > 1 && (
          <div className="mt-3 flex rounded-xl bg-[#f5eaf0] p-1 text-[10.5px] font-bold">
            {onglets.map(([cle, libelle]) => (
              <button
                key={cle}
                onClick={() => setOngletFiches(cle)}
                className={`flex-1 rounded-lg py-1.5 transition ${ongletFiches === cle ? "bg-[#580e36] text-white shadow-xs" : "text-[#6f334a]"}`}
              >
                {libelle}
              </button>
            ))}
          </div>
        )}

        {ongletFiches === "proposer" && estDocteur && (
          <form onSubmit={soumettreFiche} className="mt-3 space-y-2 text-xs">
            <label className="block font-bold text-[#563746]" htmlFor="fiche-titre">
              Titre *
            </label>
            <input
              id="fiche-titre"
              value={formulaireFiche.titre}
              onChange={(e) => setFormulaireFiche({ ...formulaireFiche, titre: e.target.value })}
              placeholder="Ex : Quand consulter pour une boule au sein"
              className="w-full rounded-xl border border-[#d6a9b9] p-2"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-[#563746]" htmlFor="fiche-langue">
                  Langue
                </label>
                <select
                  id="fiche-langue"
                  value={formulaireFiche.langue}
                  onChange={(e) => setFormulaireFiche({ ...formulaireFiche, langue: e.target.value as LangueFiche })}
                  className="w-full rounded-xl border border-[#d6a9b9] bg-white p-2"
                >
                  {Object.entries(LANGUES).map(([code, nom]) => (
                    <option key={code} value={code}>
                      {nom}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#563746]" htmlFor="fiche-theme">
                  Thème
                </label>
                <input
                  id="fiche-theme"
                  value={formulaireFiche.theme}
                  onChange={(e) => setFormulaireFiche({ ...formulaireFiche, theme: e.target.value })}
                  placeholder="Ex : boule"
                  className="w-full rounded-xl border border-[#d6a9b9] p-2"
                />
              </div>
            </div>
            <label className="block font-bold text-[#563746]" htmlFor="fiche-contenu">
              Contenu (langage simple) *
            </label>
            <textarea
              id="fiche-contenu"
              rows={6}
              value={formulaireFiche.contenu}
              onChange={(e) => setFormulaireFiche({ ...formulaireFiche, contenu: e.target.value })}
              placeholder="Informations de prévention et d'orientation, sans diagnostic ni posologie."
              className="w-full rounded-xl border border-[#d6a9b9] p-2"
            />
            <label className="block font-bold text-[#563746]" htmlFor="fiche-source">
              Source officielle
            </label>
            <input
              id="fiche-source"
              value={formulaireFiche.sourceTitre}
              onChange={(e) => setFormulaireFiche({ ...formulaireFiche, sourceTitre: e.target.value })}
              placeholder="Ex : OMS, aide-mémoire « Cancer du sein »"
              className="w-full rounded-xl border border-[#d6a9b9] p-2"
            />
            <input
              aria-label="Lien de la source"
              value={formulaireFiche.sourceUrl}
              onChange={(e) => setFormulaireFiche({ ...formulaireFiche, sourceUrl: e.target.value })}
              placeholder="Lien https:// (facultatif)"
              className="w-full rounded-xl border border-[#d6a9b9] p-2"
            />
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ea2d6d] py-2.5 font-bold text-white shadow-md"
            >
              <CheckCircle2 size={15} /> Envoyer pour validation
            </button>
          </form>
        )}

        {ongletFiches === "mes" && (
          <div className="mt-3 space-y-2 text-xs">
            {mesFiches.length === 0 && (
              <p className="text-[11px] text-[#916b7c]">Vous n'avez encore proposé aucune fiche.</p>
            )}
            {mesFiches.map((f) => (
              <div key={f.id} className="rounded-xl border border-[#ebd6dc] bg-[#fffafc] p-2.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-[#580e36]">{f.titre}</p>
                  <StatutFiche fiche={f} />
                </div>
                <p className="text-[10px] text-[#916b7c]">
                  {LANGUES[f.langue]} · maj {f.dateMaj}
                </p>
                {f.statut === "refusee" && f.motifRefus && (
                  <p className="mt-1 text-[10.5px] text-rose-700">Motif : {f.motifRefus}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {ongletFiches === "valider" && estValidateur && (
          <div className="mt-3 space-y-2">
            <p className="text-[10.5px] text-[#7d5668]">
              <BookOpen size={12} className="mr-1 inline" />
              Relisez le contenu, vérifiez-le auprès d'une source officielle, puis saisissez cette source avant de
              valider.
            </p>
            {fichesAValider.length === 0 && <p className="text-[11px] text-[#916b7c]">Aucune fiche en attente.</p>}
            {fichesAValider.map((f) => (
              <CarteValidation key={f.id} fiche={f} estAuteur={Boolean(f.auteurId) && f.auteurId === sessionId} />
            ))}
          </div>
        )}

        {ongletFiches === "validateurs" && estSuperadmin && (
          <div className="mt-3 space-y-1.5 text-xs">
            {docteurs.length === 0 && (
              <p className="text-[11px] text-[#916b7c]">Aucun compte docteur pour le moment.</p>
            )}
            {docteurs.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-[#ebd6dc] bg-[#fffafc] p-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-[#580e36]">
                    {d.prenom} {d.nom}
                  </p>
                  <p className="text-[10px] text-[#916b7c]">
                    {[d.specialite, d.structure].filter(Boolean).join(" · ") || "Docteur"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void basculerValidateur(d)}
                  aria-label={`${d.peutValider ? "Retirer" : "Désigner"} validateur : ${d.prenom} ${d.nom}`}
                  className={`shrink-0 rounded-lg px-2.5 py-1 text-[10.5px] font-bold ${d.peutValider ? "border border-rose-300 bg-rose-50 text-rose-700" : "bg-emerald-600 text-white"}`}
                >
                  {d.peutValider ? "Retirer" : "Désigner validateur"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
