// Exporte les dessins des projets (src/components/ProjectArt.tsx) en SVG
// statiques dans public/projets/<slug>/dessin.svg : chaque bande des écrans
// courbés n'affiche ainsi qu'une image au lieu de tout le dessin.
// Usage : npm run art
import { mkdirSync, writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProjectArt } from "../src/components/ProjectArt";
import { projects } from "../src/data/projects";

for (const p of projects) {
  const svg = renderToStaticMarkup(createElement(ProjectArt, { slug: p.slug }))
    .replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" ')
    .replace(/ class="[^"]*"/, "")
    .replace(/ aria-hidden="true"/, "");
  mkdirSync(`public/projets/${p.slug}`, { recursive: true });
  writeFileSync(`public/projets/${p.slug}/dessin.svg`, svg);
  console.log(p.slug, svg.length, "octets");
}
