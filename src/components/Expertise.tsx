"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pillars } from "@/data/expertise";
import { projects } from "@/data/projects";
import { filtered } from "@/components/ProjectFilter";
import { SplitTitle } from "@/components/SplitTitle";
import { useReveal } from "@/lib/reveal";
import { showProjects } from "@/lib/events";
import { POSTER_DOT, POSTER_STROKES } from "@/components/core/poster-path";
import { ui, type Lang } from "@/i18n";

// Expertise — une orbite autour de la signature (esprit Active Theory).
// Au centre, le RN ; autour, un anneau qui tourne au défilement et porte les cinq
// piliers. Le pilier qui arrive au point de focus s'allume, un fil lime relie le point
// à sa fiche (outils, preuves, « Voir les projets »).
// Défilement naturel : zone haute + cadre collant (position: sticky), aucun épinglage.
// Mouvement réduit ou sans JavaScript : les cinq fiches en grille, comme avant.

const N = pillars.length;
const R = 220; // rayon de l'anneau (viewBox 600 × 600)
const C = 300;

export function Expertise({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGGElement>(null);
  const outer = useRef<SVGGElement>(null);
  const labels = useRef<(SVGGElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [orbit, setOrbit] = useState(false);
  // mobile : le point de focus est en bas de l'anneau, la fiche dessous
  const [vertical, setVertical] = useState(false);
  useReveal(root);
  const nameOf = (slug: string) => (slug === "portfolio" ? t.thisSite : projects.find((p) => p.slug === slug)?.name ?? slug);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setOrbit(true);
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setVertical(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!orbit) return;
    const el = track.current;
    if (!el) return;
    // la page vient de grandir (zone de l'orbite) : positions des déclencheurs et du Fil à jour
    ScrollTrigger.refresh();
    let raf = 0;
    let shown = -1;
    let target = 0;
    let visible = false;
    // point de focus : à droite sur desktop (le fil part vers la fiche), en bas sur mobile
    const focusAngle = () => (vertical ? Math.PI / 2 : 0);

    const draw = () => {
      raf = 0;
      shown = shown < 0 ? target : shown + (target - shown) * 0.12;
      // position continue dans la liste : 0 … N-1
      const pos = shown * (N - 1);
      const step = (Math.PI * 2) / N;
      const rot = -pos * step; // l'anneau tourne pour amener le pilier courant au focus
      const f = focusAngle();
      ring.current?.setAttribute("transform", `rotate(${(rot * 180) / Math.PI} ${C} ${C})`);
      outer.current?.setAttribute("transform", `rotate(${(-rot * 0.6 * 180) / Math.PI} ${C} ${C})`);
      labels.current.forEach((g, i) => {
        if (!g) return;
        const a = f + rot + i * step;
        const d = Math.abs(i - pos);
        // près du point de focus, le nom se décale pour ne pas croiser le fil
        const lift = Math.max(0, 1 - d) * (vertical ? 0 : -26);
        const x = C + Math.cos(a) * (R + 46);
        const y = C + Math.sin(a) * (R + 46) + lift;
        g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        g.style.opacity = String(Math.max(0.28, 1 - d * 0.5));
      });
      const k = Math.min(N - 1, Math.max(0, Math.round(pos)));
      setActive(k);
      if (Math.abs(target - shown) > 0.0005) raf = requestAnimationFrame(draw);
    };
    const measure = () => {
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      target = Math.max(0, Math.min(1, -r.top / Math.max(1, span)));
      visible = r.top < window.innerHeight && r.bottom > 0;
      if (visible && !raf) raf = requestAnimationFrame(draw);
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [orbit, vertical]);

  /** Clic sur un pilier de l'anneau : défile jusqu'à lui. */
  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (span * i) / (N - 1), behavior: "smooth" });
  };

  const cards = (
    <ol className={orbit ? "xp-cards" : "mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3"}>
      {pillars.map((p, i) => {
        const n = filtered(p.tag).length;
        const on = !orbit || i === active;
        return (
          <li
            key={p.tag}
            data-reveal={orbit ? undefined : ""}
            data-active={orbit && on ? "" : undefined}
            aria-hidden={orbit && !on ? true : undefined}
            className="glass flex flex-col rounded-2xl p-6 md:p-7"
          >
            <span className="eyebrow">
              0{i + 1} <span className="text-ink/40">/ 0{N}</span>
            </span>
            <h3 className="mt-2 text-[26px] font-bold tracking-tight md:text-[32px]">{p.title[lang]}</h3>
            <p className="mt-2 text-muted">{p.text[lang]}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={lang === "fr" ? "Outils" : "Tools"}>
              {p.tools.map((tool) => (
                <li key={tool} className="rounded-full border border-glass-line px-2.5 py-0.5 font-mono text-[12px] text-ink/85">
                  {tool}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[14px] text-muted">
              <span className="text-ink/80">{t.proofsLabel}</span> {p.proofs.map(nameOf).join(", ")}
            </p>
            <div className="mt-auto pt-5">
              <button type="button" tabIndex={orbit && !on ? -1 : undefined} className="btn btn-glass !min-h-10 text-[14px]" onClick={() => showProjects(p.tag)}>
                {t.seeProjectsN(n)}
              </button>
            </div>
          </li>
        );
      })}
    </ol>
  );

  return (
    <section ref={root} id="expertise" aria-labelledby="titre-expertise" className={orbit ? "pt-28" : "py-28"}>
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          {t.expertiseEyebrow}
        </p>
        <h2 id="titre-expertise" data-reveal-title className="display mt-3 text-[clamp(40px,6vw,80px)]">
          <SplitTitle parts={[{ t: t.expertiseTitle[0] }, { t: t.expertiseTitle[1], em: true }, { t: t.expertiseTitle[2] }]} />
        </h2>
        {!orbit && cards}
      </div>

      {orbit && (
        <div ref={track} className="xp-track">
          <div className="xp-stage wrap">
            <div className="xp-orbit" aria-hidden>
              <svg viewBox="0 0 600 600" className="h-full w-full overflow-visible">
                {/* graduations et anneau extérieur (tourne lentement en sens inverse) */}
                <g ref={outer}>
                  <circle cx={C} cy={C} r={R + 18} className="xp-ring-outer" />
                  {Array.from({ length: 72 }, (_, i) => {
                    const a = (i / 72) * Math.PI * 2;
                    const r1 = R + 10;
                    const r2 = R + (i % 6 === 0 ? 26 : 16);
                    return <line key={i} x1={C + Math.cos(a) * r1} y1={C + Math.sin(a) * r1} x2={C + Math.cos(a) * r2} y2={C + Math.sin(a) * r2} className={i % 6 === 0 ? "xp-tick xp-tick-major" : "xp-tick"} />;
                  })}
                </g>
                {/* anneau principal : un repère par pilier */}
                <g ref={ring}>
                  <circle cx={C} cy={C} r={R} className="xp-ring" />
                  {pillars.map((p, i) => {
                    const a = (vertical ? Math.PI / 2 : 0) + (i / N) * Math.PI * 2;
                    return <circle key={p.tag} cx={C + Math.cos(a) * R} cy={C + Math.sin(a) * R} r={4} className="xp-node" />;
                  })}
                </g>
                {/* le RN au centre */}
                <g transform={`translate(${C} ${C}) scale(0.24) translate(-800 -600)`} className="xp-sig">
                  {POSTER_STROKES.map((s, i) => (
                    <path key={`g${i}`} d={s.d} className="xp-sig-glow" />
                  ))}
                  {POSTER_STROKES.map((s, i) => (
                    <path key={i} d={s.d} className="xp-sig-line" />
                  ))}
                  <circle cx={POSTER_DOT.cx} cy={POSTER_DOT.cy} r={POSTER_DOT.r} className="xp-sig-dot" />
                </g>
                {/* point de focus et fil vers la fiche */}
                <g className="xp-focus">
                  <circle cx={vertical ? C : C + R} cy={vertical ? C + R : C} r={11} className="xp-focus-halo" />
                  <circle cx={vertical ? C : C + R} cy={vertical ? C + R : C} r={5} className="xp-focus-dot" />
                  <path
                    key={`${active}-${vertical}`}
                    d={vertical ? `M ${C} ${C + R + 70} L ${C} 680` : `M ${C + R + 12} ${C} L 660 ${C}`}
                    pathLength={1}
                    className="xp-focus-line"
                  />
                </g>
                {/* noms des piliers, qui tournent avec l'anneau */}
                {pillars.map((p, i) => (
                  <g
                    key={p.tag}
                    ref={(g) => {
                      labels.current[i] = g;
                    }}
                    className={`xp-label${i === active ? " is-on" : ""}`}
                    onClick={() => goTo(i)}
                  >
                    <text textAnchor="middle" dominantBaseline="middle">
                      {p.title[lang]}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <div className="xp-panel">{cards}</div>
          </div>
        </div>
      )}
    </section>
  );
}
