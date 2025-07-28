
export type Word = {
  kana: string;
  english: string;
  kanji?: string; 
  [key: string]: string | object | undefined; 
};

export type ExtendedWord = Word & {
  romajiParts: {
    hepburn: string[];
    double: string[];
  };
};

export type HistoryEntry = {
  word: string;
  meaning: string;
  input: string;
  correctRomaji: string;
  isCorrect: boolean;
};
