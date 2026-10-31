// ============================================================
// Présentations de 60 s (6 diapos d'environ 10 s), FR et EN.
// Écrites UNIQUEMENT à partir de la fiche projet : bénéfices et
// usages, jamais comment c'est construit. Aucun chiffre inventé.
// ============================================================

export type Lang = "fr" | "en";
type T = Record<Lang, string>;

export type Slide = {
  kind: T;
  title: T;
  lines: Record<Lang, string[]>;
  /** 3 à 4 mots-clés qui tombent vers le présentateur. */
  keywords: Record<Lang, string[]>;
  /** Texte parlé (≈ 10 s, 25 mots max), affiché en sous-titre. */
  speech: T;
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

const mamashop: Presentation = {
  slug: "mamashop",
  tech: "React Native · Supabase",
  slides: [
    {
      kind: kinds[0],
      title: { fr: "Tout suivre, partout", en: "Track everything, anywhere" },
      lines: {
        fr: [
          "Un grossiste de fruits et légumes à Lomé.",
          "Le stock, les ventes et les crédits clients à suivre chaque jour.",
          "Sur le terrain, le réseau ne suit pas toujours.",
        ],
        en: [
          "A fruit and vegetable wholesaler in Lomé.",
          "Stock, sales and customer credit to track every day.",
          "Out in the field, the network isn't always there.",
        ],
      },
      keywords: { fr: ["grossiste", "stock", "crédits", "terrain"], en: ["wholesaler", "stock", "credit", "field"] },
      speech: {
        fr: "Un grossiste de fruits et légumes doit suivre son stock, ses ventes et ses crédits clients, même quand le réseau ne suit pas.",
        en: "A fruit and vegetable wholesaler has to track stock, sales and customer credit, even when the network drops.",
      },
    },
    {
      kind: kinds[1],
      title: { fr: "Une app de gestion", en: "A management app" },
      lines: {
        fr: [
          "Une application mobile, pensée pour ce grossiste.",
          "Trois espaces selon le rôle : gérant, agent de terrain, diaspora.",
        ],
        en: [
          "A mobile app built for this wholesaler.",
          "Three spaces by role: manager, field agent, diaspora.",
        ],
      },
      keywords: { fr: ["mobile", "gérant", "agent", "diaspora"], en: ["mobile", "manager", "agent", "diaspora"] },
      speech: {
        fr: "J'ai construit MamaShop : une application mobile avec trois espaces, pour le gérant, l'agent de terrain et la diaspora.",
        en: "I built MamaShop: a mobile app with three spaces, for the manager, the field agent and the diaspora.",
      },
    },
    {
      kind: kinds[2],
      title: { fr: "Trois bénéfices", en: "Three benefits" },
      lines: {
        fr: [
          "Stock, ventes et crédits clients au même endroit.",
          "Un tableau de bord en direct.",
          "Utilisable même sans réseau.",
        ],
        en: [
          "Stock, sales and customer credit in one place.",
          "A live dashboard.",
          "Works even without a network.",
        ],
      },
      keywords: { fr: ["même endroit", "en direct", "sans réseau"], en: ["one place", "live", "offline"] },
      speech: {
        fr: "Tout est au même endroit, le tableau de bord se met à jour en direct, et l'app fonctionne même sans réseau.",
        en: "Everything lives in one place, the dashboard updates live, and the app keeps working without a network.",
      },
    },
    {
      kind: kinds[3],
      title: { fr: "En trois étapes", en: "In three steps" },
      lines: {
        fr: [
          "1. On ouvre l'espace de son rôle.",
          "2. On enregistre le stock, une vente ou un crédit.",
          "3. Le tableau de bord se met à jour.",
        ],
        en: [
          "1. Open the space for your role.",
          "2. Record stock, a sale or a credit.",
          "3. The dashboard updates.",
        ],
      },
      keywords: { fr: ["son rôle", "enregistrer", "tableau de bord"], en: ["your role", "record", "dashboard"] },
      speech: {
        fr: "Chacun ouvre son espace, enregistre le stock, une vente ou un crédit, et le tableau de bord suit.",
        en: "Each person opens their space, records stock, a sale or a credit, and the dashboard follows.",
      },
    },
    {
      kind: kinds[4],
      title: { fr: "Une vue claire", en: "A clear view" },
      lines: {
        fr: ["Toute l'activité visible au même endroit, en direct.", "Même quand le réseau coupe."],
        en: ["All the activity visible in one place, live.", "Even when the network cuts out."],
      },
      keywords: { fr: ["activité", "en direct", "fiable"], en: ["activity", "live", "reliable"] },
      speech: {
        fr: "Résultat : le grossiste voit toute son activité au même endroit, en direct, même quand le réseau coupe.",
        en: "The result: the wholesaler sees all the activity in one place, live, even when the network cuts out.",
      },
    },
    {
      kind: kinds[5],
      title: { fr: "Voir le projet", en: "See the project" },
      lines: {
        fr: ["Le code est en ligne sur GitHub."],
        en: ["The code is online on GitHub."],
      },
      keywords: { fr: ["MamaShop", "GitHub"], en: ["MamaShop", "GitHub"] },
      speech: {
        fr: "Tu peux voir le projet sur GitHub, ou passer au projet suivant.",
        en: "You can see the project on GitHub, or move on to the next one.",
      },
    },
  ],
};

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
        fr: [
          "Une place de marché qui met en relation clients et artisans.",
          "Chaque artisan peut obtenir un badge de confiance.",
        ],
        en: [
          "A marketplace connecting clients and tradespeople.",
          "Each tradesperson can earn a trust badge.",
        ],
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
        en: [
          "Identity checked before the “Vérifié ABO” badge.",
          "Identity documents kept secure.",
          "Verified reviews, tied to a real request.",
        ],
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
        en: [
          "1. Search by trade and neighbourhood.",
          "2. Check the profile, past work and reviews.",
          "3. Request a quote, then talk on WhatsApp.",
        ],
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
        fr: [
          "Les clients savent à qui ils ouvrent leur porte.",
          "Les artisans sérieux ont enfin une présence crédible en ligne.",
        ],
        en: [
          "Clients know who they're letting in.",
          "Serious tradespeople finally get a credible online presence.",
        ],
      },
      keywords: { fr: ["clients", "artisans", "crédible"], en: ["clients", "tradespeople", "credible"] },
      speech: {
        fr: "Les clients savent à qui ils font appel, et les artisans sérieux ont enfin une présence crédible en ligne.",
        en: "Clients know who they're hiring, and serious tradespeople finally get a credible online presence.",
      },
    },
    {
      kind: kinds[5],
      title: { fr: "Voir le projet", en: "See the project" },
      lines: { fr: ["Le code est en ligne sur GitHub."], en: ["The code is online on GitHub."] },
      keywords: { fr: ["ABO", "GitHub"], en: ["ABO", "GitHub"] },
      speech: {
        fr: "Tu peux voir le projet sur GitHub, ou passer au projet suivant.",
        en: "You can see the project on GitHub, or move on to the next one.",
      },
    },
  ],
};

const chichicuties: Presentation = {
  slug: "chichicuties",
  tech: "Telegram · automatisation",
  slides: [
    {
      kind: kinds[0],
      title: { fr: "Des rendez-vous perdus", en: "Missed appointments" },
      lines: {
        fr: [
          "Un salon de coiffure gère ses rendez-vous par appels et messages.",
          "Ça prend du temps, et des clients oublient leur rendez-vous.",
        ],
        en: [
          "A hair salon handles bookings by calls and messages.",
          "It takes time, and some clients forget their appointment.",
        ],
      },
      keywords: { fr: ["salon", "appels", "oublis"], en: ["salon", "calls", "no-shows"] },
      speech: {
        fr: "Un salon de coiffure prenait ses rendez-vous par appels et messages. Ça prend du temps, et des clients oublient.",
        en: "A hair salon took bookings by calls and messages. It takes time, and clients forget.",
      },
    },
    {
      kind: kinds[1],
      title: { fr: "Un bot Telegram", en: "A Telegram bot" },
      lines: {
        fr: [
          "Un bot qui prend les réservations dans Telegram.",
          "Aucune application à installer pour le client.",
        ],
        en: ["A bot that takes bookings inside Telegram.", "No app for the client to install."],
      },
      keywords: { fr: ["bot", "Telegram", "réservations"], en: ["bot", "Telegram", "bookings"] },
      speech: {
        fr: "ChiChicuties, c'est un bot Telegram qui prend les réservations. Le client n'a rien à installer.",
        en: "ChiChicuties is a Telegram bot that takes bookings. The client has nothing to install.",
      },
    },
    {
      kind: kinds[2],
      title: { fr: "Trois bénéfices", en: "Three benefits" },
      lines: {
        fr: [
          "Réserver à toute heure, sans appeler.",
          "Une confirmation immédiate.",
          "Un rappel automatique avant le rendez-vous.",
        ],
        en: ["Book any time, without calling.", "Instant confirmation.", "An automatic reminder before the appointment."],
      },
      keywords: { fr: ["à toute heure", "confirmation", "rappel"], en: ["any time", "confirmation", "reminder"] },
      speech: {
        fr: "On réserve à toute heure sans appeler, la confirmation arrive tout de suite, et un rappel part avant le rendez-vous.",
        en: "Clients book any time without calling, get instant confirmation, and a reminder goes out before the appointment.",
      },
    },
    {
      kind: kinds[3],
      title: { fr: "En trois étapes", en: "In three steps" },
      lines: {
        fr: ["1. On choisit une prestation.", "2. On choisit le jour et le créneau.", "3. On reçoit la confirmation, puis le rappel."],
        en: ["1. Pick a service.", "2. Pick the day and time slot.", "3. Get the confirmation, then the reminder."],
      },
      keywords: { fr: ["prestation", "créneau", "confirmation"], en: ["service", "time slot", "confirmation"] },
      speech: {
        fr: "Le client choisit sa prestation, puis son créneau, en quelques boutons. Il reçoit la confirmation, puis le rappel.",
        en: "Clients pick a service, then a time slot, in a few taps. They get the confirmation, then the reminder.",
      },
    },
    {
      kind: kinds[4],
      title: { fr: "Moins d'oublis", en: "Fewer no-shows" },
      lines: {
        fr: ["Moins d'appels à gérer pour le salon.", "Des clients rappelés automatiquement."],
        en: ["Fewer calls for the salon to handle.", "Clients reminded automatically."],
      },
      keywords: { fr: ["moins d'appels", "rappels", "automatique"], en: ["fewer calls", "reminders", "automatic"] },
      speech: {
        fr: "Le salon gère moins d'appels, et chaque client est rappelé automatiquement avant son rendez-vous.",
        en: "The salon handles fewer calls, and every client is reminded automatically before their appointment.",
      },
    },
    {
      kind: kinds[5],
      title: { fr: "Le projet", en: "The project" },
      lines: {
        fr: ["Un exemple concret d'automatisation au service d'un commerce."],
        en: ["A concrete example of automation serving a business."],
      },
      keywords: { fr: ["ChiChicuties", "automatisation"], en: ["ChiChicuties", "automation"] },
      speech: {
        fr: "Un exemple concret d'automatisation au service d'un commerce. Passons au projet suivant.",
        en: "A concrete example of automation serving a business. Let's move on to the next project.",
      },
    },
  ],
};

const kelthen: Presentation = {
  slug: "kelthen",
  slides: [
    {
      kind: kinds[0],
      title: { fr: "Gagner du temps", en: "Saving time" },
      lines: {
        fr: [
          "Beaucoup d'entreprises ont un site qui ne travaille pas pour elles.",
          "Et des tâches répétitives qui leur prennent du temps.",
        ],
        en: [
          "Many businesses have a website that doesn't work for them.",
          "And repetitive tasks that eat up their time.",
        ],
      },
      keywords: { fr: ["entreprises", "site web", "tâches"], en: ["businesses", "website", "tasks"] },
      speech: {
        fr: "Beaucoup d'entreprises ont un site qui ne travaille pas pour elles, et des tâches répétitives qui leur prennent du temps.",
        en: "Many businesses have a website that doesn't work for them, and repetitive tasks that eat up their time.",
      },
    },
    {
      kind: kinds[1],
      title: { fr: "Mon agence", en: "My agency" },
      lines: {
        fr: [
          "Kelthen Inc., à Gatineau : sites web, automatisation et intégration d'IA.",
          "J'en suis le directeur exécutif et le référent du développement des sites.",
        ],
        en: [
          "Kelthen Inc., in Gatineau: websites, automation and AI integration.",
          "I'm its executive director and lead for website development.",
        ],
      },
      keywords: { fr: ["Kelthen", "agence", "directeur"], en: ["Kelthen", "agency", "director"] },
      speech: {
        fr: "Kelthen, c'est mon agence à Gatineau. J'en suis le directeur exécutif, et je pilote le développement des sites.",
        en: "Kelthen is my agency in Gatineau. I'm its executive director, and I lead website development.",
      },
    },
    {
      kind: kinds[2],
      title: { fr: "Trois services", en: "Three services" },
      lines: {
        fr: ["Des sites web rapides et sur mesure.", "L'automatisation des tâches répétitives.", "L'intégration d'IA dans les outils du quotidien."],
        en: ["Fast, custom websites.", "Automation of repetitive tasks.", "AI built into everyday tools."],
      },
      keywords: { fr: ["sites web", "automatisation", "IA"], en: ["websites", "automation", "AI"] },
      speech: {
        fr: "On construit des sites web sur mesure, on automatise les tâches répétitives, et on intègre l'IA dans les outils du quotidien.",
        en: "We build custom websites, automate repetitive tasks, and bring AI into everyday tools.",
      },
    },
    {
      kind: kinds[3],
      title: { fr: "Comment on travaille", en: "How we work" },
      lines: {
        fr: ["1. On cadre le besoin avec le client.", "2. On conçoit et on construit.", "3. On met en ligne."],
        en: ["1. Scope the need with the client.", "2. Design and build.", "3. Launch."],
      },
      keywords: { fr: ["cadrage", "construire", "mise en ligne"], en: ["scoping", "build", "launch"] },
      speech: {
        fr: "On cadre le besoin avec le client, on conçoit et on construit, puis on met le projet en ligne.",
        en: "We scope the need with the client, design and build, then launch the project.",
      },
    },
    {
      kind: kinds[4],
      title: { fr: "De A à Z", en: "From A to Z" },
      lines: {
        fr: ["Un seul interlocuteur, du cadrage à la mise en ligne.", "Des outils qui font gagner du temps aux équipes."],
        en: ["One point of contact, from scoping to launch.", "Tools that save teams time."],
      },
      keywords: { fr: ["de A à Z", "interlocuteur", "temps"], en: ["end to end", "one contact", "time"] },
      speech: {
        fr: "Le client a un seul interlocuteur, du cadrage à la mise en ligne, et des outils qui font gagner du temps.",
        en: "Clients get one point of contact from scoping to launch, and tools that save time.",
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

// Fraul : pas de présentation tant que le contenu n'est pas confirmé.
export const presentations: Record<string, Presentation> = {
  mamashop,
  abo,
  chichicuties,
  kelthen,
};
