export type FuzzyPinyinKind = 'prefix' | 'edit'

export interface FuzzyPinyinMatch {
  readonly score: number
  readonly kind: FuzzyPinyinKind
  readonly distance: number
}

export const FUZZY_MIN_INPUT_LENGTH = 6
export const FUZZY_PREFIX_MIN_LENGTH = 8

export const fuzzyResultLimit = (queryLength: number): number =>
  queryLength <= 8 ? 3 : 6

const optimalStringAlignmentDistance = (
  left: string,
  right: string,
  maxDistance: number,
): number => {
  if (Math.abs(left.length - right.length) > maxDistance) {
    return maxDistance + 1
  }

  const columns = right.length + 1
  let previousPrevious = new Array<number>(columns).fill(0)
  let previous = Array.from({ length: columns }, (_, index) => index)
  let current = new Array<number>(columns).fill(0)

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    current[0] = leftIndex
    let rowMinimum = leftIndex

    for (
      let rightIndex = 1;
      rightIndex <= right.length;
      rightIndex += 1
    ) {
      const substitutionCost =
        left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1
      current[rightIndex] = Math.min(
        previous[rightIndex] + 1,
        current[rightIndex - 1] + 1,
        previous[rightIndex - 1] + substitutionCost,
      )

      if (
        leftIndex > 1 &&
        rightIndex > 1 &&
        left[leftIndex - 1] === right[rightIndex - 2] &&
        left[leftIndex - 2] === right[rightIndex - 1]
      ) {
        current[rightIndex] = Math.min(
          current[rightIndex],
          previousPrevious[rightIndex - 2] + 1,
        )
      }

      rowMinimum = Math.min(rowMinimum, current[rightIndex])
    }

    if (rowMinimum > maxDistance) {
      return maxDistance + 1
    }

    previousPrevious = previous
    previous = current
    current = new Array<number>(columns).fill(0)
  }

  return previous[right.length]
}

/**
 * Fuzzy pinyin scoring layered on top of the existing exact Map lookup.
 *
 * - Prefix: input length >= 8 and the candidate key starts with the input.
 * - Edit distance: input length >= 6; at most 1 edit below 12 letters,
 *   at most 2 edits from 12 letters. The distance includes an adjacent
 *   transposition (Damerau/OSA), so adjacent-key mistakes and single
 *   missing/extra letters are covered.
 * - Exact keys are never returned by this helper.
 */
export const matchFuzzyPinyin = (
  query: string,
  candidateKey: string,
): FuzzyPinyinMatch | null => {
  if (query === candidateKey || query.length < FUZZY_MIN_INPUT_LENGTH) {
    return null
  }

  if (
    query.length >= FUZZY_PREFIX_MIN_LENGTH &&
    candidateKey.length > query.length &&
    candidateKey.startsWith(query)
  ) {
    return { score: 1, kind: 'prefix', distance: 0 }
  }

  const maxDistance = query.length >= 12 ? 2 : 1
  const distance = optimalStringAlignmentDistance(
    query,
    candidateKey,
    maxDistance,
  )

  if (distance > maxDistance) {
    return null
  }

  return {
    score: distance + 1,
    kind: 'edit',
    distance,
  }
}
