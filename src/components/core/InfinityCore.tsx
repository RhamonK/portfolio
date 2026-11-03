"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { detectCoreTier, type CoreTier } from "@/lib/device";
import type { CoreScene } from "./scene";
import { POSTER_DOT, POSTER_STROKES, POSTER_VIEWBOX } from "./poster-path";

// INFINITY CORE dans la page.
// - Toujours : l'image fixe (rendue avec la même scène), servie dans le HTML.
// - Niveaux 2-3 : la 3D se charge après l'affichage et remplace l'image à l'identique.
// - Niveau 1 : une impulsion de lumière en SVG parcourt le trait de l'image.
// - Niveau 0 (mouvement réduit) : l'image seule.
// Pendant l'intro, le tracé est dessiné en SVG sur l'image du verre seul : il reste
// fluide sur tous les appareils, et la 3D ne se charge qu'une fois l'intro finie.
// Le noyau n'est jamais nécessaire pour naviguer : il est décoratif (aria-hidden).

/** Tracé séquentiel de l'intro : chaque trait se dessine dans sa portion de la progression. */
function applyTrace(svg: SVGSVGElement | null, p: number) {
  if (!svg) return;
  svg.querySelectorAll("path").forEach((path, i) => {
    const s = POSTER_STROKES[i % POSTER_STROKES.length];
    const local = Math.max(0, Math.min(1, (p - s.start) / s.len));
    path.style.strokeDashoffset = String(1 - local);
    path.style.opacity = local > 0 ? "1" : "0";
  });
  const dot = svg.querySelector("circle");
  if (dot) dot.style.opacity = p >= POSTER_DOT.start ? "1" : "0";
}

/** Impulsion SVG (niveau léger) : une seule impulsion parcourt la signature, même vitesse que la 3D. */
const PULSE_PERIOD = 9000;
const PULSE_DASH = 0.08;

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
  const traceSvg = useRef<SVGSVGElement | null>(null);
  const pulseSvg = useRef<SVGSVGElement>(null);
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
      applyTrace(traceSvg.current, p);
      scene.current?.setDraw(p);
    },
  }));

  useEffect(() => setTier(detectCoreTier()), []);

  // ----- impulsion SVG (niveau 1) : 30 images / s au plus, seulement quand le noyau est visible -----
  useEffect(() => {
    if (tier !== 1 || showTrace || !pulseSvg.current || !box.current) return;
    const paths = [...pulseSvg.current.querySelectorAll("path")];
    let raf = 0;
    let last = 0;
    let visible = true;
    const t0 = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || now - last < 33) return;
      last = now;
      const g = ((now - t0) % PULSE_PERIOD) / PULSE_PERIOD;
      paths.forEach((path, i) => {
        const s = POSTER_STROKES[i % POSTER_STROKES.length];
        const local = (g - s.start) / s.len;
        const on = local >= -PULSE_DASH && local <= 1;
        path.style.opacity = on ? "1" : "0";
        if (on) path.style.strokeDashoffset = String(-local);
      });
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(box.current);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [tier, showTrace]);

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
      {/* verre seul : visible pendant l'intro (classe « intro » posée avant l'affichage, puis état du tracé) */}
      <img
        src="/core/verre-1040.webp"
        srcSet="/core/verre-640.webp 640w, /core/verre-1040.webp 1040w, /core/verre-1600.webp 1600w"
        sizes="(min-width: 768px) 50vw, 100vw"
        width={1600}
        height={1200}
        alt=""
        decoding="async"
        draggable={false}
        className={`core-glass absolute inset-0 h-full w-full object-contain ${showTrace ? "!opacity-100" : ""}`}
      />
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
        className={`core-full absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${tracing ? "!opacity-0" : ""}`}
      />
      {showTrace && (
        <svg ref={(el) => { traceSvg.current = el; applyTrace(el, draw.current); }} viewBox={POSTER_VIEWBOX} className="core-trace absolute inset-0 h-full w-full">
          {/* halo (trait large et transparent) puis trait principal : pas de filtre coûteux */}
          {[...POSTER_STROKES, ...POSTER_STROKES].map((s, i) => (
            <path key={i} d={s.d} pathLength={1} className={i < POSTER_STROKES.length ? "glow" : undefined} />
          ))}
          <circle cx={POSTER_DOT.cx} cy={POSTER_DOT.cy} r={POSTER_DOT.r} />
        </svg>
      )}
      {tier === 1 && !showTrace && (
        <svg ref={pulseSvg} viewBox={POSTER_VIEWBOX} className="core-pulse absolute inset-0 h-full w-full">
          {/* une seule impulsion parcourt la signature, trait après trait (halo + trait principal) */}
          {[...POSTER_STROKES, ...POSTER_STROKES].map((s, i) => (
            <path key={i} d={s.d} pathLength={1} className={i < POSTER_STROKES.length ? "glow" : undefined} />
          ))}
        </svg>
      )}
      {tier !== null && tier >= 2 && (
        <canvas ref={canvas} className={`absolute inset-0 h-full w-full ${live ? "opacity-100" : "opacity-0"}`} />
      )}
    </div>
  );
});
