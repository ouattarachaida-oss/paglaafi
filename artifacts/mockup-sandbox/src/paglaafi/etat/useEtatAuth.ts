import { useEffect, useState } from "react";
import type { AdminType, PendingRegistration, UserProfile, UserRole } from "../types";
import { hapticFeedback } from "../lib/haptique";
import { initialPendingRegistrations } from "../donnees/inscriptions";
import { MODE_DEMO, MODE_REEL } from "../config";
import { client, messageErreur, supabase } from "../lib/supabase";
import { chargerProfilConnecte, type SessionReelle } from "../depot/profils";
import { useDerniereRequete } from "../lib/derniereRequete";
import { enregistrer, lire } from "../lib/stockageSecurise";
import type { EtatUi } from "./useEtatUi";

/** Erreur due à l'absence de réseau (et non à un refus de la base). */
const horsConnexion = (erreur: string) =>
  (typeof navigator !== "undefined" && !navigator.onLine) || /failed to fetch|network|load failed/i.test(erreur);

// Type de structure demandé à l'inscription (adhésion validée par le superadmin)
const TYPE_STRUCTURE: Record<AdminType, "centre" | "association" | "professionnel"> = {
  center: "centre",
  association: "association",
  doctor: "professionnel",
};

/**
 * Authentification et profils (Utilisatrice, Admin Centre, Docteur, Admin Asso, Superadmin).
 *
 * - Mode réel : comptes Supabase (email + mot de passe). Le rôle vient UNIQUEMENT
 *   du profil en base ; une inscription « structure » crée une demande d'adhésion
 *   que le superadmin valide.
 * - Mode démo : aucun mot de passe n'est vérifié, profils fictifs et accès rapides.
 */
export function useEtatAuth({ ui }: { ui: EtatUi }) {
  const { notify, setShowProfileMenu, setSidebarOpen } = ui;

  // 4. Authentification & Profils (Utilisatrice, Admin Centre, Docteur, Admin Asso, Superadmin)
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Formulaires pré-remplis en démo, vides en mode réel
  const [registerForm, setRegisterForm] = useState({
    nom: MODE_DEMO ? "Ouedraogo" : "",
    prenom: MODE_DEMO ? "Aminata" : "",
    telephone: MODE_DEMO ? "70 12 34 56" : "",
    email: "",
    motDePasse: MODE_DEMO ? "123456" : "",
    confirmerMotDePasse: MODE_DEMO ? "123456" : "",
    role: "user" as UserRole,
    adminType: "center" as AdminType,
    structureName: "",
  });

  const [loginForm, setLoginForm] = useState({
    telephone: MODE_DEMO ? "70 12 34 56" : "",
    email: "",
    motDePasse: MODE_DEMO ? "123456" : "",
  });

  // Utilisateur actuellement connecté (initialisé à null au démarrage pour atterrir sur l'écran de connexion après le splash de 5 secondes)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Mode réel : identité Supabase et rattachement du compte connecté (null en démo)
  const [sessionReelle, setSessionReelle] = useState<SessionReelle | null>(null);

  // Mode réel : suit la session Supabase (conservée après rechargement) et charge le profil
  const nouvelleRequete = useDerniereRequete();
  useEffect(() => {
    if (!MODE_REEL || !supabase) return;
    let actif = true;
    const { data } = supabase.auth.onAuthStateChange((evenement, session) => {
      if (evenement === "TOKEN_REFRESHED") return;
      // Hors du rappel : Supabase déconseille d'y attendre d'autres appels
      const estActuelle = nouvelleRequete();
      setTimeout(async () => {
        if (!actif || !estActuelle()) return;
        if (!session) {
          setSessionReelle(null);
          setCurrentUser(null);
          return;
        }
        let resultat = await chargerProfilConnecte(session.user);
        if (!actif || !estActuelle()) return; // un événement plus récent a pris le relais
        if (!("erreur" in resultat)) {
          // Copie chiffrée sur l'appareil (rattachée au compte) pour l'usage hors connexion
          void enregistrer(session.user.id, "profil", resultat).catch(() => {});
        } else if (horsConnexion(resultat.erreur)) {
          // Hors connexion : dernier profil connu de ce compte (la base reste seule juge des droits)
          const enCache = await lire<Exclude<typeof resultat, { erreur: string }>>(session.user.id, "profil");
          if (!actif || !estActuelle()) return;
          if (enCache) resultat = enCache;
        }
        if ("erreur" in resultat) {
          notify(`Profil indisponible : ${resultat.erreur}`);
          return;
        }
        setSessionReelle(resultat.session);
        setCurrentUser(resultat.utilisateur);
      }, 0);
    });
    return () => {
      actif = false;
      data.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sauvegarde persistante de la session utilisateur (mode démo uniquement : profils fictifs).
  // En mode réel, la session est gérée par Supabase ; le profil (nom, téléphone) n'est pas recopié en clair.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (MODE_REEL) {
      localStorage.removeItem("paglaafi_current_user");
      return;
    }
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
    // Mode réel : fermeture de la session Supabase (le profil local est ensuite vidé)
    if (MODE_REEL) {
      void client().auth.signOut();
      setSessionReelle(null);
    }
    setCurrentUser(null);
    setShowProfileMenu(false);
    setSidebarOpen(false);
    notify("Vous avez été déconnecté(e) avec succès.");
  };

  // 5. Superadmin : Modération nationale, Statistiques de trafic & Inscriptions
  const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>(
    MODE_DEMO ? initialPendingRegistrations : [],
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

    if (MODE_REEL) {
      void inscrireReel();
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

  /**
   * Mode réel : création du compte Supabase. Le profil est créé côté serveur avec
   * le rôle « utilisatrice » ; une demande d'adhésion accompagne l'inscription
   * d'une structure. Aucun rôle n'est transmis par le client.
   */
  const inscrireReel = async () => {
    const email = registerForm.email.trim();
    if (!email) {
      notify("Veuillez renseigner votre adresse email.");
      return;
    }
    const structure = registerForm.role === "admin";
    if (structure && registerForm.structureName.trim().length < 2) {
      notify("Veuillez indiquer le nom de votre structure.");
      return;
    }
    const { data, error } = await client().auth.signUp({
      email,
      password: registerForm.motDePasse,
      options: {
        data: {
          nom: registerForm.nom.trim(),
          prenom: registerForm.prenom.trim(),
          telephone: registerForm.telephone.trim(),
          ...(structure && {
            demande_adhesion: {
              type_structure: TYPE_STRUCTURE[registerForm.adminType],
              nom_structure: registerForm.structureName.trim(),
            },
          }),
        },
      },
    });
    if (error) {
      notify(messageErreur(error));
      return;
    }
    setShowAuthModal(false);
    if (!data.session) {
      notify("Compte créé : confirmez votre adresse email puis connectez-vous.");
      setAuthMode("login");
    } else if (structure) {
      notify("Compte créé ! Votre demande d'adhésion est transmise au Superadmin pour validation.");
    } else {
      notify(`Bienvenue ${registerForm.prenom} ! Compte utilisatrice créé avec succès.`);
    }
  };

  /** Mode réel : connexion email + mot de passe (le profil est chargé par le suivi de session). */
  const connecterReel = async () => {
    if (!loginForm.email.trim() || !loginForm.motDePasse) {
      notify("Veuillez renseigner votre email et votre mot de passe.");
      return;
    }
    const { error } = await client().auth.signInWithPassword({
      email: loginForm.email.trim(),
      password: loginForm.motDePasse,
    });
    if (error) {
      notify(messageErreur(error));
      return;
    }
    setShowAuthModal(false);
    notify("Connexion réussie ! Bienvenue sur PagLaafi.");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (MODE_REEL) {
      void connecterReel();
      return;
    }
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
    sessionReelle,
    handleLogout,
    pendingRegistrations,
    setPendingRegistrations,
    handleRegisterSubmit,
    handleLoginSubmit,
    quickLoginAs,
  };
}

export type EtatAuth = ReturnType<typeof useEtatAuth>;
