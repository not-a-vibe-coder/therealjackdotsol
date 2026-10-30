import { useEffect, useRef, useState } from 'react'
import { site } from '../data/site'
import { useScrollAnimations } from '../hooks/useScrollAnimations'
import type { HeroScene } from '../lib/heroScene'
import { gsap, mq, prefersReducedMotion } from '../lib/motion'

export function Hero3D() {
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [glReady, setGlReady] = useState(false)

  // Lazy-load Three.js once the page is idle so the hero never blocks first paint.
  useEffect(() => {
    let scene: HeroScene | null = null
    let cancelled = false
    const el = canvas.current
    if (!el) return

    const boot = async () => {
      try {
        const { createHeroScene } = await import('../lib/heroScene')
        if (cancelled) return
        const lowPower = window.matchMedia('(max-width: 767px)').matches || (navigator.hardwareConcurrency ?? 8) <= 4
        scene = createHeroScene({ canvas: el, reducedMotion: prefersReducedMotion(), lowPower })
        setGlReady(true)
      } catch {
        // WebGL unavailable: the CSS orb stays visible.
      }
    }
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200))
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout
    const handle = idle(() => void boot())

    const onPointer = (e: PointerEvent) => {
      scene?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    const io = new IntersectionObserver(([entry]) => scene?.setActive(entry.isIntersecting))
    io.observe(el)
    const onVisibility = () => scene?.setActive(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelled = true
      cancelIdle(handle as number)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVisibility)
      io.disconnect()
      scene?.destroy()
    }
  }, [])

  useScrollAnimations(root, (el) => {
    const frame = el.querySelector('[data-hero-frame]')
    const object = el.querySelector('[data-hero-object]')
    const utility = el.querySelector('[data-hero-utilities]')

    // Entrance runs on inner elements so it never fights the scrubbed timeline below.
    gsap.from(el.querySelectorAll('[data-hero-utility]'), { autoAlpha: 0, y: 14, duration: 1.2, stagger: 0.08, ease: 'expo.out', delay: 0.2 })
    gsap.from(el.querySelector('[data-hero-intro]'), { scale: 0.6, autoAlpha: 0, duration: 2, ease: 'expo.out' })

    const mm = gsap.matchMedia()
    mm.add(mq.motion, () => {
      // The gradient world contracts into a framed window, then lifts away to reveal the cream page.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top top', end: '+=90%', scrub: 0.8, pin: true, invalidateOnRefresh: true },
      })
      tl.to(utility, { autoAlpha: 0, y: -20, duration: 0.25 }, 0)
        .fromTo(
          frame,
          { clipPath: 'inset(0% 0% 0% 0% round 0px)' },
          {
            // Contract to a near-square window whatever the viewport shape.
            clipPath: () => (innerWidth / innerHeight < 1 ? 'inset(30% 12% 30% 12% round 22px)' : 'inset(24% 34% 24% 34% round 28px)'),
            ease: 'power2.inOut',
            duration: 0.7,
          },
          0,
        )
        .to(object, { scale: 0.75, ease: 'power2.inOut', duration: 0.7 }, 0)
        .to(frame, { rotate: -3, yPercent: -8, ease: 'power1.in', duration: 0.3 }, 0.7)
    })
    return () => mm.revert()
  })

  return (
    <section id="hero" ref={root} className="relative h-svh overflow-hidden bg-cream" aria-label="Introduction">
      <div data-hero-frame className="absolute inset-0 will-change-[clip-path]">
        <div className="gradient-field" style={{ background: '#5fd61c' }}>
          <span className="blob" style={{ width: '70vmax', height: '70vmax', left: '-20vmax', top: '-25vmax', background: '#ccff00' }} />
          <span className="blob" style={{ width: '60vmax', height: '60vmax', right: '-18vmax', top: '-10vmax', background: '#a3a69f', animationDelay: '-6s' }} />
          <span className="blob" style={{ width: '55vmax', height: '55vmax', left: '20vmax', bottom: '-30vmax', background: '#00c805', animationDelay: '-12s', animationDuration: '28s' }} />
          <span className="blob" style={{ width: '30vmax', height: '30vmax', left: '38vw', top: '22vh', background: '#e4e6e0', opacity: 0.7, animationDelay: '-3s', animationDuration: '18s' }} />
        </div>
        <div className="grain" />

        <div data-hero-object className="absolute inset-0">
          <div data-hero-intro className="absolute inset-0 grid place-items-center">
          {/* Soft contact shadow under the object */}
          <div className="absolute top-[64%] h-[4vmin] w-[22vmin] rounded-[50%] bg-charcoal/40 blur-xl" aria-hidden="true" />
          {/* CSS fallback orb, shown until WebGL is ready (or forever if it never is) */}
          <div
            aria-hidden="true"
            className="absolute h-[22vmin] w-[22vmin] rounded-full transition-opacity duration-1000"
            style={{
              opacity: glReady ? 0 : 1,
              background: 'radial-gradient(circle at 32% 28%, #ffffff 0%, #f5e7df 30%, #c9ccc6 62%, #5c5f5b 100%)',
              boxShadow: 'inset -1.5vmin -2vmin 4vmin rgba(30,29,29,.25)',
            }}
          />
          <canvas
            ref={canvas}
            className="h-full w-full transition-opacity duration-1000"
            style={{ opacity: glReady ? 1 : 0 }}
            aria-hidden="true"
          />
          </div>
        </div>

        <div data-hero-utilities className="pointer-events-none absolute inset-0 p-5 text-[11px] leading-tight tracking-wide text-charcoal sm:p-8 sm:text-xs">
          <p data-hero-utility className="absolute left-5 top-5 font-medium sm:left-8 sm:top-8">
            {site.name}
          </p>
          <p data-hero-utility className="absolute right-5 top-5 max-w-[14ch] text-right sm:right-8 sm:top-8">
            {site.role}
          </p>
          <p data-hero-utility className="absolute bottom-5 left-5 italic sm:bottom-8 sm:left-8">
            fig. 01 — object in study
          </p>
          <p data-hero-utility className="absolute bottom-5 right-5 flex items-center gap-2 sm:bottom-8 sm:right-8">
            <span className="inline-block h-px w-8 bg-charcoal/70" /> scroll
          </p>
        </div>
        <h1 className="sr-only">
          {site.name} — {site.role}
        </h1>
      </div>
    </section>
  )
}
