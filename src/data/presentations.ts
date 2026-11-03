import type { PresentedSlug } from "@/data/presented";
// ============================================================
// Présentations de 60 s (6 diapos d'environ 10 s), FR et EN.
// Écrites à partir des sources réelles (README des repos, site
// kelthen.com, workflows n8n, ancienne étude de cas ABO) :
// bénéfices et usages, jamais comment c'est construit. Aucun chiffre
// qui ne vienne pas de ces sources.
// ============================================================

import type { Lang } from "@/i18n";

export type { Lang };
type T = Record<Lang, string>;

export type Slide = {
  kind: T;
  title: T;
  lines: Record<Lang, string[]>;
  /** 3 à 4 mots-clés qui tombent vers le présentateur. */
  keywords: Record<Lang, string[]>;
  /** Texte parlé (≈ 10 s, 25 mots max), affiché en sous-titre. */
  speech: T;
  /** Captures montrées sur l'écran pendant la diapo (1 ou 2). Sinon : image du projet. */
  shots?: string[];
};

export type Presentation = {
  slug: string;
  slides: Slide[];
  /** Pastille « technologies » de la dernière diapo. */
  tech?: string;
};

const kinds: T[] = [
  { fr: "Le problème", en: "The problem" },
  { fr: "Ce que c'est", en: "What it is" },
  { fr: "Ce que ça permet", en: "What it does" },
  { fr: "Comment on s'en sert", en: "How it's used" },
  { fr: "Le résultat", en: "The result" },
  { fr: "Le projet", en: "The project" },
];

// Source : README de RhamonK/bizup-africa.
const mamashop: Presentation = {
  slug: "mamashop",
  tech: "React Native · Supabase",
  slides: [
    {
      kind: kinds[0],
      title: { fr: "Le réseau ne suit pas", en: "The network can't keep up" },
      lines: {
        fr: [
          "Les petits commerces d'Afrique de l'Ouest suivent stock, ventes et crédits au quotidien.",
          "Le réseau est instable, et les outils sont souvent trop techniques.",
        ],
        en: [
          "Small West African shops track stock, sales and credit every day.",
          "The network is unstable, and tools are often too technical.",
        ],
      },
      keywords: { fr: ["petits commerces", "réseau instable", "crédits"], en: ["small shops", "unstable network", "credit"] },
      speech: {
        fr: "Les petits commerces d'Afrique de l'Ouest gèrent stock, ventes et crédits tous les jours, avec un réseau instable.",
        en: "Small shops in West Africa manage stock, sales and credit every day, on an unstable network.",
      },
    },
    {
      kind: kinds[1],
      title: { fr: "Une app, trois rôles", en: "One app, three roles" },
      lines: {
        fr: [
          "Une application mobile de gestion de boutique, en français et en FCFA.",
          "Chaque profil ne voit que ses écrans : gérant, agent de terrain, diaspora.",
        ],
        en: [
          "A mobile shop-management app, in French and in CFA francs.",
          "Each profile only sees its own screens: manager, field agent, diaspora.",
        ],
      },
      keywords: { fr: ["mobile", "gérant", "agent", "diaspora"], en: ["mobile", "manager", "agent", "diaspora"] },
      speech: {
        fr: "MamaShop est une app mobile de gestion de boutique, avec trois espaces : le gérant, l'agent de terrain et la diaspora.",
        en: "MamaShop is a mobile shop-management app with three spaces: the manager, the field agent and the diaspora.",
      },
    },
    {
      kind: kinds[2],
      title: { fr: "Tout au même endroit", en: "Everything in one place" },
      lines: {
        fr: [
          "Le gérant suit finances, marges, stock, fournisseurs et employés.",
          "Les crédits clients et la fidélité sont suivis client par client.",
          "Des conseils pour négocier avec les fournisseurs, selon les prix déjà payés.",
        ],
        en: [
          "The manager tracks finances, margins, stock, suppliers and staff.",
          "Customer credit and loyalty are tracked customer by customer.",
          "Tips for negotiating with suppliers, based on past prices paid.",
        ],
      },
      keywords: { fr: ["marges", "crédits clients", "fournisseurs"], en: ["margins", "customer credit", "suppliers"] },
      speech: {
        fr: "Le gérant voit ses finances et ses marges, suit les crédits clients, et reçoit des conseils pour négocier avec ses fournisseurs.",
        en: "The manager sees finances and margins, tracks customer credit, and gets tips to negotiate with suppliers.",
      },
    },
    {
      kind: kinds[3],
      title: { fr: "Même hors ligne", en: "Even offline" },
      lines: {
        fr: [
          "1. L'agent enregistre une vente ou un arrivage, même sans réseau.",
          "2. L'app synchronise tout seule au retour du réseau.",
          "3. La famille à l'étranger suit l'activité en lecture seule.",
        ],
        en: [
          "1. The agent records a sale or a delivery, even without a network.",
          "2. The app syncs on its own when the network returns.",
          "3. Family abroad follows the activity, read-only.",
        ],
      },
      keywords: { fr: ["hors ligne", "synchro", "famille"], en: ["offline", "sync", "family"] },
      speech: {
        fr: "L'agent enregistre ses ventes même sans réseau, l'app synchronise toute seule, et la famille à l'étranger suit l'activité.",
        en: "The agent records sales even offline, the app syncs on its own, and family abroad follows the activity.",
      },
    },
    {
      kind: kinds[4],
      title: { fr: "Une boutique sous contrôle", en: "A shop under control" },
      lines: {
        fr: ["Chaque vente met le stock à jour, sans écart.", "Le commerce reste suivi, même quand le réseau coupe."],
        en: ["Every sale updates the stock, with no mismatch.", "The shop stays on track, even when the network drops."],
      },
      keywords: { fr: ["stock juste", "fiable", "en direct"], en: ["accurate stock", "reliable", "live"] },
      speech: {
        fr: "Chaque vente met le stock à jour sans écart, et le commerce reste suivi, même quand le réseau coupe.",
        en: "Every sale updates the stock with no mismatch, and the shop stays on track even when the network drops.",
      },
    },
    {
      kind: kinds[5],
      title: { fr: "Voir le projet", en: "See the project" },
      lines: { fr: ["Le code est en ligne sur GitHub."], en: ["The code is online on GitHub."] },
      keywords: { fr: ["MamaShop", "GitHub"], en: ["MamaShop", "GitHub"] },
      speech: {
        fr: "Tu peux voir le projet sur GitHub, ou passer au projet suivant.",
        en: "You can see the project on GitHub, or move on to the next one.",
      },
    },
  ],
};

// Source : ancienne étude de cas ABO (le repo RhamonK/abo est vide).
const abo: Presentation = {
  slug: "abo",
  slides: [
    {
      kind: kinds[0],
      title: { fr: "Trouver quelqu'un de fiable", en: "Finding someone reliable" },
      lines: {
        fr: [
          "À Lomé, trouver un bon artisan passe par le bouche-à-oreille.",
          "Le risque d'arnaque ou de travail bâclé est réel.",
          "Les artisans sérieux n'ont aucun moyen de le prouver.",
        ],
        en: [
          "In Lomé, finding a good tradesperson relies on word of mouth.",
          "The risk of scams or sloppy work is real.",
          "Serious tradespeople have no way to prove it.",
        ],
      },
      keywords: { fr: ["artisan", "confiance", "bouche-à-oreille"], en: ["tradesperson", "trust", "word of mouth"] },
      speech: {
        fr: "Trouver un bon artisan à Lomé, c'est souvent le bouche-à-oreille. Et les artisans sérieux n'ont aucun moyen de le prouver.",
        en: "Finding a good tradesperson in Lomé often means word of mouth. And serious tradespeople have no way to prove it.",
      },
    },
    {
      kind: kinds[1],
      title: { fr: "Des artisans vérifiés", en: "Verified tradespeople" },
      lines: {
        fr: ["Une place de marché qui met en relation clients et artisans.", "Chaque artisan peut obtenir un badge de confiance."],
        en: ["A marketplace connecting clients and tradespeople.", "Each tradesperson can earn a trust badge."],
      },
      keywords: { fr: ["place de marché", "artisans", "badge"], en: ["marketplace", "tradespeople", "badge"] },
      speech: {
        fr: "ABO, c'est une place de marché qui met en relation les clients et des artisans vérifiés, avec un badge de confiance.",
        en: "ABO is a marketplace connecting clients with verified tradespeople, with a trust badge.",
      },
    },
    {
      kind: kinds[2],
      title: { fr: "Trois garanties", en: "Three guarantees" },
      lines: {
        fr: [
          "Une identité vérifiée avant le badge « Vérifié ABO ».",
          "Des documents d'identité gardés en sécurité.",
          "Des avis vérifiés, liés à une vraie demande.",
        ],
        en: ["Identity checked before the “Vérifié ABO” badge.", "Identity documents kept secure.", "Verified reviews, tied to a real request."],
      },
      keywords: { fr: ["identité", "documents", "avis vérifiés"], en: ["identity", "documents", "verified reviews"] },
      speech: {
        fr: "L'identité est vérifiée avant le badge, les documents restent protégés, et les avis viennent de vraies demandes.",
        en: "Identity is checked before the badge, documents stay protected, and reviews come from real requests.",
      },
    },
    {
      kind: kinds[3],
      title: { fr: "En trois étapes", en: "In three steps" },
      lines: {
        fr: [
          "1. On cherche par métier et par quartier.",
          "2. On consulte le profil, les travaux et les avis.",
          "3. On demande un devis, puis on échange sur WhatsApp.",
        ],
        en: ["1. Search by trade and neighbourhood.", "2. Check the profile, past work and reviews.", "3. Request a quote, then talk on WhatsApp."],
      },
      keywords: { fr: ["métier", "quartier", "devis", "WhatsApp"], en: ["trade", "neighbourhood", "quote", "WhatsApp"] },
      speech: {
        fr: "Le client cherche par métier et quartier, regarde le profil et les avis, puis demande un devis et continue sur WhatsApp.",
        en: "Clients search by trade and neighbourhood, check the profile and reviews, then request a quote and continue on WhatsApp.",
      },
    },
    {
      kind: kinds[4],
      title: { fr: "La confiance, visible", en: "Trust you can see" },
      lines: {
        fr: ["Les clients savent à qui ils font appel.", "Les artisans sérieux ont enfin une présence crédible en ligne."],
        en: ["Clients know who they're hiring.", "Serious tradespeople finally get a credible online presence."],
      },
      keywords: { fr: ["clients", "artisans", "crédible"], en: ["clients", "tradespeople", "credible"] },
      speech: {
        fr: "Les clients savent à qui ils font appel, et les artisans sérieux ont enfin une présence crédible en ligne.",
        en: "Clients know who they're hiring, and serious tradespeople finally get a credible online presence.",
      },
    },
    {
      kind: kinds[5],
      title: { fr: "Le projet", en: "The project" },
      lines: {
        fr: ["Une plateforme pensée pour le mobile, au service de la confiance."],
        en: ["A mobile-first platform built around trust."],
      },
      keywords: { fr: ["ABO", "confiance"], en: ["ABO", "trust"] },
      speech: {
        fr: "Une plateforme pensée pour le mobile, au service de la confiance. Passons au projet suivant.",
        en: "A mobile-first platform built around trust. Let's move on to the next project.",
      },
    },
  ],
};

// Sources : repo du projet et workflows n8n de réservation. Nom du client remplacé par un nom d'emprunt.
const studioNala: Presentation = {
  slug: "studio-nala",
  tech: "Next.js · Supabase · n8n",
  slides: [
    {
      kind: kinds[0],
      title: { fr: "Le téléphone qui sonne", en: "The phone that keeps ringing" },
      lines: {
        fr: [
          "Un salon de tresses reçoit ses demandes par appels et messages, sur plusieurs réseaux.",
          "Ça prend du temps, et des clientes oublient leur rendez-vous.",
        ],
        en: [
          "A braiding salon gets requests by calls and messages, across several apps.",
          "It takes time, and some clients forget their appointment.",
        ],
      },
      keywords: { fr: ["salon", "messages", "oublis"], en: ["salon", "messages", "no-shows"] },
      speech: {
        fr: "Un salon de tresses recevait ses demandes partout, par appels et messages. Ça prend du temps, et des clientes oublient.",
        en: "A braiding salon got requests everywhere, by calls and messages. It takes time, and clients forget.",
      },
    },
    {
      kind: kinds[1],
      title: { fr: "Une réceptionniste qui ne dort pas", en: "A receptionist that never sleeps" },
      lines: {
        fr: [
          "Un site avec réservation en ligne, galerie et services.",
          "Une assistante IA qui répond sur le site, Telegram, WhatsApp, Messenger et Instagram.",
        ],
        en: [
          "A website with online booking, a gallery and services.",
          "An AI assistant answering on the site, Telegram, WhatsApp, Messenger and Instagram.",
        ],
      },
      keywords: { fr: ["site", "assistante IA", "multicanal"], en: ["website", "AI assistant", "multichannel"] },
      speech: {
        fr: "J'ai construit le site du salon et une assistante IA qui répond aux clientes sur le site, WhatsApp, Instagram et ailleurs.",
        en: "I built the salon's website and an AI assistant that answers clients on the site, WhatsApp, Instagram and more.",
      },
    },
    {
      kind: kinds[2],
      title: { fr: "Trois bénéfices", en: "Three benefits" },
      lines: {
        fr: [
          "Réserver à toute heure, avec une photo de référence.",
          "Une confirmation par SMS et courriel, et l'agenda à jour tout seul.",
          "Des rappels automatiques 24 h et 2 h avant le rendez-vous.",
        ],
        en: [
          "Book any time, with a reference photo.",
          "Confirmation by SMS and email, and the calendar updates itself.",
          "Automatic reminders 24 h and 2 h before the appointment.",
        ],
      },
      keywords: { fr: ["24 h/24", "confirmation", "rappels"], en: ["24/7", "confirmation", "reminders"] },
      speech: {
        fr: "Les clientes réservent à toute heure, reçoivent leur confirmation par SMS et courriel, puis des rappels avant le rendez-vous.",
        en: "Clients book any time, get confirmation by SMS and email, then reminders before the appointment.",
      },
    },
    {
      kind: kinds[3],
      title: { fr: "En quatre gestes", en: "In four moves" },
      lines: {
        fr: [
          "1. La cliente choisit sa prestation, sa date et son créneau.",
          "2. La propriétaire reçoit la demande sur Telegram, photo jointe.",
          "3. Un tap pour confirmer ou décliner.",
          "4. Confirmation, agenda et rappels partent tout seuls.",
        ],
        en: [
          "1. The client picks a service, a date and a time slot.",
          "2. The owner gets the request on Telegram, photo attached.",
          "3. One tap to confirm or decline.",
          "4. Confirmation, calendar and reminders happen on their own.",
        ],
      },
      keywords: { fr: ["créneau", "Telegram", "un tap"], en: ["time slot", "Telegram", "one tap"] },
      speech: {
        fr: "La cliente choisit son créneau, la propriétaire valide d'un tap sur Telegram, et tout le reste part tout seul.",
        en: "The client picks a slot, the owner approves with one tap on Telegram, and everything else happens on its own.",
      },
    },
    {
      kind: kinds[4],
      title: { fr: "Le salon respire", en: "The salon can breathe" },
      lines: {
        fr: ["Personne n'a à taper un message pour gérer une réservation.", "La propriétaire garde la main sur chaque rendez-vous."],
        en: ["Nobody has to type a message to handle a booking.", "The owner stays in control of every appointment."],
      },
      keywords: { fr: ["automatique", "en contrôle", "moins d'oublis"], en: ["automatic", "in control", "fewer no-shows"] },
      speech: {
        fr: "Plus besoin de taper un message pour gérer une réservation, et la propriétaire garde la main sur chaque rendez-vous.",
        en: "No more typing messages to handle bookings, and the owner stays in control of every appointment.",
      },
    },
    {
      kind: kinds[5],
      title: { fr: "Le projet", en: "The project" },
      lines: {
        fr: ["Un système de réservation complet, de la demande au rappel."],
        en: ["A complete booking system, from request to reminder."],
      },
      keywords: { fr: ["réservation", "de bout en bout"], en: ["booking", "end to end"] },
      speech: {
        fr: "Un système de réservation complet, de la demande au rappel. Passons au projet suivant.",
        en: "A complete booking system, from request to reminder. Let's move on to the next project.",
      },
    },
  ],
};

// Sources : site kelthen.com (repo Kelthen/kelthen) et workflows n8n Kelthen.
const kelthen: Presentation = {
  slug: "kelthen",
  tech: "n8n · Supabase",
  slides: [
    {
      kind: kinds[0],
      title: { fr: "Freinés par leurs outils", en: "Held back by their tools" },
      lines: {
        fr: [
          "Trop d'entreprises sont freinées par des sites lents et des outils compliqués.",
          "Et par des tâches manuelles qu'un peu de technologie réglerait en secondes.",
        ],
        en: [
          "Too many businesses are held back by slow sites and complicated tools.",
          "And by manual tasks a bit of technology could solve in seconds.",
        ],
      },
      keywords: { fr: ["sites lents", "tâches manuelles", "entreprises"], en: ["slow sites", "manual tasks", "businesses"] },
      speech: {
        fr: "Trop d'entreprises sont freinées par des sites lents, des outils compliqués et des tâches manuelles.",
        en: "Too many businesses are held back by slow sites, complicated tools and manual tasks.",
      },
    },
    {
      kind: kinds[1],
      title: { fr: "Mon agence", en: "My agency" },
      lines: {
        fr: [
          "Kelthen Inc., au Canada : sites, applications et automatisations sur mesure.",
          "Je la dirige et je pilote le développement des sites.",
        ],
        en: [
          "Kelthen Inc., in Canada: custom websites, apps and automations.",
          "I run it and lead website development.",
        ],
      },
      keywords: { fr: ["Kelthen", "sur mesure", "directeur"], en: ["Kelthen", "custom", "director"] },
      speech: {
        fr: "Kelthen, c'est mon agence au Canada : sites, applications et automatisations sur mesure. Je la dirige.",
        en: "Kelthen is my agency in Canada: custom websites, apps and automations. I run it.",
      },
    },
    {
      kind: kinds[2],
      title: { fr: "Ce qu'on livre", en: "What we deliver" },
      lines: {
        fr: [
          "Un site qui attire des clients, avec réservation en ligne et acompte.",
          "Une secrétaire virtuelle par IA et des rappels SMS et courriel.",
          "La visibilité sur Google et plus d'avis clients.",
        ],
        en: [
          "A website that brings clients, with online booking and deposits.",
          "An AI virtual receptionist and SMS and email reminders.",
          "Visibility on Google and more customer reviews.",
        ],
      },
      keywords: { fr: ["réservation", "secrétaire IA", "Google"], en: ["booking", "AI receptionist", "Google"] },
      speech: {
        fr: "On livre des sites qui attirent des clients, la réservation en ligne, une secrétaire IA, des rappels et plus d'avis Google.",
        en: "We deliver sites that bring clients, online booking, an AI receptionist, reminders and more Google reviews.",
      },
    },
    {
      kind: kinds[3],
      title: { fr: "Une agence automatisée", en: "An automated agency" },
      lines: {
        fr: [
          "1. La prospection repère les commerces qui ont besoin d'aide.",
          "2. Les courriels et les relances partent tout seuls.",
          "3. Les réponses sont détectées et signalées, et les réseaux sociaux publiés automatiquement.",
        ],
        en: [
          "1. Prospecting spots the businesses that need help.",
          "2. Emails and follow-ups go out on their own.",
          "3. Replies are detected and flagged, and social posts go out automatically.",
        ],
      },
      keywords: { fr: ["prospection", "relances", "automatique"], en: ["prospecting", "follow-ups", "automatic"] },
      speech: {
        fr: "J'ai aussi automatisé l'agence : la prospection, les courriels, les relances, le suivi des réponses et les publications.",
        en: "I also automated the agency itself: prospecting, emails, follow-ups, reply tracking and social posts.",
      },
    },
    {
      kind: kinds[4],
      title: { fr: "De A à Z", en: "From A to Z" },
      lines: {
        fr: [
          "Un audit gratuit en 48 h, une offre claire à prix fixe.",
          "Une petite équipe joignable, qui reste là après la mise en ligne.",
        ],
        en: [
          "A free audit in 48 h, a clear fixed-price offer.",
          "A small, reachable team that stays after launch.",
        ],
      },
      keywords: { fr: ["audit 48 h", "prix fixe", "petite équipe"], en: ["48 h audit", "fixed price", "small team"] },
      speech: {
        fr: "Un audit gratuit en 48 heures, une offre claire à prix fixe, et une petite équipe qui reste après la mise en ligne.",
        en: "A free audit in 48 hours, a clear fixed-price offer, and a small team that stays after launch.",
      },
    },
    {
      kind: kinds[5],
      title: { fr: "Voir l'agence", en: "See the agency" },
      lines: { fr: ["Le site de l'agence : kelthen.com."], en: ["The agency's website: kelthen.com."] },
      keywords: { fr: ["kelthen.com"], en: ["kelthen.com"] },
      speech: {
        fr: "Tu peux découvrir l'agence sur kelthen.com, ou passer au projet suivant.",
        en: "You can discover the agency at kelthen.com, or move on to the next project.",
      },
    },
  ],
};

// Sources : repo Kelthen/fraul-ecommerce (README, STATUS).
const fraul: Presentation = {
  slug: "fraul",
  tech: "Next.js · Three.js · Supabase",
  slides: [
    {
      kind: kinds[0],
      title: { fr: "Une boutique comme les autres ?", en: "Just another shop?" },
      lines: {
        fr: [
          "Un commerçant de vêtements et chaussures veut vendre en ligne.",
          "Une grille de produits de plus ne donne pas envie de flâner.",
        ],
        en: [
          "A clothing and shoe retailer wants to sell online.",
          "Yet another product grid doesn't make people want to browse.",
        ],
      },
      keywords: { fr: ["mode", "boutique en ligne", "flâner"], en: ["fashion", "online shop", "browse"] },
      speech: {
        fr: "Un commerçant de mode voulait vendre en ligne, sans faire une boutique de plus où personne ne flâne.",
        en: "A fashion retailer wanted to sell online without building yet another shop nobody browses.",
      },
    },
    {
      kind: kinds[1],
      title: { fr: "Un centre commercial en 3D", en: "A 3D shopping mall" },
      lines: {
        fr: [
          "Le Fraul Walk : on se promène dans un mall en 3D.",
          "Une boutique par marque ; on touche la vitrine pour entrer.",
        ],
        en: ["The Fraul Walk: you stroll through a 3D mall.", "One shop per brand; tap the window to walk in."],
      },
      keywords: { fr: ["Fraul Walk", "3D", "une boutique par marque"], en: ["Fraul Walk", "3D", "one shop per brand"] },
      speech: {
        fr: "Avec l'équipe Kelthen, on a créé le Fraul Walk : un centre commercial en 3D, avec une boutique par marque.",
        en: "With the Kelthen team, we built the Fraul Walk: a 3D shopping mall with one shop per brand.",
      },
    },
    {
      kind: kinds[2],
      title: { fr: "Trois envies", en: "Three wishes" },
      lines: {
        fr: [
          "Composer sa tenue pièce par pièce.",
          "Garder ses envies de côté et les retrouver plus tard.",
          "Demander une pièce introuvable au comptoir « sur demande ».",
        ],
        en: [
          "Build an outfit piece by piece.",
          "Save favourites and find them later.",
          "Request a hard-to-find piece at the “on request” desk.",
        ],
      },
      keywords: { fr: ["tenue", "envies", "sur demande"], en: ["outfit", "favourites", "on request"] },
      speech: {
        fr: "On peut composer sa tenue, garder ses envies, et demander une pièce introuvable au comptoir sur demande.",
        en: "You can build an outfit, save favourites, and request a hard-to-find piece at the on-request desk.",
      },
    },
    {
      kind: kinds[3],
      title: { fr: "Une visite vivante", en: "A living visit" },
      lines: {
        fr: [
          "1. On entre dans le mall et on se promène devant les vitrines.",
          "2. Les vitrines montrent les pièces phares, et la lumière suit l'heure du visiteur.",
          "3. On entre, on choisit, on passe au panier et on suit sa commande.",
        ],
        en: [
          "1. Walk into the mall and stroll past the windows.",
          "2. Windows show the key pieces, and the light follows the visitor's time of day.",
          "3. Step in, choose, check out and track your order.",
        ],
      },
      keywords: { fr: ["vitrines", "heure du jour", "panier"], en: ["windows", "time of day", "cart"] },
      speech: {
        fr: "On se promène devant les vitrines, la lumière suit l'heure du visiteur, puis on entre, on choisit et on suit sa commande.",
        en: "You stroll past the windows, the light follows your time of day, then you step in, choose and track your order.",
      },
    },
    {
      kind: kinds[4],
      title: { fr: "Faire du shopping, pas défiler", en: "Shopping, not scrolling" },
      lines: {
        fr: ["Une expérience qu'on a envie d'explorer, même sur téléphone.", "Projet en cours, avec l'équipe Kelthen."],
        en: ["An experience people want to explore, even on a phone.", "In progress, with the Kelthen team."],
      },
      keywords: { fr: ["explorer", "téléphone", "en cours"], en: ["explore", "phone", "in progress"] },
      speech: {
        fr: "Le but : donner envie d'explorer, même sur téléphone. Le projet est en cours avec l'équipe Kelthen.",
        en: "The goal: make people want to explore, even on a phone. The project is in progress with the Kelthen team.",
      },
    },
    {
      kind: kinds[5],
      title: { fr: "Le projet", en: "The project" },
      lines: {
        fr: ["Une boutique de mode qu'on visite, au lieu de la faire défiler."],
        en: ["A fashion shop you visit, instead of scrolling through."],
      },
      keywords: { fr: ["Fraul", "Fraul Walk"], en: ["Fraul", "Fraul Walk"] },
      speech: {
        fr: "Une boutique de mode qu'on visite, au lieu de la faire défiler. Merci d'avoir regardé.",
        en: "A fashion shop you visit instead of scrolling through. Thanks for watching.",
      },
    },
  ],
};

// Les clés doivent correspondre exactement à src/data/presented.ts (clé manquante ou en trop = erreur TypeScript).
const bySlug = {
  mamashop,
  abo,
  "studio-nala": studioNala,
  kelthen,
  fraul,
} satisfies Record<PresentedSlug, Presentation>;
export const presentations: Record<string, Presentation> = bySlug;

// Captures par diapo : ce qu'on voit à l'écran colle à ce qui est dit.
// Faites sur les sites lancés en local (Studio Nala : nom anonymisé, photos
// floutées, données de réservation de démonstration).
const SHOTS: Record<string, (string[] | undefined)[]> = {
  kelthen: [
    ["probleme"],
    ["accueil"],
    ["services"],
    ["hub", "nuit"],
    ["etapes", "prix"],
    ["realisations"],
  ],
  fraul: [["marques"], ["mall"], ["tenue", "sur-demande"], ["boutique", "produit"], ["mall", "mobile"], ["accueil"]],
  "studio-nala": [["/projets/studio-nala/dessin.svg"], ["site"], ["services", "creneau"], ["date", "coordonnees"], undefined, ["styles"]],
};
for (const [slug, list] of Object.entries(SHOTS)) {
  list.forEach((names, i) => {
    const slide = presentations[slug]?.slides[i];
    if (slide && names) slide.shots = names.map((n) => (n.startsWith("/") ? n : `/projets/${slug}/slides/${n}.webp`));
  });
}
