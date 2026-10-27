import { MotionConfig } from 'framer-motion'
import { SmoothScrollProvider } from './lib/smoothScroll'
import { About } from './sections/About'
import { Hobbies, Projects, Tech } from './sections/Cards'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'
import { Nav } from './sections/Nav'
import { Publications } from './sections/Publications'

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
          <Tech />
          <Publications />
          <Projects />
          <Hobbies />
          <Contact />
        </main>
        <Footer />
      </SmoothScrollProvider>
    </MotionConfig>
  )
}
