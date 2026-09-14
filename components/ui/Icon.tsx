import type { SVGProps } from 'react';
import { cx } from '@/lib/utils';

/** 24px stroke icons, drawn to sit on the mono/label baseline. */
const PATHS = {
  'arrow-down': 'M12 5v14M19 12l-7 7-7-7',
  'arrow-up': 'M12 19V5M5 12l7-7 7 7',
  'arrow-right': 'M5 12h14M12 5l7 7-7 7',
  'arrow-left': 'M19 12H5M12 19l-7-7 7-7',
  'arrow-up-right': 'M7 17 17 7M8 7h9v9',
  mail: 'M3 5h18v14H3zM3 7l9 6 9-6',
  copy: 'M9 9h11v11H9zM15 9V4H4v11h5',
  check: 'M20 6 9 17l-5-5',
  send: 'M21 3 10 14M21 3l-7 18-4-7-7-4 18-7z',
  layers: 'M12 3l9 5-9 5-9-5 9-5zM3 16l9 5 9-5',
  code: 'm16 18 6-6-6-6M8 6l-6 6 6 6',
  database:
    'M4 6c0 1.7 3.6 3 8 3s8-1.3 8-3-3.6-3-8-3-8 1.3-8 3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z',
  shield: 'M12 3 4 6v6c0 4.7 3.4 8 8 9 4.6-1 8-4.3 8-9V6l-8-3zM9 12l2 2 4-4',
  file: 'M14 3H6v18h12V7l-4-4zM14 3v4h4M9 13h6M9 17h6',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  x: 'M18 6 6 18M6 6l12 12',
  menu: 'M4 7h16M4 12h16M4 17h16',
} as const;

export type IconName = keyof typeof PATHS;

/** Icons that point along the reading direction flip automatically on RTL pages. */
const DIRECTIONAL = new Set<IconName>(['arrow-right', 'arrow-left', 'arrow-up-right', 'send']);

type IconProps = Omit<SVGProps<SVGSVGElement>, 'name'> & { name: IconName; size?: number };

export function Icon({ name, size = 18, className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      className={cx(DIRECTIONAL.has(name) && 'rtl:-scale-x-100', className)}
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
