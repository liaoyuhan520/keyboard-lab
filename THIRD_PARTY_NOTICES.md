# Third-party notices

This project uses the following third-party libraries and datasets.

## cnchar

- Package: `cnchar`
- License: MIT
- Project: https://github.com/theajack/cnchar
- Used for pinyin lookup, tone/initial/final information and stroke counts.

## cnchar-poly

- Package: `cnchar-poly`
- License: MIT
- Project: https://github.com/theajack/cnchar
- Used for polyphonic character readings.

## Hanzi Writer

- Package: `hanzi-writer`
- License: MIT
- Project: https://github.com/chanind/hanzi-writer
- Used to render and animate Chinese character stroke order.

## Hanzi Writer Data

- Dataset: `hanzi-writer-data@2.0.1`
- License: Arphic Public License
- Source: https://github.com/chanind/hanzi-writer-data
- Derived from the Make Me a Hanzi project and Arphic Technology fonts.
- Loaded on demand from jsDelivr/unpkg for the selected character.

## SUBTLEX-CH-CHR frequency data

- Package: `subtlex-ch-chr`
- Package license: MIT
- Source: https://github.com/leonsilicon/subtlex-ch-chr
- Original dataset: SUBTLEX-CH-CHR Chinese character frequencies, based on the SUBTLEX-CH subtitle corpus.
- Used only at development time to generate the local common-character ordering in `src/data/hanziFrequency.ts`.

## HSK 3.1 vocabulary

- Package: `hsk3.1-syllabus`
- License: MIT
- Source: https://github.com/leonsilicon/hsk3.1-syllabus
- Used at development time to generate the common 2–4 character word lexicon in `src/data/hanziWordLexicon.ts`.

## SUBTLEX-CH-WF word frequency data

- Package: `subtlex-ch-wf`
- Package license: MIT
- Source: https://github.com/leonsilicon/subtlex-ch-wf
- Original dataset: SUBTLEX-CH-WF Chinese word frequencies.
- Used at development time to order the word lexicon by commonness.

## pinyin-pro

- Package: `pinyin-pro`
- License: MIT
- Project: https://github.com/zh-lx/pinyin-pro
- Used only at development time to generate toned and untoned pinyin for word candidates and the idiom candidate lexicon.

## Idiom definitions database

- Resource: `data/idioms.db`
- Supplied by the project owner; copied from the original local `scrapling/data/idioms.db`.
- The project copy includes one manual supplement entry, `鲤跃龙门`, added to support the exact pinyin query `liyuelongmen`; it is marked `status = supplement`. The original source copy is unchanged.
- Some records include `source_url` values pointing to [汉典 zdic.net](https://www.zdic.net/).
- Used at build time to generate both `src/data/hanziIdiomLexicon.ts` (four-character candidates) and `src/data/hanziIdiomDefinitions.ts`; it is not served to the browser.

## sql.js

- Package: `sql.js`
- License: MIT
- Project: https://github.com/sql-js/sql.js
- Used only at development/build time to read `data/idioms.db`. It is not part of the browser bundle or runtime dependencies.
