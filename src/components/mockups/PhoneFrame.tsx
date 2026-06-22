import type { ReactNode } from "react";

/** Cadre « téléphone » réutilisable (bezel sombre + écran arrondi). */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[290px] rounded-[40px] border-[10px] border-[#15171a] bg-[#15171a] shadow-[0_30px_70px_rgba(0,0,0,0.55)]">
      <div className="overflow-hidden rounded-[30px] bg-white">{children}</div>
    </div>
  );
}
