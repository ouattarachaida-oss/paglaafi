import { Building2, Compass, UserRound } from "lucide-react";
import { MODE_DEMO } from "../config";
import type { AdminType } from "../types";
import { useUi, useAuth } from "../etat/contextes";
import { Bouton, Champ, ChampMotDePasse, ListeDeroulante, OngletsSegmentes } from "../composants/ui";

// Accès rapides du mode démo (profils fictifs)
const ACCES_DEMO = [
  { type: "user", role: "Utilisatrice", nom: "Aminata O." },
  { type: "center", role: "Centre de santé", nom: "Mme Sawadogo" },
  { type: "doctor", role: "Docteur", nom: "Dr. Sanou" },
  { type: "association", role: "Association", nom: "Dr. Sawadogo" },
  { type: "superadmin", role: "Superadmin", nom: "Alimata Kaboré" },
] as const;

/** Carte radio (choix du type de compte). */
function CarteChoix({
  actif,
  onChoisir,
  icone,
  titre,
  texte,
}: {
  actif: boolean;
  onChoisir: () => void;
  icone: React.ReactNode;
  titre: string;
  texte: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={actif}
      onClick={onChoisir}
      className={`flex min-h-[88px] flex-1 flex-col items-start gap-1 rounded-carte border-2 p-3 text-left transition-colors duration-200 ${
        actif ? "border-action bg-rose-100" : "border-bordure bg-surface"
      }`}
    >
      <span className={actif ? "text-action" : "text-texte-2"}>{icone}</span>
      <span className="text-corps font-semibold text-prune-900">{titre}</span>
      <span className="text-petit text-texte-2">{texte}</span>
    </button>
  );
}

/**
 * Écran de connexion / inscription.
 * Démo : connexion par téléphone (non vérifiée) et 5 accès rapides.
 * Réel : connexion et inscription par email + mot de passe (Supabase).
 */
export function EcranConnexion() {
  const { notify } = useUi();
  const {
    authMode,
    handleLoginSubmit,
    handleRegisterSubmit,
    loginForm,
    quickLoginAs,
    registerForm,
    setAuthMode,
    setCurrentUser,
    setLoginForm,
    setRegisterForm,
  } = useAuth();
  const structure = registerForm.role === "admin";

  const decouverte = () => {
    setCurrentUser({
      nom: "Visiteur",
      prenom: "Invité",
      telephone: "Mode Découverte",
      role: "user",
      roleLabel: "Visiteur libre",
    });
    notify("Bienvenue en mode découverte libre !");
  };

  return (
    <section className="anim-apparition space-y-5 py-2">
      <div className="flex flex-col items-center text-center">
        <img src="/images/pinkhub-mvp-paglaafi.png" alt="" className="h-16 w-16 object-contain" width={64} height={64} />
        <h1 className="mt-2 text-display text-prune-900">PagLaafi</h1>
        <p className="mt-1 text-corps text-texte-2">Information, orientation et solidarité autour du cancer du sein</p>
      </div>

      <OngletsSegmentes<"login" | "register">
        libelle="Connexion ou création de compte"
        valeur={authMode}
        onChange={setAuthMode}
        onglets={[
          { id: "login", libelle: "Se connecter" },
          { id: "register", libelle: "Créer un compte" },
        ]}
      />

      {authMode === "login" && (
        <div className="space-y-4">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {MODE_DEMO ? (
              <Champ
                libelle="Numéro de téléphone (+226)"
                type="tel"
                required
                value={loginForm.telephone}
                onChange={(e) => setLoginForm({ ...loginForm, telephone: e.target.value })}
                placeholder="70 12 34 56"
                autoComplete="tel"
              />
            ) : (
              <Champ
                id="connexion-email"
                libelle="Adresse email"
                type="email"
                required
                autoComplete="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="vous@exemple.bf"
              />
            )}
            <ChampMotDePasse
              id="connexion-mot-de-passe"
              libelle="Mot de passe"
              required
              autoComplete="current-password"
              value={loginForm.motDePasse}
              onChange={(e) => setLoginForm({ ...loginForm, motDePasse: e.target.value })}
            />
            <Bouton type="submit" taille="grand" pleineLargeur>
              Se connecter à mon compte
            </Bouton>
          </form>

          <div className="flex items-center gap-3 text-petit text-texte-2" aria-hidden>
            <span className="h-px flex-1 bg-bordure" /> ou <span className="h-px flex-1 bg-bordure" />
          </div>
          <Bouton variante="secondaire" pleineLargeur icone={<Compass size={20} aria-hidden />} onClick={decouverte}>
            Explorer sans compte (Mode Découverte)
          </Bouton>

          {MODE_DEMO && (
            <div className="rounded-carte bg-nuit p-4 text-white">
              <p className="flex items-center gap-2 text-petit font-semibold">
                <span className="h-2 w-2 rounded-full bg-demo-point" aria-hidden /> Démo · accès rapides
              </p>
              <p className="mt-1 text-petit text-white/80">Profils fictifs, pour la présentation.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ACCES_DEMO.map((p) => (
                  <button
                    key={p.type}
                    type="button"
                    onClick={() => quickLoginAs(p.type)}
                    className="min-h-11 rounded-full bg-white/10 px-4 text-petit font-semibold text-white active:bg-white/20"
                  >
                    {p.role}
                    <span className="sr-only"> ({p.nom})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {authMode === "register" && (
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div role="radiogroup" aria-label="Type de compte" className="flex gap-3">
            <CarteChoix
              actif={!structure}
              onChoisir={() => setRegisterForm({ ...registerForm, role: "user" })}
              icone={<UserRound size={24} aria-hidden />}
              titre="Une utilisatrice"
              texte="Compte actif tout de suite."
            />
            <CarteChoix
              actif={structure}
              onChoisir={() =>
                setRegisterForm({ ...registerForm, role: "admin", adminType: registerForm.adminType ?? "center" })
              }
              icone={<Building2 size={24} aria-hidden />}
              titre="Une structure"
              texte="Ce profil requiert une validation du Superadmin avant activation complète."
            />
          </div>

          {structure && (
            <>
              <ListeDeroulante
                libelle="Type de structure"
                value={registerForm.adminType}
                onChange={(e) => setRegisterForm({ ...registerForm, role: "admin", adminType: e.target.value as AdminType })}
              >
                <option value="center">Centre de santé</option>
                <option value="doctor">Médecin / Docteur</option>
                <option value="association">Association / ONG partenaire</option>
              </ListeDeroulante>
              <Champ
                libelle="Nom de la structure / Établissement"
                required
                value={registerForm.structureName}
                onChange={(e) => setRegisterForm({ ...registerForm, structureName: e.target.value })}
                placeholder="Ex : ABAC Burkina, CMA Schiphra…"
              />
            </>
          )}

          <div className="grid gap-4 min-[400px]:grid-cols-2">
            <Champ
              libelle="Prénom"
              required
              autoComplete="given-name"
              value={registerForm.prenom}
              onChange={(e) => setRegisterForm({ ...registerForm, prenom: e.target.value })}
            />
            <Champ
              libelle="Nom"
              required
              autoComplete="family-name"
              value={registerForm.nom}
              onChange={(e) => setRegisterForm({ ...registerForm, nom: e.target.value })}
            />
          </div>
          <Champ
            libelle="Numéro de téléphone (+226)"
            type="tel"
            required
            autoComplete="tel"
            value={registerForm.telephone}
            onChange={(e) => setRegisterForm({ ...registerForm, telephone: e.target.value })}
            placeholder="70 12 34 56"
          />
          {!MODE_DEMO && (
            <Champ
              id="inscription-email"
              libelle="Adresse email"
              type="email"
              required
              autoComplete="email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              placeholder="vous@exemple.bf"
            />
          )}
          <ChampMotDePasse
            id="inscription-mot-de-passe"
            libelle={`Mot de passe${MODE_DEMO ? "" : " (6 caractères minimum)"}`}
            required
            minLength={MODE_DEMO ? undefined : 6}
            autoComplete="new-password"
            value={registerForm.motDePasse}
            onChange={(e) => setRegisterForm({ ...registerForm, motDePasse: e.target.value })}
          />
          <ChampMotDePasse
            id="inscription-confirmation"
            libelle="Confirmer le mot de passe"
            required
            autoComplete="new-password"
            value={registerForm.confirmerMotDePasse}
            onChange={(e) => setRegisterForm({ ...registerForm, confirmerMotDePasse: e.target.value })}
          />
          <Bouton type="submit" taille="grand" pleineLargeur>
            Créer mon compte
          </Bouton>
        </form>
      )}
    </section>
  );
}
