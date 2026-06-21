/** Barre de statut fine : 3 dots (1 lime pulsant) + texte mono + curseur. */
export function StatusBar() {
  return (
    <div className="border-b border-line font-mono text-[12px] text-dim">
      <div className="wrap flex h-[38px] items-center justify-between">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="dot-live h-2 w-2 rounded-full" />
        </div>
        <div>
          3 projets livrés · Canada → Togo
          <span className="cursor" />
        </div>
      </div>
    </div>
  );
}
