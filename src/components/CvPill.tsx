"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { ui, type Lang } from "@/i18n";

// Mobile uniquement : petite pastille « CV » en bas à droite.
// - absente sur le Hero (le CV y est déjà proposé) ;
// - s'efface pendant qu'on descend, revient dès qu'on s'arrête ou qu'on remonte ;
// - disparaît sur Contact et le pied de page (le CV y est déjà proposé).
export function CvPill({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const [shown, setShown] = useState(false);
  const state = useRef({ pastHero: false, nearEnd: false, scrollingDown: false });

  useEffect(() => {
    const s = state.current;
    const update = () => setShown(s.pastHero && !s.nearEnd && !s.scrollingDown);

    let lastY = window.scrollY;
    let idle = 0;
    const onScroll = () => {
      const y = window.scrollY;
      s.pastHero = y > window.innerHeight * 0.7;
      if (y > lastY + 4) s.scrollingDown = true;
      else if (y < lastY - 4) s.scrollingDown = false;
      lastY = y;
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        s.scrollingDown = false;
        update();
      }, 650);
      update();
    };

    const ends = ["contact"].map((id) => document.getElementById(id)).concat(document.querySelector("footer"));
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      s.nearEnd = visible.size > 0;
      update();
    });
    ends.forEach((el) => el && io.observe(el));

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idle);
      io.disconnect();
    };
  }, []);

  return (
    <a
      href={site.cv[lang]}
      download
      aria-label={t.downloadCv}
      aria-hidden={!shown}
      tabIndex={shown ? undefined : -1}
      className={`btn btn-lime fixed right-4 z-40 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.6)] transition-[transform,opacity] duration-300 ease-out md:hidden ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
      style={{ bottom: "calc(16px + env(safe-area-inset-bottom))" }}
    >
      {t.cvPill}
    </a>
  );
}
