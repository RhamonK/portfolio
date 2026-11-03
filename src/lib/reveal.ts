"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Langage d'apparition commun à toutes les sections (une seule fois, jamais à rebours) :
// - [data-reveal-title] : ses .rv-word montent un par un depuis leur masque ;
// - [data-reveal]       : fondu montant léger.
// Mouvement réduit : rien n'est caché ni animé.
export const REVEAL = {
  words: { duration: 1.3, stagger: 0.07, ease: "power3.out" },
  items: { duration: 1.1, ease: "power2.out", y: 32 },
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
            // le mot monte de son masque et sort d'un léger flou : posé, sans rebond
            { yPercent: 100, opacity: 0, filter: "blur(6px)" },
            {
              yPercent: 0,
              opacity: 1,
              filter: "blur(0px)",
              ...REVEAL.words,
              immediateRender: true,
              clearProps: "transform,opacity,filter",
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
