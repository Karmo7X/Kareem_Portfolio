'use client';

import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useSite } from '@/components/site/SiteProvider';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { PROJECT_META } from '@/lib/content';
import { formatNumber, type Dictionary, type Locale } from '@/lib/i18n';
import { ProjectCover } from './ProjectCover';

type WorkGridProps = { locale: Locale; t: Dictionary['work']; projects: Dictionary['projects'] };

/** Project cards on the dark index, plus one shared case-notes sheet (native <dialog>). */
export function WorkGrid({ locale, t, projects }: WorkGridProps) {
  const { lock, unlock, scrollToId } = useSite();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);

  const items = projects.map((p, i) => ({ ...p, ...PROJECT_META[i], index: formatNumber(i + 1, locale, 2) }));
  const project = items[index];
  // "Next" follows the reading direction.
  const nextKey = locale === 'ar' ? 'ArrowLeft' : 'ArrowRight';
  const prevKey = locale === 'ar' ? 'ArrowRight' : 'ArrowLeft';

  const show = (i: number) => {
    // Commit the new content before the sheet opens so it never flashes the previous case.
    flushSync(() => setIndex(i));
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.scrollTop = 0;
    if (!dialog.open) {
      dialog.showModal();
      lock('case');
    }
  };
  const close = () => {
    dialogRef.current?.close();
    // Release now: the `close` event can lag behind (it's async), and the listener below is only a backstop.
    unlock('case');
  };
  const step = (delta: number) => show((index + delta + items.length) % items.length);

  // Release the scroll lock however the sheet closes (button, Escape, backdrop) — and if it unmounts while open.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const release = () => unlock('case');
    dialog.addEventListener('close', release);
    return () => {
      dialog.removeEventListener('close', release);
      release();
    };
  }, [unlock]);

  return (
    <>
      <ul className="grid grid-cols-1 gap-space-xl lg:grid-cols-2">
        {items.map((p, i) => (
          <li key={p.index}>
            <Reveal delay={(i % 2) * 90} className="h-full">
              <article className="group relative flex h-full flex-col border border-ink-line bg-ink-soft transition-[translate,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-copper has-[button:focus-visible]:border-copper has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-offset-4 has-[button:focus-visible]:outline-glow">
                <div className="bg-hairline-grid relative aspect-[16/10] overflow-hidden">
                  <ProjectCover
                    motif={p.motif}
                    index={p.index}
                    className="cover-drift absolute inset-0 size-full transition-[scale] duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <span className="absolute top-space-md inset-s-space-md bg-ink/80 px-space-sm py-0.5 font-mono text-code-inline uppercase text-sand backdrop-blur">
                    {`${p.index} // ${p.category}`}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-e-space-md bottom-space-md flex items-center gap-1 rounded-full bg-copper px-space-md py-1 font-mono text-label-sm uppercase text-paper"
                  >
                    {t.caseNotes} <Icon name="arrow-up-right" size={14} />
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-space-md p-space-lg">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-space-md gap-y-1">
                    <h3 className="font-display text-headline-sm text-canvas transition-colors group-hover:text-blush">
                      <button
                        type="button"
                        aria-haspopup="dialog"
                        onClick={() => show(i)}
                        className="text-start outline-none after:absolute after:inset-0 after:content-['']"
                      >
                        {p.name} <span className="text-ash">— {p.subtitle}</span>
                      </button>
                    </h3>
                    <span className="font-mono text-label-sm uppercase text-ash">{p.scope}</span>
                  </div>
                  <p className="text-body-md text-ash">{p.summary}</p>
                  <ul className="mt-auto flex flex-wrap gap-space-xs pt-space-xs" aria-label="Stack">
                    {p.stack.slice(0, 4).map((tech) => (
                      <li
                        key={tech}
                        dir="ltr"
                        className="rounded-full border border-ink-line bg-white/5 px-space-sm py-1 font-mono text-label-sm text-canvas"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-labelledby="case-title"
        onClick={(e) => e.target === e.currentTarget && close()}
        onKeyDown={(e) => {
          if (e.key === nextKey) step(1);
          if (e.key === prevKey) step(-1);
          // Don't rely solely on the native close request: some input paths skip it.
          if (e.key === 'Escape') {
            e.preventDefault();
            close();
          }
        }}
        data-lenis-prevent=""
        className="case-sheet m-auto max-h-[calc(100dvh-2rem)] w-[min(60rem,calc(100vw-2rem))] max-w-none overflow-y-auto overscroll-contain border border-line bg-canvas p-0 text-ink"
      >
        <div className="flex min-h-full flex-col">
          <header className="sticky top-0 z-10 flex items-center justify-between gap-space-md border-b border-line bg-canvas/95 px-space-md py-space-sm backdrop-blur md:px-space-lg">
            <span className="font-mono text-label-sm uppercase text-copper-ink">
              {`${project.index} // ${project.category}`}
            </span>
            <div className="flex items-center gap-space-sm">
              <span className="font-mono text-label-sm text-muted tabular-nums">
                {project.index} / {formatNumber(items.length, locale, 2)}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label={t.dialog.close}
                className="flex size-9 items-center justify-center border border-line transition-colors hover:border-ink"
              >
                <Icon name="x" />
              </button>
            </div>
          </header>

          <div className="bg-hairline-grid relative aspect-[2/1] overflow-hidden bg-ink-soft md:aspect-[5/2]">
            <ProjectCover motif={project.motif} index={project.index} fit="meet" className="absolute inset-0 size-full" />
          </div>

          <div className="grid gap-space-xl px-space-md py-space-xl md:grid-cols-12 md:px-space-lg">
            <div className="flex flex-col gap-space-md md:col-span-5">
              <h2 id="case-title" className="font-display text-headline-lg-mobile md:text-headline-lg">
                {project.name}
                <span className="mt-1 block text-headline-sm text-muted">{project.subtitle}</span>
              </h2>
              <p className="text-body-lg text-graphite">{project.description}</p>
              <dl className="grid grid-cols-[auto_1fr] gap-x-space-md gap-y-space-xs border-t border-line pt-space-md font-mono text-label-sm uppercase">
                <dt className="text-muted">{t.dialog.scope}</dt>
                <dd>{project.scope}</dd>
                <dt className="text-muted">{t.dialog.type}</dt>
                <dd>{project.category}</dd>
              </dl>
              <ul className="flex flex-wrap gap-space-xs" aria-label="Stack">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    dir="ltr"
                    className="rounded-full border border-line bg-panel px-space-sm py-1 font-mono text-label-sm text-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-7">
              <h3 className="font-mono text-label-sm uppercase tracking-widest text-muted">{t.dialog.built}</h3>
              <ol className="mt-space-sm border-t border-line">
                {project.highlights.map((point, i) => (
                  <li key={point} className="flex gap-space-md border-b border-line py-space-md">
                    <span className="shrink-0 pt-0.5 font-mono text-label-sm text-copper-ink">[{formatNumber(i + 1, locale, 2)}]</span>
                    <p className="text-body-md text-graphite">{point}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <footer className="mt-auto flex flex-wrap items-center justify-between gap-space-md border-t border-line px-space-md py-space-md md:px-space-lg">
            <div className="flex gap-space-xs">
              <button
                type="button"
                onClick={() => step(-1)}
                className="inline-flex items-center gap-space-xs border border-line px-space-md py-space-sm font-mono text-label-md uppercase transition-colors hover:border-ink"
              >
                <Icon name="arrow-left" size={16} /> {t.dialog.prev}
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="inline-flex items-center gap-space-xs border border-line px-space-md py-space-sm font-mono text-label-md uppercase transition-colors hover:border-ink"
              >
                {t.dialog.next} <Icon name="arrow-right" size={16} />
              </button>
            </div>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                close();
                scrollToId('contact');
              }}
              className="inline-flex items-center gap-space-sm bg-ink px-space-lg py-space-sm font-mono text-label-md uppercase text-canvas transition-colors hover:bg-copper"
            >
              {t.dialog.discuss} <Icon name="arrow-right" size={16} />
            </a>
          </footer>
        </div>
      </dialog>
    </>
  );
}
