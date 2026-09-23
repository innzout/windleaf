'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

type ScrollRailProps = {
  children: ReactNode
  /** How far one arrow press travels. Give roughly one card width. */
  step?: number
  /** Accessible description, e.g. "project examples". */
  label: string
  className?: string
  itemsClassName?: string
}

/**
 * Horizontal rail with arrow controls, snap points and edge fades.
 *
 * Shared by the service chip rail and the project cards so both behave
 * identically — arrows that disable at each end, a fade that only appears on
 * the side there is more content, and native touch scrolling underneath.
 * The arrows are additive: they are a pointer affordance, and removing them
 * would still leave a fully usable rail for touch and keyboard.
 */
export function ScrollRail({
  children,
  step = 360,
  label,
  className = '',
  itemsClassName = '',
}: ScrollRailProps) {
  const railRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const sync = useCallback(() => {
    const el = railRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 2)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2)
  }, [])

  useEffect(() => {
    const el = railRef.current
    if (!el) return
    sync()

    el.addEventListener('scroll', sync, { passive: true })
    // Content can reflow without the window resizing — a font landing, an
    // image settling — and then the arrows would lie about what is reachable.
    const observer = new ResizeObserver(sync)
    observer.observe(el)
    for (const child of Array.from(el.children)) observer.observe(child)

    return () => {
      el.removeEventListener('scroll', sync)
      observer.disconnect()
    }
  }, [sync])

  const nudge = (amount: number) =>
    railRef.current?.scrollBy({ left: amount, behavior: 'smooth' })

  // ── Drag to scroll ──────────────────────────────────────────────
  // Touch already swipes natively, and this must not interfere with that — so
  // it binds only for `mouse`. Grabbing a touch pointer here would replace the
  // browser's momentum scrolling with a worse hand-written version.
  const drag = useRef<{ startX: number; startLeft: number; moved: number } | null>(null)
  const [dragging, setDragging] = useState(false)

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || !railRef.current) return
    drag.current = { startX: event.clientX, startLeft: railRef.current.scrollLeft, moved: 0 }
    setDragging(true)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current
    if (!state || !railRef.current) return
    const dx = event.clientX - state.startX
    state.moved = Math.max(state.moved, Math.abs(dx))
    railRef.current.scrollLeft = state.startLeft - dx
  }

  // `pointerup` fires before `click`, so the drag state is already gone by the
  // time the click arrives — this flag is what carries the decision across.
  const suppressClick = useRef(false)

  const endDrag = () => {
    if (!drag.current) return
    // A drag that crossed a card would otherwise fire that card's click on
    // release. Anything past a few pixels was a scroll, not a tap.
    suppressClick.current = drag.current.moved > 5
    drag.current = null
    setDragging(false)
  }

  const rail = (
    <>
      <div
        ref={railRef}
        role="group"
        aria-label={label}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={(event) => {
          if (!suppressClick.current) return
          suppressClick.current = false
          event.preventDefault()
          event.stopPropagation()
        }}
        className={`no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green ${
          // `scroll-smooth` has to come off while dragging: it would ease
          // towards each scrollLeft we set and lag behind the cursor.
          dragging ? 'cursor-grabbing select-none' : 'cursor-grab scroll-smooth'
        } ${itemsClassName}`}
      >
        {children}
      </div>

      {/* No edge fades here, deliberately. A 48px white gradient over a white
          page is invisible in itself — what it actually does is erase the
          border and label of the chip underneath it, which reads as a white box
          eating the edge of the rail. That washing-out was the point when this
          was an auto-scrolling marquee and content streamed past; with arrows
          either side and a rail the reader controls, it only hides things. */}

    </>
  )

  const left = (
    <RailButton
      direction="left"
      disabled={!canLeft}
      label={`Scroll ${label} left`}
      onClick={() => nudge(-step)}
    />
  )
  const right = (
    <RailButton
      direction="right"
      disabled={!canRight}
      label={`Scroll ${label} right`}
      onClick={() => nudge(step)}
    />
  )

  const scrollable = canLeft || canRight

  return (
    <div className={`grid min-w-0 grid-cols-[36px_minmax(0,1fr)_36px] items-center ${className}`}>
      {/* The two 36px columns stay reserved whether or not there is anything to
          scroll, so the rail does not jump sideways the moment its content
          starts overflowing — which happens on resize. Only the buttons
          themselves come and go; permanently greyed-out arrows read as broken
          rather than as "nothing to scroll". */}
      <div className="flex justify-center">{scrollable && left}</div>
      <div className="relative min-w-0">{rail}</div>
      <div className="flex justify-center">{scrollable && right}</div>
    </div>
  )
}

function RailButton({
  direction,
  disabled,
  label,
  onClick,
}: {
  direction: 'left' | 'right'
  disabled: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-white text-navy shadow-sm transition hover:border-green hover:text-green active:scale-95 disabled:pointer-events-none disabled:opacity-30"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <path d={direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
      </svg>
    </button>
  )
}
