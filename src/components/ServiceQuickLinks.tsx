'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { SERVICE_QUICKLINKS } from '@/content/site'

export default function ServiceQuickLinks() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return

    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(
      el.scrollLeft + el.clientWidth < el.scrollWidth - 2
    )
  }

  useEffect(() => {
    updateScrollState()

    const el = scrollRef.current
    if (!el) return

    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [])

  const scroll = (amount: number) => {
    scrollRef.current?.scrollBy({
      left: amount,
      behavior: 'smooth',
    })
  }

  return (
    <div className="grid min-w-0 grid-cols-[36px_minmax(0,1fr)_36px] items-center">
      {/* LEFT */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => scroll(-300)}
          disabled={!canScrollLeft}
          aria-label="Scroll services left"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-hairline bg-white text-navy shadow-sm transition hover:border-green hover:text-green active:scale-95 disabled:pointer-events-none disabled:opacity-30"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* SCROLL AREA */}
      <div
        ref={scrollRef}
        className="no-scrollbar flex min-w-0 snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth py-3"
      >
        {SERVICE_QUICKLINKS.map((link, i) => (
          <Link
            key={link.id}
            href={`/services#${link.id}`}
            style={{ animationDelay: `${i * 45}ms` }}
            className="enter-up shrink-0 snap-start whitespace-nowrap rounded-full border border-hairline px-3.5 py-1.5 text-xs font-medium text-navy/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-green hover:bg-green/8 hover:text-green hover:shadow-sm active:scale-95"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* RIGHT */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => scroll(300)}
          disabled={!canScrollRight}
          aria-label="Scroll services right"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-hairline bg-white text-navy shadow-sm transition hover:border-green hover:text-green active:scale-95 disabled:pointer-events-none disabled:opacity-30"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  )
}