// ============================================================
// Projets : ce que chaque projet FAIT, en langage simple (FR / EN).
// Sources : README des repos, site kelthen.com (repo Kelthen/kelthen),
// workflows n8n, et l'ancienne étude de cas ABO (repo vide sur GitHub).
// Pas d'architecture ni de code. Un champ inconnu reste `null`.
// ============================================================

import type { Lang } from "@/i18n";

type T = Record<Lang, string>;

export type Project = {
  slug: string;
  name: string;
  /** Une phrase « ce que ça fait », affichée sous l'écran. */
  pitch: T;
  /** Description plus longue pour le Mode rapide et le SEO. */
  description: T;
  /** Quelques technologies citées en passant ; null = à confirmer. */
  tech: string | null;
  /** Lien public ; null = pas de lien public. */
  href: string | null;
  hrefLabel?: T;
  /** Vraie capture dans /public/projets/<slug>/ ; sinon le dessin du projet. */
  image?: string;
  /** Cadrage de la capture (CSS object-position) ; par défaut en haut à gauche. */
  imagePosition?: string;
};

export const projects: Project[] = [
  {
    slug: "mamashop",
    name: "MamaShop",
    pitch: {
      fr: "La gestion d'une boutique dans la poche, même sans réseau.",
      en: "Running a shop from your pocket, even without a network.",
    },
    description: {
      fr: "Application mobile de gestion pour les petits commerces d'Afrique de l'Ouest, en français et en FCFA. Trois espaces : le gérant (tableau de bord, finances, marges, stock, fournisseurs, employés), l'agent de terrain (ventes, arrivages, crédits clients) et la diaspora (vue en lecture seule pour la famille qui soutient le commerce). Les ventes s'enregistrent même hors ligne et se synchronisent au retour du réseau.",
      en: "A shop-management mobile app for small businesses in West Africa, in French and CFA francs. Three spaces: the manager (dashboard, finances, margins, stock, suppliers, staff), the field agent (sales, deliveries, customer credit) and the diaspora (a read-only view for family abroad who support the business). Sales are recorded even offline and sync when the network returns.",
    },
    tech: "React Native, Supabase",
    href: "https://github.com/RhamonK/bizup-africa",
    hrefLabel: { fr: "Code sur GitHub", en: "Code on GitHub" },
    image: "/projets/mamashop/connexion.webp",
    imagePosition: "center",
  },
  {
    slug: "abo",
    name: "ABO",
    pitch: {
      fr: "Trouver un artisan de confiance, vérifié, près de chez soi.",
      en: "Find a trusted, verified tradesperson near you.",
    },
    description: {
      fr: "Place de marché à Lomé qui met en relation des clients et des artisans vérifiés : badge « Vérifié ABO » après vérification d'identité, documents protégés, recherche par métier et par quartier, avis liés à une vraie demande, devis puis échange sur WhatsApp.",
      en: "A marketplace in Lomé connecting clients with verified tradespeople: a “Vérifié ABO” badge after an identity check, protected documents, search by trade and neighbourhood, reviews tied to a real request, then a quote and a WhatsApp conversation.",
    },
    tech: "Next.js, PostgreSQL",
    href: null,
  },
  {
    slug: "studio-nala",
    name: "Studio Nala",
    pitch: {
      fr: "Un salon qui prend ses rendez-vous tout seul, sur tous les canaux.",
      en: "A salon that books its own appointments, on every channel.",
    },
    description: {
      fr: "Site et système de réservation pour un salon de tresses. Les clientes réservent en ligne (prestation, date, créneau, photo de référence) ou avec une assistante IA sur le site, Telegram, WhatsApp, Messenger ou Instagram. La propriétaire valide chaque demande d'un tap sur Telegram ; la cliente reçoit sa confirmation par SMS et courriel, l'agenda se met à jour, et des rappels partent 24 h et 2 h avant.",
      en: "A website and booking system for a braiding salon. Clients book online (service, date, time slot, reference photo) or through an AI assistant on the site, Telegram, WhatsApp, Messenger or Instagram. The owner approves each request with one tap on Telegram; the client gets confirmation by SMS and email, the calendar updates, and reminders go out 24 h and 2 h before.",
    },
    tech: "Next.js, Supabase, n8n",
    href: null,
    image: "/projets/studio-nala/reservation.webp",
  },
  {
    slug: "kelthen",
    name: "Kelthen Inc.",
    pitch: {
      fr: "Mon agence : sites, applications et automatisations sur mesure.",
      en: "My agency: custom websites, apps and automations.",
    },
    description: {
      fr: "Agence au Canada qui construit des sites, des applications et des automatisations pour les entrepreneurs et les commerces de proximité : site qui attire des clients, réservation en ligne, secrétaire virtuelle par IA, rappels SMS et courriel, visibilité Google et avis clients. En interne, j'ai automatisé la prospection, les relances et la publication sur les réseaux.",
      en: "An agency in Canada building websites, apps and automations for entrepreneurs and local businesses: websites that bring clients, online booking, an AI virtual receptionist, SMS and email reminders, Google visibility and customer reviews. Internally, I automated prospecting, follow-ups and social media publishing.",
    },
    tech: "n8n, Supabase",
    href: "https://kelthen.com",
    hrefLabel: { fr: "kelthen.com", en: "kelthen.com" },
    image: "/projets/kelthen/accueil.webp",
  },
  {
    slug: "fraul",
    name: "Fraul",
    pitch: {
      fr: "Une boutique de mode qu'on visite comme un centre commercial en 3D.",
      en: "A fashion store you visit like a 3D shopping mall.",
    },
    description: {
      fr: "Boutique en ligne de vêtements et chaussures, réalisée avec l'équipe Kelthen. Son expérience principale, le Fraul Walk, est un centre commercial en 3D avec une boutique par marque : on touche une vitrine pour entrer. On peut aussi composer une tenue, garder ses envies, demander une pièce introuvable et suivre sa commande. Projet en cours.",
      en: "An online clothing and shoe store, built with the Kelthen team. Its main experience, the Fraul Walk, is a 3D shopping mall with one shop per brand: tap a window to walk in. Visitors can also build an outfit, save favourites, request a hard-to-find piece and track their order. In progress.",
    },
    tech: "Next.js, Three.js, Supabase",
    href: null,
    image: "/projets/fraul/walk.webp",
    imagePosition: "center",
  },
];
