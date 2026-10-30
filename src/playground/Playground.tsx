import { ArrowLeft } from 'lucide-react'
import { site } from '../data/site'

/** Placeholder destination for experiments. Replace the entries with real studies as they ship. */
const experiments = [
  { title: 'Noise field', note: 'GLSL · fbm study', bg: 'linear-gradient(135deg,#ccff00,#00c805 55%,#a3a69f)' },
  { title: 'Kinetic type', note: 'GSAP · split letters', bg: '#1E1D1D' },
  { title: 'Soft bodies', note: 'Three.js · physics', bg: 'radial-gradient(circle at 30% 30%,#e9ff8a,#00c805 70%)' },
  { title: 'Grain shader', note: 'GLSL · film emulation', bg: 'linear-gradient(160deg,#a3a69f,#1e1d1d)' },
]

export function Playground() {
  return (
    <div className="min-h-svh bg-cream px-4 pb-16 pt-6 text-charcoal sm:px-8 lg:px-[4vw]">
      <a href="/" className="inline-flex items-center gap-2 text-sm font-medium hover:underline">
        <ArrowLeft size={16} aria-hidden="true" /> Back to {site.name}
      </a>
      <main>
        <h1 className="mt-16 font-display text-[18vw] font-bold leading-[0.85] tracking-[-0.045em] lg:text-[11vw]">Playground</h1>
        <p className="mt-4 max-w-[40ch] text-sm text-charcoal/70">
          A drawer of experiments, sketches and unfinished ideas. New studies land here first.
        </p>
        <ul className="mt-14 grid gap-4 sm:grid-cols-2">
          {experiments.map((x, i) => (
            <li key={x.title} className="relative overflow-hidden rounded-[14px]" style={{ rotate: `${(i % 2 ? 1 : -1) * 0.6}deg` }}>
              <div className="relative aspect-[16/10]" style={{ background: x.bg }}>
                <div className="grain" />
              </div>
              <div className="flex items-baseline justify-between py-3">
                <span className="font-display text-xl font-bold">{x.title}</span>
                <span className="text-xs italic text-charcoal/60">{x.note} · coming soon</span>
              </div>
            </li>
          ))}
        </ul>
        <section id="legal" className="mt-24 max-w-[60ch] border-t border-charcoal/20 pt-6 text-xs text-charcoal/70">
          <h2 className="mb-2 text-sm font-medium text-charcoal">Legal notice</h2>
          <p>
            Publisher, hosting provider and contact details go here. Edit <code>src/playground/Playground.tsx</code> or point{' '}
            <code>site.legalHref</code> in <code>src/data/site.ts</code> to a dedicated page.
          </p>
        </section>
      </main>
    </div>
  )
}
