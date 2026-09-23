import Image from 'next/image'

/**
 * Country flag.
 *
 * The flags in `COUNTRIES` are stored as regional-indicator emoji, which is a
 * fine way to hold the data but not a reliable way to *draw* it: Windows ships
 * no colour flag glyphs at all. Segoe UI Emoji renders the pair as two boxed
 * letters or nothing, so the site looked correct on every phone and blank on
 * most desktops — the same build, just a different font stack. These are real
 * SVGs served from `public/flags/`, so every platform gets the same picture.
 *
 * The ISO code is derived from the emoji rather than duplicated in `site.ts`:
 * a regional indicator is just the letter offset into a private block, so
 * 🇸🇬 → "SG" exactly, and the content file stays the single source of truth.
 */
const isoFromEmoji = (emoji: string) =>
  [...emoji]
    .map((char) => String.fromCharCode((char.codePointAt(0) ?? 0) - 0x1f1e6 + 65))
    .join('')
    .toLowerCase()

export function Flag({
  emoji,
  name,
  className = '',
}: {
  emoji: string
  name: string
  className?: string
}) {
  const iso = isoFromEmoji(emoji)

  return (
    <Image
      src={`/flags/${iso}.svg`}
      // The country name is always rendered next to this, so the flag is
      // decorative — announcing "Singapore Singapore" helps nobody.
      alt=""
      aria-hidden="true"
      width={30}
      height={20}
      unoptimized
      className={`shrink-0 rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(5,47,69,0.12)] ${className}`}
    />
  )
}
