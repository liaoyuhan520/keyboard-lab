import type { CSSProperties } from 'react'
import type { KeyDef } from '../data/keyboard'
import {
  ArrowGlyph,
  CopilotMark,
  FunctionGlyph,
  WindowsMark,
} from './KeyboardGlyphs'

interface KeycapProps {
  readonly definition: KeyDef
  readonly active: boolean
  readonly style?: CSSProperties
}

const kindClassNames: Record<NonNullable<KeyDef['kind']>, string> = {
  normal: 'keycap--normal',
  modifier: 'keycap--modifier',
  function: 'keycap--function',
  nav: 'keycap--nav',
  arrow: 'keycap--arrow',
}

export function Keycap({ definition, active, style }: KeycapProps) {
  const kind = definition.kind ?? 'normal'
  const isFunction = kind === 'function'
  const isNav = kind === 'nav' || kind === 'arrow'
  const defaultLabelSize = isFunction ? 9.5 : isNav ? 10.5 : 21

  let content = null

  if (definition.arrowDirection) {
    content = <ArrowGlyph direction={definition.arrowDirection} />
  } else if (definition.icon === 'win') {
    content = <WindowsMark size={16} />
  } else if (definition.icon === 'copilot') {
    content = <CopilotMark size={19} />
  } else if (definition.functionIcon) {
    content = (
      <span className="keycap__stack keycap__stack--compact">
        <FunctionGlyph
          kind={definition.functionIcon}
          size={definition.hintLabel ? 11 : 13.5}
        />
        <span
          className="keycap__label"
          style={{ fontSize: definition.fontSize ?? 9.2 }}
        >
          {definition.label}
        </span>
        {definition.hintLabel ? (
          <span className="keycap__hint">{definition.hintLabel}</span>
        ) : null}
      </span>
    )
  } else if (definition.hintLabel) {
    content = (
      <span className="keycap__stack">
        <span
          className="keycap__label"
          style={{ fontSize: definition.fontSize ?? 10.5 }}
        >
          {definition.label}
        </span>
        <span className="keycap__hint">{definition.hintLabel}</span>
      </span>
    )
  } else if (definition.subLabel) {
    content = (
      <span className="keycap__stack">
        <span className="keycap__sub">{definition.subLabel}</span>
        <span className="keycap__label keycap__label--symbol">
          {definition.label}
        </span>
      </span>
    )
  } else if (definition.label) {
    content = (
      <span
        className="keycap__label"
        style={{ fontSize: definition.fontSize ?? defaultLabelSize }}
      >
        {definition.label}
      </span>
    )
  }

  return (
    <div
      className={[
        'keycap',
        kindClassNames[kind],
        active ? 'is-active' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      aria-hidden="true"
    >
      <span className="keycap__sheen" />
      {content}
    </div>
  )
}
