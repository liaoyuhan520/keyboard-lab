import type { PopupData } from '../data/shortcuts'
import { DEMO_TOTAL_STEPS } from '../data/demoTimeline'
import { KeyTokens } from './KeyTokens'

interface PopupCardProps {
  readonly data: PopupData
  readonly source: 'live' | 'demo'
  readonly stepNumber?: number
}

const padTwo = (value: number): string =>
  value < 10 ? `0${value}` : String(value)

export function PopupCard({ data, source, stepNumber }: PopupCardProps) {
  const sourceLabel =
    source === 'demo'
      ? `SCRIPTED DEMO · STEP ${padTwo(stepNumber ?? 1)} / ${DEMO_TOTAL_STEPS}`
      : 'LIVE INPUT · REAL KEYBOARD'

  return (
    <article className="popup-card">
      <span className="popup-card__accent" aria-hidden="true" />
      <div className="popup-card__meta">
        <span className="popup-card__kicker">
          <span
            className={`status-dot ${
              source === 'demo' ? 'status-dot--cyan' : 'status-dot--green'
            }`}
          />
          {data.kicker}
        </span>
        <span className={`source-chip source-chip--${source}`}>
          {sourceLabel}
        </span>
      </div>

      <div className="popup-card__title-row">
        <h2 className="popup-card__title">{data.title}</h2>
        <KeyTokens
          tokens={data.tokens}
          separator={data.separator ?? 'plus'}
        />
      </div>

      <p className="popup-card__description">{data.description}</p>
      {data.tip ? <p className="popup-card__tip">{data.tip}</p> : null}

      <span className="popup-card__timer" aria-hidden="true" />
    </article>
  )
}
