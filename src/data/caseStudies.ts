// ============================================================
// Études de cas détaillées — une page /projets/[slug] par projet.
// Contenu basé sur le CODE RÉEL pour mamashop / abo / kelthen,
// et sur la DESCRIPTION pour les projets d'automatisation (n8n).
// ============================================================

export type MockupKind =
  | "phone"
  | "browser"
  | "whatsapp"
  | "telegram"
  | "aura";

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

  cutieschichi: {
    slug: "cutieschichi",
    name: "CutiesChichi",
    tag: "automation · whatsapp",
    accent: "lime",
    year: "2026",
    role: "Conception & automatisation",
    tagline:
      "Un système de réservation par WhatsApp qui prend les rendez-vous d'un salon, prévient l'équipe en direct et relance les clientes automatiquement.",
    deviceLabel: "CutiesChichi",
    context:
      "Automatisation complète de la prise de rendez-vous d'un salon de coiffure : réservation côté cliente dans WhatsApp, notification de l'équipe en temps réel, agenda synchronisé et rappels automatiques.",
    problem:
      "Gérer les rendez-vous par appels et messages privés est chronophage pour le salon, et beaucoup de clientes oublient leur RDV (no-shows), ce qui fait perdre des créneaux. L'équipe a aussi besoin d'être prévenue instantanément de chaque nouvelle demande.",
    approach: [
      "Côté cliente : réservation en quelques boutons dans WhatsApp — prestation, jour, créneau.",
      "Côté salon : notification en temps réel de chaque demande, et rendez-vous poussé dans l'agenda.",
      "Confirmations et rappels multi-canaux (WhatsApp, SMS, email) pour réduire les oublis.",
    ],
    decisions: [
      {
        title: "Parcours conversationnel guidé",
        body: "La cliente choisit sa prestation puis un créneau via des boutons interactifs WhatsApp — pas de saisie libre, pas d'appel téléphonique, pas d'erreur de format.",
      },
      {
        title: "L'équipe prévenue, l'agenda à jour",
        body: "Chaque demande notifie le salon en direct (WhatsApp + Telegram) et, une fois validée, le rendez-vous est ajouté à Google Calendar. La cliente reçoit une confirmation (ou un refus) par WhatsApp, SMS ou email selon ce qu'elle a fourni.",
      },
      {
        title: "Backend fiable : sécurisé et sans doublon",
        body: "La validation passe par une API protégée par secret (rejet 401 sinon) et une garde d'idempotence (« déjà traité ») qui empêche de confirmer deux fois la même demande. L'orchestration repose sur n8n.",
      },
    ],
    result: [
      "Réservation possible 24/7, sans intervention humaine.",
      "Le salon est prévenu en temps réel et son agenda reste à jour.",
      "Moins de no-shows grâce aux rappels automatiques.",
    ],
    stack: ["WhatsApp Business API", "n8n", "Google Calendar", "Gmail / SMS", "API sécurisée"],
    links: [],
    mockup: "whatsapp",
  },

  aura: {
    slug: "aura",
    name: "AURA",
    tag: "IA · multi-canal",
    accent: "lime",
    year: "2026",
    role: "Architecte & builder IA",
    tagline:
      "Une réceptionniste IA unique qui répond aux clients sur WhatsApp, Messenger, Instagram, Telegram et le web — et prend les rendez-vous toute seule.",
    deviceLabel: "AURA · Réceptionniste IA",
    context:
      "AURA est une réceptionniste virtuelle multi-canal pour les commerces de service (salons, cliniques, restaurants). Un seul agent IA gère toutes les conversations entrantes, quel que soit le canal, et pilote un vrai agenda.",
    problem:
      "Un commerce reçoit des messages sur cinq canaux différents (WhatsApp, Messenger, Instagram, Telegram, chat du site) et doit répondre vite, souvent hors des heures d'ouverture. Répondre à la main, retrouver les dispos et noter chaque RDV est chronophage et source d'erreurs — et beaucoup de clients envoient des notes vocales.",
    approach: [
      "Un point d'entrée par canal, tous normalisés vers un format de message unique — l'IA n'a qu'un seul cerveau à alimenter.",
      "Support natif du texte ET de la voix : les notes vocales sont transcrites automatiquement avant d'atteindre l'agent.",
      "Un agent IA outillé qui ne se contente pas de discuter : il agit sur l'agenda (consulter, réserver, modifier, annuler).",
    ],
    decisions: [
      {
        title: "Une seule IA, cinq canaux",
        body: "Chaque canal (WhatsApp, Messenger, Instagram, Telegram, web) a son adaptateur d'entrée et de sortie, mais converge vers un unique agent Gemini. Un routeur renvoie la réponse sur le canal d'origine du client.",
      },
      {
        title: "Voix comprise, pas seulement le texte",
        body: "Les messages audio sont téléchargés, transcrits (Groq / Whisper) puis passés à l'agent comme du texte. Le client peut parler ; AURA comprend.",
      },
      {
        title: "Un agent qui agit sur l'agenda",
        body: "L'agent dispose d'outils concrets : consulter services & prix, vérifier les disponibilités, prendre / retrouver / modifier / annuler un rendez-vous dans Google Calendar, avec Google Sheets comme source des services et des réservations.",
      },
    ],
    result: [
      "Un seul cerveau IA répond sur cinq canaux, en texte comme en vocal.",
      "Les rendez-vous sont créés et gérés directement dans Google Calendar.",
      "Architecture modulaire : ajouter un canal = brancher un adaptateur, sans toucher au cœur.",
    ],
    stack: [
      "n8n",
      "Google Gemini",
      "Groq / Whisper",
      "Google Calendar",
      "Google Sheets",
      "Meta API",
      "Supabase",
    ],
    links: [],
    mockup: "aura",
  },

  "agent-financier": {
    slug: "agent-financier",
    name: "Agent Financier IA",
    tag: "IA · finance",
    accent: "lime",
    year: "2026",
    role: "Conception & automatisation IA",
    tagline:
      "Un analyste financier autonome qui livre un rapport de marché chaque matin et n'alerte en journée que sur les vrais signaux.",
    deviceLabel: "Agent Financier · Telegram",
    context:
      "Un agent IA qui surveille un portefeuille : rapport de marché quotidien rédigé par une IA, et veille intraday intelligente, le tout livré sur Telegram et archivé.",
    problem:
      "Suivre un portefeuille demande de lire chaque jour cours et actualités, d'en tirer une synthèse utile, et de réagir en journée sans passer ses heures devant les graphiques — ni se noyer sous les fausses alertes.",
    approach: [
      "Deux rythmes complémentaires : un rapport structuré chaque matin, et une veille légère en continu.",
      "Consolidation des données de marché et des actualités avant toute analyse — l'IA raisonne sur des faits à jour.",
      "Filtrage des alertes : seuls les signaux jugés significatifs déclenchent une notification.",
    ],
    decisions: [
      {
        title: "Un analyste IA avec une voix",
        body: "Le rapport matinal (8h, du lundi au vendredi) est rédigé par un agent Gemini incarnant un analyste — cours et news consolidés, puis une synthèse claire, archivée dans Google Sheets et envoyée sur Telegram.",
      },
      {
        title: "Veille intraday, zéro bruit",
        body: "Un second agent surveille le marché en journée. Un test « signal détecté ? » ne laisse passer que les mouvements réellement notables, formatés en alerte Telegram — le reste est ignoré.",
      },
      {
        title: "Orchestration sans serveur lourd",
        body: "Déclencheurs planifiés, récupération de données (APIs de marché + flux RSS), agents IA et sorties (Telegram, Sheets) sont orchestrés dans n8n — modulaire et facile à faire évoluer.",
      },
    ],
    result: [
      "Un briefing marché clair chaque matin, sans effort.",
      "Des alertes intraday rares mais pertinentes, plutôt qu'un flot de notifications.",
      "Un historique des rapports conservé dans Google Sheets.",
    ],
    stack: ["n8n", "Google Gemini", "APIs marché", "RSS News", "Google Sheets", "Telegram Bot API"],
    links: [],
    mockup: "telegram",
  },

  "kelthen-prospection": {
    slug: "kelthen-prospection",
    name: "Kelthen · Prospection auto",
    tag: "automation · growth",
    accent: "lime",
    year: "2026",
    role: "Conception & automatisation",
    tagline:
      "Un moteur de prospection B2B qui trouve, audite et score des prospects tout seul — piloté depuis Telegram.",
    deviceLabel: "Kelthen · Prospection",
    context:
      "Un pipeline de génération de leads pour l'agence Kelthen : de la recherche d'entreprises à la liste de prospects qualifiés et scorés, sans travail manuel.",
    problem:
      "Trouver des clients pour une agence web demande d'identifier des entreprises, de vérifier si leur site est faible ou inexistant, puis de prioriser — un travail long et répétitif fait à la main.",
    approach: [
      "On lance une recherche par Telegram (métier + ville) ; le pipeline fait le reste.",
      "Détection des cibles à fort potentiel : pas de site, ou site lent / mal noté.",
      "Sortie exploitable : des leads scorés, enregistrés et résumés automatiquement.",
    ],
    decisions: [
      {
        title: "Scraping ciblé via Google Maps",
        body: "Une recherche envoyée sur Telegram déclenche un scraping d'entreprises via Apify (Google Maps), puis une normalisation des données pour la suite du pipeline.",
      },
      {
        title: "Audit automatique de la cible",
        body: "Pour chaque entreprise ayant un site, un audit Google PageSpeed mesure la performance. Un site lent ou absent = un prospect à fort potentiel pour l'agence.",
      },
      {
        title: "Scoring et enregistrement",
        body: "Chaque prospect est scoré selon des règles, filtré pour ne garder que les plus utiles, enregistré dans Google Sheets, puis résumé dans un message Telegram.",
      },
    ],
    result: [
      "Une recherche = une liste de prospects qualifiés, sans travail manuel.",
      "Les cibles à fort potentiel (sites faibles ou absents) remontent en priorité.",
      "Leads centralisés dans Google Sheets, prêts à contacter.",
    ],
    stack: ["n8n", "Apify", "Google PageSpeed", "Google Sheets", "Telegram Bot API"],
    links: [],
    mockup: "telegram",
  },

  kelthen: {
    slug: "kelthen",
    name: "Kelthen",
    tag: "agence · 2025",
    accent: "lime",
    year: "2025",
    role: "Cofondateur · Développeur",
    tagline:
      "Le site vitrine de l'agence digitale Kelthen — ultra-rapide, sans framework, esthétique premium.",
    deviceLabel: "kelthen.com",
    context:
      "Site vitrine de l'agence digitale Kelthen (Canada), conçu pour inspirer confiance dès la première seconde et charger instantanément.",
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
      "Site en production sur kelthen.com, hébergé sur Vercel.",
      "Chargement rapide, responsive, et une image de marque haut de gamme.",
    ],
    stack: ["HTML", "CSS", "JavaScript", "Vercel"],
    links: [{ label: "↗ kelthen.com", href: "https://kelthen.com" }],
    mockup: "browser",
  },
};

export const caseStudySlugs = Object.keys(caseStudies);
