import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { BsArrowUpRight, BsFileEarmarkText, BsJournalText } from 'react-icons/bs'
import { publications } from '../content'

const ease = [0.16, 1, 0.3, 1] as const

export function Publications() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 55%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

  return (
    <section id="publications" className="overflow-x-clip bg-paper pb-24 sm:pb-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.h3
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
          className="mb-10 flex items-center gap-3 text-2xl font-bold tracking-tight text-teal-600 sm:text-3xl"
        >
          <span aria-hidden="true" className="h-0.5 w-8 rounded bg-teal" />
          <BsJournalText aria-hidden="true" className="text-brand" />
          {publications.heading}
        </motion.h3>

        <ol ref={ref} className="relative ml-3 space-y-10 sm:ml-6 md:mx-auto md:max-w-4xl">
          <span aria-hidden="true" className="absolute left-0 top-2 h-[calc(100%-1rem)] w-0.5 rounded bg-brand-100" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY }}
            className="absolute left-0 top-2 h-[calc(100%-1rem)] w-0.5 origin-top rounded bg-gradient-to-b from-teal to-brand"
          />
          {publications.papers.map((paper, i) => (
            <motion.li
              key={paper.href}
              initial={{ opacity: 0, x: 48 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease, delay: i * 0.1 }}
              className="relative pl-8 sm:pl-12"
            >
              <motion.span
                aria-hidden="true"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.25 }}
                className="absolute -left-[9px] top-6 size-5 rounded-full border-4 border-paper bg-teal shadow-[0_0_0_4px_rgba(20,183,137,0.2)]"
              />
              <a
                href={paper.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_-28px_rgba(27,31,69,0.45)] transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-[0_24px_60px_-30px_rgba(83,93,161,0.6)] sm:p-8"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold">
                  <span className="inline-flex items-center gap-1.5 text-brand">
                    <BsFileEarmarkText aria-hidden="true" />
                    {paper.label}
                  </span>
                  <span className="rounded-full bg-teal/10 px-2.5 py-0.5 text-teal-600">{paper.year}</span>
                </div>
                <h4 className="mt-3 flex items-start gap-3 text-lg font-bold leading-snug tracking-tight text-brand-900 sm:text-xl">
                  <span className="flex-1 text-balance">{paper.title}</span>
                  <BsArrowUpRight
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-slate-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal"
                  />
                </h4>
                <p className="mt-2 text-sm text-slate-500">
                  {paper.venue} · {paper.series} · {paper.publisher}, {paper.year}
                </p>
              </a>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
