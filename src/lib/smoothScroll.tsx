import Lenis from 'lenis'
import { useReducedMotion } from 'framer-motion'
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react'

const NAV_OFFSET = 76

interface ScrollApi {
  scrollTo: (target: string | number) => void
  lock: (locked: boolean) => void
}

const ScrollContext = createContext<ScrollApi>({
  scrollTo: () => {},
  lock: () => {},
})

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ autoRaf: true, lerp: 0.12, anchors: false })
    lenisRef.current = lenis
    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  const scrollTo = useCallback(
    (target: string | number) => {
      const el = typeof target === 'string' ? document.getElementById(target.replace(/^#/, '')) : null
      if (typeof target === 'string' && !el) return
      const lenis = lenisRef.current
      if (lenis) {
        lenis.scrollTo(el ?? (target as number), { offset: el ? -NAV_OFFSET : 0, duration: 1.2 })
      } else if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
        window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' })
      } else {
        window.scrollTo({ top: target as number })
      }
      if (el && typeof target === 'string') history.replaceState(null, '', `#${el.id}`)
    },
    [reduced],
  )

  const lock = useCallback((locked: boolean) => {
    const lenis = lenisRef.current
    if (lenis) {
      if (locked) lenis.stop()
      else lenis.start()
    }
    document.documentElement.style.overflow = locked ? 'hidden' : ''
  }, [])

  return <ScrollContext.Provider value={{ scrollTo, lock }}>{children}</ScrollContext.Provider>
}

export const useSmoothScroll = () => useContext(ScrollContext)
