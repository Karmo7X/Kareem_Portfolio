'use client';

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react';

type RevealProps = {
  as?: 'div' | 'li' | 'article' | 'header' | 'p';
  /** ms after the element scrolls into view. */
  delay?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Fades + lifts its children in once, the first time they scroll into view.
 * The hidden state lives in globals.css behind `(scripting: enabled)`, so content
 * stays visible without JS and under reduced motion.
 */
export function Reveal({ as = 'div', delay = 0, className, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const Tag = as as ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();
        setShown(true);
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-shown={shown ? '' : undefined}
      className={className}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
