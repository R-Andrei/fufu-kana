export type FontMode = 'regular' | 'hiragana' | 'romaji';

const FONT_MODE_KEY = 'kana-practice.font-mode';

export function loadFontMode(): FontMode {
  try {
    const saved = localStorage.getItem(FONT_MODE_KEY);
    if (saved === 'hiragana' || saved === 'romaji') return saved;
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
  return 'regular';
}

export function saveFontMode(mode: FontMode): void {
  try {
    localStorage.setItem(FONT_MODE_KEY, mode);
  } catch {
    // The selector still works for this session when storage is unavailable.
  }
}
