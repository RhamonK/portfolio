"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";
import { ProjectScreen, ScreenContent } from "@/components/ProjectScreen";
import { presentations } from "@/data/presentations";
import { Presentation } from "@/components/presentation/Presentation";
import { lockScroll, scrollToY } from "@/lib/scroll";

// Scène B — salle d'écrans. Le visiteur est au centre d'un cylindre :
// chaque écran est courbé (découpé en fines bandes posées sur l'anneau)
// et la molette fait tourner le cercle autour de lui, projet par projet.
// Mobile ou mouvement réduit : carrousel horizontal plat (voir globals.css).

const SCREEN_DEG = 60; // largeur d'un écran sur l'anneau : grand arc = écran large et bien courbé
const STEP = 66; // écart entre deux écrans
const STRIPS = 22; // bandes par écran : plus il y en a, plus la courbe est douce
const RATIO = 0.6; // hauteur / largeur maximale d'un écran
const rad = (d: number) => (d * Math.PI) / 180;
const pad = (n: number) => String(n).padStart(2, "0");

// Rayon de l'anneau selon la largeur de la fenêtre ; la hauteur des écrans
// suit la place libre entre le titre et la légende, sans les chevaucher.
function geometryFor(w: number, stageH: number) {
  const radius = Math.round(Math.min(Math.max(w * 0.56, 420), 1000));
  const width = 2 * radius * Math.tan(rad(SCREEN_DEG / STRIPS) / 2) * STRIPS;
  const height = Math.round(Math.min(width * RATIO, stageH * 0.82));
  return { radius, height };
}

export function ProjectRoom() {
  const section = useRef<HTMLElement>(null);
  const cylinder = useRef<HTMLDivElement>(null);
  const flat = useRef<(HTMLLIElement | null)[]>([]);
  const trigger = useRef<ScrollTrigger | null>(null);
  const stage3d = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  // Salle 3D affichée (desktop, mouvement normal) : la liste plate n'est
  // alors lue que par les lecteurs d'écran et ne doit pas prendre le focus.
  const [is3d, setIs3d] = useState(false);
  // Les bandes des écrans ne sont construites qu'à l'approche de la salle,
  // pour ne pas alourdir le chargement de la page.
  const [near, setNear] = useState(false);
  const placeRef = useRef<((a: number) => void) | null>(null);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const st = trigger.current;
    if (near && st) placeRef.current?.(st.progress * (projects.length - 1));
  }, [near]);
  const [{ radius, height: screenH }, setGeo] = useState({ radius: 800, height: 420 });
  const radiusRef = useRef(800);
  const n = projects.length;

  useEffect(() => {
    const onResize = () => {
      const stageH = stage3d.current?.clientHeight || window.innerHeight * 0.55;
      const geo = geometryFor(window.innerWidth, stageH);
      radiusRef.current = geo.radius;
      setGeo(geo);
    };
    onResize();
    const ro = new ResizeObserver(onResize);
    if (stage3d.current) ro.observe(stage3d.current);
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      setIs3d(true);
      const place = (a: number) => {
        gsap.set(cylinder.current, { z: radiusRef.current, rotationY: a * STEP });
        gsap.utils.toArray<HTMLElement>(".cyl-screen", cylinder.current).forEach((el, i) => {
          const ad = Math.abs(i - a);
          const hidden = ad * STEP > 110;
          const strips = el.children;
          if (!strips.length) return;
          gsap.set(strips, {
            opacity: hidden ? 0 : 1 - Math.min(ad, 1.5) * 0.4,
            visibility: hidden ? "hidden" : "visible",
          });
        });
        setActive(Math.round(a));
      };

      placeRef.current = place;
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
        placeRef.current = null;
        setIs3d(false);
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

  // Lancer : l'écran est « aspiré », la caméra plonge dedans (0,8 s).
  const launch = (i: number) => {
    const p = projects[i];
    if (!presentations[p.slug] || open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    lockScroll(true);
    if (trigger.current) {
      gsap
        .timeline({ onComplete: () => setOpen(p.slug) })
        .to(cylinder.current, { z: radiusRef.current * 1.85, duration: 0.8, ease: "power3.in" }, 0)
        .to(stage3d.current, { filter: "blur(6px)", duration: 0.8, ease: "power2.in" }, 0);
    } else setOpen(p.slug);
  };

  const closePresentation = () => {
    setOpen(null);
    lockScroll(false);
    if (trigger.current) {
      gsap.to(cylinder.current, { z: radiusRef.current, duration: 0.6, ease: "power3.out" });
      gsap.to(stage3d.current, { filter: "blur(0px)", duration: 0.6, clearProps: "filter" });
    }
    lastFocus.current?.focus();
  };

  const nextProject = () => {
    closePresentation();
    setTimeout(() => goTo(active + 1), 650);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter") {
      e.preventDefault();
      launch(active);
    } else if (e.key === "ArrowRight") {
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
  const current = projects[active];

  return (
    <section
      ref={section}
      id="projets"
      aria-labelledby="titre-projets"
      aria-roledescription="carrousel"
      aria-describedby="aide-projets"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="room relative flex h-[100svh] flex-col overflow-hidden pt-20"
    >
      {/* lumière lime qui monte du sol + anneaux */}
      <div
        aria-hidden
        className="room-3d pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(212,255,58,0.18),transparent_65%)]"
      />
      <div aria-hidden className="room-3d pointer-events-none absolute inset-x-0 bottom-[-34vh] flex justify-center [perspective:900px]">
        <div className="relative h-[62vh] w-[150vw] [transform:rotateX(78deg)]">
          {[100, 74, 48].map((s) => (
            <div
              key={s}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-lime/25"
              style={{ width: `${s}%`, height: `${s}%` }}
            />
          ))}
        </div>
      </div>

      <div className="wrap relative z-10 md:text-center">
        <p className="eyebrow">// projets</p>
        <h2 id="titre-projets" className="display mt-2 text-[clamp(34px,4.5vw,60px)]">
          Some <span className="text-lime">projects</span>.
        </h2>
        <p id="aide-projets" className="sr-only">
          Flèches gauche et droite pour changer de projet, Entrée pour lancer la présentation.
        </p>
      </div>

      {/* ===== cylindre (desktop) ===== */}
      <div ref={stage3d} aria-hidden className="room-3d relative flex-1" style={{ perspective: `${radius}px` }}>
        <div
          ref={cylinder}
          className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]"
        >
          {projects.map((p, i) => (
            <div key={p.slug} className="cyl-screen [transform-style:preserve-3d]" onClick={() => (i === active ? launch(i) : goTo(i))}>
              {near && Array.from({ length: STRIPS }).map((_, j) => {
                const angle = -(i * STEP + (j - (STRIPS - 1) / 2) * stripDeg);
                const first = j === 0;
                const last = j === STRIPS - 1;
                return (
                  <div
                    key={j}
                    className="absolute cursor-pointer overflow-hidden border-y border-lime/60 [backface-visibility:hidden]"
                    style={{
                      width: stripW + 2,
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
          {presentations[current.slug] ? (
            <button type="button" className="btn btn-lime" onClick={() => launch(active)}>
              ▶ Lancer la présentation · 60 s
            </button>
          ) : (
            <button type="button" className="btn btn-glass" disabled>
              Présentation bientôt
            </button>
          )}
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
            {presentations[p.slug] && (
              <button type="button" className="btn btn-lime mt-4" tabIndex={is3d ? -1 : undefined} onClick={() => launch(i)}>
                ▶ Lancer la présentation · 60 s
              </button>
            )}
          </li>
        ))}
      </ol>

      {open &&
        createPortal(
        <Presentation
          project={projects.find((p) => p.slug === open)!}
          presentation={presentations[open]}
          onClose={closePresentation}
          onNextProject={projects.findIndex((p) => p.slug === open) < n - 1 ? nextProject : undefined}
        />,
        document.body,
      )}
    </section>
  );
}
