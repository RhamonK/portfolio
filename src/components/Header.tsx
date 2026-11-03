"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { site } from "@/data/site";
import { base, quickPath, ui, type Lang } from "@/i18n";

// En-tête. Desktop : nom complet + navigation visible.
// Mobile : monogramme R.N. + un seul bouton rond qui ouvre le menu
// (sections, langue, mode rapide, CV). Le menu ne bloque pas le défilement.
export function Header({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const home = base[lang] || "/";
  const other: Lang = lang === "fr" ? "en" : "fr";
  // Ancres sans barre finale (« /en#projets ») : avec trailingSlash: false,
  // « /en/#projets » rechargeait la page via une redirection au lieu de défiler.
  const nav = [
    { label: t.nav.projects, href: `${base[lang]}#projets` },
    { label: t.nav.expertise, href: `${base[lang]}#expertise` },
    { label: t.nav.path, href: `${base[lang]}#parcours` },
    { label: t.nav.contact, href: `${base[lang]}#contact` },
  ];

  const [open, setOpen] = useState(false);
  const panelId = useId();
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    // focus sur le premier lien à l'ouverture
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    // clic en dehors de l'en-tête : on ferme
    const onPointer = (e: PointerEvent) => {
      const header = button.current?.closest("header");
      if (header && !header.contains(e.target as Node)) setOpen(false);
    };
    // passage en largeur desktop : le menu mobile n'a plus lieu d'être
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-glass-line bg-bg/70 backdrop-blur-md">
      <div className="wrap flex h-14 items-center justify-between gap-4 md:h-16">
        <Link href={home} aria-label={`R.N. — ${site.name}`} className="font-display text-[17px] font-bold tracking-tight">
          <span aria-hidden className="md:hidden">
            R.N<span className="text-lime">.</span>
          </span>
          <span aria-hidden className="hidden md:inline">
            {site.name}
            <span className="text-lime">.</span>
          </span>
        </Link>

        {/* ===== desktop ===== */}
        <nav aria-label={t.navLabel} className="hidden items-center gap-2 md:flex">
          <ul className="flex items-center gap-6 pr-4 text-[15px] text-muted">
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

        {/* ===== mobile : bouton rond ===== */}
        <button
          ref={button}
          type="button"
          className="btn btn-glass !h-11 !min-h-11 !w-11 justify-center !px-0 md:hidden"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? t.closeMenu : t.openMenu}
          onClick={() => setOpen((o) => !o)}
        >
          <span aria-hidden className="relative block h-3 w-4">
            <span
              className={`absolute left-0 top-0 h-[1.5px] w-4 rounded-full bg-ink transition-transform duration-300 ${open ? "translate-y-[5.25px] rotate-45" : ""}`}
            />
            <span
              className={`absolute bottom-0 left-0 h-[1.5px] w-4 rounded-full bg-ink transition-transform duration-300 ${open ? "-translate-y-[5.25px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {/* ===== mobile : menu déroulant ===== */}
      <div
        ref={panel}
        id={panelId}
        hidden={!open}
        className="border-t border-glass-line bg-bg/95 backdrop-blur-md md:hidden"
      >
        <nav aria-label={t.navLabel} className="wrap pb-6 pt-2">
          <ul>
            {nav.map((item, i) => (
              <li key={item.href} className="border-b border-glass-line">
                <a href={item.href} onClick={close} className="flex min-h-14 items-baseline gap-4 py-3 text-[26px] font-bold tracking-tight">
                  <span aria-hidden className="eyebrow">
                    0{i + 1}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <a href={site.cv[lang]} download onClick={close} className="btn btn-lime">
              {t.downloadCvArrow}
            </a>
            <Link
              href={base[other] || "/"}
              hrefLang={other}
              lang={other}
              aria-label={`${t.switchTo} — ${t.switchLabel}`}
              className="btn btn-glass font-mono text-[13px]"
            >
              {t.switchTo}
            </Link>
            <Link href={quickPath[lang]} className="btn btn-glass">
              {t.quick}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
