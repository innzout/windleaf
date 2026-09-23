'use client'

export type GlobeStage =
  | 'idle'
  | 'downloading'
  | 'initialising'
  | 'generating'
  | 'ready'

const STAGES: Record<
  Exclude<GlobeStage, 'ready'>,
  { label: string; value: number }
> = {
  idle: {
    label: 'Preparing',
    value: 6,
  },
  downloading: {
    label: 'Loading renderer',
    value: 34,
  },
  initialising: {
    label: 'Starting WebGL',
    value: 66,
  },
  generating: {
    label: 'Mapping locations',
    value: 88,
  },
}

/**
 * The percentage a build stage alone represents.
 *
 * Exported so the caller can rescale it. The three build stages complete in a
 * fraction of a second while the scroll into view takes as long as the reader
 * takes, so leaving them spanning the whole bar made it jump to nearly full
 * instantly and then crawl — the visible motion was in the wrong place.
 */
export const stageValue = (stage: GlobeStage) =>
  stage === 'ready' ? 100 : STAGES[stage].value

export function GlobeLoader({
  stage,
  countryCount,
}: {
  stage: GlobeStage
  countryCount?: number
}) {
  return (
    <div
      className="flex w-full items-center justify-center rounded-3xl border border-navy/20"
      style={{
        aspectRatio: '16/9',
        minHeight: '460px',
        maxHeight: '640px',
        background:
          'radial-gradient(circle at 50% 45%, #0a3348 0%, #051f2e 55%, #020d16 100%)',
      }}
    >
      <GlobeLoaderInner
        stage={stage}
        countryCount={countryCount}
      />
    </div>
  )
}

export function GlobeLoaderInner({
  stage,
  countryCount,
  value: valueOverride,
  label: labelOverride,
}: {
  stage: GlobeStage
  countryCount?: number
  /**
   * Overrides the stage's own percentage. Used once the scene is built but the
   * globe is not yet fully on screen: the three build stages complete in a
   * fraction of a second, so without this the bar jumps to 100% and then sits
   * there for the whole scroll. The caller drives the tail from how far the
   * globe has come into view instead.
   */
  value?: number
  label?: string
}) {
  const stageState =
    stage === 'ready'
      ? {
          label: 'Ready',
          value: 100,
        }
      : STAGES[stage]

  const value = Math.round(valueOverride ?? stageState.value)
  const label = labelOverride ?? stageState.label

  const generatingLabel =
    stage === 'generating' && countryCount
      ? `Mapping ${countryCount} locations`
      : label

  return (
    <div
      className="flex w-64 flex-col items-center gap-5"
      role="status"
      aria-live="polite"
      aria-label={`Loading interactive globe — ${generatingLabel}`}
    >
      <svg
        viewBox="0 0 80 80"
        className="h-20 w-20 text-teal/35"
        aria-hidden="true"
      >
        <circle
          cx="40"
          cy="40"
          r="30"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />

        <ellipse
          cx="40"
          cy="40"
          rx="12"
          ry="30"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />

        <line
          x1="10"
          y1="40"
          x2="70"
          y2="40"
          stroke="currentColor"
          strokeWidth="1.2"
        />

        <ellipse
          cx="40"
          cy="40"
          rx="30"
          ry="11"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />

        <circle
          cx="40"
          cy="40"
          r="30"
          fill="none"
          stroke="#00c2a8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="188.5"
          strokeDashoffset={188.5 * (1 - value / 100)}
          transform="rotate(-90 40 40)"
          style={{
            transition: 'stroke-dashoffset 500ms ease-out',
          }}
        />
      </svg>

      <div className="w-full">
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal via-green to-leaf transition-[width] duration-500 ease-out"
            style={{ width: `${value}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] font-medium tracking-wide text-teal/70">
          <span className="uppercase">
            {generatingLabel}
          </span>

          <span className="font-mono tabular-nums">
            {value}%
          </span>
        </div>
      </div>
    </div>
  )
}