interface KeyTokensProps {
  readonly tokens: readonly string[]
  readonly separator?: 'plus' | 'dot'
  readonly compact?: boolean
}

export function KeyTokens({
  tokens,
  separator = 'plus',
  compact = false,
}: KeyTokensProps) {
  return (
    <span className={`key-tokens${compact ? ' key-tokens--compact' : ''}`}>
      {tokens.map((token, index) => (
        <span className="key-tokens__item" key={`${token}-${index}`}>
          {index > 0 ? (
            <span className="key-tokens__separator" aria-hidden="true">
              {separator === 'plus' ? '+' : '·'}
            </span>
          ) : null}
          <kbd className="key-token">{token}</kbd>
        </span>
      ))}
    </span>
  )
}
