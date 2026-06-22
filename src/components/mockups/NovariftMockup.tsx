import { BrowserFrame } from "./BrowserFrame";

/** Mockup Novarift : hero du site d'agence (palette dark / gold). */
export function NovariftMockup() {
  const bg = "#080A0F";
  const gold = "#C8A96E";
  const goldLight = "#E2C99A";
  const white = "#F0EDE8";
  const serif = "Georgia, 'Times New Roman', serif";

  return (
    <BrowserFrame url="novarift.io">
      <div style={{ background: bg, color: white }} className="text-[12px]">
        {/* nav */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <span
            className="tracking-[0.2em] text-[11px] font-semibold"
            style={{ color: white }}
          >
            NOVARIFT
          </span>
          <div className="flex items-center gap-3 text-[9px] text-white/60">
            <span>Services</span>
            <span>Work</span>
            <span>Pricing</span>
            <span
              style={{ borderColor: gold, color: gold }}
              className="rounded-full border px-2 py-[3px]"
            >
              Contact
            </span>
          </div>
        </div>

        {/* hero */}
        <div className="px-5 py-8">
          <div
            className="text-[9px] tracking-[0.25em]"
            style={{ color: gold }}
          >
            BASED IN CANADA · EST. 2025
          </div>
          <h3
            style={{ fontFamily: serif }}
            className="mt-3 text-[26px] leading-[1.15]"
          >
            We build digital
            <br />
            experiences that{" "}
            <span style={{ color: gold, fontStyle: "italic" }}>convert</span>.
          </h3>
          <p className="mt-3 max-w-[230px] text-[10px] leading-relaxed text-white/55">
            High-performance websites, web apps, automation & AI for founders
            who refuse to blend in.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span
              style={{ background: gold, color: bg }}
              className="rounded-full px-3 py-1.5 text-[10px] font-semibold"
            >
              Start a project
            </span>
            <span
              style={{ borderColor: "rgba(200,169,110,0.4)", color: goldLight }}
              className="rounded-full border px-3 py-1.5 text-[10px]"
            >
              See our work
            </span>
          </div>
        </div>

        {/* marquee strip */}
        <div
          className="border-t border-white/10 px-5 py-2 font-mono text-[8px] tracking-wider"
          style={{ color: "rgba(200,169,110,0.55)" }}
        >
          WEB DESIGN · WEB APPS · AUTOMATION · AI · BRANDING · SEO ·
        </div>
      </div>
    </BrowserFrame>
  );
}
