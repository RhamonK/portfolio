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

export const presentations: Record<string, Presentation> = {
  mamashop,
};
