import Lenis from 'lenis'
import { useEffect } from 'react'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../lib/motion'

let instance: Lenis | null = null

export const getLenis = () => instance

/** Smooth scrolling driven by GSAP's ticker so ScrollTrigger and Lenis share one clock. */
export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), touchMultiplier: 1.4 })
    instance = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      instance = null
    }
  }, [])
}

/** Scroll to an in-page hash through Lenis when available, natively otherwise. */
export function scrollToHash(hash: string) {
  const target = document.querySelector<HTMLElement>(hash)
  if (!target) return false
  const lenis = getLenis()
  if (lenis) lenis.scrollTo(target, { duration: 1.6 })
  else target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  history.replaceState(null, '', hash)
  return true
}
