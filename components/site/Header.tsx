'use client';

import { useEffect, useState } from 'react';
import { ScrollProgress } from '@/components/fx/ScrollProgress';
import { Icon } from '@/components/ui/Icon';
import { NAV_IDS, PROFILE } from '@/lib/content';
import { formatNumber, type Dictionary, type Locale } from '@/lib/i18n';
import { cx } from '@/lib/utils';
import { CairoClock } from './Clock';
import { useSite } from './SiteProvider';

const SPY_IDS = ['top', ...NAV_IDS];

type HeaderProps = {
  locale: Locale;
  t: Pick<Dictionary, 'nav' | 'header' | 'a11y' | 'switcher'>;
};

function LanguageSwitch({ t, className }: { t: Dictionary['switcher']; className?: string }) {
  return (
    <a
      href={t.href}
      hrefLang={t.hrefLang}
      lang={t.hrefLang}
      title={t.title}
      className={cx(
        'flex h-10 min-w-10 items-center justify-center border border-line px-space-sm font-mono text-label-md text-ink transition-colors hover:border-ink',
        className,
      )}
    >
      {t.short}
    </a>
  );
}

export function Header({ locale, t }: HeaderProps) {
  const { lock, unlock, scrollToId } = useSite();
  const [active, setActive] = useState('top');
  const [open, setOpen] = useState(false);

  // Scroll spy: whichever section crosses the middle band of the viewport is "current".
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    SPY_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Mobile menu: lock the page, close on Escape or when the desktop nav takes over.
  useEffect(() => {
    if (!open) return;
    lock('menu');
    const desktop = window.matchMedia('(min-width: 768px)');
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    desktop.addEventListener('change', close);
    return () => {
      unlock('menu');
      window.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', close);
    };
  }, [open, lock, unlock]);

  const goFromMenu = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-xl">
      <ScrollProgress />
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-gutter px-margin-mobile lg:px-margin">
        <div className="flex items-center gap-space-lg">
          <a href="#top" className="group flex items-center gap-space-sm" aria-label={t.a11y.backToTop}>
            <span
              data-intro-target=""
              className="flex size-8 items-center justify-center bg-ink font-display text-[0.95rem] font-bold tracking-tighter text-canvas transition-colors group-hover:bg-copper"
            >
              {PROFILE.initials}
            </span>
            <span className="font-mono text-label-md uppercase text-ink transition-colors group-hover:text-copper-ink md:max-lg:hidden">
              {PROFILE.name} <span className="text-muted">{t.header.tag}</span>
            </span>
          </a>
          <div className="hidden items-center gap-space-sm border-s border-line ps-space-lg xl:flex">
            <span className="size-1.5 animate-pulse rounded-full bg-copper" aria-hidden="true" />
            <span className="font-mono text-label-sm uppercase tracking-widest text-muted">{t.header.available}</span>
          </div>
        </div>

        <nav aria-label={t.a11y.primaryNav} className="hidden items-center gap-space-lg md:flex">
          {NAV_IDS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? 'location' : undefined}
              className={cx(
                'font-mono text-label-md uppercase underline-offset-8 transition-colors',
                active === id ? 'text-ink underline decoration-copper' : 'text-muted hover:text-ink',
              )}
            >
              {t.nav[id]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-space-sm md:gap-space-md">
          <CairoClock locale={locale} label={t.header.clock} srLabel={t.a11y.cairoTime} className="hidden sm:flex" />
          <LanguageSwitch t={t.switcher} />
          <a
            href="#contact"
            className="hidden bg-ink px-space-md py-space-sm font-mono text-label-md uppercase text-canvas transition-colors hover:bg-copper lg:inline-flex"
          >
            {t.header.hire}
          </a>
          <button
            type="button"
            className="flex size-10 items-center justify-center border border-line text-ink transition-colors hover:border-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'x' : 'menu'} size={20} />
            <span className="sr-only">{open ? t.a11y.closeMenu : t.a11y.openMenu}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label={t.a11y.mobileNav}
          className="h-[calc(100dvh-5rem)] overflow-y-auto border-t border-line bg-canvas px-margin-mobile pb-space-xl md:hidden"
        >
          <ul>
            {NAV_IDS.map((id, i) => (
              <li key={id} className="border-b border-line">
                <a href={`#${id}`} onClick={goFromMenu(id)} className="flex items-baseline gap-space-md py-space-md text-ink">
                  <span className="font-mono text-label-sm text-copper-ink">[{formatNumber(i + 1, locale, 2)}]</span>
                  <span className="font-display text-headline-lg-mobile">{t.nav[id]}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-space-lg flex flex-col gap-space-md">
            <a
              href="#contact"
              onClick={goFromMenu('contact')}
              className="flex items-center justify-between bg-ink px-space-lg py-space-md font-mono text-label-md uppercase text-canvas"
            >
              {t.header.hire} <Icon name="arrow-right" />
            </a>
            <a
              href={PROFILE.cv}
              download
              className="flex items-center justify-between border border-ink px-space-lg py-space-md font-mono text-label-md uppercase text-ink"
            >
              {t.header.cv} <Icon name="download" />
            </a>
            <a
              href={t.switcher.href}
              hrefLang={t.switcher.hrefLang}
              lang={t.switcher.hrefLang}
              className="flex items-center justify-between border border-line px-space-lg py-space-md font-mono text-label-md text-ink"
            >
              {t.switcher.label} <Icon name="globe" />
            </a>
            <CairoClock locale={locale} label={t.header.clock} srLabel={t.a11y.cairoTime} className="flex self-start" />
          </div>
        </nav>
      )}
    </header>
  );
}
