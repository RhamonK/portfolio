// Parcours : exactement ces trois étapes, de la plus récente à la plus ancienne (FR / EN).

import type { Lang } from "@/i18n";

type T = Record<Lang, string>;

export type Step = {
  period: T;
  place: string;
  title: T;
  org: string;
  text: T;
  href?: string;
};

export const parcours: Step[] = [
  {
    period: { fr: "2025 – présent", en: "2025 – present" },
    place: "Gatineau, QC",
    title: { fr: "Directeur exécutif", en: "Executive Director" },
    org: "Kelthen Inc.",
    text: {
      fr: "Agence web, automatisation et intégration IA ; référent du développement des sites.",
      en: "Web agency, automation and AI integration; lead for website development.",
    },
    href: "https://kelthen.com",
  },
  {
    period: { fr: "oct. 2021 – juin 2024", en: "Oct. 2021 – June 2024" },
    place: "Lomé, Togo",
    title: { fr: "Développeur Web & Automatisation", en: "Web & Automation Developer" },
    org: "ODDA Technologies",
    text: {
      fr: "Applications web, APIs, automatisations et bases de données en production.",
      en: "Web applications, APIs, automations and databases in production.",
    },
  },
  {
    period: { fr: "2020 – juil. 2023", en: "2020 – July 2023" },
    place: "Lomé, Togo",
    title: {
      fr: "Licence en informatique, développement d'applications",
      en: "Bachelor's in Computer Science, Application Development",
    },
    org: "UCAO-UUT",
    text: {
      fr: "Certification en préparation : Microsoft Azure AI Fundamentals (AI-900).",
      en: "Certification in progress: Microsoft Azure AI Fundamentals (AI-900).",
    },
  },
];
