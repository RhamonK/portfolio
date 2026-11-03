"use client";

import { useRef } from "react";
import { pillars } from "@/data/expertise";
import { projects } from "@/data/projects";
import { filtered } from "@/components/ProjectFilter";
import { SplitTitle } from "@/components/SplitTitle";
import { useReveal } from "@/lib/reveal";
import { showProjects } from "@/lib/events";
import { ui, type Lang } from "@/i18n";

// Expertise : cinq piliers, chacun relié à ses preuves. « Voir les projets » remonte
// à la section Projets avec le filtre correspondant déjà appliqué.
export function Expertise({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const nameOf = (slug: string) => (slug === "portfolio" ? t.thisSite : projects.find((p) => p.slug === slug)?.name ?? slug);

  return (
    <section ref={root} id="expertise" aria-labelledby="titre-expertise" className="py-28">
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          {t.expertiseEyebrow}
        </p>
        <h2 id="titre-expertise" data-reveal-title className="display mt-3 text-[clamp(40px,6vw,80px)]">
          <SplitTitle parts={[{ t: t.expertiseTitle[0] }, { t: t.expertiseTitle[1], em: true }, { t: t.expertiseTitle[2] }]} />
        </h2>
        <ol className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => {
            const n = filtered(p.tag).length;
            return (
              <li key={p.tag} data-reveal className="glass flex flex-col rounded-2xl p-6 md:p-7">
                <span className="eyebrow">0{i + 1}</span>
                <h3 className="mt-2 text-[26px] font-bold tracking-tight">{p.title[lang]}</h3>
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
                  <button type="button" className="btn btn-glass !min-h-10 text-[14px]" onClick={() => showProjects(p.tag)}>
                    {t.seeProjectsN(n)}
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
