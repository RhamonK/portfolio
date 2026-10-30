"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";
import { ProjectScreen } from "@/components/ProjectScreen";
import { scrollToY } from "@/lib/scroll";

// Scène B — salle d'écrans. Section épinglée : la molette fait défiler
// les projets un par un sur un anneau. L'écran de face est grand et net,
// les autres s'éloignent, s'assombrissent et se penchent.
// Mobile ou mouvement réduit : carrousel horizontal simple (voir globals.css).

const STEP = 32; // degrés entre deux écrans sur l'anneau
const pad = (n: number) => String(n).padStart(2, "0");

export function ProjectRoom() {
  const section = useRef<HTMLElement>(null);
  const screens = useRef<(HTMLDivElement | null)[]>([]);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const n = projects.length;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const place = (a: number) => {
        const radius = Math.min(window.innerWidth * 0.75, 1100);
        screens.current.forEach((el, i) => {
          if (!el) return;
          const d = i - a;
          const ad = Math.min(Math.abs(d), 2.6);
          const theta = (d * STEP * Math.PI) / 180;
          gsap.set(el, {
            x: Math.sin(theta) * radius,
            z: (Math.cos(theta) - 1) * radius - ad * 260,
            rotateY: -d * STEP * 0.7,
            scale: 1 - ad * 0.1,
            opacity: ad >= 2.6 ? 0 : 1 - ad * 0.28,
            filter: `brightness(${1 - ad * 0.3}) blur(${ad * 1.2}px)`,
            zIndex: 100 - Math.round(ad * 10),
          });
        });
        setActive(Math.round(a));
      };

      place(0);
      const st = ScrollTrigger.create({
        trigger: section.current,
        pin: true,
        start: "top top",
        end: () => `+=${(n - 1) * window.innerHeight * 0.8}`,
        snap: {
          snapTo: 1 / (n - 1),
          duration: { min: 0.2, max: 0.6 },
          delay: 0.08,
          ease: "power2.inOut",
        },
        invalidateOnRefresh: true,
        onUpdate: (self) => place(self.progress * (n - 1)),
        onRefresh: (self) => place(self.progress * (n - 1)),
      });
      trigger.current = st;
      return () => {
        trigger.current = null;
      };
    });

    return () => mm.revert();
  }, [n]);

  const goTo = (i: number) => {
    const target = Math.max(0, Math.min(n - 1, i));
    const st = trigger.current;
    if (st) {
      scrollToY(st.start + (target / (n - 1)) * (st.end - st.start));
    } else {
      screens.current[target]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      setActive(target);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(active - 1);
    }
  };

  const current = projects[active];

  return (
    <section
      ref={section}
      id="projets"
      aria-labelledby="titre-projets"
      aria-roledescription="carrousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="room relative flex h-[100svh] flex-col overflow-hidden pt-20"
    >
      {/* lumière lime qui monte du sol */}
      <div
        aria-hidden
        className="room-floor pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(212,255,58,0.16),transparent_65%)]"
      />
      <div aria-hidden className="room-floor pointer-events-none absolute inset-x-0 bottom-[-18vh] flex justify-center [perspective:900px]">
        <div className="relative h-[60vh] w-[140vw] [transform:rotateX(78deg)]">
          {[100, 72, 46].map((s) => (
            <div
              key={s}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-lime/35"
              style={{ width: `${s}%`, height: `${s}%` }}
            />
          ))}
        </div>
      </div>

      <div className="wrap relative z-10 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow">// projets</p>
          <h2 id="titre-projets" className="display mt-2 text-[clamp(34px,4.5vw,60px)]">
            Ce que j&apos;ai <span className="text-lime">fait</span>.
          </h2>
        </div>
        <p className="eyebrow room-front-caption hidden text-right lg:block">
          molette ou ← → pour tourner
        </p>
      </div>

      <div className="room-stage relative mt-4 flex-1 [perspective:1600px] [transform-style:preserve-3d]">
        {projects.map((p, i) => (
          <div
            key={p.slug}
            ref={(el) => {
              screens.current[i] = el;
            }}
            className="room-screen absolute left-1/2 top-1/2 w-[min(46vw,680px,70svh)] -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ zIndex: n - i }}
            onClick={() => goTo(i)}
          >
            <ProjectScreen project={p} />
            <div className="room-inline-caption mt-4">
              <span className="eyebrow">
                {pad(i + 1)} / {pad(n)}
              </span>
              <h3 className="mt-1 text-[24px] font-bold tracking-tight">{p.name}</h3>
              <p className="mt-1 text-muted">{p.pitch}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="room-front-caption wrap relative z-10 pb-10 text-center" aria-live="polite">
        <span className="eyebrow">
          {pad(active + 1)} / {pad(n)}
        </span>
        <h3 className="mt-1 text-[clamp(26px,3vw,38px)] font-bold tracking-tight">{current.name}</h3>
        <p className="mx-auto mt-1 max-w-[560px] text-muted">{current.pitch}</p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <button type="button" className="btn btn-glass !min-h-10 !w-10 !px-0 justify-center" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Projet précédent">
            ←
          </button>
          <button type="button" className="btn btn-lime" aria-disabled="true" title="La présentation arrive à l'étape suivante">
            ▶ Lancer la présentation · 60 s
          </button>
          <button type="button" className="btn btn-glass !min-h-10 !w-10 !px-0 justify-center" onClick={() => goTo(active + 1)} disabled={active === n - 1} aria-label="Projet suivant">
            →
          </button>
        </div>
      </div>
    </section>
  );
}
