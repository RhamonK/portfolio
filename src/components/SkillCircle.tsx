import type { Skill } from "@/data/skills";

/** Cercle de compétence avec initiales + label (hover bounce géré en CSS). */
export function SkillCircle({ skill }: { skill: Skill }) {
  return (
    <div className="skill-item flex flex-col items-center gap-3">
      <div className="skill-circle flex h-16 w-16 items-center justify-center rounded-full border border-line bg-card font-display text-[18px] font-semibold text-lime">
        {skill.initials}
      </div>
      <span className="font-mono text-[12px] text-muted">{skill.label}</span>
    </div>
  );
}
