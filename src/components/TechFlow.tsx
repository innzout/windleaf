import type { ReactElement } from 'react'
import { TECH_FLOW } from '@/content/site'
import { TechFlowTimeline } from './TechFlowTimeline'

const ICONS: Record<string, ReactElement> = {
  // 01: Wind turbine blade — Clean 3-blade aerodynamic wind turbine
  '01': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8.5" r="1.8" fill="currentColor" fillOpacity="0.25" />
      <path d="M12 6.7V1.8c.8 1.1 1 2.8 0 4.9z" fill="currentColor" fillOpacity="0.15" />
      <path d="M13.5 9.5l4.2 2.4c-.6.9-2 1.9-4.2.2z" fill="currentColor" fillOpacity="0.15" />
      <path d="M10.5 9.5L6.3 11.9c-.2-1.1.8-2.6 4.2-2.4z" fill="currentColor" fillOpacity="0.15" />
      <path d="M11 10.5L9.5 21.5h5L13 10.5" />
      <path d="M8 21.5h8" />
    </svg>
  ),
  // 02: Inspection & Data — Precision optical lens with NDT ultrasonic signal waveform
  '02': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7.5" />
      <path d="M21 21l-4.5-4.5" />
      <path d="M7 11h2l1.5-3 1.8 6 1.4-3h2.3" />
    </svg>
  ),
  // 03: Engineering Analysis — Precision technical drafting compass & structural measurement
  '03': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4.5" r="2" />
      <path d="M12 6.5v2" />
      <path d="M6.5 21.5l4.5-12.5M17.5 21.5l-4.5-12.5" />
      <path d="M8.5 15.5h7" />
      <path d="M10 13.5a3 3 0 0 1 4 0" />
    </svg>
  ),
  // 04: Technical Assessment — Diagnostic integrity gauge / performance dial with verification
  '04': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21a9 9 0 1 1 8.5-6" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" fillOpacity="0.25" />
      <path d="M12 12l3.8-3.8" />
      <path d="M16 16.5l2 2 4-4" />
    </svg>
  ),
  // 05: Windleaf Engineering — Independent Certified Engineer Hard Hat
  '05': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 17.5h20" />
      <path d="M4 17.5a8 8 0 0 1 16 0" />
      <path d="M10 9.5a2 2 0 0 1 4 0v2h-4v-2z" fill="currentColor" fillOpacity="0.25" />
      <path d="M9 14h6" />
    </svg>
  ),
  // 06: Engineering Solution — Precision repair tool with verified solution check badge
  '06': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-5.5 5.5" />
      <path d="M3 21l3.5-3.5" />
      <circle cx="17.5" cy="17.5" r="4.5" fill="currentColor" fillOpacity="0.15" />
      <path d="M15.5 17.5l1.5 1.5 3-3" />
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
              {step.body && (
                <p className="mt-1 text-xs text-charcoal/70">
                  {step.body}
                </p>
              )}
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
