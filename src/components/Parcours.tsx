"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { parcours } from "@/data/parcours";
import { SplitTitle } from "@/components/SplitTitle";
import { useReveal } from "@/lib/reveal";
import { ui, type Lang } from "@/i18n";

// Scène D — mur de musée. Le Fil INFINITE (marge gauche) remplace l'ancienne frise ;
// chaque cadre apparaît et s'allume à son passage, une seule fois.
export function Parcours({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useEffect(() => {
    const frames = root.current?.querySelectorAll<HTMLElement>(".museum-frame") ?? [];
    const triggers = [...frames].map((frame) =>
      ScrollTrigger.create({ trigger: frame, start: "top 72%", once: true, onEnter: () => frame.classList.add("is-lit") }),
    );
    return () => triggers.forEach((st) => st.kill());
  }, []);

  return (
    <section ref={root} id="parcours" aria-labelledby="titre-parcours" className="py-28">
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          {t.pathEyebrow}
        </p>
        <h2 id="titre-parcours" data-reveal-title className="display mt-3 text-[clamp(44px,6.5vw,88px)]">
          <SplitTitle parts={[{ t: t.pathTitle, em: true }]} />
        </h2>
        <ol className="mt-16 space-y-10 md:space-y-14">
          {parcours.map((s) => (
            <li key={s.org} data-reveal>
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
    </section>
  );
}
