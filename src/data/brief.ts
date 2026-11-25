// « Ce que je sais faire » : toute la chaîne, du pixel à l'agent IA.
// Chaque domaine : une phrase qui dit ce que ça apporte, puis les outils.

import type { Lang } from "@/i18n";

type T = Record<Lang, string>;

export type Skill = { title: T; pitch: T; tools: string[] };

export const skills: Skill[] = [
  {
    title: { fr: "Front-end", en: "Front-end" },
    pitch: {
      fr: "Des interfaces rapides, propres et qui marquent, du site vitrine à l'expérience 3D.",
      en: "Fast, clean, memorable interfaces, from a landing page to a 3D experience.",
    },
    tools: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Tailwind CSS", "GSAP", "Three.js"],
  },
  {
    title: { fr: "Back-end & API", en: "Back-end & APIs" },
    pitch: {
      fr: "La logique qui fait tourner le produit : API, comptes, paiements, webhooks.",
      en: "The logic that runs the product: APIs, accounts, payments, webhooks.",
    },
    tools: ["Node.js", "API REST", "Webhooks", "Laravel", "PHP", "Stripe", "JSON"],
  },
  {
    title: { fr: "Bases de données", en: "Databases" },
    pitch: {
      fr: "Des données bien rangées, sécurisées et synchronisées, même hors ligne.",
      en: "Well-structured, secure data that stays in sync, even offline.",
    },
    tools: ["SQL", "PostgreSQL", "MySQL", "Supabase", "Firebase"],
  },
  {
    title: { fr: "IA & agents", en: "AI & agents" },
    pitch: {
      fr: "Des agents IA qui répondent, réservent et agissent sur WhatsApp, Telegram, Messenger, Instagram ou le site.",
      en: "AI agents that answer, book and take action on WhatsApp, Telegram, Messenger, Instagram or the website.",
    },
    tools: ["Agents IA", "LLM", "Prompts", "Outils d'agent", "WhatsApp", "Telegram", "Messenger", "Instagram"],
  },
  {
    title: { fr: "Automatisation", en: "Automation" },
    pitch: {
      fr: "Le travail répétitif disparaît : courriels, leads, prospection, relances, réservations, publications.",
      en: "Repetitive work disappears: emails, leads, prospecting, follow-ups, bookings, social posts.",
    },
    tools: ["n8n", "Make", "Zapier", "Courriels auto", "Leads", "Relances", "SMS", "Agenda"],
  },
  {
    title: { fr: "Mobile & 3D", en: "Mobile & 3D" },
    pitch: {
      fr: "Des apps mobiles qui tiennent sans réseau, et de la 3D qui reste fluide sur téléphone.",
      en: "Mobile apps that work without a network, and 3D that stays smooth on phones.",
    },
    tools: ["React Native", "Hors ligne", "Three.js", "React Three Fiber", "Blender"],
  },
];
