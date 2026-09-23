/// <reference lib="webworker" />

import { generateLandDots } from './land-dots'

export type GlobeWorkerRequest = { count: number; radius: number }
export type GlobeWorkerResponse = {
  positions: Float32Array
  randoms: Float32Array
  sizes: Float32Array
  count: number
  elapsedMs: number
}

/**
 * Builds the globe's dot cloud off the main thread.
 *
 * This is the work that used to cost ~300ms of synchronous jank when the scene
 * was constructed. The buffers are transferred (not copied) back to the caller.
 */
self.onmessage = (event: MessageEvent<GlobeWorkerRequest>) => {
  const { count, radius } = event.data
  const started = performance.now()
  const dots = generateLandDots(count, radius)

  const payload: GlobeWorkerResponse = {
    positions: dots.positions,
    randoms: dots.randoms,
    sizes: dots.sizes,
    count: dots.count,
    elapsedMs: Math.round(performance.now() - started),
  }

  ;(self as unknown as Worker).postMessage(payload, [
    payload.positions.buffer,
    payload.randoms.buffer,
    payload.sizes.buffer,
  ])
}
