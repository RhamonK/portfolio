import { POSTER_DOT, POSTER_STROKES } from "@/components/core/poster-path";

// Acte 5 — le retour : le fil se referme sur la signature RN, qui se redessine en boucle.
// SVG pur et animation CSS (aucun JavaScript) ; figé en mouvement réduit.
export function SignatureLoop({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="320 200 960 800" className={`sig-loop ${className}`}>
      {POSTER_STROKES.map((s, i) => (
        <path key={`g${i}`} d={s.d} pathLength={1} className="sig-glow" style={{ ["--s" as string]: s.start, ["--l" as string]: s.len }} />
      ))}
      {POSTER_STROKES.map((s, i) => (
        <path key={i} d={s.d} pathLength={1} className="sig-line" style={{ ["--s" as string]: s.start, ["--l" as string]: s.len }} />
      ))}
      <circle cx={POSTER_DOT.cx} cy={POSTER_DOT.cy} r={POSTER_DOT.r} className="sig-dot" />
    </svg>
  );
}
