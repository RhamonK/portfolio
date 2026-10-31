import { ImageResponse } from "next/og";
import { site, siteCopy } from "@/data/site";
import type { Lang } from "@/i18n";

export const ogSize = { width: 1200, height: 630 };

// Image de partage (réseaux sociaux), générée au build.
export function ogImage(lang: Lang) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "radial-gradient(circle at 50% 50%, #1c2410 0%, #0a0b0a 65%)",
          color: "#f2f3ee",
        }}
      >
        <div style={{ fontSize: 108, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>{site.name}</div>
        <div style={{ marginTop: 28, fontSize: 36, color: "#9a9d93" }}>{siteCopy[lang].role}</div>
        <div style={{ marginTop: 40, fontSize: 28, color: "#d4ff3a" }}>{site.domain}</div>
      </div>
    ),
    ogSize,
  );
}
