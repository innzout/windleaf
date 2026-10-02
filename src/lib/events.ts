/**
 * Site events — trade shows, conferences, anything with a date on it.
 *
 * These change far more often than the rest of the site and the person who
 * needs to change them is not necessarily the person who can open a PR, so they
 * are configured as JSON in `NEXT_PUBLIC_EVENTS` rather than hard-coded in
 * `content/site.ts`. Updating the banner, or taking it down after the show, is
 * an environment-variable edit and a redeploy.
 *
 * ```
 * NEXT_PUBLIC_EVENTS=[{"id":"windergy-2026","heading":"Meet Windleaf at Windergy India 2026","text":"Visit us to discuss blade engineering.","details":"October 7–9, 2026 · Chennai Trade Centre · Hall 2, S3"}]
 * ```
 *
 * Set it to `[]` to hide every event banner site-wide. Leave it unset and the
 * defaults below are used, so a fresh clone and a missing env var both render
 * something sensible rather than an empty page.
 *
 * `NEXT_PUBLIC_` is required: the value is inlined at build time and the banner
 * renders in both server and client trees. It is public — do not put anything
 * in here you would not publish, because it ships in the JS bundle.
 */
export type SiteEvent = {
  id: string
  heading: string
  /** Body copy. Optional — a date-only announcement is legitimate. */
  text?: string
  /** Dates and venue, rendered smaller beneath the body. */
  details?: string
  /** Single-line form, for a compact strip rather than the full card. */
  strip?: string
  ctaLabel?: string
  ctaHref?: string
  /** Set false to hide one event without deleting its entry. Default true. */
  enabled?: boolean
}

const DEFAULT_EVENTS: SiteEvent[] = [
  
]

/**
 * A malformed value must never take the site down.
 *
 * This is parsed during the production build, so a stray comma in a dashboard
 * field would otherwise fail the deploy — and it is read by client components
 * too, where a throw blanks the page. Bad input falls back to the defaults and
 * warns in the build log, which is visible to whoever just edited it.
 */
function parseEvents(raw: string | undefined): SiteEvent[] {
  if (raw === undefined || raw.trim() === '') return DEFAULT_EVENTS

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      console.warn('[events] NEXT_PUBLIC_EVENTS must be a JSON array — using defaults.')
      return DEFAULT_EVENTS
    }

    // An explicit empty array is the documented way to hide every banner, so it
    // must survive as `[]` rather than being treated as "nothing set".
    return parsed.filter((event): event is SiteEvent => {
      const ok =
        typeof event === 'object' &&
        event !== null &&
        typeof (event as SiteEvent).id === 'string' &&
        typeof (event as SiteEvent).heading === 'string'
      if (!ok) console.warn('[events] Skipping an entry with no `id` / `heading`.')
      return ok
    })
  } catch {
    console.warn('[events] NEXT_PUBLIC_EVENTS is not valid JSON — using defaults.')
    return DEFAULT_EVENTS
  }
}

/** Every configured event, including those switched off. */
export const ALL_EVENTS = parseEvents(process.env.NEXT_PUBLIC_EVENTS)

/** What the site should actually show. */
export const EVENTS = ALL_EVENTS.filter((event) => event.enabled !== false)

export const HAS_EVENTS = EVENTS.length > 0
