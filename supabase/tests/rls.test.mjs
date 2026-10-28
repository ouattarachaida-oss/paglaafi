/**
 * Tests des règles d'accès (RLS, privilèges, triggers) contre le projet Supabase.
 *
 * Usage : pnpm run db:test-rls
 *
 * Pour chaque rôle, vérifie ce qui est AUTORISÉ et ce qui est REFUSÉ, y compris
 * les tentatives de se donner un rôle depuis le client. Les vérifications passent
 * par la clé publishable, exactement comme l'application. La clé secrète ne sert
 * qu'à créer puis supprimer les comptes et données de test (préfixe RLS-TEST).
 * Aucune valeur secrète n'est affichée.
 */
import { createClient } from "@supabase/supabase-js";
import { exiger, lireEnv } from "../scripts/env.mjs";

const env = lireEnv();
exiger(env, "VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY", "SUPABASE_SECRET_KEY");
const URL_PROJET = env.VITE_SUPABASE_URL;
const OPTIONS = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(URL_PROJET, env.SUPABASE_SECRET_KEY, OPTIONS);
const anonyme = () => createClient(URL_PROJET, env.VITE_SUPABASE_PUBLISHABLE_KEY, OPTIONS);

const PREFIXE = `RLS-TEST-${Date.now()}`;
const MOT_DE_PASSE = `Rls!${Math.random().toString(36).slice(2)}A9`;
const resultats = [];
const creeIds = { users: [], centres: [], associations: [] };

// ---------------------------------------------------------------------------
// Outils
// ---------------------------------------------------------------------------
function noter(role, attendu, description, ok, detail = "") {
  resultats.push({ role, attendu, description, ok, detail });
  console.log(`${ok ? "✓" : "✗"} [${role}] ${attendu === "autorisé" ? "AUTORISÉ" : "REFUSÉ "} ${description}${!ok && detail ? ` — ${detail}` : ""}`);
}

/** La requête doit réussir (et toucher au moins `min` lignes si précisé). */
async function autorise(role, description, requete, min = 1) {
  const { data, error } = await requete;
  const n = Array.isArray(data) ? data.length : data === null ? 0 : 1;
  noter(role, "autorisé", description, !error && n >= min, error ? error.message : `${n} ligne(s)`);
  return data;
}

/** La requête doit échouer ou ne toucher aucune ligne. */
async function refuse(role, description, requete) {
  const { data, error } = await requete;
  const n = Array.isArray(data) ? data.length : data ? 1 : 0;
  noter(role, "refusé", description, Boolean(error) || n === 0, error ? "" : `${n} ligne(s) touchée(s)`);
}

function verifier(role, attendu, description, condition, detail = "") {
  noter(role, attendu, description, condition, detail);
}

async function creerCompte(nom, metadonnees = {}) {
  const email = `${PREFIXE.toLowerCase()}-${nom}@example.com`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: MOT_DE_PASSE,
    email_confirm: true,
    user_metadata: { prenom: nom, nom: PREFIXE, ...metadonnees },
  });
  if (error) throw new Error(`Création du compte ${nom} impossible : ${error.message}`);
  creeIds.users.push(data.user.id);
  return { id: data.user.id, email };
}

async function connecter(compte) {
  const client = anonyme();
  const { error } = await client.auth.signInWithPassword({ email: compte.email, password: MOT_DE_PASSE });
  if (error) throw new Error(`Connexion impossible (${compte.email}) : ${error.message}`);
  return client;
}

/** Attribue un rôle comme le ferait un administrateur (clé secrète, hors application). */
async function definirRole(compte, champs) {
  const { error } = await admin.from("profils").update(champs).eq("id", compte.id);
  if (error) throw new Error(`Attribution de rôle impossible : ${error.message}`);
}

// ---------------------------------------------------------------------------
// Préparation : structures et comptes de test
// ---------------------------------------------------------------------------
async function preparer() {
  const { data: centres, error: e1 } = await admin
    .from("centres")
    .insert([
      { nom: `${PREFIXE} Centre A`, nom_court: `${PREFIXE}-A`, ville: "Ouagadougou", verifie: false },
      { nom: `${PREFIXE} Centre B`, nom_court: `${PREFIXE}-B`, ville: "Bobo-Dioulasso", verifie: true },
    ])
    .select("id, nom_court");
  if (e1) throw new Error(`Création des centres de test impossible : ${e1.message}`);
  creeIds.centres.push(...centres.map((c) => c.id));
  const { data: asso, error: e2 } = await admin
    .from("associations")
    .insert({ nom: `${PREFIXE} Association`, verifiee: false })
    .select("id")
    .single();
  if (e2) throw new Error(`Création de l'association de test impossible : ${e2.message}`);
  creeIds.associations.push(asso.id);

  const [centreA, centreB] = centres;
  const comptes = {
    utilisatrice: await creerCompte("utilisatrice"),
    utilisatrice2: await creerCompte("utilisatrice2"),
    adminCentre: await creerCompte("admin-centre"),
    docteur: await creerCompte("docteur"),
    adminAsso: await creerCompte("admin-asso"),
    superadmin: await creerCompte("superadmin"),
    demandeur: await creerCompte("demandeur", {
      demande_adhesion: { type_structure: "professionnel", nom_structure: `${PREFIXE} Cabinet`, specialite: "Sage-femme" },
    }),
    // Tentative d'élévation à l'inscription : le rôle dans les métadonnées doit être ignoré
    pirate: await creerCompte("pirate", { role: "superadmin" }),
    validateur: await creerCompte("validateur"),
  };
  await definirRole(comptes.adminCentre, { role: "admin_centre", centre_id: centreA.id });
  await definirRole(comptes.docteur, { role: "docteur", centre_id: centreA.id });
  await definirRole(comptes.adminAsso, { role: "admin_association", association_id: asso.id });
  await definirRole(comptes.superadmin, { role: "superadmin" });
  await definirRole(comptes.validateur, { role: "docteur", centre_id: centreB.id });
  return { comptes, centreA, centreB, asso };
}

// ---------------------------------------------------------------------------
// Scénarios
// ---------------------------------------------------------------------------
async function tester({ comptes, centreA, centreB, asso }) {
  const anon = anonyme();
  const u = await connecter(comptes.utilisatrice);
  const u2 = await connecter(comptes.utilisatrice2);
  const ac = await connecter(comptes.adminCentre);
  const doc = await connecter(comptes.docteur);
  const aa = await connecter(comptes.adminAsso);
  const sa = await connecter(comptes.superadmin);

  // --- Inscription ---------------------------------------------------------
  const { data: pirate } = await admin.from("profils").select("role").eq("id", comptes.pirate.id).single();
  verifier("inscription", "refusé", "rôle « superadmin » passé dans les métadonnées d'inscription", pirate?.role === "utilisatrice", `rôle obtenu : ${pirate?.role}`);
  const { data: demandeInit } = await admin.from("demandes_adhesion").select("id, statut").eq("demandeur_id", comptes.demandeur.id);
  verifier("inscription", "autorisé", "demande d'adhésion créée en attente à l'inscription", demandeInit?.length === 1 && demandeInit[0].statut === "en_attente");

  // --- Visiteur anonyme ----------------------------------------------------
  const { data: centresAnon } = await anon.from("centres").select("id").in("id", [centreA.id, centreB.id]);
  verifier("anonyme", "autorisé", "lire un centre vérifié", centresAnon?.some((c) => c.id === centreB.id));
  verifier("anonyme", "refusé", "lire un centre non vérifié", !centresAnon?.some((c) => c.id === centreA.id));
  await refuse("anonyme", "lire les profils", anon.from("profils").select("id"));
  await refuse("anonyme", "modifier un centre", anon.from("centres").update({ file_attente: 1 }).eq("id", centreB.id).select());
  await refuse("anonyme", "créer une annonce", anon.from("annonces").insert({ titre: `${PREFIXE} anon`, contenu: "Contenu" }).select());
  await refuse("anonyme", "valider une demande d'adhésion", anon.rpc("approuver_demande", { p_demande: demandeInit[0].id }));

  // --- Utilisatrice ----------------------------------------------------------
  await autorise("utilisatrice", "lire son propre profil", u.from("profils").select("id").eq("id", comptes.utilisatrice.id));
  const { data: profilsVus } = await u.from("profils").select("id");
  verifier("utilisatrice", "refusé", "lire le profil des autres", profilsVus?.length === 1, `${profilsVus?.length} profil(s) visibles`);
  await autorise("utilisatrice", "modifier son nom et son téléphone", u.from("profils").update({ nom: `${PREFIXE} modifié`, telephone: "70000000" }).eq("id", comptes.utilisatrice.id).select());
  await refuse("utilisatrice", "se donner le rôle superadmin (update profils.role)", u.from("profils").update({ role: "superadmin" }).eq("id", comptes.utilisatrice.id).select());
  await refuse("utilisatrice", "se rattacher à un centre (update profils.centre_id)", u.from("profils").update({ centre_id: centreA.id }).eq("id", comptes.utilisatrice.id).select());
  await refuse("utilisatrice", "créer un profil supplémentaire", u.from("profils").insert({ id: comptes.pirate.id, role: "superadmin" }).select());
  await refuse("utilisatrice", "modifier le profil d'une autre", u.from("profils").update({ nom: "piraté" }).eq("id", comptes.utilisatrice2.id).select());
  await u.auth.updateUser({ data: { role: "superadmin" } });
  const { data: apresMeta } = await admin.from("profils").select("role").eq("id", comptes.utilisatrice.id).single();
  verifier("utilisatrice", "refusé", "devenir superadmin via ses métadonnées Auth (updateUser)", apresMeta?.role === "utilisatrice", `rôle : ${apresMeta?.role}`);
  await refuse("utilisatrice", "valider une demande d'adhésion (rpc approuver_demande)", u.rpc("approuver_demande", { p_demande: demandeInit[0].id }));
  await refuse("utilisatrice", "refuser une demande d'adhésion (rpc refuser_demande)", u.rpc("refuser_demande", { p_demande: demandeInit[0].id }));
  await refuse("utilisatrice", "modifier un centre", u.from("centres").update({ file_attente: 9 }).eq("id", centreB.id).select());
  await refuse("utilisatrice", "créer un centre", u.from("centres").insert({ nom: `${PREFIXE} pirate`, nom_court: "x", ville: "x" }).select());
  await refuse("utilisatrice", "créer une annonce", u.from("annonces").insert({ titre: `${PREFIXE} user`, contenu: "Contenu" }).select());
  const demandeU = await autorise(
    "utilisatrice",
    "déposer une demande d'adhésion pour elle-même",
    u.from("demandes_adhesion").insert({ type_structure: "association", nom_structure: `${PREFIXE} Asso Awa` }).select(),
  );
  await refuse("utilisatrice", "déposer une demande au nom d'une autre", u.from("demandes_adhesion").insert({ demandeur_id: comptes.utilisatrice2.id, type_structure: "association", nom_structure: `${PREFIXE} x` }).select());
  await refuse("utilisatrice", "choisir elle-même le centre de rattachement", u.from("demandes_adhesion").insert({ type_structure: "centre", nom_structure: `${PREFIXE} y`, centre_id: centreB.id }).select());
  await refuse("utilisatrice", "déposer une demande déjà approuvée", u.from("demandes_adhesion").insert({ type_structure: "centre", nom_structure: `${PREFIXE} z`, statut: "approuvee" }).select());
  await refuse("utilisatrice", "modifier le statut de sa demande", u.from("demandes_adhesion").update({ statut: "approuvee" }).eq("id", demandeU?.[0]?.id ?? -1).select());
  const rappel = await autorise("utilisatrice", "créer un rappel", u.from("rappels").insert({ titre: "Dépistage", date_texte: "24 Octobre 2026", type: "screening" }).select());
  await autorise("utilisatrice", "modifier son rappel", u.from("rappels").update({ actif: false }).eq("id", rappel?.[0]?.id ?? -1).select());
  await refuse("utilisatrice", "créer un rappel pour une autre", u.from("rappels").insert({ utilisatrice_id: comptes.utilisatrice2.id, titre: "x", date_texte: "x", type: "screening" }).select());
  await refuse("utilisatrice 2", "lire les rappels d'une autre", u2.from("rappels").select("id").eq("id", rappel?.[0]?.id ?? -1));
  await refuse("utilisatrice 2", "supprimer le rappel d'une autre", u2.from("rappels").delete().eq("id", rappel?.[0]?.id ?? -1).select());
  await autorise("utilisatrice", "supprimer son rappel", u.from("rappels").delete().eq("id", rappel?.[0]?.id ?? -1).select());

  // --- Admin centre ------------------------------------------------------------
  await autorise("admin centre", "lire son centre (même non vérifié)", ac.from("centres").select("id").eq("id", centreA.id));
  await autorise("admin centre", "mettre à jour les disponibilités de son centre", ac.from("centres").update({ file_attente: 4, statut: "busy", attente_estimee: "~30 min" }).eq("id", centreA.id).select());
  await autorise("admin centre", "indiquer son centre « Fermé » et ses examens et tarifs", ac.from("centres").update({ statut: "closed", examens: [{ name: "Échographie", price: 5000, free: false, notes: "" }] }).eq("id", centreA.id).select());
  const { data: majA } = await admin.from("centres").select("maj_par").eq("id", centreA.id).single();
  verifier("admin centre", "autorisé", "auteur de la mise à jour enregistré automatiquement", majA?.maj_par === comptes.adminCentre.id);
  await refuse("admin centre", "marquer son centre comme vérifié", ac.from("centres").update({ verifie: true }).eq("id", centreA.id).select());
  await refuse("admin centre", "changer le nom ou les coordonnées de son centre", ac.from("centres").update({ nom: "Autre nom", lat: 0 }).eq("id", centreA.id).select());
  await refuse("admin centre", "modifier un autre centre", ac.from("centres").update({ file_attente: 99 }).eq("id", centreB.id).select());
  await refuse("admin centre", "supprimer son centre", ac.from("centres").delete().eq("id", centreA.id).select());
  await refuse("admin centre", "se changer en admin d'un autre centre", ac.from("profils").update({ centre_id: centreB.id }).eq("id", comptes.adminCentre.id).select());
  const annonceAC = await autorise("admin centre", "créer une annonce (en attente)", ac.from("annonces").insert({ titre: `${PREFIXE} Journée dépistage`, contenu: "Annonce de test" }).select());
  verifier("admin centre", "autorisé", "annonce créée avec le statut « en attente » et le nom du centre", annonceAC?.[0]?.statut === "en_attente" && annonceAC?.[0]?.auteur_nom === centreA.nom_court);
  await refuse("admin centre", "créer une annonce directement publiée", ac.from("annonces").insert({ titre: `${PREFIXE} publiée`, contenu: "x", statut: "publiee" }).select());
  await refuse("admin centre", "publier sa propre annonce", ac.from("annonces").update({ statut: "publiee" }).eq("id", annonceAC?.[0]?.id ?? -1).select());
  await refuse("anonyme", "voir une annonce en attente", anon.from("annonces").select("id").eq("id", annonceAC?.[0]?.id ?? -1));
  await refuse("utilisatrice", "voir l'annonce en attente d'un partenaire", u.from("annonces").select("id").eq("id", annonceAC?.[0]?.id ?? -1));

  // --- Docteur -----------------------------------------------------------------
  await autorise("docteur", "mettre à jour les disponibilités de son centre", doc.from("centres").update({ agents_presents: 3 }).eq("id", centreA.id).select());
  await refuse("docteur", "modifier un autre centre", doc.from("centres").update({ agents_presents: 3 }).eq("id", centreB.id).select());
  await refuse("docteur", "valider une annonce", doc.from("annonces").update({ statut: "publiee" }).eq("id", annonceAC?.[0]?.id ?? -1).select());

  // --- Admin association -------------------------------------------------------
  await autorise("admin asso", "modifier la mission de son association", aa.from("associations").update({ mission: "Mission de test" }).eq("id", asso.id).select());
  await refuse("admin asso", "marquer son association comme vérifiée", aa.from("associations").update({ verifiee: true }).eq("id", asso.id).select());
  await refuse("admin asso", "modifier un centre", aa.from("centres").update({ file_attente: 1 }).eq("id", centreA.id).select());
  const annonceAA = await autorise("admin asso", "créer une annonce (en attente)", aa.from("annonces").insert({ titre: `${PREFIXE} Caravane`, contenu: "Annonce de test" }).select());
  await refuse("admin asso", "lire les demandes d'adhésion des autres", aa.from("demandes_adhesion").select("id").eq("id", demandeInit[0].id));

  // --- Superadmin --------------------------------------------------------------
  const { data: tousProfils } = await sa.from("profils").select("id").in("id", creeIds.users);
  verifier("superadmin", "autorisé", "lire tous les profils", tousProfils?.length === creeIds.users.length, `${tousProfils?.length}/${creeIds.users.length}`);
  await autorise("superadmin", "lire toutes les demandes d'adhésion", sa.from("demandes_adhesion").select("id").eq("id", demandeInit[0].id));
  await autorise("superadmin", "publier une annonce", sa.from("annonces").update({ statut: "publiee" }).eq("id", annonceAC?.[0]?.id ?? -1).select());
  const { data: publiee } = await anon.from("annonces").select("id, valide_par").eq("id", annonceAC?.[0]?.id ?? -1);
  verifier("anonyme", "autorisé", "voir l'annonce une fois publiée", publiee?.length === 1);
  await autorise("superadmin", "refuser une annonce avec motif", sa.from("annonces").update({ statut: "refusee", motif_refus: "Informations incomplètes" }).eq("id", annonceAA?.[0]?.id ?? -1).select());
  await autorise("superadmin", "vérifier un centre", sa.from("centres").update({ verifie: true }).eq("id", centreA.id).select());
  // Vérification des structures (onglet « Vérifications » du superadmin) : marquer ET retirer
  const { data: centreVerifieAnon } = await anon.from("centres").select("id").eq("id", centreA.id);
  verifier("anonyme", "autorisé", "voir un centre une fois vérifié par le superadmin", centreVerifieAnon?.length === 1);
  await refuse("docteur", "retirer la vérification de son centre", doc.from("centres").update({ verifie: false }).eq("id", centreA.id).select());
  await refuse("admin centre", "retirer la vérification de son centre", ac.from("centres").update({ verifie: false }).eq("id", centreA.id).select());
  await autorise("superadmin", "marquer une association comme vérifiée", sa.from("associations").update({ verifiee: true }).eq("id", asso.id).select());
  await refuse("admin asso", "retirer la vérification de son association", aa.from("associations").update({ verifiee: false }).eq("id", asso.id).select());
  await refuse("utilisatrice", "marquer une association comme vérifiée", u.from("associations").update({ verifiee: true }).eq("id", asso.id).select());
  await autorise("superadmin", "retirer la vérification d'un centre", sa.from("centres").update({ verifie: false }).eq("id", centreB.id).select());
  const { data: centreRetireAnon } = await anon.from("centres").select("id").eq("id", centreB.id);
  verifier("anonyme", "refusé", "voir un centre dont la vérification a été retirée", centreRetireAnon?.length === 0);
  await autorise("superadmin", "retirer la vérification d'une association", sa.from("associations").update({ verifiee: false }).eq("id", asso.id).select());
  const { data: assoVue } = await anon.from("associations").select("id").eq("id", asso.id);
  verifier("anonyme", "refusé", "voir une association non vérifiée", assoVue?.length === 0);
  const { data: tout } = await sa.from("centres").select("id, verifie").in("id", [centreA.id, centreB.id]);
  verifier("superadmin", "autorisé", "lister les centres vérifiés ET non vérifiés", tout?.length === 2);
  await refuse("superadmin", "changer directement un rôle (passage obligé par approuver_demande)", sa.from("profils").update({ role: "docteur" }).eq("id", comptes.utilisatrice2.id).select());
  const { error: eApprouver } = await sa.rpc("approuver_demande", { p_demande: demandeInit[0].id, p_centre: centreA.id });
  verifier("superadmin", "autorisé", "valider une demande d'adhésion (avec rattachement au centre A)", !eApprouver, eApprouver?.message);
  const dem = await connecter(comptes.demandeur);
  const { data: profilDem } = await dem.from("profils").select("role, centre_id").eq("id", comptes.demandeur.id).single();
  verifier("demandeur", "autorisé", "devenu docteur rattaché au centre A après validation", profilDem?.role === "docteur" && profilDem?.centre_id === centreA.id, JSON.stringify(profilDem));
  await autorise("demandeur", "mettre à jour son centre une fois validé", dem.from("centres").update({ file_attente: 2 }).eq("id", centreA.id).select());
  const { error: eRefus } = await sa.rpc("refuser_demande", { p_demande: demandeU?.[0]?.id ?? -1, p_motif: "Test" });
  verifier("superadmin", "autorisé", "refuser une demande d'adhésion", !eRefus, eRefus?.message);
  const { data: profilU } = await admin.from("profils").select("role").eq("id", comptes.utilisatrice.id).single();
  verifier("utilisatrice", "refusé", "obtenir un rôle après le refus de sa demande", profilU?.role === "utilisatrice");
  const { error: eDouble } = await sa.rpc("approuver_demande", { p_demande: demandeInit[0].id });
  verifier("superadmin", "refusé", "valider deux fois la même demande", Boolean(eDouble));

  // --- Fiches de connaissance de Rose IA (phase 3) ---------------------------
  const val = await connecter(comptes.validateur);
  const fiche = (titre, extra = {}) => ({ titre: `${PREFIXE} ${titre}`, contenu: "Contenu de fiche de test, suffisamment long pour être accepté.", langue: "fr", ...extra });
  const ficheDoc = await autorise("docteur", "proposer une fiche (en attente)", doc.from("fiches_connaissance").insert(fiche("Fiche docteur")).select());
  const idDoc = ficheDoc?.[0]?.id ?? -1;
  verifier("docteur", "autorisé", "fiche enregistrée « en attente » avec son nom d'auteur", ficheDoc?.[0]?.statut === "en_attente" && Boolean(ficheDoc?.[0]?.auteur_nom));
  await refuse("docteur", "proposer une fiche directement validée", doc.from("fiches_connaissance").insert(fiche("Directement validée", { statut: "validee", source_titre: "OMS" })).select());
  await refuse("utilisatrice", "proposer une fiche", u.from("fiches_connaissance").insert(fiche("Fiche utilisatrice")).select());
  await refuse("admin centre", "proposer une fiche", ac.from("fiches_connaissance").insert(fiche("Fiche admin centre")).select());
  await refuse("anonyme", "proposer une fiche", anon.from("fiches_connaissance").insert(fiche("Fiche anonyme")).select());
  await refuse("docteur", "valider sa propre fiche (non désigné)", doc.from("fiches_connaissance").update({ statut: "validee", source_titre: "OMS" }).eq("id", idDoc).select());
  await refuse("docteur", "se désigner validateur (update profils.peut_valider)", doc.from("profils").update({ peut_valider: true }).eq("id", comptes.docteur.id).select());
  await refuse("validateur", "valider une fiche avant d'être désigné", val.from("fiches_connaissance").update({ statut: "validee", source_titre: "OMS" }).eq("id", idDoc).select());
  await refuse("utilisatrice", "désigner un validateur (rpc designer_validateur)", u.rpc("designer_validateur", { p_profil: comptes.utilisatrice.id, p_valeur: true }));
  await refuse("docteur", "lister les docteurs (rpc lister_docteurs)", doc.rpc("lister_docteurs"));
  await autorise("superadmin", "lister les docteurs", sa.rpc("lister_docteurs"));
  const { error: eDesign } = await sa.rpc("designer_validateur", { p_profil: comptes.validateur.id, p_valeur: true });
  verifier("superadmin", "autorisé", "désigner un docteur validateur", !eDesign, eDesign?.message);
  const { error: eDesignU } = await sa.rpc("designer_validateur", { p_profil: comptes.utilisatrice2.id, p_valeur: true });
  verifier("superadmin", "refusé", "désigner validatrice un compte qui n'est pas docteur", Boolean(eDesignU));
  await autorise("validateur", "voir les fiches en attente des autres", val.from("fiches_connaissance").select("id").eq("id", idDoc));
  await refuse("utilisatrice", "voir une fiche en attente", u.from("fiches_connaissance").select("id").eq("id", idDoc));
  await refuse("anonyme", "voir une fiche en attente", anon.from("fiches_connaissance").select("id").eq("id", idDoc));
  await refuse("validateur", "valider une fiche sans source", val.from("fiches_connaissance").update({ statut: "validee" }).eq("id", idDoc).select());
  const ficheVal = await autorise("validateur", "proposer sa propre fiche", val.from("fiches_connaissance").insert(fiche("Fiche du validateur")).select());
  await refuse("validateur", "valider sa propre fiche (quatre yeux)", val.from("fiches_connaissance").update({ statut: "validee", source_titre: "OMS" }).eq("id", ficheVal?.[0]?.id ?? -1).select());
  const validee = await autorise("validateur", "valider la fiche d'un autre docteur, avec source", val.from("fiches_connaissance").update({ statut: "validee", source_titre: "OMS, aide-mémoire (test)" }).eq("id", idDoc).select());
  verifier("validateur", "autorisé", "validation tracée (validateur et date)", validee?.[0]?.valide_par === comptes.validateur.id && Boolean(validee?.[0]?.valide_le));
  await autorise("anonyme", "voir une fiche validée", anon.from("fiches_connaissance").select("id").eq("id", idDoc));
  await autorise("utilisatrice", "voir une fiche validée", u.from("fiches_connaissance").select("id").eq("id", idDoc));
  await refuse("utilisatrice", "lire les morceaux indexés (embeddings)", u.from("fiches_morceaux").select("id"));
  await refuse("docteur", "insérer un morceau indexé", doc.from("fiches_morceaux").insert({ fiche_id: idDoc, ordre: 0, contenu: "x", embedding: `[${Array(768).fill(0).join(",")}]`, modele: "x" }).select());
  await refuse("utilisatrice", "appeler la recherche sémantique (rpc rechercher_fiches)", u.rpc("rechercher_fiches", { p_embedding: `[${Array(768).fill(0.1).join(",")}]`, p_nombre: 3 }));
  await refuse("utilisatrice", "consommer le quota d'une autre (rpc consommer_quota_rose)", u.rpc("consommer_quota_rose", { p_utilisateur: comptes.utilisatrice2.id, p_maximum: 99 }));
  await refuse("utilisatrice", "lire les quotas", u.from("rose_quota").select("utilisateur_id"));
  await doc.from("fiches_connaissance").update({ indexe_le: new Date().toISOString() }).eq("id", idDoc);
  const { data: apresIndex } = await admin.from("fiches_connaissance").select("indexe_le").eq("id", idDoc).single();
  verifier("docteur", "refusé", "marquer une fiche comme indexée depuis le client", apresIndex?.indexe_le === null);
  await autorise("docteur", "modifier sa fiche validée", doc.from("fiches_connaissance").update({ contenu: "Contenu modifié après validation, toujours assez long." }).eq("id", idDoc).select());
  const { data: apresModif } = await admin.from("fiches_connaissance").select("statut, valide_par").eq("id", idDoc).single();
  verifier("docteur", "autorisé", "fiche modifiée renvoyée automatiquement en relecture", apresModif?.statut === "en_attente" && apresModif?.valide_par === null, JSON.stringify(apresModif));
  await refuse("docteur", "modifier la fiche d'un autre docteur", doc.from("fiches_connaissance").update({ contenu: "Tentative de modification par un tiers, assez longue." }).eq("id", ficheVal?.[0]?.id ?? -1).select());
  await autorise("superadmin", "refuser une fiche avec motif", sa.from("fiches_connaissance").update({ statut: "refusee", motif_refus: "Source insuffisante" }).eq("id", ficheVal?.[0]?.id ?? -1).select());
  const { error: eRevoq } = await sa.rpc("designer_validateur", { p_profil: comptes.validateur.id, p_valeur: false });
  verifier("superadmin", "autorisé", "retirer la désignation d'un validateur", !eRevoq, eRevoq?.message);
  await refuse("validateur", "valider après retrait de sa désignation", val.from("fiches_connaissance").update({ statut: "validee", source_titre: "OMS" }).eq("id", idDoc).select());
  await autorise("docteur", "supprimer sa fiche non validée", doc.from("fiches_connaissance").delete().eq("id", idDoc).select());
}

// ---------------------------------------------------------------------------
// Nettoyage : comptes (et en cascade profils, rappels, annonces, demandes) et structures
// ---------------------------------------------------------------------------
async function nettoyer() {
  for (const id of creeIds.users) await admin.auth.admin.deleteUser(id);
  await admin.from("centres").delete().like("nom", `${PREFIXE}%`);
  await admin.from("associations").delete().like("nom", `${PREFIXE}%`);
  await admin.from("fiches_connaissance").delete().like("titre", `${PREFIXE}%`);
  const restes = await Promise.all([
    admin.from("profils").select("id", { count: "exact", head: true }).in("id", creeIds.users.length ? creeIds.users : ["00000000-0000-0000-0000-000000000000"]),
    admin.from("centres").select("id", { count: "exact", head: true }).like("nom", `${PREFIXE}%`),
    admin.from("associations").select("id", { count: "exact", head: true }).like("nom", `${PREFIXE}%`),
    admin.from("annonces").select("id", { count: "exact", head: true }).like("titre", `${PREFIXE}%`),
    admin.from("fiches_connaissance").select("id", { count: "exact", head: true }).like("titre", `${PREFIXE}%`),
  ]);
  const total = restes.reduce((s, r) => s + (r.count ?? 0), 0);
  console.log(total === 0 ? "\nNettoyage : aucune donnée de test restante." : `\n⚠️ Nettoyage incomplet : ${total} élément(s) restant(s).`);
}

try {
  const contexte = await preparer();
  await tester(contexte);
} catch (e) {
  console.error(`\nErreur pendant les tests : ${e.message}`);
  process.exitCode = 1;
} finally {
  await nettoyer();
}

const echecs = resultats.filter((r) => !r.ok);
const nbAutorises = resultats.filter((r) => r.attendu === "autorisé").length;
console.log(`\n${resultats.length} vérifications (${nbAutorises} autorisations, ${resultats.length - nbAutorises} refus) : ${echecs.length} échec(s).`);
if (echecs.length) process.exitCode = 1;
