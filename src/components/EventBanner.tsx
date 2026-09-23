import Link from 'next/link'
import { EVENT } from '@/content/site'

/** Full in-page event banner card (used on the Technology page). */
export function EventBanner() {
  return (
    <div className="overflow-hidden rounded-2xl border border-hairline">
      <div className="grid gap-6 bg-mist p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-green">Event</span>
          <h3 className="mt-2 text-2xl font-semibold text-navy">{EVENT.heading}</h3>
          <p className="mt-2 max-w-xl text-charcoal/70">{EVENT.text}</p>
          <p className="mt-2 text-sm font-medium text-charcoal/55">{EVENT.details}</p>
        </div>
        <Link
          href="/contact"
          className="group inline-flex items-center justify-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-green"
        >
          Book a Meeting
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
