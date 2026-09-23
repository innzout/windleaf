import * as THREE from 'three'
import type { Country } from '@/content/site'
import {
  createGlowTexture,
  greatCircleArc,
  latLonToVector3,
  rotationForLatLon,
  type DotData,
} from './globe-geo'

export const GLOBE_RADIUS = 100

const PALETTE = {
  // Light enough that the sphere reads as a planet body rather than a
  // silhouette, dark enough that the dots stay the brightest thing on it.
  core: '#0a2f42',
  rim: '#16697f',
  atmosphere: '#00c2a8',
  dotA: '#2aa39c',
  dotB: '#2dbe60',
  dotHot: '#7dcb45',
  // White so the headquarters reads as the brightest point on the globe.
  hq: '#ffffff',
  alliance: '#00c2a8',
  site: '#2dbe60',
  comet: '#cfeee6',
} as const

/**
 * The hand-written shaders below write straight to the sRGB framebuffer without
 * three's output encode, so their uniforms must stay in sRGB. `new Color(hex)`
 * would convert to the linear working space and crush the darks to near-black.
 *
 * Built-in materials (MeshBasic, Sprite, Points) do get the encode, so those
 * keep using the managed `new THREE.Color(hex)` path.
 */
function srgb(hex: string): THREE.Color {
  return new THREE.Color().setStyle(hex, THREE.NoColorSpace)
}

function markerHex(country: Country): string {
  if (country.isHq) return PALETTE.hq
  if (country.isAlliance) return PALETTE.alliance
  return PALETTE.site
}

export type GlobeSceneOptions = {
  countries: Country[]
  /** Country the arcs radiate from. Defaults to the HQ entry. */
  hubName?: string
  reducedMotion?: boolean
  /** Fired when the pointer enters or leaves a location beacon. */
  onHover?: (country: Country | null) => void
  /** Fired when a location beacon is clicked. */
  onSelect?: (country: Country) => void
  /** Fired once the first frame has been drawn. */
  onReady?: () => void
  /** Fired once the worker-generated dot cloud has been installed. */
  onDotsReady?: (count: number) => void
}

type ArcRecord = {
  line: THREE.Line
  material: THREE.ShaderMaterial
}

type HaloRecord = {
  mesh: THREE.Mesh
  material: THREE.MeshBasicMaterial
  phase: number
  baseScale: number
}

/** Everything needed to restyle one beacon as hover/selection changes. */
type MarkerRecord = {
  country: Country
  beacon: THREE.Mesh
  glowMaterial: THREE.SpriteMaterial
  glow: THREE.Sprite
  ring: THREE.Mesh
  ringMaterial: THREE.MeshBasicMaterial
  baseScale: number
  baseGlowScale: number
}

/** Amber, freed up now that the HQ beacon itself is white. */
const HOVER_RING = '#ffc107'
/** Brand leaf-green reads as "this one is pinned". */
const SELECT_RING = '#7dcb45'

/**
 * Stripe/GitHub-style dotted Earth: a point-cloud sphere masked to the
 * continents, wrapped in an atmospheric shell, with animated great-circle arcs
 * radiating from the Singapore hub to every project location.
 *
 * Deliberately framework-free so React only owns the surrounding UI — the whole
 * WebGL lifecycle lives here and is torn down by {@link dispose}.
 */
export class GlobeScene {
  private readonly container: HTMLElement
  private readonly options: GlobeSceneOptions

  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  /** Holds the globe + atmosphere so both can be shifted off-centre together. */
  private world = new THREE.Group()
  private globe = new THREE.Group()
  private arcsGroup = new THREE.Group()
  private markersGroup = new THREE.Group()

  private dotMaterial!: THREE.ShaderMaterial
  private dots: THREE.Points | null = null
  private disposed = false
  private arcs: ArcRecord[] = []
  private halos: HaloRecord[] = []
  private markers: MarkerRecord[] = []
  private hitTargets: THREE.Mesh[] = []
  private selectedName: string | null = null
  private hoveredName: string | null = null
  private disposables: { dispose: () => void }[] = []

  private rotation = { x: 0.32, y: 0 }
  private target = { x: 0.32, y: 0 }
  private velocity = { x: 0, y: 0 }
  private autoRotate = true
  private dragging = false
  private pointerId: number | null = null
  private lastPointer = { x: 0, y: 0 }
  private pointerMoved = false

  /** Beacon glows differ only by colour, so cache one texture per colour. */
  private glowCache = new Map<string, THREE.Texture>()
  private deferred: number[] = []

  private raycaster = new THREE.Raycaster()
  private ndc = new THREE.Vector2()
  private hovered: Country | null = null

  private frameId = 0
  private running = false
  private lastTime = 0
  private clockOffset = 0
  private ready = false

  private resizeObserver: ResizeObserver
  private intersectionObserver: IntersectionObserver

  constructor(container: HTMLElement, options: GlobeSceneOptions) {
    this.container = container
    this.options = options

    const { clientWidth, clientHeight } = container
    const width = Math.max(clientWidth, 1)
    const height = Math.max(clientHeight, 1)

    // 360 * tan(20°) ≈ 131 world units of half-height. The globe (r=100) fills
    // ~76% of it and the tallest arcs (r≈124, see greatCircleArc) ~95%, so the
    // sphere reads large without the arcs clipping at the top and bottom.
    this.camera = new THREE.PerspectiveCamera(40, width / height, 1, 2000)
    this.camera.position.set(0, 0, 360)

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setSize(width, height, false)
    // 1.5 rather than 2 — at this dot size the extra samples are not visible,
    // but the fragment cost scales with the square of the ratio.
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.domElement.style.width = '100%'
    this.renderer.domElement.style.height = '100%'
    this.renderer.domElement.style.display = 'block'
    this.renderer.domElement.style.touchAction = 'pan-y'
    container.appendChild(this.renderer.domElement)

    this.scene.add(this.world)
    this.world.add(this.globe)
    this.globe.add(this.arcsGroup)
    this.globe.add(this.markersGroup)

    // Only the cheap essentials are built synchronously. Markers and arcs are
    // spread over later frames so no single task crosses the 50ms long-task
    // threshold — building them all inline cost ~360ms of blocking.
    this.buildCore()
    this.buildDotMaterial()
    this.buildAtmosphere()
    this.buildStarfield()
    this.defer(() => {
      this.buildMarkers()
      this.defer(() => this.buildArcs())
    })

    const hub = this.hubCountry()
    if (hub) {
      const start = rotationForLatLon(hub.lat, hub.lon)
      this.rotation = { ...start }
      this.target = { ...start }
      // The hub is the initial selection, so its beacon is already styled by
      // the time the deferred marker build finishes.
      this.selectedName = hub.name
    }

    this.autoRotate = !options.reducedMotion

    // ─── Listeners ────────────────────────────────────────────────
    const el = this.renderer.domElement
    el.addEventListener('pointerdown', this.onPointerDown)
    el.addEventListener('pointermove', this.onPointerMove)
    el.addEventListener('pointerup', this.onPointerUp)
    el.addEventListener('pointercancel', this.onPointerUp)
    el.addEventListener('pointerleave', this.onPointerLeave)

    this.resizeObserver = new ResizeObserver(this.handleResize)
    this.resizeObserver.observe(container)

    document.addEventListener('visibilitychange', this.handleVisibility)

    // Draw immediately, then let the observer park the loop if the globe is
    // scrolled out of view.
    this.start()

    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? this.start() : this.stop()),
      { threshold: 0 },
    )
    this.intersectionObserver.observe(container)
  }

  // ─── Construction ───────────────────────────────────────────────

  private hubCountry(): Country | undefined {
    const { countries, hubName } = this.options
    if (hubName) return countries.find((c) => c.name === hubName)
    return countries.find((c) => c.isHq) ?? countries[0]
  }

  private track<T extends { dispose: () => void }>(resource: T): T {
    this.disposables.push(resource)
    return resource
  }

  /** Memoised glow sprite — 11 beacons share only three distinct colours. */
  private glowTexture(hex: string): THREE.Texture {
    const cached = this.glowCache.get(hex)
    if (cached) return cached
    const texture = this.track(createGlowTexture(hex))
    this.glowCache.set(hex, texture)
    return texture
  }

  /** Runs work on a later frame so construction never blocks in one burst. */
  private defer(fn: () => void) {
    this.deferred.push(
      requestAnimationFrame(() => {
        if (!this.disposed) fn()
      }),
    )
  }

  /** Opaque inner sphere — gives the dots something to be occluded by. */
  private buildCore() {
    // 48 segments is indistinguishable from 64 at this on-screen size.
    const geometry = this.track(new THREE.SphereGeometry(GLOBE_RADIUS * 0.992, 48, 48))
    const material = this.track(
      new THREE.ShaderMaterial({
        uniforms: {
          uCore: { value: srgb(PALETTE.core) },
          uRim: { value: srgb(PALETTE.rim) },
        },
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uCore;
          uniform vec3 uRim;
          varying vec3 vNormal;
          void main() {
            float facing = abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
            float limb = pow(1.0 - facing, 1.9);
            gl_FragColor = vec4(mix(uCore, uRim, limb), 1.0);
          }
        `,
      }),
    )
    this.globe.add(new THREE.Mesh(geometry, material))
  }

  /**
   * Creates the dot shader up front. The point cloud itself arrives later via
   * {@link applyDots} — generating it is the expensive part and now happens in
   * a worker, so the constructor stays cheap.
   */
  private buildDotMaterial() {
    this.dotMaterial = this.track(
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: this.renderer.getPixelRatio() },
          uColorA: { value: srgb(PALETTE.dotA) },
          uColorB: { value: srgb(PALETTE.dotB) },
          uColorHot: { value: srgb(PALETTE.dotHot) },
        },
        vertexShader: /* glsl */ `
          attribute float aRandom;
          attribute float aSize;
          uniform float uTime;
          uniform float uPixelRatio;
          varying float vRandom;
          varying float vFacing;

          void main() {
            vRandom = aRandom;

            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vec3 worldNormal = normalize(mat3(modelMatrix) * normalize(position));
            vFacing = dot(worldNormal, normalize(cameraPosition - worldPosition.xyz));

            vec4 mvPosition = viewMatrix * worldPosition;
            float twinkle = 0.78 + 0.22 * sin(uTime * 1.7 + aRandom * 62.83);

            gl_PointSize = aSize * uPixelRatio * twinkle * (430.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform vec3 uColorHot;
          varying float vRandom;
          varying float vFacing;

          void main() {
            vec2 offset = gl_PointCoord - vec2(0.5);
            float distSq = dot(offset, offset);
            if (distSq > 0.25) discard;

            float alpha = smoothstep(0.25, 0.05, distSq);
            vec3 color = mix(uColorA, uColorB, vRandom);
            color = mix(color, uColorHot, step(0.93, vRandom));

            float facing = clamp(vFacing, 0.0, 1.0);
            alpha *= 0.10 + 0.90 * pow(facing, 0.55);

            gl_FragColor = vec4(color, alpha);
          }
        `,
      }),
    )
  }

  /**
   * Installs the worker-generated point cloud. Safe to call once; ignored if
   * the scene has already been disposed.
   */
  applyDots(data: DotData) {
    if (this.disposed || this.dots) return

    const geometry = this.track(new THREE.BufferGeometry())
    geometry.setAttribute('position', new THREE.BufferAttribute(data.positions, 3))
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(data.randoms, 1))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(data.sizes, 1))

    this.dots = new THREE.Points(geometry, this.dotMaterial)
    this.globe.add(this.dots)
    this.options.onDotsReady?.(data.count)
  }

  /** Fresnel shell that reads as atmospheric haze around the limb. */
  private buildAtmosphere() {
    // The atmosphere is a soft fresnel wash; 32 segments is plenty.
    const geometry = this.track(new THREE.SphereGeometry(GLOBE_RADIUS * 1.18, 32, 32))
    const material = this.track(
      new THREE.ShaderMaterial({
        uniforms: { uColor: { value: srgb(PALETTE.atmosphere) } },
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.58 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.6);
            gl_FragColor = vec4(uColor, 1.0) * clamp(intensity, 0.0, 1.0) * 0.9;
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    )
    this.world.add(new THREE.Mesh(geometry, material))
  }

  /** Faint depth cue behind the globe. */
  private buildStarfield() {
    const count = 420
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Push stars onto a shell well outside the globe so none sit inside it.
      const radius = 520 + Math.random() * 380
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }

    const geometry = this.track(new THREE.BufferGeometry())
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = this.track(
      new THREE.PointsMaterial({
        color: 0x9fd8c4,
        size: 1.6,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      }),
    )

    this.scene.add(new THREE.Points(geometry, material))
  }

  /** Beacon, bloom sprite, expanding halo and pointer hit target per country. */
  private buildMarkers() {
    const beaconGeometry = this.track(new THREE.SphereGeometry(1.9, 16, 16))
    const haloGeometry = this.track(new THREE.RingGeometry(2.4, 3.1, 40))
    // Ring used purely for hover / selection state. Sits outside the beacon's
    // bloom so it stays readable against the additive glow.
    const stateRingGeometry = this.track(new THREE.RingGeometry(4.2, 5.4, 48))
    const hitGeometry = this.track(new THREE.SphereGeometry(7, 10, 10))
    const hitMaterial = this.track(new THREE.MeshBasicMaterial({ visible: false }))
    const zAxis = new THREE.Vector3(0, 0, 1)

    for (const country of this.options.countries) {
      const color = markerHex(country)
      const surface = latLonToVector3(country.lat, country.lon, GLOBE_RADIUS)
      const normal = surface.clone().normalize()
      const scale = country.isHq ? 1.5 : country.isAlliance ? 1.25 : 1

      // Beacon head
      const beacon = new THREE.Mesh(
        beaconGeometry,
        this.track(new THREE.MeshBasicMaterial({ color })),
      )
      beacon.position.copy(normal).multiplyScalar(GLOBE_RADIUS + 1.4)
      beacon.scale.setScalar(scale)
      this.markersGroup.add(beacon)

      // Bloom sprite
      const glow = new THREE.Sprite(
        this.track(
          new THREE.SpriteMaterial({
            map: this.glowTexture(color),
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
            opacity: 0.85,
          }),
        ),
      )
      glow.position.copy(beacon.position)
      glow.scale.setScalar(20 * scale)
      this.markersGroup.add(glow)

      // Expanding surface halo
      const haloMaterial = this.track(
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      )
      const halo = new THREE.Mesh(haloGeometry, haloMaterial)
      halo.position.copy(normal).multiplyScalar(GLOBE_RADIUS + 0.5)
      halo.quaternion.setFromUnitVectors(zAxis, normal)
      halo.scale.setScalar(scale)
      this.markersGroup.add(halo)
      this.halos.push({
        mesh: halo,
        material: haloMaterial,
        phase: Math.random(),
        baseScale: scale,
      })

      // State ring — hidden until this beacon is hovered or selected.
      const ringMaterial = this.track(
        new THREE.MeshBasicMaterial({
          color: HOVER_RING,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      )
      const ring = new THREE.Mesh(stateRingGeometry, ringMaterial)
      ring.position.copy(normal).multiplyScalar(GLOBE_RADIUS + 1.8)
      ring.quaternion.setFromUnitVectors(zAxis, normal)
      ring.scale.setScalar(scale)
      ring.visible = false
      // Draw after the glow sprites, which would otherwise blow it out.
      ring.renderOrder = 10
      this.markersGroup.add(ring)

      // Invisible, generously sized pointer target
      const hit = new THREE.Mesh(hitGeometry, hitMaterial)
      hit.position.copy(beacon.position)
      hit.userData.country = country
      this.markersGroup.add(hit)
      this.hitTargets.push(hit)

      this.markers.push({
        country,
        beacon,
        glow,
        glowMaterial: glow.material as THREE.SpriteMaterial,
        ring,
        ringMaterial,
        baseScale: scale,
        baseGlowScale: 20 * scale,
      })
    }

    this.refreshMarkerStates()
  }

  /**
   * Applies the three beacon states. Hover is a white outline, selection is a
   * larger leaf-green one — different hue *and* different size, so the two stay
   * distinguishable for colour-blind viewers too.
   */
  private refreshMarkerStates() {
    for (const marker of this.markers) {
      const isSelected = marker.country.name === this.selectedName
      const isHovered = marker.country.name === this.hoveredName

      if (isSelected) {
        marker.ring.visible = true
        marker.ringMaterial.color.set(SELECT_RING)
        marker.ringMaterial.opacity = isHovered ? 1 : 0.92
        marker.ring.scale.setScalar(marker.baseScale * (isHovered ? 1.5 : 1.35))
        marker.beacon.scale.setScalar(marker.baseScale * 1.55)
        marker.glowMaterial.opacity = 1
        marker.glow.scale.setScalar(marker.baseGlowScale * 1.35)
      } else if (isHovered) {
        marker.ring.visible = true
        marker.ringMaterial.color.set(HOVER_RING)
        marker.ringMaterial.opacity = 1
        marker.ring.scale.setScalar(marker.baseScale)
        marker.beacon.scale.setScalar(marker.baseScale * 1.3)
        // Glow is deliberately not boosted here — the ring is the hover signal,
        // and a brighter bloom just swallows it.
        marker.glowMaterial.opacity = 0.85
        marker.glow.scale.setScalar(marker.baseGlowScale)
      } else {
        marker.ring.visible = false
        marker.beacon.scale.setScalar(marker.baseScale)
        marker.glowMaterial.opacity = 0.85
        marker.glow.scale.setScalar(marker.baseGlowScale)
      }
    }
  }

  /** Marks a country as the pinned selection. */
  setSelected(country: Country | null) {
    this.selectedName = country?.name ?? null
    this.refreshMarkerStates()
  }

  /** Animated great-circle connections from the hub to every other location. */
  private buildArcs() {
    const hub = this.hubCountry()
    if (!hub) return

    const hubPosition = latLonToVector3(hub.lat, hub.lon, GLOBE_RADIUS)

    for (const country of this.options.countries) {
      if (country.name === hub.name) continue

      const destination = latLonToVector3(country.lat, country.lon, GLOBE_RADIUS)
      const points = greatCircleArc(hubPosition, destination, GLOBE_RADIUS)

      const positions = new Float32Array(points.length * 3)
      const progress = new Float32Array(points.length)
      points.forEach((point, i) => {
        positions[i * 3] = point.x
        positions[i * 3 + 1] = point.y
        positions[i * 3 + 2] = point.z
        progress[i] = i / (points.length - 1)
      })

      const geometry = this.track(new THREE.BufferGeometry())
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('aProgress', new THREE.BufferAttribute(progress, 1))

      // Static line. The previous travelling pulse and comet sprites made a
      // dozen routes read as visual noise; a calm connection is enough.
      // Opacity eases in from the hub and out at the destination so the line
      // does not visually collide with the beacons at either end.
      const material = this.track(
        new THREE.ShaderMaterial({
          uniforms: {
            uColor: { value: srgb(markerHex(country)) },
            uOpacity: { value: 0.42 },
          },
          vertexShader: /* glsl */ `
            attribute float aProgress;
            varying float vProgress;
            void main() {
              vProgress = aProgress;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: /* glsl */ `
            uniform vec3 uColor;
            uniform float uOpacity;
            varying float vProgress;

            void main() {
              float fade = smoothstep(0.0, 0.14, vProgress) *
                           smoothstep(1.0, 0.86, vProgress);
              gl_FragColor = vec4(uColor, uOpacity * fade);
            }
          `,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      )

      const line = new THREE.Line(geometry, material)
      this.arcsGroup.add(line)

      this.arcs.push({ line, material })
    }
  }

  // ─── Public API ─────────────────────────────────────────────────

  setAutoRotate(enabled: boolean) {
    this.autoRotate = enabled && !this.options.reducedMotion
  }

  setArcsVisible(visible: boolean) {
    this.arcsGroup.visible = visible
  }

  /** Spins the globe so the given country faces the camera, and pins it. */
  focusCountry(country: Country) {
    this.setSelected(country)
    const next = rotationForLatLon(country.lat, country.lon)
    // Take the short way round rather than unwinding accumulated spin.
    const turns = Math.round((this.rotation.y - next.y) / (Math.PI * 2))
    this.target = { x: next.x, y: next.y + turns * Math.PI * 2 }
    this.velocity = { x: 0, y: 0 }
  }

  dispose() {
    this.disposed = true
    this.deferred.forEach((handle) => cancelAnimationFrame(handle))
    this.deferred = []
    this.glowCache.clear()
    this.stop()

    const el = this.renderer.domElement
    el.removeEventListener('pointerdown', this.onPointerDown)
    el.removeEventListener('pointermove', this.onPointerMove)
    el.removeEventListener('pointerup', this.onPointerUp)
    el.removeEventListener('pointercancel', this.onPointerUp)
    el.removeEventListener('pointerleave', this.onPointerLeave)
    document.removeEventListener('visibilitychange', this.handleVisibility)

    this.resizeObserver.disconnect()
    this.intersectionObserver.disconnect()

    this.disposables.forEach((resource) => resource.dispose())
    this.disposables = []
    this.renderer.dispose()

    if (el.parentNode) el.parentNode.removeChild(el)
  }

  // ─── Loop ───────────────────────────────────────────────────────

  private start = () => {
    if (this.running) return
    this.running = true
    this.lastTime = performance.now()
    this.frameId = requestAnimationFrame(this.tick)
  }

  private stop = () => {
    if (!this.running) return
    this.running = false
    cancelAnimationFrame(this.frameId)
  }

  private handleVisibility = () => {
    if (document.hidden) this.stop()
    else this.start()
  }

  private tick = () => {
    this.frameId = requestAnimationFrame(this.tick)

    const now = performance.now()
    const delta = Math.min((now - this.lastTime) / 1000, 0.1)
    this.lastTime = now
    this.clockOffset += delta
    const time = this.clockOffset

    // Idle spin
    if (this.autoRotate && !this.dragging) {
      this.target.y += delta * 0.11
    }

    // Inertia after a flick
    if (!this.dragging) {
      this.target.y += this.velocity.y
      this.target.x = THREE.MathUtils.clamp(this.target.x + this.velocity.x, -1.15, 1.15)
      this.velocity.y *= 0.92
      this.velocity.x *= 0.92
      if (Math.abs(this.velocity.y) < 1e-5) this.velocity.y = 0
      if (Math.abs(this.velocity.x) < 1e-5) this.velocity.x = 0
    }

    // Critically damped follow
    const ease = 1 - Math.pow(0.0015, delta)
    this.rotation.y += (this.target.y - this.rotation.y) * ease
    this.rotation.x += (this.target.x - this.rotation.x) * ease
    this.globe.rotation.set(this.rotation.x, this.rotation.y, 0)

    if (!this.options.reducedMotion) {
      this.dotMaterial.uniforms.uTime.value = time

      // Halo rings breathe outward from each beacon
      for (const halo of this.halos) {
        const cycle = (time * 0.55 + halo.phase) % 1
        halo.mesh.scale.setScalar(halo.baseScale * (1 + cycle * 2.4))
        halo.material.opacity = 0.55 * (1 - cycle)
      }

      // Arcs are static — nothing to advance per frame.
    }

    this.renderer.render(this.scene, this.camera)

    if (!this.ready) {
      this.ready = true
      this.options.onReady?.()
    }
  }

  // ─── Input ──────────────────────────────────────────────────────

  private handleResize = () => {
    const width = Math.max(this.container.clientWidth, 1)
    const height = Math.max(this.container.clientHeight, 1)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height, false)
    // 1.5 rather than 2 — at this dot size the extra samples are not visible,
    // but the fragment cost scales with the square of the ratio.
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    this.dotMaterial.uniforms.uPixelRatio.value = this.renderer.getPixelRatio()

    // On wide layouts the detail card sits over the right-hand side, so slide
    // the globe into the empty space on the left rather than under the card.
    // Derived from the frustum so the offset holds at any container size.
    const halfHeightWorld =
      Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z
    const halfWidthWorld = halfHeightWorld * this.camera.aspect
    this.world.position.x = width >= 1024 ? -halfWidthWorld * 0.26 : 0
  }

  private onPointerDown = (event: PointerEvent) => {
    this.dragging = true
    this.pointerMoved = false
    this.pointerId = event.pointerId
    this.lastPointer = { x: event.clientX, y: event.clientY }
    this.velocity = { x: 0, y: 0 }
    this.renderer.domElement.setPointerCapture(event.pointerId)
  }

  private onPointerMove = (event: PointerEvent) => {
    if (this.dragging && event.pointerId === this.pointerId) {
      const dx = event.clientX - this.lastPointer.x
      const dy = event.clientY - this.lastPointer.y
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) this.pointerMoved = true

      this.velocity.y = dx * 0.0045
      this.velocity.x = dy * 0.0045
      this.target.y += this.velocity.y
      this.target.x = THREE.MathUtils.clamp(this.target.x + this.velocity.x, -1.15, 1.15)

      this.lastPointer = { x: event.clientX, y: event.clientY }
      return
    }

    this.updateHover(event)
  }

  private onPointerUp = (event: PointerEvent) => {
    const el = this.renderer.domElement
    if (this.pointerId !== null && el.hasPointerCapture?.(this.pointerId)) {
      el.releasePointerCapture(this.pointerId)
    }
    const wasDragging = this.dragging
    this.dragging = false
    this.pointerId = null

    // A press that never moved counts as a click on whatever is under it.
    if (wasDragging && !this.pointerMoved) {
      const country = this.pick(event)
      if (country) this.options.onSelect?.(country)
    }
  }

  private onPointerLeave = () => {
    this.dragging = false
    this.pointerId = null
    if (this.hovered) {
      this.hovered = null
      this.applyHover(null)
      this.options.onHover?.(null)
      this.renderer.domElement.style.cursor = ''
    }
  }

  private pick(event: PointerEvent): Country | null {
    const rect = this.renderer.domElement.getBoundingClientRect()
    this.ndc.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    )
    this.raycaster.setFromCamera(this.ndc, this.camera)
    const hit = this.raycaster.intersectObjects(this.hitTargets, false)[0]
    return (hit?.object.userData.country as Country | undefined) ?? null
  }

  private updateHover(event: PointerEvent) {
    const country = this.pick(event)
    if (country === this.hovered) return
    this.hovered = country
    this.renderer.domElement.style.cursor = country ? 'pointer' : ''
    this.applyHover(country)
    this.options.onHover?.(country)
  }

  private applyHover(country: Country | null) {
    this.hoveredName = country?.name ?? null
    this.refreshMarkerStates()
  }

  /** Lets the country dock preview a beacon without moving the pointer. */
  setHovered(country: Country | null) {
    this.applyHover(country)
  }
}
