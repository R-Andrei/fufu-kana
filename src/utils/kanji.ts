import type { KanjiChunk } from '../types/kanji';
import { isKana } from './kana';


export function mapKanaToKanjiSyllables(
  kanji: string,
  kanaParts: string[]
): KanjiChunk[] {
  const chunks: KanjiChunk[] = [];

  let kanaIndex = 0;

  for (let i = 0; i < kanji.length; i++) {
    const char = kanji[i];
    const isCharKana = isKana(char);

    if (isCharKana) {
      chunks.push({
        text: char,
        kanaIndexes: [kanaIndex],
      });
      kanaIndex += 1;
    } else {
      const kanaStart = kanaIndex;
      let kanaEnd = kanaStart + 1;

      while (
        kanaEnd < kanaParts.length &&
        (i + 1 >= kanji.length || !isKana(kanji[i + 1]))
      ) {
        kanaEnd++;
      }

      const assignedIndexes = Array.from(
        { length: kanaEnd - kanaStart },
        (_, j) => kanaStart + j
      );

      chunks.push({
        text: char,
        kanaIndexes: assignedIndexes,
      });

      kanaIndex = kanaEnd;
    }
  }

  return chunks;
}