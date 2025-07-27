
import './App.css'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCcw, ArrowRightCircle } from 'lucide-react';

import doitforher from '/src/assets/doitforher.png';
import type { ToastProps } from './components/toast';
import type { Word, HistoryEntry } from './types';
import { getRandomCorrectMessage, getRandomWrongMessage } from './utils/messages';
import { checkAnswer, kanaToRomajiVariants } from './utils/kana';
import { Toast } from './components/toast';

import hiraganaData from './assets/hiragana_words.json';
import katakanaData from './assets/katakana_words.json';



// Example words, replace with your actual imports from hiragana_words.json & katakana_words.json
const hiraganaWords = hiraganaData.vocabulary as Word[] || [];
const katakanaWords = katakanaData.vocabulary as Word[] || [];

const App: React.FC = () => {
  const [hiraganaChecked, setHiraganaChecked] = useState(true);
  const [katakanaChecked, setKatakanaChecked] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  // vocabulary state
  const [words, setWords] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // timer state
  const [timedMode, setTimedMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerDurationSec, setTimerDuration] = useState(8); // default 8 seconds
  const [timerStarted, setTimerStarted] = useState(false);
  const timerDuration = timerDurationSec * 1000;
  const tickRate = 100;
  const timerRef = useRef<number | null>(null);

  // Example function to add to history
  function addHistory(entry: HistoryEntry) {
    setHistory(prev => [entry, ...prev]); // newest first
  }

  // Update words list based on selection
  useEffect(() => {
    let combinedWords: Word[] = [];
    if (hiraganaChecked) combinedWords = combinedWords.concat(hiraganaWords);
    if (katakanaChecked) combinedWords = combinedWords.concat(katakanaWords);
    setWords(combinedWords);

    // Reset current word when options change
    if (combinedWords.length > 0) {
      setCurrentWord(combinedWords[Math.floor(Math.random() * combinedWords.length)]);
      setUserInput('');
      inputRef.current?.focus();
    } else {
      setCurrentWord(null);
    }
  }, [hiraganaChecked, katakanaChecked]);

  const onCheck = useCallback(() => {
    if (!currentWord) return;

    const submitAnswer = (input: string, word: Word) => {
      const variants = kanaToRomajiVariants(word.kana);
      const isCorrect =
        userInput.trim().toLowerCase() === variants.hepburn.toLowerCase() ||
        userInput.trim().toLowerCase() === variants.double.toLowerCase();

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
      // Remove after 3 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 3000);
    };


    if (submitAnswer(userInput.trim(), currentWord)) {
      showToast(getRandomCorrectMessage(), 'success');
    } else {
      const variants = kanaToRomajiVariants(currentWord.kana);
      console.log(currentWord.kana, variants);
      const correctRomaji =
        variants.hepburn === variants.double
          ? variants.hepburn
          : `${variants.hepburn} or ${variants.double}.`;

      const wrongMessage = getRandomWrongMessage(currentWord.kana, correctRomaji);
      showToast(wrongMessage, 'error');
    }

    // Then your code to go to the next word
    if (words.length > 0) {
      let nextWord = words[Math.floor(Math.random() * words.length)];
      if (words.length > 1) {
        while (nextWord.kana === currentWord.kana) {
          nextWord = words[Math.floor(Math.random() * words.length)];
        }
      }
      setCurrentWord(nextWord);
      setUserInput('');
      inputRef.current?.focus();

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
    timerDuration
  ]);

  // Effect 1: countdown timer
  useEffect(() => {
    if (!timedMode || !currentWord) return;

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
  }, [currentWord, timedMode, timerDuration]);

  // Effect 2: auto-submit on 0
  useEffect(() => {
    if (timeLeft === 0 && timedMode && timerStarted) {
      onCheck();
    }
  }, [timeLeft, timedMode, onCheck, timerStarted]);

  const resetHistory = () => {
    setHistory([]);  // or whatever state update clears history
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && userInput.trim()) {
      onCheck();
    }
  };

  const getBarColor = (progressRatio: number) => {
    if (progressRatio > 0.7) return '#4caf50'; // Green
    if (progressRatio > 0.5) return '#ffc107'; // Yellow
    if (progressRatio > 0.25) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  const correctCount = history.filter(entry => entry.isCorrect).length;
  const wrongCount = history.length - correctCount;
  const totalCount = history.length;
  const accuracy = totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100);

  return (
    <div className='flex w-full h-full practice-container' style={{ display: 'flex', height: '100vh' }}>
      {/* Left sidebar for options */}
      <section
        className="w-1/4 p-4 border-r practice-settings"
        style={{ width: '200px', padding: '1rem' }}
      >
        <h2>Practice Settings</h2>

        <fieldset className="settings-group" style={{ marginBottom: '1rem' }}>
          <legend><strong>Word Practice</strong></legend>
          <label>
            <input
              type="checkbox"
              checked={hiraganaChecked}
              onChange={() => setHiraganaChecked(!hiraganaChecked)}
            />
            Hiragana
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={katakanaChecked}
              onChange={() => setKatakanaChecked(!katakanaChecked)}
            />
            Katakana
          </label>
        </fieldset>

        <fieldset className="settings-group">
          <legend><strong>Additional Options</strong></legend>
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
              max={30}
              step={1}
              value={timerDurationSec}
              onChange={(e) => setTimerDuration(parseInt(e.target.value))}
              className="timer-slider"
            />
          </div>
        </fieldset>
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
          {currentWord ? (
            <>
              <div className="word-display">
                <div
                  className='word-kana'
                  style={{
                    fontSize: '3.1rem',
                    fontWeight: 'bold',
                    marginBottom: '0.3rem',
                    textAlign: 'center',
                  }}
                >
                  {currentWord.kana}
                </div>
                <div
                  className='word-definition'
                  style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem', textAlign: 'center' }}
                >
                  ({currentWord.english})
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
            <div>Please select at least one kana set to start practicing.</div>
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
    </div>
  );
};

export default App;