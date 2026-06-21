import { stackMarquee } from "@/data/site";

/** Bande marquee infinie de la stack technique (contenu doublé pour la boucle). */
export function StackStrip() {
  // doublé : l'animation translateX(-50%) reboucle sans saut
  const items = [...stackMarquee, ...stackMarquee];

  return (
    <div className="stack-strip mt-[60px] overflow-hidden border-y border-line py-4">
      <div className="stack-track">
        {items.map((item, i) => (
          <span key={i} className={item.highlight ? "hl" : undefined}>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
