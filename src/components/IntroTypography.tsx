import { useRef } from 'react'
import { site } from '../data/site'
import { useScrollAnimations } from '../hooks/useScrollAnimations'
import { gsap, mq, seeded } from '../lib/motion'
import { SplitText } from '../lib/SplitText'

/** Characters that break away from the baseline mid-sequence (indices into the split string). */
const DETACHED = [8, 12, 25, 33, 40, 47]

export function IntroTypography() {
  const root = useRef<HTMLElement>(null)

  useScrollAnimations(root, (el) => {
    const chars = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('.char'))
    const words = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('.word'))
    const detached = DETACHED.map((i) => chars[i]).filter(Boolean)
    const meta = el.querySelectorAll('[data-intro-meta]')
    const mm = gsap.matchMedia()

    mm.add(mq.desktop + ', ' + mq.tablet, () => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: el, start: 'top top', end: '+=230%', scrub: 1, pin: true },
      })

      tl.from(chars, {
        yPercent: (i) => 90 + Math.abs(seeded(i)) * 80,
        rotate: (i) => seeded(i, 2) * 28,
        autoAlpha: 0,
        duration: 0.5,
        stagger: { each: 0.012 },
      })
        .from(meta, { autoAlpha: 0, y: 20, duration: 0.3, stagger: 0.1 }, 0.4)
        // Detach: selected letters lift off, spin and settle slightly askew.
        .to(
          detached,
          {
            y: (i) => (i % 2 ? '-0.32em' : '0.28em'),
            x: (i) => `${seeded(i, 5) * 0.12}em`,
            rotate: (i) => seeded(i, 7) * 70 + (i % 2 ? 35 : -35),
            duration: 0.45,
            ease: 'power2.inOut',
            stagger: 0.05,
          },
          '+=0.15',
        )
        .to(detached, { y: (i) => `${seeded(i, 9) * 0.06}em`, rotate: (i) => seeded(i, 3) * 9, duration: 0.4, ease: 'back.out(1.6)', stagger: 0.04 })
        .addLabel('exit', '+=0.25')
        .to(words, { yPercent: (i) => -60 - Math.abs(seeded(i, 11)) * 140, rotate: (i) => seeded(i, 13) * 6, autoAlpha: 0, duration: 0.6, ease: 'power2.in', stagger: { each: 0.025, from: 'start' } }, 'exit')
        .to(meta, { autoAlpha: 0, y: -30, duration: 0.3 }, 'exit')
    })

    mm.add(mq.mobile, () => {
      gsap.from(chars, {
        yPercent: 110,
        rotate: (i) => seeded(i, 2) * 18,
        autoAlpha: 0,
        stagger: 0.008,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 75%', end: 'center 55%', scrub: 0.8 },
      })
    })

    return () => mm.revert()
  })

  return (
    <section
      id="manifesto"
      ref={root}
      className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-cream px-4 py-24 text-charcoal sm:px-8 lg:px-[4vw]"
    >
      <p data-intro-meta className="mb-6 text-[11px] uppercase tracking-[0.22em] text-charcoal/60 sm:mb-10">
        (01) — Manifesto
      </p>
      <h2
        aria-label={site.tagline}
        className="font-display text-[13.5vw] font-bold leading-[0.9] tracking-[-0.035em] sm:text-[10vw] lg:text-[8.6vw] 2xl:text-[8.2rem]"
      >
        <SplitText text="I create experiences at the intersection of" />{' '}
        <span className="font-sans font-medium italic">
          <SplitText text="web2" />
        </span>{' '}
        <SplitText text="and web3." />
      </h2>
      <div data-intro-meta className="mt-10 flex flex-col justify-between gap-4 text-xs text-charcoal/70 sm:mt-16 sm:flex-row sm:text-sm">
        <p className="max-w-[34ch]">
          Products that move with intent — polished web2 front-ends and onchain apps, built by hand and shipped end to end.
        </p>
        <p className="italic">shipping between the browser and the chain</p>
      </div>
    </section>
  )
}
