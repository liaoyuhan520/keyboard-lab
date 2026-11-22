import {
  fuzzyResultLimit,
  matchFuzzyPinyin,
} from './fuzzyPinyin'
import { WORD_LEXICON } from './hanziWordLexicon'

export type WordMatchType = 'exact' | 'fuzzy'

export interface WordCandidate {
  readonly key: string
  readonly word: string
  readonly syllables: readonly string[]
  readonly frequency: number
  readonly isIdiom: boolean
  readonly matchType: WordMatchType
  readonly fuzzyScore?: number
}

const WORD_INDEX = new Map<string, WordCandidate[]>()
const WORD_FUZZY_ENTRIES: WordCandidate[] = []

for (const [key, word, syllables, frequency] of WORD_LEXICON) {
  const candidate: WordCandidate = {
    key,
    word,
    syllables: syllables.split(' '),
    frequency,
    isIdiom: false,
    matchType: 'exact',
  }
  WORD_FUZZY_ENTRIES.push(candidate)
  const existing = WORD_INDEX.get(key)
  if (existing) {
    existing.push(candidate)
  } else {
    WORD_INDEX.set(key, [candidate])
  }
}

export const WORD_LEXICON_SIZE = WORD_LEXICON.length

const toLookupKey = (rawInput: string): string =>
  rawInput.toLowerCase().replaceAll('ü', 'v')

export const findWordCandidates = (
  rawInput: string,
): readonly WordCandidate[] => {
  const key = toLookupKey(rawInput)
  if (key.length < 2 || key.length > 24) {
    return []
  }
  return WORD_INDEX.get(key) ?? []
}

export const findFuzzyWordCandidates = (
  rawInput: string,
): readonly WordCandidate[] => {
  const key = toLookupKey(rawInput)
  if (key.length < 6 || key.length > 24) {
    return []
  }

  const matches: {
    readonly candidate: WordCandidate
    readonly score: number
    readonly order: number
  }[] = []

  WORD_FUZZY_ENTRIES.forEach((candidate, order) => {
    if (candidate.key === key) {
      return
    }
    const match = matchFuzzyPinyin(key, candidate.key)
    if (!match) {
      return
    }
    matches.push({
      candidate: {
        ...candidate,
        matchType: 'fuzzy',
        fuzzyScore: match.score,
      },
      score: match.score,
      order,
    })
  })

  matches.sort(
    (left, right) =>
      left.score - right.score ||
      right.candidate.frequency - left.candidate.frequency ||
      right.candidate.word.length - left.candidate.word.length ||
      left.order - right.order,
  )

  return matches
    .slice(0, fuzzyResultLimit(key.length))
    .map((match) => match.candidate)
}
