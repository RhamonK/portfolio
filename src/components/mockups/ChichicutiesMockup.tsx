import { PhoneFrame } from "./PhoneFrame";

/** Mockup ChiChicuties : conversation Telegram de prise de RDV + rappel. */
export function ChichicutiesMockup() {
  const tgHeader = "#527da3"; // bleu Telegram
  const tgBg = "#d9e4dd"; // fond de chat
  const incoming = "#ffffff";
  const outgoing = "#e4fcc8";
  const btnText = "#3390ec";
  const ink = "#1f2c33";
  const muted = "#7d8a91";

  const Btn = ({ children }: { children: React.ReactNode }) => (
    <span
      style={{ color: btnText }}
      className="rounded-md bg-white/95 px-2 py-[3px] text-[9px] font-medium shadow-sm"
    >
      {children}
    </span>
  );

  return (
    <PhoneFrame>
      <div className="text-[11px]" style={{ color: ink }}>
        {/* telegram header */}
        <div
          style={{ background: tgHeader }}
          className="flex items-center gap-2 px-3 pb-2 pt-3 text-white"
        >
          <span className="text-[13px]">‹</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-[11px]">
            ✂️
          </div>
          <div className="leading-tight">
            <div className="text-[11px] font-semibold">ChiChicuties Bot</div>
            <div className="text-[8px] text-white/70">bot · en ligne</div>
          </div>
        </div>

        {/* chat */}
        <div
          style={{ background: tgBg }}
          className="flex flex-col gap-1.5 px-2.5 py-3"
        >
          {/* bot welcome + buttons */}
          <div
            style={{ background: incoming }}
            className="max-w-[85%] self-start rounded-lg rounded-tl-sm px-2.5 py-1.5 shadow-sm"
          >
            Bienvenue chez ChiChicuties ✂️<br />
            Quelle prestation souhaitez-vous ?
          </div>
          <div className="flex max-w-[85%] flex-wrap gap-1 self-start">
            <Btn>Coupe</Btn>
            <Btn>Tresses</Btn>
            <Btn>Coloration</Btn>
          </div>

          {/* user pick */}
          <div
            style={{ background: outgoing }}
            className="self-end rounded-lg rounded-tr-sm px-2.5 py-1.5 shadow-sm"
          >
            Tresses
          </div>

          {/* bot slots */}
          <div
            style={{ background: incoming }}
            className="max-w-[85%] self-start rounded-lg rounded-tl-sm px-2.5 py-1.5 shadow-sm"
          >
            Parfait 👍 Choisis un créneau 📅
          </div>
          <div className="flex max-w-[85%] flex-wrap gap-1 self-start">
            <Btn>Sam 10:00</Btn>
            <Btn>Sam 14:00</Btn>
            <Btn>Dim 11:00</Btn>
          </div>

          <div
            style={{ background: outgoing }}
            className="self-end rounded-lg rounded-tr-sm px-2.5 py-1.5 shadow-sm"
          >
            Sam 14:00
          </div>

          {/* confirmation */}
          <div
            style={{ background: incoming }}
            className="max-w-[85%] self-start rounded-lg rounded-tl-sm px-2.5 py-1.5 shadow-sm"
          >
            ✅ RDV confirmé : <b>Tresses</b>, samedi à <b>14:00</b>. À samedi ! 💇🏾‍♀️
          </div>

          {/* separator */}
          <div className="my-1 self-center rounded-full bg-black/10 px-2 py-[2px] text-[8px]" style={{ color: muted }}>
            — la veille —
          </div>

          {/* reminder */}
          <div
            style={{ background: incoming }}
            className="max-w-[85%] self-start rounded-lg rounded-tl-sm px-2.5 py-1.5 shadow-sm"
          >
            ⏰ <b>Rappel</b> : ton RDV Tresses, c&apos;est demain à 14:00 chez
            ChiChicuties. À très vite !
          </div>
        </div>

        {/* input bar */}
        <div className="flex items-center gap-2 bg-white px-3 py-2">
          <div
            className="flex-1 rounded-full bg-black/5 px-3 py-1 text-[10px]"
            style={{ color: muted }}
          >
            Message…
          </div>
          <span style={{ color: tgHeader }} className="text-[14px]">
            ➤
          </span>
        </div>
      </div>
    </PhoneFrame>
  );
}
