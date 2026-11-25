"use client";

import { useRef } from "react";
import { skills } from "@/data/brief";
import { SplitTitle } from "@/components/SplitTitle";
import { useReveal } from "@/lib/reveal";
import { ui, type Lang } from "@/i18n";

// Ce que je sais faire : six domaines, du front-end à l'agent IA.
// Juste après le Hero : en dix secondes, on voit l'étendue du profil.
export function Brief({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  return (
    <section ref={root} id="talents" aria-labelledby="titre-talents" className="wrap py-24 md:py-28">
      <p className="eyebrow" data-reveal>
        {t.skillsEyebrow}
      </p>
      <h2 id="titre-talents" data-reveal-title className="display mt-3 text-[clamp(34px,6vw,80px)]">
        <SplitTitle parts={[{ t: t.skillsTitle[0] }, { t: t.skillsTitle[1], em: true }, { t: t.skillsTitle[2] }]} />
      </h2>
      <p className="mt-4 max-w-[680px] text-[18px] text-ink/85" data-reveal>
        {t.skillsIntro}
      </p>
      <ul className="sl-grid mt-12">
        {skills.map((s, i) => (
          <li key={s.title.fr} data-reveal className="sl-card">
            <span className="sl-num">0{i + 1}</span>
            <h3 className="sl-title">{s.title[lang]}</h3>
            <p className="sl-pitch">{s.pitch[lang]}</p>
            <ul className="sl-tools" aria-label={s.title[lang]}>
              {s.tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p className="sl-learn mt-8" data-reveal>
        {t.skillsLearn}
      </p>
    </section>
  );
}
