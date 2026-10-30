import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { site } from '../data/site'
import { useScrollAnimations } from '../hooks/useScrollAnimations'
import { gsap, mq } from '../lib/motion'
import { SplitText } from '../lib/SplitText'

export function PlaygroundSection() {
  const root = useRef<HTMLElement>(null)

  useScrollAnimations(root, (el) => {
    const mm = gsap.matchMedia()
    mm.add(mq.motion, () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 70%', end: 'center 50%', scrub: 0.8 } })
      tl.from(el.querySelector('[data-next]'), { yPercent: 100, autoAlpha: 0, duration: 0.4 })
        .from(el.querySelectorAll('.word'), { yPercent: 80, rotate: 4, autoAlpha: 0, stagger: 0.06, duration: 0.6, ease: 'power3.out' }, '<0.15')
        .from(el.querySelector('[data-rule]'), { scaleX: 0, transformOrigin: 'left center', duration: 0.8, ease: 'power2.inOut' }, '<0.2')
    })
    return () => mm.revert()
  })

  return (
    <section id="playground" ref={root} className="relative bg-cream px-4 pb-32 pt-24 text-charcoal sm:px-8 lg:px-[4vw] lg:pb-44">
      <p className="overflow-hidden text-sm text-charcoal/60 sm:text-base">
        <span data-next className="inline-block italic">
          What&rsquo;s next?
        </span>
      </p>
      <a
        href={site.playgroundHref}
        className="group mt-4 inline-flex flex-wrap items-baseline gap-x-[0.25em] font-display text-[11vw] font-bold leading-[0.95] tracking-[-0.035em] lg:text-[6.4vw]"
      >
        <span aria-hidden="true">
          <SplitText text="A detour through the" by="words" wordClassName="pb-[0.1em]" />{' '}
          <span className="word inline-block pb-[0.1em] font-sans font-medium italic">Playground</span>
        </span>
        <span className="sr-only">A detour through the Playground</span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-[0.7em] translate-y-[0.08em] transition-transform duration-500 ease-out-expo group-hover:-translate-y-[0.05em] group-hover:translate-x-[0.12em] group-hover:text-forest"
          strokeWidth={2.2}
        />
      </a>
      <span data-rule aria-hidden="true" className="mt-10 block h-px w-full bg-charcoal/20" />
    </section>
  )
}
