import { ArrowUpRight } from 'lucide-react'
import { type CSSProperties, type FocusEvent, useEffect, useRef, useState } from 'react'
import { type Project, projects } from '../data/projects'
import { useScrollAnimations } from '../hooks/useScrollAnimations'
import { gsap, mq, seeded } from '../lib/motion'
import { ProjectVisual } from './ProjectVisual'

export function ProjectGallery() {
  const root = useRef<HTMLElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const [opened, setOpened] = useState<number | null>(null)
  const follow = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc; r: gsap.QuickToFunc } | null>(null)

  // Floating preview follows the pointer through quickTo — no React renders on move.
  useEffect(() => {
    const el = preview.current
    if (!el) return
    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.7 })
    follow.current = {
      x: gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' }),
      r: gsap.quickTo(el, 'rotate', { duration: 0.8, ease: 'power3.out' }),
    }
    let lastX = 0
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      follow.current?.x(e.clientX)
      follow.current?.y(e.clientY)
      follow.current?.r(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.4))
      lastX = e.clientX
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    // The preview is fixed-position; drop it whenever the gallery leaves the viewport.
    const io = new IntersectionObserver(([entry]) => !entry.isIntersecting && setActive(null))
    if (root.current) io.observe(root.current)
    return () => {
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      gsap.killTweensOf(el)
    }
  }, [])

  useEffect(() => {
    const el = preview.current
    if (!el) return
    gsap.to(el, { autoAlpha: active === null ? 0 : 1, scale: active === null ? 0.7 : 1, duration: 0.5, ease: 'expo.out' })
  }, [active])

  // Keyboard focus has no pointer, so park the preview beside the focused title.
  const focusAt = (i: number, target: HTMLElement) => {
    const r = target.getBoundingClientRect()
    const left = r.left + r.width / 2 > window.innerWidth / 2
    follow.current?.x(left ? r.left - window.innerWidth * 0.16 : r.right + window.innerWidth * 0.16)
    follow.current?.y(r.top + r.height / 2)
    setActive(i)
  }

  useScrollAnimations(root, (el) => {
    const items = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('[data-project]'))
    const mm = gsap.matchMedia()
    mm.add(mq.motion, () => {
      gsap.from(el.querySelector('[data-projects-title]'), {
        yPercent: 100,
        rotate: 2,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 75%' },
      })
      items.forEach((item, i) => {
        gsap.from(item.querySelector('[data-project-title]'), {
          yPercent: 60 + Math.abs(seeded(i)) * 60,
          rotate: seeded(i, 2) * 8,
          autoAlpha: 0,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 92%', end: 'top 60%', scrub: 0.8 },
        })
        gsap.from(item.querySelector('[data-project-thumb]'), {
          scale: 0,
          rotate: seeded(i, 3) * 30,
          ease: 'back.out(1.7)',
          duration: 0.9,
          scrollTrigger: { trigger: item, start: 'top 80%' },
        })
        // Gentle parallax drift so the composition breathes while scrolling.
        gsap.to(item, {
          y: () => seeded(i, 5) * 60,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
        })
      })
    })
    return () => mm.revert()
  })

  return (
    <section id="projects" ref={root} className="relative overflow-hidden bg-cream px-4 pb-24 pt-28 text-charcoal sm:px-8 lg:px-[4vw]">
      <header className="flex items-end justify-between gap-6">
        <h2 className="overflow-hidden pb-[0.08em] font-display text-[18vw] font-bold leading-[0.85] tracking-[-0.045em] lg:text-[11vw]">
          <span data-projects-title className="inline-block">
            Projects
          </span>
        </h2>
        <p className="mb-[1.2vw] shrink-0 text-xs text-charcoal/60 sm:text-sm">({String(projects.length).padStart(2, '0')}) selected works</p>
      </header>

      <ul className="relative mt-16 flex flex-col gap-14 lg:mt-0 lg:block lg:h-[150vh]" onMouseLeave={() => setActive(null)}>
        {projects.map((p, i) => (
          <ProjectItem
            key={p.slug}
            project={p}
            index={i}
            dimmed={active !== null && active !== i}
            opened={opened === i}
            onEnter={() => setActive(i)}
            onLeave={() => setActive(null)}
            onFocus={(t) => focusAt(i, t)}
            onToggle={() => setOpened((o) => (o === i ? null : i))}
          />
        ))}
      </ul>

      <div
        ref={preview}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 hidden aspect-[4/3] w-[26vw] max-w-[440px] overflow-hidden rounded-[10px] shadow-[0_40px_80px_-30px_rgba(30,29,29,0.6)] lg:block"
      >
        {projects.map((p, i) => (
          <div
            key={p.slug}
            className="absolute inset-0 transition-[opacity,transform,clip-path] duration-700 ease-out-expo"
            style={{
              opacity: active === i ? 1 : 0,
              transform: active === i ? 'scale(1)' : 'scale(1.12)',
              clipPath: active === i ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
            }}
          >
            <ProjectVisual project={p} />
          </div>
        ))}
        <div className="grain" />
      </div>
    </section>
  )
}

interface ItemProps {
  project: Project
  index: number
  dimmed: boolean
  opened: boolean
  onEnter: () => void
  onLeave: () => void
  onFocus: (target: HTMLElement) => void
  onToggle: () => void
}

function ProjectItem({ project: p, index, dimmed, opened, onEnter, onLeave, onFocus, onToggle }: ItemProps) {
  const { x, y, size, rotate, thumb } = p.layout
  const content = (
    <>
      <span
        data-project-thumb
        className={`relative block aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-[6px] shadow-md transition-transform duration-500 ease-out-expo group-hover:scale-110 sm:w-32 lg:w-[7vw] ${
          thumb === 'left' ? 'lg:order-first' : 'lg:order-last'
        }`}
        style={{ rotate: `${seeded(index, 7) * 6}deg` }}
      >
        <ProjectVisual project={p} />
      </span>
      <span className="flex flex-col">
        <span className="overflow-hidden pb-[0.12em]">
          <span
            data-project-title
            className={`inline-block font-display leading-[0.95] tracking-[-0.03em] transition-transform duration-500 ease-out-expo group-hover:-translate-y-[0.06em] group-hover:-rotate-1 ${
              p.italic ? 'font-sans font-medium italic' : 'font-bold'
            } text-[11vw] lg:text-[length:var(--size)]`}
          >
            {p.title}
          </span>
        </span>
        <span
          className={`flex items-center gap-2 text-[11px] text-charcoal/60 transition-all duration-500 ease-out-expo sm:text-xs ${
            opened ? 'max-h-6 opacity-100' : 'max-h-6 opacity-100 lg:max-h-0 lg:opacity-0 lg:group-hover:max-h-6 lg:group-hover:opacity-100 lg:group-focus-visible:max-h-6 lg:group-focus-visible:opacity-100'
          }`}
        >
          {p.year ? `${p.year} — ` : ''}{p.discipline}
          {p.href ? (
            <span className="inline-flex items-center gap-1 italic">
              · visit live <ArrowUpRight size={12} aria-hidden="true" />
            </span>
          ) : (
            <span className="italic">· case study soon</span>
          )}
        </span>
      </span>
    </>
  )

  const shared = {
    className: 'group flex items-center gap-4 text-left lg:gap-[1.4vw]',
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    onFocus: (e: FocusEvent<HTMLElement>) => onFocus(e.currentTarget),
    onBlur: onLeave,
  }

  return (
    <li
      data-project
      className={`transition-opacity duration-500 lg:absolute ${dimmed ? 'opacity-30' : 'opacity-100'} ${index % 2 ? 'self-end' : 'self-start'}`}
      style={{ left: `${x}%`, top: `${y}%`, rotate: `${rotate}deg`, '--size': `${size}vw` } as CSSProperties}
    >
      {p.href ? (
        <a href={p.href} target="_blank" rel="noreferrer" {...shared}>
          {content}
        </a>
      ) : (
        <button type="button" aria-expanded={opened} onClick={onToggle} {...shared}>
          {content}
        </button>
      )}
    </li>
  )
}
