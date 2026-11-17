import { IDIOM_LEXICON } from './hanziIdiomLexicon'
import type { WordCandidate } from './hanziWords'

const IDIOM_INDEX = new Map<string, WordCandidate[]>()

for (const [key, word, syllables] of IDIOM_LEXICON) {
  const candidate: WordCandidate = {
    key,
    word,
    syllables: syllables.split(' '),
    isIdiom: true,
  }
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
  return IDIOM_INDEX.get(key) ?? []
}
