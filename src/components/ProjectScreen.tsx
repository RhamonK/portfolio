import type { Project } from "@/data/projects";

// Écran de verre d'un projet. Tant que la vraie capture n'est pas
// fournie (/public/projets/<slug>/), on affiche un emplacement neutre.
export function ProjectScreen({ project }: { project: Project }) {
  return (
    <div
      className="glass relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl"
      role="img"
      aria-label={`Capture de ${project.name} à venir`}
    >
      <div className="text-center">
        <div className="display text-[clamp(28px,4vw,44px)] text-ink/90">{project.name}</div>
        <div className="eyebrow mt-2">capture à venir</div>
      </div>
    </div>
  );
}
