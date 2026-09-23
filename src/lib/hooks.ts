'use client'

import { useEffect, useState } from 'react'

/** Tracks scroll progress percentage and scroll position. */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    // Cached so the scroll handler never reads `scrollHeight`, which would
    // force a synchronous layout on every scroll event.
    let scrollable = 0
    let frame = 0

    const measure = () => {
      scrollable = document.documentElement.scrollHeight - window.innerHeight
    }

    const apply = () => {
      frame = 0
      const scrollY = window.scrollY
      const pct = scrollable > 0 ? (scrollY / scrollable) * 100 : 0
      setProgress(Math.min(100, Math.max(0, pct)))
      setIsScrolled(scrollY > 300)
    }

    // Coalesce bursts of scroll events into one update per frame.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply)
    }

    const onResize = () => {
      measure()
      onScroll()
    }

    measure()
    apply()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    // Lazy images and fonts change page height after first paint.
    const observer = new ResizeObserver(measure)
    observer.observe(document.documentElement)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return { progress, isScrolled, scrollToTop }
}

/** True when the user has asked the OS to minimise animation. */
export function usePrefersReducedMotion() {
  // Read synchronously on first render so animation-heavy children are built
  // once with the right setting rather than rebuilt after an effect.
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return reduced
}
