// Palette du site pour le code JS (Three.js, canvas, images générées).
// Miroir exact des variables de :root dans src/app/globals.css.
// `npm run check` vérifie que les deux restent identiques.

export const palette = {
  bg: "#0a0b0a",
  text: "#f2f3ee",
  muted: "#9a9d93",
  lime: "#d4ff3a",
  onLime: "#0a0b0a",
  olive900: "#1c2410",
  olive850: "#11140d",
  olive800: "#10120e",
  olive780: "#0e100c",
  olive750: "#0d0f0b",
} as const;

/** Nom de la variable CSS correspondant à chaque clé. */
export const cssVar: Record<keyof typeof palette, string> = {
  bg: "--bg",
  text: "--text",
  muted: "--muted",
  lime: "--lime",
  onLime: "--on-lime",
  olive900: "--olive-900",
  olive850: "--olive-850",
  olive800: "--olive-800",
  olive780: "--olive-780",
  olive750: "--olive-750",
};
