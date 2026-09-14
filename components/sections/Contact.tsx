import { ContactForm } from '@/components/contact/ContactForm';
import { CopyEmail } from '@/components/contact/CopyEmail';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { PROFILE } from '@/lib/content';
import type { Dictionary, Locale } from '@/lib/i18n';

export function Contact({ locale, t }: { locale: Locale; t: Dictionary['contact'] }) {
  const links = [
    { tag: '[IN]', label: t.links.linkedin, href: PROFILE.linkedin, external: true },
    { tag: '[GH]', label: t.links.github, href: PROFILE.github, external: true },
    { tag: '[CV]', label: t.links.cv, href: PROFILE.cv, download: true },
  ];

  return (
    <section id="contact" className="mx-auto max-w-7xl px-margin-mobile py-space-2xl lg:px-margin">
      <Reveal className="flex flex-col items-start justify-between gap-space-xl border border-line bg-panel p-space-md shadow-glow sm:p-space-xl lg:flex-row">
        <div className="flex max-w-lg flex-col gap-space-md">
          <div className="flex items-center gap-space-xs">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inset-0 animate-ping rounded-full bg-copper opacity-60" />
              <span className="relative size-2 rounded-full bg-copper" />
            </span>
            <span className="font-mono text-label-sm uppercase tracking-widest text-copper-ink">{t.badge}</span>
          </div>
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg">{t.title}</h2>
          <p className="text-body-md text-graphite">{t.intro}</p>
          <CopyEmail email={PROFILE.email} copyLabel={t.copy} copiedLabel={t.copied} />
          <ul className="flex flex-wrap gap-x-space-lg gap-y-space-sm pt-space-xs font-mono text-label-md uppercase">
            {links.map((link) => (
              <li key={link.tag}>
                <a
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noreferrer' : undefined}
                  download={link.download || undefined}
                  className="link-grow inline-flex items-center gap-1 py-1 text-ink"
                >
                  <span dir="ltr" className="text-copper-ink">
                    {link.tag}
                  </span>{' '}
                  {link.label}
                  <Icon name={link.download ? 'download' : 'arrow-up-right'} size={14} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <ContactForm locale={locale} t={t} />
      </Reveal>
    </section>
  );
}
