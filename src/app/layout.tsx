import type { Metadata, Viewport } from 'next'
import { Sora, Manrope } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ScrollProgress } from '@/components/ScrollProgress'
import { RouteProgress } from '@/components/RouteProgress'
import { CursorGlow } from '@/components/CursorGlow'
import { SEO, COUNTRIES, COUNTRY_COUNT } from '@/content/site'
import { SITE_URL, IS_PRODUCTION_SITE } from '@/lib/site-url'

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sora',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  // Resolves every relative `alternates.canonical` and OG image URL on the
  // site. Driven by NEXT_PUBLIC_SITE_URL so the domain is configured once.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SEO.home.title,
    template: '%s',
  },
  description: SEO.home.description,
  applicationName: 'Windleaf Energy Solutions',
  openGraph: {
    type: 'website',
    siteName: 'Windleaf Energy Solutions',
    title: SEO.home.title,
    description: SEO.home.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO.home.title,
    description: SEO.home.description,
  },
  // Belt and braces alongside robots.ts: a preview deployment says noindex in
  // the page head as well as in robots.txt, because a URL that was already
  // crawled is only removed by the meta tag — robots.txt merely stops the
  // re-crawl that would discover it.
  robots: IS_PRODUCTION_SITE
    ? { index: true, follow: true }
    : { index: false, follow: false },
}

/**
 * Organization structured data.
 *
 * This is what lets Google show a knowledge panel rather than just a blue link,
 * and it is the mechanism by which the site claims its own name — important
 * here because "Windleaf" is a short, generic-sounding brand.
 *
 * `areaServed` reads from COUNTRIES so it cannot drift from the site copy.
 */
const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organization`,
  name: 'Windleaf Energy Solutions',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/hero-poster.jpg`,
  description: SEO.home.description,
  slogan: 'Independent wind turbine blade engineering',
  knowsAbout: [
    'Wind turbine blade engineering',
    'Technical due diligence',
    'Blade manufacturing surveillance',
    'Blade inspection and NDT',
    'Blade repair and failure analysis',
  ],
  areaServed: COUNTRIES.map((country) => ({ '@type': 'Country', name: country.name })),
}

const WEBSITE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Windleaf Energy Solutions',
  description: `Independent wind turbine blade engineering across ${COUNTRY_COUNT} countries.`,
  publisher: { '@id': `${SITE_URL}/#organization` },
}

export const viewport: Viewport = {
  themeColor: '#052f45',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <body>
        {/* Structured data. Rendered in the body rather than the head because
            Google reads JSON-LD from either, and this keeps it out of the
            Metadata API's way. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }}
        />
        <div className="flex min-h-screen flex-col">
          <RouteProgress />
          <ScrollProgress />
          <CursorGlow />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
