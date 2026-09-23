/**
 * Dot-cloud generation — deliberately free of any three.js import, because the
 * globe worker imports this module and pulling three in here would drag the
 * whole renderer into the worker bundle.
 *
 * Land is looked up in a pre-baked bitmask generated from Natural Earth 1:50m
 * data (see `land-mask.ts`). The previous hand-authored coastline polygons were
 * too coarse — continents read as blobs and markers didn't line up with land.
 */
import { isLand } from './land-mask'

export type DotData = {
  positions: Float32Array
  randoms: Float32Array
  sizes: Float32Array
  count: number
}

/**
 * Samples a Fibonacci lattice over the sphere and keeps the points that land on
 * a continent. Mask lookup is O(1), so filtering ~26k candidates is cheap.
 */
export function generateLandDots(count: number, radius: number): DotData {
  // Land is a little under a third of the sphere; over-allocate and slice.
  const capacity = Math.ceil(count * 0.35)
  const positions = new Float32Array(capacity * 3)
  const randoms = new Float32Array(capacity)
  const sizes = new Float32Array(capacity)

  const golden = Math.PI * (3 - Math.sqrt(5))
  const toDeg = 180 / Math.PI
  let kept = 0

  for (let i = 0; i < count; i++) {
    if (kept >= capacity) break

    const y = 1 - (i / (count - 1)) * 2
    const ring = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * i
    const x = Math.cos(theta) * ring
    const z = Math.sin(theta) * ring

    const lat = Math.asin(y) * toDeg
    const lon = Math.atan2(x, z) * toDeg

    if (!isLand(lat, lon)) continue

    // (x, y, z) is already the unit-sphere position for this lat/lon, so there
    // is no need to convert back through trigonometry.
    positions[kept * 3] = x * radius
    positions[kept * 3 + 1] = y * radius
    positions[kept * 3 + 2] = z * radius
    randoms[kept] = Math.random()
    sizes[kept] = 1.5 + Math.random() * 0.9
    kept++
  }

  return {
    positions: positions.slice(0, kept * 3),
    randoms: randoms.slice(0, kept),
    sizes: sizes.slice(0, kept),
    count: kept,
  }
}
