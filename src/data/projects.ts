// ============================================================
// Projets : ce que chaque projet FAIT, en langage simple.
// Sources : README des repos, site kelthen.com (repo Kelthen/kelthen),
// workflows n8n, et l'ancienne étude de cas ABO (repo vide sur GitHub).
// Pas d'architecture ni de code. Un champ inconnu reste `null`.
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
  /** Lien public ; null = pas de lien public. */
  href: string | null;
  hrefLabel?: string;
  /** Vraie capture dans /public/projets/<slug>/ ; sinon le dessin du projet. */
  image?: string;
};

export const projects: Project[] = [
  {
    slug: "mamashop",
    name: "MamaShop",
    pitch: "La gestion d'une boutique dans la poche, même sans réseau.",
    description:
      "Application mobile de gestion pour les petits commerces d'Afrique de l'Ouest, en français et en FCFA. Trois espaces : le gérant (tableau de bord, finances, marges, stock, fournisseurs, employés), l'agent de terrain (ventes, arrivages, crédits clients) et la diaspora (vue en lecture seule pour la famille qui soutient le commerce). Les ventes s'enregistrent même hors ligne et se synchronisent au retour du réseau.",
    tech: "React Native, Supabase",
    href: "https://github.com/RhamonK/bizup-africa",
    hrefLabel: "Code sur GitHub",
  },
  {
    slug: "abo",
    name: "ABO",
    pitch: "Trouver un artisan de confiance, vérifié, près de chez soi.",
    description:
      "Place de marché à Lomé qui met en relation des clients et des artisans vérifiés : badge « Vérifié ABO » après vérification d'identité, documents protégés, recherche par métier et par quartier, avis liés à une vraie demande, devis puis échange sur WhatsApp.",
    tech: "Next.js, PostgreSQL",
    href: null,
  },
  {
    slug: "chichicuties",
    name: "ChiChicuties",
    pitch: "Un salon qui prend ses rendez-vous tout seul, sur tous les canaux.",
    description:
      "Site et système de réservation pour un salon de coiffure. Les clientes réservent en ligne (prestation, date, créneau, photo de référence) ou avec une assistante IA sur le site, Telegram, WhatsApp, Messenger ou Instagram. La propriétaire valide chaque demande d'un tap sur Telegram ; la cliente reçoit sa confirmation par SMS et courriel, l'agenda se met à jour, et des rappels partent 24 h et 2 h avant.",
    tech: "Next.js, Supabase, n8n",
    href: null,
  },
  {
    slug: "kelthen",
    name: "Kelthen Inc.",
    pitch: "Mon agence : sites, applications et automatisations sur mesure.",
    description:
      "Agence au Canada qui construit des sites, des applications et des automatisations pour les entrepreneurs et les commerces de proximité : site qui attire des clients, réservation en ligne, secrétaire virtuelle par IA, rappels SMS et courriel, visibilité Google et avis clients. En interne, j'ai automatisé la prospection, les relances et la publication sur les réseaux.",
    tech: "n8n, Supabase",
    href: "https://kelthen.com",
    hrefLabel: "kelthen.com",
    image: "/projets/kelthen/accueil.jpg",
  },
  {
    slug: "fraul",
    name: "Fraul",
    pitch: "Une boutique de mode qu'on visite comme un centre commercial en 3D.",
    description:
      "Boutique en ligne de vêtements et chaussures, réalisée avec l'équipe Kelthen. Son expérience principale, le Fraul Walk, est un centre commercial en 3D avec une boutique par marque : on touche une vitrine pour entrer. On peut aussi composer une tenue, garder ses envies, demander une pièce introuvable et suivre sa commande. Projet en cours.",
    tech: "Next.js, Three.js, Supabase",
    href: null,
  },
];
