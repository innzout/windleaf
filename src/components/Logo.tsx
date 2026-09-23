import Link from 'next/link'
import Image from 'next/image'

/**
 * Brand lockup — the client's supplied SVG, used exactly as provided.
 *
 * The artwork includes an opaque white backing rectangle. That is invisible on
 * the white header, but on the navy mobile menu it would render as a bare white
 * slab, so `onDark` frames it as a deliberate white card instead of altering
 * the file. Do not edit `public/logo.svg`.
 */
export function Logo({
  onDark = false,
  className = '',
  height = 48,
}: {
  onDark?: boolean
  className?: string
  height?: number
}) {
  return (
    <Link
      href="/"
      aria-label="Windleaf Energy Solutions — home"
      className={`inline-flex items-center transition-opacity hover:opacity-90 ${
        onDark ? 'rounded-xl bg-white px-3 py-2 shadow-sm' : ''
      } ${className}`}
    >
      <Image
        src="/logo.svg"
        alt="Windleaf Energy Solutions"
        width={Math.round(height * (1283 / 504))}
        height={height}
        priority
        // Vector needs no raster optimisation, and this avoids having to switch
        // on `dangerouslyAllowSVG` in next.config for the image optimiser.
        unoptimized
        draggable={false}
        style={{ height, width: 'auto' }}
      />
    </Link>
  )
}
