// ============================================================
// Stack maîtrisée — grille de cercles.
// "initials" = ce qui s'affiche dans le cercle.
// ============================================================

export type Skill = {
  initials: string;
  label: string;
};

export const skills: Skill[] = [
  { initials: "N", label: "Next.js" },
  { initials: "R", label: "React" },
  { initials: "Ts", label: "TypeScript" },
  { initials: "Js", label: "JavaScript" },
  { initials: "Tw", label: "Tailwind" },
  { initials: "Py", label: "Python" },
  { initials: "SQL", label: "SQL" },
  { initials: "API", label: "API REST" },
  { initials: "OOP", label: "POO" },
  { initials: "Sb", label: "Supabase" },
  { initials: "n8n", label: "n8n" },
  { initials: "Wf", label: "Webflow" },
  { initials: "Wa", label: "WhatsApp API" },
  { initials: "Cl", label: "Claude API" },
];
