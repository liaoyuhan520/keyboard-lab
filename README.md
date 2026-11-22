# 快捷键实验室 · Keyboard Lab

A standalone interactive keyboard tutorial built with Vite, React and TypeScript.

## Features

- 82-key compact 75% keyboard rendered with React, CSS and inline SVG only
- Real `KeyboardEvent.code` input with live keycaps, shortcut popups and IME simulation
- Optional 29-step automatic demo
- Live key history sidebar
- Pinyin audio lab with a single-key / combination-mode switch, `|` and Backspace clearing, an SVG alphabet chart with an enlarged viewer, and a 63-file ZIP export
- Hanzi and word practice mode: type pinyin, pick a word, idiom or character, hear it read aloud and watch animated stroke order for each character in a Tianzige grid
- Mobile-friendly pinyin soft keyboard and tap-to-read character / word cards
- Four-character and longer idiom candidates generated from the local `data/idioms.db`, loaded on demand and ordered by commonness
- Frequency-ranked candidates using baked SUBTLEX-CH-WF counts, with exact matches ahead of fuzzy matches
- Fuzzy pinyin candidates (prefix + bounded Damerau/OSA edit distance) after exact matches, with an adaptive result budget
- Idiom definitions from the same local database, shown when an idiom is selected and loaded on demand
- 87-key reference and Windows shortcut cheat sheet below the app

## Notes

- Hanzi stroke data is loaded on demand from the pinned `hanzi-writer-data` CDN and cached in memory. The first view of a character needs a network connection.
- Pronunciations use the browser/OS Chinese speech-synthesis voice. Voice availability and timbre depend on the device.
- Word candidates come from the HSK 3.1 vocabulary list and are ordered by SUBTLEX-CH-WF frequency. Four-or-more-character idiom candidates and their definitions both come from `data/idioms.db`; candidates are loaded only when a matching long pinyin query is entered. Exact matches always come before fuzzy matches. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for data and library attribution.
- Idiom candidate pinyin is generated at build time with `pinyin-pro` to keep exact-pinyin matching stable; the database `pinyin` field is not used for lookup. The database itself is not served to the browser. See [docs/idiom-definitions.md](docs/idiom-definitions.md) for schema findings, field priority, fallback behavior and data limitations.

## Development

```bash
npm install
npm run dev
```

Generated data can be rebuilt with:

```bash
npm run generate:hanzi-frequency
npm run generate:hanzi-words
npm run generate:hanzi-idioms
npm run generate:hanzi-idiom-definitions
```

## Checks

```bash
npm run lint
npm run build
```
