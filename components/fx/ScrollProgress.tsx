'use client';

import { useEffect, useRef } from 'react';
import { useSite } from '@/components/site/SiteProvider';

/** Copper reading-progress hairline along the header's bottom edge; grows from the start side. */
export function ScrollProgress() {
  const ref = useRef<HTMLSpanElement>(null);
  const { onScroll } = useSite();

  useEffect(
    () =>
      onScroll(({ y, max }) => {
        ref.current?.style.setProperty('transform', `scaleX(${max ? (y / max).toFixed(4) : 0})`);
      }),
    [onScroll],
  );

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 origin-left bg-copper rtl:origin-right"
      style={{ transform: 'scaleX(0)' }}
    />
  );
}
