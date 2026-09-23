'use client'

import { useScrollProgress } from '@/lib/hooks'

const RADIUS = 21
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function ScrollProgress() {
  const { progress, isScrolled, scrollToTop } = useScrollProgress()

  return (
    <>
      {/* No top strip — read progress is carried by the ring on the button
          below, and the strip clashed with RouteProgress during navigation. */}

      {/* Back to top — the ring doubles as a read-progress dial */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label={`Back to top (${Math.round(progress)}% read)`}
        className={`group fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-navy/90 text-white shadow-lg shadow-navy/25 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-navy hover:shadow-xl hover:shadow-green/30 active:scale-95 ${
          isScrolled
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <svg
          viewBox="0 0 48 48"
          className="absolute inset-0 h-full w-full -rotate-90"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="scroll-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#00c2a8" />
              <stop offset="0.55" stopColor="#2dbe60" />
              <stop offset="1" stopColor="#7dcb45" />
            </linearGradient>
          </defs>
          <circle cx="24" cy="24" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2.5" />
          <circle
            cx="24"
            cy="24"
            r={RADIUS}
            fill="none"
            stroke="url(#scroll-ring)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress / 100)}
            style={{ transition: 'stroke-dashoffset 150ms ease-out' }}
          />
        </svg>

        {/* Arrow lifts out and a second one rises in behind it */}
        <span className="relative z-10 block h-4 w-4 overflow-hidden">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="absolute inset-0 h-4 w-4 transition-transform duration-300 ease-out group-hover:-translate-y-5"
          >
            <path d="M8 13V3M3 8l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="absolute inset-0 h-4 w-4 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-y-0"
          >
            <path d="M8 13V3M3 8l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
    </>
  )
}
