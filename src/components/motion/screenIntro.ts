// « La section sort de l'écran » — entrée de la salle des projets.
//
// Le fil descend depuis l'accueil, puis deux pointes de lumière dessinent un écran ;
// dans cet écran, on voit déjà la vraie section Projets (titre, filtres, salle) en
// réduction. En défilant, la section grandit et sort de l'écran jusqu'à occuper toute
// la vue — une seule apparition, rien ne réapparaît ensuite. Enfin, le fil file jusqu'au
// premier écran de projet, qui s'allume.
//
// Le contenu réel est transformé (scale + clip-path) : pas de copie, pas de capture.
// Le fil est dessiné sur un canvas 2D par-dessus, à la demande.

import { palette } from "@/lib/palette";

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Pt = [number, number];

export type ScreenIntro = {
  /** Approche (0 → 1) : la section monte depuis le bas de l'écran, le fil descend. */
  approach: (a: number) => void;
  /** Progression dans la zone figée (0 → 1). */
  progress: (q: number) => void;
  dispose: () => void;
};

export function createScreenIntro({
  inner,
  canvas,
  narrow,
  target,
  onLanded,
}: {
  inner: HTMLElement;
  canvas: HTMLCanvasElement;
  narrow: boolean;
  /** Le premier écran de projet (rectangle à l'écran), où le fil termine sa course. */
  target: () => DOMRect | null;
  /** Le fil a atteint le premier écran. */
  onLanded?: (on: boolean) => void;
}): ScreenIntro {
  const ctx = canvas.getContext("2d")!;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  const lime = palette.lime;
  const k0 = narrow ? 0.62 : 0.46; // taille de l'écran au départ (fraction de la vue)
  let W = 0;
  let H = 0;
  let a = 0;
  let q = 0;
  let landed = false;

  const fit = () => {
    W = canvas.clientWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
  };
  fit();

  const line = (pts: Pt[], width: number, color: string, alpha: number) => {
    if (alpha <= 0.002 || pts.length < 2) return;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
  };
  const glow = (pts: Pt[], w: number, alpha: number) => {
    line(pts, w * 6, lime, alpha * 0.12);
    line(pts, w * 2.2, lime, alpha * 0.35);
    line(pts, w, "#f4ffd0", alpha);
  };
  const head = ([x, y]: Pt, r: number, alpha = 1) => {
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
  const partial = (pts: Pt[], t: number): Pt[] => {
    const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
    let left = lens.reduce((x, y) => x + y, 0) * t;
    const out: Pt[] = [pts[0]];
    for (let i = 0; i < lens.length; i++) {
      if (left >= lens[i]) {
        out.push(pts[i + 1]);
        left -= lens[i];
      } else {
        const k = lens[i] ? left / lens[i] : 0;
        out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]);
        break;
      }
    }
    return out;
  };

  const render = () => {
    // ----- la section réelle, dans l'écran -----
    const grow = ease(seg(q, 0.36, 0.84));
    const k = k0 + (1 - k0) * grow;
    const lit = ease(seg(q, 0.16, 0.36));
    const radius = 28 * (1 - grow);
    inner.style.transformOrigin = `50% ${H / 2}px`;
    inner.style.transform = k < 0.9999 ? `scale(${k})` : "";
    inner.style.opacity = String(lit);
    // seule la hauteur de l'écran (une vue) est visible tant que la section est dans l'écran
    const hidden = Math.max(0, inner.offsetHeight - H);
    inner.style.clipPath = k < 0.9999 ? `inset(0 0 ${hidden}px 0 round ${radius / k}px)` : "";

    // ----- le fil -----
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const fw = W * k;
    const fh = H * k;
    const x0 = (W - fw) / 2;
    const y0 = (H - fh) / 2;
    const x1 = x0 + fw;
    const y1 = y0 + fh;
    const cx = W / 2;

    // fond de l'écran (avant qu'il ne s'allume) et lueur projetée
    if (q > 0 && grow < 1) {
      const g = ctx.createRadialGradient(cx, y1, 0, cx, y1, fw * 0.7);
      g.addColorStop(0, "rgba(212,255,58,0.10)");
      g.addColorStop(1, "rgba(212,255,58,0)");
      ctx.globalAlpha = lit * (1 - grow);
      ctx.fillStyle = g;
      ctx.fillRect(cx - fw, y1 - fh * 0.2, fw * 2, fh * 0.8);
    }

    // 1. le fil descend jusqu'au bord haut de l'écran (approche, puis début de la zone figée)
    const down = ease(a);
    if (down > 0 && q < 0.5) {
      const yTop = (H - H * k0) / 2;
      const yEnd = yTop * down;
      // pendant l'approche, la section (et ce canvas) montent : le fil part du haut de la vue
      glow([[cx, 0], [cx, yEnd]], 2, 1 - seg(q, 0.3, 0.5));
      if (down < 1) head([cx, yEnd], 22);
    }

    // 2. deux pointes dessinent le contour de l'écran, qui suit ensuite la section qui grandit
    const trace = ease(seg(q, 0, 0.22));
    if (trace > 0) {
      const fade = 1 - seg(q, 0.7, 0.86);
      const right = partial([[cx, y0], [x1, y0], [x1, y1], [cx, y1]], trace);
      const left = partial([[cx, y0], [x0, y0], [x0, y1], [cx, y1]], trace);
      glow(right, 1.8, fade);
      glow(left, 1.8, fade);
      if (trace < 1) {
        head(right[right.length - 1], 18);
        head(left[left.length - 1], 18);
      }
    }

    // 3. la section a pris toute la vue : le fil file jusqu'au premier écran de projet
    const run = ease(seg(q, 0.86, 1));
    const r = run > 0 ? target() : null;
    if (r) {
      const tx = r.left + r.width / 2;
      const ty = r.top;
      const path = partial([[cx, 0], [cx, Math.min(ty - 24, H * 0.25)], [tx, ty - 24], [tx, ty]], run);
      glow(path, 1.8, 1);
      if (run < 1) head(path[path.length - 1], 18);
      if (run >= 1) {
        // arrivé : le contour de l'écran s'allume un instant
        glow([[r.left, r.top], [r.right, r.top], [r.right, r.bottom], [r.left, r.bottom], [r.left, r.top]], 1.4, 0.8);
      }
    }
    const nowLanded = run >= 1;
    if (nowLanded !== landed) {
      landed = nowLanded;
      onLanded?.(landed);
    }
    canvas.style.opacity = q >= 1 ? "0" : "1";
  };

  const onResize = () => {
    fit();
    render();
  };
  window.addEventListener("resize", onResize);
  render();

  return {
    approach: (v) => {
      a = clamp(v);
      render();
    },
    progress: (v) => {
      q = clamp(v);
      render();
    },
    dispose: () => {
      window.removeEventListener("resize", onResize);
      inner.style.transform = "";
      inner.style.opacity = "";
      inner.style.clipPath = "";
      inner.style.transformOrigin = "";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
  };
}
