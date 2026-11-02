// Titre découpé en mots pour l'apparition mot par mot (voir src/lib/reveal.ts).
// Un fragment marqué `em` est écrit en serif italique lime.
// Le texte reste lisible tel quel sans JavaScript et pour les lecteurs d'écran.

type Part = { t: string; em?: boolean };

export function SplitTitle({ parts }: { parts: Part[] }) {
  return (
    <>
      {parts.map((part, pi) =>
        part.t.split(/(\s+)/).map((w, wi) =>
          /^\s+$/.test(w) || w === "" ? (
            w
          ) : (
            <span key={`${pi}-${wi}`} className="rv-mask">
              <span className={`rv-word${part.em ? " rv-em" : ""}`}>{w}</span>
            </span>
          ),
        ),
      )}
    </>
  );
}
