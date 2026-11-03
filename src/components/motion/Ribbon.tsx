"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Acte 3 — le fil sort : un ruban lime arrive par le haut de la section, balaie
// l'écran, souligne le titre puis s'efface (il passe, il ne reste pas). Joué une fois, recalculé
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

    // tracé joué une fois, en 1,6 s, quand le titre arrive à l'écran : on le voit toujours se dessiner,
    // même avec un défilement rapide (lié au défilement, il passait en une fraction de seconde)
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dot = el.querySelector<SVGCircleElement>("circle");
    const main = paths[paths.length - 1];
    let tween: gsap.core.Timeline | null = null;
    // le ruban passe, il ne reste pas : la pointe dessine la courbe et souligne le titre,
    // puis la queue rattrape la pointe et tout s'efface au bout du soulignement
    const play = () => {
      const st = { head: 0, tail: 0 };
      const render = () => {
        const len = Math.max(0.0001, st.head - st.tail);
        paths.forEach((p) => {
          p.style.strokeDasharray = `${len} 2`;
          p.style.strokeDashoffset = String(-st.tail);
        });
        if (dot && main.getAttribute("d")) {
          const pt = main.getPointAtLength(st.head * main.getTotalLength());
          dot.setAttribute("cx", String(pt.x));
          dot.setAttribute("cy", String(pt.y));
          dot.style.opacity = st.tail < 0.995 ? "1" : "0";
        }
      };
      tween = gsap
        .timeline({ onUpdate: render, onComplete: render })
        .to(st, { head: 1, duration: 1.6, ease: "power2.inOut" }, 0)
        .to(st, { tail: 1, duration: 1.5, ease: "power2.inOut" }, 1.9);
    };
    const trig = reduced
      ? null
      : ScrollTrigger.create({ trigger: section.querySelector(target) ?? section, start: "top 80%", once: true, onEnter: play });
    // mouvement réduit : pas de ruban (il ne ferait que figer un trait autour du titre)
    return () => {
      window.removeEventListener("resize", build);
      trig?.kill();
      tween?.kill();
    };
  }, [target]);

  return (
    <svg ref={svg} aria-hidden className="ribbon" preserveAspectRatio="none">
      <path className="ribbon-glow" pathLength={1} />
      <path className="ribbon-core" pathLength={1} />
      <circle className="ribbon-head" r={7} cx={-20} cy={-20} />
    </svg>
  );
}
