import { useRef } from 'react'
import { useScrollAnimations } from '../hooks/useScrollAnimations'
import { gsap, mq } from '../lib/motion'
import { addBridgeTimeline } from '../lib/bridgeTimeline'
import { GradientBridge } from './GradientBridge'

const beats = [
  { id: 'first', label: 'First', statement: 'web2.', tone: 'cream' },
  { id: 'then', label: 'Then', statement: 'web3.', tone: 'charcoal' },
] as const

const labelCls = 'font-display text-[9vw] font-bold leading-none tracking-[-0.02em] sm:text-[6vw] lg:text-[3.6vw]'
const statementCls = 'font-display text-[12vw] font-bold leading-[0.95] tracking-[-0.035em] sm:text-[9vw] lg:text-[6.8vw]'

export function JourneySection() {
  const root = useRef<HTMLElement>(null)

  useScrollAnimations(root, (el) => {
    const stage = el.querySelector<HTMLElement>('.stage')!
    const [b1, b2, b3] = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('[data-beat]'))
    const line = el.querySelector<HTMLElement>('[data-bridge-line]')!
    const word = el.querySelector<HTMLElement>('[data-bridge-word]')!
    const mm = gsap.matchMedia()

    mm.add({ desktop: mq.desktop, tablet: mq.tablet, mobile: mq.mobile }, (context) => {
      const { mobile } = context.conditions as { mobile: boolean }
      el.classList.add('is-staged')

      const rise = (target: Element, at: gsap.Position, dur = 0.5) =>
        tl.from(target.querySelectorAll('[data-rise]'), { yPercent: 110, rotate: 3, duration: dur, ease: 'power3.out', stagger: 0.08 }, at)
      const leave = (target: Element, at: gsap.Position) =>
        tl.to(target.querySelectorAll('[data-rise]'), { yPercent: -110, rotate: -2, duration: 0.45, ease: 'power2.in', stagger: 0.05 }, at)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: mobile ? '+=420%' : '+=640%',
          scrub: 1,
          pin: stage,
          invalidateOnRefresh: true,
        },
      })

      // FIRST — cream
      rise(b1, 0)
      tl.to({}, { duration: 0.35 })
      // THEN — charcoal wipes up from below while the first beat exits.
      leave(b1, '>')
      tl.fromTo(b2, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power3.inOut' }, '<0.1')
      rise(b2, '<0.25')
      tl.to({}, { duration: 0.35 })
      // TODAY — cream returns.
      leave(b2, '>')
      tl.fromTo(b3, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power3.inOut' }, '<0.1')
      tl.from(b3.querySelector('[data-rise]'), { yPercent: 110, duration: 0.5, ease: 'power3.out' }, '<0.25')
      tl.from(word, { autoAlpha: 0, y: () => line.offsetHeight * 0.6, rotate: 2, duration: 0.5, ease: 'power3.out' }, '<0.1')

      // I BRIDGE — the two.
      const paint = addBridgeTimeline(tl, stage, line, word)
      tl.eventCallback('onUpdate', paint)
      tl.to(b3.querySelector('[data-rise]'), { yPercent: -110, duration: 0.45, ease: 'power2.in' }, 'merge')
      tl.to({}, { duration: 0.3 })

      return () => {
        el.classList.remove('is-staged')
        el.querySelectorAll<HTMLElement>('[data-bridge-panel]').forEach((p) => (p.style.clipPath = ''))
      }
    })

    return () => mm.revert()
  })

  return (
    <section id="journey" ref={root} className="journey relative bg-charcoal" aria-label="Journey">
      <h2 className="sr-only">My journey</h2>
      <div className="stage relative">
        {beats.map((beat) => (
          <div
            key={beat.id}
            data-beat={beat.id}
            className={`beat flex flex-col items-center justify-center gap-[6vh] px-4 text-center ${
              beat.tone === 'cream' ? 'bg-cream text-charcoal' : 'bg-charcoal text-cream'
            }`}
          >
            <p className="overflow-hidden pb-[0.1em]">
              <span data-rise className={`inline-block ${labelCls}`}>
                {beat.label}
              </span>
            </p>
            <p className="overflow-hidden pb-[0.12em]">
              <span data-rise className={`inline-block ${statementCls}`}>
                {beat.statement}
              </span>
            </p>
          </div>
        ))}

        <div data-beat="today" className="beat flex items-center justify-center bg-cream px-4 text-center text-charcoal">
          {/* "I bridge" sits on the exact vertical centre so the bridge band and "the two." line up with it. */}
          <div className="relative">
            <p className="absolute bottom-full left-1/2 mb-[6vh] -translate-x-1/2 overflow-hidden pb-[0.1em]">
              <span data-rise className={`inline-block ${labelCls}`}>
                Today
              </span>
            </p>
            <p data-bridge-line className={`${statementCls} py-[0.06em]`}>
              <span data-bridge-word className="inline-block">
                I bridge
              </span>
            </p>
          </div>
        </div>

        <GradientBridge />
      </div>
    </section>
  )
}
