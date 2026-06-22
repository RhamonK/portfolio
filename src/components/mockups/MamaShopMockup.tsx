import { PhoneFrame } from "./PhoneFrame";

/**
 * Mockup MamaShop — fidèle au vrai dashboard Gérant (app React Native).
 * Palette réelle (constants/colors.ts) : forêt #2D6A4F, rouge tomate #C0392B,
 * crème #FAF7F2 — « inspirée marché africain ». Grossiste fruits & légumes.
 */
export function MamaShopMockup() {
  const forest = "#2D6A4F";
  const forestMid = "#40916C";
  const sage = "#95D5B2";
  const tomato = "#C0392B";
  const cream = "#FAF7F2";
  const ink = "#1C2B22";
  const muted = "#6B7F74";
  const amber = "#E8A020";

  const bars = [45, 70, 55, 85, 62, 95, 78];

  const kpis = [
    { val: "84k", lbl: "Ventes F", color: forest },
    { val: "12k", lbl: "Crédit F", color: amber },
    { val: "2", lbl: "Critique", color: tomato },
    { val: "23%", lbl: "Marge", color: forest },
  ];

  const top = [
    { emoji: "🍅", name: "Tomate", detail: "9 cuvettes vendues", amount: "31 500 F" },
    { emoji: "🌶️", name: "Piment", detail: "6 paniers vendus", amount: "18 000 F" },
    { emoji: "🧅", name: "Oignon", detail: "4 sacs vendus", amount: "14 000 F" },
  ];

  return (
    <PhoneFrame>
      <div style={{ background: cream, color: ink }} className="relative text-[11px]">
        {/* status + header app (hamburger + wordmark) */}
        <div className="flex items-center justify-between px-4 pb-1 pt-2 font-mono text-[8px]" style={{ color: muted }}>
          <span>9:41</span>
          <span>▮▮ 100%</span>
        </div>
        <div className="flex items-center gap-2 px-4 pb-2" style={{ color: forest }}>
          <span className="text-[14px]">☰</span>
          <span className="text-[14px] font-extrabold tracking-tight">MamaShop</span>
        </div>

        {/* hero : profil + KPIs */}
        <div className="px-4 pb-3">
          <div className="mb-3 flex items-center gap-2">
            <div
              style={{ background: forest }}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold text-white"
            >
              A
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-extrabold">Awa M.</div>
              <div style={{ color: muted }} className="text-[9px]">
                Gérante · En direct
              </div>
            </div>
            <span
              style={{ background: "#D8F3DC", color: forest }}
              className="rounded-full px-2 py-[3px] text-[8px] font-bold"
            >
              Aujourd&apos;hui
            </span>
          </div>

          <div className="flex gap-1.5">
            {kpis.map((k) => (
              <div
                key={k.lbl}
                style={{ borderColor: "rgba(45,106,79,0.12)" }}
                className="flex-1 rounded-xl border-[1.5px] bg-white px-1 py-2 text-center"
              >
                <div style={{ color: k.color }} className="text-[13px] font-extrabold">
                  {k.val}
                </div>
                <div style={{ color: "#9CA3AF" }} className="mt-[2px] text-[7px] font-semibold uppercase tracking-wide">
                  {k.lbl}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* chart */}
        <div className="mx-4 mb-2.5 rounded-2xl bg-white p-3">
          <div style={{ color: muted }} className="mb-2 text-[8px] font-bold uppercase tracking-wide">
            Ventes — 7 jours
          </div>
          <div className="flex h-14 items-end justify-between gap-1.5">
            {bars.map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%`, background: i === 5 ? forestMid : sage }}
                className="flex-1 rounded-t-sm"
              />
            ))}
          </div>
        </div>

        {/* alertes actives */}
        <div className="mx-4 mb-2.5 rounded-2xl bg-white p-3">
          <div style={{ color: muted }} className="mb-2 text-[8px] font-bold uppercase tracking-wide">
            Alertes actives
          </div>
          <div style={{ background: "#FDEDEC" }} className="mb-1.5 flex gap-2 rounded-lg p-2">
            <span style={{ color: tomato }} className="text-[12px] font-bold">!</span>
            <div>
              <div className="text-[10px] font-semibold">Tomate — stock critique : 3 cuvettes</div>
              <div style={{ color: muted }} className="text-[8px]">Seuil : 5 · Commander maintenant</div>
            </div>
          </div>
          <div style={{ background: "#FEF3C7" }} className="flex gap-2 rounded-lg p-2">
            <span style={{ color: amber }} className="text-[12px] font-bold">$</span>
            <div>
              <div className="text-[10px] font-semibold">45 000 F d&apos;impayés en cours</div>
              <div style={{ color: muted }} className="text-[8px]">Vérifier les clients avec dettes</div>
            </div>
          </div>
        </div>

        {/* top produits */}
        <div className="mx-4 mb-3 rounded-2xl bg-white p-3">
          <div style={{ color: muted }} className="mb-1.5 text-[8px] font-bold uppercase tracking-wide">
            Top produits aujourd&apos;hui
          </div>
          {top.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-2 py-1.5"
              style={{ borderBottom: i < top.length - 1 ? "1px solid rgba(45,106,79,0.06)" : "none" }}
            >
              <div style={{ background: "#F5EBE0" }} className="flex h-7 w-7 items-center justify-center rounded-lg text-[13px]">
                {p.emoji}
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-bold">{p.name}</div>
                <div style={{ color: muted }} className="text-[8px]">{p.detail}</div>
              </div>
              <div style={{ color: forestMid }} className="text-[11px] font-extrabold">{p.amount}</div>
            </div>
          ))}
        </div>

        {/* FAB */}
        <div
          style={{ background: forest }}
          className="absolute bottom-3 right-3 rounded-full px-3.5 py-2 text-[10px] font-extrabold text-white shadow-lg"
        >
          + Vente
        </div>
      </div>
    </PhoneFrame>
  );
}
