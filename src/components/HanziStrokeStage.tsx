import { useCallback, useEffect, useRef, useState } from 'react'
import HanziWriter, {
  type CharacterJson,
} from 'hanzi-writer'

const STROKE_DATA_BASES = [
  'https://fastly.jsdelivr.net/npm/hanzi-writer-data@2.0.1/',
  'https://unpkg.com/hanzi-writer-data@2.0.1/',
] as const

const strokeDataCache = new Map<string, CharacterJson>()
const strokeDataRequests = new Map<string, Promise<CharacterJson>>()

const isCharacterJson = (value: unknown): value is CharacterJson => {
  if (!value || typeof value !== 'object') {
    return false
  }
  const data = value as Partial<CharacterJson>
  return Array.isArray(data.strokes) && Array.isArray(data.medians)
}

const fetchStrokeData = async (char: string): Promise<CharacterJson> => {
  const cached = strokeDataCache.get(char)
  if (cached) {
    return cached
  }

  const pending = strokeDataRequests.get(char)
  if (pending) {
    return pending
  }

  const request = (async (): Promise<CharacterJson> => {
    let lastError: unknown = null

    for (const baseUrl of STROKE_DATA_BASES) {
      try {
        const timeout =
          typeof AbortSignal.timeout === 'function'
            ? AbortSignal.timeout(10000)
            : undefined
        const response = await fetch(
          `${baseUrl}${encodeURIComponent(char)}.json`,
          { signal: timeout },
        )
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const data: unknown = await response.json()
        if (!isCharacterJson(data)) {
          throw new Error('Invalid stroke data')
        }
        strokeDataCache.set(char, data)
        return data
      } catch (error) {
        lastError = error
      }
    }

    throw lastError instanceof Error
      ? lastError
      : new Error('Unable to load stroke data')
  })()

  strokeDataRequests.set(char, request)

  try {
    return await request
  } finally {
    strokeDataRequests.delete(char)
  }
}

interface HanziStrokeStageProps {
  readonly char: string
}

type StrokeStatus = 'ready' | 'error'

interface StrokeLoadResult {
  readonly char: string
  readonly attempt: number
  readonly status: StrokeStatus
  readonly data: CharacterJson | null
}

export function HanziStrokeStage({ char }: HanziStrokeStageProps) {
  const [loadResult, setLoadResult] = useState<StrokeLoadResult | null>(null)
  const [retryKey, setRetryKey] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const writerRef = useRef<HanziWriter | null>(null)

  const isCurrent =
    loadResult?.char === char && loadResult.attempt === retryKey
  const status: 'loading' | StrokeStatus = isCurrent
    ? (loadResult?.status ?? 'loading')
    : 'loading'
  const strokeData =
    isCurrent && loadResult?.status === 'ready' ? loadResult.data : null
  const strokeCount = strokeData ? strokeData.strokes.length : null

  useEffect(() => {
    let cancelled = false

    void fetchStrokeData(char)
      .then((data) => {
        if (cancelled) {
          return
        }
        setLoadResult({
          char,
          attempt: retryKey,
          status: 'ready',
          data,
        })
      })
      .catch(() => {
        if (!cancelled) {
          setLoadResult({
            char,
            attempt: retryKey,
            status: 'error',
            data: null,
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [char, retryKey])

  useEffect(() => {
    if (!strokeData || !containerRef.current) {
      return
    }

    const container = containerRef.current
    container.innerHTML = ''
    const writer = HanziWriter.create(container, char, {
      width: 300,
      height: 300,
      padding: 14,
      showOutline: true,
      showCharacter: false,
      strokeColor: '#e8feff',
      radicalColor: '#71f5b5',
      outlineColor: '#30484b',
      highlightColor: '#00e5ff',
      strokeAnimationSpeed: 0.9,
      delayBetweenStrokes: 260,
      charDataLoader: () => strokeData,
    })
    writerRef.current = writer

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const animationFrame = window.requestAnimationFrame(() => {
      if (reduceMotion) {
        void writer.showCharacter()
      } else {
        void writer.animateCharacter()
      }
    })

    return () => {
      window.cancelAnimationFrame(animationFrame)
      writer.cancelQuiz()
      container.innerHTML = ''
      if (writerRef.current === writer) {
        writerRef.current = null
      }
    }
  }, [char, strokeData])

  const replay = useCallback((): void => {
    if (writerRef.current) {
      void writerRef.current.animateCharacter()
    }
  }, [])

  const retry = useCallback((): void => {
    setRetryKey((current) => current + 1)
  }, [])

  return (
    <div className="hanzi-stroke-stage">
      <header className="hanzi-stroke-stage__header">
        <div>
          <div className="hanzi-section-eyebrow">TIANZIGE · STROKE ORDER</div>
          <h3>田字格动态笔顺</h3>
        </div>
        <span className="hanzi-stroke-stage__count">
          {strokeCount === null ? '--' : `${strokeCount} 画`}
        </span>
      </header>

      <div className="hanzi-tianzige">
        <span
          className="hanzi-tianzige__guide hanzi-tianzige__guide--vertical"
          aria-hidden="true"
        />
        <span
          className="hanzi-tianzige__guide hanzi-tianzige__guide--horizontal"
          aria-hidden="true"
        />
        <div
          className="hanzi-tianzige__canvas"
          ref={containerRef}
          role="img"
          aria-label={`${char} 的动态笔顺`}
        />

        {status !== 'ready' ? (
          <div
            className={`hanzi-stroke-stage__overlay${
              status === 'error' ? ' is-error' : ''
            }`}
            role="status"
          >
            {status === 'loading' ? (
              <>
                <span className="hanzi-spinner" aria-hidden="true" />
                <strong>正在加载笔顺…</strong>
                <small>首次查看这个字需要联网</small>
              </>
            ) : (
              <>
                <strong>笔顺数据加载失败</strong>
                <small>请检查网络后重试，汉字和拼音仍可正常查看</small>
                <button
                  type="button"
                  className="hanzi-secondary-button"
                  onClick={retry}
                >
                  重新加载笔顺
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>

      <div className="hanzi-stroke-stage__footer">
        <span>
          {status === 'ready'
            ? `共 ${strokeCount ?? 0} 画 · 按正确笔顺自动演示`
            : '笔顺数据按需从公共字库加载'}
        </span>
        <button
          type="button"
          className="hanzi-secondary-button"
          onClick={replay}
          disabled={status !== 'ready'}
        >
          重播笔顺
        </button>
      </div>
    </div>
  )
}
