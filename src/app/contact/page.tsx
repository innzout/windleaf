import type { Metadata } from 'next'
import { SEO, COUNTRY_COUNT } from '@/content/site'
import { Section, stagger } from '@/components/ui'
import { PageHero } from '@/components/sections'
import { ContactForm } from '@/components/ContactForm'

export const metadata: Metadata = {
  title: SEO.contact.title,
  description: SEO.contact.description,
  alternates: { canonical: '/contact' },
}

const CONTACT_DETAILS = [
  { label: 'Email', value: 'mg@windleafenergy.com' },
  { label: 'Phone / WhatsApp', value: '+91 7904724895' },
  { label: 'Address', value: 'No.308, 13th Cross Street, Casagrand Arena, Vallakottai, Oragadam, Chennai - 602105' },
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell Us About Your Wind-Energy Challenge"
        sub="Whether you need blade engineering expertise, technical assessment, inspection support or a practical solution, start the conversation with Windleaf."
        bgImg="/contact-hero.jpg"
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
          <div className="reveal-up">
            <ContactForm />
          </div>

          {/* The reveal cannot sit on the sticky element — once pinned it stops
              moving through the viewport, so its timeline never advances. */}
          <aside className="lg:sticky lg:top-32">
            <div className="reveal-up rounded-2xl border border-hairline bg-mist p-8">
              <h3 className="text-xl font-semibold text-navy">Get in Touch</h3>
              <ul className="mt-6 space-y-5 text-sm">
                {CONTACT_DETAILS.map((detail) => (
                  <li key={detail.label}>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-green">
                      {detail.label}
                    </span>

                    {detail.label === 'Email' ? (
                      <a
                        href={`mailto:${detail.value}`}
                        className="mt-1 block text-charcoal/70 transition-colors hover:text-green"
                      >
                        {detail.value}
                      </a>
                    ) : detail.label === 'Phone / WhatsApp' ? (
                      <a
                        href={`tel:${detail.value.replace(/\s+/g, '')}`}
                        className="mt-1 block text-charcoal/70 transition-colors hover:text-green"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      <span className="mt-1 block leading-relaxed text-charcoal/70">
                        {detail.value}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal-up mt-6 rounded-2xl border border-hairline bg-navy p-8 text-white" style={stagger(1)}>
              <h3 className="text-lg font-semibold !text-white">Independent Blade Engineering</h3>
              <p className="mt-2 text-sm text-white/70">
                17 years across OEM, IPP and independent engineering, with project experience in{' '}
                {COUNTRY_COUNT} countries.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  )
}
