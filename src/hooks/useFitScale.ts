import { useEffect, useRef, useState, type RefObject } from 'react'

interface UseFitScaleResult {
  readonly containerRef: RefObject<HTMLDivElement | null>
  readonly scale: number
}

/**
 * 键盘内部始终按 1500 × 522 的设计坐标绘制，
 * 这里只计算一个不超过 1 的缩放比例，让它在任意容器宽度内完整显示。
 */
export const useFitScale = (designWidth: number): UseFitScaleResult => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const node = containerRef.current
    if (!node) {
      return
    }

    const applyWidth = (width: number): void => {
      if (width <= 0) {
        return
      }
      setScale(Math.min(1, width / designWidth))
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      applyWidth(entry?.contentRect.width ?? node.clientWidth)
    })

    observer.observe(node)
    return () => observer.disconnect()
  }, [designWidth])

  return { containerRef, scale }
}
