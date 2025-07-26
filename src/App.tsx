
import './App.css'

import React, { useState, useEffect, useRef } from 'react';

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

  const [words, setWords] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now(); // or any unique ID generator
    setToasts(prev => [...prev, { id, message, type }]);
    // Remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

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

  // Dummy romaji checker (replace with your real function)
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

  const onCheck = () => {
    if (!currentWord) return;

    if (submitAnswer(userInput.trim(), currentWord)) {
      showToast(getRandomCorrectMessage(), 'success');
    } else {
      const variants = kanaToRomajiVariants(currentWord.kana);
      console.log(currentWord.kana, variants)
      const correctRomaji = (variants.hepburn === variants.double)
        ? `${variants.hepburn}`
        : `${variants.hepburn} or ${variants.double}.`

      const wrongMessage = getRandomWrongMessage(currentWord.kana, correctRomaji);
      showToast(wrongMessage, 'error');
    }

    // Show next random word
    if (words.length > 0) {
      let nextWord = words[Math.floor(Math.random() * words.length)];
      // Avoid immediate repeat if possible
      if (words.length > 1) {
        while (nextWord.kana === currentWord.kana) {
          nextWord = words[Math.floor(Math.random() * words.length)];
        }
      }
      setCurrentWord(nextWord);
      setUserInput('');
      inputRef.current?.focus();
    }
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && userInput.trim()) {
      onCheck();
    }
  };

  return (
    <div className='flex w-full h-full practice-container' style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Left sidebar for options */}
      <section className='w-1/4 p-4 border-r practice-settings' style={{ width: '200px', padding: '1rem' }}>
        <h2>Practice Settings</h2>
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
        {currentWord ? (
          <>
            <div
              style={{
                fontSize: '4rem',
                fontWeight: 'bold',
                marginBottom: '0.3rem',
                textAlign: 'center',
              }}
            >
              {currentWord.kana}
            </div>
            <div style={{ fontSize: '1rem', color: '#666', marginBottom: '2rem' }}>
              {currentWord.english}
            </div>

            <input
              type="text"
              ref={inputRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Type romaji here..."
              style={{ fontSize: '1.5rem', padding: '0.5rem', width: '420px', textAlign: 'center' }}
              autoFocus
            />
            <button
              onClick={onCheck}
              style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '1.2rem' }}
              disabled={!userInput.trim()}
            >
              Check
            </button>
          </>
        ) : (
          <div>Please select at least one kana set to start practicing.</div>
        )}
      </section>

      <section className="w-1/4 p-4 practice-history" style={{ width: '330px', padding: '1rem' }}>
        <h2>Practice History</h2>
        {history.length === 0 && <p>No history yet.</p>}
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