import type { Word } from '../types/kana';


export const hiraganaToRomaji: Record<string, string> = {
  // Hiragana
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o',
  か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya', ゆ: 'yu', よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  わ: 'wa', を: 'wo',
  ん: 'n',

  // Hiragana with dakuten
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',

  // Small hiragana
  ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o',
  ゃ: 'ya', ゅ: 'yu', ょ: 'yo'
};

export const longSyllablesHiraganaMap: Record<string, { hepburn: string; double: string }> = {
  きゃ: { hepburn: 'kya', double: 'kya' },
  きゅ: { hepburn: 'kyu', double: 'kyu' },
  きょ: { hepburn: 'kyo', double: 'kyo' },

  しゃ: { hepburn: 'sha', double: 'sha' },
  しゅ: { hepburn: 'shu', double: 'shu' },
  しょ: { hepburn: 'sho', double: 'sho' },

  ちゃ: { hepburn: 'cha', double: 'cha' },
  ちゅ: { hepburn: 'chu', double: 'chu' },
  ちょ: { hepburn: 'cho', double: 'cho' },

  にゃ: { hepburn: 'nya', double: 'nya' },
  にゅ: { hepburn: 'nyu', double: 'nyu' },
  にょ: { hepburn: 'nyo', double: 'nyo' },

  ひゃ: { hepburn: 'hya', double: 'hya' },
  ひゅ: { hepburn: 'hyu', double: 'hyu' },
  ひょ: { hepburn: 'hyo', double: 'hyo' },

  みゃ: { hepburn: 'mya', double: 'mya' },
  みゅ: { hepburn: 'myu', double: 'myu' },
  みょ: { hepburn: 'myo', double: 'myo' },

  りゃ: { hepburn: 'rya', double: 'rya' },
  りゅ: { hepburn: 'ryu', double: 'ryu' },
  りょ: { hepburn: 'ryo', double: 'ryo' },

  ぎゃ: { hepburn: 'gya', double: 'gya' },
  ぎゅ: { hepburn: 'gyu', double: 'gyu' },
  ぎょ: { hepburn: 'gyo', double: 'gyo' },

  じゃ: { hepburn: 'ja', double: 'ja' },
  じゅ: { hepburn: 'ju', double: 'ju' },
  じょ: { hepburn: 'jo', double: 'jo' },

  びゃ: { hepburn: 'bya', double: 'bya' },
  びゅ: { hepburn: 'byu', double: 'byu' },
  びょ: { hepburn: 'byo', double: 'byo' },

  ぴゃ: { hepburn: 'pya', double: 'pya' },
  ぴゅ: { hepburn: 'pyu', double: 'pyu' },
  ぴょ: { hepburn: 'pyo', double: 'pyo' },

  きゃう: { hepburn: 'kyau', double: 'kyau' },
  きょう: { hepburn: 'kyō', double: 'kyou' },
  ぎょう: { hepburn: 'gyō', double: 'gyou' },
  しゅう: { hepburn: 'shū', double: 'shuu' },
  じゅう: { hepburn: 'jū', double: 'juu' },
  ちょう: { hepburn: 'chō', double: 'chou' },
  じょう: { hepburn: 'jō', double: 'jou' },
  にょう: { hepburn: 'nyō', double: 'nyou' },
  ひょう: { hepburn: 'hyō', double: 'hyou' },
  びょう: { hepburn: 'byō', double: 'byou' },
  ぴょう: { hepburn: 'pyō', double: 'pyou' },
  みょう: { hepburn: 'myō', double: 'myou' },
  りょう: { hepburn: 'ryō', double: 'ryou' },
  しょう: { hepburn: "shō", double: "shou" },

  あい: { hepburn: 'ai', double: 'ai' },
  えい: { hepburn: 'ē', double: 'ei' },
  せい: { hepburn: 'sē', double: 'sei' },
  ぜい: { hepburn: 'zē', double: 'zei' },
  けい: { hepburn: 'kē', double: 'kei' },
  げい: { hepburn: 'gē', double: 'gei' },
  てい: { hepburn: 'tē', double: 'tei' },
  でい: { hepburn: 'dē', double: 'dei' },
  ねい: { hepburn: 'nē', double: 'nei' },
  れい: { hepburn: 'rē', double: 'rei' },

  いい: { hepburn: 'ī', double: 'ii' },
  ちい: { hepburn: 'chī', double: 'chii' },
  すう: { hepburn: 'sū', double: 'suu' },
  くう: { hepburn: 'kū', double: 'kuu' },
  ぐう: { hepburn: 'gū', double: 'guu' },

  // Long vowels with う and ー (including voiced and p-sounds)
  あー: { hepburn: 'ā', double: 'aa' },
  いー: { hepburn: 'ī', double: 'ii' },
  うー: { hepburn: 'ū', double: 'uu' },
  えー: { hepburn: 'ē', double: 'ee' },
  おー: { hepburn: 'ō', double: 'oo' },

  がー: { hepburn: 'gā', double: 'gaa' },
  ぎー: { hepburn: 'gī', double: 'gii' },
  ぐー: { hepburn: 'gū', double: 'guu' },
  げー: { hepburn: 'gē', double: 'gee' },
  ごー: { hepburn: 'gō', double: 'goo' },

  ざー: { hepburn: 'zā', double: 'zaa' },
  じー: { hepburn: 'jī', double: 'jii' },
  ずー: { hepburn: 'zū', double: 'zuu' },
  ぜー: { hepburn: 'zē', double: 'zee' },
  ぞー: { hepburn: 'zō', double: 'zoo' },

  だー: { hepburn: 'dā', double: 'daa' },
  ぢー: { hepburn: 'jī', double: 'jii' },
  づー: { hepburn: 'zū', double: 'zuu' },
  でー: { hepburn: 'dē', double: 'dee' },
  どー: { hepburn: 'dō', double: 'doo' },

  ばー: { hepburn: 'bā', double: 'baa' },
  びー: { hepburn: 'bī', double: 'bii' },
  ぶー: { hepburn: 'bū', double: 'buu' },
  べー: { hepburn: 'bē', double: 'bee' },
  ぼー: { hepburn: 'bō', double: 'boo' },

  ぱー: { hepburn: 'pā', double: 'paa' },
  ぴー: { hepburn: 'pī', double: 'pii' },
  ぷー: { hepburn: 'pū', double: 'puu' },
  ぺー: { hepburn: 'pē', double: 'pee' },
  ぽー: { hepburn: 'pō', double: 'poo' },

  おう: { hepburn: 'ō', double: 'ou' },
  こう: { hepburn: 'kō', double: 'kou' },
  そう: { hepburn: 'sō', double: 'sou' },
  とう: { hepburn: 'tō', double: 'tou' },
  のう: { hepburn: 'nō', double: 'nou' },
  ほう: { hepburn: 'hō', double: 'hou' },
  もう: { hepburn: 'mō', double: 'mou' },
  ろう: { hepburn: 'rō', double: 'rou' },
  よう: { hepburn: 'yō', double: 'you' },
  わう: { hepburn: 'wō', double: 'wou' },
  ぞう: { hepburn: 'zō', double: 'zou' },
  ざあ: { hepburn: 'zā', double: 'zaa' },
  ざい: { hepburn: 'zai', double: 'zai' },
  ざう: { hepburn: 'zō', double: 'zou' },
  ざえ: { hepburn: 'zae', double: 'zae' },
  ざお: { hepburn: 'zao', double: 'zao' },

  じい: { hepburn: 'jī', double: 'jii' },

  ずう: { hepburn: 'zū', double: 'zuu' },
  ぜえ: { hepburn: 'zē', double: 'zee' },

  きい: { hepburn: 'kī', double: 'kii' },
  しい: { hepburn: 'shī', double: 'shii' },
  にい: { hepburn: 'nī', double: 'nii' },
  ひい: { hepburn: 'hī', double: 'hii' },
  みい: { hepburn: 'mī', double: 'mii' },
  りい: { hepburn: 'rī', double: 'rii' },
  びい: { hepburn: 'bī', double: 'bii' },
  ぴい: { hepburn: 'pī', double: 'pii' },

  // Some loanword and extended combos (rare but useful)
  ふぃー: { hepburn: 'fī', double: 'fii' },
  てぃー: { hepburn: 'tī', double: 'tii' },
  でぃー: { hepburn: 'dī', double: 'dii' },
  てゅ: { hepburn: 'tyu', double: 'tyu' },
  でゅ: { hepburn: 'dyu', double: 'dyu' },

};

export const katakanaToRomaji: Record<string, string> = {
  // Katakana
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

  // Katakana with dakuten
  ガ: 'ga', ギ: 'gi', グ: 'gu', ゲ: 'ge', ゴ: 'go',
  ザ: 'za', ジ: 'ji', ズ: 'zu', ゼ: 'ze', ゾ: 'zo',
  ダ: 'da', ヂ: 'ji', ヅ: 'zu', デ: 'de', ド: 'do',
  バ: 'ba', ビ: 'bi', ブ: 'bu', ベ: 'be', ボ: 'bo',
  パ: 'pa', ピ: 'pi', プ: 'pu', ペ: 'pe', ポ: 'po',

  // Small katakana
  ァ: 'a', ィ: 'i', ゥ: 'u', ェ: 'e', ォ: 'o',
  ャ: 'ya', ュ: 'yu', ョ: 'yo', ッ: 'tsu',
};

export const longSyllablesKatakanaMap: Record<string, { hepburn: string; double: string }> = {
  // yōon (palatalized combos)
  キャ: { hepburn: 'kya', double: 'kya' },
  キュ: { hepburn: 'kyu', double: 'kyu' },
  キョ: { hepburn: 'kyo', double: 'kyo' },

  ギャ: { hepburn: 'gya', double: 'gya' },
  ギュ: { hepburn: 'gyu', double: 'gyu' },
  ギョ: { hepburn: 'gyo', double: 'gyo' },

  シャ: { hepburn: 'sha', double: 'sha' },
  シュ: { hepburn: 'shu', double: 'shu' },
  ショ: { hepburn: 'sho', double: 'sho' },

  ジャ: { hepburn: 'ja', double: 'ja' },
  ジュ: { hepburn: 'ju', double: 'ju' },
  ジョ: { hepburn: 'jo', double: 'jo' },

  チャ: { hepburn: 'cha', double: 'cha' },
  チュ: { hepburn: 'chu', double: 'chu' },
  チョ: { hepburn: 'cho', double: 'cho' },

  ニャ: { hepburn: 'nya', double: 'nya' },
  ニュ: { hepburn: 'nyu', double: 'nyu' },
  ニョ: { hepburn: 'nyo', double: 'nyo' },

  ヒャ: { hepburn: 'hya', double: 'hya' },
  ヒュ: { hepburn: 'hyu', double: 'hyu' },
  ヒョ: { hepburn: 'hyo', double: 'hyo' },

  ビャ: { hepburn: 'bya', double: 'bya' },
  ビュ: { hepburn: 'byu', double: 'byu' },
  ビョ: { hepburn: 'byo', double: 'byo' },

  ピャ: { hepburn: 'pya', double: 'pya' },
  ピュ: { hepburn: 'pyu', double: 'pyu' },
  ピョ: { hepburn: 'pyo', double: 'pyo' },

  ミャ: { hepburn: 'mya', double: 'mya' },
  ミュ: { hepburn: 'myu', double: 'myu' },
  ミョ: { hepburn: 'myo', double: 'myo' },

  リャ: { hepburn: 'rya', double: 'rya' },
  リュ: { hepburn: 'ryu', double: 'ryu' },
  リョ: { hepburn: 'ryo', double: 'ryo' },

  // Long vowels spelled with う instead of ー (common in native words)
  アイ: { hepburn: 'ai', double: 'ai' },
  エイ: { hepburn: 'ē', double: 'ei' },
  セイ: { hepburn: 'sē', double: 'sei' },
  ゼイ: { hepburn: 'zē', double: 'zei' },
  ケイ: { hepburn: 'kē', double: 'kei' },
  ゲイ: { hepburn: 'gē', double: 'gei' },
  テイ: { hepburn: 'tē', double: 'tei' },
  デイ: { hepburn: 'dē', double: 'dei' },
  ネイ: { hepburn: 'nē', double: 'nei' },
  レイ: { hepburn: 'rē', double: 'rei' },

  オウ: { hepburn: 'ō', double: 'ou' },
  コウ: { hepburn: 'kō', double: 'kou' },
  ソウ: { hepburn: 'sō', double: 'sou' },
  トウ: { hepburn: 'tō', double: 'tou' },
  ノウ: { hepburn: 'nō', double: 'nou' },
  ホウ: { hepburn: 'hō', double: 'hou' },
  モウ: { hepburn: 'mō', double: 'mou' },
  ロウ: { hepburn: 'rō', double: 'rou' },
  ヨウ: { hepburn: 'yō', double: 'you' },
  ワウ: { hepburn: 'wō', double: 'wou' },

  キイ: { hepburn: 'kī', double: 'kii' },
  シイ: { hepburn: 'shī', double: 'shii' },
  ニイ: { hepburn: 'nī', double: 'nii' },
  ヒイ: { hepburn: 'hī', double: 'hii' },
  ミイ: { hepburn: 'mī', double: 'mii' },
  リイ: { hepburn: 'rī', double: 'rii' },
  ビイ: { hepburn: 'bī', double: 'bii' },
  ピイ: { hepburn: 'pī', double: 'pii' },

  // Common yōon with long vowels
  キャウ: { hepburn: 'kyau', double: 'kyau' },
  キョウ: { hepburn: 'kyō', double: 'kyou' },
  ギョウ: { hepburn: 'gyō', double: 'gyou' },
  シュウ: { hepburn: 'shū', double: 'shuu' },
  ジュウ: { hepburn: 'jū', double: 'juu' },
  チョウ: { hepburn: 'chō', double: 'chou' },
  ジョウ: { hepburn: 'jō', double: 'jou' },
  ニョウ: { hepburn: 'nyō', double: 'nyou' },
  ヒョウ: { hepburn: 'hyō', double: 'hyou' },
  ビョウ: { hepburn: 'byō', double: 'byou' },
  ピョウ: { hepburn: 'pyō', double: 'pyou' },
  ミョウ: { hepburn: 'myō', double: 'myou' },
  リョウ: { hepburn: 'ryō', double: 'ryou' },
  ショウ: { hepburn: 'shō', double: 'shou' },
  ゾウ: { hepburn: 'zō', double: 'zou' },
  ザイ: { hepburn: 'zai', double: 'zai' },
  ザウ: { hepburn: 'zō', double: 'zou' },
  ザエ: { hepburn: 'zae', double: 'zae' },
  ザオ: { hepburn: 'zao', double: 'zao' },

  // Some loanword and extended combos
  フィー: { hepburn: 'fī', double: 'fii' },
  ティー: { hepburn: 'tī', double: 'tii' },
  ディー: { hepburn: 'dī', double: 'dii' },
  ヴィー: { hepburn: 'vī', double: 'vii' },
  ウィー: { hepburn: 'wī', double: 'wii' },

  シェー: { hepburn: 'shē', double: 'shee' },
  ジェー: { hepburn: 'jē', double: 'jee' },
  チェー: { hepburn: 'chē', double: 'chee' },

  アイー: { hepburn: 'aī', double: 'aii' },
  オーイ: { hepburn: 'ōi', double: 'ooi' },

  イイ: { hepburn: 'ī', double: 'ii' },
  チイ: { hepburn: 'chī', double: 'chii' },
  スウ: { hepburn: 'sū', double: 'suu' },
  クウ: { hepburn: 'kū', double: 'kuu' },
  グウ: { hepburn: 'gū', double: 'guu' },

  キャー: { hepburn: "kyā", double: "kyaa" },
  キュー: { hepburn: "kyū", double: "kyuu" },
  キョー: { hepburn: "kyō", double: "kyou" },

  ギャー: { hepburn: "gyā", double: "gyaa" },
  ギュー: { hepburn: "gyū", double: "gyuu" },
  ギョー: { hepburn: "gyō", double: "gyou" },

  シャー: { hepburn: "shā", double: "shaa" },
  シュー: { hepburn: "shū", double: "shuu" },
  ショー: { hepburn: "shō", double: "shou" },

  チャー: { hepburn: "chā", double: "chaa" },
  チュー: { hepburn: "chū", double: "chuu" },
  チョー: { hepburn: "chō", double: "chou" },

  セー: { hepburn: "sē", double: "see" },
  ケー: { hepburn: "kē", double: "kee" },
  テー: { hepburn: "tē", double: "tee" },
  ネー: { hepburn: "nē", double: "nee" },

  アー: { hepburn: 'ā', double: 'aa' },
  イー: { hepburn: 'ī', double: 'ii' },
  ウー: { hepburn: 'ū', double: 'uu' },
  エー: { hepburn: 'ē', double: 'ee' },
  オー: { hepburn: 'ō', double: 'oo' },

  ガー: { hepburn: 'gā', double: 'gaa' },
  ギー: { hepburn: 'gī', double: 'gii' },
  グー: { hepburn: 'gū', double: 'guu' },
  ゲー: { hepburn: 'gē', double: 'gee' },
  ゴー: { hepburn: 'gō', double: 'goo' },

  ザー: { hepburn: 'zā', double: 'zaa' },
  ジー: { hepburn: 'jī', double: 'jii' },
  ズー: { hepburn: 'zū', double: 'zuu' },
  ゼー: { hepburn: 'zē', double: 'zee' },
  ゾー: { hepburn: 'zō', double: 'zoo' },

  ラー: { hepburn: 'rā', double: 'raa' },
  リー: { hepburn: 'rī', double: 'rii' },
  ルー: { hepburn: 'rū', double: 'ruu' },
  レー: { hepburn: 'rē', double: 'ree' },
  ロー: { hepburn: 'rō', double: 'roo' },

  ダー: { hepburn: 'dā', double: 'daa' },
  ヂー: { hepburn: 'jī', double: 'jii' },
  ヅー: { hepburn: 'zū', double: 'zuu' },
  デー: { hepburn: 'dē', double: 'dee' },
  ドー: { hepburn: 'dō', double: 'doo' },

  バー: { hepburn: 'bā', double: 'baa' },
  ビー: { hepburn: 'bī', double: 'bii' },
  ブー: { hepburn: 'bū', double: 'buu' },
  ベー: { hepburn: 'bē', double: 'bee' },
  ボー: { hepburn: 'bō', double: 'boo' },

  パー: { hepburn: 'pā', double: 'paa' },
  ピー: { hepburn: 'pī', double: 'pii' },
  プー: { hepburn: 'pū', double: 'puu' },
  ペー: { hepburn: 'pē', double: 'pee' },
  ポー: { hepburn: 'pō', double: 'poo' },

  ミャー: { hepburn: "myā", double: "myaa" },
  ミュー: { hepburn: "myū", double: "myuu" },
  ミョー: { hepburn: "myō", double: "myou" },

  ヂャ: { hepburn: "ja", double: "ja" },
  ヂュ: { hepburn: "ju", double: "ju" },
  ヂョ: { hepburn: "jo", double: "jo" },

  シィ: { hepburn: "shī", double: "shii" },
  ジィ: { hepburn: "jī", double: "jii" },
  チェ: { hepburn: "che", double: "che" },
  ティ: { hepburn: "ti", double: "ti" },
  ディ: { hepburn: "di", double: "di" },
  ツァ: { hepburn: "tsa", double: "tsa" },
  ツィ: { hepburn: "tsi", double: "tsi" },
  ツェ: { hepburn: "tse", double: "tse" },
  ツォ: { hepburn: "tso", double: "tso" },

  ヴァ: { hepburn: "va", double: "va" },
  ヴィ: { hepburn: "vi", double: "vi" },
  ヴェ: { hepburn: "ve", double: "ve" },
  ヴォ: { hepburn: "vo", double: "vo" },
  ヴュ: { hepburn: "vyu", double: "vyu" },

  ファ: { hepburn: "fa", double: "fa" },
  フィ: { hepburn: "fi", double: "fi" },
  フェ: { hepburn: "fe", double: "fe" },
  フォ: { hepburn: "fo", double: "fo" },
  フュ: { hepburn: "fyu", double: "fyu" },

  クァ: { hepburn: "kwa", double: "kwa" },
  クィ: { hepburn: "kwi", double: "kwi" },
  クェ: { hepburn: "kwe", double: "kwe" },
  クォ: { hepburn: "kwo", double: "kwo" },

  グァ: { hepburn: "gwa", double: "gwa" },
  グィ: { hepburn: "gwi", double: "gwi" },
  グェ: { hepburn: "gwe", double: "gwe" },
  グォ: { hepburn: "gwo", double: "gwo" },

  シェ: { hepburn: "she", double: "she" },
  ジェ: { hepburn: "je", double: "je" },
  デュ: { hepburn: "dyu", double: "dyu" },

  トゥ: { hepburn: "tu", double: "tu" },
  ドゥ: { hepburn: "du", double: "du" },

  イェ: { hepburn: "ye", double: "ye" },

  ウィ: { hepburn: "wi", double: "wi" },
  ウェ: { hepburn: "we", double: "we" },
  ウォ: { hepburn: "wo", double: "wo" },
};


export const romajiToHiragana: Record<string, string[]> = {};

// First add normal hiragana mappings (values are strings)
for (const [kana, romaji] of Object.entries(hiraganaToRomaji)) {
  if (!romajiToHiragana[romaji]) {
    romajiToHiragana[romaji] = [];
  }
  romajiToHiragana[romaji].push(kana);
}

// Now add long syllables (values are objects with hepburn and double)
for (const [kana, romajiObj] of Object.entries(longSyllablesHiraganaMap)) {
  // Add hepburn notation
  if (!romajiToHiragana[romajiObj.hepburn]) {
    romajiToHiragana[romajiObj.hepburn] = [];
  }
  romajiToHiragana[romajiObj.hepburn].push(kana);

  // Add double vowel notation
  if (!romajiToHiragana[romajiObj.double]) {
    romajiToHiragana[romajiObj.double] = [];
  }
  romajiToHiragana[romajiObj.double].push(kana);
};


export const romajiToKatakana: Record<string, string[]> = {};

// Normal katakana mappings
for (const [kana, romaji] of Object.entries(katakanaToRomaji)) {
  if (!romajiToKatakana[romaji]) {
    romajiToKatakana[romaji] = [];
  }
  romajiToKatakana[romaji].push(kana);
}

// Add katakana long syllables map entries
for (const [kana, romajiObj] of Object.entries(longSyllablesKatakanaMap)) {
  if (!romajiToKatakana[romajiObj.hepburn]) {
    romajiToKatakana[romajiObj.hepburn] = [];
  }
  romajiToKatakana[romajiObj.hepburn].push(kana);

  if (!romajiToKatakana[romajiObj.double]) {
    romajiToKatakana[romajiObj.double] = [];
  }
  romajiToKatakana[romajiObj.double].push(kana);
};

function getLeadingConsonant(romaji: string): string {
  if (!romaji) return '';
  const match = romaji.match(/^([bcdfghjklmnpqrstvwxyz])/i);
  return match ? match[1].toLowerCase() : '';
}

export function hiraganaToRomajiVariants(hiragana: string): { hepburn: string; double: string, hepburnArray: string[], doubleArray: string[] } {
  let hepburnResult = '';
  let doubleResult = '';
  const hepburnArray: string[] = [];
  const doubleArray: string[] = [];

  let i = 0;
  while (i < hiragana.length) {
    let matched = false;

    // Handle small っ (sokuon)
    if (hiragana[i] === 'っ') {
      // Peek ahead to next syllable to duplicate the initial consonant
      let consonant = '';
      let found = false;

      // Check long syllables first (3 kana max)
      for (let len = 3; len > 0; len--) {
        if (i + 1 + len <= hiragana.length) {
          const segment = hiragana.substring(i + 1, i + 1 + len);
          const mapping = longSyllablesHiraganaMap[segment];
          if (mapping) {
            consonant = getLeadingConsonant(mapping.double);
            hepburnResult += consonant + mapping.hepburn;
            doubleResult += consonant + mapping.double;
            hepburnArray.push(consonant + mapping.hepburn);
            doubleArray.push(consonant + mapping.double);
            i += 1 + len;
            found = true;
            break;
          }
        }
      }

      if (!found && i + 1 < hiragana.length) {
        const nextKana = hiragana[i + 1];
        const romaji = hiraganaToRomaji[nextKana];
        if (romaji) {
          consonant = getLeadingConsonant(romaji);
          hepburnResult += consonant + romaji;
          doubleResult += consonant + romaji;
          hepburnArray.push(consonant + romaji);
          doubleArray.push(consonant + romaji);
          i += 2;
          continue;
        }
      }

      if (!found) {
        // Fallback: treat っ as unknown
        hepburnResult += 'っ';
        doubleResult += 'っ';
        hepburnArray.push('っ');
        doubleArray.push('っ');
        i++;
      }

      continue;
    }

    // Try long syllables
    for (let len = 3; len > 0; len--) {
      if (i + len <= hiragana.length) {
        const segment = hiragana.substring(i, i + len);
        const longSyllable = longSyllablesHiraganaMap[segment];
        if (longSyllable) {
          hepburnResult += longSyllable.hepburn;
          doubleResult += longSyllable.double;
          hepburnArray.push(longSyllable.hepburn);
          doubleArray.push(longSyllable.double);
          i += len;
          matched = true;
          break;
        }
      }
    }

    if (matched) continue;

    const kana = hiragana[i];
    const romaji = hiraganaToRomaji[kana];
    if (!romaji) {
      hepburnResult += kana;
      doubleResult += kana;
      hepburnArray.push(kana);
      doubleArray.push(kana);
    } else {
      hepburnResult += romaji;
      doubleResult += romaji;
      hepburnArray.push(romaji);
      doubleArray.push(romaji);
    }
    i++;
  }

  return { hepburn: hepburnResult, double: doubleResult, hepburnArray: hepburnArray, doubleArray: doubleArray };
}


export function katakanaToRomajiVariants(katakana: string): { hepburn: string; double: string, hepburnArray: string[], doubleArray: string[] } {
  let hepburnResult = '';
  let doubleResult = '';
  const hepburnArray: string[] = [];
  const doubleArray: string[] = [];

  let i = 0;
  while (i < katakana.length) {
    let matched = false;

    // Handle small ッ (sokuon)
    if (katakana[i] === 'ッ') {
      // Peek ahead to next syllable to duplicate the initial consonant
      let consonant = '';
      let found = false;

      // Check long syllables first (3 kana max)
      for (let len = 3; len > 0; len--) {
        if (i + 1 + len <= katakana.length) {
          const segment = katakana.substring(i + 1, i + 1 + len);
          const mapping = longSyllablesKatakanaMap[segment];
          if (mapping) {
            consonant = getLeadingConsonant(mapping.double);
            hepburnResult += consonant + mapping.hepburn;
            doubleResult += consonant + mapping.double;
            hepburnArray.push(consonant + mapping.hepburn);
            doubleArray.push(consonant + mapping.double);
            i += 1 + len;
            found = true;
            break;
          }
        }
      }

      if (!found && i + 1 < katakana.length) {
        const nextKana = katakana[i + 1];
        const romaji = katakanaToRomaji[nextKana];
        if (romaji) {
          consonant = getLeadingConsonant(romaji);
          hepburnResult += consonant + romaji;
          doubleResult += consonant + romaji;
          hepburnArray.push(consonant + romaji);
          doubleArray.push(consonant + romaji);
          i += 2;
          continue;
        }
      }

      if (!found) {
        // Fallback: treat ッ as unknown
        hepburnResult += 'ッ';
        doubleResult += 'ッ';
        hepburnArray.push('ッ');
        doubleArray.push('ッ');
        i++;
      }

      continue;
    }

    // Try long syllables
    for (let len = 3; len > 0; len--) {
      if (i + len <= katakana.length) {
        const segment = katakana.substring(i, i + len);
        const longSyllable = longSyllablesKatakanaMap[segment];
        if (longSyllable) {
          hepburnResult += longSyllable.hepburn;
          doubleResult += longSyllable.double;
          hepburnArray.push(longSyllable.hepburn);
          doubleArray.push(longSyllable.double);
          i += len;
          matched = true;
          break;
        }
      }
    }

    if (matched) continue;

    const kana = katakana[i];
    const romaji = katakanaToRomaji[kana];
    if (!romaji) {
      hepburnResult += kana;
      doubleResult += kana;
      hepburnArray.push(kana);
      doubleArray.push(kana);
    } else {
      hepburnResult += romaji;
      doubleResult += romaji;
      hepburnArray.push(romaji);
      doubleArray.push(romaji);
    }
    i++;
  }

  return { hepburn: hepburnResult, double: doubleResult, hepburnArray: hepburnArray, doubleArray: doubleArray };
}

function isKatakana(text: string): boolean {
  return [...text].every(char => {
    const code = char.charCodeAt(0);
    return code >= 0x30A0 && code <= 0x30FF;
  });
}

export function kanaToRomajiVariants(kana: string): { hepburn: string; double: string, hepburnArray: string[], doubleArray: string[] } {
  if (isKatakana(kana)) {
    return katakanaToRomajiVariants(kana);
  } else {
    return hiraganaToRomajiVariants(kana);
  }
}

export function checkAnswer(input: string, word: Word): boolean {
  const variants = kanaToRomajiVariants(word.kana);

  // Normalize input (lowercase, trim)
  const normalizedInput = input.trim().toLowerCase();

  // Compare input against both variants (also lowercase)
  return (
    normalizedInput === variants.hepburn.toLowerCase() ||
    normalizedInput === variants.double.toLowerCase()
  );
}

export function splitKanaByRomaji(kana: string, romajiParts: string[]): string[] {
  const kanaSyllables: string[] = [];
  let kanaIndex = 0;

  for (const romaji of romajiParts) {
    let chunk = '';

    // Accumulate kana characters until the romaji of the chunk matches the romaji part
    while (kanaIndex < kana.length) {
      chunk += kana[kanaIndex];
      kanaIndex++;

      // Convert current kana chunk to romaji using your own function
      const { hepburn } = kanaToRomajiVariants(chunk);

      // Match against romaji part
      if (hepburn === romaji) {
        kanaSyllables.push(chunk);
        break;
      }

      // Optional guard: break if chunk gets too long (to avoid infinite loop)
      if (chunk.length > 3) {
        console.warn('Could not resolve romaji match for:', romaji);
        break;
      }
    }
  }

  return kanaSyllables;
}