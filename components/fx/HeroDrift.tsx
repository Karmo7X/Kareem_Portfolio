'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { useSite } from '@/components/site/SiteProvider';

type HeroDriftProps = {
  /** How much the column lags the scroll: 0.2 → moves 20% slower than the page. */
  speed: number;
  /** Fade out over the first ~90% of a viewport of scroll. */
  fade?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * Hero parallax on large screens: columns lag the scroll by different amounts for depth.
 * Uses `transform` only, so it composes with the `.rise` entrance (which animates `translate`).
 */
export function HeroDrift({ speed, fade = false, className, style, children }: HeroDriftProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { onScroll } = useSite();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const wide = window.matchMedia('(min-width: 1024px)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    return onScroll(({ y, vh }) => {
      if (!wide.matches || still.matches) {
        el.style.removeProperty('transform');
        el.style.removeProperty('opacity');
        return;
      }
      if (y > vh * 1.5) return; // hero long gone — nothing to update
      el.style.transform = `translate3d(0, ${(y * speed).toFixed(1)}px, 0)`;
      if (fade) el.style.opacity = Math.max(0, 1 - y / (vh * 0.9)).toFixed(3);
    });
  }, [onScroll, speed, fade]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
