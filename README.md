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
- Four-character idiom candidates from `cnchar-idiom`, loaded on demand and ordered by commonness
- 87-key reference and Windows shortcut cheat sheet below the app

## Notes

- Hanzi stroke data is loaded on demand from the pinned `hanzi-writer-data` CDN and cached in memory. The first view of a character needs a network connection.
- Pronunciations use the browser/OS Chinese speech-synthesis voice. Voice availability and timbre depend on the device.
- Word candidates come from the HSK 3.1 vocabulary list and are ordered by SUBTLEX-CH-WF frequency. Four-character idiom candidates come from `cnchar-idiom` and are loaded only when a matching long pinyin query is entered. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for data and library attribution.

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
```

## Checks

```bash
npm run lint
npm run build
```
