import { navLinks, site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <div className="wrap flex flex-wrap items-center justify-between gap-3 font-mono text-[12px] text-dim">
        <div>© 2026 {site.name} — Gatineau, Canada</div>
        <div className="flex gap-6">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-lime">
              {link.label}
            </a>
          ))}
          <a href="#contact" className="hover:text-lime">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
