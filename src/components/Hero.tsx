"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site, siteCopy } from "@/data/site";
import { ui, type Lang } from "@/i18n";
import { InfinityCore, type InfinityCoreHandle } from "@/components/core/InfinityCore";

gsap.registerPlugin(ScrollTrigger);

// Scène A — l'entrée, INFINITE — R.N.
// Deux zones qui ne se chevauchent jamais : le noyau (en haut sur mobile, à droite
// sur desktop) et le texte. Tout le contenu est dans le HTML dès le chargement.
//
// Intro (une fois par session, 5,5 s, posée ; « Passer » disponible tout de suite) :
//   0,0–1,0 s  un point de lumière respire ; la scène, vue de biais, entame un lent quart de tour
//   1,0–3,6 s  une pointe de lumière écrit la signature RN (étincelles)
//   1,8–4,0 s  le verre se forme autour du trait
//   3,2–5,5 s  le nom se révèle, rôles, « Infinite — R.N. », boutons, indice
// Défiler, toucher l'écran ou appuyer sur une touche termine l'intro aussitôt.

const INTRO_KEY = "rn-intro-vue";
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>_";

/** Texte qui se décode lettre par lettre, de gauche à droite. */
function scramble(el: HTMLElement, duration: number) {
  const final = el.dataset.text ?? el.textContent ?? "";
  const state = { p: 0 };
  return gsap.to(state, {
    p: 1,
    duration,
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
  const core = useRef<InfinityCoreHandle>(null);
  const finishRef = useRef<() => void>(() => {});
  const [intro, setIntro] = useState(false);
  const [tracing, setTracing] = useState(false);
  const words = site.name.split(" ");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_KEY) === "1";
    } catch {
      /* stockage indisponible : on joue l'intro */
    }

    const ctx = gsap.context(() => {
      const endIntroClass = () => document.documentElement.classList.remove("intro");
      if (reduced || seen) {
        endIntroClass();
        gsap.set(".intro-hide", { visibility: "visible" });
        core.current?.setDraw(1);
      } else {
        try {
          sessionStorage.setItem(INTRO_KEY, "1");
        } catch {
          /* rien */
        }
        setIntro(true);
        setTracing(true);
        core.current?.setDraw(0);

        const letters = gsap.utils.toArray<HTMLElement>(".h-letter");
        const roles = gsap.utils.toArray<HTMLElement>(".h-role");
        const trace = { d: 0 };
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => finishRef.current(),
        });
        // fromTo partout : valeurs d'arrivée explicites (un from() relit l'état courant,
        // que la transition CSS de survol des lettres fausse).
        // 1. un point de lumière respire (CSS), la scène est vue de biais et fait un lent quart de tour
        tl.fromTo(".h-turn", { rotateY: -26, rotateX: 7, scale: 0.94 }, { rotateY: 0, rotateX: 0, scale: 1, duration: 4.4, ease: "sine.inOut", clearProps: "transform" }, 0)
          // 2. une pointe de lumière écrit la signature
          .to(trace, { d: 1, duration: 2.6, ease: "sine.inOut", onUpdate: () => core.current?.setDraw(trace.d) }, 1.0)
          // 3. le verre se forme autour du trait
          .fromTo(
            ".core-glass",
            { opacity: 0.06, filter: "blur(14px)", scale: 1.08 },
            { opacity: 1, filter: "blur(0px)", scale: 1, duration: 2.2, ease: "power2.out", immediateRender: true, clearProps: "filter,transform" },
            1.8,
          )
          .add(() => {
            setTracing(false);
            endIntroClass();
          }, 3.75)
          // 4. le nom se révèle, posément
          .set(".intro-hide", { visibility: "visible" }, 3.2)
          .fromTo(
            letters,
            { yPercent: 55, opacity: 0, filter: "blur(8px)", transition: "none" },
            {
              yPercent: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 1.3,
              stagger: { each: 0.05, from: "start" },
              immediateRender: true,
              // on rend la main au CSS (effet de survol des lettres)
              clearProps: "transform,opacity,filter,transition",
            },
            3.2,
          )
          .fromTo(".h-eyebrow", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, immediateRender: true, clearProps: "transform,opacity" }, 3.6)
          .fromTo(".h-line", { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power3.inOut", immediateRender: true, clearProps: "transform" }, 3.8)
          .fromTo(".h-roles", { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: true, clearProps: "opacity" }, 3.9)
          .fromTo(
            ".h-cta > *",
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, immediateRender: true, clearProps: "transform,opacity" },
            4.4,
          )
          .fromTo(".h-hint", { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.7, immediateRender: true, clearProps: "transform,opacity" }, 4.8);
        roles.forEach((r, i) => tl.add(scramble(r, 0.8), 3.9 + i * 0.3));

        // fin immédiate : bouton « Passer », défilement, toucher, clavier
        finishRef.current = () => {
          if (tl.progress() < 1) tl.progress(1);
          // lettres posées net : sans quoi la transition CSS de survol les ferait rebondir depuis -90°
          letters.forEach((el) => {
            el.style.transition = "none";
            el.style.transform = "";
          });
          void document.body.offsetHeight;
          requestAnimationFrame(() => letters.forEach((el) => (el.style.transition = "")));
          core.current?.setDraw(1);
          setTracing(false);
          setIntro(false);
          endIntroClass();
          gsap.set(".intro-hide", { visibility: "visible" });
          gsap.set(".core-glass, .h-turn, .h-text > *", { clearProps: "filter,transform,opacity" });
          events.forEach((ev) => window.removeEventListener(ev, onUser));
        };
        const onUser = () => finishRef.current();
        const events = ["wheel", "touchstart", "keydown"] as const;
        events.forEach((ev) => window.addEventListener(ev, onUser, { passive: true, once: true }));
      }

      // sortie au défilement : le noyau recule, le texte s'éloigne (scroll naturel, sans épinglage)
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.5 } })
          .to(".h-core-inner", { scale: 0.86, opacity: 0.2, yPercent: -10, ease: "none" }, 0)
          .to(".h-text", { yPercent: -12, opacity: 0.4, ease: "none" }, 0)
          .to(".h-hint", { opacity: 0, duration: 0.15 }, 0);
      });
    }, root);

    return () => {
      finishRef.current = () => {};
      ctx.revert();
    };
  }, []);

  const skip = () => {
    finishRef.current();
    root.current?.querySelector<HTMLElement>(".h-cta a")?.focus();
  };

  return (
    <section
      ref={root}
      id="accueil"
      aria-labelledby="titre-accueil"
      className="hero relative flex min-h-[100svh] items-center overflow-hidden pt-14 md:pt-16"
    >
      <div className="wrap grid w-full items-center gap-4 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-10 md:py-10">
        {/* ===== noyau ===== */}
        <div className="h-core md:order-2">
          <div className="h-core-inner mx-auto w-full max-w-[calc(34svh*4/3)] [@media(max-height:700px)]:max-w-[calc(27svh*4/3)] md:max-w-none md:[@media(max-height:700px)]:max-w-none">
            {/* la scène : une carte cadrée où l'objet vit */}
            <div className="h-stage [perspective:1100px]">
              <div className="h-turn">
                <InfinityCore ref={core} tracing={tracing} defer={intro} />
              </div>
            </div>
          </div>
        </div>

        {/* ===== texte ===== */}
        <div className="h-text md:order-1">
          <p className="h-eyebrow eyebrow flex items-baseline gap-2">
            <span className="font-serif text-[22px] italic leading-none text-ink">Infinite</span>
            <span aria-hidden className="text-lime">—</span>
            <span>R.N.</span>
          </p>
          <h1
            id="titre-accueil"
            aria-label={site.name}
            className="intro-hide display mt-3 text-[clamp(46px,13.5vw,64px)] [perspective:900px] md:text-[clamp(64px,7.2vw,124px)]"
          >
            {words.map((w, wi) => (
              <span key={wi} aria-hidden className="block whitespace-nowrap [transform-style:preserve-3d]">
                {Array.from(w).map((c, ci) => (
                  <span key={ci} className="h-letter inline-block">
                    {c}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <div aria-hidden className="h-line mt-5 h-px w-32 origin-left bg-gradient-to-r from-lime to-transparent" />
          <p className="h-roles mt-4 max-w-[560px] font-mono text-[13px] uppercase leading-relaxed tracking-[0.12em] text-ink/80 md:text-[15px]">
            <span className="h-role intro-hide" data-text={copy.role}>
              {copy.role}
            </span>
            <span className="text-lime"> · </span>
            <span className="h-role intro-hide" data-text={copy.position}>
              {copy.position}
            </span>
          </p>
          <div className="h-cta mt-7 flex flex-wrap gap-3">
            <a href="#projets" className="btn btn-lime">
              {t.seeProjects}
            </a>
            <a href={site.cv[lang]} download className="btn btn-glass">
              {t.downloadCv}
            </a>
          </div>
        </div>
      </div>

      <p className="h-hint eyebrow pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-3 text-center !text-ink/70">
        <span aria-hidden className="scroll-mouse hidden md:block" />
        {/* mobile : pas de molette ni de salle 3D (carrousel plat) */}
        <span className="md:hidden">{t.hintTouch}</span>
        <span className="hidden md:inline">{t.hint}</span>
      </p>

      {intro && (
        <button
          type="button"
          onClick={skip}
          className="btn btn-glass absolute right-4 top-[calc(3.5rem+12px)] z-20 !min-h-10 !px-4 text-[14px] md:right-6 md:top-[calc(4rem+16px)]"
        >
          {t.skipIntro} →
        </button>
      )}
    </section>
  );
}
