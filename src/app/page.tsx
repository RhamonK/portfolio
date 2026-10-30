import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CvButtons } from "@/components/CvButtons";
import { ProjectScreen } from "@/components/ProjectScreen";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { parcours } from "@/data/parcours";

// Squelette : chaque section est du vrai HTML, complet sans JavaScript.
// Les scènes animées (A à E) viendront s'appuyer sur cette base.
export default function Home() {
  return (
    <>
      <Header />
      <main id="contenu">
        {/* ===== SCÈNE A — ACCUEIL ===== */}
        <section
          id="accueil"
          aria-labelledby="titre-accueil"
          className="relative flex min-h-[100svh] items-center overflow-hidden pt-16"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/10 blur-[120px]"
          />
          <div className="wrap relative text-center">
            <h1 id="titre-accueil" className="display text-[clamp(52px,11vw,160px)]">
              {site.name}
            </h1>
            <p className="mx-auto mt-6 max-w-[720px] text-[clamp(17px,2vw,22px)] text-muted">
              {site.role} · {site.position}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a href="#projets" className="btn btn-lime">
                Voir mes projets ↓
              </a>
              <a href={site.cv.fr} download className="btn btn-glass">
                Télécharger mon CV
              </a>
            </div>
          </div>
        </section>

        {/* ===== SCÈNE B — PROJETS ===== */}
        <section id="projets" aria-labelledby="titre-projets" className="py-28">
          <div className="wrap">
            <p className="eyebrow">// projets</p>
            <h2 id="titre-projets" className="display mt-3 text-[clamp(40px,6vw,80px)]">
              Ce que mes projets <span className="text-lime">font</span>.
            </h2>
            <ol className="mt-14 grid gap-10 md:grid-cols-2">
              {projects.map((p, i) => (
                <li key={p.slug}>
                  <ProjectScreen project={p} />
                  <div className="mt-5">
                    <span className="eyebrow">
                      {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                    </span>
                    <h3 className="mt-1 text-[26px] font-bold tracking-tight">{p.name}</h3>
                    <p className="mt-1 text-muted">{p.pitch}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ===== SCÈNE D — PARCOURS ===== */}
        <section id="parcours" aria-labelledby="titre-parcours" className="py-28">
          <div className="wrap">
            <p className="eyebrow">// parcours</p>
            <h2 id="titre-parcours" className="display mt-3 text-[clamp(40px,6vw,80px)]">
              Parcours
            </h2>
            <ol className="mt-14 space-y-6 border-l border-lime/40 pl-6 md:pl-10">
              {parcours.map((s) => (
                <li key={s.period} className="glass rounded-2xl p-6 md:p-8">
                  <p className="eyebrow">
                    {s.period} · {s.place}
                  </p>
                  <h3 className="mt-2 text-[22px] font-bold tracking-tight">
                    {s.title} — {s.href ? <a href={s.href} className="text-lime hover:underline">{s.org}</a> : s.org}
                  </h3>
                  <p className="mt-2 text-muted">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ===== SCÈNE E — CONTACT ===== */}
        <section id="contact" aria-labelledby="titre-contact" className="py-28">
          <div className="wrap grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
            <h2 id="titre-contact" className="display text-[clamp(40px,6vw,80px)]">
              Parlons de ce que je peux <span className="text-lime">construire</span> pour toi.
            </h2>
            <div className="glass rounded-3xl p-7 md:p-9">
              <p className="eyebrow">
                <span className="text-lime">●</span> {site.availability}
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-5 block break-all text-[22px] font-bold hover:text-lime"
              >
                {site.email}
              </a>
              <CvButtons className="mt-6" />
              <ul className="mt-6 space-y-1 font-mono text-[14px] text-muted">
                <li>
                  <a href={site.links.github} className="hover:text-ink">github.com/RhamonK</a>
                </li>
                <li>
                  <a href={site.links.kelthen} className="hover:text-ink">kelthen.com</a>
                </li>
                <li>
                  {site.location} · {site.languages}
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
