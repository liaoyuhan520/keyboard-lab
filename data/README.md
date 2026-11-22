# Build-time data

`idioms.db` is the source SQLite database for idiom candidates and idiom definitions. It is read only by build-time generation scripts and is **not** copied into `public/` or the browser bundle.

- Source: user-provided `D:\DSHproject\scrapling\data\idioms.db`
- Original filename kept: `idioms.db`
- SHA-256: `bd9bf4a1474dff98580c7bc8c930b0604fec60762304aa6f0ae9684a91abc297`
- Project copy contains one manual supplement row: `鲤跃龙门` (`status = supplement`, pinyin `lǐ yuè lóng mén`). The original source database did not contain this four-character variant. The original `scrapling` copy remains unchanged.
- Candidate and definition export includes four-or-more-character heads; the current candidate count is 30,191 and definition count is 30,220.
- Generated outputs:
  - `src/data/hanziIdiomLexicon.ts`
  - `src/data/hanziIdiomDefinitions.ts`
- Rebuild:

```bash
npm run generate:hanzi-idioms
npm run generate:hanzi-idiom-definitions
```

See [`docs/idiom-definitions.md`](../docs/idiom-definitions.md) for schema inspection, completeness statistics, field priority and fallback behavior.
