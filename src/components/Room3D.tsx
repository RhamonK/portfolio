"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// Salle d'écrans modélisée dans Blender (public/salle/salle.glb, voir
// docs/prompt-blender-salle.md). Le visiteur est au centre, à 1,60 m ;
// l'écran 0X reçoit la capture du projet X et le cercle tourne de 66°
// par projet. Chargé seulement sur desktop, à l'approche de la salle.

const STEP = THREE.MathUtils.degToRad(66);
const EYE = 1.6;

/**
 * Valeurs pilotées par la salle : projet de face (décimal), plongée du tunnel
 * (0 à 1) et bande verticale libre pour l'écran (fractions de la hauteur,
 * entre le titre et la légende).
 */
export type RoomDrive = { a: number; tunnel: number; band: { top: number; bottom: number } };

// Écran : 2,50 m de haut, centré à 1,70 m, à 4 m du visiteur.
const SCREEN_ANGLE = 2 * Math.atan(1.25 / 4);
const SCREEN_ELEV = Math.atan(0.1 / 4);

// Les dessins SVG ont un fond transparent : on les pose sur le fond sombre
// des écrans avant d'en faire une texture.
function onDark(tex: THREE.Texture) {
  const img = tex.image as HTMLImageElement;
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 840;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(640, 0, 0, 640, 0, 900);
  g.addColorStop(0, "#1c2410");
  g.addColorStop(1, "#10120e");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 64, 42, 1152, 756);
  return new THREE.CanvasTexture(canvas);
}

function Scene({
  images,
  drive,
  onPick,
}: {
  images: string[];
  drive: React.MutableRefObject<RoomDrive>;
  onPick: (i: number) => void;
}) {
  const gltf = useLoader(GLTFLoader, "/salle/salle.glb", (loader) => {
    const draco = new DRACOLoader();
    draco.setDecoderPath("/draco/");
    loader.setDRACOLoader(draco);
  });
  const textures = useLoader(THREE.TextureLoader, images);
  const group = useRef<THREE.Group>(null!);
  const current = useRef(drive.current.a);
  const { camera, size } = useThree();

  // Les écrans affichent la capture telle quelle (sans éclairage) ;
  // l'anneau du plafond devient la lumière blanc chaud prévue.
  const screens = useMemo(() => {
    const mats: THREE.MeshBasicMaterial[] = [];
    gltf.scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const m = /^screen_0(\d)$/.exec(mesh.name);
      if (m) {
        const i = Number(m[1]) - 1;
        const tex = images[i].endsWith(".svg") ? onDark(textures[i]) : textures[i];
        tex.flipY = false;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        // la salle est affichée en miroir (voir plus bas) : on remet l'image à l'endroit
        tex.wrapS = THREE.RepeatWrapping;
        tex.repeat.x = -1;
        tex.offset.x = 1;
        const mat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, side: THREE.DoubleSide });
        mesh.material = mat;
        mats[i] = mat;
      } else if (/^glass_0\d$/.test(mesh.name)) {
        // vitre presque invisible : sans reflet qui barre l'écran
        mesh.material = new THREE.MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.04, depthWrite: false, side: THREE.DoubleSide });
      } else if (mesh.name === "ceiling_ring") {
        mesh.material = new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffd9b0").multiplyScalar(0.55), toneMapped: false, side: THREE.DoubleSide });
      }
    });
    return mats;
  }, [gltf, textures, images]);

  // Cadrage : l'écran de face remplit la bande libre, sans toucher le texte.
  const pitch = useRef(0);
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const { top, bottom } = drive.current.band;
    const frac = Math.max(bottom - top, 0.2) * 0.9;
    const vfov = SCREEN_ANGLE / frac;
    cam.fov = THREE.MathUtils.radToDeg(THREE.MathUtils.clamp(vfov, 0.5, 1.6));
    cam.updateProjectionMatrix();
    // bande au-dessus du milieu : on baisse le regard pour remonter l'écran
    pitch.current = SCREEN_ELEV - (0.5 - (top + bottom) / 2) * vfov;
  }, [camera, size, drive]);

  useFrame(() => {
    const target = drive.current.a;
    current.current += (target - current.current) * 0.14;
    const a = current.current;
    group.current.rotation.y = a * STEP;
    screens.forEach((mat, i) => {
      if (mat) mat.color.setScalar(1 - Math.min(Math.abs(i - a), 1.5) * 0.5);
    });
    // Tunnel : la caméra plonge dans l'écran de face.
    const t = drive.current.tunnel;
    camera.position.set(0, EYE, -t * 3.7);
    camera.lookAt(0, EYE + Math.tan(pitch.current) * 4, -4);
  });

  const pick = (e: ThreeEvent<MouseEvent>) => {
    const m = /_0(\d)$/.exec(e.object.name);
    if (m) {
      e.stopPropagation();
      onPick(Number(m[1]) - 1);
    }
  };

  return (
    // Miroir horizontal : le projet suivant arrive par la droite (comme la flèche →).
    <group ref={group} scale={[-1, 1, 1]} onClick={pick}>
      <primitive object={gltf.scene} />
    </group>
  );
}

export default function Room3D({
  images,
  drive,
  onPick,
}: {
  images: string[];
  drive: React.MutableRefObject<RoomDrive>;
  onPick: (i: number) => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, EYE, 0], fov: 40, near: 0.05, far: 30 }}
      gl={{ antialias: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
      }}
    >
      <color attach="background" args={["#0a0b0a"]} />
      <fog attach="fog" args={["#0a0b0a", 5, 11]} />
      <ambientLight intensity={0.25} />
      {/* lueur lime qui monte du sol */}
      <pointLight position={[0, 0.15, 0]} color="#d4ff3a" intensity={6} distance={7} decay={1.6} />
      {/* lumière blanc chaud de l'anneau du plafond */}
      <pointLight position={[0, 4.0, -1.5]} color="#ffd9b0" intensity={4} distance={9} decay={1.4} />
      <Suspense fallback={null}>
        <Scene images={images} drive={drive} onPick={onPick} />
      </Suspense>
    </Canvas>
  );
}
