import type { MetadataRoute } from 'next'
import { SITE_URL, IS_PRODUCTION_SITE } from '@/lib/site-url'

/**
 * Served at /robots.txt.
 *
 * Preview and local builds disallow everything. A Vercel preview URL serves the
 * identical pages as the production domain, and if it is crawled Google has to
 * pick a winner between two identical sites — which it sometimes gets wrong.
 */
export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION_SITE) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
