import { PhoneFrame } from "./PhoneFrame";

/** Mockup MamaShop : dashboard mobile (palette mint / forêt). */
export function MamaShopMockup() {
  const forest = "#0D4A2F";
  const mint = "#2ECC8A";
  const cream = "#FAF7F2";
  const ink = "#1C2B22";
  const muted = "#6B7F74";

  const bars = [40, 65, 50, 80, 60, 95, 72];

  return (
    <PhoneFrame>
      <div style={{ background: cream, color: ink }} className="text-[11px]">
        {/* status bar */}
        <div
          style={{ background: forest, color: "#cdeeda" }}
          className="flex items-center justify-between px-4 pb-1 pt-2 font-mono text-[9px]"
        >
          <span>9:41</span>
          <span>● ▮▮ 100%</span>
        </div>

        {/* header */}
        <div style={{ background: forest }} className="px-4 pb-5 pt-2 text-white">
          <div className="flex items-center justify-between">
            <span className="text-[10px] opacity-70">Bonjour 👋</span>
            <span
              style={{ background: "#6C3483" }}
              className="rounded-full px-2 py-[2px] text-[8px] font-medium"
            >
              Gérant
            </span>
          </div>
          <div className="mt-1 text-[15px] font-semibold">Komi&apos;s Shop</div>
        </div>

        {/* stat cards */}
        <div className="-mt-3 grid grid-cols-2 gap-2 px-3">
          <div className="rounded-xl bg-white p-2.5 shadow-sm">
            <div style={{ color: muted }} className="text-[8px]">
              Ventes du jour
            </div>
            <div className="text-[13px] font-bold">84 500 F</div>
          </div>
          <div className="rounded-xl bg-white p-2.5 shadow-sm">
            <div style={{ color: muted }} className="text-[8px]">
              Marge
            </div>
            <div style={{ color: mint }} className="text-[13px] font-bold">
              +22%
            </div>
          </div>
        </div>

        {/* chart */}
        <div className="mx-3 mt-3 rounded-xl bg-white p-3 shadow-sm">
          <div style={{ color: muted }} className="mb-2 text-[8px]">
            Cette semaine
          </div>
          <div className="flex h-16 items-end justify-between gap-1.5">
            {bars.map((h, i) => (
              <div
                key={i}
                style={{
                  height: `${h}%`,
                  background: i === 5 ? mint : "#CDEEDA",
                }}
                className="flex-1 rounded-t-sm"
              />
            ))}
          </div>
        </div>

        {/* recent sales */}
        <div className="px-3 pb-3 pt-3">
          <div style={{ color: muted }} className="mb-1.5 text-[8px]">
            Ventes récentes
          </div>
          {[
            ["Sac de riz × 2", "12 000 F"],
            ["Huile 5L", "6 500 F"],
            ["Crédit — Ama", "−3 000 F"],
          ].map(([label, val], i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-black/5 py-1.5"
            >
              <span>{label}</span>
              <span className="font-semibold">{val}</span>
            </div>
          ))}
        </div>

        {/* tab bar */}
        <div
          style={{ background: forest }}
          className="flex items-center justify-around py-2.5 text-[14px] text-white/70"
        >
          <span style={{ color: mint }}>◉</span>
          <span>▤</span>
          <span>＋</span>
          <span>▦</span>
          <span>☰</span>
        </div>
      </div>
    </PhoneFrame>
  );
}
