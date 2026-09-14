import { Icon, type IconName } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import type { Dictionary } from '@/lib/i18n';

/** Same order as `stack.principles` in the dictionaries. */
const PRINCIPLE_ICONS: IconName[] = ['layers', 'shield', 'globe'];

export function Stack({ t }: { t: Dictionary['stack'] }) {
  return (
    <section id="stack" className="mx-auto max-w-7xl px-margin-mobile py-space-xl lg:px-margin lg:py-space-2xl">
      <div className="grid grid-cols-1 gap-space-xl lg:grid-cols-12">
        <Reveal className="flex flex-col gap-space-md lg:col-span-5">
          <span className="font-mono text-label-sm uppercase tracking-widest text-copper-ink">{t.eyebrow}</span>
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg">{t.title}</h2>
          <p className="text-body-md text-graphite">{t.intro}</p>
          <ul className="flex flex-col gap-space-sm pt-space-sm">
            {t.principles.map((p, i) => (
              <li key={p.title} className="flex items-start gap-space-sm border border-line bg-panel p-space-md">
                <Icon name={PRINCIPLE_ICONS[i]} size={22} className="mt-0.5 shrink-0 text-copper" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-display text-headline-sm">{p.title}</span>
                  <span className="text-body-sm text-muted">{p.body}</span>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120} className="flex flex-col gap-space-lg border border-line bg-panel p-space-md sm:p-space-lg lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-space-sm">
            <h3 className="font-display text-headline-sm">{t.panelTitle}</h3>
            <span className="font-mono text-code-inline text-muted">{t.since}</span>
          </div>
          <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
            {t.groups.map((group) => (
              <div key={group.title} className="flex flex-col gap-space-sm border border-line bg-paper p-space-md">
                <span className="font-mono text-label-sm font-bold uppercase tracking-wider text-copper-ink">{group.title}</span>
                <ul className="flex flex-col gap-space-xs font-mono text-code-inline">
                  {group.items.map(([name, detail]) => (
                    <li key={name} className="flex flex-wrap items-baseline gap-x-space-sm">
                      <span>{name}</span>
                      <span className="ms-auto text-end text-label-sm text-muted">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-space-xs">
            <span className="font-mono text-label-sm uppercase tracking-wider text-muted">{t.toolkitLabel}</span>
            <ul className="flex flex-wrap gap-space-xs">
              {t.concepts.map((c) => (
                <li key={c} className="rounded-full border border-line bg-canvas px-space-sm py-1 font-mono text-label-sm text-muted">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
