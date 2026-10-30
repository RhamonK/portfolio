import type { Metadata } from "next";
import Link from "next/link";
import { CvButtons } from "@/components/CvButtons";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { parcours } from "@/data/parcours";

export const metadata: Metadata = {
  title: `Mode rapide — ${site.name}`,
  description: `Projets, parcours et contact de ${site.name}, en une page simple.`,
  alternates: { canonical: "/rapide" },
};

// Mode rapide : tout l'essentiel, sans animation ni 3D.
export default function Rapide() {
  return (
    <main id="contenu" className="wrap max-w-[760px] py-16">
      <Link href="/" className="eyebrow hover:text-ink">
        ← Version immersive
      </Link>
      <h1 className="display mt-6 text-[clamp(40px,7vw,64px)]">{site.name}</h1>
      <p className="mt-3 text-muted">
        {site.role} · {site.position} · {site.location} · {site.languages}
      </p>
      <CvButtons className="mt-6" />

      <h2 className="mt-14 text-[28px] font-bold">Projets</h2>
      <ul className="mt-4 space-y-6">
        {projects.map((p) => (
          <li key={p.slug}>
            <h3 className="text-[20px] font-bold">{p.name}</h3>
            <p className="mt-1 text-muted">{p.description}</p>
            {(p.tech || p.href) && (
              <p className="mt-1 font-mono text-[13px] text-muted">
                {p.tech}
                {p.tech && p.href && " · "}
                {p.href && (
                  <a href={p.href} className="text-lime hover:underline">
                    {p.hrefLabel ?? p.href}
                  </a>
                )}
              </p>
            )}
          </li>
        ))}
      </ul>

      <h2 className="mt-14 text-[28px] font-bold">Parcours</h2>
      <ul className="mt-4 space-y-5">
        {parcours.map((s) => (
          <li key={s.period}>
            <p className="font-mono text-[13px] text-muted">
              {s.period} · {s.place}
            </p>
            <h3 className="text-[18px] font-bold">
              {s.title} — {s.org}
            </h3>
            <p className="text-muted">{s.text}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-14 text-[28px] font-bold">Contact</h2>
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
