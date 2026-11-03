// Expérimentations : uniquement des travaux réels et vérifiables.
// Les images viennent des vrais modèles 3D du site (npm run core, npm run labo).
// Un emplacement est prévu pour les automatisations dès qu'elles seront publiques sur GitHub.

import type { Lang } from "@/i18n";

type T = Record<Lang, string>;

export type LabAction =
  | { kind: "anchor"; href: string; label: T }
  | { kind: "presentation"; slug: string; label: T }
  | { kind: "link"; href: string; label: T };

export type LabItem = {
  id: string;
  name: T;
  year: string;
  text: T;
  tech: string[];
  /** Image réelle ; absente = carte sans visuel (rien d'inventé). */
  image?: string;
  action: LabAction;
};

export const lab: LabItem[] = [
  {
    id: "infinity-core",
    name: { fr: "INFINITY CORE", en: "INFINITY CORE" },
    year: "2026",
    text: {
      fr: "Ma signature manuscrite, extraite de mon logo et posée dans un bloc de verre. Une impulsion de lumière la parcourt sans fin. Trois niveaux de rendu selon l'appareil.",
      en: "My handwritten signature, extracted from my logo and set in a block of glass. A pulse of light travels it endlessly. Three rendering levels depending on the device.",
    },
    tech: ["Three.js", "Shaders", "SVG"],
    image: "/core/signature-640.webp",
    action: { kind: "anchor", href: "#accueil", label: { fr: "Le voir en haut de page ↑", en: "See it at the top ↑" } },
  },
  {
    id: "presentateur",
    name: { fr: "Présentateur 3D", en: "3D presenter" },
    year: "2026",
    text: {
      fr: "Un présentateur animé qui présente chaque projet en 60 secondes, en français ou en anglais, avec les vrais écrans du projet derrière lui.",
      en: "An animated presenter who walks through each project in 60 seconds, in French or English, with the project's real screens behind him.",
    },
    tech: ["React Three Fiber", "Animations", "Blender"],
    image: "/labo/presentateur.webp",
    action: { kind: "presentation", slug: "kelthen", label: { fr: "▶ Lancer une présentation", en: "▶ Start a presentation" } },
  },
  {
    id: "salle",
    name: { fr: "Salle d'écrans 3D", en: "3D screen room" },
    year: "2026",
    text: {
      fr: "Une salle modélisée dans Blender où les projets défilent sur des écrans courbes. Modèle compressé et rendu seulement quand la salle bouge.",
      en: "A room modelled in Blender where projects scroll across curved screens. Compressed model, rendered only when the room moves.",
    },
    tech: ["Blender", "Draco", "React Three Fiber"],
    image: "/labo/salle.webp",
    action: { kind: "anchor", href: "#projets", label: { fr: "Aller aux projets ↑", en: "Go to the projects ↑" } },
  },
  {
    id: "commerce",
    name: { fr: "commerce", en: "commerce" },
    year: "2023",
    text: {
      fr: "Une boutique en ligne complète, construite pour apprendre le full-stack : catalogue, panier, paiement Stripe, commandes et back-office.",
      en: "A complete online store, built to learn full-stack development: catalogue, cart, Stripe payments, orders and an admin back office.",
    },
    tech: ["Laravel 10", "Vue.js 3", "Stripe", "MySQL"],
    action: { kind: "link", href: "https://github.com/RhamonK/commerce", label: { fr: "Code sur GitHub ↗", en: "Code on GitHub ↗" } },
  },
];
