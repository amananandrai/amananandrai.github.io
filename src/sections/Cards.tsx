import { AnimatePresence, LayoutGroup, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useState, type PointerEvent, type ReactNode } from 'react'
import type { IconType } from 'react-icons'
import {
  BsArrowUpRight,
  BsAward,
  BsBook,
  BsBrush,
  BsChevronDown,
  BsCodeSquare,
  BsFilm,
  BsGithub,
  BsJournalText,
  BsPalette,
  BsPencilSquare,
  BsSearch,
  BsStack,
} from 'react-icons/bs'
import { creativity, gallery, technologies, type CardLink, type IconName, type LinkCard } from '../content'

export const icons: Record<IconName, IconType> = {
  palette: BsPalette,
  brush: BsBrush,
  stack: BsStack,
  film: BsFilm,
  book: BsBook,
  code: BsCodeSquare,
  pencil: BsPencilSquare,
  github: BsGithub,
  journal: BsJournalText,
  award: BsAward,
  search: BsSearch,
}

const ease = [0.16, 1, 0.3, 1] as const

const creativityLayout: Record<string, string> = {
  painting: 'sm:col-span-2 lg:row-span-2',
}

const technologyLayout: Record<string, string> = {
  'competitive-coding': 'sm:col-span-2',
}

const logoFit: Record<string, string> = {
  '/images/logos/codechef.png': 'scale-[1.45]',
}

export function LogoTile({ link, size = 'md' }: { link: CardLink; size?: 'sm' | 'md' }) {
  const dims = size === 'sm' ? 'size-10 p-1' : 'size-12 p-1.5'
  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 ${dims}`}
    >
      <img
        src={link.logo}
        alt={link.logoAlt}
        loading="lazy"
        decoding="async"
        className={`size-full rounded-md object-contain ${logoFit[link.logo] ?? ''}`}
      />
    </span>
  )
}

function linkProps(link: CardLink) {
  return { href: link.href, target: '_blank', rel: link.internal ? undefined : 'noopener noreferrer' }
}

function useTilt(enabled: boolean) {
  const reduced = useReducedMotion()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const rotateX = useSpring(rx, { stiffness: 200, damping: 20 })
  const rotateY = useSpring(ry, { stiffness: 200, damping: 20 })

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    mx.set(px * 100)
    my.set(py * 100)
    e.currentTarget.style.setProperty('--mx', `${px * 100}%`)
    e.currentTarget.style.setProperty('--my', `${py * 100}%`)
    if (!enabled || reduced) return
    ry.set((px - 0.5) * 9)
    rx.set(-(py - 0.5) * 9)
  }
  const onPointerLeave = () => {
    rx.set(0)
    ry.set(0)
  }
  return { style: { rotateX, rotateY, transformPerspective: 900 }, onPointerMove, onPointerLeave }
}

function Spotlight() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background:
          'radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(20,183,137,0.16), rgba(83,93,161,0.08) 40%, transparent 70%)',
      }}
    />
  )
}

function TileHeader({ card, trailing }: { card: LinkCard; trailing?: ReactNode }) {
  const Icon = icons[card.icon]
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-xl text-brand">
        <Icon aria-hidden="true" />
      </span>
      <h4 className="min-w-0 flex-1 text-lg font-bold leading-tight tracking-tight text-brand-900 sm:text-xl">
        {card.title}
      </h4>
      {trailing}
    </div>
  )
}

const tileBase =
  'group relative isolate min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_-28px_rgba(27,31,69,0.45)] transition-[border-color,box-shadow] duration-300 hover:border-brand-100 hover:shadow-[0_24px_60px_-30px_rgba(83,93,161,0.6)]'

function SingleTile({ card, className }: { card: LinkCard; className: string }) {
  const tilt = useTilt(true)
  const link = card.links[0]
  return (
    <motion.a
      layout
      {...linkProps(link)}
      {...tilt}
      variants={tileVariants}
      className={`${tileBase} flex flex-col gap-5 ${className}`}
    >
      <Spotlight />
      <TileHeader
        card={card}
        trailing={
          <BsArrowUpRight
            aria-hidden="true"
            className="text-lg text-slate-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal"
          />
        }
      />
      {card.id === 'painting' && <PaintingStrip />}
      <span className="mt-auto flex items-center gap-3">
        <LogoTile link={link} />
        <span className="text-base font-medium text-slate-700 group-hover:text-brand-900">{link.label}</span>
      </span>
      {card.flair && <Flair flair={card.flair} />}
    </motion.a>
  )
}

function PaintingStrip() {
  return (
    <span className="flex items-center justify-center gap-2 px-1 sm:gap-4 lg:flex-1" aria-hidden="true">
      {gallery.paintings.map((p, i) => (
        <span
          key={p.id}
          className="block min-w-0 overflow-hidden rounded-lg border-4 border-white shadow-lg ring-1 ring-slate-200 transition-[translate] duration-500 ease-out group-hover:-translate-y-1.5"
          style={{
            aspectRatio: `${p.width} / ${p.height}`,
            flex: `${p.width / p.height} 1 0`,
            rotate: `${(i - 1) * 4}deg`,
            transitionDelay: `${i * 60}ms`,
          }}
        >
          <img
            src={p.src.replace('-1200', '-600')}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        </span>
      ))}
    </span>
  )
}

function Flair({ flair }: { flair: NonNullable<LinkCard['flair']> }) {
  const [failed, setFailed] = useState(false)
  return (
    <span className="flex h-[58px] items-center">
      {failed ? (
        <span className="text-sm text-slate-500">profile for codeczar on Stack Exchange</span>
      ) : (
        <img
          src={flair.src}
          width={flair.width}
          height={flair.height}
          alt={flair.alt}
          title={flair.title}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-[58px] w-[208px]"
        />
      )}
    </span>
  )
}

function MultiTile({
  card,
  className,
  expanded,
  onToggle,
}: {
  card: LinkCard
  className: string
  expanded: boolean
  onToggle: () => void
}) {
  const tilt = useTilt(!expanded)
  const panelId = `${card.id}-links`
  return (
    <motion.div
      layout
      {...tilt}
      variants={tileVariants}
      transition={{ layout: { duration: 0.55, ease } }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('a,button')) return
        onToggle()
      }}
      className={`${tileBase} flex cursor-pointer flex-col gap-5 ${expanded ? 'col-span-full lg:row-span-1' : className}`}
    >
      <Spotlight />
      <motion.div layout="position">
        <TileHeader card={card} />
      </motion.div>

      <AnimatePresence mode="popLayout" initial={false}>
        {expanded ? (
          <motion.ul
            key="expanded"
            id={panelId}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.4, ease, delay: 0.1 }}
            className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
          >
            {card.links.map((link, i) => (
              <motion.li
                key={link.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + i * 0.05, duration: 0.4, ease }}
              >
                <a
                  {...linkProps(link)}
                  className="group/link flex items-center gap-3 rounded-2xl border border-transparent p-2 pr-4 transition-colors hover:border-brand-100 hover:bg-brand-50/60"
                >
                  <LogoTile link={link} />
                  <span className="flex-1 text-base font-medium text-slate-700 group-hover/link:text-brand-900">
                    {link.label}
                  </span>
                  <BsArrowUpRight aria-hidden="true" className="text-slate-400 group-hover/link:text-teal" />
                </a>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.p
            key="collapsed"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            className="text-sm leading-snug text-slate-500"
          >
            {card.links.map((l) => l.label).join(' · ')}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div layout="position" className="mt-auto flex items-end gap-2">
        {!expanded && (
          <ul className="flex flex-wrap gap-2" aria-label={`${card.title} links`}>
            {card.links.map((link) => (
              <li key={link.href}>
                <a
                  {...linkProps(link)}
                  title={link.label}
                  aria-label={link.label}
                  className="block rounded-xl transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1"
                >
                  <LogoTile link={link} />
                </a>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={expanded ? panelId : undefined}
          className="ml-auto flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition-colors hover:border-brand hover:text-brand"
        >
          <span className="sr-only">{expanded ? `Collapse ${card.title}` : `Show all ${card.title} links`}</span>
          <span aria-hidden="true">{expanded ? 'Less' : card.links.length}</span>
          <motion.span aria-hidden="true" animate={{ rotate: expanded ? 180 : 0 }} className="grid">
            <BsChevronDown />
          </motion.span>
        </button>
      </motion.div>
    </motion.div>
  )
}

const tileVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease } },
}

function Group({
  heading,
  cards,
  layout,
  columns,
}: {
  heading: string
  cards: LinkCard[]
  layout: Record<string, string>
  columns: string
}) {
  const [expanded, setExpanded] = useState<string | null>(null)
  return (
    <div className="mt-20">
      <motion.h3
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease }}
        className="mb-6 flex items-center gap-3 text-2xl font-bold tracking-tight text-teal-600 sm:text-3xl"
      >
        <span aria-hidden="true" className="h-0.5 w-8 rounded bg-teal" />
        {heading}
      </motion.h3>
      <LayoutGroup id={heading}>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          className={`grid grid-flow-row-dense gap-4 sm:grid-cols-2 ${columns}`}
        >
          {cards.map((card) =>
            card.links.length > 1 ? (
              <MultiTile
                key={card.id}
                card={card}
                className={layout[card.id] ?? ''}
                expanded={expanded === card.id}
                onToggle={() => setExpanded((cur) => (cur === card.id ? null : card.id))}
              />
            ) : (
              <SingleTile key={card.id} card={card} className={layout[card.id] ?? ''} />
            ),
          )}
        </motion.div>
      </LayoutGroup>
    </div>
  )
}

export function Cards() {
  return (
    <>
      <Group heading={creativity.heading} cards={creativity.cards} layout={creativityLayout} columns="lg:grid-cols-4" />
      <Group
        heading={technologies.heading}
        cards={technologies.cards}
        layout={technologyLayout}
        columns="lg:grid-cols-3"
      />
    </>
  )
}
