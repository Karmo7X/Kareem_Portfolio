import type { ReactNode } from 'react';
import { CacheTags } from '@/components/lab/CacheTags';
import { LaneSolver } from '@/components/lab/LaneSolver';
import { RbacMatrix } from '@/components/lab/RbacMatrix';
import { RtlMirror } from '@/components/lab/RtlMirror';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { PROFILE } from '@/lib/content';
import { LOCALE_META, type Dictionary, type Locale } from '@/lib/i18n';

type LabCardProps = { code: string; chip: string; title: string; body: string; delay: number; children: ReactNode };

function LabCard({ code, chip, title, body, delay, children }: LabCardProps) {
  return (
    <Reveal delay={delay} className="flex min-h-72 flex-col justify-between gap-space-md border border-line bg-panel p-space-md transition-colors hover:border-line-strong">
      <div className="flex items-center justify-between">
        <span dir="ltr" className="font-mono text-code-inline text-muted">
          {code}
        </span>
        <span className="rounded-full border border-line bg-canvas px-space-sm py-0.5 font-mono text-label-sm text-muted">{chip}</span>
      </div>
      <div className="flex flex-1 items-center">{children}</div>
      <div>
        <h3 className="font-display text-headline-sm">{title}</h3>
        <p className="pt-1 text-body-sm text-muted">{body}</p>
      </div>
    </Reveal>
  );
}

export function Lab({ locale, t }: { locale: Locale; t: Dictionary['lab'] }) {
  // Same order as `lab.cards` in the dictionaries.
  const demos: ReactNode[] = [
    <RtlMirror key="rtl" flipLabel={t.rtl.flip} initialDir={LOCALE_META[locale].dir} />,
    <CacheTags key="cache" t={t.cache} />,
    <RbacMatrix key="rbac" locale={locale} t={t.rbac} />,
    <LaneSolver key="lanes" locale={locale} t={t.lanes} />,
  ];

  return (
    <section id="lab" className="mx-auto max-w-7xl px-margin-mobile py-space-2xl lg:px-margin">
      <Reveal className="flex flex-col justify-between gap-space-md md:flex-row md:items-end">
        <div className="flex flex-col gap-space-xs">
          <span className="font-mono text-label-sm uppercase tracking-widest text-copper-ink">{t.eyebrow}</span>
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg">{t.title}</h2>
          <p className="max-w-xl pt-space-xs text-body-md text-graphite">{t.intro}</p>
        </div>
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noreferrer"
          dir="ltr"
          className="link-grow inline-flex items-center gap-space-xs self-start py-1 font-mono text-code-inline text-ink md:self-auto"
        >
          <span className="size-2 rounded-full bg-copper" aria-hidden="true" />
          {PROFILE.githubHandle}
          <Icon name="arrow-up-right" size={14} />
        </a>
      </Reveal>

      <div className="mt-space-lg grid grid-cols-1 gap-space-md md:grid-cols-2 lg:grid-cols-4">
        {t.cards.map((card, i) => (
          <LabCard key={card.title} code={`EXP_0${i + 1}`} delay={i * 80} {...card}>
            {demos[i]}
          </LabCard>
        ))}
      </div>
    </section>
  );
}
