"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { parcours } from "@/data/parcours";
import { ui, type Lang } from "@/i18n";

// Scène D — mur de musée. La frise lime se dessine au défilement
// et chaque cadre s'allume à son passage.
export function Parcours({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".frise",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: ".frise-list", start: "top 75%", end: "bottom 55%", scrub: true },
          },
        );
        gsap.utils.toArray<HTMLElement>(".museum-frame").forEach((frame) => {
          gsap.set(frame, { opacity: 0.25, y: 40 });
          ScrollTrigger.create({
            trigger: frame,
            start: "top 72%",
            onEnter: () => {
              frame.classList.add("is-lit");
              gsap.to(frame, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
            },
            onLeaveBack: () => {
              frame.classList.remove("is-lit");
              gsap.to(frame, { opacity: 0.25, y: 40, duration: 0.4 });
            },
          });
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="parcours" aria-labelledby="titre-parcours" className="py-28">
      <div className="wrap">
        <p className="eyebrow">{t.pathEyebrow}</p>
        <h2 id="titre-parcours" className="display mt-3 text-[clamp(40px,6vw,80px)]">
          {t.pathTitle}
        </h2>
        <div className="frise-list relative mt-16 pl-8 md:pl-14">
          <div aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-white/10" />
          <div
            aria-hidden
            className="frise absolute bottom-0 left-0 top-0 w-[2px] origin-top bg-lime shadow-[0_0_14px_rgba(212,255,58,0.7)]"
          />
          <ol className="space-y-16">
            {parcours.map((s) => (
              <li key={s.org} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-8 top-8 h-3 w-3 -translate-x-1/2 rounded-full bg-lime md:-left-14"
                />
                <article className="museum-frame glass rounded-2xl p-2.5">
                  <div className="rounded-xl border border-white/10 p-6 md:p-9">
                    <p className="eyebrow">
                      {s.period[lang]} · {s.place}
                    </p>
                    <h3 className="mt-3 text-[clamp(22px,2.6vw,32px)] font-bold leading-tight tracking-tight">
                      {s.title[lang]}
                    </h3>
                    <p className="mt-1 text-[18px] text-lime">
                      {s.href ? (
                        <a href={s.href} className="hover:underline">
                          {s.org}
                        </a>
                      ) : (
                        s.org
                      )}
                    </p>
                    <p className="mt-3 max-w-[640px] text-muted">{s.text[lang]}</p>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
