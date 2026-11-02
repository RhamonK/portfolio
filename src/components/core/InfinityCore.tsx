"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { detectCoreTier, type CoreTier } from "@/lib/device";
import type { CoreScene } from "./scene";
import { POSTER_PATH, POSTER_VIEWBOX } from "./poster-path";

// INFINITY CORE dans la page.
// - Toujours : l'image fixe (rendue avec la même scène), servie dans le HTML.
// - Niveaux 2-3 : la 3D se charge après l'affichage et remplace l'image à l'identique.
// - Niveau 1 : une impulsion de lumière en SVG parcourt le trait de l'image.
// - Niveau 0 (mouvement réduit) : l'image seule.
// Pendant l'intro, le tracé est dessiné en SVG sur l'image du verre seul : il reste
// fluide sur tous les appareils, et la 3D ne se charge qu'une fois l'intro finie.
// Le noyau n'est jamais nécessaire pour naviguer : il est décoratif (aria-hidden).

export type InfinityCoreHandle = {
  /** Part du trait tracée, de 0 à 1 (intro). */
  setDraw: (p: number) => void;
};

type Props = {
  className?: string;
  /** Pendant le tracé de l'intro : verre seul + tracé SVG piloté par setDraw. */
  tracing?: boolean;
  /** Tant que vrai, la 3D n'est pas chargée (pendant l'intro). */
  defer?: boolean;
};

export const InfinityCore = forwardRef<InfinityCoreHandle, Props>(function InfinityCore({ className = "", tracing = false, defer = false }, ref) {
  const box = useRef<HTMLDivElement>(null);
  const tracePath = useRef<SVGPathElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<CoreScene | null>(null);
  const draw = useRef(1);
  const [tier, setTier] = useState<CoreTier | null>(null);
  const [live, setLive] = useState(false);
  // après le tracé : le SVG reste par-dessus le temps que l'image complète apparaisse (fondu sans creux)
  const [hold, setHold] = useState(false);
  const wasTracing = useRef(false);
  useEffect(() => {
    if (wasTracing.current && !tracing) {
      setHold(true);
      const id = window.setTimeout(() => setHold(false), 600);
      wasTracing.current = false;
      return () => window.clearTimeout(id);
    }
    wasTracing.current = tracing;
  }, [tracing]);
  const showTrace = tracing || hold;

  useImperativeHandle(ref, () => ({
    setDraw: (p) => {
      draw.current = p;
      if (tracePath.current) tracePath.current.style.strokeDashoffset = String(1 - p);
      scene.current?.setDraw(p);
    },
  }));

  useEffect(() => setTier(detectCoreTier()), []);

  // ----- 3D (niveaux 2 et 3) -----
  useEffect(() => {
    if (tier === null || tier < 2 || defer || !canvas.current || !box.current) return;
    let disposed = false;
    let visible = true;
    const el = box.current;

    const update = () => scene.current?.setRunning(visible && !document.hidden);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      update();
    });
    document.addEventListener("visibilitychange", update);

    const start = () =>
      import("./scene").then(({ createCoreScene }) => {
        if (disposed || !canvas.current) return;
        scene.current = createCoreScene({
          canvas: canvas.current,
          quality: tier === 3 ? "high" : "medium",
          motion: true,
          onReady: () => !disposed && setLive(true),
          // l'appareil ne suit pas : retour à l'image fixe animée en SVG
          onSlow: () => {
            scene.current?.dispose();
            scene.current = null;
            if (!disposed) {
              setLive(false);
              setTier(1);
            }
          },
        });
        scene.current.setDraw(draw.current);
        io.observe(el);
        update();
      });

    // après l'affichage du contenu, pour ne pas retarder le premier rendu
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 120));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => void start(), { timeout: 900 });

    // pointeur : souris sur toute la fenêtre (desktop), glisser horizontal sur le noyau (tactile)
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      scene.current?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    let dragX: number | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") dragX = e.clientX;
    };
    const onDrag = (e: PointerEvent) => {
      if (dragX === null) return;
      const dx = (e.clientX - dragX) / el.clientWidth;
      scene.current?.setPointer(Math.max(-1, Math.min(1, dx * 2.5)), 0);
    };
    const onUp = () => {
      dragX = null;
      scene.current?.setPointer(0, 0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerdown", onDown, { passive: true });
    el.addEventListener("pointermove", onDrag, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });

    return () => {
      disposed = true;
      cancelIdle(id);
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onDrag);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      scene.current?.dispose();
      scene.current = null;
    };
  }, [tier, defer]);

  const mode = live ? "webgl" : tier === 1 ? "svg" : "image";

  return (
    <div ref={box} aria-hidden data-core={mode} className={`relative aspect-[4/3] touch-pan-y select-none ${className}`}>
      {showTrace && (
        <img
          src="/core/verre-1040.webp"
          srcSet="/core/verre-640.webp 640w, /core/verre-1040.webp 1040w, /core/verre-1600.webp 1600w"
          sizes="(min-width: 768px) 50vw, 100vw"
          width={1600}
          height={1200}
          alt=""
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain"
        />
      )}
      <img
        src="/core/signature-1040.webp"
        srcSet="/core/signature-640.webp 640w, /core/signature-1040.webp 1040w, /core/signature-1600.webp 1600w"
        sizes="(min-width: 768px) 50vw, 100vw"
        width={1600}
        height={1200}
        alt=""
        {...{ fetchpriority: "high" }}
        decoding="async"
        draggable={false}
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${tracing ? "opacity-0" : "opacity-100"}`}
      />
      {showTrace && (
        <svg viewBox={POSTER_VIEWBOX} className="core-trace absolute inset-0 h-full w-full">
          <path ref={tracePath} d={POSTER_PATH} pathLength={1} style={{ strokeDashoffset: 1 - draw.current }} />
        </svg>
      )}
      {tier === 1 && !showTrace && (
        <svg viewBox={POSTER_VIEWBOX} className="core-pulse absolute inset-0 h-full w-full">
          <path d={POSTER_PATH} pathLength={1} />
        </svg>
      )}
      {tier !== null && tier >= 2 && (
        <canvas ref={canvas} className={`absolute inset-0 h-full w-full ${live ? "opacity-100" : "opacity-0"}`} />
      )}
    </div>
  );
});
