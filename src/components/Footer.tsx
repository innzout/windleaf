import Link from 'next/link'
import { NAV, SERVICES, COUNTRY_COUNT } from '@/content/site'
import { Logo } from '@/components/Logo'

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-10">
        <div>
          <div>
            <Logo onDark height={42} />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            Independent wind turbine blade engineering and consulting — from manufacturing to
            pre-commissioning, across the blade lifecycle.
          </p>
          <p className="mt-4 text-sm text-white/50">
            Global project experience across {COUNTRY_COUNT} countries.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">Navigate</h4>
          <ul className="mt-4 space-y-2.5">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  href={n.to}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">Services</h4>
          <ul className="mt-4 space-y-2.5">
            {SERVICES.slice(0, 6).map((s) => (
              <li key={s.id}>
                <Link
                  href={`/services#${s.id}`}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">
            Get in Touch
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li>Email: mg@windleafenergy.com</li>
            <li>Phone / WhatsApp: +91 7904724895</li>
            <li>Address: XYZ, India-61XX05</li>
          </ul>
          <Link
            href="/contact"
            className="group mt-5 inline-flex items-center gap-2 rounded-md bg-green px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-forest"
          >
            Discuss Your Project
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-white/50 sm:flex-row lg:px-10">
          <p>© {new Date().getFullYear()} Windleaf Energy Solutions. All rights reserved.</p>
          <p>Independent Blade Engineering · OEM & IPP Perspective</p>
        </div>
      </div>
    </footer>
  )
}
