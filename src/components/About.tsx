import { facts, site } from "@/data/site";
import { Reveal } from "./Reveal";

/** Section "À propos" : bio à gauche, facts à droite. */
export function About() {
  return (
    <section className="py-[90px]" id="about">
      <div className="wrap">
        <Reveal className="mb-12 max-w-[600px] text-left">
          <div className="mb-3 font-mono text-[13px] text-lime-dim">
            // à propos
          </div>
          <div className="font-display text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.01em]">
            Comment je travaille
          </div>
        </Reveal>

        <Reveal className="grid grid-cols-1 items-start gap-10 min-[800px]:grid-cols-[1.4fr_1fr] min-[800px]:gap-16">
          <div className="text-[17px] leading-[1.85] text-muted [&_strong]:font-medium [&_strong]:text-ink [&_p]:mb-5">
            <p>
              Je m&apos;appelle <strong>{site.name}</strong>, diplômé d&apos;une{" "}
              <strong>licence en développement d&apos;applications (équivalent BSc)</strong>.
              Je conçois et construis des produits numériques complets — du
              design d&apos;interface à l&apos;infrastructure backend, en passant
              par l&apos;automatisation des opérations métier.
            </p>
            <p>
              Mon approche : comprendre le problème réel avant d&apos;écrire une
              ligne de code. Que ce soit une plateforme web pour un client
              canadien ou un système de gestion pour une entreprise familiale à
              Lomé, l&apos;objectif est le même — livrer quelque chose qui
              fonctionne en conditions réelles, pas seulement en démo.
            </p>
            <p>
              Je travaille proprement et en équipe : code typé, revue de code,
              Git au quotidien et documentation. Je cherche autant à{" "}
              <strong>apprendre vite</strong> qu&apos;à livrer — que ce soit au
              sein d&apos;une équipe ou en autonomie sur une mission.
            </p>
          </div>

          <div className="flex flex-col">
            {facts.map((fact, i) => (
              <div
                key={fact.k}
                className={`flex items-baseline justify-between border-b border-line py-5 ${
                  i === 0 ? "pt-0" : ""
                }`}
              >
                <span className="font-mono text-[12px] text-dim">{fact.k}</span>
                <span className="text-right font-display text-[15px] font-medium">
                  {fact.v}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
