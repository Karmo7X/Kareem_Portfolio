export const LOCALES = ['en', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_META: Record<Locale, { dir: 'ltr' | 'rtl'; path: string; intl: string; og: string }> = {
  en: { dir: 'ltr', path: '/', intl: 'en-US', og: 'en_US' },
  // ar-EG formats with Arabic-Indic digits (١٢٣) by default.
  ar: { dir: 'rtl', path: '/ar', intl: 'ar-EG', og: 'ar_AR' },
};

/** Locale digits, optionally zero-padded: (1, 'ar', 2) → "٠١". */
export function formatNumber(n: number, locale: Locale, pad = 1) {
  return new Intl.NumberFormat(LOCALE_META[locale].intl, { minimumIntegerDigits: pad, useGrouping: false }).format(n);
}

export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

/** CLDR plural rules — Arabic has six forms (zero, one, two, few, many, other). */
export function plural(locale: Locale, n: number, forms: PluralForms) {
  const rule = new Intl.PluralRules(LOCALE_META[locale].intl).select(n);
  return (forms[rule] ?? forms.other).replace('{n}', formatNumber(n, locale));
}

/** "{a} of {b}" templating. */
export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''));
}
