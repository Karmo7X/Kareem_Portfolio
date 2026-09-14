'use client';

import { useState } from 'react';
import { formatNumber, plural, type Dictionary, type Locale } from '@/lib/i18n';
import { cx } from '@/lib/utils';

/** Sessions in hours from 08:00 (0) to 16:00 (8). */
type Session = { start: number; end: number };

const DAY = 8;
const LANE_H = 16;
const GAP = 4;
const RULER = 16;
const COLORS = ['bg-copper', 'bg-ink', 'bg-glow', 'bg-ink-raised', 'bg-copper-ink', 'bg-olive'];

const INITIAL: Session[] = [
  { start: 0.5, end: 2.5 },
  { start: 1.5, end: 3 },
  { start: 2, end: 4.5 },
  { start: 3.5, end: 5 },
  { start: 5, end: 7.5 },
  { start: 6, end: 7 },
];

/** Greedy interval partitioning: each session takes the first lane that's free when it starts. */
function assignLanes(sessions: Session[]) {
  const order = sessions.map((s, i) => ({ ...s, i })).sort((a, b) => a.start - b.start || a.end - b.end);
  const laneEnds: number[] = [];
  const lanes: number[] = [];
  for (const s of order) {
    let lane = laneEnds.findIndex((end) => end <= s.start);
    if (lane === -1) lane = laneEnds.push(s.end) - 1;
    else laneEnds[lane] = s.end;
    lanes[s.i] = lane;
  }
  return { lanes, count: laneEnds.length };
}

function randomSessions(): Session[] {
  for (let attempt = 0; attempt < 30; attempt++) {
    const sessions = Array.from({ length: 6 }, () => {
      const dur = 1 + Math.round(Math.random() * 3) / 2;
      const start = Math.min(Math.round(Math.random() * 12) / 2, DAY - dur);
      return { start, end: start + dur };
    });
    if (assignLanes(sessions).count <= 4) return sessions;
  }
  return INITIAL;
}

type LaneSolverProps = { locale: Locale; t: Dictionary['lab']['lanes'] };

/** CentriX's timetable trick: overlapping sessions rendered side by side without collisions. Time flows with the reading direction. */
export function LaneSolver({ locale, t }: LaneSolverProps) {
  const [sessions, setSessions] = useState(INITIAL);
  const { lanes, count } = assignLanes(sessions);

  return (
    <div className="flex w-full flex-col gap-space-sm">
      <div
        className="relative w-full border border-line bg-canvas transition-[height] duration-500 ease-out-expo"
        style={{ height: RULER + GAP + count * (LANE_H + GAP) }}
        aria-hidden="true"
      >
        {[2, 4, 6].map((h) => (
          <span key={h} className="absolute inset-y-0 border-s border-line" style={{ insetInlineStart: `${(h / DAY) * 100}%` }}>
            <span className="absolute top-0.5 inset-s-1 font-mono text-[9px] text-muted">{formatNumber(8 + h, locale, 2)}</span>
          </span>
        ))}
        {sessions.map((s, i) => (
          <span
            key={i}
            className={cx('absolute transition-all duration-500 ease-out-expo', COLORS[i % COLORS.length])}
            style={{
              insetInlineStart: `calc(${(s.start / DAY) * 100}% + 1px)`,
              width: `calc(${((s.end - s.start) / DAY) * 100}% - 2px)`,
              top: RULER + GAP + lanes[i] * (LANE_H + GAP),
              height: LANE_H,
            }}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => setSessions(randomSessions())}
        className="self-center bg-ink px-space-md py-space-sm font-mono text-label-md uppercase text-canvas transition-[background-color,scale] hover:bg-copper active:scale-95"
      >
        {t.shuffle}
      </button>
      <span aria-live="polite" className="text-center font-mono text-code-inline text-copper-ink">
        {plural(locale, sessions.length, t.sessions)} · {plural(locale, count, t.lanes)} · {t.collisions}
      </span>
    </div>
  );
}
