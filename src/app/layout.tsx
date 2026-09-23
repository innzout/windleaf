import type { Metadata, Viewport } from 'next'
import { Sora, Manrope } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ScrollProgress } from '@/components/ScrollProgress'
import { RouteProgress } from '@/components/RouteProgress'
import { CursorGlow } from '@/components/CursorGlow'
import { SEO } from '@/content/site'

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
  metadataBase: new URL('https://windleaf.example.com'),
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
}

export const viewport: Viewport = {
  themeColor: '#052f45',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <body>
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
