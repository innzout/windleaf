'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { TECH_FLOW } from '@/content/site'

/**
 * Scroll-driven version of the 01-06 flow.
 *
 * The spine "draws" itself as the section passes through the viewport and each
 * milestone lights up as the line reaches it, so the sequence reads as a
 * progression rather than six static cards.
 *
 * Progress is written to a CSS custom property inside one rAF per scroll burst;
 * only the small `activeCount` integer goes through React state, so scrolling
 * doesn't trigger a render per frame.
 */
export function TechFlowTimeline({
  icons,
  colours,
}: {
  icons: Record<string, ReactNode>
  /** One colour per step, shared with the compact flow on the home page. */
  colours: string[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const [activeCount, setActiveCount] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fillRef.current?.style.setProperty('height', '100%')
      setActiveCount(TECH_FLOW.length)
      return
    }

    let frame = 0
    let lastCount = -1

    const apply = () => {
      frame = 0
      const rect = container.getBoundingClientRect()
      // 0 when the section's top reaches 75% down the viewport,
      // 1 once its bottom passes 40% down.
      const start = window.innerHeight * 0.75
      const end = window.innerHeight * 0.4
      const travelled = start - rect.top
      const total = rect.height + (start - end)
      const progress = Math.min(1, Math.max(0, travelled / total))

      fillRef.current?.style.setProperty('height', `${progress * 100}%`)

      const count = Math.round(progress * TECH_FLOW.length + 0.25)
      const clamped = Math.min(TECH_FLOW.length, Math.max(0, count))
      if (clamped !== lastCount) {
        lastCount = clamped
        setActiveCount(clamped)
      }
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={containerRef} className="mx-auto max-w-3xl">
      {/* The spine is scoped to the list, not the whole component — anchoring
          it to the outer container made it run on past the last milestone and
          straight through the legend underneath. */}
      <div className="relative">
        {/* Dotted track + the portion that has been "drawn" */}
        {/* A single fine solid rule in the node colour. Dotted read as a
            dashed barrier cutting the layout in half; solid reads as one
            continuous thread joining the milestones. */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 top-0 w-[2px] -translate-x-1/2 rounded-full"
          style={{ backgroundColor: 'rgba(0,194,168,0.22)' }}
        />
        <div
          ref={fillRef}
          aria-hidden="true"
          className="absolute left-1/2 top-0 w-[2px] -translate-x-1/2 rounded-full transition-[height] duration-150 ease-out"
          style={{ height: '0%', backgroundColor: '#00c2a8' }}
        />

        <ol className="relative flex flex-col gap-0">
        {TECH_FLOW.map((step, i) => {
          const isVerify = step.kind === 'verify'
          const isRight = i % 2 === 0
          const active = i < activeCount
          const colour = colours[i] ?? '#00c2a8'

          return (
            <li
              key={step.num}
              className={`relative flex items-center ${isRight ? 'flex-row' : 'flex-row-reverse'}`}
              style={{ minHeight: 152 }}
            >
              {/* Card */}
              <div
                className={`w-[calc(50%-2.5rem)] transition-all duration-700 ease-out ${
                  isRight ? 'pr-6 text-right' : 'pl-6 text-left'
                }`}
                style={{
                  opacity: active ? 1 : 0,
                  transform: active
                    ? 'translateX(0) translateY(0)'
                    : `translateX(${isRight ? '-24px' : '24px'}) translateY(8px)`,
                }}
              >
                {/* The step number sits inside the card as a small eyebrow.
                    As an oversized watermark it outweighed the titles — "01"
                    read louder than "Blade". */}
                <div
                  className={`inline-block max-w-[19rem] rounded-2xl border bg-white px-6 py-5 transition-all duration-500 ${
                    active
                      ? isVerify
                        ? 'border-navy/15 shadow-lg shadow-navy/10'
                        : 'border-teal/25 shadow-lg shadow-teal/10'
                      : 'border-hairline shadow-sm'
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 ${isRight ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isRight && (
                      <span
                        className="h-px w-5 transition-colors duration-500"
                        style={{ backgroundColor: active ? colour : '#d3dbe0' }}
                      />
                    )}
                    <span
                      className="font-display text-[11px] font-bold tracking-[0.22em] transition-colors duration-500"
                      style={{ color: active ? colour : 'rgba(38,52,58,0.35)' }}
                    >
                      {step.num}
                    </span>
                    {isRight && (
                      <span
                        className="h-px w-5 transition-colors duration-500"
                        style={{ backgroundColor: active ? colour : '#d3dbe0' }}
                      />
                    )}
                  </div>

                  <p className="mt-2.5 font-display text-lg font-semibold leading-snug text-navy">
                    {step.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{step.body}</p>
                </div>
              </div>

              {/* Centre node */}
              <div className="relative z-10 flex h-20 w-20 shrink-0 items-center justify-center">
                {/* Opaque disc so the dotted thread stops cleanly at the node
                    instead of running right up against the icon. */}
                <span
                  aria-hidden="true"
                  className="absolute h-[70px] w-[70px] rounded-full bg-white"
                />
                {/* Halo pulses only for the step the line has just reached */}
                <span
                  aria-hidden="true"
                  className={`absolute h-14 w-14 rounded-full transition-all duration-500 ${
                    active && i === activeCount - 1 ? 'animate-ping' : 'scale-50'
                  }`}
                  style={{
                    backgroundColor: active && i === activeCount - 1 ? `${colour}4d` : 'transparent',
                  }}
                />
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition-all duration-500 ${
                    active ? 'scale-100 text-white' : 'scale-90 bg-white text-charcoal/25'
                  }`}
                  style={
                    active
                      ? { backgroundColor: colour, boxShadow: `0 0 0 4px ${colour}33` }
                      : { boxShadow: '0 0 0 4px #e5e7eb' }
                  }
                >
                  {icons[step.num]}
                </div>
              </div>

              <div className="w-[calc(50%-2.5rem)]" />
            </li>
          )
        })}
        </ol>
      </div>

      {/* Phase legend — outside the spine wrapper, so the line stops at the
          last milestone instead of running down between these pills. */}
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-teal">
          <span className="h-2 w-2 rounded-full bg-teal" />
          Technology captures &amp; analyses
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-navy/20 bg-navy/6 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-navy">
          <span className="h-2 w-2 rounded-full bg-navy" />
          Engineers verify &amp; decide
        </span>
      </div>
    </div>
  )
}
