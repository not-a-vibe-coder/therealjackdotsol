import type { Tool } from '../data/toolkit'

const wordmark = 'font-display font-extrabold leading-none tracking-[-0.03em]'

/** Simplified, hand-drawn marks — tinted from the card's own palette. */
export function ToolMark({ tool }: { tool: Tool }) {
  const { fg, glyph, mark, name } = tool
  switch (mark) {
    case 'react':
      return (
        <svg viewBox="-12 -12 24 24" className="h-[46%] w-[46%]" fill="none" stroke={fg} strokeWidth="1">
          {[0, 60, 120].map((r) => (
            <ellipse key={r} rx="11" ry="4.2" transform={`rotate(${r})`} />
          ))}
          <circle r="2" fill={fg} stroke="none" />
        </svg>
      )
    case 'github':
      return (
        <svg viewBox="0 0 24 24" className="h-[44%] w-[44%]" fill={fg}>
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      )
    case 'tile':
      return (
        <span className="relative grid aspect-square w-[52%] place-items-end rounded-[10%] p-[8%]" style={{ border: `3px solid ${fg}` }}>
          <span className={`${wordmark} text-[clamp(1.6rem,3vw,3.2rem)]`} style={{ color: fg }}>
            {glyph}
          </span>
        </span>
      )
    case 'solana':
      return (
        <svg viewBox="0 0 100 80" className="h-[34%] w-[50%]">
          <defs>
            <linearGradient id="sol-g" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#9945FF" />
              <stop offset="1" stopColor="#14F195" />
            </linearGradient>
          </defs>
          <g fill="url(#sol-g)">
            <path d="M18 0h82L82 18H0Z" />
            <path d="M0 31h82l18 18H18Z" />
            <path d="M18 62h82L82 80H0Z" />
          </g>
        </svg>
      )
    case 'base':
      return (
        <svg viewBox="0 0 100 100" className="h-[44%] w-[44%]">
          <circle cx="50" cy="50" r="50" fill={fg} />
          <rect x="-2" y="45" width="62" height="10" fill={tool.bg} />
        </svg>
      )
    case 'ethereum':
      return (
        <svg viewBox="0 0 60 98" className="h-[46%] w-[30%]" fill={fg}>
          <path d="M30 0 0 50l30 18 30-18Z" opacity=".85" />
          <path d="M30 0v68l30-18Z" opacity=".55" />
          <path d="M0 56l30 42 30-42-30 18Z" opacity=".85" />
          <path d="M30 74v24l30-42Z" opacity=".55" />
        </svg>
      )
    case 'solidity':
      return (
        <svg viewBox="0 0 60 100" className="h-[48%] w-[30%]" fill={fg}>
          <path d="M30 0 15 26H45Z" opacity=".45" />
          <path d="M15 26 0 52l15 26 15-26Z" opacity=".8" />
          <path d="M45 26 30 52l15 26 15-26Z" opacity=".6" />
          <path d="M15 78h30L30 100Z" opacity=".45" />
          <path d="M15 26h30L30 52Z" />
          <path d="M15 78h30L30 52Z" />
        </svg>
      )
    case 'bnb':
      return (
        <svg viewBox="0 0 100 100" className="h-[46%] w-[46%]" fill={fg}>
          <path d="M50 6 66 22 50 38 34 22Z" />
          <path d="M22 34 38 50 22 66 6 50Z" />
          <path d="M78 34 94 50 78 66 62 50Z" />
          <path d="M50 62 66 78 50 94 34 78Z" />
          <path d="M50 40 60 50 50 60 40 50Z" />
        </svg>
      )
    case 'claude':
      return (
        <svg viewBox="-50 -50 100 100" className="h-[46%] w-[46%]" fill={fg}>
          {Array.from({ length: 11 }).map((_, i) => (
            <rect key={i} x="-4.5" y="-46" width="9" height="40" rx="4.5" transform={`rotate(${i * (360 / 11) + (i % 2) * 6})`} />
          ))}
        </svg>
      )
    case 'gemini':
      return (
        <svg viewBox="0 0 100 100" className="h-[46%] w-[46%]">
          <defs>
            <linearGradient id="gem-g" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#4285F4" />
              <stop offset=".6" stopColor="#9B72CB" />
              <stop offset="1" stopColor="#D96570" />
            </linearGradient>
          </defs>
          <path d="M50 0C53 27 73 47 100 50 73 53 53 73 50 100 47 73 27 53 0 50 27 47 47 27 50 0Z" fill="url(#gem-g)" />
        </svg>
      )
    default:
      return (
        <span className={`${wordmark} px-3 text-center ${glyph.length > 8 ? 'text-[clamp(0.95rem,1.6vw,1.75rem)]' : glyph.length > 6 ? 'text-[clamp(1.1rem,2.1vw,2.3rem)]' : 'text-[clamp(1.5rem,3.2vw,3.6rem)]'}`} style={{ color: fg }} aria-label={name}>
          {glyph}
        </span>
      )
  }
}
