// Images fixes de la section Expérimentations, rendues à partir des vrais modèles 3D du site :
//   public/labo/presentateur.webp  (public/presenter/presenter.glb, pose « idle »)
//   public/labo/salle.webp         (public/salle/salle.glb avec les captures des projets)
//
//   npm run labo
//
// Nécessite Playwright (npx playwright install chromium la première fois).
import { build } from "esbuild";
import { createServer } from "node:http";
import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const W = 1040;
const H = 650;

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  try {
    ({ chromium } = createRequire(import.meta.url)("playwright"));
  } catch {
    console.error("Playwright est requis : npm i -D playwright && npx playwright install chromium");
    process.exit(1);
  }
}

const entry = `
  import * as THREE from "three";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
  import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
  import { projects } from "@/data/projects";
  import { palette } from "@/lib/palette";

  const loader = new GLTFLoader();
  const draco = new DRACOLoader();
  draco.setDecoderPath("/draco/");
  loader.setDRACOLoader(draco);

  function setup() {
    const canvas = document.querySelector("canvas");
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1);
    renderer.setSize(${W}, ${H}, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(palette.bg);
    return { renderer, scene };
  }
  const shot = (renderer) => renderer.domElement.toDataURL("image/webp", 0.86);

  window.__presenter = async () => {
    const { renderer, scene } = setup();
    const gltf = await loader.loadAsync("/presenter/presenter.glb");
    scene.add(gltf.scene);
    const mixer = new THREE.AnimationMixer(gltf.scene);
    const idle = THREE.AnimationClip.findByName(gltf.animations, "idle");
    if (idle) { mixer.clipAction(idle).play(); mixer.update(1.2); }
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const h = box.max.y - box.min.y;
    const cam = new THREE.PerspectiveCamera(26, ${W} / ${H}, 0.05, 50);
    const target = new THREE.Vector3(0, box.min.y + h * 0.72, 0);
    cam.position.set(0.55, target.y + 0.05, 2.6);
    cam.lookAt(target);
    scene.add(new THREE.HemisphereLight("#e8f0dc", palette.olive900, 0.9));
    const key = new THREE.DirectionalLight("#ffd9b0", 2.2); key.position.set(1.5, 2.5, 2); scene.add(key);
    const rim = new THREE.PointLight(palette.lime, 6, 6, 1.6); rim.position.set(-1.2, target.y + 0.4, -0.8); scene.add(rim);
    renderer.render(scene, cam);
    return shot(renderer);
  };

  function onDark(img) {
    const c = document.createElement("canvas"); c.width = 1280; c.height = 840;
    const x = c.getContext("2d");
    const g = x.createRadialGradient(640, 0, 0, 640, 0, 900);
    g.addColorStop(0, palette.olive900); g.addColorStop(1, palette.olive800);
    x.fillStyle = g; x.fillRect(0, 0, 1280, 840);
    x.drawImage(img, 64, 42, 1152, 756);
    return new THREE.CanvasTexture(c);
  }

  window.__salle = async () => {
    const { renderer, scene } = setup();
    scene.fog = new THREE.Fog(palette.bg, 5, 11);
    const gltf = await loader.loadAsync("/salle/salle.glb");
    const tl = new THREE.TextureLoader();
    const images = projects.map((p) => p.image ?? "/projets/" + p.slug + "/dessin.svg");
    const textures = await Promise.all(images.map(async (src) => {
      if (src.endsWith(".svg")) {
        const img = new Image(); img.src = src; await img.decode(); return onDark(img);
      }
      return tl.loadAsync(src);
    }));
    gltf.scene.traverse((o) => {
      if (!o.isMesh) return;
      const m = /^screen_0(\\d)$/.exec(o.name);
      if (m) {
        const tex = textures[Number(m[1]) - 1];
        tex.flipY = false; tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
        tex.wrapS = THREE.RepeatWrapping; tex.repeat.x = -1; tex.offset.x = 1;
        o.material = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, side: THREE.DoubleSide });
      } else if (/^glass_0\\d$/.test(o.name)) {
        o.material = new THREE.MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.04, depthWrite: false, side: THREE.DoubleSide });
      } else if (o.name === "ceiling_ring") {
        o.material = new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffd9b0").multiplyScalar(0.55), toneMapped: false, side: THREE.DoubleSide });
      }
    });
    const group = new THREE.Group();
    group.scale.set(-1, 1, 1);
    group.rotation.y = THREE.MathUtils.degToRad(66) * 0.5; // entre deux écrans : on voit la courbe de la salle
    group.add(gltf.scene);
    scene.add(group);
    scene.add(new THREE.AmbientLight("#ffffff", 0.25));
    const lime = new THREE.PointLight(palette.lime, 6, 7, 1.6); lime.position.set(0, 0.15, 0); scene.add(lime);
    const warm = new THREE.PointLight("#ffd9b0", 4, 9, 1.4); warm.position.set(0, 4, -1.5); scene.add(warm);
    const cam = new THREE.PerspectiveCamera(58, ${W} / ${H}, 0.05, 30);
    cam.position.set(0, 1.6, 0.6);
    cam.lookAt(0, 1.65, -4);
    renderer.render(scene, cam);
    return shot(renderer);
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
const html = `<!doctype html><html><body style="margin:0;background:#0a0b0a"><canvas style="width:${W}px;height:${H}px;display:block"></canvas><script>${bundle.outputFiles[0].text}</script></body></html>`;

// petit serveur local : public/ + la page de rendu
const types = { ".glb": "model/gltf-binary", ".wasm": "application/wasm", ".js": "text/javascript", ".webp": "image/webp", ".svg": "image/svg+xml" };
const server = createServer((req, res) => {
  const p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/__lab.html") {
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end(html);
  }
  const f = path.join(root, "public", p);
  if (f.startsWith(path.join(root, "public")) && existsSync(f) && statSync(f).isFile()) {
    res.writeHead(200, { "Content-Type": types[path.extname(f)] || "application/octet-stream" });
    return res.end(readFileSync(f));
  }
  res.writeHead(404);
  res.end();
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
page.on("pageerror", (e) => console.error(e.message));
await page.goto(`http://localhost:${port}/__lab.html`);
const dir = path.join(root, "public", "labo");
mkdirSync(dir, { recursive: true });
for (const [name, fn] of [["presentateur", "__presenter"], ["salle", "__salle"]]) {
  const url = await page.evaluate((f) => window[f](), fn);
  const file = path.join(dir, `${name}.webp`);
  writeFileSync(file, Buffer.from(url.split(",")[1], "base64"));
  console.log(path.relative(root, file));
}
await browser.close();
server.close();
