import type { ReactNode } from 'react'
import Image from 'next/image'
import { Button, BladeMotif, Eyebrow } from './ui'

/** Standard interior page hero with the silver blade motif. */
export function PageHero({
  eyebrow,
  title,
  sub,
  children,
  bgImg,
}: {
  eyebrow?: string
  title: ReactNode
  sub?: ReactNode
  children?: ReactNode
  bgImg?: string
}) {
  return (
    <section className="relative overflow-hidden  text-white">
      {bgImg ? (
        <Image
          src={bgImg}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          // Every hero photograph places its subject right of centre (so the
          // copy doesn't cover it). On a phone the frame is far narrower than
          // the image, and a centred crop throws that subject away — so bias
          // the crop right until there is room for the full composition.
          className="pointer-events-none object-cover object-[72%_center] sm:object-[62%_center] lg:object-center"
        />
      ) : (
        <div className="pointer-events-none absolute -right-24 -top-16 h-[420px] w-[420px] opacity-40 md:opacity-60">
          <BladeMotif className="h-full w-full animate-[spin_60s_linear_infinite]" />
        </div>
      )}
      {/* Mobile: the copy spans the full width, so the scrim has to run bottom
          -to-top rather than left-to-right or the text sits on open photo. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy via-navy/82 to-navy/58 sm:hidden" />
      {/* Tablet and up: opaque behind the copy on the left, opening up sharply
          so the photograph stays clear on the right rather than washing out. */}
      <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-navy via-navy/78 to-navy/25 sm:block" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy/50 to-transparent" />
      <div className="relative mx-auto w-full max-w-7xl px-6 py-20 md:py-28 lg:px-10">
        <div className="max-w-3xl">
          {/* CSS entrance, not .reveal-* — this is above the fold, so it must
              not wait for the observer to hydrate. */}
          {eyebrow && (
            <span className="enter-left inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-leaf">
              <span className="h-px w-6 bg-leaf" />
              {eyebrow}
            </span>
          )}
          <h1
            className="enter-up mt-5 text-4xl font-semibold leading-[1.08] text-balance !text-white sm:text-5xl md:text-6xl"
            style={{ animationDelay: '60ms' }}
          >
            {title}
          </h1>
          {sub && (
            <p
              className="enter-up mt-6 max-w-2xl text-lg leading-relaxed text-white/75"
              style={{ animationDelay: '150ms' }}
            >
              {sub}
            </p>
          )}
          {children && (
            <div className="enter-up mt-8 flex flex-wrap gap-3" style={{ animationDelay: '230ms' }}>
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/** Closing call-to-action band. */
export function ClosingCTA({
  eyebrow = 'Get Started',
  title,
  text,
  buttonLabel,
  to = '/contact',
  tone = 'navy',
}: {
  eyebrow?: string
  title: string
  text?: string
  buttonLabel: string
  to?: string
  tone?: 'navy' | 'gradient'
}) {
  return (
    <section className={tone === 'navy' ? 'bg-navy' : 'brand-gradient'}>
      <div className="mx-auto w-full max-w-7xl px-6 py-20 md:py-24 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold text-balance !text-white sm:text-4xl">
              {title}
            </h2>
            {text && <p className="mt-4 text-lg text-white/75">{text}</p>}
          </div>
          <Button to={to} variant="green" className="group shrink-0 px-7 py-4 text-base">
            {buttonLabel}
          </Button>
        </div>
      </div>
    </section>
  )
}
