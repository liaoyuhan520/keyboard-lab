export type KeyKind = 'normal' | 'modifier' | 'function' | 'nav' | 'arrow'

export type FunctionIcon =
  | 'mute'
  | 'keyboard'
  | 'volume'
  | 'mic'
  | 'brightness-down'
  | 'brightness-up'
  | 'windows-switch'
  | 'plane'
  | 'star'
  | 'display-share'
  | 'display'
  | 'display-lock'

export type ArrowDirection = 'up' | 'down' | 'left' | 'right'

export interface KeyDef {
  readonly code: string
  readonly label: string
  readonly subLabel?: string
  readonly hintLabel?: string
  readonly width?: number
  readonly kind?: KeyKind
  readonly fontSize?: number
  readonly icon?: 'win' | 'copilot'
  readonly functionIcon?: FunctionIcon
  readonly arrowDirection?: ArrowDirection
}

export const KEYBOARD_WIDTH = 1500
export const KEYBOARD_CONTENT_WIDTH = 1456
export const KEYBOARD_HEIGHT = 522
export const KEY_GAP = 6

/**
 * 顶行 16 键：Esc、F1–F11、Insert/F12 二合一键、Home、End、Delete。
 * 布局与视频中的参考键盘保持一致。
 */
export const FUNCTION_ROW: readonly KeyDef[] = [
  {
    code: 'Escape',
    label: 'esc',
    hintLabel: 'fn lock',
    kind: 'function',
    width: 0.96,
    fontSize: 8.8,
  },
  { code: 'F1', label: 'F1', functionIcon: 'mute', kind: 'function', width: 0.84 },
  {
    code: 'F2',
    label: 'F2',
    functionIcon: 'keyboard',
    kind: 'function',
    width: 0.84,
  },
  {
    code: 'F3',
    label: 'F3',
    functionIcon: 'volume',
    kind: 'function',
    width: 0.84,
  },
  { code: 'F4', label: 'F4', functionIcon: 'mic', kind: 'function', width: 0.84 },
  {
    code: 'F5',
    label: 'F5',
    functionIcon: 'brightness-down',
    kind: 'function',
    width: 0.84,
  },
  {
    code: 'F6',
    label: 'F6',
    functionIcon: 'brightness-up',
    kind: 'function',
    width: 0.84,
  },
  {
    code: 'F7',
    label: 'F7',
    functionIcon: 'windows-switch',
    kind: 'function',
    width: 0.84,
  },
  {
    code: 'F8',
    label: 'F8',
    functionIcon: 'plane',
    kind: 'function',
    width: 0.84,
  },
  { code: 'F9', label: 'F9', functionIcon: 'star', kind: 'function', width: 0.84 },
  {
    code: 'F10',
    label: 'F10',
    functionIcon: 'display-share',
    kind: 'function',
    width: 0.84,
  },
  {
    code: 'F11',
    label: 'F11',
    functionIcon: 'display',
    kind: 'function',
    width: 0.84,
  },
  {
    code: 'Insert',
    label: 'insert',
    hintLabel: 'F12',
    functionIcon: 'display-lock',
    kind: 'function',
    width: 0.92,
    fontSize: 9.2,
  },
  {
    code: 'Home',
    label: 'home',
    kind: 'function',
    width: 1.06,
    fontSize: 10.2,
  },
  {
    code: 'End',
    label: 'end',
    kind: 'function',
    width: 1.04,
    fontSize: 10.2,
  },
  {
    code: 'Delete',
    label: 'delete',
    kind: 'function',
    width: 1.08,
    fontSize: 10.2,
  },
]

export const NUMBER_ROW: readonly KeyDef[] = [
  { code: 'Backquote', label: '`', subLabel: '~' },
  { code: 'Digit1', label: '1', subLabel: '!' },
  { code: 'Digit2', label: '2', subLabel: '@' },
  { code: 'Digit3', label: '3', subLabel: '#' },
  { code: 'Digit4', label: '4', subLabel: '$' },
  { code: 'Digit5', label: '5', subLabel: '%' },
  { code: 'Digit6', label: '6', subLabel: '^' },
  { code: 'Digit7', label: '7', subLabel: '&' },
  { code: 'Digit8', label: '8', subLabel: '*' },
  { code: 'Digit9', label: '9', subLabel: '(' },
  { code: 'Digit0', label: '0', subLabel: ')' },
  { code: 'Minus', label: '-', subLabel: '_' },
  { code: 'Equal', label: '=', subLabel: '+' },
  {
    code: 'Backspace',
    label: 'backspace',
    width: 2.2,
    kind: 'modifier',
    fontSize: 11,
  },
]

export const QWERTY_ROW: readonly KeyDef[] = [
  {
    code: 'Tab',
    label: 'tab',
    width: 1.5,
    kind: 'modifier',
    fontSize: 11,
  },
  { code: 'KeyQ', label: 'Q' },
  { code: 'KeyW', label: 'W' },
  { code: 'KeyE', label: 'E' },
  { code: 'KeyR', label: 'R' },
  { code: 'KeyT', label: 'T' },
  { code: 'KeyY', label: 'Y' },
  { code: 'KeyU', label: 'U' },
  { code: 'KeyI', label: 'I' },
  { code: 'KeyO', label: 'O' },
  { code: 'KeyP', label: 'P' },
  { code: 'BracketLeft', label: '[', subLabel: '{' },
  { code: 'BracketRight', label: ']', subLabel: '}' },
  { code: 'Backslash', label: '\\', subLabel: '|', width: 1.5 },
]

export const HOME_ROW: readonly KeyDef[] = [
  {
    code: 'CapsLock',
    label: 'caps lock',
    width: 1.8,
    kind: 'modifier',
    fontSize: 10.4,
  },
  { code: 'KeyA', label: 'A' },
  { code: 'KeyS', label: 'S' },
  { code: 'KeyD', label: 'D' },
  { code: 'KeyF', label: 'F' },
  { code: 'KeyG', label: 'G' },
  { code: 'KeyH', label: 'H' },
  { code: 'KeyJ', label: 'J' },
  { code: 'KeyK', label: 'K' },
  { code: 'KeyL', label: 'L' },
  { code: 'Semicolon', label: ';', subLabel: ':' },
  { code: 'Quote', label: "'", subLabel: '"' },
  {
    code: 'Enter',
    label: 'enter',
    width: 2.3,
    kind: 'modifier',
    fontSize: 11,
  },
]

export const BOTTOM_ROW: readonly KeyDef[] = [
  {
    code: 'ShiftLeft',
    label: 'shift',
    width: 2.3,
    kind: 'modifier',
    fontSize: 11,
  },
  { code: 'KeyZ', label: 'Z' },
  { code: 'KeyX', label: 'X' },
  { code: 'KeyC', label: 'C' },
  { code: 'KeyV', label: 'V' },
  { code: 'KeyB', label: 'B' },
  { code: 'KeyN', label: 'N' },
  { code: 'KeyM', label: 'M' },
  { code: 'Comma', label: ',', subLabel: '<' },
  { code: 'Period', label: '.', subLabel: '>' },
  { code: 'Slash', label: '/', subLabel: '?' },
  {
    code: 'ShiftRight',
    label: 'shift',
    width: 2.5,
    kind: 'modifier',
    fontSize: 11,
  },
]

export const BOTTOM_MAIN_KEYS: readonly KeyDef[] = [
  {
    code: 'ControlLeft',
    label: 'ctrl',
    width: 1,
    kind: 'modifier',
    fontSize: 11,
  },
  { code: 'Fn', label: 'fn', width: 1, kind: 'modifier', fontSize: 11 },
  { code: 'MetaLeft', label: '', width: 1, kind: 'modifier', icon: 'win' },
  { code: 'AltLeft', label: 'alt', width: 1, kind: 'modifier', fontSize: 10.5 },
  { code: 'Space', label: '', width: 6.5, kind: 'modifier' },
  { code: 'AltRight', label: 'alt', width: 1, kind: 'modifier', fontSize: 10.5 },
  { code: 'Copilot', label: '', width: 1, kind: 'modifier', icon: 'copilot' },
]

export const ARROW_TOP_KEYS: readonly KeyDef[] = [
  { code: 'PageUp', label: 'pg up', width: 1, kind: 'nav', fontSize: 9.5 },
  {
    code: 'ArrowUp',
    label: '',
    width: 1,
    kind: 'arrow',
    arrowDirection: 'up',
  },
  { code: 'PageDown', label: 'pg dn', width: 1, kind: 'nav', fontSize: 9.5 },
]

export const ARROW_BOTTOM_KEYS: readonly KeyDef[] = [
  {
    code: 'ArrowLeft',
    label: '',
    width: 1,
    kind: 'arrow',
    arrowDirection: 'left',
  },
  {
    code: 'ArrowDown',
    label: '',
    width: 1,
    kind: 'arrow',
    arrowDirection: 'down',
  },
  {
    code: 'ArrowRight',
    label: '',
    width: 1,
    kind: 'arrow',
    arrowDirection: 'right',
  },
]

export const ALL_KEYS: readonly KeyDef[] = [
  ...FUNCTION_ROW,
  ...NUMBER_ROW,
  ...QWERTY_ROW,
  ...HOME_ROW,
  ...BOTTOM_ROW,
  ...BOTTOM_MAIN_KEYS,
  ...ARROW_TOP_KEYS,
  ...ARROW_BOTTOM_KEYS,
]

export const KEY_BY_CODE = new Map<string, KeyDef>(
  ALL_KEYS.map((key) => [key.code, key]),
)

export const SHIFT_CODES = new Set(['ShiftLeft', 'ShiftRight'])

export const MODIFIER_CODES = new Set([
  'ShiftLeft',
  'ShiftRight',
  'ControlLeft',
  'ControlRight',
  'AltLeft',
  'AltRight',
  'MetaLeft',
  'MetaRight',
  'Fn',
])
