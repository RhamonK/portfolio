// « En bref » : quelques repères chiffrés, tous vérifiables ailleurs sur le site.
// Rien d'estimé : chaque valeur cite sa source. Pour ajouter un chiffre (clients,
// automatisations en production…), l'ajouter ici seulement quand il est réel.

import type { Lang } from "@/i18n";
import { projects } from "@/data/projects";

type T = Record<Lang, string>;

export type Fact = { value: string; label: T };

export const brief: Fact[] = [
  {
    // src/data/parcours.ts : ODDA Technologies, oct. 2021
    value: "2021",
    label: { fr: "premières applications web en production", en: "first web apps in production" },
  },
  {
    // src/data/projects.ts
    value: String(projects.length),
    label: { fr: "projets réels, tous présentés ici", en: "real projects, all shown here" },
  },
  {
    // Studio Nala : site, Telegram, WhatsApp, Messenger, Instagram
    value: "5",
    label: { fr: "canaux de réservation reliés par n8n", en: "booking channels connected with n8n" },
  },
  {
    // src/data/site.ts : languages
    value: "FR · EN",
    label: { fr: "deux langues de travail", en: "two working languages" },
  },
];
