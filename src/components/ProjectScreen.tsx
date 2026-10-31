import type { Project } from "@/data/projects";
import { ProjectArt } from "@/components/ProjectArt";

// Contenu d'un écran de projet : la vraie capture si elle existe,
// sinon le dessin du projet.
export function ScreenContent({ project }: { project: Project }) {
  if (project.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={project.image}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-left-top"
      />
    );
  }
  return (
    <div className="relative h-full w-full bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,255,58,0.10),transparent_60%),rgba(16,18,14,0.92)]">
      <div className="absolute inset-0 p-[4%]">
        <ProjectArt slug={project.slug} />
      </div>
      <span className="absolute left-[4%] top-[3%] font-mono text-[11px] tracking-wide text-lime/80">
        {project.name.toLowerCase()}
      </span>
    </div>
  );
}

// Écran plat (mobile, mouvement réduit, Mode rapide).
export function ProjectScreen({ project }: { project: Project }) {
  return (
    <div
      className="glass relative aspect-[16/10.5] overflow-hidden rounded-2xl"
      role="img"
      aria-label={project.image ? `Capture de ${project.name}` : `Illustration de ${project.name}`}
    >
      <ScreenContent project={project} />
    </div>
  );
}
