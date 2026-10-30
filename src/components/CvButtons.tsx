import { site } from "@/data/site";

export function CvButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a href={site.cv.fr} download className="btn btn-lime">
        CV · Français ↓
      </a>
      <a href={site.cv.en} download className="btn btn-glass" hrefLang="en">
        CV · English ↓
      </a>
    </div>
  );
}
