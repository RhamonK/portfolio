import { site } from "@/data/site";
import { Reveal } from "./Reveal";
import { ContactForm } from "./ContactForm";

/** CTA final : bloc lime plein avec formulaire + liens réels (tous lisibles). */
export function Contact() {
  const linkCls =
    "underline decoration-on-lime/40 underline-offset-4 transition-colors hover:decoration-on-lime";

  return (
    <section className="py-[90px]" id="contact">
      <div className="wrap">
        <Reveal className="relative overflow-hidden rounded-card bg-lime px-7 py-12 text-center text-on-lime min-[700px]:px-12 min-[700px]:py-16">
          <h2 className="mx-auto mb-5 max-w-[600px] font-display text-[clamp(32px,5vw,54px)] font-bold tracking-[-0.02em]">
            On construit quelque chose ensemble ?
          </h2>
          <p className="mx-auto mb-9 max-w-[440px] text-[16px] opacity-80">
            Ouvert aux opportunités — un poste en équipe comme une mission
            freelance (web apps, automatisation, intégration d&apos;IA). Réponse
            en moins de 24h.
          </p>

          {/* formulaire */}
          <div className="mx-auto max-w-[520px]">
            <ContactForm />
          </div>

          {/* liens directs — texte foncé lisible sur le lime */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[13px] text-on-lime">
            <a href={`mailto:${site.email}`} className={linkCls}>
              {site.email}
            </a>
            <a
              href={site.links.github}
              target="_blank"
              rel="noreferrer"
              className={linkCls}
            >
              GitHub
            </a>
            <a
              href={site.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className={linkCls}
            >
              LinkedIn
            </a>
            <a href={site.cvPath} download className={linkCls}>
              Télécharger le CV
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
