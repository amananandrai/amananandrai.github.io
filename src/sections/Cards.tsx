import { AnimatePresence, LayoutGroup, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useState, type PointerEvent, type ReactNode } from 'react'
import type { IconType } from 'react-icons'
import {
  BsArrowUpRight,
  BsAward,
  BsBook,
  BsBrush,
  BsBuildings,
  BsChevronDown,
  BsCodeSquare,
  BsFileEarmarkText,
  BsFilm,
  BsGithub,
  BsImages,
  BsJournalBookmark,
  BsJournalText,
  BsMap,
  BsPalette,
  BsPencilSquare,
  BsSearch,
  BsStack,
  BsTree,
} from 'react-icons/bs'
import {
  gallery,
  hobbies,
  projects,
  tech,
  type CardGroup,
  type CardLink,
  type IconName,
  type LinkCard,
} from '../content'
import { projectArt } from './projectArt'

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
  images: BsImages,
  notebook: BsJournalBookmark,
  document: BsFileEarmarkText,
  farm: BsTree,
  city: BsBuildings,
  map: BsMap,
}

const ease = [0.16, 1, 0.3, 1] as const

const hobbiesLayout: Record<string, string> = {
  painting: 'sm:col-span-2 lg:row-span-3',
  movies: 'sm:col-span-2 lg:col-span-1',
}

const techLayout: Record<string, string> = {
  'competitive-coding': 'sm:col-span-2',
  'stack-exchange': 'sm:col-span-2',
}

const logoFit: Record<string, string> = {
  '/images/logos/webp/codechef.webp': 'scale-[1.45]',
}

export function LogoTile({ link, size = 'md', icon }: { link: CardLink; size?: 'sm' | 'md'; icon?: IconType }) {
  const dims = size === 'sm' ? 'size-10 p-1' : 'size-12 p-1.5'
  const Fallback = icon
  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 ${dims}`}
    >
      {link.logo ? (
        <img
          src={link.logo}
          alt={link.logoAlt ?? ''}
          loading="lazy"
          decoding="async"
          className={`size-full rounded-md object-contain ${logoFit[link.logo] ?? ''}`}
        />
      ) : Fallback ? (
        <Fallback aria-hidden="true" className="text-xl text-brand" />
      ) : null}
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
        <LogoTile link={link} icon={icons[card.icon]} />
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
        ) : null}
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

function SideHeader({ group }: { group: CardGroup }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease }}
      className="mb-10 max-w-2xl"
    >
      <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">
        <span aria-hidden="true" className="h-0.5 w-8 rounded bg-teal" />
        {group.eyebrow}
      </p>
      <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-brand-900 sm:text-5xl">{group.heading}</h2>
      <p className="mt-3 text-lg text-slate-500">{group.intro}</p>
    </motion.header>
  )
}

const stagger = { show: { transition: { staggerChildren: 0.07 } } }

function Group({ group, layout, columns }: { group: CardGroup; layout: Record<string, string>; columns: string }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  return (
    <LayoutGroup id={group.id}>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className={`grid grid-flow-row-dense gap-4 sm:grid-cols-2 ${columns}`}
      >
        {group.cards.map((card) =>
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
  )
}

function ProjectTile({ card }: { card: LinkCard }) {
  const tilt = useTilt(true)
  const link = card.links[0]
  const Icon = icons[card.icon]
  const Art = projectArt[card.id]
  return (
    <motion.a {...linkProps(link)} {...tilt} variants={tileVariants} className={`${tileBase} flex flex-col p-3`}>
      <Spotlight />
      <span
        aria-hidden="true"
        className="relative block h-36 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 via-white to-teal/10 text-brand ring-1 ring-brand-100/70"
      >
        {Art ? (
          <Art className="size-full transition-transform duration-700 ease-out group-hover:-translate-y-1 group-hover:scale-[1.06]" />
        ) : (
          <Icon className="absolute inset-0 m-auto text-5xl opacity-40" />
        )}
      </span>
      <span className="flex flex-1 flex-col gap-3 p-3 pt-5">
        <span className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-lg text-brand">
            <Icon aria-hidden="true" />
          </span>
          <h3 className="min-w-0 flex-1 text-lg font-bold leading-tight tracking-tight text-brand-900 sm:text-xl">
            {card.title}
          </h3>
          <BsArrowUpRight
            aria-hidden="true"
            className="text-lg text-slate-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal"
          />
        </span>
        {card.description && <span className="text-[15px] leading-relaxed text-slate-600">{card.description}</span>}
        {card.tags && (
          <span className="mt-auto flex flex-wrap gap-2 pt-1">
            {card.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-semibold text-teal-600">
                {tag}
              </span>
            ))}
          </span>
        )}
      </span>
    </motion.a>
  )
}

const container = 'mx-auto max-w-6xl px-6 lg:px-8'

export function Tech() {
  return (
    <section id={tech.id} className="bg-paper pb-16 pt-8 sm:pb-20">
      <div className={container}>
        <SideHeader group={tech} />
        <Group group={tech} layout={techLayout} columns="lg:grid-cols-4" />
      </div>
    </section>
  )
}

export function Projects() {
  return (
    <section id={projects.id} className="bg-paper pb-24 sm:pb-32">
      <div className={container}>
        <SideHeader group={projects} />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.cards.map((card) => (
            <ProjectTile key={card.id} card={card} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export function Hobbies() {
  return (
    <section id={hobbies.id} className="bg-paper px-3 pb-10 sm:px-5">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-brand-50 py-20 ring-1 ring-brand-100 sm:rounded-[2.5rem] sm:py-24">
        <div className="px-3 sm:px-7 lg:px-8">
          <SideHeader group={hobbies} />
          <Group group={hobbies} layout={hobbiesLayout} columns="lg:grid-cols-3" />
        </div>
      </div>
    </section>
  )
}
