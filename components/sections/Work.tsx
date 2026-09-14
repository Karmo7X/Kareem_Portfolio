import { Reveal } from '@/components/ui/Reveal';
import { WorkGrid } from '@/components/work/WorkGrid';
import type { Dictionary, Locale } from '@/lib/i18n';

type WorkProps = { locale: Locale; t: Dictionary['work']; projects: Dictionary['projects'] };

export function Work({ locale, t, projects }: WorkProps) {
  return (
    <section id="work" className="bg-ink py-space-2xl text-canvas">
      <div className="mx-auto flex max-w-7xl flex-col gap-space-xl px-margin-mobile lg:gap-space-2xl lg:px-margin">
        <Reveal className="flex flex-col justify-between gap-space-md md:flex-row md:items-end">
          <div className="flex flex-col gap-space-xs">
            <span className="font-mono text-label-sm uppercase tracking-widest text-sand">{t.eyebrow}</span>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg">{t.title}</h2>
          </div>
          <p className="max-w-md text-body-md text-ash">{t.intro}</p>
        </Reveal>
        <WorkGrid locale={locale} t={t} projects={projects} />
      </div>
    </section>
  );
}
