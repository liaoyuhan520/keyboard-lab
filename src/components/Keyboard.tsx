import type { CSSProperties } from 'react'
import {
  ARROW_BOTTOM_KEYS,
  ARROW_TOP_KEYS,
  BOTTOM_MAIN_KEYS,
  BOTTOM_ROW,
  FUNCTION_ROW,
  HOME_ROW,
  NUMBER_ROW,
  QWERTY_ROW,
  type KeyDef,
} from '../data/keyboard'
import { Keycap } from './Keycap'
import { PowerGlyph } from './KeyboardGlyphs'

interface KeyboardProps {
  readonly activeCodes: ReadonlySet<string>
}

const keyFlexStyle = (key: KeyDef): CSSProperties => ({
  flexGrow: key.width ?? 1,
  flexBasis: 0,
})

function KeyRow({
  keys,
  activeCodes,
  className,
}: {
  keys: readonly KeyDef[]
  activeCodes: ReadonlySet<string>
  className: string
}) {
  return (
    <div className={`key-row ${className}`}>
      {keys.map((key) => (
        <Keycap
          key={key.code}
          definition={key}
          active={activeCodes.has(key.code)}
          style={keyFlexStyle(key)}
        />
      ))}
    </div>
  )
}

export function Keyboard({ activeCodes }: KeyboardProps) {
  return (
    <div
      className="keyboard-shell"
      role="img"
      aria-label="82 键 75% 紧凑键盘，按键会随真实输入高亮"
    >
      <div className="keyboard-rail">
        <div className="keyboard-rail__brand">
          <span>COMPACT 75% / 82 KEYS</span>
          <span className="keyboard-rail__divider" />
          <span>FN LAYER · F1–F11</span>
        </div>
        <div className="keyboard-rail__status">
          <span className="rail-led">
            <span className="rail-led__dot rail-led__dot--cyan" />
            DEMO
          </span>
          <span className="rail-led">
            <span className="rail-led__dot rail-led__dot--green" />
            LIVE
          </span>
          <span className="power-button" aria-hidden="true">
            <PowerGlyph />
          </span>
        </div>
      </div>

      <div className="keyboard-rows">
        <KeyRow
          keys={FUNCTION_ROW}
          activeCodes={activeCodes}
          className="key-row--function"
        />
        <KeyRow
          keys={NUMBER_ROW}
          activeCodes={activeCodes}
          className="key-row--main"
        />
        <KeyRow
          keys={QWERTY_ROW}
          activeCodes={activeCodes}
          className="key-row--main"
        />
        <KeyRow
          keys={HOME_ROW}
          activeCodes={activeCodes}
          className="key-row--main"
        />
        <KeyRow
          keys={BOTTOM_ROW}
          activeCodes={activeCodes}
          className="key-row--main"
        />

        <div className="key-row key-row--main">
          <div className="keyboard-bottom-main">
            {BOTTOM_MAIN_KEYS.map((key) => (
              <Keycap
                key={key.code}
                definition={key}
                active={activeCodes.has(key.code)}
                style={keyFlexStyle(key)}
              />
            ))}
          </div>
          <div className="keyboard-arrow-group">
            {ARROW_TOP_KEYS.map((key) => (
              <Keycap
                key={key.code}
                definition={key}
                active={activeCodes.has(key.code)}
                style={keyFlexStyle(key)}
              />
            ))}
          </div>
        </div>

        <div className="key-row key-row--lower">
          <div className="keyboard-lower-spacer" />
          <div className="keyboard-arrow-group">
            {ARROW_BOTTOM_KEYS.map((key) => (
              <Keycap
                key={key.code}
                definition={key}
                active={activeCodes.has(key.code)}
                style={keyFlexStyle(key)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
