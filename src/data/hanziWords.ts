import { WORD_LEXICON } from './hanziWordLexicon'

export interface WordCandidate {
  readonly key: string
  readonly word: string
  readonly syllables: readonly string[]
}

const WORD_INDEX = new Map<string, WordCandidate[]>()

for (const [key, word, syllables] of WORD_LEXICON) {
  const candidate: WordCandidate = {
    key,
    word,
    syllables: syllables.split(' '),
  }
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
