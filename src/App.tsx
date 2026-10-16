import { MotionConfig } from 'framer-motion'
import { SmoothScrollProvider } from './lib/smoothScroll'
import { About } from './sections/About'
import { Hero } from './sections/Hero'
import { Nav } from './sections/Nav'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>
        <a
          href="#section_2"
          className="sr-only z-[70] rounded-lg bg-white px-4 py-2 font-medium text-brand-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Nav />
        <main>
          <Hero />
          <About />
          <section id="section_3" className="h-screen p-10" />
        </main>
      </SmoothScrollProvider>
    </MotionConfig>
  )
}
