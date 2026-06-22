import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, caseStudySlugs } from "@/data/caseStudies";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Mockup } from "@/components/mockups/Mockup";

type Params = { params: { slug: string } };

/** Génère les pages statiques pour chaque étude de cas. */
export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const cs = caseStudies[params.slug];
  if (!cs) return { title: "Projet introuvable" };
  return {
    title: `${cs.name} — Étude de cas`,
    description: cs.tagline,
  };
}

export default function CaseStudyPage({ params }: Params) {
  const cs = caseStudies[params.slug];
  if (!cs) notFound();

  const accentText = cs.accent === "lime" ? "text-lime" : "text-coral";
  const accentTag =
    cs.accent === "lime"
      ? "text-lime bg-lime/[0.08] border-lime/25"
      : "text-coral bg-coral/[0.08] border-coral/25";

  return (
    <>
      <ScrollProgress />
      <Nav />

      <main className="wrap py-16">
        {/* retour */}
        <Link
          href="/#projets"
          className="inline-flex items-center gap-2 font-mono text-[13px] text-muted transition-colors hover:text-lime"
        >
          ← Tous les projets
        </Link>

        {/* header */}
        <header className="mt-8">
          <span
            className={`inline-block rounded-full border px-3 py-[5px] font-mono text-[11px] tracking-[0.03em] ${accentTag}`}
          >
            {cs.tag}
          </span>
          <h1 className="mt-4 font-display text-[clamp(34px,6vw,56px)] font-bold leading-[1.05] tracking-[-0.02em]">
            {cs.name}
          </h1>
          <p className="mt-4 max-w-[620px] text-[17px] leading-relaxed text-muted">
            {cs.tagline}
          </p>
        </header>

        {/* mockup + méta */}
        <div className="mt-12 grid grid-cols-1 items-start gap-10 min-[860px]:grid-cols-[1.2fr_0.8fr]">
          <div className="flex justify-center">
            <Mockup slug={cs.slug} />
          </div>

          <div className="flex flex-col gap-5 rounded-card border border-line bg-card p-6">
            {[
              ["rôle", cs.role],
              ["année", cs.year],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-3 text-[13px]">
                <span className="font-mono text-dim">{k}</span>
                <span className="text-right font-mono text-ink">{v}</span>
              </div>
            ))}

            <div>
              <div className="mb-2 font-mono text-[12px] text-dim">stack</div>
              <div className="flex flex-wrap gap-2">
                {cs.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-line bg-white/[0.03] px-2.5 py-[5px] font-mono text-[11px] text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {cs.links.length > 0 && (
              <div className="flex flex-wrap gap-2.5 pt-1">
                {cs.links.map((link) => (
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
            )}
          </div>
        </div>

        {/* corps : étude de cas */}
        <div className="mt-16 max-w-[720px]">
          <Section title="Contexte">
            <p>{cs.context}</p>
          </Section>

          <Section title="Le problème">
            <p>{cs.problem}</p>
          </Section>

          <Section title="L'approche">
            <ul className="flex flex-col gap-2.5">
              {cs.approach.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className={`mt-[2px] ${accentText}`}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Décisions techniques">
            <div className="flex flex-col gap-5">
              {cs.decisions.map((d, i) => (
                <div
                  key={i}
                  className="rounded-inner border border-line bg-card-2 p-5"
                >
                  <div className={`mb-1.5 font-display text-[16px] font-semibold ${accentText}`}>
                    {d.title}
                  </div>
                  <p className="text-[14px] leading-relaxed text-muted">{d.body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Résultat">
            <ul className="flex flex-col gap-2.5">
              {cs.result.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className={`mt-[2px] ${accentText}`}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* CTA bas de page */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <Link
            href="/#projets"
            className="font-mono text-[14px] text-muted transition-colors hover:text-lime"
          >
            ← Tous les projets
          </Link>
          <Link
            href="/#contact"
            className="rounded-full bg-lime px-6 py-3 font-mono text-[14px] font-medium text-black transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(212,255,61,0.2)]"
          >
            Me contacter →
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-4 font-display text-[22px] font-semibold tracking-[-0.01em]">
        {title}
      </h2>
      <div className="text-[16px] leading-relaxed text-muted">{children}</div>
    </section>
  );
}
