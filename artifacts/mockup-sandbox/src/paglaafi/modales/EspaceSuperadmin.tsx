import { Activity, GraduationCap, ShieldCheck, Sparkles, X } from "lucide-react";
import { useAuth, useDocteur, useAnnonces, useAdministration } from "../etat/contextes";
import { MODE_REEL } from "../config";
import type { StructureAVerifier } from "../depot/verifications";

/**
 * Panneau Superadmin : statistiques, modération des annonces et adhésions,
 * et (mode réel) vérification des centres et associations.
 */
export function EspaceSuperadmin() {
  const { pendingRegistrations } = useAuth();
  const { setShowDoctorTrainModal } = useDocteur();
  const { announcements, handleApproveAndPushAnnouncement, handleApproveAnnouncement, handleRejectAnnouncement } =
    useAnnonces();
  const {
    basculerVerification,
    structuresAVerifier,
    handleApproveRegistration,
    handleRejectRegistration,
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

  if (!showSuperadminModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]">
      <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl border-2 border-purple-900 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-950 text-white">
              <ShieldCheck size={20} className="text-amber-400" />
            </div>
            <div>
              <h3 className="ph-display text-sm font-bold text-[#351c2a]">Superadmin National</h3>
              <p className="text-[10px] text-purple-900 font-bold">Modération & Statistiques Nationales</p>
            </div>
          </div>
          <button
            onClick={() => setShowSuperadminModal(false)}
            className="grid h-8 w-8 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
          >
            <X size={18} />
          </button>
        </div>

        {/* 3 ONGLETS DU SUPERADMIN */}
        <div className="mt-3 flex rounded-xl bg-[#f5eaf0] p-1 text-[11px] font-bold">
          <button
            onClick={() => setSuperadminActiveTab("stats")}
            className={`flex-1 rounded-lg py-1.5 transition ${superadminActiveTab === "stats" ? "bg-purple-950 text-white shadow-xs" : "text-purple-900"}`}
          >
            📊 Trafic & Stats
          </button>
          <button
            onClick={() => setSuperadminActiveTab("announcements")}
            className={`flex-1 rounded-lg py-1.5 transition relative ${superadminActiveTab === "announcements" ? "bg-purple-950 text-white shadow-xs" : "text-purple-900"}`}
          >
            📢 Annonces ({announcements.filter((a) => a.status === "pending_validation").length})
          </button>
          <button
            onClick={() => setSuperadminActiveTab("registrations")}
            className={`flex-1 rounded-lg py-1.5 transition ${superadminActiveTab === "registrations" ? "bg-purple-950 text-white shadow-xs" : "text-purple-900"}`}
          >
            🏥 Inscriptions ({pendingRegistrations.filter((r) => r.status === "pending").length})
          </button>
          {/* Vérification des structures : uniquement en mode réel (base Supabase) */}
          {MODE_REEL && (
            <button
              onClick={() => setSuperadminActiveTab("verifications")}
              className={`flex-1 rounded-lg py-1.5 transition ${superadminActiveTab === "verifications" ? "bg-purple-950 text-white shadow-xs" : "text-purple-900"}`}
            >
              ✅ Vérifs (
              {[...structuresAVerifier.centres, ...structuresAVerifier.associations].filter((s) => !s.verifiee).length})
            </button>
          )}
        </div>

        {/* Raccourci Audit & Simulation Entraînement Docteur pour Superadmin */}
        <button
          type="button"
          onClick={() => {
            setShowSuperadminModal(false);
            setShowDoctorTrainModal(true);
          }}
          className="mt-2.5 flex w-full items-center justify-between rounded-xl bg-amber-50 border border-amber-300 p-2 text-xs font-bold text-amber-950 hover:bg-amber-100 transition shadow-2xs"
        >
          <span className="flex items-center gap-1.5">
            <GraduationCap size={15} className="text-amber-700" />
            <span>Audit : Simuler l'Entraînement Docteur</span>
          </span>
          <span className="bg-amber-200 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold">4 étapes →</span>
        </button>

        {/* ONGLET 1 : STATISTIQUES DE VISITES DU SITE & RECENSEMENT DES CENTRES PAR VILLE/RÉGION */}
        {superadminActiveTab === "stats" && (
          <div className="mt-3.5 space-y-3 text-xs ph-enter">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-purple-50 border border-purple-200 p-3">
                <span className="text-[9.5px] font-bold text-purple-800 uppercase">Visites totales</span>
                <p className="text-lg font-extrabold text-purple-950 mt-0.5">48 320</p>
                <p className="text-[9px] text-emerald-700 font-bold">▲ +31% ce mois</p>
              </div>
              <div className="rounded-2xl bg-pink-50 border border-pink-200 p-3">
                <span className="text-[9.5px] font-bold text-[#ea2d6d] uppercase">Femmes uniques</span>
                <p className="text-lg font-extrabold text-[#742d45] mt-0.5">14 210</p>
                <p className="text-[9px] text-[#742d45]">Utilisatrices actives</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3">
                <span className="text-[9.5px] font-bold text-amber-900 uppercase">Rose IA Vocale</span>
                <p className="text-lg font-extrabold text-amber-950 mt-0.5">9 430</p>
                <p className="text-[9px] text-amber-800">Questions traitées</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3">
                <span className="text-[9.5px] font-bold text-emerald-900 uppercase">Dons collectés</span>
                <p className="text-lg font-extrabold text-emerald-950 mt-0.5">14,8 M F</p>
                <p className="text-[9px] text-emerald-700 font-bold">Via Orange Money</p>
              </div>
            </div>

            {/* ================================================================= */}
            {/* RECENSEMENT DES CENTRES LES PLUS FRÉQUENTÉS PAR VILLE ET RÉGION   */}
            {/* ================================================================= */}
            <div className="rounded-2xl border-2 border-purple-300 bg-white p-3.5 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <Activity size={16} className="text-purple-900" />
                  <h4 className="ph-display text-xs font-bold text-purple-950">Centres les plus fréquentés</h4>
                </div>
                <span className="text-[9.5px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                  {superadminSortedCenters.length} centres
                </span>
              </div>

              {/* Filtres par Ville & Région */}
              <div className="flex flex-wrap items-center gap-1 text-[10px] font-bold">
                {[
                  { id: "all", label: "🇧🇫 Tout le pays" },
                  { id: "Centre", label: "📍 Ouaga (Centre)" },
                  { id: "Hauts-Bassins", label: "📍 Bobo (Hauts-Bassins)" },
                  { id: "Centre-Ouest", label: "📍 Koudougou" },
                ].map((reg) => (
                  <button
                    key={reg.id}
                    onClick={() => setSuperadminRegionFilter(reg.id)}
                    className={`rounded-lg px-2 py-1 transition ${
                      superadminRegionFilter === reg.id
                        ? "bg-purple-950 text-white shadow-xs"
                        : "bg-[#f5eaf0] text-purple-900 hover:bg-[#ebdbe5]"
                    }`}
                  >
                    {reg.label}
                  </button>
                ))}
              </div>

              {/* Palmarès classé par fréquentation */}
              <div className="space-y-2 pt-1">
                {superadminSortedCenters.map((center, index) => {
                  const monthlyEstimated = center.confirmedVisitsToday * 24;
                  const rankColor =
                    index === 0
                      ? "bg-amber-400 text-amber-950 font-black shadow-xs ring-2 ring-amber-300"
                      : index === 1
                        ? "bg-slate-300 text-slate-900 font-bold"
                        : index === 2
                          ? "bg-amber-700 text-white font-bold"
                          : "bg-purple-100 text-purple-900 font-semibold";

                  return (
                    <div
                      key={center.id}
                      className="rounded-xl border border-purple-100 bg-purple-50/40 p-2.5 transition hover:bg-purple-50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <span
                            className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg text-[10px] ${rankColor}`}
                          >
                            #{index + 1}
                          </span>
                          <div>
                            <h5 className="font-bold text-[#351c2a] text-[11.5px] leading-tight">{center.shortName}</h5>
                            <p className="text-[10px] text-purple-800">
                              {center.place} ({center.city})
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-purple-950 block">
                            {center.confirmedVisitsToday} femmes/j
                          </span>
                          <span className="text-[9px] text-[#865d70]">
                            ~{monthlyEstimated.toLocaleString("fr-FR")} /mois
                          </span>
                        </div>
                      </div>

                      {/* Jauge d'affluence et détails */}
                      <div className="mt-2 pt-1.5 border-t border-purple-100/80 flex items-center justify-between text-[9.5px]">
                        <span className="flex items-center gap-1 font-semibold text-[#5a3b4c]">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              center.isApparatusWorking ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                          {center.isApparatusWorking ? "Mammographe actif" : "Mammographe en révision"}
                        </span>
                        <span className="text-purple-900 font-bold">Attente : {center.estimatedWait}</span>
                        <span className="text-purple-800">👥 {center.agentsPresent} soignants</span>
                      </div>

                      {/* Barre de tension relative */}
                      <div className="mt-1.5 h-1.5 w-full rounded-full bg-purple-100 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            center.confirmedVisitsToday >= 60
                              ? "bg-rose-500"
                              : center.confirmedVisitsToday >= 30
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                          }`}
                          style={{
                            width: `${Math.min(100, (center.confirmedVisitsToday / 80) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Répartition géographique des visites au Burkina */}
            <div className="rounded-2xl border border-[#ebd6dc] bg-[#fffafc] p-3 space-y-2">
              <span className="font-bold text-[#580e36] block">Répartition des visites par région :</span>
              <div className="space-y-1.5 text-[11px]">
                <div>
                  <div className="flex justify-between text-[#5f4150]">
                    <span>Centre (Ouagadougou & environs)</span>
                    <span className="font-bold">57%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-[#ea2d6d]" style={{ width: "57%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[#5f4150]">
                    <span>Hauts-Bassins (Bobo-Dioulasso)</span>
                    <span className="font-bold">25%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-emerald-600" style={{ width: "25%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[#5f4150]">
                    <span>Centre-Ouest (Koudougou)</span>
                    <span className="font-bold">12%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: "12%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[#5f4150]">
                    <span>Autres provinces (Nord, Sahel, Est)</span>
                    <span className="font-bold">6%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: "6%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET 2 : MODÉRATION DES ANNONCES & VEILLE RADAR ROSE IA */}
        {superadminActiveTab === "announcements" && (
          <div className="mt-3.5 space-y-3 text-xs ph-enter">
            {/* Sous-onglets de tri : Tout / Veille Rose IA / Partenaires */}
            <div className="flex items-center gap-1 bg-[#f5eaf0] p-1 rounded-xl text-[10.5px] font-bold">
              <button
                onClick={() => setSuperadminAnnouncementTab("all")}
                className={`flex-1 py-1 rounded-lg transition ${
                  superadminAnnouncementTab === "all" ? "bg-purple-950 text-white shadow-xs" : "text-purple-900"
                }`}
              >
                Toutes ({announcements.filter((a) => a.status === "pending_validation").length})
              </button>
              <button
                onClick={() => setSuperadminAnnouncementTab("rose_ai")}
                className={`flex-1 py-1 rounded-lg transition inline-flex items-center justify-center gap-1 ${
                  superadminAnnouncementTab === "rose_ai" ? "bg-purple-950 text-white shadow-xs" : "text-purple-900"
                }`}
              >
                <Sparkles size={11} className="text-amber-400" />
                <span>
                  Veille Rose IA (
                  {announcements.filter((a) => a.status === "pending_validation" && a.isRoseAIDetected).length})
                </span>
              </button>
              <button
                onClick={() => setSuperadminAnnouncementTab("partners")}
                className={`flex-1 py-1 rounded-lg transition ${
                  superadminAnnouncementTab === "partners" ? "bg-purple-950 text-white shadow-xs" : "text-purple-900"
                }`}
              >
                Partenaires (
                {announcements.filter((a) => a.status === "pending_validation" && !a.isRoseAIDetected).length})
              </button>
            </div>

            {/* Liste des annonces à modérer */}
            <div className="space-y-2.5">
              {announcements
                .filter((a) => {
                  if (a.status !== "pending_validation") return false;
                  if (superadminAnnouncementTab === "rose_ai") return a.isRoseAIDetected;
                  if (superadminAnnouncementTab === "partners") return !a.isRoseAIDetected;
                  return true;
                })
                .map((ann) => (
                  <div
                    key={ann.id}
                    className={`rounded-2xl p-3 text-xs space-y-2 border-2 ${
                      ann.isRoseAIDetected
                        ? "border-purple-400 bg-gradient-to-br from-purple-50 via-white to-pink-50/50 shadow-sm"
                        : "border-amber-300 bg-amber-50/70"
                    }`}
                  >
                    {/* Badge et Origine */}
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-[#3a1d2d] text-[12px] leading-tight">{ann.title}</span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          ann.isRoseAIDetected ? "bg-purple-900 text-white" : "bg-amber-200 text-amber-900"
                        }`}
                      >
                        {ann.isRoseAIDetected ? "🤖 Veille Web Rose IA" : "En attente partenaire"}
                      </span>
                    </div>

                    {/* Source internet pour la veille Rose IA */}
                    {ann.isRoseAIDetected && (
                      <div className="rounded-xl bg-purple-100/70 p-2 text-[10px] space-y-0.5 text-purple-950">
                        <p className="font-bold flex items-center gap-1">
                          <span>🌐 Source détectée :</span>
                          <span className="text-purple-800 font-normal">{ann.sourceWebUrl}</span>
                        </p>
                        <p className="font-bold flex items-center gap-1">
                          <span>🎯 Indice de confiance IA :</span>
                          <span className="text-emerald-700">{ann.aiConfidence}</span>
                        </p>
                        <p className="mt-1 italic text-[9.5px] text-purple-900">
                          📲 <strong>Notification push préparée :</strong> « {ann.pushMessageFr} »
                        </p>
                      </div>
                    )}

                    <p className="text-[10.5px] text-[#863e58] font-semibold">
                      {ann.author} · {ann.city} ({ann.date})
                    </p>
                    <p className="text-[11px] text-[#553b49] leading-relaxed">{ann.content}</p>
                    <p className="text-[10px] text-[#7d5d6d]">Contact : {ann.contact}</p>

                    {/* Actions : Validation avec diffusion Push ou Rejet */}
                    <div className="pt-2 flex gap-2">
                      {ann.isRoseAIDetected ? (
                        <button
                          onClick={() => handleApproveAndPushAnnouncement(ann.id)}
                          className="flex-1 rounded-xl bg-gradient-to-r from-purple-900 to-[#ea2d6d] py-2 font-bold text-white shadow-sm text-center hover:opacity-95 flex items-center justify-center gap-1.5"
                          title="Valider officiellement l'annonce et envoyer un push bienveillant aux femmes"
                        >
                          <Sparkles size={14} className="text-amber-300" />
                          <span>Valider & Diffuser en Push 🚀</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApproveAnnouncement(ann.id)}
                          className="flex-1 rounded-xl bg-emerald-600 py-1.5 font-bold text-white shadow-xs text-center hover:bg-emerald-700"
                        >
                          Valider & Publier ✓
                        </button>
                      )}

                      <button
                        onClick={() => handleRejectAnnouncement(ann.id)}
                        className="rounded-xl border border-rose-300 bg-white px-3 py-1.5 font-bold text-rose-700 hover:bg-rose-50"
                      >
                        Refuser
                      </button>
                    </div>
                  </div>
                ))}

              {announcements.filter((a) => {
                if (a.status !== "pending_validation") return false;
                if (superadminAnnouncementTab === "rose_ai") return a.isRoseAIDetected;
                if (superadminAnnouncementTab === "partners") return !a.isRoseAIDetected;
                return true;
              }).length === 0 && (
                <div className="rounded-xl border border-[#ebd6dc] p-4 text-center text-[#825b6d]">
                  Aucune annonce en attente dans cette catégorie.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ONGLET 4 (mode réel) : VÉRIFICATION DES CENTRES ET ASSOCIATIONS */}
        {MODE_REEL && superadminActiveTab === "verifications" && (
          <div className="mt-3.5 space-y-3 text-xs ph-enter">
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-2 text-[10.5px] text-amber-900">
              Ne marquez une structure comme vérifiée qu'après avoir confirmé ses informations (contacts, tarifs,
              horaires) auprès d'elle. Seuls les centres vérifiés apparaissent sur la carte.
            </p>
            {(
              [
                ["centre", "Centres de santé", structuresAVerifier.centres],
                ["association", "Associations", structuresAVerifier.associations],
              ] as const
            ).map(([type, titre, liste]) => (
              <div key={type}>
                <p className="mb-1.5 font-bold text-[#580e36]">
                  {titre} ({liste.filter((s: StructureAVerifier) => s.verifiee).length}/{liste.length} vérifiés)
                </p>
                <div className="space-y-1.5">
                  {liste.length === 0 && <p className="text-[11px] text-[#916b7c]">Aucune structure enregistrée.</p>}
                  {liste.map((s: StructureAVerifier) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between gap-2 rounded-xl border border-[#ebd6dc] bg-[#fffafc] p-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-bold text-[#580e36]">{s.nom}</p>
                        <p className="text-[10px] text-[#916b7c]">
                          {s.ville || "Ville non précisée"} · maj {s.majLe}
                        </p>
                      </div>
                      <button
                        onClick={() => void basculerVerification(type, s.id, !s.verifiee)}
                        aria-label={`${s.verifiee ? "Retirer la vérification de" : "Marquer comme vérifié :"} ${s.nom}`}
                        className={`shrink-0 rounded-lg px-2.5 py-1 text-[10.5px] font-bold ${s.verifiee ? "border border-rose-300 bg-rose-50 text-rose-700" : "bg-emerald-600 text-white shadow-xs"}`}
                      >
                        {s.verifiee ? "Retirer la vérification" : "Marquer vérifié ✓"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ONGLET 3 : DEMANDES D'ADHÉSION DES STRUCTURES */}
        {superadminActiveTab === "registrations" && (
          <div className="mt-3.5 space-y-2 text-xs ph-enter">
            <p className="font-bold text-[#580e36]">
              Demandes d'adhésion en attente ({pendingRegistrations.filter((r) => r.status === "pending").length}) :
            </p>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {pendingRegistrations.map((reg) => (
                <div key={reg.id} className="rounded-xl border border-[#ebd6dc] bg-[#fffafc] p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#580e36]">{reg.structure}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${reg.status === "pending" ? "bg-amber-100 text-amber-900" : reg.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}
                    >
                      {reg.status === "pending" ? "En attente" : reg.status === "approved" ? "Validé ✓" : "Refusé"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#735765] mt-0.5">
                    Resp. : {reg.responsable} · {reg.telephone}
                  </p>
                  <p className="text-[10px] text-[#916b7c]">
                    {reg.ville} · {reg.type}
                  </p>

                  {reg.status === "pending" && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleApproveRegistration(reg.id)}
                        className="flex-1 rounded-lg bg-emerald-600 py-1 text-center font-bold text-white shadow-xs"
                      >
                        Valider l'inscription
                      </button>
                      <button
                        onClick={() => handleRejectRegistration(reg.id)}
                        className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1 font-bold text-rose-700"
                      >
                        Refuser
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
