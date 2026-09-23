import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-url'

/**
 * Served at /sitemap.xml.
 *
 * Every route is static and equally worth crawling, so the list is explicit
 * rather than derived — a page that should not be indexed simply never gets
 * added here, which is easier to audit than an exclusion list.
 */
const ROUTES = [
  { path: '/', priority: 1 },
  { path: '/services', priority: 0.9 },
  { path: '/about', priority: 0.8 },
  { path: '/ai-automation-robotics', priority: 0.8 },
  { path: '/how-we-work', priority: 0.7 },
  { path: '/contact', priority: 0.7 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: 'monthly',
    priority,
  }))
}
