'use client';

import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { formatNumber, type Dictionary, type Locale } from '@/lib/i18n';
import { INTRO_KEY } from './introScript';
import { useSite } from './SiteProvider';

type IntroWindow = Window & { __kaIntro?: number };

/** Monoline KA strokes, drawn in order (see `.intro-stroke` in globals.css). */
const STROKES = ['M28 30V90', 'M60 30 28 62', 'M42 48 62 90', 'M66 90 80.5 30 95 90', 'M71 70H90'];
const COUNT_MS = 1300;
const EASE_IN_OUT = 'cubic-bezier(0.7, 0, 0.2, 1)';

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type IntroLoaderProps = { locale: Locale; t: Dictionary['intro'] };

/**
 * First-visit intro: the KA monogram draws itself on an ink curtain while a counter runs
 * to 100, then flies onto the header logo as the curtain lifts. Shown only when the inline
 * <head> script set `data-intro="play"`; the drawing is pure CSS, so it starts before hydration.
 */
export function IntroLoader({ locale, t }: IntroLoaderProps) {
  const { lock, unlock } = useSite();
  const curtainRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const w = window as IntroWindow;
    const html = document.documentElement;
    const curtain = curtainRef.current;
    const mark = markRef.current;
    const count = countRef.current;
    if (!w.__kaIntro || !curtain || !mark || !count) return;

    // React's dev-only remount resets <html> attributes; put ours back before paint.
    html.setAttribute('data-intro', 'play');
    lock('intro');
    if (!window.location.hash) window.scrollTo(0, 0);

    let cancelled = false;
    let frame = 0;
    const animations: Animation[] = [];
    let finishing = false; // set once we change data-intro ourselves

    // The <head> failsafe can end the intro early (e.g. a tab opened in the background, where
    // animation frames pause). Release the page the moment it does, rather than on the next frame.
    const failsafe = new MutationObserver(() => {
      if (finishing || html.getAttribute('data-intro') !== 'done') return;
      cancelled = true;
      cancelAnimationFrame(frame);
      animations.forEach((a) => a.cancel());
      unlock('intro');
    });
    failsafe.observe(html, { attributes: true, attributeFilter: ['data-intro'] });

    const run = async () => {
      // Counter to 100 — and not before the webfonts are in, so the hero lands in its real typeface.
      const fontsReady = Promise.race([document.fonts?.ready, sleep(2000)]);
      const start = performance.now();
      await new Promise<void>((resolve) => {
        const tick = (now: number) => {
          if (cancelled) return;
          const p = Math.min(1, (now - start) / COUNT_MS);
          count.textContent = formatNumber(Math.round(easeOut(p) * 100), locale, 3);
          if (p < 1) frame = requestAnimationFrame(tick);
          else resolve();
        };
        frame = requestAnimationFrame(tick);
      });
      await fontsReady;
      if (cancelled) return;

      // Hand-off: the monogram flies onto the header logo while the curtain lifts.
      const from = mark.getBoundingClientRect();
      const to = document.querySelector('[data-intro-target]')?.getBoundingClientRect();
      if (to && from.width) {
        const dx = to.left + to.width / 2 - (from.left + from.width / 2);
        const dy = to.top + to.height / 2 - (from.top + from.height / 2);
        animations.push(
          mark.animate([{ transform: 'none' }, { transform: `translate(${dx}px, ${dy}px) scale(${to.width / from.width})` }], {
            duration: 950,
            easing: EASE_IN_OUT,
            fill: 'forwards',
          }),
        );
      }
      const lift = curtain.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 100% 0)' }], {
        duration: 950,
        delay: 120,
        easing: EASE_IN_OUT,
        fill: 'forwards',
      });
      animations.push(lift);
      await Promise.all(animations.map((a) => a.finished));
      if (cancelled) return;

      // Landed: reveal the real logo and start the hero entrance while the monogram fades out.
      finishing = true;
      html.setAttribute('data-intro', 'leaving');
      unlock('intro');
      const fade = mark.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
      animations.push(fade);
      await fade.finished;
      if (cancelled) return;

      html.setAttribute('data-intro', 'done');
      w.__kaIntro = 0;
      try {
        sessionStorage.setItem(INTRO_KEY, '1');
      } catch {
        // Storage blocked: the intro will simply play again next visit.
      }
    };

    run().catch(() => {
      html.setAttribute('data-intro', 'done');
      unlock('intro');
    });

    return () => {
      cancelled = true;
      failsafe.disconnect();
      cancelAnimationFrame(frame);
      animations.forEach((a) => a.cancel());
      unlock('intro');
    };
  }, [locale, lock, unlock]);

  return (
    <div className="intro fixed inset-0 z-[100]" aria-hidden="true">
      <div ref={curtainRef} className="absolute inset-0 bg-ink text-canvas">
        {/* The 12-column grid, drawn in as hairlines */}
        <div className="absolute inset-0 mx-auto grid max-w-7xl grid-cols-4 border-e border-ink-line px-margin-mobile lg:grid-cols-12 lg:px-margin">
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              className={`intro-guide border-s border-ink-line ${i >= 4 ? 'hidden lg:block' : ''}`}
              style={{ '--i': i } as CSSProperties}
            />
          ))}
        </div>

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-between px-margin-mobile py-space-lg lg:px-margin">
          <div className="intro-meta flex justify-between gap-space-md font-mono text-label-sm uppercase tracking-widest text-ash">
            <span>{t.label}</span>
            <span dir="ltr">30.04°N · 31.24°E</span>
          </div>
          <div className="intro-meta flex items-end justify-between gap-space-md">
            <span className="font-mono text-label-sm uppercase tracking-widest text-ash">{t.role}</span>
            <span className="flex items-baseline gap-space-sm">
              <span className="font-mono text-label-sm uppercase tracking-widest text-ash">{t.loading}</span>
              <span ref={countRef} className="font-display text-headline-lg-mobile tabular-nums md:text-headline-lg">
                {formatNumber(0, locale, 3)}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div ref={markRef} className="size-40 md:size-56">
          <svg viewBox="0 0 120 120" className="size-full overflow-visible">
            <rect className="intro-box" x="1" y="1" width="118" height="118" pathLength={1} />
            {STROKES.map((d, i) => (
              <path key={d} className="intro-stroke" d={d} pathLength={1} style={{ '--i': i } as CSSProperties} />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
