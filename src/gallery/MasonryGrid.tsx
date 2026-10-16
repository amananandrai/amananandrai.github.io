import { motion } from 'framer-motion'
import type { FrameStyle, Painting } from '../content'

interface MasonryGridProps {
  paintings: Painting[]
  frame: FrameStyle['id']
  activeIndex: number | null
  onSelect: (index: number) => void
}

export function MasonryGrid({ paintings, frame, activeIndex, onSelect }: MasonryGridProps) {
  return (
    <ul className="columns-1 gap-8 sm:columns-2 lg:columns-3 [&>li]:mb-8">
      {paintings.map((painting, index) => (
        <motion.li
          key={painting.id}
          className="break-inside-avoid"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
        >
          <button
            type="button"
            onClick={() => onSelect(index)}
            aria-label={`Open ${painting.alt}`}
            className={`frame frame-${frame} group block w-full`}
          >
            {activeIndex === index ? (
              <span className="block w-full" style={{ aspectRatio: `${painting.width} / ${painting.height}` }} />
            ) : (
              <motion.img
                layoutId={`painting-${painting.id}`}
                src={painting.src}
                srcSet={`${painting.src.replace('-1200', '-600')} 600w, ${painting.src} 1200w`}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                alt={painting.alt}
                width={painting.width}
                height={painting.height}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full transition-[filter] duration-300 group-hover:brightness-105"
                style={{ aspectRatio: `${painting.width} / ${painting.height}` }}
              />
            )}
          </button>
        </motion.li>
      ))}
    </ul>
  )
}
