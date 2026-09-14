import { ScrollWords } from '@/components/fx/ScrollWords';
import { Reveal } from '@/components/ui/Reveal';
import { PROFILE } from '@/lib/content';
import type { Dictionary } from '@/lib/i18n';

/** The copper band — one line from the CV, set monumental. */
export function Manifesto({ t }: { t: Dictionary['manifesto'] }) {
  return (
    <section aria-labelledby="manifesto-label" className="relative isolate overflow-hidden bg-copper-ink py-space-2xl text-paper">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-e-24 -bottom-32 -z-10 size-[420px] rounded-full bg-glow/40 blur-[110px]"
      />
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-space-xl px-margin-mobile md:flex-row md:items-end lg:px-margin">
        <Reveal className="flex max-w-4xl flex-col gap-space-sm">
          <span id="manifesto-label" className="font-mono text-code-inline uppercase tracking-widest text-blush">
            {t.label}
          </span>
          <blockquote className="font-display text-display-hero-mobile md:text-headline-xl lg:text-display-hero">
            <p>
              <ScrollWords text={t.quote} />
            </p>
          </blockquote>
        </Reveal>
        <Reveal delay={120} className="flex shrink-0 flex-col items-start gap-space-xs font-mono text-label-md">
          <span className="font-bold uppercase tracking-wider">{PROFILE.name}</span>
          <span className="text-blush">{t.role}</span>
          <span className="text-code-inline text-blush">{t.note}</span>
        </Reveal>
      </div>
    </section>
  );
}
