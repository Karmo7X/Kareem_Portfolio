'use client';

import { useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

type CopyEmailProps = { email: string; copyLabel: string; copiedLabel: string };

export function CopyEmail({ email, copyLabel, copiedLabel }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      return; // Clipboard blocked — the address is still a mailto link.
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex max-w-full items-center justify-between gap-space-lg border border-line bg-canvas px-space-md py-space-sm font-mono text-code-inline">
      <a href={`mailto:${email}`} dir="ltr" className="link-grow truncate text-ink">
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="flex shrink-0 items-center gap-1 font-mono text-label-sm uppercase text-ink transition-colors hover:text-copper-ink"
      >
        <Icon name={copied ? 'check' : 'copy'} size={16} />
        <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
      </button>
    </div>
  );
}
