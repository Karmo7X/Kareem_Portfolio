import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // Two root layouts (English + Arabic) → app/global-not-found.tsx serves unmatched URLs.
    globalNotFound: true,
  },
};

export default nextConfig;
