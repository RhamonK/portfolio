// ============================================================
// Projets. Chaque projet alimente une <ProjectCard/>.
// 👉 Remplace les liens "#" par de vraies URLs (étude de cas,
//    démo, repo GitHub). Les liens morts tuent ta crédibilité.
// ============================================================

export type ProjectLink = {
  label: string;
  href: string;
};

export type MetaRow = {
  label: string;
  value: string;
};

export type Project = {
  /** identifiant d'URL : /projets/[slug] */
  slug: string;
  /** nom de fichier affiché dans la titlebar mono */
  file: string;
  /** tag pill : "lime" (Novarift) ou "coral" (projets Togo) */
  accent: "lime" | "coral";
  tag: string;
  name: string;
  description: string;
  links: ProjectLink[];
  meta: MetaRow[];
  stack: string[];
};

export const projects: Project[] = [
  {
    slug: "mamashop",
    file: "mamashop — gestion commerce",
    accent: "coral",
    tag: "commerce · togo",
    name: "MamaShop",
    description:
      "Application mobile (React Native / Expo) de gestion pour un grossiste de fruits & légumes à Lomé. Trois espaces selon le rôle (Gérant, Agent de terrain, Diaspora), suivi du stock, des ventes et des crédits — conçue offline-first pour rester utilisable même sans réseau.",
    links: [
      { label: "↗ Étude de cas", href: "/projets/mamashop" },
      { label: "↗ Code (GitHub)", href: "#" }, // TODO: repo public
    ],
    meta: [
      { label: "rôle", value: "Dev full-stack (mobile)" },
      { label: "backend", value: "Supabase / PostgreSQL" },
      { label: "mode", value: "Offline-first + sync" },
    ],
    stack: ["React Native", "Expo", "TypeScript", "Supabase", "PostgreSQL"],
  },
  {
    slug: "abo",
    file: "abo.tg — artisans vérifiés",
    accent: "coral",
    tag: "marketplace · togo",
    name: "ABO",
    description:
      "Plateforme mobile-first qui donne une présence numérique crédible aux artisans et techniciens à Lomé. Badge « Vérifié ABO » après vérification d'identité, recherche par métier et quartier, devis directs via WhatsApp.",
    links: [
      { label: "↗ Étude de cas", href: "/projets/abo" },
      { label: "↗ Code (GitHub)", href: "#" }, // TODO: repo public
    ],
    meta: [
      { label: "rôle", value: "Dev full-stack" },
      { label: "cible MVP", value: "20 artisans vérifiés" },
      { label: "temps inscription", value: "< 10 min" },
    ],
    stack: ["Next.js 14", "TypeScript", "Prisma", "Cloudflare R2"],
  },
  {
    slug: "chichicuties",
    file: "chichicuties-bot — automation",
    accent: "lime",
    tag: "automation · telegram",
    name: "ChiChicuties",
    description:
      "Bot Telegram qui automatise la prise de rendez-vous d'un salon de coiffure : le client choisit une prestation et un créneau directement dans la conversation, reçoit une confirmation instantanée, puis un rappel automatique avant son RDV — zéro appel, zéro oubli.",
    links: [{ label: "↗ Étude de cas", href: "/projets/chichicuties" }],
    meta: [
      { label: "rôle", value: "Conception & automatisation" },
      { label: "canal", value: "Telegram Bot API" },
      { label: "valeur", value: "RDV 24/7 · rappels auto" },
    ],
    stack: ["Telegram Bot API", "n8n", "Automatisation", "Scheduler"],
  },
  {
    slug: "novarift",
    file: "novarift.io — agence",
    accent: "lime",
    tag: "agence · 2025",
    name: "Novarift",
    description:
      "Agence digitale que j'ai cofondée au Canada. Sites web haute performance, applications web, automatisation et intégration d'IA. Une expérience entrepreneuriale qui m'a appris à livrer de A à Z : cadrage client, architecture, code et déploiement.",
    links: [
      { label: "↗ Étude de cas", href: "/projets/novarift" },
      { label: "↗ novarift.io", href: "https://novarift.io" },
    ],
    meta: [
      { label: "rôle", value: "Cofondateur · Dev" },
      { label: "approche", value: "Vanilla · 0 framework" },
      { label: "perf", value: "Lighthouse > 90" },
    ],
    stack: ["HTML", "CSS", "JavaScript", "Vercel"],
  },
];
