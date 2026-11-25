// Expertise : cinq piliers, chacun prouvé par des projets réels (src/data/projects.ts).
// Les outils sont ceux que montrent ces projets, ce portfolio et l'activité de Kelthen.

import type { Lang } from "@/i18n";
import type { Tag } from "@/data/projects";

type T = Record<Lang, string>;

export type Pillar = {
  /** Étiquette du filtre Projets correspondant (bouton « Voir les projets »). */
  tag: Tag;
  title: T;
  text: T;
  tools: string[];
  /** Projets qui le prouvent (slugs) ; « portfolio » = ce site. */
  proofs: string[];
  /**
   * Un vrai workflow, étape par étape (affiché dans la fiche du pilier).
   * Repris tel quel de la description du projet cité dans `caption`.
   */
  flow?: { steps: { title: T; detail: T }[]; caption: T };
};

export const pillars: Pillar[] = [
  {
    tag: "web",
    title: { fr: "Web", en: "Web" },
    text: {
      fr: "Sites et applications web sur mesure, de la maquette à la mise en production.",
      en: "Custom websites and web apps, from mock-up to production.",
    },
    tools: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Tailwind CSS", "Node.js", "API REST", "Laravel", "SQL", "PostgreSQL", "MySQL", "Supabase", "Firebase"],
    proofs: ["fraul", "studio-nala", "kelthen", "abo"],
  },
  {
    tag: "mobile",
    title: { fr: "Mobile", en: "Mobile" },
    text: {
      fr: "Applications mobiles qui continuent de fonctionner sans réseau et se synchronisent au retour.",
      en: "Mobile apps that keep working offline and sync when the network returns.",
    },
    tools: ["React Native", "Supabase", "Firebase"],
    proofs: ["mamashop"],
  },
  {
    tag: "automation",
    title: { fr: "Automatisation", en: "Automation" },
    text: {
      fr: "Gestion des leads de bout en bout (capture, qualification, relances), courriels automatiques, prospection, réservations, rappels, publications.",
      en: "End-to-end lead management (capture, qualification, follow-ups), automated emails, prospecting, bookings, reminders, social posts.",
    },
    tools: ["n8n", "Make", "Zapier", "Gestion des leads", "CRM", "Courriels automatisés", "Webhooks", "API REST"],
    proofs: ["studio-nala", "kelthen"],
    // Studio Nala (src/data/projects.ts) : de la demande de la cliente au rappel.
    flow: {
      steps: [
        { title: { fr: "Demande", en: "Request" }, detail: { fr: "5 canaux", en: "5 channels" } },
        { title: { fr: "Assistante IA", en: "AI assistant" }, detail: { fr: "prend la demande", en: "takes the request" } },
        { title: { fr: "Validation", en: "Approval" }, detail: { fr: "1 tap Telegram", en: "1 tap on Telegram" } },
        { title: { fr: "Confirmation", en: "Confirmation" }, detail: { fr: "SMS · courriel · agenda", en: "SMS · email · calendar" } },
        { title: { fr: "Rappels", en: "Reminders" }, detail: { fr: "24 h et 2 h avant", en: "24 h and 2 h before" } },
      ],
      caption: {
        fr: "Le workflow n8n de Studio Nala : site, Telegram, WhatsApp, Messenger ou Instagram, jusqu'au rappel.",
        en: "Studio Nala's n8n workflow: website, Telegram, WhatsApp, Messenger or Instagram, all the way to the reminder.",
      },
    },
  },
  {
    tag: "ai",
    title: { fr: "Intégration IA", en: "AI integration" },
    text: {
      fr: "Assistants conversationnels branchés sur le site, WhatsApp, Telegram, Messenger ou Instagram.",
      en: "Conversational assistants plugged into the website, WhatsApp, Telegram, Messenger or Instagram.",
    },
    tools: ["Agents IA", "LLM", "Prompts", "WhatsApp", "Telegram", "Messenger", "Instagram"],
    proofs: ["studio-nala", "kelthen"],
  },
  {
    tag: "3d",
    title: { fr: "3D interactive", en: "Interactive 3D" },
    text: {
      fr: "Expériences 3D dans le navigateur, pensées pour rester fluides et accessibles sur téléphone.",
      en: "3D experiences in the browser, designed to stay smooth and accessible on phones.",
    },
    tools: ["Three.js", "React Three Fiber", "GSAP", "Blender"],
    proofs: ["fraul", "portfolio"],
  },
];
