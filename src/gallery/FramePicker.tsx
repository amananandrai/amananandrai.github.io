import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { BsCheck2, BsX } from 'react-icons/bs'
import { gallery, type FrameStyle } from '../content'

interface FramePickerProps {
  open: boolean
  value: FrameStyle['id']
  onChange: (id: FrameStyle['id']) => void
  onClose: () => void
}

export function FramePicker({ open, value, onChange, onClose }: FramePickerProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const onKeyDownGroup = (e: React.KeyboardEvent) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return
    e.preventDefault()
    const ids = gallery.frames.map((f) => f.id)
    const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1
    const next = ids[(ids.indexOf(value) + step + ids.length) % ids.length]
    onChange(next)
    panelRef.current?.querySelector<HTMLButtonElement>(`[data-frame="${next}"]`)?.focus()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby="frame-picker-title"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="fixed inset-x-3 bottom-3 z-50 max-h-[70vh] overflow-y-auto rounded-3xl bg-white p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] ring-1 ring-black/5 sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-24 sm:w-[360px] sm:p-6"
        >
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <h2 id="frame-picker-title" className="text-xl font-bold text-brand-900">
              {gallery.modalTitle}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid size-9 place-items-center rounded-full text-2xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <BsX aria-hidden="true" />
            </button>
          </div>
          <div
            role="radiogroup"
            aria-labelledby="frame-picker-title"
            className="grid grid-cols-5 gap-2 sm:grid-cols-1"
            onKeyDown={onKeyDownGroup}
          >
            {gallery.frames.map((frame) => {
              const selected = frame.id === value
              return (
                <button
                  key={frame.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  data-frame={frame.id}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => onChange(frame.id)}
                  className={`relative flex w-full flex-col items-center gap-2 rounded-2xl border-2 p-2 text-center transition-colors sm:flex-row sm:gap-4 sm:p-3 sm:text-left ${
                    selected ? 'border-brand bg-brand-50' : 'border-slate-100 hover:border-brand-100 hover:bg-paper'
                  }`}
                >
                  <span className={`size-8 shrink-0 swatch-${frame.id}`} aria-hidden="true" />
                  <span className="flex-1">
                    <span className="block text-[11px] font-semibold leading-tight text-brand-900 sm:text-[0.95rem]">
                      {frame.name}
                    </span>
                    <span className="hidden text-xs text-slate-500 sm:block">{frame.description}</span>
                  </span>
                  {selected && (
                    <motion.span
                      layoutId="frame-check"
                      className="hidden size-6 place-items-center rounded-full bg-brand text-white sm:grid"
                      aria-hidden="true"
                    >
                      <BsCheck2 />
                    </motion.span>
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
