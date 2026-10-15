import React from 'react';
import type { Word } from '../types/kana';


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

    if (kanjiChecked && currentWord.kanji) {
        // Furifont needs an uninterrupted word to select contextual readings.
        return (
            <div
                className="word-kanji-highlighted"
                lang="ja"
            >
                <p
                    style={{
                        fontWeight: 'bold',
                        color: isCorrect ? 'limegreen' : 'inherit',
                        fontSize: '2rem',
                        transition: 'color 0.2s ease-in-out',
                    }}
                >
                    {currentWord.kanji}
                </p>
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
