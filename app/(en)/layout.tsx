import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { INTRO_SCRIPT } from '@/components/site/introScript';
import { en } from '@/lib/i18n/en';
import { latinFontVars } from '../fonts';
import '../globals.css';

export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
  keywords: en.meta.keywords,
  authors: [{ name: 'Kareem Azam', url: 'https://github.com/Karmo7X' }],
  alternates: { canonical: '/', languages: { en: '/', ar: '/ar', 'x-default': '/' } },
  openGraph: { title: en.meta.title, description: en.meta.description, type: 'profile', locale: 'en_US', alternateLocale: ['ar_AR'] },
  twitter: { card: 'summary', title: en.meta.title, description: en.meta.description },
};

export const viewport: Viewport = { themeColor: '#fbfbfa' };

/** Root layout for the English site (/). */
export default function EnglishLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    // The intro script may add data-intro before hydration.
    <html lang="en" dir="ltr" className={latinFontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
