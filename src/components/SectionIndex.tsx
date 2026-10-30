import { useEffect, useState } from 'react'
import { ScrollTrigger } from '../lib/motion'
import { onAnchorClick } from '../lib/anchors'

const sections = [
  { id: 'hero', label: 'Intro' },
  { id: 'manifesto', label: 'Manifesto' },
  { id: 'journey', label: 'Journey' },
  { id: 'toolkit', label: 'Toolkit' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

/** Minimal fixed index on the left edge. Difference blending keeps it legible on cream, charcoal and colour. */
export function SectionIndex() {
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const triggers = sections.flatMap(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return []
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => self.isActive && setActive(id),
      })
    })
    return () => triggers.forEach((t) => t.kill())
  }, [])

  return (
    <nav aria-label="Sections" className="fixed left-3 top-1/2 z-50 hidden -translate-y-1/2 mix-blend-difference sm:block">
      <ul className="flex flex-col gap-2.5">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a href={`#${id}`} onClick={onAnchorClick} className="group flex items-center gap-2 py-0.5 text-[10px] text-white" aria-current={active === id ? 'true' : undefined}>
              <span className={`block h-px bg-white transition-all duration-500 ease-out-expo ${active === id ? 'w-6' : 'w-3 opacity-50 group-hover:w-5 group-hover:opacity-100'}`} />
              <span className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
