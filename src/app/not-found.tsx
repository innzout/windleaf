import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { NAV } from '@/content/site'

export const metadata: Metadata = {
  title: 'Page Not Found | Windleaf',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-navy">
      {/* Same blade-motif ambience as the interior heroes */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 78% 30%, rgba(0,194,168,0.22) 0%, rgba(5,47,69,0) 58%)',
        }}
      />

      <div className="relative mx-auto flex min-h-[68vh] w-full max-w-7xl flex-col justify-center px-6 py-24 lg:px-10">
        <div className="max-w-2xl">
          <span className="enter-left inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-leaf">
            <span className="h-px w-6 bg-leaf" />
            Error 404
          </span>

          <p
            className="enter-up mt-6 font-display text-7xl font-bold leading-none text-white/15 sm:text-8xl"
            style={{ animationDelay: '60ms' }}
          >
            404
          </p>

          <h1
            className="enter-up mt-4 text-4xl font-semibold text-balance !text-white sm:text-5xl"
            style={{ animationDelay: '120ms' }}
          >
            This page has drifted off course.
          </h1>

          <p
            className="enter-up mt-5 max-w-xl text-lg leading-relaxed text-white/70"
            style={{ animationDelay: '180ms' }}
          >
            The page you are looking for doesn’t exist or has moved. Pick up the thread from one of
            the sections below, or tell us what you were trying to find.
          </p>

          <div
            className="enter-up mt-8 flex flex-wrap gap-3"
            style={{ animationDelay: '240ms' }}
          >
            <Button to="/" variant="green" className="group px-7 py-4 text-base">
              Back to Home
            </Button>
            <Link
              href="/contact"
              className="btn-shimmer inline-flex items-center gap-2 rounded-md border border-white/30 px-7 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/10"
            >
              Contact Windleaf
            </Link>
          </div>

          <div className="enter-up mt-12" style={{ animationDelay: '300ms' }}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
              Go to
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {NAV.filter((item) => item.to !== '/').map((item) => (
                <li key={item.to}>
                  <Link
                    href={item.to}
                    className="inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition-all hover:-translate-y-0.5 hover:border-teal/60 hover:bg-white/10 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
