"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";
import { ProjectScreen, ScreenContent } from "@/components/ProjectScreen";
import { scrollToY } from "@/lib/scroll";

// Scène B — salle d'écrans. Le visiteur est au centre d'un cylindre :
// chaque écran est courbé (découpé en fines bandes posées sur l'anneau)
// et la molette fait tourner le cercle autour de lui, projet par projet.
// Mobile ou mouvement réduit : carrousel horizontal plat (voir globals.css).

const SCREEN_DEG = 38; // largeur d'un écran sur l'anneau
const STEP = 46; // écart entre deux écrans
const STRIPS = 16; // bandes par écran : plus il y en a, plus la courbe est douce
const RATIO = 0.64; // hauteur / largeur d'un écran
const rad = (d: number) => (d * Math.PI) / 180;
const pad = (n: number) => String(n).padStart(2, "0");

function radiusFor(w: number, h: number) {
  const byWidth = Math.min(Math.max(w * 0.72, 700), 1150);
  const byHeight = (h * 0.5) / (RATIO * rad(SCREEN_DEG));
  return Math.round(Math.min(byWidth, byHeight));
}

export function ProjectRoom() {
  const section = useRef<HTMLElement>(null);
  const cylinder = useRef<HTMLDivElement>(null);
  const flat = useRef<(HTMLLIElement | null)[]>([]);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const [radius, setRadius] = useState(1000);
  const radiusRef = useRef(1000);
  const n = projects.length;

  useEffect(() => {
    const onResize = () => {
      radiusRef.current = radiusFor(window.innerWidth, window.innerHeight);
      setRadius(radiusRef.current);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const screens = gsap.utils.toArray<HTMLElement>(".cyl-screen", cylinder.current);
      const place = (a: number) => {
        gsap.set(cylinder.current, { z: radiusRef.current, rotationY: a * STEP });
        screens.forEach((el, i) => {
          const ad = Math.abs(i - a);
          const strips = el.children;
          gsap.set(strips, {
            opacity: ad * STEP > 95 ? 0 : 1 - Math.min(ad, 1.6) * 0.42,
            visibility: ad * STEP > 95 ? "hidden" : "visible",
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

  useEffect(() => {
    if (trigger.current) gsap.set(cylinder.current, { z: radius });
  }, [radius]);

  const goTo = (i: number) => {
    const target = Math.max(0, Math.min(n - 1, i));
    const st = trigger.current;
    if (st) {
      scrollToY(st.start + (target / (n - 1)) * (st.end - st.start));
    } else {
      flat.current[target]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
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

  // Géométrie d'une bande : largeur de corde, plus 1 px pour cacher les jointures.
  const stripDeg = SCREEN_DEG / STRIPS;
  const stripW = 2 * radius * Math.tan(rad(stripDeg) / 2);
  const screenW = stripW * STRIPS;
  const screenH = screenW * RATIO;
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
      {/* lumière lime qui monte du sol + anneaux */}
      <div
        aria-hidden
        className="room-3d pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(212,255,58,0.18),transparent_65%)]"
      />
      <div aria-hidden className="room-3d pointer-events-none absolute inset-x-0 bottom-[-20vh] flex justify-center [perspective:900px]">
        <div className="relative h-[62vh] w-[150vw] [transform:rotateX(78deg)]">
          {[100, 74, 48].map((s) => (
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
        <p className="eyebrow room-3d hidden text-right lg:block">molette ou ← → pour tourner</p>
      </div>

      {/* ===== cylindre (desktop) ===== */}
      <div aria-hidden className="room-3d relative flex-1" style={{ perspective: `${radius}px` }}>
        <div
          ref={cylinder}
          className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]"
        >
          {projects.map((p, i) => (
            <div key={p.slug} className="cyl-screen [transform-style:preserve-3d]" onClick={() => goTo(i)}>
              {Array.from({ length: STRIPS }).map((_, j) => {
                const angle = -(i * STEP + (j - (STRIPS - 1) / 2) * stripDeg);
                const first = j === 0;
                const last = j === STRIPS - 1;
                return (
                  <div
                    key={j}
                    className="absolute cursor-pointer overflow-hidden border-y border-lime/60 [backface-visibility:hidden]"
                    style={{
                      width: stripW + 1,
                      height: screenH,
                      left: -stripW / 2,
                      top: -screenH / 2,
                      transform: `rotateY(${angle}deg) translateZ(${-radius}px)`,
                      borderLeft: first ? "1px solid rgba(212,255,58,0.6)" : undefined,
                      borderRight: last ? "1px solid rgba(212,255,58,0.6)" : undefined,
                      borderRadius: first ? "14px 0 0 14px" : last ? "0 14px 14px 0" : undefined,
                    }}
                  >
                    <div className="absolute top-0" style={{ left: -j * stripW, width: screenW, height: screenH }}>
                      <ScreenContent project={p} />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* légende de l'écran de face (desktop) */}
      <div className="room-3d wrap relative z-10 pb-10 text-center" aria-live="polite">
        <span className="eyebrow">
          {pad(active + 1)} / {pad(n)}
        </span>
        <h3 className="mt-1 text-[clamp(26px,3vw,38px)] font-bold tracking-tight">{current.name}</h3>
        <p className="mx-auto mt-1 max-w-[560px] text-muted">{current.pitch}</p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <button type="button" className="btn btn-glass !min-h-10 !w-10 justify-center !px-0" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Projet précédent">
            ←
          </button>
          <button type="button" className="btn btn-lime" aria-disabled="true" title="La présentation arrive à l'étape suivante">
            ▶ Lancer la présentation · 60 s
          </button>
          <button type="button" className="btn btn-glass !min-h-10 !w-10 justify-center !px-0" onClick={() => goTo(active + 1)} disabled={active === n - 1} aria-label="Projet suivant">
            →
          </button>
        </div>
      </div>

      {/* ===== liste plate : carrousel sur mobile, lue par les lecteurs d'écran ===== */}
      <ol className="room-flat">
        {projects.map((p, i) => (
          <li
            key={p.slug}
            ref={(el) => {
              flat.current[i] = el;
            }}
          >
            <ProjectScreen project={p} />
            <span className="eyebrow mt-4 block">
              {pad(i + 1)} / {pad(n)}
            </span>
            <h3 className="mt-1 text-[24px] font-bold tracking-tight">{p.name}</h3>
            <p className="mt-1 text-muted">{p.pitch}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
