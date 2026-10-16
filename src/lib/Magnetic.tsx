import { motion, useMotionValue, useReducedMotion, useSpring, type HTMLMotionProps } from 'framer-motion'
import { useRef, type PointerEvent } from 'react'

type MagneticProps = HTMLMotionProps<'a'> & { strength?: number }

const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

export function MagneticLink({ strength = 0.35, onPointerMove, onPointerLeave, style, ...rest }: MagneticProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 16, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 260, damping: 16, mass: 0.6 })

  const handleMove = (e: PointerEvent<HTMLAnchorElement>) => {
    onPointerMove?.(e)
    if (reduced || !finePointer() || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }

  const handleLeave = (e: PointerEvent<HTMLAnchorElement>) => {
    onPointerLeave?.(e)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ ...style, x: sx, y: sy }}
      {...rest}
    />
  )
}
