import { Icon } from '@/components/ui/Icon';
import { PROFILE } from '@/lib/content';
import { formatNumber, type Dictionary, type Locale } from '@/lib/i18n';

export function Footer({ locale, t }: { locale: Locale; t: Dictionary['footer'] }) {
  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-space-lg px-margin-mobile py-space-xl md:flex-row md:items-center lg:px-margin">
        <div className="flex flex-col gap-space-xs">
          <span className="font-display text-headline-sm uppercase">{t.title}</span>
          <span className="font-mono text-code-inline text-muted">{t.tagline}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-space-lg gap-y-space-sm font-mono text-label-sm uppercase text-muted">
          <span className="flex items-center gap-space-sm">
            <span className="size-2 rounded-full bg-copper" aria-hidden="true" />
            {t.status}
          </span>
          <span>
            © {formatNumber(new Date().getFullYear(), locale)} {PROFILE.name}
          </span>
          <a href="#top" className="link-grow inline-flex items-center gap-1 text-ink">
            {t.backToTop} <Icon name="arrow-up" size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
