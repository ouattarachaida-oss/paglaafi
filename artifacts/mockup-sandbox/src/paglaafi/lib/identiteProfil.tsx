/**
 * Identité visuelle (icône, couleurs, libellés) associée à chaque profil.
 */

import {
  Activity,
  Heart,
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
  User,
} from "lucide-react";
import type { UserProfile } from "../types";

// Identité visuelle et icône personnalisée selon chaque profil
export const getProfileIdentity = (user: UserProfile | null) => {
  if (!user) {
    return {
      icon: <User size={18} className="text-slate-600" />,
      bg: "bg-slate-100",
      text: "text-slate-600",
      border: "border-slate-300",
      badgeText: "Non connecté",
      badgeBg: "bg-slate-500 text-white",
      dotColor: "bg-slate-400",
      label: "Invité / Visiteur",
    };
  }

  if (user.role === "superadmin") {
    return {
      icon: <ShieldCheck size={18} className="text-amber-300" />,
      bg: "bg-gradient-to-tr from-purple-950 via-purple-900 to-indigo-950",
      text: "text-amber-300",
      border: "border-amber-400",
      badgeText: "Superadmin",
      badgeBg: "bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 font-black",
      dotColor: "bg-amber-400",
      label: "Super-Administrateur National",
    };
  }

  if (user.role === "admin" && user.adminType === "center") {
    return {
      icon: <Activity size={18} className="text-white" />,
      bg: "bg-emerald-600",
      text: "text-white",
      border: "border-emerald-400",
      badgeText: "Centre de Santé",
      badgeBg: "bg-emerald-700 text-white",
      dotColor: "bg-emerald-400",
      label: "Admin Centre Médical",
    };
  }

  if (user.role === "admin" && user.adminType === "doctor") {
    return {
      icon: <Stethoscope size={18} className="text-white" />,
      bg: "bg-blue-600",
      text: "text-white",
      border: "border-blue-400",
      badgeText: "Docteur / Praticien",
      badgeBg: "bg-blue-700 text-white",
      dotColor: "bg-blue-400",
      label: "Docteur / Praticien de Santé",
    };
  }

  if (user.role === "admin" && user.adminType === "association") {
    return {
      icon: <HeartHandshake size={18} className="text-white" />,
      bg: "bg-purple-700",
      text: "text-white",
      border: "border-purple-300",
      badgeText: "Association ONG",
      badgeBg: "bg-purple-800 text-white",
      dotColor: "bg-purple-400",
      label: "Admin Association Partenaire",
    };
  }

  // Utilisatrice standard
  return {
    icon: <Heart size={17} className="text-white fill-white" />,
    bg: "bg-gradient-to-tr from-[#6c1543] to-[#ba486e]",
    text: "text-white",
    border: "border-rose-300",
    badgeText: "Utilisatrice",
    badgeBg: "bg-[#6c1543] text-white",
    dotColor: "bg-pink-400",
    label: "Utilisatrice / Patiente",
  };
};
