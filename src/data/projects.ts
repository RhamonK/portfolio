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
    file: "mamashop — gestion commerce",
    accent: "coral",
    tag: "commerce · togo",
    name: "MamaShop",
    description:
      "Système de gestion à distance pour un commerce de gros de fruits et légumes à Lomé. Application terrain mobile-first pour les employés, dashboard temps réel pour la direction, et automatisation des communications clients via WhatsApp.",
    links: [
      { label: "↗ Étude de cas", href: "#" }, // TODO: page /projets/mamashop
      { label: "↗ Code (GitHub)", href: "#" }, // TODO
    ],
    meta: [
      { label: "rôle", value: "Dev full-stack" },
      { label: "backend", value: "Supabase / PostgreSQL" },
      { label: "canal client", value: "WhatsApp API" },
    ],
    stack: ["Supabase", "n8n", "WhatsApp API", "React"],
  },
  {
    file: "abo.tg — artisans vérifiés",
    accent: "coral",
    tag: "marketplace · togo",
    name: "ABO",
    description:
      "Plateforme mobile-first qui donne une présence numérique crédible aux artisans et techniciens à Lomé. Badge « Vérifié ABO » après vérification d'identité, recherche par métier et quartier, devis directs via WhatsApp.",
    links: [
      { label: "↗ Étude de cas", href: "#" }, // TODO: page /projets/abo
      { label: "↗ Code (GitHub)", href: "#" }, // TODO
    ],
    meta: [
      { label: "rôle", value: "Dev full-stack" },
      { label: "cible MVP", value: "20 artisans vérifiés" },
      { label: "temps inscription", value: "< 10 min" },
    ],
    stack: ["Next.js 14", "TypeScript", "Prisma", "Cloudflare R2"],
  },
  {
    file: "novarift.io — agence",
    accent: "lime",
    tag: "agence · 2025",
    name: "Novarift",
    description:
      "Agence digitale que j'ai cofondée au Canada. Sites web haute performance, applications web, automatisation et intégration d'IA. Une expérience entrepreneuriale qui m'a appris à livrer de A à Z : cadrage client, architecture, code et déploiement.",
    links: [
      { label: "↗ novarift.io", href: "https://novarift.io" },
      { label: "↗ Code (GitHub)", href: "#" }, // TODO: repo public
    ],
    meta: [
      { label: "rôle", value: "Cofondateur · Dev full-stack" },
      { label: "projets livrés", value: "Plusieurs en prod" },
      { label: "périmètre", value: "Front · Back · Déploiement" },
    ],
    stack: ["Next.js", "Supabase", "Stripe", "Vercel", "n8n"],
  },
];
