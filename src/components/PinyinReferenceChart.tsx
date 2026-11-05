import { useId } from 'react'
import {
  PINYIN_GROUPS,
  PINYIN_TOTAL,
  type PinyinGroupId,
} from '../data/pinyin'

const CHART_WIDTH = 340
const PADDING = 12
const TITLE_HEIGHT = 60
const SECTION_HEADER_HEIGHT = 17
const SECTION_ROW_HEIGHT = 25
const SECTION_BOTTOM = 6
const SECTION_GAP = 4
const CHART_BOTTOM = 8

const GROUP_STYLE: Readonly<
  Record<PinyinGroupId, { readonly columns: number; readonly accent: string }>
> = {
  initials: { columns: 8, accent: '#66e7f4' },
  'simple-finals': { columns: 6, accent: '#71f5b5' },
  'compound-finals': { columns: 9, accent: '#ffc968' },
  'front-nasals': { columns: 5, accent: '#8fb9ff' },
  'back-nasals': { columns: 4, accent: '#ff9bab' },
  'whole-syllables': { columns: 8, accent: '#c6a5ff' },
}

const CHART_SECTIONS = (() => {
  let top = TITLE_HEIGHT

  return PINYIN_GROUPS.map((group) => {
    const style = GROUP_STYLE[group.id]
    const rows = Math.ceil(group.items.length / style.columns)
    const height =
      SECTION_HEADER_HEIGHT + rows * SECTION_ROW_HEIGHT + SECTION_BOTTOM
    const section = {
      group,
      accent: style.accent,
      columns: style.columns,
      rows,
      top,
      height,
      cellWidth: (CHART_WIDTH - PADDING * 2) / style.columns,
    }
    top += height + SECTION_GAP
    return section
  })
})()

const CHART_HEIGHT =
  TITLE_HEIGHT +
  CHART_SECTIONS.reduce((sum, section) => sum + section.height, 0) +
  SECTION_GAP * (CHART_SECTIONS.length - 1) +
  CHART_BOTTOM

export function PinyinReferenceChart() {
  const uid = useId().replaceAll(':', '')
  const backgroundId = `pinyin-chart-bg-${uid}`
  const glowId = `pinyin-chart-glow-${uid}`
  const titleId = `pinyin-chart-title-${uid}`
  const descriptionId = `pinyin-chart-description-${uid}`

  return (
    <svg
      className="pinyin-chart"
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      role="img"
      aria-labelledby={`${titleId} ${descriptionId}`}
    >
      <title id={titleId}>汉语拼音字母表矢量重绘</title>
      <desc id={descriptionId}>
        包含 23 个声母、6 个单韵母、9 个复韵母与特殊韵母、5 个前鼻韵母、
        4 个后鼻韵母和 16 个整体认读音节，并按网页暗色风格重新绘制。
      </desc>

      <defs>
        <linearGradient id={backgroundId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#132023" />
          <stop offset="55%" stopColor="#0f191a" />
          <stop offset="100%" stopColor="#0b1314" />
        </linearGradient>
        <radialGradient id={glowId} cx="92%" cy="0%" r="72%">
          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.11" />
          <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        rx="12"
        fill={`url(#${backgroundId})`}
      />
      <rect
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        rx="12"
        fill={`url(#${glowId})`}
      />
      <path
        d={`M 24 0.5 H ${CHART_WIDTH - 24}`}
        stroke="#00e5ff"
        strokeOpacity="0.32"
        strokeWidth="1"
      />

      <g style={{ fontFamily: 'var(--mono)' }}>
        <text
          x={PADDING}
          y="15"
          fill="#5b8e93"
          fontSize="6.5"
          fontWeight="650"
          letterSpacing="1.4"
        >
          REFERENCE · {PINYIN_TOTAL} CLIPS
        </text>
        <text
          x={PADDING}
          y="36"
          fill="#e7f4f5"
          fontSize="19"
          fontWeight="700"
          letterSpacing="-0.6"
        >
          汉语拼音字母表
        </text>
        <text
          x={PADDING}
          y="50"
          fill="#6f8386"
          fontSize="7.5"
          letterSpacing="0.2"
        >
          声母 · 韵母 · 整体认读音节
        </text>
        <text
          x={CHART_WIDTH - PADDING}
          y="44"
          fill="#71f5b5"
          fillOpacity="0.12"
          fontSize="38"
          fontWeight="620"
          textAnchor="end"
        >
          ü
        </text>
      </g>

      {CHART_SECTIONS.map((section) => (
        <g key={section.group.id}>
          <rect
            x={PADDING - 5}
            y={section.top}
            width={CHART_WIDTH - (PADDING - 5) * 2}
            height={section.height}
            rx="8"
            fill={section.accent}
            fillOpacity="0.032"
            stroke={section.accent}
            strokeOpacity="0.11"
          />

          <rect
            x={PADDING}
            y={section.top + 5}
            width="2.5"
            height="8"
            rx="1.25"
            fill={section.accent}
          />

          <g style={{ fontFamily: 'var(--sans)' }}>
            <text
              x={PADDING + 8}
              y={section.top + 12.5}
              fill="#d9e9ea"
              fontSize="9.5"
              fontWeight="650"
            >
              {section.group.title}
            </text>
            <text
              x={CHART_WIDTH - PADDING}
              y={section.top + 12.5}
              fill={section.accent}
              fillOpacity="0.72"
              fontSize="7"
              textAnchor="end"
              style={{ fontFamily: 'var(--mono)' }}
            >
              {section.group.items.length} 个
            </text>
          </g>

          {section.group.items.map((item, index) => {
            const column = index % section.columns
            const row = Math.floor(index / section.columns)
            const centerX =
              PADDING + column * section.cellWidth + section.cellWidth / 2
            const rowTop =
              section.top +
              SECTION_HEADER_HEIGHT +
              row * SECTION_ROW_HEIGHT

            return (
              <g key={item.id}>
                <text
                  x={centerX}
                  y={rowTop + 11.5}
                  fill={section.accent}
                  fontSize="11"
                  fontWeight="620"
                  textAnchor="middle"
                  style={{ fontFamily: 'var(--mono)' }}
                >
                  {item.label}
                </text>
                <text
                  x={centerX}
                  y={rowTop + 20}
                  fill="#718487"
                  fontSize="7.5"
                  textAnchor="middle"
                  style={{ fontFamily: 'var(--sans)' }}
                >
                  {item.mnemonic}
                </text>
              </g>
            )
          })}
        </g>
      ))}
    </svg>
  )
}
