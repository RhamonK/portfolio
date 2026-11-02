"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";
import dynamic from "next/dynamic";
import { ProjectScreen } from "@/components/ProjectScreen";
import type { RoomDrive } from "@/components/Room3D";
import { presentations } from "@/data/presentations";
import { Presentation } from "@/components/presentation/Presentation";
import { lockScroll, scrollToY } from "@/lib/scroll";
import { ui, type Lang } from "@/i18n";
import { SplitTitle } from "@/components/SplitTitle";
import { useReveal } from "@/lib/reveal";

// La salle 3D (modèle Blender, WebGL) n'est chargée qu'à l'approche de la section.
const Room3D = dynamic(() => import("@/components/Room3D"), { ssr: false });

// Scène B — salle d'écrans (modèle Blender, WebGL) : le visiteur est au
// centre, la molette fait tourner les écrans autour de lui, projet par projet.
// Mobile, mouvement réduit ou pas de WebGL : carrousel plat (voir globals.css).
// L'ancien portail circulaire d'entrée est retiré : le Fil INFINITE fait le lien entre sections.

const pad = (n: number) => String(n).padStart(2, "0");

export function ProjectRoom({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const section = useRef<HTMLElement>(null);
  const flat = useRef<(HTMLLIElement | null)[]>([]);
  const trigger = useRef<ScrollTrigger | null>(null);
  const stage3d = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  // Desktop et mouvement normal : la liste plate n'est alors lue que par
  // les lecteurs d'écran et ne doit pas prendre le focus.
  const [is3d, setIs3d] = useState(false);
  // La salle 3D n'est chargée qu'à l'approche de la section.
  const [near, setNear] = useState(false);
  // Salle visible à l'écran : sinon la scène 3D arrête de se dessiner.
  const [onScreen, setOnScreen] = useState(false);
  // WebGL indisponible (rare) : carrousel plat, même sur desktop.
  const [webgl, setWebgl] = useState(true);
  // Bande de la scène 3D (fractions de la section) : entre le titre et la
  // légende, pour qu'aucun trait ni cadre ne passe derrière le texte.
  const [canvasBox, setCanvasBox] = useState({ top: 0.2, h: 0.55 });
  const drive = useRef<RoomDrive>({ a: 0, tunnel: 0, band: { top: 0.2, bottom: 0.7 } });
  useReveal(section);
  const images = projects.map((p) => p.image ?? `/projets/${p.slug}/dessin.svg`);

  useEffect(() => {
    try {
      setWebgl(!!document.createElement("canvas").getContext("webgl2"));
    } catch {
      setWebgl(false);
    }
  }, []);

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
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    const seen = new IntersectionObserver((entries) => setOnScreen(entries.some((e) => e.isIntersecting)));
    seen.observe(el);
    return () => {
      io.disconnect();
      seen.disconnect();
    };
  }, []);

  useEffect(() => {
    // Pendant qu'on regarde la salle, la scène de présentation (salle,
    // présentateur, captures) se prépare : elle s'ouvre ensuite sans attente.
    if (!near || !webgl || !is3d) return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 800));
    const id = idle(() => {
      import("@/components/presentation/Stage3D").then((m) => m.preloadStage(Object.fromEntries(projects.map((p, i) => [p.slug, images[i]])))).catch(() => {});
    });
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id);
  }, [near, webgl, is3d]);
  const n = projects.length;

  useEffect(() => {
    const onResize = () => {
      // Bande libre pour l'écran de la salle 3D (fractions de la section).
      const sec = section.current?.getBoundingClientRect();
      const st = stage3d.current?.getBoundingClientRect();
      if (sec && st && sec.height > 0) {
        const top = (st.top - sec.top) / sec.height;
        const bottom = (st.bottom - sec.top) / sec.height;
        const ctop = Math.max(top - 0.01, 0);
        const h = Math.min(bottom + 0.015, 1) - ctop;
        setCanvasBox({ top: ctop, h });
        // bande de l'écran exprimée en fractions de la scène 3D
        drive.current.band = { top: (top + 0.02 - ctop) / h, bottom: (bottom - 0.03 - ctop) / h };
      }
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
    if (!webgl) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      setIs3d(true);
      // Légende de l'écran de face : apparaît une seule fois (même langage que les autres sections).
      gsap.fromTo(
        ".room-caption",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          immediateRender: true,
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: section.current, start: "top 20%", once: true },
        },
      );
      const place = (a: number) => {
        drive.current.a = a;
        setActive(Math.round(a));
      };
      const st = ScrollTrigger.create({
        trigger: section.current,
        pin: true,
        start: "top top",
        end: () => `+=${(n - 1) * window.innerHeight * 0.8}`,
        // aimantage doux : seulement quand on s'arrête de défiler, vers le projet le plus proche
        snap: {
          snapTo: 1 / (n - 1),
          directional: false,
          delay: 0.45,
          duration: { min: 0.3, max: 0.8 },
          ease: "power2.inOut",
        },
        invalidateOnRefresh: true,
        onUpdate: (self) => place(self.progress * (n - 1)),
        onRefresh: (self) => place(self.progress * (n - 1)),
      });
      trigger.current = st;
      return () => {
        trigger.current = null;
        setIs3d(false);
      };
    });

    return () => mm.revert();
  }, [n, webgl]);

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
        .to(drive.current, { tunnel: 1, duration: 0.8, ease: "power3.in" }, 0)
        .to(section.current!.querySelectorAll(".room-text"), { opacity: 0, duration: 0.3 }, 0);
    } else setOpen(p.slug);
  };

  const closePresentation = () => {
    setOpen(null);
    lockScroll(false);
    if (trigger.current) {
      gsap.to(drive.current, { tunnel: 0, duration: 0.6, ease: "power3.out" });
      gsap.to(section.current!.querySelectorAll(".room-text"), { opacity: 1, duration: 0.4, delay: 0.3 });
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
      className={`room relative flex h-[100svh] flex-col overflow-hidden pt-20 ${webgl ? "" : "is-flat"}`}
    >
      <div className="room-text wrap relative z-10 md:text-center">
        <p className="eyebrow">{t.projectsEyebrow}</p>
        <h2 id="titre-projets" data-reveal-title className="display mt-2 text-[clamp(34px,4.5vw,60px)]">
          <SplitTitle parts={[{ t: t.projectsTitle[0] }, { t: t.projectsTitle[1], em: true }, { t: t.projectsTitle[2] }]} />
        </h2>
        <p id="aide-projets" className="sr-only">
          {t.roomHelp}
        </p>
      </div>

      {/* ===== salle Blender (desktop, WebGL), entre le titre et la légende ===== */}
      {webgl && is3d && near && (
        <div
          aria-hidden
          className="room-3d absolute inset-x-0 z-0"
          style={{
            top: `${canvasBox.top * 100}%`,
            height: `${canvasBox.h * 100}%`,
            maskImage: "linear-gradient(to bottom, transparent 0%, #000 6%, #000 90%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 6%, #000 90%, transparent 100%)",
          }}
        >
          <Room3D images={images} drive={drive} paused={!!open || !onScreen} onPick={(i) => (i === active ? launch(i) : goTo(i))} />
        </div>
      )}

      {/* place réservée à la salle : sert à mesurer la bande libre */}
      <div ref={stage3d} aria-hidden className="room-3d pointer-events-none relative flex-1" />

      {/* légende de l'écran de face (desktop) */}
      <div className="room-3d room-text room-caption wrap relative z-10 pb-10 text-center" aria-live="polite">
        <span className="eyebrow">
          {pad(active + 1)} / {pad(n)}
        </span>
        <h3 className="mt-1 text-[clamp(26px,3vw,38px)] font-bold tracking-tight">{current.name}</h3>
        <p className="mx-auto mt-1 max-w-[560px] text-muted">{current.pitch[lang]}</p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <button type="button" className="btn btn-glass !min-h-10 !w-10 justify-center !px-0" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label={t.prevProject}>
            ←
          </button>
          {presentations[current.slug] ? (
            <button type="button" className="btn btn-lime" onClick={() => launch(active)}>
              {t.launch}
            </button>
          ) : (
            <button type="button" className="btn btn-glass" disabled>
              {t.soon}
            </button>
          )}
          <button type="button" className="btn btn-glass !min-h-10 !w-10 justify-center !px-0" onClick={() => goTo(active + 1)} disabled={active === n - 1} aria-label={t.nextProject}>
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
            <p className="mt-1 text-muted">{p.pitch[lang]}</p>
            {presentations[p.slug] && (
              <button type="button" className="btn btn-lime mt-4" tabIndex={is3d && webgl ? -1 : undefined} onClick={() => launch(i)}>
                {t.launch}
              </button>
            )}
          </li>
        ))}
      </ol>

      {open &&
        createPortal(
        <Presentation
          initialLang={lang}
          projectIndex={projects.findIndex((p) => p.slug === open)}
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
