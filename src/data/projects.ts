export type ProjectVisualKind = 'ghibli' | 'mirage' | 'pulse' | 'ornate' | 'mae'

export interface Project {
  slug: string
  title: string
  year?: string
  discipline: string
  /** Live site or case-study URL. Without it the title acts as an in-page preview toggle. */
  href?: string
  /** Preview image in /public (e.g. /projects/veil.webp). Falls back to a generated visual. */
  image?: string
  visual?: ProjectVisualKind
  italic: boolean
  /** Desktop composition: position (% of stage), type scale (vw) and resting tilt. */
  layout: { x: number; y: number; size: number; rotate: number; thumb: 'left' | 'right' }
}

// Projects and screenshots from github.com/not-a-vibe-coder/jackdotsol (jackdotsol.vercel.app).
export const projects: Project[] = [
  {
    slug: 'veil-sdk',
    title: 'Veil SDK',
    discipline: 'Open Source',
    href: 'https://veil-sdk-docs-site.vercel.app',
    image: '/projects/veil.webp',
    italic: true,
    layout: { x: 8, y: 4, size: 6.4, rotate: -2, thumb: 'right' },
  },
  {
    slug: 'arciumhyde',
    title: 'ArciumHyde',
    discipline: 'Privacy Infra',
    href: 'https://arcium-hyde.vercel.app',
    image: '/projects/arcium.webp',
    italic: false,
    layout: { x: 52, y: 16, size: 7.6, rotate: 1.5, thumb: 'left' },
  },
  {
    slug: 'chekd',
    title: 'Chëkd',
    discipline: 'Fintech',
    href: 'https://chekdfinance.vercel.app',
    image: '/projects/chekd.webp',
    italic: true,
    layout: { x: 16, y: 30, size: 7.2, rotate: 1, thumb: 'right' },
  },
  {
    slug: 'kikx',
    title: 'KIKX',
    discipline: 'E-Commerce',
    href: 'https://kikx-tan.vercel.app',
    image: '/projects/kikx.webp',
    italic: false,
    layout: { x: 62, y: 43, size: 8.2, rotate: -1.5, thumb: 'left' },
  },
  {
    slug: 'betha-capsule',
    title: 'Betha Capsule',
    discipline: 'Web App',
    href: 'https://bethacapsule.vercel.app',
    image: '/projects/betha.webp',
    italic: true,
    layout: { x: 6, y: 56, size: 6.2, rotate: 2, thumb: 'right' },
  },
  {
    slug: 'social-spark',
    title: 'Social Spark',
    discipline: 'AI Tool',
    href: 'https://social-agent-fawn.vercel.app',
    image: '/projects/social-agent.webp',
    italic: false,
    layout: { x: 44, y: 70, size: 6.8, rotate: -1, thumb: 'left' },
  },
  {
    slug: 'alinea',
    title: 'Alinea',
    discipline: 'Hospitality',
    href: 'https://alinea-amber.vercel.app',
    image: '/projects/alinea.webp',
    italic: true,
    layout: { x: 14, y: 84, size: 7, rotate: 1.5, thumb: 'right' },
  },
]
