// Dessins des projets (traits lime et blanc) affichés sur les écrans,
// en attendant les vraies captures. Ce sont des illustrations de ce que
// fait chaque projet : aucun chiffre, client ni contenu réel inventé.

const L = "#d4ff3a";
const W = "rgba(242,243,238,0.55)";
const F = "rgba(242,243,238,0.08)";

function Lines({ x, y, widths, gap = 14 }: { x: number; y: number; widths: number[]; gap?: number }) {
  return (
    <>
      {widths.map((w, i) => (
        <rect key={i} x={x} y={y + i * gap} width={w} height={5} rx={2.5} fill={W} opacity={0.5} />
      ))}
    </>
  );
}

function MamaShop() {
  return (
    <>
      {/* téléphone */}
      <rect x={60} y={60} width={170} height={300} rx={22} fill={F} stroke={W} strokeWidth={2} />
      <rect x={80} y={90} width={130} height={26} rx={13} fill="none" stroke={L} strokeWidth={2} />
      {["Gérant", "Agent", "Diaspora"].map((t, i) => (
        <text key={t} x={95 + i * 40} y={108} fontSize={9} fill={i === 0 ? L : W} fontFamily="monospace">
          {t}
        </text>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={80} y={135 + i * 52} width={130} height={40} rx={10} fill={F} stroke={W} strokeOpacity={0.3} />
          <circle cx={98} cy={155 + i * 52} r={9} fill="none" stroke={L} strokeWidth={2} />
          <Lines x={115} y={148 + i * 52} widths={[70, 45]} gap={11} />
        </g>
      ))}
      {/* tableau de bord en direct */}
      <rect x={270} y={60} width={310} height={190} rx={16} fill={F} stroke={W} strokeWidth={2} />
      <circle cx={295} cy={85} r={5} fill={L} />
      <Lines x={308} y={82} widths={[90]} />
      {[60, 100, 75, 130, 95, 150, 120].map((h, i) => (
        <rect key={i} x={295 + i * 38} y={230 - h} width={22} height={h} rx={5} fill={i === 5 ? L : W} opacity={i === 5 ? 0.9 : 0.35} />
      ))}
      {/* même sans réseau */}
      <rect x={270} y={275} width={310} height={85} rx={16} fill={F} stroke={L} strokeWidth={2} />
      <path d="M305 330 q-18 0 -18 -16 q0 -15 16 -16 q6 -16 24 -14 q16 2 18 18 q14 2 14 14 q0 14 -14 14 z" fill="none" stroke={W} strokeWidth={2} />
      <line x1={295} y1={295} x2={350} y2={345} stroke={L} strokeWidth={3} strokeLinecap="round" />
      <Lines x={380} y={305} widths={[160, 120, 90]} />
    </>
  );
}

function Abo() {
  return (
    <>
      {/* fiche artisan vérifiée */}
      <rect x={70} y={60} width={250} height={300} rx={20} fill={F} stroke={W} strokeWidth={2} />
      <circle cx={195} cy={135} r={42} fill="none" stroke={W} strokeWidth={2} />
      <circle cx={195} cy={122} r={14} fill="none" stroke={W} strokeWidth={2} />
      <path d="M170 160 q25 -26 50 0" fill="none" stroke={W} strokeWidth={2} />
      <circle cx={228} cy={102} r={15} fill={L} />
      <path d="M221 102 l5 5 l9 -10" fill="none" stroke="#0a0b0a" strokeWidth={3} strokeLinecap="round" />
      <rect x={135} y={195} width={120} height={24} rx={12} fill="none" stroke={L} strokeWidth={2} />
      <text x={195} y={211} fontSize={11} fill={L} fontFamily="monospace" textAnchor="middle">
        Vérifié
      </text>
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          transform={`translate(${143 + i * 22} 245)`}
          d="M8 0 l2.4 5 5.6 .8 -4 4 1 5.6 -5 -2.6 -5 2.6 1 -5.6 -4 -4 5.6 -.8z"
          fill={L}
          opacity={0.85}
        />
      ))}
      <Lines x={110} y={285} widths={[170, 140, 150]} />
      {/* documents sécurisés */}
      <rect x={360} y={60} width={210} height={140} rx={16} fill={F} stroke={W} strokeWidth={2} />
      <rect x={385} y={85} width={70} height={90} rx={6} fill="none" stroke={W} strokeWidth={2} />
      <Lines x={395} y={100} widths={[50, 40, 50, 30]} gap={14} />
      <rect x={485} y={120} width={50} height={40} rx={6} fill="none" stroke={L} strokeWidth={2} />
      <path d="M495 120 v-12 q15 -20 30 0 v12" fill="none" stroke={L} strokeWidth={2} />
      {/* avis vérifiés */}
      <rect x={360} y={220} width={210} height={140} rx={16} fill={F} stroke={W} strokeWidth={2} />
      {[0, 1].map((i) => (
        <g key={i}>
          <circle cx={390} cy={258 + i * 55} r={12} fill="none" stroke={W} strokeWidth={2} />
          <Lines x={412} y={250 + i * 55} widths={[130, 95]} gap={12} />
        </g>
      ))}
    </>
  );
}

function ChiChicuties() {
  return (
    <>
      {/* conversation */}
      <rect x={60} y={50} width={280} height={320} rx={20} fill={F} stroke={W} strokeWidth={2} />
      <rect x={80} y={80} width={170} height={44} rx={14} fill="none" stroke={W} strokeWidth={2} />
      <Lines x={95} y={95} widths={[130, 90]} gap={12} />
      <rect x={150} y={140} width={170} height={36} rx={14} fill={L} opacity={0.9} />
      <rect x={165} y={155} width={110} height={5} rx={2.5} fill="#0a0b0a" opacity={0.6} />
      <rect x={80} y={192} width={200} height={70} rx={14} fill="none" stroke={W} strokeWidth={2} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={92 + i * 62} y={226} width={54} height={24} rx={8} fill="none" stroke={i === 1 ? L : W} strokeWidth={2} />
      ))}
      <Lines x={92} y={206} widths={[120]} />
      <rect x={170} y={280} width={150} height={36} rx={14} fill={L} opacity={0.9} />
      <path d="M250 292 l6 6 l12 -12" fill="none" stroke="#0a0b0a" strokeWidth={3} strokeLinecap="round" />
      {/* agenda */}
      <rect x={380} y={50} width={200} height={200} rx={18} fill={F} stroke={W} strokeWidth={2} />
      <Lines x={400} y={72} widths={[90]} />
      {Array.from({ length: 20 }).map((_, i) => (
        <rect
          key={i}
          x={400 + (i % 5) * 34}
          y={95 + Math.floor(i / 5) * 36}
          width={26}
          height={26}
          rx={6}
          fill={i === 12 ? L : "none"}
          stroke={W}
          strokeOpacity={0.35}
        />
      ))}
      {/* rappel automatique */}
      <rect x={380} y={270} width={200} height={100} rx={18} fill={F} stroke={L} strokeWidth={2} />
      <path d="M418 330 v-16 q0 -18 16 -20 q16 2 16 20 v16 l6 6 h-44 z" fill="none" stroke={L} strokeWidth={2} />
      <circle cx={434} cy={344} r={4} fill={L} />
      <Lines x={470} y={305} widths={[90, 70, 80]} />
    </>
  );
}

function Kelthen() {
  return (
    <>
      {/* site web */}
      <rect x={50} y={50} width={330} height={240} rx={16} fill={F} stroke={W} strokeWidth={2} />
      <line x1={50} y1={78} x2={380} y2={78} stroke={W} strokeOpacity={0.4} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={68 + i * 14} cy={64} r={4} fill={i === 0 ? L : W} opacity={0.6} />
      ))}
      <rect x={75} y={100} width={180} height={18} rx={9} fill={W} opacity={0.6} />
      <Lines x={75} y={132} widths={[220, 170]} />
      <rect x={75} y={168} width={90} height={26} rx={13} fill={L} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={75 + i * 100} y={212} width={88} height={58} rx={10} fill="none" stroke={W} strokeOpacity={0.4} />
      ))}
      {/* automatisation */}
      <g stroke={L} strokeWidth={2} fill="none">
        <path d="M430 110 C 480 110, 470 190, 520 190" />
        <path d="M430 270 C 480 270, 470 190, 520 190" />
        <path d="M430 110 V 270" strokeOpacity={0.4} />
      </g>
      {[
        [430, 110],
        [430, 190],
        [430, 270],
      ].map(([cx, cy], i) => (
        <rect key={i} x={cx - 22} y={cy - 18} width={44} height={36} rx={10} fill="#0a0b0a" stroke={W} strokeWidth={2} />
      ))}
      {/* IA */}
      <circle cx={540} cy={190} r={34} fill="#0a0b0a" stroke={L} strokeWidth={2} />
      <path d="M540 170 l5 15 15 5 -15 5 -5 15 -5 -15 -15 -5 15 -5z" fill={L} />
      <Lines x={75} y={320} widths={[300, 240, 270]} />
      <rect x={420} y={320} width={160} height={50} rx={14} fill="none" stroke={W} strokeWidth={2} />
      <Lines x={440} y={334} widths={[110, 80]} gap={12} />
    </>
  );
}

function Fraul() {
  return (
    <>
      <rect x={50} y={50} width={540} height={320} rx={18} fill={F} stroke={W} strokeWidth={2} />
      <line x1={50} y1={95} x2={590} y2={95} stroke={W} strokeOpacity={0.4} />
      <rect x={75} y={66} width={70} height={14} rx={7} fill={W} opacity={0.6} />
      {/* panier */}
      <path d="M535 64 h8 l6 22 h26 l5 -16 h-34" fill="none" stroke={L} strokeWidth={2} strokeLinejoin="round" />
      <circle cx={553} cy={92} r={3} fill={L} />
      <circle cx={571} cy={92} r={3} fill={L} />
      {/* produits */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={75 + i * 128} y={115} width={110} height={130} rx={12} fill="none" stroke={W} strokeOpacity={0.45} strokeWidth={2} />
          <path
            d={`M${95 + i * 128} 220 l20 -30 15 18 12 -14 23 26z`}
            fill="none"
            stroke={i === 1 ? L : W}
            strokeOpacity={i === 1 ? 1 : 0.5}
            strokeWidth={2}
          />
          <circle cx={150 + i * 128} cy={150} r={8} fill="none" stroke={i === 1 ? L : W} strokeOpacity={i === 1 ? 1 : 0.5} strokeWidth={2} />
          <Lines x={75 + i * 128} y={260} widths={[90, 60]} gap={12} />
          <rect x={75 + i * 128} y={295} width={110} height={28} rx={14} fill={i === 1 ? L : "none"} stroke={i === 1 ? L : W} strokeOpacity={0.5} />
        </g>
      ))}
    </>
  );
}

const arts: Record<string, () => React.JSX.Element> = {
  mamashop: MamaShop,
  abo: Abo,
  chichicuties: ChiChicuties,
  kelthen: Kelthen,
  fraul: Fraul,
};

export function ProjectArt({ slug }: { slug: string }) {
  const Art = arts[slug];
  return (
    <svg viewBox="0 0 640 420" className="h-full w-full" aria-hidden preserveAspectRatio="xMidYMid meet">
      {Art ? <Art /> : null}
    </svg>
  );
}
