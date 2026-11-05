import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  COMBINATION_COUNT,
  PINYIN_AUDIO_ZIP,
  PINYIN_GROUPS,
  PINYIN_ITEMS,
  PINYIN_TOTAL,
  PINYIN_ZIP_DOWNLOAD_NAME,
  SINGLE_KEY_COUNT,
  SINGLE_KEY_ITEMS,
  findPinyin,
  normalizePinyinInput,
  type PinyinItem,
} from '../data/pinyin'
import { PinyinReferenceChart } from './PinyinReferenceChart'
import './PinyinLab.css'

interface PinyinLabProps {
  readonly onClose: () => void
}

const MAX_BUFFER_LENGTH = 8
const LETTER_CODE_PATTERN = /^Key([A-Z])$/

const letterFromCode = (code: string): string | null => {
  const match = LETTER_CODE_PATTERN.exec(code)
  return match ? match[1].toLowerCase() : null
}

const isInteractiveTarget = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  target.closest('button, a, input, textarea, select') !== null

const isClearShortcut = (event: KeyboardEvent): boolean =>
  event.code === 'Backslash' ||
  event.code === 'IntlBackslash' ||
  event.key === '|' ||
  event.key === '\\'

export function PinyinLab({ onClose }: PinyinLabProps) {
  const [isComboMode, setIsComboMode] = useState(false)
  const [isChartExpanded, setIsChartExpanded] = useState(false)
  const [buffer, setBuffer] = useState('')
  const [error, setError] = useState('')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [audioError, setAudioError] = useState('')

  const bufferRef = useRef('')
  const dialogRef = useRef<HTMLDivElement>(null)
  const chartDialogRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const matchedItem = findPinyin(buffer)
  const playingItem =
    PINYIN_ITEMS.find((item) => item.id === playingId) ?? null

  const updateBuffer = useCallback((next: string): void => {
    bufferRef.current = next
    setBuffer(next)
  }, [])

  const playItem = useCallback((item: PinyinItem): void => {
    audioRef.current?.pause()

    const audio = new Audio(item.audioSrc)
    audio.preload = 'auto'
    audioRef.current = audio
    setAudioError('')
    setPlayingId(item.id)

    const reportError = (): void => {
      if (audioRef.current !== audio) {
        return
      }
      setPlayingId(null)
      setAudioError('音频加载失败，请稍后再试。')
    }

    audio.addEventListener('ended', () => {
      if (audioRef.current === audio) {
        setPlayingId(null)
      }
    })
    audio.addEventListener('error', reportError)
    void audio.play().catch(reportError)
  }, [])

  const commitBuffer = useCallback((): void => {
    if (!isComboMode) {
      return
    }

    const current = bufferRef.current
    if (!current) {
      setError('先按下一个拼音字母，再按 Enter。')
      return
    }

    const item = findPinyin(current)
    if (!item) {
      setError(`没有找到「${current}」对应的拼音，按 Backspace 修改。`)
      return
    }

    setError('')
    playItem(item)
  }, [isComboMode, playItem])

  const selectItem = useCallback(
    (item: PinyinItem): void => {
      updateBuffer(item.label)
      setError('')
      playItem(item)
    },
    [playItem, updateBuffer],
  )

  const clearBuffer = useCallback((): void => {
    updateBuffer('')
    setError('')
  }, [updateBuffer])

  const toggleComboMode = useCallback((): void => {
    setIsComboMode((current) => !current)
    updateBuffer('')
    setError('')
  }, [updateBuffer])

  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      audioRef.current?.pause()
      audioRef.current = null
      previousFocus?.focus()
    }
  }, [])

  useEffect(() => {
    if (!isChartExpanded) {
      return
    }

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    chartDialogRef.current?.focus()

    return () => previousFocus?.focus()
  }, [isChartExpanded])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      const trapFocus = (dialog: HTMLDivElement | null): void => {
        if (!dialog) {
          return
        }
        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((element) => element.offsetParent !== null)
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (!first || !last) {
          return
        }
        if (!dialog.contains(document.activeElement)) {
          event.preventDefault()
          const target = event.shiftKey ? last : first
          target.focus()
        } else if (
          event.shiftKey &&
          (document.activeElement === first || document.activeElement === dialog)
        ) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }

      if (isChartExpanded) {
        if (event.key === 'Escape') {
          event.preventDefault()
          setIsChartExpanded(false)
        } else if (event.key === 'Tab') {
          trapFocus(chartDialogRef.current)
        }
        return
      }

      if (event.key === 'Tab') {
        trapFocus(dialogRef.current)
        return
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.altKey || event.ctrlKey || event.metaKey) {
        return
      }

      if (isClearShortcut(event)) {
        event.preventDefault()
        if (!event.repeat) {
          clearBuffer()
        }
        return
      }

      if (event.key === 'Backspace') {
        if (!bufferRef.current) {
          return
        }
        event.preventDefault()
        if (!event.repeat) {
          updateBuffer(bufferRef.current.slice(0, -1))
          setError('')
        }
        return
      }

      if (event.key === 'Enter' || event.code === 'NumpadEnter') {
        if (!isComboMode) {
          return
        }
        if (!bufferRef.current && isInteractiveTarget(event.target)) {
          return
        }
        event.preventDefault()
        if (!event.repeat) {
          commitBuffer()
        }
        return
      }

      const letter = letterFromCode(event.code)
      if (!letter) {
        return
      }

      event.preventDefault()
      if (event.repeat) {
        return
      }

      setError('')

      if (!isComboMode) {
        const singleItem = SINGLE_KEY_ITEMS[letter]
        if (!singleItem) {
          return
        }
        updateBuffer(singleItem.label)
        playItem(singleItem)
        return
      }

      const next = normalizePinyinInput(
        `${bufferRef.current}${letter}`,
      ).slice(0, MAX_BUFFER_LENGTH)
      updateBuffer(next)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [
    clearBuffer,
    commitBuffer,
    isChartExpanded,
    isComboMode,
    onClose,
    playItem,
    updateBuffer,
  ])

  const readout = buffer || '拼音'
  const isReadoutEmpty = buffer.length === 0
  const isReadoutError = error.length > 0
  const status =
    error ||
    (matchedItem
      ? `${matchedItem.label} · ${matchedItem.mnemonic} · ${
          isComboMode ? '按 Enter 试听' : '单键已直接试听'
        }`
      : isComboMode
        ? buffer.length > 1
          ? '继续输入字母，或按 Enter 检查当前组合。'
          : '连续输入字母，组合完成后按 Enter 试听。'
        : '组合模式已关闭，按任意字母立即试听。')

  return createPortal(
    <>
      <div
        className="pinyin-overlay"
        aria-hidden={isChartExpanded ? true : undefined}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose()
          }
        }}
      >
      <div
        className="pinyin-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pinyin-lab-title"
        aria-describedby="pinyin-lab-description"
        ref={dialogRef}
        tabIndex={-1}
      >
        <header className="pinyin-dialog__header">
          <div className="pinyin-dialog__heading">
            <div className="eyebrow eyebrow--cyan">
              <span className="status-dot status-dot--green" />
              PINYIN AUDIO LAB · {PINYIN_TOTAL} CLIPS
            </div>
            <h2 id="pinyin-lab-title">汉语拼音试听台</h2>
            <p id="pinyin-lab-description">
              默认单键直听；开启组合输入后，输入多个字母并按 Enter 试听组合。
            </p>
          </div>

          <div className="pinyin-dialog__header-actions">
            <div className="pinyin-count-pill">
              <strong>{SINGLE_KEY_COUNT}</strong>
              <span>单键</span>
              <i aria-hidden="true" />
              <strong>{COMBINATION_COUNT}</strong>
              <span>组合</span>
            </div>
            <button
              type="button"
              className="pinyin-close"
              onClick={onClose}
              aria-label="关闭拼音试听台"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </header>

        <div className="pinyin-dialog__body">
          <div className="pinyin-main">
            <section className="pinyin-console" aria-label="拼音输入与试听">
              <div className="pinyin-console__topline">
                <span>KEYBOARD BUFFER</span>
                <button
                  type="button"
                  className={`pinyin-mode-toggle${
                    isComboMode ? ' is-on' : ''
                  }`}
                  role="switch"
                  aria-checked={isComboMode}
                  onClick={toggleComboMode}
                >
                  <span className="pinyin-mode-toggle__label">组合输入</span>
                  <span className="pinyin-mode-toggle__state">
                    {isComboMode ? 'ON' : 'OFF'}
                  </span>
                  <span
                    className="pinyin-mode-toggle__track"
                    aria-hidden="true"
                  >
                    <i />
                  </span>
                </button>
              </div>

              <div
                className={`pinyin-console__readout${
                  isReadoutEmpty ? ' is-empty' : ''
                }${isReadoutError ? ' is-error' : ''}`}
                aria-hidden="true"
              >
                {readout}
                {!isReadoutEmpty ? (
                  <span className="pinyin-console__cursor" />
                ) : null}
              </div>

              <div className="pinyin-console__statusline">
                <div className="pinyin-console__status" aria-live="polite">
                  <span
                    className={`status-dot ${
                      isReadoutError
                        ? 'status-dot--amber'
                        : matchedItem
                          ? 'status-dot--green'
                          : 'status-dot--cyan'
                    }`}
                  />
                  {status}
                </div>
                <span
                  className={`pinyin-console__playing${
                    playingItem ? ' is-playing' : ''
                  }`}
                  aria-live="polite"
                >
                  <span className="pinyin-signal" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  {playingItem
                    ? `正在播放 ${playingItem.label}`
                    : audioError || '等待下一个字母'}
                </span>
              </div>

              <div className="pinyin-console__actions">
                {isComboMode ? (
                  <button
                    type="button"
                    className="pinyin-play"
                    onClick={commitBuffer}
                    disabled={!buffer}
                  >
                    <span aria-hidden="true">▶</span>
                    播放当前拼音
                    <kbd>Enter</kbd>
                  </button>
                ) : (
                  <span className="pinyin-single-indicator">
                    <span className="status-dot status-dot--green" />
                    单键模式 · 按字母即播
                  </span>
                )}
                <button
                  type="button"
                  className="pinyin-clear"
                  onClick={clearBuffer}
                  disabled={!buffer && !error}
                >
                  清空组合
                  <kbd>|</kbd>
                </button>
              </div>

              <div className="pinyin-console__hints">
                <span>
                  <kbd>v</kbd> 代替 <strong>ü</strong>
                </span>
                <span>
                  <kbd>|</kbd> 清空组合
                </span>
                <span>
                  <kbd>⌫</kbd> 逐字删除
                </span>
                <span>
                  <kbd>Esc</kbd> 关闭
                </span>
                <span>
                  {isComboMode
                    ? '输入组合后按 Enter，首字母不会自动试听'
                    : '单键模式不会累积字母'}
                </span>
              </div>
            </section>

            <div className="pinyin-groups">
              {PINYIN_GROUPS.map((group) => (
                <section
                  className="pinyin-group"
                  key={group.id}
                  aria-labelledby={`pinyin-group-${group.id}`}
                >
                  <header className="pinyin-group__header">
                    <div>
                      <div className="pinyin-group__eyebrow">
                        {group.eyebrow}
                      </div>
                      <h3 id={`pinyin-group-${group.id}`}>{group.title}</h3>
                    </div>
                    <div className="pinyin-group__meta">
                      <span>{group.items.length} 个</span>
                      <small>{group.caption}</small>
                    </div>
                  </header>

                  <div className="pinyin-grid">
                    {group.items.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        className={`pinyin-card${
                          playingId === item.id ? ' is-playing' : ''
                        }`}
                        onClick={() => selectItem(item)}
                        aria-label={`试听 ${item.label}，${item.mnemonic}`}
                      >
                        <span className="pinyin-card__signal" aria-hidden="true">
                          <i />
                          <i />
                          <i />
                        </span>
                        <span className="pinyin-card__label">{item.label}</span>
                        <span className="pinyin-card__mnemonic">
                          {item.mnemonic}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>

          <aside className="pinyin-aside" aria-label="拼音资料与下载">
            <section className="pinyin-download-card">
              <div className="pinyin-download-card__label">BATCH EXPORT</div>
              <h3>一次下载全部音频</h3>
              <p>
                压缩包内含 {PINYIN_TOTAL} 个 MP3，文件名就是对应的汉语拼音（
                <strong>ü</strong> 也保留）。
              </p>
              <a
                className="pinyin-download-button"
                href={PINYIN_AUDIO_ZIP}
                download={PINYIN_ZIP_DOWNLOAD_NAME}
              >
                <span className="pinyin-download-button__icon" aria-hidden="true">
                  ↓
                </span>
                <span>
                  <strong>下载全部音频</strong>
                  <small>ZIP · {PINYIN_TOTAL} FILES</small>
                </span>
              </a>
              <span className="pinyin-download-card__note">
                单个音频也可在卡片中直接试听。
              </span>
            </section>

            <section className="pinyin-reference">
              <header>
                <div>
                  <div className="pinyin-download-card__label">REFERENCE</div>
                  <h3>字母表 SVG 重绘</h3>
                </div>
                <button
                  type="button"
                  className="pinyin-reference__expand"
                  onClick={() => setIsChartExpanded(true)}
                  aria-haspopup="dialog"
                  aria-expanded={isChartExpanded}
                >
                  放大查看 ↗
                </button>
              </header>
              <button
                type="button"
                className="pinyin-reference__chart"
                onClick={() => setIsChartExpanded(true)}
                aria-label="放大查看汉语拼音字母表"
                aria-haspopup="dialog"
              >
                <PinyinReferenceChart />
              </button>
              <p>与网页暗色界面统一的矢量字母表，完整保留 63 个拼音与助记字。</p>
            </section>
          </aside>
        </div>
      </div>
    </div>

      {isChartExpanded ? (
        <div
          className="pinyin-chart-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsChartExpanded(false)
            }
          }}
        >
          <div
            className="pinyin-chart-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pinyin-chart-dialog-title"
            aria-describedby="pinyin-chart-dialog-description"
            ref={chartDialogRef}
            tabIndex={-1}
          >
            <header className="pinyin-chart-dialog__header">
              <div>
                <div className="eyebrow eyebrow--cyan">
                  <span className="status-dot status-dot--green" />
                  PINYIN REFERENCE · {PINYIN_TOTAL} CLIPS
                </div>
                <h2 id="pinyin-chart-dialog-title">字母表放大查看</h2>
                <p id="pinyin-chart-dialog-description">
                  滚动查看完整字母表，按 Esc 或右上角按钮返回试听台。
                </p>
              </div>
              <button
                type="button"
                className="pinyin-close"
                onClick={() => setIsChartExpanded(false)}
                aria-label="关闭放大的字母表"
              >
                <span aria-hidden="true">×</span>
              </button>
            </header>
            <div className="pinyin-chart-dialog__body">
              <div className="pinyin-chart-dialog__canvas">
                <PinyinReferenceChart />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>,
    document.body,
  )
}
