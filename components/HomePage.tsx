import { KineticBand } from '@/components/fx/KineticBand';
import { Contact } from '@/components/sections/Contact';
import { Experience } from '@/components/sections/Experience';
import { Hero } from '@/components/sections/Hero';
import { Lab } from '@/components/sections/Lab';
import { Manifesto } from '@/components/sections/Manifesto';
import { Stack } from '@/components/sections/Stack';
import { Work } from '@/components/sections/Work';
import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { IntroLoader } from '@/components/site/IntroLoader';
import { SiteProvider } from '@/components/site/SiteProvider';
import { SocialRail } from '@/components/site/SocialRail';
import { PROFILE } from '@/lib/content';
import type { Dictionary } from '@/lib/i18n';

/** The whole one-page portfolio, rendered in the dictionary's language. */
export function HomePage({ t }: { t: Dictionary }) {
  const { locale } = t;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: PROFILE.name,
    jobTitle: t.experience.roles[0].role,
    email: `mailto:${PROFILE.email}`,
    sameAs: [PROFILE.github, PROFILE.linkedin],
    alumniOf: { '@type': 'CollegeOrUniversity', name: t.experience.education.school },
    address: { '@type': 'PostalAddress', addressCountry: 'EG' },
    knowsLanguage: ['en', 'ar'],
    knowsAbout: ['React', 'Next.js', 'TypeScript', 'RTK Query', 'Tailwind CSS', 'Internationalization', 'Right-to-left layouts'],
  };

  return (
    <SiteProvider>
      <IntroLoader locale={locale} t={t.intro} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:inset-s-3 focus:z-[60] focus:bg-ink focus:px-space-md focus:py-space-sm focus:font-mono focus:text-label-md focus:text-canvas"
      >
        {t.a11y.skip}
      </a>
      <Header locale={locale} t={{ nav: t.nav, header: t.header, a11y: t.a11y, switcher: t.switcher }} />
      <main id="main" tabIndex={-1} className="pt-20 outline-none">
        <Hero locale={locale} t={t.hero} focusLabel={t.a11y.focusAreas} />
        <KineticBand rtl={locale === 'ar'} />
        <Work locale={locale} t={t.work} projects={t.projects} />
        <Experience t={t.experience} />
        <Lab locale={locale} t={t.lab} />
        <Stack t={t.stack} />
        <Manifesto t={t.manifesto} />
        <Contact locale={locale} t={t.contact} />
      </main>
      <Footer locale={locale} t={t.footer} />
      <SocialRail t={t.social} label={t.a11y.profiles} />
    </SiteProvider>
  );
}
