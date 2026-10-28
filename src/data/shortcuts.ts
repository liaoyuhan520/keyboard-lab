import {
  KEY_BY_CODE,
  MODIFIER_CODES,
  type KeyDef,
} from './keyboard'

export interface PopupData {
  readonly kicker: string
  readonly title: string
  readonly description: string
  readonly tokens: readonly string[]
  readonly tip?: string
  readonly separator?: 'plus' | 'dot'
}

interface ShortcutMatch {
  readonly code: string
  readonly ctrl?: boolean
  readonly shift?: boolean
  readonly alt?: boolean
  readonly meta?: boolean
}

export interface ShortcutDef extends PopupData {
  readonly id: ShortcutId
  readonly keys: readonly string[]
  readonly match?: ShortcutMatch
}

export type ShortcutId =
  | 'copy'
  | 'paste'
  | 'cut'
  | 'undo'
  | 'redo'
  | 'selectAll'
  | 'save'
  | 'find'
  | 'taskManager'
  | 'altTab'
  | 'altF4'
  | 'showDesktop'
  | 'explorer'
  | 'screenSnip'
  | 'snapLeft'
  | 'permanentDelete'
  | 'imeToggle'
  | 'digitOne'
  | 'letterQ'
  | 'deleteKey'
  | 'backspaceKey'
  | 'enterKey'
  | 'insertKey'
  | 'arrowUp'
  | 'arrowDown'
  | 'arrowLeft'
  | 'arrowRight'
  | 'navCluster'
  | 'mediaKeys'

export const SHORTCUTS: Record<ShortcutId, ShortcutDef> = {
  copy: {
    id: 'copy',
    kicker: 'EDITING · 编辑',
    title: '复制所选内容',
    description: '把选区送入剪贴板，原内容保持不变，是最常用的效率动作。',
    tokens: ['Ctrl', 'C'],
    keys: ['ControlLeft', 'KeyC'],
    match: { code: 'KeyC', ctrl: true },
  },
  paste: {
    id: 'paste',
    kicker: 'EDITING · 编辑',
    title: '粘贴剪贴板内容',
    description: '把刚刚复制的内容插入到当前光标位置，原内容仍在剪贴板中。',
    tokens: ['Ctrl', 'V'],
    keys: ['ControlLeft', 'KeyV'],
    match: { code: 'KeyV', ctrl: true },
  },
  cut: {
    id: 'cut',
    kicker: 'EDITING · 编辑',
    title: '剪切所选内容',
    description: '复制并移除所选内容，随后可在目标位置用 Ctrl + V 粘贴。',
    tokens: ['Ctrl', 'X'],
    keys: ['ControlLeft', 'KeyX'],
    match: { code: 'KeyX', ctrl: true },
  },
  undo: {
    id: 'undo',
    kicker: 'EDITING · 编辑',
    title: '撤销上一步操作',
    description: '快速恢复误删、误改的内容；连续按可逐步回退。',
    tokens: ['Ctrl', 'Z'],
    keys: ['ControlLeft', 'KeyZ'],
    match: { code: 'KeyZ', ctrl: true },
  },
  redo: {
    id: 'redo',
    kicker: 'EDITING · 编辑',
    title: '恢复被撤销的操作',
    description: '撤销过头时用它向前重做，多数编辑器支持连续重做。',
    tokens: ['Ctrl', 'Y'],
    keys: ['ControlLeft', 'KeyY'],
    match: { code: 'KeyY', ctrl: true },
  },
  selectAll: {
    id: 'selectAll',
    kicker: 'EDITING · 编辑',
    title: '全选当前内容',
    description: '选中当前文档、输入框或列表中的全部内容，再执行复制或替换。',
    tokens: ['Ctrl', 'A'],
    keys: ['ControlLeft', 'KeyA'],
    match: { code: 'KeyA', ctrl: true },
  },
  save: {
    id: 'save',
    kicker: 'EDITING · 编辑',
    title: '保存当前文件',
    description: '养成随手保存的习惯；大多数应用按一次即保存到原位置。',
    tokens: ['Ctrl', 'S'],
    keys: ['ControlLeft', 'KeyS'],
    match: { code: 'KeyS', ctrl: true },
  },
  find: {
    id: 'find',
    kicker: 'EDITING · 编辑',
    title: '在当前页面查找',
    description: '搜索文档或网页中的关键词，Enter 跳到下一处，Esc 退出查找。',
    tokens: ['Ctrl', 'F'],
    keys: ['ControlLeft', 'KeyF'],
    match: { code: 'KeyF', ctrl: true },
  },
  taskManager: {
    id: 'taskManager',
    kicker: 'SYSTEM · 系统',
    title: '打开任务管理器',
    description: '窗口无响应时的快速入口；也可查看 CPU、内存与启动项。',
    tokens: ['Ctrl', 'Shift', 'Esc'],
    keys: ['ControlLeft', 'ShiftLeft', 'Escape'],
    match: { code: 'Escape', ctrl: true, shift: true },
    tip: '三键组合优先于单键 Esc，不会误退出当前窗口。',
  },
  altTab: {
    id: 'altTab',
    kicker: 'SYSTEM · 系统',
    title: '切换打开的应用',
    description: '按住 Alt 连续点按 Tab，在窗口之间移动；松开 Alt 确认切换。',
    tokens: ['Alt', 'Tab'],
    keys: ['AltLeft', 'Tab'],
    match: { code: 'Tab', alt: true },
  },
  altF4: {
    id: 'altF4',
    kicker: 'SYSTEM · 系统',
    title: '关闭当前窗口',
    description: '关闭当前应用窗口；在桌面焦点下可打开 Windows 关机对话框。',
    tokens: ['Alt', 'F4'],
    keys: ['AltLeft', 'F4'],
    match: { code: 'F4', alt: true },
  },
  showDesktop: {
    id: 'showDesktop',
    kicker: 'WINDOW · 窗口',
    title: '显示 / 隐藏桌面',
    description: '瞬间收起所有窗口，再按一次即可恢复原来的工作现场。',
    tokens: ['Win', 'D'],
    keys: ['MetaLeft', 'KeyD'],
    match: { code: 'KeyD', meta: true },
  },
  explorer: {
    id: 'explorer',
    kicker: 'WINDOW · 窗口',
    title: '打开文件资源管理器',
    description: '无论当前在哪个应用，都能快速打开文件与文件夹。',
    tokens: ['Win', 'E'],
    keys: ['MetaLeft', 'KeyE'],
    match: { code: 'KeyE', meta: true },
  },
  screenSnip: {
    id: 'screenSnip',
    kicker: 'WINDOW · 窗口',
    title: '截取屏幕区域',
    description: '拖动选择区域，截图会直接进入剪贴板，可立刻用 Ctrl + V 粘贴。',
    tokens: ['Win', 'Shift', 'S'],
    keys: ['MetaLeft', 'ShiftLeft', 'KeyS'],
    match: { code: 'KeyS', meta: true, shift: true },
    tip: '常用变体：Alt + PrtSc 复制当前窗口。',
  },
  snapLeft: {
    id: 'snapLeft',
    kicker: 'WINDOW · 窗口',
    title: '窗口贴靠左半屏',
    description: '将当前窗口吸附到左侧，再按 Win + → 可组成双窗口工作流。',
    tokens: ['Win', '←'],
    keys: ['MetaLeft', 'ArrowLeft'],
    match: { code: 'ArrowLeft', meta: true },
  },
  permanentDelete: {
    id: 'permanentDelete',
    kicker: 'SAFETY · 安全',
    title: '永久删除文件',
    description: '跳过回收站直接删除，操作后通常无法恢复，请确认文件再按。',
    tokens: ['Shift', 'Delete'],
    keys: ['ShiftLeft', 'Delete'],
    match: { code: 'Delete', shift: true },
    tip: '这是破坏性操作，不建议作为日常习惯。',
  },
  imeToggle: {
    id: 'imeToggle',
    kicker: 'INPUT METHOD · 输入法',
    title: '单击 Shift 切换中英文',
    description: '单独轻按 Shift 后松开，在中文与英文输入之间切换。',
    tokens: ['Shift'],
    keys: ['ShiftLeft'],
    tip: 'Shift + 字母会被识别为组合输入，不会触发中英文切换。',
  },
  digitOne: {
    id: 'digitOne',
    kicker: 'KEY GUIDE · 数字键',
    title: '数字键 1',
    description: '输入数字 1；按住 Shift 可输入键帽上方的感叹号“!”。',
    tokens: ['1'],
    keys: ['Digit1'],
    tip: '数字行一键两用：直接按输入数字，Shift + 1 输入上档符号。',
  },
  letterQ: {
    id: 'letterQ',
    kicker: 'KEY GUIDE · 字母键',
    title: '字母键 Q',
    description: '直接输入小写 q；与 Shift 同时按下会输入大写 Q。',
    tokens: ['Q'],
    keys: ['KeyQ'],
    tip: '单击字母键是普通文本输入；Shift + 字母不会切换中英文。',
  },
  deleteKey: {
    id: 'deleteKey',
    kicker: 'KEY GUIDE · 编辑键',
    title: 'Delete · 删除右侧内容',
    description: '删除光标之后的字符或所选文件，与 Backspace 的删除方向相反。',
    tokens: ['Delete'],
    keys: ['Delete'],
    tip: '参考键盘的 Delete 位于顶行右侧，与 Insert / Home / End 同区。',
  },
  backspaceKey: {
    id: 'backspaceKey',
    kicker: 'KEY GUIDE · 编辑键',
    title: 'Backspace · 删除左侧字符',
    description: '删除光标前的内容；在浏览器中有时也能返回上一页。',
    tokens: ['Backspace'],
    keys: ['Backspace'],
    tip: 'Backspace 向左删，Delete 向右删，方向相反。',
  },
  enterKey: {
    id: 'enterKey',
    kicker: 'KEY GUIDE · 回车键',
    title: 'Enter · 确认 / 换行',
    description: '提交输入、确认操作，或在文本中另起一行。',
    tokens: ['Enter'],
    keys: ['Enter'],
    tip: 'Enter 完成确认或换行；在聊天与搜索框中通常直接发送。',
  },
  insertKey: {
    id: 'insertKey',
    kicker: 'KEY GUIDE · 编辑键',
    title: 'Insert · 插入 / 改写',
    description: '在文本编辑器中切换插入与改写模式，与 F12 共用键帽。',
    tokens: ['Insert'],
    keys: ['Insert'],
    tip: '参考键盘中 Insert 与 F12 共用一个键帽，位于顶行右侧。',
  },
  arrowUp: {
    id: 'arrowUp',
    kicker: 'KEY GUIDE · 方向键',
    title: '↑ 方向键 · 向上移动',
    description: '光标上移、切换菜单项或向上滚动页面。',
    tokens: ['↑'],
    keys: ['ArrowUp'],
    tip: '方向键是单键移动；与 Win 组合可控制窗口贴靠。',
  },
  arrowDown: {
    id: 'arrowDown',
    kicker: 'KEY GUIDE · 方向键',
    title: '↓ 方向键 · 向下移动',
    description: '光标下移、切换菜单项或向下滚动页面。',
    tokens: ['↓'],
    keys: ['ArrowDown'],
    tip: '在表格和菜单中，方向键常比鼠标更精准。',
  },
  arrowLeft: {
    id: 'arrowLeft',
    kicker: 'KEY GUIDE · 方向键',
    title: '← 方向键 · 向左移动',
    description: '光标左移；Win + ← 可将当前窗口贴靠到左半屏。',
    tokens: ['←'],
    keys: ['ArrowLeft'],
    tip: '方向键是最常用的导航键，适合逐字符或逐项移动。',
  },
  arrowRight: {
    id: 'arrowRight',
    kicker: 'KEY GUIDE · 方向键',
    title: '→ 方向键 · 向右移动',
    description: '光标右移；Win + → 可将当前窗口贴靠到右半屏。',
    tokens: ['→'],
    keys: ['ArrowRight'],
    tip: '配合 Ctrl 或 Shift，方向键可以按词移动或扩展选区。',
  },
  navCluster: {
    id: 'navCluster',
    kicker: 'KEY GUIDE · 键区',
    title: '导航键集群',
    description:
      'Home / End 到行首行尾，PgUp / PgDn 翻页，Delete 删右侧，Insert 切换改写。',
    tokens: ['Insert', 'Home', 'PgUp', 'Del', 'End', 'PgDn'],
    keys: ['Insert', 'Home', 'PageUp', 'Delete', 'End', 'PageDown'],
    separator: 'dot',
    tip: '参考键盘中 Insert 与 F12 共用一个键帽；Fn 位于左下角。',
  },
  mediaKeys: {
    id: 'mediaKeys',
    kicker: 'FUNCTION · 功能键',
    title: 'F7–F9 · 由应用定义',
    description:
      '笔记本 F7–F9 的印刷图标由厂商定义，应用也可能映射为媒体控制。',
    tokens: ['F7', 'F8', 'F9'],
    keys: ['F7', 'F8', 'F9'],
    separator: 'dot',
    tip: '参考图中 F7–F9 带系统图标；实际行为以厂商 Fn 层与当前应用为准。',
  },
}

export const SHORTCUT_LIST: readonly ShortcutDef[] = [
  SHORTCUTS.copy,
  SHORTCUTS.paste,
  SHORTCUTS.cut,
  SHORTCUTS.undo,
  SHORTCUTS.redo,
  SHORTCUTS.selectAll,
  SHORTCUTS.save,
  SHORTCUTS.find,
  SHORTCUTS.taskManager,
  SHORTCUTS.altTab,
  SHORTCUTS.altF4,
  SHORTCUTS.showDesktop,
  SHORTCUTS.explorer,
  SHORTCUTS.screenSnip,
  SHORTCUTS.snapLeft,
  SHORTCUTS.permanentDelete,
  SHORTCUTS.imeToggle,
  SHORTCUTS.digitOne,
  SHORTCUTS.letterQ,
  SHORTCUTS.deleteKey,
  SHORTCUTS.backspaceKey,
  SHORTCUTS.enterKey,
  SHORTCUTS.insertKey,
  SHORTCUTS.arrowUp,
  SHORTCUTS.arrowDown,
  SHORTCUTS.arrowLeft,
  SHORTCUTS.arrowRight,
  SHORTCUTS.navCluster,
  SHORTCUTS.mediaKeys,
]

export const getShortcutById = (id: ShortcutId): ShortcutDef => SHORTCUTS[id]

type MatchableShortcut = ShortcutDef & { readonly match: ShortcutMatch }

const countModifiers = (match: ShortcutMatch): number =>
  Number(Boolean(match.ctrl)) +
  Number(Boolean(match.shift)) +
  Number(Boolean(match.alt)) +
  Number(Boolean(match.meta))

/** 组合键按修饰键数量排序，三键组合优先于更简单的组合。 */
export const MATCHABLE_SHORTCUTS: readonly MatchableShortcut[] =
  SHORTCUT_LIST.filter(
    (shortcut): shortcut is MatchableShortcut => Boolean(shortcut.match),
  ).sort((a, b) => countModifiers(b.match) - countModifiers(a.match))

export const findShortcutForEvent = (
  event: KeyboardEvent,
): MatchableShortcut | null => {
  for (const shortcut of MATCHABLE_SHORTCUTS) {
    const match = shortcut.match
    if (event.code !== match.code) {
      continue
    }
    if (
      event.ctrlKey === Boolean(match.ctrl) &&
      event.shiftKey === Boolean(match.shift) &&
      event.altKey === Boolean(match.alt) &&
      event.metaKey === Boolean(match.meta)
    ) {
      return shortcut
    }
  }
  return null
}

export const getShortcutPopup = (shortcut: ShortcutDef): PopupData => ({
  kicker: shortcut.kicker,
  title: shortcut.title,
  description: shortcut.description,
  tokens: shortcut.tokens,
  tip: shortcut.tip,
  separator: shortcut.separator,
})

interface KeyHint {
  readonly title: string
  readonly description: string
  readonly tip?: string
}

export const SINGLE_KEY_HINTS: Partial<Record<string, KeyHint>> = {
  Escape: {
    title: '取消当前操作',
    description: '关闭弹窗、退出全屏或取消正在进行的输入。',
  },
  Tab: {
    title: '切换焦点',
    description: '在表单控件、按钮与链接之间移动；Shift + Tab 反向移动。',
  },
  CapsLock: {
    title: '大写锁定',
    description: '切换字母的大小写锁定；它不会切换中英文输入法。',
  },
  Backspace: {
    title: '删除左侧字符',
    description: '删除光标前的内容；在部分浏览器中可返回上一页。',
  },
  Enter: {
    title: '确认 / 换行',
    description: '提交表单、确认输入或插入一个新段落。',
  },
  Space: {
    title: '空格 / 播放暂停',
    description: '输入空格；在视频和音乐播放器中通常用于播放或暂停。',
  },
  ArrowUp: {
    title: '向上移动',
    description: '上移光标、选择菜单项或向上滚动页面。',
  },
  ArrowDown: {
    title: '向下移动',
    description: '下移光标、选择菜单项或向下滚动页面。',
  },
  ArrowLeft: {
    title: '向左移动',
    description: '左移光标；Win + ← 可将当前窗口贴靠左侧。',
  },
  ArrowRight: {
    title: '向右移动',
    description: '右移光标；Win + → 可将当前窗口贴靠右侧。',
  },
  Insert: {
    title: '插入 / 改写切换',
    description: '在文本编辑器中切换插入与改写模式；参考键盘中与 F12 共用键帽。',
  },
  Home: {
    title: '跳到行首',
    description: '光标移动到当前行开头；Ctrl + Home 跳到文档开头。',
  },
  End: {
    title: '跳到行尾',
    description: '光标移动到当前行末尾；Ctrl + End 跳到文档末尾。',
  },
  PageUp: {
    title: '向上翻页',
    description: '向上滚动一屏内容。',
  },
  PageDown: {
    title: '向下翻页',
    description: '向下滚动一屏内容。',
  },
  Delete: {
    title: '删除右侧内容',
    description: '删除光标后的字符或所选文件；Shift + Delete 可永久删除。',
  },
  ControlLeft: {
    title: 'Ctrl 组合键修饰键',
    description: '与字母、数字或功能键组合，触发编辑与系统命令。',
  },
  ControlRight: {
    title: 'Ctrl 组合键修饰键',
    description: '与字母、数字或功能键组合，触发编辑与系统命令。',
  },
  AltLeft: {
    title: 'Alt 组合键修饰键',
    description: '打开菜单栏或配合 Tab、F4 完成系统操作。',
  },
  AltRight: {
    title: 'Alt 组合键修饰键',
    description: '打开菜单栏或配合 Tab、F4 完成系统操作。',
  },
  MetaLeft: {
    title: 'Win 键',
    description: '打开开始菜单；配合 D / E / L / Tab / 方向键使用。',
  },
  MetaRight: {
    title: 'Win 键',
    description: '打开开始菜单；配合 D / E / L / Tab / 方向键使用。',
  },
  ContextMenu: {
    title: '打开上下文菜单',
    description: '在光标位置呼出与鼠标右键相同的菜单。',
  },
  Fn: {
    title: 'Fn · 第二功能层',
    description: '与 F1–F12 或其他按键组合，访问键帽上方的图标功能。',
    tip: '参考键盘左下角有 Fn；部分笔记本的 Fn 由硬件处理，浏览器可能收不到单独事件。',
  },
  Copilot: {
    title: 'Copilot 键',
    description: '部分 Windows 笔记本用于快速唤起 Copilot 或对应应用。',
    tip: '该键由设备和系统定义，不是所有键盘都有。',
  },
  F1: {
    title: 'F1 · 帮助',
    description: '多数应用中用于打开帮助文档。',
    tip: 'Fn + F1 可访问参考图键帽顶部的静音图标；具体以厂商定义为准。',
  },
  F2: {
    title: 'F2 · 重命名',
    description: '在文件资源管理器中重命名所选项目。',
  },
  F3: {
    title: 'F3 · 查找',
    description: '在部分应用中打开或继续查找下一项。',
  },
  F4: {
    title: 'F4 · 地址栏 / 关闭',
    description: 'Alt + F4 关闭当前窗口；在资源管理器中可聚焦地址栏。',
  },
  F5: {
    title: 'F5 · 刷新',
    description: '刷新浏览器页面或资源管理器内容。',
  },
  F6: {
    title: 'F6 · 焦点切换',
    description: '在浏览器中快速切换到地址栏。',
  },
  F7: {
    title: 'F7 · 应用自定义',
    description: '常见媒体映射为上一首；具体功能由当前应用定义。',
    tip: '参考图中的 F7 带系统图标；实际行为由厂商 Fn 层与当前应用共同决定。',
  },
  F8: {
    title: 'F8 · 应用自定义',
    description: '常见媒体映射为播放 / 暂停；具体功能由当前应用定义。',
    tip: '参考图中的 F8 带系统图标；实际行为由厂商 Fn 层与当前应用共同决定。',
  },
  F9: {
    title: 'F9 · 应用自定义',
    description: '常见媒体映射为下一首；具体功能由当前应用定义。',
    tip: '参考图中的 F9 带系统图标；实际行为由厂商 Fn 层与当前应用共同决定。',
  },
  F10: {
    title: 'F10 · 菜单',
    description: '在部分应用中激活菜单栏或打开应用菜单。',
  },
  F11: {
    title: 'F11 · 全屏',
    description: '浏览器中进入或退出全屏模式。',
  },
  F12: {
    title: 'F12 · 开发者工具',
    description: '浏览器中打开开发者工具；部分应用有自定义功能。',
    tip: '参考键盘中 F12 与 Insert 共用一个键帽，通常需通过 Fn 层触发。',
  },
}

export const getEventLabel = (event: KeyboardEvent): string => {
  const definition = KEY_BY_CODE.get(event.code)
  if (definition) {
    return getKeyDisplayLabel(definition)
  }
  if (/^Key[A-Z]$/.test(event.code)) {
    return event.code.slice(3)
  }
  if (/^Digit[0-9]$/.test(event.code)) {
    return event.code.slice(5)
  }
  return event.key.length === 1 ? event.key.toUpperCase() : event.key
}

const getKeyDisplayLabel = (definition: KeyDef): string => {
  if (definition.label) {
    return definition.label
  }
  if (definition.icon === 'win') {
    return 'Win'
  }
  if (definition.icon === 'copilot') {
    return 'Copilot'
  }
  if (definition.arrowDirection === 'up') {
    return '↑'
  }
  if (definition.arrowDirection === 'down') {
    return '↓'
  }
  if (definition.arrowDirection === 'left') {
    return '←'
  }
  if (definition.arrowDirection === 'right') {
    return '→'
  }
  return definition.code === 'Space' ? 'Space' : definition.code
}

const getSingleKeyPopup = (event: KeyboardEvent): PopupData => {
  const label = getEventLabel(event)
  const hint = SINGLE_KEY_HINTS[event.code]

  if (hint) {
    return {
      kicker: 'KEY GUIDE · 单键',
      title: hint.title,
      description: hint.description,
      tokens: [label],
      tip: hint.tip,
    }
  }

  if (/^Key[A-Z]$/.test(event.code)) {
    const letter = event.code.slice(3)
    return {
      kicker: 'KEY GUIDE · 字母',
      title: `字母键 ${letter}`,
      description: `直接输入小写 ${letter.toLowerCase()}；与 Shift 同按会输入大写。`,
      tokens: [letter],
      tip: '组合键优先匹配；单键说明只在没有命中组合时出现。',
    }
  }

  if (/^Digit[0-9]$/.test(event.code)) {
    const number = event.code.slice(5)
    return {
      kicker: 'KEY GUIDE · 数字',
      title: `数字键 ${number}`,
      description: '输入数字本身；按住 Shift 可输入键帽上方的符号。',
      tokens: [number],
    }
  }

  return {
    kicker: 'KEY GUIDE · 单键',
    title: `按键 ${label}`,
    description: '该键在部分应用中可能拥有独立功能或组合功能。',
    tokens: [label],
  }
}

const getShiftLetterPopup = (event: KeyboardEvent): PopupData => {
  const letter = event.code.slice(3)
  return {
    kicker: 'SHIFT · 大写输入',
    title: `输入大写 ${letter}`,
    description:
      'Shift 与字母同时按下会被识别为组合输入，因此不会触发中英文切换。',
    tokens: ['Shift', letter],
    tip: '只有单独按下并松开 Shift 时，才会切换中英文。',
  }
}

const getGenericComboPopup = (event: KeyboardEvent): PopupData => {
  const tokens: string[] = []
  if (event.ctrlKey) {
    tokens.push('Ctrl')
  }
  if (event.shiftKey) {
    tokens.push('Shift')
  }
  if (event.altKey) {
    tokens.push('Alt')
  }
  if (event.metaKey) {
    tokens.push('Win')
  }
  tokens.push(getEventLabel(event))

  return {
    kicker: 'LIVE INPUT · 组合键',
    title: '组合键已捕获',
    description:
      '当前应用可能为这个组合定义了专属功能；若没有响应，请检查应用的快捷键设置。',
    tokens,
    tip: '组合键会优先于单键识别。',
  }
}

/**
 * 实时物理按键的动作解析，顺序与视频一致：
 * 已登记组合键 → Shift + 字母 → 未知修饰键组合 → 单键。
 * 裸修饰键不弹出说明，避免按 Ctrl 后立刻被组合卡片替换造成闪烁。
 */
export const resolveLiveAction = (
  event: KeyboardEvent,
): PopupData | null => {
  const shortcut = findShortcutForEvent(event)
  if (shortcut) {
    return getShortcutPopup(shortcut)
  }

  if (
    event.shiftKey &&
    !event.ctrlKey &&
    !event.altKey &&
    !event.metaKey &&
    /^Key[A-Z]$/.test(event.code)
  ) {
    return getShiftLetterPopup(event)
  }

  if (
    !MODIFIER_CODES.has(event.code) &&
    (event.ctrlKey || event.altKey || event.metaKey)
  ) {
    return getGenericComboPopup(event)
  }

  if (MODIFIER_CODES.has(event.code)) {
    return null
  }

  return getSingleKeyPopup(event)
}
