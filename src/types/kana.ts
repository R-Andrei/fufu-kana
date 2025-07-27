
export type Word = {
  kana: string;
  english: string;
  [key: string]: string | object; // Allow for additional properties if needed
};

export type ExtendedWord = Word & {
  romajiParts: {
    hepburn: string[];
    double: string[];
  };
};

export type HistoryEntry = {
  word: string;       // kana
  meaning: string;    // English meaning
  input: string;      // user input romaji
  correctRomaji: string; // correct romaji (Hepburn or double)
  isCorrect: boolean;
};
