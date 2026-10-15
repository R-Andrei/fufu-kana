# Furifont Sans

The app bundles the two variable sans WOFF2 fonts from the supplied Furifont
download. They support weights 250–900, including the app's bold text. Unused
serif fonts, desktop formats, and reading metadata are omitted.

- `FurifontSansVF.woff2`: hiragana readings, also used for regular text.
- `FurifontSansRomajiVF.woff2`: romaji readings.
- Regular mode disables `rclt` and enables `ss01` to hide readings.

Vite bundles these fonts with the configured deployment base path. Only the
selected family is downloaded by the browser. Keep Japanese words in a single
text run for contextual readings, and allow at least 1.6 line height for them.
The font annotates supported kanji, not kana, and its dictionary-selected
readings can differ from a word's intended reading in context.

Upstream: <https://github.com/antfu/furifont>
Feature documentation: <https://github.com/antfu/furifont/blob/main/docs/design.md>

Font license: [SIL OFL 1.1](OFL.txt).
Dictionary attribution: [DATA-LICENSE.md](DATA-LICENSE.md).
