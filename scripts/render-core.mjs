// Génère l'image fixe d'INFINITY CORE et le tracé SVG correspondant,
// avec exactement la même scène que la 3D du site (src/components/core/scene.ts).
//
//   npm run core
//
// Sorties :
//   public/core/signature-{640,1040,1600}.webp   (fond #0a0b0a opaque, format 4:3)
//   public/core/verre-{640,1040,1600}.webp       (verre seul, fond du tracé de l'intro)
//   src/components/core/poster-path.ts            (tracé projeté, pour le SVG animé)
//
// Nécessite Playwright (npx playwright install chromium la première fois).
import { build } from "esbuild";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createRequire } from "node:module";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const W = 1600;
const H = 1200;
const SIZES = [640, 1040, 1600];

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  try {
    // installation globale (NODE_PATH)
    ({ chromium } = createRequire(import.meta.url)("playwright"));
  } catch {
    console.error("Playwright est requis : npm i -D playwright && npx playwright install chromium");
    process.exit(1);
  }
}

const entry = `
  import { createCoreScene, projectSignature } from "@/components/core/scene";
  window.__render = async (sizes, filament) => {
    const old = document.querySelector("canvas");
    const canvas = old.cloneNode();
    old.replaceWith(canvas);
    createCoreScene({ canvas, quality: "high", motion: false, still: true, filament });
    const out = {};
    for (const w of sizes) {
      const c = document.createElement("canvas");
      c.width = w; c.height = Math.round(w * ${H} / ${W});
      const ctx = c.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(canvas, 0, 0, c.width, c.height);
      out[w] = c.toDataURL("image/webp", 0.86);
    }
    return { images: out, path: projectSignature(${W}, ${H}) };
  };
`;

const bundle = await build({
  stdin: { contents: entry, resolveDir: root, loader: "ts" },
  bundle: true,
  write: false,
  format: "iife",
  tsconfig: path.join(root, "tsconfig.json"),
  logLevel: "error",
});

const browser = await chromium.launch({
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: W, height: H } });
page.on("pageerror", (e) => console.error(e.message));
await page.setContent(
  `<!doctype html><html><body style="margin:0;background:#0a0b0a"><canvas style="width:${W}px;height:${H}px;display:block"></canvas><script>${bundle.outputFiles[0].text}</script></body></html>`,
);
const { images, path: pts } = await page.evaluate((s) => window.__render(s, true), SIZES);
// verre seul : fond du tracé de l'intro (le filament est dessiné en SVG par-dessus)
const { images: glass } = await page.evaluate((s) => window.__render(s, false), SIZES);
await browser.close();

const dir = path.join(root, "public", "core");
mkdirSync(dir, { recursive: true });
for (const [name, set] of [["signature", images], ["verre", glass]]) {
  for (const [w, url] of Object.entries(set)) {
    const file = path.join(dir, `${name}-${w}.webp`);
    writeFileSync(file, Buffer.from(url.split(",")[1], "base64"));
    console.log(path.relative(root, file));
  }
}

const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("") + "Z";
writeFileSync(
  path.join(root, "src/components/core/poster-path.ts"),
  `// Généré par scripts/render-core.mjs — ne pas modifier à la main.\n// Tracé de la signature projeté dans l'image fixe (${W} × ${H}).\nexport const POSTER_VIEWBOX = "0 0 ${W} ${H}";\nexport const POSTER_PATH = "${d}";\n`,
);
console.log("src/components/core/poster-path.ts");
