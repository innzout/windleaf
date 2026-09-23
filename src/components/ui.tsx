import type { ReactNode } from 'react'
import Link from 'next/link'

type ButtonProps = {
  to?: string
  href?: string
  children: ReactNode
  variant?: 'primary' | 'green' | 'ghost' | 'outline'
  className?: string
  type?: 'button' | 'submit'
}

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold tracking-tight transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2'

const variants = {
  primary:
    'bg-navy text-white hover:bg-green shadow-sm hover:shadow-xl hover:shadow-navy/20 hover:-translate-y-1 active:scale-[0.98] btn-shimmer',
  green:
    'bg-green text-white hover:bg-forest shadow-sm hover:shadow-xl hover:shadow-green/35 hover:-translate-y-1 active:scale-[0.98] btn-shimmer',
  outline:
    'border border-navy/25 text-navy hover:border-green hover:text-green hover:shadow-lg hover:shadow-navy/5 hover:-translate-y-0.5 active:scale-[0.98] bg-white',
  ghost: 'text-navy hover:text-green hover:bg-teal/8 transition-colors active:scale-[0.98]',
}

export function Button({
  to,
  href,
  children,
  variant = 'primary',
  className = '',
  type = 'button',
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`
  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <Arrow />
    </>
  )
  if (to) {
    return (
      <Link href={to} className={cls}>
        {inner}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    )
  }
  return (
    <button type={type} className={cls}>
      {inner}
    </button>
  )
}

function Arrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="relative z-10 transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-hover:scale-110"
      aria-hidden="true"
    >
      <path
        d="M3 8h9M8 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-green">
      <span className="h-px w-6 bg-green" />
      {children}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = 'left',
  light = false,
}: {
  eyebrow?: string
  title: string
  sub?: string
  align?: 'left' | 'center'
  light?: boolean
}) {
  return (
    <div className={`${align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        className={`mt-4 text-4xl font-semibold text-balance sm:text-5xl md:text-[52px] md:leading-[1.06] ${
          light ? '!text-white' : ''
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={`mt-5 text-xl leading-relaxed md:text-[22px] md:leading-[1.55] ${
            light ? 'text-white/75' : 'text-charcoal/75'
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  )
}

export function Section({
  children,
  className = '',
  tone = 'white',
  id,
}: {
  children: ReactNode
  className?: string
  tone?: 'white' | 'mist' | 'navy'
  id?: string
}) {
  const tones = {
    white: 'bg-white',
    mist: 'bg-mist',
    navy: 'bg-navy text-white',
  }
  return (
    <section id={id} className={`${tones[tone]} py-20 md:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">{children}</div>
    </section>
  )
}

/** Silver aerodynamic blade motif used in heroes. */
export function BladeMotif({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="blade-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#DCE3E6" />
          <stop offset="0.6" stopColor="#AEB9BE" />
          <stop offset="1" stopColor="#8FC65A" />
        </linearGradient>
        <linearGradient id="blade-b" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#E8EDF0" />
          <stop offset="1" stopColor="#AEB9BE" />
        </linearGradient>
      </defs>
      <g transform="translate(200 200)">
        {[0, 120, 240].map((deg, i) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <path
              d="M0 0 C 40 -10 150 -34 176 -150 C 120 -120 30 -60 0 0 Z"
              fill={i === 0 ? 'url(#blade-a)' : 'url(#blade-b)'}
              opacity={i === 0 ? 1 : 0.85}
            />
          </g>
        ))}
        <circle r="20" fill="#102A35" />
        <circle r="8" fill="#4F9F3A" />
      </g>
    </svg>
  )
}
