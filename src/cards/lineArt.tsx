import type { ReactNode } from 'react'

function ring(cx: number, cy: number, r: number) {
  return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r}`
}

function Stroke({ d, delay = 0 }: { d: string; delay?: number }) {
  return <path d={d} pathLength={1} style={{ animationDelay: `${delay}ms` }} />
}

const cornerClass: Record<string, string> = {
  painting: 'top-16 right-2 size-36 sm:size-44',
  'stack-exchange': 'top-9 right-1 size-28 sm:size-32',
  movies: 'right-1 bottom-1 size-24',
  books: 'right-1 bottom-1 size-24',
}

function Art({ id, children }: { id: string; children: ReactNode }) {
  const place = cornerClass[id] ?? 'bottom-1 right-14 size-24 sm:right-16 sm:size-28'
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={`card-line-art pointer-events-none absolute ${place}`}>
      {children}
    </svg>
  )
}

function AiArt() {
  return (
    <Art id="ai-art">
      <Stroke d="M18 100 C 36 82, 52 70, 66 58" />
      <Stroke d="M60 64 L 74 50" delay={70} />
      <Stroke d="M66 58 C 82 48, 96 40, 108 28" delay={120} />
      <Stroke d="M70 52 C 88 42, 100 36, 112 30" delay={170} />
      <Stroke d="M62 48 C 78 36, 90 28, 100 18" delay={220} />
      <Stroke d="M34 26 L 36 38 L 48 40 L 36 42 L 34 54 L 32 42 L 20 40 L 32 38 Z" delay={300} />
    </Art>
  )
}

function Painting() {
  return (
    <Art id="painting">
      <Stroke d="M36 104 L 58 24 L 80 104" />
      <Stroke d="M44 72 H 72" delay={80} />
      <Stroke d="M46 40 H 70 V 66 H 46 Z" delay={140} />
      <Stroke d="M84 62 H 116" delay={220} />
      <Stroke d="M84 62 V 108" delay={280} />
      <Stroke d="M92 72 H 116" delay={340} />
      <Stroke d="M92 72 V 108" delay={400} />
    </Art>
  )
}

function StackExchange() {
  return (
    <Art id="stack-exchange">
      <Stroke d="M16 30 H 70 V 60 H 42 L 30 74 V 60 H 16 Z" />
      <Stroke d="M10 24 L 22 36 M 64 24 L 76 36 M 10 66 L 20 56" delay={90} />
      <Stroke d="M48 52 H 106 V 86 H 78 L 64 100 V 86 H 48 Z" delay={180} />
      <Stroke d="M42 46 L 54 58 M 100 46 L 112 58 M 100 92 L 110 82" delay={270} />
    </Art>
  )
}

function Movies() {
  return (
    <Art id="movies">
      <Stroke d={ring(46, 68, 26)} />
      <Stroke d={ring(46, 68, 7)} delay={80} />
      <Stroke d="M46 42 V 94 M 20 68 H 72 M 28 50 L 64 86 M 64 50 L 28 86" delay={150} />
      <Stroke d="M74 22 H 114 V 42 H 74 Z" delay={230} />
      <Stroke d="M78 22 L 84 12 H 92 L 86 22" delay={300} />
      <Stroke d="M94 22 L 100 12 H 108 L 102 22" delay={360} />
    </Art>
  )
}

function Books() {
  return (
    <Art id="books">
      <Stroke d="M58 34 C 44 36, 22 44, 20 86 C 28 74, 44 70, 58 74 Z" />
      <Stroke d="M62 34 C 76 36, 98 44, 100 86 C 92 74, 76 70, 62 74 Z" delay={90} />
      <Stroke d="M60 30 V 90" delay={160} />
      <Stroke d="M78 48 A 5 5 0 0 1 84 56 A 9 9 0 0 1 72 64 A 14 14 0 0 1 86 46" delay={240} />
    </Art>
  )
}

function CompetitiveCoding() {
  return (
    <Art id="competitive-coding">
      <Stroke d="M16 28 H 104 M16 52 H 104 M16 76 H 104 M16 100 H 104" />
      <Stroke d="M28 16 V 108 M52 16 V 108 M76 16 V 108 M100 16 V 108" delay={80} />
      <Stroke d="M28 100 V 76 H 52 V 52 H 76 V 28 H 100" delay={180} />
    </Art>
  )
}

function Blogging() {
  return (
    <Art id="blogging">
      <Stroke d="M14 74 H 106" />
      <Stroke d="M14 90 H 106" delay={60} />
      <Stroke d="M14 106 H 96" delay={110} />
      <Stroke d="M28 104 C 46 78, 66 48, 98 16" delay={180} />
      <Stroke d="M98 16 C 90 26, 86 32, 78 34" delay={250} />
      <Stroke d="M72 46 C 62 38, 56 30, 60 20" delay={320} />
      <Stroke d="M56 64 C 44 54, 40 44, 46 32" delay={380} />
    </Art>
  )
}

function Programming() {
  return (
    <Art id="programming">
      <Stroke d="M14 22 H 106 V 104 H 14 Z" />
      <Stroke d="M14 38 H 106" delay={70} />
      <Stroke d={ring(26, 30, 2.4)} delay={120} />
      <Stroke d={ring(36, 30, 2.4)} delay={150} />
      <Stroke d={ring(46, 30, 2.4)} delay={180} />
      <Stroke d="M32 90 V 56 H 60 V 74 H 92" delay={240} />
      <Stroke d="M60 56 H 90 V 48" delay={320} />
      <Stroke d={ring(32, 90, 2.6)} delay={380} />
      <Stroke d={ring(60, 56, 2.6)} delay={420} />
      <Stroke d={ring(92, 74, 2.6)} delay={460} />
    </Art>
  )
}

function Certifications() {
  return (
    <Art id="certifications">
      <Stroke d={ring(62, 58, 32)} />
      <Stroke d={ring(62, 58, 22)} delay={90} />
      <Stroke d="M62 44 L 66 54 H 76 L 68 60 L 71 70 L 62 64 L 53 70 L 56 60 L 48 54 H 58 Z" delay={170} />
      <Stroke d="M30 78 C 16 64, 16 46, 32 34" delay={260} />
      <Stroke d="M24 70 C 30 66, 32 60, 26 56" delay={320} />
      <Stroke d="M22 58 C 30 56, 32 50, 26 46" delay={370} />
      <Stroke d="M26 46 C 34 46, 36 40, 32 36" delay={420} />
    </Art>
  )
}

function Research() {
  return (
    <Art id="research">
      <Stroke d="M30 80 L 54 42 L 82 58 L 102 30" />
      <Stroke d="M54 42 L 46 86 L 82 58" delay={80} />
      <Stroke d="M46 86 L 70 98 L 82 58 M 30 80 L 46 86" delay={160} />
      <Stroke d={ring(30, 80, 3.2)} delay={240} />
      <Stroke d={ring(54, 42, 3.2)} delay={280} />
      <Stroke d={ring(82, 58, 3.2)} delay={320} />
      <Stroke d={ring(102, 30, 3.2)} delay={360} />
      <Stroke d={ring(46, 86, 2.6)} delay={400} />
      <Stroke d={ring(70, 98, 2.6)} delay={440} />
    </Art>
  )
}

const drawings: Record<string, () => ReactNode> = {
  'ai-art': AiArt,
  painting: Painting,
  'stack-exchange': StackExchange,
  movies: Movies,
  books: Books,
  'competitive-coding': CompetitiveCoding,
  blogging: Blogging,
  programming: Programming,
  certifications: Certifications,
  research: Research,
}

export function CardLineArt({ id }: { id: string }) {
  const Draw = drawings[id]
  if (!Draw) return null
  return <Draw />
}
