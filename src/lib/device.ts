// Choix du niveau de rendu d'INFINITY CORE selon l'appareil.
// 3 : 3D complète (ordinateur, pointeur précis)
// 2 : 3D allégée (téléphone ordinaire) — repasse en 1 si les images / s chutent
// 1 : image fixe + trait animé en SVG (appareil faible, économie de données, pas de WebGL)
// 0 : image fixe sans animation (mouvement réduit)

export type CoreTier = 0 | 1 | 2 | 3;

type NavigatorExtras = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

export function detectCoreTier(): CoreTier {
  if (typeof window === "undefined") return 1;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;

  const nav = navigator as NavigatorExtras;
  if (nav.connection?.saveData) return 1;
  if (nav.connection?.effectiveType && /(^|-)2g$/.test(nav.connection.effectiveType)) return 1;

  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return 1;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    return 1;
  }

  const memory = nav.deviceMemory ?? 4;
  const cores = nav.hardwareConcurrency ?? 4;
  if (memory <= 2 || cores <= 2) return 1;

  const desktop = window.matchMedia("(pointer: fine) and (min-width: 768px)").matches;
  return desktop && cores >= 4 ? 3 : 2;
}
