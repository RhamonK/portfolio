import { projects, TAGS, type Tag } from "@/data/projects";
import { ui, type Lang } from "@/i18n";

export type Filter = "all" | Tag;

/** Projets retenus par le filtre (indices dans `projects`, ordre conservé). */
export function filtered(filter: Filter): number[] {
  return projects.flatMap((p, i) => (filter === "all" || p.tags.includes(filter) ? [i] : []));
}

// Puces de filtre par besoin, avec le nombre de projets de chacune.
// Boutons à bascule (aria-pressed) ; le nombre de résultats est annoncé.
export function ProjectFilter({ lang, value, onChange, className = "" }: { lang: Lang; value: Filter; onChange: (f: Filter) => void; className?: string }) {
  const t = ui[lang];
  const options: { f: Filter; label: string; n: number }[] = [
    { f: "all", label: t.filterAll, n: projects.length },
    ...TAGS.map((tag) => ({ f: tag as Filter, label: t.tags[tag], n: filtered(tag).length })),
  ];
  return (
    <div className={className}>
      <div role="group" aria-label={t.filterLabel} className="pf-chips">
        {options.map((o) => (
          <button
            key={o.f}
            type="button"
            aria-pressed={value === o.f}
            onClick={() => onChange(o.f)}
            className={`pf-chip${value === o.f ? " is-on" : ""}`}
          >
            {o.label}
            <span className="pf-count" aria-hidden>
              {o.n}
            </span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {t.resultCount(filtered(value).length)}
      </p>
    </div>
  );
}
