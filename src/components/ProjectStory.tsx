import type { Project } from "@/data/projects";
import { ui, type Lang } from "@/i18n";

// Récit d'un projet sous son écran : problème → solution → résultat.
// La solution est la phrase `pitch` ; sans `story`, seule cette phrase s'affiche.
// - "card"    : carte projet (mobile, mouvement réduit, sans WebGL), en colonne ;
// - "caption" : légende de la salle 3D (desktop), en trois colonnes.
export function ProjectStory({ project, lang, variant }: { project: Project; lang: Lang; variant: "card" | "caption" }) {
  const t = ui[lang];
  const s = project.story;
  if (!s) {
    return <p className={variant === "caption" ? "mx-auto mt-1 max-w-[760px] text-muted" : "mt-1 text-muted"}>{project.pitch[lang]}</p>;
  }
  const rows = [
    { k: "problem", label: t.storyProblem, text: s.problem[lang] },
    { k: "solution", label: t.storySolution, text: project.pitch[lang] },
    { k: "result", label: t.storyResult, text: s.result[lang] },
  ];
  return (
    <dl className={`story story-${variant}`}>
      {rows.map((r) => (
        <div key={r.k} className={`story-row story-${r.k}`}>
          <dt>{r.label}</dt>
          <dd>{r.text}</dd>
        </div>
      ))}
    </dl>
  );
}
