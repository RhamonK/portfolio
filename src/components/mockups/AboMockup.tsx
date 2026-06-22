import { BrowserFrame } from "./BrowserFrame";

/** Mockup ABO : profil d'artisan vérifié (palette navy / teal). */
export function AboMockup() {
  const navy = "#0F2A4A";
  const teal = "#0D9488";
  const tealAccent = "#2DD4BF";
  const bg = "#F8F9FA";
  const ink = "#212529";
  const gray = "#6C757D";

  return (
    <BrowserFrame url="abo.tg/artisans/kofi-plombier-lome">
      <div style={{ background: bg, color: ink }} className="text-[12px]">
        {/* top nav */}
        <div
          style={{ background: navy }}
          className="flex items-center justify-between px-4 py-2.5 text-white"
        >
          <span className="font-bold tracking-wide">ABO</span>
          <div
            style={{ background: "rgba(255,255,255,0.12)" }}
            className="flex-1 mx-3 rounded-full px-3 py-1 text-[10px] text-white/60"
          >
            Plombier · Lomé…
          </div>
          <span className="text-[10px] opacity-80">Connexion</span>
        </div>

        {/* profile */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div
              style={{ background: tealAccent, color: navy }}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[18px] font-bold"
            >
              K
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold">Kofi A.</span>
                <span
                  style={{ background: teal }}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[9px] font-semibold text-white"
                >
                  ✓ Vérifié ABO
                </span>
              </div>
              <div style={{ color: gray }} className="text-[11px]">
                Plombier · Quartier Tokoin
              </div>
              <div className="mt-1 text-[11px]">
                <span style={{ color: "#D97706" }}>★ 4.8</span>
                <span style={{ color: gray }}> · 23 avis vérifiés</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            style={{ background: teal }}
            className="mt-3 w-full rounded-lg py-2 text-[12px] font-semibold text-white"
          >
            Demander un devis
          </button>

          {/* services */}
          <div className="mt-3 text-[10px] font-semibold" style={{ color: gray }}>
            SERVICES
          </div>
          {[
            ["Dépannage fuite", "5 000 – 15 000 F"],
            ["Installation sanitaire", "sur devis"],
          ].map(([s, p], i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg bg-white px-3 py-2 mt-1.5 shadow-sm"
            >
              <span>{s}</span>
              <span style={{ color: gray }}>{p}</span>
            </div>
          ))}

          {/* portfolio before/after */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg" style={{ background: "#E9ECEF", height: 46 }}>
              <div style={{ color: gray }} className="p-1 text-[8px]">
                Avant
              </div>
            </div>
            <div className="rounded-lg" style={{ background: "#CCFBF1", height: 46 }}>
              <div style={{ color: teal }} className="p-1 text-[8px]">
                Après
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
