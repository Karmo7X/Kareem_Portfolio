'use client';

import { useSyncExternalStore } from 'react';
import { PROFILE } from '@/lib/content';
import { LOCALE_META, LOCALES, type Locale } from '@/lib/i18n/config';
import { cx } from '@/lib/utils';

const FORMATTERS = Object.fromEntries(
  LOCALES.map((locale) => [
    locale,
    new Intl.DateTimeFormat(LOCALE_META[locale].intl, {
      timeZone: PROFILE.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    }),
  ]),
) as Record<Locale, Intl.DateTimeFormat>;

// One shared 1s ticker (whole seconds since epoch) for every clock on the page.
const nowSeconds = () => Math.floor(Date.now() / 1000);
let snapshot = 0;
let timer = 0;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    snapshot = nowSeconds();
    timer = window.setInterval(() => {
      snapshot = nowSeconds();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      window.clearInterval(timer);
      timer = 0;
    }
  };
}

const getSnapshot = () => snapshot || (snapshot = nowSeconds());
// Server render and hydration show a placeholder; the live time swaps in right after.
const getServerSnapshot = () => 0;

type ClockProps = { locale: Locale; label: string; srLabel: string; className?: string };

/** Kareem's local time (Cairo), ticking in the page's own digits — the header's "live telemetry" chip. */
export function CairoClock({ locale, label, srLabel, className }: ClockProps) {
  const seconds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <div
      className={cx(
        'items-center gap-space-xs border border-line bg-panel px-space-sm py-1 font-mono text-label-sm text-muted tabular-nums',
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-olive" aria-hidden="true" />
      <span className="sr-only">{srLabel}</span>
      <span aria-hidden="true">{label}</span>
      <time>{seconds ? FORMATTERS[locale].format(seconds * 1000) : '--:--:--'}</time>
    </div>
  );
}
