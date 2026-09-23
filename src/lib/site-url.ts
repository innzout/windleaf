/**
 * The site's canonical origin — the one place the live domain is written.
 *
 * Canonical tags, the sitemap, `robots.txt` and the JSON-LD all read from here,
 * so switching from a preview deployment to the real domain is a single
 * environment variable rather than a hunt through the tree.
 *
 * Order matters:
 *  1. `NEXT_PUBLIC_SITE_URL` — set this to the production domain. Always wins.
 *  2. `VERCEL_PROJECT_PRODUCTION_URL` — Vercel's stable production hostname.
 *     Preview branches keep reporting the production domain here, which is what
 *     we want: a preview must never advertise itself as canonical or it can be
 *     indexed in place of the real site.
 *  3. localhost, for development.
 */
const fromEnv =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined)

export const SITE_URL = (fromEnv ?? 'http://localhost:3000').replace(/\/$/, '')

/**
 * True only on the real production deployment.
 *
 * Preview and development builds use it to serve a `noindex` robots policy —
 * without that, Vercel preview URLs get crawled and compete with the live site
 * for the same content.
 */
export const IS_PRODUCTION_SITE =
  process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production'
