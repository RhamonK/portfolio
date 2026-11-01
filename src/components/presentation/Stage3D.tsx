"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import type { Lang, Slide } from "@/data/presentations";
import type { PresenterSignals } from "@/components/presentation/signals";
import { Figure } from "@/components/presentation/Presenter";
import { PresenterModel, PRESENTER_URL } from "@/components/presentation/PresenterModel";

// Scène C en une seule pièce : la diapo s'affiche sur le grand écran courbé
// de la salle Blender, et le présentateur se tient debout à sa droite, à
// l'échelle humaine, éclairé par l'écran — comme quelqu'un qui expose son projet.

const STEP = THREE.MathUtils.degToRad(66);
const lerp = THREE.MathUtils.lerp;
/** Où se tient le présentateur (mètres) : devant l'écran, côté droit. */
const SPOT = new THREE.Vector3(1.9, 0, -2.45);
/**
 * Salle ronde : le présentateur se tourne vers le centre de la pièce, dans
 * l'axe de la courbe de l'écran (et non face à la caméra), un peu ouvert
 * vers le public.
 */
const FACING = Math.atan2(-SPOT.x, -SPOT.z) * 0.85;
const W = 2048;
const H = 1222;

type SlideView = { slide: Slide; lang: Lang; index: number; image: string };

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
function drawSlide(canvas: HTMLCanvasElement, v: SlideView, img: HTMLImageElement) {
  const ctx = canvas.getContext("2d")!;
  const css = getComputedStyle(document.documentElement);
  const display = getComputedStyle(document.body).fontFamily;
  const mono = css.getPropertyValue("--font-jetbrains").trim() || "monospace";

  const bg = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, W * 0.8);
  bg.addColorStop(0, "#1c2410");
  bg.addColorStop(1, "#0d0f0b");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const x = 130;
  ctx.fillStyle = "#d4ff3a";
  ctx.font = `500 36px ${mono}`;
  ctx.fillText(`${String(v.index + 1).padStart(2, "0")} · ${v.slide.kind[v.lang]}`, x, 150);

  ctx.fillStyle = "#f2f3ee";
  ctx.font = `700 112px ${display}`;
  let y = 290;
  for (const l of wrap(ctx, v.slide.title[v.lang], W - 2 * x)) {
    ctx.fillText(l, x, y);
    y += 118;
  }

  const top = y + 30;
  ctx.fillStyle = "#d9dbd3";
  ctx.font = `400 46px ${display}`;
  let ly = top + 40;
  for (const line of v.slide.lines[v.lang]) {
    for (const l of wrap(ctx, line, 900)) {
      ctx.fillText(l, x, ly);
      ly += 62;
    }
    ly += 22;
  }

  // capture ou dessin du projet, dans un cadre à droite
  const bx = 1110;
  const bw = W - bx - x;
  const bh = H - top - 110;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(bx, top, bw, bh, 28);
  ctx.fillStyle = "#0a0b0a";
  ctx.fill();
  ctx.clip();
  const r = Math.min(bw / img.width, bh / img.height);
  const iw = img.width * r;
  const ih = img.height * r;
  ctx.drawImage(img, bx + (bw - iw) / 2, top + (bh - ih) / 2, iw, ih);
  ctx.restore();
  ctx.strokeStyle = "rgba(242,243,238,0.18)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(bx, top, bw, bh, 28);
  ctx.stroke();
}

function Room({ view, projectIndex }: { view: SlideView; projectIndex: number }) {
  const gltf = useLoader(GLTFLoader, "/salle/salle.glb", (loader) => {
    const draco = new DRACOLoader();
    draco.setDecoderPath("/draco/");
    loader.setDRACOLoader(draco);
  });
  const projectImg = useLoader(THREE.ImageLoader, view.image);
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
    t.anisotropy = 8;
    // la salle est affichée en miroir : on remet l'image à l'endroit
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.x = -1;
    t.offset.x = 1;
    return t;
  }, [canvas]);

  useEffect(() => {
    drawSlide(canvas, view, projectImg);
    texture.needsUpdate = true;
  }, [canvas, texture, view, projectImg]);

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
function Rig({ signals, usesModel }: { signals: React.MutableRefObject<PresenterSignals>; usesModel: boolean }) {
  const { camera, size } = useThree();
  const mouth = useMemo(() => new THREE.Vector3(), []);
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(size.height, 1);
    const fitWidth = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(29)) / aspect);
    cam.fov = THREE.MathUtils.radToDeg(Math.max(THREE.MathUtils.degToRad(40), fitWidth));
    cam.position.set(0.25, 1.45, 2.2);
    cam.lookAt(0.4, 1.3, -4);
    cam.updateProjectionMatrix();
  }, [camera, size]);

  useFrame(() => {
    if (usesModel) return; // le modèle Blender donne lui-même la position de sa bouche
    mouth.set(SPOT.x, 1.38, SPOT.z + 0.3).project(camera);
    signals.current.mouthX = (mouth.x + 1) / 2;
    signals.current.mouthY = (1 - mouth.y) / 2;
  });
  return null;
}

// Buste provisoire (statique, sans squelette) : posé sur le corps de la
// silhouette, il suit un peu la souris et bouge légèrement en parlant.
const BUST_HEIGHT = 0.75; // mètres, du haut du crâne au bas du buste
const BUST_TOP = 1.76;

function Bust({ scene, signals }: { scene: THREE.Object3D; signals: React.MutableRefObject<PresenterSignals> }) {
  const pivot = useRef<THREE.Group>(null!);
  const { camera } = useThree();
  const mouth = useMemo(() => new THREE.Vector3(), []);
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = BUST_HEIGHT / (size.y || 1);
    // le visage regarde +X dans le fichier : on le tourne vers la caméra (+Z)
    return { s, offset: center.multiplyScalar(-1), depth: (size.x / 2) * 0.9, mouthY: size.y * 0.08 };
  }, [scene]);

  useFrame((state) => {
    const sig = signals.current;
    const t = state.clock.elapsedTime;
    const move = sig.still ? 0 : 1;
    const p = pivot.current;
    p.rotation.y = lerp(p.rotation.y, -Math.PI / 2 + sig.mouse.x * 0.25, 0.08);
    p.rotation.z = lerp(p.rotation.z, sig.mouse.y * 0.08 + sig.speaking * 0.035 * Math.sin(t * 7) * move, 0.2);
    // position de la bouche à l'écran, pour les mots-clés qui tombent
    p.localToWorld(mouth.set(fit.depth, fit.mouthY, 0).multiplyScalar(1));
    mouth.project(camera);
    sig.mouthX = (mouth.x + 1) / 2;
    sig.mouthY = (1 - mouth.y) / 2;
  });

  return (
    <group position={[SPOT.x, BUST_TOP - BUST_HEIGHT / 2, SPOT.z]} rotation={[0, FACING, 0]}>
      <group ref={pivot} rotation={[0, -Math.PI / 2, 0]} scale={fit.s}>
        <primitive object={scene} position={fit.offset} />
      </group>
    </group>
  );
}

// Modèle avec squelette → présentateur animé ; buste statique → monté sur la silhouette.
function PresenterAuto({ signals, silhouette }: { signals: React.MutableRefObject<PresenterSignals>; silhouette: ReactNode }) {
  const gltf = useLoader(GLTFLoader, PRESENTER_URL, (loader) => {
    const draco = new DRACOLoader();
    draco.setDecoderPath("/draco/");
    loader.setDRACOLoader(draco);
  });
  const rigged = useMemo(() => {
    let found = false;
    gltf.scene.traverse((o) => {
      if ((o as THREE.SkinnedMesh).isSkinnedMesh) found = true;
    });
    return found;
  }, [gltf]);

  if (rigged) {
    return (
      <group position={SPOT.toArray()} rotation={[0, FACING, 0]}>
        <PresenterModel signals={signals} inRoom />
      </group>
    );
  }
  return (
    <>
      {silhouette}
      <Bust scene={gltf.scene} signals={signals} />
    </>
  );
}

class Fallback extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function Stage3D({
  signals,
  view,
  projectIndex,
}: {
  signals: React.MutableRefObject<PresenterSignals>;
  view: SlideView;
  projectIndex: number;
}) {
  const [hasModel, setHasModel] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch(PRESENTER_URL, { method: "HEAD" })
      .then((r) => {
        if (!cancelled && r.ok && !(r.headers.get("content-type") ?? "").includes("text/html")) setHasModel(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Silhouette de la phase 1, mise à l'échelle d'une personne de 1,75 m.
  const silhouette = (
    <group position={[SPOT.x, 1.2, SPOT.z]} rotation={[0, FACING, 0]} scale={0.83}>
      <Figure signals={signals} />
    </group>
  );
  const body = (
    <group position={[SPOT.x, 1.2, SPOT.z]} rotation={[0, FACING, 0]} scale={0.83}>
      <Figure signals={signals} headless />
    </group>
  );

  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.5, 1.7], fov: 40, near: 0.05, far: 30 }} gl={{ antialias: true }}>
      <color attach="background" args={["#0a0b0a"]} />
      <fog attach="fog" args={["#0a0b0a", 8, 14]} />
      <ambientLight intensity={0.3} />
      {/* la lumière de l'écran éclaire le présentateur */}
      <pointLight position={[1.0, 1.8, -3.5]} color="#e8f0dc" intensity={6} distance={5} decay={1.5} />
      {/* liseré lime derrière lui et lueur du sol */}
      <directionalLight position={[3, 2.5, -5]} color="#d4ff3a" intensity={0.9} />
      <pointLight position={[0, 0.15, -1.5]} color="#d4ff3a" intensity={1.4} distance={5} decay={1.8} />
      <directionalLight position={[2, 3, 3]} color="#f2f3ee" intensity={0.9} />
      <Rig signals={signals} usesModel={hasModel} />
      <Suspense fallback={null}>
        <Room view={view} projectIndex={projectIndex} />
      </Suspense>
      {hasModel ? (
        <Fallback fallback={silhouette}>
          <Suspense fallback={silhouette}>
            <PresenterAuto signals={signals} silhouette={body} />
          </Suspense>
        </Fallback>
      ) : (
        silhouette
      )}
    </Canvas>
  );
}
