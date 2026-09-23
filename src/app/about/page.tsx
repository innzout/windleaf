import type { Metadata } from 'next'
import { SEO, EXPERIENCE, VALUES, COUNTRY_COUNT } from '@/content/site'
import { Button, Section, SectionHeading, stagger } from '@/components/ui'
import { PageHero, ClosingCTA } from '@/components/sections'
import { SpotlightCard } from '@/components/SpotlightCard'
import { GlobalReach } from '@/components/GlobalReach'
import { GlobeMount } from '@/components/globe/GlobeMount'

export const metadata: Metadata = {
  title: SEO.about.title,
  description: SEO.about.description,
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Windleaf"
        title="Independent Expertise. Wind Blade Manufacturing Experience Across the Globe."
        sub="Built on real-world wind blade experience, Windleaf brings independent technical insight to complex blade challenges."
        bgImg="/how-we-work-engineers-inspection.jpg"
      />

      {/* Founder */}
      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="reveal-left">
            <SpotlightCard
              spotlightColor="rgba(0, 194, 168, 0.2)"
              className="relative overflow-hidden rounded-2xl border-2 border-teal/30 bg-mist shadow-sm"
            >
              <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-mist via-soft to-sky/10">
                <div className="text-center">
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-navy font-display text-4xl font-semibold text-leaf shadow-lg ring-4 ring-teal/20 transition-transform duration-300 group-hover:scale-105">
                    KM
                  </div>
                  <p className="mt-5 font-display text-base font-semibold text-navy">
                    K. Muruga Ganesh
                  </p>
                  <p className="mt-1 px-6 text-xs font-medium text-charcoal/50">Founder &amp; CEO</p>
                  <p className="mt-4 px-6 text-xs font-medium uppercase tracking-wider text-teal/60">
                    Photo to be provided
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-teal/5 to-transparent" />
            </SpotlightCard>
          </div>
          <div className="reveal-right">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-green">
              Founder
            </span>
            <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">K. Muruga Ganesh</h2>
            <p className="mt-2 font-medium text-charcoal/70">
              Founder &amp; CEO | Wind Turbine Blade Engineering &amp; Manufacturing Expert
            </p>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-charcoal/75">
              <p>
                K. Muruga Ganesh has 17+ years of global wind-energy experience across OEM, IPP and
                independent engineering environments.
              </p>
              <p>
                Their career includes blade manufacturing with leading OEMs, independent blade
                engineering and audits with DNV GL, and owner-side technical work with
                TotalEnergies.
              </p>
              <p>
                That expertise spans blade engineering, manufacturing, quality assurance, technical
                due diligence, inspection, defect assessment, repair and structural analysis.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Professional Experience */}
      <Section tone="mist">
        <div className="reveal-up">
          <SectionHeading
            eyebrow="Professional Experience"
            title="Professional Experience"
            sub="Experience from the manufacturer, owner and independent engineering sides of the wind industry."
          />
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {EXPERIENCE.map((item, i) => (
            <SpotlightCard
              key={item.title}
              spotlightColor="rgba(45, 190, 96, 0.16)"
              className="reveal-up flex flex-col rounded-2xl border border-hairline bg-white p-8"
              style={stagger(i)}
            >
              <span className="font-display text-2xl font-bold text-blade transition-colors duration-300 group-hover:text-green">
                0{i + 1}
              </span>
              <h3 className="mt-4 text-2xl font-semibold text-navy">{item.title}</h3>
              <p className="mt-3 text-charcoal/70">{item.body}</p>
            </SpotlightCard>
          ))}
        </div>
      </Section>

      {/* Global project experience — interactive globe, then the same data as
          indexable text below it. */}
      <Section tone="white">
        <div className="reveal-up">
          <SectionHeading
            eyebrow="Global Project Experience"
            title={`Global Engineering Reach Across ${COUNTRY_COUNT} Countries`}
            sub="Rotate the globe to explore Windleaf blade engineering projects and technical alliances worldwide."
          />
        </div>
        <div className="mt-10">
          <GlobeMount variant="interactive" />
        </div>
        <div className="mt-16">
          <GlobalReach />
        </div>
        <p className="reveal-up mt-6 max-w-3xl leading-relaxed text-charcoal/70">
          Hands-on experience across blade manufacturing, training, project delivery, technical due
          diligence, process and manufacturing audits, surveillance, blade inspection, repair
          analysis and technical knowledge transfer.
        </p>
      </Section>

      {/* Philosophy + Vision */}
      <Section tone="navy">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="reveal-left">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">
              Technical Philosophy
            </span>
            <h2 className="mt-3 text-3xl font-semibold !text-white">Our Technical Philosophy</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/75">
              We combine deep blade engineering expertise, independent technical judgement and
              evidence-based analysis to deliver practical solutions for complex wind-energy
              challenges.
            </p>
          </div>
          <div className="reveal-right">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">
              Vision
            </span>
            <h2 className="mt-3 text-3xl font-semibold !text-white">Our Vision</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/75">
              To make wind-energy assets safer, more reliable and longer-lasting through sound blade
              engineering and independent technical expertise.
            </p>
          </div>
        </div>
      </Section>

      {/* Core Values */}
      <Section tone="mist">
        <div className="reveal-up">
          <SectionHeading
            eyebrow="Core Values"
            title="Our Core Values"
            sub="Committed to technically sound, transparent and evidence-based engineering decisions."
          />
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, i) => (
            <SpotlightCard
              key={value.title}
              spotlightColor="rgba(0, 194, 168, 0.16)"
              className="reveal-up rounded-2xl border border-hairline bg-white p-7"
              style={stagger(i % 4)}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green/12 text-green transition-transform duration-300 group-hover:scale-110 group-hover:bg-green group-hover:text-white">
                <span className="h-2.5 w-2.5 rounded-full bg-green group-hover:bg-white" />
              </span>
              <h3 className="mt-4 text-xl font-semibold text-navy">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{value.body}</p>
            </SpotlightCard>
          ))}
        </div>
        <div className="reveal-up mt-10">
          <Button to="/contact" className="group">
            Work With Windleaf
          </Button>
        </div>
      </Section>

      <ClosingCTA
        eyebrow="Get Started"
        title="Work With an Independent Blade Engineering Team"
        text="Bring us your most complex blade challenges — we bring OEM, IPP and independent perspective."
        buttonLabel="Start the Conversation"
      />
    </>
  )
}
