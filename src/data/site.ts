/**
 * Personal details and destinations. Replace these with your own.
 * Contact links left empty render as inert "coming soon" items instead of dead links.
 */
export const site = {
  name: 'jackdotsol',
  role: 'Web2 & Web3 Developer',
  tagline: 'I create experiences at the intersection of web2 and web3.',
  availability: {
    headline: 'Open to joining a creative team',
    detail: 'Apprenticeship · October 2026',
  },
  playgroundHref: '/playground/',
  legalHref: '/playground/#legal',
  contact: {
    x: 'https://x.com/chefthepreacher',
    github: 'https://github.com/not-a-vibe-coder',
    email: 'chukwupascal20@gmail.com',
  },
} as const

export type ContactKey = keyof typeof site.contact

export const exploreLinks = [
  { label: 'Journey', href: '#journey' },
  { label: 'Toolkit', href: '#toolkit' },
  { label: 'Projects', href: '#projects' },
  { label: 'Playground', href: site.playgroundHref },
  { label: 'Contact', href: '#contact' },
]

export function contactHref(key: ContactKey): string | null {
  const value = site.contact[key]
  if (!value) return null
  return key === 'email' ? `mailto:${value}` : value
}
