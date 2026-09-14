import { PROFILE } from '@/lib/content';
import type { Dictionary } from '@/lib/i18n';

/** Floating index of profiles on the end edge — only once the viewport has gutter room for it. */
export function SocialRail({ t, label }: { t: Dictionary['social']; label: string }) {
  const links = [
    { tag: '[GH]', title: t.github, href: PROFILE.github, external: true },
    { tag: '[IN]', title: t.linkedin, href: PROFILE.linkedin, external: true },
    { tag: '[CV]', title: t.cv, href: PROFILE.cv, download: true },
    { tag: '[@]', title: t.email, href: `mailto:${PROFILE.email}` },
  ];

  return (
    <aside
      aria-label={label}
      className="fixed inset-e-space-lg bottom-space-lg z-40 hidden flex-col gap-1 border border-line bg-panel/90 p-space-xs backdrop-blur-md min-[1400px]:flex"
    >
      {links.map((link) => (
        <a
          key={link.tag}
          href={link.href}
          title={link.title}
          aria-label={link.title}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noreferrer' : undefined}
          download={link.download || undefined}
          dir="ltr"
          className="px-space-sm py-1 text-center font-mono text-label-sm uppercase text-muted transition-colors hover:bg-panel-deep hover:text-ink"
        >
          {link.tag}
        </a>
      ))}
    </aside>
  );
}
