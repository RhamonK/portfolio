"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Langage d'apparition commun à toutes les sections (une seule fois, jamais à rebours) :
// - [data-reveal-title] : ses .rv-word montent un par un depuis leur masque ;
// - [data-reveal]       : fondu montant léger.
// Mouvement réduit : rien n'est caché ni animé.
export const REVEAL = {
  words: { duration: 1, stagger: 0.06, ease: "expo.out" },
  items: { duration: 0.9, ease: "power3.out", y: 28 },
} as const;

export function useReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        el.querySelectorAll<HTMLElement>("[data-reveal-title]").forEach((title) => {
          gsap.fromTo(
            title.querySelectorAll(".rv-word"),
            { yPercent: 110, rotate: 4 },
            {
              yPercent: 0,
              rotate: 0,
              ...REVEAL.words,
              immediateRender: true,
              clearProps: "transform",
              scrollTrigger: { trigger: title, start: "top 88%", once: true },
            },
          );
        });
        el.querySelectorAll<HTMLElement>("[data-reveal]").forEach((item) => {
          gsap.fromTo(
            item,
            { y: REVEAL.items.y, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: REVEAL.items.duration,
              ease: REVEAL.items.ease,
              immediateRender: true,
              clearProps: "transform,opacity",
              scrollTrigger: { trigger: item, start: "top 90%", once: true },
            },
          );
        });
      });
    }, el);
    return () => ctx.revert();
  }, [root]);
}
