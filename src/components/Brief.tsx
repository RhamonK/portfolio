"use client";

import { useRef } from "react";
import { brief } from "@/data/brief";
import { useReveal } from "@/lib/reveal";
import { ui, type Lang } from "@/i18n";

// En bref : une bande de repères entre le Hero et les projets.
// Texte HTML simple ; apparition commune (useReveal), rien en mouvement réduit.
export function Brief({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  return (
    <section ref={root} aria-label={t.briefLabel} className="brief wrap py-16 md:py-20">
      <p className="eyebrow" data-reveal>
        {t.briefEyebrow}
      </p>
      <ul className="brief-list mt-6">
        {brief.map((f) => (
          <li key={f.value + f.label.fr} data-reveal>
            <span className="brief-value">{f.value}</span>
            <span className="brief-label">{f.label[lang]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
