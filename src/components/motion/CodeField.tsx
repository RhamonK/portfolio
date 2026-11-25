"use client";

import { useEffect, useRef } from "react";
import { palette } from "@/lib/palette";

// Fond du Hero : un tunnel de code. Des 0 et des 1, et quelques mots de la stack,
// sortent du point de fuite (derrière INFINITY CORE) et filent vers le visiteur.
// Canvas 2D, décoratif (aria-hidden) :
// - s'arrête hors de l'écran et quand l'onglet est caché ;
// - moins de glyphes sur téléphone, résolution plafonnée ;
// - mouvement réduit : une seule image fixe.

const BITS = ["0", "1", "0", "1", "01", "10", "0", "1"];
const WORDS = ["<div>", "SELECT", "fetch()", "POST /api", "useState", "await", "=>", "{ }", "JSON", "agent()", "n8n", "INSERT", "200 OK"];

type Glyph = { a: number; z: number; s: string; lime: boolean; word: boolean };

export function CodeField({ anchor }: { anchor: React.RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    const count = narrow ? 70 : 150;
    const fresh = (z = 1): Glyph => {
      const word = Math.random() < 0.12;
      return {
        a: Math.random() * Math.PI * 2,
        z: z * (0.15 + Math.random() * 0.85),
        s: word ? WORDS[(Math.random() * WORDS.length) | 0] : BITS[(Math.random() * BITS.length) | 0],
        lime: Math.random() < 0.22,
        word,
      };
    };
    const glyphs: Glyph[] = Array.from({ length: count }, () => fresh(1));

    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // point de fuite : le centre du noyau
      const c = anchor.current?.getBoundingClientRect();
      cx = c ? c.left + c.width / 2 - r.left : w / 2;
      cy = c ? c.top + c.height / 2 - r.top : h / 2;
      if (reduced) draw(0);
    };

    const reach = () => Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy));
    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      const R = reach();
      for (let i = 0; i < glyphs.length; i++) {
        const g = glyphs[i];
        g.z -= dt * 0.11;
        if (g.z <= 0.02) {
          glyphs[i] = fresh(1);
          continue;
        }
        // projection : plus z est petit, plus le glyphe est loin du centre et grand
        const d = (0.06 / g.z) * R;
        const x = cx + Math.cos(g.a) * d;
        const y = cy + Math.sin(g.a) * d * 0.82;
        if (x < -80 || x > w + 80 || y < -40 || y > h + 40) {
          glyphs[i] = fresh(1);
          continue;
        }
        const near = 1 - g.z; // 0 au fond, 1 tout près
        const size = (g.word ? 9 : 10) + near * near * (g.word ? 18 : 26);
        // apparaît au fond, s'éteint près des bords pour ne pas gêner le texte
        const alpha = Math.min(1, near * 2.2) * (1 - Math.min(1, d / R) * 0.65) * (g.lime ? 0.5 : 0.22);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = g.lime ? palette.lime : palette.text;
        ctx.font = `${g.word ? 500 : 400} ${size.toFixed(1)}px ui-monospace, "JetBrains Mono", monospace`;
        ctx.fillText(g.s, x, y);
      }
      ctx.globalAlpha = 1;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (anchor.current) ro.observe(anchor.current);
    if (reduced) return () => ro.disconnect();

    let raf = 0;
    let last = 0;
    let visible = true;
    const loop = (t: number) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
      last = t;
      draw(dt);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf && visible && !document.hidden) {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    start();
    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [anchor]);

  return <canvas ref={ref} aria-hidden className="code-field pointer-events-none absolute inset-0 z-0 h-full w-full" />;
}
