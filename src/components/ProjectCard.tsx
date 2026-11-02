import type { Project } from "@/data/projects";
import { ProjectScreen } from "@/components/ProjectScreen";
import { ui, type Lang } from "@/i18n";

const pad = (n: number) => String(n).padStart(2, "0");

// Carte projet (mobile, mouvement réduit, navigateur sans WebGL ; lue par les lecteurs
// d'écran sur desktop). Compréhensible en quelques secondes : ce que ça fait, pour quel
// besoin, avec quoi, où le voir, et la présentation de 60 s.
export function ProjectCard({
  project,
  index,
  total,
  lang,
  onLaunch,
  focusable = true,
}: {
  project: Project;
  index: number;
  total: number;
  lang: Lang;
  onLaunch?: () => void;
  focusable?: boolean;
}) {
  const t = ui[lang];
  const tab = focusable ? undefined : -1;
  return (
    <article className="pc">
      <div className="pc-media">
        <ProjectScreen project={project} />
      </div>
      {project.gallery.length > 1 && (
        <ul className="pc-gallery" aria-label={t.screensLabel(project.name)} tabIndex={tab ?? 0}>
          {project.gallery.map((s) => (
            <li key={s.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.src} alt={s.label[lang]} loading="lazy" decoding="async" width={320} height={200} />
              <span aria-hidden>{s.label[lang]}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="eyebrow mr-1">
          {pad(index + 1)} / {pad(total)}
        </span>
        {project.tags.map((tag) => (
          <span key={tag} className="pc-tag">
            {t.tags[tag]}
          </span>
        ))}
      </div>
      <h3 className="mt-2 text-[24px] font-bold tracking-tight">{project.name}</h3>
      <p className="mt-1 text-muted">{project.pitch[lang]}</p>
      {(project.tech || project.href) && (
        <p className="mt-2 font-mono text-[13px] text-muted">
          {project.tech}
          {project.tech && project.href && " · "}
          {project.href && (
            <a href={project.href} tabIndex={tab} className="text-lime hover:underline">
              {project.hrefLabel?.[lang] ?? project.href} ↗
            </a>
          )}
        </p>
      )}
      {onLaunch && (
        <button type="button" className="btn btn-lime mt-4" tabIndex={tab} onClick={onLaunch}>
          {t.launch}
        </button>
      )}
    </article>
  );
}
