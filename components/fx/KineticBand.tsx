'use client';

import { useEffect, useRef } from 'react';
import { cx } from '@/lib/utils';

const NAMES = ['ChinaParts', 'Petrobe', 'Ciro Pay', 'Wesada', 'CentriX'];
const TECH = ['Next.js 16', 'React 19', 'TypeScript', 'RTK Query', 'Tailwind CSS 4', 'Firebase', 'i18n / RTL', 'Framer Motion'];
// Each track holds two identical copies and wraps at half its width; a copy must outrun the widest screen.
const TECH_COPY = [...TECH, ...TECH, ...TECH];

/** Idle drift in px per 60fps frame; scrolling adds speed and sets the direction. */
const DRIFT = 0.45;
const MAX_BOOST = 24;

/**
 * Kinetic band between the hero and the work index: project names (outlined / filled
 * Syne) and the stack (mono) slide in opposite directions, speed up with scroll velocity,
 * reverse when you scroll back up, and run the other way on the Arabic site.
 */
export function KineticBand({ rtl = false }: { rtl?: boolean }) {
  const bandRef = useRef<HTMLElement>(null);
  const rowA = useRef<HTMLDivElement>(null);
  const rowB = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const band = bandRef.current;
    const a = rowA.current;
    const b = rowB.current;
    if (!band || !a || !b || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let widthA = a.scrollWidth / 2;
    let widthB = b.scrollWidth / 2;
    const ro = new ResizeObserver(() => {
      widthA = a.scrollWidth / 2;
      widthB = b.scrollWidth / 2;
    });
    ro.observe(a);
    ro.observe(b);

    const flip = rtl ? -1 : 1;
    let offA = 0;
    let offB = 0;
    let velocity = 0;
    let direction = 1;
    let lastY = window.scrollY;
    let last = 0;
    let frame = 0;
    let running = false;

    const tick = (now: number) => {
      const dt = last ? Math.min(3, (now - last) / 16.67) : 1;
      last = now;
      const y = window.scrollY;
      velocity += (y - lastY - velocity) * 0.12;
      lastY = y;
      if (Math.abs(velocity) > 0.5) direction = Math.sign(velocity);
      const push = (DRIFT + Math.min(Math.abs(velocity) * 0.5, MAX_BOOST)) * dt * direction;

      if (widthA && widthB) {
        offA = (((offA + push) % widthA) + widthA) % widthA;
        offB = (((offB + push * 0.75) % widthB) + widthB) % widthB;
        const xa = flip === 1 ? -offA : offA - widthA;
        const xb = flip === 1 ? offB - widthB : -offB;
        a.style.transform = `translate3d(${xa.toFixed(2)}px, 0, 0)`;
        b.style.transform = `translate3d(${xb.toFixed(2)}px, 0, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };

    // Only animate while the band is on screen.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        last = 0;
        lastY = window.scrollY;
        frame = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(frame);
      }
    });
    io.observe(band);

    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [rtl]);

  return (
    <section ref={bandRef} aria-hidden="true" className="relative overflow-hidden border-y border-line bg-canvas py-space-lg select-none">
      {/* Latin names and tech in both languages; lang keeps their tracking on the Arabic site. */}
      <div dir="ltr" lang="en" className="flex flex-col gap-space-md">
        <div ref={rowA} className="flex w-max items-center will-change-transform">
          {[...NAMES, ...NAMES].map((name, i) => (
            <span key={i} className="flex items-center">
              <span
                className={cx(
                  'px-space-md font-display text-[clamp(2.75rem,8vw,6.5rem)] leading-none font-extrabold tracking-tight uppercase',
                  i % 2 ? 'text-ink' : 'text-transparent [-webkit-text-stroke:1.5px_var(--color-ink)]',
                )}
              >
                {name}
              </span>
              <span className="text-[clamp(1rem,2vw,1.75rem)] text-copper">✦</span>
            </span>
          ))}
        </div>
        <div ref={rowB} className="flex w-max items-center will-change-transform">
          {[...TECH_COPY, ...TECH_COPY].map((tech, i) => (
            <span key={i} className="flex items-center gap-space-md px-space-md font-mono text-label-md tracking-widest text-muted uppercase">
              {tech}
              <span className="text-copper-ink">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
