import Link from 'next/link'
import Image from 'next/image'

/**
 * Brand lockup — Windleaf Energy Solutions new logo.
 *
 * Renders `/logo.png` for light surfaces and `/logo-white.png` for dark surfaces (e.g. mobile menu, footer).
 */
export function Logo({
  onDark = false,
  className = '',
  height = 55,
}: {
  onDark?: boolean
  className?: string
  height?: number
}) {
  return (
    <Link
      href="/"
      aria-label="Windleaf Energy Solutions — home"
      className={`inline-flex items-center transition-opacity hover:opacity-90 ${className}`}
    >
      <Image
        src={onDark ? '/logo-white.png' : '/logo.png'}
        alt="Windleaf Energy Solutions"
        width={Math.round(height * (722 / 281))}
        height={height}
        priority
        unoptimized
        draggable={false}
        style={{ height, width: 'auto' }}
      />
    </Link>
  )
}
