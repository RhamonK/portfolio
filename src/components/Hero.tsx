"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site, siteCopy } from "@/data/site";
import { ui, type Lang } from "@/i18n";

gsap.registerPlugin(ScrollTrigger);

// Scène A — l'entrée. Au chargement : un trait lime traverse l'écran,
// les lettres du nom jaillissent en 3D, les rôles se « décodent »,
// les feuilles de CV arrivent du fond. En descendant : les lettres
// explosent et les feuilles passent derrière la caméra, comme si on
// traversait la page pour entrer dans la salle des projets.

const sheets = [
  { x: -150, y: 30, r: -9 },
  { x: 140, y: 10, r: 7 },
  { x: -20, y: -10, r: -2 },
];

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>_";

/** Texte qui se décode lettre par lettre, de gauche à droite. */
function scramble(el: HTMLElement, duration: number, delay: number) {
  const final = el.dataset.text ?? el.textContent ?? "";
  const state = { p: 0 };
  return gsap.to(state, {
    p: 1,
    duration,
    delay,
    ease: "none",
    onStart: () => {
      el.style.visibility = "visible";
    },
    onUpdate: () => {
      const done = Math.floor(state.p * final.length);
      let out = final.slice(0, done);
      for (let i = done; i < final.length; i++) {
        out += final[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
    },
    onComplete: () => {
      el.textContent = final;
    },
  });
}

export function Hero({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const copy = siteCopy[lang];
  const root = useRef<HTMLElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const words = site.name.split(" ");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const letters = gsap.utils.toArray<HTMLElement>(".h-letter");
        const roles = gsap.utils.toArray<HTMLElement>(".h-role");

        // ---------- entrée ----------
        const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
        intro
          .set(".intro-hide", { visibility: "visible" })
          .fromTo(".h-scan", { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.7, ease: "power4.inOut" })
          .to(".h-scan", { scaleY: 40, opacity: 0, duration: 0.5, ease: "power2.in" })
          .from(
            letters,
            {
              yPercent: 120,
              rotateX: -95,
              z: -200,
              opacity: 0,
              filter: "blur(14px)",
              duration: 1.3,
              stagger: { each: 0.045, from: "center" },
              clearProps: "filter",
            },
            "-=0.35",
          )
          // petit sursaut « glitch » en lime, puis tout se pose
          .to(letters, { color: "var(--lime)", skewX: () => gsap.utils.random(-14, 14), duration: 0.06, stagger: { each: 0.012, from: "random" } }, "-=0.55")
          .to(letters, { color: "", skewX: 0, duration: 0.25, stagger: { each: 0.012, from: "random" }, clearProps: "color,skewX" })
          .from(".cv-sheet", { z: 900, y: 120, opacity: 0, rotate: 0, filter: "blur(10px)", duration: 1.4, stagger: 0.1, clearProps: "filter" }, "-=1.1")
          .from(".h-line", { scaleX: 0, duration: 0.9, ease: "power3.inOut" }, "-=1.0")
          .from(".h-cta > *", { y: 30, opacity: 0, scale: 0.9, duration: 0.8, stagger: 0.08, ease: "back.out(2)" }, "-=0.6")
          .from(".h-hint", { opacity: 0, y: -10, duration: 0.6 }, "-=0.3");
        roles.forEach((r, i) => intro.add(scramble(r, 0.9, 0), i === 0 ? "-=1.5" : "-=0.6"));

        // ---------- sortie au défilement ----------
        const out = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
        });
        out
          .to(
            letters,
            {
              x: () => gsap.utils.random(-420, 420),
              y: () => gsap.utils.random(-520, -120),
              z: () => gsap.utils.random(-300, 500),
              rotateX: () => gsap.utils.random(-180, 180),
              rotateZ: () => gsap.utils.random(-120, 120),
              opacity: 0,
              ease: "power2.in",
              stagger: { each: 0.01, from: "edges" },
            },
            0,
          )
          .to(".cv-sheet", { z: 1100, opacity: 0, ease: "power2.in", stagger: 0.04 }, 0)
          .to(".h-sub", { y: -80, opacity: 0, filter: "blur(8px)", ease: "power1.in" }, 0)
          .to(".h-glow", { scale: 2.6, opacity: 0.9, ease: "none" }, 0)
          .to(".h-hint", { opacity: 0, duration: 0.2 }, 0);
      });

      // la scène suit la souris : inclinaison 3D + projecteur lime
      mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
        const rx = gsap.quickTo(tilt.current, "rotationX", { duration: 0.8, ease: "power3" });
        const ry = gsap.quickTo(tilt.current, "rotationY", { duration: 0.8, ease: "power3" });
        const sx = gsap.quickTo(top.current, "rotationY", { duration: 0.6, ease: "power3" });
        const sy = gsap.quickTo(top.current, "rotationX", { duration: 0.6, ease: "power3" });
        const el = root.current!;
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          ry(nx * 10);
          rx(-ny * 8);
          sx(nx * 18);
          sy(-ny * 14);
          el.style.setProperty("--mx", `${e.clientX}px`);
          el.style.setProperty("--my", `${e.clientY}px`);
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
      className="hero relative flex min-h-[100svh] items-center overflow-hidden pt-16"
    >
      {/* projecteur qui suit la souris */}
      <div aria-hidden className="hero-spot pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="h-glow pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/10 blur-[120px]"
      />
      {/* trait de balayage de l'intro */}
      <div aria-hidden className="h-scan pointer-events-none absolute inset-x-0 top-1/2 h-px origin-center bg-lime opacity-0 shadow-[0_0_24px_4px_rgba(212,255,58,0.6)]" />

      {/* feuilles de CV en verre */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center [perspective:1200px] [transform-style:preserve-3d]">
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

      <div className="wrap relative z-10 text-center [perspective:1000px]">
        <div ref={tilt} className="[transform-style:preserve-3d]">
          <h1
            id="titre-accueil"
            aria-label={site.name}
            className="intro-hide display text-[clamp(52px,11vw,160px)] [text-shadow:0_8px_60px_rgba(10,11,10,0.9)] [transform-style:preserve-3d]"
          >
            {words.map((w, wi) => (
              <span key={wi} aria-hidden className="inline-block whitespace-nowrap [transform-style:preserve-3d]">
                {Array.from(w).map((c, ci) => (
                  <span key={ci} className="h-letter inline-block [transform-style:preserve-3d]">
                    {c}
                  </span>
                ))}
                {wi < words.length - 1 && <span className="inline-block w-[0.28em]" />}
              </span>
            ))}
          </h1>
        </div>
        <div className="h-sub">
          <div aria-hidden className="h-line mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-lime to-transparent" />
          <p className="mx-auto mt-6 max-w-[720px] font-mono text-[clamp(14px,1.6vw,18px)] uppercase tracking-[0.12em] text-ink/80">
            <span className="h-role intro-hide" data-text={copy.role}>
              {copy.role}
            </span>
            <span className="text-lime"> · </span>
            <span className="h-role intro-hide" data-text={copy.position}>
              {copy.position}
            </span>
          </p>
          <div className="h-cta mt-10 flex flex-wrap justify-center gap-3">
            <a href="#projets" className="btn btn-lime">
              {t.seeProjects}
            </a>
            <a href={site.cv[lang]} download className="btn btn-glass">
              {t.downloadCv}
            </a>
          </div>
        </div>
      </div>

      <p className="h-hint eyebrow absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 text-center !text-ink/70">
        <span aria-hidden className="scroll-mouse" />
        {t.hint}
      </p>
    </section>
  );
}
