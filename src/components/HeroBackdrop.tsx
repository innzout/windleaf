'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Hero background: a still poster that hands off to the looping video.
 *
 * The two must never both be visible — they show the same scene, so a
 * semi-transparent video over a static frame of itself double-exposes the
 * moving blades against frozen ones. The poster therefore fades *out* exactly
 * as the video fades in, and stays put whenever the video can't run.
 *
 * The video is skipped entirely — never even requested — when the viewport is a
 * phone, motion is reduced, or Data Saver is on. Nothing renders on the server
 * or the first client render, which avoids a hydration mismatch.
 *
 * `poster` is passed in from the server component so `next/image` still
 * optimises it.
 */
export function HeroBackdrop({
  videoSrc,
  poster,
  opacity = 0.6,
  parallax = 0.28,
}: {
  videoSrc: string | null
  poster: ReactNode
  /** Opacity of whichever layer is currently showing. */
  opacity?: number
  /** Fraction of scroll distance the backdrop drifts. 0 disables it. */
  parallax?: number
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!videoSrc) return
    // Plays on phones too. Still skipped for reduced motion and Data Saver,
    // where honouring the user's explicit preference matters more.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const connection = (navigator as { connection?: { saveData?: boolean } }).connection
    if (!reducedMotion && !connection?.saveData) setEnabled(true)
  }, [videoSrc])

  // Parallax: the backdrop drifts slower than the page. The layer is scaled up
  // so the drift never exposes an edge, and the transform is written straight
  // to the DOM inside one rAF rather than through React state.
  useEffect(() => {
    const layer = layerRef.current
    if (!layer || parallax <= 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const apply = () => {
      frame = 0
      const y = window.scrollY
      // Stop computing once the hero has scrolled well out of view.
      if (y > window.innerHeight * 1.5) return
      layer.style.transform = `translate3d(0, ${(y * parallax).toFixed(1)}px, 0) scale(1.18)`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [parallax])

  useEffect(() => {
    if (!enabled) return
    // Safari/iOS can reject the initial autoplay attempt; retry explicitly.
    videoRef.current?.play().catch(() => setPlaying(false))
  }, [enabled])

  return (
    // Both layers share one transformed wrapper so the parallax drift applies
    // to the poster and the video identically — moving them separately would
    // shear one against the other during the cross-fade.
    <div
      ref={layerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden will-change-transform"
      style={{ transform: 'translate3d(0,0,0) scale(1.18)' }}
      aria-hidden="true"
    >
      {/* `object-position` is pushed right on narrow screens: the turbine sits
          in the right-hand third of the frame, and a centred crop cuts it off
          entirely on a phone. The video below carries the matching rule. */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-out [&_img]:object-[72%_center] sm:[&_img]:object-center"
        style={{ opacity: playing ? 0 : opacity }}
      >
        {poster}
      </div>

      {enabled && videoSrc && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
          onCanPlay={() => setPlaying(true)}
          onError={() => setPlaying(false)}
          style={{ opacity: playing ? opacity : 0 }}
          className="absolute inset-0 h-full w-full object-cover object-[72%_center] transition-opacity duration-1000 ease-out sm:object-center"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
    </div>
  )
}
