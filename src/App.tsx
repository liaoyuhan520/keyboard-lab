import { useRef, useState } from 'react'
import './App.css'
import { HistorySidebar } from './components/HistorySidebar'
import { KeyboardStage } from './components/KeyboardStage'
import { PinyinLab } from './components/PinyinLab'
import { PopupCard } from './components/PopupCard'
import { ReferenceSections } from './components/ReferenceSections'
import {
  COMBINATION_COUNT,
  SINGLE_KEY_COUNT,
} from './data/pinyin'
import { DEMO_TOTAL_STEPS } from './data/demoTimeline'
import { useAutoDemo } from './hooks/useAutoDemo'
import { useKeyboardEngine } from './hooks/useKeyboardEngine'

const padTwo = (value: number): string =>
  value < 10 ? `0${value}` : String(value)

function App() {
  const [isPinyinOpen, setIsPinyinOpen] = useState(false)
  const pinyinTriggerRef = useRef<HTMLButtonElement>(null)
  const autoDemo = useAutoDemo()
  const keyboard = useKeyboardEngine({
    enabled: !isPinyinOpen,
    onUserKeyDown: autoDemo.stopDemo,
  })

  const isAutoPlaying = autoDemo.isPlaying
  const activeCodes = isAutoPlaying
    ? autoDemo.activeCodes
    : keyboard.activeCodes
  const isChinese = isAutoPlaying ? autoDemo.isChinese : keyboard.isChinese
  const displayedPopup = isAutoPlaying ? autoDemo.popup : keyboard.popup

  const handleAutoToggle = (): void => {
    if (isAutoPlaying) {
      autoDemo.stopDemo()
      return
    }
    keyboard.dismissPopup()
    autoDemo.startDemo()
  }

  const handlePinyinOpen = (): void => {
    autoDemo.stopDemo()
    keyboard.clearKeyboardState()
    keyboard.dismissPopup()
    setIsPinyinOpen(true)
  }

  const handlePinyinClose = (): void => {
    setIsPinyinOpen(false)
    window.requestAnimationFrame(() => pinyinTriggerRef.current?.focus())
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient--top" aria-hidden="true" />
      <div className="ambient ambient--bottom" aria-hidden="true" />
      <div className="page-frame">
        <header className="site-header">
          <div className="brand">
            <div className="eyebrow">
              <span className="status-dot status-dot--cyan" />
              WINDOWS KEYBOARD LAB / 82-KEY COMPACT
            </div>
            <h1>快捷键实验室</h1>
            <p className="brand__subtitle">
              按一按，让键盘告诉你它能做什么。
            </p>
            <div className="brand__meta">
              <span>82 键紧凑模型</span>
              <span>29 段自动演示</span>
              <span>63 段拼音音频</span>
              <span>真实键盘实时响应</span>
            </div>
          </div>

          <div className="header-actions">
            <div className="status-card status-card--ime">
              <div className="status-card__label">INPUT METHOD</div>
              <div className="ime-state">
                <div>
                  <div className="ime-state__name">
                    {isChinese ? '中文输入' : 'English'}
                  </div>
                  <div className="ime-state__hint">轻按 Shift 切换</div>
                </div>
                <span
                  className={`ime-badge ${
                    isChinese ? 'ime-badge--cn' : 'ime-badge--en'
                  }`}
                >
                  {isChinese ? '中' : '英'}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="pinyin-launch"
              onClick={handlePinyinOpen}
              ref={pinyinTriggerRef}
              aria-haspopup="dialog"
              aria-expanded={isPinyinOpen}
            >
              <span className="pinyin-launch__icon" aria-hidden="true">
                ü
              </span>
              <span className="pinyin-launch__copy">
                <strong>拼音试听台</strong>
                <small>
                  {SINGLE_KEY_COUNT} 单键 · {COMBINATION_COUNT} 组合
                </small>
              </span>
              <span className="pinyin-launch__arrow" aria-hidden="true">
                ↗
              </span>
            </button>

            <button
              type="button"
              className={`demo-control${isAutoPlaying ? ' is-playing' : ''}`}
              onClick={handleAutoToggle}
              aria-pressed={isAutoPlaying}
            >
              <span className="demo-control__icon" aria-hidden="true">
                {isAutoPlaying ? '■' : '▶'}
              </span>
              <span className="demo-control__copy">
                <strong>{isAutoPlaying ? '停止演示' : '自动演示'}</strong>
                <small>
                  {isAutoPlaying
                    ? `STEP ${padTwo(autoDemo.stepNumber)} / ${DEMO_TOTAL_STEPS} · 按真实按键接管`
                    : `回放 ${DEMO_TOTAL_STEPS} 个按键动作`}
                </small>
              </span>
              <span
                className="demo-control__progress"
                style={{
                  transform: `scaleX(${isAutoPlaying ? autoDemo.progress : 0})`,
                }}
                aria-hidden="true"
              />
            </button>
          </div>
        </header>

        <main className="workspace">
          <section className="stage-column" aria-label="交互键盘">
            <div className="popup-dock" aria-live="polite">
              {displayedPopup ? (
                <PopupCard
                  key={
                    isAutoPlaying
                      ? autoDemo.popup?.key
                      : `live-popup-${keyboard.popup?.id ?? 'none'}`
                  }
                  data={displayedPopup.data}
                  source={isAutoPlaying ? 'demo' : 'live'}
                  stepNumber={
                    isAutoPlaying ? autoDemo.popup?.stepNumber : undefined
                  }
                />
              ) : (
                <div className="idle-card">
                  <span className="idle-card__icon" aria-hidden="true">
                    ⌨
                  </span>
                  <div>
                    <strong>
                      {isAutoPlaying
                        ? '自动演示进行中'
                        : '等待你的下一次输入'}
                    </strong>
                    <p>
                      {isAutoPlaying
                        ? '按任意真实按键即可停止演示并接管键盘。'
                        : '试试 Ctrl + C，或单独轻按一下 Shift。'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <KeyboardStage activeCodes={activeCodes} />

            <div className="stage-meta">
              <div className="stage-meta__item">
                <span className="status-dot status-dot--green" />
                <span>{isAutoPlaying ? '自动演示中' : '真实键盘监听中'}</span>
              </div>
              <div className="stage-meta__hint">
                组合键优先识别 · Shift 单击切换中英文
              </div>
              <div className="stage-meta__note">
                浏览器或系统占用的快捷键可能不会传递到页面
              </div>
            </div>

            <p className="mobile-tip">
              在桌面端连接物理键盘体验最佳；移动端仍可播放自动演示和查看记录。
            </p>
          </section>

          <HistorySidebar
            entries={keyboard.history}
            isAutoPlaying={isAutoPlaying}
            onClear={keyboard.clearHistory}
          />
        </main>

        <ReferenceSections />

        <footer className="site-footer">
          <span>
            快捷键实验室 · Keyboard Lab
          </span>
          <span>
            React + CSS + SVG · 本地拼音音频与字母表 · 所有记录仅保存在当前页面
          </span>
        </footer>
      </div>

      {isPinyinOpen ? <PinyinLab onClose={handlePinyinClose} /> : null}
    </div>
  )
}

export default App
