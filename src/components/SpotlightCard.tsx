'use client'

import { useState, useRef, type MouseEvent, type ReactNode, type CSSProperties } from 'react'

type SpotlightCardProps = {
  children: ReactNode
  className?: string
  spotlightColor?: string
  tilt?: boolean
  style?: CSSProperties
  as?: 'div' | 'article' | 'section'
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(45, 190, 96, 0.14)',
  tilt = true,
  style = {},
  as: Component = 'div',
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  // The tilt is published as custom properties rather than a `transform`
  // string. An inline transform outranks any CSS one, so writing it directly
  // meant the scroll reveal could not move the card at all — cards could only
  // fade while everything else popped. `globals.css` composes these vars with
  // the reveal offsets into a single transform, so both can apply at once.
  const [tilt3d, setTilt3d] = useState({ x: '0deg', y: '0deg', lift: '0px' })

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setCoords({ x, y })

    if (tilt) {
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = ((y - centerY) / centerY) * -4.5
      const rotateY = ((x - centerX) / centerX) * 4.5
      setTilt3d({ x: `${rotateX.toFixed(2)}deg`, y: `${rotateY.toFixed(2)}deg`, lift: '-4px' })
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (tilt) setTilt3d({ x: '0deg', y: '0deg', lift: '0px' })
  }

  return (
    <Component
      ref={cardRef as React.Ref<never>}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`spotlight-card ${className}`}
      style={
        {
          ...style,
          '--tilt-x': tilt3d.x,
          '--tilt-y': tilt3d.y,
          '--tilt-lift': tilt3d.lift,
        } as CSSProperties
      }
    >
      {/* Spotlight radial glow following the cursor */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(420px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 75%)`,
        }}
        aria-hidden="true"
      />

      {/* Subtle cursor-following border glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.6 : 0,
          background: `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, rgba(45, 190, 96, 0.4), transparent 70%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
        aria-hidden="true"
      />

      {/* Card content.
          Laid out as a column so `flex-1` on a child still pushes trailing
          links to the bottom — the card's own `flex flex-col` applies to this
          wrapper, not to the children inside it. */}
      <div className="relative z-10 flex h-full w-full flex-col">{children}</div>
    </Component>
  )
}
