import type { Project } from "@/data/projects";

// Logo du projet : le vrai fichier s'il existe, sinon ses initiales (pas de faux logo).
export function ProjectLogo({ project, size = 40 }: { project: Project; size?: number }) {
  const style = { width: size, height: size };
  if (project.logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={project.logo} alt="" aria-hidden width={size} height={size} className="shrink-0 rounded-[22%]" style={style} />;
  }
  const words = project.name.replace(/[^A-Za-zÀ-ÿ ]/g, " ").split(/\s+/).filter(Boolean);
  const first = words[0] ?? "";
  // un seul mot : sigle court en entier (ABO), sinon ses majuscules (TakeUrClothes → TC)
  const caps = first.match(/[A-ZÀ-Ý]/g) ?? [first[0] ?? ""];
  const initials =
    words.length > 1
      ? words.slice(0, 2).map((w) => w[0].toUpperCase()).join("")
      : first.length <= 3
        ? first.toUpperCase()
        : (caps[0] + (caps.length > 1 ? caps[caps.length - 1] : "")).toUpperCase();
  return (
    <span aria-hidden className="pc-logo shrink-0" style={{ ...style, fontSize: size * 0.38 }}>
      {initials}
    </span>
  );
}
