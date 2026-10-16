import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { lazy, Suspense, useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { hero } from '../content'
import { MagneticLink } from '../lib/Magnetic'
import { supportsWebGL } from '../lib/device'
import { useSmoothScroll } from '../lib/smoothScroll'

const NeuralField = lazy(() => import('../three/NeuralField'))

const ease = [0.16, 1, 0.3, 1] as const

/** Circle, dropped square, golden cut, compass arcs, and a spiral. Anchors drive the pen. */
const STUDY: { d: string; ax: number; ay: number; width: number }[] = [
  { d: 'M 100 28 A 72 72 0 1 1 100 172 A 72 72 0 1 1 100 28', ax: 172, ay: 100, width: 1.35 },
  { d: 'M 32 38 H 168 V 174 H 32 Z', ax: 168, ay: 38, width: 1.25 },
  { d: 'M 116 38 V 174', ax: 116, ay: 38, width: 0.9 },
  { d: 'M 116 38 H 168 V 174 H 116 Z', ax: 168, ay: 106, width: 0.85 },
  { d: 'M 32 122 H 168', ax: 32, ay: 122, width: 0.75 },
  { d: 'M 22 100 H 178', ax: 22, ay: 100, width: 0.6 },
  { d: 'M 100 22 V 178', ax: 100, ay: 22, width: 0.6 },
  { d: 'M 150 16 A 46 46 0 0 1 192 62', ax: 192, ay: 62, width: 0.9 },
  { d: 'M 12 112 A 44 44 0 0 0 52 184', ax: 12, ay: 112, width: 0.9 },
  { d: 'M 176 118 A 30 30 0 0 1 154 162', ax: 176, ay: 118, width: 0.85 },
  { d: 'M 32 38 L 48 54', ax: 32, ay: 38, width: 0.8 },
  { d: 'M 168 38 L 152 54', ax: 168, ay: 38, width: 0.8 },
  { d: 'M 32 174 L 48 158', ax: 32, ay: 174, width: 0.8 },
  { d: 'M 168 174 L 152 158', ax: 168, ay: 174, width: 0.8 },
  { d: 'M 46 150 A 7 7 0 0 1 53 157 A 12 12 0 0 1 41 169 A 18 18 0 0 1 23 151', ax: 40, ay: 162, width: 1.05 },
]

function VitruvianStudy({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const pen = useRef({ x: 100, y: 92 })
  const drawn = useRef<number[]>([])
  const opacity = useTransform(progress, [0.06, 0.52], [1, 0])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      pen.current.x = ((e.clientX - rect.left) / rect.width) * 200
      pen.current.y = ((e.clientY - rect.top) / rect.height) * 200
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    const paths = svgRef.current?.querySelectorAll('path')
    if (!paths?.length) return
    if (reduced) {
      paths.forEach((el) => {
        el.style.strokeDashoffset = '0'
      })
      return
    }
    drawn.current = Array.from(paths, () => 0)
    let frame = 0
    const started = performance.now()
    const step = (now: number) => {
      const base = Math.min(1, (now - started) / 3600)
      let pending = false
      paths.forEach((el, i) => {
        const spec = STUDY[i]
        const near = Math.max(0, 1 - Math.hypot(pen.current.x - spec.ax, pen.current.y - spec.ay) / 100)
        const draw = Math.min(1, base + near * (1 - base) * 0.92)
        const next = Math.max(drawn.current[i] ?? 0, draw)
        drawn.current[i] = next
        el.style.strokeDashoffset = (1 - next).toFixed(4)
        if (next < 0.999) pending = true
      })
      if (pending) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [reduced])

  return (
    <motion.svg
      ref={svgRef}
      viewBox="0 0 200 200"
      aria-hidden="true"
      style={{ opacity }}
      className="pointer-events-none absolute left-1/2 top-1/2 w-[186%] -translate-x-1/2 -translate-y-[62%] sm:w-[178%] sm:-translate-y-1/2 md:w-[184%] lg:w-[196%]"
    >
      {STUDY.map((spec) => (
        <path
          key={spec.d}
          d={spec.d}
          pathLength={1}
          stroke="#f0d2ae"
          strokeOpacity={0.92}
          strokeWidth={spec.width}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={1}
          strokeDashoffset={reduced ? 0 : 1}
        />
      ))}
    </motion.svg>
  )
}

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

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  useEffect(() => {
    if (reduced || canRender3D || !inView || !supportsWebGL()) return
    return whenReadyFor3D(() => setCanRender3D(true))
  }, [reduced, inView, canRender3D])

  const begin = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scrollTo(hero.cta.href)
  }

  return (
    <section
      ref={ref}
      id="section_1"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-brand-900 pb-24 pt-28 text-white md:min-h-[min(100svh,960px)]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(120%_90%_at_85%_10%,#535da1_0%,#2c3270_45%,#1b1f45_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-40 bottom-[-30%] -z-20 size-[640px] rounded-full bg-teal/25 blur-[120px]"
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
              <NeuralField progress={smoothProgress} active={inView} />
            </FieldMount>
          </Suspense>
        </motion.div>
      )}

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 md:grid-cols-[1.25fr_1fr] md:gap-8 lg:px-8">
        <motion.div
          style={{ y: reduced ? 0 : textY }}
          className="relative z-10 order-2 text-center md:order-1 md:text-left"
        >
          <h1 className="text-5xl font-bold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-7xl xl:text-8xl">
            <WordReveal text={hero.greeting} delay={0.15} />
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-xl font-medium leading-snug text-brand-100 sm:text-2xl md:mx-0 lg:text-[1.7rem]">
            <WordReveal text={hero.tagline} delay={0.45} />
          </p>
          <motion.div
            className="mt-10 flex justify-center md:justify-start"
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
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease, delay: 0.05 }}
            className="relative"
          >
            <VitruvianStudy progress={scrollYProgress} reduced={!!reduced} />
            <div
              aria-hidden="true"
              className="absolute -inset-3 z-10 rounded-full bg-[conic-gradient(from_200deg,#14b789,#535da1,#8b93e6,#14b789)] opacity-90 blur-[2px]"
            />
            <div className="relative z-10 size-48 overflow-hidden rounded-full border-4 border-brand-900 bg-gradient-to-b from-white to-brand-50 sm:size-60 lg:size-72 xl:size-80">
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
