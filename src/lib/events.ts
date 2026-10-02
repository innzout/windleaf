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

/**
 * Shown when NEXT_PUBLIC_EVENTS is not set. Intentionally empty: no variable
 * means no banner, so a forgotten environment variable fails quietly rather
 * than resurrecting a show that finished months ago.
 */
const DEFAULT_EVENTS: SiteEvent[] = []

/**
 * A malformed value must never take the site down.
 *
 * This is parsed during the production build, so a stray comma in a dashboard
 * field would otherwise fail the deploy — and it is read by client components
 * too, where a throw blanks the page. Bad input falls back to the defaults and
 * warns in the build log, which is visible to whoever just edited it.
 *
 * Every path logs. With `DEFAULT_EVENTS` empty, "unset", "set to []" and "set
 * to something broken" all render identically — nothing — so the build log is
 * the only way to tell a deliberate hide from a typo.
 */
function parseEvents(raw: string | undefined): SiteEvent[] {
  // Unset is a normal state, not a misconfiguration: most of the year there is
  // no show to announce. It renders nothing and says nothing — warning on every
  // build would train whoever reads the log to ignore the genuine errors below.
  //
  // If a banner is missing when you expected one, check that the variable is
  // set where the build can see it. `.env.example` is a template and is NOT
  // read by Next.js — it reads .env.local / .env.production / .env, and on a
  // host it must be set in that project's environment variables.
  if (raw === undefined || raw.trim() === '') return DEFAULT_EVENTS

  // A value pasted out of .env.example often brings its wrapping quotes along.
  // Those quotes are .env file syntax, not part of the value, and a dashboard
  // field stores them literally — so JSON.parse fails on the leading "'" and
  // the banner vanishes for a reason nobody can see. Valid JSON never starts
  // with a quote followed by "[", so stripping this pair is unambiguous.
  let text = raw.trim()
  const quoted =
    (text.startsWith("'") && text.endsWith("'")) ||
    (text.startsWith('`') && text.endsWith('`'))
  if (quoted) {
    console.warn('[events] Stripping wrapping quotes from NEXT_PUBLIC_EVENTS — the value should be bare JSON.')
    text = text.slice(1, -1).trim()
  }

  try {
    const parsed: unknown = JSON.parse(text)
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
  } catch (error) {
    console.warn(
      `[events] NEXT_PUBLIC_EVENTS is not valid JSON — no banners will render. ${(error as Error).message}`,
    )
    return DEFAULT_EVENTS
  }
}

/** Every configured event, including those switched off. */
export const ALL_EVENTS = parseEvents(process.env.NEXT_PUBLIC_EVENTS)

/** What the site should actually show. */
export const EVENTS = ALL_EVENTS.filter((event) => event.enabled !== false)

export const HAS_EVENTS = EVENTS.length > 0
