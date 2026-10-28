import type { ArrowDirection, FunctionIcon } from '../data/keyboard'

export function WindowsMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      aria-hidden="true"
      className="glyph"
    >
      <rect x="0" y="0" width="5.4" height="5.4" fill="currentColor" />
      <rect x="6.6" y="0" width="5.4" height="5.4" fill="currentColor" />
      <rect x="0" y="6.6" width="5.4" height="5.4" fill="currentColor" />
      <rect x="6.6" y="6.6" width="5.4" height="5.4" fill="currentColor" />
    </svg>
  )
}

export function CopilotMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="glyph"
    >
      <path d="M8.9 5.2c2-2.1 5.2-1.6 6.1.9.9 2.4-1.1 4.8-3.8 4.1l-2.4-.7-2.3.7c-2.7.7-4.7-1.7-3.8-4.1.9-2.5 4.1-3 6.2-.9Z" />
      <path d="M8.1 12.1c-1.2 1.5-3.5 1.4-4.2-.2M11.9 12.1c1.2 1.5 3.5 1.4 4.2-.2" />
      <circle cx="16" cy="16" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FunctionGlyph({
  kind,
  size,
}: {
  kind: FunctionIcon
  size: number
}) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 20 20',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.35,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className: 'glyph',
  }

  switch (kind) {
    case 'mute':
      return (
        <svg {...common}>
          <path d="M3.5 8h2.8l3.5-2.8v9.6L6.3 12H3.5z" />
          <path d="m12.8 8.2 4 4m0-4-4 4" />
        </svg>
      )
    case 'keyboard':
      return (
        <svg {...common}>
          <rect x="2.8" y="6.2" width="14.4" height="8.2" rx="2" />
          <path d="M5.5 9h.9m2.1 0h.9m2.1 0h.9m2.1 0h.9M5.8 12h8.4" />
        </svg>
      )
    case 'volume':
      return (
        <svg {...common}>
          <path d="M3.2 8h2.9l3.5-2.9v9.8L6.1 12H3.2z" />
          <path d="M12.3 7.5a4.2 4.2 0 0 1 0 5M15 5.2a7.5 7.5 0 0 1 0 9.6" />
        </svg>
      )
    case 'mic':
      return (
        <svg {...common}>
          <rect x="7.5" y="2.8" width="5" height="9" rx="2.5" />
          <path d="M4.8 9.8a5.2 5.2 0 0 0 10.4 0M10 15v2.2" />
        </svg>
      )
    case 'brightness-down':
      return (
        <svg {...common}>
          <circle cx="10" cy="8.2" r="3" />
          <path d="M10 2.8v1.2M4.6 8.2H3.4m13.2 0h-1.2M6.2 4.4 5.3 3.5m9.4.9.9-.9M6.6 16.6 10 18.4l3.4-1.8" />
        </svg>
      )
    case 'brightness-up':
      return (
        <svg {...common}>
          <circle cx="10" cy="9" r="3" />
          <path d="M10 3.6v1.2M4.6 9H3.4m13.2 0h-1.2M6.2 5.2 5.3 4.3m9.4.9.9-.9M6.6 15.2 10 13.4l3.4 1.8" />
        </svg>
      )
    case 'windows-switch':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="9" height="8" rx="1.6" />
          <path d="M15.8 7.2v5.2a2.6 2.6 0 0 1-2.6 2.6H7.3" />
        </svg>
      )
    case 'plane':
      return (
        <svg {...common}>
          <path d="m10 2.8 1.5 5.1 4.7 2.9v1.3l-4.7-1.2-1.1 3.4 1.7 1.4v1L10 15.9l-2.1.8v-1l1.7-1.4-1.1-3.4-4.7 1.2v-1.3l4.7-2.9z" />
        </svg>
      )
    case 'star':
      return (
        <svg {...common}>
          <path d="m10 2.8 2 4.5 4.8.4-3.7 3.2 1.2 4.7L10 13l-4.3 2.6 1.2-4.7-3.7-3.2 4.8-.4z" />
        </svg>
      )
    case 'display-share':
      return (
        <svg {...common}>
          <rect x="2.8" y="4.2" width="10.4" height="7.6" rx="1.5" />
          <path d="M6.5 15.8h8.2M10.6 15.8V17M15.6 9.7h2.2v3.4" />
          <path d="m14.3 5.8 2.3 2.2-2.3 2.3" />
        </svg>
      )
    case 'display':
      return (
        <svg {...common}>
          <rect x="2.8" y="4.4" width="14.4" height="9.4" rx="1.6" />
          <path d="M7 16.4h6M10 13.8v2.6" />
        </svg>
      )
    case 'display-lock':
      return (
        <svg {...common}>
          <rect x="2.6" y="4.1" width="11.1" height="8.1" rx="1.5" />
          <path d="M6.2 15.9h5M8.6 12.2v2.4" />
          <rect x="12.4" y="11.6" width="4.8" height="4.2" rx="1" />
          <path d="M13.7 11.6v-1a1.1 1.1 0 0 1 2.2 0v1" />
        </svg>
      )
    default:
      return null
  }
}

const ARROW_POINTS: Record<ArrowDirection, string> = {
  up: '10 4.6 16 14.8 4 14.8',
  down: '10 15.4 4 5.2 16 5.2',
  left: '4.6 10 14.8 4 14.8 16',
  right: '15.4 10 5.2 16 5.2 4',
}

export function ArrowGlyph({ direction }: { direction: ArrowDirection }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="glyph"
    >
      <polygon
        points={ARROW_POINTS[direction]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PowerGlyph() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
      className="glyph"
    >
      <path d="M10 2.8v7.4" />
      <path d="M5.6 5.2a6.5 6.5 0 1 0 8.8 0" />
    </svg>
  )
}
