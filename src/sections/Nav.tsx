import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { nav, site } from '../content'
import { useSmoothScroll } from '../lib/smoothScroll'
import { useActiveSection } from '../lib/useActiveSection'

const NAV_IDS = nav.map((n) => n.id)
const SECTION_ALIASES = { publications: 'tech' }

export function Nav() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(NAV_IDS, SECTION_ALIASES)
  const { scrollTo, lock } = useSmoothScroll()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    if (open) return
    if (y > 160 && y - prev > 4) setHidden(true)
    else if (prev - y > 4 || y < 160) setHidden(false)
  })

  useEffect(() => {
    lock(open)
    if (!open) return
    firstLinkRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
        return
      }
      if (e.key !== 'Tab') return
      const menu = document.getElementById('mobile-menu')
      const focusables = [toggleRef.current, ...(menu?.querySelectorAll<HTMLElement>('a[href]') ?? [])].filter(
        (el): el is HTMLElement => Boolean(el),
      )
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, lock])

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setOpen(false)
    lock(false)
    requestAnimationFrame(() => scrollTo(id))
  }

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden ? '-130%' : '0%' }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5"
        onFocusCapture={() => setHidden(false)}
      >
        <nav
          aria-label="Primary"
          className={`glass mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border border-white/60 pl-5 pr-2 transition-shadow duration-300 ${
            scrolled
              ? 'shadow-[0_10px_40px_-12px_rgba(27,31,69,0.35)]'
              : 'shadow-[0_4px_20px_-10px_rgba(27,31,69,0.25)]'
          }`}
        >
          <a
            href="#section_1"
            onClick={(e) => go(e, 'section_1')}
            className="text-2xl font-bold tracking-tight text-brand-900"
          >
            {site.brand}
            <span className="text-teal">.</span>
          </a>

          <ul className="hidden items-center gap-0.5 md:flex lg:gap-1">
            {nav.map((item) => {
              const isActive = active === item.id
              return (
                <li key={item.id} className="relative">
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => go(e, item.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative z-10 block rounded-xl px-3 py-2 text-[15px] lg:px-4 font-medium transition-colors ${
                      isActive ? 'text-white' : 'text-brand-900/75 hover:text-brand-900'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-xl bg-brand"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="relative z-[60] flex size-11 items-center justify-center rounded-xl text-brand-900 md:hidden"
          >
            <span className="relative block h-3.5 w-5">
              <motion.span
                className="absolute left-0 top-0 h-0.5 w-5 rounded bg-current"
                animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              />
              <motion.span
                className="absolute left-0 top-1.5 h-0.5 w-5 rounded bg-current"
                animate={{ opacity: open ? 0 : 1 }}
              />
              <motion.span
                className="absolute left-0 top-3 h-0.5 w-5 rounded bg-current"
                animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              />
            </span>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.15 } }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-brand-900/95 px-8 backdrop-blur-xl md:hidden"
          >
            <motion.ul
              className="space-y-2"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
                hidden: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
              }}
            >
              {nav.map((item, i) => (
                <motion.li
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 32 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                  }}
                >
                  <a
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={`#${item.id}`}
                    onClick={(e) => go(e, item.id)}
                    aria-current={active === item.id ? 'true' : undefined}
                    className="flex items-baseline gap-4 py-2 text-5xl font-bold tracking-tight text-white"
                  >
                    <span className="text-base font-medium text-teal">0{i + 1}</span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
