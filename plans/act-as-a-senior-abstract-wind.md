# Windleaf Energy Solutions — Premium Corporate Website

## Context
The client (Windleaf Energy Solutions, an independent wind-turbine-blade engineering
consultancy) supplied two source documents: a complete page-by-page content draft
(6 website pages) and a brand color-palette + typography spec. The current app
(`src/App.tsx`) is an empty scaffold. The goal is to build the full premium, international,
B2B-technical corporate website, faithfully using the supplied copy and brand system.

Source material is authoritative:
- **Content**: `Windleaf_Website_Rewrite_Content.pdf` — Home, About, Services, AI/Automation & Robotics, How We Work, Contact, plus SEO metadata per page.
- **Brand**: `Windleaf_Color_Palette_and_Typography.pdf` — exact hex tokens, Sora (headings) + Manrope (body), type scale, CTA/card rules, 70/15/10/5 color balance.

## Design System (from brand PDF — source of truth, overrides default aesthetic choices)
Wire as CSS custom properties + Tailwind v4 `@theme` tokens in `src/index.css`:
- Colors: Deep Navy `#102A35`, Windleaf Green `#4F9F3A`, Blade Silver `#AEB9BE`,
  Soft Silver `#E8EDF0`, White `#FFFFFF`, Forest Green `#2F6F35`, Light Leaf `#B8D98A`,
  Sky Blue `#5C9EAF`, Charcoal `#26343A`, Mist `#F5F7F8`. Card border `#E1E7EA`.
  Brand gradient `#2F6F35 → #8FC65A → #DCE3E6`.
- Fonts: **Sora** (400/500/600/700) headings/stats; **Manrope** (400/500/600/700) body/nav/buttons.
  Both are Google Fonts — add via Google Fonts CSS2 `@import` at the very top of `index.css`
  (before `@import 'tailwindcss'`), then set font-family theme tokens.
- Type scale, radius (CTA 6–8px, cards 12–16px), and color balance per the spec.
- CTA style: navy bg, white text, hover → green. Cards: Mist/Soft-Silver bg, `#E1E7EA` border,
  navy heading, green accent.

Before writing UI, invoke the `aesthetic-stance` skill (no Make Kit present) and call
`create_make_theme` once with a short brief; the supplied brand PDF constrains tokens/fonts,
so treat the skill output as craft/layout guidance layered on the fixed brand system.

## Architecture
Use **react-router** (load the `react-router` skill first; install `react-router-dom`).
6 routes matching the SEO web addresses:
`/` (Home), `/about`, `/services`, `/ai-automation-robotics`, `/how-we-work`, `/contact`.

File structure under `src/`:
- `main.tsx` — wrap `<App/>` in `<BrowserRouter>` (keep existing `index.css` import).
- `App.tsx` — app shell: sticky `Header` (nav: Home · About · Services · Technology ·
  How We Work · Contact + persistent "Discuss Your Project" CTA), `<Routes>`, `Footer`,
  and the site-wide "Meet Windleaf at Windergy India 2026" event banner (dismissible strip
  above header). `ScrollToTop` on route change.
- `src/components/` — shared: `Header`, `Footer`, `EventBanner`, `Button` (navy→green CTA),
  `Card`, `SectionHeading`, `StatBox`, `WorldMap` (SVG-based 11-country project map),
  `TechFlow` (Blade → Camera/Robot → Data → AI → Windleaf Engineer → Engineering Solution
  animated-on-scroll flow, reused compact on Home + full on Tech page), `StatusTag`
  (Current / Current & developing / In development), `BladeMotif` (silver aerodynamic
  wing/blade SVG graphic used in heroes).
- `src/pages/` — `Home`, `About`, `Services`, `Technology`, `HowWeWork`, `Contact`.
- `src/content/site.ts` — typed constants for all copy (services array of 8, six reasons,
  stats, experience strips, countries, values, process steps, form field defs, SEO metadata)
  so pages stay declarative and DRY.
- `src/lib/seo.ts` — small hook to set `document.title` + meta description per page from
  the SEO data in the content draft.

## Page content mapping (all copy verbatim from the PDF)
- **Home**: hero (label "Independent Blade Engineering", H1, subhead, TEXT, two CTAs) with
  silver blade motif → Experience Highlights (17+/11/8 stat boxes + OEM/Independent/IPP
  experience strip + "not a client list" note) → What We Do (3 cards) → Why Choose Windleaf
  (6 reasons grid) → Technology Preview (compact TechFlow) → closing CTA "Facing a Critical
  Blade Decision?".
- **About**: hero → Founder (K. Muruga Ganesh, title, 3 paras, photo placeholder) →
  Professional Experience (3 large cards) → Global Project Experience Map (11 countries +
  chip list + text) → Technical Philosophy → Vision → Core Values (4 points) + CTA.
- **Services**: hero + quick-link nav (8 anchors incl. "Our Work in Practice") → Our Work in
  Practice (6-image project gallery with captions + project-example card + "Discuss a Similar
  Project") → the 8 services as anchored sections (Design & Engineering has 3 boxes +
  support list; each service: subhead, text, service list, "Experience behind it" callout,
  CTA) → closing CTA "Not Sure Which Service You Need?".
- **Technology (AI, Automation & Robotics)**: hero (2 CTAs) → How It Works main flow
  (full-width 6-step TechFlow, scroll-animated centrepiece, "Technology captures & analyses"
  vs "Engineers verify & decide" split) → Why It Matters (5 points) → capability sections
  with status tags (Camera & Robotic = Current; AI Data Analytics = Current & developing;
  Robotic Internal Inspection & AI Early Defect = In development) → Innovation in Progress
  list → closing statement "Technology supports our engineers…" → embedded event banner.
- **How We Work**: hero → How a Project Works (6 numbered steps) → Ways to Work (3 cards) →
  Why Choose Windleaf (6 short reasons) → closing CTA.
- **Contact**: hero → Enquiry form (all 11 fields with placeholders, Area of Interest select
  with 9 options, file attach, submit; client-side validation + success/error messages from
  copy) → Get in Touch details (placeholders as provided).

Placeholders in the draft ([To be provided], [PROJECT PHOTO], event dates/venue/stand) are
rendered as clearly-styled placeholder states, not invented data. Project gallery photos use
the SEO image-description captions; source real imagery via Unsplash (wind turbine blades /
manufacturing / inspection) for gallery/hero atmosphere where a photo is expected.

## Visual craft
White-dominant premium technical aesthetic; navy structural elements; green used sparingly
(≈5%) for CTAs/accents; silver aerodynamic blade SVG motifs and subtle brand-gradient washes;
generous whitespace; alternating White/Mist section backgrounds; responsive (mobile nav
drawer, gallery/stat grids reflow, TechFlow becomes vertical on mobile). Scroll-reveal
animations on stat boxes and the tech flow.

## Verification
- Dev server already runs on `$PORT`; rely on HMR.
- `npx tsc --noEmit` for type check after the content/model files land.
- Manually click through all 6 routes + nav + every CTA cross-link; test the contact form
  validation and success/error states; verify mobile layout at narrow width.
- Confirm fonts load (Sora/Manrope) and brand tokens render (navy headings, green CTA hover).

## Open items (using placeholders, not blocking)
Real project photos, project-example specifics, exact partner name/logo for Apex Wind Denmark,
Windergy India 2026 event details, and official contact details are marked "to be provided" in
the draft — rendered as tasteful placeholders per the document's "Please Confirm" list.
