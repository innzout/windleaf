import type { Metadata } from 'next'
import { SEO, WHY_IT_MATTERS, CAPABILITIES, INNOVATION_LIST } from '@/content/site'
import { Button, Section, SectionHeading } from '@/components/ui'
import { PageHero } from '@/components/sections'
import { TechFlow } from '@/components/TechFlow'
import { StatusTag } from '@/components/StatusTag'
import { EventBanner } from '@/components/EventBanner'
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
            title="From Blade to Engineering Solution"
            sub="Blade → Camera/Robot → Data → AI → Windleaf Engineer → Engineering Solution"
          />
        </div>
        {/* No reveal wrapper — the timeline drives its own scroll animation. */}
        <div className="mt-12">
          <TechFlow variant="full" />
        </div>
        <div className="reveal-up mt-10 max-w-3xl space-y-4 text-lg leading-relaxed text-charcoal/75">
          <p>
            Technology helps us see more, and see it sooner. But no finding leaves Windleaf until an
            engineer has checked it.
          </p>
          <p>
            Cameras and robots capture the blade. AI helps sort the data. Windleaf engineers verify
            the findings and turn them into practical engineering solutions.
          </p>
        </div>
      </Section>

      {/* Why It Matters */}
      <Section tone="mist">
        <div className="reveal-up">
          <SectionHeading eyebrow="Why It Matters" title="Why It Matters" />
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {WHY_IT_MATTERS.map((point, i) => (
            <SpotlightCard
              key={point.title}
              spotlightColor="rgba(45, 190, 96, 0.16)"
              className="reveal-up rounded-2xl border border-hairline bg-white p-7"
              style={{ transitionDelay: `${(i % 3) * 90}ms` }}
            >
              <h3 className="text-xl font-semibold text-navy">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{point.body}</p>
            </SpotlightCard>
          ))}
        </div>
      </Section>

      {/* Capabilities */}
      <Section tone="white">
        <div className="reveal-up">
          <SectionHeading
            eyebrow="Capabilities"
            title="Current & Developing Capabilities"
            sub="Where technology supports our engineers today — and what we are actively building next."
          />
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {CAPABILITIES.map((capability, i) => (
            <SpotlightCard
              key={capability.title}
              as="article"
              spotlightColor="rgba(0, 194, 168, 0.16)"
              className="reveal-up flex flex-col rounded-2xl border border-hairline bg-mist p-8"
              style={{ transitionDelay: `${(i % 2) * 100}ms` }}
            >
              <h3 className="text-2xl font-semibold text-navy">{capability.title}</h3>
              <div className="mt-3">
                <StatusTag status={capability.status} />
              </div>
              <p className="mt-4 leading-relaxed text-charcoal/70">{capability.body}</p>
            </SpotlightCard>
          ))}
        </div>
      </Section>

      {/* Innovation in Progress */}
      <Section tone="navy">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="reveal-left">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">
              Innovation in Progress
            </span>
            <h2 className="mt-3 text-3xl font-semibold !text-white sm:text-4xl">
              Innovation in Progress
            </h2>
            <p className="mt-4 text-lg text-white/70">Capabilities we are actively developing:</p>
          </div>
          <ul className="grid gap-4">
            {INNOVATION_LIST.map((item, i) => (
              <li
                key={item}
                className="reveal-right flex items-center gap-4 rounded-xl border border-white/15 bg-white/5 p-5 text-lg font-medium text-white transition-all duration-300 hover:translate-x-1 hover:border-teal/50 hover:bg-white/10"
                style={{ transitionDelay: `${i * 80}ms` }}
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

      {/* Event banner */}
      <Section tone="mist">
        <EventBanner />
      </Section>
    </>
  )
}
