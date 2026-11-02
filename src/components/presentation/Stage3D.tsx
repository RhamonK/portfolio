"use client";

import { Suspense, useEffect, useMemo } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { presentations, type Lang, type Slide } from "@/data/presentations";
import type { PresenterSignals } from "@/components/presentation/signals";
import { PresenterModel, PRESENTER_URL } from "@/components/presentation/PresenterModel";

// Scène C en une seule pièce : la diapo s'affiche sur le grand écran courbé
// de la salle Blender, et le présentateur se tient debout à sa droite, à
// l'échelle humaine, éclairé par l'écran — comme quelqu'un qui expose son projet.

const STEP = THREE.MathUtils.degToRad(66);
/** Où se tient le présentateur (mètres) : devant l'écran, côté droit. */
const SPOT = new THREE.Vector3(1.9, 0, -2.45);
/**
 * Salle ronde : le présentateur se tourne vers le centre de la pièce, dans
 * l'axe de la courbe de l'écran (et non face à la caméra), un peu ouvert
 * vers le public.
 */
const FACING = Math.atan2(-SPOT.x, -SPOT.z) * 0.85;
const W = 2048;
const SALLE_URL = "/salle/salle.glb";
const H = 1222;

type SlideView = { slide: Slide; lang: Lang; index: number; images: string[] };

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

// La diapo dessinée en image, aux proportions exactes de l'écran (1,676).
// Comme un exposé : un titre court en haut, et surtout la capture du site
// qui montre ce qui est dit (deux captures côte à côte quand il le faut).
// Le détail parlé passe en sous-titres, pas sur l'écran.
function frame(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const r = Math.min(w / img.width, h / img.height);
  const iw = img.width * r;
  const ih = img.height * r;
  const ix = x + (w - iw) / 2;
  const iy = y + (h - ih) / 2;
  ctx.save();
  ctx.shadowColor = "rgba(212,255,58,0.18)";
  ctx.shadowBlur = 60;
  ctx.beginPath();
  ctx.roundRect(ix, iy, iw, ih, 22);
  ctx.fillStyle = "#0a0b0a";
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(ix, iy, iw, ih, 22);
  ctx.clip();
  ctx.drawImage(img, ix, iy, iw, ih);
  ctx.restore();
  ctx.strokeStyle = "rgba(242,243,238,0.22)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(ix, iy, iw, ih, 22);
  ctx.stroke();
}

function drawSlide(canvas: HTMLCanvasElement, v: SlideView, imgs: HTMLImageElement[]) {
  const ctx = canvas.getContext("2d")!;
  const css = getComputedStyle(document.documentElement);
  const display = getComputedStyle(document.body).fontFamily;
  const mono = css.getPropertyValue("--font-jetbrains").trim() || "monospace";

  const bg = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, W * 0.8);
  bg.addColorStop(0, "#1c2410");
  bg.addColorStop(1, "#0d0f0b");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const x = 110;
  ctx.fillStyle = "#d4ff3a";
  ctx.font = `500 34px ${mono}`;
  ctx.fillText(`${String(v.index + 1).padStart(2, "0")} · ${v.slide.kind[v.lang]}`, x, 120);
  ctx.fillStyle = "#f2f3ee";
  ctx.font = `700 88px ${display}`;
  const title = wrap(ctx, v.slide.title[v.lang], W - 2 * x)[0] ?? "";
  ctx.fillText(title, x, 222);

  const top = 290;
  const bottom = H - 70;
  const h = bottom - top;
  const w = W - 2 * x;
  if (imgs.length >= 2) {
    const gap = 50;
    const portrait = imgs[1].height > imgs[1].width;
    const w2 = portrait ? w * 0.26 : (w - gap) * 0.42;
    frame(ctx, imgs[0], x, top, w - w2 - gap, h);
    frame(ctx, imgs[1], x + w - w2, top, w2, h);
  } else {
    frame(ctx, imgs[0], x, top, w, h);
  }
}

function Room({ view, projectIndex }: { view: SlideView; projectIndex: number }) {
  const gltf = useLoader(GLTFLoader, SALLE_URL, dracoSetup);
  const imgs = useLoader(THREE.ImageLoader, view.images) as HTMLImageElement[];
  const scene = useMemo(() => gltf.scene.clone(true), [gltf]);

  const canvas = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    return c;
  }, []);
  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.flipY = false;
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    // la salle est affichée en miroir : on remet l'image à l'endroit
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.x = -1;
    t.offset.x = 1;
    return t;
  }, [canvas]);

  useEffect(() => {
    drawSlide(canvas, view, imgs);
    texture.needsUpdate = true;
  }, [canvas, texture, view, imgs]);

  useMemo(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const m = /^screen_0(\d)$/.exec(mesh.name);
      if (m) {
        const front = Number(m[1]) - 1 === projectIndex;
        mesh.material = front
          ? new THREE.MeshBasicMaterial({ map: texture, toneMapped: false, side: THREE.DoubleSide })
          : new THREE.MeshBasicMaterial({ color: "#0d0f0b", side: THREE.DoubleSide });
      } else if (/^glass_0\d$/.test(mesh.name)) {
        mesh.material = new THREE.MeshBasicMaterial({ color: "#000", transparent: true, opacity: 0.04, depthWrite: false, side: THREE.DoubleSide });
      } else if (mesh.name === "floor" || mesh.name === "room_walls") {
        // sol et murs mats : pas de reflet vif qui attire l'œil
        mesh.material = new THREE.MeshStandardMaterial({ color: "#0e100c", roughness: 0.9, metalness: 0.1, side: THREE.DoubleSide });
      } else if (mesh.name === "ceiling_ring") {
        mesh.material = new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffd9b0").multiplyScalar(0.55), toneMapped: false, side: THREE.DoubleSide });
      }
    });
  }, [scene, texture, projectIndex]);

  return (
    <group scale={[-1, 1, 1]} rotation={[0, projectIndex * STEP, 0]}>
      <primitive object={scene} />
    </group>
  );
}

// Cadrage : l'écran entier, le présentateur en pied à sa droite.
function Rig() {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(size.height, 1);
    const fitWidth = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(29)) / aspect);
    cam.fov = THREE.MathUtils.radToDeg(Math.max(THREE.MathUtils.degToRad(40), fitWidth));
    cam.position.set(0.25, 1.45, 2.2);
    cam.lookAt(0.4, 1.3, -4);
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

// Tout est chargé : on compile les shaders d'un coup (pas d'à-coup à la
// première image) et on prévient la page pour lever le fondu.
function Ready({ onReady }: { onReady: () => void }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    gl.compile(scene, camera);
    onReady();
  }, [gl, scene, camera, onReady]);
  return null;
}

const dracoSetup = (loader: GLTFLoader) => {
  const draco = new DRACOLoader();
  draco.setDecoderPath("/draco/");
  loader.setDRACOLoader(draco);
};

/**
 * Prépare la salle, le présentateur et les images de chaque diapo avant
 * l'ouverture. Les images sont préchargées par groupe, exactement comme
 * la diapo les demande (le cache de useLoader se fait par groupe d'URL).
 */
export function preloadStage(projectImage: Record<string, string>) {
  useLoader.preload(GLTFLoader, SALLE_URL, dracoSetup);
  useLoader.preload(GLTFLoader, PRESENTER_URL, dracoSetup);
  for (const [slug, p] of Object.entries(presentations)) {
    for (const sl of p.slides) {
      const imgs = sl.shots ?? (projectImage[slug] ? [projectImage[slug]] : null);
      if (imgs) useLoader.preload(THREE.ImageLoader, imgs);
    }
  }
}

export default function Stage3D({
  signals,
  view,
  projectIndex,
  onReady,
}: {
  signals: React.MutableRefObject<PresenterSignals>;
  view: SlideView;
  projectIndex: number;
  onReady: () => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.25]}
      camera={{ position: [0, 1.5, 1.7], fov: 40, near: 0.05, far: 30 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#0a0b0a"]} />
      <fog attach="fog" args={["#0a0b0a", 8, 14]} />
      <ambientLight intensity={0.3} />
      {/* la lumière de l'écran éclaire le présentateur */}
      <pointLight position={[1.0, 1.8, -3.5]} color="#e8f0dc" intensity={6} distance={5} decay={1.5} />
      {/* liseré lime derrière lui et lueur du sol */}
      <directionalLight position={[3, 2.5, -5]} color="#d4ff3a" intensity={0.9} />
      <pointLight position={[0, 0.15, -1.5]} color="#d4ff3a" intensity={1.4} distance={5} decay={1.8} />
      <directionalLight position={[2, 3, 3]} color="#f2f3ee" intensity={0.9} />
      <Rig />
      {/* salle, captures et présentateur arrivent ensemble, jamais à moitié */}
      <Suspense fallback={null}>
        <Room view={view} projectIndex={projectIndex} />
        <group position={SPOT.toArray()} rotation={[0, FACING, 0]}>
          <PresenterModel signals={signals} />
        </group>
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
