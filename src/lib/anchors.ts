import type { MouseEvent } from 'react'
import { scrollToHash } from '../hooks/useLenis'

/** Routes in-page hash links through Lenis so smooth scrolling and pins stay in sync. */
export function onAnchorClick(e: MouseEvent<HTMLAnchorElement>) {
  const href = e.currentTarget.getAttribute('href') ?? ''
  if (href.startsWith('#') && scrollToHash(href)) e.preventDefault()
}
