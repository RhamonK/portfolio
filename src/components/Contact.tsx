"use client";

import { useRef } from "react";
import { CvButtons } from "@/components/CvButtons";
import { SplitTitle } from "@/components/SplitTitle";
import { useReveal } from "@/lib/reveal";
import { site, siteCopy } from "@/data/site";
import { ui, type Lang } from "@/i18n";

// Scène E — Travaillons ensemble : trois voies claires (poste, mission, projet
// d'entreprise via Kelthen), puis les coordonnées. L'ancre reste #contact.
export function Contact({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  return (
    <section ref={root} id="contact" aria-labelledby="titre-contact" className="py-28">
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          <span className="text-lime">●</span> {siteCopy[lang].availability}
        </p>
        <h2 id="titre-contact" data-reveal-title className="display mt-3 text-[clamp(40px,6vw,80px)]">
          <SplitTitle parts={[{ t: t.togetherTitle[0] }, { t: t.togetherTitle[1], em: true }, { t: t.togetherTitle[2] }]} />
        </h2>

        <ul className="mt-14 grid gap-4 md:grid-cols-3">
          <li data-reveal className="glass flex flex-col rounded-2xl p-6 md:p-7">
            <h3 className="text-[22px] font-bold tracking-tight">{t.wayJob}</h3>
            <p className="mt-2 text-muted">{t.wayJobText}</p>
            <CvButtons lang={lang} className="mt-auto pt-5" />
          </li>
          <li data-reveal className="glass flex flex-col rounded-2xl p-6 md:p-7">
            <h3 className="text-[22px] font-bold tracking-tight">{t.wayMission}</h3>
            <p className="mt-2 text-muted">{t.wayMissionText}</p>
            <div className="mt-auto pt-5">
              <a href={`mailto:${site.email}`} className="block break-all text-[18px] font-bold hover:text-lime">
                {site.email}
              </a>
              <a href={`mailto:${site.email}`} className="btn btn-lime mt-4">
                {t.writeMe} →
              </a>
            </div>
          </li>
          <li data-reveal className="glass flex flex-col rounded-2xl p-6 md:p-7">
            <h3 className="text-[22px] font-bold tracking-tight">{t.wayCompany}</h3>
            <p className="mt-2 text-muted">{t.wayCompanyText}</p>
            <div className="mt-auto pt-5">
              <a href={site.links.kelthen} className="btn btn-glass">
                kelthen.com ↗
              </a>
            </div>
          </li>
        </ul>

        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[14px] text-muted" data-reveal>
          <li>
            <a href={site.links.github} className="hover:text-ink">github.com/RhamonK</a>
          </li>
          <li>
            {site.location} · {site.languages}
          </li>
        </ul>
      </div>
    </section>
  );
}
