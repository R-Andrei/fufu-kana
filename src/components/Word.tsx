import React, { useMemo } from 'react';
import { mapKanaToKanjiSyllables } from '../utils/kanji';
import type { Word } from '../types/kana';
import type { KanjiChunk } from '../types/kanji';


interface Props {
    currentWord: Word;
    kanaParts: string[];
    correctnessArray: boolean[];
    kanjiChecked: boolean;
    isCorrect: boolean;
}

const WordDisplay: React.FC<Props> = ({
    currentWord,
    kanaParts,
    correctnessArray,
    kanjiChecked,
    isCorrect,
}) => {

    const kanjiChunks = useMemo(() => {
        if (kanjiChecked && currentWord.kanji) {
            return mapKanaToKanjiSyllables(currentWord.kanji, kanaParts);
        }
        return [];
    }, [kanjiChecked, currentWord.kanji, kanaParts]);

    if (kanjiChecked && currentWord.kanji) {
        return (
            <div
                className="word-kanji-highlighted"
                style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
            >
                {kanjiChunks.map((chunk: KanjiChunk, index) => {
                    return (
                        <p
                            key={index}
                            style={{
                                fontWeight: 'bold',
                                color: isCorrect ? 'limegreen' : 'inherit',
                                fontSize: '2rem',
                                transition: 'color 0.2s ease-in-out',
                            }}
                        >
                            {chunk.text}
                        </p>
                    );
                })}
            </div>
        );
    }

    return (
        <div
            className="word-kana"
            style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
        >
            {kanaParts.map((kanaSyllable, index) => {
                const isCorrectKana = correctnessArray[index];

                return (
                    <p
                        key={index}
                        className="kana-syllable"
                        style={{
                            fontWeight: 'bold',
                            color: isCorrectKana ? 'limegreen' : 'inherit',
                            transition: 'color 0.2s ease-in-out',
                        }}
                    >
                        {kanaSyllable}
                    </p>
                );
            })}
        </div>
    );
};

export default WordDisplay;