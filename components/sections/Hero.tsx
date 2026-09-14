import type { CSSProperties } from 'react';
import { HeroDrift } from '@/components/fx/HeroDrift';
import { BffFlow } from '@/components/hero/BffFlow';
import { Icon, type IconName } from '@/components/ui/Icon';
import { PROFILE } from '@/lib/content';
import type { Dictionary, Locale } from '@/lib/i18n';
import { cx } from '@/lib/utils';

/** Stagger index for the CSS-only `.rise` entrance. */
const rise = (i: number) => ({ '--i': i }) as CSSProperties;

/** Same order as `hero.focus` in the dictionaries. */
const FOCUS_ICONS: IconName[] = ['layers', 'code', 'database', 'globe'];

type HeroProps = { locale: Locale; t: Dictionary['hero']; focusLabel: string };

export function Hero({ locale, t, focusLabel }: HeroProps) {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* Atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 inset-e-10 -z-10 size-[580px] rounded-full bg-sand/25 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-96 -inset-s-32 -z-10 size-[420px] rounded-full bg-line/80 blur-[90px]"
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-gutter px-margin-mobile pt-space-xl pb-space-2xl lg:grid-cols-12 lg:px-margin">
        <HeroDrift speed={0.18} fade className="flex flex-col gap-space-lg lg:col-span-7">
          <div className="rise flex flex-wrap items-center gap-space-sm" style={rise(0)}>
            <span
              dir="ltr"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-space-sm py-1 font-mono text-label-sm uppercase text-copper-ink"
            >
              <span className="size-2 animate-pulse rounded-full bg-copper" aria-hidden="true" />
              {t.eyebrow}
            </span>
            <span className="font-mono text-code-inline text-muted">{t.byline}</span>
          </div>

          <h1 className="rise font-display text-headline-xl-mobile text-ink md:text-headline-xl" style={rise(1)}>
            {t.headline.before}
            <em className="font-extrabold text-copper">{t.headline.accent}</em>
            {t.headline.after}
          </h1>

          <p className="rise max-w-xl text-body-lg text-graphite" style={rise(2)}>
            {t.intro}
          </p>

          <ul className="rise flex flex-wrap gap-space-xs pt-space-xs" style={rise(3)} aria-label={focusLabel}>
            {t.focus.map((label, i) => (
              <li
                key={label}
                className="flex items-center gap-1.5 rounded-full border border-line bg-panel px-space-md py-1.5 font-mono text-label-sm text-ink"
              >
                <Icon name={FOCUS_ICONS[i]} size={15} className="text-copper" />
                {label}
              </li>
            ))}
          </ul>

          <div className="rise flex flex-wrap items-center gap-space-md pt-space-sm" style={rise(4)}>
            <a
              href="#work"
              className="group inline-flex items-center gap-space-sm bg-ink px-space-lg py-space-md font-mono text-label-md uppercase text-canvas transition-colors hover:bg-copper"
            >
              {t.cta.work}
              <Icon name="arrow-down" className="transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-space-sm border border-ink px-space-lg py-space-md font-mono text-label-md uppercase text-ink transition-colors hover:bg-ink hover:text-canvas"
            >
              {t.cta.contact}
              <Icon name="mail" />
            </a>
            <a href={PROFILE.cv} download className="link-grow py-1 font-mono text-label-md uppercase text-ink">
              <span className="text-copper-ink">[PDF]</span> {t.cta.cv}
            </a>
          </div>

          <dl
            className="rise mt-space-md grid grid-cols-3 divide-x divide-line border border-line bg-panel"
            style={rise(5)}
          >
            {t.stats.map(({ value, label, accent }) => (
              <div key={label} className="flex flex-col-reverse gap-1 p-space-sm sm:p-space-md">
                <dt className="font-mono text-label-sm uppercase text-muted">{label}</dt>
                <dd className={cx('font-display text-base font-bold sm:text-headline-sm', accent ? 'text-copper' : 'text-ink')}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </HeroDrift>

        {/* Showcase card: the BFF layer, live */}
        <HeroDrift speed={0.08} className="rise pt-space-md lg:col-span-5 lg:pt-0" style={rise(3)}>
          <figure className="flex flex-col gap-space-md border border-line bg-panel p-space-md shadow-glow">
            <div className="flex items-center justify-between gap-space-sm">
              <div className="flex min-w-0 items-center gap-space-xs">
                <span className="size-3 shrink-0 rounded-full bg-alert" aria-hidden="true" />
                <span className="size-3 shrink-0 rounded-full bg-sand" aria-hidden="true" />
                <span className="size-3 shrink-0 rounded-full bg-copper" aria-hidden="true" />
                <span dir="ltr" className="truncate ps-space-xs font-mono text-code-inline text-muted">
                  app/api/[...path]/route.ts
                </span>
              </div>
              <span className="shrink-0 border border-line bg-paper px-space-xs py-0.5 font-mono text-label-sm uppercase text-copper-ink">
                {t.card.badge}
              </span>
            </div>

            <div className="relative h-80 overflow-hidden bg-ink">
              <BffFlow label={t.card.canvasLabel} hint={t.card.hint} rtl={locale === 'ar'} className="absolute inset-0 size-full" />
              <div className="pointer-events-none absolute inset-x-space-md bottom-space-md flex items-center justify-between gap-space-sm border border-ink-line bg-ink/80 p-space-sm text-canvas backdrop-blur-md">
                <div>
                  <div className="font-mono text-label-sm uppercase tracking-widest text-sand">{t.card.featured}</div>
                  <div className="font-display text-headline-sm">{t.card.project}</div>
                </div>
                <div className="text-end">
                  <div className="font-mono text-code-inline">{t.card.metric}</div>
                  <div className="font-mono text-label-sm text-ash">{t.card.metricLabel}</div>
                </div>
              </div>
            </div>

            <figcaption dir="ltr" className="flex flex-col gap-1 bg-ink-raised p-space-sm font-mono text-code-inline">
              <span className="flex justify-between gap-space-sm text-ash">
                <span className="truncate">export async function GET(req: NextRequest)</span>
                <span className="shrink-0 text-sand">HTTPONLY</span>
              </span>
              <span className="truncate text-glow">&gt;&gt; const session = (await cookies()).get(&apos;session&apos;);</span>
            </figcaption>
          </figure>
        </HeroDrift>
      </div>

      {/* Scroll cue */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-space-md hidden justify-center lg:flex">
        <span className="flex flex-col items-center gap-space-xs font-mono text-label-sm uppercase tracking-widest text-muted">
          {t.scroll}
          <span className="block h-10 w-px overflow-hidden bg-line">
            <span className="scroll-cue block size-full bg-copper" />
          </span>
        </span>
      </div>
    </section>
  );
}
