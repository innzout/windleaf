# Windleaf Energy Solutions — frontend

Marketing site for Windleaf Energy Solutions: **Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + Three.js**.

Ported from two Figma Make / Vite prototypes that live beside this folder
(`../Premium Corporate Website Design` and `../share-live`). Those are reference
material only — all work happens here.

## Commands

| Command          | What it does                                  |
| ---------------- | --------------------------------------------- |
| `npm run dev`    | Dev server on http://localhost:3000           |
| `npm run build`  | Production build (Turbopack)                  |
| `npm run start`  | Serve the production build                    |
| `npm run typecheck` | `tsc --noEmit`                             |

## Project Structure

- `src/app/` — App Router. One folder per route, each `page.tsx` exporting a
  `metadata` object. Routes: `/`, `/about`, `/services`,
  `/ai-automation-robotics`, `/how-we-work`, `/contact`, plus `not-found.tsx`.
- `src/app/layout.tsx` — root layout: fonts, metadata defaults, and the
  persistent chrome (`EventStrip`, `Header`, `Footer`, `ScrollProgress`,
  `CursorGlow`, `RevealObserver`).
- `src/app/globals.css` — Tailwind v4 entry, `@theme` brand tokens, reveal
  animations and hover utilities.
- `src/content/site.ts` — **single source of truth for all copy**: nav, services,
  countries, SEO strings, form fields. Edit content here, not in JSX.
  `COUNTRY_COUNT` / `REGION_COUNT` are derived from `COUNTRIES` — never write
  the figure as a literal. It was hard-coded as "11" in eight places and went
  stale the moment countries were added. `STATS` and `SIX_REASONS` live at the
  bottom of the file so they can read those derived values.
- `src/components/` — shared UI. `ui.tsx` (Button/Section/SectionHeading),
  `sections.tsx` (PageHero/ClosingCTA), plus one file per widget.
- `src/components/globe/` — the WebGL globe (see below).
- `src/lib/hooks.ts` — `useScrollProgress`, `usePrefersReducedMotion`.
- `public/logo.png` — brand mark.
- `docs/` — client-supplied brand PDFs and source imagery.

## Server vs client components

Pages are **server components** so `metadata` works and copy ships as HTML.
Anything using state, effects or the DOM carries `'use client'`:
`Header`, `EventStrip`, `ScrollProgress`, `CursorGlow`, `SpotlightCard`,
`ContactForm`, `RevealObserver`, and everything under `globe/`.

Scroll reveals are driven globally by `RevealObserver` in the layout — pages
just add `reveal`, `reveal-up`, `reveal-left`, `reveal-right` or `reveal-zoom`
classes and an optional `transitionDelay`. No per-page hook needed.

**Reveals are pure CSS — there is no JavaScript involved.** `RevealObserver`
was deleted. Do not reintroduce a JS observer that writes a class or attribute
onto these nodes; that is what caused three separate bugs (a hydration
mismatch, whole sections rendering blank when React bailed on patching the
subtree, and animations firing before the element was on screen). React owns
the DOM it renders, and the layout hydrates before the page segment does, so
any such mutation is a race that cannot be won by adjusting timing.

Where `animation-timeline` is unsupported the rules simply do not apply and
content renders plainly visible — it is structurally impossible for a reveal to
hide anything.

**Three things silently produce "no animation at all" here.** All three were hit
in practice; the symptom is identical each time — content just appears:

1. **`animation-duration` must stay `auto`.** A scroll timeline derives
   progress from the range, not elapsed time. Any real duration makes the
   animation complete instantly at the start of the range.
2. **Do not end `animation-range` inside `entry`.** That phase spans only the
   element's own height of scrolling, hard against the bottom edge of the
   viewport, so a short card finishes animating while still off-screen. The
   range is `entry 0% cover 42%` — `cover` is measured over viewport height
   plus element height, giving the motion room to play where it is seen.
3. **Do not use a heavy ease-out.** With `easeOutExpo` the element sat at ~50%
   opacity the instant it appeared and ~85% before it was properly on screen —
   over before you looked at it. The curve is
   `cubic-bezier(0.34, 1.4, 0.64, 1)`: the `y > 1` control point overshoots the
   end state and settles back, which is what makes the reveal read as a *pop*
   rather than a drift. Measured: scale runs 0.88 → 1.0056 → 1.0.

**Stagger a grid with `stagger(i)` from `components/ui`, never `transitionDelay`
or `animationDelay`.** A scroll-driven animation has no elapsed time, so
`animation-delay` is inert, and `transition-delay` was never addressing the
right property at all — every grid on the site carried one and *nothing* was
staggered; rows popped as a single block. `stagger()` sets `--rv-delay`, which
offsets the whole `animation-range` along the timeline. Pass the **column**
index (`i % 3` in a three-column grid), not the absolute index, so each row
sweeps from the left again. It self-cancels under 640px, where one column has
no columns to stagger.

**The phone gets its own `animation-range`** (`cover 4%` → `cover 26%`). The
`cover` phase spans viewport height *plus element height*, so a percentage of
it grows with the element. Fine for a card in a grid; on a phone that same
markup is one full-width column and a section block can be several screens
tall, so `cover 46%` meant you had read half of it before it finished arriving.
Measured, not guessed: `/services` on a 390px viewport had three reveals still
at 0.29–0.73 opacity after scrolling well past them.

Directional reveals **collapse to the vertical pop under 640px**. Once the grid
is one column there is nothing to arrive *beside*, and a 34px horizontal offset
on a 360px viewport is a stray horizontal scrollbar waiting to happen.
`body { overflow-x: clip }` is the backstop — `clip`, not `hidden`, because
`hidden` makes the body a scroll container and silently breaks every
`position: sticky` element on the site.

The reveals carry **no `filter: blur()`**. Blur read as "out of focus" rather
than "arriving", softened the type while the element settled, and was the most
expensive part to composite. Offset + scale alone carry the motion — matching
the `../share-live` and `../Premium Corporate Website Design` prototypes.

**Do not animate `transform` on a `.spotlight-card`, and do not give it an
inline one.** Its transform is assembled in `globals.css` from two independent
sets of custom properties: `--rv-x/--rv-y/--rv-s` (written by the scroll reveal
keyframes) and `--tilt-x/--tilt-y/--tilt-lift` (written by `SpotlightCard` on
pointer move). Keeping them separate is what lets a card pop in *and* tilt on
hover. The card used to set `transform` inline; because an inline transform
outranks a CSS one, the reveal could not move it at all, so cards could only
fade while every other element popped. The `--rv-*` properties are registered
with `@property` — without that they are unanimatable strings and the pop
silently degrades to a plain fade.

**Never put a reveal class on a `sticky` element.** Once pinned it stops moving
through the viewport, so its entry timeline never advances and the animation
never plays. Wrap the sticky element's contents instead — this is why only the
last service on `/services` used to animate.

**Historic invariants (kept for context, now moot):**

1. **The revealed state is an attribute (`data-revealed`), never a class.**
   These nodes are React-rendered, so React owns their `className`. Adding a
   class imperatively made its vdom disagree with the DOM: that logged a
   hydration mismatch *and* let the next re-render strip the class straight
   back off, hiding the content again. React never renders `data-revealed`, so
   it leaves it alone.
2. **The hidden start-state is gated behind `.js`,** which an inline script in
   `layout.tsx` sets before first paint. If JavaScript fails or is blocked, the
   content renders visible instead of being stuck at opacity 0 forever.
   Check by loading a page with JS disabled — everything must be readable.

`RevealObserver` also sweeps on scroll as a backstop: IntersectionObserver
callbacks are async, so a fast scroll can carry an element through the viewport
before its entry is delivered.

**Never use `reveal-*` above the fold.** Those classes sit at `opacity: 0` until
the observer hydrates, so a hero using them renders as a bare photograph for a
beat before any copy appears. Above-the-fold content uses the CSS-only
`enter-up` / `enter-left` classes (with `animationDelay` to stagger), which run
at first paint with no JS. Verify by loading a page with JavaScript disabled —
the hero must be fully readable.

Other motion pieces: `CountUp` (stats tick up on first view), `TechFlowTimeline`
(the 01-06 spine draws itself and milestones light up as you scroll), and the
back-to-top button in `ScrollProgress`, whose ring doubles as a read-progress
dial. All honour `prefers-reduced-motion`.

## Loading states

Three separate mechanisms, deliberately not one shared spinner:

- **`RouteProgress`** (layout) — top bar during navigation. The App Router has no
  navigation events, so it starts on a click of an internal link and completes
  when `usePathname` reports the new route, easing asymptotically to 90% in
  between. Renders at `z-[60]`, above `ScrollProgress`, and only while
  navigating, so the two never share the strip.
- **`app/loading.tsx`** — segment skeleton shaped like the real page (navy hero
  band, then a content band) so a transition reads as arrival, not a jump.
  **Trade-off:** React swaps a streamed fallback for real content using small
  inline scripts, so with JavaScript fully disabled the skeleton is what stays
  on screen. Slow JS is fine (those scripts run long before hydration) and
  crawlers execute JS — but if no-JS rendering matters, delete this file and
  rely on `RouteProgress` alone.
- **`globe/GlobeLoader.tsx`** — *determinate*, driven by the globe's three real
  stages: chunk download → WebGL context + scene → worker dot cloud. Use
  `GlobeLoader` for the full-size placeholder and `GlobeLoaderInner` to overlay
  a viewport that already exists. Its box matches the globe's own dimensions, so
  swapping in the canvas causes no layout shift.

## Styling

Tailwind CSS v4 via `@tailwindcss/postcss` (see `postcss.config.mjs`). There is
no `tailwind.config.js` — brand tokens are declared with `@theme` in
`src/app/globals.css`, which is what makes `bg-navy`, `text-teal`, `font-display`
etc. work. Fonts (Sora + Manrope) are self-hosted by `next/font/google` in
`layout.tsx` and wired to `--font-sora` / `--font-manrope`.

Palette: `navy #052f45` · `green #2dbe60` · `teal #00c2a8` · `leaf #7dcb45` ·
`sun #ffc107` · `charcoal #26343a` · `mist #f0f8fa`.

## Brand assets

**Logo** — vector, from the client's `../Windleaf Logo.svg`. The wordmark is
already outlined in the source, so the brand typeface is preserved with no font
dependency. `components/Logo.tsx` picks a file based on the surface behind it:

- `<Logo />` → `public/logo.svg`
- `<Logo onDark />` → `public/logo-dark.svg`, the same artwork with the navy
  wordmark (`#022c4f`) recoloured white and the strapline lightened, because the
  original disappears against navy.

Both are the supplied SVG with one change: the full-bleed white backing
`<path d="M1282.18 0H0V503.18…" fill="white"/>` is deleted so it sits on any
surface. **Do not "also" strip a white `<rect>`** — the `clipPath` that gates the
entire drawing contains a `1283x504` white rect, and removing it empties the clip
region so the browser renders nothing. (librsvg tolerates this; Chrome does not,
which is exactly how it shipped broken once.) Any regeneration script should
assert the clipPath still has geometry before writing.

`next/image` is used with `unoptimized`, since vectors need no raster pass and
that avoids enabling `dangerouslyAllowSVG` in `next.config.ts`.

**Hero video** — `HERO_VIDEO` in `content/site.ts` points at `public/hero.mp4`
(2.8 MB, 1920x1080, H.264, 14.6 s silent loop). `components/HeroBackdrop.tsx`
owns both layers: `public/hero-poster.jpg` (a frame from the same footage) and
the video.

**The poster and the video must never be visible at the same time.** They show
the same scene, so a semi-transparent video over a static frame of itself
double-exposes the moving blades against frozen ones — a real bug that shipped
briefly. `HeroBackdrop` cross-fades: the poster goes to opacity 0 exactly as the
video reaches `canplay`. Keep that invariant if you touch this.

A missing file, unsupported codec, blocked autoplay, `prefers-reduced-motion` or
Data Saver all leave the poster showing. The video **does** play on phones.
Set `HERO_VIDEO` to `null` to force the still image.

`hero-poster.jpg` is extracted from **frame 0** of `hero.mp4`, not an arbitrary
timestamp. The video starts at 0, so any other frame makes the hand-off show a
visible jump in the footage.

Both layers sit inside one transformed wrapper that drifts at 0.28x scroll speed
for parallax, scaled 1.18 so the drift never exposes an edge. They must share
that wrapper — transforming them separately shears one against the other mid
cross-fade. Every hero photo also needs `object-position` biased right on narrow
screens; the subject sits right of centre and a centred crop discards it.

Re-encoding from a new master (source was 3840x2160 at 79 Mbps, 139 MB):

```
ffmpeg -i master.mov -vf "hflip,scale=1920:-2" -c:v libx264 -profile:v high \
  -level 4.0 -crf 26 -preset slow -g 60 -pix_fmt yuv420p \
  -movflags +faststart -an -y public/hero.mp4
```

`-an` drops audio (the element is muted anyway), `+faststart` moves the index to
the front so it streams, and `hflip` mirrors the shot so the turbine sits in the
open right-hand side instead of behind the headline. Check the sky for banding
after any CRF change — large smooth gradients are where it shows first.

## The 3D globe

Live on `/about`, above `GlobalReach` — the globe is the visual, and the cards
below carry the same data as indexable text (a canvas is neither crawlable nor
accessible, so don't remove them in its favour).

A Stripe/GitHub-style dotted Earth built on raw Three.js (no react-three-fiber).

### Performance — three constraints, each measured

Mounting it naively cost **1211 ms** of blocking on `/about`. It is now **17 ms
at page load**. If you touch this, keep all three mechanisms:

1. **`GlobeMount` waits for the viewport.** An `IntersectionObserver` with a
   500px `rootMargin` gates the `next/dynamic` import, so nothing WebGL happens
   during page load or hydration. This is the single biggest win: bringing up a
   WebGL context costs ~200 ms and compiling the shaders another ~140 ms, both
   driver-side and unavoidable for *any* WebGL renderer — a smaller library
   would not help. The only way to dodge them is to not do them during load.
2. **Dot generation runs in a worker** (`globe.worker.ts` → `land-dots.ts`).
   ~6,500 dots from 26k samples, ~45 ms, entirely off the main thread; the
   buffers are *transferred*, so `applyDots` costs 0 ms. `land-dots.ts` must
   stay free of any three.js import or the worker bundle drags in the renderer.
3. **Markers and arcs build on later frames** via `defer()`. Built inline they
   pushed construction past 300 ms; split up, no task crosses the 50 ms
   long-task threshold. Scene construction is now ~7 ms of actual work.

Also: pixel ratio is capped at 1.5 (not 2), glow sprites are memoised per colour
(11 beacons, 3 colours), and phones get 45% of the dot density.

Land is tested with point-in-polygon plus bounding-box rejection rather than
rasterising a mask into a canvas — that kept the work worker-safe without
needing `OffscreenCanvas`.

- `land-mask.ts` — **generated, do not hand-edit.** A 640x320 1-bit
  equirectangular land mask baked from Natural Earth 1:50m data (the
  `world-atlas` package), stored base64 (~33 KB). Lookup is O(1), which is what
  makes filtering the dot cloud cheap. It replaced hand-drawn coastline
  polygons that were too coarse — continents read as blobs and markers didn't
  line up with land. If regenerating, three things must be handled or the map
  comes out wrong: test each polygon as *exterior minus holes* (XOR-ing all
  rings together makes unrelated landmasses cancel), drop degenerate wrap
  slivers (one 43-point ring spanning -180..180 but only 0.8 deg tall painted a
  solid false band across the Arctic), and verify land coverage lands near
  29% (or ~23% with Antarctica trimmed).
- `land-dots.ts` — the dot generator. **No three.js import** (the worker
  depends on this).
- `globe.worker.ts` — runs `generateLandDots` off the main thread.
- `globe-geo.ts` — lat/lon ↔ vector maths, great-circle arcs and the beacon glow
  texture. **No external textures or map tiles**, so it renders offline and
  can't be CORS-blocked.
- `globe-scene.ts` — the whole WebGL lifecycle in one framework-free class:
  dot-matrix point cloud (Fibonacci lattice filtered by the land mask), opaque
  core sphere, fresnel atmosphere, starfield, beacons with pulsing halos, and
  animated great-circle arcs radiating from the Singapore hub. Auto-pauses via
  `IntersectionObserver` + `visibilitychange`, honours `prefers-reduced-motion`,
  and tears everything down in `dispose()`.
- `Globe.tsx` — React wrapper. `variant="hero"` is chrome-free ambient motion
  (home hero); `variant="interactive"` adds the region filter, HUD inspector and
  country dock (about page).
- `GlobeMount.tsx` — **always import the globe through this.** It `next/dynamic`s
  with `ssr: false` *and* holds back the import until the viewport approaches.

**Loading and revealing are two different moments — keep them apart.** The globe
starts building 500px early (that is the whole performance mechanism above), but
it does not *appear* until the frame is fully on screen, gated by
`useFullyInView` in `Globe.tsx`. Without that split the fade ran while half the
sphere was still below the fold, so you scrolled into an animation that was
already finishing.

**The bar is split 55/45 between work and scroll, and the lopsidedness is the
point.** The three build stages finish in well under a second while the scroll
into view takes as long as the reader takes. Letting the stages span the whole
bar — which they originally did, reaching 88% — made it fill instantly and then
inch: all the visible motion was in the wrong place. Building now compresses
into the first 55% (`stageValue(stage) * 0.55`) and the remaining 45% is driven
by how far the globe has come into view, so it completes exactly as the globe
appears. Both halves are monotonic and the handover at `ready` moves forwards;
`useFullyInView` also clamps `progress` against its own previous value, so
scrolling back up cannot drain a bar that has already filled.

Do not gate on `intersectionRatio >= 1` alone: an element taller than the
viewport can never reach it and the loader would sit at 100% forever. The
threshold is how much of the element *could* be on screen at once
(`innerHeight / height`), and the observer needs a dense threshold ladder,
because the trigger point is computed in the callback rather than declared.

Country coordinates live in `COUNTRIES` in `src/content/site.ts`. When adding
one, check its `lat`/`lon` actually falls on a land polygon — otherwise the
beacon floats over the ocean. (`GlobalReach.tsx` reads the same `COUNTRIES`
array, so content stays in one place either way.)

Two gotchas worth remembering if you re-enable it:

- Hand-written shaders write straight to the sRGB framebuffer with no output
  encode, so their uniform colours must be built with the `srgb()` helper, not
  `new THREE.Color(hex)` — the latter converts to the linear working space and
  crushes darks to near-black. Built-in materials do get the encode and use the
  normal managed path.
- `applyDots` installs `BufferAttribute`s over the worker's transferred
  `Float32Array`s. Don't copy them back into plain arrays.

## Gotchas

**Never edit source files via PowerShell `Get-Content`/`Set-Content`.** On
Windows PowerShell 5.1 `Get-Content` reads BOM-less UTF-8 as ANSI and
`Set-Content -Encoding utf8` writes a BOM, so a round-trip double-encodes every
non-ASCII character (`—` becomes `â€"`) and prepends a BOM. Use the Edit tool.

**Hero photography** — client-supplied stock, downscaled to 2000px wide and
mozjpeg-encoded (each 49-152 KB, from 4-9 MB originals):

| File | Page | Mirrored? |
| ---- | ---- | --------- |
| `about-engineer-wind-farm.jpg` | `/about` | yes |
| `services-wind-farm-sunset.jpg` | `/services` | yes |
| `how-we-work-engineers-inspection.jpg` | `/how-we-work` | no |
| `technology-hero.jpg` | `/ai-automation-robotics` | no |
| `contact-hero.jpg` | `/contact` | no |

`PageHero` lays the copy over the left half, so the subject has to sit on the
right — that is the only reason any of them are mirrored. Check composition
before adding a new one rather than mirroring by default.

## Country flags

**Never render `country.flag` as text.** The emoji in `COUNTRIES` is fine as
*data* but is not a way to *draw* a flag: Windows ships no colour flag glyphs
at all, so Segoe UI Emoji renders the regional-indicator pair as two boxed
letters or nothing. The same build showed flags on every phone and blanks on
most desktops. Use `<Flag emoji={country.flag} name={country.name} />`, which
serves a real SVG from `public/flags/`.

The ISO code is derived from the emoji (a regional indicator is just the letter
offset into a private block), so `site.ts` stays the single source of truth and
nothing has to be kept in sync. Adding a country means dropping one more SVG
into `public/flags/<iso>.svg` — they came from the `country-flag-icons`
package's `3x2` directory, which is not a runtime dependency and is not
installed.

## Horizontal rails

`ScrollRail` is the shared implementation for everything that scrolls sideways:
the service chips, the project cards, and the globe's country dock. Arrows
disable at each end, edge fades only render on the side with more content, and a
`ResizeObserver` re-syncs when content reflows without the window resizing — a
font landing or an image settling would otherwise leave the arrows lying about
what is reachable. The arrows are additive: remove them and touch, drag and
keyboard scrolling all still work.

**No edge fades.** A white gradient over a white page is invisible in itself —
what it actually does is erase the border and label of the chip beneath it,
which reads as a white box eating the edge of the rail. The washing-out was the
point when the country dock was an auto-scrolling marquee and content streamed
past it; on a rail the reader controls, it only hides things, and the arrows
already say there is more.

Arrows flank the rail — one either side, in reserved 36px columns that stay put
whether or not there is anything to scroll, so the rail does not jump sideways
the moment its content starts overflowing on resize. Only the buttons come and
go; a permanently greyed-out arrow reads as broken rather than as "nothing to
scroll here".

**Drag-to-scroll binds only for `pointerType === 'mouse'`.** Touch already
swipes natively with momentum; capturing a touch pointer would replace that with
a worse hand-written version. Two details that are easy to lose: `scroll-smooth`
must come off while dragging (it eases toward each `scrollLeft` we set and lags
the cursor), and a drag that crossed a card would fire that card's click on
release — `pointerup` runs *before* `click`, so the suppression flag has to
outlive the drag state rather than being read from it.

**The country dock was a marquee and must not go back to being one.** It
auto-scrolled inside an `overflow-hidden` box with the list duplicated, which
meant the countries off either edge were unreachable — you waited for them to
come round, and on a phone there was nothing to swipe at all. The
`marquee-scroll` keyframes and `.marquee*` classes were deleted with it.

## SEO and deployment

The live domain is written in exactly one place: `NEXT_PUBLIC_SITE_URL`, read
via `src/lib/site-url.ts`. `metadataBase`, every canonical tag, `sitemap.ts`,
`robots.ts` and the JSON-LD all derive from it. Do not hard-code a domain
anywhere else.

Preview and development builds serve `noindex` — in `robots.txt` *and* as a
meta tag, because robots.txt only stops a re-crawl while the meta tag is what
removes a URL that was already indexed. A crawled Vercel preview competes with
the live site for identical content.

`DELIVERY.md` holds the launch checklist: domain, DNS, email delivery
(the enquiry form has no backend yet), SPF/DKIM/DMARC, and Search Console.

## Known placeholders

Contact email, phone and address are `[To be provided]` in `site.ts`; the event
dates/venue on the Technology page banner are placeholders; the founder photo is
a monogram; gallery images are Unsplash stand-ins; `public/hero.mp4` does not
exist yet. `metadataBase` in `layout.tsx` points at `https://windleaf.example.com`
and must be set to the real domain before launch.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
