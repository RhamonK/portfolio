"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import type { PresenterSignals } from "@/components/presentation/signals";

// Présentateur — phase 2 : le personnage modélisé dans Blender
// (public/presenter/presenter.glb, voir docs/prompt-blender-presentateur.md).
// Noms attendus : os `head`, formes `mouthOpen` / `blink` / `mouthSmile`,
// actions `idle`, `talk`, `point`, `wave`.

export const PRESENTER_URL = "/presenter/presenter.glb";

const lerp = THREE.MathUtils.lerp;

export function PresenterModel({
  signals,
  inRoom = false,
}: {
  signals: React.MutableRefObject<PresenterSignals>;
  /** Placé dans la salle : la scène gère la caméra elle-même. */
  inRoom?: boolean;
}) {
  const gltf = useLoader(GLTFLoader, PRESENTER_URL, (loader) => {
    const draco = new DRACOLoader();
    draco.setDecoderPath("/draco/");
    loader.setDRACOLoader(draco);
  });
  const { camera } = useThree();

  const rig = useMemo(() => {
    const mixer = new THREE.AnimationMixer(gltf.scene);
    const clip = (name: string) => {
      const c = THREE.AnimationClip.findByName(gltf.animations, name);
      return c ? mixer.clipAction(c) : null;
    };
    const faces: THREE.Mesh[] = [];
    gltf.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.morphTargetDictionary) faces.push(m);
      if (m.isMesh) m.frustumCulled = false;
    });
    const head = gltf.scene.getObjectByName("head") ?? null;
    // la tête est-elle animée par une action ? sinon on part de sa pose de repos
    const headAnimated = gltf.animations.some((a) => a.tracks.some((tr) => tr.name.startsWith("head.")));
    return {
      mixer,
      headAnimated,
      headRest: head ? head.rotation.clone() : null,
      idle: clip("idle"),
      talk: clip("talk"),
      point: clip("point"),
      head,
      faces,
    };
  }, [gltf]);

  // Cadrage buste, de face ; le personnage regarde la caméra (+Z).
  useEffect(() => {
    if (!inRoom) {
      const cam = camera as THREE.PerspectiveCamera;
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const h = box.max.y - box.min.y || 1.75;
      cam.position.set(0, h * 0.8, h * 1.35);
      cam.fov = 30;
      cam.lookAt(0, h * 0.78, 0);
      cam.updateProjectionMatrix();
    }

    const { idle, talk, point } = rig;
    idle?.play();
    if (talk) {
      talk.play();
      talk.setEffectiveWeight(0);
    }
    if (point) {
      point.setLoop(THREE.LoopOnce, 1);
      point.clampWhenFinished = true;
    }
    return () => {
      rig.mixer.stopAllAction();
    };
  }, [camera, gltf, rig, inRoom]);

  const state = useRef({ talk: 0, pointing: false, blinkNext: 2.5, blinkUntil: 0 });
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((frame, dt) => {
    const s = signals.current;
    const st = state.current;
    const t = frame.clock.elapsedTime;

    // parole : fondu idle → talk tant que la voix (ou le rythme de lecture) est active
    st.talk = lerp(st.talk, s.speaking > 0.05 ? 1 : 0, 0.08);
    rig.talk?.setEffectiveWeight(st.talk);
    rig.idle?.setEffectiveWeight(1 - st.talk * 0.7);

    // pointer : joué en avant pour lever le bâton, en arrière pour revenir
    if (rig.point && s.pointing !== st.pointing) {
      st.pointing = s.pointing;
      rig.point.paused = false;
      rig.point.timeScale = s.pointing ? 1 : -1;
      if (s.pointing) rig.point.reset();
      rig.point.play();
    }

    rig.mixer.update(s.still ? 0 : dt);

    // la tête suit un peu la souris, sans jamais se détourner
    if (rig.head && rig.headRest) {
      if (!rig.headAnimated) rig.head.rotation.copy(rig.headRest);
      rig.head.rotation.y += s.mouse.x * 0.35;
      rig.head.rotation.x += s.mouse.y * 0.15;
    }

    // bouche pilotée par la voix, clignement des yeux
    if (t > st.blinkNext) {
      st.blinkUntil = t + 0.12;
      st.blinkNext = t + 2.5 + Math.random() * 3;
    }
    for (const m of rig.faces) {
      const dict = m.morphTargetDictionary!;
      const inf = m.morphTargetInfluences!;
      if (dict.mouthOpen !== undefined) inf[dict.mouthOpen] = lerp(inf[dict.mouthOpen], s.speaking, 0.35);
      if (dict.blink !== undefined) inf[dict.blink] = lerp(inf[dict.blink], t < st.blinkUntil ? 1 : 0, 0.5);
    }

    // position de la bouche à l'écran, pour que les mots-clés tombent au bon endroit
    if (rig.head) {
      rig.head.getWorldPosition(tmp);
      tmp.y -= 0.05;
      tmp.project(camera);
      s.mouthY = THREE.MathUtils.clamp((1 - tmp.y) / 2, 0.05, 0.95);
      s.mouthX = THREE.MathUtils.clamp((tmp.x + 1) / 2, 0.05, 0.95);
    }
  });

  return <primitive object={gltf.scene} />;
}
