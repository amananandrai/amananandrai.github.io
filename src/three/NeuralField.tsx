import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { MotionValue } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import * as THREE from 'three'

const PURPLE = new THREE.Color('#8b93e6')
const TEAL = new THREE.Color('#14b789')
const TECH_RGB = new THREE.Color('#5ff0c4').toArray()
const WARM_RGB = ['#ff8a5c', '#ffc857', '#f06292'].map((c) => new THREE.Color(c).toArray())
const LINK_DISTANCE = 1.55
/** Node counts per layer of the network diagram the field forms in "tech" mode. */
const LAYERS = [4, 7, 9, 9, 7, 4]
/** Brush-stroke bands the field flows into in "hobbies" mode; neighbours along a band are linked into a stroke. */
const RIBBONS = [
  { y: 1.9, amp: 1.0, freq: 1.4, z: -0.6 },
  { y: 0, amp: 1.2, freq: 1.1, z: 0 },
  { y: -1.9, amp: 0.9, freq: 1.7, z: 0.6 },
]
const HOP_INTERVAL = 0.07
const FIRE_INTERVAL = 0.7

export type FieldSide = 'tech' | 'hobbies' | null

const pointVertex = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aGlow;
  uniform float uPixelRatio;
  uniform float uFade;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * (1.0 + aGlow * 1.3) * uPixelRatio * (13.0 / -mv.z);
    vColor = mix(aColor, vec3(1.0), aGlow * 0.6);
    vAlpha = uFade * (1.0 + aGlow) * smoothstep(-14.0, -4.0, mv.z);
  }
`

const pointFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    float glow = smoothstep(0.5, 0.15, d) * 0.6;
    gl_FragColor = vec4(vColor, (core + glow) * vAlpha);
    if (gl_FragColor.a < 0.01) discard;
  }
`

interface FieldProps {
  count: number
  progress: MotionValue<number>
  side: FieldSide
  origin: { x: number; y: number } | null
  pulseTarget: RefObject<HTMLElement | null>
}

const lerp = THREE.MathUtils.lerp

/** Per-point morph weight, so points leave for a target at slightly different times. */
function staggered(w: number, offset: number) {
  const k = Math.min(1, Math.max(0, (w - offset * 0.35) / 0.65))
  return k * k * (3 - 2 * k)
}

function Field({ count, progress, side, origin, pulseTarget }: FieldProps) {
  const group = useRef<THREE.Group>(null)
  const { size, viewport, gl } = useThree()
  const pointer = useRef(new THREE.Vector2(0, 0))
  const sideRef = useRef(side)
  sideRef.current = side
  const pendingPulse = useRef<THREE.Vector2 | null>(null)
  const anim = useRef({ wTech: 0, wHobby: 0, intro: origin ? 0 : 1, hop: 0, fire: 0 })
  const scale = size.width < 768 ? 0.75 : 1

  const data = useMemo(() => {
    const base = new Float32Array(count * 3)
    const phase = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const displayColors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const stagger = new Float32Array(count)
    const techTarget = new Float32Array(count * 3)
    const hobbyTarget = new Float32Array(count * 3)
    const layerOf = new Int8Array(count)
    const ribbonU = new Float32Array(count)
    const tmp = new THREE.Color()
    const perRibbon = Math.ceil(count / RIBBONS.length)

    const nodes: [number, number, number][] = []
    LAYERS.forEach((n, l) => {
      for (let k = 0; k < n; k++) nodes.push([(l - (LAYERS.length - 1) / 2) * 2.1, (k - (n - 1) / 2) * 0.85, l])
    })

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      base[i3] = (Math.random() - 0.5) * 14
      base[i3 + 1] = (Math.random() - 0.5) * 8
      base[i3 + 2] = (Math.random() - 0.5) * 6
      phase[i3] = Math.random() * Math.PI * 2
      phase[i3 + 1] = Math.random() * Math.PI * 2
      phase[i3 + 2] = 0.25 + Math.random() * 0.5
      tmp.copy(PURPLE).lerp(TEAL, Math.random() < 0.35 ? 0.9 : Math.random() * 0.25)
      colors.set([tmp.r, tmp.g, tmp.b], i3)
      sizes[i] = 2.5 + Math.random() * 4.5
      stagger[i] = Math.random()

      // Points past the node count stack onto a node with a little jitter, which makes it glow brighter.
      const [nx, ny, layer] = nodes[i % nodes.length]
      const extra = i >= nodes.length
      techTarget[i3] = nx + (extra ? (Math.random() - 0.5) * 0.25 : 0)
      techTarget[i3 + 1] = ny + (extra ? (Math.random() - 0.5) * 0.25 : 0)
      techTarget[i3 + 2] = extra ? (Math.random() - 0.5) * 0.4 : 0
      layerOf[i] = extra ? -1 : layer

      const r = i % RIBBONS.length
      const ribbon = RIBBONS[r]
      const u = (Math.floor(i / RIBBONS.length) + 0.5 + (Math.random() - 0.5) * 0.3) / perRibbon
      ribbonU[i] = u
      hobbyTarget[i3] = -6.5 + u * 13
      hobbyTarget[i3 + 1] =
        ribbon.y + Math.sin(u * Math.PI * ribbon.freq + r * 1.7) * ribbon.amp + (Math.random() - 0.5) * 0.55
      hobbyTarget[i3 + 2] = ribbon.z + (Math.random() - 0.5) * 0.2
    }
    const maxPairs = (count * (count - 1)) / 2
    return {
      base,
      phase,
      colors,
      displayColors,
      sizes,
      stagger,
      techTarget,
      hobbyTarget,
      layerOf,
      ribbonU,
      strokeSpan: 3.2 / perRibbon,
      glow: new Float32Array(count),
      glowPrev: new Float32Array(count),
      positions: new Float32Array(count * 3),
      linePositions: new Float32Array(maxPairs * 6),
      lineColors: new Float32Array(maxPairs * 8),
    }
  }, [count])

  const pointsGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(data.positions, 3))
    g.setAttribute('aColor', new THREE.BufferAttribute(data.displayColors, 3).setUsage(THREE.DynamicDrawUsage))
    g.setAttribute('aSize', new THREE.BufferAttribute(data.sizes, 1))
    g.setAttribute('aGlow', new THREE.BufferAttribute(data.glow, 1).setUsage(THREE.DynamicDrawUsage))
    return g
  }, [data])

  const linesGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(data.linePositions, 3).setUsage(THREE.DynamicDrawUsage))
    g.setAttribute('color', new THREE.BufferAttribute(data.lineColors, 4).setUsage(THREE.DynamicDrawUsage))
    g.setDrawRange(0, 0)
    return g
  }, [data])

  const pointsMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: pointVertex,
        fragmentShader: pointFragment,
        uniforms: { uPixelRatio: { value: gl.getPixelRatio() }, uFade: { value: 1 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [gl],
  )

  const linesMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    const el = pulseTarget.current
    if (!el) return
    const onDown = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      pendingPulse.current = new THREE.Vector2(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1,
      )
    }
    el.addEventListener('pointerdown', onDown, { passive: true })
    return () => el.removeEventListener('pointerdown', onDown)
  }, [pulseTarget])

  useEffect(
    () => () => {
      pointsGeo.dispose()
      linesGeo.dispose()
      pointsMat.dispose()
      linesMat.dispose()
    },
    [pointsGeo, linesGeo, pointsMat, linesMat],
  )

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    const t = state.clock.elapsedTime
    const m = anim.current
    const p = progress.get()
    const spread = 1 + p * 1.8
    const fade = Math.max(0, 1 - p * 1.25)

    m.wTech = THREE.MathUtils.damp(m.wTech, sideRef.current === 'tech' ? 1 : 0, 2.6, delta)
    m.wHobby = THREE.MathUtils.damp(m.wHobby, sideRef.current === 'hobbies' ? 1 : 0, 2.6, delta)
    m.intro = Math.min(1, m.intro + delta / 1.6)
    const intro = 1 - Math.pow(1 - m.intro, 4)
    const ox = origin ? (origin.x * viewport.width) / 2 / scale : 0
    const oy = origin ? (origin.y * viewport.height) / 2 / scale : 0

    pointsMat.uniforms.uFade.value = fade
    linesMat.opacity = fade * intro * intro

    const px = pointer.current.x * (viewport.width / 2)
    const py = pointer.current.y * (viewport.height / 2)
    const { base, phase, positions, linePositions, lineColors, displayColors, colors, glow, glowPrev } = data
    const { techTarget, hobbyTarget, stagger, layerOf, ribbonU, strokeSpan } = data

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const speed = phase[i3 + 2]
      let x = base[i3] + Math.sin(t * speed + phase[i3]) * 0.45
      let y = base[i3 + 1] + Math.cos(t * speed * 0.8 + phase[i3 + 1]) * 0.35
      let z = base[i3 + 2] + Math.sin(t * speed * 0.6 + phase[i3]) * 0.3
      const dx = px - x
      const dy = py - y
      const d2 = dx * dx + dy * dy
      if (d2 < 9) {
        const pull = (1 - d2 / 9) * 0.35
        x += dx * pull
        y += dy * pull
      }

      const wt = staggered(m.wTech, stagger[i])
      const wh = staggered(m.wHobby, stagger[i])
      if (wt > 0) {
        const wobble = Math.sin(t * 1.3 + phase[i3]) * 0.05
        x = lerp(x, techTarget[i3] + wobble, wt)
        y = lerp(y, techTarget[i3 + 1] + wobble, wt)
        z = lerp(z, techTarget[i3 + 2], wt)
      }
      if (wh > 0) {
        const flow = Math.sin(t * 0.5 + phase[i3]) * 0.2
        x = lerp(x, hobbyTarget[i3] + flow, wh)
        y = lerp(y, hobbyTarget[i3 + 1] + Math.sin(t * 0.8 + hobbyTarget[i3] * 0.6) * 0.15, wh)
        z = lerp(z, hobbyTarget[i3 + 2], wh)
      }

      positions[i3] = lerp(ox, x, intro) * spread
      positions[i3 + 1] = lerp(oy, y, intro) * spread
      positions[i3 + 2] = lerp(0, z, intro) * spread

      const warm = WARM_RGB[i % WARM_RGB.length]
      for (let c = 0; c < 3; c++) {
        displayColors[i3 + c] = lerp(lerp(colors[i3 + c], TECH_RGB[c], 0.7 * wt), warm[c], 0.9 * wh)
      }
    }

    // Neural firing: a random node lights up now and then, and a tap lights the node nearest to it.
    m.fire += delta
    if (m.fire > FIRE_INTERVAL && m.intro >= 1) {
      m.fire = 0
      glow[Math.floor(Math.random() * count)] = 1
    }
    const tap = pendingPulse.current
    if (tap) {
      pendingPulse.current = null
      const tx = (tap.x * viewport.width) / 2 / scale
      const ty = (tap.y * viewport.height) / 2 / scale
      let best = 0
      let bestD = Infinity
      for (let i = 0; i < count; i++) {
        const d = (positions[i * 3] - tx) ** 2 + (positions[i * 3 + 1] - ty) ** 2
        if (d < bestD) {
          bestD = d
          best = i
        }
      }
      glow[best] = 1.4
    }
    m.hop += delta
    const hop = m.hop > HOP_INTERVAL
    if (hop) {
      m.hop = 0
      glowPrev.set(glow)
    }
    const decay = Math.exp(-delta * 2.6)
    for (let i = 0; i < count; i++) glow[i] *= decay

    let segments = 0
    const maxD2 = LINK_DISTANCE * LINK_DISTANCE * spread * spread
    const freeWeight = (1 - m.wTech) * (1 - m.wHobby)
    for (let i = 0; i < count; i++) {
      const ax = positions[i * 3]
      const ay = positions[i * 3 + 1]
      const az = positions[i * 3 + 2]
      for (let j = i + 1; j < count; j++) {
        const bx = positions[j * 3]
        const by = positions[j * 3 + 1]
        const bz = positions[j * 3 + 2]
        const ddx = ax - bx
        const ddy = ay - by
        const ddz = az - bz
        const dist2 = ddx * ddx + ddy * ddy + ddz * ddz
        const near = dist2 < maxD2 ? (1 - dist2 / maxD2) * 0.5 : 0
        const layered = layerOf[i] >= 0 && layerOf[j] >= 0 && Math.abs(layerOf[i] - layerOf[j]) === 1 ? 0.18 : 0
        const stroke =
          i % RIBBONS.length === j % RIBBONS.length && Math.abs(ribbonU[i] - ribbonU[j]) < strokeSpan ? 0.4 : 0
        let alpha = near * freeWeight + layered * m.wTech + stroke * m.wHobby
        if (alpha < 0.01) continue
        if (hop) {
          if (glowPrev[i] > 0.15) glow[j] = Math.max(glow[j], glowPrev[i] * 0.82)
          if (glowPrev[j] > 0.15) glow[i] = Math.max(glow[i], glowPrev[j] * 0.82)
        }
        alpha += Math.max(glow[i], glow[j]) * alpha * 2
        const o = segments * 6
        linePositions[o] = ax
        linePositions[o + 1] = ay
        linePositions[o + 2] = az
        linePositions[o + 3] = bx
        linePositions[o + 4] = by
        linePositions[o + 5] = bz
        const c = segments * 8
        lineColors[c] = displayColors[i * 3]
        lineColors[c + 1] = displayColors[i * 3 + 1]
        lineColors[c + 2] = displayColors[i * 3 + 2]
        lineColors[c + 3] = alpha
        lineColors[c + 4] = displayColors[j * 3]
        lineColors[c + 5] = displayColors[j * 3 + 1]
        lineColors[c + 6] = displayColors[j * 3 + 2]
        lineColors[c + 7] = alpha
        segments++
      }
    }
    pointsGeo.attributes.position.needsUpdate = true
    pointsGeo.attributes.aColor.needsUpdate = true
    pointsGeo.attributes.aGlow.needsUpdate = true
    linesGeo.setDrawRange(0, segments * 2)
    linesGeo.attributes.position.needsUpdate = true
    linesGeo.attributes.color.needsUpdate = true

    if (group.current) {
      const g = group.current
      const calm = 1 - Math.max(m.wTech, m.wHobby) * 0.7
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.current.x * 0.28 * calm, 3, delta)
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -pointer.current.y * 0.18 * calm, 3, delta)
      g.position.y = p * 1.5
    }
  })

  return (
    <group ref={group} scale={scale}>
      <lineSegments geometry={linesGeo} material={linesMat} />
      <points geometry={pointsGeo} material={pointsMat} />
    </group>
  )
}

export default function NeuralField({
  progress,
  active,
  side,
  origin,
  pulseTarget,
}: {
  progress: MotionValue<number>
  active: boolean
  side: FieldSide
  origin: { x: number; y: number } | null
  pulseTarget: RefObject<HTMLElement | null>
}) {
  const [tabVisible, setTabVisible] = useState(() => document.visibilityState === 'visible')
  const count = useMemo(() => (window.innerWidth < 768 ? 70 : 130), [])

  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={active && tabVisible ? 'always' : 'never'}
      camera={{ position: [0, 0, 8], fov: 55 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <Field count={count} progress={progress} side={side} origin={origin} pulseTarget={pulseTarget} />
    </Canvas>
  )
}
