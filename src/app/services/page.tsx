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
  {
    number: '01',
    title: 'GW WIND PROJECT',
    country: 'China',
    service: 'Technical Due Diligence & Factory Qualification',
    need:
      'Assess blade manufacturing capability, readiness and technical risks before project execution.',
    support: [
      'Blade factory qualification',
      'TDD',
      'Manufacturing capability assessment',
      'Quality-system review',
      'Risk mitigation',
    ],
    outcome:
      'Independent technical assessment supporting manufacturing readiness and project risk mitigation.',
  },

  {
    number: '02',
    title: 'SASOL WIND PROJECT',
    country: 'China → South Africa',
    service: 'Manufacturing Surveillance',
    need:
      'Ensure blades manufactured in China met the technical and quality requirements of the South African project.',
    support: [
      'Manufacturing surveillance',
      'Process audit',
      'Blade quality assessment',
      'Technical follow-up',
    ],
    outcome:
      'Independent factory oversight connecting manufacturing execution with project requirements and delivery readiness.',
  },

  {
    number: '03',
    title: 'RIYAH WIND PROJECT',
    country: 'Oman',
    service: 'Blade Inspection & Repair Assessment',
    need:
      'Verify blade condition and repair readiness before commissioning.',
    support: [
      'Blade inspection',
      'Defect assessment',
      'Structural repair analysis',
      'Technical evaluation',
    ],
    outcome:
      'Independent engineering input supporting blade quality verification and pre-commissioning readiness.',
  },

  {
    number: '04',
    title: 'HORSE WIND PROJECT',
    country: 'India',
    service: 'IPP-Side Blade Engineering',
    need:
      'Independent technical assessment of Nordex blades for the IPP project.',
    support: [
      'Blade inspection',
      'Defect assessment',
      'Technical review',
      'Engineering decision support',
    ],
    outcome:
      'IPP-side engineering support for blade quality assessment and project readiness.',
  },

  {
    number: '05',
    title: 'TOTALENERGIES',
    country: '2025–2026',
    service: 'Independent IPP Blade Engineering Support',
    need:
      'Provide blade engineering support from the IPP perspective across active wind projects.',
    support: [
      'Blade inspection',
      'Repair assessment',
      'Technical review',
      'Engineering support',
    ],
    outcome:
      'Independent technical input supporting blade quality, repair decisions and project execution.',
  },
]
export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Lifecycle Expertise"
        title="Blade Engineering Services Across the Lifecycle"
        sub="Independent, Expert support for Wind Farm Owners, IPPs, Investors and OEMs — from design and manufacturing to inspection, repair and training."
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
            eyebrow="Field Experience"
            title="Our Work in Practice"
            sub={`Hands-on blade engineering experience across manufacturing facilities, wind projects and field inspections in ${COUNTRY_COUNT} countries.`}
          />
        </div>
        <p className="reveal-up mt-6 max-w-3xl text-lg leading-relaxed text-charcoal/75">
          Across 17 years, our work has covered blade manufacturing, technical training, project delivery, technical due diligence, process and manufacturing audits, manufacturing surveillance, blade inspection, repair analysis and technical knowledge transfer.
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
          {PROJECT_EXAMPLES.map((project, n) => (
            <article
              key={project.number}
              className="reveal-up w-[88vw] max-w-[560px] shrink-0 snap-start overflow-hidden rounded-2xl border border-hairline bg-white transition-shadow duration-300 hover:shadow-lg hover:shadow-navy/10 sm:w-[70vw] lg:w-[calc(50%-0.75rem)]"
              style={stagger(n)}
            >
              {/* Header */}
              <div className="bg-navy px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold tracking-widest text-leaf">
                    {project.number}
                  </span>

                  <span className="text-xs font-medium text-white/60">
                    {project.country}
                  </span>
                </div>

                <h3 className="mt-2 font-display text-lg font-semibold text-white">
                  {project.title}
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-white/60">
                  {project.service}
                </p>
              </div>

              {/* Content */}
              <div className="divide-y divide-hairline">
                {/* Project Need */}
                <div className="px-6 py-5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal">
                    Project Need
                  </span>

                  <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
                    {project.need}
                  </p>
                </div>

                {/* Windleaf Support */}
                <div className="px-6 py-5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal">
                    Windleaf Support
                  </span>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.support.map((item) => (
                      <span
                        key={item}
                        className="rounded-md border border-teal/20 bg-teal/[0.06] px-2.5 py-1 text-[11px] font-medium text-[#0d6d70]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Value Delivered */}
                <div className="px-6 py-5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal">
                    Value Delivered
                  </span>

                  <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
                    {project.outcome}
                  </p>
                </div>
              </div>
            </article>
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
        eyebrow="Expert Guidance"
        title="Not Sure Which Service You Need?"
        text="Tell us about your blade challenge and we will help you find the right support."
        buttonLabel="Start the Conversation"
      />
    </>
  )
}
