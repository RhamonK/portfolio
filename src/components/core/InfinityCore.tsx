"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { detectCoreTier, type CoreTier } from "@/lib/device";
import type { CoreScene } from "./scene";
import { POSTER_DOT, POSTER_STROKES, POSTER_VIEWBOX } from "./poster-path";

// INFINITY CORE dans la page.
// - Toujours : l'image fixe (rendue avec la même scène), servie dans le HTML.
// - Niveaux 2-3 : la 3D se charge après l'intro et remplace l'image à l'identique
//   (rotation lente, éclats de verre en orbite, inertie, onde de lumière).
// - Niveau 1 : l'image flotte, une impulsion SVG parcourt le trait.
// - Niveau 0 (mouvement réduit) : l'image seule.
// Intro : une pointe de lumière écrit la signature (SVG + étincelles en canvas 2D),
// fluide sur tous les appareils ; la 3D ne se charge qu'une fois l'intro finie.
// Interactions — desktop : la souris incline l'objet et écarte les éclats, glisser le
// fait tourner, cliquer lance une onde. Mobile : glisser le fait tourner avec inertie,
// toucher lance une onde, incliner le téléphone l'oriente (gyroscope).
// Le noyau n'est jamais nécessaire pour naviguer : il est décoratif (aria-hidden).

const [VB_W, VB_H] = POSTER_VIEWBOX.split(" ").slice(2).map(Number);

type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number };

/** Tracé séquentiel : chaque trait se dessine dans sa portion ; renvoie la position de la pointe. */
function applyTrace(svg: SVGSVGElement | null, p: number): [number, number] | null {
  if (!svg) return null;
  let tip: [number, number] | null = null;
  const n = POSTER_STROKES.length;
  svg.querySelectorAll<SVGPathElement>("path").forEach((path, i) => {
    const s = POSTER_STROKES[i % n];
    const local = Math.max(0, Math.min(1, (p - s.start) / s.len));
    path.style.strokeDashoffset = String(1 - local);
    path.style.opacity = local > 0 ? "1" : "0";
    if (i >= n && local > 0 && local < 1) {
      const len = path.getTotalLength();
      const pt = path.getPointAtLength(local * len);
      tip = [pt.x, pt.y];
    }
  });
  const seed = svg.querySelector<SVGCircleElement>("circle.seed");
  if (seed) seed.style.opacity = p <= 0.002 ? "1" : "0";
  const dot = svg.querySelector<SVGCircleElement>("circle.dot");
  if (dot) dot.style.opacity = p >= POSTER_DOT.start ? "1" : "0";
  return tip;
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
  /** Pendant le tracé de l'intro : verre qui se forme + tracé SVG piloté par setDraw. */
  tracing?: boolean;
  /** Tant que vrai, la 3D n'est pas chargée (pendant l'intro). */
  defer?: boolean;
};

export const InfinityCore = forwardRef<InfinityCoreHandle, Props>(function InfinityCore({ className = "", tracing = false, defer = false }, ref) {
  const box = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const traceSvg = useRef<SVGSVGElement | null>(null);
  const sparkCanvas = useRef<HTMLCanvasElement>(null);
  const pulseSvg = useRef<SVGSVGElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<CoreScene | null>(null);
  const draw = useRef(1);
  const tip = useRef<[number, number] | null>(null);
  const [tier, setTier] = useState<CoreTier | null>(null);
  const [live, setLive] = useState(false);
  const [waveKey, setWaveKey] = useState(0);
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
      tip.current = applyTrace(traceSvg.current, p);
      scene.current?.setDraw(p);
    },
  }));

  useEffect(() => setTier(detectCoreTier()), []);

  // ----- étincelles de la pointe de lumière (intro) : canvas 2D, quelques dizaines de points -----
  useEffect(() => {
    if (!tracing || !sparkCanvas.current) return;
    const c = sparkCanvas.current;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const fit = () => {
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
    };
    fit();
    const sparks: Spark[] = [];
    let raf = 0;
    let last = performance.now();
    let prev: [number, number] | null = null;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const sx = c.width / VB_W;
      const sy = c.height / VB_H;
      const k = Math.min(sx, sy);
      // l'image est en object-contain : même mise à l'échelle et centrage que le SVG
      const ox = (c.width - VB_W * k) / 2;
      const oy = (c.height - VB_H * k) / 2;
      const t = tip.current;
      if (t && tracing) {
        const x = ox + t[0] * k;
        const y = oy + t[1] * k;
        const speed = prev ? Math.hypot(x - prev[0], y - prev[1]) : 0;
        const emit = Math.min(6, 1 + Math.floor(speed / 3));
        for (let i = 0; i < emit; i++) {
          const a = Math.random() * Math.PI * 2;
          const v = (20 + Math.random() * 60) * dpr;
          sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 10 * dpr, life: 0, max: 0.35 + Math.random() * 0.5, r: (0.6 + Math.random() * 1.4) * dpr });
        }
        prev = [x, y];
      } else prev = null;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.globalCompositeOperation = "lighter";
      // pointe : halo doux
      if (t && tracing) {
        const x = ox + t[0] * k;
        const y = oy + t[1] * k;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 26 * dpr);
        g.addColorStop(0, "rgba(255,255,240,0.95)");
        g.addColorStop(0.18, "rgba(212,255,58,0.65)");
        g.addColorStop(1, "rgba(212,255,58,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 26 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += dt;
        if (s.life >= s.max) {
          sparks.splice(i, 1);
          continue;
        }
        s.vx *= 0.94;
        s.vy = s.vy * 0.94 + 30 * dpr * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const a = 1 - s.life / s.max;
        ctx.fillStyle = `rgba(212,255,58,${a * 0.9})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * a + 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!tracing && sparks.length === 0) cancelAnimationFrame(raf);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [tracing]);

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

  // ----- interactions (tous niveaux sauf mouvement réduit) -----
  useEffect(() => {
    if (tier === null || tier === 0 || showTrace || !box.current) return;
    const el = box.current;
    const fine = window.matchMedia("(pointer: fine)").matches;
    // inclinaison CSS : donne du relief à l'image fixe (la 3D gère la sienne)
    const cur = { x: 0, y: 0 };
    const goal = { x: 0, y: 0 };
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      cur.x += (goal.x - cur.x) * 0.08;
      cur.y += (goal.y - cur.y) * 0.08;
      scene.current?.setPointer(cur.x, cur.y);
      if (tilt.current && !scene.current) tilt.current.style.transform = `rotateY(${cur.x * 9}deg) rotateX(${-cur.y * 7}deg)`;
    };
    raf = requestAnimationFrame(loop);

    const wave = () => {
      scene.current?.wave();
      setWaveKey((k) => k + 1);
    };

    // glisser (souris ou doigt) : rotation avec inertie ; un geste court = onde de lumière
    let drag: { x: number; t: number; x0: number; t0: number; id: number } | null = null;
    const onDown = (e: PointerEvent) => {
      drag = { x: e.clientX, t: e.timeStamp, x0: e.clientX, t0: e.timeStamp, id: e.pointerId };
      scene.current?.setPointerActive(true);
    };
    const onMoveDrag = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      const dt = Math.max(8, e.timeStamp - drag.t);
      scene.current?.spin(((dx / el.clientWidth) * 3.2 * 1000) / dt / 6);
      if (!fine) {
        // doigt : les éclats suivent le point de contact
        const r = el.getBoundingClientRect();
        goal.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        goal.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      }
      drag.x = e.clientX;
      drag.t = e.timeStamp;
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const moved = Math.abs(e.clientX - drag.x0);
      if (moved < 6 && e.timeStamp - drag.t0 < 350) wave();
      drag = null;
      if (!fine) {
        scene.current?.setPointerActive(false);
        if (!gyro) goal.x = goal.y = 0;
      }
    };

    // desktop : la souris dans toute la page incline l'objet et écarte les éclats
    const onMouse = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      goal.x = Math.max(-1, Math.min(1, ((e.clientX - (r.left + r.width / 2)) / r.width) * 2));
      goal.y = Math.max(-1, Math.min(1, ((e.clientY - (r.top + r.height / 2)) / r.height) * 2));
      scene.current?.setPointerActive(e.clientY > r.top - 80 && e.clientY < r.bottom + 80);
    };

    // mobile : gyroscope (sur iPhone, l'autorisation est demandée au premier toucher du noyau)
    let gyro = false;
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null || drag) return;
      gyro = true;
      goal.x = Math.max(-1, Math.min(1, e.gamma / 25));
      goal.y = Math.max(-1, Math.min(1, (e.beta - 50) / 25));
    };
    type IOSOrientation = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> };
    const DOE = (typeof DeviceOrientationEvent !== "undefined" ? DeviceOrientationEvent : undefined) as IOSOrientation | undefined;
    let asked = false;
    const askGyro = () => {
      if (asked || !DOE?.requestPermission) return;
      asked = true;
      DOE.requestPermission()
        .then((s) => s === "granted" && window.addEventListener("deviceorientation", onOrient))
        .catch(() => {});
    };
    if (!fine && DOE && !DOE.requestPermission) window.addEventListener("deviceorientation", onOrient);

    el.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointermove", onMoveDrag, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    if (fine) window.addEventListener("pointermove", onMouse, { passive: true });
    else el.addEventListener("touchend", askGyro, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMoveDrag);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("pointermove", onMouse);
      el.removeEventListener("touchend", askGyro);
      window.removeEventListener("deviceorientation", onOrient);
      if (tilt.current) tilt.current.style.transform = "";
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

    return () => {
      disposed = true;
      cancelIdle(id);
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
      scene.current?.dispose();
      scene.current = null;
    };
  }, [tier, defer]);

  const mode = live ? "webgl" : tier === 1 ? "svg" : "image";

  return (
    <div ref={box} aria-hidden data-core={mode} className={`core-box relative aspect-[4/3] touch-pan-y select-none ${className}`}>
      <div ref={tilt} className={`core-tilt absolute inset-0 ${tier === 1 && !showTrace ? "core-float" : ""}`}>
        {/* verre seul : il « se forme » pendant l'intro (classe « intro » posée avant l'affichage) */}
        <img
          src="/core/verre-1040.webp"
          srcSet="/core/verre-640.webp 640w, /core/verre-1040.webp 1040w, /core/verre-1600.webp 1600w"
          sizes="(min-width: 768px) 50vw, 100vw"
          width={1600}
          height={1200}
          alt=""
          decoding="async"
          draggable={false}
          className="core-glass absolute inset-0 h-full w-full object-contain"
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
          className={`core-full absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${tracing ? "!opacity-0" : ""}`}
        />
        {showTrace && (
          <svg
            ref={(el) => {
              traceSvg.current = el;
              tip.current = applyTrace(el, draw.current);
            }}
            viewBox={POSTER_VIEWBOX}
            className={`core-trace absolute inset-0 h-full w-full transition-opacity duration-700 ${tracing ? "" : "opacity-0"}`}
          >
            {/* point de départ : il respire avant que la pointe ne parte */}
            <circle className="seed" cx={0} cy={0} r={9} style={{ transform: `translate(${seedPoint()[0]}px, ${seedPoint()[1]}px)` }} />
            {/* halo (trait large et transparent) puis trait principal : pas de filtre coûteux */}
            {[...POSTER_STROKES, ...POSTER_STROKES].map((s, i) => (
              <path key={i} d={s.d} pathLength={1} className={i < POSTER_STROKES.length ? "glow" : undefined} />
            ))}
            <circle className="dot" cx={POSTER_DOT.cx} cy={POSTER_DOT.cy} r={POSTER_DOT.r} />
          </svg>
        )}
        {tracing && <canvas ref={sparkCanvas} className="pointer-events-none absolute inset-0 h-full w-full" />}
        {tier === 1 && !showTrace && (
          <svg ref={pulseSvg} viewBox={POSTER_VIEWBOX} className="core-pulse absolute inset-0 h-full w-full">
            {/* une seule impulsion parcourt la signature, trait après trait (halo + trait principal) */}
            {[...POSTER_STROKES, ...POSTER_STROKES].map((s, i) => (
              <path key={i} d={s.d} pathLength={1} className={i < POSTER_STROKES.length ? "glow" : undefined} />
            ))}
          </svg>
        )}
        {/* onde au toucher (image fixe) : la signature s'illumine d'un coup */}
        {!live && waveKey > 0 && (
          <svg key={waveKey} viewBox={POSTER_VIEWBOX} className="core-wave absolute inset-0 h-full w-full">
            {POSTER_STROKES.map((s, i) => (
              <path key={i} d={s.d} pathLength={1} />
            ))}
          </svg>
        )}
        {tier !== null && tier >= 2 && (
          <canvas ref={canvas} className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`} />
        )}
      </div>
    </div>
  );
});

/** Premier point du premier trait (point de départ de la pointe de lumière). */
function seedPoint(): [number, number] {
  const m = /M\s*([-\d.]+)[ ,]([-\d.]+)/.exec(POSTER_STROKES[0].d);
  return m ? [Number(m[1]), Number(m[2])] : [VB_W / 2, VB_H / 2];
}
