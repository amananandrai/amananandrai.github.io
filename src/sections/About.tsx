import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { about } from '../content'
import { Cards } from './Cards'

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

const panelLayout = ['lg:col-span-12', 'lg:col-span-7', 'lg:col-span-5']

export function About() {
  const used = new Set<string>()
  return (
    <section id="section_2" className="relative bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-4xl font-bold tracking-[-0.03em] text-brand-900 sm:text-5xl lg:text-6xl">
            {about.heading}
          </h2>
          <p className="mt-4 text-lg text-slate-500">{about.subheading}</p>
        </motion.header>

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {about.paragraphs.map((paragraph, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease, delay: index * 0.08 }}
              className={`relative overflow-hidden rounded-3xl border border-brand-100 bg-white p-7 shadow-[0_20px_50px_-30px_rgba(27,31,69,0.35)] sm:p-9 ${panelLayout[index]}`}
            >
              <span
                aria-hidden="true"
                className="mb-4 flex items-center gap-3 text-sm font-semibold tracking-[0.2em] text-teal-600"
              >
                0{index + 1}
                <span className="h-px w-10 bg-teal/40" />
              </span>
              <motion.p
                className={`relative text-pretty leading-relaxed text-slate-700 ${index === 0 ? 'max-w-4xl text-lg sm:text-[1.35rem] sm:leading-relaxed' : 'text-base sm:text-[1.05rem]'}`}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }}
              >
                {splitSentences(paragraph).map((sentence, i) => (
                  <motion.span
                    key={i}
                    className="inline"
                    variants={{
                      hidden: { opacity: 0.08 },
                      show: { opacity: 1, transition: { duration: 0.7, ease } },
                    }}
                  >
                    {withHighlights(sentence, about.highlights, used)}{' '}
                  </motion.span>
                ))}
              </motion.p>
            </motion.article>
          ))}
        </div>

        <Cards />
      </div>
    </section>
  )
}
