import { Reveal } from '@/components/ui/Reveal';
import type { Dictionary } from '@/lib/i18n';

const row = 'grid grid-cols-1 gap-space-md border-b border-line py-space-lg lg:grid-cols-12 lg:gap-gutter';

/** Editorial ledger: hairline rows on the 12-column grid. */
export function Experience({ t }: { t: Dictionary['experience'] }) {
  return (
    <section id="experience" className="mx-auto max-w-7xl px-margin-mobile py-space-2xl lg:px-margin">
      <Reveal className="flex flex-col justify-between gap-space-sm md:flex-row md:items-end">
        <div className="flex flex-col gap-space-xs">
          <span className="font-mono text-label-sm uppercase tracking-widest text-copper-ink">{t.eyebrow}</span>
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg">{t.title}</h2>
        </div>
        <p className="font-mono text-code-inline text-muted">{t.summary}</p>
      </Reveal>

      <ol className="mt-space-xl border-t border-ink">
        {t.roles.map((job) => (
          <Reveal as="li" key={job.company} className={row}>
            <div className="flex flex-col gap-1 font-mono text-label-sm uppercase lg:col-span-3">
              <span className="text-copper-ink">{job.period}</span>
              <span className="text-muted">{job.location}</span>
            </div>
            <div className="flex flex-col gap-1 lg:col-span-3">
              <h3 className="font-display text-headline-sm">{job.company}</h3>
              <p className="text-body-sm text-muted">
                {job.role} · {job.kind}
              </p>
            </div>
            <ul className="flex flex-col gap-space-sm lg:col-span-6">
              {job.points.map((point) => (
                <li
                  key={point}
                  className="relative ps-space-md text-body-md text-graphite before:absolute before:top-[0.8em] before:inset-s-0 before:h-px before:w-2 before:bg-copper"
                >
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
        <Reveal as="li" className={row}>
          <div className="flex flex-col gap-1 font-mono text-label-sm uppercase lg:col-span-3">
            <span className="text-copper-ink">{t.education.year}</span>
            <span className="text-muted">{t.education.location}</span>
          </div>
          <div className="flex flex-col gap-1 lg:col-span-3">
            <h3 className="font-display text-headline-sm">{t.education.school}</h3>
            <p className="text-body-sm text-muted">{t.educationLabel}</p>
          </div>
          <p className="text-body-md text-graphite lg:col-span-6">{t.education.degree}</p>
        </Reveal>
      </ol>
    </section>
  );
}
