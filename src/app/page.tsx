import { StatusBar } from "@/components/StatusBar";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { StackStrip } from "@/components/StackStrip";
import { ProjectCard } from "@/components/ProjectCard";
import { SkillCircle } from "@/components/SkillCircle";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ScrollProgress } from "@/components/ScrollProgress";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <StatusBar />
      <Nav />

      <Hero />
      <StackStrip />

      {/* ===== PROJETS ===== */}
      <section className="py-[90px]" id="projets">
        <div className="wrap">
          <Reveal className="mb-12 text-center">
            <div className="mb-3 font-mono text-[13px] text-lime-dim">
              // projets sélectionnés
            </div>
            <div className="font-display text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.01em]">
              Projets <span className="text-lime">récents</span>
            </div>
            <div className="mx-auto mt-3.5 max-w-[460px] text-[15px] text-muted">
              Des plateformes en production, conçues de A à Z : architecture,
              code, déploiement et automatisation des opérations.
            </div>
          </Reveal>

          <div className="flex flex-col gap-6">
            {projects.map((project, i) => (
              <Reveal key={project.name} delay={i * 0.08}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STACK ===== */}
      <section className="py-[90px]" id="skills">
        <div className="wrap">
          <Reveal className="mb-12 text-center">
            <div className="mb-3 font-mono text-[13px] text-lime-dim">
              // compétences
            </div>
            <div className="font-display text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.01em]">
              Stack <span className="text-lime">maîtrisée</span>
            </div>
            <div className="mx-auto mt-3.5 max-w-[460px] text-[15px] text-muted">
              Les outils que j&apos;utilise au quotidien pour construire,
              automatiser et déployer.
            </div>
          </Reveal>

          <Reveal className="mx-auto grid max-w-[760px] grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-5">
            {skills.map((skill) => (
              <SkillCircle key={skill.label} skill={skill} />
            ))}
          </Reveal>
        </div>
      </section>

      <About />
      <Contact />
      <Footer />
    </>
  );
}
