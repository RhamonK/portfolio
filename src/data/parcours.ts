// Parcours : exactement ces trois étapes, de la plus récente à la plus ancienne.

export type Step = {
  period: string;
  place: string;
  title: string;
  org: string;
  text: string;
  href?: string;
};

export const parcours: Step[] = [
  {
    period: "2025 – présent",
    place: "Gatineau, QC",
    title: "Directeur exécutif",
    org: "Kelthen Inc.",
    text: "Agence web, automatisation et intégration IA ; référent du développement des sites.",
    href: "https://kelthen.com",
  },
  {
    period: "oct. 2021 – juin 2024",
    place: "Lomé, Togo",
    title: "Développeur Web & Automatisation",
    org: "ODDA Technologies",
    text: "Applications web, APIs, automatisations et bases de données en production.",
  },
  {
    period: "2020 – juil. 2023",
    place: "Lomé, Togo",
    title: "Licence en informatique, développement d'applications",
    org: "UCAO-UUT",
    text: "Certification en préparation : Microsoft Azure AI Fundamentals (AI-900).",
  },
];
