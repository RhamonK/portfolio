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
  /** tag pill : "lime" (Kelthen) ou "coral" (projets Togo) */
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
    slug: "aura",
    file: "aura — réceptionniste IA",
    accent: "lime",
    tag: "IA · multi-canal",
    name: "AURA",
    description:
      "Réceptionniste virtuelle propulsée par IA qui répond aux clients d'un commerce sur tous ses canaux — WhatsApp, Messenger, Instagram, Telegram et chat web — depuis un seul cerveau. Elle comprend le texte comme les notes vocales (transcription automatique), consulte services et disponibilités, puis prend, retrouve, modifie ou annule un rendez-vous dans Google Calendar, avant de répondre sur le canal d'origine.",
    links: [{ label: "↗ Étude de cas", href: "/projets/aura" }],
    meta: [
      { label: "rôle", value: "Architecte & builder IA" },
      { label: "canaux", value: "5 · web · WA · Messenger · IG · TG" },
      { label: "cerveau", value: "Agent Gemini + outils" },
    ],
    stack: ["n8n", "Google Gemini", "Groq / Whisper", "Google Calendar", "Meta API", "Supabase"],
  },
  {
    slug: "agent-financier",
    file: "agent-financier — IA marché",
    accent: "lime",
    tag: "IA · finance",
    name: "Agent Financier IA",
    description:
      "Analyste financier autonome qui surveille un portefeuille. Chaque matin, un agent IA (Gemini) consolide cours et actualités, rédige un rapport clair, l'archive dans Google Sheets et l'envoie sur Telegram. En journée, une veille intraday ne déclenche une alerte que lorsqu'un signal réellement significatif est détecté.",
    links: [{ label: "↗ Étude de cas", href: "/projets/agent-financier" }],
    meta: [
      { label: "rôle", value: "Conception & automatisation IA" },
      { label: "rythme", value: "Rapport 8h + veille intraday" },
      { label: "sortie", value: "Telegram + Google Sheets" },
    ],
    stack: ["n8n", "Google Gemini", "APIs marché", "RSS News", "Google Sheets"],
  },
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
      { label: "↗ Code (GitHub)", href: "https://github.com/RhamonK/bizup-africa" },
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
      { label: "↗ Code (GitHub)", href: "https://github.com/RhamonK/abo" },
    ],
    meta: [
      { label: "rôle", value: "Dev full-stack" },
      { label: "cible MVP", value: "20 artisans vérifiés" },
      { label: "temps inscription", value: "< 10 min" },
    ],
    stack: ["Next.js 14", "TypeScript", "Prisma", "Cloudflare R2"],
  },
  {
    slug: "cutieschichi",
    file: "cutieschichi-bot — automation",
    accent: "lime",
    tag: "automation · whatsapp",
    name: "CutiesChichi",
    description:
      "Système de réservation par WhatsApp pour un salon de coiffure. La cliente choisit une prestation et un créneau dans la conversation ; le salon est prévenu en direct (WhatsApp + Telegram), le rendez-vous est ajouté à Google Calendar, et la cliente reçoit confirmation et rappel par WhatsApp, SMS ou email — zéro appel, zéro oubli.",
    links: [{ label: "↗ Étude de cas", href: "/projets/cutieschichi" }],
    meta: [
      { label: "rôle", value: "Conception & automatisation" },
      { label: "canal", value: "WhatsApp Business API" },
      { label: "valeur", value: "RDV 24/7 · rappels auto" },
    ],
    stack: ["WhatsApp Business API", "n8n", "Google Calendar", "Scheduler"],
  },
  {
    slug: "kelthen-prospection",
    file: "kelthen — prospection auto",
    accent: "lime",
    tag: "automation · growth",
    name: "Kelthen · Prospection auto",
    description:
      "Moteur de prospection B2B pour l'agence. On envoie une recherche par Telegram ; le workflow scrape les entreprises via Google Maps (Apify), détecte celles sans vrai site, audite la performance des sites existants (Google PageSpeed), score chaque prospect, puis enregistre les leads qualifiés dans Google Sheets et renvoie une synthèse sur Telegram.",
    links: [{ label: "↗ Étude de cas", href: "/projets/kelthen-prospection" }],
    meta: [
      { label: "rôle", value: "Conception & automatisation" },
      { label: "sources", value: "Google Maps · PageSpeed" },
      { label: "sortie", value: "Leads scorés → Sheets" },
    ],
    stack: ["n8n", "Apify", "Google PageSpeed", "Google Sheets", "Telegram Bot API"],
  },
  {
    slug: "kelthen",
    file: "kelthen.com — agence",
    accent: "lime",
    tag: "agence · 2025",
    name: "Kelthen",
    description:
      "Agence digitale que j'ai cofondée au Canada. Sites web haute performance, applications web, automatisation et intégration d'IA. Une expérience entrepreneuriale qui m'a appris à livrer de A à Z : cadrage client, architecture, code et déploiement.",
    links: [
      { label: "↗ Étude de cas", href: "/projets/kelthen" },
      { label: "↗ kelthen.com", href: "https://kelthen.com" },
      { label: "↗ Code (GitHub)", href: "https://github.com/RhamonK/Novarift" },
    ],
    meta: [
      { label: "rôle", value: "Cofondateur · Dev" },
      { label: "approche", value: "Vanilla · 0 framework" },
      { label: "perf", value: "Lighthouse > 90" },
    ],
    stack: ["HTML", "CSS", "JavaScript", "Vercel"],
  },
];
