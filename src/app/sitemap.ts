import type { MetadataRoute } from "next";
import { site } from "@/data/site";

// Chaque page existe en FR et en EN ; Google reçoit les deux versions liées.
const pages = [
  { fr: "/", en: "/en", priority: 1 },
  { fr: "/rapide", en: "/en/quick", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((p) =>
    (["fr", "en"] as const).map((lang) => ({
      url: `${site.url}${p[lang] === "/" ? "" : p[lang]}`,
      changeFrequency: "monthly" as const,
      priority: p.priority,
      alternates: { languages: { fr: `${site.url}${p.fr === "/" ? "" : p.fr}`, en: `${site.url}${p.en}` } },
    })),
  );
}
