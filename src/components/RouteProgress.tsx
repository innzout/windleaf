'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Top-of-page progress bar for route navigation.
 *
 * The App Router exposes no navigation events, so this starts on a click of an
 * internal link and completes when `usePathname` reports the new route. While
 * pending it eases asymptotically towards 90% — it never claims to know the
 * remaining time, it just shows the request is alive.
 *
 * Sits above `ScrollProgress` and only renders while navigating, so the two
 * bars never fight for the same strip.
 */
export function RouteProgress() {
  const pathname = usePathname()
  const [active, setActive] = useState(false)
  const [value, setValue] = useState(0)
  const settled = useRef(pathname)

  // Start when an internal link is clicked.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = (event.target as HTMLElement | null)?.closest?.('a')
      if (!anchor) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#')) return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      // Same page, or only a hash change — no navigation to report.
      if (url.pathname === window.location.pathname) return

      setActive(true)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  // Creep forward while the navigation is in flight.
  useEffect(() => {
    if (!active) return
    setValue(10)
    const id = window.setInterval(() => {
      setValue((v) => v + (90 - v) * 0.16)
    }, 160)
    return () => window.clearInterval(id)
  }, [active])

  // Complete once the route actually changes.
  useEffect(() => {
    if (pathname === settled.current) return
    settled.current = pathname
    if (!active) return

    setValue(100)
    const id = window.setTimeout(() => {
      setActive(false)
      setValue(0)
    }, 350)
    return () => window.clearTimeout(id)
  }, [pathname, active])

  if (!active) return null

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-[3px]"
      role="progressbar"
      aria-label="Loading page"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
    >
      <div
        className="h-full bg-gradient-to-r from-teal via-green to-leaf shadow-[0_0_12px_rgba(0,194,168,0.8)] transition-[width,opacity] duration-300 ease-out"
        style={{ width: `${value}%`, opacity: value >= 100 ? 0 : 1 }}
      />
    </div>
  )
}
