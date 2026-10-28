import { useCallback, useEffect, useRef, useState } from 'react'
import { SHIFT_CODES } from '../data/keyboard'
import { resolveLiveAction, type PopupData } from '../data/shortcuts'

const POPUP_LIFETIME_MS = 2000
const MAX_HISTORY_ENTRIES = 50

export interface HistoryEntry {
  readonly id: number
  readonly at: number
  readonly tokens: readonly string[]
  readonly message: string
  readonly action: string
}

export interface LivePopup {
  readonly id: number
  readonly data: PopupData
}

interface UseKeyboardEngineOptions {
  readonly onUserKeyDown?: () => void
}

interface UseKeyboardEngineResult {
  readonly activeCodes: ReadonlySet<string>
  readonly isChinese: boolean
  readonly popup: LivePopup | null
  readonly history: readonly HistoryEntry[]
  readonly clearHistory: () => void
  readonly dismissPopup: () => void
}

const isTypingTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false
  }
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  )
}

const formatHistoryMessage = (tokens: readonly string[]): string =>
  `你刚才按了 ${tokens.join(' + ')}`

/**
 * 真实键盘输入引擎。
 *
 * - 组合键优先于单键
 * - Shift 单击切换模拟中英文，Shift + 字母不切换
 * - 纯修饰键（Ctrl/Alt/Win/Fn）只更新高亮，不产生弹窗和历史
 * - 只记录识别后的动作，不记录每次裸 keydown
 * - 页面失焦、组件卸载时清理按住状态
 */
export const useKeyboardEngine = (
  options: UseKeyboardEngineOptions = {},
): UseKeyboardEngineResult => {
  const [activeCodes, setActiveCodes] = useState<ReadonlySet<string>>(
    () => new Set<string>(),
  )
  const [isChinese, setIsChinese] = useState(true)
  const [popup, setPopup] = useState<LivePopup | null>(null)
  const [history, setHistory] = useState<readonly HistoryEntry[]>([])

  const pressedCodesRef = useRef<Set<string>>(new Set())
  const shiftCodesRef = useRef<Set<string>>(new Set())
  const shiftUsedRef = useRef(false)
  const imeChineseRef = useRef(true)
  const popupIdRef = useRef(0)
  const historyIdRef = useRef(0)
  const onUserKeyDownRef = useRef(options.onUserKeyDown)

  useEffect(() => {
    onUserKeyDownRef.current = options.onUserKeyDown
  }, [options.onUserKeyDown])

  const showAction = useCallback((data: PopupData): void => {
    popupIdRef.current += 1
    const nextPopup: LivePopup = { id: popupIdRef.current, data }
    setPopup(nextPopup)

    historyIdRef.current += 1
    const nextHistory: HistoryEntry = {
      id: historyIdRef.current,
      at: Date.now(),
      tokens: data.tokens,
      message: formatHistoryMessage(data.tokens),
      action: data.title,
    }
    setHistory((entries) => [nextHistory, ...entries].slice(0, MAX_HISTORY_ENTRIES))
  }, [])

  const toggleIme = useCallback((): void => {
    const next = !imeChineseRef.current
    imeChineseRef.current = next
    setIsChinese(next)
    showAction({
      kicker: 'INPUT METHOD · 输入法',
      title: next ? '已切换到中文输入' : '已切换到英文输入',
      description:
        '单独轻按 Shift 后松开，才会切换中英文；Shift + 字母会被识别为组合输入。',
      tokens: ['Shift'],
      tip: 'Caps Lock 只控制大小写，不负责切换中英文输入法。',
    })
  }, [showAction])

  useEffect(() => {
    if (!popup) {
      return
    }
    const timeout = window.setTimeout(() => {
      setPopup((current) => (current?.id === popup.id ? null : current))
    }, POPUP_LIFETIME_MS)
    return () => window.clearTimeout(timeout)
  }, [popup])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (isTypingTarget(event.target)) {
        return
      }

      onUserKeyDownRef.current?.()

      const code = event.code
      pressedCodesRef.current.add(code)
      setActiveCodes(new Set(pressedCodesRef.current))

      if (event.repeat) {
        return
      }

      if (SHIFT_CODES.has(code)) {
        if (shiftCodesRef.current.size === 0) {
          const hasOtherKey = Array.from(pressedCodesRef.current).some(
            (pressedCode) => !SHIFT_CODES.has(pressedCode),
          )
          shiftUsedRef.current = hasOtherKey
        }
        shiftCodesRef.current.add(code)
        return
      }

      if (shiftCodesRef.current.size > 0) {
        shiftUsedRef.current = true
      }

      const action = resolveLiveAction(event)
      if (action) {
        showAction(action)
      }
    }

    const onKeyUp = (event: KeyboardEvent): void => {
      const code = event.code
      pressedCodesRef.current.delete(code)
      setActiveCodes(new Set(pressedCodesRef.current))

      if (!SHIFT_CODES.has(code)) {
        return
      }

      shiftCodesRef.current.delete(code)

      const hasOtherKey = Array.from(pressedCodesRef.current).some(
        (pressedCode) => !SHIFT_CODES.has(pressedCode),
      )

      if (
        shiftCodesRef.current.size === 0 &&
        !shiftUsedRef.current &&
        !hasOtherKey
      ) {
        toggleIme()
      }

      if (shiftCodesRef.current.size === 0) {
        shiftUsedRef.current = false
      }
    }

    const clearKeyboardState = (): void => {
      pressedCodesRef.current.clear()
      shiftCodesRef.current.clear()
      shiftUsedRef.current = false
      setActiveCodes(new Set<string>())
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', clearKeyboardState)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', clearKeyboardState)
    }
  }, [showAction, toggleIme])

  const clearHistory = useCallback((): void => {
    setHistory([])
  }, [])

  const dismissPopup = useCallback((): void => {
    setPopup(null)
  }, [])

  return {
    activeCodes,
    isChinese,
    popup,
    history,
    clearHistory,
    dismissPopup,
  }
}
