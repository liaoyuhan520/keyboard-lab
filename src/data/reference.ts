export interface KeyReferenceEntry {
  readonly key: string
  readonly detail: string
}

export interface KeyReferenceGroup {
  readonly id: string
  readonly title: string
  readonly caption: string
  readonly entries: readonly KeyReferenceEntry[]
}

/**
 * 标准 87 键通用说明：16（功能键）+ 14 + 14 + 13 + 12 + 8 + 10 = 87。
 * 当前可交互模型是参考图中的 82 键紧凑版本，差异见 COMPACT_LAYOUT_NOTES。
 */
export const KEY_REFERENCE_GROUPS: readonly KeyReferenceGroup[] = [
  {
    id: 'function-row',
    title: '功能键区',
    caption: '16 键 · 功能与系统入口',
    entries: [
      { key: 'Esc', detail: '取消当前操作、退出全屏，或关闭弹窗与菜单。' },
      { key: 'F1', detail: '打开帮助；部分应用用于其他快捷功能。' },
      { key: 'F2', detail: '文件资源管理器中重命名所选项目。' },
      { key: 'F3', detail: '查找下一项；不同应用的实现可能不同。' },
      { key: 'F4', detail: '聚焦地址栏；Alt + F4 关闭当前窗口。' },
      { key: 'F5', detail: '刷新当前页面或资源管理器。' },
      { key: 'F6', detail: '在浏览器中快速切换焦点到地址栏。' },
      { key: 'F7', detail: '应用 / Fn 层自定义；参考键盘印有系统图标。' },
      { key: 'F8', detail: '应用 / Fn 层自定义，常见于媒体或飞行模式。' },
      { key: 'F9', detail: '应用 / Fn 层自定义；行为以设备和软件为准。' },
      { key: 'F10', detail: '激活菜单栏或应用菜单。' },
      { key: 'F11', detail: '浏览器进入或退出全屏。' },
      { key: 'F12', detail: '浏览器开发者工具；参考键盘与 Insert 共用键帽。' },
      { key: 'PrtSc', detail: '截取屏幕到剪贴板；Alt + PrtSc 只截当前窗口。' },
      { key: 'ScrLk', detail: '传统滚动锁定键，现代应用较少使用。' },
      { key: 'Pause', detail: '传统暂停 / Break 键，现代应用较少使用。' },
    ],
  },
  {
    id: 'number-row',
    title: '数字符号行',
    caption: '14 键 · 数字、上档符号与退格',
    entries: [
      { key: '` / ~', detail: '反引号与波浪号；常用于代码与命令行。' },
      { key: '1 / !', detail: '输入数字 1；Shift + 1 输入感叹号。' },
      { key: '2 / @', detail: '输入数字 2；Shift + 2 输入 @。' },
      { key: '3 / #', detail: '输入数字 3；Shift + 3 输入井号。' },
      { key: '4 / $', detail: '输入数字 4；Shift + 4 输入美元符号。' },
      { key: '5 / %', detail: '输入数字 5；Shift + 5 输入百分号。' },
      { key: '6 / ^', detail: '输入数字 6；Shift + 6 输入脱字符。' },
      { key: '7 / &', detail: '输入数字 7；Shift + 7 输入 &。' },
      { key: '8 / *', detail: '输入数字 8；Shift + 8 输入星号。' },
      { key: '9 / (', detail: '输入数字 9；Shift + 9 输入左括号。' },
      { key: '0 / )', detail: '输入数字 0；Shift + 0 输入右括号。' },
      { key: '- / _', detail: '输入连字符；Shift 后输入下划线。' },
      { key: '= / +', detail: '输入等号；Shift 后输入加号。' },
      { key: 'Backspace', detail: '删除光标左侧字符；浏览器中有时用于返回上一页。' },
    ],
  },
  {
    id: 'qwerty-row',
    title: 'QWERTY 字母行',
    caption: '14 键 · 字母与中括号',
    entries: [
      { key: 'Tab', detail: '切换焦点；Shift + Tab 反向切换。' },
      { key: 'Q', detail: '输入字母 Q；与 Shift 同按输入大写。' },
      { key: 'W', detail: '输入字母 W。' },
      { key: 'E', detail: '输入字母 E。' },
      { key: 'R', detail: '输入字母 R。' },
      { key: 'T', detail: '输入字母 T。' },
      { key: 'Y', detail: '输入字母 Y。' },
      { key: 'U', detail: '输入字母 U。' },
      { key: 'I', detail: '输入字母 I。' },
      { key: 'O', detail: '输入字母 O。' },
      { key: 'P', detail: '输入字母 P。' },
      { key: '[ / {', detail: '左中括号；Shift 后输入左花括号。' },
      { key: '] / }', detail: '右中括号；Shift 后输入右花括号。' },
      { key: '\\ / |', detail: '反斜杠；Shift 后输入竖线。' },
    ],
  },
  {
    id: 'home-row',
    title: '主行（Home Row）',
    caption: '13 键 · 基准指位',
    entries: [
      { key: 'Caps Lock', detail: '锁定字母大小写；不负责切换中英文输入法。' },
      { key: 'A', detail: '输入字母 A。' },
      { key: 'S', detail: '输入字母 S。' },
      { key: 'D', detail: '输入字母 D。' },
      { key: 'F', detail: '输入字母 F；也是键盘定位基准键之一。' },
      { key: 'G', detail: '输入字母 G。' },
      { key: 'H', detail: '输入字母 H。' },
      { key: 'J', detail: '输入字母 J；键帽凸点帮助盲打定位。' },
      { key: 'K', detail: '输入字母 K。' },
      { key: 'L', detail: '输入字母 L。' },
      { key: '; / :', detail: '输入分号；Shift 后输入冒号。' },
      { key: "' / \"", detail: '输入单引号；Shift 后输入双引号。' },
      { key: 'Enter', detail: '确认、提交或换行。' },
    ],
  },
  {
    id: 'bottom-letter-row',
    title: '下排字母行',
    caption: '12 键 · Shift 与标点',
    entries: [
      { key: 'Shift（左）', detail: '按住输入大写字母或上档符号。' },
      { key: 'Z', detail: '输入字母 Z。' },
      { key: 'X', detail: '输入字母 X；也常为剪切快捷键的一部分。' },
      { key: 'C', detail: '输入字母 C；Ctrl + C 为复制。' },
      { key: 'V', detail: '输入字母 V；Ctrl + V 为粘贴。' },
      { key: 'B', detail: '输入字母 B。' },
      { key: 'N', detail: '输入字母 N。' },
      { key: 'M', detail: '输入字母 M。' },
      { key: ', / <', detail: '输入逗号；Shift 后输入小于号。' },
      { key: '. / >', detail: '输入句点；Shift 后输入大于号。' },
      { key: '/ / ?', detail: '输入斜杠；Shift 后输入问号。' },
      { key: 'Shift（右）', detail: '与左 Shift 功能相同，方便另一只手组合输入。' },
    ],
  },
  {
    id: 'modifier-row',
    title: '底行控制键',
    caption: '8 键 · 修饰键与空格',
    entries: [
      { key: 'Ctrl（左）', detail: '与字母或功能键组合，触发编辑与系统命令。' },
      { key: 'Win（左）', detail: '打开开始菜单；与 D/E/L/R/Tab/方向键组合。' },
      { key: 'Alt（左）', detail: '打开菜单栏，或配合 Tab、F4 使用。' },
      { key: 'Space', detail: '输入空格；播放器中通常控制播放 / 暂停。' },
      { key: 'Alt（右）', detail: '与左 Alt 功能相同，便于右手组合操作。' },
      { key: 'Win（右）', detail: '与左 Win 功能相同。' },
      { key: 'Menu', detail: '代替鼠标右键打开上下文菜单。' },
      { key: 'Ctrl（右）', detail: '与左 Ctrl 功能相同，便于右手组合操作。' },
    ],
  },
  {
    id: 'navigation-row',
    title: '导航键与方向键',
    caption: '10 键 · 光标与翻页',
    entries: [
      { key: 'Insert', detail: '切换插入与改写模式。' },
      { key: 'Home', detail: '光标移动到行首。' },
      { key: 'PageUp', detail: '向上翻一屏。' },
      { key: 'Delete', detail: '删除光标右侧内容或所选文件。' },
      { key: 'End', detail: '光标移动到行尾。' },
      { key: 'PageDown', detail: '向下翻一屏。' },
      { key: '↑', detail: '向上移动光标、菜单焦点或页面。' },
      { key: '↓', detail: '向下移动光标、菜单焦点或页面。' },
      { key: '←', detail: '向左移动光标；Win + ← 窗口贴靠左侧。' },
      { key: '→', detail: '向右移动光标；Win + → 窗口贴靠右侧。' },
    ],
  },
]

export const KEY_REFERENCE_TOTAL = KEY_REFERENCE_GROUPS.reduce(
  (total, group) => total + group.entries.length,
  0,
)

export const COMPACT_LAYOUT_NOTES: readonly string[] = [
  '当前可交互模型是参考图中的 82 键 75% 紧凑键盘，与上方 87 键标准说明存在少量差异。',
  '紧凑键盘包含 Fn 键；Fn 与 F1–F12 组合可访问键帽上方印刷的第二功能，具体由厂商定义。',
  'Insert 与 F12 共用一枚键帽，Home、End、Delete 位于顶行右侧。',
  '右下角方向键采用 PgUp / ↑ / PgDn + ← / ↓ / → 的组合，而标准 87 键有独立的导航键区。',
  'Copilot 键由设备和系统定义；Fn 与 Copilot 通常不会向浏览器发送普通的 KeyboardEvent.code。',
]

export interface WindowsShortcut {
  readonly combo: string
  readonly action: string
  readonly note: string
}

export const WINDOWS_SHORTCUTS: readonly WindowsShortcut[] = [
  { combo: 'Ctrl + C', action: '复制', note: '原内容保持不变。' },
  { combo: 'Ctrl + V', action: '粘贴', note: '将剪贴板内容插入当前位置。' },
  { combo: 'Ctrl + X', action: '剪切', note: '复制并移除原内容。' },
  { combo: 'Ctrl + Z', action: '撤销', note: '连续按可逐步回退。' },
  { combo: 'Ctrl + Y', action: '重做', note: '恢复刚被撤销的操作；部分应用实现不同。' },
  { combo: 'Ctrl + A', action: '全选', note: '选中当前文档或输入框的全部内容。' },
  { combo: 'Ctrl + S', action: '保存', note: '大多数应用直接保存到原位置。' },
  { combo: 'Ctrl + F', action: '查找', note: 'Enter 跳到下一处，Esc 退出。' },
  { combo: 'Ctrl + Shift + Esc', action: '任务管理器', note: '窗口无响应时的快速入口。' },
  { combo: 'Alt + Tab', action: '切换应用', note: '按住 Alt 连续点按 Tab，松开 Alt 确认。' },
  { combo: 'Alt + F4', action: '关闭窗口', note: '桌面焦点下可打开关机对话框。' },
  { combo: 'Win + D', action: '显示 / 隐藏桌面', note: '再按一次恢复窗口。' },
  { combo: 'Win + E', action: '文件资源管理器', note: '快速打开文件和文件夹。' },
  { combo: 'Win + L', action: '锁定 Windows', note: '离开工位前保护隐私。' },
  { combo: 'Win + R', action: '运行对话框', note: '可执行 cmd、notepad 等命令。' },
  { combo: 'Win + Tab', action: '任务视图', note: '查看所有窗口和虚拟桌面。' },
  { combo: 'Win + ← / →', action: '窗口贴靠左右半屏', note: '与 Win + ↑ / ↓ 配合完成窗口布局。' },
  { combo: 'Win + ↑ / ↓', action: '最大化 / 还原或最小化', note: '用于快速整理当前窗口。' },
  { combo: 'Win + Shift + S', action: '区域截图', note: '截图进入剪贴板，可直接 Ctrl + V 粘贴。' },
  { combo: 'Shift + Delete', action: '永久删除', note: '绕过回收站，操作通常不可恢复。' },
]

export const INPUT_METHOD_NOTES: readonly string[] = [
  '本页模拟的“中 / 英”状态由 Shift 单击切换，不调用 Windows 系统输入法。',
  '单独按下并松开 Shift 才触发切换；按住 Shift 再按字母只会输入大写。',
  'Caps Lock 只锁定字母大小写，不负责切换中英文。',
  'Windows 常见的 Alt + Shift 切换输入语言、Ctrl + Space 开关输入法，具体行为取决于系统设置。',
  '浏览器或操作系统保留的快捷键（如 Alt + Tab、Win + L、Ctrl + W）可能不会传入页面。',
  '如果 Shift 切换与游戏、设计软件或 IDE 冲突，请在对应软件中调整快捷键；本页不拦截浏览器默认行为。',
]
