import { useEffect, useRef } from 'react'
import type { HistoryEntry } from '../hooks/useKeyboardEngine'
import { KeyTokens } from './KeyTokens'

interface HistorySidebarProps {
  readonly entries: readonly HistoryEntry[]
  readonly isAutoPlaying: boolean
  readonly onClear: () => void
}

const formatTime = (timestamp: number): string =>
  new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

export function HistorySidebar({
  entries,
  isAutoPlaying,
  onClear,
}: HistorySidebarProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const latestId = entries[0]?.id

  useEffect(() => {
    if (!latestId) {
      return
    }
    listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [latestId])

  return (
    <aside className="history-panel" aria-label="按键历史">
      <div className="history-panel__header">
        <div>
          <div className="eyebrow eyebrow--cyan">
            <span className="status-dot status-dot--green" />
            INPUT LOG
          </div>
          <h2>按键历史</h2>
        </div>
        <button
          type="button"
          className="text-button"
          onClick={onClear}
          disabled={entries.length === 0}
        >
          清空
        </button>
      </div>

      <div className="history-panel__summary">
        <span>你刚才按下的动作</span>
        <span className="history-count">{entries.length} / 50</span>
      </div>

      <div
        className="history-list"
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {entries.length === 0 ? (
          <div className="history-empty">
            <span className="history-empty__key" aria-hidden="true">
              ⌨
            </span>
            <p>还没有按键记录</p>
            <small>聚焦本页后，敲击任意组合键试试看。</small>
          </div>
        ) : (
          entries.map((entry) => (
            <article className="history-entry" key={entry.id}>
              <div className="history-entry__meta">
                <time dateTime={new Date(entry.at).toISOString()}>
                  {formatTime(entry.at)}
                </time>
                <span className="history-entry__index">#{entry.id}</span>
              </div>
              <p className="history-entry__message" aria-label={entry.message}>
                你刚才按了
                <KeyTokens tokens={entry.tokens} compact />
              </p>
              <p className="history-entry__action">{entry.action}</p>
            </article>
          ))
        )}
      </div>

      <p className="history-panel__hint">
        {isAutoPlaying
          ? '自动演示进行中 · 演示动作不计入历史'
          : '只记录识别后的动作 · 刷新页面后清空'}
      </p>
    </aside>
  )
}
