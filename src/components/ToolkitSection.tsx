import { useRef } from 'react'
import { toolGroups } from '../data/toolkit'
import { useScrollAnimations } from '../hooks/useScrollAnimations'
import { gsap, mq, seeded } from '../lib/motion'
import { ToolMark } from './ToolMark'

/** Fan geometry for card i of n, in vw/deg. Curves gently like a hand of cards. */
function fan(i: number, n: number, spread: number) {
  const k = i - (n - 1) / 2
  return {
    x: `${k * spread}vw`,
    y: `${k * k * spread * 0.09}vw`,
    rotate: k * 3.2 + seeded(i, 21) * 2.5,
    scale: 1 - Math.abs(seeded(i, 4)) * 0.06,
  }
}

export function ToolkitSection() {
  const root = useRef<HTMLElement>(null)

  useScrollAnimations(root, (el) => {
    const mm = gsap.matchMedia()
    const groups = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('[data-group]'))
    const labels = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('[data-swap-label]'))
    const cream = el.querySelector('[data-tk-cream]')
    const title = el.querySelector('[data-tk-title]')
    const tilt = el.querySelectorAll<HTMLElement>('[data-tk-tilt]')

    mm.add({ desktop: mq.desktop, tablet: mq.tablet }, (context) => {
      const { desktop } = context.conditions as { desktop: boolean }
      const spread = desktop ? 9.6 : 10.5
      el.classList.add('is-staged')

      const cardsOf = (g: HTMLElement) => gsap.utils.toArray<HTMLElement>(g.querySelectorAll('[data-card]'))
      const [code, chains] = groups.map(cardsOf)

      // Everything starts below the fold, scattered.
      const offstage = (cards: HTMLElement[]) =>
        gsap.set(cards, {
          x: (i) => `${seeded(i, 8) * 30}vw`,
          y: '115vh',
          rotate: (i) => seeded(i, 6) * 40,
          scale: 0.9,
        })
      offstage(code)
      offstage(chains)

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: el, start: 'top top', end: desktop ? '+=520%' : '+=420%', scrub: 1, pin: true, invalidateOnRefresh: true },
      })

      const enter = (cards: HTMLElement[]) => {
        const n = cards.length
        // Land in a loose pile…
        tl.to(cards, {
          x: (i) => `${seeded(i, 3) * 2.5}vw`,
          y: (i) => `${seeded(i, 5) * 1.5}vw`,
          rotate: (i) => seeded(i, 9) * 14,
          scale: 1,
          duration: 0.8,
          stagger: 0.09,
        })
        // …then spread into the fan.
        tl.to(cards, { ...gsapFan(n, spread), duration: 0.9, ease: 'power2.inOut', stagger: { each: 0.03, from: 'center' } }, '+=0.1')
        tl.to({}, { duration: 0.6 })
      }

      tl.from(title, { yPercent: 100, autoAlpha: 0, duration: 0.4 })
      tl.from(labels[0], { yPercent: 100, duration: 0.4 }, '<0.1')
      enter(code)

      // Chains & AI: the room turns cream, the code hand is thrown off the top.
      tl.addLabel('chains')
      tl.to(code, { y: '-120vh', x: (i) => `${seeded(i, 12) * 35}vw`, rotate: (i) => seeded(i, 14) * 50, duration: 0.8, ease: 'power2.in', stagger: { each: 0.04, from: 'edges' } }, 'chains')
      tl.fromTo(cream, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'power3.inOut' }, 'chains+=0.2')
      tl.to(title, { color: '#1E1D1D', duration: 0.4 }, 'chains+=0.5')
      tl.to(labels[0], { yPercent: -100, duration: 0.35, ease: 'power2.in' }, 'chains+=0.3')
      tl.fromTo(labels[1], { yPercent: 100 }, { yPercent: 0, color: '#1E1D1D', duration: 0.4 }, 'chains+=0.6')
      enter(chains)

      // Subtle pointer-driven tilt of the whole arrangement.
      const rx = Array.from(tilt).map((t) => gsap.quickTo(t, 'rotationX', { duration: 0.8, ease: 'power3.out' }))
      const ry = Array.from(tilt).map((t) => gsap.quickTo(t, 'rotationY', { duration: 0.8, ease: 'power3.out' }))
      const onMove = (e: PointerEvent) => {
        const px = e.clientX / window.innerWidth - 0.5
        const py = e.clientY / window.innerHeight - 0.5
        rx.forEach((f) => f(py * -8))
        ry.forEach((f) => f(px * 10))
      }
      el.addEventListener('pointermove', onMove)

      return () => {
        el.removeEventListener('pointermove', onMove)
        el.classList.remove('is-staged')
      }
    })

    mm.add(mq.mobile, () => {
      groups.forEach((g) => {
        gsap.from(g.querySelectorAll('[data-card]'), {
          y: 80,
          rotate: (i) => seeded(i, 6) * 14,
          autoAlpha: 0,
          stagger: 0.06,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: g, start: 'top 80%' },
        })
      })
    })

    return () => mm.revert()
  })

  return (
    <section id="toolkit" ref={root} className="toolkit relative overflow-hidden bg-charcoal text-cream" aria-labelledby="toolkit-title">
      <div data-tk-cream aria-hidden="true" className="tk-cream absolute inset-0 hidden bg-cream" />
      <div className="tk-stage relative">
        <header className="tk-header relative z-10 flex flex-col items-center pt-24 text-center">
          <h2 id="toolkit-title" data-tk-title className="font-display text-[12vw] font-bold leading-none tracking-[-0.03em] sm:text-[7vw] lg:text-[4.2vw]">
            Toolkit
          </h2>
          <p className="tk-swap relative mt-2 h-[1.3em] overflow-hidden text-xs text-cream/70 sm:text-sm" aria-hidden="true">
            {toolGroups.map((g) => (
              <span key={g.id} data-swap-label className="absolute inset-x-0 top-0 whitespace-nowrap">
                {g.label}
              </span>
            ))}
          </p>
        </header>

        {toolGroups.map((group) => (
          <div key={group.id} data-group={group.id} className="tk-group px-4 pb-20 pt-10 [perspective:1400px]">
            <h3 className="tk-group-label mb-8 text-center text-sm text-cream/70">{group.label}</h3>
            <ul data-tk-tilt className="tk-cards flex flex-wrap justify-center gap-4 [transform-style:preserve-3d]">
              {group.tools.map((tool, i) => (
                <li key={tool.name} data-card className="tk-card group/card relative w-32 hover:z-60! focus-within:z-60! sm:w-40" style={{ zIndex: 10 + i }}>
                  <div
                    tabIndex={0}
                    className="tk-face relative flex aspect-[3/4] w-full flex-col items-center justify-center overflow-hidden rounded-[14px] shadow-[0_24px_50px_-18px_rgba(0,0,0,0.55),0_2px_6px_rgba(0,0,0,0.2)] transition-transform duration-500 ease-out-expo group-hover/card:-translate-y-6 group-hover/card:scale-[1.06] group-focus-within/card:-translate-y-6 group-focus-within/card:scale-[1.06]"
                    style={{ background: tool.bg, color: tool.fg }}
                    aria-label={`${tool.name} — ${tool.note}`}
                  >
                    <span className="absolute left-3 top-3 text-[10px] tabular-nums opacity-60">{String(i + 1).padStart(2, '0')}</span>
                    <ToolMark tool={tool} />
                    <div className="absolute inset-x-3 bottom-3 flex flex-col">
                      <span className="text-[11px] font-medium sm:text-xs">{tool.name}</span>
                      <span className="max-h-0 overflow-hidden text-[10px] italic opacity-0 transition-all duration-500 ease-out-expo group-hover/card:max-h-8 group-hover/card:opacity-70 group-focus-within/card:max-h-8 group-focus-within/card:opacity-70">
                        {tool.note}
                      </span>
                    </div>
                    <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/10" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

/** Function-based fan values for a group of n cards. */
function gsapFan(n: number, spread: number) {
  return {
    x: (i: number) => fan(i, n, spread).x,
    y: (i: number) => fan(i, n, spread).y,
    rotate: (i: number) => fan(i, n, spread).rotate,
    scale: (i: number) => fan(i, n, spread).scale,
  }
}
