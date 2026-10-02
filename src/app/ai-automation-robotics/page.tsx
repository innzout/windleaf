import type { Metadata } from 'next'
import { SEO, WHY_IT_MATTERS, INNOVATION_LIST, CAPABILITY_PILLARS } from '@/content/site'
import { Button, Section, SectionHeading, stagger } from '@/components/ui'
import { PageHero } from '@/components/sections'
import { TechFlow } from '@/components/TechFlow'
import { StatusTag } from '@/components/StatusTag'
import { EventBanner } from '@/components/EventBanner'
import { HAS_EVENTS } from '@/lib/events'
import { SpotlightCard } from '@/components/SpotlightCard'

export const metadata: Metadata = {
  title: SEO.tech.title,
  description: SEO.tech.description,
  alternates: { canonical: '/ai-automation-robotics' },
}

export default function TechnologyPage() {
  return (
    <>
      <PageHero
        eyebrow="AI, Automation & Robotics"
        title="Intelligent Technology for Wind Turbine Blades"
        sub="Combining blade engineering expertise with AI, advanced inspection and robotics to detect potential structural and manufacturing issues earlier."
        bgImg="/technology-hero.jpg"
      >
        <Button to="/contact" variant="green" className="group px-7 py-4 text-base">
          Talk to Our Engineers
        </Button>
      </PageHero>

      {/* Main flow — centrepiece */}
      <Section tone="white">
        <div className="reveal-up">
          <SectionHeading
            eyebrow="How It Works — Main Flow"
            title={
              <>
                <span className="block">Technology captures.</span>
                <span className="block">Engineering interprets.</span>
                <span className="block">Windleaf delivers.</span>
              </>
            }
            sub="Wind Turbine Blade → Inspection & Data → Engineering Analysis → Technical Assessment → Windleaf Engineering → Engineering Solution"
          />
        </div>
        {/* No reveal wrapper — the timeline drives its own scroll animation. */}
        <div className="mt-12">
          <TechFlow variant="full" />
        </div>

        <div className="mt-8 rounded-2xl border border-hairline bg-mist/60 px-6 py-5 text-center">
          <p className="font-display text-base font-semibold leading-relaxed text-navy sm:text-lg">
            We use advanced inspection technologies, engineering analysis and field data to understand blade condition. Our engineers interpret the evidence and deliver independent, technically sound recommendations and practical solutions.
          </p>
        </div>
      </Section>

      {/* Why It Matters */}
      <Section tone="white">
        <div>
          <SectionHeading
            eyebrow="Why It Matters"
            title="Why Independent Engineering Matters"
            sub="Technology captures anomalies and processes data at speed — but critical blade decisions require independent engineering judgement, structural analysis, and practical solutions."
          />
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {WHY_IT_MATTERS.map((point) => (
            <SpotlightCard
              key={point.title}
              spotlightColor="rgba(45, 190, 96, 0.16)"
              className="rounded-2xl border border-hairline bg-white p-7 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-navy">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{point.body}</p>
            </SpotlightCard>
          ))}
        </div>
      </Section>

      {/* Capabilities — 3 Pillars matching Technology Captures, Engineering Interprets, Windleaf Delivers */}
      <Section tone="mist">
        <div>
          <SectionHeading
            eyebrow="THREE CORE PILLARS"
            title="Current & Developing Capabilities"
            sub="How advanced technology and independent blade engineering unite across our three core pillars."
          />
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {CAPABILITY_PILLARS.map((pillar) => {
            const accentBorder =
              pillar.accent === 'teal'
                ? 'border-t-teal'
                : pillar.accent === 'leaf'
                  ? 'border-t-green'
                  : 'border-t-navy'

            const accentBadge =
              pillar.accent === 'teal'
                ? 'bg-teal/10 text-teal border-teal/20'
                : pillar.accent === 'leaf'
                  ? 'bg-green/10 text-forest border-green/20'
                  : 'bg-navy/8 text-navy border-navy/20'

            return (
              <div
                key={pillar.title}
                className={`flex flex-col justify-between rounded-2xl border border-hairline border-t-4 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-lg ${accentBorder}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-bold tracking-[0.2em] text-charcoal/40">
                      PILLAR {pillar.num}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${accentBadge}`}
                    >
                      {pillar.title.split(' ')[1] || pillar.title}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-bold text-navy">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                    {pillar.tagline}
                  </p>

                  <div className="my-6 h-px bg-hairline" />

                  <div className="space-y-4">
                    {pillar.capabilities.map((cap) => (
                      <div
                        key={cap.title}
                        className="rounded-xl border border-hairline/80 bg-mist/50 p-4"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusTag status={cap['status']} />
                        </div>
                        <h4 className="mt-2 text-base font-semibold text-navy">
                          {cap.title}
                        </h4>
                        <p className="mt-1.5 text-xs leading-relaxed text-charcoal/70">
                          {cap.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-hairline/80 pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/50">
                    Key Outcome
                  </p>
                  <p className="mt-1 text-xs font-medium text-navy">
                    {pillar.deliverable}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Innovation Roadmap */}
      <Section tone="navy">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="reveal-left">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">
              Innovation Roadmap
            </span>
            <h2 className="mt-3 text-3xl font-semibold !text-white sm:text-4xl">
              Building the Future of Blade Engineering
            </h2>
            <p className="mt-4 text-lg text-white/70">
              Where we are investing our R&amp;D — combining internal robotics, automated analytics and non-destructive evaluation to identify defects earlier and protect operating assets:
            </p>
          </div>
          <ul className="grid gap-4">
            {INNOVATION_LIST.map((item, i) => (
              <li
                key={item}
                className="reveal-right flex items-center gap-4 rounded-xl border border-white/15 bg-white/5 p-5 text-base font-medium text-white transition-all duration-300 hover:translate-x-1 hover:border-teal/50 hover:bg-white/10"
                style={stagger(i)}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green/20 text-leaf">
                  <span className="h-2.5 w-2.5 rounded-full bg-leaf" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Closing statement */}
      <Section tone="white">
        <div className="reveal-up mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-balance sm:text-4xl md:text-[42px] md:leading-[1.15]">
            Technology supports our engineers. Engineering makes the decision.
          </h2>
          <div className="mt-8 flex justify-center">
            <Button to="/contact" className="group px-7 py-4 text-base">
              Talk to Our Engineers
            </Button>
          </div>
        </div>
      </Section>

      {/* Events, from NEXT_PUBLIC_EVENTS. The Section is guarded rather than
          left to render an empty mist-coloured band once the show is over —
          EventBanner itself returns null, but the padding would remain. */}
      {HAS_EVENTS && (
        <Section tone="mist">
          <EventBanner />
        </Section>
      )}
    </>
  )
}
