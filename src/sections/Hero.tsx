import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { hero } from '../content'
import { MagneticLink } from '../lib/Magnetic'
import { supportsWebGL } from '../lib/device'
import { useSmoothScroll } from '../lib/smoothScroll'
import type { FieldSide } from '../three/NeuralField'

const NeuralField = lazy(() => import('../three/NeuralField'))

const ease = [0.16, 1, 0.3, 1] as const

const ringTints: Record<'base' | 'tech' | 'hobbies', string> = {
  base: 'bg-[conic-gradient(from_200deg,#14b789,#535da1,#8b93e6,#14b789)]',
  tech: 'bg-[conic-gradient(from_200deg,#14b789,#5ff0c4,#1b1f45,#14b789)]',
  hobbies: 'bg-[conic-gradient(from_200deg,#ff8a5c,#ffc857,#f06292,#ff8a5c)]',
}

const finePointer = () => window.matchMedia('(pointer: fine)').matches

/**
 * Touch and small screens get the 3D field only after the first interaction, so the static gradient
 * carries the hero on first load. Larger screens wait for page load plus an idle slot.
 */
function whenReadyFor3D(start: () => void): () => void {
  const idle = (cb: () => void) =>
    window.requestIdleCallback ? window.requestIdleCallback(cb, { timeout: 1500 }) : window.setTimeout(cb, 300)
  const deferToInteraction = window.matchMedia('(pointer: coarse), (max-width: 767px)').matches
  const events = ['pointerdown', 'touchstart', 'wheel', 'keydown', 'scroll'] as const
  let done = false
  const fire = () => {
    if (done) return
    done = true
    cleanup()
    idle(start)
  }
  const cleanup = () => {
    events.forEach((e) => window.removeEventListener(e, fire))
    window.removeEventListener('load', fire)
  }
  if (deferToInteraction) {
    events.forEach((e) => window.addEventListener(e, fire, { passive: true, once: true }))
  } else if (document.readyState === 'complete') {
    fire()
  } else {
    window.addEventListener('load', fire, { once: true })
  }
  return () => {
    done = true
    cleanup()
  }
}

function WordReveal({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const words = text.split(' ')
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '105%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 0.9, ease, delay: delay + i * 0.08 }}
          >
            {word}
            {i < words.length - 1 ? '\u00a0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const inView = useInView(ref, { margin: '0px 0px -10% 0px' })
  const [fieldReady, setFieldReady] = useState(false)
  const [canRender3D, setCanRender3D] = useState(false)
  const { scrollTo } = useSmoothScroll()
  const markReady = useCallback(() => setFieldReady(true), [])
  const [side, setSide] = useState<FieldSide>(null)
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null)
  const portraitRef = useRef<HTMLDivElement>(null)
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const rotateX = useSpring(tiltX, { stiffness: 120, damping: 18 })
  const rotateY = useSpring(tiltY, { stiffness: 120, damping: 18 })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  useEffect(() => {
    if (reduced || canRender3D || !inView || !supportsWebGL()) return
    return whenReadyFor3D(() => {
      // The field bursts out of the portrait, so hand it the portrait's centre in the canvas's -1..1 space.
      const hero = ref.current?.getBoundingClientRect()
      const portrait = portraitRef.current?.getBoundingClientRect()
      if (hero && portrait) {
        setOrigin({
          x: ((portrait.left + portrait.width / 2 - hero.left) / hero.width) * 2 - 1,
          y: -(((portrait.top + portrait.height / 2 - hero.top) / hero.height) * 2 - 1),
        })
      }
      setCanRender3D(true)
    })
  }, [reduced, inView, canRender3D])

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== 'mouse' || !portraitRef.current) return
    const r = portraitRef.current.getBoundingClientRect()
    tiltY.set(((e.clientX - (r.left + r.width / 2)) / window.innerWidth) * 18)
    tiltX.set(-((e.clientY - (r.top + r.height / 2)) / window.innerHeight) * 14)
  }
  const onPointerLeave = () => {
    tiltX.set(0)
    tiltY.set(0)
  }
  const ring = side ?? 'base'

  const begin = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scrollTo(hero.cta.href)
  }

  return (
    <section
      ref={ref}
      id="section_1"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-brand-900 pb-24 pt-28 text-white md:min-h-[min(100svh,960px)]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(120%_90%_at_85%_10%,#535da1_0%,#2c3270_45%,#1b1f45_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-40 bottom-[-30%] -z-20 size-[640px] rounded-full bg-teal/25 blur-[120px] [animation:mesh-drift_24s_ease-in-out_infinite]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-32 top-[-20%] -z-20 size-[520px] rounded-full bg-[#8b93e6]/25 blur-[110px] [animation:mesh-drift_30s_ease-in-out_infinite_reverse]"
      />

      {canRender3D && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: fieldReady ? 1 : 0 }}
          transition={{ duration: 1.4 }}
        >
          <Suspense fallback={null}>
            <FieldMount onReady={markReady}>
              <NeuralField progress={smoothProgress} active={inView} side={side} origin={origin} pulseTarget={ref} />
            </FieldMount>
          </Suspense>
        </motion.div>
      )}

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 md:grid-cols-[1.25fr_1fr] md:gap-8 lg:px-8">
        <motion.div style={{ y: reduced ? 0 : textY }} className="order-2 text-center md:order-1 md:text-left">
          <motion.p
            className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-teal sm:text-base"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.05 }}
          >
            {hero.eyebrow}
          </motion.p>
          <h1 className="text-5xl font-bold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-7xl xl:text-8xl">
            <WordReveal text={hero.greeting} delay={0.15} />
          </h1>
          <motion.ul
            className="mx-auto mt-6 flex max-w-xl flex-col items-center gap-2.5 md:mx-0 md:items-start"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } } }}
          >
            {hero.sides.map((item) => (
              <motion.li
                key={item.href}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
                }}
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollTo(item.href)
                  }}
                  onPointerEnter={() => finePointer() && setSide(item.id)}
                  onPointerLeave={() => setSide(null)}
                  onFocus={() => setSide(item.id)}
                  onBlur={() => setSide(null)}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-base font-medium text-brand-100 backdrop-blur transition-colors hover:border-teal/60 hover:text-white sm:text-lg"
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className="text-teal transition-transform duration-300 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </a>
              </motion.li>
            ))}
          </motion.ul>
          <motion.div
            className="mt-9 flex justify-center md:justify-start"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 1.05 }}
          >
            <MagneticLink
              href={hero.cta.href}
              onClick={begin}
              whileTap={{ scale: 0.96 }}
              className="group relative inline-flex items-center gap-3 rounded-full bg-teal px-8 py-4 text-lg font-semibold text-brand-900 shadow-[0_18px_40px_-14px_rgba(20,183,137,0.8)] transition-colors hover:bg-[#2fd3a4]"
            >
              {hero.cta.label}
              <span
                aria-hidden="true"
                className="grid size-8 place-items-center rounded-full bg-brand-900 text-teal transition-transform duration-300 group-hover:translate-y-0.5"
              >
                ↓
              </span>
            </MagneticLink>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: reduced ? 0 : portraitY }}
          className="order-1 flex justify-center md:order-2 md:justify-end"
        >
          <motion.div
            ref={portraitRef}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease, delay: 0.05 }}
            style={{ rotateX, rotateY, transformPerspective: 800 }}
            className="relative"
          >
            <div aria-hidden="true" className="absolute -inset-3 [animation:ring-spin_14s_linear_infinite]">
              {(Object.keys(ringTints) as (keyof typeof ringTints)[]).map((tint) => (
                <div
                  key={tint}
                  className={`absolute inset-0 rounded-full blur-[2px] transition-opacity duration-700 ${ringTints[tint]} ${
                    ring === tint ? 'opacity-90' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
            <div className="relative size-48 overflow-hidden rounded-full border-4 border-brand-900 bg-gradient-to-b from-white to-brand-50 sm:size-60 lg:size-72 xl:size-80">
              <img
                src={hero.portrait}
                alt={hero.portraitAlt}
                width={229}
                height={232}
                fetchPriority="high"
                className="size-full scale-[1.12] object-cover object-[50%_30%]"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.a
        href="#section_2"
        onClick={(e) => {
          e.preventDefault()
          scrollTo('section_2')
        }}
        style={{ opacity: cueOpacity }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-100 sm:flex"
        aria-label="Scroll to About"
      >
        <span className="flex h-9 w-5 justify-center rounded-full border border-brand-100/70 pt-1.5">
          <span className="h-2 w-0.5 rounded bg-teal [animation:scroll-cue_1.8s_ease-in-out_infinite]" />
        </span>
        Scroll
      </motion.a>
    </section>
  )
}

function FieldMount({ children, onReady }: { children: ReactNode; onReady: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onReady, 50)
    return () => window.clearTimeout(t)
  }, [onReady])
  return <>{children}</>
}
