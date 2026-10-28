/**
 * Retire les emojis d'un texte affiché dans l'interface (design system : aucune emoji,
 * des icônes lucide avec libellé). Les données d'origine (dont les traductions) restent intactes.
 */
const EMOJIS = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{2B50}\u{2705}\u{2714}\u{2728}\u{FE0F}\u{200D}]/gu;

export const sansEmoji = (texte: string) => texte.replace(EMOJIS, "").replace(/\s{2,}/g, " ").trim();
