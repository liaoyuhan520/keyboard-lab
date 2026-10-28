import {
  getShortcutById,
  getShortcutPopup,
  type PopupData,
  type ShortcutId,
} from './shortcuts'

export const DEMO_FPS = 30
export const DEMO_START_FRAME = 60
export const DEMO_END_FRAME = 2080
export const DEMO_POPUP_DURATION_FRAMES = 60

export interface DemoStep {
  readonly shortcutId: ShortcutId
  readonly start: number
  readonly end: number
}

/**
 * 29 段脚本演示，与 Remotion 视频使用同一套节奏：
 * 每段高亮 60 帧（2 秒），段间留 10 帧空白。
 */
export const DEMO_TIMELINE: readonly DemoStep[] = [
  { shortcutId: 'copy', start: 60, end: 120 },
  { shortcutId: 'paste', start: 130, end: 190 },
  { shortcutId: 'cut', start: 200, end: 260 },
  { shortcutId: 'undo', start: 270, end: 330 },
  { shortcutId: 'redo', start: 340, end: 400 },
  { shortcutId: 'selectAll', start: 410, end: 470 },
  { shortcutId: 'save', start: 480, end: 540 },
  { shortcutId: 'find', start: 550, end: 610 },
  { shortcutId: 'taskManager', start: 620, end: 680 },
  { shortcutId: 'altTab', start: 690, end: 750 },
  { shortcutId: 'altF4', start: 760, end: 820 },
  { shortcutId: 'showDesktop', start: 830, end: 890 },
  { shortcutId: 'explorer', start: 900, end: 960 },
  { shortcutId: 'screenSnip', start: 970, end: 1030 },
  { shortcutId: 'snapLeft', start: 1040, end: 1100 },
  { shortcutId: 'permanentDelete', start: 1110, end: 1170 },
  { shortcutId: 'imeToggle', start: 1180, end: 1240 },
  { shortcutId: 'digitOne', start: 1250, end: 1310 },
  { shortcutId: 'letterQ', start: 1320, end: 1380 },
  { shortcutId: 'deleteKey', start: 1390, end: 1450 },
  { shortcutId: 'backspaceKey', start: 1460, end: 1520 },
  { shortcutId: 'enterKey', start: 1530, end: 1590 },
  { shortcutId: 'insertKey', start: 1600, end: 1660 },
  { shortcutId: 'arrowUp', start: 1670, end: 1730 },
  { shortcutId: 'arrowDown', start: 1740, end: 1800 },
  { shortcutId: 'arrowLeft', start: 1810, end: 1870 },
  { shortcutId: 'arrowRight', start: 1880, end: 1940 },
  { shortcutId: 'navCluster', start: 1950, end: 2010 },
  { shortcutId: 'mediaKeys', start: 2020, end: 2080 },
]

export const DEMO_TOTAL_STEPS = DEMO_TIMELINE.length

export interface DemoPopup {
  readonly data: PopupData
  readonly stepNumber: number
  readonly key: string
}

export const getDemoKeysAtFrame = (frame: number): Set<string> => {
  const activeCodes = new Set<string>()
  for (const step of DEMO_TIMELINE) {
    if (frame >= step.start && frame < step.end) {
      const shortcut = getShortcutById(step.shortcutId)
      for (const code of shortcut.keys) {
        activeCodes.add(code)
      }
    }
  }
  return activeCodes
}

export const getDemoPopupAtFrame = (frame: number): DemoPopup | null => {
  for (let index = DEMO_TIMELINE.length - 1; index >= 0; index -= 1) {
    const step = DEMO_TIMELINE[index]
    if (
      frame >= step.start &&
      frame < step.start + DEMO_POPUP_DURATION_FRAMES
    ) {
      return {
        data: getShortcutPopup(getShortcutById(step.shortcutId)),
        stepNumber: index + 1,
        key: `${step.shortcutId}-${step.start}`,
      }
    }
  }
  return null
}

export const getDemoStepNumberAtFrame = (frame: number): number => {
  let current = 0
  for (let index = 0; index < DEMO_TIMELINE.length; index += 1) {
    if (frame >= DEMO_TIMELINE[index].start) {
      current = index + 1
    } else {
      break
    }
  }
  return current
}

/** 自动演示里的 Shift 步骤只改变展示状态，不写入用户输入法状态。 */
export const getDemoImeChinese = (frame: number): boolean => {
  const imeStep = DEMO_TIMELINE.find(
    (step) => step.shortcutId === 'imeToggle',
  )
  return imeStep ? frame < imeStep.start : true
}
