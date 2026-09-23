import Link from 'next/link'
import { COUNTRIES, COUNTRY_COUNT, REGION_COUNT, type Region } from '@/content/site'
import { SpotlightCard } from '@/components/SpotlightCard'
import { CountUp } from '@/components/CountUp'
import { stagger } from '@/components/ui'
import { Flag } from '@/components/Flag'

const REGION_ORDER: Region[] = ['Asia-Pacific', 'Europe', 'Middle East & Africa', 'Americas']

/**
 * Static "where we work" section — no canvas, no WebGL, no client JS beyond the
 * shared hover card. Stands in for the 3D globe in `components/globe/`, which is
 * built but not currently mounted.
 */
export function GlobalReach() {
  const byRegion = REGION_ORDER.map((region) => ({
    region,
    countries: COUNTRIES.filter((country) => country.region === region),
  })).filter((group) => group.countries.length > 0)

  return (
    <div className="w-full">
      {/* Summary strip */}
      <div className="grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-3">
        {[
          { value: String(COUNTRY_COUNT), label: 'Countries of project experience' },
          { value: String(REGION_COUNT), label: 'Regions covered' },
          { value: '2', label: 'Strategic hubs — Singapore HQ · Denmark alliance' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white px-6 py-7 text-center">
            <div className="font-display text-4xl font-bold text-green">
              <CountUp value={stat.value} />
            </div>
            <p className="mt-2 text-sm leading-snug text-charcoal/65">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Region groups */}
      <div className="mt-10 space-y-10">
        {byRegion.map((group, groupIndex) => (
          <div key={group.region}>
            <div className="flex items-center gap-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-navy">
                {group.region}
              </h3>
              <span className="rounded-full bg-mist px-2.5 py-0.5 text-xs font-semibold text-charcoal/60">
                {group.countries.length}
              </span>
              <span className="h-px flex-1 bg-hairline" />
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {group.countries.map((country, i) => (
                <SpotlightCard
                  key={country.name}
                  as="article"
                  spotlightColor={
                    country.isHq ? 'rgba(255, 193, 7, 0.16)' : 'rgba(0, 194, 168, 0.15)'
                  }
                  className={`reveal-up flex h-full flex-col rounded-2xl border p-6 ${
                    country.isHq
                      ? 'border-sun/45 bg-sun/[0.06]'
                      : country.isAlliance
                        ? 'border-teal/45 bg-teal/[0.05]'
                        : 'border-hairline bg-white'
                  }`}
                  style={stagger(i % 3)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Flag emoji={country.flag} name={country.name} className="h-5 w-[30px]" />
                      <h4 className="font-display text-xl font-semibold text-navy">
                        {country.name}
                      </h4>
                    </div>
                    {country.isHq && (
                      <span className="shrink-0 rounded-full bg-sun px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy">
                        Global HQ
                      </span>
                    )}
                    {country.isAlliance && (
                      <span className="shrink-0 rounded-full bg-teal px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        Alliance
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {country.services.map((service) => (
                      <span
                        key={service}
                        className="rounded-md border border-teal/25 bg-teal/8 px-2 py-0.5 text-[11px] font-medium text-[#0d6d70]"
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-charcoal/70">
                    {country.detail}
                  </p>
                </SpotlightCard>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-hairline bg-navy px-8 py-7 text-white sm:flex sm:items-center sm:justify-between sm:gap-8">
        <p className="max-w-xl text-sm leading-relaxed text-white/75">
          Working somewhere not listed here? Our engineering support travels with the project — tell
          us where the blades are.
        </p>
        <Link
          href="/contact"
          className="mt-5 inline-flex shrink-0 items-center gap-2 rounded-md bg-green px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-forest sm:mt-0"
        >
          Discuss Your Location →
        </Link>
      </div>
    </div>
  )
}
