let webglCache: boolean | undefined

export function supportsWebGL(): boolean {
  if (webglCache !== undefined) return webglCache
  try {
    const canvas = document.createElement('canvas')
    webglCache = Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    webglCache = false
  }
  return webglCache
}

/** Heuristic for devices that should get 2D fallbacks instead of heavier 3D scenes. */
export function isWeakDevice(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  if (nav.connection?.saveData) return true
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return true
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 4) return true
  return false
}

export function forcedMode(): '3d' | '2d' | null {
  const value = new URLSearchParams(window.location.search).get('view')
  return value === '3d' || value === '2d' ? value : null
}
