import Link from "next/link";
import { site } from "@/data/site";
import { base, quickPath, ui, type Lang } from "@/i18n";

export function Header({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const home = base[lang] || "/";
  const other: Lang = lang === "fr" ? "en" : "fr";
  const nav = [
    { label: t.nav.projects, href: `${base[lang]}/#projets` },
    { label: t.nav.path, href: `${base[lang]}/#parcours` },
    { label: t.nav.contact, href: `${base[lang]}/#contact` },
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-glass-line bg-bg/70 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href={home} className="font-display text-[17px] font-bold tracking-tight">
          {site.name}
          <span className="text-lime">.</span>
        </Link>
        <nav aria-label={t.navLabel} className="flex items-center gap-2">
          <ul className="hidden items-center gap-6 pr-4 text-[15px] text-muted md:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition-colors hover:text-ink">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href={base[other] || "/"}
            hrefLang={other}
            lang={other}
            aria-label={`${t.switchTo} — ${t.switchLabel}`}
            className="btn btn-glass !min-h-10 !px-3 font-mono text-[13px]"
          >
            {t.switchTo}
          </Link>
          <Link href={quickPath[lang]} className="btn btn-glass !min-h-10 !px-4 text-[14px]">
            {t.quick}
          </Link>
        </nav>
      </div>
    </header>
  );
}
