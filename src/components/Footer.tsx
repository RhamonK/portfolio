import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-glass-line py-8">
      <div className="wrap flex flex-wrap items-center justify-between gap-3 text-[14px] text-muted">
        <span>© {site.name}</span>
        <a href={site.url} className="font-mono hover:text-ink">
          {site.domain}
        </a>
      </div>
    </footer>
  );
}
