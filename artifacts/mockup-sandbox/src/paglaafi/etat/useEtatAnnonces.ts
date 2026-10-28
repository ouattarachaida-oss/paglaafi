import { useEffect, useMemo, useState } from "react";
import type { PartnerAnnouncement } from "../types";
import { initialAnnouncements } from "../donnees/annonces";
import { MODE_DEMO, MODE_REEL } from "../config";
import { messageErreur } from "../lib/supabase";
import { chargerAnnonces, creerAnnonce, modererAnnonce } from "../depot/annonces";
import { moisCourant } from "../depot/format";
import { useDerniereRequete } from "../lib/derniereRequete";
import type { EtatUi } from "./useEtatUi";
import type { EtatAuth } from "./useEtatAuth";

/**
 * Annonces des partenaires : consultation, publication (en attente) et modération par le Superadmin.
 *
 * Mode réel : annonces stockées dans Supabase ; une annonce créée est toujours
 * « en attente » et seul le superadmin peut la publier ou la refuser (contrôlé
 * côté serveur).
 */

// Mois mis en avant par le filtre « Mois en cours » (figé sur les données de démo en mode démo)
const MOIS_REFERENCE = MODE_DEMO ? "Octobre 2026" : moisCourant();

// Formulaire vide (les valeurs d'exemple ne servent qu'en démo)
const formulaireVide = () => ({
  title: "",
  author: "",
  authorType: "Association" as const,
  city: "Ouagadougou",
  date: MODE_DEMO ? "Samedi 24 Octobre 2026" : "",
  month: MOIS_REFERENCE,
  badge: "Sensibilisation",
  badgeColor: "bg-pink-100 text-pink-800",
  content: "",
  contact: "",
  imageUrl: MODE_DEMO ? "/images/affiche-evenement-beneere.webp" : "",
  imageCaption: "",
});
export function useEtatAnnonces({ ui, auth }: { ui: EtatUi; auth: EtatAuth }) {
  const { notify, section } = ui;
  const { currentUser, sessionReelle } = auth;

  // 13. Annonces & Événements (avec modération Superadmin, filtre mois en cours et veille Rose IA)
  const [announcements, setAnnouncements] = useState<PartnerAnnouncement[]>(MODE_DEMO ? initialAnnouncements : []);

  // Mode réel : (re)chargement selon le compte connecté (la base filtre ce que chacun peut voir)
  const nouvelleRequete = useDerniereRequete();
  const rechargerAnnonces = async () => {
    if (!MODE_REEL) return;
    const estActuelle = nouvelleRequete();
    try {
      const annonces = await chargerAnnonces();
      if (estActuelle()) setAnnouncements(annonces);
    } catch (erreur) {
      notify(messageErreur(erreur as Error));
    }
  };

  // Rechargement à chaque changement de compte (la liste visible dépend du rôle)…
  useEffect(() => {
    void rechargerAnnonces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionReelle?.userId, sessionReelle?.role]);

  // … et à chaque ouverture de l'onglet Annonces
  useEffect(() => {
    if (section === "Annonces") void rechargerAnnonces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  // Mode réel : décision du superadmin enregistrée en base
  const modererReel = async (id: number, decision: "publiee" | "refusee") => {
    try {
      const accepte = await modererAnnonce(id, decision);
      if (!accepte) {
        notify("Action refusée : seule la ou le Superadmin peut valider les annonces.");
        return false;
      }
      await rechargerAnnonces();
      return true;
    } catch (erreur) {
      notify(messageErreur(erreur as Error));
      return false;
    }
  };

  const [announcementsFilter, setAnnouncementsFilter] = useState<"month" | "all" | "my" | "rose_ai">("month");

  const [showNewAnnouncementModal, setShowNewAnnouncementModal] = useState(false);

  const [newAnnouncement, setNewAnnouncement] = useState(formulaireVide);

  // 13.ter Modal Affiche Grand Format
  const [selectedPosterModal, setSelectedPosterModal] = useState<{
    url: string;
    title: string;
    author: string;
    caption?: string;
  } | null>(null);

  // Modération Superadmin : annonces standard
  const handleApproveAnnouncement = (id: number) => {
    if (MODE_REEL) {
      void modererReel(id, "publiee").then(
        (ok) => ok && notify("Annonce validée ! Elle est désormais visible publiquement."),
      );
      return;
    }
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

    // Mode réel : la veille Rose IA et les notifications push restent à construire (phase 3) : simple validation
    if (MODE_REEL) {
      handleApproveAnnouncement(id);
      return;
    }

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
    if (MODE_REEL) {
      void modererReel(id, "refusee").then((ok) => ok && notify("Annonce refusée."));
      return;
    }
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

    if (MODE_REEL) {
      void publierReel();
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
      imageUrl: "/images/affiche-evenement-beneere.webp",
      imageCaption: "",
    });
    notify("Annonce avec affiche soumise ! Elle sera diffusée dès validation par le Superadmin.");
  };

  // Mode réel : enregistrement (toujours en attente de validation)
  const publierReel = async () => {
    try {
      await creerAnnonce(newAnnouncement);
      await rechargerAnnonces();
      setShowNewAnnouncementModal(false);
      setNewAnnouncement(formulaireVide());
      notify("Annonce soumise ! Elle sera diffusée dès validation par le Superadmin.");
    } catch (erreur) {
      notify(messageErreur(erreur as Error));
    }
  };

  /**
   * Filtrage des annonces selon le mois en cours, la veille Rose IA et le profil
   */
  const displayedAnnouncements = useMemo(() => {
    if (announcementsFilter === "my") {
      if (MODE_REEL) return announcements.filter((a) => a.auteurId === sessionReelle?.userId);
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
      return announcements.filter((a) => a.month === MOIS_REFERENCE && a.status === "approved");
    }
    return announcements.filter((a) => a.status === "approved");
  }, [announcements, announcementsFilter, currentUser, sessionReelle?.userId]);

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
    rechargerAnnonces,
  };
}

export type EtatAnnonces = ReturnType<typeof useEtatAnnonces>;
