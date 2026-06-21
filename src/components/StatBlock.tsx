type StatBlockProps = {
  variant: "lime" | "dark";
  num: string;
  label: string;
  /** classe d'animation d'entrée optionnelle (hero) */
  className?: string;
};

/** Bloc statistique réutilisable : fond lime plein, ou fond card-2 sombre. */
export function StatBlock({ variant, num, label, className = "" }: StatBlockProps) {
  if (variant === "lime") {
    return (
      <div
        className={`flex flex-col gap-1 rounded-inner bg-lime p-[18px] text-on-lime transition-transform duration-200 hover:-translate-y-[3px] ${className}`}
      >
        <span className="font-display text-[30px] font-bold tracking-[-0.01em]">
          {num}
        </span>
        <span className="font-mono text-[11px] opacity-75">{label}</span>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col justify-center gap-1 rounded-inner border border-line bg-card-2 p-[18px] transition-all duration-200 hover:-translate-y-[3px] hover:border-lime-dim ${className}`}
    >
      <span className="font-display text-[30px] font-bold tracking-[-0.01em] text-ink">
        {num}
      </span>
      <span className="font-mono text-[11px] text-dim">{label}</span>
    </div>
  );
}
