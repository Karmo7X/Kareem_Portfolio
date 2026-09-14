import type { ContactErrorCode } from '@/lib/contact';
import type { PluralForms } from './config';

/** English dictionary — the shape every other language must match. Sourced from the CV. */
export const en = {
  locale: 'en' as 'en' | 'ar',
  meta: {
    title: 'Kareem Azam — Frontend Developer',
    description:
      'Frontend developer with 3+ years building large React, Next.js and TypeScript products end to end — marketplaces, multi-tenant SaaS and bilingual storefronts, with Arabic/RTL done right.',
    keywords: ['Kareem Azam', 'Frontend Developer', 'React', 'Next.js', 'TypeScript', 'RTL', 'Arabic', 'i18n', 'Egypt'],
  },
  switcher: { label: 'العربية', short: 'ع', href: '/ar', hrefLang: 'ar', title: 'اقرأ الموقع بالعربية' },
  a11y: {
    skip: 'Skip to content',
    backToTop: 'Kareem Azam — back to top',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    primaryNav: 'Primary',
    mobileNav: 'Mobile',
    profiles: 'Profiles',
    cairoTime: 'Local time in Cairo:',
    focusAreas: 'Focus areas',
    stack: 'Stack',
  },
  nav: { work: 'Work', experience: 'Experience', lab: 'Lab', stack: 'Stack', contact: 'Contact' },
  header: {
    tag: '// FE',
    available: 'Available for roles & freelance',
    hire: 'Hire me',
    cv: 'Download CV',
    clock: 'CAI',
  },
  social: { github: 'GitHub', linkedin: 'LinkedIn', cv: 'Download CV (PDF)', email: 'Email' },
  intro: { label: 'Portfolio — Frontend', role: 'Frontend Developer — Cairo, EG', loading: 'Loading' },
  hero: {
    scroll: 'Scroll',
    eyebrow: 'Kareem Azam // FE',
    byline: 'Frontend Developer — Egypt / Remote',
    headline: { before: 'Building large products end to end — from the ', accent: 'API layer', after: ' to the final UI.' },
    intro:
      'Frontend developer with 3+ years in React, Next.js and TypeScript — often the only frontend developer on the project. I write code that stays easy to work with as a product grows, and I get Arabic/RTL right, not just translated.',
    focus: ['Next.js 16 / React 19', 'TypeScript', 'RTK Query', 'Arabic · RTL · i18n'],
    cta: { work: 'Explore selected work', contact: 'Get in touch', cv: 'Download CV' },
    stats: [
      { value: '3+ yrs', label: 'Production frontend', accent: false },
      { value: '12+', label: 'Products shipped', accent: false },
      { value: 'EN·AR·ZH', label: 'RTL-ready locales', accent: true },
    ],
    card: {
      badge: 'BFF · Live',
      featured: 'Featured build',
      project: 'ChinaParts Storefront',
      metric: '99 handlers',
      metricLabel: 'BFF layer',
      hint: 'CLICK TO SEND REQUESTS',
      canvasLabel:
        'Animated diagram: requests flow from the browser through a Next.js backend-for-frontend layer to a Laravel API and back. The session token stays in an httpOnly cookie and never reaches client-side JavaScript.',
    },
  },
  work: {
    eyebrow: 'Index // Case studies',
    title: 'Selected work & production systems',
    intro:
      'Marketplaces, multi-tenant SaaS and bilingual storefronts — built end to end, often as the only frontend developer. Open any card for the architecture notes.',
    caseNotes: 'Case notes',
    dialog: {
      close: 'Close case notes',
      built: 'How it was built',
      scope: 'Scope',
      type: 'Type',
      prev: 'Prev',
      next: 'Next',
      discuss: 'Discuss a similar build',
    },
  },
  projects: [
    {
      name: 'ChinaParts',
      subtitle: 'Multi-Vendor Storefront',
      category: 'Marketplace',
      scope: '28 routes · 99 endpoints',
      summary:
        'The buyer journey for a multi-vendor auto-parts marketplace — fitment search, split checkout, EN/AR/ZH with full RTL.',
      description:
        'Customer-facing storefront for a multi-vendor auto-parts marketplace, where one order can span several independent sellers. Built the full buyer journey — finding the right part for a specific car, checkout, payment, delivery tracking, returns, and support — in English, Arabic, and Chinese with full RTL support.',
      highlights: [
        'Built the frontend from scratch on Next.js 16 App Router with React 19, using Atomic Design to keep the component library maintainable as the product grew.',
        "Built a Backend-for-Frontend layer of 99 route handlers proxying a Laravel API, storing the session token in an httpOnly cookie so it's never exposed to client-side JavaScript.",
        'Built the data layer as 23 RTK Query slices with normalized caching and tag-based invalidation, keeping cart, favorites, and order state consistent without manual refetching.',
        'Built a multi-seller checkout that splits one basket into per-seller sub-orders, compares shipping rates per seller, and hands off to a payment gateway with session-persisted recovery.',
        'Built a vehicle-fitment engine ("My Garage") letting buyers save their cars and filter the catalog down to parts that actually fit, searchable by vehicle or by part number.',
        'Delivered full EN/AR/ZH localization (1,200+ keys) with server-rendered translations and complete RTL support, plus real-time buyer-seller chat and push notifications through Firebase.',
      ],
    },
    {
      name: 'ChinaParts',
      subtitle: 'Seller Dashboard',
      category: 'Seller portal',
      scope: '79 route handlers',
      summary:
        'The business side of the same marketplace — onboarding and verification, a 4-step product wizard, fulfillment, returns, payouts and analytics.',
      description:
        'Business-side portal for the same marketplace, letting sellers manage their own store: onboarding and identity verification, product listings, orders, returns, payouts, and customer support.',
      highlights: [
        'Built a full seller portal covering onboarding and identity verification, catalog, orders, returns, payouts, analytics, and support ticketing.',
        'Implemented a 4-step product wizard with variants, dynamic category attributes, and vehicle-compatibility matching, with per-step server persistence and dirty-checking.',
        'Delivered end-to-end order fulfillment — status pipeline, shipping-label generation, carrier tracking, delivery-proof uploads — plus a complete RMA flow (approve/reject/receive/inspect).',
        'Built a sales analytics dashboard with KPI cards and Recharts trend/pie/bar charts, and a wallet module with transactions, reserves, and bank withdrawal requests.',
      ],
    },
    {
      name: 'Petrobe',
      subtitle: 'Fuel-Station Management Platform',
      category: 'Multi-tenant SaaS',
      scope: '30 modules · 142 permissions',
      summary:
        'Enterprise SaaS that lets fuel-station franchise networks run operations, HR, maintenance and quality from one dashboard. Shipped from scratch.',
      description:
        'Enterprise SaaS platform that lets fuel-station franchise networks run their whole operation from one dashboard — station operations, HR, performance reviews, maintenance, quality inspections, complaints, and public customer feedback, across 30 domain modules.',
      highlights: [
        'Built a true multi-tenant system where each franchise has its own branding, usage quotas, contract lifecycle, and settings, with super-admins able to switch tenant context on the fly.',
        'Implemented a dynamic RBAC layer of 142 granular permissions loaded at runtime, gating routes, navigation, and individual UI actions.',
        'Built a Backend-for-Frontend layer of 91 route handlers that hides the upstream API origin and key, and handles authentication through httpOnly cookies instead of client-side token storage.',
        'Delivered a multi-stage performance-appraisal workflow moving from employee to line manager to HR to general manager, scored against a configurable competency framework with full audit history.',
        'Shipped a fully trilingual (EN/AR/ZH) interface with RTL support and Hijri date handling, built on an Atomic Design component system and deployed to staging and production via GitHub Actions.',
      ],
    },
    {
      name: 'Ciro Pay',
      subtitle: 'Fintech Marketing & Developer Portal',
      category: 'Fintech',
      scope: 'AR / EN · 1,100+ keys',
      summary:
        'Marketing site and developer portal for a Saudi payments company — code-sample switcher, API explorer and sandbox mockups.',
      description:
        'Marketing website and developer portal for a Saudi payments company, used to explain the product to customers and onboard developers integrating its API.',
      highlights: [
        'Built a bilingual (AR/EN) marketing and developer portal for a Saudi payments platform on Next.js 16 with the React Compiler enabled for automatic memoization.',
        'Architected the UI with Atomic Design and made the entire site content-driven from JSON locale files (1,100+ translation keys).',
        'Built a JSON-schema-driven legal document renderer and an interactive developer portal — code-sample switcher, API explorer, and sandbox mockups — plus EmailJS-powered contact and support forms.',
      ],
    },
    {
      name: 'Wesada',
      subtitle: 'Bilingual Luxury Furniture Showroom',
      category: 'Retail · RTL-first',
      scope: '8 endpoints · SSR SEO',
      summary:
        'Arabic-first digital showroom for a Saudi furniture brand — RTL by default, native numerals and pluralization, server-rendered SEO.',
      description:
        'Digital showroom for a Saudi furniture brand, built Arabic-first for a luxury retail audience browsing collections and products online.',
      highlights: [
        'Built a bilingual (AR/EN) digital showroom with RTL as the default orientation — CSS logical properties, Arabic numeral and currency formatting, and full Arabic pluralization rules.',
        'Architected a typed RTK Query data layer over 8 REST endpoints with per-resource cache-tag invalidation and per-request store isolation to prevent SSR cache leakage between visitors.',
        'Implemented server-rendered SEO (JSON-LD, hreflang, dynamic sitemap) and a defensive rendering layer that gracefully handles an incomplete CMS, plus a full custom Tailwind v4 design system.',
      ],
    },
    {
      name: 'CentriX',
      subtitle: 'Educational Center Management Platform',
      category: 'EdTech SaaS',
      scope: '4 portals · ~100 handlers',
      summary:
        'SaaS for running educational centers — portals for admins, teachers and students, an online exam engine and direct-to-S3 video uploads.',
      description:
        'Full SaaS platform for running educational centers, with separate portals for super admins, center admins, teachers, and students, plus a public parent lookup.',
      highlights: [
        'Built a Backend-for-Frontend layer of ~100 route handlers proxying a Laravel API, keeping auth tokens in httpOnly cookies and enforcing role-based access and locale routing at the middleware level.',
        'Implemented direct-to-S3/R2 multipart uploads for large video files, with presigned part signing, live progress, and automatic abort — taking uploads entirely off the application server.',
        'Built an online exam engine with an image-supported question bank, anti-cheating shuffling, scheduled windows, a resilient student attempt flow, and auto-graded results.',
        'Built attendance and live-session management, covering session start/end, real-time roll call, bulk enrollment, and a color-coded monthly attendance calendar.',
        'Built the SaaS control plane, handling tenant provisioning, subscription plans, and per-tenant quota enforcement across storage, students, teachers, classrooms, and exams.',
        'Designed a weekly timetable grid with a custom lane-assignment algorithm to render overlapping class sessions per room without collisions, and shipped full Arabic/English i18n with RTL support.',
      ],
    },
  ],
  experience: {
    eyebrow: 'Career // 2023 — Now',
    title: 'Experience',
    summary: '3+ years · product startup, software house & freelance',
    educationLabel: 'Education',
    roles: [
      {
        company: 'ChinaParts',
        kind: 'Product-based startup',
        role: 'Frontend Developer',
        period: '2025 — Present',
        location: 'Remote · Saudi Arabia',
        points: [
          'Built the storefront of a multi-vendor auto-parts marketplace — vehicle-fitment search, multi-seller checkout, wallet and real-time seller chat, fully localized in English, Arabic and Chinese with RTL.',
          'Built the seller dashboard for the same marketplace: onboarding and identity verification, a 4-step product wizard, fulfillment and RMA, payouts and sales analytics.',
          'Architected the BFF layer for both platforms — 99 and 79 Next.js Route Handlers — proxying a Laravel API with httpOnly-cookie auth, so no token is ever exposed to client-side JavaScript.',
          'Shipped the Petrobe platform from scratch: a multi-tenant SaaS for fuel-station franchise networks covering HR, task management, maintenance and dynamic role-based access control.',
          'Cut new-feature turnaround across all three products by standardizing on Atomic Design and RTK Query — 50+ API slices with normalized, tag-based caching.',
        ],
      },
      {
        company: 'MagdSoft',
        kind: 'Software house',
        role: 'Frontend Developer',
        period: 'Jul 2023 — Oct 2024',
        location: 'Nasr City · Egypt',
        points: [
          'Delivered 4+ client projects end to end, owning frontend architecture, API integration and production optimization across government, real estate, healthcare and e-commerce.',
          'Baraqia (Saudi Government): a government e-letter platform with complex multi-step forms and secure API flows, now used by thousands of civil servants.',
          'Rawaseem Real Estate: a bilingual property marketplace with map integration and real-time Firebase features, making property search faster and more intuitive.',
          'Tahaliluk Medical Labs: booking and lab-results features for a medical platform running across 5+ branches.',
          'E-commerce platform: the full shopping experience — search, filtering, cart and checkout — cutting page load time by ~25%.',
        ],
      },
      {
        company: 'Freelance',
        kind: 'Independent',
        role: 'Frontend Developer',
        period: '2023 — Present',
        location: 'Remote',
        points: [
          'Tadawul Academy: an educational platform on Next.js with SSR for stronger SEO, plus a GoAffPro affiliate integration.',
          'Advanced Universal Quality: a corporate website scoring 90+ on Lighthouse, with strong accessibility and mobile support.',
        ],
      },
    ],
    education: {
      school: 'Mansoura University',
      degree: 'B.Sc. Computer Science',
      year: '2025',
      location: 'Mansoura · Egypt',
    },
  },
  lab: {
    eyebrow: 'R&D Lab // Engineering details',
    title: 'Patterns from production',
    intro: 'Four mechanics lifted from the products above, rebuilt as tiny live demos. Go on — press the buttons.',
    cards: [
      { chip: 'i18n / RTL', title: 'Logical-property mirroring', body: 'One layout, both directions — no left/right overrides.' },
      { chip: 'RTK Query', title: 'Tag-based invalidation', body: 'Mutations invalidate tags; only matching queries refetch.' },
      { chip: 'RBAC', title: 'Runtime permissions', body: 'Petrobe gates routes, nav and actions with 142 of these.' },
      { chip: 'Algorithm', title: 'Collision-free timetable', body: 'Greedy lane assignment for overlapping class sessions.' },
    ],
    rtl: { flip: 'Flip → {dir}' },
    cache: {
      status: { refetching: 'refetching', fresh: 'fresh', cached: 'cached' },
      perQuery: 'one tag per query',
    },
    rbac: {
      label: 'Role',
      roles: { Admin: 'Admin', Manager: 'Manager', Staff: 'Staff' } as Record<string, string>,
      surfaces: ['route', 'nav', 'action'],
      granted: '{role} · {n}/{total} granted',
    },
    lanes: {
      shuffle: 'Shuffle sessions',
      sessions: { one: '{n} session', other: '{n} sessions' } as PluralForms,
      lanes: { one: '{n} lane', other: '{n} lanes' } as PluralForms,
      collisions: '0 collisions',
    },
  },
  stack: {
    eyebrow: 'Approach // 001',
    title: 'Code that stays easy to work with as the product grows.',
    intro:
      'Most of my work lands on large products where I’m the only frontend developer — so the architecture has to carry the product long after launch. A few habits do most of the work:',
    principles: [
      {
        title: 'Atomic, feature-based structure',
        body: 'Standardizing on Atomic Design and RTK Query cut new-feature turnaround across three products.',
      },
      {
        title: 'Security at the boundary',
        body: 'BFF route handlers keep session tokens in httpOnly cookies — never in client-side JavaScript.',
      },
      {
        title: 'Localization as architecture',
        body: 'Logical properties, Arabic pluralization, Hijri dates and native numeral formatting — designed in from day one.',
      },
    ],
    panelTitle: 'Runtime architecture & tooling',
    since: 'EST. 2023 — NOW',
    groups: [
      {
        title: 'Frameworks & data',
        items: [
          ['React.js', '18 / 19'],
          ['Next.js', 'App Router 13–16'],
          ['TypeScript', 'JavaScript ES6+'],
          ['Redux Toolkit', 'RTK Query · React Query'],
        ] as [string, string][],
      },
      {
        title: 'Styling & UI',
        items: [
          ['Tailwind CSS', 'v3 / v4'],
          ['Radix UI / shadcn', 'Headless'],
          ['Framer Motion', 'Embla Carousel'],
          ['SCSS · LESS', 'MUI · Bootstrap'],
        ] as [string, string][],
      },
      {
        title: 'Architecture',
        items: [
          ['Atomic Design', 'Component-driven'],
          ['Feature-based modules', 'Modular'],
          ['Backend-for-Frontend', 'Route Handlers'],
          ['RBAC', 'Runtime permissions'],
        ] as [string, string][],
      },
      {
        title: 'Integrations & charts',
        items: [
          ['Firebase', 'Firestore · FCM · Admin'],
          ['Google Maps API', 'Geo'],
          ['WebSockets', 'Realtime'],
          ['Recharts · D3.js', 'Charts'],
        ] as [string, string][],
      },
    ],
    toolkitLabel: 'Also in the toolkit',
    concepts: [
      'SSR / SSG',
      'Web performance',
      'Accessibility',
      'i18n / RTL',
      'RESTful APIs',
      'Responsive design',
      'Cross-browser',
      'React Hook Form + Yup',
    ],
  },
  manifesto: {
    label: 'Working principle',
    quote: '“RTL done right — not just translated.”',
    role: 'Frontend Developer',
    note: 'EN · AR · ZH — shipped in production',
  },
  contact: {
    badge: 'Open to roles & freelance',
    title: 'Have a product to build? Let’s ship it properly.',
    intro:
      'Available for full-time frontend roles and freelance work — Next.js apps, dashboards and SaaS, design systems, and Arabic/RTL localization.',
    copy: 'Copy',
    copied: 'Copied',
    links: { linkedin: 'LinkedIn', github: 'GitHub', cv: 'Download PDF' },
    form: {
      title: 'Start a project brief',
      name: 'Name',
      email: 'Email',
      engagement: 'Engagement',
      scope: 'Scope',
      timeline: 'Timeline',
      message: 'Message',
      placeholder: 'What are you building, and where can I help?',
      submit: 'Send message',
      sending: 'Sending…',
      note: 'Validated and spam-filtered before it reaches me.',
    },
    chips: {
      'Full-time role': 'Full-time role',
      'Freelance project': 'Freelance project',
      'Web app': 'Web app',
      'Dashboard / SaaS': 'Dashboard / SaaS',
      'Design system': 'Design system',
      'RTL / i18n': 'RTL / i18n',
      Performance: 'Performance',
      'Marketing site': 'Marketing site',
      ASAP: 'ASAP',
      'This quarter': 'This quarter',
      Flexible: 'Flexible',
    } as Record<string, string>,
    errors: {
      nameRequired: 'Please tell me your name.',
      nameShort: 'That name looks too short.',
      nameLong: 'Please keep it under {n} characters.',
      nameSymbols: 'Names can’t contain links or symbols like < >.',
      nameLetters: 'Please use letters in your name.',
      emailRequired: 'I need an email to reply to.',
      emailInvalid: 'That email address doesn’t look right.',
      messageRequired: 'Tell me a bit about the project.',
      messageShort: 'A little more detail, please (at least {n} characters).',
      messageLong: 'Please keep it under {n} characters.',
      messageLinks: 'Please include no more than {n} links.',
    } satisfies Record<ContactErrorCode, string>,
    failures: {
      notConfigured: 'The contact form isn’t set up yet — please email me directly.',
      network: 'Network problem — please check your connection and try again.',
      rateLimited: 'You just sent a message — please wait a minute before sending another.',
      headless: 'This browser was blocked by the spam filter — please email me directly.',
      generic: 'The email service couldn’t send this — please try again, or email me directly.',
    },
    sent: {
      title: 'Message sent',
      body: 'Thanks — it’s in my inbox. I’ll reply to {email}.',
      again: 'Send another message',
    },
  },
  footer: {
    title: 'Kareem Azam // Frontend',
    tagline: 'React · Next.js · TypeScript — RTL-ready products, end to end.',
    status: 'Status: open to work',
    backToTop: 'Back to top',
  },
};

export type Dictionary = typeof en;
