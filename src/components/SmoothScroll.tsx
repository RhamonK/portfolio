"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/scroll";

// Défilement doux (Lenis) synchronisé avec GSAP ScrollTrigger.
// Désactivé si le visiteur préfère moins de mouvement.
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    // Ancres : animation à durée fixe. Avec l'interpolation par défaut, l'animation pouvait
    // ne jamais se terminer (position cible décimale) et écrasait ensuite tout autre défilement.
    const lenis = new Lenis({ anchors: { duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) } });
    // positions recalculées une fois les polices chargées (les titres changent de hauteur)
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
