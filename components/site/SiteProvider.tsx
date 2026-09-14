'use client';

import Lenis from 'lenis';
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';

export type ScrollState = {
  /** Current scroll offset. */
  y: number;
  /** Maximum scroll offset (document height minus viewport). */
  max: number;
  vw: number;
  vh: number;
};

type ScrollListener = (state: ScrollState) => void;

type SiteApi = {
  /** Named scroll locks (intro, mobile menu, case-notes sheet); scrolling resumes when none remain. */
  lock: (key: string) => void;
  unlock: (key: string) => void;
  /** Smooth-scroll to a section; honours each target's `scroll-margin-top`. */
  scrollToId: (id: string) => void;
  /**
   * Subscribe to scroll/resize, batched to one animation frame for every listener.
   * Called once immediately with the current state; returns an unsubscribe function.
   */
  onScroll: (listener: ScrollListener) => () => void;
};

const SiteContext = createContext<SiteApi | null>(null);

export function useSite() {
  const value = useContext(SiteContext);
  if (!value) throw new Error('useSite must be used inside <SiteProvider>');
  return value;
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const readScroll = (): ScrollState => ({
  y: window.scrollY,
  max: Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
  vw: window.innerWidth,
  vh: window.innerHeight,
});

export function SiteProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const locksRef = useRef(new Set<string>());
  const listenersRef = useRef(new Set<ScrollListener>());

  const api = useMemo<SiteApi>(() => {
    const sync = () => {
      const html = document.documentElement;
      if (locksRef.current.size) {
        lenisRef.current?.stop();
        html.style.overflow = 'hidden';
      } else {
        lenisRef.current?.start();
        html.style.removeProperty('overflow');
      }
    };
    return {
      lock(key) {
        locksRef.current.add(key);
        sync();
      },
      unlock(key) {
        locksRef.current.delete(key);
        sync();
      },
      scrollToId(id) {
        // A beat of delay lets a closing overlay release its lock before we measure.
        window.setTimeout(() => {
          const el = document.getElementById(id);
          if (!el) return;
          if (lenisRef.current) lenisRef.current.scrollTo(el, { duration: 1.2 });
          else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
        }, 40);
      },
      onScroll(listener) {
        listenersRef.current.add(listener);
        listener(readScroll());
        return () => {
          listenersRef.current.delete(listener);
        };
      },
    };
  }, []);

  // Lenis smooth scroll — skipped entirely for reduced-motion users.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({
      autoRaf: true,
      // Let the case-notes <dialog> scroll natively.
      prevent: (node) => node.closest('dialog') !== null,
    });
    lenisRef.current = lenis;
    // Children's effects run first — honour any lock they already took (the intro's).
    if (locksRef.current.size) lenis.stop();
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // One scroll source for every effect: Lenis moves the real window, so native events cover both.
  useEffect(() => {
    let frame = 0;
    const emit = () => {
      frame = 0;
      const state = readScroll();
      listenersRef.current.forEach((listener) => listener(state));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(emit);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  // One delegate for every in-page anchor rendered on the server.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const id = link?.getAttribute('href')?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!id || !target) return;
      e.preventDefault();
      api.scrollToId(id);
      // Skip link: move keyboard focus along with the scroll.
      if (target.hasAttribute('tabindex')) target.focus({ preventScroll: true });
      history.replaceState(null, '', id === 'top' ? window.location.pathname : `#${id}`);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [api]);

  return <SiteContext value={api}>{children}</SiteContext>;
}
