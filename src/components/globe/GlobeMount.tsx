'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import type { GlobeProps } from './Globe'
import { GlobeLoader } from './GlobeLoader'

/**
 * Loads the WebGL globe (and all of three.js) only in the browser, and only
 * once the user is actually scrolling towards it.
 *
 * Bringing up a WebGL context costs ~200ms of main-thread time and compiling
 * the shaders another ~140ms — both are driver-side and unavoidable for any
 * WebGL renderer. Deferring until the globe is near the viewport keeps that
 * entirely out of page load and hydration, where it would compete with
 * everything else.
 */
const Globe = dynamic(() => import('./Globe').then((mod) => mod.Globe), {
  ssr: false,
  loading: () => <GlobeLoader stage="downloading" />,
})

export function GlobeMount(props: GlobeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setNear(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        setNear(true)
      },
      // Start early enough that it has finished initialising by the time the
      // globe is actually on screen.
      { rootMargin: '500px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Once mounted, the globe renders its own in-viewport progress overlay.
  return <div ref={ref}>{near ? <Globe {...props} /> : <GlobeLoader stage="idle" />}</div>
}
