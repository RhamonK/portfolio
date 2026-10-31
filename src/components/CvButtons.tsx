import { site } from "@/data/site";
import { ui, type Lang } from "@/i18n";

// Le CV de la langue de la page passe en premier (bouton lime).
export function CvButtons({ lang, className = "" }: { lang: Lang; className?: string }) {
  const t = ui[lang];
  const fr = { l: "fr" as const, href: site.cv.fr, label: t.cvFr };
  const en = { l: "en" as const, href: site.cv.en, label: t.cvEn };
  const cvs = lang === "fr" ? [fr, en] : [en, fr];
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {cvs.map((cv, i) => (
        <a key={cv.l} href={cv.href} download hrefLang={cv.l} className={`btn ${i === 0 ? "btn-lime" : "btn-glass"}`}>
          {cv.label}
        </a>
      ))}
    </div>
  );
}
