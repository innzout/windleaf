'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV, COUNTRY_COUNT } from '@/content/site'
import { Logo } from '@/components/Logo'

/* ─── Desktop nav link ──────────────────────────────────────────── */
function NavLink({ label, to, active }: { label: string; to: string; active: boolean }) {
  return (
    <Link
      href={to}
      className={`group relative rounded-lg px-3.5 py-2 text-sm font-semibold transition-all duration-300 ${
        active ? 'bg-teal/10 text-teal' : 'text-navy/80 hover:bg-teal/8 hover:text-teal'
      }`}
    >
      <span className="relative z-10">{label}</span>
      <span
        className={`absolute bottom-1 left-3 right-3 h-[2px] rounded-full bg-teal transition-all duration-300 ${
          active
            ? 'scale-x-100 opacity-100'
            : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
        }`}
      />
    </Link>
  )
}

/* ─── Animated hamburger ────────────────────────────────────────── */
function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex h-5 w-6 flex-col items-stretch justify-between">
      <span
        className={`h-[2px] w-full rounded-full bg-current transition-all duration-300 ${open ? 'translate-y-[9px] rotate-45' : ''}`}
      />
      <span
        className={`h-[2px] w-full rounded-full bg-current transition-all duration-300 ${open ? 'scale-x-0 opacity-0' : ''}`}
      />
      <span
        className={`h-[2px] w-full rounded-full bg-current transition-all duration-300 ${open ? '-translate-y-[9px] -rotate-45' : ''}`}
      />
    </span>
  )
}

/* ─── Full-screen mobile menu ───────────────────────────────────── */
function MobileMenu({
  open,
  path,
  onClose,
}: {
  open: boolean
  path: string
  onClose: () => void
}) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 flex flex-col transition-all duration-500 lg:hidden ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{
        background: 'linear-gradient(135deg, #052f45 0%, #063a52 60%, #031e2e 100%)',
        opacity: open ? 1 : 0,
        transform: open ? 'none' : 'translateY(-16px)',
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-5">
        <Logo onDark />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-teal hover:text-teal"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 2l12 12M14 2L2 14"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="mx-6 h-px bg-white/10" />

      {/* Nav items */}
      <nav className="flex flex-1 flex-col justify-center gap-1 px-8 py-6">
        {NAV.map((item, i) => {
          const isActive = path === item.to
          return (
            <Link
              key={item.to}
              href={item.to}
              onClick={onClose}
              className={`group flex items-center gap-5 rounded-xl px-4 py-4 transition-all duration-200 ${
                isActive ? 'bg-white/8' : 'hover:bg-white/5'
              }`}
              style={{
                transform: open ? 'none' : 'translateX(-20px)',
                opacity: open ? 1 : 0,
                transition: `transform 0.4s ease ${i * 45}ms, opacity 0.4s ease ${i * 45}ms, background 0.2s`,
              }}
            >
              <span
                className={`font-display text-xs font-bold tracking-[0.2em] ${isActive ? 'text-teal' : 'text-white/30'}`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`font-display text-2xl font-semibold tracking-tight ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`}
              >
                {item.label}
              </span>
              {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-teal" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom CTA */}
      <div className="px-8 pb-10">
        <div className="mb-6 h-px bg-white/10" />
        <Link
          href="/contact"
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal px-6 py-4 font-display text-base font-semibold text-white shadow-lg transition-all hover:bg-sky active:scale-95"
        >
          Discuss Your Project
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h9M8 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <p className="mt-4 text-center text-xs text-white/30">
          Independent Blade Engineering · {COUNTRY_COUNT} Countries
        </p>
      </div>
    </div>
  )
}

/* ─── Header ────────────────────────────────────────────────────── */
export function Header() {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [path])

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'border-b border-hairline/80 bg-white/90 py-0 shadow-md shadow-navy/5 backdrop-blur-md'
            : 'border-b border-hairline bg-white py-0.5'
        }`}
      >
        <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between px-6 lg:px-10">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.filter((n) => n.to !== '/').map((item) => (
              <NavLink key={item.to} label={item.label} to={item.to} active={path === item.to} />
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Link
              href="/contact"
              className="btn-shimmer group inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal hover:shadow-lg hover:shadow-navy/20 active:scale-95"
            >
              <span className="relative z-10">Discuss Your Project</span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 14 14"
                fill="none"
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5"
              >
                <path
                  d="M2 7h9M7 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-navy transition-colors hover:bg-teal/10 hover:text-teal lg:hidden"
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </header>

      <MobileMenu open={open} path={path} onClose={() => setOpen(false)} />
    </>
  )
}
