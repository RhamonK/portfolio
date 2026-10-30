// ============================================================
// Projets : ce que chaque projet FAIT, en langage simple.
// Pas d'architecture ni de code. Rien d'inventé : un champ
// à confirmer reste `null` et s'affiche comme emplacement neutre.
// ============================================================

export type Project = {
  slug: string;
  name: string;
  /** Une phrase « ce que ça fait », affichée sous l'écran. */
  pitch: string;
  /** Description plus longue pour le Mode rapide et le SEO. */
  description: string;
  /** Quelques technologies citées en passant ; null = à confirmer. */
  tech: string | null;
  /** Lien public ; null = à fournir. */
  href: string | null;
  hrefLabel?: string;
};

export const projects: Project[] = [
  {
    slug: "mamashop",
    name: "MamaShop",
    pitch:
      "Le stock, les ventes et les crédits d'un grossiste, au même endroit, même sans réseau.",
    description:
      "Application mobile de gestion pour un grossiste de fruits et légumes à Lomé. Trois espaces selon le rôle : gérant, agent de terrain, diaspora. Suivi du stock, des ventes et des crédits clients au même endroit, tableau de bord en direct, utilisable même sans réseau.",
    tech: "React Native, Supabase",
    href: "https://github.com/RhamonK/bizup-africa",
    hrefLabel: "Code sur GitHub",
  },
  {
    slug: "abo",
    name: "ABO",
    pitch: "Trouver un artisan de confiance, vérifié, en quelques minutes.",
    description:
      "Place de marché qui met en relation des clients et des artisans vérifiés. Identité vérifiée, badge de confiance, documents sécurisés, avis vérifiés.",
    tech: null,
    href: "https://github.com/RhamonK/abo",
    hrefLabel: "Code sur GitHub",
  },
  {
    slug: "chichicuties",
    name: "ChiChicuties",
    pitch: "Des réservations prises et rappelées automatiquement, dans Telegram.",
    description:
      "Bot Telegram qui gère les réservations et envoie des rappels automatiques.",
    tech: "Telegram, automatisation",
    href: null,
  },
  {
    slug: "kelthen",
    name: "Kelthen Inc.",
    pitch: "Mon agence : sites web, automatisation et IA pour les entreprises.",
    description:
      "Mon agence : sites web, automatisation et intégration d'IA pour des entreprises.",
    tech: null,
    href: "https://kelthen.com",
    hrefLabel: "kelthen.com",
  },
  {
    slug: "fraul",
    name: "Fraul",
    pitch: "Boutique en ligne sur mesure, réalisée avec Kelthen.",
    description: "Boutique en ligne sur mesure réalisée avec Kelthen.",
    tech: null,
    href: null,
  },
];
