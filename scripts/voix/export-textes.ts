// Exporte les textes parlés (une ligne par diapo) pour la synthèse vocale.
// Usage : npx tsx scripts/voix/export-textes.ts > scripts/voix/textes.json
import { presentations } from "../../src/data/presentations";
import { langs } from "../../src/i18n";

const out = Object.values(presentations).flatMap((p) =>
  langs.flatMap((lang) => p.slides.map((s, i) => ({ slug: p.slug, lang, slide: i, text: s.speech[lang] }))),
);
process.stdout.write(JSON.stringify(out, null, 2) + "\n");
