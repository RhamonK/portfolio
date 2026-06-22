import Link from "next/link";
import { navLinks } from "@/data/site";

/** Nav sticky avec blur : logo, liens ancres, CTA contact en pill lime. */
export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="wrap flex h-[76px] items-center justify-between">
        <Link
          href="/"
          className="font-display text-[20px] font-bold tracking-[-0.02em]"
        >
          rhamon<span className="text-lime">.dev</span>
        </Link>

        <div className="hidden gap-9 text-[14px] text-muted sm:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="/#contact"
          className="inline-block rounded-full bg-lime px-[22px] py-2.5 font-mono text-[13px] font-medium text-black transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_6px_20px_rgba(212,255,61,0.18)]"
        >
          Contact →
        </a>
      </div>
    </nav>
  );
}
