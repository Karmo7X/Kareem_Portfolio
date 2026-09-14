import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { INTRO_SCRIPT } from '@/components/site/introScript';
import { ar } from '@/lib/i18n/ar';
import { arabicFontVars } from '../fonts-arabic';
import { latinFontVars } from '../fonts';
import '../globals.css';

export const metadata: Metadata = {
  title: ar.meta.title,
  description: ar.meta.description,
  keywords: ar.meta.keywords,
  authors: [{ name: 'Kareem Azam', url: 'https://github.com/Karmo7X' }],
  alternates: { canonical: '/ar', languages: { en: '/', ar: '/ar', 'x-default': '/' } },
  openGraph: { title: ar.meta.title, description: ar.meta.description, type: 'profile', locale: 'ar_AR', alternateLocale: ['en_US'] },
  twitter: { card: 'summary', title: ar.meta.title, description: ar.meta.description },
};

export const viewport: Viewport = { themeColor: '#fbfbfa' };

/** Root layout for the Arabic site (/ar): right-to-left, with Arabic faces loaded. */
export default function ArabicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    // The intro script may add data-intro before hydration.
    <html lang="ar" dir="rtl" className={`${latinFontVars} ${arabicFontVars}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
