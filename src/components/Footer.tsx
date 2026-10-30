import { GitHubIcon, MailIcon, type SocialLink, SocialCard, XIcon } from '@/components/ui/social-card'
import { contactHref, exploreLinks, site } from '../data/site'
import { onAnchorClick } from '../lib/anchors'
import { GrainGradient } from './GrainGradient'

const linkCls =
  'group inline-flex items-center gap-1 text-sm font-medium transition-[gap,opacity] duration-300 hover:gap-2 sm:text-base'

const year = new Date().getFullYear()

// Largest arc first; the boxes fan out of the corner in this order.
const socialLinks: SocialLink[] = [
  { href: contactHref('github')!, label: 'GitHub', icon: <GitHubIcon />, className: 'box1' },
  { href: contactHref('x')!, label: 'X (Twitter)', icon: <XIcon />, className: 'box2', delay: '0.2s' },
  { href: contactHref('email')!, label: 'Email', icon: <MailIcon />, className: 'box3', delay: '0.4s' },
]

export function Footer() {
  return (
    <footer id="contact" className="relative bg-charcoal px-2 pb-2 sm:px-3 sm:pb-3">
      <div
        className="relative isolate overflow-hidden px-5 pb-6 pt-14 text-charcoal sm:px-10 sm:pt-20 lg:px-[4vw]"
        style={{ borderRadius: 'clamp(28px,5vw,80px) clamp(28px,5vw,80px) clamp(18px,2.2vw,36px) clamp(18px,2.2vw,36px) / clamp(28px,6vw,96px) clamp(28px,4vw,64px) clamp(18px,2.2vw,36px) clamp(18px,2.2vw,36px)' }}
      >
        <GrainGradient variant="footer" className="-z-10" />

        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
          <div>
            <p className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-charcoal/60 motion-reduce:animate-none" />
                <span className="relative size-2 rounded-full bg-charcoal" />
              </span>
              Availability
            </p>
            <p className="max-w-[14ch] font-display text-[11vw] font-bold leading-[0.92] tracking-[-0.035em] sm:text-[7vw] lg:text-[4.6vw]">
              {site.availability.headline}
            </p>
            <p className="mt-5 text-base font-medium italic sm:text-lg">{site.availability.detail}</p>
          </div>

          <nav aria-label="Footer" className="grid gap-8 self-end rounded-[22px] sm:grid-cols-2 bg-cream/85 p-6 sm:p-8">
            <div>
              <h3 className="mb-4 text-xs uppercase tracking-[0.2em] opacity-70">Explore</h3>
              <ul className="flex flex-col gap-2">
                {exploreLinks.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} onClick={onAnchorClick} className={linkCls}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs uppercase tracking-[0.2em] opacity-70">Contact</h3>
              <SocialCard title="Socials" socialLinks={socialLinks} />
              <p className="mt-3 text-[11px] italic opacity-60">hover or tab to open</p>
            </div>
          </nav>
        </div>

        <div className="mt-16 flex flex-col-reverse justify-between gap-3 border-t border-charcoal/20 pt-5 text-[11px] sm:flex-row sm:text-xs">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <a href={site.legalHref} className="underline-offset-4 hover:underline">
            Legal notice
          </a>
        </div>
      </div>
    </footer>
  )
}
