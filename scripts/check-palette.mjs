// Vérifie que src/lib/palette.ts reprend exactement les couleurs de :root
// dans src/app/globals.css. Échoue si une valeur diffère ou manque.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const ts = readFileSync(new URL("../src/lib/palette.ts", import.meta.url), "utf8");

const root = css.match(/:root\s*\{([\s\S]*?)\}/)?.[1] ?? "";
const vars = Object.fromEntries([...root.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim().toLowerCase()]));

const values = Object.fromEntries([...ts.matchAll(/^\s*(\w+):\s*"(#[0-9a-fA-F]{3,8})"/gm)].map((m) => [m[1], m[2].toLowerCase()]));
const names = Object.fromEntries([...ts.matchAll(/^\s*(\w+):\s*"(--[\w-]+)"/gm)].map((m) => [m[1], m[2]]));

let errors = 0;
for (const [key, value] of Object.entries(values)) {
  const name = names[key];
  if (!name) {
    console.error(`palette.${key} : aucune variable CSS associée dans cssVar`);
    errors++;
  } else if (vars[name] !== value) {
    console.error(`palette.${key} = ${value}, mais ${name} = ${vars[name] ?? "absente"} dans globals.css`);
    errors++;
  }
}
if (errors) process.exit(1);
console.log(`Palette OK : ${Object.keys(values).length} couleurs identiques entre palette.ts et globals.css`);
