import Link from "next/link";
import type { Project } from "@/data/projects";

/** Carte projet : titlebar mono + corps 2 colonnes (présentation / méta). */
export function ProjectCard({ project }: { project: Project }) {
  const tagClasses =
    project.accent === "lime"
      ? "text-lime bg-lime/[0.08] border-lime/25"
      : "text-coral bg-coral/[0.08] border-coral/25";

  return (
    <article className="overflow-hidden rounded-card border border-line bg-card transition-all duration-300 hover:-translate-y-1 hover:border-lime-dim hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
      {/* titlebar */}
      <div className="flex items-center justify-between border-b border-line px-7 py-[18px] font-mono text-[12px] text-dim">
        <span>{project.file}</span>
        <div className="flex gap-1.5">
          <span className="h-[9px] w-[9px] rounded-full bg-line" />
          <span className="h-[9px] w-[9px] rounded-full bg-line" />
          <span className="h-[9px] w-[9px] rounded-full bg-line" />
        </div>
      </div>

      {/* corps */}
      <div className="grid grid-cols-1 gap-7 px-[22px] py-7 min-[800px]:grid-cols-[1.3fr_1fr] min-[800px]:gap-12 min-[800px]:px-7 min-[800px]:pb-10 min-[800px]:pt-9">
        {/* gauche : présentation */}
        <div>
          <span
            className={`mb-[18px] inline-block rounded-full border px-3 py-[5px] font-mono text-[11px] tracking-[0.03em] ${tagClasses}`}
          >
            {project.tag}
          </span>
          <Link
            href={`/projets/${project.slug}`}
            className="group/title mb-3.5 inline-flex items-center gap-2 transition-colors hover:text-lime"
          >
            <h3 className="font-display text-[30px] font-semibold tracking-[-0.01em]">
              {project.name}
            </h3>
            <span className="text-[18px] opacity-0 transition-opacity group-hover/title:opacity-100">
              →
            </span>
          </Link>
          <p className="mb-6 text-[15px] leading-[1.8] text-muted">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-3.5">
            {project.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card-2 px-4 py-[9px] font-mono text-[13px] text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-lime-dim hover:text-lime"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* droite : panneau méta */}
        <div className="flex flex-col gap-4 rounded-inner border border-line bg-card-2 p-6">
          {project.meta.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-3 text-[13px]"
            >
              <span className="font-mono text-dim">{row.label}</span>
              <span className="text-right font-mono text-ink">{row.value}</span>
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-line bg-white/[0.03] px-2.5 py-[5px] font-mono text-[11px] text-muted transition-colors duration-200 hover:border-lime-dim hover:text-lime"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
