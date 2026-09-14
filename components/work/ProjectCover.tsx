import type { ReactNode } from 'react';
import type { Motif } from '@/lib/content';

/**
 * Typographic "blueprint" covers — no screenshots of client work exist publicly,
 * so each card gets an abstract drawing of the thing that product is known for.
 */

const K = {
  panel: '#141313',
  raised: '#1f1e1d',
  line: '#2d2b2a',
  rule: '#3a3836',
  label: '#9a9791',
  copper: '#cf8047',
  cream: '#fbfbfa',
  sand: '#ffb68e',
  ink: '#0a0a0a',
};

const mono = { className: 'font-mono', fontSize: 8, fill: K.label };

/** Parts catalog filtered down to what fits the saved vehicle. */
const storefront = (
  <g>
    <rect x="112" y="30" width="248" height="26" fill={K.panel} stroke={K.rule} />
    <text {...mono} x="122" y="46" fontSize="9">
      My Garage · Camry 2019 · oil filter
    </text>
    <rect x="316" y="35" width="38" height="16" fill={K.copper} />
    <text {...mono} x="335" y="46" fill={K.ink} fontWeight="600" textAnchor="middle">
      FITS
    </text>
    {Array.from({ length: 8 }, (_, i) => {
      const x = 112 + (i % 4) * 64;
      const y = 68 + Math.floor(i / 4) * 72;
      const fits = i === 1 || i === 6;
      return (
        <g key={i} opacity={fits ? 1 : 0.4}>
          <rect x={x} y={y} width="56" height="62" fill={K.panel} stroke={fits ? K.copper : K.line} />
          <rect x={x + 6} y={y + 6} width="44" height="28" fill={K.raised} />
          <rect x={x + 6} y={y + 41} width="30" height="3" fill={K.rule} />
          <rect x={x + 6} y={y + 49} width="18" height="3" fill={fits ? K.copper : K.rule} />
          {fits && <path d={`M${x + 38} ${y + 49}l3 3 6-6`} stroke={K.copper} strokeWidth="1.5" fill="none" />}
        </g>
      );
    })}
    {['EN', 'AR', '中'].map((l, i) => (
      <g key={l}>
        <rect x={112 + i * 30} y="216" width="24" height="15" fill={K.panel} stroke={l === 'AR' ? K.copper : K.rule} />
        <text {...mono} x={124 + i * 30} y="226.5" textAnchor="middle" fill={l === 'AR' ? K.sand : K.label}>
          {l}
        </text>
      </g>
    ))}
  </g>
);

const BARS = [28, 40, 34, 52, 46, 60, 38, 64, 58, 72, 50, 80, 68, 86];

/** 4-step product wizard, KPI cards and a sales trend. */
const dashboard = (
  <g>
    <text {...mono} x="112" y="22">
      PRODUCT WIZARD · 3/4
    </text>
    <path d="M138 42h54M208 42h54M278 42h54" stroke={K.rule} />
    {[0, 1, 2, 3].map((i) => (
      <circle
        key={i}
        cx={130 + i * 70}
        cy="42"
        r="8"
        fill={i < 2 ? K.rule : i === 2 ? K.copper : K.panel}
        stroke={i === 3 ? K.rule : 'none'}
      />
    ))}
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={112 + i * 86} y="64" width="76" height="42" fill={K.panel} stroke={K.line} />
        <rect x={120 + i * 86} y="72" width="28" height="3" fill={K.rule} />
        <rect x={120 + i * 86} y="81" width={i === 1 ? 40 : 32} height="7" fill={i === 0 ? K.cream : K.rule} opacity={i === 0 ? 0.85 : 1} />
        <polyline
          points={`${154 + i * 86},100 ${160 + i * 86},95 ${166 + i * 86},97 ${172 + i * 86},90 ${180 + i * 86},92`}
          stroke={i === 2 ? K.rule : K.copper}
          fill="none"
        />
      </g>
    ))}
    <rect x="112" y="116" width="248" height="106" fill={K.panel} stroke={K.line} />
    {BARS.map((h, i) => (
      <rect key={i} x={122 + i * 17} y={212 - h} width="9" height={h} fill={K.cream} opacity="0.12" />
    ))}
    <polyline
      points={BARS.map((h, i) => `${126.5 + i * 17},${206 - h}`).join(' ')}
      stroke={K.copper}
      strokeWidth="1.5"
      fill="none"
    />
    <circle cx={126.5 + 13 * 17} cy={206 - 86} r="3" fill={K.copper} />
  </g>
);

/** Branded tenants, a runtime permission matrix and the appraisal chain. */
const tenants = (
  <g>
    {[2, 1, 0].map((i) => (
      <g key={i} transform={`translate(${112 + i * 10} ${30 + i * 10})`}>
        <rect width="92" height="64" fill={K.panel} stroke={K.rule} />
        <rect width="92" height="6" fill={[K.copper, K.sand, K.cream][i]} opacity={i === 0 ? 1 : 0.55} />
        <rect x="8" y="16" width="40" height="4" fill={K.rule} />
        <rect x="8" y="26" width="60" height="3" fill={K.line} />
        <rect x="8" y="34" width="52" height="3" fill={K.line} />
      </g>
    ))}
    <text {...mono} x="112" y="128">
      TENANT CONTEXT
    </text>
    {Array.from({ length: 96 }, (_, n) => {
      const r = Math.floor(n / 12);
      const c = n % 12;
      const granted = (r * 5 + c * 7) % 6 < 3;
      return (
        <rect
          key={n}
          x={234 + c * 11}
          y={30 + r * 11}
          width="8"
          height="8"
          fill={granted ? K.copper : 'none'}
          stroke={granted ? 'none' : K.rule}
          opacity={granted ? 0.9 : 1}
        />
      );
    })}
    <text {...mono} x="234" y="128">
      142 PERMISSIONS · RUNTIME
    </text>
    {['EMP', 'MGR', 'HR', 'GM'].map((step, i) => (
      <g key={step}>
        <rect x={112 + i * 66} y="160" width="48" height="22" fill={K.panel} stroke={i === 3 ? K.copper : K.rule} />
        <text {...mono} x={136 + i * 66} y="174" textAnchor="middle" fill={i === 3 ? K.sand : K.label}>
          {step}
        </text>
        {i < 3 && <path d={`M${162 + i * 66} 171h14m-4-3 4 3-4 3`} stroke={K.rule} fill="none" />}
      </g>
    ))}
    <text {...mono} x="112" y="206">
      APPRAISAL WORKFLOW · AUDITED
    </text>
  </g>
);

const CODE: [number, number[], string[]][] = [
  [0, [30, 70], [K.copper, K.cream]],
  [1, [44, 26, 60], [K.label, K.copper, K.cream]],
  [1, [52, 90], [K.label, K.cream]],
  [2, [38, 64], [K.copper, K.cream]],
  [2, [56, 40], [K.label, K.cream]],
  [1, [20], [K.label]],
  [0, [14], [K.label]],
];

/** Developer portal: request / response / sandbox explorer. */
const devportal = (
  <g>
    <rect x="112" y="26" width="248" height="186" fill={K.panel} stroke={K.rule} />
    <path d="M112 52h248" stroke={K.line} />
    {['REQUEST', 'RESPONSE', 'SANDBOX'].map((tab, i) => (
      <text key={tab} {...mono} x={124 + i * 62} y="43" fill={i === 0 ? K.sand : K.label}>
        {tab}
      </text>
    ))}
    <rect x="122" y="50" width="42" height="2" fill={K.copper} />
    <text {...mono} x="350" y="43" textAnchor="end">
      AR | EN
    </text>
    {CODE.map(([indent, widths, colors], row) => {
      let x = 124 + indent * 14;
      return (
        <g key={row}>
          <text {...mono} x="118" y={72 + row * 16} fontSize="6" fill={K.rule}>
            {row + 1}
          </text>
          {widths.map((w, s) => {
            const rect = (
              <rect key={s} x={x + 6} y={67 + row * 16} width={w} height="5" fill={colors[s]} opacity={colors[s] === K.cream ? 0.35 : 0.9} />
            );
            x += w + 6;
            return rect;
          })}
        </g>
      );
    })}
    <rect x="290" y="186" width="58" height="16" fill={K.copper} />
    <text {...mono} x="319" y="197" fill={K.ink} fontWeight="600" textAnchor="middle">
      200 OK
    </text>
  </g>
);

/** The whole layout mirrored: RTL is the default orientation. */
const rtl = (
  <g>
    <rect x="40" y="28" width="248" height="22" fill={K.panel} stroke={K.line} />
    <rect x="262" y="34" width="20" height="10" fill={K.cream} opacity="0.85" />
    {[226, 194, 162].map((x) => (
      <rect key={x} x={x} y="38" width="24" height="3" fill={K.rule} />
    ))}
    <rect x="46" y="33" width="34" height="12" fill={K.copper} />
    {[180, 140, 96].map((w, i) => (
      <rect key={w} x={288 - w} y={66 + i * 12} width={w} height="6" fill={i === 0 ? K.cream : K.rule} opacity={i === 0 ? 0.85 : 1} />
    ))}
    {[214, 132, 50].map((x, i) => (
      <g key={x}>
        <rect x={x} y="110" width="74" height="74" fill={K.panel} stroke={i === 0 ? K.copper : K.line} />
        <rect x={x + 8} y="118" width="58" height="36" fill={K.raised} />
        <rect x={x + 30} y="162" width="36" height="3" fill={K.rule} />
        <rect x={x + 44} y="170" width="22" height="3" fill={i === 0 ? K.copper : K.rule} />
        <text {...mono} x={x + 12} y="130" fontSize="10" fill={i === 0 ? K.sand : K.label}>
          {'١٢٣'[i]}
        </text>
      </g>
    ))}
    <path d="M288 204H48m10-5-10 5 10 5" stroke={K.copper} fill="none" />
    <text {...mono} x="288" y="222" textAnchor="end">
      dir=&quot;rtl&quot; · inline-start → right
    </text>
  </g>
);

const SESSIONS: [day: number, start: number, dur: number, lane: number, lanes: number, color: string][] = [
  [0, 0.2, 1.4, 0, 1, K.copper],
  [1, 0.6, 1.6, 0, 2, K.sand],
  [1, 1.2, 1.5, 1, 2, K.cream],
  [2, 2.1, 1.2, 0, 1, K.copper],
  [3, 0.3, 1.1, 0, 3, K.cream],
  [3, 0.8, 1.6, 1, 3, K.copper],
  [3, 1.3, 1.2, 2, 3, K.sand],
  [4, 2.6, 1.8, 0, 1, K.sand],
];

/** Weekly timetable: overlapping sessions split into collision-free lanes. */
const timetable = (
  <g>
    {['SUN', 'MON', 'TUE', 'WED', 'THU'].map((d, i) => (
      <text key={d} {...mono} x={135 + i * 50} y="40" textAnchor="middle" fill={i === 3 ? K.sand : K.label}>
        {d}
      </text>
    ))}
    <path d={[50, 82, 114, 146, 178, 210].map((y) => `M112 ${y}h250`).join('')} stroke={K.line} />
    <path d={[112, 162, 212, 262, 312, 362].map((x) => `M${x} 50v160`).join('')} stroke={K.line} />
    {SESSIONS.map(([day, start, dur, lane, lanes, color], i) => {
      const colW = 46 / lanes;
      return (
        <rect
          key={i}
          x={114 + day * 50 + lane * colW}
          y={51 + start * 32}
          width={colW - 2}
          height={dur * 32 - 2}
          fill={color}
          opacity={color === K.cream ? 0.7 : 0.88}
        />
      );
    })}
    <text {...mono} x="112" y="228">
      OVERLAPS → LANES · 0 COLLISIONS
    </text>
  </g>
);

const MOTIFS: Record<Motif, ReactNode> = { storefront, dashboard, tenants, devportal, rtl, timetable };

const toArabicDigits = (s: string) => s.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

type CoverProps = {
  motif: Motif;
  index: string;
  /** `slice` fills the frame (cards); `meet` keeps the whole drawing (wide banners). */
  fit?: 'slice' | 'meet';
  className?: string;
};

export function ProjectCover({ motif, index, fit = 'slice', className }: CoverProps) {
  const mirrored = motif === 'rtl';
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio={`xMidYMid ${fit}`} className={className} aria-hidden="true">
      <text
        x={mirrored ? 408 : -8}
        y="262"
        textAnchor={mirrored ? 'end' : 'start'}
        className="font-display"
        fontSize="168"
        fontWeight="800"
        letterSpacing="-6"
        fill="none"
        stroke={K.line}
        strokeWidth="1.5"
      >
        {mirrored ? toArabicDigits(index) : index}
      </text>
      {MOTIFS[motif]}
    </svg>
  );
}
