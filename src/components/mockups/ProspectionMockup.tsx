import { PhoneFrame } from "./PhoneFrame";

/** Mockup Kelthen Prospection — synthèse de leads scorés (Telegram). */
export function ProspectionMockup() {
  const tg = "#527da3"; // bleu Telegram
  const bg = "#d9e4dd";
  const incoming = "#ffffff";
  const outgoing = "#e4fcc8";
  const ink = "#1f2c33";
  const muted = "#7d8a91";

  const leads = [
    { n: "Salon Éclat", r: "site lent · PageSpeed 32", score: 87 },
    { n: "Resto Le Baobab", r: "pas de site web", score: 81 },
    { n: "Garage Diallo", r: "site vétuste · PageSpeed 41", score: 74 },
  ];

  const scoreColor = (s: number) => (s >= 80 ? "#1a7f37" : "#E8A020");

  return (
    <PhoneFrame>
      <div className="text-[11px]" style={{ color: ink }}>
        {/* header */}
        <div
          style={{ background: tg }}
          className="flex items-center gap-2 px-3 pb-2 pt-3 text-white"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-[11px]">
            🔍
          </div>
          <div className="leading-tight">
            <div className="text-[11px] font-semibold">Kelthen · Prospection</div>
            <div className="text-[8px] text-white/70">bot · lead generation</div>
          </div>
        </div>

        {/* chat */}
        <div style={{ background: bg }} className="flex flex-col gap-1.5 px-2.5 py-3">
          <div
            style={{ background: outgoing }}
            className="self-end rounded-lg rounded-tr-sm px-2.5 py-1.5 shadow-sm"
          >
            coiffeurs · Gatineau
          </div>

          <div
            style={{ background: incoming }}
            className="max-w-[92%] self-start rounded-lg rounded-tl-sm px-2.5 py-2 shadow-sm"
          >
            <div className="font-semibold">🔍 12 entreprises analysées</div>
            <div className="mt-1.5 flex flex-col gap-1.5">
              {leads.map((l) => (
                <div key={l.n} className="flex items-center gap-2">
                  <span
                    style={{ background: scoreColor(l.score) }}
                    className="rounded-md px-1.5 py-[2px] text-[9px] font-bold text-white"
                  >
                    {l.score}
                  </span>
                  <div className="leading-tight">
                    <div className="text-[10px] font-semibold">{l.n}</div>
                    <div className="text-[8px]" style={{ color: muted }}>
                      {l.r}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-1.5 text-[8px]" style={{ color: muted }}>
              ↳ 8 leads qualifiés enregistrés dans Sheets
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
