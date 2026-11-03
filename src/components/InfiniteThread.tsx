"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToY } from "@/lib/scroll";
import { ui, type Lang } from "@/i18n";

// Le Fil INFINITE : le trait lumineux du noyau se prolonge dans la marge gauche
// et se remplit au défilement. Il indique où l'on est dans la page.
// - Desktop (≥ 1024 px) : repères 01-06 cliquables, libellé au survol / sur la section active.
// - Mobile : une ligne fine dans la gouttière, sans repères (rien ne masque le contenu).
// Calcul quasi nul : une variable CSS mise à jour au défilement (un rAF au plus par image).

const SECTIONS = ["accueil", "projets", "expertise", "labo", "parcours", "contact"] as const;

export function InfiniteThread({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const labels: Record<(typeof SECTIONS)[number], string> = {
    accueil: t.threadHome,
    projets: t.nav.projects,
    expertise: t.nav.expertise,
    labo: t.labNav,
    parcours: t.nav.path,
    contact: t.nav.contact,
  };
  const root = useRef<HTMLDivElement>(null);
  const [marks, setMarks] = useState<{ id: string; at: number; top: number }[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    // position de chaque section, en fraction de la longueur défilable
    const measure = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setMarks(
        SECTIONS.map((id) => {
          const s = document.getElementById(id);
          const top = s ? s.getBoundingClientRect().top + window.scrollY : 0;
          return { id, top, at: Math.min(1, top / max) };
        }),
      );
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      el.style.setProperty("--p", p.toFixed(4));
      // section active : la dernière dont le haut est passé au tiers de l'écran
      const y = window.scrollY + window.innerHeight / 3;
      let a = 0;
      SECTIONS.forEach((id, i) => {
        const s = document.getElementById(id);
        if (s && s.getBoundingClientRect().top + window.scrollY <= y) a = i;
      });
      setActive(a);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    // l'épinglage de la salle des projets change la longueur de la page
    ScrollTrigger.addEventListener("refresh", measure);
    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(document.body);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      ScrollTrigger.removeEventListener("refresh", measure);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const go = (top: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToY(top);
  };

  return (
    <div ref={root} className="infinite-thread" style={{ ["--p" as string]: 0 }}>
      {/* trait (décoratif) */}
      <div aria-hidden className="thread-track">
        <div className="thread-fill" />
        <div className="thread-head" />
      </div>
      {/* repères cliquables (desktop) */}
      <nav aria-label={t.threadLabel} className="thread-marks">
        <ol>
          {marks.map((m, i) => (
            <li key={m.id} style={{ top: `calc(var(--thread-top) + (100% - var(--thread-top) - var(--thread-bottom)) * ${m.at})` }}>
              <a
                href={`#${m.id}`}
                onClick={go(m.top)}
                aria-label={`0${i + 1} ${labels[m.id as keyof typeof labels]}`}
                aria-current={i === active ? "location" : undefined}
                className={i === active ? "is-active" : undefined}
              >
                <span className="thread-dot" aria-hidden />
                <span className="thread-num">0{i + 1}</span>
                <span className="thread-label">{labels[m.id as keyof typeof labels]}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
