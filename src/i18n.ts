// Textes de l'interface, FR (par défaut) et EN.
// FR est servi à la racine (/), EN sous /en.

export type Lang = "fr" | "en";

export const langs: Lang[] = ["fr", "en"];

/** Préfixe d'URL de chaque langue. */
export const base: Record<Lang, string> = { fr: "", en: "/en" };

/** Chemin du Mode rapide dans chaque langue. */
export const quickPath: Record<Lang, string> = { fr: "/rapide", en: "/en/quick" };

export const ui = {
  fr: {
    skip: "Aller au contenu",
    navLabel: "Navigation principale",
    nav: { projects: "Projets", path: "Parcours", contact: "Contact" },
    quick: "Mode rapide",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    menu: "Menu",
    cvPill: "CV ↓",
    switchTo: "EN",
    switchLabel: "Read in English",
    seeProjects: "Voir mes projets ↓",
    downloadCv: "Télécharger mon CV",
    downloadCvArrow: "Télécharger mon CV ↓",
    hint: "molette pour entrer dans la salle ↓",
    hintTouch: "fais défiler pour voir les projets ↓",
    projectsEyebrow: "// projets",
    projectsTitle: ["Some ", "projects", "."],
    roomHelp: "Flèches gauche et droite pour changer de projet, Entrée pour lancer la présentation.",
    prevProject: "Projet précédent",
    nextProject: "Projet suivant",
    launch: "▶ Lancer la présentation · 60 s",
    soon: "Présentation bientôt",
    pathEyebrow: "// parcours",
    pathTitle: "Parcours",
    contactTitle: ["Parlons de ce que je peux ", "construire", " pour toi."],
    cvFr: "CV · Français ↓",
    cvEn: "CV · English ↓",
    back: "← Version immersive",
    quickTitle: "Mode rapide",
    quickDescription: "Projets, parcours et contact, en une page simple.",
    projects: "Projets",
    path: "Parcours",
    contact: "Contact",
  },
  en: {
    skip: "Skip to content",
    navLabel: "Main navigation",
    nav: { projects: "Projects", path: "Background", contact: "Contact" },
    quick: "Quick mode",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menu: "Menu",
    cvPill: "CV ↓",
    switchTo: "FR",
    switchLabel: "Lire en français",
    seeProjects: "See my projects ↓",
    downloadCv: "Download my CV",
    downloadCvArrow: "Download my CV ↓",
    hint: "scroll to enter the room ↓",
    hintTouch: "scroll to see the projects ↓",
    projectsEyebrow: "// projects",
    projectsTitle: ["Some ", "projects", "."],
    roomHelp: "Left and right arrows to change project, Enter to start the presentation.",
    prevProject: "Previous project",
    nextProject: "Next project",
    launch: "▶ Start the presentation · 60 s",
    soon: "Presentation coming soon",
    pathEyebrow: "// background",
    pathTitle: "Background",
    contactTitle: ["Let's talk about what I can ", "build", " for you."],
    cvFr: "CV · Français ↓",
    cvEn: "CV · English ↓",
    back: "← Immersive version",
    quickTitle: "Quick mode",
    quickDescription: "Projects, background and contact, on one simple page.",
    projects: "Projects",
    path: "Background",
    contact: "Contact",
  },
} as const;
