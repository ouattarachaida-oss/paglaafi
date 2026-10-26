import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Phone,
  Sparkles,
  UserPlus,
  UsersRound,
} from "lucide-react";
import type { AdminType } from "../types";
import { getProfileIdentity } from "../lib/identiteProfil";
import { useUi, useAuth } from "../etat/contextes";

/**
 * Écran de connexion / inscription avec accès démo rapide.
 */
export function EcranConnexion() {
  const { notify, section } = useUi();
  const { authMode, handleLoginSubmit, handleRegisterSubmit, loginForm, quickLoginAs, registerForm, setAuthMode, setCurrentUser, setLoginForm, setRegisterForm, setShowConfirmPassword, setShowPassword, showConfirmPassword, showPassword } = useAuth();

  return (
    <section className="ph-enter px-4 py-5 space-y-4">
      {/* Branding En-tête */}
      <div className="text-center rounded-3xl bg-gradient-to-b from-[#fdf2f5] to-white p-5 border border-[#f3d7e0] shadow-2xs">
        <div className="relative mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-3xl bg-white p-3 shadow-md border border-[#edd1dc]">
          <img
            src="/images/pinkhub-mvp-paglaafi.png"
            alt="Logo PagLaafi"
            className="h-full w-full object-contain mix-blend-multiply"
          />
        </div>
        <h2 className="ph-display text-2xl font-bold text-[#580e36]">PagLaafi</h2>
        <p className="text-xs text-[#82445e] font-semibold mt-0.5">
          Plateforme Nationale de Dépistage & Solidarité Cancer du Sein
        </p>
        <div className="mt-2.5 inline-flex items-center gap-2 rounded-full border border-[#e8c0ce] bg-white px-3 py-1 text-[11px] font-bold text-[#79344f] shadow-2xs">
          <Sparkles size={13} className="text-amber-500" />
          <span>Burkina Faso · Powered by Rose IA</span>
        </div>
      </div>

      {/* Sélecteur Onglet : Connexion vs Inscription avec icônes */}
      <div className="grid grid-cols-2 rounded-2xl bg-[#f5e3e8] p-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => setAuthMode("login")}
          className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 transition ${authMode === "login" ? "bg-white text-[#ea2d6d] shadow-sm font-extrabold" : "text-[#7b5364]"}`}
        >
          <Lock size={13} />
          <span>Se connecter</span>
        </button>
        <button
          type="button"
          onClick={() => setAuthMode("register")}
          className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 transition ${authMode === "register" ? "bg-white text-[#ea2d6d] shadow-sm font-extrabold" : "text-[#7b5364]"}`}
        >
          <UserPlus size={13} />
          <span>Créer un compte</span>
        </button>
      </div>

      {/* SI ONGLET CONNEXION */}
      {authMode === "login" && (
        <div className="space-y-4">
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 rounded-3xl bg-white p-4.5 border border-[#edd6df] shadow-xs">
            <div>
              <label className="text-[11px] font-bold text-[#580e36] block mb-1.5">
                Numéro de téléphone (+226)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 flex items-center gap-1.5 text-xs font-bold text-[#713f53] pointer-events-none">
                  <Phone size={13} className="text-[#ea2d6d]" />
                  <span>🇧🇫 +226</span>
                </span>
                <input
                  type="tel"
                  required
                  value={loginForm.telephone}
                  onChange={(e) => setLoginForm({ ...loginForm, telephone: e.target.value })}
                  placeholder="70 12 34 56"
                  className="w-full rounded-2xl border border-[#d6a9b9] py-3 pl-24 pr-3.5 text-xs font-semibold text-[#580e36] focus:border-[#ea2d6d] focus:ring-2 focus:ring-[#ea2d6d]/15 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#580e36] block mb-1.5">
                Mot de passe
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-[#ea2d6d] pointer-events-none">
                  <Lock size={14} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginForm.motDePasse}
                  onChange={(e) => setLoginForm({ ...loginForm, motDePasse: e.target.value })}
                  placeholder="Votre mot de passe"
                  className="w-full rounded-2xl border border-[#d6a9b9] py-3 pl-10 pr-10 text-xs font-semibold text-[#580e36] focus:border-[#ea2d6d] focus:ring-2 focus:ring-[#ea2d6d]/15 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-gray-400 hover:text-[#ea2d6d] p-1 transition"
                  title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-[#6c1543] to-[#ba486e] py-3.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={15} />
              <span>Se connecter à mon compte</span>
            </button>
          </form>

          {/* Accès Démo Rapide (1-Clic) : Disposition optimisée et équilibrée des icônes de profils */}
          <div className="rounded-3xl bg-[#fdf5f7] border border-[#f0d4de] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#9a4564] mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <UsersRound size={13} className="text-[#ea2d6d]" />
                <span>Accès Rapide Démo (1-Clic)</span>
              </span>
              <span className="text-[9px] font-normal lowercase bg-pink-100 text-[#ea2d6d] px-2 py-0.5 rounded-full font-bold">
                5 profils au choix
              </span>
            </p>

            {/* Grille 2x2 des 4 rôles opérationnels */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              {[
                {
                  type: "user" as const,
                  title: "Aminata O.",
                  roleName: "Utilisatrice",
                  desc: "Autopalpation & Cycle",
                  profile: { role: "user" as const, roleLabel: "Utilisatrice" },
                },
                {
                  type: "center" as const,
                  title: "Mme Sawadogo",
                  roleName: "Centre de Santé",
                  desc: "CMA Schiphra",
                  profile: { role: "admin" as const, adminType: "center" as const, roleLabel: "Centre Médical" },
                },
                {
                  type: "doctor" as const,
                  title: "Dr. Sanou",
                  roleName: "Docteur / Praticien",
                  desc: "CHU Bogodogo",
                  profile: { role: "admin" as const, adminType: "doctor" as const, roleLabel: "Praticien" },
                },
                {
                  type: "association" as const,
                  title: "Dr. Sawadogo",
                  roleName: "Association ONG",
                  desc: "ABAC Solidarité",
                  profile: { role: "admin" as const, adminType: "association" as const, roleLabel: "ONG / Asso" },
                },
              ].map((p) => {
                const ident = getProfileIdentity(p.profile as any);
                return (
                  <button
                    key={p.type}
                    type="button"
                    onClick={() => quickLoginAs(p.type)}
                    className="flex flex-col items-start gap-1.5 rounded-2xl bg-white p-3 text-left border border-[#ecd5de] hover:border-[#ea2d6d] hover:shadow-xs transition group"
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${ident.bg} ${ident.text} border ${ident.border} shadow-2xs group-hover:scale-105 transition`}>
                        {ident.icon}
                      </div>
                      <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-full ${ident.badgeBg}`}>
                        {ident.badgeText}
                      </span>
                    </div>
                    <div className="min-w-0 w-full mt-0.5">
                      <p className="text-[11.5px] font-bold text-[#580e36] truncate">{p.title}</p>
                      <p className="text-[10px] text-[#7d5668] truncate">{p.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 5e rôle : Superadmin National en carte pleine largeur */}
            {(() => {
              const superadminIdentity = getProfileIdentity({ role: "superadmin", roleLabel: "Superadmin" } as any);
              return (
                <button
                  type="button"
                  onClick={() => quickLoginAs("superadmin")}
                  className="w-full flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-950/5 via-purple-900/10 to-indigo-950/5 p-3 text-left border border-purple-200/80 hover:border-purple-400 hover:shadow-xs transition group"
                >
                  <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${superadminIdentity.bg} ${superadminIdentity.text} border ${superadminIdentity.border} shadow-xs group-hover:scale-105 transition`}>
                    {superadminIdentity.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#351a42]">Alimata Kaboré</p>
                      <span className={`text-[8.5px] font-black px-2 py-0.5 rounded-full ${superadminIdentity.badgeBg}`}>
                        Superadmin National
                      </span>
                    </div>
                    <p className="text-[10px] text-purple-900/80">Supervision nationale, modération des annonces & statistiques</p>
                  </div>
                </button>
              );
            })()}
          </div>

          {/* Bouton pour tester sans compte */}
          <div className="text-center pt-1 pb-2">
            <button
              type="button"
              onClick={() => {
                setCurrentUser({
                  nom: "Visiteur",
                  prenom: "Invité",
                  telephone: "Mode Découverte",
                  role: "user",
                  roleLabel: "Visiteur libre",
                });
                notify("Bienvenue en mode découverte libre !");
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#ecd5de] bg-white px-4 py-2.5 text-xs font-bold text-[#ea2d6d] shadow-2xs hover:bg-pink-50 transition"
            >
              <Sparkles size={14} className="text-amber-500" />
              <span>Explorer l'application sans compte (Mode Découverte)</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* SI ONGLET INSCRIPTION */}
      {authMode === "register" && (
        <form onSubmit={handleRegisterSubmit} className="space-y-3 rounded-3xl bg-white p-4 border border-[#edd6df] shadow-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-[#580e36] block mb-1">Prénom</label>
              <input
                type="text"
                required
                value={registerForm.prenom}
                onChange={(e) => setRegisterForm({ ...registerForm, prenom: e.target.value })}
                className="w-full rounded-xl border border-[#d6a9b9] p-2 text-xs text-[#580e36] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#580e36] block mb-1">Nom</label>
              <input
                type="text"
                required
                value={registerForm.nom}
                onChange={(e) => setRegisterForm({ ...registerForm, nom: e.target.value })}
                className="w-full rounded-xl border border-[#d6a9b9] p-2 text-xs text-[#580e36] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#580e36] block mb-1">Numéro de téléphone (+226)</label>
            <input
              type="tel"
              required
              value={registerForm.telephone}
              onChange={(e) => setRegisterForm({ ...registerForm, telephone: e.target.value })}
              placeholder="70 12 34 56"
              className="w-full rounded-xl border border-[#d6a9b9] p-2 text-xs text-[#580e36] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#580e36] block mb-1">Type de profil</label>
            <select
              value={registerForm.role === "user" ? "user" : registerForm.adminType}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "user") {
                  setRegisterForm({ ...registerForm, role: "user" });
                } else {
                  setRegisterForm({
                    ...registerForm,
                    role: "admin",
                    adminType: val as AdminType,
                  });
                }
              }}
              className="w-full rounded-xl border border-[#d6a9b9] p-2 text-xs text-[#580e36] bg-white focus:outline-none"
            >
              <option value="user">👩 Utilisatrice / Patiente</option>
              <option value="association">🎗️ Association / ONG Partenaire</option>
              <option value="center">🏥 Centre de Santé</option>
              <option value="doctor">🩺 Médecin / Docteur</option>
            </select>
          </div>

          {registerForm.role === "admin" && (
            <div>
              <label className="text-[11px] font-bold text-[#580e36] block mb-1">
                Nom de la structure / Établissement
              </label>
              <input
                type="text"
                required
                value={registerForm.structureName}
                onChange={(e) => setRegisterForm({ ...registerForm, structureName: e.target.value })}
                placeholder="Ex: ABAC Burkina, CMA Schiphra..."
                className="w-full rounded-xl border border-[#d6a9b9] p-2 text-xs text-[#580e36] focus:outline-none"
              />
              <p className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded-xl mt-1.5 border border-amber-200">
                ℹ️ Ce profil requiert une validation du Superadmin avant activation complète.
              </p>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-[#580e36] block mb-1">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={registerForm.motDePasse}
                onChange={(e) => setRegisterForm({ ...registerForm, motDePasse: e.target.value })}
                className="w-full rounded-xl border border-[#d6a9b9] p-2 pr-10 text-xs text-[#580e36] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-400 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#580e36] block mb-1">Confirmer le mot de passe</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={registerForm.confirmerMotDePasse}
                onChange={(e) => setRegisterForm({ ...registerForm, confirmerMotDePasse: e.target.value })}
                className="w-full rounded-xl border border-[#d6a9b9] p-2 pr-10 text-xs text-[#580e36] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2 text-gray-400 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#ea2d6d] py-3 text-xs font-bold text-white shadow-md hover:bg-[#d81f5c] transition"
          >
            Créer mon compte
          </button>
        </form>
      )}
    </section>
  );
}
