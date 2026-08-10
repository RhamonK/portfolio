import { PhoneFrame } from "./PhoneFrame";

/** Mockup Agent Financier IA — rapport marché matinal + alerte intraday (Telegram). */
export function AgentFinancierMockup() {
  const tg = "#527da3"; // bleu Telegram
  const bg = "#d9e4dd";
  const incoming = "#ffffff";
  const ink = "#1f2c33";
  const muted = "#7d8a91";
  const up = "#1a7f37";
  const down = "#c0392b";

  const rows = [
    { s: "AAPL", v: "+1,2 %", c: up },
    { s: "TSLA", v: "−0,8 %", c: down },
    { s: "BTC", v: "+3,4 %", c: up },
  ];

  return (
    <PhoneFrame>
      <div className="text-[11px]" style={{ color: ink }}>
        {/* header */}
        <div
          style={{ background: tg }}
          className="flex items-center gap-2 px-3 pb-2 pt-3 text-white"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-[11px]">
            📈
          </div>
          <div className="leading-tight">
            <div className="text-[11px] font-semibold">Agent Financier IA</div>
            <div className="text-[8px] text-white/70">bot · rapport &amp; alertes</div>
          </div>
        </div>

        {/* chat */}
        <div style={{ background: bg }} className="flex flex-col gap-1.5 px-2.5 py-3">
          {/* morning report card */}
          <div
            style={{ background: incoming }}
            className="max-w-[92%] self-start rounded-lg rounded-tl-sm px-2.5 py-2 shadow-sm"
          >
            <div className="font-semibold">📊 Rapport matin · 08:00</div>
            <div className="my-1.5 flex flex-col gap-1">
              {rows.map((r) => (
                <div key={r.s} className="flex items-center justify-between">
                  <span className="font-mono text-[10px]">{r.s}</span>
                  <span
                    className="font-mono text-[10px] font-semibold"
                    style={{ color: r.c }}
                  >
                    {r.v}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-[9px] leading-snug" style={{ color: muted }}>
              <b style={{ color: ink }}>Analyse —</b> tendance haussière sur la tech ;
              prudence sur la volatilité crypto. Rien d&apos;urgent aujourd&apos;hui.
            </div>
            <div className="mt-1 text-[8px]" style={{ color: muted }}>
              ↳ archivé dans Google Sheets
            </div>
          </div>

          <div
            className="my-1 self-center rounded-full bg-black/10 px-2 py-[2px] text-[8px]"
            style={{ color: muted }}
          >
            — 14:37, en séance —
          </div>

          {/* intraday alert */}
          <div
            style={{ background: "#FFF4D6" }}
            className="max-w-[92%] self-start rounded-lg rounded-tl-sm px-2.5 py-1.5 shadow-sm"
          >
            ⚠️ <b>Signal détecté</b> : NVDA franchit sa résistance, +5,2 % en forte
            hausse de volume.
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
