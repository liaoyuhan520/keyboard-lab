import {
  fuzzyResultLimit,
  matchFuzzyPinyin,
} from './fuzzyPinyin'
import { IDIOM_LEXICON } from './hanziIdiomLexicon'
import type { WordCandidate } from './hanziWords'

const IDIOM_INDEX = new Map<string, WordCandidate[]>()
const IDIOM_FUZZY_ENTRIES: WordCandidate[] = []

for (const [key, word, syllables, frequency] of IDIOM_LEXICON) {
  const candidate: WordCandidate = {
    key,
    word,
    syllables: syllables.split(' '),
    frequency,
    isIdiom: true,
    matchType: 'exact',
  }
  IDIOM_FUZZY_ENTRIES.push(candidate)
  const existing = IDIOM_INDEX.get(key)
  if (existing) {
    existing.push(candidate)
  } else {
    IDIOM_INDEX.set(key, [candidate])
  }
}

const toLookupKey = (rawInput: string): string =>
  rawInput.toLowerCase().replaceAll('ü', 'v')

export const findIdiomCandidates = (
  rawInput: string,
): readonly WordCandidate[] => {
  const key = toLookupKey(rawInput)
  if (key.length < 6 || key.length > 24) {
    return []
  }

  const exact = IDIOM_INDEX.get(key) ?? []
  const matches: {
    readonly candidate: WordCandidate
    readonly score: number
    readonly order: number
  }[] = []

  IDIOM_FUZZY_ENTRIES.forEach((candidate, order) => {
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

  return [
    ...exact,
    ...matches
      .slice(0, fuzzyResultLimit(key.length))
      .map((match) => match.candidate),
  ]
}
