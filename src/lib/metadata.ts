import type { Metadata, Viewport } from "next";
import { site, siteCopy } from "@/data/site";
import type { Lang } from "@/i18n";

export const viewport: Viewport = {
  themeColor: "#0a0b0a",
  colorScheme: "dark",
  // Sur iPhone, permet à la pastille CV de se placer au-dessus de la barre d'accueil.
  viewportFit: "cover",
};

const keywords: Record<Lang, string[]> = {
  fr: ["Rhamone Nyavedji", "développeur full-stack", "automatisation", "intégration IA", "Kelthen Inc.", "Gatineau", "Ottawa", "portfolio"],
  en: ["Rhamone Nyavedji", "full-stack developer", "automation", "AI integration", "Kelthen Inc.", "Gatineau", "Ottawa", "portfolio"],
};

/** Métadonnées d'une page : canonique + version dans l'autre langue (hreflang). */
export function pageMetadata(
  lang: Lang,
  paths: Record<Lang, string>,
  overrides: { title?: string; description?: string } = {},
): Metadata {
  const copy = siteCopy[lang];
  const title = overrides.title ?? copy.title;
  const description = overrides.description ?? copy.description;
  return {
    metadataBase: new URL(site.url),
    title,
    description,
    applicationName: site.name,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    keywords: keywords[lang],
    alternates: {
      canonical: paths[lang],
      languages: { fr: paths.fr, en: paths.en, "x-default": paths.fr },
    },
    openGraph: {
      type: "website",
      url: paths[lang],
      siteName: site.name,
      title,
      description,
      locale: lang === "fr" ? "fr_CA" : "en_CA",
      alternateLocale: [lang === "fr" ? "en_CA" : "fr_CA"],
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}
