import cnchar from 'cnchar'
import poly from 'cnchar-poly'
import {
  COMMON_HANZI_LIMIT,
  HANZI_FREQUENCY_RANK,
} from './hanziFrequency'
import { normalizePinyinInput } from './pinyin'

cnchar.use(poly)

export interface HanziReading {
  readonly pinyin: string
  readonly basePinyin: string
  readonly initial: string
  readonly final: string
  readonly tone: number
}

export interface HanziCandidate {
  readonly char: string
  readonly reading: HanziReading
  readonly readings: readonly HanziReading[]
  readonly frequencyRank: number | null
  readonly isCommon: boolean
  readonly isPolyphonic: boolean
}

export interface HanziCandidateResult {
  readonly common: readonly HanziCandidate[]
  readonly other: readonly HanziCandidate[]
}

const EMPTY_RESULT: HanziCandidateResult = { common: [], other: [] }

const normalizeBasePinyin = (pinyin: string): string =>
  pinyin.replaceAll('ü', 'v').toLowerCase()

const parseSpellValues = (value: string | string[]): string[] => {
  const rawValues = Array.isArray(value) ? value : [value]
  return rawValues
    .flatMap((item) => item.replace(/^\(/, '').replace(/\)$/, '').split('|'))
    .map((item) => item.trim())
    .filter(Boolean)
}

const getReadings = (char: string): HanziReading[] => {
  const untoned = parseSpellValues(
    cnchar.spell(char, 'array', 'low', 'poly'),
  )
  const toned = parseSpellValues(
    cnchar.spell(char, 'array', 'low', 'tone', 'poly'),
  )
  const seen = new Set<string>()

  return untoned.flatMap((base, index) => {
    const pinyin = toned[index] ?? base
    const key = `${base}:${pinyin}`
    if (seen.has(key)) {
      return []
    }
    seen.add(key)

    try {
      const info = cnchar.spellInfo(pinyin)
      return [
        {
          pinyin,
          basePinyin: normalizeBasePinyin(base),
          initial: info.initial,
          final: info.final,
          tone: info.tone,
        },
      ]
    } catch {
      return []
    }
  })
}

const buildCandidate = (char: string): HanziCandidate | null => {
  let readings: HanziReading[]
  try {
    readings = getReadings(char)
  } catch {
    return null
  }
  if (readings.length === 0) {
    return null
  }

  const frequencyRank = HANZI_FREQUENCY_RANK.get(char) ?? null
  return {
    char,
    reading: readings[0],
    readings,
    frequencyRank,
    isCommon: frequencyRank !== null && frequencyRank < COMMON_HANZI_LIMIT,
    isPolyphonic: readings.length > 1,
  }
}

/**
 * 反查单个汉字。系统输入法直接上屏汉字时（拼音输入法选字），
 * 用它把上屏的字接回候选模型，走同一套朗读与笔顺流程。
 */
export const findHanziCandidateByChar = (
  rawChar: string,
): HanziCandidate | null => {
  const [char] = Array.from(rawChar.trim())
  if (!char || !/^\p{Script=Han}$/u.test(char)) {
    return null
  }

  return buildCandidate(char)
}

export const findHanziCandidates = (
  rawInput: string,
): HanziCandidateResult => {
  const input = normalizePinyinInput(rawInput.trim())
  if (!input || !/^[a-zü]+$/u.test(input)) {
    return EMPTY_RESULT
  }

  const basePinyin = normalizeBasePinyin(input)
  let rawCandidates: string[]

  try {
    const result = cnchar.spellToWord(basePinyin, 'alltone', 'array')
    rawCandidates = Array.isArray(result) ? result : [result]
  } catch {
    return EMPTY_RESULT
  }

  const seen = new Set<string>()
  const candidates: HanziCandidate[] = []

  for (const char of rawCandidates) {
    if (seen.has(char)) {
      continue
    }
    seen.add(char)

    const readings = getReadings(char)
    const reading = readings.find(
      (item) => item.basePinyin === basePinyin,
    )
    if (!reading) {
      continue
    }

    const frequencyRank = HANZI_FREQUENCY_RANK.get(char) ?? null
    candidates.push({
      char,
      reading,
      readings,
      frequencyRank,
      isCommon:
        frequencyRank !== null && frequencyRank < COMMON_HANZI_LIMIT,
      isPolyphonic: readings.length > 1,
    })
  }

  candidates.sort((left, right) => {
    const leftRank = left.frequencyRank ?? Number.POSITIVE_INFINITY
    const rightRank = right.frequencyRank ?? Number.POSITIVE_INFINITY
    if (leftRank !== rightRank) {
      return leftRank - rightRank
    }
    return left.char.localeCompare(right.char, 'zh-CN')
  })

  return {
    common: candidates.filter((candidate) => candidate.isCommon),
    other: candidates.filter((candidate) => !candidate.isCommon),
  }
}

/**
 * A polyphonic character can be read by the system TTS with a different
 * pronunciation than the one the user selected. When possible, use a
 * single-reading character with the exact same toned syllable as the spoken
 * proxy. The sound is identical while the selected character stays visible.
 */
export const findSpeechCharacter = (
  candidate: HanziCandidate,
  allCandidates: readonly HanziCandidate[],
): string => {
  if (candidate.readings.length <= 1) {
    return candidate.char
  }

  const proxy = allCandidates.find(
    (item) =>
      item.readings.length === 1 &&
      item.reading.pinyin === candidate.reading.pinyin,
  )

  return proxy?.char ?? candidate.char
}
