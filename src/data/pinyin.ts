export type PinyinGroupId =
  | 'initials'
  | 'simple-finals'
  | 'compound-finals'
  | 'front-nasals'
  | 'back-nasals'
  | 'whole-syllables'

export interface PinyinItem {
  readonly id: string
  readonly label: string
  readonly mnemonic: string
  readonly group: PinyinGroupId
  readonly audioFile: string
  readonly audioSrc: string
  readonly downloadName: string
  readonly singleKey?: string
}

export interface PinyinGroup {
  readonly id: PinyinGroupId
  readonly eyebrow: string
  readonly title: string
  readonly caption: string
  readonly items: readonly PinyinItem[]
}

type PinyinEntry = readonly [label: string, mnemonic: string]
type PinyinGroupSeed = Omit<PinyinGroup, 'items'> & {
  readonly entries: readonly PinyinEntry[]
}

const AUDIO_FILES: Readonly<Record<string, string>> = {
  ü: 'v.mp3',
  'üe': 've.mp3',
  'ün': 'vn.mp3',
}

const assetUrl = (path: string): string =>
  `${import.meta.env.BASE_URL}${path}`

const GROUP_SEEDS: readonly PinyinGroupSeed[] = [
  {
    id: 'initials',
    eyebrow: 'INITIALS',
    title: '声母',
    caption: '按对应字母直接试听',
    entries: [
      ['b', '播'],
      ['p', '泼'],
      ['m', '摸'],
      ['f', '佛'],
      ['d', '得'],
      ['t', '特'],
      ['n', '讷'],
      ['l', '勒'],
      ['g', '哥'],
      ['k', '科'],
      ['h', '喝'],
      ['j', '鸡'],
      ['q', '七'],
      ['x', '西'],
      ['zh', '织'],
      ['ch', '吃'],
      ['sh', '狮'],
      ['r', '日'],
      ['z', '资'],
      ['c', '刺'],
      ['s', '丝'],
      ['y', '衣'],
      ['w', '屋'],
    ],
  },
  {
    id: 'simple-finals',
    eyebrow: 'SIMPLE FINALS',
    title: '单韵母',
    caption: '按对应字母直接试听',
    entries: [
      ['a', '阿'],
      ['o', '哦'],
      ['e', '鹅'],
      ['i', '依'],
      ['u', '乌'],
      ['ü', '鱼'],
    ],
  },
  {
    id: 'compound-finals',
    eyebrow: 'COMPOUND FINALS',
    title: '复韵母 · 特殊韵母',
    caption: '输入字母组合后按 Enter',
    entries: [
      ['ai', '唉'],
      ['ei', '诶'],
      ['ui', '喂'],
      ['ao', '奥'],
      ['ou', '鸥'],
      ['iu', '优'],
      ['ie', '叶'],
      ['üe', '约'],
      ['er', '耳'],
    ],
  },
  {
    id: 'front-nasals',
    eyebrow: 'FRONT NASALS',
    title: '前鼻韵母',
    caption: '输入字母组合后按 Enter',
    entries: [
      ['an', '安'],
      ['en', '恩'],
      ['in', '因'],
      ['un', '温'],
      ['ün', '晕'],
    ],
  },
  {
    id: 'back-nasals',
    eyebrow: 'BACK NASALS',
    title: '后鼻韵母',
    caption: '输入字母组合后按 Enter',
    entries: [
      ['ang', '昂'],
      ['eng', '亨'],
      ['ing', '英'],
      ['ong', '翁'],
    ],
  },
  {
    id: 'whole-syllables',
    eyebrow: 'WHOLE SYLLABLES',
    title: '整体认读音节',
    caption: '输入完整音节后按 Enter',
    entries: [
      ['zhi', '织'],
      ['chi', '吃'],
      ['shi', '狮'],
      ['ri', '日'],
      ['zi', '资'],
      ['ci', '刺'],
      ['si', '丝'],
      ['yi', '衣'],
      ['wu', '屋'],
      ['yu', '迂'],
      ['ye', '耶'],
      ['yue', '月'],
      ['yuan', '元'],
      ['yin', '因'],
      ['yun', '晕'],
      ['ying', '英'],
    ],
  },
]

const makeItem = (
  group: PinyinGroupId,
  [label, mnemonic]: PinyinEntry,
): PinyinItem => {
  const audioFile = AUDIO_FILES[label] ?? `${label}.mp3`
  const isSingleLetter = Array.from(label).length === 1

  return {
    id: label,
    label,
    mnemonic,
    group,
    audioFile,
    audioSrc: assetUrl(`pinyin-audio/${audioFile}`),
    downloadName: `${label}.mp3`,
    singleKey: isSingleLetter ? (label === 'ü' ? 'v' : label) : undefined,
  }
}

export const PINYIN_GROUPS: readonly PinyinGroup[] = GROUP_SEEDS.map((seed) => {
  const { entries, ...group } = seed
  return {
    ...group,
    items: entries.map((entry) => makeItem(seed.id, entry)),
  }
})

export const PINYIN_ITEMS: readonly PinyinItem[] = PINYIN_GROUPS.flatMap(
  (group) => group.items,
)

export const PINYIN_TOTAL = PINYIN_ITEMS.length

export const PINYIN_BY_LABEL: ReadonlyMap<string, PinyinItem> = new Map(
  PINYIN_ITEMS.map((item) => [item.label, item]),
)

export const SINGLE_KEY_ITEMS: Readonly<Record<string, PinyinItem>> =
  Object.fromEntries(
    PINYIN_ITEMS.flatMap((item) =>
      item.singleKey ? [[item.singleKey, item] as const] : [],
    ),
  )

export const SINGLE_KEY_COUNT = Object.keys(SINGLE_KEY_ITEMS).length
export const COMBINATION_COUNT = PINYIN_TOTAL - SINGLE_KEY_COUNT

export const PINYIN_AUDIO_ZIP = assetUrl('pinyin-audio.zip')
export const PINYIN_ZIP_DOWNLOAD_NAME = '汉语拼音单音音频.zip'

export const normalizePinyinInput = (rawInput: string): string =>
  rawInput.toLowerCase().replaceAll('v', 'ü')

export const findPinyin = (rawInput: string): PinyinItem | undefined =>
  PINYIN_BY_LABEL.get(normalizePinyinInput(rawInput))
