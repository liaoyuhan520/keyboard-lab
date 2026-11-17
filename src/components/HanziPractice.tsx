import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  findHanziCandidates,
  findSpeechCharacter,
  type HanziCandidate,
} from '../data/hanziCandidates'
import {
  findWordCandidates,
  type WordCandidate,
} from '../data/hanziWords'
import { toKeyboardKeys } from '../data/pinyin'
import { useMandarinSpeech } from '../hooks/useMandarinSpeech'
import { HanziStrokeStage } from './HanziStrokeStage'
import './HanziPractice.css'

const MAX_INPUT_LENGTH = 24
const VISIBLE_CANDIDATE_LIMIT = 9
const LETTER_CODE_PATTERN = /^Key([A-Z])$/
const SOFT_KEYBOARD_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'] as const

interface WordCandidateItem {
  readonly kind: 'word'
  readonly key: string
  readonly candidate: WordCandidate
}

interface HanziCandidateItem {
  readonly kind: 'char'
  readonly key: string
  readonly candidate: HanziCandidate
}

type CandidateItem = WordCandidateItem | HanziCandidateItem

type Selection =
  | {
      readonly kind: 'word'
      readonly candidate: WordCandidate
      readonly activeCharIndex: number
    }
  | {
      readonly kind: 'char'
      readonly candidate: HanziCandidate
    }

const isInteractiveTarget = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  target.closest('button, a, input, textarea, select') !== null

const isClearShortcut = (event: KeyboardEvent): boolean =>
  event.code === 'Backslash' ||
  event.code === 'IntlBackslash' ||
  event.key === '|' ||
  event.key === '\\'

const letterFromCode = (code: string): string | null => {
  const match = LETTER_CODE_PATTERN.exec(code)
  return match ? match[1].toLowerCase() : null
}

const toneLabel = (tone: number): string =>
  tone === 0 ? '轻声' : `第 ${tone} 声`

export default function HanziPractice() {
  const [buffer, setBuffer] = useState('')
  const [selected, setSelected] = useState<Selection | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [idiomResult, setIdiomResult] = useState<{
    readonly key: string
    readonly candidates: readonly WordCandidate[]
  } | null>(null)
  const [isSoftKeyboardOpen, setIsSoftKeyboardOpen] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }
    return (
      window.matchMedia('(max-width: 860px)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    )
  })
  const practiceRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLElement>(null)
  const {
    isSupported,
    voicesReady,
    hasChineseVoice,
    isSpeaking,
    error: speechError,
    speak,
    cancel,
  } = useMandarinSpeech()

  const wordCandidates = useMemo(
    () => findWordCandidates(buffer),
    [buffer],
  )
  const charResult = useMemo(
    () => findHanziCandidates(buffer),
    [buffer],
  )
  const allCharCandidates = useMemo(
    () => [...charResult.common, ...charResult.other],
    [charResult],
  )
  const hasFourCharacterWordCandidate = wordCandidates.some(
    (candidate) => Array.from(candidate.word).length === 4,
  )
  const shouldLoadIdioms =
    buffer.length >= 8 &&
    (wordCandidates.length === 0 || hasFourCharacterWordCandidate)

  useEffect(() => {
    if (!shouldLoadIdioms) {
      return
    }

    let cancelled = false
    const key = buffer

    void import('../data/hanziIdioms')
      .then(({ findIdiomCandidates }) => {
        if (cancelled) {
          return
        }
        setIdiomResult({
          key,
          candidates: findIdiomCandidates(key),
        })
      })
      .catch(() => {
        if (!cancelled) {
          setIdiomResult({ key, candidates: [] })
        }
      })

    return () => {
      cancelled = true
    }
  }, [buffer, shouldLoadIdioms])

  const idiomCandidates = useMemo(
    () =>
      shouldLoadIdioms && idiomResult?.key === buffer
        ? idiomResult.candidates
        : [],
    [buffer, idiomResult, shouldLoadIdioms],
  )
  const isLoadingIdioms =
    shouldLoadIdioms && idiomResult?.key !== buffer
  const allWordCandidates = useMemo(() => {
    const seen = new Set<string>()
    const combined: WordCandidate[] = []
    for (const candidate of [...idiomCandidates, ...wordCandidates]) {
      if (seen.has(candidate.word)) {
        continue
      }
      seen.add(candidate.word)
      combined.push(candidate)
    }
    return combined
  }, [idiomCandidates, wordCandidates])
  const allCandidates = useMemo<CandidateItem[]>(
    () => [
      ...allWordCandidates.map((candidate) => ({
        kind: 'word' as const,
        key: `word:${candidate.word}`,
        candidate,
      })),
      ...allCharCandidates.map((candidate) => ({
        kind: 'char' as const,
        key: `char:${candidate.char}:${candidate.reading.pinyin}`,
        candidate,
      })),
    ],
    [allCharCandidates, allWordCandidates],
  )
  const visibleCandidates = showAll
    ? allCandidates
    : allCandidates.slice(0, VISIBLE_CANDIDATE_LIMIT)
  const visibleWords = visibleCandidates.flatMap((candidate, index) =>
    candidate.kind === 'word' ? [{ candidate, index }] : [],
  )
  const visibleChars = visibleCandidates.flatMap((candidate, index) =>
    candidate.kind === 'char' ? [{ candidate, index }] : [],
  )
  const hasMore = allCandidates.length > VISIBLE_CANDIDATE_LIMIT
  const showGroupLabels =
    visibleWords.length > 0 && visibleChars.length > 0
  const keyboardKeys = toKeyboardKeys(buffer)
  const isEmpty = buffer.length === 0
  const isLongInput = buffer.length > 8
  const isVeryLongInput = buffer.length > 14
  const hasCharCandidates =
    charResult.common.length + charResult.other.length > 0
  const allWordCandidatesAreIdioms =
    allWordCandidates.length > 0 &&
    allWordCandidates.every((candidate) => candidate.isIdiom)
  const candidateTitle =
    allWordCandidates.length > 0
      ? allWordCandidatesAreIdioms
        ? hasCharCandidates
          ? '候选成语与汉字'
          : '候选成语'
        : hasCharCandidates
          ? '候选词语与汉字'
          : '候选词语'
      : isLoadingIdioms
        ? '正在查找成语'
        : '候选汉字'
  const selectedId = selected
    ? selected.kind === 'word'
      ? `word:${selected.candidate.word}`
      : `char:${selected.candidate.char}:${selected.candidate.reading.pinyin}`
    : null

  const resetForInput = useCallback((): void => {
    setSelected(null)
    setShowAll(false)
    cancel()
  }, [cancel])

  const focusPractice = useCallback((): void => {
    practiceRef.current?.focus({ preventScroll: true })
  }, [])

  const appendInputLetter = useCallback(
    (letter: string): void => {
      const next = `${buffer}${letter}`
        .replaceAll('v', 'ü')
        .slice(0, MAX_INPUT_LENGTH)
      if (next === buffer) {
        return
      }
      setBuffer(next)
      resetForInput()
      focusPractice()
    },
    [buffer, focusPractice, resetForInput],
  )

  const removeLastInputLetter = useCallback((): void => {
    if (!buffer) {
      return
    }
    setBuffer(buffer.slice(0, -1))
    resetForInput()
    focusPractice()
  }, [buffer, focusPractice, resetForInput])

  const clearInput = useCallback((): void => {
    if (buffer) {
      setBuffer('')
      resetForInput()
    }
    focusPractice()
  }, [buffer, focusPractice, resetForInput])

  const selectCandidate = useCallback(
    (item: CandidateItem): void => {
      if (item.kind === 'word') {
        setSelected({
          kind: 'word',
          candidate: item.candidate,
          activeCharIndex: 0,
        })
        practiceRef.current?.focus({ preventScroll: true })
        speak(item.candidate.word)
        return
      }

      setSelected({ kind: 'char', candidate: item.candidate })
      practiceRef.current?.focus({ preventScroll: true })
      speak(findSpeechCharacter(item.candidate, allCharCandidates))
    },
    [allCharCandidates, speak],
  )

  const speakSelected = useCallback((): void => {
    if (!selected) {
      return
    }
    if (selected.kind === 'word') {
      speak(selected.candidate.word)
      return
    }
    speak(findSpeechCharacter(selected.candidate, allCharCandidates))
  }, [allCharCandidates, selected, speak])

  const selectWordCharacter = useCallback((index: number): void => {
    setSelected((current) =>
      current?.kind === 'word'
        ? { ...current, activeCharIndex: index }
        : current,
    )
  }, [])

  useEffect(() => {
    if (!selectedId) {
      return
    }
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    resultRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }, [selectedId])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (
        event.key === 'Escape' ||
        event.key === 'Tab' ||
        event.defaultPrevented
      ) {
        return
      }
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return
      }

      if (isClearShortcut(event)) {
        event.preventDefault()
        if (!event.repeat) {
          clearInput()
        }
        return
      }

      if (event.key === 'Backspace') {
        if (!buffer) {
          return
        }
        event.preventDefault()
        if (!event.repeat) {
          removeLastInputLetter()
        }
        return
      }

      if (event.key === 'Enter' || event.code === 'NumpadEnter') {
        if (isInteractiveTarget(event.target)) {
          return
        }
        event.preventDefault()
        if (event.repeat) {
          return
        }
        if (selected) {
          speakSelected()
        } else if (visibleCandidates[0]) {
          selectCandidate(visibleCandidates[0])
        }
        return
      }

      if (/^[1-9]$/u.test(event.key)) {
        const candidate = visibleCandidates[Number(event.key) - 1]
        if (!candidate) {
          return
        }
        event.preventDefault()
        if (!event.repeat) {
          selectCandidate(candidate)
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

      appendInputLetter(letter)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [
    appendInputLetter,
    buffer,
    clearInput,
    removeLastInputLetter,
    selectCandidate,
    selected,
    speakSelected,
    visibleCandidates,
  ])

  const candidateSection = (
    <div className="hanzi-candidates">
      <div className="hanzi-candidates__header">
        <div>
          <span className="hanzi-section-eyebrow">CANDIDATES</span>
          <h3>{candidateTitle}</h3>
        </div>
        <span className="hanzi-candidates__count" aria-live="polite">
          {isEmpty
            ? '等待输入'
            : isLoadingIdioms && allCandidates.length === 0
              ? '查询中'
              : `${allCandidates.length} 个`}
        </span>
      </div>

      {isEmpty ? (
        <div className="hanzi-candidates__empty">
          <span aria-hidden="true">拼</span>
          <p>
            按下键盘字母输入拼音，例如 ba、shi、nihao、huashetianzu。
          </p>
        </div>
      ) : isLoadingIdioms && allCandidates.length === 0 ? (
        <div className="hanzi-candidates__empty is-loading">
          <span className="hanzi-spinner" aria-hidden="true" />
          <p>正在加载成语词库…</p>
        </div>
      ) : allCandidates.length === 0 ? (
        <div className="hanzi-candidates__empty">
          <span aria-hidden="true">?</span>
          <p>
            没有找到「{buffer}」的候选词语、成语或汉字，继续输入完整拼音或换一个试试。
          </p>
        </div>
      ) : (
        <>
          {visibleWords.length > 0 ? (
            <div className="hanzi-word-section">
              {showGroupLabels ? (
                <span className="hanzi-candidate-group-label">词语</span>
              ) : null}
              <div className="hanzi-word-grid">
                {visibleWords.map(({ candidate, index }) => {
                  const isSelected =
                    selected?.kind === 'word' &&
                    selected.candidate.word === candidate.candidate.word
                  return (
                    <button
                      type="button"
                      key={candidate.key}
                      className={`hanzi-word-candidate${
                        candidate.candidate.isIdiom ? ' is-idiom' : ''
                      }${isSelected ? ' is-selected' : ''}`}
                      onClick={() => selectCandidate(candidate)}
                      aria-label={`选择${
                        candidate.candidate.isIdiom ? '成语' : '词语'
                      } ${candidate.candidate.word}，读音 ${candidate.candidate.syllables.join(' ')}`}
                      aria-pressed={isSelected}
                    >
                      <span className="hanzi-candidate__index">
                        {index < VISIBLE_CANDIDATE_LIMIT ? index + 1 : ''}
                      </span>
                      {candidate.candidate.isIdiom ? (
                        <span className="hanzi-word-candidate__tag">成语</span>
                      ) : null}
                      <span className="hanzi-word-candidate__word">
                        {candidate.candidate.word}
                      </span>
                      <span className="hanzi-word-candidate__pinyin">
                        {candidate.candidate.syllables.join(' ')}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}

          {visibleChars.length > 0 ? (
            <div className="hanzi-char-section">
              {showGroupLabels ? (
                <span className="hanzi-candidate-group-label">单字</span>
              ) : null}
              <div className="hanzi-candidate-grid">
                {visibleChars.map(({ candidate, index }) => {
                  const isSelected =
                    selected?.kind === 'char' &&
                    selected.candidate.char === candidate.candidate.char &&
                    selected.candidate.reading.pinyin ===
                      candidate.candidate.reading.pinyin
                  return (
                    <button
                      type="button"
                      key={candidate.key}
                      className={`hanzi-candidate${
                        isSelected ? ' is-selected' : ''
                      }`}
                      onClick={() => selectCandidate(candidate)}
                      aria-label={`选择 ${candidate.candidate.char}，读音 ${candidate.candidate.reading.pinyin}`}
                      aria-pressed={isSelected}
                    >
                      <span className="hanzi-candidate__index">
                        {index < VISIBLE_CANDIDATE_LIMIT ? index + 1 : ''}
                      </span>
                      <span className="hanzi-candidate__char">
                        {candidate.candidate.char}
                      </span>
                      <span className="hanzi-candidate__pinyin">
                        {candidate.candidate.reading.pinyin}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}

          {hasMore ? (
            <button
              type="button"
              className="hanzi-more-button"
              onClick={() => setShowAll((current) => !current)}
            >
              {showAll
                ? '收起候选'
                : `展开更多（${allCandidates.length - VISIBLE_CANDIDATE_LIMIT}）`}
            </button>
          ) : null}
        </>
      )}
    </div>
  )

  const voiceNote = !isSupported
    ? '当前浏览器不支持语音朗读'
    : voicesReady && !hasChineseVoice
      ? '未检测到中文语音，将使用系统默认语音'
      : '使用设备中文语音'

  const speechFeedback = speechError ? (
    <p className="hanzi-feedback is-error" role="status">
      {speechError}
    </p>
  ) : (
    <p className="hanzi-feedback" role="status">
      {selected?.kind === 'word'
        ? '选词后自动朗读整词；点击大字或按钮重读，点击字卡切换笔顺。'
        : '选字后自动朗读；点击大字或按钮重读，多音字按当前读音播放。'}
    </p>
  )

  const speakActions = (
    <div className="hanzi-character-card__actions">
      <button
        type="button"
        className="hanzi-speak-button"
        onClick={speakSelected}
        disabled={!isSupported}
        aria-label="点击朗读当前成语、词语或汉字"
      >
        <span aria-hidden="true">♪</span>
        {isSpeaking ? '正在朗读…' : '点击朗读'}
      </button>
      <span className="hanzi-voice-note">{voiceNote}</span>
    </div>
  )

  return (
    <div
      className="hanzi-practice"
      ref={practiceRef}
      tabIndex={-1}
      aria-label="汉字拼读"
    >
      <section className="hanzi-input-card" aria-label="拼音输入">
        <div className="hanzi-input-card__topline">
          <span>HANZI &amp; WORD PINYIN INPUT</span>
          <span>TAP / NUM 1–9 SELECT</span>
        </div>

        <div
          className={`hanzi-input-display${isEmpty ? ' is-empty' : ''}${
            isLongInput ? ' is-long' : ''
          }${isVeryLongInput ? ' is-very-long' : ''}`}
          aria-live="polite"
        >
          <span className="hanzi-input-display__value">
            {buffer || '输入拼音'}
          </span>
          {!isEmpty ? (
            <span className="hanzi-input-display__keys">
              （{keyboardKeys}）
            </span>
          ) : null}
          {!isEmpty ? (
            <span className="hanzi-input-display__cursor" aria-hidden="true" />
          ) : null}
        </div>

        <div className="hanzi-input-actions">
          <span className="hanzi-input-hint">
            按物理键盘或屏幕键盘输入 · 点击候选或按数字键选择 · Enter 选第一个
          </span>
          <div className="hanzi-input-buttons">
            <button
              type="button"
              className={`hanzi-keyboard-toggle${
                isSoftKeyboardOpen ? ' is-open' : ''
              }`}
              onClick={() => setIsSoftKeyboardOpen((current) => !current)}
              aria-expanded={isSoftKeyboardOpen}
              aria-controls="hanzi-soft-keyboard"
            >
              <span aria-hidden="true">⌨</span>
              {isSoftKeyboardOpen ? '收起键盘' : '屏幕键盘'}
            </button>
            <button
              type="button"
              className="hanzi-clear-button"
              onClick={clearInput}
              disabled={!buffer}
            >
              清空
              <kbd>|</kbd>
            </button>
          </div>
        </div>

        {isSoftKeyboardOpen ? (
          <div
            className="hanzi-soft-keyboard"
            id="hanzi-soft-keyboard"
            aria-label="屏幕拼音键盘"
          >
            <div className="hanzi-soft-keyboard__topline">
              <span>SCREEN PINYIN KEYBOARD</span>
              <span>v = ü</span>
            </div>
            <div className="hanzi-soft-keyboard__rows">
              {SOFT_KEYBOARD_ROWS.map((row, rowIndex) => (
                <div
                  className={`hanzi-soft-keyboard__row hanzi-soft-keyboard__row--${rowIndex + 1}`}
                  key={row}
                >
                  {Array.from(row).map((letter) => (
                    <button
                      type="button"
                      className="hanzi-soft-key"
                      key={letter}
                      onClick={() => appendInputLetter(letter)}
                      aria-label={`输入字母 ${letter}`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <div className="hanzi-soft-keyboard__actions">
              <button
                type="button"
                className="hanzi-secondary-button hanzi-soft-action"
                onClick={removeLastInputLetter}
                disabled={!buffer}
              >
                ⌫ 删除
              </button>
              <button
                type="button"
                className="hanzi-secondary-button hanzi-soft-action"
                onClick={clearInput}
                disabled={!buffer}
              >
                清空输入
              </button>
            </div>
          </div>
        ) : null}

        <div className="hanzi-keyhints">
          <span>
            <kbd>⌫</kbd> 逐字删除
          </span>
          <span>
            <kbd>1–9</kbd> 选择
          </span>
          <span>
            <kbd>v</kbd> 代替 <strong>ü</strong>
          </span>
          <span>
            <kbd>Esc</kbd> 关闭
          </span>
        </div>
      </section>

      {candidateSection}

      {selected ? (
        <section
          className="hanzi-result"
          ref={resultRef}
          aria-label={
            selected.kind === 'word'
              ? `${selected.candidate.word} 的读音和逐字笔顺`
              : `${selected.candidate.char} 的读音和笔顺`
          }
        >
          {selected.kind === 'word' ? (
            <>
              <div className="hanzi-character-card hanzi-word-card">
                <div className="hanzi-character-card__topline">
                  <span>
                    {selected.candidate.isIdiom
                      ? 'SELECTED IDIOM'
                      : 'SELECTED WORD'}
                  </span>
                  <span>
                    {Array.from(selected.candidate.word).length}{' '}
                    {selected.candidate.isIdiom ? '字成语' : '字词'}
                  </span>
                </div>
                <button
                  type="button"
                  className="hanzi-word-card__glyph"
                  onClick={speakSelected}
                  disabled={!isSupported}
                  aria-label={`点击朗读词语 ${selected.candidate.word}`}
                  title="点击朗读"
                >
                  {selected.candidate.word}
                </button>
                <div className="hanzi-character-card__reading">
                  <strong>{selected.candidate.syllables.join(' ')}</strong>
                  <span>
                    {selected.candidate.isIdiom ? '成语' : '词语'}
                  </span>
                </div>
                <div className="hanzi-word-characters">
                  {Array.from(selected.candidate.word).map(
                    (character, index) => (
                      <button
                        type="button"
                        key={`${character}-${index}`}
                        className={`hanzi-word-character${
                          selected.activeCharIndex === index
                            ? ' is-active'
                            : ''
                        }`}
                        onClick={() => selectWordCharacter(index)}
                        aria-pressed={selected.activeCharIndex === index}
                        aria-label={`查看 ${character} 的笔顺`}
                      >
                        <span>{character}</span>
                        <small>
                          {selected.candidate.syllables[index] ?? ''}
                        </small>
                      </button>
                    ),
                  )}
                </div>
                {speakActions}
                {speechFeedback}
              </div>
              <HanziStrokeStage
                char={
                  Array.from(selected.candidate.word)[
                    selected.activeCharIndex
                  ] ?? selected.candidate.word[0]
                }
              />
            </>
          ) : (
            <>
              <div className="hanzi-character-card">
                <div className="hanzi-character-card__topline">
                  <span>SELECTED CHARACTER</span>
                  <span>
                    {selected.candidate.isPolyphonic ? '多音字' : '单音字'}
                  </span>
                </div>
                <button
                  type="button"
                  className="hanzi-character-card__glyph"
                  onClick={speakSelected}
                  disabled={!isSupported}
                  aria-label={`点击朗读汉字 ${selected.candidate.char}`}
                  title="点击朗读"
                >
                  {selected.candidate.char}
                </button>
                <div className="hanzi-character-card__reading">
                  <strong>{selected.candidate.reading.pinyin}</strong>
                  <span>
                    {selected.candidate.isCommon ? '常用字' : '扩展字'}
                  </span>
                </div>
                <div className="hanzi-pinyin-parts">
                  <span>
                    <small>声母</small>
                    {selected.candidate.reading.initial || '零'}
                  </span>
                  <span>
                    <small>韵母</small>
                    {selected.candidate.reading.final}
                  </span>
                  <span>
                    <small>声调</small>
                    {toneLabel(selected.candidate.reading.tone)}
                  </span>
                </div>
                {speakActions}
                {speechFeedback}
              </div>

              <HanziStrokeStage char={selected.candidate.char} />
            </>
          )}
        </section>
      ) : (
        <section className="hanzi-result-empty" aria-label="选字提示">
          <div className="hanzi-result-empty__grid" aria-hidden="true">
            <span>字</span>
          </div>
          <div>
            <h3>选词语或单字，听读音、看笔顺</h3>
            <p>
              输入拼音后，用数字键或鼠标选择词语或单字；词语可在右侧逐字查看田字格笔顺。
            </p>
          </div>
        </section>
      )}
    </div>
  )
}
