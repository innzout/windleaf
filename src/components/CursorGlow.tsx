'use client'

import { useEffect, useRef } from 'react'

const OUTER_BASE = 'rounded-full blur-2xl transition-all duration-300'
const INNER_BASE =
  'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200'

const INTERACTIVE = 'button, a, input, select, textarea, .spotlight-card, [role="button"]'

/**
 * Soft glow that trails the cursor.
 *
 * Pointer position is written straight to the DOM inside a single rAF rather
 * than through React state — a `setState` per `mousemove` re-renders this
 * component 60-120 times a second and makes the whole page feel stuck.
 */
export function CursorGlow() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Desktop pointers only — no hover target on touch devices.
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let x = -200
    let y = -200
    let hovered = false
    let visible = false
    let lastHovered: boolean | null = null
    let frame = 0

    const draw = () => {
      frame = 0
      const wrap = wrapRef.current
      const outer = outerRef.current
      const inner = innerRef.current
      if (!wrap || !outer || !inner) return

      wrap.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      wrap.style.opacity = visible ? (hovered ? '0.75' : '0.45') : '0'

      // Only touch className when the hover state actually flips.
      if (hovered !== lastHovered) {
        lastHovered = hovered
        outer.className = `${OUTER_BASE} ${hovered ? 'h-64 w-64 bg-teal/20' : 'h-48 w-48 bg-teal/12'}`
        inner.className = `${INNER_BASE} ${hovered ? 'h-4 w-4 scale-125 bg-green/50' : 'h-2 w-2 bg-green/40'}`
      }
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw)
    }

    const onMove = (event: MouseEvent) => {
      x = event.clientX
      y = event.clientY
      visible = true
      const target = event.target as HTMLElement | null
      hovered = !!target?.closest(INTERACTIVE)
      schedule()
    }

    const onLeave = () => {
      visible = false
      schedule()
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.body.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.body.removeEventListener('mouseleave', onLeave)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed left-0 top-0 z-50 hidden transition-opacity duration-300 md:block"
      style={{ opacity: 0, willChange: 'transform, opacity' }}
      aria-hidden="true"
    >
      <div ref={outerRef} className={`${OUTER_BASE} h-48 w-48 bg-teal/12`} />
      <div ref={innerRef} className={`${INNER_BASE} h-2 w-2 bg-green/40`} />
    </div>
  )
}
