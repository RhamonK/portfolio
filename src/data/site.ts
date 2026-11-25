// ============================================================
// Configuration centrale du site : marque, contact, CV.
// ============================================================

import type { Lang } from "@/i18n";

export const site = {
  name: "Rhamone Nyavedji",
  domain: "rhamonenyavedji.com",
  url: "https://rhamonenyavedji.com",
  location: "Gatineau / Ottawa, QC",
  languages: "FR / EN",
  email: "rhamonkota@gmail.com",
  links: {
    github: "https://github.com/RhamonK",
    kelthen: "https://kelthen.com",
  },
  cv: {
    fr: "/cv/Rhamone_Nyavedji.pdf",
    en: "/cv/Rhamone_Nyavedji_EN.pdf",
  },
} as const;

export const siteCopy: Record<
  Lang,
  { title: string; role: string; position: string; description: string; availability: string }
> = {
  fr: {
    title: "Rhamone Nyavedji — Développeur logiciel & automatisation IA",
    role: "Développeur full-stack · IA · automatisation",
    position: "Directeur, Kelthen Inc.",
    description:
      "Rhamone Nyavedji, développeur logiciel et automatisation IA, directeur de Kelthen Inc. Applications web et mobiles, automatisations et intégration d'IA. Gatineau / Ottawa, bilingue FR / EN.",
    availability: "ouvert aux opportunités · poste ou mission",
  },
  en: {
    title: "Rhamone Nyavedji — Software developer & AI automation",
    role: "Full-stack developer · AI · automation",
    position: "Director, Kelthen Inc.",
    description:
      "Rhamone Nyavedji, software developer and AI automation specialist, Director of Kelthen Inc. Web and mobile apps, automations and AI integration. Gatineau / Ottawa, bilingual FR / EN.",
    availability: "open to opportunities · job or contract",
  },
};
