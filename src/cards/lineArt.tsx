import type { ReactNode } from 'react'

function ring(cx: number, cy: number, r: number) {
  return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r}`
}

function Stroke({ d, delay = 0, accent = false }: { d: string; delay?: number; accent?: boolean }) {
  return (
    <path d={d} pathLength={1} className={accent ? 'accent' : undefined} style={{ animationDelay: `${delay}ms` }} />
  )
}

function Art({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      className="card-line-art pointer-events-none absolute inset-0 size-full"
    >
      {children}
    </svg>
  )
}

function AiArt() {
  return (
    <Art>
      <Stroke d="M78 28 H242 Q258 28 258 44 V156 Q258 172 242 172 H78 Q62 172 62 156 V44 Q62 28 78 28 Z" />
      <Stroke d="M86 44 H234 V156 H86 Z" delay={60} />
      <Stroke d={ring(160, 86, 28)} delay={120} />
      <Stroke d="M112 156 C 122 124, 138 112, 160 112 C 182 112, 198 124, 208 156" delay={180} />
      <Stroke d="M148 80 H154 M166 80 H172 M146 96 Q160 104 174 96" delay={230} />
      <Stroke d="M248 36 L252 52 L268 56 L252 60 L248 76 L244 60 L228 56 L244 52 Z" accent delay={300} />
      <Stroke d="M46 58 L70 78 L52 104" accent delay={360} />
      <Stroke d={ring(46, 58, 4)} accent delay={400} />
      <Stroke d={ring(70, 78, 4)} accent delay={430} />
      <Stroke d={ring(52, 104, 4)} accent delay={460} />
    </Art>
  )
}

function Painting() {
  return (
    <Art>
      <Stroke d="M118 176 L160 24 L202 176" />
      <Stroke d="M132 176 L148 112 M188 176 L172 112" delay={70} />
      <Stroke d="M136 96 H184" delay={120} />
      <Stroke d="M138 40 H182 V104 H138 Z" delay={170} />
      <Stroke d="M146 78 H174" delay={220} />
      <Stroke d="M146 90 L160 68 L174 90" delay={260} />
      <Stroke d={ring(160, 58, 7)} accent delay={310} />
      <Stroke d={ring(228, 132, 22)} delay={360} />
      <Stroke d={ring(220, 126, 3.5)} accent delay={400} />
      <Stroke d={ring(236, 124, 3.5)} accent delay={420} />
      <Stroke d={ring(228, 140, 3.5)} accent delay={440} />
      <Stroke d="M214 148 C 200 160, 188 168, 176 164" delay={480} />
    </Art>
  )
}

function StackExchange() {
  return (
    <Art>
      <Stroke d="M24 36 H148 Q162 36 162 50 V108 Q162 122 148 122 H100 L78 146 V122 H38 Q24 122 24 108 V50 Q24 36 38 36 Z" />
      <Stroke d="M78 58 C78 46 118 44 118 64 C118 80 96 82 96 98 M96 112 V118" delay={100} />
      <Stroke
        d="M158 54 H296 Q310 54 310 68 V126 Q310 140 296 140 H248 L226 164 V140 H172 Q158 140 158 126 V68 Q158 54 172 54 Z"
        delay={180}
      />
      <Stroke d="M186 80 H278" delay={250} />
      <Stroke d="M186 100 H262" delay={300} />
      <Stroke d="M186 120 H240" delay={350} />
    </Art>
  )
}

function sprockets(y: number) {
  return Array.from({ length: 10 }, (_, i) => {
    const x = 22 + i * 30
    return `M ${x} ${y} h 12 v 10 h -12 Z`
  }).join(' ')
}

function Movies() {
  return (
    <Art>
      <Stroke d="M12 18 H308 V46 H12 Z" />
      <Stroke d={sprockets(27)} delay={40} />
      <Stroke d="M12 154 H308 V182 H12 Z" delay={80} />
      <Stroke d={sprockets(163)} delay={120} />
      <Stroke d={ring(92, 100, 36)} delay={170} />
      <Stroke d={ring(92, 100, 10)} delay={210} />
      <Stroke d="M92 64 V136 M56 100 H128 M66 74 L118 126 M118 74 L66 126" delay={250} />
      <Stroke d="M168 78 H292 V148 H168 Z" delay={320} />
      <Stroke d="M168 78 L184 52 H292 V78" delay={370} />
      <Stroke d="M196 78 L212 52 M228 78 L244 52 M260 78 L276 52" accent delay={420} />
    </Art>
  )
}

function Books() {
  return (
    <Art>
      <Stroke d="M28 46 L156 70 L156 168 L28 148 Z" />
      <Stroke d="M164 70 L292 46 L292 148 L164 168 Z" delay={70} />
      <Stroke d="M156 62 V176" delay={130} />
      <Stroke d="M52 84 H132 M52 104 H128 M52 124 H118" delay={180} />
      <Stroke d="M188 84 H268 M192 104 H268 M200 124 H268" delay={240} />
      <Stroke d="M214 70 V128 L228 114 L242 128 V70" accent delay={310} />
    </Art>
  )
}

function CompetitiveCoding() {
  return (
    <Art>
      <Stroke d="M78 48 L36 100 L78 152" />
      <Stroke d="M108 40 L148 160" delay={70} />
      <Stroke d="M168 48 L210 100 L168 152" delay={130} />
      <Stroke d="M236 62 H286 V92 C286 118 270 130 252 130 C234 130 218 118 218 92 V62 Z" delay={200} />
      <Stroke d="M218 74 C198 74 198 100 218 100" delay={260} />
      <Stroke d="M286 74 C306 74 306 100 286 100" delay={300} />
      <Stroke d="M244 130 H260 V146" delay={340} />
      <Stroke d="M226 146 H278 V162 H226 Z" delay={380} />
      <Stroke d="M252 78 L256 90 H270 L260 98 L264 112 L252 104 L240 112 L244 98 L232 90 H246 Z" accent delay={430} />
    </Art>
  )
}

function Blogging() {
  return (
    <Art>
      <Stroke d="M36 24 H196 V176 H36 Z" />
      <Stroke d="M56 48 H168" delay={60} />
      <Stroke d="M56 62 H140" accent delay={100} />
      <Stroke d="M56 86 H176" delay={150} />
      <Stroke d="M56 102 H176" delay={190} />
      <Stroke d="M56 118 H164" delay={230} />
      <Stroke d="M56 134 H148" delay={270} />
      <Stroke d="M56 150 H120" delay={310} />
      <Stroke d="M214 168 C190 120 176 78 206 30" delay={360} />
      <Stroke d="M206 30 C196 46 190 54 178 58" delay={410} />
      <Stroke d="M188 72 C174 60 166 48 174 34" accent delay={450} />
    </Art>
  )
}

function Programming() {
  return (
    <Art>
      <Stroke d="M28 28 H292 V176 H28 Z" />
      <Stroke d="M28 52 H292" delay={50} />
      <Stroke d={ring(48, 40, 4)} accent delay={90} />
      <Stroke d={ring(66, 40, 4)} delay={110} />
      <Stroke d={ring(84, 40, 4)} delay={130} />
      <Stroke d="M48 72 H96" delay={180} />
      <Stroke d="M64 92 H132" delay={220} />
      <Stroke d="M64 112 H118" delay={260} />
      <Stroke d="M48 132 H108" delay={300} />
      <Stroke d="M48 152 H160" delay={340} />
      <Stroke d="M188 70 V154" delay={380} />
      <Stroke d="M188 70 H236 M206 92 H258 M206 114 H240 M188 154 H236" delay={430} />
    </Art>
  )
}

function Certifications() {
  return (
    <Art>
      <Stroke d="M24 36 H248 V164 H24 Z" />
      <Stroke d="M40 52 H232 V148 H40 Z" delay={70} />
      <Stroke d="M58 74 H168" delay={130} />
      <Stroke d="M58 96 H176" delay={170} />
      <Stroke d="M58 116 H150" delay={210} />
      <Stroke d={ring(196, 112, 28)} delay={260} />
      <Stroke d={ring(196, 112, 18)} delay={300} />
      <Stroke
        d="M196 96 L200 108 H214 L204 116 L208 128 L196 122 L184 128 L188 116 L178 108 H192 Z"
        accent
        delay={350}
      />
      <Stroke d="M180 138 L168 176" accent delay={410} />
      <Stroke d="M212 138 L224 176" accent delay={450} />
    </Art>
  )
}

function Research() {
  return (
    <Art>
      <Stroke d="M28 36 H196 V172 H28 Z" />
      <Stroke d="M48 58 H168" delay={60} />
      <Stroke d="M48 78 H156" delay={100} />
      <Stroke d="M48 98 H140" delay={140} />
      <Stroke d="M48 148 L84 118 L116 132 L164 86" accent delay={200} />
      <Stroke d={ring(214, 96, 52)} delay={270} />
      <Stroke d="M252 134 L292 180" delay={340} />
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
