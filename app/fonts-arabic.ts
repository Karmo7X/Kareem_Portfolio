import { Noto_Kufi_Arabic, Noto_Sans_Arabic } from 'next/font/google';

// Imported only by the Arabic root layout, so English pages never download or preload these.
// Arabic subset and no metric fallback: Latin characters must fall through to Syne / Inter
// (see globals.css), not to a size-adjusted Arial that would also swallow them.
const kufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  variable: '--font-kufi',
  display: 'swap',
  adjustFontFallback: false,
  fallback: [],
});
const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-noto-arabic',
  display: 'swap',
  adjustFontFallback: false,
  fallback: [],
});

export const arabicFontVars = `${kufi.variable} ${notoArabic.variable}`;
