import { GrainGradient } from './GrainGradient'

/**
 * "the two." — two gradient windows slide in beside "I bridge", meet in the
 * middle and open into a full-bleed colour field. Rendered inside the journey
 * stage so the whole story shares one pinned timeline.
 */
export function GradientBridge() {
  return (
    <div className="beat beat-bridge flex items-center justify-center overflow-hidden bg-charcoal" data-bridge>
      <div data-bridge-shell className="absolute inset-0 overflow-hidden will-change-transform">
        <div data-bridge-panel="left" className="absolute inset-0">
          <GrainGradient variant="bridge" />
        </div>
        <div data-bridge-panel="right" className="absolute inset-0">
          <GrainGradient variant="bridge" />
        </div>
      </div>
      <p className="relative overflow-hidden px-4 py-[0.06em] font-display text-[12vw] font-bold leading-[0.95] tracking-[-0.035em] sm:text-[9vw] lg:text-[6.8vw]">
        <span data-bridge-text className="inline-block text-charcoal/90">
          the two.
        </span>
      </p>
    </div>
  )
}
