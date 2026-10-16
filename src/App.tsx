import { MotionConfig } from 'framer-motion'
import { about, hero, site } from './content'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <main>
        <section id="section_1" className="p-10">
          <h1 className="text-4xl font-bold">{hero.greeting}</h1>
          <p>{hero.tagline}</p>
          <p className="text-brand">{site.brand}</p>
        </section>
        <section id="section_2" className="p-10">
          <h2 className="text-3xl font-bold">{about.heading}</h2>
        </section>
      </main>
    </MotionConfig>
  )
}
