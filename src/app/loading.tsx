/**
 * Route-level loading skeleton.
 *
 * Shown by the App Router while a segment streams in. Mirrors the shape every
 * page shares — a navy hero band then a content section — so the transition
 * reads as the page arriving rather than the layout jumping.
 */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading page…</span>

      {/* Hero band */}
      <section className="relative overflow-hidden bg-navy">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 md:py-28 lg:px-10">
          <div className="max-w-3xl">
            <Shimmer className="h-3 w-44 rounded-full bg-leaf/25" />
            <Shimmer className="mt-6 h-11 w-full rounded-lg bg-white/15" delay={80} />
            <Shimmer className="mt-3 h-11 w-4/5 rounded-lg bg-white/15" delay={140} />
            <Shimmer className="mt-6 h-4 w-2/3 rounded bg-white/10" delay={200} />
            <Shimmer className="mt-2.5 h-4 w-1/2 rounded bg-white/10" delay={240} />
            <Shimmer className="mt-8 h-12 w-52 rounded-md bg-green/30" delay={300} />
          </div>
        </div>
      </section>

      {/* Content band */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <Shimmer className="h-3 w-32 rounded-full bg-green/25" />
          <Shimmer className="mt-5 h-9 w-2/3 rounded-lg bg-charcoal/10" delay={80} />
          <Shimmer className="mt-4 h-5 w-1/2 rounded bg-charcoal/8" delay={120} />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl border border-hairline bg-mist p-8">
                <Shimmer className="h-11 w-11 rounded-lg bg-navy/15" delay={i * 120} />
                <Shimmer className="mt-5 h-6 w-3/4 rounded bg-charcoal/12" delay={i * 120 + 60} />
                <Shimmer className="mt-4 h-4 w-full rounded bg-charcoal/8" delay={i * 120 + 100} />
                <Shimmer className="mt-2.5 h-4 w-5/6 rounded bg-charcoal/8" delay={i * 120 + 130} />
                <Shimmer className="mt-2.5 h-4 w-2/3 rounded bg-charcoal/8" delay={i * 120 + 160} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function Shimmer({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div
      className={`skeleton-pulse ${className}`}
      style={{ animationDelay: `${delay}ms` }}
      aria-hidden="true"
    />
  )
}
