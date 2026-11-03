// INFINITY CORE — scène Three.js (sans React Three Fiber : module léger,
// chargé à la demande, boucle d'animation contrôlée).
//
// Verre : deux passes transparentes (arrière puis avant), sans transmission ni
// bloom, les deux effets les plus coûteux sur mobile. Filament : cœur lumineux
// et gaines de halo additives, dans un shader qui gère le tracé de l'intro et
// l'impulsion de lumière qui parcourt le trait sans fin.

import * as THREE from "three";
import { palette } from "@/lib/palette";
import { BODY, CAMERA, POSE, RELIEF, SIGNATURE_Z, signatureCurves } from "./shape";
import { SIGNATURE_DOT } from "./signature-data";

export type CoreQuality = "high" | "medium";

export type CoreScene = {
  /** Démarre / arrête la boucle (hors écran, onglet caché…). */
  setRunning: (on: boolean) => void;
  /** Part du trait déjà tracée, de 0 à 1 (intro). */
  setDraw: (p: number) => void;
  /** Position normalisée du pointeur, de -1 à 1. */
  setPointer: (x: number, y: number) => void;
  /** Glisser : ajoute une vitesse de rotation (radians / s), qui s'amortit avec inertie. */
  spin: (velocity: number) => void;
  /** Onde de lumière qui parcourt toute la signature (toucher, clic). */
  wave: () => void;
  /** Pointeur actif (souris dans la page, doigt sur le noyau) : les éclats s'écartent. */
  setPointerActive: (on: boolean) => void;
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
// La signature compte plusieurs traits : chacun occupe une portion [uStart, uStart + uLen]
// de la longueur totale. Le tracé de l'intro les dessine dans l'ordre, et une seule
// impulsion parcourt toute la signature, trait après trait, sans fin.
const FILAMENT_UNIFORMS = /* glsl */ `
  uniform float uTime;
  uniform float uDraw;
  uniform float uPulse;
  uniform float uStart;
  uniform float uLen;
  uniform float uWave;
  varying float vU;
`;
const FILAMENT_COLOR = /* glsl */ `
  #include <color_fragment>
  float local = clamp((uDraw - uStart) / uLen, 0.0, 1.0);
  if (vU > local || local <= 0.0) discard;
  // tête du tracé plus vive pendant l'intro
  float head = local < 1.0 ? smoothstep(0.06, 0.0, local - vU) * 1.4 : 0.0;
  // impulsion qui parcourt toute la signature en boucle
  float g = uStart + vU * uLen;
  float d = fract(g - uTime * 0.11);
  float pulse = uPulse * (smoothstep(0.07, 0.0, d) + smoothstep(0.93, 1.0, d) * 0.35) * 1.6;
  // onde déclenchée au toucher : un front de lumière large qui parcourt toute la signature
  float wave = uWave > 0.0 ? smoothstep(0.12, 0.0, abs(g - uWave)) * 2.2 : 0.0;
  diffuseColor.rgb *= 1.0 + head + pulse + wave;
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

  // ----- filament : la signature (traits extraits de docs/logo/rn-logo-v2.pdf) -----
  const curves = signatureCurves();
  const lengths = curves.map((c) => c.getLength());
  const dotLen = 0.06; // part de l'intro réservée au point final
  const total = lengths.reduce((a, l) => a + l, 0) * (1 + dotLen);
  let acc = 0;
  const spans = lengths.map((l) => {
    const span = { start: acc / total, len: l / total };
    acc += l;
    return span;
  });
  const dotStart = acc / total;

  const uniforms = {
    uTime: { value: 0 },
    uDraw: { value: 1 },
    uPulse: { value: motion ? 1 : 0 },
    uWave: { value: 0 },
  };
  const lime = new THREE.Color(palette.lime);
  const hot = new THREE.Color("#ffffff").lerp(lime, 0.4);
  const r = 0.02;
  // [rayon, couleur, opacité] — la gaine la plus large est retirée en qualité moyenne
  const layers: [number, THREE.Color, number][] = [
    ...(high ? ([[r * 5.5, lime, 0.06]] as [number, THREE.Color, number][]) : []),
    [r * 2.6, lime, high ? 0.16 : 0.2],
    [r, lime, 0.82],
    [r * 0.45, hot, 0.7],
  ];
  const filaments: THREE.Mesh[] = [];
  curves.forEach((curve, si) => {
    const segments = Math.max(24, Math.round(lengths[si] * (high ? 260 : 140)));
    const stroke = { uStart: { value: spans[si].start }, uLen: { value: spans[si].len } };
    for (const [radius, color, opacity] of layers) {
      const geo = new THREE.TubeGeometry(curve, segments, radius, high ? 10 : 6, false);
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
        shader.uniforms.uWave = uniforms.uWave;
        shader.uniforms.uStart = stroke.uStart;
        shader.uniforms.uLen = stroke.uLen;
        shader.vertexShader = "varying float vU;\n" + shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n  vU = uv.x;");
        shader.fragmentShader = FILAMENT_UNIFORMS + shader.fragmentShader.replace("#include <color_fragment>", FILAMENT_COLOR);
      };
      mat.customProgramCacheKey = () => "infinity-filament";
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = filament;
      mesh.userData.color = color;
      // dessiné après le verre (comme sur les maquettes validées) : le verre ne l'éteint pas
      mesh.renderOrder = 3;
      group.add(mesh);
      filaments.push(mesh);
    }
  });

  // point final : petite perle de lumière, apparaît à la fin du tracé
  const [dx, dy, dr] = SIGNATURE_DOT;
  const dotMeshes = (
    [
      [dr * 2.4, lime, 0.14],
      [dr, lime, 0.85],
      [dr * 0.5, hot, 0.7],
    ] as [number, THREE.Color, number][]
  ).map(([radius, color, opacity]) => {
    const geo = new THREE.SphereGeometry(radius, 20, 14);
    const col = new Float32Array(geo.attributes.position.count * 3);
    for (let i = 0; i < col.length; i += 3) col.set([color.r, color.g, color.b], i);
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const m = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }),
    );
    m.position.set(dx, dy, SIGNATURE_Z);
    m.renderOrder = 3;
    m.visible = filament;
    group.add(m);
    return m;
  });
  // ----- éclats de verre en orbite (et quelques étincelles lime) -----
  // Dans la scène, pas dans le groupe : ils gravitent autour de l'objet sans tourner avec lui.
  const shardCount = still ? 0 : high ? 26 : 14;
  const moteCount = still ? 0 : high ? 16 : 9;
  const shardMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(palette.olive750),
    metalness: 0.35,
    roughness: 0.12,
    envMapIntensity: 2.2,
    transparent: true,
    opacity: 0.85,
    flatShading: true,
  });
  const shardGeo = new THREE.OctahedronGeometry(1, 0);
  const shards = new THREE.InstancedMesh(shardGeo, shardMat, Math.max(1, shardCount));
  shards.count = shardCount;
  const moteGeo = new THREE.IcosahedronGeometry(1, 0);
  const moteMat = new THREE.MeshBasicMaterial({ color: lime, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  const motes = new THREE.InstancedMesh(moteGeo, moteMat, Math.max(1, moteCount));
  motes.count = moteCount;
  shards.renderOrder = 0;
  motes.renderOrder = 4;
  scene.add(shards, motes);
  type Orbiter = { a: number; speed: number; rx: number; ry: number; z: number; size: number; spin: THREE.Vector3; pos: THREE.Vector3; rot: THREE.Euler };
  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  const makeOrbiters = (n: number, small: boolean): Orbiter[] =>
    Array.from({ length: n }, (_, i) => ({
      a: (i / n) * Math.PI * 2 + rand(-0.3, 0.3),
      speed: rand(0.05, 0.11) * (Math.random() < 0.5 ? 1 : -1) * (small ? 1.4 : 1),
      rx: rand(1.95, 2.3),
      ry: rand(1.25, 1.6),
      z: rand(-0.9, 0.9),
      size: small ? rand(0.012, 0.024) : rand(0.045, 0.11),
      spin: new THREE.Vector3(rand(-0.6, 0.6), rand(-0.6, 0.6), rand(-0.6, 0.6)),
      pos: new THREE.Vector3(),
      rot: new THREE.Euler(rand(0, 6), rand(0, 6), rand(0, 6)),
    }));
  const shardOrbit = makeOrbiters(shardCount, false);
  const moteOrbit = makeOrbiters(moteCount, true);
  const dummy = new THREE.Object3D();
  const pointerWorld = new THREE.Vector2(99, 99);
  const viewHalf = { w: 2.37, h: 1.78 };
  const updateOrbiters = (list: Orbiter[], mesh: THREE.InstancedMesh, t: number, dt: number) => {
    list.forEach((o, i) => {
      const ang = o.a + t * o.speed;
      const tx = Math.cos(ang) * o.rx;
      const ty = Math.sin(ang) * o.ry + Math.sin(t * 0.7 + i) * 0.04;
      // le pointeur écarte doucement les éclats, qui reviennent ensuite sur leur orbite
      const dx = tx - pointerWorld.x;
      const dy = ty - pointerWorld.y;
      const d = Math.hypot(dx, dy) || 1;
      const push = Math.max(0, 1 - d / 1.1) * 0.55;
      const k = 1 - Math.pow(0.0025, dt); // lissage indépendant de la fréquence d'images
      o.pos.x += (tx + (dx / d) * push - o.pos.x) * k;
      o.pos.y += (ty + (dy / d) * push - o.pos.y) * k;
      o.pos.z += (o.z - o.pos.z) * k;
      o.rot.x += o.spin.x * dt;
      o.rot.y += o.spin.y * dt;
      o.rot.z += o.spin.z * dt;
      dummy.position.copy(o.pos);
      dummy.rotation.copy(o.rot);
      dummy.scale.setScalar(o.size * reveal);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
  // apparition des éclats quand la 3D prend le relais (ils sortent du verre)
  let reveal = 0;
  [shardOrbit, moteOrbit].forEach((list) => list.forEach((o) => o.pos.set(o.rx * 0.3 * Math.cos(o.a), o.ry * 0.3 * Math.sin(o.a), 0)));

  const showDot = (p: number) => dotMeshes.forEach((m) => (m.visible = filament && p >= dotStart));

  // Luminosité selon la profondeur dans le verre (z local) : les parties en retrait s'atténuent.
  for (const m of filaments) {
    const p = m.geometry.attributes.position;
    const c = m.userData.color as THREE.Color;
    const col = new Float32Array(p.count * 3);
    for (let i = 0; i < p.count; i++) {
      const k = THREE.MathUtils.clamp((p.getZ(i) - (SIGNATURE_Z - RELIEF)) / (2 * RELIEF), 0, 1);
      const f = 0.55 + 0.45 * k;
      col[i * 3] = c.r * f;
      col[i * 3 + 1] = c.g * f;
      col[i * 3 + 2] = c.b * f;
    }
    m.geometry.setAttribute("color", new THREE.BufferAttribute(col, 3));
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
  let pointerOn = false;
  const target: { x: number; y: number } = { x: POSE.x, y: POSE.y };
  let spinVel = 0; // vitesse de rotation donnée au glisser
  let spinOff = 0; // décalage de rotation accumulé (revient doucement à la pose lisible)
  let waveStart = -1;
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

    const s = Math.min(dt, 50) / 1000;
    t += s;
    uniforms.uTime.value = t;
    // inertie du glisser, puis retour lent vers la pose où la signature se lit
    spinOff += spinVel * s;
    spinVel *= Math.pow(0.06, s);
    spinOff += (0 - spinOff) * (1 - Math.pow(0.35, s));
    if (motion) {
      // rotation lente et posée (aller-retour ample sur ~25 s), légère lévitation
      target.y = POSE.y + Math.sin(t * 0.25) * 0.42 + pointer.x * 0.35 + spinOff;
      target.x = POSE.x + Math.sin(t * 0.17) * 0.07 - pointer.y * 0.2;
      group.position.y = Math.sin(t * 0.55) * 0.045;
    } else target.y = POSE.y + spinOff;
    const ease = 1 - Math.pow(0.02, s);
    group.rotation.y += (target.y - group.rotation.y) * ease;
    group.rotation.x += (target.x - group.rotation.x) * ease;
    // onde de lumière : parcourt la signature en 1,1 s
    if (waveStart >= 0) {
      const w = (t - waveStart) / 1.1;
      uniforms.uWave.value = w <= 1.15 ? w * 1.15 : 0;
      if (w > 1.15) waveStart = -1;
    }
    if (shardCount) {
      reveal = Math.min(1, reveal + s / 1.6);
      const pw = pointerOn ? { x: pointer.x * viewHalf.w, y: -pointer.y * viewHalf.h } : { x: 99, y: 99 };
      pointerWorld.set(pw.x, pw.y);
      updateOrbiters(shardOrbit, shards, t, s);
      updateOrbiters(moteOrbit, motes, t, s);
    }
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
      showDot(uniforms.uDraw.value);
      if (!running) renderer.render(scene, camera);
    },
    setPointer: (x, y) => {
      pointer.x = x;
      pointer.y = y;
    },
    spin: (v) => {
      spinVel = Math.max(-6, Math.min(6, spinVel + v));
    },
    wave: () => {
      waveStart = t;
    },
    setPointerActive: (on) => {
      pointerOn = on;
    },
    renderOnce,
    dispose: () => {
      setRunning(false);
      ro?.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      glassGeo.dispose();
      glassBack.dispose();
      glassFront.dispose();
      [...filaments, ...dotMeshes].forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      shardGeo.dispose();
      shardMat.dispose();
      moteGeo.dispose();
      moteMat.dispose();
      shards.dispose();
      motes.dispose();
      scene.environment?.dispose();
      halo.geometry.dispose();
      (halo.material as THREE.Material).dispose();
      haloTex.dispose();
      renderer.dispose();
    },
  };
}

/** Projette la signature (pose de repos) sur l'écran : sert aux SVG de l'image fixe. */
export function projectSignature(width: number, height: number) {
  const camera = new THREE.PerspectiveCamera(CAMERA.fov, width / height, 0.1, 50);
  camera.position.set(0, CAMERA.y, CAMERA.z);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld(true);
  const group = new THREE.Object3D();
  group.rotation.set(POSE.x, POSE.y, POSE.z);
  group.updateMatrixWorld(true);
  const toScreen = (v: THREE.Vector3) => {
    const p = v.applyMatrix4(group.matrixWorld).project(camera);
    return [((p.x + 1) / 2) * width, ((1 - p.y) / 2) * height] as [number, number];
  };
  const curves = signatureCurves();
  const lengths = curves.map((c) => c.getLength());
  const strokes = curves.map((c, i) => {
    const n = Math.max(12, Math.round(lengths[i] * 90));
    return Array.from({ length: n + 1 }, (_, k) => toScreen(c.getPointAt(k / n)));
  });
  const [dx, dy, dr] = SIGNATURE_DOT;
  const c = toScreen(new THREE.Vector3(dx, dy, SIGNATURE_Z));
  const edge = toScreen(new THREE.Vector3(dx + dr, dy, SIGNATURE_Z));
  return { strokes, lengths, dot: [c[0], c[1], Math.abs(edge[0] - c[0])] as [number, number, number] };
}
