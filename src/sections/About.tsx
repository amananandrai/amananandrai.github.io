import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { about } from '../content'

const ease = [0.16, 1, 0.3, 1] as const

function Highlight({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' })
  return (
    <span
      ref={ref}
      className="highlight-sweep font-semibold text-brand-900"
      style={{ ['--sweep' as string]: inView ? '100%' : '0%' }}
    >
      {children}
    </span>
  )
}

/** Wraps the first occurrence of each phrase in a highlight. */
function withHighlights(sentence: string, phrases: string[], used: Set<string>): ReactNode[] {
  const pending = phrases.filter((p) => !used.has(p) && sentence.includes(p))
  if (!pending.length) return [sentence]
  const pattern = new RegExp(`(${pending.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`)
  return sentence.split(pattern).map((part, i) => {
    if (pending.includes(part) && !used.has(part)) {
      used.add(part)
      return <Highlight key={i}>{part}</Highlight>
    }
    return part
  })
}

const splitSentences = (text: string) => text.split(/(?<=[.!?])\s+/)

export function About() {
  const used = new Set<string>()
  return (
    <section id="section_2" className="relative bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease }}
        >
          <h2 className="text-4xl font-bold tracking-[-0.03em] text-brand-900 sm:text-5xl lg:text-6xl">
            {about.heading}
          </h2>
          <p className="mt-4 text-lg text-slate-500">{about.subheading}</p>
        </motion.header>

        <motion.p
          className="mt-10 text-pretty text-lg leading-relaxed text-slate-700 sm:text-[1.35rem] sm:leading-relaxed"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }}
        >
          {splitSentences(about.paragraph).map((sentence, i) => (
            <motion.span
              key={i}
              className="inline"
              variants={{
                hidden: { opacity: 0.3 },
                show: { opacity: 1, transition: { duration: 0.7, ease } },
              }}
            >
              {withHighlights(sentence, about.highlights, used)}{' '}
            </motion.span>
          ))}
        </motion.p>
      </div>
    </section>
  )
}
