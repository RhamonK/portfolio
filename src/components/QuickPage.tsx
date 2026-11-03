import Link from "next/link";
import { CvButtons } from "@/components/CvButtons";
import { site, siteCopy } from "@/data/site";
import { projects } from "@/data/projects";
import { parcours } from "@/data/parcours";
import { pillars } from "@/data/expertise";
import { lab } from "@/data/lab";
import { base, ui, type Lang } from "@/i18n";

// Mode rapide : tout l'essentiel, sans animation ni 3D.
export function QuickPage({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const copy = siteCopy[lang];
  return (
    <main id="contenu" className="wrap max-w-[760px] py-16">
      <Link href={base[lang] || "/"} className="eyebrow hover:text-ink">
        {t.back}
      </Link>
      <h1 className="display mt-6 text-[clamp(40px,7vw,64px)]">{site.name}</h1>
      <p className="mt-3 text-muted">
        {copy.role} · {copy.position} · {site.location} · {site.languages}
      </p>
      <CvButtons lang={lang} className="mt-6" />

      <h2 className="mt-14 text-[28px] font-bold">{t.projects}</h2>
      <ul className="mt-4 space-y-6">
        {projects.map((p) => (
          <li key={p.slug}>
            <h3 className="text-[20px] font-bold">{p.name}</h3>
            <p className="mt-1 text-muted">{p.description[lang]}</p>
            {(p.tech || p.href) && (
              <p className="mt-1 font-mono text-[13px] text-muted">
                {p.tech}
                {p.tech && p.href && " · "}
                {p.href && (
                  <a href={p.href} className="text-lime hover:underline">
                    {p.hrefLabel?.[lang] ?? p.href}
                  </a>
                )}
              </p>
            )}
          </li>
        ))}
      </ul>

      <h2 className="mt-14 text-[28px] font-bold">{t.nav.expertise}</h2>
      <ul className="mt-4 space-y-4">
        {pillars.map((p) => (
          <li key={p.tag}>
            <h3 className="text-[18px] font-bold">{p.title[lang]}</h3>
            <p className="text-muted">{p.text[lang]}</p>
            <p className="mt-1 font-mono text-[13px] text-muted">{p.tools.join(", ")}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-14 text-[28px] font-bold">{t.labNav}</h2>
      <ul className="mt-4 space-y-4">
        {lab.map((item) => (
          <li key={item.id}>
            <h3 className="text-[18px] font-bold">
              {item.name[lang]} <span className="font-mono text-[13px] font-normal text-muted">· {item.year}</span>
            </h3>
            <p className="text-muted">{item.text[lang]}</p>
            <p className="mt-1 font-mono text-[13px] text-muted">
              {item.tech.join(" · ")}
              {item.action.kind === "link" && (
                <>
                  {" · "}
                  <a href={item.action.href} className="text-lime hover:underline">
                    {item.action.label[lang]}
                  </a>
                </>
              )}
            </p>
          </li>
        ))}
      </ul>

      <h2 className="mt-14 text-[28px] font-bold">{t.path}</h2>
      <ul className="mt-4 space-y-5">
        {parcours.map((s) => (
          <li key={s.org}>
            <p className="font-mono text-[13px] text-muted">
              {s.period[lang]} · {s.place}
            </p>
            <h3 className="text-[18px] font-bold">
              {s.title[lang]} — {s.org}
            </h3>
            <p className="text-muted">{s.text[lang]}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-14 text-[28px] font-bold">{t.contact}</h2>
      <ul className="mt-4 space-y-1">
        <li>
          <a href={`mailto:${site.email}`} className="text-lime hover:underline">
            {site.email}
          </a>
        </li>
        <li>
          <a href={site.links.github} className="hover:underline">github.com/RhamonK</a>
        </li>
        <li>
          <a href={site.links.kelthen} className="hover:underline">kelthen.com</a>
        </li>
      </ul>
    </main>
  );
}
