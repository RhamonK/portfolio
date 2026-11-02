"use client";

import { useRef } from "react";
import { CvButtons } from "@/components/CvButtons";
import { SplitTitle } from "@/components/SplitTitle";
import { useReveal } from "@/lib/reveal";
import { site, siteCopy } from "@/data/site";
import { ui, type Lang } from "@/i18n";

// Scène E — contact et CV.
export function Contact({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  return (
    <section ref={root} id="contact" aria-labelledby="titre-contact" className="py-28">
      <div className="wrap grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
        <h2 id="titre-contact" data-reveal-title className="display text-[clamp(40px,6vw,80px)]">
          <SplitTitle parts={[{ t: t.contactTitle[0] }, { t: t.contactTitle[1], em: true }, { t: t.contactTitle[2] }]} />
        </h2>
        <div className="glass rounded-3xl p-7 md:p-9" data-reveal>
          <p className="eyebrow">
            <span className="text-lime">●</span> {siteCopy[lang].availability}
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-5 block break-all text-[22px] font-bold hover:text-lime"
          >
            {site.email}
          </a>
          <CvButtons lang={lang} className="mt-6" />
          <ul className="mt-6 space-y-1 font-mono text-[14px] text-muted">
            <li>
              <a href={site.links.github} className="hover:text-ink">github.com/RhamonK</a>
            </li>
            <li>
              <a href={site.links.kelthen} className="hover:text-ink">kelthen.com</a>
            </li>
            <li>
              {site.location} · {site.languages}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
