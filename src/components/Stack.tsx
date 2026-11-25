"use client";

import { useRef, useState } from "react";
import { bricks, layers } from "@/data/stack";
import { projects } from "@/data/projects";
import { SplitTitle } from "@/components/SplitTitle";
import { useReveal } from "@/lib/reveal";
import { ui, type Lang } from "@/i18n";

// « Comment ça tourne » : une réservation Studio Nala traverse cinq briques
// (interface → API → SQL → agent IA → n8n). Une lumière parcourt les fils ;
// toucher une brique affiche ce qu'elle fait et son code. Dessous, la stack en couches.
// Tout est du HTML : boutons à bascule (aria-pressed), code en <pre>.
// Mouvement réduit : la lumière ne se déplace pas.
export function Stack({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const root = useRef<HTMLElement>(null);
  const [sel, setSel] = useState(2);
  useReveal(root);
  const cur = bricks[sel];
  const nameOf = (slug: string) => projects.find((p) => p.slug === slug)?.name ?? slug;

  // ce que fait la brique choisie et son code ; affiché sous le schéma (desktop)
  // ou juste sous la brique touchée (mobile) : une seule version est visible à la fois
  const detail = (where: "below" | "inline") => (
    <div className={`sk-detail sk-${where}`} aria-live={where === "below" ? "polite" : undefined}>
      <div className="sk-what">
        <p className="font-mono text-[12px] text-lime">
          {t.stackStep(sel + 1, bricks.length)} · {cur.tech}
        </p>
        <h3 className="mt-2 text-[28px] font-bold tracking-tight">{cur.name[lang]}</h3>
        <p className="mt-2 text-muted">{cur.what[lang]}</p>
        <p className="mt-auto pt-5 font-mono text-[12px] text-muted">{t.stackProof}</p>
      </div>
      <figure className="sk-code">
        <figcaption>
          <span aria-hidden className="sk-dots">
            <i />
            <i />
            <i />
          </span>
          {cur.file}
          <span className="sk-note">{t.stackSimplified}</span>
        </figcaption>
        <pre>
          <code>{cur.code}</code>
        </pre>
      </figure>
    </div>
  );

  return (
    <section ref={root} id="capot" aria-labelledby="titre-capot" className="py-28">
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          {t.stackEyebrow}
        </p>
        <h2 id="titre-capot" data-reveal-title className="display mt-3 text-[clamp(40px,6vw,80px)]">
          <SplitTitle parts={[{ t: t.stackTitle[0] }, { t: t.stackTitle[1], em: true }, { t: t.stackTitle[2] }]} />
        </h2>
        <p className="mt-4 max-w-[640px] text-muted" data-reveal>
          {t.stackIntro}
        </p>

        <ol className="sk-flow mt-12" aria-label={t.stackFlowLabel} data-reveal>
          {bricks.map((b, i) => (
            <li key={b.file} style={{ "--k": i } as React.CSSProperties}>
              {i > 0 && (
                <span aria-hidden className="sk-wire">
                  <i />
                </span>
              )}
              <button type="button" aria-pressed={i === sel} className={`sk-brick${i === sel ? " is-on" : ""}`} onClick={() => setSel(i)}>
                <span className="sk-layer">
                  0{i + 1} · {b.layer[lang]}
                </span>
                <span className="sk-name">{b.name[lang]}</span>
                <span className="sk-tech">{b.tech}</span>
              </button>
              {i === sel && detail("inline")}
            </li>
          ))}
        </ol>

        {detail("below")}

        <p className="eyebrow mt-20" data-reveal>
          {t.stackLayers}
        </p>
        <ul className="sk-layers mt-4">
          {layers.map((l, i) => (
            <li key={l.tools} data-reveal className={i === sel ? "is-on" : undefined} style={{ "--k": i } as React.CSSProperties}>
              <span className="sk-layer">{l.layer[lang]}</span>
              <span className="sk-tools">{l.tools}</span>
              <span className="sk-proofs">{l.proofs.map(nameOf).join(", ")}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
