/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#39232e',
    tint: '#a74869',

    // Core surfaces
    background: '#fffaf9',
    foreground: '#39232e',

    // Cards / elevated surfaces
    card: '#fffdfc',
    cardForeground: '#523445',

    // Primary action color (buttons, links, active states)
    primary: '#a74869',
    primaryForeground: '#ffffff',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#f9e9ed',
    secondaryForeground: '#874258',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#f8e8ec',
    mutedForeground: '#806874',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#f5eff7',
    accentForeground: '#855a8a',

    // Destructive actions (delete, error states)
    destructive: '#b42318',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#f0dfe4',
    input: '#ecd9df',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 20,
};

export default colors;
