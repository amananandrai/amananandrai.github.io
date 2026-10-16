import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { MotionValue } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const PURPLE = new THREE.Color('#8b93e6')
const TEAL = new THREE.Color('#14b789')
const INK = new THREE.Color('#e7a15c')
const LINK_DISTANCE = 1.55
const PHI = (1 + Math.sqrt(5)) / 2

const pointVertex = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uPixelRatio;
  uniform float uFade;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (13.0 / -mv.z);
    vColor = aColor;
    vAlpha = uFade * smoothstep(-14.0, -4.0, mv.z);
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
}

/** Circle, square (dropped, Vitruvian offset), and a golden spiral, in local space. */
function layoutStudy(count: number) {
  const nCircle = Math.round(count * 0.44)
  const nSquare = Math.round(count * 0.38)
  const nSpiral = count - nCircle - nSquare
  const structured = new Float32Array(count * 3)
  const R = 2.2
  const circleY = 0.2

  for (let i = 0; i < nCircle; i++) {
    const a = (i / nCircle) * Math.PI * 2
    structured[i * 3] = Math.cos(a) * R
    structured[i * 3 + 1] = circleY + Math.sin(a) * R
    structured[i * 3 + 2] = Math.sin(a * 2) * 0.16
  }

  const half = R
  const squareY = -0.48
  for (let i = 0; i < nSquare; i++) {
    const edge = (i / nSquare) * 4
    const side = Math.floor(edge) % 4
    const u = edge - Math.floor(edge)
    let x = 0
    let y = 0
    if (side === 0) {
      x = -half + 2 * half * u
      y = half
    } else if (side === 1) {
      x = half
      y = half - 2 * half * u
    } else if (side === 2) {
      x = half - 2 * half * u
      y = -half
    } else {
      x = -half
      y = -half + 2 * half * u
    }
    const idx = nCircle + i
    structured[idx * 3] = x
    structured[idx * 3 + 1] = squareY + y
    structured[idx * 3 + 2] = 0.04
  }

  const growth = Math.log(PHI) / (Math.PI / 2)
  const minTheta = Math.PI * 0.65
  const maxTheta = Math.PI * 2 * 1.55
  const maxRad = Math.exp(growth * maxTheta)
  const originX = -R * 0.55
  const originY = -R * 0.95
  for (let i = 0; i < nSpiral; i++) {
    const t = i / Math.max(1, nSpiral - 1)
    const theta = minTheta + t * (maxTheta - minTheta)
    const rad = (Math.exp(growth * theta) / maxRad) * R * 0.72
    const idx = nCircle + nSquare + i
    structured[idx * 3] = originX + Math.cos(theta) * rad
    structured[idx * 3 + 1] = originY + Math.sin(theta) * rad
    structured[idx * 3 + 2] = (t - 0.5) * 0.28
  }

  return structured
}

function Field({ count, progress }: FieldProps) {
  const group = useRef<THREE.Group>(null)
  const { size, viewport, gl } = useThree()
  const pointer = useRef(new THREE.Vector2(0, 0))

  const data = useMemo(() => {
    const free = new Float32Array(count * 3)
    const structured = layoutStudy(count)
    const phase = new Float32Array(count * 3)
    const freeColor = new Float32Array(count * 3)
    const ink = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const tmp = new THREE.Color()
    for (let i = 0; i < count; i++) {
      free[i * 3] = (Math.random() - 0.5) * 14
      free[i * 3 + 1] = (Math.random() - 0.5) * 8
      free[i * 3 + 2] = (Math.random() - 0.5) * 6
      phase[i * 3] = Math.random() * Math.PI * 2
      phase[i * 3 + 1] = Math.random() * Math.PI * 2
      phase[i * 3 + 2] = 0.25 + Math.random() * 0.5
      tmp.copy(PURPLE).lerp(TEAL, Math.random() < 0.35 ? 0.9 : Math.random() * 0.25)
      freeColor.set([tmp.r, tmp.g, tmp.b], i * 3)
      tmp.copy(INK).lerp(PURPLE, 0.22 + (i % 5) * 0.04)
      ink.set([tmp.r, tmp.g, tmp.b], i * 3)
      colors.set([tmp.r, tmp.g, tmp.b], i * 3)
      sizes[i] = 2.4 + Math.random() * 4.2
    }
    const maxPairs = (count * (count - 1)) / 2
    return {
      free,
      structured,
      phase,
      freeColor,
      ink,
      colors,
      sizes,
      positions: new Float32Array(count * 3),
      linePositions: new Float32Array(maxPairs * 6),
      lineColors: new Float32Array(maxPairs * 8),
    }
  }, [count])

  const pointsGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(data.positions, 3))
    g.setAttribute('aColor', new THREE.BufferAttribute(data.colors, 3).setUsage(THREE.DynamicDrawUsage))
    g.setAttribute('aSize', new THREE.BufferAttribute(data.sizes, 1))
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

  useEffect(
    () => () => {
      pointsGeo.dispose()
      linesGeo.dispose()
      pointsMat.dispose()
      linesMat.dispose()
    },
    [pointsGeo, linesGeo, pointsMat, linesMat],
  )

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const p = progress.get()
    const spread = 1 + p * 1.8
    const fade = 1 - THREE.MathUtils.smoothstep(p, 0.58, 1)
    const structure = 1 - THREE.MathUtils.smoothstep(p, 0.04, 0.6)
    pointsMat.uniforms.uFade.value = fade
    linesMat.opacity = fade

    const px = pointer.current.x * (viewport.width / 2)
    const py = pointer.current.y * (viewport.height / 2)
    const { free, structured, phase, positions, linePositions, lineColors, colors, freeColor, ink } = data
    const phone = size.width < 768
    const tablet = !phone && size.width < 1100
    const fit = phone ? 0.46 : tablet ? 0.72 : 1
    const ox = phone ? 0 : tablet ? 1.85 : 1.65
    const oy = phone ? 1.85 : 0.12
    const wobble = 0.05 + (1 - structure) * 0.4
    const pullStrength = 0.08 + 0.3 * (1 - structure)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const speed = phase[i3 + 2]
      let x = THREE.MathUtils.lerp(free[i3], structured[i3] * fit + ox, structure)
      let y = THREE.MathUtils.lerp(free[i3 + 1], structured[i3 + 1] * fit + oy, structure)
      let z = THREE.MathUtils.lerp(free[i3 + 2], structured[i3 + 2], structure)
      x += Math.sin(t * speed + phase[i3]) * wobble
      y += Math.cos(t * speed * 0.8 + phase[i3 + 1]) * wobble * 0.8
      z += Math.sin(t * speed * 0.6 + phase[i3]) * wobble * 0.5
      const dx = px - x
      const dy = py - y
      const d2 = dx * dx + dy * dy
      if (d2 < 9) {
        const pull = (1 - d2 / 9) * pullStrength
        x += dx * pull
        y += dy * pull
      }
      positions[i3] = x * spread
      positions[i3 + 1] = y * spread
      positions[i3 + 2] = z * spread
      colors[i3] = ink[i3] * structure + freeColor[i3] * (1 - structure)
      colors[i3 + 1] = ink[i3 + 1] * structure + freeColor[i3 + 1] * (1 - structure)
      colors[i3 + 2] = ink[i3 + 2] * structure + freeColor[i3 + 2] * (1 - structure)
    }
    pointsGeo.attributes.position.needsUpdate = true
    pointsGeo.attributes.aColor.needsUpdate = true

    let segments = 0
    const maxD2 = LINK_DISTANCE * LINK_DISTANCE * spread * spread
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
        if (dist2 > maxD2) continue
        const alpha = (1 - dist2 / maxD2) * 0.5
        const o = segments * 6
        linePositions[o] = ax
        linePositions[o + 1] = ay
        linePositions[o + 2] = az
        linePositions[o + 3] = bx
        linePositions[o + 4] = by
        linePositions[o + 5] = bz
        const c = segments * 8
        lineColors[c] = colors[i * 3]
        lineColors[c + 1] = colors[i * 3 + 1]
        lineColors[c + 2] = colors[i * 3 + 2]
        lineColors[c + 3] = alpha
        lineColors[c + 4] = colors[j * 3]
        lineColors[c + 5] = colors[j * 3 + 1]
        lineColors[c + 6] = colors[j * 3 + 2]
        lineColors[c + 7] = alpha
        segments++
      }
    }
    linesGeo.setDrawRange(0, segments * 2)
    linesGeo.attributes.position.needsUpdate = true
    linesGeo.attributes.color.needsUpdate = true

    if (group.current) {
      const g = group.current
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.current.x * 0.28, 3, delta)
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -pointer.current.y * 0.18, 3, delta)
      g.position.y = p * 1.5
    }
  })

  return (
    <group ref={group} scale={size.width < 768 ? 0.75 : 1}>
      <lineSegments geometry={linesGeo} material={linesMat} />
      <points geometry={pointsGeo} material={pointsMat} />
    </group>
  )
}

export default function NeuralField({ progress, active }: { progress: MotionValue<number>; active: boolean }) {
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
      <Field count={count} progress={progress} />
    </Canvas>
  )
}
