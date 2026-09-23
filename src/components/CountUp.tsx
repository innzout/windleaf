'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Counts a stat up from zero the first time it scrolls into view.
 *
 * Accepts the display string straight from content (`"17+"`, `"11"`), so any
 * prefix/suffix is preserved and only the numeric part animates. Falls back to
 * the final value immediately when motion is reduced.
 */
export function CountUp({
  value,
  duration = 1400,
  className = '',
}: {
  value: string
  duration?: number
  className?: string
}) {
  const match = value.match(/^(\D*)(\d+)(.*)$/)
  const prefix = match?.[1] ?? ''
  const target = match ? Number(match[2]) : 0
  const suffix = match?.[3] ?? ''
  // `match` is a fresh array on every render, so it must never reach the
  // effect's dependency array — doing so tears the animation down and restarts
  // it on each frame's re-render, leaving the counter stuck near zero.
  const isNumeric = match !== null

  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isNumeric) return
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(target)
      return
    }

    let frame = 0
    let start = 0

    const tick = (now: number) => {
      if (!start) start = now
      const t = Math.min(1, (now - start) / duration)
      // easeOutExpo — fast out of the gate, gentle settle on the final number.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setDisplay(Math.round(eased * target))
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
    // Primitives only — see the note on `isNumeric` above.
  }, [isNumeric, target, duration])

  // Non-numeric values render untouched.
  if (!isNumeric) return <span className={className}>{value}</span>

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
