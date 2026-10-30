interface Props {
  variant: 'bridge' | 'footer'
  className?: string
}

/** Slow-drifting, film-grained colour field. Pure CSS so it is cheap to duplicate. */
export function GrainGradient({ variant, className = '' }: Props) {
  return (
    <div aria-hidden="true" className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="grain-gradient" data-variant={variant} />
      <div className="grain" />
    </div>
  )
}
