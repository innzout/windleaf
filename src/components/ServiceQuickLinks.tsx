import Link from 'next/link'
import { SERVICE_QUICKLINKS } from '@/content/site'
import { ScrollRail } from '@/components/ScrollRail'

/**
 * The chip rail under the services hero.
 *
 * All the scroll behaviour — arrows that disable at each end, touch swipe,
 * mouse drag, snap points — lives in `ScrollRail`, shared with the project
 * cards and the globe's country dock, so the three cannot drift apart.
 */
export default function ServiceQuickLinks() {
  return (
    <ScrollRail label="services" step={300} itemsClassName="gap-2 py-3">
      {SERVICE_QUICKLINKS.map((link, i) => (
        <Link
          key={link.id}
          href={`/services#${link.id}`}
          style={{ animationDelay: `${i * 45}ms` }}
          className="enter-up shrink-0 snap-start whitespace-nowrap rounded-full border border-hairline px-3.5 py-1.5 text-xs font-medium text-navy/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-green hover:bg-green/8 hover:text-green hover:shadow-sm active:scale-95"
        >
          {link.label}
        </Link>
      ))}
    </ScrollRail>
  )
}
