import { useEffect, useState } from "react";
import type { AdminType, PendingRegistration, UserProfile, UserRole } from "../types";
import { hapticFeedback } from "../lib/haptique";
import { initialPendingRegistrations } from "../donnees/inscriptions";
import type { EtatUi } from "./useEtatUi";

/**
 * Authentification et profils (Utilisatrice, Admin Centre, Docteur, Admin Asso, Superadmin).
 * ⚠️ Mode démo : aucun mot de passe n'est vérifié, les rôles sont attribués côté client (voir phase 2).
 */
export function useEtatAuth({ ui }: { ui: EtatUi }) {
  const { notify, setShowProfileMenu, setSidebarOpen } = ui;

  // 4. Authentification & Profils (Utilisatrice, Admin Centre, Docteur, Admin Asso, Superadmin)
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    nom: "Ouedraogo",
    prenom: "Aminata",
    telephone: "70 12 34 56",
    motDePasse: "123456",
    confirmerMotDePasse: "123456",
    role: "user" as UserRole,
    adminType: "center" as AdminType,
    structureName: "",
  });

  const [loginForm, setLoginForm] = useState({
    telephone: "70 12 34 56",
    motDePasse: "123456",
  });

  // Utilisateur actuellement connecté (initialisé à null au démarrage pour atterrir sur l'écran de connexion après le splash de 5 secondes)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Sauvegarde persistante de la session utilisateur
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (currentUser) {
        localStorage.setItem("paglaafi_current_user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("paglaafi_current_user");
      }
    } catch {
      // Ignorer
    }
  }, [currentUser]);

  // Fonction universelle de déconnexion
  const handleLogout = () => {
    hapticFeedback(20);
    setCurrentUser(null);
    setShowProfileMenu(false);
    setSidebarOpen(false);
    notify("Vous avez été déconnecté(e) avec succès.");
  };

  // 5. Superadmin : Modération nationale, Statistiques de trafic & Inscriptions
  const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>(
    initialPendingRegistrations,
  );

  /**
   * Gestion de la connexion et inscription
   */
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (registerForm.motDePasse !== registerForm.confirmerMotDePasse) {
      notify("Les deux mots de passe ne correspondent pas.");
      return;
    }

    if (!registerForm.telephone || !registerForm.motDePasse) {
      notify("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const newUser: UserProfile = {
      nom: registerForm.nom,
      prenom: registerForm.prenom,
      telephone: registerForm.telephone,
      role: registerForm.role,
      roleLabel:
        registerForm.role === "admin"
          ? registerForm.adminType === "center"
            ? `Admin Centre (${registerForm.structureName || "Centre"})`
            : registerForm.adminType === "doctor"
              ? `Docteur / Praticien (${registerForm.structureName || "CHU"})`
              : `Admin Association (${registerForm.structureName || "Association"})`
          : "Utilisatrice",
      structureName: registerForm.structureName,
      adminType: registerForm.adminType,
    };

    if (registerForm.role === "admin") {
      setPendingRegistrations((prev) => [
        {
          id: Date.now(),
          structure: registerForm.structureName || "Nouvelle Structure",
          responsable: `${registerForm.prenom} ${registerForm.nom}`,
          telephone: registerForm.telephone,
          type:
            registerForm.adminType === "center"
              ? "Centre de Santé"
              : registerForm.adminType === "doctor"
                ? "Professionnel"
                : "Association",
          ville: "Ouagadougou",
          date: "Aujourd'hui",
          status: "pending",
        },
        ...prev,
      ]);
      notify("Demande transmise ! Compte activé après validation par le Superadmin.");
      setShowAuthModal(false);
      return;
    }

    setCurrentUser(newUser);
    setShowAuthModal(false);
    notify(`Bienvenue ${newUser.prenom} ! Compte utilisatrice créé avec succès.`);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.telephone || !loginForm.motDePasse) {
      notify("Veuillez renseigner votre numéro de téléphone et votre mot de passe.");
      return;
    }

    if (loginForm.telephone === "78 00 00 00") {
      setCurrentUser({
        nom: "Kaboré",
        prenom: "Alimata",
        telephone: "78 00 00 00",
        role: "superadmin",
        roleLabel: "Super-Administrateur National",
      });
      notify("Connectée en tant que Superadmin National.");
    } else if (loginForm.telephone === "76 50 33 44") {
      setCurrentUser({
        nom: "Sawadogo",
        prenom: "Dr. Salif",
        telephone: "76 50 33 44",
        role: "admin",
        roleLabel: "Admin Association (ABAC)",
        structureName: "ABAC Burkina",
        adminType: "association",
      });
      notify("Connecté en tant que Responsable Association (ABAC).");
    } else if (loginForm.telephone === "70 25 36 30") {
      setCurrentUser({
        nom: "Sawadogo",
        prenom: "Mme Mariam",
        telephone: "70 25 36 30",
        role: "admin",
        roleLabel: "Admin Centre (CMA Schiphra)",
        structureName: "CMA de Schiphra",
        adminType: "center",
      });
      notify("Connectée en tant que Responsable Centre de Santé (Schiphra).");
    } else if (loginForm.telephone === "76 12 34 56") {
      setCurrentUser({
        nom: "Sanou",
        prenom: "Dr. Ibrahim",
        telephone: "76 12 34 56",
        role: "admin",
        roleLabel: "Docteur Gynécologue (CHU Bogodogo)",
        structureName: "CHU de Bogodogo",
        adminType: "doctor",
        speciality: "Gynécologue-Obstétricien",
      });
      notify("Connecté en tant que Docteur / Praticien de santé.");
    } else {
      setCurrentUser({
        nom: "Ouedraogo",
        prenom: "Aminata",
        telephone: loginForm.telephone,
        role: "user",
        roleLabel: "Utilisatrice",
      });
      notify("Connexion réussie ! Bienvenue sur PagLaafi.");
    }
    setShowAuthModal(false);
  };

  const quickLoginAs = (type: "user" | "center" | "doctor" | "association" | "superadmin") => {
    if (type === "superadmin") {
      setCurrentUser({
        nom: "Kaboré",
        prenom: "Alimata",
        telephone: "78 00 00 00",
        role: "superadmin",
        roleLabel: "Super-Administrateur National",
      });
      notify("Profil actif : 🛡️ Superadmin (Modération & Tableau de bord national).");
    } else if (type === "center") {
      setCurrentUser({
        nom: "Sawadogo",
        prenom: "Mme Mariam",
        telephone: "70 25 36 30",
        role: "admin",
        roleLabel: "Admin Centre (CMA Schiphra)",
        structureName: "CMA de Schiphra",
        adminType: "center",
      });
      notify("Profil actif : 🏥 Admin Centre de Santé.");
    } else if (type === "doctor") {
      setCurrentUser({
        nom: "Sanou",
        prenom: "Dr. Ibrahim",
        telephone: "76 12 34 56",
        role: "admin",
        roleLabel: "Docteur Gynécologue (CHU Bogodogo)",
        structureName: "CHU de Bogodogo",
        adminType: "doctor",
        speciality: "Gynécologue-Obstétricien",
      });
      notify("Profil actif : 🩺 Docteur (Entraînement de Rose IA & Orientation).");
    } else if (type === "association") {
      setCurrentUser({
        nom: "Sawadogo",
        prenom: "Dr. Salif",
        telephone: "76 50 33 44",
        role: "admin",
        roleLabel: "Admin Association (ABAC)",
        structureName: "ABAC Burkina",
        adminType: "association",
      });
      notify("Profil actif : 🎗️ Admin Association (Annonces & Dons Orange Money).");
    } else {
      setCurrentUser({
        nom: "Ouedraogo",
        prenom: "Aminata",
        telephone: "70 12 34 56",
        role: "user",
        roleLabel: "Utilisatrice",
      });
      notify("Profil actif : 👩 Utilisatrice standard.");
    }
    setShowAuthModal(false);
  };

  return {
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    registerForm,
    setRegisterForm,
    loginForm,
    setLoginForm,
    currentUser,
    setCurrentUser,
    handleLogout,
    pendingRegistrations,
    setPendingRegistrations,
    handleRegisterSubmit,
    handleLoginSubmit,
    quickLoginAs,
  };
}

export type EtatAuth = ReturnType<typeof useEtatAuth>;
