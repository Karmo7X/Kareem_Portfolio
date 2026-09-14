'use client';

import { useState } from 'react';
import { flushSync } from 'react-dom';
import { fill } from '@/lib/i18n/config';

const COPY = {
  ltr: { lang: 'en', name: 'Oil filter', price: 'SAR 45.00', cta: 'Add' },
  rtl: { lang: 'ar', name: 'فلتر زيت', price: '٤٥٫٠٠ ر.س', cta: 'أضف' },
} as const;

type Dir = keyof typeof COPY;
type WithViewTransitions = Document & { startViewTransition?: (update: () => void) => unknown };

type RtlMirrorProps = { flipLabel: string; initialDir: Dir };

/** One layout, both directions: every spacing is a logical property, so flipping `dir` is all it takes. */
export function RtlMirror({ flipLabel, initialDir }: RtlMirrorProps) {
  const [dir, setDir] = useState<Dir>(initialDir);
  const t = COPY[dir];
  const other: Dir = dir === 'ltr' ? 'rtl' : 'ltr';

  const flip = () => {
    const apply = () => flushSync(() => setDir(other));
    const doc = document as WithViewTransitions;
    if (doc.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      doc.startViewTransition(apply);
    } else apply();
  };

  return (
    <div className="flex w-full flex-col items-center gap-space-sm">
      <div dir={dir} lang={t.lang} className="flex w-full items-center gap-space-sm border border-line bg-canvas p-space-sm">
        <span className="size-9 shrink-0 bg-ink [view-transition-name:rtl-thumb]" aria-hidden="true" />
        <span className="min-w-0 flex-1 text-start [view-transition-name:rtl-text]">
          <span className="block truncate text-body-sm font-medium text-ink">{t.name}</span>
          <span className="block font-mono text-label-sm text-muted">{t.price}</span>
        </span>
        <span className="shrink-0 bg-copper px-space-sm py-1 font-mono text-label-sm text-paper [view-transition-name:rtl-cta]">
          {t.cta}
        </span>
      </div>
      <button
        type="button"
        onClick={flip}
        className="bg-ink px-space-md py-space-sm font-mono text-label-md uppercase text-canvas transition-[background-color,scale] hover:bg-copper active:scale-95"
      >
        {fill(flipLabel, { dir: other.toUpperCase() })}
      </button>
      <span dir="ltr" aria-live="polite" className="font-mono text-code-inline text-copper-ink">
        dir=&quot;{dir}&quot; · start → {dir === 'ltr' ? 'left' : 'right'}
      </span>
    </div>
  );
}
