import * as THREE from 'three'

export type { DotData } from './land-dots'

/** Converts geographic coordinates to a point on a sphere of the given radius. */
export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (lat * Math.PI) / 180
  const theta = (lon * Math.PI) / 180
  return new THREE.Vector3(
    radius * Math.cos(phi) * Math.sin(theta),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * Math.cos(theta),
  )
}

/**
 * Globe rotation (in radians) that brings the given coordinates to face the
 * camera. Pairs with a group whose Euler order is the default `XYZ`.
 */
export function rotationForLatLon(lat: number, lon: number): { x: number; y: number } {
  return { x: (lat * Math.PI) / 180, y: -(lon * Math.PI) / 180 }
}

/**
 * Points along a great-circle arc between two surface positions, lifted into a
 * smooth parabola whose height scales with the distance travelled.
 */
export function greatCircleArc(
  from: THREE.Vector3,
  to: THREE.Vector3,
  radius: number,
  segments = 72,
): THREE.Vector3[] {
  const a = from.clone().normalize()
  const b = to.clone().normalize()
  const omega = Math.acos(THREE.MathUtils.clamp(a.dot(b), -1, 1))
  const sinOmega = Math.sin(omega)
  // Kept shallow so the longest arcs stay inside the camera frustum — see the
  // framing note in globe-scene.ts before raising these.
  const lift = radius * (0.06 + 0.18 * (omega / Math.PI))

  const points: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments

    let point: THREE.Vector3
    if (sinOmega < 1e-6) {
      point = a.clone().lerp(b, t).normalize()
    } else {
      point = a
        .clone()
        .multiplyScalar(Math.sin((1 - t) * omega) / sinOmega)
        .addScaledVector(b, Math.sin(t * omega) / sinOmega)
        .normalize()
    }

    points.push(point.multiplyScalar(radius + lift * Math.sin(Math.PI * t)))
  }

  return points
}

/**
 * Soft radial sprite used to bloom the location beacons without post-processing.
 * Falls off to transparent black, so it is meant for additive blending.
 */
export function createGlowTexture(hex: string): THREE.Texture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // The canvas is sRGB, so read the hex literally rather than letting three's
  // colour management convert it into the linear working space first.
  const { r, g, b } = new THREE.Color().setStyle(hex, THREE.NoColorSpace)
  const rgb = `${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}`

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, `rgba(${rgb}, 1)`)
  gradient.addColorStop(0.18, `rgba(${rgb}, 0.65)`)
  gradient.addColorStop(0.45, `rgba(${rgb}, 0.18)`)
  gradient.addColorStop(1, `rgba(${rgb}, 0)`)

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}
