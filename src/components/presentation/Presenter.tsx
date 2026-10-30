"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { PresenterSignals } from "@/components/presentation/signals";

// Présentateur — phase 1 : silhouette 3D stylée, toujours de face.
// Yeux lime lumineux, bâton de présentation dans la main droite.
// Phase 2 : un modèle GLB ressemblant remplacera cette silhouette.

const LIME = "#d4ff3a";
const lerp = THREE.MathUtils.lerp;

function Figure({ signals }: { signals: React.MutableRefObject<PresenterSignals> }) {
  const root = useRef<THREE.Group>(null!);
  const head = useRef<THREE.Group>(null!);
  const eyes = useRef<THREE.Group>(null!);
  const mouth = useRef<THREE.Mesh>(null!);
  const armR = useRef<THREE.Group>(null!);
  const armL = useRef<THREE.Group>(null!);
  const blink = useRef({ next: 2.5, until: 0 });
  const point = useRef(0);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const s = signals.current;
    const move = s.still ? 0 : 1;

    // léger balancement
    root.current.rotation.z = Math.sin(t * 0.8) * 0.025 * move;
    root.current.position.y = -0.12 + Math.sin(t * 1.6) * 0.015 * move;

    // la tête suit un peu la souris, sans jamais tourner le dos
    head.current.rotation.y = lerp(head.current.rotation.y, s.mouse.x * 0.3, 0.08);
    head.current.rotation.x = lerp(head.current.rotation.x, -s.mouse.y * 0.18, 0.08);

    // clignement des yeux
    if (t > blink.current.next) {
      blink.current.until = t + 0.12;
      blink.current.next = t + 2.5 + Math.random() * 3;
    }
    eyes.current.scale.y = lerp(eyes.current.scale.y, t < blink.current.until ? 0.08 : 1, 0.5);

    // bouche pilotée par la voix
    mouth.current.scale.y = lerp(mouth.current.scale.y, 0.25 + s.speaking * 3.2, 0.35);

    // bras droit (côté diapo) : lève le bâton vers la diapo
    point.current = lerp(point.current, s.pointing ? 1 : 0, 0.07);
    armR.current.rotation.z = -0.22 - point.current * 1.75;
    armR.current.rotation.x = -point.current * 0.25;

    // bras gauche : gestes mesurés quand il parle
    armL.current.rotation.z = 0.22 + (Math.sin(t * 1.3) * 0.04 + s.speaking * 0.25 * Math.sin(t * 5)) * move;
  });

  const body = (
    <meshStandardMaterial color="#202320" roughness={0.42} metalness={0.55} />
  );
  const glow = <meshBasicMaterial color={LIME} toneMapped={false} />;

  return (
    <group ref={root}>
      {/* buste */}
      <mesh position={[0, -0.72, 0]}>
        <capsuleGeometry args={[0.42, 0.6, 8, 24]} />
        {body}
      </mesh>
      {/* col lime */}
      <mesh position={[0, -0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.17, 0.018, 8, 32]} />
        {glow}
      </mesh>

      {/* tête */}
      <group ref={head} position={[0, 0.3, 0]}>
        <mesh>
          <sphereGeometry args={[0.36, 32, 32]} />
          {body}
        </mesh>
        <group ref={eyes} position={[0, 0.05, 0.31]}>
          <mesh position={[-0.12, 0, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            {glow}
          </mesh>
          <mesh position={[0.12, 0, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            {glow}
          </mesh>
        </group>
        <mesh ref={mouth} position={[0, -0.13, 0.33]}>
          <boxGeometry args={[0.14, 0.03, 0.02]} />
          {glow}
        </mesh>
      </group>

      {/* bras droit + bâton (à gauche de l'écran, côté diapo) */}
      <group ref={armR} position={[-0.5, -0.3, 0]}>
        <mesh position={[0, -0.32, 0]}>
          <capsuleGeometry args={[0.09, 0.45, 6, 16]} />
          {body}
        </mesh>
        <mesh position={[0, -0.95, 0.04]}>
          <cylinderGeometry args={[0.014, 0.014, 0.8, 8]} />
          <meshStandardMaterial color="#c9ccc2" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, -1.37, 0.04]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          {glow}
        </mesh>
      </group>

      {/* bras gauche */}
      <group ref={armL} position={[0.5, -0.3, 0]}>
        <mesh position={[0, -0.32, 0]}>
          <capsuleGeometry args={[0.09, 0.45, 6, 16]} />
          {body}
        </mesh>
      </group>
    </group>
  );
}

export default function Presenter({ signals }: { signals: React.MutableRefObject<PresenterSignals> }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.3], fov: 35 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 3, 4]} intensity={1.6} color="#f2f3ee" />
      {/* lumière lime qui monte du sol + liseré lime derrière */}
      <pointLight position={[0, -2.2, 1.4]} color={LIME} intensity={1.6} distance={5} />
      <directionalLight position={[-3, 1.5, -3]} color={LIME} intensity={1.4} />
      <directionalLight position={[3, 1, -3]} color={LIME} intensity={0.8} />
      <Figure signals={signals} />
    </Canvas>
  );
}
