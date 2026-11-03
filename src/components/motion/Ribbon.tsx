"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Acte 3 — le fil sort : un ruban lime arrive par le haut de la section, balaie
// l'écran et vient souligner le titre. Tracé lié au défilement (scrub), recalculé
// d'après la position réelle du titre. Décoratif, derrière le texte, jamais cliquable.
export function Ribbon({ target }: { target: string }) {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = svg.current;
    const section = el?.closest("section");
    if (!el || !section) return;
    const paths = [...el.querySelectorAll("path")];

    const build = () => {
      const box = el.getBoundingClientRect();
      const title = section.querySelector<HTMLElement>(target);
      if (!title || !box.width) return;
      // largeur du texte réel (pas de la boîte du titre) : le soulignement épouse les mots
      const words = [...title.querySelectorAll<HTMLElement>(".rv-mask")].map((w) => w.getBoundingClientRect());
      const r = words.length ? { left: Math.min(...words.map((w) => w.left)), right: Math.max(...words.map((w) => w.right)), bottom: Math.max(...words.map((w) => w.bottom)) } : title.getBoundingClientRect();
      const W = box.width;
      const H = box.height;
      const x0 = r.left - box.left;
      const x1 = r.right - box.left;
      const y = r.bottom - box.top + 10;
      const narrow = W < 768;
      const d = [
        `M ${W * (narrow ? 0.8 : 0.84)} -6`,
        `C ${W * (narrow ? 1.04 : 0.98)} ${y * 0.42}, ${Math.max(6, x0 - (narrow ? 40 : 160))} ${y * 0.05}, ${Math.max(10, x0 - (narrow ? 14 : 40))} ${y - 8}`,
        `C ${x0 - 4} ${y + 6}, ${x0 + 24} ${y + 6}, ${x0 + 60} ${y + 3}`,
        `L ${x1} ${y - 2}`,
      ].join(" ");
      el.setAttribute("viewBox", `0 0 ${W} ${H}`);
      paths.forEach((p) => p.setAttribute("d", d));
    };
    build();
    document.fonts?.ready.then(build);
    window.addEventListener("resize", build);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const st = reduced
      ? null
      : gsap.fromTo(
          paths,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top 85%", end: "top 12%", scrub: 0.9 },
          },
        );
    if (reduced) paths.forEach((p) => (p.style.strokeDashoffset = "0"));
    return () => {
      window.removeEventListener("resize", build);
      st?.scrollTrigger?.kill();
      st?.kill();
    };
  }, [target]);

  return (
    <svg ref={svg} aria-hidden className="ribbon" preserveAspectRatio="none">
      <path className="ribbon-glow" pathLength={1} />
      <path className="ribbon-core" pathLength={1} />
    </svg>
  );
}
