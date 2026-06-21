import { site } from "@/data/site";
import { StatBlock } from "./StatBlock";

/** Hero 2 colonnes : pitch + CTA à gauche, carte "éditeur de code" à droite. */
export function Hero() {
  return (
    <header className="pb-[60px] pt-20">
      <div className="wrap grid grid-cols-1 items-center gap-12 min-[900px]:grid-cols-[1.1fr_0.9fr] min-[900px]:gap-16">
        {/* ---- colonne gauche ---- */}
        <div>
          <div className="eyebrow-dot mb-6 flex items-center gap-2.5 font-mono text-[13px] text-lime">
            {site.eyebrow}
          </div>

          <h1 className="font-display text-[clamp(40px,6vw,68px)] font-bold leading-[1.08] tracking-[-0.02em]">
            <span className="h1-line-wrap">
              <span className="h1-line">Je construis des</span>
            </span>
            <span className="h1-line-wrap">
              <span className="h1-line">
                systèmes <span className="text-muted">qui tournent</span>
              </span>
            </span>
            <span className="h1-line-wrap">
              <span className="h1-line">sans toi.</span>
            </span>
          </h1>

          <p className="hero-sub-anim mt-6 max-w-[480px] text-[17px] leading-[1.75] text-muted">
            Développeur full-stack &amp; automation builder. Je conçois des
            plateformes web, des dashboards et des pipelines d&apos;automatisation
            pour des entreprises au{" "}
            <strong className="font-medium text-ink">Canada</strong> et en{" "}
            <strong className="font-medium text-ink">Afrique de l&apos;Ouest</strong>.
          </p>

          <div className="hero-actions-anim mt-9 flex flex-wrap items-center gap-3.5">
            <a
              href="#projets"
              className="inline-flex items-center gap-2 rounded-full bg-lime px-7 py-[15px] font-mono text-[14px] font-medium text-black transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_10px_24px_rgba(212,255,61,0.2)] active:translate-y-[-1px] active:scale-[0.98]"
            >
              Voir les projets →
            </a>
            <a
              href={site.cvPath}
              download
              className="rounded-full border border-line px-[26px] py-3.5 font-mono text-[14px] text-ink transition-all duration-200 hover:border-lime-dim hover:bg-lime/[0.04] hover:text-lime"
            >
              Télécharger le CV
            </a>
          </div>
        </div>

        {/* ---- colonne droite : carte code ---- */}
        <div className="hero-visual-anim relative overflow-hidden rounded-card border border-line bg-card p-[22px]">
          <div className="mb-[18px] flex items-center justify-between font-mono text-[11px] text-dim">
            <span>~/rhamon/projects/main.ts</span>
            <div className="flex gap-1.5">
              <span className="h-[9px] w-[9px] rounded-full bg-line" />
              <span className="h-[9px] w-[9px] rounded-full bg-line" />
              <span className="dot-live h-[9px] w-[9px] rounded-full" />
            </div>
          </div>

          <div className="code-line">
            <span className="c">// stack actuelle</span>
          </div>
          <div className="code-line">
            <span className="k">const</span> stack = [<span className="s">&quot;Next.js&quot;</span>,{" "}
            <span className="s">&quot;Supabase&quot;</span>,{" "}
            <span className="s">&quot;n8n&quot;</span>]
          </div>
          <div className="code-line">
            <span className="k">const</span> regions = [
            <span className="s">&quot;Canada&quot;</span>,{" "}
            <span className="s">&quot;Togo&quot;</span>]
          </div>
          <div className="code-line">
            <span className="k">export default</span> buildSystem(stack, regions)
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <StatBlock
              variant="lime"
              num="3"
              label="projets en production"
              className="stat-lime-anim"
            />
            <StatBlock
              variant="dark"
              num="48h"
              label="délai proposition"
              className="stat-dark-anim"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
