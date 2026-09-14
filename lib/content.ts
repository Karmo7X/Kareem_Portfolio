/**
 * Language-independent data. Every visible sentence lives in the dictionaries
 * (lib/i18n/en.ts, lib/i18n/ar.ts); this file holds links, ids and tech names.
 */

export const PROFILE = {
  name: 'Kareem Azam',
  initials: 'KA',
  timeZone: 'Africa/Cairo',
  email: 'kareemazam60@gmail.com',
  github: 'https://github.com/Karmo7X',
  githubHandle: 'github.com/Karmo7X',
  linkedin: 'https://www.linkedin.com/in/kareem-azam',
  cv: '/Kareem-Azam-CV.pdf',
} as const;

export const NAV_IDS = ['work', 'experience', 'lab', 'stack', 'contact'] as const;
export type NavId = (typeof NAV_IDS)[number];

export type Motif = 'storefront' | 'dashboard' | 'tenants' | 'devportal' | 'rtl' | 'timetable';

/** Same order as `projects` in each dictionary. */
export const PROJECT_META: { motif: Motif; stack: string[] }[] = [
  { motif: 'storefront', stack: ['Next.js 16', 'React 19', 'TypeScript', 'RTK Query', 'Tailwind CSS 4', 'Firebase'] },
  { motif: 'dashboard', stack: ['Next.js 16', 'React 19', 'TypeScript', 'RTK Query', 'Tailwind CSS 4', 'Recharts', 'Firebase'] },
  { motif: 'tenants', stack: ['Next.js 16', 'React 19', 'TypeScript', 'RTK Query', 'Tailwind CSS 4'] },
  { motif: 'devportal', stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'Framer Motion'] },
  { motif: 'rtl', stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'RTK Query'] },
  { motif: 'timetable', stack: ['Next.js 16', 'React 19', 'TypeScript', 'RTK Query', 'Tailwind CSS 4', 'i18next'] },
];

/**
 * Contact-form chip ids. These English values are what reaches the inbox in both
 * languages; the dictionaries only translate how they're labelled on screen.
 */
export const BRIEF = {
  engagement: ['Full-time role', 'Freelance project'],
  scope: ['Web app', 'Dashboard / SaaS', 'Design system', 'RTL / i18n', 'Performance', 'Marketing site'],
  timeline: ['ASAP', 'This quarter', 'Flexible'],
};
