import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { site, siteCopy } from "@/data/site";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ui, type Lang } from "@/i18n";
import "@/app/globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Squelette HTML commun aux deux langues (une mise en page racine par langue,
// pour que <html lang> soit juste sur chaque page).
export function RootShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    email: `mailto:${site.email}`,
    jobTitle: siteCopy[lang].role,
    worksFor: { "@type": "Organization", name: "Kelthen Inc.", url: site.links.kelthen },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gatineau",
      addressRegion: "QC",
      addressCountry: "CA",
    },
    knowsLanguage: ["fr", "en"],
    sameAs: [site.links.github, site.links.kelthen],
  };

  return (
    <html lang={lang} suppressHydrationWarning className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>
        {/* classe « js » posée avant l'affichage : l'intro peut cacher le nom sans flash */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <a href="#contenu" className="sr-only-focusable btn btn-lime fixed left-4 top-4 z-[100]">
          {ui[lang].skip}
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
