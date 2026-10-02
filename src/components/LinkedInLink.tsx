import { FOUNDER } from '@/content/site'

/**
 * Link out to the founder's LinkedIn profile.
 *
 * `rel="noopener"` because `target="_blank"` otherwise hands the opened tab a
 * live `window.opener` reference back into this page. Modern browsers imply it,
 * but it costs nothing and older ones do not.
 *
 * The label is part of the link text rather than a bare icon: an icon-only link
 * gives a screen reader nothing to announce, and "LinkedIn" is also what makes
 * it legible at a glance in the footer's list of contact details.
 */
export function LinkedInLink({
  variant = 'light',
  label = 'LinkedIn',
  className = '',
}: {
  variant?: 'light' | 'dark'
  label?: string
  className?: string
}) {
  const dark = variant === 'dark'

  // `#0a66c2` is LinkedIn's own brand blue, filled on hover with white text.
  // Hard-coded rather than added to the `@theme` tokens because it belongs to
  // LinkedIn, not to Windleaf — putting it in the brand palette invites its
  // reuse on things that have nothing to do with LinkedIn.
  //
  // The icon is `fill="currentColor"`, so the mark turns white along with the
  // label and there is no second colour to keep in step.
  return (
    <a
      href={FOUNDER.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className={`group/li inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0a66c2] hover:bg-[#0a66c2] hover:text-white hover:shadow-md hover:shadow-[#0a66c2]/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a66c2] ${dark ? 'border-white/20 text-white/80' : 'border-hairline text-navy'
        } ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-200 group-hover/li:scale-110"
      >
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13M7.12 20.45H3.55V9h3.57zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0" />
      </svg>
      {label}
    </a>
  )
}
