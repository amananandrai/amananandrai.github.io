import { ContactShadows, Environment, Lightformer, OrbitControls, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { FrameStyle, Painting } from '../content'

interface FrameLook {
  border: number
  mat: number
  depth: number
  color: string
  matColor: string
  metalness: number
  roughness: number
  clearcoat: number
  emissive: number
  glow: number
}

const looks: Record<FrameStyle['id'], FrameLook> = {
  none: {
    border: 0,
    mat: 0,
    depth: 0.02,
    color: '#ffffff',
    matColor: '#ffffff',
    metalness: 0,
    roughness: 0.8,
    clearcoat: 0,
    emissive: 0,
    glow: 0,
  },
  modern: {
    border: 0.028,
    mat: 0.13,
    depth: 0.05,
    color: '#1c1917',
    matColor: '#ffffff',
    metalness: 0,
    roughness: 0.55,
    clearcoat: 0,
    emissive: 0,
    glow: 0,
  },
  classic: {
    border: 0.17,
    mat: 0.035,
    depth: 0.1,
    color: '#4e3229',
    matColor: '#2b1a15',
    metalness: 0.05,
    roughness: 0.5,
    clearcoat: 0.25,
    emissive: 0,
    glow: 0,
  },
  gold: {
    border: 0.14,
    mat: 0.07,
    depth: 0.09,
    color: '#e0b94a',
    matColor: '#fffdf5',
    metalness: 0.92,
    roughness: 0.3,
    clearcoat: 0.4,
    emissive: 0,
    glow: 0,
  },
  neon: {
    border: 0.05,
    mat: 0.08,
    depth: 0.04,
    color: '#f472b6',
    matColor: '#050505',
    metalness: 0,
    roughness: 0.4,
    clearcoat: 0,
    emissive: 2.6,
    glow: 2.2,
  },
}

const ART_HEIGHT = 1.55
const GAP = 0.75

interface Layout {
  painting: Painting
  index: number
  width: number
  height: number
  x: number
}

function useLayout(paintings: Painting[]) {
  return useMemo(() => {
    const sized = paintings.map((p, index) => {
      const aspect = p.width / p.height
      const height = aspect < 1 ? ART_HEIGHT * 1.22 : ART_HEIGHT
      return { painting: p, index, width: height * aspect, height }
    })
    const total = sized.reduce((sum, s) => sum + s.width, 0) + GAP * (sized.length - 1)
    let cursor = -total / 2
    const items: Layout[] = sized.map((s) => {
      const x = cursor + s.width / 2
      cursor += s.width + GAP
      return { ...s, x }
    })
    return { items, total }
  }, [paintings])
}

function Frame({
  item,
  frame,
  hovered,
  onHover,
  onSelect,
}: {
  item: Layout
  frame: FrameStyle['id']
  hovered: boolean
  onHover: (index: number | null) => void
  onSelect: (index: number) => void
}) {
  const texture = useTexture(item.painting.src)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8

  const group = useRef<THREE.Group>(null)
  const bars = useRef<(THREE.Mesh | null)[]>([])
  const matMesh = useRef<THREE.Mesh>(null)
  const glow = useRef<THREE.PointLight>(null)
  const state = useRef<FrameLook>({ ...looks[frame] })
  const color = useMemo(() => new THREE.Color(looks[frame].color), [])
  const matColor = useMemo(() => new THREE.Color(looks[frame].matColor), [])

  const frameMaterial = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color, emissive: new THREE.Color('#f472b6') }),
    [color],
  )
  const matMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: matColor, roughness: 0.9 }), [matColor])
  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])
  const plane = useMemo(() => new THREE.PlaneGeometry(1, 1), [])

  useEffect(
    () => () => {
      frameMaterial.dispose()
      matMaterial.dispose()
      box.dispose()
      plane.dispose()
    },
    [frameMaterial, matMaterial, box, plane],
  )

  const targetColor = useMemo(() => new THREE.Color(), [])
  const targetMat = useMemo(() => new THREE.Color(), [])

  useFrame((_, delta) => {
    const target = looks[frame]
    const s = state.current
    const k = 6
    for (const key of ['border', 'mat', 'depth', 'metalness', 'roughness', 'clearcoat', 'emissive', 'glow'] as const) {
      s[key] = THREE.MathUtils.damp(s[key], target[key], k, delta)
    }
    targetColor.set(target.color)
    targetMat.set(target.matColor)
    const t = 1 - Math.exp(-k * delta)
    frameMaterial.color.lerp(targetColor, t)
    matMaterial.color.lerp(targetMat, t)
    frameMaterial.metalness = s.metalness
    frameMaterial.roughness = s.roughness
    frameMaterial.clearcoat = s.clearcoat
    frameMaterial.emissiveIntensity = s.emissive

    const w = item.width
    const h = item.height
    const m = s.mat
    const b = Math.max(s.border, 0.0001)
    const d = s.depth
    const outerW = w + 2 * m + 2 * b
    const outerH = h + 2 * m + 2 * b
    const layout: [number, number, number, number][] = [
      [0, h / 2 + m + b / 2, outerW, b],
      [0, -(h / 2 + m + b / 2), outerW, b],
      [-(w / 2 + m + b / 2), 0, b, outerH - 2 * b],
      [w / 2 + m + b / 2, 0, b, outerH - 2 * b],
    ]
    bars.current.forEach((bar, i) => {
      if (!bar) return
      const [x, y, sx, sy] = layout[i]
      bar.position.set(x, y, d / 2)
      bar.scale.set(sx, sy, d)
      bar.visible = s.border > 0.002
    })
    if (matMesh.current) {
      matMesh.current.scale.set(w + 2 * m + 0.001, h + 2 * m + 0.001, 1)
      matMesh.current.position.z = 0.004
      matMesh.current.visible = m > 0.002
    }
    if (glow.current) glow.current.intensity = s.glow
    if (group.current) {
      const scale = THREE.MathUtils.damp(group.current.scale.x, hovered ? 1.035 : 1, 8, delta)
      group.current.scale.setScalar(scale)
      group.current.position.z = THREE.MathUtils.damp(group.current.position.z, hovered ? 0.12 : 0.02, 8, delta)
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 6) return
    e.stopPropagation()
    onSelect(item.index)
  }

  return (
    <group ref={group} position={[item.x, 0.25, 0.02]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            bars.current[i] = el
          }}
          geometry={box}
          material={frameMaterial}
          castShadow
        />
      ))}
      <mesh ref={matMesh} geometry={plane} material={matMaterial} receiveShadow castShadow />
      <mesh
        position={[0, 0, 0.012]}
        scale={[item.width, item.height, 1]}
        geometry={plane}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover(item.index)
        }}
        onPointerOut={() => onHover(null)}
      >
        <meshStandardMaterial map={texture} roughness={0.85} />
      </mesh>
      <pointLight ref={glow} color="#f472b6" position={[0, 0, 0.6]} distance={3.2} intensity={0} />
    </group>
  )
}

function CameraRig({ total, focus }: { total: number; focus: number | null }) {
  const { camera, size } = useThree()
  const controls = useThree((s) => s.controls) as unknown as { target: THREE.Vector3; update: () => void } | null

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    const aspect = size.width / size.height
    const halfFov = THREE.MathUtils.degToRad(cam.fov / 2)
    const fitWidth = (total / 2 + 0.6) / (Math.tan(halfFov) * aspect)
    const fitHeight = 1.9 / Math.tan(halfFov)
    const distance = Math.max(fitWidth, fitHeight, 4.2)
    cam.position.set(0, 0.55, distance)
    cam.far = 60
    cam.updateProjectionMatrix()
    controls?.target.set(0, 0.2, 0)
    controls?.update()
  }, [camera, size, total, controls])

  useFrame((_, delta) => {
    if (!controls || focus !== null) return
    controls.target.x = THREE.MathUtils.damp(controls.target.x, 0, 2, delta)
  })
  return null
}

function Lamp({ x }: { x: number }) {
  const light = useMemo(() => {
    const l = new THREE.SpotLight('#fff3e0', 18, 9, 0.42, 0.75)
    l.position.set(x, 3.4, 2.4)
    l.target.position.set(x, 0.25, 0)
    return l
  }, [x])
  useEffect(() => () => light.dispose(), [light])
  return (
    <>
      <primitive object={light} />
      <primitive object={light.target} />
    </>
  )
}

function Room({ width }: { width: number }) {
  return (
    <group>
      <mesh position={[0, 0.6, -0.05]} receiveShadow>
        <planeGeometry args={[width + 14, 9]} />
        <meshStandardMaterial color="#f1eefa" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 3]} receiveShadow>
        <planeGeometry args={[width + 14, 8]} />
        <meshStandardMaterial color="#2a2d52" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, -1.5, -0.03]}>
        <boxGeometry args={[width + 14, 0.1, 0.06]} />
        <meshStandardMaterial color="#d9d5ea" />
      </mesh>
    </group>
  )
}

export interface GalleryRoomProps {
  paintings: Painting[]
  frame: FrameStyle['id']
  onSelect: (index: number) => void
}

export default function GalleryRoom({ paintings, frame, onSelect }: GalleryRoomProps) {
  const { items, total } = useLayout(paintings)
  const [hovered, setHovered] = useState<number | null>(null)
  const [visible, setVisible] = useState(() => document.visibilityState === 'visible')

  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  useEffect(() => {
    document.body.style.cursor = hovered !== null ? 'pointer' : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [hovered])

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      frameloop={visible ? 'always' : 'never'}
      camera={{ fov: 34, position: [0, 0.55, 8] }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      onPointerMissed={() => setHovered(null)}
    >
      <color attach="background" args={['#1b1f45']} />
      <fog attach="fog" args={['#1b1f45', 9, 22]} />
      <ambientLight intensity={0.5} />
      <hemisphereLight args={['#ffffff', '#2a2d52', 0.5]} />
      <directionalLight
        position={[2, 5, 6]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0004}
      />
      {items.map((item) => (
        <Lamp key={item.painting.id} x={item.x} />
      ))}
      <Environment resolution={128}>
        <color attach="background" args={['#3a3f6e']} />
        <Lightformer intensity={2} position={[0, 2, 6]} rotation-y={Math.PI} scale={[12, 5, 1]} />
        <Lightformer intensity={1.2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[12, 4, 1]} />
        <Lightformer intensity={1.2} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} color="#8b93e6" />
        <Lightformer intensity={1.2} position={[5, 0, 2]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} color="#14b789" />
      </Environment>
      <Room width={total} />
      {items.map((item) => (
        <Frame
          key={item.painting.id}
          item={item}
          frame={frame}
          hovered={hovered === item.index}
          onHover={setHovered}
          onSelect={onSelect}
        />
      ))}
      <ContactShadows position={[0, -1.54, 0.6]} opacity={0.45} scale={total + 4} blur={2.4} far={2.2} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={3}
        maxDistance={12}
        minAzimuthAngle={-0.75}
        maxAzimuthAngle={0.75}
        minPolarAngle={Math.PI / 2 - 0.45}
        maxPolarAngle={Math.PI / 2 + 0.08}
      />
      <CameraRig total={total} focus={hovered} />
    </Canvas>
  )
}
