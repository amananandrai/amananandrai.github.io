import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { BsArrowLeft, BsArrowRight, BsX } from 'react-icons/bs'
import type { Painting } from '../content'

interface LightboxProps {
  paintings: Painting[]
  index: number | null
  shared: boolean
  onClose: () => void
  onNavigate: (index: number) => void
}

export function Lightbox({ paintings, index, shared, onClose, onNavigate }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const open = index !== null
  const painting = open ? paintings[index] : null

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const html = document.documentElement
    html.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate((index + 1) % paintings.length)
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + paintings.length) % paintings.length)
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = [...dialogRef.current.querySelectorAll<HTMLElement>('button, a[href]')]
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
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      html.style.overflow = ''
      previous?.focus?.()
    }
  }, [open, index, paintings.length, onClose, onNavigate])

  return (
    <AnimatePresence>
      {painting && index !== null && (
        <motion.div
          ref={dialogRef}
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${painting.alt}, ${index + 1} of ${paintings.length}`}
          className="fixed inset-0 z-[60] flex flex-col bg-[#0b0d22]/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white sm:px-6">
            <p className="text-sm font-medium text-white/70">
              {painting.alt} · {index + 1} / {paintings.length}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid size-11 place-items-center rounded-full bg-white/10 text-2xl transition-colors hover:bg-white/20"
            >
              <BsX aria-hidden="true" />
            </button>
          </div>
          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-20"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <motion.img
              key={painting.id}
              layoutId={shared ? `painting-${painting.id}` : undefined}
              src={painting.full}
              alt={painting.alt}
              width={painting.width}
              height={painting.height}
              initial={shared ? undefined : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={shared ? undefined : { opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="max-h-full max-w-full rounded-md object-contain shadow-2xl"
              style={{ aspectRatio: `${painting.width} / ${painting.height}` }}
            />
            <button
              type="button"
              onClick={() => onNavigate((index - 1 + paintings.length) % paintings.length)}
              aria-label="Previous painting"
              className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-xl text-white transition-colors hover:bg-white/20 sm:left-5"
            >
              <BsArrowLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate((index + 1) % paintings.length)}
              aria-label="Next painting"
              className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-xl text-white transition-colors hover:bg-white/20 sm:right-5"
            >
              <BsArrowRight aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
