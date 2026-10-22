import { useState, useEffect } from "react";
import {
  User,
  Shield,
  Calendar,
  Bell,
  Stethoscope,
  HeartHandshake,
  Hospital,
  ShieldAlert,
  Lock,
  CheckCircle2,
  Plus,
  Trash2,
  Info,
  Globe,
  LogOut,
} from "lucide-react";
import type { UserProfile, UserRole, ReminderItem, CycleData } from "../types";
import { hapticFeedback } from "../utils/haptics";
import { CardV2 } from "../ui/CardV2";
import { ButtonV2 } from "../ui/ButtonV2";
import { BadgeV2 } from "../ui/BadgeV2";
import { ModalV2 } from "../ui/ModalV2";

interface ProfilV2Props {
  currentUser: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  appLanguage: "fr" | "moore" | "dioula" | "en";
  onChangeLanguage: (lang: "fr" | "moore" | "dioula" | "en") => void;
}

export function ProfilV2({
  currentUser,
  onUpdateUser,
  appLanguage,
  onChangeLanguage,
}: ProfilV2Props) {
  // Données de cycle personnel (stockées 100% en local)
  const defaultCycle: CycleData = {
    lastPeriodDate: "2026-10-12",
    cycleLength: 28,
    periodDuration: 5,
    lastSelfExamDone: true,
  };

  const [cycleData, setCycleData] = useState<CycleData>(() => {
    if (typeof window === "undefined") return defaultCycle;
    try {
      const s = localStorage.getItem("paglaafi_cycle_data_v2");
      return s ? JSON.parse(s) : defaultCycle;
    } catch {
      return defaultCycle;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("paglaafi_cycle_data_v2", JSON.stringify(cycleData));
    } catch {
      // Ignorer
    }
  }, [cycleData]);

  // Rappels personnels
  const initialReminders: ReminderItem[] = [
    {
      id: 1,
      title: "Autopalpation mensuelle (7 jours après les règles)",
      date: "19 Octobre 2026",
      type: "self_exam",
      active: true,
    },
    {
      id: 2,
      title: "Dépistage annuel au CMA de Schiphra",
      date: "28 Octobre 2026",
      type: "screening",
      active: true,
    },
  ];

  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    if (typeof window === "undefined") return initialReminders;
    try {
      const s = localStorage.getItem("paglaafi_reminders_v2");
      return s ? JSON.parse(s) : initialReminders;
    } catch {
      return initialReminders;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("paglaafi_reminders_v2", JSON.stringify(reminders));
    } catch {
      // Ignorer
    }
  }, [reminders]);

  const [showAddReminderModal, setShowAddReminderModal] = useState(false);
  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [newReminderDate, setNewReminderDate] = useState("");

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderTitle.trim()) return;

    hapticFeedback(15);
    const item: ReminderItem = {
      id: Date.now(),
      title: newReminderTitle.trim(),
      date: newReminderDate || "Bientôt",
      type: "appointment",
      active: true,
    };

    setReminders([...reminders, item]);
    setNewReminderTitle("");
    setNewReminderDate("");
    setShowAddReminderModal(false);
  };

  const handleDeleteReminder = (id: number) => {
    hapticFeedback(10);
    setReminders(reminders.filter((r) => r.id !== id));
  };

  // Changement de rôle pour la démonstration
  const handleSwitchRole = (role: UserRole) => {
    hapticFeedback(15);
    const roleLabels: Record<UserRole, { label: string; nom: string; prenom: string }> = {
      user: {
        label: "Utilisatrice / Patiente",
        nom: "Ouedraogo",
        prenom: "Aminata",
      },
      doctor: {
        label: "Docteur / Praticien de Santé",
        nom: "Sanou",
        prenom: "Dr. Ibrahim",
      },
      center: {
        label: "Responsable CMA Schiphra",
        nom: "Sawadogo",
        prenom: "Mme Mariam",
      },
      association: {
        label: "Coordinatrice BE NEERE FOR CAUSE",
        nom: "Kaboré",
        prenom: "Alima",
      },
      superadmin: {
        label: "Super-Administrateur National",
        nom: "Admin",
        prenom: "PagLaafi",
      },
    };

    const target = roleLabels[role];
    onUpdateUser({
      ...currentUser,
      role,
      roleLabel: target.label,
      nom: target.nom,
      prenom: target.prenom,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* 1. CARTE PROFIL & RÔLE ACTUEL */}
      <CardV2 className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#A14364] text-white text-lg font-bold shadow-sm">
            {currentUser.prenom[0]}
            {currentUser.nom[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-[#29252A] font-display">
                {currentUser.prenom} {currentUser.nom}
              </h3>
              <BadgeV2 variant="rose">{currentUser.roleLabel}</BadgeV2>
            </div>
            <p className="text-xs text-[#716971] mt-0.5">
              Téléphone : {currentUser.telephone} · Compte vérifié
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-[11px] text-[#557A63] font-semibold flex items-center gap-1 bg-[#EAF2ED] px-2.5 py-1 rounded-full">
            <Shield size={12} /> Données locales chiffrées
          </span>
        </div>
      </CardV2>

      {/* 2. SÉLECTEUR DE RÔLE (POUR DÉMONSTRATION COMPLÈTE) */}
      <CardV2 className="space-y-3 bg-[#FAF2F5]/60">
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-[#29252A]">
            Bascule de profil & droits d'accès
          </h4>
          <p className="text-xs text-[#716971]">
            Testez les différents espaces selon votre fonction médicale ou associative.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { role: "user" as UserRole, label: "Utilisatrice", icon: User },
            { role: "doctor" as UserRole, label: "Docteur", icon: Stethoscope },
            { role: "center" as UserRole, label: "Centre de Santé", icon: Hospital },
            { role: "association" as UserRole, label: "Association", icon: HeartHandshake },
            { role: "superadmin" as UserRole, label: "Superadmin", icon: ShieldAlert },
          ].map(({ role, label, icon: Icon }) => (
            <button
              key={role}
              onClick={() => handleSwitchRole(role)}
              className={`p-2.5 rounded-2xl text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                currentUser.role === role
                  ? "bg-[#A14364] text-white shadow-xs"
                  : "bg-white border border-[#E9E0E4] text-[#716971] hover:text-[#29252A]"
              }`}
            >
              <Icon size={16} />
              <span className="text-[11px]">{label}</span>
            </button>
          ))}
        </div>
      </CardV2>

      {/* 3. SUIVI PRIVÉ DU CYCLE & AUTOPALPATION */}
      <CardV2 className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E9E0E4] pb-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#F5E8ED] text-[#A14364]">
              <Calendar size={17} />
            </span>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[#29252A] font-display">
                Mon Calendrier de Cycle & Autopalpation
              </h4>
              <p className="text-[11px] text-[#716971]">
                Stocké exclusivement sur votre appareil · Aucune donnée transmise
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-[#557A63] bg-[#EAF2ED] px-2.5 py-1 rounded-full">
            Cycle {cycleData.cycleLength} jours
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-[#FAF2F5] border border-[#E9E0E4]">
            <span className="text-[#716971] block text-[11px]">Dernières règles</span>
            <input
              type="date"
              value={cycleData.lastPeriodDate}
              onChange={(e) =>
                setCycleData({ ...cycleData, lastPeriodDate: e.target.value })
              }
              className="mt-1 font-bold text-[#29252A] bg-white border border-[#E9E0E4] rounded-xl px-2 py-1 text-xs w-full"
            />
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF2F5] border border-[#E9E0E4]">
            <span className="text-[#716971] block text-[11px]">Durée du cycle</span>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                min="20"
                max="40"
                value={cycleData.cycleLength}
                onChange={(e) =>
                  setCycleData({
                    ...cycleData,
                    cycleLength: parseInt(e.target.value) || 28,
                  })
                }
                className="font-bold text-[#29252A] bg-white border border-[#E9E0E4] rounded-xl px-2 py-1 text-xs w-20"
              />
              <span className="text-[#716971]">jours</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF2F5] border border-[#E9E0E4] flex flex-col justify-between">
            <span className="text-[#716971] block text-[11px]">Examen ce mois-ci</span>
            <button
              onClick={() => {
                hapticFeedback(12);
                setCycleData({
                  ...cycleData,
                  lastSelfExamDone: !cycleData.lastSelfExamDone,
                });
              }}
              className={`mt-1 px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                cycleData.lastSelfExamDone
                  ? "bg-[#557A63] text-white"
                  : "bg-white border border-[#E9E0E4] text-[#716971]"
              }`}
            >
              <CheckCircle2 size={13} />
              <span>{cycleData.lastSelfExamDone ? "Effectué ✓" : "À faire ce mois"}</span>
            </button>
          </div>
        </div>
      </CardV2>

      {/* 4. RAPPELS PERSONNELS */}
      <CardV2 className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E9E0E4] pb-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#F5E8ED] text-[#A14364]">
              <Bell size={17} />
            </span>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[#29252A] font-display">
                Mes Rappels de Santé & Dépistage
              </h4>
              <p className="text-[11px] text-[#716971]">
                Rappels discrets sur smartphone
              </p>
            </div>
          </div>

          <ButtonV2
            variant="secondary"
            size="sm"
            onClick={() => setShowAddReminderModal(true)}
            icon={<Plus size={14} />}
          >
            Nouveau rappel
          </ButtonV2>
        </div>

        <div className="space-y-2">
          {reminders.map((r) => (
            <div
              key={r.id}
              className="p-3 rounded-2xl bg-white border border-[#E9E0E4] flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-[#A14364]" />
                <div>
                  <span className="font-semibold text-[#29252A] block">{r.title}</span>
                  <span className="text-[11px] text-[#716971]">{r.date}</span>
                </div>
              </div>

              <button
                onClick={() => handleDeleteReminder(r.id)}
                aria-label="Supprimer le rappel"
                className="text-[#716971] hover:text-red-600 p-1.5 rounded-lg transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </CardV2>

      {/* 5. MODALE D'AJOUT DE RAPPEL */}
      <ModalV2
        isOpen={showAddReminderModal}
        onClose={() => setShowAddReminderModal(false)}
        title="Ajouter un rappel personnel"
        subtitle="Uniquement stocké sur votre téléphone"
      >
        <form onSubmit={handleAddReminder} className="space-y-3 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-[#29252A] mb-1">
              Intitulé du rappel *
            </label>
            <input
              type="text"
              required
              placeholder="Ex : Palpation au CSPS, RDV Mammographie..."
              value={newReminderTitle}
              onChange={(e) => setNewReminderTitle(e.target.value)}
              className="w-full rounded-2xl border border-[#E9E0E4] p-2.5 text-xs text-[#29252A] focus:outline-none focus:border-[#A14364]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#29252A] mb-1">
              Date prévue
            </label>
            <input
              type="date"
              value={newReminderDate}
              onChange={(e) => setNewReminderDate(e.target.value)}
              className="w-full rounded-2xl border border-[#E9E0E4] p-2.5 text-xs text-[#29252A] focus:outline-none focus:border-[#A14364]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <ButtonV2
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setShowAddReminderModal(false)}
            >
              Annuler
            </ButtonV2>
            <ButtonV2 variant="primary" size="sm" type="submit">
              Enregistrer le rappel
            </ButtonV2>
          </div>
        </form>
      </ModalV2>
    </div>
  );
}
