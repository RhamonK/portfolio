import { PhoneFrame } from "./PhoneFrame";

/** Mockup AURA — réceptionniste IA multi-canal : note vocale transcrite + prise de RDV. */
export function AuraMockup() {
  const header = "#5B21B6"; // violet AURA (IA)
  const bg = "#F4F1FA";
  const incoming = "#ffffff";
  const outgoing = "#EDE4FF";
  const ink = "#1e1b2e";
  const muted = "#7c748f";
  const accent = "#7C3AED";

  const channels = ["Web", "WhatsApp", "Messenger", "Instagram", "Telegram"];
  const bars = [6, 11, 7, 13, 8, 5, 10, 6];

  const Btn = ({ children }: { children: React.ReactNode }) => (
    <span
      style={{ color: accent }}
      className="rounded-md bg-white/95 px-2 py-[3px] text-[9px] font-medium shadow-sm"
    >
      {children}
    </span>
  );

  return (
    <PhoneFrame>
      <div className="text-[11px]" style={{ color: ink }}>
        {/* header */}
        <div style={{ background: header }} className="px-3 pb-2.5 pt-3 text-white">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-[12px]">
              🤖
            </div>
            <div className="leading-tight">
              <div className="text-[11px] font-semibold">AURA · Réceptionniste IA</div>
              <div className="text-[8px] text-white/70">répond 24/7 · texte &amp; vocal</div>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {channels.map((c) => (
              <span
                key={c}
                className="rounded-full bg-white/15 px-1.5 py-[2px] text-[7px]"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* chat */}
        <div style={{ background: bg }} className="flex flex-col gap-1.5 px-2.5 py-3">
          <div
            className="self-center rounded-full bg-black/5 px-2 py-[2px] text-[7px]"
            style={{ color: muted }}
          >
            canal : WhatsApp
          </div>

          {/* voice note (client) */}
          <div
            style={{ background: outgoing }}
            className="flex items-center gap-2 self-end rounded-lg rounded-tr-sm px-2.5 py-1.5 shadow-sm"
          >
            <span style={{ color: accent }}>▶</span>
            <span className="flex items-end gap-[2px]">
              {bars.map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}px`, background: accent }}
                  className="w-[2px] rounded-full opacity-70"
                />
              ))}
            </span>
            <span className="text-[8px]" style={{ color: muted }}>
              0:07
            </span>
          </div>
          <div className="self-end text-[8px] italic" style={{ color: muted }}>
            « Bonjour, je voudrais un balayage samedi »
          </div>

          {/* AURA reply */}
          <div
            style={{ background: incoming }}
            className="max-w-[86%] self-start rounded-lg rounded-tl-sm px-2.5 py-1.5 shadow-sm"
          >
            Bonjour ! 💜 Un <b>balayage</b>, c&apos;est 65 € (~2h). Voici des créneaux
            samedi :
          </div>
          <div className="flex max-w-[86%] flex-wrap gap-1 self-start">
            <Btn>10:00</Btn>
            <Btn>13:30</Btn>
            <Btn>16:00</Btn>
          </div>

          <div
            style={{ background: outgoing }}
            className="self-end rounded-lg rounded-tr-sm px-2.5 py-1.5 shadow-sm"
          >
            13:30
          </div>

          <div
            style={{ background: incoming }}
            className="max-w-[86%] self-start rounded-lg rounded-tl-sm px-2.5 py-1.5 shadow-sm"
          >
            ✅ C&apos;est réservé : <b>Balayage</b>, samedi <b>13:30</b>. Ajouté à
            l&apos;agenda 📅 — à samedi !
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
