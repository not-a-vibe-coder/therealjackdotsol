import { gsap } from './motion'

interface BridgeWindow {
  top: number
  bottom: number
  /** Left window's right edge and right window's left edge, in % of stage width. */
  left: number
  right: number
  radius: number
}

/**
 * Appends the bridge choreography to the journey timeline and returns the
 * painter, which the caller runs on every timeline update (scrubbing both ways).
 * `line` is the untransformed "I bridge" row, `word` the moving text inside it.
 */
export function addBridgeTimeline(tl: gsap.core.Timeline, stage: HTMLElement, line: HTMLElement, word: HTMLElement) {
  const left = stage.querySelector<HTMLElement>('[data-bridge-panel="left"]')!
  const right = stage.querySelector<HTMLElement>('[data-bridge-panel="right"]')!
  const shell = stage.querySelector<HTMLElement>('[data-bridge-shell]')!
  const text = stage.querySelector<HTMLElement>('[data-bridge-text]')!

  // Geometry comes from layout and is re-read on refresh (function values + invalidateOnRefresh).
  const geo = () => {
    const s = stage.getBoundingClientRect()
    const l = line.getBoundingClientRect()
    const w = word.getBoundingClientRect()
    const gap = Math.max(14, l.height * 0.16)
    return {
      top: ((l.top - s.top) / s.height) * 100,
      bottom: ((l.bottom - s.top) / s.height) * 100,
      left: ((w.left - s.left - gap) / s.width) * 100,
      right: ((w.right - s.left + gap) / s.width) * 100,
    }
  }

  const win: BridgeWindow = { top: 50, bottom: 50, left: 0, right: 100, radius: 10 }
  const paint = () => {
    const r = `round ${win.radius}px`
    left.style.clipPath = `inset(${win.top}% ${100 - win.left}% ${100 - win.bottom}% 0% ${r})`
    right.style.clipPath = `inset(${win.top}% 0% ${100 - win.bottom}% ${win.right}% ${r})`
  }

  gsap.set(text, { yPercent: 110 })
  tl.set(win, { top: () => geo().top, bottom: () => geo().bottom, left: 0, right: 100, radius: 10 })
    .set(text, { yPercent: 110 })
    // Windows slide in from both edges, framing "I bridge".
    .to(win, { left: () => geo().left, right: () => geo().right, duration: 0.7, ease: 'power3.out' })
    // "I bridge" lifts; the windows close the gap beneath it and "the two." rises inside.
    .addLabel('merge', '+=0.2')
    .to(word, { y: () => -line.offsetHeight * 0.95, duration: 0.6, ease: 'power2.inOut' }, 'merge')
    .to(win, { left: 50, right: 50, radius: 6, duration: 0.6, ease: 'power2.inOut' }, 'merge')
    .to(text, { yPercent: 0, duration: 0.5, ease: 'power3.out' }, 'merge+=0.3')
    // Open into the full colour field.
    .addLabel('open', '+=0.25')
    .to(win, { top: 0, bottom: 100, left: 100, right: 0, radius: 0, duration: 0.8, ease: 'power3.inOut' }, 'open')
    .to(text, { scale: 1.08, duration: 0.8, ease: 'power2.inOut' }, 'open')
    // The words recede into the colour, then the field rounds off like a lifted card.
    .to(text, { color: 'rgba(30,29,29,0.18)', duration: 0.6, ease: 'none' }, '+=0.15')
    .to(shell, { scaleX: 0.975, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, duration: 0.4, ease: 'power2.out' }, '<0.2')

  paint()
  return paint
}
