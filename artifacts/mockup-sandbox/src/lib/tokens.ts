/**
 * ============================================================================
 * DESIGN TOKENS PAGLAAFI V2 - CHARTE OFFICIELLE & ACCESSIBLE
 * ============================================================================
 * Palette conçue pour le contexte burkinabè et ouest-africain :
 * - Sérénité, dignité, crédibilité médicale et chaleur humaine.
 * - Conforme aux exigences d'accessibilité WCAG AA (contrastes textuels).
 */

export const colors = {
  // Rose Identitaire
  roseDeep: "#A14364",       // Couleur principale de marque et d'action
  roseDeepHover: "#8E3655",  // État survol / pressé
  roseSoft: "#F5E8ED",       // Fonds doux, cartes secondaires, badges
  roseLight: "#FAF2F5",      // Dégradés légers et fonds de cartes
  roseAccent: "#D65C85",     // Accents de mise en valeur

  // Surfaces & Fonds neutres
  ivory: "#FFFCF8",          // Fond respirant principal
  white: "#FFFFFF",          // Cartes et conteneurs au premier plan
  cream: "#F7F2EE",          // Fonds neutres tièdes
  surfaceElevated: "#FFFFFF",// Surface modale

  // Vert naturel & Positif
  greenNature: "#557A63",    // États positifs, santé, validation, gratuité
  greenSoft: "#EAF2ED",      // Badge vert doux
  greenHover: "#436450",     // Survol vert

  // Textes & Typographie
  textMain: "#29252A",       // Texte principal à fort contraste
  textSecondary: "#716971",  // Texte secondaire, métadonnées, légendes
  textMuted: "#989098",      // Textes d'aide discrets, placeholders
  textInverse: "#FFFFFF",    // Texte blanc sur fond sombre

  // Bordures & Séparateurs
  borderSubtle: "#E9E0E4",   // Bordure par défaut de carte
  borderLight: "#F2EBEF",    // Séparateur léger
  borderFocus: "#A14364",    // Anneau de focus accessible

  // Statuts & États
  warning: "#D97706",        // Affluence, vigilance
  warningSoft: "#FEF3C7",
  danger: "#DC2626",         // Alerte, dysfonctionnement appareil
  dangerSoft: "#FEE2E2",
  info: "#2563EB",           // Informations cliniques
  infoSoft: "#EFF6FF",
} as const;

export const radii = {
  xs: "0.375rem",  // 6px
  sm: "0.5rem",    // 8px
  md: "0.75rem",   // 12px
  lg: "1rem",      // 16px
  xl: "1.25rem",   // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.75rem",// 28px
  full: "9999px",
} as const;

export const shadows = {
  sm: "0 1px 3px rgba(41, 37, 42, 0.05)",
  md: "0 4px 12px rgba(41, 37, 42, 0.07)",
  lg: "0 10px 25px rgba(161, 67, 100, 0.10)",
  floating: "0 14px 35px rgba(161, 67, 100, 0.16)",
} as const;
