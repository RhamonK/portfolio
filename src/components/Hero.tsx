"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { site } from "@/data/site";

// Scène A — le CV vivant. Le texte est visible tout de suite ;
// les feuilles de CV en verre glissent derrière le titre au chargement,
// et la feuille du dessus suit la souris avec une légère inclinaison 3D.

const sheets = [
  { x: -150, y: 30, r: -9 },
  { x: 140, y: 10, r: 7 },
  { x: -20, y: -10, r: -2 },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".cv-sheet", {
          y: 260,
          opacity: 0,
          rotate: 0,
          duration: 0.8,
          stagger: 0.09,
          ease: "power3.out",
        });
      });
      mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
        const rx = gsap.quickTo(top.current, "rotationX", { duration: 0.6, ease: "power3" });
        const ry = gsap.quickTo(top.current, "rotationY", { duration: 0.6, ease: "power3" });
        const onMove = (e: PointerEvent) => {
          ry((e.clientX / window.innerWidth - 0.5) * 18);
          rx(-(e.clientY / window.innerHeight - 0.5) * 14);
        };
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="accueil"
      aria-labelledby="titre-accueil"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/10 blur-[120px]"
      />

      {/* feuilles de CV en verre */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center [perspective:1200px]">
        {sheets.map((s, i) => (
          <div
            key={i}
            className="cv-sheet absolute"
            style={{ transform: `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)` }}
          >
            <div
              ref={i === sheets.length - 1 ? top : undefined}
              className="glass w-[min(62vw,360px)] rounded-2xl p-6 opacity-70 [aspect-ratio:1/1.32]"
            >
              <div className="h-3 w-1/2 rounded-full bg-lime/50" />
              <div className="mt-2 h-2 w-1/3 rounded-full bg-white/15" />
              {[90, 75, 82, 60, 88, 70, 50, 80].map((w, j) => (
                <div key={j} className="mt-4 h-1.5 rounded-full bg-white/10" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="wrap relative z-10 text-center">
        <h1 id="titre-accueil" className="display text-[clamp(52px,11vw,160px)] [text-shadow:0_8px_60px_rgba(10,11,10,0.9)]">
          {site.name}
        </h1>
        <p className="mx-auto mt-6 max-w-[720px] text-[clamp(17px,2vw,22px)] text-ink/80">
          {site.role} · {site.position}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href="#projets" className="btn btn-lime">
            Voir mes projets ↓
          </a>
          <a href={site.cv.fr} download className="btn btn-glass">
            Télécharger mon CV
          </a>
        </div>
      </div>

      <p className="eyebrow hint-bob absolute inset-x-0 bottom-8 text-center">
        molette pour entrer dans la salle ↓
      </p>
    </section>
  );
}
