// INFINITY CORE — scène Three.js (sans React Three Fiber : module léger,
// chargé à la demande, boucle d'animation contrôlée).
//
// Verre : deux passes transparentes (arrière puis avant), sans transmission ni
// bloom, les deux effets les plus coûteux sur mobile. Filament : cœur lumineux
// et gaines de halo additives, dans un shader qui gère le tracé de l'intro et
// l'impulsion de lumière qui parcourt le trait sans fin.

import * as THREE from "three";
import { palette } from "@/lib/palette";
import { BODY, CAMERA, POSE, SIGNATURE } from "./shape";

export type CoreQuality = "high" | "medium";

export type CoreScene = {
  /** Démarre / arrête la boucle (hors écran, onglet caché…). */
  setRunning: (on: boolean) => void;
  /** Part du trait déjà tracée, de 0 à 1 (intro). */
  setDraw: (p: number) => void;
  /** Position normalisée du pointeur, de -1 à 1. */
  setPointer: (x: number, y: number) => void;
  /** Rend une image à la demande (utile quand la boucle est arrêtée). */
  renderOnce: () => void;
  dispose: () => void;
};

type Options = {
  canvas: HTMLCanvasElement;
  quality: CoreQuality;
  /** Animations actives (impulsion, balancement). */
  motion: boolean;
  /** Appelée si l'appareil n'arrive pas à suivre (moyenne > 45 ms par image). */
  onSlow?: () => void;
  /** Appelée après la première image dessinée. */
  onReady?: () => void;
  /** Mode image fixe : pas de boucle, rendu unique (génération de l'affiche). */
  still?: boolean;
  /** Afficher le filament (faux : verre seul, image de fond du tracé de l'intro). */
  filament?: boolean;
};

// Ajouts au shader standard du filament : tracé de l'intro et impulsion de lumière.
const FILAMENT_UNIFORMS = /* glsl */ `
  uniform float uTime;
  uniform float uDraw;
  uniform float uPulse;
  varying float vU;
`;
const FILAMENT_COLOR = /* glsl */ `
  #include <color_fragment>
  if (vU > uDraw) discard;
  // tête du tracé plus vive pendant l'intro
  float head = uDraw < 1.0 ? smoothstep(0.06, 0.0, uDraw - vU) * 1.4 : 0.0;
  // impulsion qui parcourt le trait en boucle
  float d = fract(vU - uTime * 0.11);
  float pulse = uPulse * (smoothstep(0.09, 0.0, d) + smoothstep(0.91, 1.0, d) * 0.35) * 1.6;
  diffuseColor.rgb *= 1.0 + head + pulse;
`;

function glassGeometry(widthSegments: number, heightSegments: number) {
  const geo = new THREE.SphereGeometry(1, widthSegments, heightSegments);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  const s = (x: number) => Math.sign(x) * Math.pow(Math.abs(x), BODY.exponent);
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    pos.setXYZ(i, s(v.x) * BODY.rx, s(v.y) * BODY.ry, s(v.z) * BODY.rz);
  }
  geo.computeVertexNormals();
  return geo;
}

/** Éclairage de studio : longues bandes douces, sans petits reflets carrés. */
function studioEnvironment(renderer: THREE.WebGLRenderer) {
  const studio = new THREE.Scene();
  studio.background = new THREE.Color("#050605");
  const strip = (w: number, h: number, x: number, y: number, z: number, k: number) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffffff").multiplyScalar(k), side: THREE.DoubleSide }),
    );
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    studio.add(m);
  };
  strip(1.2, 9, -4.5, 1.5, 3, 3.0);
  strip(0.8, 9, 4.8, 0.5, -1.5, 1.4);
  strip(9, 0.6, 0, 5, 0, 0.8);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(studio, 0.04).texture;
  pmrem.dispose();
  studio.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose();
      (o.material as THREE.Material).dispose();
    }
  });
  return env;
}

export function createCoreScene({ canvas, quality, motion, onSlow, onReady, still = false, filament = true }: Options): CoreScene {
  const high = quality === "high";
  // Fond opaque à la couleur exacte de la page : la jonction est invisible, et la
  // lumière additive du filament n'est pas écrêtée comme sur un fond transparent.
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: false,
    antialias: high,
    powerPreference: high ? "high-performance" : "low-power",
    preserveDrawingBuffer: still,
  });
  renderer.setClearColor(new THREE.Color(palette.bg), 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const maxDpr = still ? 1 : high ? 2 : 1.25;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));

  const scene = new THREE.Scene();
  scene.environment = studioEnvironment(renderer);
  scene.environmentIntensity = 0.9;

  const camera = new THREE.PerspectiveCamera(CAMERA.fov, 1, 0.1, 50);
  camera.position.set(0, CAMERA.y, CAMERA.z);
  camera.lookAt(0, 0, 0);

  // Halo olive derrière l'objet (même dégradé que la salle 3D), fondu vers le fond de page.
  const haloCanvas = document.createElement("canvas");
  haloCanvas.width = haloCanvas.height = 256;
  const hctx = haloCanvas.getContext("2d")!;
  const grad = hctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, palette.olive900);
  grad.addColorStop(0.55, palette.olive750);
  grad.addColorStop(1, palette.bg);
  hctx.fillStyle = grad;
  hctx.fillRect(0, 0, 256, 256);
  const haloTex = new THREE.CanvasTexture(haloCanvas);
  haloTex.colorSpace = THREE.SRGBColorSpace;
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 5.5), new THREE.MeshBasicMaterial({ map: haloTex, toneMapped: false }));
  halo.position.z = -3;
  scene.add(halo);

  const group = new THREE.Group();
  group.rotation.set(POSE.x, POSE.y, POSE.z);
  scene.add(group);

  // ----- verre -----
  const glassBase: THREE.MeshPhysicalMaterialParameters = {
    color: new THREE.Color(palette.olive750),
    metalness: 0,
    roughness: 0.08,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.6,
    transparent: true,
    depthWrite: false,
  };
  const glassBack = new THREE.MeshPhysicalMaterial({ ...glassBase, side: THREE.BackSide, opacity: 0.35 });
  const glassFront = new THREE.MeshPhysicalMaterial({
    ...glassBase,
    side: THREE.FrontSide,
    opacity: 0.42,
    ...(high ? { sheen: 1, sheenColor: new THREE.Color(palette.olive900), sheenRoughness: 0.4 } : {}),
  });
  const glassGeo = high ? glassGeometry(180, 120) : glassGeometry(96, 64);
  const back = new THREE.Mesh(glassGeo, glassBack);
  const front = new THREE.Mesh(glassGeo, glassFront);
  back.renderOrder = 1;
  front.renderOrder = 2;
  group.add(back, front);

  // ----- filament -----
  const curve = new THREE.CatmullRomCurve3(
    SIGNATURE.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    true,
    "centripetal",
    0.5,
  );
  const uniforms = {
    uTime: { value: 0 },
    uDraw: { value: 1 },
    uPulse: { value: motion ? 1 : 0 },
  };
  const lime = new THREE.Color(palette.lime);
  const hot = new THREE.Color("#ffffff").lerp(lime, 0.4);
  const r = 0.022;
  const segments = high ? 1600 : 900;
  // [rayon, couleur, opacité] — la gaine la plus large est retirée en qualité moyenne
  const layers: [number, THREE.Color, number][] = [
    ...(high ? ([[r * 5.5, lime, 0.06]] as [number, THREE.Color, number][]) : []),
    [r * 2.6, lime, high ? 0.16 : 0.2],
    [r, lime, 0.82],
    [r * 0.45, hot, 0.7],
  ];
  const filaments = layers.map(([radius, color, opacity]) => {
    const geo = new THREE.TubeGeometry(curve, segments, radius, high ? 10 : 6, true);
    // Matériau standard (même rendu que les maquettes validées) + tracé et impulsion injectés.
    const mat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.uTime;
      shader.uniforms.uDraw = uniforms.uDraw;
      shader.uniforms.uPulse = uniforms.uPulse;
      shader.vertexShader = "varying float vU;\n" + shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n  vU = uv.x;");
      shader.fragmentShader = FILAMENT_UNIFORMS + shader.fragmentShader.replace("#include <color_fragment>", FILAMENT_COLOR);
    };
    mat.customProgramCacheKey = () => "infinity-filament";
    const mesh = new THREE.Mesh(geo, mat);
    mesh.visible = filament;
    mesh.userData.color = color;
    // dessiné après le verre (comme sur les maquettes validées) : le verre ne l'éteint pas,
    // la profondeur est rendue par l'atténuation des parties du trait situées au fond
    mesh.renderOrder = 3;
    group.add(mesh);
    return mesh;
  });

  // Luminosité selon la profondeur vue de la caméra, calculée dans la pose de repos :
  // les parties au fond du verre s'atténuent (le soulignement devient un reflet).
  {
    group.updateMatrixWorld(true);
    const v = new THREE.Vector3();
    let zmin = Infinity;
    let zmax = -Infinity;
    for (const m of filaments) {
      const p = m.geometry.attributes.position;
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i).applyMatrix4(m.matrixWorld);
        zmin = Math.min(zmin, v.z);
        zmax = Math.max(zmax, v.z);
      }
    }
    for (const m of filaments) {
      const p = m.geometry.attributes.position;
      const c = m.userData.color as THREE.Color;
      const col = new Float32Array(p.count * 3);
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i).applyMatrix4(m.matrixWorld);
        const k = (v.z - zmin) / (zmax - zmin || 1);
        const f = 0.2 + 0.8 * Math.pow(k, 1.6);
        col[i * 3] = c.r * f;
        col[i * 3 + 1] = c.g * f;
        col[i * 3 + 2] = c.b * f;
      }
      m.geometry.setAttribute("color", new THREE.BufferAttribute(col, 3));
    }
  }

  // ----- taille -----
  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = still ? null : new ResizeObserver(() => {
    resize();
    if (!running) renderer.render(scene, camera);
  });
  ro?.observe(canvas);

  // ----- boucle -----
  const pointer = { x: 0, y: 0 };
  const target: { x: number; y: number } = { x: POSE.x, y: POSE.y };
  let running = false;
  let raf = 0;
  let last = 0;
  let t = 0;
  let readySent = false;
  const minFrame = high ? 0 : 1000 / 30; // qualité moyenne : 30 images / s
  const probe = { n: 0, sum: 0, done: !onSlow };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = last ? now - last : 16;
    if (dt < minFrame - 1) return;
    last = now;

    if (!probe.done) {
      probe.n++;
      if (probe.n > 10) probe.sum += dt; // on ignore les premières images (compilation)
      if (probe.n === 70) {
        probe.done = true;
        if (probe.sum / 60 > 45) onSlow?.();
      }
    }

    t += Math.min(dt, 50) / 1000;
    uniforms.uTime.value = t;
    if (motion) {
      target.y = POSE.y + Math.sin(t * 0.25) * 0.16 + pointer.x * 0.32;
      target.x = POSE.x + Math.sin(t * 0.2) * 0.04 - pointer.y * 0.16;
    }
    group.rotation.y += (target.y - group.rotation.y) * 0.06;
    group.rotation.x += (target.x - group.rotation.x) * 0.06;
    renderer.render(scene, camera);
    if (!readySent) {
      readySent = true;
      onReady?.();
    }
  };

  const setRunning = (on: boolean) => {
    if (still || on === running) return;
    running = on;
    if (on) {
      last = 0;
      raf = requestAnimationFrame(frame);
    } else cancelAnimationFrame(raf);
  };

  const renderOnce = () => {
    renderer.render(scene, camera);
    if (!readySent) {
      readySent = true;
      onReady?.();
    }
  };

  const onLost = (e: Event) => {
    e.preventDefault();
    setRunning(false);
    onSlow?.();
  };
  canvas.addEventListener("webglcontextlost", onLost);

  if (still) renderOnce();

  return {
    setRunning,
    setDraw: (p) => {
      uniforms.uDraw.value = Math.max(0, Math.min(1, p));
      if (!running) renderer.render(scene, camera);
    },
    setPointer: (x, y) => {
      pointer.x = x;
      pointer.y = y;
    },
    renderOnce,
    dispose: () => {
      setRunning(false);
      ro?.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      glassGeo.dispose();
      glassBack.dispose();
      glassFront.dispose();
      filaments.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      scene.environment?.dispose();
      halo.geometry.dispose();
      (halo.material as THREE.Material).dispose();
      haloTex.dispose();
      renderer.dispose();
    },
  };
}

/** Projette le trait (pose de repos) sur l'écran : sert au SVG de l'image fixe. */
export function projectSignature(width: number, height: number, samples = 360) {
  const camera = new THREE.PerspectiveCamera(CAMERA.fov, width / height, 0.1, 50);
  camera.position.set(0, CAMERA.y, CAMERA.z);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld(true);
  const group = new THREE.Object3D();
  group.rotation.set(POSE.x, POSE.y, POSE.z);
  group.updateMatrixWorld(true);
  const curve = new THREE.CatmullRomCurve3(SIGNATURE.map(([x, y, z]) => new THREE.Vector3(x, y, z)), true, "centripetal", 0.5);
  const pts: [number, number][] = [];
  for (let i = 0; i < samples; i++) {
    const v = curve.getPointAt(i / samples).applyMatrix4(group.matrixWorld).project(camera);
    pts.push([((v.x + 1) / 2) * width, ((1 - v.y) / 2) * height]);
  }
  return pts;
}
