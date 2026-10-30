import { Fragment } from 'react'

interface Props {
  text: string
  /** Split into characters (default) or keep words whole. */
  by?: 'chars' | 'words'
  wordClassName?: string
  charClassName?: string
}

/**
 * Renders text as word / character spans for animation while exposing the
 * intact string to assistive tech via aria-label on the parent.
 */
export function SplitText({ text, by = 'chars', wordClassName = '', charClassName = '' }: Props) {
  const words = text.split(' ')
  let charIndex = 0
  return (
    <>
      {words.map((word, w) => (
        <Fragment key={w}>
          <span aria-hidden="true" className={`word inline-block whitespace-nowrap ${wordClassName}`} data-word={w}>
            {by === 'words'
              ? word
              : [...word].map((ch) => (
                  <span key={charIndex} className={`char ${charClassName}`} data-char={charIndex++}>
                    {ch}
                  </span>
                ))}
          </span>
          {w < words.length - 1 && ' '}
        </Fragment>
      ))}
    </>
  )
}
