import Link from "next/link";
import { site } from "@/data/site";

const nav = [
  { label: "Projets", href: "/#projets" },
  { label: "Parcours", href: "/#parcours" },
  { label: "Contact", href: "/#contact" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-glass-line bg-bg/70 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="font-display text-[17px] font-bold tracking-tight">
          {site.name}
          <span className="text-lime">.</span>
        </Link>
        <nav aria-label="Navigation principale" className="flex items-center gap-2">
          <ul className="hidden items-center gap-6 pr-4 text-[15px] text-muted md:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition-colors hover:text-ink">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <Link href="/rapide" className="btn btn-glass !min-h-10 !px-4 text-[14px]">
            Mode rapide
          </Link>
        </nav>
      </div>
    </header>
  );
}
