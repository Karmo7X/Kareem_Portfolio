'use client';

import { send } from '@emailjs/browser';
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import {
  ERROR_LIMIT,
  LIMITS,
  normalizeContact,
  validateContact,
  validateField,
  type ContactErrorCode,
  type ContactErrors,
  type ContactField,
  type ContactPayload,
} from '@/lib/contact';
import { BRIEF, PROFILE } from '@/lib/content';
import { fill, formatNumber, type Dictionary, type Locale } from '@/lib/i18n';
import { cx } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'sent' | 'error';
type Strings = Pick<Dictionary['contact'], 'form' | 'chips' | 'errors' | 'failures' | 'sent'>;

const EMPTY: ContactPayload = { name: '', email: '', engagement: '', scope: [], timeline: '', message: '', website: '' };

// Inlined at build time. Public by design: they only let someone send this one template
// to the template's fixed "To Email" — never the EmailJS private key.
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

/** People can't scroll down, read and fill the form faster than this. */
const MIN_FILL_MS = 3_000;
/** One message per browser per minute — enforced by the EmailJS SDK (localStorage). */
const THROTTLE_MS = 60_000;

/** The inbox is Kareem's, so metadata stays in English whatever the page language. */
const receivedAt = () =>
  `${new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: PROFILE.timeZone }).format(new Date())} (Cairo)`;

/** EmailJS rejects with `{ status, text }`; anything else is a network failure. */
const errorStatus = (error: unknown) =>
  typeof error === 'object' && error !== null && 'status' in error ? Number(error.status) || 0 : 0;

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cx(
        'rounded-full border px-space-sm py-1.5 text-center font-mono text-label-sm transition-colors',
        active
          ? 'border-copper bg-copper/10 text-copper-ink'
          : 'border-line bg-panel text-ink hover:border-line-strong hover:bg-blush/40',
      )}
    >
      {children}
    </button>
  );
}

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-space-xs">
      <div className="flex items-baseline justify-between gap-space-sm">
        <label htmlFor={id} className="font-mono text-label-sm uppercase text-muted">
          {label} <span className="text-copper-ink" aria-hidden="true">*</span>
        </label>
        {hint && <span className="font-mono text-label-sm text-muted tabular-nums">{hint}</span>}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} className="font-mono text-label-sm text-alert">
          {error}
        </p>
      )}
    </div>
  );
}

const legend = 'mb-space-xs font-mono text-label-sm uppercase text-muted';
const input = 'w-full border bg-canvas px-space-sm py-space-sm text-body-sm text-ink transition-colors placeholder:text-muted focus:border-ink';
const panel = 'flex w-full flex-col gap-space-md border border-line bg-paper p-space-md sm:p-space-lg lg:w-[26rem] lg:shrink-0';

/** Validated and bot-checked in the browser, then delivered straight from the browser by EmailJS. */
export function ContactForm({ locale, t }: { locale: Locale; t: Strings }) {
  const [values, setValues] = useState<ContactPayload>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [failure, setFailure] = useState('');
  const [sentTo, setSentTo] = useState('');
  const mountedAt = useRef(0);
  const fieldRefs = useRef<Partial<Record<ContactField, HTMLInputElement | HTMLTextAreaElement | null>>>({});
  const doneRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === 'sent') doneRef.current?.focus();
  }, [status]);

  const describe = (code?: ContactErrorCode) => {
    if (!code) return undefined;
    const limit = ERROR_LIMIT[code];
    return fill(t.errors[code], { n: limit === undefined ? '' : formatNumber(limit, locale) });
  };

  const onText = (field: ContactField) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [field]: e.target.value };
    setValues(next);
    // Once a field shows an error, re-check it as the person types so it clears the moment it's fixed.
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: validateField(field, normalizeContact(next)) }));
  };

  const onBlur = (field: ContactField) => () => {
    if (!values[field]) return; // don't nag about empty fields until they try to send
    setErrors((prev) => ({ ...prev, [field]: validateField(field, normalizeContact(values)) }));
  };

  const pickOne = (key: 'engagement' | 'timeline', item: string) =>
    setValues((v) => ({ ...v, [key]: v[key] === item ? '' : item }));
  const toggleScope = (item: string) =>
    setValues((v) => ({ ...v, scope: v.scope.includes(item) ? v.scope.filter((s) => s !== item) : [...v.scope, item] }));

  const finish = (email: string) => {
    setSentTo(email);
    setValues(EMPTY);
    setErrors({});
    setStatus('sent');
  };

  const fail = (message: string) => {
    setFailure(message);
    setStatus('error');
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;

    const data = normalizeContact(values);
    const found = validateContact(data);
    setErrors(found);
    const firstInvalid = (['name', 'email', 'message'] as const).find((field) => found[field]);
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    // Bot traps: a filled honeypot or an inhumanly fast submit gets a fake "sent" — nothing leaves the page.
    if (data.website || Date.now() - mountedAt.current < MIN_FILL_MS) {
      finish(data.email);
      return;
    }

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      fail(t.failures.notConfigured);
      return;
    }

    setStatus('sending');
    setFailure('');
    try {
      // Rendered with {{double braces}} in the template, which HTML-escapes every value.
      await send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: data.name,
          reply_to: data.email,
          engagement: data.engagement || 'General enquiry',
          scope: data.scope.join(', ') || 'Not specified',
          timeline: data.timeline || 'Not specified',
          message: data.message,
          received_at: receivedAt(),
          // Includes the path, so "/ar" tells you the visitor used the Arabic site.
          site: window.location.host + window.location.pathname,
        },
        {
          publicKey: PUBLIC_KEY,
          blockHeadless: true,
          limitRate: { id: 'portfolio-contact', throttle: THROTTLE_MS },
        },
      );
      finish(data.email);
    } catch (error) {
      const code = errorStatus(error);
      if (code === 0) return fail(t.failures.network);
      if (code === 429) return fail(t.failures.rateLimited);
      if (code === 451) return fail(t.failures.headless);
      console.error('[contact] EmailJS rejected the message:', error);
      fail(t.failures.generic);
    }
  };

  if (status === 'sent') {
    const [before, after] = t.sent.body.split('{email}');
    return (
      <div className={cx(panel, 'items-start')}>
        <span className="flex size-10 items-center justify-center bg-copper text-paper" aria-hidden="true">
          <Icon name="check" size={20} />
        </span>
        <h3 ref={doneRef} tabIndex={-1} className="font-display text-headline-sm outline-none">
          {t.sent.title}
        </h3>
        <p className="text-body-md text-graphite">
          {before}
          <span dir="ltr" className="font-mono text-code-inline text-ink">
            {sentTo}
          </span>
          {after}
        </p>
        <button type="button" onClick={() => setStatus('idle')} className="link-grow py-1 font-mono text-label-md uppercase text-ink">
          {t.sent.again}
        </button>
      </div>
    );
  }

  const sending = status === 'sending';
  const described = (field: ContactField) => (errors[field] ? `cf-${field}-error` : undefined);

  return (
    <form noValidate onSubmit={submit} aria-labelledby="brief-title" className={cx(panel, 'relative')}>
      <h3 id="brief-title" className="font-display text-headline-sm">
        {t.form.title}
      </h3>

      <Field id="cf-name" label={t.form.name} error={describe(errors.name)}>
        <input
          ref={(el) => {
            fieldRefs.current.name = el;
          }}
          id="cf-name"
          name="name"
          dir="auto"
          autoComplete="name"
          required
          maxLength={LIMITS.nameMax}
          value={values.name}
          onChange={onText('name')}
          onBlur={onBlur('name')}
          aria-invalid={!!errors.name}
          aria-describedby={described('name')}
          className={cx(input, errors.name ? 'border-alert' : 'border-line')}
        />
      </Field>

      <Field id="cf-email" label={t.form.email} error={describe(errors.email)}>
        <input
          ref={(el) => {
            fieldRefs.current.email = el;
          }}
          id="cf-email"
          name="email"
          type="email"
          dir="ltr"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={LIMITS.emailMax}
          value={values.email}
          onChange={onText('email')}
          onBlur={onBlur('email')}
          aria-invalid={!!errors.email}
          aria-describedby={described('email')}
          className={cx(input, errors.email ? 'border-alert' : 'border-line')}
        />
      </Field>

      <fieldset>
        <legend className={legend}>{t.form.engagement}</legend>
        <div className="grid grid-cols-2 gap-2">
          {BRIEF.engagement.map((item) => (
            <Chip key={item} active={values.engagement === item} onClick={() => pickOne('engagement', item)}>
              {t.chips[item] ?? item}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={legend}>{t.form.scope}</legend>
        <div className="grid grid-cols-2 gap-2">
          {BRIEF.scope.map((item) => (
            <Chip key={item} active={values.scope.includes(item)} onClick={() => toggleScope(item)}>
              {t.chips[item] ?? item}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={legend}>{t.form.timeline}</legend>
        <div className="flex flex-wrap gap-2">
          {BRIEF.timeline.map((item) => (
            <Chip key={item} active={values.timeline === item} onClick={() => pickOne('timeline', item)}>
              {t.chips[item] ?? item}
            </Chip>
          ))}
        </div>
      </fieldset>

      <Field
        id="cf-message"
        label={t.form.message}
        error={describe(errors.message)}
        hint={`${formatNumber(values.message.length, locale)} / ${formatNumber(LIMITS.messageMax, locale)}`}
      >
        <textarea
          ref={(el) => {
            fieldRefs.current.message = el;
          }}
          id="cf-message"
          name="message"
          dir="auto"
          rows={4}
          required
          maxLength={LIMITS.messageMax}
          value={values.message}
          onChange={onText('message')}
          onBlur={onBlur('message')}
          placeholder={t.form.placeholder}
          aria-invalid={!!errors.message}
          aria-describedby={described('message')}
          className={cx(input, 'resize-none', errors.message ? 'border-alert' : 'border-line')}
        />
      </Field>

      {/* Honeypot: invisible to people and screen readers; bots that fill every field get silently dropped. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="cf-website">Website</label>
        <input
          id="cf-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => setValues((v) => ({ ...v, website: e.target.value }))}
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="mt-space-xs flex items-center justify-center gap-space-sm bg-ink py-space-md font-mono text-label-md uppercase text-canvas transition-colors hover:bg-copper disabled:cursor-wait disabled:bg-ink/70"
      >
        {sending ? t.form.sending : t.form.submit}
        <Icon name="send" size={16} className={sending ? 'animate-pulse' : undefined} />
      </button>

      {status === 'error' ? (
        <div role="alert" className="flex flex-col items-center gap-1 text-center font-mono text-label-sm">
          <p className="text-alert">{failure}</p>
          <a href={`mailto:${PROFILE.email}`} dir="ltr" className="link-grow text-ink">
            {PROFILE.email}
          </a>
        </div>
      ) : (
        <p role="status" className="text-center font-mono text-label-sm text-muted">
          {sending ? t.form.sending : t.form.note}
        </p>
      )}
    </form>
  );
}
