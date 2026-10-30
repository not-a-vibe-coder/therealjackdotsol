import type { ReactNode } from 'react'
import type { Project, ProjectVisualKind } from '../data/projects'

/**
 * Original placeholder art for each project. Pass `project.image` to swap in a
 * real preview; the generated composition is used only when no image is set.
 */
export function ProjectVisual({ project, className = '' }: { project: Project; className?: string }) {
  if (project.image) {
    return <img src={project.image} alt={`${project.title} — site preview`} loading="lazy" decoding="async" className={`h-full w-full object-cover object-top ${className}`} />
  }
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={`h-full w-full ${className}`} role="img" aria-label={`${project.title} — preview artwork`}>
      {art[project.visual ?? 'pulse'](project.slug)}
    </svg>
  )
}

const art: Record<ProjectVisualKind, (id: string) => ReactNode> = {
  ghibli: (id) => (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fb7e8" />
          <stop offset=".65" stopColor="#f6d7c3" />
          <stop offset="1" stopColor="#f5e7df" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${id}-sky)`} />
      {[
        [80, 90, 1],
        [250, 60, 1.4],
        [330, 130, 0.8],
      ].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity=".92">
          <circle cx="0" cy="0" r="22" />
          <circle cx="24" cy="-10" r="28" />
          <circle cx="52" cy="2" r="20" />
          <rect x="-4" y="0" width="60" height="20" rx="10" />
        </g>
      ))}
      <path d="M0 230 C70 200 120 215 190 205 S320 180 400 210 V300 H0Z" fill="#5f9e6e" />
      <path d="M0 255 C90 235 170 250 250 240 S360 230 400 245 V300 H0Z" fill="#3f7a52" />
      <circle cx="300" cy="226" r="16" fill="#1e1d1d" />
      <rect x="296" y="236" width="8" height="20" fill="#1e1d1d" />
    </>
  ),
  mirage: (id) => (
    <>
      <defs>
        <linearGradient id={`${id}-sun`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb59a" />
          <stop offset="1" stopColor="#fe3303" />
        </linearGradient>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8551f5" />
          <stop offset="1" stopColor="#f5a07a" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${id}-sky)`} />
      <circle cx="200" cy="170" r="70" fill={`url(#${id}-sun)`} />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x="120" y={150 + i * 9} width="160" height={2 + i * 0.6} fill="#f5a07a" opacity=".85" />
      ))}
      <path d="M0 220 Q100 180 200 215 T400 205 V300 H0Z" fill="#c4581f" />
      <path d="M0 250 Q120 225 230 250 T400 240 V300 H0Z" fill="#8e3410" />
    </>
  ),
  pulse: () => (
    <>
      <rect width="400" height="300" fill="#1e1d1d" />
      {Array.from({ length: 9 }).map((_, i) => (
        <circle key={i} cx="200" cy="150" r={18 + i * 22} fill="none" stroke={i % 3 === 0 ? '#fe3303' : i % 3 === 1 ? '#ff7b00' : '#c344b5'} strokeWidth={10 - i} opacity={1 - i * 0.08} />
      ))}
      <text x="24" y="276" fontFamily="Cabinet Grotesk, sans-serif" fontWeight="800" fontSize="34" fill="#f5e7df" letterSpacing="-1">
        PULSE
      </text>
      <text x="376" y="276" textAnchor="end" fontFamily="Satoshi, sans-serif" fontSize="12" fill="#f5e7df" opacity=".7">
        08—10.07
      </text>
    </>
  ),
  ornate: (id) => (
    <>
      <defs>
        <pattern id={`${id}-p`} width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="50" height="50" fill="#f5e7df" />
          <path d="M25 4 C33 16 33 34 25 46 C17 34 17 16 25 4Z M4 25 C16 17 34 17 46 25 C34 33 16 33 4 25Z" fill="none" stroke="#8a5a2b" strokeWidth="1.4" />
          <circle cx="25" cy="25" r="3" fill="#c344b5" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill={`url(#${id}-p)`} />
      <rect x="120" y="60" width="160" height="180" rx="80" fill="#1e1d1d" />
      <rect x="140" y="80" width="120" height="140" rx="60" fill="none" stroke="#e2b36c" strokeWidth="2" />
      <text x="200" y="158" textAnchor="middle" fontFamily="Satoshi, sans-serif" fontStyle="italic" fontSize="26" fill="#f5e7df">
        ornate
      </text>
    </>
  ),
  mae: () => (
    <>
      <rect width="400" height="300" fill="#efd9cc" />
      <rect x="40" y="40" width="150" height="220" fill="#c344b5" />
      <circle cx="270" cy="120" r="70" fill="#ff7b00" />
      <rect x="215" y="200" width="150" height="10" fill="#1e1d1d" />
      <rect x="215" y="222" width="100" height="10" fill="#1e1d1d" opacity=".5" />
      <text x="58" y="240" fontFamily="Cabinet Grotesk, sans-serif" fontWeight="800" fontSize="46" fill="#f5e7df">
        maë
      </text>
    </>
  ),
}
