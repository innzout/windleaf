# Plan: Windleaf Brand Color Update + Hero Images

## Context

The attached image is the official Windleaf Energy Solutions brand color palette document. It reveals that the current color tokens in `src/index.css` are **close but wrong** — they were guesses that diverge from the official brand hex values. The user wants:
1. Color tokens corrected to the official brand palette from the attachment
2. The Windleaf logo in the Header updated to better reflect the actual circular brand logo
3. Relevant wind turbine Unsplash photos added to the Home hero section and other key sections

The user also requested "no need fill any were" — meaning keep the white-dominant layout, only apply color where purposeful, not flood sections with brand colors.

---

## Changes

### 1. `src/index.css` — Update `@theme` color tokens

Replace current tokens with official brand values from the palette image:

| Token | Old value | New value |
|---|---|---|
| `--color-navy` | `#102a35` | `#052f45` |
| `--color-navy-700` | `#17323e` | `#063a52` |
| `--color-green` | `#4f9f3a` | `#2dbe60` |
| `--color-forest` | `#2f6f35` | `#1f8a4c` (darker green, for hover states) |
| `--color-teal` | _(missing)_ | `#00c2a8` (Gradient/Accent) |
| `--color-sky` | `#5c9eaf` | `#00afc1` (Sky Blue) |
| `--color-leaf` | `#b8d98a` | `#7dcb45` (Light Green) |
| `--color-sun` | _(missing)_ | `#ffc107` (Sun Yellow) |
| `--color-mist` | `#f5f7f8` | `#f0f8fa` (Light Background) |
| `--color-hairline` | `#e1e7ea` | `#e5e7eb` (Border/Divider) |
| `--color-blade` | `#aeb9be` | keep as-is |
| `--color-charcoal` | `#26343a` | keep as-is |
| `--color-soft` | `#e8edf0` | keep as-is |

Also update the `brand-gradient` utility to use the official logo gradient: `#00c2a8 → #052f45`.

### 2. `src/components/Header.tsx` — Logo SVG

Update the `Logo` SVG to better match the actual circular Windleaf brand mark:
- Circular background with teal-to-navy radial/linear gradient
- White turbine blades (3 blades)
- Yellow sun circle (top)
- Green land/hill at bottom
- Update inline fill colors in the SVG paths to use the correct brand values
- Keep `"Windleaf"` text in `#052f45` navy

### 3. `src/pages/Home.tsx` — Hero section with Unsplash photo

The hero currently shows a spinning `BladeMotif` SVG on desktop (right column). Replace/supplement this with a real wind turbine photo:
- **Photo selected**: `https://images.unsplash.com/photo-1683398092593-3be3697432bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080` — wind turbines in green field under cloudy sky (landscape, strong)
- Add it as an `<img>` in the right column of the hero grid with `rounded-2xl overflow-hidden object-cover` styling
- On mobile: show image below the copy block instead of the old BladeMotif div
- Keep the spinning BladeMotif as a subtle overlay/watermark in the background if desired, or remove it

### 4. `src/pages/About.tsx` — Founder photo placeholder → styled teaser

The `image.png` is the brand palette doc, not a founder photo. Keep the styled placeholder (`KM` initials in navy circle) but give it a slightly more polished treatment — add a background pattern or teal-accent border using the updated brand colors.

### 5. Additional section photo (Services or How We Work)

Use a second Unsplash photo on the Services page or Home "Technology Preview" section to make the site feel more image-rich:
- **Photo**: `https://images.unsplash.com/photo-1630707813459-e48e30af57bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080` — single white wind turbine, portrait, dramatic angle

---

## Files to Edit

| File | Change |
|---|---|
| `src/index.css` | Update `@theme` color tokens + `brand-gradient` |
| `src/components/Header.tsx` | Update Logo SVG fill colors to brand palette |
| `src/pages/Home.tsx` | Replace desktop BladeMotif with Unsplash hero image |
| `src/pages/About.tsx` | Minor styling tweak on founder placeholder using new tokens |
| `src/pages/Services.tsx` | Add a hero/banner photo if structure allows (read first) |

---

## Verification

- Open preview; confirm header logo colors look correct against the brand palette document
- Confirm hero photo renders in the right column on desktop, below copy on mobile
- Confirm all green/teal/navy text and buttons still have sufficient contrast on white bg
- Check About page founder placeholder still renders cleanly
