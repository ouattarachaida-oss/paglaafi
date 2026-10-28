import { useEffect, useState } from "react";
import { BadgeCheck, Building2, ClipboardList, Megaphone, Sparkles } from "lucide-react";
import { useAuth, useDocteur, useAnnonces, useAdministration, useFiches, useCentres } from "../etat/contextes";
import { MODE_REEL } from "../config";
import type { StructureAVerifier } from "../depot/verifications";
import type { PendingRegistration } from "../types";
import { partnerAssociations } from "../donnees/associations";
import { BadgeSimulation } from "../composants/BadgeSimulation";
import { Badge, BadgeRole, Bandeau, Bouton, Carte, Champ, EtatVide, Feuille, ListeDeroulante, OngletsSoulignes } from "../composants/ui";

type Onglet = "stats" | "announcements" | "registrations" | "verifications" | "fiches";

/** Demande d'adhésion : rattachement obligatoire avant d'approuver, motif en cas de refus. */
function CarteAdhesion({ reg }: { reg: PendingRegistration }) {
  const { handleApproveRegistration, handleRejectRegistration, structuresAVerifier } = useAdministration();
  const { centers } = useCentres();
  const [rattachement, setRattachement] = useState("");
  const [motif, setMotif] = useState("");

  const association = reg.type === "Association";
  const professionnel = reg.type === "Professionnel";
  const listeCentres = MODE_REEL ? structuresAVerifier.centres.map((c) => ({ id: c.id, nom: c.nom })) : centers.map((c) => ({ id: c.id, nom: c.shortName }));
  const listeAssos = MODE_REEL ? structuresAVerifier.associations.map((a) => ({ id: a.id, nom: a.nom })) : partnerAssociations.map((a) => ({ id: a.id, nom: a.name }));
  const options = association ? listeAssos : listeCentres;

  const approuver = () => {
    const id = rattachement.startsWith("id:") ? Number(rattachement.slice(3)) : null;
    handleApproveRegistration(reg.id, association ? { association: id } : { centre: id });
  };

  return (
    <li className="space-y-3 rounded-carte border border-bordure bg-surface p-4 shadow-carte">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-corps font-semibold text-prune-900">{reg.structure}</h3>
          <p className="text-petit text-texte-2">
            {reg.type} · {reg.ville} · {reg.date}
          </p>
          <p className="text-petit text-texte">
            Responsable : {reg.responsable} · {reg.telephone}
          </p>
        </div>
        {reg.status === "pending" ? <Badge ton="attention">En attente</Badge> : reg.status === "approved" ? <Badge ton="succes">Approuvée</Badge> : <Badge ton="alerte">Refusée</Badge>}
      </div>
      {reg.status === "pending" && (
        <div className="space-y-3 border-t border-bordure pt-3">
          <ListeDeroulante libelle="Rattachement" value={rattachement} onChange={(e) => setRattachement(e.target.value)}>
            <option value="">Choisir le rattachement…</option>
            <option value="nouveau">
              {professionnel ? "Aucun centre (docteur indépendant)" : association ? `Créer l'association « ${reg.structure} »` : `Créer le centre « ${reg.structure} »`}
            </option>
            {options.map((o) => (
              <option key={o.id} value={`id:${o.id}`}>
                {association ? "Association existante" : "Centre existant"} : {o.nom}
              </option>
            ))}
          </ListeDeroulante>
          <Champ libelle="Motif en cas de refus" value={motif} onChange={(e) => setMotif(e.target.value)} />
          <div className="flex gap-3">
            <Bouton className="flex-1" disabled={!rattachement} onClick={approuver}>
              Approuver
            </Bouton>
            <Bouton variante="secondaire" className="flex-1" onClick={() => handleRejectRegistration(reg.id, motif.trim() || undefined)}>
              Refuser
            </Bouton>
          </div>
        </div>
      )}
    </li>
  );
}

/**
 * Panneau Superadmin : compteurs « À traiter », statistiques (simulées), modération
 * des annonces, adhésions, vérification des structures (mode réel) et fiches Rose IA.
 */
export function EspaceSuperadmin() {
  const { pendingRegistrations, currentUser } = useAuth();
  const { setShowDoctorTrainModal } = useDocteur();
  const { announcements, handleApproveAndPushAnnouncement, handleApproveAnnouncement, handleRejectAnnouncement } = useAnnonces();
  const { fichesAValider, rechargerFiches } = useFiches();
  const {
    basculerVerification,
    structuresAVerifier,
    setShowSuperadminModal,
    setSuperadminActiveTab,
    setSuperadminAnnouncementTab,
    setSuperadminRegionFilter,
    showSuperadminModal,
    superadminActiveTab,
    superadminAnnouncementTab,
    superadminRegionFilter,
    superadminSortedCenters,
  } = useAdministration();

  // Compteur des fiches à relire chargé à l'ouverture du panneau (mode réel)
  useEffect(() => {
    if (MODE_REEL && showSuperadminModal) void rechargerFiches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSuperadminModal]);

  const annoncesEnAttente = announcements.filter((a) => a.status === "pending_validation");
  const adhesionsEnAttente = pendingRegistrations.filter((r) => r.status === "pending");
  const aVerifier = [...structuresAVerifier.centres, ...structuresAVerifier.associations].filter((s) => !s.verifiee).length;
  const annoncesFiltrees = annoncesEnAttente.filter((a) =>
    superadminAnnouncementTab === "rose_ai" ? a.isRoseAIDetected : superadminAnnouncementTab === "partners" ? !a.isRoseAIDetected : true,
  );

  const onglets: { id: Onglet; libelle: string }[] = [
    { id: "stats", libelle: "Statistiques" },
    { id: "announcements", libelle: `Annonces (${annoncesEnAttente.length})` },
    { id: "registrations", libelle: `Adhésions (${adhesionsEnAttente.length})` },
    ...(MODE_REEL ? [{ id: "verifications" as const, libelle: `Vérifications (${aVerifier})` }] : []),
    { id: "fiches", libelle: "Fiches Rose IA" },
  ];

  return (
    <Feuille
      ouverte={showSuperadminModal}
      onFermer={() => setShowSuperadminModal(false)}
      large
      titre="Panneau Superadmin"
      enTete={<BadgeRole libelle={currentUser?.roleLabel ?? "Superadmin"} superadmin />}
    >
      <div className="space-y-4">
        <section aria-labelledby="titre-a-traiter">
          <h3 id="titre-a-traiter" className="mb-2 text-corps font-semibold text-prune-900">
            À traiter
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { libelle: "Annonces", n: annoncesEnAttente.length, icone: <Megaphone size={18} aria-hidden />, onglet: "announcements" as const },
              { libelle: "Adhésions", n: adhesionsEnAttente.length, icone: <Building2 size={18} aria-hidden />, onglet: "registrations" as const },
              { libelle: "Fiches", n: MODE_REEL ? fichesAValider.length : 0, icone: <ClipboardList size={18} aria-hidden />, onglet: "fiches" as const },
            ].map((c) => (
              <button key={c.libelle} type="button" onClick={() => setSuperadminActiveTab(c.onglet)} className="rounded-carte bg-surface-2 p-3 text-left active:bg-rose-200">
                <span className="flex items-center gap-1.5 text-petit text-texte-2">
                  {c.icone} {c.libelle}
                </span>
                <span className="block text-titre text-prune-900">{c.n}</span>
              </button>
            ))}
          </div>
        </section>

        <OngletsSoulignes<Onglet> libelle="Sections du panneau" valeur={superadminActiveTab} onChange={setSuperadminActiveTab} onglets={onglets} />

        {superadminActiveTab === "stats" && (
          <div className="space-y-4">
            <BadgeSimulation bloc detail="Statistiques fictives : la mesure d'audience n'est pas encore en place." />
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Visites totales", "48 320"],
                ["Femmes uniques", "14 210"],
                ["Questions à Rose IA", "9 430"],
                ["Dons collectés", "14,8 M F"],
              ].map(([l, v]) => (
                <Carte key={l} douce>
                  <p className="text-petit text-texte-2">{l}</p>
                  <p className="text-titre text-prune-900">{v}</p>
                </Carte>
              ))}
            </div>
            <Carte>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-corps font-semibold text-prune-900">Centres les plus fréquentés</h3>
                <Badge>{superadminSortedCenters.length} centres</Badge>
              </div>
              <div className="defilement-discret mt-3 flex gap-2 overflow-x-auto">
                {[
                  { id: "all", label: "Tout le pays" },
                  { id: "Centre", label: "Ouaga (Centre)" },
                  { id: "Hauts-Bassins", label: "Bobo (Hauts-Bassins)" },
                  { id: "Centre-Ouest", label: "Koudougou" },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    aria-pressed={superadminRegionFilter === r.id}
                    onClick={() => setSuperadminRegionFilter(r.id)}
                    className={`min-h-11 shrink-0 rounded-full px-4 text-petit font-semibold ${superadminRegionFilter === r.id ? "bg-carte-prune text-white" : "border border-bordure text-texte"}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <ol className="mt-3 space-y-2">
                {superadminSortedCenters.map((c, i) => (
                  <li key={c.id} className="flex items-center gap-3 rounded-bouton border border-bordure p-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2 text-petit font-bold text-prune-900">{i + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-corps font-semibold text-prune-900">{c.shortName}</span>
                      <span className="block text-petit text-texte-2">
                        {c.place} · attente {c.estimatedWait} · {c.agentsPresent} soignant(s)
                      </span>
                    </span>
                    <span className="shrink-0 text-right text-petit">
                      <strong className="block text-prune-900">{c.confirmedVisitsToday} / jour</strong>
                      <span className="text-texte-2">~{(c.confirmedVisitsToday * 24).toLocaleString("fr-FR")} / mois</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Carte>
          </div>
        )}

        {superadminActiveTab === "announcements" && (
          <div className="space-y-3">
            <OngletsSoulignes<"all" | "rose_ai" | "partners">
              libelle="Origine des annonces"
              valeur={superadminAnnouncementTab}
              onChange={setSuperadminAnnouncementTab}
              onglets={[
                { id: "all", libelle: `Toutes (${annoncesEnAttente.length})` },
                { id: "rose_ai", libelle: `Veille Rose IA (${annoncesEnAttente.filter((a) => a.isRoseAIDetected).length})` },
                { id: "partners", libelle: `Partenaires (${annoncesEnAttente.filter((a) => !a.isRoseAIDetected).length})` },
              ]}
            />
            {annoncesFiltrees.length === 0 ? (
              <EtatVide icone={<Megaphone size={24} />} titre="Aucune annonce en attente" />
            ) : (
              <ul className="space-y-3">
                {annoncesFiltrees.map((a) => (
                  <li key={a.id} className="space-y-2 rounded-carte border border-bordure bg-surface p-4 shadow-carte">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-corps font-semibold text-prune-900">{a.title}</h3>
                      <Badge ton={a.isRoseAIDetected ? "info" : "attention"}>{a.isRoseAIDetected ? "Veille Rose IA" : "Partenaire"}</Badge>
                    </div>
                    <p className="text-petit text-texte-2">
                      {a.author} · {a.city} ({a.date})
                    </p>
                    {a.isRoseAIDetected && (
                      <div className="rounded-bouton bg-surface-2 p-3 text-petit text-texte">
                        <p>
                          <strong>Source repérée :</strong> {a.sourceWebUrl}
                        </p>
                        <p>
                          <strong>Indice de confiance :</strong> {a.aiConfidence}
                        </p>
                        <p className="mt-1">
                          <strong>Notification préparée :</strong> « {a.pushMessageFr} »
                        </p>
                      </div>
                    )}
                    <p className="text-corps text-texte">{a.content}</p>
                    <p className="text-petit text-texte-2">Contact : {a.contact}</p>
                    <div className="flex gap-3 pt-1">
                      {a.isRoseAIDetected ? (
                        <Bouton className="flex-1" icone={<Sparkles size={18} aria-hidden />} onClick={() => handleApproveAndPushAnnouncement(a.id)}>
                          Valider et diffuser
                        </Bouton>
                      ) : (
                        <Bouton className="flex-1" onClick={() => handleApproveAnnouncement(a.id)}>
                          Valider et publier
                        </Bouton>
                      )}
                      <Bouton variante="secondaire" className="flex-1" onClick={() => handleRejectAnnouncement(a.id)}>
                        Refuser
                      </Bouton>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {superadminActiveTab === "registrations" &&
          (pendingRegistrations.length === 0 ? (
            <EtatVide icone={<Building2 size={24} />} titre="Aucune demande d'adhésion" />
          ) : (
            <ul className="space-y-3">
              {pendingRegistrations.map((r) => (
                <CarteAdhesion key={r.id} reg={r} />
              ))}
            </ul>
          ))}

        {MODE_REEL && superadminActiveTab === "verifications" && (
          <div className="space-y-4">
            <Bandeau ton="horsLigne">
              Ne marquez une structure comme vérifiée qu'après avoir confirmé ses informations (contacts, tarifs, horaires) auprès d'elle. Seuls les centres
              vérifiés apparaissent sur la carte.
            </Bandeau>
            {(
              [
                ["centre", "Centres de santé", structuresAVerifier.centres],
                ["association", "Associations", structuresAVerifier.associations],
              ] as const
            ).map(([type, titre, liste]) => (
              <section key={type} className="space-y-2">
                <h3 className="text-corps font-semibold text-prune-900">
                  {titre} ({liste.filter((s: StructureAVerifier) => s.verifiee).length}/{liste.length} vérifiés)
                </h3>
                {liste.length === 0 ? (
                  <p className="text-petit text-texte-2">Aucune structure enregistrée.</p>
                ) : (
                  <ul className="space-y-2">
                    {liste.map((s: StructureAVerifier) => (
                      <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-carte border border-bordure bg-surface p-3">
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-1.5 truncate text-corps font-semibold text-prune-900">
                            {s.verifiee && <BadgeCheck size={18} aria-label="Vérifiée" className="shrink-0 text-succes" />} {s.nom}
                          </p>
                          <p className="text-petit text-texte-2">
                            {s.ville || "Ville non précisée"} · mise à jour {s.majLe}
                          </p>
                        </div>
                        <Bouton
                          variante={s.verifiee ? "secondaire" : "principal"}
                          taille="petit"
                          onClick={() => void basculerVerification(type, s.id, !s.verifiee)}
                          aria-label={`${s.verifiee ? "Retirer la vérification de" : "Marquer comme vérifié :"} ${s.nom}`}
                        >
                          {s.verifiee ? "Retirer la vérification" : "Marquer vérifié"}
                        </Bouton>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        )}

        {superadminActiveTab === "fiches" && (
          <Carte douce className="space-y-3">
            <p className="text-corps text-texte">
              {MODE_REEL
                ? `Relecture des fiches de Rose IA (${fichesAValider.length} à relire) et désignation des docteurs validateurs.`
                : "Démonstration du parcours d'entraînement de Rose IA par un docteur."}
            </p>
            <Bouton
              icone={<ClipboardList size={18} aria-hidden />}
              onClick={() => {
                setShowSuperadminModal(false);
                setShowDoctorTrainModal(true);
              }}
            >
              {MODE_REEL ? "Fiches Rose IA : relecture et validateurs" : "Audit : simuler l'entraînement docteur"}
            </Bouton>
          </Carte>
        )}
      </div>
    </Feuille>
  );
}
