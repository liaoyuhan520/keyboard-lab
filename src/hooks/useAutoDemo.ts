import { useCallback, useEffect, useState } from 'react'
import {
  DEMO_END_FRAME,
  DEMO_FPS,
  DEMO_START_FRAME,
  getDemoImeChinese,
  getDemoKeysAtFrame,
  getDemoPopupAtFrame,
  getDemoStepNumberAtFrame,
  type DemoPopup,
} from '../data/demoTimeline'

interface UseAutoDemoResult {
  readonly isPlaying: boolean
  readonly frame: number
  readonly progress: number
  readonly stepNumber: number
  readonly activeCodes: ReadonlySet<string>
  readonly popup: DemoPopup | null
  readonly isChinese: boolean
  readonly startDemo: () => void
  readonly stopDemo: () => void
}

/**
 * 以 30fps 虚拟时钟回放 29 段演示。
 * 自动演示不依赖 Remotion，也不会写入用户按键历史。
 */
export const useAutoDemo = (): UseAutoDemoResult => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [frame, setFrame] = useState(DEMO_START_FRAME)

  const startDemo = useCallback((): void => {
    setFrame(DEMO_START_FRAME)
    setIsPlaying(true)
  }, [])

  const stopDemo = useCallback((): void => {
    setIsPlaying(false)
  }, [])

  useEffect(() => {
    if (!isPlaying) {
      return
    }

    let animationFrame = 0
    let lastWholeFrame = -1
    const startedAt = performance.now()

    const tick = (now: number): void => {
      const nextFrame =
        DEMO_START_FRAME + ((now - startedAt) / 1000) * DEMO_FPS

      if (nextFrame >= DEMO_END_FRAME) {
        setFrame(DEMO_END_FRAME)
        setIsPlaying(false)
        return
      }

      const wholeFrame = Math.floor(nextFrame)
      if (wholeFrame !== lastWholeFrame) {
        lastWholeFrame = wholeFrame
        setFrame(nextFrame)
      }

      animationFrame = window.requestAnimationFrame(tick)
    }

    animationFrame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [isPlaying])

  const activeCodes = isPlaying
    ? getDemoKeysAtFrame(frame)
    : new Set<string>()
  const popup = isPlaying ? getDemoPopupAtFrame(frame) : null
  const progress =
    (frame - DEMO_START_FRAME) / (DEMO_END_FRAME - DEMO_START_FRAME)

  return {
    isPlaying,
    frame,
    progress: Math.min(1, Math.max(0, progress)),
    stepNumber: getDemoStepNumberAtFrame(frame),
    activeCodes,
    popup,
    isChinese: getDemoImeChinese(frame),
    startDemo,
    stopDemo,
  }
}
