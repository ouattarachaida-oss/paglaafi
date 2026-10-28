import { useState } from "react";
import { ClipboardList, Info, Send, UserCheck } from "lucide-react";
import { useAuth, useDocteur, useFiches } from "../etat/contextes";
import type { Fiche, LangueFiche } from "../depot/fiches";
import { Badge, BadgeRole, Bandeau, Bouton, Champ, EtatVide, Feuille, ListeDeroulante, OngletsSoulignes, ZoneTexte } from "../composants/ui";

const LANGUES: Record<LangueFiche, string> = { fr: "Français", en: "English", moore: "Mooré", dioula: "Dioula" };
type Onglet = "proposer" | "mes" | "valider" | "validateurs";

function StatutFiche({ fiche }: { fiche: Fiche }) {
  if (fiche.statut === "en_attente") return <Badge ton="attention">En attente</Badge>;
  if (fiche.statut === "refusee") return <Badge ton="alerte">Refusée</Badge>;
  return fiche.indexee ? <Badge ton="succes">Validée</Badge> : <Badge ton="info">Validée · indexation à lancer</Badge>;
}

/** Carte de relecture : source officielle obligatoire, motif en cas de refus, quatre yeux. */
function CarteRelecture({ fiche, estAuteur }: { fiche: Fiche; estAuteur: boolean }) {
  const { validerUneFiche, refuserUneFiche } = useFiches();
  const [sourceTitre, setSourceTitre] = useState(fiche.sourceTitre ?? "");
  const [sourceUrl, setSourceUrl] = useState(fiche.sourceUrl ?? "");
  const [motif, setMotif] = useState("");
  const [ouverte, setOuverte] = useState(false);

  return (
    <li className="space-y-3 rounded-carte border border-bordure bg-surface p-4 shadow-carte">
      <div className="flex flex-wrap gap-2">
        <StatutFiche fiche={fiche} />
        <Badge ton="neutre">{LANGUES[fiche.langue]}</Badge>
        {fiche.theme && <Badge ton="info">{fiche.theme}</Badge>}
      </div>
      <div>
        <h3 className="text-corps font-semibold text-prune-900">{fiche.titre}</h3>
        <p className="text-petit text-texte-2">
          Proposée par {fiche.auteurNom ?? "contenu initial PagLaafi"} · {fiche.dateMaj}
        </p>
      </div>
      <p className={`whitespace-pre-wrap text-corps text-texte ${ouverte ? "" : "line-clamp-4"}`}>{fiche.contenu}</p>
      <Bouton variante="discret" aria-expanded={ouverte} onClick={() => setOuverte(!ouverte)}>
        {ouverte ? "Réduire" : "Lire toute la fiche"}
      </Bouton>
      {fiche.sourceSuggeree && (
        <p className="bordure-pointillee rounded-bouton border-attention bg-attention-fond p-3 text-petit text-attention" style={{ borderColor: "var(--pl-attention)" }}>
          <strong>Piste de source (à vérifier, ce n'est pas une source) :</strong> {fiche.sourceSuggeree.replace(/^SUGGESTION À VÉRIFIER — /, "")}
        </p>
      )}
      {estAuteur ? (
        <Bandeau ton="info">On ne valide pas ses propres fiches : un autre validateur doit relire celle-ci.</Bandeau>
      ) : (
        <div className="space-y-3 border-t border-bordure pt-3">
          <Champ
            libelle="Source officielle (obligatoire)"
            aria-label={`Source officielle : ${fiche.titre}`}
            value={sourceTitre}
            onChange={(e) => setSourceTitre(e.target.value)}
            placeholder="Ex : OMS, aide-mémoire « Cancer du sein »"
            aide="La source que vous avez consultée et qui confirme ce contenu."
          />
          <Champ
            libelle="Lien https:// (facultatif)"
            aria-label={`Lien de la source : ${fiche.titre}`}
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://…"
          />
          <Champ libelle="Motif en cas de refus" aria-label={`Motif de refus : ${fiche.titre}`} value={motif} onChange={(e) => setMotif(e.target.value)} />
          <div className="flex gap-3">
            <Bouton className="flex-1" disabled={!sourceTitre.trim()} onClick={() => void validerUneFiche(fiche, sourceTitre, sourceUrl)}>
              Valider la fiche
            </Bouton>
            <Bouton variante="secondaire" className="flex-1" onClick={() => void refuserUneFiche(fiche, motif)}>
              Refuser
            </Bouton>
          </div>
          <p className="text-petit text-texte-2">Rappel : on ne valide pas ses propres fiches (validation à quatre yeux).</p>
        </div>
      )}
    </li>
  );
}

/**
 * Espace « Fiches Rose IA » (mode réel) : à relire, mes fiches, proposer ;
 * désignation des validateurs pour le superadmin.
 */
export function EspaceFichesDocteur() {
  const { setShowDoctorTrainModal, showDoctorTrainModal } = useDocteur();
  const {
    docteurs,
    estDocteur,
    estSuperadmin,
    estValidateur,
    fichesAValider,
    formulaireFiche: ff,
    mesFiches,
    ongletFiches,
    setFormulaireFiche,
    setOngletFiches,
    soumettreFiche,
    basculerValidateur,
  } = useFiches();
  const { sessionReelle, currentUser } = useAuth();
  const sessionId = sessionReelle?.userId ?? null;

  const onglets = [
    estValidateur && { id: "valider" as const, libelle: `À relire (${fichesAValider.length})` },
    estDocteur && { id: "mes" as const, libelle: `Mes fiches (${mesFiches.length})` },
    estDocteur && { id: "proposer" as const, libelle: "Proposer" },
    estSuperadmin && { id: "validateurs" as const, libelle: "Validateurs" },
  ].filter(Boolean) as { id: Onglet; libelle: string }[];
  // Onglet mémorisé indisponible pour ce rôle : premier onglet disponible
  const actif: Onglet = onglets.some((o) => o.id === ongletFiches) ? ongletFiches : (onglets[0]?.id ?? "proposer");

  return (
    <Feuille
      ouverte={showDoctorTrainModal}
      onFermer={() => setShowDoctorTrainModal(false)}
      large
      titre="Fiches Rose IA"
      sousTitre="Connaissances validées par les soignants"
      enTete={currentUser && <BadgeRole libelle={currentUser.roleLabel} superadmin={currentUser.role === "superadmin"} />}
    >
      <div className="space-y-4">
        <Bandeau ton="succes">
          Rose IA ne répond qu'à partir de fiches validées par un autre soignant que leur auteur, avec une source officielle. Aucune donnée de patiente
          ne doit figurer dans une fiche.
        </Bandeau>

        {onglets.length > 1 && <OngletsSoulignes<Onglet> libelle="Sections des fiches" valeur={actif} onChange={setOngletFiches} onglets={onglets} />}

        {actif === "proposer" && estDocteur && (
          <form onSubmit={soumettreFiche} className="space-y-4">
            <Champ id="fiche-titre" libelle="Titre" required value={ff.titre} onChange={(e) => setFormulaireFiche({ ...ff, titre: e.target.value })} placeholder="Ex : Quand consulter pour une boule au sein" />
            <div className="grid gap-4 min-[420px]:grid-cols-2">
              <ListeDeroulante id="fiche-langue" libelle="Langue" value={ff.langue} onChange={(e) => setFormulaireFiche({ ...ff, langue: e.target.value as LangueFiche })}>
                {Object.entries(LANGUES).map(([code, nom]) => (
                  <option key={code} value={code}>
                    {nom}
                  </option>
                ))}
              </ListeDeroulante>
              <Champ id="fiche-theme" libelle="Thème" value={ff.theme} onChange={(e) => setFormulaireFiche({ ...ff, theme: e.target.value })} placeholder="Ex : boule" />
            </div>
            <ZoneTexte
              id="fiche-contenu"
              libelle="Contenu (langage simple)"
              required
              rows={6}
              value={ff.contenu}
              onChange={(e) => setFormulaireFiche({ ...ff, contenu: e.target.value })}
              placeholder="Informations de prévention et d'orientation, sans diagnostic ni posologie."
            />
            <Champ id="fiche-source" libelle="Source officielle" value={ff.sourceTitre} onChange={(e) => setFormulaireFiche({ ...ff, sourceTitre: e.target.value })} placeholder="Ex : OMS, aide-mémoire « Cancer du sein »" />
            <Champ libelle="Lien de la source" type="url" value={ff.sourceUrl} onChange={(e) => setFormulaireFiche({ ...ff, sourceUrl: e.target.value })} placeholder="https://… (facultatif)" />
            <Bouton type="submit" taille="grand" pleineLargeur icone={<Send size={18} aria-hidden />}>
              Envoyer pour validation
            </Bouton>
          </form>
        )}

        {actif === "mes" &&
          (mesFiches.length === 0 ? (
            <EtatVide icone={<ClipboardList size={24} />} titre="Aucune fiche proposée" texte="Proposez une fiche : un autre validateur la relira." />
          ) : (
            <ul className="space-y-3">
              {mesFiches.map((f) => (
                <li key={f.id} className="space-y-1 rounded-carte border border-bordure bg-surface p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-corps font-semibold text-prune-900">{f.titre}</p>
                    <StatutFiche fiche={f} />
                  </div>
                  <p className="text-petit text-texte-2">
                    {LANGUES[f.langue]} · mise à jour {f.dateMaj}
                  </p>
                  {f.statut === "refusee" && f.motifRefus && <p className="text-petit text-alerte">Motif : {f.motifRefus}</p>}
                </li>
              ))}
            </ul>
          ))}

        {actif === "valider" && estValidateur && (
          <div className="space-y-3">
            <p className="flex items-start gap-2 text-petit text-texte-2">
              <Info size={18} aria-hidden className="shrink-0" /> Relisez le contenu, vérifiez-le auprès d'une source officielle, puis saisissez cette source avant
              de valider.
            </p>
            {fichesAValider.length === 0 ? (
              <EtatVide icone={<ClipboardList size={24} />} titre="Aucune fiche en attente" />
            ) : (
              <ul className="space-y-3">
                {fichesAValider.map((f) => (
                  <CarteRelecture key={f.id} fiche={f} estAuteur={Boolean(f.auteurId) && f.auteurId === sessionId} />
                ))}
              </ul>
            )}
          </div>
        )}

        {actif === "validateurs" &&
          estSuperadmin &&
          (docteurs.length === 0 ? (
            <EtatVide icone={<UserCheck size={24} />} titre="Aucun compte docteur pour le moment" />
          ) : (
            <ul className="space-y-2">
              {docteurs.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 rounded-carte border border-bordure bg-surface p-3">
                  <div className="min-w-0">
                    <p className="truncate text-corps font-semibold text-prune-900">
                      {d.prenom} {d.nom}
                    </p>
                    <p className="text-petit text-texte-2">{[d.specialite, d.structure].filter(Boolean).join(" · ") || "Docteur"}</p>
                  </div>
                  <Bouton
                    variante={d.peutValider ? "secondaire" : "principal"}
                    taille="petit"
                    onClick={() => void basculerValidateur(d)}
                    aria-label={`${d.peutValider ? "Retirer" : "Désigner"} validateur : ${d.prenom} ${d.nom}`}
                  >
                    {d.peutValider ? "Retirer" : "Désigner validateur"}
                  </Bouton>
                </li>
              ))}
            </ul>
          ))}
      </div>
    </Feuille>
  );
}
