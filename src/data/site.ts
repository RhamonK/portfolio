// ============================================================
// Configuration centrale du site.
// 👉 C'est ICI que tu remplis tes vraies infos (liens, email, CV).
//    Tous les "TODO" sont des placeholders à compléter.
// ============================================================

export const site = {
  name: "Rhamone Komi Nyavedji",
  handle: "rhamon.dev",
  location: "Gatineau, Québec",

  // Diplôme universitaire — argument fort pour un recruteur de junior.
  degree: "Licence en développement d'applications (équivalent BSc)",

  // 📨 Formulaire de contact : crée une clé GRATUITE sur https://web3forms.com
  //    et colle-la ici. Tant que c'est "TODO", le formulaire bascule en mailto.
  contactFormKey: "fb1d6410-84e6-469b-89a1-95297326e411",

  // Cadrage HYBRIDE : message principal = ingénieur employable,
  // signal freelance discret et secondaire.
  eyebrow: "ouvert aux opportunités · poste ou mission",

  // Email perso en priorité (recruteur), email agence en secondaire.
  email: "rhamonkota@gmail.com",
  novariftEmail: "hello@novarift.io",

  // 🔗 Liens réels à remplir — un recruteur clique TOUJOURS dessus.
  links: {
    github: "https://github.com/RhamonK",
    linkedin: "https://www.linkedin.com/in/rhamone-nyavedji-nova6679",
    x: "https://x.com/TODO", // TODO (ou supprime si tu n'en as pas)
    novarift: "https://novarift.io",
    instagram: "https://instagram.com/TODO", // TODO
  },

  // 📄 CV — versions FR et EN dans /public/.
  cvPath: "/cv.pdf",
  cvPathEn: "/cv-en.pdf",
} as const;

export const navLinks = [
  { label: "Projets", href: "/#projets" },
  { label: "Stack", href: "/#skills" },
  { label: "À propos", href: "/#about" },
] as const;

// Bande marquee technique (répétée 2x dans le composant pour la boucle).
export const stackMarquee = [
  { label: "Next.js", highlight: true },
  { label: "React", highlight: false },
  { label: "TypeScript", highlight: false },
  { label: "JavaScript", highlight: true },
  { label: "Python", highlight: false },
  { label: "SQL", highlight: false },
  { label: "API REST", highlight: true },
  { label: "POO", highlight: false },
  { label: "Tailwind CSS", highlight: true },
  { label: "Supabase", highlight: false },
  { label: "Prisma", highlight: false },
  { label: "n8n", highlight: true },
  { label: "WhatsApp Business API", highlight: false },
  { label: "Webflow", highlight: false },
  { label: "Vercel", highlight: false },
  { label: "Claude API", highlight: true },
  { label: "PostgreSQL", highlight: false },
  { label: "Cloudflare R2", highlight: false },
] as const;

// Facts colonne "À propos".
export const facts = [
  { k: "formation", v: "Licence — Dév. d'applications (≈ BSc)" },
  { k: "basé à", v: "Gatineau, Québec" },
  { k: "disponibilité", v: "Poste · Freelance & contrats" },
  { k: "langues", v: "Français · Anglais" },
  { k: "spécialités", v: "Web apps · Automation · IA" },
] as const;
