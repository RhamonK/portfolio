// Projets qui ont une présentation de 60 s. Liste légère, utilisée par la page d'accueil
// pour afficher les boutons sans charger le texte des présentations (chargé au clic).
// src/data/presentations.ts doit avoir exactement ces clés (vérifié par TypeScript).
export const PRESENTED = ["mamashop", "abo", "studio-nala", "kelthen", "fraul"] as const;
export type PresentedSlug = (typeof PRESENTED)[number];

export const hasPresentation = (slug: string): slug is PresentedSlug => (PRESENTED as readonly string[]).includes(slug);
