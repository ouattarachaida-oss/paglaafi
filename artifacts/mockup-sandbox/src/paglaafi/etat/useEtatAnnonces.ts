import { useMemo, useState } from "react";
import type { PartnerAnnouncement } from "../types";
import { initialAnnouncements } from "../donnees/annonces";
import type { EtatUi } from "./useEtatUi";
import type { EtatAuth } from "./useEtatAuth";

/**
 * Annonces des partenaires : consultation, publication (en attente) et modération par le Superadmin.
 */
export function useEtatAnnonces({ ui, auth }: { ui: EtatUi; auth: EtatAuth }) {
  const { notify } = ui;
  const { currentUser } = auth;

  // 13. Annonces & Événements (avec modération Superadmin, filtre mois en cours et veille Rose IA)
  const [announcements, setAnnouncements] = useState<PartnerAnnouncement[]>(initialAnnouncements);

  const [announcementsFilter, setAnnouncementsFilter] = useState<"month" | "all" | "my" | "rose_ai">("month");

  const [showNewAnnouncementModal, setShowNewAnnouncementModal] = useState(false);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    author: "",
    authorType: "Association" as const,
    city: "Ouagadougou",
    date: "Samedi 24 Octobre 2026",
    month: "Octobre 2026",
    badge: "Sensibilisation",
    badgeColor: "bg-pink-100 text-pink-800",
    content: "",
    contact: "",
    imageUrl: "/images/affiche-evenement-beneere.jpg",
    imageCaption: "",
  });

  // 13.ter Modal Affiche Grand Format
  const [selectedPosterModal, setSelectedPosterModal] = useState<{
    url: string;
    title: string;
    author: string;
    caption?: string;
  } | null>(null);

  // Modération Superadmin : annonces standard
  const handleApproveAnnouncement = (id: number) => {
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: "approved", badge: "Validée ✓", badgeColor: "bg-emerald-100 text-emerald-800" }
          : a,
      ),
    );
    notify("Annonce validée par le Superadmin ! Elle est désormais visible publiquement.");
  };

  /**
   * Modération Superadmin : Valider une opportunité détectée par Rose IA et déclencher le PUSH local
   */
  const handleApproveAndPushAnnouncement = async (id: number) => {
    const target = announcements.find((a) => a.id === id);
    if (!target) return;

    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "approved",
              badge: "🔍 Veille Rose IA · Validé Officiel ✓",
              badgeColor: "bg-purple-100 text-purple-900 border border-purple-300 font-bold",
              pushSent: true,
            }
          : a,
      ),
    );

    const pushText =
      target.pushMessageFr || `🌸 Rose IA vous informe : [Opportunité Validée] ${target.title} à ${target.city} !`;

    // Tentative d'envoi Web Push API
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        try {
          new Notification(`🌸 Rose IA — Alerte Santé Vérifiée (${target.city})`, {
            body: pushText,
            icon: "/favicon.ico",
          });
        } catch (e) {
          console.warn("Notification error:", e);
        }
      }
    }

    notify(`🚀 Annonce vérifiée et validée ! Message push diffusé aux femmes de ${target.city}.`);
  };

  const handleRejectAnnouncement = (id: number) => {
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "rejected", badge: "Refusée", badgeColor: "bg-rose-100 text-rose-800" } : a,
      ),
    );
    notify("Annonce refusée.");
  };

  /**
   * Publication d'une annonce par un Admin (en attente de validation Superadmin)
   */
  const handlePublishAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      notify("Veuillez renseigner le titre et le contenu de l'annonce.");
      return;
    }

    const created: PartnerAnnouncement = {
      id: Date.now(),
      title: newAnnouncement.title,
      author: currentUser?.structureName || newAnnouncement.author || "Structure Partenaire",
      authorType: newAnnouncement.authorType,
      city: newAnnouncement.city,
      date: newAnnouncement.date,
      month: newAnnouncement.month || "Octobre 2026",
      badge: "En attente validation",
      badgeColor: "bg-amber-100 text-amber-900",
      content: newAnnouncement.content,
      contact: newAnnouncement.contact || currentUser?.telephone || "+226 70 00 00 00",
      imageUrl: newAnnouncement.imageUrl,
      imageCaption: newAnnouncement.imageCaption,
      likes: 0,
      status: "pending_validation", // En attente obligatoire de validation du Superadmin
      submittedBy: currentUser ? `${currentUser.prenom} ${currentUser.nom}` : "Admin",
      submittedAt: "Aujourd'hui",
    };

    setAnnouncements((prev) => [created, ...prev]);
    setShowNewAnnouncementModal(false);
    setNewAnnouncement({
      title: "",
      author: "",
      authorType: "Association",
      city: "Ouagadougou",
      date: "Samedi 24 Octobre 2026",
      month: "Octobre 2026",
      badge: "Sensibilisation",
      badgeColor: "bg-pink-100 text-pink-800",
      content: "",
      contact: "",
      imageUrl: "/images/affiche-evenement-beneere.jpg",
      imageCaption: "",
    });
    notify("Annonce avec affiche soumise ! Elle sera diffusée dès validation par le Superadmin.");
  };

  /**
   * Filtrage des annonces selon le mois en cours, la veille Rose IA et le profil
   */
  const displayedAnnouncements = useMemo(() => {
    if (announcementsFilter === "my") {
      return announcements.filter(
        (a) =>
          a.submittedBy === currentUser?.structureName ||
          a.submittedBy === `${currentUser?.prenom} ${currentUser?.nom}`,
      );
    }
    if (announcementsFilter === "rose_ai") {
      return announcements.filter((a) => a.isRoseAIDetected && a.status === "approved");
    }
    if (announcementsFilter === "month") {
      return announcements.filter((a) => a.month === "Octobre 2026" && a.status === "approved");
    }
    return announcements.filter((a) => a.status === "approved");
  }, [announcements, announcementsFilter, currentUser]);

  return {
    announcements,
    setAnnouncements,
    announcementsFilter,
    setAnnouncementsFilter,
    showNewAnnouncementModal,
    setShowNewAnnouncementModal,
    newAnnouncement,
    setNewAnnouncement,
    selectedPosterModal,
    setSelectedPosterModal,
    handleApproveAnnouncement,
    handleApproveAndPushAnnouncement,
    handleRejectAnnouncement,
    handlePublishAnnouncementSubmit,
    displayedAnnouncements,
  };
}

export type EtatAnnonces = ReturnType<typeof useEtatAnnonces>;
