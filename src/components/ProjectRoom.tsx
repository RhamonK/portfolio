"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";
import dynamic from "next/dynamic";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFilter, filtered, type Filter } from "@/components/ProjectFilter";
import type { RoomDrive } from "@/components/Room3D";
import { hasPresentation } from "@/data/presented";
import { lockScroll, scrollToY } from "@/lib/scroll";
import { ui, type Lang } from "@/i18n";
import { SplitTitle } from "@/components/SplitTitle";
import { useReveal } from "@/lib/reveal";
import { Ribbon } from "@/components/motion/Ribbon";

// La salle 3D (modèle Blender, WebGL) n'est chargée qu'à l'approche de la section.
const Room3D = dynamic(() => import("@/components/Room3D"), { ssr: false });
// La présentation de 60 s (composant + textes) n'est chargée qu'au clic.
const PresentationHost = dynamic(() => import("@/components/presentation/PresentationHost"), { ssr: false });

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
  // filtre par besoin : `list` = indices des projets retenus ; `active` = indice réel du projet de face
  const [filter, setFilter] = useState<Filter>("all");
  const list = useMemo(() => filtered(filter), [filter]);
  const m = list.length;
  const [active, setActive] = useState(0);
  const pos = Math.max(0, list.indexOf(active));
  // carte au centre de l'écran (mobile) : en couleur, les autres légèrement désaturées
  const [focused, setFocused] = useState<number | null>(null);
  const jumpAfterFilter = useRef(false);
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
      import("@/components/presentation/PresentationHost").catch(() => {});
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
      // p = position dans la liste filtrée ; la salle tourne entre les vrais écrans retenus
      const place = (p: number) => {
        const k = Math.max(0, Math.min(m - 1, p));
        const k0 = Math.floor(k);
        const k1 = Math.min(m - 1, k0 + 1);
        drive.current.a = list[k0] + (list[k1] - list[k0]) * (k - k0);
        setActive(list[Math.round(k)]);
      };
      drive.current.include = filter === "all" ? undefined : list;
      const st =
        m > 1
          ? ScrollTrigger.create({
              trigger: section.current,
              pin: true,
              start: "top top",
              end: () => `+=${(m - 1) * window.innerHeight * 0.8}`,
              // aimantage doux : seulement quand on s'arrête de défiler, vers le projet le plus proche
              snap: {
                snapTo: 1 / (m - 1),
                directional: false,
                delay: 0.45,
                duration: { min: 0.3, max: 0.8 },
                ease: "power2.inOut",
              },
              invalidateOnRefresh: true,
              onUpdate: (self) => place(self.progress * (m - 1)),
              onRefresh: (self) => place(self.progress * (m - 1)),
            })
          : // un seul projet retenu : pas d'épinglage, la salle reste face à lui
            ScrollTrigger.create({ trigger: section.current, start: "top top", end: "+=1", onRefresh: () => place(0) });
      place(0);
      ScrollTrigger.refresh();
      // après un changement de filtre depuis la salle : retour au premier projet retenu
      if (jumpAfterFilter.current) {
        jumpAfterFilter.current = false;
        scrollToY(st.start);
      }
      trigger.current = st;
      return () => {
        trigger.current = null;
        setIs3d(false);
      };
    });

    return () => mm.revert();
  }, [webgl, list, m, filter]);

  // k = position dans la liste filtrée
  const goTo = (k: number) => {
    const target = Math.max(0, Math.min(m - 1, k));
    const st = trigger.current;
    if (st && m > 1) {
      scrollToY(st.start + (target / (m - 1)) * (st.end - st.start));
    } else {
      flat.current[list[target]]?.scrollIntoView({ behavior: "smooth", block: "center" });
      setActive(list[target]);
    }
  };

  const changeFilter = (f: Filter) => {
    if (f === filter) return;
    const st = trigger.current;
    jumpAfterFilter.current = !!st && window.scrollY > st.start + 2;
    setFilter(f);
    const next = filtered(f);
    if (!next.includes(active)) setActive(next[0]);
  };

  // demandes venues d'autres sections : afficher les projets d'un besoin, lancer une présentation
  const latest = useRef({ changeFilter: (_f: Filter) => {}, launch: (_i: number) => {} });
  useEffect(() => {
    const onFilter = (e: Event) => {
      latest.current.changeFilter((e as CustomEvent<Filter>).detail);
      // après la reconstruction de la salle, on amène le visiteur au premier projet retenu.
      // Pendant l'épinglage, la section est toujours en haut de l'écran : on vise donc
      // le début réel de la zone figée, pas la position de la section à l'écran.
      window.setTimeout(() => {
        const st = trigger.current;
        const el = section.current;
        if (st) scrollToY(st.start);
        else if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY);
      }, 80);
    };
    const onLaunch = (e: Event) => {
      const i = projects.findIndex((p) => p.slug === (e as CustomEvent<string>).detail);
      if (i >= 0) latest.current.launch(i);
    };
    window.addEventListener("rn:filter", onFilter);
    window.addEventListener("rn:launch", onLaunch);
    return () => {
      window.removeEventListener("rn:filter", onFilter);
      window.removeEventListener("rn:launch", onLaunch);
    };
  }, []);

  // mobile : carrousel horizontal en perspective. La carte au centre est nette et
  // éclairée (son écran « s'allume »), ses voisines reculent et pivotent légèrement.
  // Mouvement réduit ou desktop sans WebGL : colonne / grille, repère vertical.
  useEffect(() => {
    if (is3d && webgl) return;
    const items = list.map((i) => flat.current[i]).filter(Boolean) as HTMLLIElement[];
    const rail = items[0]?.parentElement;
    const carousel = rail && getComputedStyle(rail).display === "flex";
    if (!carousel || !rail) {
      const io = new IntersectionObserver(
        (entries) => {
          const hit = entries.find((e) => e.isIntersecting);
          if (hit) setFocused(Number((hit.target as HTMLElement).dataset.index));
        },
        { rootMargin: "-45% 0px -45% 0px" },
      );
      items.forEach((el) => io.observe(el));
      return () => io.disconnect();
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = rail.scrollLeft + rail.clientWidth / 2;
      let best = items[0];
      let bestD = Infinity;
      for (const li of items) {
        const c = li.offsetLeft + li.offsetWidth / 2;
        const d = Math.max(-1, Math.min(1, (c - mid) / li.offsetWidth));
        li.style.setProperty("--d", d.toFixed(3));
        li.style.setProperty("--a", Math.abs(d).toFixed(3));
        if (Math.abs(d) < bestD) {
          bestD = Math.abs(d);
          best = li;
        }
      }
      setFocused(Number(best.dataset.index));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    rail.scrollLeft = 0;
    update();
    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      items.forEach((li) => {
        li.style.removeProperty("--d");
        li.style.removeProperty("--a");
      });
    };
  }, [list, is3d, webgl]);

  // Lancer : l'écran est « aspiré », la caméra plonge dedans (0,8 s).
  const launch = (i: number) => {
    const p = projects[i];
    if (!hasPresentation(p.slug) || open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    lockScroll(true);
    if (trigger.current) {
      gsap
        .timeline({ onComplete: () => setOpen(p.slug) })
        .to(drive.current, { tunnel: 1, duration: 0.8, ease: "power3.in" }, 0)
        .to(section.current!.querySelectorAll(".room-text"), { opacity: 0, duration: 0.3 }, 0);
    } else setOpen(p.slug);
  };

  latest.current = { changeFilter, launch };

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
    setTimeout(() => goTo(pos + 1), 650);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter") {
      e.preventDefault();
      launch(active);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(pos + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(pos - 1);
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
      <div className="room-text wrap relative z-10 isolate md:text-center">
        <Ribbon target="#titre-projets" />
        <p className="eyebrow">{t.projectsEyebrow}</p>
        <h2 id="titre-projets" data-reveal-title className="display mt-2 text-[clamp(34px,4.5vw,60px)]">
          <SplitTitle parts={[{ t: t.projectsTitle[0] }, { t: t.projectsTitle[1], em: true }, { t: t.projectsTitle[2] }]} />
        </h2>
        <p id="aide-projets" className="sr-only">
          {t.roomHelp}
        </p>
        <ProjectFilter lang={lang} value={filter} onChange={changeFilter} className="mt-5 md:flex md:justify-center" />
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
          <Room3D images={images} drive={drive} paused={!!open || !onScreen} onPick={(i) => (i === active ? launch(i) : list.includes(i) && goTo(list.indexOf(i)))} />
        </div>
      )}

      {/* place réservée à la salle : sert à mesurer la bande libre */}
      <div ref={stage3d} aria-hidden className="room-3d pointer-events-none relative flex-1" />

      {/* légende de l'écran de face (desktop) */}
      <div className="room-3d room-text room-caption wrap relative z-10 pb-10 text-center" aria-live="polite">
        <span className="eyebrow">
          {pad(pos + 1)} / {pad(m)}
          {filter !== "all" && ` · ${t.tags[filter]}`}
        </span>
        <h3 className="mt-1 text-[clamp(26px,3vw,38px)] font-bold tracking-tight">{current.name}</h3>
        <p className="mx-auto mt-1 max-w-[560px] text-muted">{current.pitch[lang]}</p>
        <p className="mt-2 flex flex-wrap items-center justify-center gap-2 font-mono text-[13px] text-muted">
          {current.tags.map((tag) => (
            <span key={tag} className="pc-tag">
              {t.tags[tag]}
            </span>
          ))}
          {current.tech && <span className="ml-1">{current.tech}</span>}
          {current.href && (
            <a href={current.href} className="text-lime underline decoration-lime/40 underline-offset-4 hover:decoration-lime">
              · {current.hrefLabel?.[lang] ?? current.href} ↗
            </a>
          )}
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <button type="button" className="btn btn-glass !min-h-10 !w-10 justify-center !px-0" onClick={() => goTo(pos - 1)} disabled={pos === 0} aria-label={t.prevProject}>
            ←
          </button>
          {hasPresentation(current.slug) ? (
            <button type="button" className="btn btn-lime" onClick={() => launch(active)}>
              {t.launch}
            </button>
          ) : (
            <button type="button" className="btn btn-glass" disabled>
              {t.soon}
            </button>
          )}
          <button type="button" className="btn btn-glass !min-h-10 !w-10 justify-center !px-0" onClick={() => goTo(pos + 1)} disabled={pos >= m - 1} aria-label={t.nextProject}>
            →
          </button>
        </div>
      </div>

      {/* ===== cartes : colonne sur mobile (sans WebGL ou en mouvement réduit aussi), lues par les lecteurs d'écran sur desktop ===== */}
      <ol className="room-flat">
        {list.map((i) => {
          const p = projects[i];
          return (
            <li
              key={p.slug}
              data-index={i}
              data-focus={focused === i || undefined}
              ref={(el) => {
                flat.current[i] = el;
              }}
            >
              <ProjectCard
                project={p}
                index={i}
                total={n}
                lang={lang}
                focusable={!(is3d && webgl)}
                onLaunch={hasPresentation(p.slug) ? () => launch(i) : undefined}
              />
            </li>
          );
        })}
      </ol>
      <div aria-hidden className="room-dots">
        {list.map((i) => (
          <span key={i} className={focused === i ? "on" : undefined} />
        ))}
      </div>

      {open &&
        createPortal(
        <PresentationHost
          slug={open}
          initialLang={lang}
          projectIndex={projects.findIndex((p) => p.slug === open)}
          project={projects.find((p) => p.slug === open)!}
          onClose={closePresentation}
          onNextProject={pos < m - 1 ? nextProject : undefined}
        />,
        document.body,
      )}
    </section>
  );
}
