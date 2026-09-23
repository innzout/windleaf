import type { ReactElement } from 'react'
import { TECH_FLOW } from '@/content/site'
import { TechFlowTimeline } from './TechFlowTimeline'

const ICONS: Record<string, ReactElement> = {
  '01': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L9 9H2l6 4.5L5.5 21 12 16l6.5 5L16 13.5 22 9h-7L12 2z" />
    </svg>
  ),
  '02': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="15" height="12" rx="2" />
      <circle cx="9.5" cy="13" r="2.5" />
      <path d="M17 9l5-3v12l-5-3" />
    </svg>
  ),
  '03': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v5c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 10v5c0 1.66 4.03 3 9 3s9-1.34 9-3v-5" />
    </svg>
  ),
  '04': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46L5 12" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5" />
      <path d="M19 12a2 2 0 0 1 0 4" />
      <path d="M5 12a2 2 0 0 0 0 4" />
      <path d="M12 19.5V22" />
    </svg>
  ),
  '05': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
      <path d="M15 3a3 3 0 0 1 0 6" />
      <path d="M19 19c0-3-1.8-5.5-4-6.4" />
    </svg>
  ),
  '06': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12l2 2 4-4" />
      <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.51 0 2.93.37 4.18 1.03" />
      <path d="M22 4l-5.5 5.5" />
      <path d="M17 4h5v5" />
    </svg>
  ),
}

/** Every node uses the same teal; the connector carries the dark navy. */
const NODE_COLOUR = '#00c2a8'
const LINE_COLOUR = '#052f45'

/** Compact inline list for the home page preview. */
function CompactFlow() {
  return (
    <ol className="flex flex-col">
      {TECH_FLOW.map((step, i) => {
        const isLast = i === TECH_FLOW.length - 1

        return (
          <li key={step.num} className="flex items-stretch gap-4">
            {/* All six nodes read identically; the connector is the dark
                navy so the chain between them is clearly visible. */}
            <div className="flex w-10 shrink-0 flex-col items-center">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
                style={{
                  backgroundColor: NODE_COLOUR,
                  boxShadow: `0 0 0 4px ${NODE_COLOUR}22`,
                }}
              >
                {ICONS[step.num]}
              </span>
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="w-[3px] flex-1 rounded-full"
                  style={{
                    minHeight: 20,
                    // Solid here, unlike the Technology timeline. The nodes sit
                    // close together in this compact list, so a dotted rule
                    // rendered as two or three stray dots per gap and read as
                    // broken rather than continuous.
                    backgroundColor: NODE_COLOUR,
                  }}
                />
              )}
            </div>

            <div className="pb-6 pt-1.5">
              <span
                className="font-display text-[11px] font-bold tracking-[0.18em]"
                style={{ color: LINE_COLOUR, opacity: 0.45 }}
              >
                {step.num}
              </span>
              <p className="font-display text-base font-semibold leading-tight text-navy">
                {step.title}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/** Full roadmap view — alternating milestones that draw themselves on scroll. */
export function TechFlow({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  if (variant === 'compact') return <CompactFlow />

  // The icons live here, in a server component, and are handed to the client
  // timeline as props so this SVG markup stays out of the client bundle.
  return <TechFlowTimeline icons={ICONS} colours={TECH_FLOW.map(() => NODE_COLOUR)} />
}
