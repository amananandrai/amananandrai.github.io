import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import type { IconType } from 'react-icons'
import {
  BsCheck2,
  BsEnvelope,
  BsGithub,
  BsInstagram,
  BsLinkedin,
  BsPinterest,
  BsSend,
  BsTwitterX,
  BsYoutube,
} from 'react-icons/bs'
import { contact, type Social } from '../content'
import { MagneticLink } from '../lib/Magnetic'

const ease = [0.16, 1, 0.3, 1] as const

const socialIcons: Record<Social['icon'], IconType> = {
  linkedin: BsLinkedin,
  instagram: BsInstagram,
  youtube: BsYoutube,
  github: BsGithub,
  x: BsTwitterX,
  pinterest: BsPinterest,
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  }
}

function MeshBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-brand-900">
      <div className="absolute -left-[15%] -top-[30%] size-[70%] rounded-full bg-brand opacity-80 blur-[90px] [animation:mesh-drift_18s_ease-in-out_infinite]" />
      <div className="absolute -bottom-[35%] right-[-10%] size-[75%] rounded-full bg-teal opacity-60 blur-[100px] [animation:mesh-drift_22s_ease-in-out_infinite_reverse]" />
      <div className="absolute left-[30%] top-[20%] size-[45%] rounded-full bg-[#8b93e6] opacity-50 blur-[90px] [animation:mesh-drift_26s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
    </div>
  )
}

export function Contact() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const onCopy = async () => {
    const ok = await copyText(contact.email)
    if (!ok) {
      window.location.href = `mailto:${contact.email}`
      return
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2200)
  }

  return (
    <section id="section_3" className="bg-paper px-3 pb-10 sm:px-5">
      <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[2rem] px-4 py-14 sm:rounded-[2.5rem] sm:px-12 sm:py-20 lg:py-24">
        <MeshBackground />
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_1.05fr] md:gap-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease }}
            className="text-center text-6xl font-bold tracking-[-0.04em] text-white sm:text-7xl md:text-left lg:text-8xl"
          >
            <span className="bg-[linear-gradient(110deg,#fff_35%,#14b789_50%,#fff_65%)] bg-[length:250%_100%] bg-clip-text text-transparent [animation:shimmer_6s_ease-in-out_infinite]">
              {contact.banner}
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease, delay: 0.1 }}
            className="min-w-0 rounded-3xl bg-white p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)] sm:p-8"
          >
            <h3 className="text-2xl font-bold tracking-tight text-brand-900">{contact.heading}</h3>

            <div className="mt-5 flex items-stretch gap-2">
              <button
                type="button"
                onClick={onCopy}
                className="group relative flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-paper px-3 py-3 text-left sm:px-4 transition-colors hover:border-brand"
                aria-describedby="copy-status"
              >
                <span className="relative grid size-9 shrink-0 place-items-center rounded-xl bg-brand text-white">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? 'check' : 'mail'}
                      initial={{ scale: 0.4, opacity: 0, rotate: -30 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                      className="grid"
                    >
                      {copied ? <BsCheck2 aria-hidden="true" /> : <BsEnvelope aria-hidden="true" />}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base font-medium text-brand-900 sm:text-lg">
                    {contact.email}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {copied ? 'Copied to clipboard' : 'Click to copy'}
                  </span>
                </span>
                <AnimatePresence>
                  {copied && (
                    <motion.span
                      initial={{ opacity: 0, y: 8, scale: 0.9 }}
                      animate={{ opacity: 1, y: -34, scale: 1 }}
                      exit={{ opacity: 0, y: -44 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                      className="pointer-events-none absolute right-4 top-0 rounded-full bg-teal px-3 py-1 text-xs font-semibold text-brand-900 shadow-lg"
                      aria-hidden="true"
                    >
                      Copied!
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <a
                href={`mailto:${contact.email}`}
                aria-label={`Email ${contact.email}`}
                title="Send an email"
                className="hidden w-14 shrink-0 place-items-center rounded-2xl border border-slate-200 text-lg text-brand sm:grid transition-colors hover:border-brand hover:bg-brand hover:text-white"
              >
                <BsSend aria-hidden="true" />
              </a>
            </div>
            <a
              href={`mailto:${contact.email}`}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand underline-offset-4 hover:underline sm:hidden"
            >
              <BsSend aria-hidden="true" />
              Send an email
            </a>
            <p id="copy-status" role="status" aria-live="polite" className="sr-only">
              {copied ? `${contact.email} copied to clipboard` : ''}
            </p>

            <h4 className="mt-7 text-lg font-semibold text-brand-900">{contact.followHeading}</h4>
            <ul className="mt-3 grid grid-cols-6 gap-1.5 sm:flex sm:flex-wrap sm:gap-2.5">
              {contact.socials.map((social) => {
                const Icon = socialIcons[social.icon]
                return (
                  <li key={social.href} className="sm:w-12">
                    <MagneticLink
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      strength={0.45}
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                      className="group relative grid aspect-square w-full place-items-center rounded-2xl bg-brand-50 text-xl text-brand transition-colors hover:bg-brand hover:text-white focus-visible:bg-brand focus-visible:text-white"
                    >
                      <Icon aria-hidden="true" />
                      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg bg-brand-900 px-2 py-1 text-xs font-medium text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                        {social.label}
                      </span>
                    </MagneticLink>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
