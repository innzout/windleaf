import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { SEO, SERVICES, SERVICE_QUICKLINKS, GALLERY, DESIGN_BOXES, COUNTRY_COUNT } from '@/content/site'
import { Button, Section, SectionHeading, stagger } from '@/components/ui'
import { PageHero, ClosingCTA } from '@/components/sections'
import ServiceQuickLinks from '@/components/ServiceQuickLinks'
import { ScrollRail } from '@/components/ScrollRail'

export const metadata: Metadata = {
  title: SEO.services.title,
  description: SEO.services.description,
  alternates: { canonical: '/services' },
}

const PROJECT_EXAMPLES = [
  [
    { field: 'Client type', value: 'IPP / Energy Developer' },
    { field: 'Country', value: 'Kazakhstan' },
    { field: 'Service', value: 'Technical Due Diligence (TDD) & Blade Factory Qualification' },
    {
      field: 'The challenge',
      value:
        'Assessment of blade manufacturing capability and associated technical risks for a 1 GW wind project, including manufacturing readiness and supply-chain capability.',
    },
    {
      field: 'What we did',
      value:
        'Supported blade factory qualification and technical due diligence of manufacturing options. Assessed manufacturing capabilities and readiness, identified technical risks and supported risk mitigation through structured RCA / 8D methodology.',
    },
    {
      field: 'The outcome',
      value:
        'Provided independent technical input supporting blade factory qualification, manufacturing-readiness assessment and project risk mitigation.',
    },
  ],
  [
    { field: 'Client type', value: 'IPP / Energy Developer' },
    { field: 'Country', value: 'China → South Africa' },
    { field: 'Service', value: 'Blade Manufacturing Surveillance & Process Audit' },
    {
      field: 'The challenge',
      value:
        'Ensure that blade manufacturing processes and product quality at the manufacturing location in China were aligned with the technical requirements of a South African wind project.',
    },
    {
      field: 'What we did',
      value:
        'Conducted manufacturing surveillance and process audits, reviewed critical blade manufacturing processes and quality aspects, and provided technical engineering inputs and follow-up during project execution.',
    },
    {
      field: 'The outcome',
      value:
        'Provided independent technical surveillance and process-engineering support connecting China-based blade manufacturing with the South African project, supporting manufacturing quality and project execution.',
    },
  ],
]

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Blade Engineering Services Across the Lifecycle"
        sub="Independent, specialist support for Wind Farm Owners, IPPs, Investors and OEMs — from design and manufacturing to inspection, repair and training."
        bgImg="/services-wind-farm-sunset.jpg"
      />

      {/* Quick links — one scrollable rail with snap points and fades at both
          ends so it's obvious there is more to the right. */}
      <div className="sticky top-[68px] z-30 border-y border-hairline bg-white/90 backdrop-blur-md">
        <div className="relative mx-auto w-full max-w-7xl">
          <ServiceQuickLinks />
        </div>
      </div>

      {/* Our Work in Practice */}
      <Section tone="white" id="work">
        <div className="reveal-up">
          <SectionHeading
            eyebrow="Our Work in Practice"
            title="Our Work in Practice"
            sub={`Hands-on blade work on manufacturing floors, wind projects and inspections across ${COUNTRY_COUNT} countries.`}
          />
        </div>
        <p className="reveal-up mt-6 max-w-3xl text-lg leading-relaxed text-charcoal/75">
          Over 17+ years, our work has covered blade manufacturing, training, project delivery,
          technical due diligence, process and manufacturing audits, surveillance, blade inspection,
          repair analysis and technical knowledge transfer.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY.map((item, i) => (
            <figure
              key={item.caption}
              className="reveal group overflow-hidden rounded-2xl border border-hairline bg-soft"
              style={stagger(i % 3)}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-soft">
                <Image
                  src={item.img}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <figcaption className="p-4 text-sm font-semibold text-navy">{item.caption}</figcaption>
            </figure>
          ))}
        </div>


        {/* Project example cards — a rail rather than a grid, so adding a third
            example never forces a layout decision and the interaction matches
            the service chips above. */}
        <ScrollRail label="project examples" step={520} className="mt-10">
          {PROJECT_EXAMPLES.map((rows, n) => (
            <div
              key={n}
              className="reveal-up w-[88vw] max-w-[560px] shrink-0 snap-start overflow-hidden rounded-2xl border border-hairline bg-white transition-shadow duration-300 hover:shadow-lg hover:shadow-navy/10 sm:w-[70vw] lg:w-[calc(50%-0.75rem)]"
              style={stagger(n)}
            >
              <div className="flex items-center justify-between bg-navy px-6 py-3">
                <span className="text-sm font-semibold text-white">Project  {n + 1}</span>
                <span className="text-xs font-medium text-leaf">{rows[1].value}</span>
              </div>
              {/* Rows stack on a phone: a fixed 140px label column left under
                  160px for the value, which broke every word onto its own
                  line. */}
              <dl className="divide-y divide-hairline">
                {rows.map((row) => (
                  <div
                    key={row.field}
                    className="grid gap-1 px-6 py-3.5 sm:grid-cols-[140px_1fr] sm:gap-4"
                  >
                    <dt className="text-sm font-semibold text-navy">{row.field}</dt>
                    <dd className="text-sm leading-relaxed text-charcoal/70">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </ScrollRail>
        <div className="mt-8">
          <Button to="/contact" className="group">
            Discuss a Similar Project
          </Button>
        </div>
      </Section>

      {/* 8 services */}
      {SERVICES.map((service, idx) => (
        <Section key={service.id} id={service.id} tone={idx % 2 === 0 ? 'mist' : 'white'}>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            {/* The reveal must not live on the sticky element itself: once
                pinned it stops moving through the viewport, so its entry
                timeline never advances and the animation never plays. */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <div className="reveal-left">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-green">
                  {service.n}
                </span>
                <h2 className="mt-3 text-4xl font-semibold sm:text-5xl md:leading-[1.08]">{service.title}</h2>
                <p className="mt-4 text-lg font-medium leading-relaxed text-green">{service.sub}</p>
                <p className="mt-4 leading-relaxed text-charcoal/75">{service.text}</p>

                {service.id === 'design-engineering' && (
                  <div className="mt-6 space-y-4">
                    {DESIGN_BOXES.map((box) => (
                      <div key={box.title} className="rounded-xl border border-hairline bg-white p-5">
                        <h4 className="font-semibold text-navy">{box.title}</h4>
                        <p className="mt-1.5 text-sm leading-relaxed text-charcoal/70">{box.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6">
                  <Button to="/contact" className="group">
                    {service.cta}
                  </Button>
                </div>
              </div>
            </div>

            <div className="reveal-right">
              <div className="rounded-2xl border border-hairline bg-white p-8">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-navy/60">
                  {service.id === 'design-engineering' ? 'We Can Support' : 'What We Do'}
                </h3>
                <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {service.list.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-charcoal/80">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="none"
                        className="mt-0.5 shrink-0 text-green"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 10.5l4 4 8-9"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-2xl border-l-4 border-green bg-mist p-6">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-green">
                  Experience behind it
                </span>
                <p className="mt-2 font-medium leading-relaxed text-navy">{service.experience}</p>
              </div>
            </div>
          </div>
        </Section>
      ))}

      <ClosingCTA
        eyebrow="Closing"
        title="Not Sure Which Service You Need?"
        text="Tell us about your blade challenge and we will help you find the right support."
        buttonLabel="Start the Conversation"
      />
    </>
  )
}
