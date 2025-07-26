import fs from 'fs';

// Your katakana characters as keys in an object for quick lookup
const katakanaToRomaj = {
  ア: 'a', イ: 'i', ウ: 'u', エ: 'e', オ: 'o',
  カ: 'ka', キ: 'ki', ク: 'ku', ケ: 'ke', コ: 'ko',
  サ: 'sa', シ: 'shi', ス: 'su', セ: 'se', ソ: 'so',
  タ: 'ta', チ: 'chi', ツ: 'tsu', テ: 'te', ト: 'to',
  ナ: 'na', ニ: 'ni', ヌ: 'nu', ネ: 'ne', ノ: 'no',
  ハ: 'ha', ヒ: 'hi', フ: 'fu', ヘ: 'he', ホ: 'ho',
  マ: 'ma', ミ: 'mi', ム: 'mu', メ: 'me', モ: 'mo',
  ヤ: 'ya', ユ: 'yu', ヨ: 'yo',
  ラ: 'ra', リ: 'ri', ル: 'ru', レ: 're', ロ: 'ro',
  ワ: 'wa', ヲ: 'wo',
  ン: 'n',
  ガ: 'ga', ギ: 'gi', グ: 'gu', ゲ: 'ge', ゴ: 'go',
  ザ: 'za', ジ: 'ji', ズ: 'zu', ゼ: 'ze', ゾ: 'zo',
  ダ: 'da', ヂ: 'ji', ヅ: 'zu', デ: 'de', ド: 'do',
  バ: 'ba', ビ: 'bi', ブ: 'bu', ベ: 'be', ボ: 'bo',
  パ: 'pa', ピ: 'pi', プ: 'pu', ペ: 'pe', ポ: 'po',
  ァ: 'a', ィ: 'i', ゥ: 'u', ェ: 'e', ォ: 'o',
  ャ: 'ya', ュ: 'yu', ョ: 'yo', ッ: 'tsu',
};

// Load your JSON file
const data = JSON.parse(fs.readFileSync('flattened_japanese_vocab.json', 'utf-8'));

const katakanaWords = [];
const hiraganaWords = [];

function containsKatakana(str) {
  for (const char of str) {
    if (katakanaToRomaj[char]) {
      return true;
    }
  }
  return false;
}

// Process vocabulary list
for (const entry of data.vocabulary) {
  if (containsKatakana(entry.hiragana)) {
    katakanaWords.push(entry);
  } else {
    hiraganaWords.push(entry);
  }
}

// Save the results
fs.writeFileSync('katakana_words.json', JSON.stringify({ vocabulary: katakanaWords }, null, 2), 'utf-8');
fs.writeFileSync('hiragana_words.json', JSON.stringify({ vocabulary: hiraganaWords }, null, 2), 'utf-8');

console.log(`Done! Katakana words: ${katakanaWords.length}, Hiragana words: ${hiraganaWords.length}`);