import { BRIEF } from '@/lib/content';

/** Contact form rules: normalizes raw form state and validates it before it goes to EmailJS. */

export const LIMITS = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 254,
  messageMin: 20,
  messageMax: 2000,
  maxLinks: 3,
} as const;

export type ContactPayload = {
  name: string;
  email: string;
  engagement: string;
  scope: string[];
  timeline: string;
  message: string;
  /** Honeypot — hidden from people, so it must stay empty. */
  website: string;
};

export type ContactField = 'name' | 'email' | 'message';

/** Validation returns codes; each dictionary turns them into sentences. */
export type ContactErrorCode =
  | 'nameRequired'
  | 'nameShort'
  | 'nameLong'
  | 'nameSymbols'
  | 'nameLetters'
  | 'emailRequired'
  | 'emailInvalid'
  | 'messageRequired'
  | 'messageShort'
  | 'messageLong'
  | 'messageLinks';

export type ContactErrors = Partial<Record<ContactField, ContactErrorCode>>;

/** The limit a message refers to, filled into `{n}`. */
export const ERROR_LIMIT: Partial<Record<ContactErrorCode, number>> = {
  nameLong: LIMITS.nameMax,
  messageShort: LIMITS.messageMin,
  messageLong: LIMITS.messageMax,
  messageLinks: LIMITS.maxLinks,
};

const LINK = /\b(?:https?:\/\/|www\.)\S+/gi;
// No quotes, brackets or spaces: the address is echoed into the email's reply link.
const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:".]{2,}$/;

/** C0/C1 control characters (except tab, LF, CR) plus invisible zero-width/bidi marks. */
const isControl = (code: number) =>
  (code < 0x20 && code !== 0x09 && code !== 0x0a && code !== 0x0d) ||
  (code >= 0x7f && code <= 0x9f) ||
  (code >= 0x200b && code <= 0x200f) ||
  (code >= 0x202a && code <= 0x202e) ||
  code === 0x2028 ||
  code === 0x2029 ||
  code === 0xfeff;

const stripControl = (text: string) =>
  Array.from(text)
    .filter((ch) => !isControl(ch.codePointAt(0) ?? 0))
    .join('');

const asString = (value: unknown) => (typeof value === 'string' ? value : '');

/** One line: no control characters, no line breaks, single spaces. */
const singleLine = (value: unknown) => stripControl(asString(value)).replace(/\s+/g, ' ').trim();

/** Free text: keeps line breaks, but no control characters or runs of blank lines. */
const multiLine = (value: unknown) =>
  stripControl(asString(value).replace(/\r\n?/g, '\n'))
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ ?\n ?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const pick = (value: unknown, allowed: readonly string[]) => {
  const v = asString(value);
  return allowed.includes(v) ? v : '';
};

const pickMany = (value: unknown, allowed: readonly string[]) =>
  Array.isArray(value) ? allowed.filter((option) => value.includes(option)) : [];

export const countLinks = (text: string) => text.match(LINK)?.length ?? 0;

/** Coerce anything (form state or an untrusted request body) into a clean payload. */
export function normalizeContact(raw: unknown): ContactPayload {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    name: singleLine(r.name),
    email: singleLine(r.email),
    engagement: pick(r.engagement, BRIEF.engagement),
    scope: pickMany(r.scope, BRIEF.scope),
    timeline: pick(r.timeline, BRIEF.timeline),
    message: multiLine(r.message),
    website: singleLine(r.website),
  };
}

export function validateField(field: ContactField, p: Pick<ContactPayload, ContactField>): ContactErrorCode | undefined {
  switch (field) {
    case 'name':
      if (!p.name) return 'nameRequired';
      if (p.name.length < LIMITS.nameMin) return 'nameShort';
      if (p.name.length > LIMITS.nameMax) return 'nameLong';
      if (/[<>{}]/.test(p.name) || countLinks(p.name)) return 'nameSymbols';
      if (!/\p{L}/u.test(p.name)) return 'nameLetters';
      return;
    case 'email':
      if (!p.email) return 'emailRequired';
      if (p.email.length > LIMITS.emailMax || !EMAIL.test(p.email)) return 'emailInvalid';
      return;
    case 'message':
      if (!p.message) return 'messageRequired';
      if (p.message.length < LIMITS.messageMin) return 'messageShort';
      if (p.message.length > LIMITS.messageMax) return 'messageLong';
      if (countLinks(p.message) > LIMITS.maxLinks) return 'messageLinks';
      return;
  }
}

export function validateContact(p: Pick<ContactPayload, ContactField>): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of ['name', 'email', 'message'] as const) {
    const error = validateField(field, p);
    if (error) errors[field] = error;
  }
  return errors;
}
