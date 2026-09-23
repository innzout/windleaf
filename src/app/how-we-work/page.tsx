import type { Metadata } from 'next'
import { SEO, PROCESS, WAYS_TO_WORK, SIX_REASONS } from '@/content/site'
import { Button, Section, SectionHeading, stagger } from '@/components/ui'
import { PageHero, ClosingCTA } from '@/components/sections'

export const metadata: Metadata = {
  title: SEO.work.title,
  description: SEO.work.description,
  alternates: { canonical: '/how-we-work' },
}

export default function HowWeWorkPage() {
  return (
    <>
      <PageHero
        eyebrow="How We Work"
        title="How We Work"
        sub="A clear, evidence-based process and flexible ways to engage — whatever the size of your blade challenge."
        bgImg="/about-engineer-wind-farm.jpg"
      />

      {/* How a Project Works */}
      <Section tone="white">
        <div className="reveal-up">
          <SectionHeading eyebrow="How a Project Works" title="How a Project Works" />
        </div>
        <div className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {PROCESS.map((step, i) => (
            <div
              key={step.num}
              className="reveal relative pl-16"
              style={stagger(i % 3)}
            >
              <span className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-navy font-display text-lg font-bold text-leaf">
                {step.num}
              </span>
              <h3 className="text-2xl font-semibold text-navy">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-charcoal/70">{step.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Ways to Work */}
      <Section tone="mist">
        <div className="reveal-up">
          <SectionHeading
            eyebrow="Ways to Work With Windleaf"
            title="Ways to Work With Windleaf"
            sub="Choose the level of support that fits your project."
          />
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {/* All three read identically at rest — the navy treatment is the
              hover state, not something baked into the third card. */}
          {WAYS_TO_WORK.map((way, i) => (
            <div
              key={way.title}
              className="reveal group flex cursor-default flex-col rounded-2xl border border-hairline bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-green hover:bg-navy hover:shadow-xl hover:shadow-navy/25"
              style={stagger(i)}
            >
              <span className="font-display text-2xl font-bold text-blade transition-colors duration-300 group-hover:text-leaf">
                0{i + 1}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-navy transition-colors duration-300 group-hover:!text-white">
                {way.title}
              </h3>
              <p className="mt-3 leading-relaxed text-charcoal/70 transition-colors duration-300 group-hover:text-white/75">
                {way.body}
              </p>
            </div>
          ))}
        </div>
        <div className="reveal-up mt-10">
          <Button to="/contact" className="group">
            Discuss Your Requirement
          </Button>
        </div>
      </Section>

      {/* Why Choose Windleaf (short) */}
      <Section tone="white">
        <div className="reveal-up">
          <SectionHeading eyebrow="Why Choose Windleaf" title="Why Choose Windleaf?" />
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SIX_REASONS.map((reason, i) => (
            <div
              key={reason.title}
              className="reveal-up flex items-center gap-4 rounded-xl border border-hairline bg-mist p-5 transition-colors duration-300 hover:border-green/50 hover:bg-white"
              style={stagger(i % 3)}
            >
              <span className="font-display text-xl font-bold text-green">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-medium text-navy">{reason.title}</span>
            </div>
          ))}
        </div>
        <p className="reveal-up mt-5 text-sm italic text-charcoal/55">
          Short version of the six agreed reasons. Full descriptions appear on the Home page.
        </p>
      </Section>

      <ClosingCTA
        eyebrow="Closing"
        title="Have a Blade Challenge?"
        text="Share the details and start the conversation with Windleaf."
        buttonLabel="Contact Windleaf"
      />
    </>
  )
}
