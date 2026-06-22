import { BrowserFrame } from "./BrowserFrame";

/**
 * Mockup ABO — fidèle à la vraie home (app/page.tsx) + profil artisan.
 * Palette réelle (tailwind.config.ts) : navy #0F2A4A, teal #0D9488,
 * teal-accent #2DD4BF, teal-light #CCFBF1.
 */
export function AboMockup() {
  const navy = "#0F2A4A";
  const teal = "#0D9488";
  const tealAccent = "#2DD4BF";
  const tealLight = "#CCFBF1";
  const tealDark = "#0B7A70";
  const gray50 = "#F8F9FA";
  const ink = "#212529";
  const gray = "#6C757D";

  return (
    <BrowserFrame url="abo.tg">
      <div style={{ background: gray50, color: ink }} className="text-[11px]">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-2.5">
          <span style={{ color: navy }} className="text-[14px] font-bold tracking-tight">
            ABO
          </span>
          <span style={{ color: navy }} className="text-[10px] font-medium">
            Se connecter
          </span>
        </div>

        {/* hero navy */}
        <div style={{ background: navy }} className="px-4 py-5 text-white">
          <span
            style={{ background: tealLight, color: tealDark }}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-medium"
          >
            🛡 12 artisans vérifiés
          </span>
          <h1 className="mt-3 text-[19px] font-medium leading-tight">
            Trouvez un artisan{" "}
            <span style={{ color: tealAccent }}>vérifié</span> à Lomé
          </h1>
          <p className="mt-2 text-[10px] leading-relaxed text-white/80">
            Identité confirmée par l&apos;équipe ABO. Avis authentiques. Contact
            direct WhatsApp.
          </p>

          {/* search form */}
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-1.5 rounded-xl bg-white p-1.5">
            <div className="flex flex-col gap-1.5">
              <div
                style={{ color: ink, borderColor: "#E9ECEF" }}
                className="rounded-lg border px-2.5 py-1.5 text-[10px]"
              >
                Tous les métiers ▾
              </div>
              <div
                style={{ color: gray, borderColor: "#E9ECEF" }}
                className="rounded-lg border px-2.5 py-1.5 text-[10px]"
              >
                Ville ou quartier
              </div>
            </div>
            <button
              style={{ background: teal }}
              className="flex items-center rounded-lg px-3 text-[10px] font-medium text-white"
            >
              ⌕ Chercher
            </button>
          </div>
        </div>

        {/* featured artisan card */}
        <div className="px-4 py-3">
          <div style={{ color: navy }} className="mb-2 text-[11px] font-semibold">
            Artisans vérifiés en vedette
          </div>
          <div
            style={{ borderColor: "#E9ECEF" }}
            className="flex items-center gap-3 rounded-2xl border bg-white p-3"
          >
            <div
              style={{ background: navy }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-medium text-white"
            >
              K
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span style={{ color: navy }} className="text-[13px] font-medium">
                  Kofi A.
                </span>
                <span
                  style={{ background: tealLight, color: tealDark }}
                  className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-[1px] text-[8px] font-medium"
                >
                  🛡 Vérifié
                </span>
              </div>
              <div style={{ color: gray }} className="text-[10px]">
                Plombier · Lomé · Tokoin
              </div>
              <div className="text-[10px]">
                <span style={{ color: "#D97706" }}>★ 4.8</span>
                <span style={{ color: gray }}> · 23 avis</span>
              </div>
            </div>
          </div>

          {/* contact buttons (BoutonsContact) */}
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <button
              style={{ background: "#25D366" }}
              className="rounded-lg py-2 text-[10px] font-semibold text-white"
            >
              WhatsApp
            </button>
            <button
              style={{ background: teal }}
              className="rounded-lg py-2 text-[10px] font-semibold text-white"
            >
              Demander un devis
            </button>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
