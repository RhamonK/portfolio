// ============================================================
// Études de cas détaillées — une page /projets/[slug] par projet.
// Contenu basé sur le CODE RÉEL pour mamashop / abo / novarift,
// et sur la DESCRIPTION pour chichicuties (pas de dossier source).
// ============================================================

export type MockupKind = "phone" | "browser" | "telegram";

export type Decision = {
  title: string;
  body: string;
};

export type CaseStudy = {
  slug: string;
  name: string;
  tag: string;
  accent: "lime" | "coral";
  year: string;
  role: string;
  /** phrase courte d'accroche */
  tagline: string;
  /** URL/label affiché dans le cadre du mockup */
  deviceLabel: string;
  context: string;
  problem: string;
  approach: string[];
  decisions: Decision[];
  result: string[];
  stack: string[];
  links: { label: string; href: string }[];
  mockup: MockupKind;
};

export const caseStudies: Record<string, CaseStudy> = {
  mamashop: {
    slug: "mamashop",
    name: "MamaShop",
    tag: "commerce · mobile",
    accent: "coral",
    year: "2026",
    role: "Développeur full-stack (mobile)",
    tagline:
      "Une app mobile de gestion pour petits commerces d'Afrique de l'Ouest — pensée pour fonctionner même sans réseau.",
    deviceLabel: "MamaShop",
    context:
      "Application mobile (React Native / Expo) de gestion de commerce, avec trois espaces de travail isolés selon le rôle : Gérant, Agent de terrain et Diaspora.",
    problem:
      "Les petits commerces suivent leur stock, leurs ventes et leurs crédits clients de tête ou sur papier. La connexion internet est instable sur le terrain, et plusieurs personnes (le gérant, l'agent qui vend, le proche à l'étranger qui finance) ont besoin de vues très différentes sur la même activité.",
    approach: [
      "Une seule app, trois espaces séparés par rôle (groupes de routes Expo Router + tiroir animé persistant).",
      "Backend Supabase (PostgreSQL, Realtime, Auth) avec une couche services unique — aucun appel base dans les composants.",
      "Conception offline-first : l'app reste utilisable sans réseau et se synchronise à la reconnexion.",
    ],
    decisions: [
      {
        title: "Offline-first par file d'attente",
        body: "Les actions (vente, ajout de stock…) sont écrites localement dans une file AsyncStorage, puis rejouées vers Supabase à la reconnexion. La détection réseau passe par NetInfo, jamais par navigator.onLine.",
      },
      {
        title: "Écritures atomiques côté base",
        body: "Les opérations sensibles (create_sale, increment_stock, apply_credit_payment) sont des fonctions RPC PostgreSQL. Le stock reste cohérent même en cas de double envoi ou de sync différée.",
      },
      {
        title: "Architecture par rôles",
        body: "Chaque rôle a son propre groupe de routes et ses écrans ; les composants partagés restent agnostiques du rôle. TypeScript strict et types partagés centralisés.",
      },
    ],
    result: [
      "Le gérant suit finances, marges et historique de ventes en temps réel.",
      "Les agents de terrain continuent de vendre et d'enregistrer, même hors-ligne.",
      "Base de code typée, testable (jest-expo) et organisée par responsabilités.",
    ],
    stack: [
      "React Native",
      "Expo",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "AsyncStorage",
    ],
    links: [{ label: "↗ Code (GitHub)", href: "#" }],
    mockup: "phone",
  },

  abo: {
    slug: "abo",
    name: "ABO",
    tag: "marketplace · togo",
    accent: "coral",
    year: "2025",
    role: "Développeur full-stack",
    tagline:
      "Une plateforme d'artisans vérifiés à Lomé, avec un vrai workflow de vérification d'identité et un badge de confiance.",
    deviceLabel: "abo.tg/artisans/kofi-plombier-lome",
    context:
      "Marketplace mobile-first (Next.js 14) qui donne une présence numérique crédible aux artisans et techniciens, et permet aux clients de trouver quelqu'un de fiable près de chez eux.",
    problem:
      "Trouver un bon artisan à Lomé repose sur le bouche-à-oreille, avec un vrai risque d'arnaque ou de travail bâclé. Les artisans sérieux, eux, n'ont aucun moyen de prouver qu'ils le sont.",
    approach: [
      "Un badge « Vérifié ABO » accordé après vérification d'identité réelle.",
      "Recherche par métier et par quartier, profils avec services, portfolio avant/après et avis.",
      "Demande de devis directe, et passage du contact sur WhatsApp.",
    ],
    decisions: [
      {
        title: "Documents d'identité sécurisés",
        body: "Les pièces (CNI, portrait…) sont stockées sur Cloudflare R2. La clé de stockage n'est jamais exposée : l'accès se fait uniquement via des URLs signées à durée limitée.",
      },
      {
        title: "Auth par téléphone + OTP",
        body: "Le numéro (WhatsApp) sert d'identifiant. Les codes OTP sont hachés en base, avec sessions + refresh tokens (jose) et limitation de débit (rate limiting) sur les endpoints sensibles.",
      },
      {
        title: "Modération & confiance",
        body: "Cycle de vie du badge (en attente → en revue → vérifié / rejeté / suspendu), journal d'audit de chaque action admin, et avis « vérifié » uniquement s'il est lié à un vrai devis.",
      },
    ],
    result: [
      "Cible MVP : 20 artisans vérifiés, inscription en moins de 10 minutes.",
      "Modèle de données complet (Prisma/PostgreSQL) : artisans, vérification, devis, avis, signalements, audit.",
      "SEO & PWA prêts (sitemap, robots, manifest) pour un usage mobile réel.",
    ],
    stack: [
      "Next.js 14",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Cloudflare R2",
      "JWT (jose)",
    ],
    links: [{ label: "↗ Code (GitHub)", href: "#" }],
    mockup: "browser",
  },

  chichicuties: {
    slug: "chichicuties",
    name: "ChiChicuties",
    tag: "automation · telegram",
    accent: "lime",
    year: "2026",
    role: "Conception & automatisation",
    tagline:
      "Un bot Telegram qui prend les rendez-vous d'un salon de coiffure et relance les clients automatiquement.",
    deviceLabel: "ChiChicuties Bot",
    context:
      "Automatisation de la prise de rendez-vous pour un salon de coiffure, directement dans Telegram, avec rappels automatiques avant chaque RDV.",
    problem:
      "Gérer les rendez-vous par appels et messages privés est chronophage pour le salon, et beaucoup de clients oublient leur RDV (no-shows), ce qui fait perdre des créneaux.",
    approach: [
      "Le client réserve en quelques boutons dans une conversation Telegram — prestation, jour, créneau.",
      "Confirmation instantanée, puis rappel automatique avant le rendez-vous.",
      "Aucune app à installer pour le client : tout se passe dans Telegram.",
    ],
    decisions: [
      {
        title: "Parcours conversationnel guidé",
        body: "Le client choisit sa prestation puis un créneau via des boutons (clavier inline Telegram) — pas de saisie libre, pas d'appel téléphonique, pas d'erreur de format.",
      },
      {
        title: "Rappels automatiques planifiés",
        body: "Un planificateur envoie un rappel avant le rendez-vous pour réduire fortement les oublis et les créneaux perdus.",
      },
      {
        title: "Automatisation sans serveur lourd",
        body: "L'orchestration (réception des messages Telegram, logique de créneaux, envoi des confirmations et rappels) repose sur un workflow d'automatisation n8n.",
      },
    ],
    result: [
      "Réservation possible 24/7, sans intervention humaine.",
      "Moins de no-shows grâce aux rappels automatiques.",
      "Le salon se concentre sur les clients plutôt que sur l'agenda.",
    ],
    stack: ["Telegram Bot API", "n8n", "Automatisation", "Scheduler"],
    links: [],
    mockup: "telegram",
  },

  novarift: {
    slug: "novarift",
    name: "Novarift",
    tag: "agence · 2025",
    accent: "lime",
    year: "2025",
    role: "Cofondateur · Développeur",
    tagline:
      "Le site vitrine de l'agence digitale Novarift — ultra-rapide, sans framework, esthétique premium.",
    deviceLabel: "novarift.io",
    context:
      "Site vitrine de l'agence digitale Novarift (Canada), conçu pour inspirer confiance dès la première seconde et charger instantanément.",
    problem:
      "Le site d'une agence est sa première démonstration de compétence : il doit être impeccable, rapide et mémorable — un site lent ou générique décrédibilise immédiatement l'offre.",
    approach: [
      "Un site volontairement minimaliste côté technique : un seul fichier HTML, zéro build.",
      "Une direction artistique premium (noir profond + or, typographies serif/mono).",
      "Des micro-interactions soignées (curseur personnalisé, reveals au scroll, marquee).",
    ],
    decisions: [
      {
        title: "Zéro dépendance, performance maximale",
        body: "HTML/CSS/JS vanilla en un seul fichier, sans framework ni étape de build. Résultat : chargement quasi instantané et score Lighthouse élevé.",
      },
      {
        title: "Contenu piloté par les données",
        body: "Les projets du portfolio sont stockés dans un tableau JavaScript et rendus dynamiquement — on ajoute un projet sans jamais toucher au HTML.",
      },
      {
        title: "Responsive premium",
        body: "Mise en page pensée mobile-first, testée de 360px à 1440px, avec une identité visuelle cohérente sur toutes les tailles.",
      },
    ],
    result: [
      "Site en production sur novarift.io, hébergé sur Vercel.",
      "Chargement rapide, responsive, et une image de marque haut de gamme.",
    ],
    stack: ["HTML", "CSS", "JavaScript", "Vercel"],
    links: [{ label: "↗ novarift.io", href: "https://novarift.io" }],
    mockup: "browser",
  },
};

export const caseStudySlugs = Object.keys(caseStudies);
