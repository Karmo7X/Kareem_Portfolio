'use client';

import { Fragment, useEffect, useRef, type CSSProperties } from 'react';
import { useSite } from '@/components/site/SiteProvider';

/**
 * Splits a line into words that light up one by one as it scrolls through the viewport
 * (see `.scroll-word` in globals.css). Fully lit without JavaScript or under reduced motion.
 */
export function ScrollWords({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { onScroll } = useSite();
  const words = text.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    return onScroll(({ vh }) => {
      const r = el.getBoundingClientRect();
      // 0 when the line's top reaches 90% of the viewport; 1 when its bottom reaches 35%.
      const start = vh * 0.9;
      const end = vh * 0.35;
      const p = (start - r.top) / (start - end + r.height);
      el.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(3));
    });
  }, [onScroll]);

  return (
    <span ref={ref} style={{ '--n': words.length } as CSSProperties}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="scroll-word" style={{ '--i': i } as CSSProperties}>
            {word}
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </span>
  );
}
