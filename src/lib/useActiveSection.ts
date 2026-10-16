import { useEffect, useState } from 'react'

/** Tracks which section crosses a band just below the nav. `aliases` maps extra section ids to a nav id. */
export function useActiveSection(ids: readonly string[], aliases: Record<string, string> = {}) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const targets = [...ids, ...Object.keys(aliases)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (!visible.length) return
        const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        setActive(aliases[top.target.id] ?? top.target.id)
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [ids, aliases])

  return active
}
