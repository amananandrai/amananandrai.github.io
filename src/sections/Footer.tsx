import { footer, hobbies, projects, publications, tech } from '../content'

const words = [
  ...tech.cards.map((c) => c.title),
  publications.heading,
  ...projects.cards.map((c) => c.title),
  ...hobbies.cards.map((c) => c.title),
]

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="overflow-hidden bg-paper pb-8 pt-4">
      <div
        aria-hidden="true"
        className="relative flex overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      >
        <div className="flex shrink-0 [animation:marquee_40s_linear_infinite]">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center">
              {words.map((word) => (
                <li
                  key={`${copy}-${word}`}
                  className="flex items-center whitespace-nowrap text-2xl font-bold tracking-tight text-brand/80 sm:text-3xl"
                >
                  <span className="px-6">{word}</span>
                  <span className="size-2 rounded-full bg-teal/60" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-slate-500">{footer.copyright(year)}</p>
    </footer>
  )
}
