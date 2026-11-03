"use client";

import { useEffect, useRef } from "react";
import { palette } from "@/lib/palette";
import { projects } from "@/data/projects";
import type { Lang } from "@/i18n";

// « Le passage » — entre l'accueil et la salle des projets.
// Le fil lime descend du noyau, puis se projette : deux pointes de lumière dessinent
// un grand écran, qui s'allume sur une salle d'exposition des vrais projets (captures
// encadrées, spots, cimaise courbe) ; la caméra avance et plonge dans l'écran, qui
// devient la salle des projets.
// La fin de la zone chevauche le haut de la section Projets (marge négative) : le titre de
// la salle monte par-dessus l'écran allumé, comme si on y entrait.
// Défilement naturel : une zone haute avec un cadre collant (position: sticky), dessinée
// en canvas 2D d'après la progression du défilement, lissée. Décoratif (aria-hidden) ;
// absent sans JavaScript et en mouvement réduit (hauteur nulle, voir globals.css).

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function Passage({ lang }: { lang: Lang }) {
  const zone = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = zone.current;
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!el || !c || !ctx) return;
    const lime = palette.lime;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    let W = 0;
    let H = 0;
    const fit = () => {
      W = c.clientWidth;
      H = c.clientHeight;
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
    };
    fit();

    // progression brute (défilement) et lissée (rendu) : le mouvement reste posé
    let target = 0;
    let shown = -1;
    let visible = false;
    let raf = 0;
    let t0 = performance.now();

    const measure = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 quand la zone entre par le bas de l'écran, 1 quand son bas atteint le bas de l'écran
      target = clamp((vh - r.top) / (r.height));
      visible = r.top < vh && r.bottom > 0;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    };

    // ----- l'écran projeté : une salle d'exposition miniature des vrais projets -----
    const FAR = 3.4; // profondeur de l'écran
    const project = (x: number, y: number, z: number, cam: number, f: number) => {
      const d = Math.max(0.05, z - cam);
      return [W / 2 + (x / d) * f, H / 2 + (y / d) * f] as const;
    };
    // captures réelles des projets (variantes légères), chargées à l'approche
    const shots = projects
      .map((pr) => pr.image)
      .filter((src): src is string => !!src)
      .map((src) => {
        const img = new Image();
        img.decoding = "async";
        img.src = src.endsWith(".webp") ? src.replace(/\.webp$/, "-720.webp") : src;
        return img;
      });

    const line = (pts: readonly (readonly [number, number])[], width: number, color: string, alpha: number) => {
      if (alpha <= 0.002 || pts.length < 2) return;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
    };
    /** Trait lumineux : halo large et transparent + cœur fin (sans filtre coûteux). */
    const glowLine = (pts: readonly (readonly [number, number])[], w: number, alpha: number) => {
      line(pts, w * 6, lime, alpha * 0.12);
      line(pts, w * 2.2, lime, alpha * 0.35);
      line(pts, w, "#f4ffd0", alpha);
    };
    const head = (x: number, y: number, r: number, alpha: number) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(255,255,240,${0.95 * alpha})`);
      g.addColorStop(0.25, `rgba(212,255,58,${0.6 * alpha})`);
      g.addColorStop(1, "rgba(212,255,58,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };
    /** Partie d'une polyligne, de 0 à t (longueur). */
    const partial = (pts: [number, number][], t: number) => {
      const lens = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
      let left = lens.reduce((x, y) => x + y, 0) * t;
      const out: [number, number][] = [pts[0]];
      for (let i = 0; i < lens.length; i++) {
        if (left >= lens[i]) {
          out.push(pts[i + 1]);
          left -= lens[i];
        } else {
          const k = left / lens[i];
          out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]);
          break;
        }
      }
      return out;
    };

    /** La salle d'exposition, dessinée dans le rectangle de l'écran (x, y, w, h). */
    const gallery = (x: number, y: number, w: number, h: number, a: number, now: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
      // mur et sol
      const wall = ctx.createLinearGradient(0, y, 0, y + h);
      wall.addColorStop(0, palette.olive800);
      wall.addColorStop(0.68, palette.olive900);
      wall.addColorStop(0.68, palette.olive780);
      wall.addColorStop(1, palette.bg);
      ctx.globalAlpha = a;
      ctx.fillStyle = wall;
      ctx.fillRect(x, y, w, h);
      const portrait = h > w;
      const floorY = y + h * (portrait ? 0.62 : 0.68);
      line([[x, floorY], [x + w, floorY]], 1, lime, 0.35 * a);
      // cadres : celui du centre de face, les autres sur des murs qui tournent (cimaise courbe)
      const n = Math.max(1, shots.length);
      const mid = (n - 1) / 2;
      const order = shots.map((_, i) => i).sort((p1, p2) => Math.abs(p2 - mid) - Math.abs(p1 - mid));
      for (const i of order) {
        const k = i - mid; // -2 … 2
        const depth = 1 + Math.abs(k) * 0.22;
        const fw = (w * (portrait ? 0.4 : 0.24)) / depth;
        const fh = fw * 0.66;
        const cx = x + w / 2 + Math.sign(k) * Math.pow(Math.abs(k), 0.85) * w * (portrait ? 0.34 : 0.205);
        const cy = floorY - h * 0.08 - fh / 2 - Math.abs(k) * h * 0.01;
        const shear = -k * 0.09; // murs inclinés vers le centre
        ctx.save();
        ctx.translate(cx, cy);
        ctx.transform(1, shear, 0, 1, 0, 0);
        // halo du spot au-dessus du cadre
        const spot = ctx.createRadialGradient(0, -fh * 0.9, 0, 0, -fh * 0.2, fh * 1.4);
        spot.addColorStop(0, "rgba(212,255,58,0.16)");
        spot.addColorStop(1, "rgba(212,255,58,0)");
        ctx.globalAlpha = a;
        ctx.fillStyle = spot;
        ctx.fillRect(-fw, -fh * 1.6, fw * 2, fh * 2.6);
        // capture
        ctx.fillStyle = palette.olive850;
        ctx.fillRect(-fw / 2, -fh / 2, fw, fh);
        const img = shots[i];
        if (img.complete && img.naturalWidth) {
          const r = Math.max(fw / img.naturalWidth, fh / img.naturalHeight);
          const iw = img.naturalWidth * r;
          const ih = img.naturalHeight * r;
          ctx.save();
          ctx.beginPath();
          ctx.rect(-fw / 2, -fh / 2, fw, fh);
          ctx.clip();
          ctx.globalAlpha = a * (1 - Math.abs(k) * 0.18);
          ctx.drawImage(img, -iw / 2, -ih / 2, iw, ih);
          ctx.restore();
        }
        ctx.globalAlpha = a * 0.55;
        ctx.strokeStyle = "rgba(242,243,238,0.35)";
        ctx.lineWidth = 1;
        ctx.strokeRect(-fw / 2, -fh / 2, fw, fh);
        // reflet au sol
        ctx.globalAlpha = a * 0.08;
        ctx.fillStyle = lime;
        ctx.fillRect(-fw / 2, floorY - cy + h * 0.02, fw, h * 0.012);
        ctx.restore();
      }
      // balayage lumineux lent sur la vitre de l'écran
      const scanY = y + (((now - t0) / 3200) % 1) * h;
      const sg = ctx.createLinearGradient(0, scanY - h * 0.1, 0, scanY);
      sg.addColorStop(0, "rgba(212,255,58,0)");
      sg.addColorStop(1, "rgba(212,255,58,0.08)");
      ctx.globalAlpha = a;
      ctx.fillStyle = sg;
      ctx.fillRect(x, scanY - h * 0.1, w, h * 0.1);
      ctx.restore();
    };

    const draw = (p: number, now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, W, H);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const vh = window.innerHeight;
      const zoneH = el.offsetHeight;
      // part de la progression avant que le cadre ne colle (la zone monte depuis le bas)
      const pre = vh / zoneH;
      const s = clamp((p - pre) / (1 - pre)); // progression dans le cadre collant
      const narrow = W < 768;
      const f = narrow ? W * 0.9 : Math.min(W, H) * 0.6;
      const cam = ease(seg(s, 0.42, 0.88)) * (FAR - 0.75);

      // écran (16:10 sur desktop, plus haut sur mobile), à la profondeur FAR
      const sw = narrow ? 1.17 : 1.81;
      const sh = narrow ? 1.5 : 1.12;
      const [x0, y0] = project(-sw, -sh, FAR, cam, f);
      const [x1, y1] = project(sw, sh, FAR, cam, f);
      const w = x1 - x0;
      const h = y1 - y0;

      // 1. le fil descend jusqu'au bord haut de l'écran (pendant que la zone monte)
      const down = ease(seg(p, pre * 0.25, pre * 1.02));
      if (down > 0) {
        const yEnd = y0 * down;
        glowLine([[W / 2, 0], [W / 2, yEnd]], 2, 1 - seg(s, 0.3, 0.5));
        if (down < 1) head(W / 2, yEnd, 22, 1);
      }

      // 2. il se projette : deux pointes partent du haut de l'écran et en dessinent le contour
      const trace = ease(seg(s, 0.02, 0.3));
      const lit = ease(seg(s, 0.26, 0.46));
      if (trace > 0) {
        const cx = (x0 + x1) / 2;
        const right: [number, number][] = [[cx, y0], [x1, y0], [x1, y1], [cx, y1]];
        const left: [number, number][] = [[cx, y0], [x0, y0], [x0, y1], [cx, y1]];
        // lueur projetée sur le sol, sous l'écran
        if (lit > 0) {
          const glow = ctx.createRadialGradient(cx, y1 + h * 0.08, 0, cx, y1 + h * 0.08, w * 0.7);
          glow.addColorStop(0, "rgba(212,255,58,0.10)");
          glow.addColorStop(1, "rgba(212,255,58,0)");
          ctx.globalAlpha = lit;
          ctx.fillStyle = glow;
          ctx.fillRect(cx - w, y1 - h * 0.2, w * 2, h * 0.8);
          // 3. l'écran s'allume : la salle d'exposition des projets apparaît dedans
          gallery(x0, y0, w, h, lit, now);
          anim = s < 0.86;
        }
        const r = partial(right, trace);
        const l = partial(left, trace);
        glowLine(r, 1.8, 1 - seg(s, 0.6, 0.85));
        glowLine(l, 1.8, 1 - seg(s, 0.6, 0.85));
        if (trace < 1) {
          head(r[r.length - 1][0], r[r.length - 1][1], 18, 1);
          head(l[l.length - 1][0], l[l.length - 1][1], 18, 1);
        }
      }

      // 4. plongée : l'écran remplit la vue ; la salle (section suivante) monte par-dessus,
      // puis la lueur se fond dans le noir avant que le cadre ne se décolle
      const out = seg(s, 0.86, 1);
      if (out > 0) {
        ctx.globalAlpha = ease(out);
        ctx.fillStyle = palette.bg;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.globalAlpha = 1;
    };

    // rendu à la demande : seulement quand la progression bouge, ou pendant que l'écran
    // allumé est visible (balayage lumineux, 30 i/s) ; sinon la boucle s'arrête
    let anim = false;
    let last = 0;
    function frame(now: number) {
      raf = 0;
      if (!visible) return;
      const moving = shown < 0 || Math.abs(target - shown) > 0.0002;
      if (moving || (anim && now - last > 33)) {
        shown = shown < 0 ? target : shown + (target - shown) * 0.1;
        anim = false;
        draw(shown, now);
        last = now;
      }
      if (moving || anim) raf = requestAnimationFrame(frame);
    }

    const onResize = () => {
      fit();
      measure();
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", onResize);
    t0 = performance.now();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", onResize);
    };
  }, [lang]);

  return (
    <div ref={zone} aria-hidden className="passage">
      <div className="passage-sticky">
        <canvas ref={canvas} className="h-full w-full" />
      </div>
    </div>
  );
}
