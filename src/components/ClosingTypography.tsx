import { useLayoutEffect, useRef } from 'react'
import { useScrollAnimations } from '../hooks/useScrollAnimations'
import { gsap, mq, seeded } from '../lib/motion'

const WORD = 'Together'

export function ClosingTypography() {
  const root = useRef<HTMLElement>(null)
  const word = useRef<HTMLParagraphElement>(null)

  // One continuous gradient across the word, even though every letter moves independently:
  // each letter paints the slice of a word-wide gradient that sits behind it.
  useLayoutEffect(() => {
    const el = word.current
    if (!el) return
    const paint = () => {
      const chars = el.querySelectorAll<HTMLElement>('.char')
      const width = el.scrollWidth
      chars.forEach((c) => {
        c.style.backgroundSize = `${width}px 100%`
        c.style.backgroundPosition = `${-c.offsetLeft}px 0`
      })
    }
    paint()
    const ro = new ResizeObserver(paint)
    ro.observe(el)
    document.fonts?.ready.then(paint)
    return () => ro.disconnect()
  }, [])

  useScrollAnimations(root, (el) => {
    const chars = el.querySelectorAll('.char')
    const mm = gsap.matchMedia()
    mm.add(mq.motion, () => {
      gsap.from(el.querySelector('[data-closing-lead]'), {
        yPercent: 100,
        autoAlpha: 0,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 45%', scrub: 0.8 },
      })
      gsap.from(chars, {
        yPercent: (i) => 70 + Math.abs(seeded(i, 1)) * 60,
        rotate: (i) => seeded(i, 2) * 16,
        autoAlpha: 0,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 60%', end: 'center 45%', scrub: 1 },
      })
      gsap.fromTo(word.current, { xPercent: 6 }, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
    })
    return () => mm.revert()
  })

  return (
    <section ref={root} className="relative overflow-hidden bg-charcoal pt-28 text-cream sm:pt-36" aria-labelledby="closing-title">
      <p className="overflow-hidden px-4 text-center font-display text-[7vw] font-bold leading-[1.05] tracking-[-0.025em] sm:px-8 lg:text-[3.4vw]">
        <span data-closing-lead className="inline-block">
          If our visions align, let&rsquo;s shape what&rsquo;s next
        </span>
      </p>
      <h2 id="closing-title" className="sr-only">
        If our visions align, let&rsquo;s shape what&rsquo;s next together
      </h2>
      <div className="flex justify-center" aria-hidden="true">
        <p
          ref={word}
          className="relative -mb-[0.14em] whitespace-nowrap font-display text-[34vw] font-extrabold leading-[0.9] tracking-[-0.06em] lg:text-[30vw]"
        >
          {[...WORD].map((ch, i) => (
            <span key={i} className="char text-gradient-together" style={{ rotate: `${seeded(i, 17) * 4}deg` }}>
              {ch}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
