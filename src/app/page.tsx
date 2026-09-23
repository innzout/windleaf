import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { SEO, STATS, EXPERIENCE, WHAT_WE_DO, SIX_REASONS, HERO_VIDEO } from '@/content/site'
import { Button, Section, SectionHeading, stagger } from '@/components/ui'
import { ClosingCTA } from '@/components/sections'
import { TechFlow } from '@/components/TechFlow'
import { SpotlightCard } from '@/components/SpotlightCard'
import { HeroBackdrop } from '@/components/HeroBackdrop'
import { CountUp } from '@/components/CountUp'

export const metadata: Metadata = {
  title: SEO.home.title,
  description: SEO.home.description,
  alternates: { canonical: '/' },
}

const SERVICE_ANCHORS = [
  'design-engineering',
  'inspection-defect-assessment',
  'technical-due-diligence',
]

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden  text-white">
        {/* Poster hands off to the video — never both at once, or the moving
            blades double-expose against the frozen ones. */}
        <HeroBackdrop
          videoSrc={HERO_VIDEO}
          opacity={1}
          poster={
            <Image
              src="/hero-poster.jpg"
              alt=""
              fill
              
              priority
              sizes="100vw"
              className="object-cover"
            />
          }
        />
        {/* Mobile: the copy spans the full width, so the scrim runs bottom-to-top.
            A left-to-right one would leave the headline sitting on open footage. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/60 sm:hidden" />
        {/* Tablet and up: opaque under the copy, opening up on the right so the
            turbine in the footage stays visible. */}
        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-navy to-navy/30 sm:block" />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-24 md:py-32 lg:px-10">
          <div className="max-w-3xl">
            <span className="enter-left inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-leaf">
              <span className="h-px w-6 bg-leaf" />
              Independent Blade Engineering
            </span>
            <h1
              className="enter-up mt-5 text-4xl font-semibold leading-[1.06] text-balance !text-white sm:text-5xl md:text-6xl"
              style={{ animationDelay: '60ms' }}
            >
              Global Independent Engineering Consulting &amp; Services for Wind Turbine Blades
            </h1>
            <p
              className="enter-up mt-6 max-w-xl text-lg font-medium leading-relaxed text-teal"
              style={{ animationDelay: '130ms' }}
            >
              We support Wind Farm Owners, IPPs, Investors and OEMs across the blade lifecycle —
              from manufacturing to pre-commissioning.
            </p>
            <p
              className="enter-up mt-4 max-w-xl text-lg leading-relaxed text-white/70"
              style={{ animationDelay: '200ms' }}
            >
              Our end-to-end blade engineering services include Technical Due Diligence (TDD),
              Quality Engineering, Manufacturing Surveillance, Process Optimisation, Blade Repair
              Analysis, and Visual &amp; NDT Blade Inspection — supported by robotic and advanced
              camera technologies.
            </p>
            <div className="enter-up mt-8 flex flex-wrap gap-3" style={{ animationDelay: '270ms' }}>
              <Button to="/contact" variant="green" className="group px-7 py-4 text-base">
                Discuss Your Blade Challenge
              </Button>
              <Link
                href="/services"
                className="btn-shimmer inline-flex items-center gap-2 rounded-md border border-white/30 px-7 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/10 hover:shadow-lg"
              >
                Explore Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Experience Highlights ────────────────────────────────── */}
      <Section tone="mist">
        <div className="reveal-up">
          <SectionHeading
            eyebrow="Experience Highlights"
            title="17+ Years Across OEM, IPP and Independent Engineering"
          />
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {STATS.map((stat, i) => (
            <SpotlightCard
              key={stat.label}
              spotlightColor="rgba(45, 190, 96, 0.16)"
              className="reveal-zoom rounded-2xl border border-hairline bg-white p-8 text-center shadow-sm"
              style={stagger(i)}
            >
              <div className="font-display text-5xl font-bold text-green transition-transform duration-300 group-hover:scale-105 md:text-6xl">
                <CountUp value={stat.value} />
              </div>
              <p className="mt-3 text-sm font-medium text-charcoal/70">{stat.label}</p>
            </SpotlightCard>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {EXPERIENCE.map((item, i) => (
            <SpotlightCard
              key={item.title}
              spotlightColor="rgba(0, 194, 168, 0.14)"
              className="reveal-up rounded-2xl border border-hairline bg-white p-6"
              style={stagger(i)}
            >
              <h3 className="text-xl font-semibold text-navy">{item.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-charcoal/70">{item.body}</p>
            </SpotlightCard>
          ))}
        </div>
        <p className="mt-5 text-sm italic text-charcoal/55">
          These companies reflect our professional experience, not a client list.
        </p>
        <div className="mt-8">
          <Button to="/about" variant="outline" className="group">
            About Our Experience
          </Button>
        </div>
      </Section>

      {/* ── What We Do ───────────────────────────────────────────── */}
      <Section tone="white">
        <div className="reveal-up">
          <SectionHeading
            eyebrow="What We Do"
            title="What We Do"
            sub="Three areas of specialist blade expertise, delivered from an independent point of view."
          />
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {WHAT_WE_DO.map((card, i) => (
            <SpotlightCard
              key={card.title}
              as="article"
              spotlightColor="rgba(45, 190, 96, 0.18)"
              className="reveal-up group flex flex-col rounded-2xl border border-hairline bg-mist p-8 transition-all hover:border-green/50"
              style={stagger(i)}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-leaf transition-transform duration-300 group-hover:scale-110 group-hover:bg-green group-hover:text-white">
                <span className="font-display text-sm font-semibold">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-navy transition-colors duration-200 group-hover:text-teal">
                {card.title}
              </h3>
              <p className="mt-3 flex-1 text-base leading-relaxed text-charcoal/70">{card.body}</p>
              <Link
                href={`/services#${SERVICE_ANCHORS[i]}`}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-green transition-all duration-200 group-hover:translate-x-1 group-hover:text-forest"
              >
                Learn More →
              </Link>
            </SpotlightCard>
          ))}
        </div>
        <div className="mt-10">
          <Button to="/services" className="group">
            View All Services
          </Button>
        </div>
      </Section>

      {/* ── Why Choose Windleaf ──────────────────────────────────── */}
      <Section tone="mist">
        <div className="reveal-up">
          <SectionHeading
            eyebrow="Why Choose Windleaf"
            title="Why Choose Windleaf"
            sub="Six reasons clients trust us with critical blade decisions."
          />
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SIX_REASONS.map((reason, i) => (
            <SpotlightCard
              key={reason.title}
              spotlightColor="rgba(0, 194, 168, 0.15)"
              className="reveal-up rounded-2xl border border-hairline bg-white p-7"
              style={stagger(i % 3)}
            >
              <span className="font-display text-2xl font-bold text-blade transition-colors duration-300 group-hover:text-green">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-navy">{reason.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-charcoal/70">{reason.body}</p>
            </SpotlightCard>
          ))}
        </div>
      </Section>

      {/* ── Technology Preview ───────────────────────────────────── */}
      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="reveal-left">
            <SectionHeading
              eyebrow="Technology Preview"
              title="From Blade to Engineering Solution"
              sub="Technology captures and analyses. Our engineers verify and decide."
            />
          </div>
          <div className="reveal-right">
            <TechFlow variant="compact" />
          </div>
        </div>
        <p className="reveal-up mt-10 max-w-3xl text-lg leading-relaxed text-charcoal/75">
          Cameras, robotics and AI help us find potential blade issues earlier. Every finding is
          checked by a Windleaf engineer before it becomes a recommendation.
        </p>
        <div className="reveal-up mt-8">
          <Button to="/ai-automation-robotics" className="group">
            See How It Works
          </Button>
        </div>
      </Section>

      <ClosingCTA
        eyebrow="Closing"
        title="Facing a Critical Blade Decision?"
        text="Get independent, evidence-based engineering support from a team with 17+ years in wind turbine blades."
        buttonLabel="Start the Conversation"
      />
    </>
  )
}
