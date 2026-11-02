import type { ComponentType, ReactNode } from 'react'

/** Decorative banner illustrations for project tiles, keyed by card id. Strokes and fills use the brand and teal tokens. */

type ArtProps = { className?: string }

const brand = 'var(--color-brand)'
const teal = 'var(--color-teal)'

function Frame({ className, children }: ArtProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 320 140" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      {children}
    </svg>
  )
}

function Farm({ className }: ArtProps) {
  const rows = [0, 9, 18, 27]
  return (
    <Frame className={className}>
      <circle cx="262" cy="34" r="16" fill={teal} opacity="0.5" />
      <path d="M0 88 C60 66 120 70 170 84 S270 66 320 78 V140 H0Z" fill={brand} opacity="0.14" />
      <path d="M0 106 C70 88 150 92 210 104 S290 96 320 100 V140 H0Z" fill={brand} opacity="0.22" />
      {rows.map((dy) => (
        <path
          key={dy}
          d={`M0 ${114 + dy} C70 ${98 + dy} 150 ${102 + dy} 210 ${114 + dy} S290 ${106 + dy} 320 ${110 + dy}`}
          fill="none"
          stroke={teal}
          strokeWidth="2"
          strokeDasharray="6 5"
          opacity="0.55"
        />
      ))}
      <g transform="translate(70 52)">
        <rect x="0" y="14" width="32" height="24" rx="2" fill={brand} opacity="0.55" />
        <path d="M-4 16 L16 1 L36 16Z" fill={brand} opacity="0.75" />
        <rect x="12" y="25" width="8" height="13" fill="white" opacity="0.85" />
      </g>
      <g fill={teal} opacity="0.6">
        <circle cx="150" cy="70" r="9" />
        <rect x="149" y="74" width="2" height="12" />
        <circle cx="168" cy="74" r="7" />
        <rect x="167" y="77" width="2" height="10" />
      </g>
    </Frame>
  )
}

const towers: [number, number, number][] = [
  [14, 26, 54],
  [44, 18, 78],
  [66, 30, 44],
  [100, 22, 92],
  [126, 34, 64],
  [164, 22, 100],
  [190, 28, 58],
  [222, 24, 84],
  [250, 32, 50],
  [286, 22, 70],
]

function CityBuilder({ className }: ArtProps) {
  const base = 128
  return (
    <Frame className={className}>
      <circle cx="60" cy="30" r="12" fill={teal} opacity="0.35" />
      {towers.map(([x, w, h], i) => {
        const top = base - h
        const windows = []
        for (let y = top + 8, r = 0; y < base - 8; y += 10, r++) {
          for (let wx = x + 5, c = 0; wx < x + w - 4; wx += 8, c++) {
            windows.push(
              <rect
                key={`${r}-${c}`}
                x={wx}
                y={y}
                width="3"
                height="4"
                fill={(i + r + c) % 5 === 0 ? teal : 'white'}
                opacity={(i + r + c) % 5 === 0 ? 0.9 : 0.7}
              />,
            )
          }
        }
        return (
          <g key={x}>
            <rect x={x} y={top} width={w} height={h} rx="2" fill={brand} opacity={0.3 + (i % 3) * 0.15} />
            {windows}
          </g>
        )
      })}
      <g stroke={brand} strokeWidth="2" opacity="0.6" fill="none">
        <path d="M175 28 V8 M150 9 H232 M222 9 V30" />
      </g>
      <rect x="217" y="30" width="10" height="7" fill={teal} opacity="0.8" />
      <rect x="0" y={base} width="320" height="12" fill={brand} opacity="0.35" />
    </Frame>
  )
}

const blocks: [number, number, number][] = [
  [1, 2, 18],
  [2, 2, 26],
  [1, 5, 20],
  [2, 4, 12],
  [4, 1, 22],
  [3, 3, 40],
  [5, 3, 14],
  [4, 5, 30],
]

function SimCity({ className }: ArtProps) {
  const at = (i: number, j: number) => ({ cx: 160 + (i - j) * 16, cy: 26 + (i + j) * 8 })
  const tiles = []
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      const { cx, cy } = at(i, j)
      const road = i === 3 || j === 2
      tiles.push(
        <path
          key={`${i}-${j}`}
          d={`M${cx} ${cy - 8} L${cx + 16} ${cy} L${cx} ${cy + 8} L${cx - 16} ${cy}Z`}
          fill={road ? brand : 'none'}
          fillOpacity={road ? 0.12 : 0}
          stroke={brand}
          strokeOpacity="0.3"
        />,
      )
    }
  }
  const cubes = [...blocks]
    .sort((a, b) => a[0] + a[1] - (b[0] + b[1]))
    .map(([i, j, h]) => {
      const { cx, cy } = at(i, j)
      const accent = i === 3 && j === 3
      return (
        <g key={`${i}-${j}`}>
          <path
            d={`M${cx - 16} ${cy - h} L${cx} ${cy + 8 - h} L${cx} ${cy + 8} L${cx - 16} ${cy}Z`}
            fill={accent ? teal : brand}
            opacity="0.55"
          />
          <path
            d={`M${cx + 16} ${cy - h} L${cx} ${cy + 8 - h} L${cx} ${cy + 8} L${cx + 16} ${cy}Z`}
            fill={accent ? teal : brand}
            opacity="0.75"
          />
          <path
            d={`M${cx} ${cy - 8 - h} L${cx + 16} ${cy - h} L${cx} ${cy + 8 - h} L${cx - 16} ${cy - h}Z`}
            fill={accent ? teal : brand}
            opacity="0.35"
          />
        </g>
      )
    })
  return (
    <Frame className={className}>
      {tiles}
      {cubes}
    </Frame>
  )
}

function DocumentEditor({ className }: ArtProps) {
  const lines = [96, 118, 84, 110, 64]
  return (
    <Frame className={className}>
      <rect x="40" y="40" width="34" height="26" rx="8" fill={brand} opacity="0.15" transform="rotate(-8 57 53)" />
      <text x="51" y="58" fontSize="16" fontWeight="700" fill={brand} opacity="0.7" transform="rotate(-8 57 53)">
        B
      </text>
      <rect x="250" y="70" width="34" height="26" rx="8" fill={teal} opacity="0.2" transform="rotate(8 267 83)" />
      <text x="262" y="88" fontSize="16" fontStyle="italic" fill={brand} opacity="0.7" transform="rotate(8 267 83)">
        I
      </text>
      <rect x="92" y="14" width="136" height="140" rx="8" fill="white" stroke={brand} strokeOpacity="0.25" />
      <rect x="92" y="14" width="136" height="20" rx="8" fill={brand} opacity="0.12" />
      {[0, 1, 2, 3].map((n) => (
        <rect key={n} x={102 + n * 14} y="20" width="8" height="8" rx="2" fill={brand} opacity="0.35" />
      ))}
      <rect x="104" y="44" width="70" height="7" rx="3" fill={brand} opacity="0.55" />
      {lines.map((w, n) => (
        <rect
          key={n}
          x="104"
          y={60 + n * 12}
          width={w}
          height="5"
          rx="2.5"
          fill={n === 2 ? teal : brand}
          opacity={n === 2 ? 0.6 : 0.25}
        />
      ))}
      <rect x="171" y="108" width="2" height="12" fill={teal} />
    </Frame>
  )
}

function NotebookLM({ className }: ArtProps) {
  return (
    <Frame className={className}>
      <rect x="44" y="26" width="96" height="120" rx="6" fill={brand} opacity="0.15" transform="rotate(-7 92 86)" />
      <rect x="54" y="20" width="96" height="120" rx="6" fill="white" stroke={brand} strokeOpacity="0.3" />
      {[0, 1, 2, 3, 4, 5].map((n) => (
        <circle key={n} cx="54" cy={32 + n * 16} r="3.5" fill="none" stroke={brand} strokeOpacity="0.6" />
      ))}
      {[0, 1, 2, 3, 4, 5].map((n) => (
        <rect key={n} x="68" y={34 + n * 14} width={n % 2 ? 56 : 70} height="4" rx="2" fill={brand} opacity="0.22" />
      ))}
      <rect x="172" y="28" width="112" height="24" rx="12" fill={brand} opacity="0.18" />
      <rect x="196" y="60" width="94" height="24" rx="12" fill={teal} opacity="0.35" />
      <rect x="172" y="92" width="120" height="24" rx="12" fill={brand} opacity="0.18" />
      {[0, 1, 2].map((n) => (
        <circle key={n} cx={186 + n * 9} cy="104" r="2.5" fill={brand} opacity="0.5" />
      ))}
      <path d="M296 18 l2 -6 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2Z" fill={teal} opacity="0.8" />
    </Frame>
  )
}

const mosaic: [number, number, number, number][] = [
  [30, 10, 60, 50],
  [30, 66, 60, 70],
  [96, -10, 60, 70],
  [96, 66, 60, 44],
  [96, 116, 60, 40],
  [162, 14, 60, 40],
  [162, 60, 60, 80],
  [228, -4, 60, 56],
  [228, 58, 60, 46],
  [228, 110, 60, 40],
]

function AIImageGallery({ className }: ArtProps) {
  return (
    <Frame className={className}>
      {mosaic.map(([x, y, w, h], i) => (
        <g key={i}>
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            rx="8"
            fill={i % 3 === 1 ? teal : brand}
            opacity={0.14 + (i % 4) * 0.07}
          />
          {i % 2 === 0 && (
            <>
              <circle cx={x + w - 14} cy={y + 14} r="5" fill="white" opacity="0.8" />
              <path
                d={`M${x + 6} ${y + h - 6} L${x + w * 0.4} ${y + h * 0.5} L${x + w * 0.65} ${y + h - 16} L${x + w * 0.78} ${y + h - 24} L${x + w - 6} ${y + h - 6}Z`}
                fill="white"
                opacity="0.6"
              />
            </>
          )}
        </g>
      ))}
      <path d="M300 22 l3 -9 l3 9 l9 3 l-9 3 l-3 9 l-3 -9 l-9 -3Z" fill={teal} opacity="0.85" />
    </Frame>
  )
}

const nodes: [number, number, number, boolean][] = [
  [40, 70, 34, false],
  [118, 36, 30, false],
  [118, 104, 30, true],
  [196, 70, 34, false],
  [270, 36, 28, true],
  [270, 104, 28, false],
]

const edges: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [3, 4],
  [3, 5],
]

function SystemDesign({ className }: ArtProps) {
  return (
    <Frame className={className}>
      <g stroke={brand} strokeWidth="2" opacity="0.4" fill="none">
        {edges.map(([a, b]) => {
          const [x1, y1, w1] = nodes[a]
          const [x2, y2, w2] = nodes[b]
          const sx = x1 + w1 / 2
          const ex = x2 - w2 / 2
          const mx = (sx + ex) / 2
          return <path key={`${a}-${b}`} d={`M${sx} ${y1} C${mx} ${y1} ${mx} ${y2} ${ex} ${y2}`} />
        })}
      </g>
      {nodes.map(([x, y, w, accent], i) => (
        <g key={i}>
          <rect
            x={x - w / 2}
            y={y - 13}
            width={w}
            height="26"
            rx="6"
            fill={accent ? teal : brand}
            opacity={accent ? 0.45 : 0.3}
          />
          <rect x={x - w / 2 + 6} y={y - 2} width={w - 12} height="4" rx="2" fill="white" opacity="0.8" />
        </g>
      ))}
      <g transform="translate(196 70)" fill={brand} opacity="0.55">
        <ellipse cx="0" cy="38" rx="14" ry="4" />
        <rect x="-14" y="38" width="28" height="18" />
        <ellipse cx="0" cy="56" rx="14" ry="4" />
      </g>
      <ellipse cx="196" cy="108" rx="14" ry="4" fill={teal} opacity="0.7" />
    </Frame>
  )
}

function Monuments({ className }: ArtProps) {
  return (
    <Frame className={className}>
      <circle cx="268" cy="30" r="14" fill={teal} opacity="0.45" />
      <rect x="0" y="122" width="320" height="18" fill={brand} opacity="0.3" />
      <rect x="100" y="118" width="120" height="6" fill={brand} opacity="0.4" />
      {/* minarets */}
      {[96, 224].map((x) => (
        <g key={x} fill={brand} opacity="0.45">
          <rect x={x - 3} y="54" width="6" height="64" />
          <rect x={x - 5} y="72" width="10" height="2" />
          <rect x={x - 5} y="94" width="10" height="2" />
          <path d={`M${x - 5} 54 Q${x} 42 ${x + 5} 54Z`} />
        </g>
      ))}
      {/* main hall and dome */}
      <rect x="124" y="74" width="72" height="44" fill={brand} opacity="0.4" />
      <path d="M134 74 C134 38 186 38 186 74Z" fill={brand} opacity="0.6" />
      <rect x="158.5" y="28" width="3" height="16" fill={teal} />
      <path d="M150 118 V96 Q160 82 170 96 V118Z" fill="white" opacity="0.8" />
      {[132, 182].map((x) => (
        <path key={x} d={`M${x} 104 Q${x + 3} 98 ${x + 6} 104 V112 H${x}Z`} fill="white" opacity="0.6" />
      ))}
      {/* small pavilions */}
      {[118, 202].map((x) => (
        <path key={x} d={`M${x - 6} 74 Q${x} 62 ${x + 6} 74Z`} fill={teal} opacity="0.6" />
      ))}
      {/* fort wall on the left, temple spire on the right */}
      <path d="M0 122 V96 H8 V90 H16 V96 H26 V90 H34 V96 H44 V90 H52 V96 H60 V122Z" fill={brand} opacity="0.25" />
      <path d="M262 122 V96 L276 60 L290 96 V122Z" fill={brand} opacity="0.3" />
      <rect x="274.5" y="50" width="3" height="10" fill={teal} opacity="0.8" />
    </Frame>
  )
}

const tokens = [34, 28, 40, 22, 30]
const probs = [0.82, 0.46, 0.3, 0.18, 0.1]

function LLMExplained({ className }: ArtProps) {
  const layers = [104, 140, 176]
  const ys = [34, 58, 82, 106]
  return (
    <Frame className={className}>
      {/* input tokens */}
      {tokens.map((w, i) => {
        const y = 24 + i * 22
        return (
          <g key={i}>
            <rect x={56 - w / 2} y={y} width={w} height="14" rx="7" fill={i === 2 ? teal : brand} opacity={i === 2 ? 0.5 : 0.25} />
          </g>
        )
      })}
      {/* network layers */}
      <g stroke={brand} strokeWidth="1" opacity="0.18">
        {layers.slice(0, -1).map((x, li) =>
          ys.flatMap((y1) => ys.map((y2) => <line key={`${li}-${y1}-${y2}`} x1={x} y1={y1} x2={layers[li + 1]} y2={y2} />)),
        )}
      </g>
      {layers.map((x, li) =>
        ys.map((y, i) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill={(li + i) % 3 === 1 ? teal : brand} opacity={0.35 + li * 0.12} />
        )),
      )}
      {/* next-token probabilities */}
      {probs.map((p, i) => (
        <g key={i}>
          <rect x="214" y={26 + i * 20} width="16" height="10" rx="3" fill={brand} opacity="0.3" />
          <rect x="236" y={26 + i * 20} width={p * 76} height="10" rx="3" fill={i === 0 ? teal : brand} opacity={i === 0 ? 0.75 : 0.25} />
        </g>
      ))}
      <path d="M300 128 l2 -6 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2Z" fill={teal} opacity="0.8" />
    </Frame>
  )
}

export const projectArt: Record<string, ComponentType<ArtProps>> = {
  'llm-explained': LLMExplained,
  'system-design-explainer': SystemDesign,
  'monuments-of-india': Monuments,
  'farm-simulator': Farm,
  'city-builder': CityBuilder,
  'sim-city': SimCity,
  'document-editor': DocumentEditor,
  notebooklm: NotebookLM,
  'ai-image-gallery': AIImageGallery,
}
