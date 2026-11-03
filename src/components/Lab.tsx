"use client";

import { useRef } from "react";
import { lab, type LabItem } from "@/data/lab";
import { SplitTitle } from "@/components/SplitTitle";
import { useReveal } from "@/lib/reveal";
import { launchPresentation } from "@/lib/events";
import { ui, type Lang } from "@/i18n";

// Le labo : expérimentations réelles, chacune avec une action utile
// (voir en action, lancer une présentation, lire le code).
export function Lab({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} id="labo" aria-labelledby="titre-labo" className="py-28">
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          {t.labEyebrow}
        </p>
        <h2 id="titre-labo" data-reveal-title className="display mt-3 text-[clamp(40px,6vw,80px)]">
          <SplitTitle parts={[{ t: t.labTitle[0] }, { t: t.labTitle[1], em: true }, { t: t.labTitle[2] }]} />
        </h2>
        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {lab.map((item) => (
            <li key={item.id} data-reveal>
              <LabCard item={item} lang={lang} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function LabCard({ item, lang }: { item: LabItem; lang: Lang }) {
  const a = item.action;
  return (
    <article className="glass flex h-full flex-col overflow-hidden rounded-2xl">
      {item.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image} alt="" loading="lazy" decoding="async" width={1040} height={650} className="aspect-[16/10] w-full object-cover" />
      )}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="eyebrow">{item.year}</p>
        <h3 className="mt-1 text-[24px] font-bold tracking-tight">{item.name[lang]}</h3>
        <p className="mt-2 text-muted">{item.text[lang]}</p>
        <p className="mt-3 font-mono text-[12px] text-ink/70">{item.tech.join(" · ")}</p>
        <div className="mt-auto pt-5">
          {a.kind === "presentation" ? (
            <button type="button" className="btn btn-lime" onClick={() => launchPresentation(a.slug)}>
              {a.label[lang]}
            </button>
          ) : (
            <a href={a.href} className="btn btn-glass">
              {a.label[lang]}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
