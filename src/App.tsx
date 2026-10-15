
import './App.css'
import './fonts.css'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { RefreshCcw, ArrowRightCircle } from 'lucide-react';

import doitforher from '/src/assets/doitforher.png';
import type { ToastProps } from './components/toast';
import type { Word, ExtendedWord, HistoryEntry } from './types';
import { getRandomCorrectMessage, getRandomWrongMessage } from './utils/messages';
import {
  checkAnswer,
  kanaToRomajiVariants,
  splitKanaByRomaji,
  hiraganaToRomaji,
  katakanaToRomaji,
  longSyllablesHiraganaMap,
  longSyllablesKatakanaMap,
} from './utils/kana';
import { Toast } from './components/toast';
import RenderWord from './components/Word';
import KanaReferenceModal from './components/KanaReferenceModal';
import AdvancedKanaSelectionModal from './components/AdvancedKanaSelectionModal';
import { buildScriptSections } from './utils/kanaCharts';
import { loadFontMode, saveFontMode } from './utils/font';
import type { FontMode } from './utils/font';

import hiraganaData from './assets/hiragana_words.json';
import katakanaData from './assets/katakana_words.json';


// Example words, replace with your actual imports from hiragana_words.json & katakana_words.json
const hiraganaWords = hiraganaData.vocabulary as Word[] || [];
const katakanaWords = katakanaData.vocabulary as Word[] || [];
const MAX_COOLDOWN = 100;

const HIRAGANA_CORE_KEYS = new Set([
  'あ','い','う','え','お',
  'か','き','く','け','こ',
  'さ','し','す','せ','そ',
  'た','ち','つ','て','と',
  'な','に','ぬ','ね','の',
  'は','ひ','ふ','へ','ほ',
  'ま','み','む','め','も',
  'や','ゆ','よ',
  'ら','り','る','れ','ろ',
  'わ','を','ん',
  'が','ぎ','ぐ','げ','ご',
  'ざ','じ','ず','ぜ','ぞ',
  'だ','ぢ','づ','で','ど',
  'ば','び','ぶ','べ','ぼ',
  'ぱ','ぴ','ぷ','ぺ','ぽ',
]);

const KATAKANA_CORE_KEYS = new Set([
  'ア','イ','ウ','エ','オ',
  'カ','キ','ク','ケ','コ',
  'サ','シ','ス','セ','ソ',
  'タ','チ','ツ','テ','ト',
  'ナ','ニ','ヌ','ネ','ノ',
  'ハ','ヒ','フ','ヘ','ホ',
  'マ','ミ','ム','メ','モ',
  'ヤ','ユ','ヨ',
  'ラ','リ','ル','レ','ロ',
  'ワ','ヲ','ン',
  'ガ','ギ','グ','ゲ','ゴ',
  'ザ','ジ','ズ','ゼ','ゾ',
  'ダ','ヂ','ヅ','デ','ド',
  'バ','ビ','ブ','ベ','ボ',
  'パ','ピ','プ','ペ','ポ',
]);

type CharacterScript = 'hiragana' | 'katakana';

type CharacterItem = {
  kana: string;
  romaji: string;
  script: CharacterScript;
  isSingleKana: boolean;
};

type CharacterPrompt = {
  stage: 1 | 2 | 3 | 4;
  promptType: 'kanaToRomaji' | 'romajiToKana' | 'typing';
  kana: string;
  romaji: string;
  choices?: string[];
  answerKana: string;
  answerRomaji: string;
};

const shuffleArray = <T,>(items: T[]): T[] => {
  return [...items].sort(() => Math.random() - 0.5);
};

const pickRandom = <T,>(items: T[]): T | undefined => {
  if (!items.length) return undefined;
  return items[Math.floor(Math.random() * items.length)];
};

const pickUniqueItems = <T,>(items: T[], count: number, keyFn: (item: T) => string): T[] => {
  const unique = new Map<string, T>();
  const shuffled = shuffleArray(items);

  for (const item of shuffled) {
    const key = keyFn(item);
    if (!unique.has(key)) {
      unique.set(key, item);
      if (unique.size >= count) break;
    }
  }

  return Array.from(unique.values()).slice(0, count);
};

const buildCharacterItems = (
  script: CharacterScript,
  includeExtended: boolean,
): CharacterItem[] => {
  const baseMap = script === 'hiragana' ? hiraganaToRomaji : katakanaToRomaji;
  const longMap = script === 'hiragana' ? longSyllablesHiraganaMap : longSyllablesKatakanaMap;
  const coreKeys = script === 'hiragana' ? HIRAGANA_CORE_KEYS : KATAKANA_CORE_KEYS;

  const items: CharacterItem[] = Object.entries(baseMap)
    .filter(([kana]) => coreKeys.has(kana) || includeExtended)
    .map(([kana, romaji]) => ({
      kana,
      romaji,
      script,
      isSingleKana: kana.length === 1,
    }));

  if (includeExtended) {
    for (const [kana, mapping] of Object.entries(longMap)) {
      if (!items.some(item => item.kana === kana)) {
        items.push({
          kana,
          romaji: mapping.hepburn,
          script,
          isSingleKana: kana.length === 1,
        });
      }
    }
  }

  return items;
};

const createCharacterPrompt = (
  stage: 1 | 2 | 3 | 4,
  pool: CharacterItem[],
): CharacterPrompt | null => {
  if (!pool.length) return null;

  const answerItems = [...pool];

  if (stage === 4) {
    const singleItems = pool.filter(item => item.isSingleKana);
    const sourceItems = singleItems.length >= 3 ? singleItems : pool;
    const chosen = pickUniqueItems(sourceItems, 3, item => item.kana);

    if (chosen.length < 3) return null;

    const kana = chosen.map(item => item.kana).join('');
    const romaji = chosen.map(item => item.romaji).join('');

    return {
      stage: 4,
      promptType: 'typing',
      kana,
      romaji,
      answerKana: kana,
      answerRomaji: romaji,
    };
  }

  if (stage === 3) {
    const singleItems = pool.filter(item => item.isSingleKana);
    const item = pickRandom(singleItems.length ? singleItems : pool)!;
    return {
      stage: 3,
      promptType: 'typing',
      kana: item.kana,
      romaji: item.romaji,
      answerKana: item.kana,
      answerRomaji: item.romaji,
    };
  }

  const item = pickRandom(answerItems)!;

  if (stage === 1) {
    const wrongOptions = pickUniqueItems(
      answerItems.filter(other => other.romaji !== item.romaji),
      2,
      other => other.romaji,
    ).map(other => other.romaji);

    const choices = shuffleArray([item.romaji, ...wrongOptions]);

    return {
      stage: 1,
      promptType: 'kanaToRomaji',
      kana: item.kana,
      romaji: item.romaji,
      choices,
      answerKana: item.kana,
      answerRomaji: item.romaji,
    };
  }

  const wrongOptions = pickUniqueItems(
    answerItems.filter(other => other.kana !== item.kana),
    2,
    other => other.kana,
  ).map(other => other.kana);

  const choices = shuffleArray([item.kana, ...wrongOptions]);

  return {
    stage: 2,
    promptType: 'romajiToKana',
    kana: item.kana,
    romaji: item.romaji,
    choices,
    answerKana: item.kana,
    answerRomaji: item.romaji,
  };
};

const getCharacterStageLabel = (stage: 1 | 2 | 3 | 4) => {
  switch (stage) {
    case 1:
      return 'Stage 1 — Kana → Romaji';
    case 2:
      return 'Stage 2 — Romaji → Kana';
    case 3:
      return 'Stage 3 — Type the answer';
    case 4:
      return 'Stage 4 — Type 3 characters';
    default:
      return 'Character Practice';
  }
};

const normalizeCharacterAnswer = (answer: string) => answer.trim();

const validateCharacterAnswer = (answer: string, prompt: CharacterPrompt) => {
  const normalized = normalizeCharacterAnswer(answer);

  if (prompt.promptType === 'kanaToRomaji') {
    return normalized.toLowerCase() === prompt.answerRomaji.toLowerCase();
  }

  if (prompt.promptType === 'romajiToKana') {
    return normalized === prompt.answerKana;
  }

  return checkAnswer(normalized, { kana: prompt.answerKana, english: '' });
};

const App: React.FC = () => {
  const [fontMode, setFontMode] = useState<FontMode>(loadFontMode);

  useEffect(() => {
    saveFontMode(fontMode);
  }, [fontMode]);

  const [hiraganaChecked, setHiraganaChecked] = useState(true);
  const [katakanaChecked, setKatakanaChecked] = useState(true);
  const [kanjiChecked, setKanjiChecked] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [cooldownWords, setCooldownWords] = useState<string[]>([]);
  const [autoSubmit, setAutoSubmit] = useState(true);

  // vocabulary state
  const [words, setWords] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [syllableFeedback, setSyllableFeedback] = useState(true);
  const [showEnglishTranslation, setShowEnglishTranslation] = useState(true);
  const [isDefinitionRevealed, setIsDefinitionRevealed] = useState(true);
  const [isKanaReferenceOpen, setIsKanaReferenceOpen] = useState(false);

  // practice mode state
  const [practiceMode, setPracticeMode] = useState<'word' | 'character'>('word');
  const [characterHiraganaChecked, setCharacterHiraganaChecked] = useState(true);
  const [characterKatakanaChecked, setCharacterKatakanaChecked] = useState(true);
  const [characterAdvancedMode, setCharacterAdvancedMode] = useState(false);
  const [characterAdvancedSelectionOpen, setCharacterAdvancedSelectionOpen] = useState(false);
  const [selectedAdvancedRowIds, setSelectedAdvancedRowIds] = useState<string[]>([]);
  const [characterStage, setCharacterStage] = useState<1 | 2 | 3 | 4>(1);
  const [characterScore, setCharacterScore] = useState(0);
  const [characterPrompt, setCharacterPrompt] = useState<CharacterPrompt | null>(null);
  const [characterInput, setCharacterInput] = useState('');

  // timer state
  const [timedMode, setTimedMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerDurationSec, setTimerDuration] = useState(8); // default 8 seconds
  const [pointsToAdvance, setPointsToAdvance] = useState(10); // default 10 points for stage progression
  const [timerStarted, setTimerStarted] = useState(false);
  const timerDuration = timerDurationSec * 1000;
  const tickRate = 100;
  const timerRef = useRef<number | null>(null);

  const variants = useMemo(() => {
    if (!currentWord || currentWord === undefined) {
      return {
        hepburn: '',
        double: '',
        hepburnArray: [],
        doubleArray: []
      };
    }
    return kanaToRomajiVariants(currentWord.kana)
  }, [currentWord]);

  const kanaParts = useMemo(() => {
    if (!currentWord || !variants.hepburnArray.length) return [];
    return splitKanaByRomaji(currentWord.kana, variants.hepburnArray);
  }, [currentWord, variants]);

  const extendedWord: ExtendedWord = useMemo(() => {
    if (!currentWord) {
      return {
        kana: "",
        english: "",
        romajiParts: {
          hepburn: [],
          double: []
        }
      };
    }

    const getRomajiParts = (type: 'hepburn' | 'double') => {

      console.log(`Romaji parts for ${(currentWord?.kanji) ? currentWord.kanji : currentWord.kana}:`, variants.hepburn, variants.double, variants.hepburnArray, variants.doubleArray);
      return type === 'hepburn' ? variants.hepburnArray : variants.doubleArray;
    };

    return {
      ...currentWord,
      romajiParts: {
        hepburn: getRomajiParts("hepburn"),
        double: getRomajiParts("double")
      }
    };
  }, [currentWord, variants]);

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  }, []);

  const addHistory = useCallback((entry: HistoryEntry) => {
    setHistory(prev => [entry, ...prev]);
  }, []);

  const makeAdvancedRowId = (script: CharacterScript, sectionTitle: string, rowLabel: string) => `${script}|${sectionTitle}|${rowLabel}`;

  const selectedAdvancedRowSet = useMemo(() => new Set(selectedAdvancedRowIds), [selectedAdvancedRowIds]);

  const getAllAdvancedRowIdsForScripts = useCallback((scripts: CharacterScript[]) => {
    return scripts.flatMap((script) =>
      buildScriptSections(script).flatMap((section) =>
        section.rows.map((row) => makeAdvancedRowId(script, section.title, row.label))
      )
    );
  }, []);

  const selectedCharacterPool = useMemo(() => {
    if (characterAdvancedMode) {
      const poolMap = new Map<string, CharacterItem>();
      const addRowItems = (script: CharacterScript) => {
        const scriptSections = buildScriptSections(script);
        for (const section of scriptSections) {
          for (const row of section.rows) {
            const rowId = makeAdvancedRowId(script, section.title, row.label);
            if (!selectedAdvancedRowSet.has(rowId)) continue;
            for (const cell of row.cells) {
              if (!cell.kana) continue;
              poolMap.set(cell.kana, {
                kana: cell.kana,
                romaji: cell.romaji,
                script,
                isSingleKana: cell.kana.length === 1,
              });
            }
          }
        }
      };

      addRowItems('hiragana');
      addRowItems('katakana');

      return Array.from(poolMap.values());
    }

    let pool: CharacterItem[] = [];
    if (characterHiraganaChecked) {
      pool = pool.concat(buildCharacterItems('hiragana', false));
    }
    if (characterKatakanaChecked) {
      pool = pool.concat(buildCharacterItems('katakana', false));
    }
    return pool;
  }, [characterAdvancedMode, selectedAdvancedRowSet, characterHiraganaChecked, characterKatakanaChecked]);

  const initializeAdvancedSelection = useCallback(() => {
    if (selectedAdvancedRowIds.length) return;

    const scripts: CharacterScript[] = [];
    if (characterHiraganaChecked) scripts.push('hiragana');
    if (characterKatakanaChecked) scripts.push('katakana');
    if (!scripts.length) scripts.push('hiragana', 'katakana');

    setSelectedAdvancedRowIds(getAllAdvancedRowIdsForScripts(scripts));
  }, [selectedAdvancedRowIds.length, characterHiraganaChecked, characterKatakanaChecked, getAllAdvancedRowIdsForScripts]);

  const openAdvancedSelection = useCallback(() => {
    if (!characterAdvancedMode) {
      setCharacterAdvancedMode(true);
    }
    initializeAdvancedSelection();
    setCharacterAdvancedSelectionOpen(true);
  }, [characterAdvancedMode, initializeAdvancedSelection]);

  const disableAdvancedMode = useCallback(() => {
    setCharacterAdvancedMode(false);
    setCharacterAdvancedSelectionOpen(false);
  }, []);

  const resetCharacterPractice = useCallback(() => {
    setCharacterStage(1);
    setCharacterScore(0);
    setCharacterInput('');
    if (selectedCharacterPool.length) {
      setCharacterPrompt(createCharacterPrompt(1, selectedCharacterPool));
    } else {
      setCharacterPrompt(null);
    }
  }, [selectedCharacterPool]);

  const submitCharacterResponse = useCallback((answer: string) => {
    if (!characterPrompt) return;

    const isCorrect = validateCharacterAnswer(answer, characterPrompt);
    const nextScore = characterScore + (isCorrect ? 1 : -1);
    const reachedTarget = isCorrect && nextScore >= pointsToAdvance;
    const nextStage = reachedTarget ? (characterStage < 4 ? (characterStage + 1) as 1 | 2 | 3 | 4 : 1 as 1 | 2 | 3 | 4) : characterStage;
    const nextScoreValue = reachedTarget ? 0 : nextScore;

    if (isCorrect) {
      addToast(getRandomCorrectMessage(), 'success');
    } else {
      const wrongMessage = getRandomWrongMessage(characterPrompt.kana, characterPrompt.answerRomaji);
      addToast(wrongMessage, 'error');
    }

    addHistory({
      word: characterPrompt.kana,
      meaning: `Stage ${characterPrompt.stage}`,
      input: answer.trim(),
      correctRomaji: characterPrompt.answerRomaji,
      isCorrect,
    });

    if (reachedTarget) {
      if (characterStage < 4) {
        addToast(`Great! Advancing to ${getCharacterStageLabel(nextStage)}.`, 'success');
      } else {
        addToast('Final stage complete! Restarting character practice from stage 1.', 'success');
      }
    }

    setCharacterScore(nextScoreValue);
    setCharacterStage(nextStage);
    setCharacterInput('');
    setCharacterPrompt(createCharacterPrompt(nextStage, selectedCharacterPool));
  }, [addHistory, addToast, characterPrompt, characterScore, characterStage, pointsToAdvance, selectedCharacterPool]);

  // Update words list based on selection
  useEffect(() => {
    let combinedWords: Word[] = [];
    if (hiraganaChecked) combinedWords = combinedWords.concat(hiraganaWords);
    if (katakanaChecked) combinedWords = combinedWords.concat(katakanaWords);
    setWords(combinedWords);

    // Reset current word when options change
    if (combinedWords.length > 0) {
      setCurrentWord({ ...combinedWords[Math.floor(Math.random() * combinedWords.length)] });
      setUserInput('');
      inputRef.current?.focus();
    } else {
      setCurrentWord(null);
    }
  }, [hiraganaChecked, katakanaChecked]);

  useEffect(() => {
    if (practiceMode === 'character') {
      resetCharacterPractice();
    }
  }, [practiceMode, selectedCharacterPool, resetCharacterPractice]);

  useEffect(() => {
    setIsDefinitionRevealed(showEnglishTranslation);
  }, [currentWord, showEnglishTranslation]);

  const isCorrect = useMemo(() => {
    return userInput.trim().toLowerCase() === variants.hepburn.toLowerCase() ||
      userInput.trim().toLowerCase() === variants.double.toLowerCase();
  }, [userInput, variants]);

  const onCheck = useCallback(() => {
    if (!currentWord) return;

    const submitAnswer = (input: string, word: Word) => {
      addHistory({
        word: word.kana,
        meaning: word.english,
        input: userInput.trim(),
        correctRomaji: isCorrect ? userInput.trim() : variants.double,
        isCorrect,
      });

      return checkAnswer(input, word);
    };

    const showToast = (message: string, type: 'success' | 'error') => {
      const id = Date.now(); // or any unique ID generator
      setToasts(prev => [...prev, { id, message, type }]);
      // Remove after 5 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 5000);
    };


    if (submitAnswer(userInput.trim(), currentWord)) {
      showToast(getRandomCorrectMessage(), 'success');
    } else {
      const correctRomaji =
        variants.hepburn === variants.double
          ? variants.hepburn
          : `${variants.hepburn} or ${variants.double}.`;

      const wrongMessage = getRandomWrongMessage(currentWord.kana, correctRomaji);
      showToast(wrongMessage, 'error');
    }

    // Pick next word with cooldown
    if (words.length > 0) {
      let nextWord;
      const attemptsLimit = MAX_COOLDOWN + 1;
      let attempts = 0;

      do {
        nextWord = words[Math.floor(Math.random() * words.length)];
        attempts++;
        // If only one word or attempts exhausted, break anyway
        if (words.length === 1 || attempts >= attemptsLimit) break;
      } while (
        nextWord.kana === currentWord.kana || // no immediate repeat
        cooldownWords.includes(nextWord.kana) // not in cooldown
      );
      setCurrentWord({ ...nextWord });
      setUserInput('');
      setIsDefinitionRevealed(showEnglishTranslation);
      inputRef.current?.focus();

      // Update cooldownWords queue
      setCooldownWords(prev => {
        const newCooldown = [...prev, nextWord.kana];
        if (newCooldown.length > MAX_COOLDOWN) {
          newCooldown.shift(); // remove oldest
        }
        return newCooldown;
      });

      if (timedMode) {
        clearInterval(timerRef.current!);
        setTimeLeft(timerDuration);
      }
    }
  }, [
    currentWord,
    userInput,
    words,
    setCurrentWord,
    setUserInput,
    inputRef,
    timedMode,
    timerDuration,
    variants,
    cooldownWords,
    isCorrect,
    showEnglishTranslation,
    addHistory
  ]);

  // Effect 0: auto-submit on correct input
  useEffect(() => {
    if (!autoSubmit) return;

    if (practiceMode === 'word') {
      if (!userInput || !variants.hepburn || !variants.double) return;

      const normalizedInput = userInput.trim().toLowerCase();
      const normalizedHepburn = variants.hepburn.toLowerCase();
      const normalizedDouble = variants.double.toLowerCase();

      if (normalizedInput === normalizedHepburn || normalizedInput === normalizedDouble) {
        const timer = setTimeout(() => {
          onCheck();
        }, 400);

        return () => clearTimeout(timer);
      }

      return;
    }

    if (practiceMode === 'character' && characterPrompt && characterPrompt.promptType === 'typing') {
      if (!characterInput) return;

      const normalizedInput = characterInput.trim();
      const normalizedAnswer = characterPrompt.answerRomaji.toLowerCase();

      if (normalizedInput.toLowerCase() === normalizedAnswer) {
        const timer = setTimeout(() => {
          submitCharacterResponse(characterInput);
        }, 400);

        return () => clearTimeout(timer);
      }
    }
  }, [autoSubmit, practiceMode, userInput, variants, onCheck, characterPrompt, characterInput, submitCharacterResponse]);

  // Effect 1: countdown timer
  useEffect(() => {
    const activePrompt = practiceMode === 'word' ? currentWord : characterPrompt;
    if (!timedMode || !activePrompt) return;

    setTimeLeft(timerDuration);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - tickRate;
        return next <= 0 ? 0 : next;
      });
    }, tickRate);

    setTimerStarted(true);

    return () => {
      clearInterval(timerRef.current!);
      setTimerStarted(false); // clear when effect is cleaned up
    };
  }, [currentWord, timedMode, timerDuration, practiceMode, characterPrompt]);

  useEffect(() => {
    if (timeLeft === 0 && timedMode && timerStarted) {
      if (practiceMode === 'word') {
        onCheck();
      } else if (practiceMode === 'character') {
        submitCharacterResponse('');
      }
    }
  }, [timeLeft, timedMode, onCheck, timerStarted, practiceMode, submitCharacterResponse]);

  const resetHistory = () => {
    setHistory([]);  // or whatever state update clears history
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && userInput.trim()) {
      onCheck();
    }
  };

  const getBarColor = (progressRatio: number) => {
    if (progressRatio >= 1.0) return '#2e7d32';
    if (progressRatio >= 0.9) return '#388e3c';
    if (progressRatio >= 0.8) return '#43a047';
    if (progressRatio >= 0.7) return '#4caf50';
    if (progressRatio >= 0.6) return '#7cb342';
    if (progressRatio >= 0.5) return '#c0ca33';
    if (progressRatio >= 0.4) return '#fbc02d';
    if (progressRatio >= 0.3) return '#ffb300';
    if (progressRatio >= 0.2) return '#fb8c00';
    if (progressRatio >= 0.1) return '#f4511e';
    return '#e53935';
  };

  const correctnessArray = useMemo(() => {
    const result: boolean[] = [];
    if (!syllableFeedback || !variants.hepburnArray.length) return result;

    let i = 0;
    const input = userInput.toLowerCase();
    let stillCorrect = true;

    for (let j = 0; j < variants.hepburnArray.length; j++) {
      const hep = variants.hepburnArray[j];
      const dbl = variants.doubleArray[j];

      if (!stillCorrect) {
        result.push(false);
        continue;
      }

      if (input.slice(i, i + hep.length) === hep) {
        result.push(true);
        i += hep.length;
      } else if (input.slice(i, i + dbl.length) === dbl) {
        result.push(true);
        i += dbl.length;
      } else {
        result.push(false);
        stillCorrect = false;
      }
    }

    return result;
  }, [userInput, variants, syllableFeedback]);

  const correctCount = history.filter(entry => entry.isCorrect).length;
  const wrongCount = history.length - correctCount;
  const totalCount = history.length;
  const accuracy = totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100);

  return (
    <div className='flex w-full h-full practice-container' data-font-mode={fontMode} style={{ display: 'flex', height: '100vh' }}>
      {/* Left sidebar for options */}
      <section
        className="w-1/4 p-4 border-r practice-settings"
        style={{ width: '250px', padding: '1rem', display: 'flex', flexDirection: 'column' }}
      >
        <h2>Practice Settings</h2>

        <fieldset className="settings-group" aria-describedby="font-mode-help">
          <legend><strong>Font readings</strong></legend>
          {(['regular', 'hiragana', 'romaji'] as const).map(mode => (
            <label key={mode}>
              <input
                type="radio"
                name="fontMode"
                value={mode}
                checked={fontMode === mode}
                onChange={() => setFontMode(mode)}
              />
              {mode === 'regular' ? 'Regular (no readings)' : mode === 'hiragana' ? 'Hiragana readings' : 'Romaji readings'}
            </label>
          ))}
          <p className="font-preview" lang="ja" aria-label="Font preview: Japanese language">日本語</p>
          <p className="font-help" id="font-mode-help">Readings appear above supported kanji. Kana stays unchanged.</p>
        </fieldset>

        <fieldset className="settings-group" style={{ marginBottom: '1rem' }}>
          <legend><strong>Practice Mode</strong></legend>
          <label>
            <input
              type="radio"
              name="practiceMode"
              checked={practiceMode === 'word'}
              onChange={() => setPracticeMode('word')}
            />
            Word Practice
          </label>
          <label>
            <input
              type="radio"
              name="practiceMode"
              checked={practiceMode === 'character'}
              onChange={() => setPracticeMode('character')}
            />
            Character Practice
          </label>
        </fieldset>

        <fieldset className="settings-group" style={{ marginBottom: '1rem' }}>
          <legend><strong>Character Practice ― Kana</strong></legend>
          <label>
            <input
              type="checkbox"
              checked={characterHiraganaChecked}
              disabled={practiceMode !== 'character' || characterAdvancedMode}
              onChange={() => {
                setCharacterHiraganaChecked(prev => !prev);
              }}
            />
            Hiragana
          </label>
          <label>
            <input
              type="checkbox"
              checked={characterKatakanaChecked}
              disabled={practiceMode !== 'character' || characterAdvancedMode}
              onChange={() => {
                setCharacterKatakanaChecked(prev => !prev);
              }}
            />
            Katakana
          </label>
          <div className="advanced-selection-control">
            <button
              type="button"
              className="kana-selection-button"
              disabled={practiceMode !== 'character'}
              onClick={openAdvancedSelection}
            >
              {characterAdvancedMode ? 'Edit selection' : 'Advanced selection'}
            </button>
            {characterAdvancedMode && (
              <div className="advanced-selection-status">
                <span className="advanced-selection-summary">
                  {selectedAdvancedRowIds.length > 0
                    ? `${selectedAdvancedRowIds.length} selected`
                    : 'No rows selected'}
                </span>
                <button
                  type="button"
                  className="secondary-action-button"
                  onClick={disableAdvancedMode}
                >
                  Exit advanced
                </button>
              </div>
            )}
          </div>
        </fieldset>

        <fieldset className="settings-group" style={{ marginBottom: '1rem' }}>
          <legend><strong>Word Practice ― Romaji</strong></legend>
          <label>
            <input
              type="checkbox"
              checked={hiraganaChecked}
              disabled={practiceMode === 'character'}
              onChange={() => setHiraganaChecked(!hiraganaChecked)}
            />
            Hiragana
          </label>
          <label>
            <input
              type="checkbox"
              checked={katakanaChecked}
              disabled={practiceMode === 'character'}
              onChange={() => setKatakanaChecked(!katakanaChecked)}
            />
            Katakana
          </label>
          <label>
            <input
              type="checkbox"
              checked={kanjiChecked}
              disabled={practiceMode === 'character'}
              onChange={() => setKanjiChecked(prev => !prev)}
            />
            Kanji
          </label>
        </fieldset>

        <fieldset className="settings-group">
          <legend><strong>Additional Options</strong></legend>
          <label style={{ display: 'block' }}>
            <input
              type="checkbox"
              checked={autoSubmit}
              onChange={() => setAutoSubmit(prev => !prev)}
            />
            Auto-submit
          </label>
          <label style={{ display: 'block' }}>
            <input
              type="checkbox"
              checked={syllableFeedback}
              onChange={() => setSyllableFeedback(prev => !prev)}
            />
            Syllable feedback
          </label>
          <label style={{ display: 'block' }}>
            <input
              type="checkbox"
              checked={showEnglishTranslation}
              onChange={() => setShowEnglishTranslation(prev => !prev)}
            />
            Show English translation
          </label>
          <label>
            <input
              type="checkbox"
              checked={timedMode}
              onChange={() => setTimedMode((prev) => !prev)}
            />
            Timed Mode
          </label>

          <div className="timer-slider-wrapper">
            <label htmlFor="timerDuration">Timer Duration: {timerDurationSec}s</label>
            <input
              id="timerDuration"
              type="range"
              min={3}
              max={25}
              step={1}
              value={timerDurationSec}
              onChange={(e) => setTimerDuration(parseInt(e.target.value))}
              className="timer-slider"
            />
          </div>
          <div className="timer-slider-wrapper">
            <label htmlFor="pointsToAdvance">Stage Points To Advance: {pointsToAdvance}</label>
            <input
              id="pointsToAdvance"
              type="range"
              min={5}
              max={30}
              step={1}
              value={pointsToAdvance}
              onChange={(e) => setPointsToAdvance(parseInt(e.target.value))}
              className="timer-slider"
            />
          </div>
        </fieldset>

        <div className="settings-sidebar-footer">
          <button
            type="button"
            className="kana-reference-button"
            onClick={() => setIsKanaReferenceOpen(true)}
          >
            Kana Study Chart
          </button>
        </div>
      </section>

      {/* Main practice area */}
      <section
        className='w-2/4 p-4 border-r practice-room'
        style={{
          flexGrow: 1,
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={doitforher}
          alt="Do it for her"
          className="practice-room-bg"
        />
        <div className="practice-room-content" style={{ position: 'relative', zIndex: 2 }}>
          {practiceMode === 'character' ? (
            characterPrompt ? (
              <>
                <div className="character-practice-card">
                  <div className="practice-stage-label">{getCharacterStageLabel(characterStage)}</div>
                  <div className="practice-stage-score">
                    <span>Score: {characterScore} / {pointsToAdvance}</span>
                  </div>
                  <div className="score-bar-wrapper">
                    <div
                      className="score-bar"
                      style={{
                        width: `${Math.max(0, Math.min(100, (characterScore / pointsToAdvance) * 100))}%`,
                        backgroundColor: getBarColor(characterScore / pointsToAdvance)
                      }}
                    />
                  </div>
                </div>

                <div className="word-display">
                  <div className="character-prompt">
                    {characterPrompt.promptType === 'romajiToKana'
                      ? characterPrompt.romaji
                      : characterPrompt.kana}
                  </div>
                </div>

                {characterPrompt.choices ? (
                  <div className="choice-grid">
                    {characterPrompt.choices.map((choice, index) => (
                      <button
                        type="button"
                        key={`${choice}-${index}`}
                        className="choice-button"
                        onClick={() => submitCharacterResponse(choice)}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="input-group">
                    <input
                      type="text"
                      ref={inputRef}
                      value={characterInput}
                      onChange={(e) => setCharacterInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && characterInput.trim()) {
                          submitCharacterResponse(characterInput);
                        }
                      }}
                      placeholder={characterPrompt.promptType === 'typing' ? 'Type romaji here...' : 'Enter answer...'}
                      style={{ fontSize: '1.2rem', padding: '0.45rem', width: '420px', textAlign: 'center' }}
                      autoFocus
                    />
                    <button
                      onClick={() => submitCharacterResponse(characterInput)}
                      disabled={!characterInput.trim()}
                      title="Check answer"
                      className={`check-button`}
                    >
                      <ArrowRightCircle size={28} />
                    </button>
                    {timedMode && (
                      <div className="timer-bar-wrapper">
                        <div
                          className="timer-bar"
                          style={{
                            width: `${(timeLeft / timerDuration) * 100}%`,
                            backgroundColor: getBarColor(timeLeft / timerDuration)
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div>Please select Hiragana or Katakana to start character practice.</div>
            )
          ) : currentWord ? (
            <>
              <div className="word-display">
                <RenderWord
                  currentWord={extendedWord}
                  kanaParts={kanaParts}
                  correctnessArray={correctnessArray}
                  kanjiChecked={kanjiChecked}
                  isCorrect={isCorrect}
                />
                <div
                  className='word-definition'
                  style={{ color: '#666', marginBottom: '2rem', textAlign: 'center' }}
                >
                  {showEnglishTranslation || isDefinitionRevealed ? (
                    <span>({currentWord.english})</span>
                  ) : (
                    <button
                      type="button"
                      className="word-definition-spoiler"
                      onClick={() => setIsDefinitionRevealed(true)}
                      aria-label="Reveal English translation"
                      title="Reveal English translation"
                    >
                      ({currentWord.english})
                    </button>
                  )}
                </div>
              </div>

              <div className="input-group">
                <input
                  type="text"
                  ref={inputRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder="Type romaji here..."
                  style={{ fontSize: '1.2rem', padding: '0.45rem', width: '420px', textAlign: 'center' }}
                  autoFocus
                />
                <button
                  onClick={onCheck}
                  disabled={!userInput.trim()}
                  title="Check answer"
                  className={`check-button`}
                >
                  <ArrowRightCircle size={28} />
                </button>
                {timedMode && (
                  <div className="timer-bar-wrapper">
                    <div
                      className="timer-bar"
                      style={{
                        width: `${(timeLeft / timerDuration) * 100}%`,
                        backgroundColor: getBarColor(timeLeft / timerDuration)
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>Please select at least one word set to start practicing.</div>
          )}
        </div>
      </section>

      <section className="w-1/4 p-4 practice-history" style={{ width: '330px', padding: '1rem' }}>
        <div className="history-header">
          <h2>History</h2>
          <button className='history-refresh' onClick={resetHistory} title="Reset history">
            <RefreshCcw size={18} />
          </button>
        </div>

        <div className='history-stats' style={{ marginBottom: '1rem' }}>
          <div className='stats'>
            <p>✅: {correctCount}</p>
            <p>❌: {wrongCount}</p>
            <p>#️⃣: {totalCount}</p>
            <p>🎯: {accuracy}%</p>
          </div>
        </div>

        {history.length === 0 && null}
        <ul>
          {history.map((entry, idx) => (
            <li
              key={idx}
              className={entry.isCorrect ? 'correct' : 'incorrect'}
            >
              <div><strong>{entry.word}</strong> — {entry.meaning}</div>
              <div>Your answer: {entry.input}</div>
              <div>Correct: {entry.correctRomaji}</div>
            </li>
          ))}
        </ul>
      </section>

      <div className="toast-container">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>

      <KanaReferenceModal
        isOpen={isKanaReferenceOpen}
        onClose={() => setIsKanaReferenceOpen(false)}
      />

      <AdvancedKanaSelectionModal
        isOpen={characterAdvancedSelectionOpen}
        selectedRowIds={selectedAdvancedRowIds}
        onSave={setSelectedAdvancedRowIds}
        onClose={() => setCharacterAdvancedSelectionOpen(false)}
      />
    </div>
  );
};

export default App;
