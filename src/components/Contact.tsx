import { CvButtons } from "@/components/CvButtons";
import { site, siteCopy } from "@/data/site";
import { ui, type Lang } from "@/i18n";

// Scène E — contact et CV.
export function Contact({ lang }: { lang: Lang }) {
  const t = ui[lang];
  return (
    <>
      <section id="contact" aria-labelledby="titre-contact" className="py-28">
        <div className="wrap grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
          <h2 id="titre-contact" className="display text-[clamp(40px,6vw,80px)]">
            {t.contactTitle[0]}
            <span className="text-lime">{t.contactTitle[1]}</span>
            {t.contactTitle[2]}
          </h2>
          <div className="glass rounded-3xl p-7 md:p-9">
            <p className="eyebrow">
              <span className="text-lime">●</span> {siteCopy[lang].availability}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-5 block break-all text-[22px] font-bold hover:text-lime"
            >
              {site.email}
            </a>
            <CvButtons lang={lang} className="mt-6" />
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

      {/* Mobile : bouton CV collé en bas de l'écran */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-glass-line bg-bg/80 p-3 backdrop-blur-md md:hidden">
        <a href={site.cv[lang]} download className="btn btn-lime w-full justify-center">
          {t.downloadCvArrow}
        </a>
      </div>
    </>
  );
}
