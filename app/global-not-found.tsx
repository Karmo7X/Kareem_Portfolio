import type { Metadata } from 'next';
import Link from 'next/link';
import { latinFontVars } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: '404 — Kareem Azam',
  description: 'This page does not exist.',
};

/** 404 for any unmatched URL — needed because the site has two root layouts (English and Arabic). */
export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr" className={latinFontVars}>
      <body>
        <main className="mx-auto flex min-h-dvh max-w-7xl flex-col justify-center gap-space-lg px-margin-mobile lg:px-margin">
          <span className="font-mono text-label-sm uppercase tracking-widest text-copper-ink">Error // 404</span>
          <h1 className="font-display text-headline-xl-mobile md:text-headline-xl">This page doesn’t exist.</h1>
          <p lang="ar" dir="rtl" className="self-start text-body-lg text-graphite">
            هذه الصفحة غير موجودة.
          </p>
          <div className="flex flex-wrap gap-space-md">
            <Link
              href="/"
              className="bg-ink px-space-lg py-space-md font-mono text-label-md uppercase text-canvas transition-colors hover:bg-copper"
            >
              Back home
            </Link>
            <Link
              href="/ar"
              lang="ar"
              hrefLang="ar"
              className="border border-ink px-space-lg py-space-md font-mono text-label-md text-ink transition-colors hover:bg-ink hover:text-canvas"
            >
              الصفحة الرئيسية
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
