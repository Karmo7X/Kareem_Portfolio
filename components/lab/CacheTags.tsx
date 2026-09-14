'use client';

import { useRef, useState } from 'react';
import type { Dictionary } from '@/lib/i18n';
import { cx } from '@/lib/utils';

const QUERIES = [
  { name: 'getCart', tag: 'Cart' },
  { name: 'getOrders', tag: 'Order' },
  { name: 'getProducts', tag: 'Product' },
];

const MUTATIONS = [
  { name: 'addToCart', tags: ['Cart'] },
  { name: 'placeOrder', tags: ['Cart', 'Order'] },
  { name: 'editListing', tags: ['Product'] },
];

/** RTK Query in miniature: a mutation invalidates tags, and only queries providing them refetch. */
export function CacheTags({ t }: { t: Dictionary['lab']['cache'] }) {
  const [next, setNext] = useState(0);
  const [invalidated, setInvalidated] = useState<string[] | null>(null);
  const [refetching, setRefetching] = useState<string[]>([]);
  const timer = useRef(0);

  const run = () => {
    const mutation = MUTATIONS[next];
    setInvalidated(mutation.tags);
    setRefetching(mutation.tags);
    setNext((next + 1) % MUTATIONS.length);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setRefetching([]), 900);
  };

  return (
    <div className="flex w-full flex-col gap-space-sm">
      <ul className="flex flex-col border border-line bg-canvas font-mono text-label-sm">
        {QUERIES.map((q) => {
          const busy = refetching.includes(q.tag);
          const status = busy ? 'refetching' : invalidated?.includes(q.tag) ? 'fresh' : 'cached';
          return (
            <li key={q.name} className="flex items-center justify-between gap-space-sm border-b border-line px-space-sm py-1.5 last:border-b-0">
              <span dir="ltr" className="text-ink">
                {q.name}
              </span>
              <span className={cx('flex items-center gap-1.5', busy ? 'text-copper-ink' : 'text-muted')}>
                <span className={cx('size-1.5 rounded-full', busy ? 'animate-pulse bg-copper' : 'bg-olive')} aria-hidden="true" />
                {t.status[status]}
              </span>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={run}
        dir="ltr"
        className="self-center bg-ink px-space-md py-space-sm font-mono text-label-md text-canvas transition-[background-color,scale] hover:bg-copper active:scale-95"
      >
        {MUTATIONS[next].name}()
      </button>
      <p aria-live="polite" className="text-center font-mono text-label-sm text-copper-ink">
        <span dir="ltr" className="block text-muted">
          {invalidated ? 'invalidatesTags' : 'providesTags'}
        </span>
        {invalidated ? <span dir="ltr">{`[${invalidated.map((tag) => `'${tag}'`).join(', ')}]`}</span> : t.perQuery}
      </p>
    </div>
  );
}
