import { LayoutGroup, motion, MotionConfig, useReducedMotion } from 'framer-motion'
import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { BsArrowLeft, BsBadge3D, BsBoundingBoxCircles, BsGrid1X2 } from 'react-icons/bs'
import { gallery, site, type FrameStyle } from '../content'
import { forcedMode, isWeakDevice, supportsWebGL } from '../lib/device'
import { FramePicker } from './FramePicker'
import { Lightbox } from './Lightbox'
import { MasonryGrid } from './MasonryGrid'
import './frames.css'

const GalleryRoom = lazy(() => import('../three/GalleryRoom'))

type View = '3d' | '2d'

function initialView(reduced: boolean): View {
  const forced = forcedMode()
  if (forced) return forced === '3d' && !supportsWebGL() ? '2d' : forced
  if (!supportsWebGL() || isWeakDevice() || reduced) return '2d'
  return window.matchMedia('(min-width: 768px)').matches ? '3d' : '2d'
}

const ease = [0.16, 1, 0.3, 1] as const

export function GalleryPage() {
  const reduced = useReducedMotion() ?? false
  const [view, setView] = useState<View>(() => initialView(reduced))
  const [frame, setFrame] = useState<FrameStyle['id']>(gallery.defaultFrame)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [active, setActive] = useState<number | null>(null)
  const webgl = supportsWebGL()

  useEffect(() => {
    document.documentElement.dataset.galleryView = view
  }, [view])

  const closePicker = useCallback(() => setPickerOpen(false), [])
  const closeLightbox = useCallback(() => setActive(null), [])

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-paper">
        <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5">
          <nav
            aria-label="Gallery"
            className="glass mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border border-white/60 pl-2 pr-5 shadow-[0_4px_20px_-10px_rgba(27,31,69,0.25)]"
          >
            <a
              href="/"
              className="group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[15px] font-medium text-brand-900 transition-colors hover:bg-brand-50"
            >
              <BsArrowLeft aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5" />
              {gallery.backLink}
            </a>
            <a href="/" className="text-2xl font-bold tracking-tight text-brand-900">
              {site.brand}
              <span className="text-teal">.</span>
            </a>
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-6 pb-20 pt-28 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left"
          >
            <div>
              <h1 className="text-5xl font-bold tracking-[-0.035em] text-brand-900 sm:text-6xl">{gallery.heading}</h1>
              <p className="mt-3 text-lg text-slate-500">{gallery.intro}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {webgl && (
                <div
                  role="group"
                  aria-label="Gallery view"
                  className="relative flex rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200"
                >
                  {(
                    [
                      { id: '3d', label: '3D room', Icon: BsBadge3D },
                      { id: '2d', label: 'Grid', Icon: BsGrid1X2 },
                    ] as const
                  ).map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={view === id}
                      onClick={() => setView(id)}
                      className={`relative z-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        view === id ? 'text-white' : 'text-slate-600 hover:text-brand-900'
                      }`}
                    >
                      {view === id && (
                        <motion.span
                          layoutId="view-pill"
                          className="absolute inset-0 -z-10 rounded-full bg-brand-900"
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      )}
                      <Icon aria-hidden="true" />
                      {label}
                    </button>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => setPickerOpen((o) => !o)}
                aria-expanded={pickerOpen}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-white shadow-[0_12px_30px_-12px_rgba(83,93,161,0.9)] transition-colors hover:bg-brand-700"
              >
                <BsBoundingBoxCircles aria-hidden="true" />
                {gallery.button}
              </button>
            </div>
          </motion.div>

          <LayoutGroup>
            <div className="mt-12">
              {view === '3d' ? (
                <div className="space-y-4">
                  <div className="relative h-[62vh] min-h-[420px] overflow-hidden rounded-[2rem] bg-brand-900 shadow-[0_30px_80px_-40px_rgba(27,31,69,0.8)]">
                    <Suspense
                      fallback={
                        <div className="grid h-full place-items-center text-sm text-brand-100">
                          Hanging the paintings…
                        </div>
                      }
                    >
                      <GalleryRoom paintings={gallery.paintings} frame={frame} onSelect={setActive} />
                    </Suspense>
                    <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/35 px-4 py-1.5 text-xs font-medium text-white/85 backdrop-blur">
                      Drag to look around · click a painting to open it
                    </p>
                  </div>
                  <ul className="flex justify-center gap-3" aria-label="Paintings">
                    {gallery.paintings.map((p, i) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => setActive(i)}
                          aria-label={`Open ${p.alt}`}
                          className="block h-14 overflow-hidden rounded-lg ring-2 ring-transparent transition hover:ring-brand focus-visible:ring-brand"
                          style={{ aspectRatio: `${p.width} / ${p.height}` }}
                        >
                          <img
                            src={p.src.replace('-1200', '-600')}
                            alt=""
                            loading="lazy"
                            className="size-full object-cover"
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <MasonryGrid paintings={gallery.paintings} frame={frame} activeIndex={active} onSelect={setActive} />
              )}
            </div>
            <Lightbox
              paintings={gallery.paintings}
              index={active}
              shared={view === '2d'}
              onClose={closeLightbox}
              onNavigate={setActive}
            />
          </LayoutGroup>
        </main>

        <FramePicker open={pickerOpen} value={frame} onChange={setFrame} onClose={closePicker} />
      </div>
    </MotionConfig>
  )
}
