'use client';

import { Fragment, useState } from 'react';
import { fill, formatNumber, type Dictionary, type Locale } from '@/lib/i18n';
import { cx } from '@/lib/utils';

/** Each row is an 8-bit mask of granted permissions for that surface. */
const ROLES = {
  Admin: [0xff, 0xff, 0xff],
  Manager: [0xfe, 0xfc, 0xf0],
  Staff: [0xf0, 0xe0, 0x80],
} as const;

type Role = keyof typeof ROLES;

const TOTAL = 24;
const popcount = (mask: number) => mask.toString(2).split('1').length - 1;

type RbacMatrixProps = { locale: Locale; t: Dictionary['lab']['rbac'] };

/** Runtime RBAC: one permission map gates routes, navigation and individual actions. */
export function RbacMatrix({ locale, t }: RbacMatrixProps) {
  const [role, setRole] = useState<Role>('Manager');
  const masks = ROLES[role];
  const granted = masks.reduce((sum, mask) => sum + popcount(mask), 0);

  return (
    <div className="flex w-full flex-col gap-space-sm">
      <div className="grid grid-cols-3 border border-line" role="group" aria-label={t.label}>
        {(Object.keys(ROLES) as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={r === role}
            onClick={() => setRole(r)}
            className={cx(
              'py-1 font-mono text-label-sm uppercase transition-colors',
              r === role ? 'bg-ink text-canvas' : 'bg-canvas text-muted hover:text-ink',
            )}
          >
            {t.roles[r]}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[auto_1fr] items-center gap-x-space-sm gap-y-1.5" aria-hidden="true">
        {t.surfaces.map((surface, r) => (
          <Fragment key={surface}>
            <span className="font-mono text-label-sm text-muted">{surface}</span>
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: 8 }, (_, c) => (
                <span
                  key={c}
                  className={cx(
                    'aspect-square border transition-colors duration-300',
                    (masks[r] >> (7 - c)) & 1 ? 'border-copper bg-copper' : 'border-line-strong bg-canvas',
                  )}
                  style={{ transitionDelay: `${(r * 8 + c) * 12}ms` }}
                />
              ))}
            </div>
          </Fragment>
        ))}
      </div>
      <span aria-live="polite" className="text-center font-mono text-code-inline text-copper-ink">
        {fill(t.granted, { role: t.roles[role], n: formatNumber(granted, locale), total: formatNumber(TOTAL, locale) })}
      </span>
    </div>
  );
}
