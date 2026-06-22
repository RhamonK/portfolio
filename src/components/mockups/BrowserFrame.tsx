import type { ReactNode } from "react";

/** Cadre « fenêtre navigateur » réutilisable (macOS-like). */
export function BrowserFrame({
  url,
  children,
}: {
  url: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-line bg-[#0d100c] shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-3 border-b border-line bg-white/[0.03] px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 truncate rounded-md bg-black/40 px-3 py-1 text-center font-mono text-[11px] text-dim">
          {url}
        </div>
      </div>
      {children}
    </div>
  );
}
