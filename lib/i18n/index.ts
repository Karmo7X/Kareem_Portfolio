import { ar } from './ar';
import type { Locale } from './config';
import { en, type Dictionary } from './en';

export const DICTIONARIES: Record<Locale, Dictionary> = { en, ar };

export type { Dictionary };
export * from './config';
