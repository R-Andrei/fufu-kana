import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname workaround in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hiraganaPath = path.join(__dirname, 'hiragana_words.json');
const katakanaPath = path.join(__dirname, 'katakana_words.json');

function readJson(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.error(`Failed to read or parse JSON from ${filePath}:`, e);
    process.exit(1);
  }
}

function findDuplicatesByKana(vocabArray) {
  const kanaMap = new Map();
  const duplicates = new Set();

  vocabArray.forEach((entry) => {
    const kana = entry.kana;
    if (!kana) return; // skip entries without kana

    if (kanaMap.has(kana)) {
      duplicates.add(kana);
    } else {
      kanaMap.set(kana, entry);
    }
  });

  return [...duplicates];
}

function findDuplicatesAcrossFiles(arr1, arr2) {
  const kanaSet1 = new Set(arr1.map(e => e.kana).filter(Boolean));
  const kanaSet2 = new Set(arr2.map(e => e.kana).filter(Boolean));

  const duplicatesAcross = [];

  kanaSet1.forEach(kana => {
    if (kanaSet2.has(kana)) duplicatesAcross.push(kana);
  });

  return duplicatesAcross;
}

function main() {
  const hiraganaData = readJson(hiraganaPath);
  const katakanaData = readJson(katakanaPath);

  const hiraganaVocab = hiraganaData.vocabulary || [];
  const katakanaVocab = katakanaData.vocabulary || [];

  const hiraganaDuplicates = findDuplicatesByKana(hiraganaVocab);
  const katakanaDuplicates = findDuplicatesByKana(katakanaVocab);

  const duplicatesAcross = findDuplicatesAcrossFiles(hiraganaVocab, katakanaVocab);

  console.log('Duplicates within hiragana_words.json:', hiraganaDuplicates);
  console.log('Duplicates within katakana_words.json:', katakanaDuplicates);
  console.log('Duplicates across both files:', duplicatesAcross);
}

main();