'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { COUNTRIES, type Country, type Region } from '@/content/site'
import { usePrefersReducedMotion } from '@/lib/hooks'
import { Flag } from '@/components/Flag'
import { ScrollRail } from '@/components/ScrollRail'
import { GlobeScene, GLOBE_RADIUS } from './globe-scene'
import type { DotData } from './land-dots'
import type { GlobeWorkerResponse } from './globe.worker'
import { GlobeLoaderInner, stageValue, type GlobeStage } from './GlobeLoader'

/** Fallback for environments where a Worker can't be created. */
async function generateOnMainThread(count: number, install: (data: DotData) => void) {
  const { generateLandDots } = await import('./land-dots')
  install(generateLandDots(count, GLOBE_RADIUS))
}

type RegionFilter = 'All' | Region

const REGIONS: RegionFilter[] = [
  'All',
  'Asia-Pacific',
  'Europe',
  'Americas',
  'Middle East & Africa',
]

export type GlobeProps = {
  /** `hero` is chrome-free ambient motion; `interactive` adds the full HUD. */
  variant?: 'hero' | 'interactive'
  className?: string
}

export function Globe({ variant = 'interactive', className = '' }: GlobeProps) {
  if (variant === 'hero') return <HeroGlobe className={className} />
  return <InteractiveGlobe className={className} />
}

/**
 * How far the element has come towards being *fully* inside the viewport:
 * `progress` runs 0 → 1, and `fully` latches true at the end.
 *
 * The globe starts loading 500px early, so being merely ready is not the right
 * moment to show it — the fade would run while half the sphere is still below
 * the fold, and you would scroll into an animation already finishing.
 *
 * `progress` exists because the three build stages finish in a fraction of a
 * second: gate only on the boolean and the bar shoots to 100% and then sits
 * there doing nothing for the whole scroll. Driving the last stretch of the bar
 * from this instead means it fills as you scroll and completes at the exact
 * moment the globe appears.
 *
 * `ratio >= 1` alone is not safe: an element taller than the viewport can never
 * reach it, and the loader would hang forever. The target is therefore how much
 * of the element *could* be on screen at once.
 */
function useFullyInView(ref: React.RefObject<HTMLElement | null>) {
  const [state, setState] = useState({ fully: false, progress: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setState({ fully: true, progress: 1 })
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const height = entry.boundingClientRect.height || 1
        const target = Math.min(1, window.innerHeight / height) * 0.97
        const progress = Math.min(1, entry.intersectionRatio / target)

        if (progress < 1) {
          // Never walk backwards. Scrolling up past the globe would otherwise
          // drain a bar that has already been filling.
          setState((prev) => (prev.fully ? prev : { fully: false, progress: Math.max(prev.progress, progress) }))
          return
        }
        observer.disconnect()
        setState({ fully: true, progress: 1 })
      },
      // A dense ladder, not a single value: the trigger point is computed at
      // callback time, and the bar needs updating continuously on the way up.
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return state
}

/* ─── Shared WebGL canvas ───────────────────────────────────────── */

type CanvasProps = {
  dotDensity: number
  onHover?: (country: Country | null) => void
  onSelect?: (country: Country) => void
  sceneRef?: (scene: GlobeScene | null) => void
  className?: string
}

function GlobeCanvas({ dotDensity, onHover, onSelect, sceneRef, className = '' }: CanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [stage, setStage] = useState<GlobeStage>('initialising')
  const reducedMotion = usePrefersReducedMotion()

  // Two conditions, both required. `ready` is "the scene exists"; this is "you
  // can actually see it". The WebGL work still happens early — that 350ms of
  // context creation and shader compilation must stay out of page load — only
  // the reveal waits.
  const { fully: fullyInView, progress: viewProgress } = useFullyInView(mountRef)
  const revealed = ready && fullyInView

  // Keep the latest callbacks reachable without re-creating the scene.
  const hoverRef = useRef(onHover)
  const selectRef = useRef(onSelect)
  hoverRef.current = onHover
  selectRef.current = onSelect

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    let scene: GlobeScene | null = null
    try {
      scene = new GlobeScene(container, {
        countries: COUNTRIES,
        reducedMotion,
        onHover: (country) => hoverRef.current?.(country),
        onSelect: (country) => selectRef.current?.(country),
      })
      sceneRef?.(scene)
    } catch (error) {
      console.error('Globe: WebGL initialisation failed', error)
      setFailed(true)
      return
    }

    // Phones get a sparser cloud; the sphere is physically smaller there, so
    // the density reads the same while the buffers stay much lighter.
    const density = window.innerWidth < 768 ? Math.round(dotDensity * 0.45) : dotDensity

    let worker: Worker | null = null
    let cancelled = false

    setStage('generating')

    const install = (data: DotData) => {
      if (cancelled) return
      scene?.applyDots(data)
      setStage('ready')
      setReady(true)
    }

    // Generating the dot cloud is the expensive step — keep it off the main
    // thread so mounting the globe doesn't stall scrolling or input.
    try {
      worker = new Worker(new URL('./globe.worker.ts', import.meta.url))
      worker.onmessage = (event: MessageEvent<GlobeWorkerResponse>) => {
        install(event.data)
        worker?.terminate()
        worker = null
      }
      worker.onerror = () => {
        worker?.terminate()
        worker = null
        void generateOnMainThread(density, install)
      }
      worker.postMessage({ count: density, radius: GLOBE_RADIUS })
    } catch {
      // Workers unavailable (very old browser, or a strict CSP) — still works,
      // just with the original main-thread cost.
      void generateOnMainThread(density, install)
    }

    return () => {
      cancelled = true
      worker?.terminate()
      sceneRef?.(null)
      scene?.dispose()
    }
    // `sceneRef` is a stable setter from the parent; the scene is rebuilt only
    // when the rendering inputs themselves change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dotDensity, reducedMotion])

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center px-8 text-center text-sm text-white/55 ${className}`}
      >
        Interactive globe unavailable — your browser or device does not support WebGL. Windleaf
        delivers projects across {COUNTRIES.length} countries worldwide.
      </div>
    )
  }

  return (
    <>
      <div
        ref={mountRef}
        className={`h-full w-full cursor-grab transition-opacity duration-1000 active:cursor-grabbing ${
          revealed ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        aria-label="Interactive 3D globe of Windleaf project locations. Drag to rotate."
        role="img"
      />
      {!revealed && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          {/* Once the scene is built, the remaining stretch of the bar is driven
              by the scroll rather than by work — so it keeps filling instead of
              parking at 100%, and lands on 100% as the globe appears. */}
          <GlobeLoaderInner
            stage={ready ? 'ready' : stage}
            // Building owns the first 55% of the bar, scrolling into view the
            // rest. The split is deliberately lopsided against the work: the
            // build finishes in well under a second, so giving it the whole bar
            // meant it filled instantly and then inched. Both halves are
            // monotonic, and the handover at `ready` moves forwards.
            value={ready ? 55 + 45 * viewProgress : stageValue(stage) * 0.55}
            label={ready ? 'Bringing into view' : undefined}
          />
        </div>
      )}
    </>
  )
}

/* ─── Hero variant ──────────────────────────────────────────────── */

function HeroGlobe({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`} /* positions the loader overlay */>
      {/* Ambient backlight behind the sphere */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(0,194,168,0.22) 0%, rgba(5,47,69,0) 62%)',
        }}
      />
      <GlobeCanvas dotDensity={18000} />
    </div>
  )
}

/* ─── Interactive variant ───────────────────────────────────────── */

function InteractiveGlobe({ className = '' }: { className?: string }) {
  const sceneRef = useRef<GlobeScene | null>(null)
  const [activeCountry, setActiveCountry] = useState<Country>(
    () => COUNTRIES.find((c) => c.isHq) ?? COUNTRIES[0],
  )
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null)
  const [region, setRegion] = useState<RegionFilter>('All')
  const [autoRotate, setAutoRotate] = useState(true)
  const [showArcs, setShowArcs] = useState(true)

  const attachScene = useCallback((scene: GlobeScene | null) => {
    sceneRef.current = scene
  }, [])

  const focus = useCallback((country: Country) => {
    setActiveCountry(country)
    setAutoRotate(false)
    sceneRef.current?.focusCountry(country)
  }, [])

  // Hovering a dock chip previews the matching beacon on the globe.
  const preview = useCallback((country: Country | null) => {
    setHoveredCountry(country)
    sceneRef.current?.setHovered(country)
  }, [])

  useEffect(() => {
    sceneRef.current?.setAutoRotate(autoRotate)
  }, [autoRotate])

  useEffect(() => {
    sceneRef.current?.setArcsVisible(showArcs)
  }, [showArcs])

  const filtered = useMemo(
    () => (region === 'All' ? COUNTRIES : COUNTRIES.filter((c) => c.region === region)),
    [region],
  )

  const display = hoveredCountry ?? activeCountry
  // True when the panel is showing a hover preview rather than the pinned pick.
  const isPreview = hoveredCountry !== null && hoveredCountry.name !== activeCountry.name

  return (
    <div className={`w-full select-none ${className}`}>
      {/* ── Command bar ─────────────────────────────────────────── */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-hairline/80 bg-white p-1 shadow-sm">
          {REGIONS.map((item) => {
            const count =
              item === 'All'
                ? COUNTRIES.length
                : COUNTRIES.filter((c) => c.region === item).length
            const selected = region === item
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setRegion(item)
                  const first = COUNTRIES.find((c) => (item === 'All' ? c.isHq : c.region === item))
                  if (first) focus(first)
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  selected
                    ? 'bg-navy text-white shadow-sm'
                    : 'text-charcoal/70 hover:bg-mist hover:text-navy'
                }`}
              >
                <span>{item}</span>
                <span
                  className={`rounded-full px-1.5 text-[10px] ${
                    selected ? 'bg-white/20 text-white' : 'bg-charcoal/10 text-charcoal/60'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoRotate((value) => !value)}
            aria-pressed={autoRotate}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
              autoRotate
                ? 'border-teal/40 bg-teal/10 text-teal'
                : 'border-hairline bg-white text-charcoal/60 hover:text-navy'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${autoRotate ? 'animate-pulse bg-teal' : 'bg-charcoal/40'}`}
            />
            <span>{autoRotate ? 'Auto-Spin' : 'Paused'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowArcs((value) => !value)}
            aria-pressed={showArcs}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
              showArcs
                ? 'border-green/40 bg-green/10 text-forest'
                : 'border-hairline bg-white text-charcoal/60 hover:text-navy'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${showArcs ? 'animate-pulse bg-green' : 'bg-charcoal/40'}`}
            />
            <span>Project Routes</span>
          </button>
        </div>
      </div>

      <div className="relative">
      {/* ── WebGL viewport ──────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden rounded-3xl border border-navy/20 shadow-2xl"
        style={{
          aspectRatio: '16/9',
          minHeight: '460px',
          maxHeight: '640px',
          background:
            'radial-gradient(circle at 50% 45%, #0a3348 0%, #051f2e 55%, #020d16 100%)',
        }}
      >
        <GlobeCanvas
          dotDensity={26000}
          sceneRef={attachScene}
          onHover={setHoveredCountry}
          onSelect={focus}
        />

        {/* Coordinate HUD */}
        <div className="pointer-events-none absolute left-5 top-5 z-20 hidden flex-col gap-0.5 rounded-xl border border-white/10 bg-navy/60 px-3 py-2 font-mono text-[10px] text-white/60 backdrop-blur-md sm:flex">
          <span className="font-semibold tracking-wider text-teal">● LIVE ORBIT VIEW</span>
          <span>{formatCoords(display)}</span>
          <span className="text-white/40">DRAG TO ROTATE · CLICK A BEACON</span>
        </div>

        {/* Legend */}
        <div className="pointer-events-none absolute bottom-4 left-4 z-20 hidden items-center gap-4 rounded-xl border border-white/10 bg-navy/60 px-3.5 py-2 text-[11px] text-white/70 backdrop-blur-md md:flex">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
            <span>Singapore Global HQ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-teal shadow-[0_0_8px_#00c2a8]" />
            <span>Denmark Apex Alliance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green shadow-[0_0_6px_#2dbe60]" />
            <span>Project Sites</span>
          </div>
          <span className="h-3 w-px bg-white/15" />
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-sun" />
            <span>Hover</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border-2 border-leaf" />
            <span>Selected</span>
          </div>
        </div>
      </div>

        {/* Detail inspector — below the globe on mobile, overlaid on large screens */}
        <div className="mt-4 flex lg:pointer-events-none lg:absolute lg:bottom-6 lg:left-4 lg:right-6 lg:z-30 lg:mt-0 lg:justify-end">
          <div
            className={`pointer-events-auto w-full max-w-sm rounded-2xl border border-l-4 border-white/20 bg-navy/85 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
              isPreview ? 'border-l-sun' : 'border-l-leaf'
            }`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <Flag emoji={display.flag} name={display.name} className="h-6 w-9" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-lg font-bold text-white">{display.name}</h4>
                    {display.isHq && (
                      <span className="rounded-full bg-leaf px-2 py-0.5 text-[10px] font-bold text-navy">
                        Global HQ
                      </span>
                    )}
                    {display.isAlliance && (
                      <span className="rounded-full bg-teal px-2 py-0.5 text-[10px] font-bold text-navy">
                        Alliance
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-teal/80">{display.region}</p>
                    <span
                      className={`rounded px-1.5 py-px text-[9px] font-bold uppercase tracking-wider ${
                        isPreview ? 'bg-sun text-navy' : 'bg-leaf text-navy'
                      }`}
                    >
                      {isPreview ? 'Preview' : 'Selected'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => focus(step(display, -1))}
                  aria-label="Previous location"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => focus(step(display, 1))}
                  aria-label="Next location"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  →
                </button>
              </div>
            </div>

            <div className="mt-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                Core Engineering Scope
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {display.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-md border border-teal/30 bg-teal/10 px-2 py-0.5 text-[11px] font-medium text-teal"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-white/80">{display.detail}</p>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-2">
              <span className="text-[11px] text-white/40">Active Project Network</span>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-xs font-semibold text-leaf transition-colors hover:text-green"
              >
                Inquire About {display.name} →
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* ── Country dock ────────────────────────────────────────── */}
      {/* A rail, not a marquee. It used to scroll itself continuously inside an
          `overflow-hidden` box, which meant the countries off either edge were
          simply unreachable — you had to wait for them to come round, and on a
          phone there was nothing to swipe at all. Now it scrolls by touch,
          mouse drag, arrows or keyboard, and stays where you put it. */}
      <ScrollRail
        label="countries"
        step={240}
        className="mt-5"
        itemsClassName="gap-2 py-1"
      >
        {filtered.map((country) => {
          const selected = activeCountry.name === country.name
          return (
                  <button
                    key={country.name}
                    type="button"
                    onClick={() => focus(country)}
                    onMouseEnter={() => preview(country)}
                    onMouseLeave={() => preview(null)}
                    onFocus={() => preview(country)}
                    onBlur={() => preview(null)}
                    aria-pressed={selected}
                    className={`group flex shrink-0 snap-start items-center gap-2.5 rounded-xl border px-4 py-2.5 text-left transition-all duration-200 ${
                      selected
                        ? 'border-navy bg-navy text-white shadow-md shadow-navy/20'
                        : 'border-hairline bg-white hover:border-teal hover:bg-teal/8'
                    }`}
                  >
                    <Flag emoji={country.flag} name={country.name} className="h-4 w-6" />
                    <span className="flex flex-col leading-tight">
                      <span
                        className={`text-xs font-semibold ${selected ? 'text-white' : 'text-navy'}`}
                      >
                        {country.name}
                      </span>
                      <span
                        className={`text-[11px] ${selected ? 'text-white/70' : 'text-charcoal/60'}`}
                      >
                        {country.services.join(' / ')}
                      </span>
                    </span>
                    {country.isHq && (
                      <span
                        className={`rounded px-1 text-[9px] font-bold ${selected ? 'bg-sun text-navy' : 'bg-sun/20 text-navy'}`}
                      >
                        HQ
                      </span>
                    )}
                    {country.isAlliance && (
                      <span
                        className={`rounded px-1 text-[9px] font-bold ${selected ? 'bg-teal text-navy' : 'bg-teal/20 text-teal'}`}
                      >
                        Alliance
                      </span>
                    )}
                  </button>
          )
        })}
      </ScrollRail>

      <p className="mt-4 text-center text-xs text-charcoal/45">
        Drag to spin the globe, click a glowing beacon, or swipe the list below to fly the view to a
        country.
      </p>
    </div>
  )
}

/* ─── Helpers ───────────────────────────────────────────────────── */

function step(current: Country, direction: 1 | -1): Country {
  const index = COUNTRIES.findIndex((c) => c.name === current.name)
  const next = (index + direction + COUNTRIES.length) % COUNTRIES.length
  return COUNTRIES[next]
}

function formatCoords({ lat, lon }: Country): string {
  const format = (value: number, positive: string, negative: string) => {
    const degrees = Math.floor(Math.abs(value))
    const minutes = Math.round((Math.abs(value) - degrees) * 60)
    return `${String(degrees).padStart(2, '0')}°${String(minutes).padStart(2, '0')}'${value >= 0 ? positive : negative}`
  }
  return `LAT ${format(lat, 'N', 'S')} · LON ${format(lon, 'E', 'W')}`
}
