import {
  KEYBOARD_HEIGHT,
  KEYBOARD_WIDTH,
} from '../data/keyboard'
import { useFitScale } from '../hooks/useFitScale'
import { Keyboard } from './Keyboard'

interface KeyboardStageProps {
  readonly activeCodes: ReadonlySet<string>
}

export function KeyboardStage({ activeCodes }: KeyboardStageProps) {
  const { containerRef, scale } = useFitScale(KEYBOARD_WIDTH)

  return (
    <div
      className="keyboard-stage"
      ref={containerRef}
      style={{ height: KEYBOARD_HEIGHT * scale }}
    >
      <div
        className="keyboard-stage__inner"
        style={{
          width: KEYBOARD_WIDTH,
          height: KEYBOARD_HEIGHT,
          transform: `translateX(-50%) scale(${scale})`,
        }}
      >
        <Keyboard activeCodes={activeCodes} />
      </div>
    </div>
  )
}
