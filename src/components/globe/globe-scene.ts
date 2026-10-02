import * as THREE from 'three'
import type { Country } from '@/content/site'
import {
  createGlowTexture,
  createRotorTexture,
  greatCircleArc,
  latLonToVector3,
  rotationForLatLon,
} from './globe-geo'

export const GLOBE_RADIUS = 100

const PALETTE = {
  atmosphere: '#00c2a8',
  // White so the headquarters reads as the brightest point on the globe.
  hq: '#ffffff',
  // Amber, not the brand teal.
  //
  // Teal failed on two counts at once: it is within a hue of the project green
  // (#2dbe60), so alliance and project markers were indistinguishable at marker
  // size, and it is the exact colour of the atmosphere shell, so alliance
  // markers dissolved into their own glow near the limb. Amber is the only
  // brand colour far enough round the wheel to separate from both against a
  // blue-green planet.
  //
  // Note it is `sun`, which marks the HQ on the GlobalReach cards — no conflict
  // on the globe, where the HQ is white, but keep that in mind if the card
  // badges and the markers are ever unified.
  alliance: '#ffc107',
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
  /** Fired once the Earth imagery has decoded and been applied. */
  onImageryReady?: () => void
}

type ArcRecord = {
  line: THREE.Line
  material: THREE.ShaderMaterial
}

type RotorRecord = {
  material: THREE.SpriteMaterial
  speed: number
  phase: number
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
  beacon: THREE.Sprite
  glowMaterial: THREE.SpriteMaterial
  glow: THREE.Sprite
  ring: THREE.Mesh
  ringMaterial: THREE.MeshBasicMaterial
  baseScale: number
  /**
   * The rotor needs its own size, separate from `baseScale`.
   *
   * `baseScale` is the country's weighting (1 / 1.25 / 1.5) and drives the
   * ring, which is geometry sized in world units already. A sprite's scale *is*
   * its size in world units, so reusing the weighting directly drew the rotor
   * about 5px across — a dot with a wobble, not a turbine.
   */
  baseRotorScale: number
  baseGlowScale: number
  /** Surface normal in globe-local space, for the facing test each frame. */
  normal: THREE.Vector3
}

/**
 * Rotor diameter in world units, against a globe radius of 100 — roughly 30px
 * on a desktop frame, which is where the three blades stay legible. Much under
 * 20px and it collapses into a shapeless "Y".
 */
const ROTOR_SIZE = 9

/**
 * White, because amber now marks the alliance countries.
 *
 * Leaving hover on amber would have made every alliance marker look permanently
 * hovered. White does double duty with the white HQ beacon, but the two are
 * shape-distinct — a thin outline ring on the surface versus a filled rotor —
 * and hover is transient while the HQ is always there.
 */
const HOVER_RING = '#ffffff'
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

  private disposed = false
  private arcs: ArcRecord[] = []
  private halos: HaloRecord[] = []
  private rotors: RotorRecord[] = []
  private markers: MarkerRecord[] = []
  private hitTargets: THREE.Mesh[] = []
  private selectedName: string | null = null
  private hoveredName: string | null = null
  private disposables: { dispose: () => void }[] = []

  private rotation = { x: 0.32, y: 0 }
  private target = { x: 0.32, y: 0 }
  private velocity = { x: 0, y: 0 }
  private autoRotate = true
  /** Held facing a selected country; released by dragging or the spin toggle. */
  private pinned = false
  private dragging = false
  private pointerId: number | null = null
  private lastPointer = { x: 0, y: 0 }
  private pointerMoved = false

  /** Beacon glows differ only by colour, so cache one texture per colour. */
  private glowCache = new Map<string, THREE.Texture>()
  private rotorCache = new Map<string, THREE.Texture>()
  private deferred: number[] = []

  /** Scratch vectors for the per-frame facing test — reused, never allocated. */
  private tmpNormal = new THREE.Vector3()
  private tmpPosition = new THREE.Vector3()
  private tmpToCamera = new THREE.Vector3()

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

    this.camera = new THREE.PerspectiveCamera(40, width / height, 1, 2000)
    this.camera.position.set(0, 0, 312)
    this.frameCamera(width, height)

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
    // The photographic Earth carries the geography now, so the shaded land
    // shell and the dot cloud that preceded it are both gone from the scene.
    this.buildEarth()
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

  /** Same per-colour caching as the glow: 14 markers, three colours. */
  private rotorTexture(hex: string): THREE.Texture {
    const cached = this.rotorCache.get(hex)
    if (cached) return cached
    const texture = this.track(createRotorTexture(hex))
    this.rotorCache.set(hex, texture)
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

  /**
   * Photographic Earth, in the manner of the globe.gl examples.
   *
   * Blue-marble daylight imagery, served from `public/globe/` rather than
   * unpkg — an external texture would put a third-party CDN on the critical
   * path of the page and hand it a chance to CORS-fail or simply go down.
   *
   * The night-lights map went first and was unreadable: it is beautiful in a
   * demo on a black page, but here it left most of the sphere near-black, with
   * the continents legible only where cities happen to be dense. A marketing
   * page needs the viewer to recognise where the work happens at a glance.
   *
   * Lit rather than unlit. A `MeshBasicMaterial` would show the map flat and
   * fully bright right to the edge, which loses the sphere; one directional
   * light plus a strong ambient gives the terminator that makes it read as a
   * ball, without dimming the far side into unreadability. The topology map
   * drives a light bump so mountain ranges catch the light.
   *
   * The texture arrives after the scene does, so the globe fades it in — see
   * `onImageryReady`.
   */
  private buildEarth() {
    const geometry = this.track(new THREE.SphereGeometry(GLOBE_RADIUS, 96, 64))
    const material = this.track(
      new THREE.MeshPhongMaterial({
        color: 0x223a4a,
        shininess: 6,
        transparent: true,
        opacity: 1,
      }),
    )
    const mesh = new THREE.Mesh(geometry, material)
    // Align the imagery with our own lat/lon convention.
    //
    // An equirectangular map puts longitude -180 at u = 0, so longitude 0 sits
    // at u = 0.5. SphereGeometry, though, places u = 0.25 on the +Z axis — and
    // +Z is where `latLonToVector3` puts longitude 0. Left uncorrected the map
    // is a quarter turn out: selecting Denmark spun the globe to the right
    // place and showed North America there, which reads as "the markers are
    // wrong" when in fact the markers were the only part that was right.
    mesh.rotation.y = -Math.PI / 2
    this.globe.add(mesh)

    // Ambient does most of the work so the whole visible face stays readable;
    // the directional light only has to model the curvature.
    this.scene.add(this.track(new THREE.AmbientLight(0xffffff, 2.6)))
    const key = new THREE.DirectionalLight(0xffffff, 1.1)
    key.position.set(-1, 0.6, 1)
    this.scene.add(key)

    // The imagery completes the loading bar, so *something* has to complete it
    // even when the image never arrives. Without this a 404, a decode failure
    // or a stalled connection left the loader spinning forever and the globe
    // permanently hidden behind it — the sphere and every marker were already
    // built and working underneath. Firing once, whichever path gets there
    // first, means the worst case is an untextured globe rather than no globe.
    let settled = false
    const settle = () => {
      if (settled || this.disposed) return
      settled = true
      this.options.onImageryReady?.()
    }
    const stall = window.setTimeout(settle, 8000)
    this.disposables.push({ dispose: () => window.clearTimeout(stall) })

    const loader = new THREE.TextureLoader()
    loader.load('/globe/earth-blue-marble.jpg', (map) => {
      if (this.disposed) return
      map.colorSpace = THREE.SRGBColorSpace
      material.map = map
      // Graded towards the brand rather than left photographic.
      //
      // `color` multiplies the texture, so a desaturated teal pulls the
      // ochres and cloud-whites of the raw imagery back towards the navy /
      // teal / green the rest of the site is built from. Left at white the
      // globe reads as a stock asset dropped into the page — and two things
      // actually break: the leaf-green selection ring loses contrast over
      // bright ocean, and the white HQ dot can vanish against cloud or ice.
      material.color.set(0x7fbdb4)
      material.needsUpdate = true
      this.track(map)
      window.clearTimeout(stall)
      settle()
    },
    undefined,
    () => {
      // Flat tinted sphere, markers and arcs intact.
      console.warn('Globe: Earth imagery failed to load; showing untextured globe')
      window.clearTimeout(stall)
      settle()
    })
    loader.load('/globe/earth-topology.png', (bump) => {
      if (this.disposed) return
      material.bumpMap = bump
      material.bumpScale = 6
      material.needsUpdate = true
      this.track(bump)
    })
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

      // A turning rotor, pinned to the surface.
      //
      // Kept flush with the surface rather than raised. An earlier version put
      // the marker on a bar standing ~17 units off the sphere; its head then
      // separated from the selection ring left on the surface, and anywhere
      // except dead centre it floated over a neighbouring country.
      const beacon = new THREE.Sprite(
        this.track(
          new THREE.SpriteMaterial({
            map: this.rotorTexture(color),
            transparent: true,
            depthWrite: false,
            // A sprite is a billboard: one flat quad, every corner at the same
            // view depth. Near the limb the sphere curves in front of the far
            // corners of that quad and lops the blades off mid-span — which
            // looked like a broken icon but was the globe eating it.
            //
            // Depth testing off draws the rotor whole. The cost is that far-side
            // markers would show through the planet, so `updateMarkerFacing`
            // hides those explicitly each frame instead.
            depthTest: false,
          }),
        ),
      )
      beacon.position.copy(normal).multiplyScalar(GLOBE_RADIUS + 0.9)
      beacon.scale.setScalar(ROTOR_SIZE * scale)
      this.markersGroup.add(beacon)
      this.rotors.push({
        material: beacon.material,
        // Each rotor runs at its own rate and starts at its own angle. Marching
        // in lockstep reads as one animation applied to a row of icons; out of
        // phase, they read as fourteen separate turbines.
        speed: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      })

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
      // The HQ glow used to burn out into a solid white disc that covered the
      // country it was marking — most visible once selection actually held the
      // country facing the camera. The ring and the beacon head carry the
      // emphasis instead, so the glow only has to suggest a halo.
      const glowScale = country.isHq ? 13 : 20 * scale
      glow.scale.setScalar(glowScale)
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
        baseRotorScale: ROTOR_SIZE * scale,
        baseGlowScale: glowScale,
        normal: normal.clone(),
      })
    }

    this.refreshMarkerStates()
  }

  /**
   * Applies the three beacon states. Hover is a white outline, selection is a
   * larger leaf-green one — different hue *and* different size, so the two stay
   * distinguishable for colour-blind viewers too.
   */
  /**
   * Hides the markers on the far side of the planet.
   *
   * The rotor sprites draw with `depthTest: false` so the globe cannot clip
   * their blades, which means the depth buffer is no longer doing this job and
   * something has to. Testing the surface normal against the direction to the
   * camera is the same question the depth buffer was answering, just asked per
   * marker instead of per pixel — and at fourteen markers that is nothing.
   *
   * The small positive cut-off rather than zero: exactly on the limb a rotor is
   * half behind the planet anyway, and popping it out slightly early is much
   * less noticeable than letting it hang off the edge.
   */
  private updateMarkerFacing() {
    for (const marker of this.markers) {
      this.tmpNormal.copy(marker.normal).applyQuaternion(this.globe.quaternion)
      this.tmpPosition
        .copy(this.tmpNormal)
        .multiplyScalar(GLOBE_RADIUS)
        .add(this.world.position)
      const facing = this.tmpNormal.dot(
        this.tmpToCamera.copy(this.camera.position).sub(this.tmpPosition).normalize(),
      )
      const visible = facing > 0.05
      marker.beacon.visible = visible
      marker.glow.visible = visible
    }
  }

  private refreshMarkerStates() {
    for (const marker of this.markers) {
      const isSelected = marker.country.name === this.selectedName
      const isHovered = marker.country.name === this.hoveredName

      if (isSelected) {
        marker.ring.visible = true
        marker.ringMaterial.color.set(SELECT_RING)
        marker.ringMaterial.opacity = isHovered ? 1 : 0.92
        marker.ring.scale.setScalar(marker.baseScale * (isHovered ? 1.5 : 1.35))
        marker.beacon.scale.setScalar(marker.baseRotorScale * 1.35)
        marker.glowMaterial.opacity = 1
        marker.glow.scale.setScalar(marker.baseGlowScale * 1.35)
      } else if (isHovered) {
        marker.ring.visible = true
        marker.ringMaterial.color.set(HOVER_RING)
        marker.ringMaterial.opacity = 1
        marker.ring.scale.setScalar(marker.baseScale)
        marker.beacon.scale.setScalar(marker.baseRotorScale * 1.2)
        // Glow is deliberately not boosted here — the ring is the hover signal,
        // and a brighter bloom just swallows it.
        marker.glowMaterial.opacity = 0.85
        marker.glow.scale.setScalar(marker.baseGlowScale)
      } else {
        marker.ring.visible = false
        marker.beacon.scale.setScalar(marker.baseRotorScale)
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
    // Asking for spin explicitly releases a country pin — otherwise the toggle
    // would look broken after a selection.
    if (enabled) this.pinned = false
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
    // This is what makes it a pin. Without it the idle spin keeps advancing
    // `target.y` every frame, so the globe turns towards the country and then
    // sails straight past it — picking a country visibly failed to show that
    // country. The flag is internal rather than a call to `setAutoRotate`, so
    // the user's own Auto-Spin toggle is not silently flipped underneath them.
    this.pinned = true
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
    if (this.autoRotate && !this.dragging && !this.pinned) {
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
    // After the rotation, before the render — the facing test reads the
    // quaternion this line just wrote.
    this.globe.updateMatrixWorld()
    this.updateMarkerFacing()

    if (!this.options.reducedMotion) {
      // Turbines turn. `SpriteMaterial.rotation` spins the billboard in screen
      // space, which is what keeps the rotor facing the viewer wherever it is
      // on the sphere. Skipped entirely under reduced motion — the rotor still
      // reads as a turbine standing still.
      for (const rotor of this.rotors) {
        rotor.material.rotation = rotor.phase + time * rotor.speed
      }

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

  /**
   * Pulls the camera to whatever distance frames the globe in the *tighter* of
   * the two axes.
   *
   * A perspective camera's `fov` is vertical, so distance alone only controls
   * the vertical fit. On the wide desktop frame that is the binding constraint
   * and a fixed distance is fine; the mobile frame is portrait (a 16/9 box with
   * a 460px `minHeight` ends up taller than it is wide), and there the sphere
   * overflows sideways and gets sliced down both edges. Deriving the distance
   * from both axes fills the desktop frame and keeps the phone's silhouette
   * whole, with no breakpoint to maintain.
   *
   * FILL is the sphere's diameter as a multiple of the frame's *shorter* side,
   * so the globe spans nearly the full height of a wide frame and nearly the
   * full width of a portrait one.
   *
   * It sits just under 1 on purpose. Two earlier attempts went past that and
   * both looked worse, in the same way: at 1.2 the limb only survived on one
   * side, so the sphere read as a lopsided crop rather than a planet, and at
   * full corner coverage there was no horizon on screen at all and it stopped
   * reading as a sphere entirely. The silhouette is what says "globe" — keep
   * all of it, and let the small margin carry the atmosphere glow.
   *
   * Zooming is done with the focal length, not by flying the camera in. A
   * sphere of radius 100 seen from ~130 units would cover the frame too, but
   * that close the perspective is severe: the near face balloons, the limb
   * curves away hard, and the camera ends up almost inside the atmosphere
   * shell at radius 118. Holding the distance and narrowing the fov is the
   * telephoto equivalent — same framing, no distortion.
   */
  private frameCamera(width: number, height: number) {
    const SPHERE_RADIUS = 100
    const FILL = 1.08

    // Half-height of the frustum at the globe, chosen so the sphere's diameter
    // projects to FILL times the shorter side of the canvas.
    const shorterSide = Math.min(width, height)
    const halfHeight = (SPHERE_RADIUS * (height / 2)) / ((FILL / 2) * shorterSide)
    const halfFov = Math.atan(halfHeight / this.camera.position.z)

    this.camera.fov = (halfFov * 2 * 180) / Math.PI
    this.camera.updateProjectionMatrix()

  }

  private handleResize = () => {
    const width = Math.max(this.container.clientWidth, 1)
    const height = Math.max(this.container.clientHeight, 1)
    this.camera.aspect = width / height
    this.frameCamera(width, height)
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height, false)
    // 1.5 rather than 2 — the extra samples are not visible on this imagery,
    // but the fragment cost scales with the square of the ratio.
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))

    // On wide layouts the detail card sits over the right-hand side, so slide
    // the globe into the empty space on the left rather than under the card.
    // Derived from the frustum so the offset holds at any container size.
    const halfHeightWorld =
      Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z
    const halfWidthWorld = halfHeightWorld * this.camera.aspect
    // Enough to keep the focused country clear of the detail card, and no
    // more. Shifting hard (this was 0.3) just relocates the dead space to the
    // other side of the frame and crushes the continents against the edge.
    this.world.position.x = width >= 1024 ? -halfWidthWorld * 0.12 : 0
  }

  private onPointerDown = (event: PointerEvent) => {
    // Touching the globe is a clear intent to take over from the pin.
    this.pinned = false
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
