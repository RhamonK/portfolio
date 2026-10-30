import type Lenis from "lenis";

// Accès partagé à l'instance Lenis (null si le mouvement est réduit).
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y, { duration: 0.9 });
  else window.scrollTo({ top: y });
}
