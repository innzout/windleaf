import Link from 'next/link'
import { EVENTS, type SiteEvent } from '@/lib/events'

/**
 * Event banners, driven by `NEXT_PUBLIC_EVENTS` (see `lib/events.ts`).
 *
 * Renders nothing at all when no events are configured — including no heading
 * and no spacing — so a page that mounts this does not end up with an empty
 * bordered box or a gap once the show is over. Callers that wrap it in their
 * own `<Section>` should guard on `HAS_EVENTS`.
 *
 * `variant="strip"` is the one-line form for a page-top announcement bar;
 * `card` is the full panel with body copy and a CTA.
 */
export function EventBanner({
  variant = 'card',
  className = '',
}: {
  variant?: 'card' | 'strip'
  className?: string
}) {
  if (EVENTS.length === 0) return null

  return (
    <div className={variant === 'card' ? `space-y-4 ${className}` : className}>
      {EVENTS.map((event) =>
        variant === 'strip' ? (
          <EventStripRow key={event.id} event={event} />
        ) : (
          <EventCard key={event.id} event={event} />
        ),
      )}
    </div>
  )
}

function EventCard({ event }: { event: SiteEvent }) {
  const href = event.ctaHref ?? '/contact'
  const label = event.ctaLabel ?? 'Book a Meeting'

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline">
      <div className="grid gap-6 bg-mist p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-green">Event</span>
          <h3 className="mt-2 text-2xl font-semibold text-navy">{event.heading}</h3>
          {event.text && <p className="mt-2 max-w-xl text-charcoal/70">{event.text}</p>}
          {event.details && (
            <p className="mt-2 text-sm font-medium text-charcoal/55">{event.details}</p>
          )}
        </div>
        <Link
          href={href}
          className="group inline-flex items-center justify-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-green"
        >
          {label}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3 8h9M8 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  )
}

function EventStripRow({ event }: { event: SiteEvent }) {
  // `strip` is the single-line form; fall back to the heading so an event
  // configured without one still announces itself rather than rendering blank.
  const text = event.strip ?? event.heading

  return (
    <Link
      href={event.ctaHref ?? '/contact'}
      className="flex items-center justify-center gap-3 bg-navy px-6 py-2.5 text-center text-xs font-medium text-white/85 transition-colors hover:text-white sm:text-sm"
    >
      <span className="hidden shrink-0 rounded-full bg-leaf px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy sm:inline">
        Event
      </span>
      <span>{text}</span>
    </Link>
  )
}
