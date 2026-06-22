import { BrowserFrame } from "./BrowserFrame";

/**
 * Mockup Novarift — fidèle au vrai index.html (site vitrine vanilla).
 * Palette réelle (CLAUDE.md) : fond #080A0F, or #C8A96E, blanc #F0EDE8.
 * Titres serif (Cormorant Garamond → fallback Georgia).
 */
export function NovariftMockup() {
  const bg = "#080A0F";
  const gold = "#C8A96E";
  const goldLight = "#E2C99A";
  const white = "#F0EDE8";
  const serif = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";

  return (
    <BrowserFrame url="novarift.io">
      <div style={{ background: bg, color: white }} className="text-[12px]">
        {/* nav */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <span className="text-[11px] font-semibold tracking-[0.22em]">
            NOVARIFT
          </span>
          <div className="flex items-center gap-3 text-[9px] text-white/55">
            <span>What we do</span>
            <span>Work</span>
            <span>Pricing</span>
            <span
              style={{ background: gold, color: bg }}
              className="rounded-full px-2.5 py-[3px] font-medium"
            >
              Start a project
            </span>
          </div>
        </div>

        {/* hero */}
        <div className="px-5 py-7">
          <div className="text-[9px] tracking-[0.25em]" style={{ color: gold }}>
            BASED IN CANADA · EST. 2025
          </div>
          <h1
            style={{ fontFamily: serif }}
            className="mt-3 text-[34px] font-medium leading-[0.98]"
          >
            We <em style={{ color: gold }}>build</em>
            <br />
            <span
              style={{ WebkitTextStroke: `1px ${gold}`, color: "transparent" }}
            >
              digital
            </span>
            <br />
            products.
          </h1>
          <p className="mt-4 max-w-[250px] text-[10px] leading-relaxed text-white/55">
            Novarift is a boutique digital agency crafting high-performance
            websites, web apps & automation systems for founders who refuse to
            blend in.
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

        {/* services strip */}
        <div className="border-t border-white/10 px-5 py-2.5">
          <div className="text-[8px] tracking-[0.2em]" style={{ color: gold }}>
            WHAT WE DO
          </div>
          <div className="mt-1 flex gap-3 text-[9px] text-white/70">
            <span>◈ Web Design</span>
            <span>⬡ Mobile Apps</span>
            <span>⟳ Automation</span>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
