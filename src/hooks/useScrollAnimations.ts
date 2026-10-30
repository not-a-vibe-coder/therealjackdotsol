import { type RefObject, useLayoutEffect } from 'react'
import { gsap } from '../lib/motion'

/**
 * Scopes a section's GSAP setup to its root element. Everything created inside
 * `setup` (tweens, timelines, ScrollTriggers, matchMedia) is reverted on unmount.
 */
export function useScrollAnimations<T extends HTMLElement>(
  scope: RefObject<T | null>,
  setup: (root: T, ctx: gsap.Context) => void | (() => void),
) {
  useLayoutEffect(() => {
    const root = scope.current
    if (!root) return
    const ctx = gsap.context((self) => setup(root, self), root)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
