import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // AGENTS.md in this repo is hand-written and holds hard-won invariants;
  // Next's generator overwrites it on every dev boot.
  agentRules: false,
  // This project sits inside a larger directory tree that also has lockfiles —
  // pin the root so Turbopack does not infer the wrong one.
  turbopack: { root: import.meta.dirname },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
}

export default nextConfig
